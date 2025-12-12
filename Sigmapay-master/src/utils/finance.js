/**
 * Utility functions for managing financial data
 */

// Local storage keys
const EXPENSES_KEY = 'sigmapay_expenses';
const FINANCIAL_GOALS_KEY = 'sigmapay_goals';
const BUDGET_SETTINGS_KEY = 'sigmapay_budget_settings';
const NOTIFICATIONS_KEY = 'sigmapay_notifications';

// Default budget categories with icons and colors
export const DEFAULT_BUDGET_CATEGORIES = {
  ESSENTIALS: {
    id: 'ESSENTIALS',
    name: 'Essential Living',
    icon: '🏠',
    color: '#4F46E5',
    percentage: 0.5, // 50%
    subcategories: [
      { id: 'housing', name: 'Housing', icon: '🏠', color: '#4F46E5', percentage: 0.3 },
      { id: 'food', name: 'Food', icon: '🍔', color: '#F59E0B', percentage: 0.1 },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#0EA5E9', percentage: 0.05 },
      { id: 'insurance', name: 'Insurance', icon: '🏥', color: '#EF4444', percentage: 0.03 },
      { id: 'utilities', name: 'Utilities', icon: '💡', color: '#10B981', percentage: 0.02 }
    ]
  },
  FINANCIAL_GOALS: {
    id: 'FINANCIAL_GOALS',
    name: 'Financial Goals',
    icon: '💰',
    color: '#6366F1',
    percentage: 0.25, // 25%
    subcategories: [
      { id: 'emergency', name: 'Emergency Fund', icon: '🛟', color: '#8B5CF6', percentage: 0.1 },
      { id: 'investments', name: 'Investments', icon: '📈', color: '#22C55E', percentage: 0.1 },
      { id: 'debt', name: 'Debt Repayment', icon: '💳', color: '#7C3AED', percentage: 0.05 }
    ]
  },
  PERSONAL_GROWTH: {
    id: 'PERSONAL_GROWTH',
    name: 'Personal Growth',
    icon: '📚',
    color: '#14B8A6',
    percentage: 0.1, // 10%
    subcategories: [
      { id: 'education', name: 'Education', icon: '📚', color: '#14B8A6', percentage: 0.05 },
      { id: 'health', name: 'Health & Fitness', icon: '🧘‍♂️', color: '#F97316', percentage: 0.05 }
    ]
  },
  LIFESTYLE: {
    id: 'LIFESTYLE',
    name: 'Lifestyle',
    icon: '🎬',
    color: '#EC4899',
    percentage: 0.1, // 10%
    subcategories: [
      { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#EC4899', percentage: 0.04 },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6', percentage: 0.03 },
      { id: 'dining', name: 'Dining Out', icon: '🍽️', color: '#F59E0B', percentage: 0.03 }
    ]
  },
  GIVING: {
    id: 'GIVING',
    name: 'Giving & Charity',
    icon: '🤝',
    color: '#6B7280',
    percentage: 0.05, // 5%
    subcategories: [
      { id: 'charity', name: 'Charity', icon: '💖', color: '#EC4899', percentage: 0.03 },
      { id: 'family', name: 'Family Support', icon: '👪', color: '#6B7280', percentage: 0.02 }
    ]
  }
};

// Get all expenses for a user
export const getExpenses = (userId) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  return allExpenses[userId] || [];
};

// Add an expense
export const addExpense = (userId, expense) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  const userExpenses = allExpenses[userId] || [];
  
  const newExpense = {
    id: Date.now().toString(),
    ...expense,
    date: expense.date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  userExpenses.push(newExpense);
  allExpenses[userId] = userExpenses;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(allExpenses));
  
  return newExpense;
};

// Update an expense
export const updateExpense = (userId, expenseId, updatedData) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  const userExpenses = allExpenses[userId] || [];
  
  const index = userExpenses.findIndex(e => e.id === expenseId);
  if (index === -1) {
    throw new Error('Expense not found');
  }
  
  userExpenses[index] = {
    ...userExpenses[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  allExpenses[userId] = userExpenses;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(allExpenses));
  
  return userExpenses[index];
};

