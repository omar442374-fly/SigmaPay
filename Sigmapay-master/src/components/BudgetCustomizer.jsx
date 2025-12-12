import { useState, useEffect } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { DEFAULT_BUDGET_CATEGORIES } from '../utils/finance';

function BudgetCustomizer() {
  const {
    income,
    customBudgetSettings,
    updateBudgetSettings,
    loading
  } = useFinance();

  const [isEditing, setIsEditing] = useState(false);
  const [budgetData, setBudgetData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalPercentage, setTotalPercentage] = useState(100);

  // Initialize budget data from settings or defaults
  useEffect(() => {
    if (!loading) {
      const settings = customBudgetSettings.categories || DEFAULT_BUDGET_CATEGORIES;
      setBudgetData(JSON.parse(JSON.stringify(settings))); // Deep clone

      // Calculate total percentage
      calculateTotalPercentage(settings);
    }
  }, [loading, customBudgetSettings]);

  // Calculate the total percentage of all categories
  const calculateTotalPercentage = (data) => {
    let total = 0;
    Object.values(data || {}).forEach(category => {
      total += category.percentage * 100;
    });
    setTotalPercentage(total);
  };

  // Handle category percentage change
  const handleCategoryChange = (categoryId, value) => {
    const percentage = parseFloat(value) / 100;

    setBudgetData(prev => {
      const updated = { ...prev };
      updated[categoryId].percentage = percentage;

      // Recalculate subcategory percentages proportionally
      const oldCategoryPercentage = prev[categoryId].percentage;
      const ratio = percentage / oldCategoryPercentage;

      updated[categoryId].subcategories = prev[categoryId].subcategories.map(sub => ({
        ...sub,
        percentage: sub.percentage * ratio
      }));

      calculateTotalPercentage(updated);
      return updated;
    });
  };

  // Handle subcategory percentage change
  const handleSubcategoryChange = (categoryId, subcategoryId, value) => {
    const percentage = parseFloat(value) / 100;

    setBudgetData(prev => {
      const updated = { ...prev };
      const categorySubcategories = [...updated[categoryId].subcategories];

      // Find the subcategory index
      const index = categorySubcategories.findIndex(sub => sub.id === subcategoryId);
      if (index !== -1) {
        categorySubcategories[index] = {
          ...categorySubcategories[index],
          percentage
        };
      }

      updated[categoryId].subcategories = categorySubcategories;

      // Update category percentage to sum of subcategories
      let categoryTotal = 0;
      categorySubcategories.forEach(sub => {
        categoryTotal += sub.percentage;
      });

      updated[categoryId].percentage = categoryTotal;

      calculateTotalPercentage(updated);
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate total percentage
      if (Math.abs(totalPercentage - 100) > 0.1) {
        throw new Error(`Total allocation must be 100%. Current total: ${totalPercentage.toFixed(1)}%`);
      }

      // Update budget settings
      await updateBudgetSettings({ categories: budgetData });
      setSuccess('Budget settings updated successfully!');

      // Exit editing mode after successful update
      setTimeout(() => {
        setIsEditing(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Budget Customization</h2>
        <div className="flex justify-center py-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">Budget Customization</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary text-sm px-3 py-1"
          >
            Customize Budget
          </button>
        )}
      </div>

      {!isEditing ? (
        <div>
          <p className="text-gray-600 mb-4">
            Customize how your income is allocated across different categories to better match your financial goals.
          </p>

          <div className="space-y-4">
            {Object.entries(budgetData).map(([key, category]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{category.icon}</span>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {(category.percentage * 100).toFixed(1)}%
                    <span className="text-gray-500 text-sm ml-2">
                      (${Math.round(income * category.percentage).toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-3 pl-6">
                  {category.subcategories.map((sub) => (
                    <div key={sub.id} className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <span className="mr-2">{sub.icon}</span>
                        <span>{sub.name}</span>
                      </div>
                      <div>
                        <span className="text-indigo-600">{(sub.percentage * 100).toFixed(1)}%</span>
                        <span className="text-gray-500 text-xs ml-2">
                          (${Math.round(income * sub.percentage).toLocaleString()})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
              {success}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Total Allocation:</h3>
              <div className={`text-lg font-bold ${Math.abs(totalPercentage - 100) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                {totalPercentage.toFixed(1)}%
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Target: 100%
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {Object.entries(budgetData).map(([key, category]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{category.icon}</span>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={(category.percentage * 100).toFixed(1)}
                        onChange={(e) => handleCategoryChange(key, e.target.value)}
                        className="w-20 text-right input-field py-1 px-2"
                        step="0.1"
                        min="0"
                        max="100"
                        disabled={isSubmitting}
                      />
                      <span className="ml-1">%</span>
                    </div>
                  </div>

                  <div className="space-y-2 pl-6">
                    {category.subcategories.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{sub.icon}</span>
                          <span className="text-sm">{sub.name}</span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={(sub.percentage * 100).toFixed(1)}
                            onChange={(e) => handleSubcategoryChange(key, sub.id, e.target.value)}
                            className="w-20 text-right input-field py-1 px-2 text-sm"
                            step="0.1"
                            min="0"
                            max="100"
                            disabled={isSubmitting}
                          />
                          <span className="ml-1 text-sm">%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || Math.abs(totalPercentage - 100) > 0.1}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default BudgetCustomizer;
