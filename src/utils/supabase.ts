import { createClient } from '@supabase/supabase-js';
import { env } from '~/env.mjs';

const getSupabaseURL = () => {
  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    return env.NEXT_PUBLIC_SUPABASE_URL;
  }

  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
};

const getSupabaseAnonKey = () => {
  if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
};

// Create Supabase client
export const supabase = createClient(getSupabaseURL(), getSupabaseAnonKey());
