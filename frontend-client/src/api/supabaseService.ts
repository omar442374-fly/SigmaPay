import { supabase } from '../utils/supabaseClient';

export interface Budget {
  id: string;
  user_id: string;
  total_amount: number;
  spent_amount: number;
  start_date: string;
  end_date: string;
  categories: string[];
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  budget_id?: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'other';
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  goal_type: 'savings' | 'debt_reduction' | 'investment' | 'purchase' | 'emergency_fund' | 'other';
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  priority_level: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'payment' | 'transfer' | 'refund' | 'deposit' | 'withdrawal';
  amount: number;
  recipient?: string;
  merchant_id?: string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  transaction_date: string;
  created_at: string;
}

export interface SavingsGroup {
  id: string;
  name: string;
  description?: string;
  target_amount?: number;
  current_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  contribution_amount: number;
  joined_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

class SupabaseService {
  // ============================================
  // BUDGET METHODS
  // ============================================
  
  async createBudget(
    userId: string,
    totalAmount: number,
    startDate: string,
    endDate: string,
    categories: string[]
  ) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        start_date: startDate,
        end_date: endDate,
        categories: categories,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async getBudgets(userId: string, status?: string) {
    let query = supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Budget[];
  }

  async getBudget(budgetId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async updateBudget(budgetId: string, updates: Partial<Budget>) {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', budgetId)
      .select()
      .single();

    if (error) throw error;
    return data as Budget;
  }

  async deleteBudget(budgetId: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId);

    if (error) throw error;
  }

  // ============================================
  // EXPENSE METHODS
  // ============================================

  async recordExpense(
    userId: string,
    amount: number,
    category: string,
    date: string,
    paymentMethod: string,
    budgetId?: string,
    description?: string
  ) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        budget_id: budgetId,
        amount: amount,
        category: category,
        description: description,
        date: date,
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  }

  async getExpenses(userId: string, budgetId?: string) {
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (budgetId) {
      query = query.eq('budget_id', budgetId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Expense[];
  }

  async deleteExpense(expenseId: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;
  }

  // ============================================
  // GOAL METHODS
  // ============================================

  async createGoal(
    userId: string,
    goalType: string,
    title: string,
    targetAmount: number,
    deadline?: string,
    priorityLevel: string = 'medium'
  ) {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: userId,
        goal_type: goalType,
        title: title,
        target_amount: targetAmount,
        deadline: deadline,
        priority_level: priorityLevel,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  }

  async getGoals(userId: string, status?: string) {
    let query = supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Goal[];
  }

  async getGoal(goalId: string) {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .single();

    if (error) throw error;
    return data as Goal;
  }

  async updateGoalProgress(goalId: string, currentAmount: number) {
    const { data, error } = await supabase
      .from('goals')
      .update({ current_amount: currentAmount })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  }

  async updateGoal(goalId: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data as Goal;
  }

  async deleteGoal(goalId: string) {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;
  }

  // ============================================
  // TRANSACTION/PAYMENT METHODS
  // ============================================

  async createTransaction(
    userId: string,
    transactionType: string,
    amount: number,
    recipient?: string,
    merchantId?: string,
    paymentMethod?: string,
    description?: string
  ) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: transactionType,
        amount: amount,
        recipient: recipient,
        merchant_id: merchantId,
        payment_method: paymentMethod,
        description: description,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async getTransactions(userId: string, limit?: number) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Transaction[];
  }

  async getTransaction(transactionId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  async updateTransactionStatus(transactionId: string, status: string) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status: status })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;
    return data as Transaction;
  }

  // ============================================
  // SAVINGS GROUP METHODS
  // ============================================

  async createGroup(userId: string, name: string, description?: string, targetAmount?: number) {
    const { data, error } = await supabase
      .from('savings_groups')
      .insert({
        name: name,
        description: description,
        target_amount: targetAmount,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data as SavingsGroup;
  }

  async getGroups(userId: string) {
    // Get groups created by user or where user is a member
    const { data, error } = await supabase
      .from('savings_groups')
      .select(`
        *,
        group_members!inner(user_id)
      `)
      .or(`created_by.eq.${userId},group_members.user_id.eq.${userId}`);

    if (error) throw error;
    return data as SavingsGroup[];
  }

  async getGroup(groupId: string) {
    const { data, error } = await supabase
      .from('savings_groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data as SavingsGroup;
  }

  async addGroupMember(groupId: string, userId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data as GroupMember;
  }

  async getGroupMembers(groupId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        user_profiles(username, email)
      `)
      .eq('group_id', groupId);

    if (error) throw error;
    return data;
  }

  async updateGroupContribution(groupId: string, userId: string, amount: number) {
    // First get current contribution
    const { data: currentMember, error: getMemberError } = await supabase
      .from('group_members')
      .select('contribution_amount')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (getMemberError) throw getMemberError;

    // Update member contribution
    const newContribution = (currentMember.contribution_amount || 0) + amount;
    const { data: member, error: memberError } = await supabase
      .from('group_members')
      .update({
        contribution_amount: newContribution
      })
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .select()
      .single();

    if (memberError) throw memberError;

    // Get current group amount
    const { data: currentGroup, error: getGroupError } = await supabase
      .from('savings_groups')
      .select('current_amount')
      .eq('id', groupId)
      .single();

    if (getGroupError) throw getGroupError;

    // Update group total
    const newGroupAmount = (currentGroup.current_amount || 0) + amount;
    const { data: group, error: groupError } = await supabase
      .from('savings_groups')
      .update({
        current_amount: newGroupAmount
      })
      .eq('id', groupId)
      .select()
      .single();

    if (groupError) throw groupError;
    return { member, group };
  }

  // ============================================
  // NOTIFICATION METHODS
  // ============================================

  async createNotification(userId: string, title: string, message: string, type: string = 'info') {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: title,
        message: message,
        type: type
      })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }

  async getNotifications(userId: string, unreadOnly: boolean = false) {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Notification[];
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }

  async markAllNotificationsAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  // ============================================
  // ANALYTICS/REPORTS METHODS
  // ============================================

  async getMonthlySummary(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('amount, category, date')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const totalExpenses = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0;
    const categoryBreakdown = expenses?.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount.toString());
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      categoryBreakdown,
      expenseCount: expenses?.length || 0
    };
  }

  async getSpendingByCategory(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('expenses')
      .select('category, amount')
      .eq('user_id', userId);

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;
    if (error) throw error;

    const categoryTotals = data?.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount.toString());
      return acc;
    }, {} as Record<string, number>);

    return categoryTotals || {};
  }
}

const supabaseService = new SupabaseService();
export default supabaseService;
