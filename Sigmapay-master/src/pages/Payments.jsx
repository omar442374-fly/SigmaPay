import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getContacts, saveTransaction } from '../utils/storage';
import { useFinance } from '../contexts/FinanceContext';

const PAYMENT_CATEGORIES = [
  'Transfer',
  'Shopping',
  'Bills',
  'Entertainment',
  'Food',
  'Transportation',
  'Other'
];

function Payments() {
  const navigate = useNavigate();
  const { addUserExpense } = useFinance();
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    category: '',
    notes: ''
  });
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setContacts(getContacts());
  }, [navigate]);

  // Map payment categories to budget categories
  const mapCategoryToBudget = (paymentCategory) => {
    const categoryMap = {
      'Shopping': 'shopping',
      'Bills': 'utilities',
      'Entertainment': 'entertainment',
      'Food': 'food',
      'Transportation': 'transportation',
      'Transfer': 'other',
      'Other': 'other'
    };
    return categoryMap[paymentCategory] || 'other';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isReviewing) {
      setIsReviewing(true);
      return;
    }

    try {
      // Save the transaction
      const transaction = saveTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        type: 'payment'
      });

      // Add the payment as an expense to update the budget
      await addUserExpense({
        description: `Payment to ${formData.recipient}`,
        amount: parseFloat(formData.amount),
        categoryId: mapCategoryToBudget(formData.category),
        date: new Date().toISOString(),
        paymentId: transaction.id
      });

      setSuccess('Payment successful!');

      // Navigate to receipt page after a short delay to show success message
      setTimeout(() => {
        navigate(`/receipt/${transaction.id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while processing your payment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isReviewing ? 'Review Payment' : 'Make a Payment'}
      </h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="recipient" className="block text-gray-700 mb-2">
              Recipient
            </label>
            <select
              id="recipient"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="input-field"
              required
              disabled={isReviewing}
            >
              <option value="">Select a recipient</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.name}>
                  {contact.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              required
              disabled={isReviewing}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
              disabled={isReviewing}
            >
              <option value="">Select a category</option>
              {PAYMENT_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              disabled={isReviewing}
            />
          </div>

          {isReviewing ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <span className="font-medium">Recipient:</span> {formData.recipient}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Amount:</span> ${parseFloat(formData.amount).toFixed(2)}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Category:</span> {formData.category}
                </p>
                {formData.notes && (
                  <p className="mb-2">
                    <span className="font-medium">Notes:</span> {formData.notes}
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end space-x-4">
            {isReviewing && (
              <button
                type="button"
                onClick={() => setIsReviewing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Edit Payment
              </button>
            )}
            <button type="submit" className="btn-primary">
              {isReviewing ? 'Confirm Payment' : 'Review Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payments;