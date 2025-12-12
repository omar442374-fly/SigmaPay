import { useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';

function FinancialGoals() {
  const {
    financialGoals,
    addUserFinancialGoal,
    updateUserFinancialGoal,
    deleteFinancialGoal,
    loading
  } = useFinance();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    targetDate: '',
    category: '',
    description: ''
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const goalCategories = [
    { id: 'emergency', name: 'Emergency Fund', icon: '🛟' },
    { id: 'retirement', name: 'Retirement', icon: '👴' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'home', name: 'Home Purchase', icon: '🏠' },
    { id: 'car', name: 'Vehicle', icon: '🚗' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'wedding', name: 'Wedding', icon: '💍' },
    { id: 'debt', name: 'Debt Payoff', icon: '💳' },
    { id: 'other', name: 'Other', icon: '🎯' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'targetAmount' || name === 'currentAmount'
        ? parseFloat(value) || ''
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate form data
      if (!formData.name) {
        throw new Error('Please enter a goal name');
      }

      if (!formData.targetAmount || formData.targetAmount <= 0) {
        throw new Error('Please enter a valid target amount');
      }

      if (formData.currentAmount < 0) {
        throw new Error('Current amount cannot be negative');
      }

      if (!formData.category) {
        throw new Error('Please select a category');
      }

      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        progress: Math.min(
          Math.round((parseFloat(formData.currentAmount) || 0) / parseFloat(formData.targetAmount) * 100),
          100
        )
      };

      if (editingGoalId) {
        // Update existing goal
        await updateUserFinancialGoal(editingGoalId, goalData);
        setSuccess('Goal updated successfully!');
      } else {
        // Add new goal
        await addUserFinancialGoal(goalData);
        setSuccess('Goal added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: 0,
        targetDate: '',
        category: '',
        description: ''
      });
      setEditingGoalId(null);

      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount || 0,
      targetDate: goal.targetDate || '',
      category: goal.category || '',
      description: goal.description || ''
    });
    setEditingGoalId(goal.id);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteFinancialGoal(goalId);
        setSuccess('Goal deleted successfully!');

        setTimeout(() => {
          setSuccess('');
        }, 2000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleContribution = async (goal, amount) => {
    try {
      const newAmount = goal.currentAmount + amount;
      const newProgress = Math.min(Math.round(newAmount / goal.targetAmount * 100), 100);

      await updateUserFinancialGoal(goal.id, {
        currentAmount: newAmount,
        progress: newProgress
      });

      setSuccess(`Added $${amount} to ${goal.name}!`);

      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-gray-800">Financial Goals</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingGoalId(null);
            setFormData({
              name: '',
              targetAmount: '',
              currentAmount: 0,
              targetDate: '',
              category: '',
              description: ''
            });
          }}
          className="btn-primary text-sm px-3 py-1"
        >
          {showForm && !editingGoalId ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

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

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {editingGoalId ? 'Edit Goal' : 'Add New Goal'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Emergency Fund"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {goalCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Amount ($)
                </label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                Target Date (Optional)
              </label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                className="input-field"
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="2"
                placeholder="Why is this goal important to you?"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              {editingGoalId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoalId(null);
                  }}
                  className="btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : editingGoalId ? 'Update Goal' : 'Add Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : financialGoals.length > 0 ? (
          <div className="space-y-4">
            {financialGoals.map((goal) => {
              const category = goalCategories.find(c => c.id === goal.category) || { icon: '🎯', name: 'Goal' };
              const progressColor =
                goal.progress >= 100 ? 'bg-green-500' :
                  goal.progress >= 75 ? 'bg-blue-500' :
                    goal.progress >= 50 ? 'bg-yellow-500' :
                      'bg-indigo-500';

              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <h3 className="font-medium text-lg">{goal.name}</h3>
                      </div>
                      {goal.description && (
                        <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-gray-500 hover:text-indigo-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress: {goal.progress}%</span>
                      <span>${goal.currentAmount?.toLocaleString() || 0} of ${goal.targetAmount?.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${progressColor} h-2.5 rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {goal.targetDate && (
                    <div className="mt-2 text-sm text-gray-600">
                      Target date: {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}

                  {goal.progress < 100 && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleContribution(goal, 10)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                      >
                        +$10
                      </button>
                      <button
                        onClick={() => handleContribution(goal, 50)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                      >
                        +$50
                      </button>
                      <button
                        onClick={() => handleContribution(goal, 100)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
                      >
                        +$100
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">You haven't set any financial goals yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialGoals;
