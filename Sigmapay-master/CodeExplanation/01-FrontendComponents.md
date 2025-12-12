# Frontend Components

## Overview

The Sigmapay application is built using a component-based architecture with React. Components are organized into several categories:

1. **Page Components**: Full pages that are rendered at specific routes
2. **Layout Components**: Components that define the structure of pages
3. **UI Components**: Reusable UI elements used across multiple pages
4. **Context Providers**: Components that provide state to the component tree

## Key Components

### Page Components

Page components represent full pages in the application and are rendered by React Router.

#### Dashboard.jsx

The Dashboard is the main interface after login, displaying financial overview and quick access to features.

```jsx
function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    income,
    budgetPlan,
    spendingLimit,
    savingsGoal,
    expenses,
    loading
  } = useFinance();

  // Get recent transactions from expenses
  const recentTransactions = expenses.slice(0, 3).map(expense => ({
    id: expense.id,
    date: expense.date,
    recipient: expense.description,
    amount: expense.amount,
    type: 'expense',
    category: expense.categoryId
  }));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Component rendering...
}
```

Key features:
- Uses authentication context to check if user is logged in
- Uses finance context to get financial data
- Redirects to login page if user is not authenticated
- Displays financial overview, recent transactions, and quick actions

#### Budget.jsx

The Budget page allows users to view and manage their budget.

```jsx
function Budget() {
  // State and context hooks
  // Budget calculations
  // Rendering budget overview, category breakdown, and spending analysis
}
```

### Layout Components

Layout components define the structure of pages and are used to maintain consistent UI across the application.

#### MainLayout.jsx

The main layout component that wraps all pages and includes the navbar and footer.

```jsx
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

#### ProtectedLayout.jsx

A layout component that wraps protected routes and checks authentication.

```jsx
function ProtectedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}
```

### UI Components

UI components are reusable elements used across multiple pages.

#### IncomeInput.jsx

A component for inputting and updating income.

```jsx
function IncomeInput() {
  const { income, updateIncome } = useFinance();
  const [editMode, setEditMode] = useState(false);
  const [incomeValue, setIncomeValue] = useState(income);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateIncome(incomeValue);
    setEditMode(false);
  };

  // Component rendering...
}
```

#### BudgetBreakdown.jsx

A component that visualizes budget allocation across categories.

```jsx
function BudgetBreakdown() {
  const { budgetCategories, income } = useFinance();
  
  // Transform budget data for visualization
  // Render pie chart or bar chart
}
```

#### ExpenseTracker.jsx

A component for tracking and managing expenses.

```jsx
function ExpenseTracker() {
  const { expenses, addUserExpense, deleteExpense } = useFinance();
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });
  
  // Handle form submission
  // Render expense list and form
}
```

## Component Composition

Components are composed together to create the full application. For example, the Dashboard page includes several UI components:

```jsx
function Dashboard() {
  // ...
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overview cards */}
      </div>
      
      {/* Two-column layout for main components */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <IncomeInput />
          <BudgetVisualization />
          <ExpenseTracker />
        </div>
        
        <div className="space-y-4">
          <BudgetCustomizer />
          <FinancialGoals />
          <BudgetBreakdown />
        </div>
      </div>
    </div>
  );
}
```

## Lazy Loading

To improve performance, some components are lazy loaded using React's `lazy` and `Suspense` features:

```jsx
// In App.jsx
import { lazy, Suspense } from 'react';

// Eagerly loaded components
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy loaded components
const Contacts = lazy(() => import('./pages/Contacts'));
const Payments = lazy(() => import('./pages/Payments'));
// ...

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              {/* Routes */}
            </Routes>
          </Suspense>
        </Router>
      </FinanceProvider>
    </AuthProvider>
  );
}
```

## Styling

Components are styled using Tailwind CSS utility classes, with some custom components defined in `index.css`:

```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary;
  }
  
  .card {
    @apply bg-white p-6 rounded-xl shadow-md;
  }
}
```

## Conclusion

The component-based architecture of Sigmapay allows for:
- Reusability of UI elements
- Clear separation of concerns
- Maintainable and testable code
- Efficient rendering through React's virtual DOM
- Improved performance through lazy loading

This approach makes the codebase more maintainable and scalable as new features are added.
