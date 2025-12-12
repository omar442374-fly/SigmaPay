// Local storage keys
const BUDGETS_KEY = 'sigmapay_budgets';
const EXPENSES_KEY = 'sigmapay_expenses';
const CATEGORIES_KEY = 'sigmapay_categories';

// Default spending categories
export const DEFAULT_CATEGORIES = [
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#4F46E5' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#0EA5E9' },
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#F59E0B' },
  { id: 'utilities', name: 'Utilities', icon: '💡', color: '#10B981' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#EC4899' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8B5CF6' },
  { id: 'healthcare', name: 'Healthcare', icon: '⚕️', color: '#EF4444' },
  { id: 'personal', name: 'Personal Care', icon: '💇', color: '#F97316' },
  { id: 'education', name: 'Education', icon: '📚', color: '#14B8A6' },
  { id: 'savings', name: 'Savings', icon: '💰', color: '#6366F1' },
  { id: 'debt', name: 'Debt Payments', icon: '💳', color: '#7C3AED' },
  { id: 'income', name: 'Income', icon: '💵', color: '#22C55E' },
  { id: 'other', name: 'Other', icon: '📌', color: '#6B7280' }
];

// Initialize categories if they don't exist
const initializeCategories = () => {
  const existingCategories = localStorage.getItem(CATEGORIES_KEY);
  if (!existingCategories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
};

// Initialize the module
initializeCategories();

// Get all categories
export const getCategories = () => {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
};

// Add a custom category
export const addCategory = (category) => {
  const categories = getCategories();

  // Check if category with same ID already exists
  if (categories.some(c => c.id === category.id)) {
    throw new Error('Category with this ID already exists');
  }

  categories.push(category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

// Update a category
export const updateCategory = (categoryId, updatedCategory) => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === categoryId);

  if (index === -1) {
    throw new Error('Category not found');
  }

  categories[index] = { ...categories[index], ...updatedCategory };
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

// Delete a category
export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  const filteredCategories = categories.filter(c => c.id !== categoryId);

  if (filteredCategories.length === categories.length) {
    throw new Error('Category not found');
  }

  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));
  return filteredCategories;
};

// Get all budgets for a user
export const getBudgets = (userId) => {
  const allBudgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || '{}');
  return allBudgets[userId] || [];
};

// Set a budget for a category
export const setBudget = (userId, budget) => {
  const allBudgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || '{}');
  const userBudgets = allBudgets[userId] || [];

  // Check if budget for this category already exists
  const existingIndex = userBudgets.findIndex(b => b.categoryId === budget.categoryId);

  if (existingIndex !== -1) {
    // Update existing budget
    userBudgets[existingIndex] = {
      ...userBudgets[existingIndex],
      ...budget,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new budget
    userBudgets.push({
      id: Date.now().toString(),
      ...budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  allBudgets[userId] = userBudgets;
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(allBudgets));
  return userBudgets;
};

// Delete a budget
export const deleteBudget = (userId, budgetId) => {
  const allBudgets = JSON.parse(localStorage.getItem(BUDGETS_KEY) || '{}');
  const userBudgets = allBudgets[userId] || [];

  const filteredBudgets = userBudgets.filter(b => b.id !== budgetId);

  if (filteredBudgets.length === userBudgets.length) {
    throw new Error('Budget not found');
  }

  allBudgets[userId] = filteredBudgets;
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(allBudgets));
  return filteredBudgets;
};

// Get all expenses for a user
export const getExpenses = (userId, filters = {}) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  let userExpenses = allExpenses[userId] || [];

  // Apply filters
  if (filters.categoryId) {
    userExpenses = userExpenses.filter(e => e.categoryId === filters.categoryId);
  }

  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    userExpenses = userExpenses.filter(e => new Date(e.date) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    userExpenses = userExpenses.filter(e => new Date(e.date) <= endDate);
  }

  if (filters.minAmount) {
    userExpenses = userExpenses.filter(e => e.amount >= filters.minAmount);
  }

  if (filters.maxAmount) {
    userExpenses = userExpenses.filter(e => e.amount <= filters.maxAmount);
  }

  // Sort by date (newest first)
  return userExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  // Check if this expense exceeds the budget
  const budgets = getBudgets(userId);
  const categoryBudget = budgets.find(b => b.categoryId === expense.categoryId);

  if (categoryBudget) {
    const categoryExpenses = getExpenses(userId, {
      categoryId: expense.categoryId,
      startDate: getMonthStartDate(),
      endDate: getMonthEndDate()
    });

    const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalSpent > categoryBudget.amount) {
      return {
        expense: newExpense,
        alert: {
          type: 'budget_exceeded',
          message: `You've exceeded your ${getCategoryName(expense.categoryId)} budget for this month.`,
          budget: categoryBudget,
          totalSpent
        }
      };
    }
  }

  return { expense: newExpense };
};

