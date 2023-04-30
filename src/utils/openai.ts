import { Configuration, OpenAIApi } from 'openai';
import { env } from '~/env.mjs';

const getOpenaiApiKey = () => {
  if (env.OPENAI_API_KEY) {
    return env.OPENAI_API_KEY;
  }

  throw new Error('OPENAI_API_KEY is not defined');
};

const getOpenaiOrganizationId = () => {
  if (env.OPENAI_ORGANIZATION_ID) {
    return env.OPENAI_ORGANIZATION_ID;
  }

  throw new Error('OPENAI_ORGANIZATION_ID is not defined');
};

const configuration = new Configuration({
  organization: getOpenaiOrganizationId(),
  apiKey: getOpenaiApiKey(),
});

export const openai = new OpenAIApi(configuration);
