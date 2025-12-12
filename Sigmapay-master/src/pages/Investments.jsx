import { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ChartBarIcon, BellAlertIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function Investments() {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [investmentOptions] = useState([
    { id: 1, name: 'Growth Fund', risk: 'High', return: '12-15%', minInvestment: 1000, description: 'Aggressive growth strategy focusing on emerging markets and technology sectors.' },
    { id: 2, name: 'Balanced Fund', risk: 'Medium', return: '8-10%', minInvestment: 500, description: 'Balanced approach with mix of stocks and bonds for steady growth with moderate risk.' },
    { id: 3, name: 'Income Fund', risk: 'Low', return: '4-6%', minInvestment: 250, description: 'Focus on dividend-paying stocks and bonds for regular income with lower risk.' },
    { id: 4, name: 'Tech Innovation', risk: 'High', return: '15-20%', minInvestment: 2000, description: 'Specialized fund focusing on cutting-edge technology companies with high growth potential.' },
    { id: 5, name: 'Sustainable Future', risk: 'Medium', return: '7-9%', minInvestment: 750, description: 'ESG-focused investments in renewable energy and sustainable businesses.' }
  ]);

  const [portfolio] = useState([
    { id: 1, name: 'Growth Fund', amount: 2500, performance: '+12.5%', allocation: 40 },
    { id: 2, name: 'Balanced Fund', amount: 1500, performance: '+7.2%', allocation: 25 },
    { id: 3, name: 'Tech Innovation', amount: 1000, performance: '+18.3%', allocation: 15 },
    { id: 4, name: 'Sustainable Future', amount: 1250, performance: '+6.8%', allocation: 20 }
  ]);

  const [marketAlerts] = useState([
    { id: 1, date: '2024-05-01', title: 'Market Volatility Alert', description: 'Recent market fluctuations may affect your Growth Fund. Consider reviewing your portfolio.', read: false },
    { id: 2, date: '2024-04-28', title: 'Tech Sector Opportunity', description: 'Tech sector showing strong growth. Consider increasing allocation to Tech Innovation fund.', read: true },
    { id: 3, date: '2024-04-25', title: 'New Sustainable Investment Options', description: 'New sustainable investment options available that align with your investment profile.', read: false }
  ]);

  const [strategies] = useState([
    { id: 1, name: 'Conservative', description: 'Low-risk approach focusing on capital preservation with modest growth.', allocation: { stocks: 30, bonds: 60, cash: 10 } },
    { id: 2, name: 'Balanced', description: 'Moderate risk approach balancing growth and income.', allocation: { stocks: 60, bonds: 35, cash: 5 } },
    { id: 3, name: 'Aggressive', description: 'High-risk approach focusing on maximum growth potential.', allocation: { stocks: 85, bonds: 10, cash: 5 } }
  ]);

  const [currentStrategy, setCurrentStrategy] = useState(strategies[1]);

  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + item.amount, 0);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Portfolio Overview</h3>
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                  <p className="text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-gray-600">Performance (YTD)</p>
                  <p className="text-2xl font-semibold text-green-600">+10.8%</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="btn-primary">Add Investment</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {portfolio.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{item.performance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.allocation}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">Adjust</button>
                          <button className="text-indigo-600 hover:text-indigo-900">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Portfolio Performance</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Interactive chart will be displayed here</p>
              </div>
            </div>
          </div>
        );
      
      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Personalized Investment Recommendations</h3>
              <p className="text-gray-600 mb-6">Based on your risk profile and financial goals, we recommend the following investment options:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <ArrowUpIcon className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-800">Recommended Increase</h4>
                  </div>
                  <p className="text-green-800">Consider increasing your allocation to <span className="font-semibold">Tech Innovation</span> by 5-10% to capitalize on sector growth.</p>
                </div>
                
                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <ArrowDownIcon className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-800">Recommended Decrease</h4>
                  </div>
                  <p className="text-red-800">Consider reducing your allocation to <span className="font-semibold">Balanced Fund</span> by 5% to optimize returns.</p>
                </div>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">New Investment Opportunities</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min. Investment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {investmentOptions.map((option) => (
                      <tr key={option.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${option.risk === 'High' ? 'bg-red-100 text-red-800' : 
                              option.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {option.risk}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{option.return}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${option.minInvestment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="btn-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded px-3 py-1">Invest</button>
                          <button className="text-indigo-600 hover:text-indigo-900">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Investment Strategy</h3>
              <p className="text-gray-600 mb-6">Your current investment strategy is <span className="font-semibold">{currentStrategy.name}</span>. You can adjust your strategy based on your financial goals and risk tolerance.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {strategies.map((strategy) => (
                  <div 
                    key={strategy.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentStrategy.id === strategy.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                    onClick={() => setCurrentStrategy(strategy)}
                  >
                    <h4 className="font-semibold text-lg mb-2">{strategy.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{strategy.description}</p>
                    <div className="flex space-x-2">
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Stocks: {strategy.allocation.stocks}%
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Bonds: {strategy.allocation.bonds}%
                      </div>
                      <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                        Cash: {strategy.allocation.cash}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button className="btn-primary">Apply Strategy Changes</button>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Strategy Impact Analysis</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
                <p className="ml-4 text-gray-500">Strategy comparison chart will be displayed here</p>
              </div>
            </div>
          </div>
        );
      
      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Market Alerts & Recommendations</h3>
              <p className="text-gray-600 mb-6">Stay informed about market trends and receive personalized recommendations for your portfolio.</p>
              
              <div className="space-y-4">
                {marketAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${alert.read ? 'border-gray-200' : 'border-indigo-300 bg-indigo-50'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <BellAlertIcon className={`h-5 w-5 mt-0.5 mr-2 ${alert.read ? 'text-gray-400' : 'text-indigo-600'}`} />
                        <div>
                          <h4 className="font-semibold text-lg">{alert.title}</h4>
                          <p className="text-sm text-gray-500">{new Date(alert.date).toLocaleDateString()}</p>
                          <p className="mt-2 text-gray-700">{alert.description}</p>
                        </div>
                      </div>
                      {!alert.read && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">Mark as Read</button>
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">Take Action</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button className="text-indigo-600 hover:text-indigo-900">Mark All as Read</button>
                <button className="text-indigo-600 hover:text-indigo-900">Manage Alert Preferences</button>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Investment Reports</h3>
              <p className="text-gray-600 mb-6">Access detailed reports about your investment performance and portfolio analysis.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Monthly Performance Report</h4>
                      <p className="text-sm text-gray-500">April 2024</p>
                      <p className="text-xs text-gray-500 mt-1">Generated on May 1, 2024</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download PDF</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Quarterly Portfolio Analysis</h4>
                      <p className="text-sm text-gray-500">Q1 2024</p>
                      <p className="text-xs text-gray-500 mt-1">Generated on April 5, 2024</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download PDF</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Tax Statement</h4>
                      <p className="text-sm text-gray-500">Year 2023</p>
                      <p className="text-xs text-gray-500 mt-1">Generated on January 15, 2024</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download PDF</button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Annual Performance Summary</h4>
                      <p className="text-sm text-gray-500">Year 2023</p>
                      <p className="text-xs text-gray-500 mt-1">Generated on January 10, 2024</p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm">Download PDF</button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Generate Custom Report</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>Performance Report</option>
                      <option>Portfolio Analysis</option>
                      <option>Tax Statement</option>
                      <option>Asset Allocation</option>
                    </select>
                  </div>
                  <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                    <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <option>Last Month</option>
                      <option>Last Quarter</option>
                      <option>Year to Date</option>
                      <option>Last Year</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div className="w-full md:w-auto flex items-end">
                    <button className="btn-primary">Generate Report</button>
                  </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Investment Management</h1>
        <p className="mt-2 text-gray-600">Manage your investment portfolio, explore opportunities, and track performance.</p>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'portfolio' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'recommendations' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'strategy' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('strategy')}
          >
            Strategy
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'alerts' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'reports' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </div>
  );
}

export default Investments;
