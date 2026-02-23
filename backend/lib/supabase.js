import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or Supabase key (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)"
  );
}

/**
 * Supabase client for backend use.
 * Use SUPABASE_SERVICE_ROLE_KEY for admin operations (bypass RLS); use SUPABASE_ANON_KEY for user-scoped access.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
