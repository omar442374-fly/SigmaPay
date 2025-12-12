import { useState } from 'react';
import { 
  ReceiptRefundIcon, 
  PlusIcon, 
  CalendarIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

function Bills() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  
  const [bills] = useState([
    {
      id: 1,
      name: 'Electricity Bill',
      amount: 125.50,
      dueDate: '2024-05-15',
      category: 'Utilities',
      payee: 'Power Company',
      status: 'upcoming',
      recurring: true,
      frequency: 'monthly',
      autopay: true
    },
    {
      id: 2,
      name: 'Internet Service',
      amount: 79.99,
      dueDate: '2024-05-20',
      category: 'Utilities',
      payee: 'Internet Provider',
      status: 'upcoming',
      recurring: true,
      frequency: 'monthly',
      autopay: true
    },
    {
      id: 3,
      name: 'Rent Payment',
      amount: 1200.00,
      dueDate: '2024-06-01',
      category: 'Housing',
      payee: 'Property Management',
      status: 'upcoming',
      recurring: true,
      frequency: 'monthly',
      autopay: false
    },
    {
      id: 4,
      name: 'Phone Bill',
      amount: 65.00,
      dueDate: '2024-05-18',
      category: 'Utilities',
      payee: 'Mobile Carrier',
      status: 'upcoming',
      recurring: true,
      frequency: 'monthly',
      autopay: true
    },
    {
      id: 5,
      name: 'Water Bill',
      amount: 45.75,
      dueDate: '2024-05-25',
      category: 'Utilities',
      payee: 'Water Company',
      status: 'upcoming',
      recurring: true,
      frequency: 'monthly',
      autopay: false
    }
  ]);
  
  const [paymentHistory] = useState([
    {
      id: 101,
      billName: 'Electricity Bill',
      amount: 118.25,
      paymentDate: '2024-04-15',
      category: 'Utilities',
      payee: 'Power Company',
      status: 'completed',
      paymentMethod: 'Bank Account'
    },
    {
      id: 102,
      billName: 'Internet Service',
      amount: 79.99,
      paymentDate: '2024-04-20',
      category: 'Utilities',
      payee: 'Internet Provider',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 103,
      billName: 'Rent Payment',
      amount: 1200.00,
      paymentDate: '2024-04-01',
      category: 'Housing',
      payee: 'Property Management',
      status: 'completed',
      paymentMethod: 'Bank Account'
    },
    {
      id: 104,
      billName: 'Phone Bill',
      amount: 65.00,
      paymentDate: '2024-04-18',
      category: 'Utilities',
      payee: 'Mobile Carrier',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 105,
      billName: 'Water Bill',
      amount: 42.50,
      paymentDate: '2024-04-25',
      category: 'Utilities',
      payee: 'Water Company',
      status: 'completed',
      paymentMethod: 'Bank Account'
    }
  ]);
  
  const upcomingBills = bills.filter(bill => bill.status === 'upcoming');
  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const autopayBills = bills.filter(bill => bill.autopay);
  const totalAutopay = autopayBills.reduce((sum, bill) => sum + bill.amount, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Upcoming Bills</h3>
                <p className="text-gray-600">Total: ${totalUpcoming.toFixed(2)}</p>
              </div>
              <button 
                className="btn-primary flex items-center"
                onClick={() => setShowAddBillForm(true)}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add New Bill
              </button>
            </div>
            
            {showAddBillForm && (
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Add New Bill</h4>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowAddBillForm(false)}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bill Name</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="e.g. Electricity Bill"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input 
                        type="number" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>Utilities</option>
                      <option>Housing</option>
                      <option>Insurance</option>
                      <option>Subscriptions</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payee</label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="e.g. Power Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recurring</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="recurring" 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="recurring" 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>Monthly</option>
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                      <option>Quarterly</option>
                      <option>Annually</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto-pay</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="autopay" 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="autopay" 
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowAddBillForm(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn-primary">
                    Save Bill
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {upcomingBills.map((bill) => {
                const dueDate = new Date(bill.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                
                let statusColor = 'bg-yellow-100 text-yellow-800';
                let statusIcon = ClockIcon;
                
                if (daysUntilDue <= 3) {
                  statusColor = 'bg-red-100 text-red-800';
                  statusIcon = ExclamationCircleIcon;
                } else if (daysUntilDue > 7) {
                  statusColor = 'bg-green-100 text-green-800';
                  statusIcon = CheckCircleIcon;
                }
                
                return (
                  <div key={bill.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${bill.category === 'Utilities' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                          <ReceiptRefundIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg">{bill.name}</h4>
                          <p className="text-gray-500">{bill.payee}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                              <statusIcon className="h-3 w-3 mr-1" />
                              {daysUntilDue === 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `Due in ${daysUntilDue} days`}
                            </span>
                            {bill.recurring && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <ArrowPathIcon className="h-3 w-3 mr-1" />
                                {bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1)}
                              </span>
                            )}
                            {bill.autopay && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Auto-pay
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div className="text-right mr-6">
                          <p className="text-gray-500 text-sm">Amount</p>
                          <p className="text-xl font-semibold">${bill.amount.toFixed(2)}</p>
                          <p className="text-gray-500 text-sm">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                        </div>
                        <button className="btn-primary">
                          {bill.autopay ? 'Manage' : 'Pay Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'autopay':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Auto-Pay Bills</h3>
                <p className="text-gray-600">Total: ${totalAutopay.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Auto-Pay Settings</h4>
              <p className="text-gray-600 mb-4">
                Auto-pay ensures your bills are paid on time without manual intervention. You can set up auto-pay for recurring bills and specify payment methods.
              </p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Default Payment Method</h5>
                      <p className="text-sm text-gray-500">SigmaPay Platinum Card (•••• 4589)</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                    Change
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Payment Timing</h5>
                      <p className="text-sm text-gray-500">Pay bills 2 days before due date</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                    Change
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <BellAlertIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Payment Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications before and after payments</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                    Change
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Auto-Pay Bills</h4>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {autopayBills.map((bill) => (
                      <tr key={bill.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{bill.name}</div>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Auto-pay
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{bill.payee}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${bill.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bill.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bill.frequency.charAt(0).toUpperCase() + bill.frequency.slice(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          SigmaPay Platinum Card
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Disable</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Payment History</h3>
              <div className="flex space-x-2">
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                  <option>All Categories</option>
                  <option>Utilities</option>
                  <option>Housing</option>
                  <option>Insurance</option>
                  <option>Subscriptions</option>
                </select>
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.billName}</div>
                          <div className="text-sm text-gray-500">{payment.payee}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Receipt</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 5 of 24 payments</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border rounded text-sm">Previous</button>
                  <button className="px-3 py-1 border rounded bg-indigo-50 text-indigo-600 text-sm">1</button>
                  <button className="px-3 py-1 border rounded text-sm">2</button>
                  <button className="px-3 py-1 border rounded text-sm">3</button>
                  <button className="px-3 py-1 border rounded text-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bill Management</h1>
        <p className="mt-2 text-gray-600">Manage, schedule, and pay your bills in one place.</p>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'upcoming' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Bills
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'autopay' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('autopay')}
          >
            Auto-Pay
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </div>
  );
}

export default Bills;
