import { Redis } from '@upstash/redis';
import { env } from '~/env.mjs';

const getRedisURL = () => {
  if (env.UPSTASH_REDIS_REST_URL) {
    return env.UPSTASH_REDIS_REST_URL;
  }

  throw new Error('UPSTASH_REDIS_REST_URL is not defined');
};

const getRedisToken = () => {
  if (env.UPSTASH_REDIS_REST_TOKEN) {
    return env.UPSTASH_REDIS_REST_TOKEN;
  }

  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
};

export const redis = new Redis({ url: getRedisURL(), token: getRedisToken() });
