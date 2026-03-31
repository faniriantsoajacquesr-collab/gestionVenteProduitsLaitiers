import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env from the root of the project or the config folder
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'config/.env') });

export const supabaseUrl = process.env.VITE_SUPABASE_URL;
export const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);