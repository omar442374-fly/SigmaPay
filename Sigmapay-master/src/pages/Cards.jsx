import { useState } from 'react';
import { 
  CreditCardIcon, 
  LockClosedIcon, 
  BellAlertIcon, 
  PlusIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function Cards() {
  const [activeTab, setActiveTab] = useState('physical');
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  const [physicalCards] = useState([
    {
      id: 1,
      name: 'SigmaPay Platinum',
      number: '•••• •••• •••• 4589',
      expiry: '05/27',
      cvv: '•••',
      type: 'Visa',
      status: 'active',
      limit: 5000,
      balance: 1250.75,
      color: 'bg-gradient-to-r from-gray-800 to-gray-900'
    },
    {
      id: 2,
      name: 'SigmaPay Rewards',
      number: '•••• •••• •••• 7821',
      expiry: '09/25',
      cvv: '•••',
      type: 'Mastercard',
      status: 'active',
      limit: 3000,
      balance: 450.25,
      color: 'bg-gradient-to-r from-indigo-600 to-purple-600'
    }
  ]);
  
  const [virtualCards] = useState([
    {
      id: 3,
      name: 'Online Shopping',
      number: '•••• •••• •••• 2345',
      expiry: '12/24',
      cvv: '•••',
      type: 'Visa',
      status: 'active',
      limit: 1000,
      balance: 0,
      color: 'bg-gradient-to-r from-blue-500 to-teal-400'
    }
  ]);
  
  const [recentTransactions] = useState([
    {
      id: 1,
      date: '2024-05-04',
      merchant: 'Amazon',
      amount: 79.99,
      cardId: 1,
      status: 'completed',
      category: 'Shopping'
    },
    {
      id: 2,
      date: '2024-05-03',
      merchant: 'Starbucks',
      amount: 5.45,
      cardId: 2,
      status: 'completed',
      category: 'Food & Drink'
    },
    {
      id: 3,
      date: '2024-05-02',
      merchant: 'Netflix',
      amount: 14.99,
      cardId: 3,
      status: 'completed',
      category: 'Entertainment'
    },
    {
      id: 4,
      date: '2024-05-01',
      merchant: 'Uber',
      amount: 24.50,
      cardId: 1,
      status: 'completed',
      category: 'Transportation'
    },
    {
      id: 5,
      date: '2024-04-30',
      merchant: 'Walmart',
      amount: 156.87,
      cardId: 2,
      status: 'completed',
      category: 'Groceries'
    }
  ]);
  
  const [notifications] = useState([
    {
      id: 1,
      date: '2024-05-04',
      title: 'Unusual activity detected',
      message: 'We noticed a transaction of $250 at Electronics Store. Was this you?',
      type: 'alert',
      read: false
    },
    {
      id: 2,
      date: '2024-05-02',
      title: 'Payment due reminder',
      message: 'Your payment of $450.25 for SigmaPay Rewards is due in 5 days.',
      type: 'reminder',
      read: true
    },
    {
      id: 3,
      date: '2024-04-28',
      title: 'New virtual card created',
      message: 'Your virtual card for Online Shopping has been created successfully.',
      type: 'info',
      read: true
    }
  ]);

  const renderCard = (card) => (
    <div key={card.id} className={`${card.color} text-white rounded-xl p-6 shadow-lg`}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm opacity-80">Card Name</p>
          <h3 className="font-semibold">{card.name}</h3>
        </div>
        <div className="flex space-x-1">
          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
            {card.type}
          </span>
          {card.status === 'active' && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-100 rounded-full">
              Active
            </span>
          )}
          {card.status === 'locked' && (
            <span className="text-xs px-2 py-1 bg-red-500/20 text-red-100 rounded-full">
              Locked
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm opacity-80">Card Number</p>
        <div className="flex items-center">
          <h3 className="font-mono text-lg">{card.number}</h3>
          <button 
            className="ml-2 p-1 rounded-full hover:bg-white/10"
            onClick={() => setShowCardDetails(!showCardDetails)}
          >
            {showCardDetails ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div>
          <p className="text-sm opacity-80">Expiry Date</p>
          <h3 className="font-mono">{card.expiry}</h3>
        </div>
        <div>
          <p className="text-sm opacity-80">CVV</p>
          <h3 className="font-mono">{card.cvv}</h3>
        </div>
        <div>
          <p className="text-sm opacity-80">Balance</p>
          <h3 className="font-semibold">${card.balance.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'physical':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Physical Cards</h3>
              <button className="btn-primary flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Request New Card
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {physicalCards.map(card => renderCard(card))}
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Card Controls</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Lock Card</h5>
                      <p className="text-sm text-gray-500">Temporarily lock your card</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                      <BellAlertIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Manage Alerts</h5>
                      <p className="text-sm text-gray-500">Set transaction notifications</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                      <BanknotesIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h5 className="font-medium">Spending Limits</h5>
                      <p className="text-sm text-gray-500">Set daily/monthly limits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'virtual':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Virtual Cards</h3>
              <button className="btn-primary flex items-center">
                <PlusIcon className="h-4 w-4 mr-1" />
                Create Virtual Card
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {virtualCards.map(card => renderCard(card))}
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                <PlusIcon className="h-12 w-12 mb-2" />
                <p className="font-medium">Create New Virtual Card</p>
                <p className="text-sm mt-1">For online shopping, subscriptions, etc.</p>
              </div>
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Virtual Card Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <h5 className="ml-2 font-medium">Enhanced Security</h5>
                  </div>
                  <p className="text-sm text-gray-600">Protect your main card details when shopping online.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <h5 className="ml-2 font-medium">Instant Creation</h5>
                  </div>
                  <p className="text-sm text-gray-600">Create and use virtual cards immediately for online purchases.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <ArrowPathIcon className="h-5 w-5" />
                    </div>
                    <h5 className="ml-2 font-medium">Flexible Control</h5>
                  </div>
                  <p className="text-sm text-gray-600">Create specific cards for different merchants or purposes.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'transactions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <div className="flex space-x-2">
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                  <option>All Cards</option>
                  <option>SigmaPay Platinum</option>
                  <option>SigmaPay Rewards</option>
                  <option>Online Shopping</option>
                </select>
                <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => {
                      const card = [...physicalCards, ...virtualCards].find(c => c.id === transaction.cardId);
                      
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.merchant}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {card ? card.name : 'Unknown Card'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            -${transaction.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 5 of 24 transactions</p>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All Transactions →
                </button>
              </div>
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Spending Analysis</h4>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Spending by category chart will be displayed here</p>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Card Notifications</h3>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Mark All as Read
              </button>
            </div>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border rounded-lg p-4 ${notification.read ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'alert' 
                          ? 'bg-red-100 text-red-600' 
                          : notification.type === 'reminder'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'alert' ? (
                          <BellAlertIcon className="h-5 w-5" />
                        ) : notification.type === 'reminder' ? (
                          <ClockIcon className="h-5 w-5" />
                        ) : (
                          <CreditCardIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{new Date(notification.date).toLocaleDateString()}</p>
                        <p className="mt-2 text-gray-700">{notification.message}</p>
                      </div>
                    </div>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    {notification.type === 'alert' && (
                      <>
                        <button className="text-red-600 hover:text-red-800 text-sm">Report Fraud</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">Confirm Transaction</button>
                      </>
                    )}
                    {notification.type === 'reminder' && (
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm">Make Payment</button>
                    )}
                    <button className="text-gray-600 hover:text-gray-800 text-sm">Dismiss</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Transaction Alerts</h5>
                    <p className="text-sm text-gray-500">Get notified for all card transactions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Unusual Activity</h5>
                    <p className="text-sm text-gray-500">Get alerts for suspicious transactions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Payment Reminders</h5>
                    <p className="text-sm text-gray-500">Get reminders for upcoming payments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium">Spending Alerts</h5>
                    <p className="text-sm text-gray-500">Get alerts when you reach spending limits</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
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
        <h1 className="text-3xl font-bold text-gray-900">Card Management</h1>
        <p className="mt-2 text-gray-600">Manage your physical and virtual cards, track transactions, and set preferences.</p>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'physical' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('physical')}
          >
            Physical Cards
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'virtual' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('virtual')}
          >
            Virtual Cards
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'transactions' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'notifications' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </div>
  );
}

export default Cards;
