import { Builder } from '@builder.io/react';
import { env } from '~/env.mjs';

const getBuilderApiKey = () => {
  if (env.BUILDERIO_API_KEY) {
    return env.BUILDERIO_API_KEY;
  }

  throw new Error('BUILDERIO_API_KEY is not defined');
};

export const builder = new Builder(getBuilderApiKey());
