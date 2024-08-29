import { copilotApi } from 'copilot-node-sdk';
import { need } from '@/utils/need';
import { MultiSelectFields, Client } from '@/app/types';

const apiKey = need<string>(
  process.env.COPILOT_API_KEY
);

export async function getTagsFields () {
  const copilot = copilotApi({
    apiKey: apiKey
  });
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

export async function getTagsFromField(fieldId: string, token: string | undefined) {
  const copilot = copilotApi({
    apiKey: apiKey,
    token: token
  });
  const data: {
    customFieldOptions: Awaited<ReturnType<typeof copilot.listCustomFieldOptions>>;
  } = {
    customFieldOptions: await copilot.listCustomFieldOptions({id: fieldId})
  }

  return data.customFieldOptions
}

export async function retrieveClientsWithTag(fieldLabel: string, tagLabel: string, token: string | undefined) {
  const copilot = copilotApi({
    apiKey: apiKey,
    token: token
  });
  const data: {
    allClients: Awaited<ReturnType<typeof copilot.listClients>>;
  } = {
    allClients: await copilot.listClients({limit: 1000})
  }

  let matchingClients: Array<Client> = []

  const clients = data.allClients.data

  clients?.forEach(client => {
    if (client.customFields[fieldLabel]){
      if (client.customFields[fieldLabel].includes(tagLabel)){
        // console.log('hello')
        matchingClients.push(client)
      }
    }
  })

  // console.log(`matchingClients: ${matchingClients[0].givenName}`)
  return matchingClients
}

export async function sendMessage (clients: Array<Client>,  messageContent: string | undefined, token: string | undefined,) {
  const copilot = copilotApi({
    apiKey: apiKey,
    token: token
  });

    // send clients array from MM component  
  // iterate through client objects
  //for each client ID => find message channel with membershipEntityId
  // push channelIds to array
  //for each channelId, send message (messageContent)
}