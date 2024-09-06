'use client';
import { ComponentProps, useState } from 'react';
import { useSearchParams, redirect } from 'next/navigation';
import { MultiSelectFields, ValuesType, Client } from '@/app/types';
import { MenuItem, Select, TextField, Button } from '@mui/material';
import { ariaHidden } from '@mui/material/Modal/ModalManager';
// import { Select } from "@/components/Select";

type Props = {
  fields: MultiSelectFields[];
  portalUrl: string | undefined;
};

type Tag = {
  id?: string | undefined;
  key?: string | undefined;
  label?: string | undefined;
  color?: string | undefined;
  object?: string | undefined;
};

export const MassMessage = ({ fields, portalUrl }: Props) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? undefined;
  const messagesUrl: string | undefined = portalUrl
  const [values, setValues] = useState<ValuesType>({
    customField: '',
    customFieldLabel: '',
    selectedTag: '',
    selectedTagLabel: '',
  });
  const [tags, setTags] = useState<Tag[]>([]); // State to store the tags

  const [clients, setClients] = useState<Client[]>([]);

  const [message, setMessage] = useState<string>('');

  const handleChangeValues: ComponentProps<typeof Select>['onChange'] = async (
    event,
  ) => {
    // console.log(event)
    const field = event.target.name;
    const value = event.target.value;
    // Filter fields from props to where e.target.value here matches the field object. Set values.customFieldLabel to fieldObject.name
    const fieldForLabel = fields.filter(
      (field) => field.id === event.target.value,
    )[0];

    setValues({
      ...values,
      [field]: value,
      customFieldLabel: fieldForLabel.key,
    });
    // Fetch tags when a new customField is selected
    if (field === 'customField' && value) {
      try {
        const response = await fetch('/api/getTagsFromField', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fieldId: value, token: token }),
        });

        if (response.ok) {
          const data = await response.json();
          setTags(data.data); // Update state with fetched tags
        } else {
          console.error('Failed to fetch tags:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
  };

  // console.log(values)
  const handleTagChange: ComponentProps<typeof Select>['onChange'] = async (
    event,
  ) => {
    const value = event.target.value;
    const tagLabel = tags.filter((tag) => tag.id === event.target.value)[0].key;

    if (typeof value === 'string' || value === undefined) {
      setValues({
        ...values,
        selectedTag: value,
        selectedTagLabel: tagLabel,
      });
    }

    try {
      const response = await fetch('/api/retrieveClientsWithTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldLabel: values.customFieldLabel,
          tagLabel: tagLabel,
          token: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(`MYDATA: ${data[0].givenName}`)
        setClients(data);
      } else {
        console.error('Failed to fetch tags:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // console.log(clients)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = async () => {
    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clients: clients,
          messageContent: message,
          token: token,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('SUCCESS');
        const alertMessage: string = 'Message(s) sent successfully.';
        alert(alertMessage);
        setMessage('');
      } else {
        console.error('Failed to fetch send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Select the tags field:</h3>
      <Select
        value={values.customField}
        onChange={handleChangeValues}
        name="customField"
        displayEmpty
        inputProps={{ 'aria-hidden': 'false' }}
        renderValue={(selected) => {
          const selectedField = fields.find((field) => field.id === selected);
          if (!selected) {
            return <div>Select a custom field</div>;
          }
          return selectedField?.name || 'Select a custom field';
        }}
      >
        {fields.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      <br />
      <br />

      {tags.length > 0 && (
        <div>
          <h3>Select an Available Tag:</h3>
          <Select
            value={values.selectedTag}
            onChange={handleTagChange}
            displayEmpty
            name="selectedTag"
            inputProps={{ 'aria-hidden': 'false' }}
            renderValue={(selected) => {
              const selectedTag = tags.find((tag) => tag.id === selected);
              if (!selected) {
                return <div>Select a tag</div>;
              }
              return selectedTag?.label || 'Select a tag';
            }}
          >
            {tags.map((tag: Tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}

      {clients.length > 0 && (
        <div>
          <br />
          <br />
          <div>
            <h3>Message Content:</h3>
            <TextField
              id="outlined-multiline-flexible"
              label="Enter message content"
              multiline
              fullWidth={true}
              maxRows={50}
              value={message}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <br />
          <div className="flex space-x-4">
            <Button variant="outlined" onClick={handleSubmitMessage}>
              Send Mass Message
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                window.parent.postMessage({
                  type: 'history.push',
                  route: 'messages'
                }, `https://dashboard.copilot.com`);
              }}
            >
              Go to Messages
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
