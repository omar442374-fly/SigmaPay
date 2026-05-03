# Supabase Setup Guide for SigmaPay

## Prerequisites
- Supabase account and project created
- Database name: omar442374-sigmaPay

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings → API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (safe to use in frontend)

### 2. Configure Environment Variables

1. Create a `.env` file in the `frontend-client` directory
2. Add your credentials (use `.env.example` as template):

```env
REACT_APP_SUPABASE_URL=your-project-url-here
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Tables

Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the SQL from `supabase-setup.sql`
4. Run the query

### 4. Enable Authentication

1. Go to **Authentication → Providers** in Supabase dashboard
2. Enable **Email** provider
3. Configure email templates if needed

### 5. Test the Integration

1. Start the application: `npm start`
2. Try creating a new account
3. Login with the created account
4. Verify data is stored in Supabase

## Database Schema

The setup creates the following table:

- **user_profiles**: Stores additional user information
  - `id` (UUID, references auth.users)
  - `username` (text)
  - `email` (text)
  - `phone_number` (text, optional)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

## Features

- ✅ Email/Password authentication via Supabase Auth
- ✅ User profile storage in custom table
- ✅ Automatic session management
- ✅ Secure password handling
- ✅ Fallback to mock auth if Supabase not configured

## Troubleshooting

### Authentication errors
- Check that Email provider is enabled in Supabase
- Verify your environment variables are correct
- Check browser console for detailed error messages

### Database errors
- Ensure the SQL migration ran successfully
- Check Row Level Security (RLS) policies are in place
- Verify your anon key has correct permissions

### Connection issues
- Confirm Project URL is correct
- Check that anon key is from the correct project
- Ensure no typos in environment variables
