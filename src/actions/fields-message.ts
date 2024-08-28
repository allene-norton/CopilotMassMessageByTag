import { copilotApi } from 'copilot-node-sdk';
import { need } from '@/utils/need';
import { MultiSelectFields } from '@/app/types';

const apiKey = need<string>(
  process.env.COPILOT_API_KEY
);

const copilot = copilotApi({
  apiKey: apiKey
});

export async function getTagsFields () {
  const data: {
    customFields: Awaited<ReturnType<typeof copilot.listCustomFields>>;
  } = {
    customFields: await copilot.listCustomFields(),
  };

  let multiSelectFields: Array<MultiSelectFields> = []

  const allFields = data.customFields.data

  allFields?.forEach(field => {
    if (field.type === 'multiSelect') {
      multiSelectFields.push(field)
    }
  })
  
  return multiSelectFields
}

export async function getTagsFromField(fieldId: string) {
  const data: {
    customFieldOptions: Awaited<ReturnType<typeof copilot.listCustomFieldOptions>>;
  } = {
    customFieldOptions: await copilot.listCustomFieldOptions({id: fieldId})
  }

  return data.customFieldOptions
}

export async function retrieveClientsWithTag(fieldLabel: string, tagId: string) {
  const data: {
    allClients: Awaited<ReturnType<typeof copilot.listClients>>;
  } = {
    allClients: await copilot.listClients({limit: 1000})
  }

  let matchingClients: any = []

  const clients = data.allClients.data

  clients?.forEach(client => {
    // console.log(client)
    if (client.customFields[fieldLabel]){
      console.log(client)
      if (client.customFields[fieldLabel].id === tagId){
        matchingClients.push(client)
      }
    }
  })

  console.log(matchingClients)
  return matchingClients
}