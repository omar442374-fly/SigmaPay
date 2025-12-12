# Data Visualization

## Overview

Data visualization is a critical component of Sigmapay, helping users understand their financial data through interactive charts and graphs. The application uses a combination of the Recharts library and custom SVG-based visualizations to present financial information in an intuitive and visually appealing way.

## Visualization Libraries

### Recharts

Recharts is the primary library used for data visualization in Sigmapay. It's a composable charting library built on React components, making it a natural fit for the React-based application.

Key benefits of Recharts:
- Declarative API that integrates well with React
- Responsive design that adapts to different screen sizes
- Customizable appearance and behavior
- Support for various chart types (bar, pie, line, area, etc.)
- Smooth animations and interactions

### Custom SVG Visualizations

In addition to Recharts, the application includes custom SVG-based visualizations for specific use cases. These are implemented using React components that generate SVG elements directly, providing maximum flexibility for custom visualizations.

## Key Visualization Components

### 1. Budget Breakdown (Pie Chart)

The budget breakdown visualization shows how the user's budget is allocated across different categories using a pie chart.

```jsx
// src/components/BudgetBreakdown.jsx (partial)
function BudgetBreakdown() {
  const { budgetCategories } = useFinance();
  
  // Transform budget data for the pie chart
  const data = Object.entries(budgetCategories).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: data.amount,
    fill: getCategoryColor(category)
  }));
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### 2. Expense Trends (Line Chart)

The expense trends visualization shows how expenses have changed over time using a line chart.

```jsx
// src/components/ExpenseTrends.jsx (partial)
function ExpenseTrends() {
  const { expenses } = useFinance();
  
  // Group expenses by month
  const monthlyExpenses = useMemo(() => {
    const grouped = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[month]) {
        grouped[month] = 0;
      }
      
      grouped[month] += expense.amount;
    });
    
    // Convert to array and sort by month
    return Object.entries(grouped)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses]);
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Expense Trends</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### 3. Budget vs. Actual (Bar Chart)

The budget vs. actual visualization compares budgeted amounts to actual spending using a bar chart.

```jsx
// src/components/BudgetVsActual.jsx (partial)
function BudgetVsActual() {
  const { budgetCategories } = useFinance();
  
  // Transform budget data for the bar chart
  const data = Object.entries(budgetCategories).map(([category, data]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    budget: data.amount,
    actual: data.spent || 0
  }));
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Budget vs. Actual</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### 4. Financial Health Score (Gauge)

The financial health score visualization displays the user's financial health score using a custom gauge component.

```jsx
// src/components/FinancialHealthScore.jsx (partial)
function FinancialHealthScore() {
  const { financialHealthScore } = useFinance();
  
  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };
  
  // Calculate gauge parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - financialHealthScore / 100);
  const scoreColor = getScoreColor(financialHealthScore);
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Financial Health Score</h3>
      
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
            />
            
            {/* Score circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            
            {/* Score text */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="36"
              fontWeight="bold"
              fill={scoreColor}
            >
              {financialHealthScore}
            </text>
            
            <text
              x="100"
              y="130"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill="#6B7280"
            >
              out of 100
            </text>
          </svg>
        </div>
      </div>
      
      {/* Score interpretation */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">What this means:</h4>
        <p className="text-gray-600">
          {financialHealthScore >= 80 ? (
            'Excellent! Your finances are in great shape.'
          ) : financialHealthScore >= 60 ? (
            'Good. You\'re on the right track, but there\'s room for improvement.'
          ) : (
            'Needs attention. Consider adjusting your budget and spending habits.'
          )}
        </p>
      </div>
    </div>
  );
}
```

### 5. Budget Visualization (Custom Component)

The BudgetVisualization component provides both pie chart and bar chart views of the budget allocation.

```jsx
// src/components/BudgetVisualization.jsx (partial)
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
  
  // Render pie chart
  const renderPieChart = (data) => {
    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Calculate segments
    let cumulativePercentage = 0;
    const segments = data.map(item => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const startAngle = cumulativePercentage * 3.6; // 3.6 degrees per percentage point
      cumulativePercentage += percentage;
      const endAngle = cumulativePercentage * 3.6;

      return {
        ...item,
        startAngle,
        endAngle,
        percentage
      };
    });

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="#f3f4f6" />
          
          {segments.map((segment, index) => {
            // Convert angles to radians
            const startAngleRad = (segment.startAngle - 90) * Math.PI / 180;
            const endAngleRad = (segment.endAngle - 90) * Math.PI / 180;
            
            // Calculate path
            const x1 = 50 + 40 * Math.cos(startAngleRad);
            const y1 = 50 + 40 * Math.sin(startAngleRad);
            const x2 = 50 + 40 * Math.cos(endAngleRad);
            const y2 = 50 + 40 * Math.sin(endAngleRad);
            
            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
            
            // Create path
            const path = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            return (
              <path
                key={index}
                d={path}
                fill={getCategoryColor(segment.name.toLowerCase())}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">${total.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Budget</div>
        </div>
      </div>
    );
  };
  
  // Render bar chart
  const renderBarChart = (data) => {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">${item.spent.toLocaleString()}</span>
                <span className="text-gray-500"> / ${item.budget.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${Math.min(100, (item.spent / item.budget) * 100)}%`,
                  backgroundColor: getCategoryColor(item.name.toLowerCase())
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
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

## Utility Functions for Visualization

The application includes utility functions to support visualizations, such as getting colors and icons for different categories:

```jsx
// src/utils/visualization.js
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  LightBulbIcon,
  HeartIcon,
  FilmIcon,
  BanknotesIcon,
  EllipsisHorizontalCircleIcon
} from '@heroicons/react/24/outline';

// Get color for a category
export const getCategoryColor = (category) => {
  const colors = {
    housing: '#8884d8',
    food: '#82ca9d',
    transportation: '#ffc658',
    utilities: '#ff8042',
    healthcare: '#0088fe',
    entertainment: '#00c49f',
    savings: '#ffbb28',
    other: '#ff8042'
  };
  
  return colors[category.toLowerCase()] || colors.other;
};

// Get icon for a category
export const getCategoryIcon = (category) => {
  const icons = {
    housing: <HomeIcon className="h-5 w-5" />,
    food: <ShoppingBagIcon className="h-5 w-5" />,
    transportation: <TruckIcon className="h-5 w-5" />,
    utilities: <LightBulbIcon className="h-5 w-5" />,
    healthcare: <HeartIcon className="h-5 w-5" />,
    entertainment: <FilmIcon className="h-5 w-5" />,
    savings: <BanknotesIcon className="h-5 w-5" />,
    other: <EllipsisHorizontalCircleIcon className="h-5 w-5" />
  };
  
  return icons[category.toLowerCase()] || icons.other;
};
```

## Responsive Design

All visualizations in Sigmapay are designed to be responsive, adapting to different screen sizes. This is achieved through:

1. **ResponsiveContainer**: Recharts components are wrapped in ResponsiveContainer to adapt to parent container size
2. **Flexible layouts**: CSS Grid and Flexbox are used to create responsive layouts
3. **Mobile-first approach**: Visualizations are designed for mobile first, then enhanced for larger screens

## Conclusion

Data visualization is a key feature of Sigmapay, helping users understand their financial data through interactive and visually appealing charts and graphs. By combining the power of Recharts with custom SVG-based visualizations, the application provides a rich and intuitive visual experience that enhances the user's understanding of their financial situation.
