import { useState } from 'react';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  CalendarIcon,
  ArrowsPointingOutIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

function Reports() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('month');
  const [selectedReportFormat, setSelectedReportFormat] = useState('pdf');
  
  const [reports] = useState([
    { 
      id: 1, 
      title: 'Monthly Financial Summary', 
      description: 'Overview of income, expenses, savings, and investments',
      date: '2024-04-30',
      type: 'summary',
      format: 'pdf'
    },
    { 
      id: 2, 
      title: 'Expense Analysis', 
      description: 'Detailed breakdown of spending by category',
      date: '2024-04-30',
      type: 'expense',
      format: 'pdf'
    },
    { 
      id: 3, 
      title: 'Investment Performance', 
      description: 'Analysis of investment returns and portfolio allocation',
      date: '2024-04-30',
      type: 'investment',
      format: 'pdf'
    },
    { 
      id: 4, 
      title: 'Budget Comparison', 
      description: 'Comparison of planned vs. actual spending',
      date: '2024-04-30',
      type: 'budget',
      format: 'excel'
    },
    { 
      id: 5, 
      title: 'Quarterly Tax Report', 
      description: 'Summary of tax-related transactions and estimated tax liability',
      date: '2024-03-31',
      type: 'tax',
      format: 'pdf'
    }
  ]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Financial Dashboard</h3>
                <p className="text-gray-600">Visual overview of your financial health</p>
              </div>
              <div className="flex space-x-2">
                <select 
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-md hover:bg-gray-100">
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income vs. Expenses Chart */}
              <div className="card">
                <h4 className="font-semibold mb-4">Income vs. Expenses</h4>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <ChartBarIcon className="h-16 w-16 text-gray-400" />
                  <p className="ml-4 text-gray-500">Bar chart visualization</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-xl font-semibold text-green-600">$5,240</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-xl font-semibold text-red-600">$3,180</p>
                  </div>
                </div>
              </div>
              
              {/* Spending by Category */}
              <div className="card">
                <h4 className="font-semibold mb-4">Spending by Category</h4>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <ChartPieIcon className="h-16 w-16 text-gray-400" />
                  <p className="ml-4 text-gray-500">Pie chart visualization</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Housing</span>
                    </div>
                    <span className="text-sm font-medium">$1,200 (38%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Food</span>
                    </div>
                    <span className="text-sm font-medium">$650 (20%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Transportation</span>
                    </div>
                    <span className="text-sm font-medium">$450 (14%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Entertainment</span>
                    </div>
                    <span className="text-sm font-medium">$380 (12%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">Other</span>
                    </div>
                    <span className="text-sm font-medium">$500 (16%)</span>
                  </div>
                </div>
              </div>
              
              {/* Savings Trend */}
              <div className="card">
                <h4 className="font-semibold mb-4">Savings Trend</h4>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <ChartBarIcon className="h-16 w-16 text-gray-400" />
                  <p className="ml-4 text-gray-500">Line chart visualization</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Savings</p>
                    <p className="text-xl font-semibold text-indigo-600">$12,450</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monthly Growth</p>
                    <p className="text-xl font-semibold text-green-600">+$580</p>
                  </div>
                </div>
              </div>
              
              {/* Investment Performance */}
              <div className="card">
                <h4 className="font-semibold mb-4">Investment Performance</h4>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                  <ChartBarIcon className="h-16 w-16 text-gray-400" />
                  <p className="ml-4 text-gray-500">Area chart visualization</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Portfolio Value</p>
                    <p className="text-xl font-semibold text-indigo-600">$45,780</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Return Rate (YTD)</p>
                    <p className="text-xl font-semibold text-green-600">+8.3%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h4 className="font-semibold mb-4">Financial Health Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Debt-to-Income</h5>
                  <p className="text-2xl font-semibold mt-1">28%</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Good (below 36%)</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Emergency Fund</h5>
                  <p className="text-2xl font-semibold mt-1">3.2 mo</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fair (target: 6 months)</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Savings Rate</h5>
                  <p className="text-2xl font-semibold mt-1">15%</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Good (target: 20%)</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Credit Utilization</h5>
                  <p className="text-2xl font-semibold mt-1">22%</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Good (below 30%)</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'generate':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-6">Generate Custom Report</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option>Financial Summary</option>
                    <option>Expense Analysis</option>
                    <option>Budget Comparison</option>
                    <option>Investment Performance</option>
                    <option>Savings Progress</option>
                    <option>Tax Summary</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">Last Week</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">Last Month</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">Last Quarter</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">Year to Date</button>
                    <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full">Last Year</button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="pdf" 
                        checked={selectedReportFormat === 'pdf'} 
                        onChange={() => setSelectedReportFormat('pdf')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="excel" 
                        checked={selectedReportFormat === 'excel'} 
                        onChange={() => setSelectedReportFormat('excel')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="csv" 
                        checked={selectedReportFormat === 'csv'} 
                        onChange={() => setSelectedReportFormat('csv')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">CSV</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include visualizations</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include transaction details</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include recommendations</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="btn-primary">Generate Report</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'history':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Report History</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pl-10"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{report.title}</div>
                              <div className="text-sm text-gray-500">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${report.type === 'summary' ? 'bg-blue-100 text-blue-800' : 
                              report.type === 'expense' ? 'bg-red-100 text-red-800' : 
                              report.type === 'investment' ? 'bg-green-100 text-green-800' : 
                              report.type === 'budget' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.format.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">View</button>
                          <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Showing 5 of 12 reports</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">Generate customizable financial reports and visualize your financial data.</p>
      </div>
      
      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'generate' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate Report
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            Report History
          </button>
        </nav>
      </div>
      
      {renderTabContent()}
    </div>
  );
}

export default Reports;
