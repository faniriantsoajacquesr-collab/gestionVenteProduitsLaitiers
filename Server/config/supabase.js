import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// ESM imports are hoisted. We must initialize dotenv here to ensure 
// variables are loaded before createClient is executed.
dotenv.config({ path: './config/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);