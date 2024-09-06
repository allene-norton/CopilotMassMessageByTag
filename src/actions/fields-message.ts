import { copilotApi } from 'copilot-node-sdk';
import { need } from '@/utils/need';
import { MultiSelectFields, Client, MessageChannelData } from '@/app/types';

const apiKey = need<string>(
  process.env.COPILOT_API_KEY
);

export async function getTagsFields (token: string | undefined) { 
  const copilot = copilotApi({
    apiKey: apiKey,
    token: token
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

export async function sendMessage(clients: Array<Client>, messageContent: string, token: string | undefined) {
  const copilot = copilotApi({
    apiKey: apiKey,
    token: token,
  });

  const messageChannels: Array<MessageChannelData> = [];

  // get messageChannels for clients from ID
  for (const client of clients) {
    try {
      const clientChannelData = await copilot.listMessageChannels({ membershipEntityId: client.id });
      if (clientChannelData.data && clientChannelData.data.length > 0) {
        const clientChannel = clientChannelData.data[0];
        messageChannels.push(clientChannel);
      } else {
        console.warn(`No message channels found for client with id: ${client.id}`);
      }
    } catch (error) {
      console.error(`Failed to fetch message channels for client with id: ${client.id}`, error);
    }
  }

  console.log({ messageChannels: messageChannels });

  for (const channel of messageChannels) {
    try {
      if (channel.id){
      const sendMassMessage = await copilot.sendMessage({requestBody: {text: messageContent, channelId: channel.id}})}
    } catch (error) {
      console.error(`Failed to send message`, error);
    }
  }


  return "function hit";
}


/*{
    id?: string | undefined;
    object?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    membershipType?: string | undefined;
    membershipEntityId?: string | undefined;
    memberIds?: string[] | undefined;
    lastMessageDate?: any;
}[] | undefined */