// Update an expense
export const updateExpense = (userId, expenseId, updatedExpense) => {
  const allExpenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '{}');
  const userExpenses = allExpenses[userId] || [];

  const index = userExpenses.findIndex(e => e.id === expenseId);

  if (index === -1) {
    throw new Error('Expense not found');
  }

  userExpenses[index] = {
    ...userExpenses[index],
    ...updatedExpense,
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

// Get spending summary by category for a time period
export const getSpendingSummary = (userId, startDate, endDate) => {
  const expenses = getExpenses(userId, { startDate, endDate });
  const categories = getCategories();

  const summary = {};

  // Initialize summary with all categories
  categories.forEach(category => {
    summary[category.id] = {
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
      totalAmount: 0,
      count: 0
    };
  });

  // Calculate totals
  expenses.forEach(expense => {
    if (summary[expense.categoryId]) {
      summary[expense.categoryId].totalAmount += expense.amount;
      summary[expense.categoryId].count += 1;
    } else {
      // Handle expenses with unknown category
      summary.other = summary.other || {
        categoryId: 'other',
        categoryName: 'Other',
        categoryIcon: '📌',
        categoryColor: '#6B7280',
        totalAmount: 0,
        count: 0
      };
      summary.other.totalAmount += expense.amount;
      summary.other.count += 1;
    }
  });

  // Convert to array and sort by amount
  return Object.values(summary)
    .filter(item => item.count > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);
};

// Get spending trends over time
export const getSpendingTrends = (userId, period = 'monthly', months = 6) => {
  const now = new Date();
  const trends = [];

  for (let i = 0; i < months; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const expenses = getExpenses(userId, { startDate, endDate });
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    trends.unshift({
      period: startDate.toISOString().substring(0, 7), // YYYY-MM format
      totalSpent,
      expenseCount: expenses.length
    });
  }

  return trends;
};

// Get budget status for all categories
export const getBudgetStatus = (userId) => {
  const budgets = getBudgets(userId);
  const categories = getCategories();
  const startDate = getMonthStartDate();
  const endDate = getMonthEndDate();

  return budgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId) || {
      name: 'Unknown',
      icon: '❓',
      color: '#6B7280'
    };

    const expenses = getExpenses(userId, {
      categoryId: budget.categoryId,
      startDate,
      endDate
    });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget.amount - totalSpent;
    const percentage = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;

    return {
      ...budget,
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
      totalSpent,
      remaining,
      percentage,
      status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'good'
    };
  });
};

// Get an overview of the total budget, spent amount, and remaining budget
export const getBudgetOverview = (userId) => {
  const budgets = getBudgets(userId);
  const startDate = getMonthStartDate();
  const endDate = getMonthEndDate();

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => {
    const expenses = getExpenses(userId, {
      categoryId: budget.categoryId,
      startDate,
      endDate
    });
    return sum + expenses.reduce((expenseSum, expense) => expenseSum + expense.amount, 0);
  }, 0);

  return {
    total: totalBudget,
    spent: totalSpent,
    remaining: totalBudget - totalSpent
  };
};

// Get budgets for all categories with their spent amounts
export const getCategoryBudgets = (userId) => {
  const budgets = getBudgets(userId);
  const startDate = getMonthStartDate();
  const endDate = getMonthEndDate();

  return budgets.map((budget) => {
    const expenses = getExpenses(userId, {
      categoryId: budget.categoryId,
      startDate,
      endDate
    });
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      ...budget,
      spent: totalSpent
    };
  });
};

// Helper functions
const getMonthStartDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
};

const getMonthEndDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
};

const getCategoryName = (categoryId) => {
  const categories = getCategories();
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};
