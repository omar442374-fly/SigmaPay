import { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';

function BudgetVisualization() {
  const { budgetCategories, expenses, income, loading } = useFinance();
  const [activeTab, setActiveTab] = useState('allocation');

  // Use useMemo to prevent recalculations on every render
  const { totalSpent, remainingBudget, percentageSpent } = useMemo(() => {
    // Calculate total spent amount
    const total = Array.isArray(expenses)
      ? expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      : 0;

    // Calculate remaining budget
    const remaining = income - total;

    // Calculate percentage spent
    const percentage = income > 0 ? (total / income) * 100 : 0;

    return { totalSpent: total, remainingBudget: remaining, percentageSpent: percentage };
  }, [expenses, income]);

  // Prepare data for pie chart - memoized to prevent recalculations
  const allocationData = useMemo(() => {
    if (!budgetCategories || Object.keys(budgetCategories).length === 0) {
      return [];
    }

    return Object.values(budgetCategories).map(category => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      value: category.amount,
      percentage: category.percentage * 100
    }));
  }, [budgetCategories]);

  // Prepare data for spending chart - memoized to prevent recalculations
  const spendingData = useMemo(() => {
    if (!budgetCategories || Object.keys(budgetCategories).length === 0) {
      return [];
    }

    const spendingByCategory = {};

    // Initialize with zero values
    Object.entries(budgetCategories).forEach(([key, category]) => {
      spendingByCategory[key] = {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        spent: 0,
        budget: category.amount,
        percentage: 0
      };
    });

    // Add up expenses by category
    if (Array.isArray(expenses)) {
      expenses.forEach(expense => {
        if (spendingByCategory[expense.categoryId]) {
          spendingByCategory[expense.categoryId].spent += expense.amount || 0;
        }
      });
    }

    // Calculate percentages
    Object.values(spendingByCategory).forEach(category => {
      category.percentage = category.budget > 0
        ? (category.spent / category.budget) * 100
        : 0;
    });

    return Object.values(spendingByCategory);
  }, [budgetCategories, expenses]);

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
            const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
            const endAngle = (segment.endAngle - 90) * (Math.PI / 180);

            // Calculate path
            const x1 = 50 + 40 * Math.cos(startAngle);
            const y1 = 50 + 40 * Math.sin(startAngle);
            const x2 = 50 + 40 * Math.cos(endAngle);
            const y2 = 50 + 40 * Math.sin(endAngle);

            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

            // Create path
            const path = `
              M 50 50
              L ${x1} ${y1}
              A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            return (
              <path
                key={index}
                d={path}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="1"
              />
            );
          })}

          <circle cx="50" cy="50" r="20" fill="white" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">${total.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Total Budget</div>
          </div>
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
                className={`h-2.5 rounded-full ${item.percentage > 100
                  ? 'bg-red-500'
                  : item.percentage > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                  }`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{item.percentage.toFixed(1)}% spent</span>
              <span>${(item.budget - item.spent).toLocaleString()} remaining</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Visualization</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Budget Visualization</h2>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'allocation'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('allocation')}
        >
          Budget Allocation
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'spending'
            ? 'text-indigo-600 border-b-2 border-indigo-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
          onClick={() => setActiveTab('spending')}
        >
          Spending Analysis
        </button>
      </div>

      {activeTab === 'allocation' ? (
        <div>
          <div className="mb-6">
            {allocationData.length > 0 ? (
              renderPieChart(allocationData)
            ) : (
              <p className="text-center text-gray-500 py-4">
                No budget data available. Please set your income to generate a budget.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {allocationData.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="text-sm">
                  <span className="mr-1">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                  <span className="text-gray-500 ml-1">
                    ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 mb-1">Total Budget</div>
              <div className="text-2xl font-bold text-blue-800">${income.toLocaleString()}</div>
            </div>

            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-sm text-red-600 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-red-800">${totalSpent.toLocaleString()}</div>
            </div>

            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 mb-1">Remaining</div>
              <div className="text-2xl font-bold text-green-800">${remainingBudget.toLocaleString()}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Budget Used: {percentageSpent.toFixed(1)}%</span>
              <span>${totalSpent.toLocaleString()} of ${income.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${percentageSpent > 100
                  ? 'bg-red-500'
                  : percentageSpent > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                  }`}
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Spending by Category</h3>
            {Array.isArray(expenses) && expenses.length > 0 ? (
              renderBarChart(spendingData)
            ) : (
              <p className="text-center text-gray-500 py-4">
                No expenses recorded yet. Add expenses to see your spending analysis.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetVisualization;
