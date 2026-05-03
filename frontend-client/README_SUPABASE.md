# SigmaPay - Supabase Integration

This document explains the Supabase database integration for SigmaPay's authentication system.

## Overview

The application now supports **Supabase** as the backend database and authentication provider, while maintaining backward compatibility with mock authentication for development.

## Quick Start

### 1. Install Dependencies

Dependencies are already installed. If needed, run:

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file in the `frontend-client` directory:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to **Settings → API**
- Copy the **Project URL** and **anon public** key

### 3. Set Up Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the SQL script from `supabase-setup.sql`

This creates the `user_profiles` table with proper security policies.

### 4. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable the **Email** provider
3. (Optional) Customize email templates in **Authentication → Email Templates**

### 5. Run the Application

```bash
npm start
```

The app will automatically detect Supabase configuration and use it for authentication.

## Architecture

### Authentication Flow

```
User Input (Login/Signup)
    ↓
AuthContext
    ↓
Is Supabase Configured?
    ├─ Yes → Supabase Auth API
    │         ↓
    │    user_profiles table
    │         ↓
    │    Session Management
    │
    └─ No → Mock Auth (localStorage)
```

### Files Structure

```
frontend-client/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx       # Main authentication logic
│   ├── utils/
│   │   └── supabaseClient.ts     # Supabase client configuration
│   └── pages/
│       ├── Login.tsx              # Login page
│       └── Signup.tsx             # Signup page
├── .env.example                   # Environment variables template
├── supabase-setup.sql            # Database setup script
├── SUPABASE_SETUP.md             # Detailed setup guide
└── README_SUPABASE.md            # This file
```

## Features

### Implemented

- ✅ **Email/Password Authentication**: Users can sign up and log in with email and password
- ✅ **User Profiles**: Extended user information stored in custom table
- ✅ **Session Management**: Automatic session handling with Supabase
- ✅ **Security**: Row Level Security (RLS) policies protect user data
- ✅ **Backward Compatibility**: Falls back to mock auth if Supabase not configured

### Database Schema

**Table: `user_profiles`**

| Column        | Type      | Description                    |
|---------------|-----------|--------------------------------|
| id            | UUID      | Primary key, refs auth.users   |
| username      | TEXT      | User's display name            |
| email         | TEXT      | User's email (unique)          |
| phone_number  | TEXT      | User's phone (optional)        |
| created_at    | TIMESTAMP | Account creation time          |
| updated_at    | TIMESTAMP | Last profile update            |

### Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **Password Hashing**: Handled automatically by Supabase Auth
3. **Secure Session Tokens**: JWT-based authentication
4. **HTTPS Only**: All API calls encrypted in transit

## Usage Examples

### Sign Up

```typescript
const { registerUser } = useAuth();

await registerUser({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepassword',
  phoneNumber: '+1234567890'
});
```

### Log In

```typescript
const { loginUser } = useAuth();

await loginUser('john@example.com', 'securepassword');
```

### Log Out

```typescript
const { logoutUser } = useAuth();

await logoutUser();
```

### Check Authentication

```typescript
const { isAuthenticated, user } = useAuth();

if (isAuthenticated()) {
  console.log('User logged in:', user);
}
```

## Environment Variables

| Variable                      | Description                           | Required |
|-------------------------------|---------------------------------------|----------|
| REACT_APP_SUPABASE_URL        | Your Supabase project URL             | Yes*     |
| REACT_APP_SUPABASE_ANON_KEY   | Your Supabase anonymous/public key    | Yes*     |

*Required only if using Supabase. App falls back to mock auth if not configured.

## Testing

### Test with Mock Auth (No Supabase)

Simply don't create a `.env` file. The app will use localStorage-based mock authentication.

### Test with Supabase

1. Configure `.env` with valid credentials
2. Run the app
3. Create a test account
4. Verify in Supabase dashboard:
   - **Authentication → Users** (should show new user)
   - **Table Editor → user_profiles** (should show profile data)

## Troubleshooting

### "Invalid login credentials"

- Verify email and password are correct
- Check if user exists in **Authentication → Users**
- Ensure Email provider is enabled

### "Failed to fetch"

- Verify `REACT_APP_SUPABASE_URL` is correct
- Check network connectivity
- Ensure Supabase project is not paused

### "Row Level Security policy violation"

- Ensure RLS policies are created (run `supabase-setup.sql`)
- Check if user is authenticated
- Verify policies allow the operation

### Profile data not appearing

- Check if `user_profiles` table exists
- Verify the signup process completed successfully
- Look for errors in browser console

## Migration from Mock Auth

Existing users with mock authentication (localStorage) will need to:

1. Create a new account in Supabase
2. Old mock data won't be migrated automatically
3. Consider implementing a data migration script if needed

## Next Steps

Once Supabase is configured, you can:

1. **Add more tables** for budgets, payments, groups, etc.
2. **Implement real-time features** using Supabase Realtime
3. **Add file storage** using Supabase Storage
4. **Set up database functions** for complex operations
5. **Enable social auth** (Google, GitHub, etc.)

## Support

For Supabase-specific issues:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)

For SigmaPay application issues:
- Check the browser console for errors
- Review the setup guide in `SUPABASE_SETUP.md`
- Ensure all SQL migrations ran successfully
