import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { getContacts } from '../utils/storage';
import {
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

function AutoPay() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: 'Primary Checking Account', type: 'bank', last4: '4567' },
    { id: 2, name: 'SigmaPay Platinum', type: 'card', last4: '4589' },
    { id: 3, name: 'SigmaPay Rewards', type: 'card', last4: '7821' }
  ]);

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    paymentMethod: '',
    category: '',
    description: '',
    dayOfMonth: '1'
  });

  const [autoPayments, setAutoPayments] = useState([
    {
      id: 1,
      recipient: 'Mohamed Ibrahim',
      amount: 1200.00,
      frequency: 'monthly',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      nextPaymentDate: '2024-05-01',
      paymentMethod: 'Primary Checking Account',
      category: 'Housing',
      description: 'Rent payment',
      status: 'active',
      dayOfMonth: '1'
    },
    {
      id: 2,
      recipient: 'Andrew Gamal',
      amount: 125.50,
      frequency: 'monthly',
      startDate: '2024-01-15',
      endDate: null,
      nextPaymentDate: '2024-05-15',
      paymentMethod: 'SigmaPay Platinum',
      category: 'Utilities',
      description: 'Electricity bill',
      status: 'active',
      dayOfMonth: '15'
    },
    {
      id: 3,
      recipient: 'Omar Aly',
      amount: 79.99,
      frequency: 'monthly',
      startDate: '2024-02-20',
      endDate: null,
      nextPaymentDate: '2024-05-20',
      paymentMethod: 'SigmaPay Rewards',
      category: 'Utilities',
      description: 'Internet service',
      status: 'active',
      dayOfMonth: '20'
    },
    {
      id: 4,
      recipient: 'Ammar Eid',
      amount: 9.99,
      frequency: 'monthly',
      startDate: '2024-03-05',
      endDate: '2024-09-05',
      nextPaymentDate: '2024-05-05',
      paymentMethod: 'SigmaPay Rewards',
      category: 'Entertainment',
      description: 'Streaming service',
      status: 'active',
      dayOfMonth: '5'
    },
    {
      id: 5,
      recipient: 'Mohamed Ibrahim',
      amount: 50.00,
      frequency: 'weekly',
      startDate: '2024-01-07',
      endDate: '2024-04-01',
      nextPaymentDate: null,
      paymentMethod: 'Primary Checking Account',
      category: 'Other',
      description: 'Weekly allowance',
      status: 'completed',
      dayOfMonth: null
    }
  ]);

  const PAYMENT_CATEGORIES = [
    'Housing',
    'Utilities',
    'Transportation',
    'Food',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Debt',
    'Savings',
    'Other'
  ];

  const FREQUENCY_OPTIONS = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' }
  ];

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setContacts(getContacts());

    // Set default start date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, startDate: formattedDate }));
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing auto-pay
      const updatedPayments = autoPayments.map(payment => 
        payment.id === editingId ? { ...payment, ...formData, id: editingId } : payment
      );
      setAutoPayments(updatedPayments);
      setEditingId(null);
    } else {
      // Add new auto-pay
      const newPayment = {
        ...formData,
        id: Date.now(),
        status: 'active',
        nextPaymentDate: calculateNextPaymentDate(formData.startDate, formData.frequency, formData.dayOfMonth)
      };
      setAutoPayments([...autoPayments, newPayment]);
    }
    
    // Reset form
    setFormData({
      recipient: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      paymentMethod: '',
      category: '',
      description: '',
      dayOfMonth: '1'
    });
    setShowAddForm(false);
  };

  const handleEdit = (payment) => {
    setFormData({
      recipient: payment.recipient,
      amount: payment.amount,
      frequency: payment.frequency,
      startDate: payment.startDate,
      endDate: payment.endDate || '',
      paymentMethod: payment.paymentMethod,
      category: payment.category,
      description: payment.description,
      dayOfMonth: payment.dayOfMonth || '1'
    });
    setEditingId(payment.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this auto-payment?')) {
      setAutoPayments(autoPayments.filter(payment => payment.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({
      recipient: '',
      amount: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      paymentMethod: '',
      category: '',
      description: '',
      dayOfMonth: '1'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const calculateNextPaymentDate = (startDate, frequency, dayOfMonth) => {
    const start = new Date(startDate);
    const today = new Date();
    let nextDate = new Date(start);
    
    // Adjust the day of month for monthly payments
    if (frequency === 'monthly' && dayOfMonth) {
      nextDate.setDate(parseInt(dayOfMonth));
    }
    
    // If the start date is in the past, calculate the next payment date
    if (nextDate < today) {
      switch (frequency) {
        case 'weekly':
          while (nextDate < today) {
            nextDate.setDate(nextDate.getDate() + 7);
          }
          break;
        case 'biweekly':
          while (nextDate < today) {
            nextDate.setDate(nextDate.getDate() + 14);
          }
          break;
        case 'monthly':
          while (nextDate < today) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          break;
        case 'quarterly':
          while (nextDate < today) {
            nextDate.setMonth(nextDate.getMonth() + 3);
          }
          break;
        case 'annually':
          while (nextDate < today) {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
          }
          break;
        default:
          break;
      }
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'paused':
        return <ClockIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed':
        return <ExclamationCircleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'bank':
        return <BanknotesIcon className="w-5 h-5" />;
      case 'card':
        return <CreditCardIcon className="w-5 h-5" />;
      default:
        return <BanknotesIcon className="w-5 h-5" />;
    }
  };

  const renderAutoPayments = (payments) => {
    return payments.map(payment => (
      <div key={payment.id} className="card hover:shadow-md transition-shadow mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${payment.category === 'Utilities' ? 'bg-blue-100 text-blue-600' : payment.category === 'Housing' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
              <ArrowPathIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-lg">{payment.description}</h4>
              <p className="text-gray-500">{payment.recipient}</p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                </span>
                <span className="ml-2 text-gray-500 text-sm">{payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center">
            <div className="text-right mr-6">
              <p className="text-gray-500 text-sm">Amount</p>
              <p className="text-xl font-semibold">${payment.amount.toFixed(2)}</p>
              {payment.nextPaymentDate && (
                <p className="text-gray-500 text-sm flex items-center justify-end">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Next: {new Date(payment.nextPaymentDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex space-x-2 mt-2 md:mt-0">
              <button 
                onClick={() => handleEdit(payment)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                title="Edit"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDelete(payment.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title="Delete"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-4">
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>
              <p className="flex items-center">
                {getPaymentMethodIcon(payment.paymentMethod.includes('Card') ? 'card' : 'bank')}
                <span className="ml-1">{payment.paymentMethod}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Category</p>
              <p>{payment.category}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Start Date</p>
              <p>{new Date(payment.startDate).toLocaleDateString()}</p>
            </div>
            {payment.endDate && (
              <div>
                <p className="text-gray-500 text-sm">End Date</p>
                <p>{new Date(payment.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        const activePayments = autoPayments.filter(payment => payment.status === 'active');
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Active Auto-Payments</h3>
                <p className="text-gray-600">
                  Total: ${activePayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)} per month
                </p>
              </div>
              <button 
                className="btn-primary flex items-center"
                onClick={() => setShowAddForm(true)}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Set Up Auto-Pay
              </button>
            </div>
            
            {activePayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No active auto-payments found.</p>
                <button 
                  className="mt-4 text-indigo-600 font-medium"
                  onClick={() => setShowAddForm(true)}
                >
                  Set up your first auto-payment
                </button>
              </div>
            ) : (
              renderAutoPayments(activePayments)
            )}
          </div>
        );
      
      case 'history':
        const completedPayments = autoPayments.filter(payment => payment.status === 'completed');
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Completed Auto-Payments</h3>
            
            {completedPayments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed auto-payments found.</p>
              </div>
            ) : (
              renderAutoPayments(completedPayments)
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Auto-Pay Management</h1>
        <p className="mt-2 text-gray-600">Set up recurring payments to automatically pay your bills and send money.</p>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'active' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Auto-Payments
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
        </nav>
      </div>
      
      {showAddForm ? (
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Auto-Payment' : 'Set Up New Auto-Payment'}</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCancel}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="recipient" className="block text-gray-700 mb-2">
                  Recipient
                </label>
                <select
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a recipient</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.name}>
                      {contact.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="input-field pl-8"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="frequency" className="block text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {FREQUENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {formData.frequency === 'monthly' && (
                <div>
                  <label htmlFor="dayOfMonth" className="block text-gray-700 mb-2">
                    Day of Month
                  </label>
                  <select
                    id="dayOfMonth"
                    name="dayOfMonth"
                    value={formData.dayOfMonth}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label htmlFor="startDate" className="block text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="block text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a payment method</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.name}>
                      {method.name} {method.type === 'bank' ? '(Account)' : '(Card)'} •••• {method.last4}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {PAYMENT_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Rent payment, Utility bill, etc."
                  required
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingId ? 'Update Auto-Payment' : 'Set Up Auto-Payment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        renderTabContent()
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
        <h3 className="text-lg font-medium text-blue-800 mb-2">About Auto-Pay</h3>
        <p className="text-blue-700 mb-2">
          Auto-Pay allows you to set up recurring payments that will be automatically processed on the schedule you choose.
        </p>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>You can pause or cancel auto-payments at any time</li>
          <li>You'll receive notifications before each payment is processed</li>
          <li>For monthly payments, you can select which day of the month the payment should occur</li>
          <li>All auto-payments are secured with the same protection as regular payments</li>
        </ul>
      </div>
    </div>
  );
}

export default AutoPay;
