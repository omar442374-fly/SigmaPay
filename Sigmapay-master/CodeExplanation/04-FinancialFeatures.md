# Financial Features

## Overview

Sigmapay provides a comprehensive set of financial management features to help users track their finances, set budgets, and achieve financial goals. These features are implemented through a combination of React components, context providers, and utility functions.

## Core Financial Features

### 1. Income Management

Users can set and update their monthly income, which serves as the basis for budget calculations.

#### Implementation

The income input component allows users to view and update their income:

```jsx
// src/components/IncomeInput.jsx
function IncomeInput() {
  const { income, updateIncome } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [incomeValue, setIncomeValue] = useState(income);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateIncome(incomeValue);
    setEditMode(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">$</span>
            <input
              type="number"
              value={incomeValue}
              onChange={(e) => setIncomeValue(Number(e.target.value))}
              className="input-field"
              min="0"
              step="100"
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button type="submit" className="btn-primary">Save</button>
            <button 
              type="button" 
              onClick={() => {
                setEditMode(false);
                setIncomeValue(income);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">${income.toLocaleString()}</div>
          <button 
            onClick={() => setEditMode(true)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
```

The `updateIncome` function in the FinanceContext updates the user's income and recalculates the budget:

```jsx
// src/contexts/FinanceContext.jsx (partial)
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
```

### 2. Budget Management

The budget management feature allows users to set and customize their budget across different categories.

#### Budget Calculation

The budget is calculated based on the user's income and predefined allocation percentages:

```jsx
// src/contexts/FinanceContext.jsx (partial)
const calculateBudget = useCallback((currentIncome = income) => {
  // Default budget allocation percentages
  const defaultAllocations = {
    housing: 0.3, // 30% of income
    food: 0.15,   // 15% of income
    transportation: 0.1, // 10% of income
    utilities: 0.1, // 10% of income
    healthcare: 0.1, // 10% of income
    entertainment: 0.05, // 5% of income
    savings: 0.15, // 15% of income
    other: 0.05 // 5% of income
  };
  
  // Calculate budget for each category
  const calculatedBudget = {};
  let totalBudget = 0;
  
  Object.entries(defaultAllocations).forEach(([category, percentage]) => {
    // Use custom percentage if available, otherwise use default
    const actualPercentage = customBudgetSettings[category]?.percentage || percentage;
    const amount = Math.round(currentIncome * actualPercentage);
    
    calculatedBudget[category] = {
      percentage: actualPercentage,
      amount,
      spent: 0, // Will be updated from expenses
      remaining: amount // Will be updated from expenses
    };
    
    totalBudget += amount;
  });
  
  // Update budget categories state
  setBudgetCategories(calculatedBudget);
  
  // Update total budget plan
  setBudgetPlan(totalBudget);
  
  return calculatedBudget;
}, [income, customBudgetSettings]);
```

#### Budget Customization

Users can customize their budget allocation through the BudgetCustomizer component:

```jsx
// src/components/BudgetCustomizer.jsx
function BudgetCustomizer() {
  const { budgetCategories, updateBudgetSettings } = useFinance();
  const [allocations, setAllocations] = useState({});
  
  // Initialize allocations from budget categories
  useEffect(() => {
    const initialAllocations = {};
    Object.entries(budgetCategories).forEach(([category, data]) => {
      initialAllocations[category] = data.percentage;
    });
    setAllocations(initialAllocations);
  }, [budgetCategories]);
  
  const handleAllocationChange = (category, value) => {
    setAllocations(prev => ({
      ...prev,
      [category]: value / 100
    }));
  };
  
  const handleSave = () => {
    // Convert allocations to budget settings format
    const settings = {};
    Object.entries(allocations).forEach(([category, percentage]) => {
      settings[category] = { percentage };
    });
    
    updateBudgetSettings(settings);
  };
  
  // Render budget customization form...
}
```

### 3. Expense Tracking

The expense tracking feature allows users to record and categorize their expenses.

#### Adding Expenses

Users can add expenses through the ExpenseTracker component:

```jsx
// src/components/ExpenseTracker.jsx
function ExpenseTracker() {
  const { expenses, addUserExpense, deleteExpense } = useFinance();
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newExpense.description || !newExpense.amount) {
      return;
    }
    
    // Add expense
    addUserExpense({
      ...newExpense,
      amount: Number(newExpense.amount)
    });
    
    // Reset form
    setNewExpense({
      description: '',
      amount: '',
      category: 'other',
      date: new Date().toISOString().split('T')[0]
    });
  };
  
  // Render expense form and list...
}
```

The `addUserExpense` function in the FinanceContext adds the expense and updates the budget:

