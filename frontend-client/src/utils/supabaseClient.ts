import { createClient } from '@supabase/supabase-js';

// Placeholder constants for environment variable defaults
const PLACEHOLDER_URL = 'your-project-url-here';
const PLACEHOLDER_KEY = 'your-anon-key-here';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== PLACEHOLDER_URL && 
         supabaseAnonKey !== PLACEHOLDER_KEY;
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}