// Delete an expense
export const deleteExpense = (userId, expenseId) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  const userExpenses = allExpenses[userId] || [];
  
  const filteredExpenses = userExpenses.filter(e => e.id !== expenseId);
  
  if (filteredExpenses.length === userExpenses.length) {
    throw new Error('Expense not found');
  }
  
  allExpenses[userId] = filteredExpenses;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(allExpenses));
  
  return filteredExpenses;
};

// Get all financial goals for a user
export const getFinancialGoals = (userId) => {
  const allGoals = JSON.parse(localStorage.getItem(FINANCIAL_GOALS_KEY) || '{}');
  return allGoals[userId] || [];
};

// Add a financial goal
export const addFinancialGoal = (userId, goal) => {
  const allGoals = JSON.parse(localStorage.getItem(FINANCIAL_GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const newGoal = {
    id: Date.now().toString(),
    ...goal,
    createdAt: new Date().toISOString(),
    progress: 0
  };
  
  userGoals.push(newGoal);
  allGoals[userId] = userGoals;
  localStorage.setItem(FINANCIAL_GOALS_KEY, JSON.stringify(allGoals));
  
  return newGoal;
};

// Update a financial goal
export const updateFinancialGoal = (userId, goalId, updatedData) => {
  const allGoals = JSON.parse(localStorage.getItem(FINANCIAL_GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const index = userGoals.findIndex(g => g.id === goalId);
  if (index === -1) {
    throw new Error('Goal not found');
  }
  
  userGoals[index] = {
    ...userGoals[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  allGoals[userId] = userGoals;
  localStorage.setItem(FINANCIAL_GOALS_KEY, JSON.stringify(allGoals));
  
  return userGoals[index];
};

// Delete a financial goal
export const deleteFinancialGoal = (userId, goalId) => {
  const allGoals = JSON.parse(localStorage.getItem(FINANCIAL_GOALS_KEY) || '{}');
  const userGoals = allGoals[userId] || [];
  
  const filteredGoals = userGoals.filter(g => g.id !== goalId);
  
  if (filteredGoals.length === userGoals.length) {
    throw new Error('Goal not found');
  }
  
  allGoals[userId] = filteredGoals;
  localStorage.setItem(FINANCIAL_GOALS_KEY, JSON.stringify(allGoals));
  
  return filteredGoals;
};

// Get budget settings for a user
export const getBudgetSettings = (userId) => {
  const allSettings = JSON.parse(localStorage.getItem(BUDGET_SETTINGS_KEY) || '{}');
  return allSettings[userId] || { categories: DEFAULT_BUDGET_CATEGORIES };
};

// Update budget settings
export const updateBudgetSettings = (userId, settings) => {
  const allSettings = JSON.parse(localStorage.getItem(BUDGET_SETTINGS_KEY) || '{}');
  
  allSettings[userId] = {
    ...allSettings[userId],
    ...settings,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(BUDGET_SETTINGS_KEY, JSON.stringify(allSettings));
  
  return allSettings[userId];
};

// Get notifications for a user
export const getNotifications = (userId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '{}');
  return allNotifications[userId] || [];
};

// Add a notification
export const addNotification = (userId, notification) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '{}');
  const userNotifications = allNotifications[userId] || [];
  
  const newNotification = {
    id: Date.now().toString(),
    ...notification,
    createdAt: new Date().toISOString(),
    read: false
  };
  
  userNotifications.push(newNotification);
  allNotifications[userId] = userNotifications;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
  
  return newNotification;
};

// Mark notification as read
export const markNotificationAsRead = (userId, notificationId) => {
  const allNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '{}');
  const userNotifications = allNotifications[userId] || [];
  
  const index = userNotifications.findIndex(n => n.id === notificationId);
  if (index === -1) {
    throw new Error('Notification not found');
  }
  
  userNotifications[index].read = true;
  userNotifications[index].readAt = new Date().toISOString();
  
  allNotifications[userId] = userNotifications;
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
  
  return userNotifications[index];
};
