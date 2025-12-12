-- SigmaPay Complete Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- USER PROFILES TABLE
-- ============================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- BUDGETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(12, 2) NOT NULL,
    spent_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    categories JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_status ON public.budgets(status);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets"
    ON public.budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own budgets"
    ON public.budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON public.budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON public.budgets FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- EXPENSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_budget_id ON public.expenses(budget_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
    ON public.expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
    ON public.expenses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
    ON public.expenses FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- GOALS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('savings', 'debt_reduction', 'investment', 'purchase', 'emergency_fund', 'other')),
    title TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    deadline DATE,
    priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
    ON public.goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
    ON public.goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
    ON public.goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
    ON public.goals FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- PAYMENTS/TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'transfer', 'refund', 'deposit', 'withdrawal')),
    amount DECIMAL(12, 2) NOT NULL,
    recipient TEXT,
    merchant_id TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- GROUPS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.savings_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(12, 2),
    current_amount DECIMAL(12, 2) DEFAULT 0,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_savings_groups_created_by ON public.savings_groups(created_by);

ALTER TABLE public.savings_groups ENABLE ROW LEVEL SECURITY;

-- Group members can view group
CREATE POLICY "Group members can view groups"
    ON public.savings_groups FOR SELECT
    USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create groups"
    ON public.savings_groups FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creator can update group"
    ON public.savings_groups FOR UPDATE
    USING (auth.uid() = created_by);

-- ============================================
-- GROUP MEMBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.savings_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contribution_amount DECIMAL(12, 2) DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view group memberships"
    ON public.group_members FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.savings_groups
            WHERE id = group_id AND created_by = auth.uid()
        )
    );

CREATE POLICY "Group creator can add members"
    ON public.group_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.savings_groups
            WHERE id = group_id AND created_by = auth.uid()
        )
    );

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_budgets
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_goals
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_savings_groups
    BEFORE UPDATE ON public.savings_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to update budget spent amount when expense is added
CREATE OR REPLACE FUNCTION public.update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.budget_id IS NOT NULL THEN
        UPDATE public.budgets
        SET spent_amount = spent_amount + NEW.amount
        WHERE id = NEW.budget_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_budget_on_expense
    AFTER INSERT ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_budget_spent();

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.savings_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.group_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'SigmaPay complete database setup completed successfully!';
    RAISE NOTICE 'Created tables: user_profiles, budgets, expenses, goals, transactions, savings_groups, group_members, notifications';
    RAISE NOTICE 'All tables have RLS policies enabled for security.';
    RAISE NOTICE 'You can now use the application with full Supabase integration.';
END $$;
