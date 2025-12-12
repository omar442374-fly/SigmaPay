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

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          total_amount: number;
          spent_amount: number;
          start_date: string;
          end_date: string;
          categories: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          budget_id?: string;
          amount: number;
          category: string;
          description?: string;
          date: string;
          payment_method: string;
          created_at: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          goal_type: string;
          title: string;
          target_amount: number;
          current_amount: number;
          deadline?: string;
          priority_level: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_type: string;
          amount: number;
          recipient?: string;
          merchant_id?: string;
          payment_method?: string;
          status: string;
          description?: string;
          transaction_date: string;
          created_at: string;
        };
      };
      savings_groups: {
        Row: {
          id: string;
          name: string;
          description?: string;
          target_amount?: number;
          current_amount: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          contribution_amount: number;
          joined_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
      };
    };
  };
}
