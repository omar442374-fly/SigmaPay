import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';

function IncomeInput() {
  const { income, updateIncome } = useFinance();
  const [inputIncome, setInputIncome] = useState(income);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEdit = () => {
    setInputIncome(income);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    if (!inputIncome || inputIncome <= 0) {
      setError('Please enter a valid income amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateIncome(inputIncome);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update income. Please try again.');
      console.error('Error updating income:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Monthly Income</h2>

      {isEditing ? (
        <div>
          <div className="mb-4">
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your monthly income
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="income"
                id="income"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                value={inputIncome}
                onChange={(e) => setInputIncome(Number(e.target.value))}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold text-indigo-600">${income.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Your monthly income</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Your budget is calculated based on your monthly income. Update your income to see how it affects your budget allocation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomeInput;