```jsx
// src/contexts/FinanceContext.jsx (partial)
const addUserExpense = async (expenseData) => {
  try {
    if (user) {
      // Add expense to storage
      const newExpense = await addExpense(user.id, expenseData);
      
      // Update expenses state
      setExpenses(prev => [newExpense, ...prev]);
      
      // Update budget categories with new expense
      setBudgetCategories(prev => {
        const category = expenseData.category;
        if (prev[category]) {
          const updatedCategory = {
            ...prev[category],
            spent: prev[category].spent + expenseData.amount,
            remaining: prev[category].amount - (prev[category].spent + expenseData.amount)
          };
          
          return {
            ...prev,
            [category]: updatedCategory
          };
        }
        return prev;
      });
      
      return newExpense;
    }
  } catch (err) {
    setError(err.message);
    throw err;
  }
};
```

### 4. Financial Goals

The financial goals feature allows users to set and track progress towards financial goals.

#### Setting Goals

Users can set financial goals through the FinancialGoals component:

```jsx
// src/components/FinancialGoals.jsx
function FinancialGoals() {
  const { financialGoals, addUserFinancialGoal, updateUserFinancialGoal, deleteFinancialGoal } = useFinance();
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings'
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newGoal.name || !newGoal.targetAmount) {
      return;
    }
    
    // Add goal
    addUserFinancialGoal({
      ...newGoal,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount || 0)
    });
    
    // Reset form
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'savings'
    });
  };
  
  // Render goal form and list...
}
```

### 5. Financial Health Score

The financial health score feature calculates a score based on the user's financial data to give them an overview of their financial health.

```jsx
// src/contexts/FinanceContext.jsx (partial)
const calculateFinancialHealthScore = useCallback(() => {
  if (!income) return 0;
  
  // Factors that contribute to financial health
  const factors = {
    incomeToExpenseRatio: 0, // Higher is better
    savingsRate: 0, // Higher is better
    debtToIncomeRatio: 0, // Lower is better
    emergencyFund: 0, // Higher is better
    budgetAdherence: 0 // Higher is better
  };
  
  // Calculate income to expense ratio
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  factors.incomeToExpenseRatio = totalExpenses > 0 ? income / totalExpenses : 1;
  
  // Calculate savings rate
  const savingsCategory = budgetCategories.savings;
  factors.savingsRate = savingsCategory ? savingsCategory.amount / income : 0;
  
  // Calculate budget adherence
  let totalOverBudget = 0;
  Object.values(budgetCategories).forEach(category => {
    if (category.spent > category.amount) {
      totalOverBudget += category.spent - category.amount;
    }
  });
  factors.budgetAdherence = totalOverBudget > 0 ? 1 - (totalOverBudget / income) : 1;
  
  // Calculate final score (0-100)
  const score = Math.min(100, Math.max(0, Math.round(
    (factors.incomeToExpenseRatio * 25) +
    (factors.savingsRate * 25) +
    ((1 - factors.debtToIncomeRatio) * 20) +
    (factors.emergencyFund * 15) +
    (factors.budgetAdherence * 15)
  )));
  
  setFinancialHealthScore(score);
  return score;
}, [income, expenses, budgetCategories, savingsGoal]);
```

## Data Visualization

Financial data is visualized using various chart components to help users understand their finances at a glance.

### Budget Visualization

The BudgetVisualization component displays the budget allocation across categories:

```jsx
// src/components/BudgetVisualization.jsx
function BudgetVisualization() {
  const { budgetCategories } = useFinance();
  const [visualizationType, setVisualizationType] = useState('pie');
  
  // Transform budget data for visualization
  const budgetData = useMemo(() => {
    return Object.entries(budgetCategories).map(([category, data]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: data.amount,
      percentage: data.percentage * 100,
      spent: data.spent || 0,
      budget: data.amount,
      remaining: data.remaining || data.amount,
      icon: getCategoryIcon(category)
    }));
  }, [budgetCategories]);
  
  // Render pie chart or bar chart based on visualization type
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Budget Allocation</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setVisualizationType('pie')}
            className={`px-3 py-1 rounded-lg ${
              visualizationType === 'pie' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'
            }`}
          >
            Pie
          </button>
          <button
            onClick={() => setVisualizationType('bar')}
            className={`px-3 py-1 rounded-lg ${
              visualizationType === 'bar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      
      {visualizationType === 'pie' ? renderPieChart(budgetData) : renderBarChart(budgetData)}
    </div>
  );
}
```

## Conclusion

The financial features in Sigmapay provide a comprehensive set of tools for users to manage their finances. By combining income management, budget customization, expense tracking, financial goals, and data visualization, the application helps users gain better control over their financial lives and make informed financial decisions.
