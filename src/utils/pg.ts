import { Pool, Client } from 'pg';
import { env } from '~/env.mjs';

const getDatabaseURL = () => {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  throw new Error('DATABASE_URL is not defined');
};

const pool = new Pool({
  connectionString: getDatabaseURL(),
});

const client = new Client({
  connectionString: getDatabaseURL(),
});

export { pool, client };
