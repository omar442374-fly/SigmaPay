import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';

function BudgetBreakdown() {
  const { budgetCategories, income } = useFinance();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryKey) => {
    if (expandedCategory === categoryKey) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryKey);
    }
  };

  // If no budget categories or income is 0, show a message
  if (!budgetCategories || Object.keys(budgetCategories).length === 0 || income === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Budget Breakdown</h2>
        <p className="text-gray-600">
          Please set your monthly income to see your budget breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Budget Breakdown</h2>

      <div className="space-y-4">
        {Object.keys(budgetCategories).map((categoryKey) => {
          const category = budgetCategories[categoryKey];
          const isExpanded = expandedCategory === categoryKey;

          return (
            <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-gray-50"
                onClick={() => toggleCategory(categoryKey)}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 text-indigo-600 font-medium">${category.amount.toLocaleString()}</span>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1">
                  <div className="text-sm text-gray-500 mb-3">
                    {category.percentage}% of your monthly income
                  </div>

                  <div className="space-y-2">
                    {category.subcategories.map((subcategory, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{subcategory.name}</span>
                        <div className="text-right">
                          <span className="text-indigo-600 font-medium">${subcategory.amount.toLocaleString()}</span>
                          <span className="text-gray-500 text-xs ml-1">({subcategory.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>This budget breakdown is based on your monthly income of ${income.toLocaleString()}.</p>
        <p className="mt-2">Adjust your income to see how it affects your budget allocation.</p>
      </div>
    </div>
  );
}

export default BudgetBreakdown;
