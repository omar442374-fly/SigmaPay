# SigmaPay

This software solution helps individuals manage their personal finances by making a customized monthly plan, providing financial tools, and following up with user spending to save money or reduce spending. It includes E-Statements, analysis, E-wallets, and online banking functions.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/omar442374-fly/SigmaPay.git
   cd SigmaPay
   ```

2. **Configure Environment Variables**
   
   The `.env` file has been created in `frontend-client/.env` with the correct Supabase credentials:
   - Project URL: `https://pptfhnzffcqlrjimvmot.supabase.co`
   - Anon Key: Configured and ready

3. **Set Up Database Tables**
   
   **IMPORTANT:** Before running the app, you must create the database tables:
   
   a. Verify the SQL setup file exists: `frontend-client/supabase-setup.sql`
   b. Go to [Supabase Dashboard](https://app.supabase.com)
   c. Open your project
   d. Navigate to **SQL Editor** (left sidebar)
   e. Click **New Query**
   f. Copy the entire content from `frontend-client/supabase-setup.sql`
   g. Paste in the SQL editor
   h. Click **Run** to execute

   This will create all necessary tables:
   - user_profiles
   - budgets
   - expenses
   - goals
   - transactions
   - savings_groups
   - group_members
   - notifications

4. **Install Dependencies**
   ```bash
   cd frontend-client
   npm install
   ```

5. **Start the Application**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

### Testing Registration

1. Open the app in your browser
2. Click **Sign Up**
3. Fill in the registration form:
   - Username
   - Email
   - Phone Number
   - Password (min 6 characters)
4. Submit the form
5. You should be redirected to the dashboard

### Troubleshooting

**Registration not working?**
- Ensure you ran the SQL setup script in Supabase
- Check browser console for error messages
- Verify email provider is enabled in Supabase (Authentication → Providers)

**Database errors?**
- Confirm all tables were created successfully
- Check Supabase logs for detailed error messages

For detailed setup information, see `SUPABASE_STATUS.md`
