'use client'
import { ComponentProps, useState } from "react";
import { MultiSelectFields } from "@/app/types";
import { Select, MenuItem } from "@mui/material"; // Assuming you're using Material-UI's Select component

type Props = {
  fields: MultiSelectFields[];
};

type Tag = {

  id?: string | undefined;
  key?: string | undefined;
  label?: string | undefined;
  color?: string | undefined;
  object?: string | undefined;
};

export const MassMessage = ({ fields }: Props) => {
  const [values, setValues] = useState({
    customField: "",
    customFieldLabel: "",
    selectedTag: "",
    selectedTagLabel: "",
  });
  const [tags, setTags] = useState<Tag[]>([]); // State to store the tags
  console.log(tags)

  const [clients, setClients] = useState<[]>([]);

  const handleChangeValues: ComponentProps<typeof Select>["onChange"] = async (
    event
  ) => {
    console.log(event)
    const field = event.target.name;
    const value = event.target.value;
    // Filter fields from props to where e.target.value here matches the field object. Set values.customFieldLabel to fieldObject.name
    const fieldForLabel = fields.filter(field => field.id === event.target.value)[0]

    setValues({
      ...values,
      [field]: value,
      customFieldLabel: fieldForLabel.key
    });
    // Fetch tags when a new customField is selected
    if (field === 'customField' && value) {
      try {
        const response = await fetch('/api/getTagsFromField', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fieldId: value }),
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

  console.log(values)
  const handleTagChange: ComponentProps<typeof Select>["onChange"] = async (event) => {
    const value = event.target.value;
    const tagLabel = tags.filter(tag => tag.id === event.target.value)[0].key
    setValues({
      ...values,
      selectedTag: value,
      selectedTagLabel: tagLabel
    });

    try {
      const response = await fetch('/api/retrieveClientsWithTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fieldLabel: values.customFieldLabel, tagLabel: tagLabel }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`MYDATA: ${data[0].givenName}`)
        setClients(data); 
      } else {
        console.error('Failed to fetch tags:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  console.log(clients)

  return (
    

    <div>
      <h2>MM</h2>
      <Select
        value={values.customField}
        onChange={handleChangeValues}
        name="customField"
        displayEmpty
        renderValue={(selected) => {
          const selectedField = fields.find(
            (field) => field.id === selected
          );
          if (!selected) {
            return <div>Select a custom field</div>;
          }
          return selectedField?.name || "Select a custom field";
        }}
      >
        {fields.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>

      {tags.length > 0 && (
        <div>
          <h3>Select an Available Tag:</h3>
          <Select
            value={values.selectedTag}
            onChange={handleTagChange}
            displayEmpty
            name="selectedTag"
            renderValue={(selected) => {
              const selectedTag = tags.find((tag) => tag.id === selected);
              if (!selected) {
                return <div>Select a tag</div>;
              }
              return selectedTag?.label || "Select a tag";
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
          <h3>Clients with tag:</h3>
          <ul>
      {clients.map((client, index) => (
        <li key={index}>{client.givenName} {client.familyName}</li>
      ))}
    </ul>
        </div>
      )}
    </div>
  );
};
