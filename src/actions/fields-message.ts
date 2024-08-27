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

