# State Management

## Overview

Sigmapay uses React's Context API for state management instead of external libraries like Redux. This approach provides a clean way to share state between components without prop drilling while keeping the bundle size smaller.

The application implements two main context providers:
1. **AuthContext**: Manages authentication state
2. **FinanceContext**: Manages financial data and operations

## AuthContext

The AuthContext provides authentication-related state and functions to the component tree.

### Implementation

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  isAuthenticated as checkAuth,
  getCurrentUser,
  loginUser as login,
  logoutUser as logout,
  registerUser as register,
  updateUserProfile
} from '../utils/auth';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (checkAuth()) {
          setUser(getCurrentUser());
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const registerUser = async (userData) => {
    // Implementation...
  };

  // Logout function
  const logoutUser = () => {
    // Implementation...
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    // Implementation...
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    updateUser,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Usage

Components can access the authentication state and functions using the `useAuth` hook:

```jsx
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, updateUser, logoutUser } = useAuth();
  
  // Use auth state and functions
}
```

## FinanceContext

The FinanceContext provides financial data and operations to the component tree.

### Implementation

```jsx
// src/contexts/FinanceContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  const [financialHealthScore, setFinancialHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load financial data when user changes
  useEffect(() => {
    // Implementation...
  }, [user]);

  // Update income
  const updateIncome = async (newIncome) => {
    try {
      if (user) {
        // Update user profile with new income
        await updateUser({ monthlyIncome: newIncome });
        
        // Update local state
        setIncome(newIncome);
        
        // Recalculate budget based on new income
        calculateBudget(newIncome);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate budget based on income
  const calculateBudget = useCallback((currentIncome = income) => {
    // Implementation...
  }, [income]);

  // Calculate financial health score
  const calculateFinancialHealthScore = useCallback(() => {
    // Implementation...
  }, [income, expenses, savingsGoal]);

  // Add expense
  const addUserExpense = async (expenseData) => {
    // Implementation...
  };

  // Add financial goal
  const addUserFinancialGoal = async (goalData) => {
    // Implementation...
  };

  // Update financial goal
  const updateUserFinancialGoal = async (goalId, goalData) => {
    // Implementation...
  };

  // Add notification
  const addUserNotification = async (notificationData) => {
    // Implementation...
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    // Implementation...
  };

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

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
```

### Usage

Components can access the financial state and functions using the `useFinance` hook:

```jsx
import { useFinance } from '../contexts/FinanceContext';

function BudgetComponent() {
  const { income, budgetCategories, updateIncome } = useFinance();
  
  // Use finance state and functions
}
```

## Provider Composition

The context providers are composed in the main App component to make them available throughout the application:

```jsx
// src/App.jsx
import { AuthProvider } from './contexts/AuthContext';
import { FinanceProvider } from './contexts/FinanceContext';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          {/* Routes */}
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}
```

## Local Storage Integration

The auth and finance utilities interact with local storage to persist data between sessions:

```jsx
// src/utils/auth.js
// Local storage keys
const USERS_KEY = 'sigmapay_users';
const CURRENT_USER_KEY = 'sigmapay_current_user';

export const getCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// More auth utility functions...
```

## Benefits of This Approach

1. **Simplicity**: No need for external state management libraries
2. **Encapsulation**: State logic is encapsulated in context providers
3. **Performance**: Only components that use the context re-render when it changes
4. **Maintainability**: Clear separation of concerns between auth and finance state
5. **Testability**: Context providers can be easily mocked for testing

## Conclusion

The state management approach in Sigmapay provides a clean and efficient way to manage application state without the complexity of external state management libraries. By using React's Context API with custom hooks, the application maintains a clear separation of concerns while providing easy access to state and functions throughout the component tree.
