import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getGroups, saveGroup, joinGroup, addContribution } from '../utils/storage';
import { PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { navigateTo } from '../utils/url';

function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    frequency: 'monthly',
    description: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Use navigateTo instead of navigate for direct URL navigation
      navigateTo('login');
      return;
    }
    loadGroups();
  }, [navigate]);

  const loadGroups = () => {
    setGroups(getGroups());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveGroup({
      ...formData,
      target: parseFloat(formData.target)
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      target: '',
      frequency: 'monthly',
      description: ''
    });
    loadGroups();
  };

  const handleJoin = (groupId) => {
    const user = getCurrentUser();
    joinGroup(groupId, user.id);
    loadGroups();
  };

  const handleContribute = (groupId, amount) => {
    const user = getCurrentUser();
    addContribution(groupId, {
      userId: user.id,
      amount: parseFloat(amount)
    });
    loadGroups();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Saving Groups</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => (
          <div key={group.id} className="card">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{group.frequency} contributions</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">{group.description}</p>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">Target Amount</p>
                <p className="text-lg font-semibold">${group.target.toLocaleString()}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">Members</p>
                <p className="text-lg font-semibold">{group.members.length}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">Total Contributions</p>
                <p className="text-lg font-semibold">
                  ${group.contributions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleJoin(group.id)}
                className="flex-1 btn-primary"
              >
                Join Group
              </button>
              <button
                onClick={() => {
                  const amount = prompt('Enter contribution amount:');
                  if (amount) handleContribute(group.id, amount);
                }}
                className="flex-1 btn-primary"
              >
                Contribute
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Saving Group</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="target" className="block text-gray-700 mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  id="target"
                  min="0"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="frequency" className="block text-gray-700 mb-2">
                  Contribution Frequency
                </label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows="3"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;