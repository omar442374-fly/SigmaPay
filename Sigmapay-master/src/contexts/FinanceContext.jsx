import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  DEFAULT_BUDGET_CATEGORIES,
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getFinancialGoals,
  addFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
  getBudgetSettings,
  updateBudgetSettings,
  getNotifications,
  addNotification,
  markNotificationAsRead
} from '../utils/finance';

// Create the context
const FinanceContext = createContext(null);

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Finance Provider component
export const FinanceProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [income, setIncome] = useState(user?.monthlyIncome || 0);
  const [budgetPlan, setBudgetPlan] = useState(user?.budgetPlan || 0);
  const [spendingLimit, setSpendingLimit] = useState(user?.spendingLimit || 0);
  const [savingsGoal, setSavingsGoal] = useState(user?.savingsGoal || 0);
  const [budgetCategories, setBudgetCategories] = useState({});
  const [customBudgetSettings, setCustomBudgetSettings] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialHealthScore, setFinancialHealthScore] = useState(0);

  // Calculate budget based on income and custom settings
  const calculateBudget = useCallback((incomeAmount, settings = null) => {
    // Return early if no income
    if (!incomeAmount) return {};

    const calculatedBudget = {};
    // Use provided settings or default categories, but don't depend on customBudgetSettings state
    const budgetSettings = settings || { categories: DEFAULT_BUDGET_CATEGORIES };
    const categories = budgetSettings.categories || DEFAULT_BUDGET_CATEGORIES;

    // Calculate budget for each category
    Object.keys(categories).forEach(key => {
      const category = categories[key];
      const categoryAmount = Math.round(incomeAmount * category.percentage);

      const subcategories = category.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        icon: sub.icon,
        color: sub.color,
        amount: Math.round(incomeAmount * sub.percentage),
        percentage: sub.percentage * 100,
        spent: 0,
        remaining: Math.round(incomeAmount * sub.percentage)
      }));

      calculatedBudget[key] = {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        amount: categoryAmount,
        percentage: category.percentage * 100,
        subcategories,
        spent: 0,
        remaining: categoryAmount
      };
    });

    return calculatedBudget;
  }, []);

  // Update income and recalculate budget
  const updateIncome = async (newIncome) => {
    try {
      setIncome(newIncome);

      // Calculate new budget values
      const newBudgetPlan = Math.round(newIncome * 0.6); // 60% of income for expenses
      const newSpendingLimit = Math.round(newIncome * 0.4); // 40% of income for spending
      const newSavingsGoal = Math.round(newIncome * 0.2); // 20% of income for savings

      setBudgetPlan(newBudgetPlan);
      setSpendingLimit(newSpendingLimit);
      setSavingsGoal(newSavingsGoal);

      // Calculate detailed budget categories
      const newBudgetCategories = calculateBudget(newIncome);
      setBudgetCategories(newBudgetCategories);

      // Update user profile with new financial data
      if (user) {
        await updateUser({
          monthlyIncome: newIncome,
          budgetPlan: newBudgetPlan,
          spendingLimit: newSpendingLimit,
          savingsGoal: newSavingsGoal,
          budgetCategories: newBudgetCategories
        });

        // Create a notification for income update
        await addUserNotification({
          type: 'income_update',
          title: 'Income Updated',
          message: `Your monthly income has been updated to $${newIncome.toLocaleString()}.`,
          importance: 'info'
        });
      }

      return {
        budgetPlan: newBudgetPlan,
        spendingLimit: newSpendingLimit,
        savingsGoal: newSavingsGoal,
        budgetCategories: newBudgetCategories
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update budget settings
  const updateBudgetSettings = async (newSettings) => {
    try {
      if (!user) throw new Error('User not authenticated');

      setCustomBudgetSettings(newSettings);

      // Recalculate budget with new settings
      const newBudgetCategories = calculateBudget(income, newSettings);
      setBudgetCategories(newBudgetCategories);

      // Save to local storage
      await updateBudgetSettings(user.id, newSettings);

      // Update user profile
      await updateUser({
        budgetCategories: newBudgetCategories,
        customBudgetSettings: newSettings
      });

      // Create a notification
      await addUserNotification({
        type: 'settings_update',
        title: 'Budget Settings Updated',
        message: 'Your budget allocation settings have been updated.',
        importance: 'info'
      });

      return newBudgetCategories;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add an expense
  const addUserExpense = async (expense) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const newExpense = await addExpense(user.id, expense);
      setExpenses(prev => [newExpense, ...prev]);

      // Update budget categories with new expense
      updateBudgetWithExpense(newExpense);

      // Check if over budget and create notification if needed
      checkBudgetLimits(newExpense);

      return newExpense;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update budget categories with a new expense
  const updateBudgetWithExpense = (expense) => {
    setBudgetCategories(prev => {
      const updated = { ...prev };

      // Find the category and subcategory for this expense
      Object.keys(updated).forEach(catKey => {
        const category = updated[catKey];

        // Check if expense belongs to this category
        if (expense.categoryId === catKey) {
          // Update category spent amount
          category.spent = (category.spent || 0) + expense.amount;
          category.remaining = category.amount - category.spent;

          // Find and update subcategory if applicable
          if (expense.subcategoryId) {
            const subIndex = category.subcategories.findIndex(
              sub => sub.id === expense.subcategoryId
            );

            if (subIndex !== -1) {
              category.subcategories[subIndex].spent =
                (category.subcategories[subIndex].spent || 0) + expense.amount;
              category.subcategories[subIndex].remaining =
                category.subcategories[subIndex].amount - category.subcategories[subIndex].spent;
            }
          }
        }
      });

      return updated;
    });
  };

  // Check if expense puts user over budget and create notification
  const checkBudgetLimits = async (expense) => {
    const category = budgetCategories[expense.categoryId];
    if (!category) return;

    // Check if category is over 90% spent
    if (category.spent > category.amount * 0.9) {
      await addUserNotification({
        type: 'budget_warning',
        title: 'Budget Alert',
        message: `You've used over 90% of your ${category.name} budget.`,
        importance: 'warning',
        relatedData: {
          categoryId: expense.categoryId,
          spent: category.spent,
          budget: category.amount
        }
      });
    }

    // Check if subcategory is over budget
    if (expense.subcategoryId) {
      const subcategory = category.subcategories.find(sub => sub.id === expense.subcategoryId);
      if (subcategory && subcategory.spent > subcategory.amount) {
        await addUserNotification({
          type: 'budget_exceeded',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${subcategory.name} budget.`,
          importance: 'alert',
          relatedData: {
            categoryId: expense.categoryId,
            subcategoryId: expense.subcategoryId,
            spent: subcategory.spent,
            budget: subcategory.amount
          }
        });
      }
    }
  };

  // Add a financial goal
  const addUserFinancialGoal = async (goal) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const newGoal = await addFinancialGoal(user.id, goal);
      setFinancialGoals(prev => [newGoal, ...prev]);

      // Create a notification
      await addUserNotification({
        type: 'goal_created',
        title: 'New Financial Goal',
        message: `You've created a new goal: ${goal.name}`,
        importance: 'info'
      });

      return newGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update a financial goal
  const updateUserFinancialGoal = async (goalId, updatedData) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const updatedGoal = await updateFinancialGoal(user.id, goalId, updatedData);

      setFinancialGoals(prev =>
        prev.map(goal => goal.id === goalId ? updatedGoal : goal)
      );

      // Create a notification if goal is completed
      if (updatedGoal.progress >= 100 && updatedGoal.progress !== updatedData.progress) {
        await addUserNotification({
          type: 'goal_completed',
          title: 'Goal Completed!',
          message: `Congratulations! You've completed your goal: ${updatedGoal.name}`,
          importance: 'success'
        });
      }

      return updatedGoal;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add a notification
  const addUserNotification = async (notification) => {
    try {
      if (!user) return null;

      const newNotification = await addNotification(user.id, notification);
      setNotifications(prev => [newNotification, ...prev]);

      return newNotification;
    } catch (err) {
      console.error('Error adding notification:', err);
      return null;
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const updatedNotification = await markNotificationAsRead(user.id, notificationId);

      setNotifications(prev =>
        prev.map(notif => notif.id === notificationId ? updatedNotification : notif)
      );

      return updatedNotification;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate financial health score
  const calculateFinancialHealthScore = useCallback(() => {
    if (!user || !income) return 0;

    let score = 0;

    try {
      // Income factor (max 20 points)
      score += Math.min(income / 5000 * 20, 20);

      // Savings ratio (max 30 points)
      const savingsRatio = income > 0 ? savingsGoal / income : 0;
      score += Math.min(savingsRatio * 100, 30);

      // Budget adherence (max 30 points)
      let budgetAdherence = 30;

      // Only check budget adherence if we have categories and expenses
      if (Object.keys(budgetCategories).length > 0) {
        Object.values(budgetCategories).forEach(category => {
          if (category && category.spent > category.amount) {
            budgetAdherence -= 5;
          }
        });
      }

      score += Math.max(budgetAdherence, 0);

      // Financial goals (max 20 points)
      let goalPoints = 0;
      if (financialGoals && financialGoals.length > 0) {
        const activeGoals = financialGoals.filter(goal => goal.progress < 100).length;
        const completedGoals = financialGoals.filter(goal => goal.progress >= 100).length;
        goalPoints = Math.min((activeGoals * 2) + (completedGoals * 5), 20);
      }
      score += goalPoints;

      return Math.min(Math.round(score), 100);
    } catch (err) {
      console.error('Error calculating financial health score:', err);
      return 50; // Return a default score if calculation fails
    }
  }, [user, income, savingsGoal]);

  // Initialize data when user changes - use a ref to prevent multiple initializations
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const initializeFinancialData = async () => {
      // Return early if no user or already initialized
      if (!user) {
        setLoading(false);
        return;
      }

      // Prevent multiple initializations for the same user
      if (isInitializedRef.current) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        isInitializedRef.current = true;

        // Set basic financial data
        setIncome(user.monthlyIncome || 0);
        setBudgetPlan(user.budgetPlan || 0);
        setSpendingLimit(user.spendingLimit || 0);
        setSavingsGoal(user.savingsGoal || 0);

        // Get custom budget settings
        const settings = await getBudgetSettings(user.id);
        setCustomBudgetSettings(settings);

        // Calculate budget categories
        let calculatedBudget;
        if (user.budgetCategories) {
          calculatedBudget = user.budgetCategories;
        } else {
          calculatedBudget = calculateBudget(user.monthlyIncome || 0, settings);
        }
        setBudgetCategories(calculatedBudget);

        // Get expenses
        const userExpenses = await getExpenses(user.id);
        setExpenses(userExpenses);

        // Get financial goals
        const userGoals = await getFinancialGoals(user.id);
        setFinancialGoals(userGoals);

        // Get notifications
        const userNotifications = await getNotifications(user.id);
        setNotifications(userNotifications);

        // Calculate financial health score
        const score = calculateFinancialHealthScore();
        setFinancialHealthScore(score);

      } catch (err) {
        setError(err.message);
        console.error('Error initializing financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeFinancialData();

    // Reset the initialization flag when user changes
    return () => {
      isInitializedRef.current = false;
    };
  }, [user, calculateBudget, calculateFinancialHealthScore]);

  // Context value
  const value = {
    // Financial data
    income,
    budgetPlan,
    spendingLimit,
    savingsGoal,
    budgetCategories,
    customBudgetSettings,
    expenses,
    financialGoals,
    notifications,
    financialHealthScore,

    // Status
    loading,
    error,

    // Methods
    updateIncome,
    updateBudgetSettings,
    addUserExpense,
    updateExpense: (expenseId, data) => user && updateExpense(user.id, expenseId, data),
    deleteExpense: (expenseId) => user && deleteExpense(user.id, expenseId),
    addUserFinancialGoal,
    updateUserFinancialGoal,
    deleteFinancialGoal: (goalId) => user && deleteFinancialGoal(user.id, goalId),
    addUserNotification,
    markNotificationRead,
    calculateBudget
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceContext;
