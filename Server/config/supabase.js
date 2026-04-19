import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env from the root of the project or the config folder
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'config/.env') });

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in Server/config/.env');
}

if (!supabaseServiceRoleKey) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not set. adminSupabase will use the anon key and may fail due to RLS.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const adminSupabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey ?? supabaseAnonKey
);