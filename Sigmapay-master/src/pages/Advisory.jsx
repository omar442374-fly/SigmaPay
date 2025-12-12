import { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { getFinancialAdvice } from '../utils/ai';

function Advisory() {
  const [activeTab, setActiveTab] = useState('ai-advisor');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', message: 'Hello! I\'m your AI financial advisor. How can I help you today?', timestamp: new Date().toISOString() }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [advisors] = useState([
    {
      id: 1,
      name: 'Ammar Eid',
      title: 'Senior Financial Advisor',
      specialization: 'Retirement Planning',
      experience: '15+ years',
      rating: 4.9,
      reviews: 128,
      availability: 'Available May 10',
      image: '/photo placeholder.png'
    },
    {
      id: 2,
      name: 'Mohamed Ibrahim',
      title: 'Investment Specialist',
      specialization: 'Wealth Management',
      experience: '12+ years',
      rating: 4.8,
      reviews: 97,
      availability: 'Available May 8',
      image: '/photo placeholder.png'
    },
    {
      id: 3,
      name: 'Omar Aly',
      title: 'Tax Planning Expert',
      specialization: 'Tax Optimization',
      experience: '10+ years',
      rating: 4.7,
      reviews: 85,
      availability: 'Available May 12',
      image: '/photo placeholder.png'
    }
  ]);

  const [personalizedAdvice] = useState([
    {
      id: 1,
      category: 'Spending',
      title: 'Reduce Dining Expenses',
      description: 'Your dining expenses are 30% higher than last month. Consider cooking at home more often to save money.',
      impact: 'Potential monthly savings: $250',
      priority: 'high'
    },
    {
      id: 2,
      category: 'Savings',
      title: 'Increase Emergency Fund',
      description: 'Your emergency fund covers only 2 months of expenses. Aim for 6 months by increasing monthly contributions.',
      impact: 'Improved financial security',
      priority: 'medium'
    },
    {
      id: 3,
      category: 'Investment',
      title: 'Diversify Portfolio',
      description: 'Your investment portfolio is heavily concentrated in technology stocks. Consider diversifying to reduce risk.',
      impact: 'Lower risk exposure',
      priority: 'medium'
    },
    {
      id: 4,
      category: 'Debt',
      title: 'Refinance Mortgage',
      description: 'Current interest rates are lower than your mortgage rate. Consider refinancing to save on interest payments.',
      impact: 'Potential savings: $10,000 over loan term',
      priority: 'low'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || isLoading) return;

    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    // Add a loading message
    const loadingMessage = {
      id: chatMessages.length + 2,
      sender: 'ai',
      message: '...',
      isLoading: true,
      timestamp: new Date().toISOString()
    };

    setChatMessages([...chatMessages, userMessage, loadingMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Get AI response using Gemini API
      const aiResponseText = await getFinancialAdvice(newMessage);

      // Replace loading message with actual response
      setChatMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.isLoading
            ? {
              id: msg.id,
              sender: 'ai',
              message: aiResponseText,
              timestamp: new Date().toISOString()
            }
            : msg
        )
      );
    } catch (err) {
      console.error('Error getting AI response:', err);
      setError(err.message);

      // Replace loading message with error message
      setChatMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.isLoading
            ? {
              id: msg.id,
              sender: 'ai',
              message: 'Sorry, I encountered an error. Please try again later.',
              error: true,
              timestamp: new Date().toISOString()
            }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-advisor':
        return (
          <div className="card h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : msg.error
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <p>Thinking...</p>
                      </div>
                    ) : (
                      <p>{msg.message}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'user'
                      ? 'text-indigo-200'
                      : msg.error
                        ? 'text-red-500'
                        : 'text-gray-500'
                      }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  placeholder="Ask about investments, savings, debt, or budgeting..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  className={`${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg transition-colors flex items-center`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                <span>AI-powered financial advice using Gemini API. For complex situations, consider consulting a human advisor.</span>
              </div>
              {error && (
                <div className="mt-2 text-xs text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Error: {error}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'human-advisor':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Connect with a Financial Advisor</h3>
              <p className="text-gray-600 mb-6">
                Our certified financial advisors can provide personalized guidance for your complex financial needs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisors.map((advisor) => (
                  <div key={advisor.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                      <img
                        src={advisor.image}
                        alt={advisor.name}
                        className="object-cover h-48 w-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-lg">{advisor.name}</h4>
                      <p className="text-indigo-600">{advisor.title}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Specialization:</span> {advisor.specialization}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Experience:</span> {advisor.experience}
                        </p>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {'★'.repeat(Math.floor(advisor.rating))}
                            {'☆'.repeat(5 - Math.floor(advisor.rating))}
                          </div>
                          <span className="ml-1 text-sm text-gray-600">({advisor.reviews} reviews)</span>
                        </div>
                        <p className="text-sm text-green-600">{advisor.availability}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm">
                          Schedule Call
                        </button>
                        <button className="flex-1 border border-indigo-600 text-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-50 transition-colors text-sm">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold">Need specialized assistance?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We have advisors specializing in retirement planning, tax optimization, estate planning, and more.
                </p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Browse all advisors →
                </button>
              </div>
            </div>
          </div>
        );

      case 'personalized-advice':
        return (
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Personalized Financial Advice</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm">
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Refresh Analysis
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Based on your income, spending habits, and financial goals, we've identified these opportunities to improve your financial health.
              </p>

              <div className="space-y-4">
                {personalizedAdvice.map((advice) => (
                  <div
                    key={advice.id}
                    className={`border rounded-lg p-4 ${advice.priority === 'high'
                      ? 'border-red-200 bg-red-50'
                      : advice.priority === 'medium'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-green-200 bg-green-50'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${advice.category === 'Spending'
                          ? 'bg-blue-100 text-blue-800'
                          : advice.category === 'Savings'
                            ? 'bg-green-100 text-green-800'
                            : advice.category === 'Investment'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                          {advice.category}
                        </span>
                        <h4 className="font-semibold text-lg">{advice.title}</h4>
                        <p className="mt-1 text-gray-700">{advice.description}</p>
                        <p className="mt-2 text-sm font-medium">
                          {advice.impact}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${advice.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : advice.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                        }`}>
                        {advice.priority.charAt(0).toUpperCase() + advice.priority.slice(1)} Priority
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">Learn More</button>
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors">
                        Take Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <h4 className="font-semibold">Want a comprehensive financial plan?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Schedule a session with one of our financial advisors for a detailed analysis and personalized financial roadmap.
                </p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Schedule a consultation →
                </button>
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
        <h1 className="text-3xl font-bold text-gray-900">Financial Advisory</h1>
        <p className="mt-2 text-gray-600">Get personalized financial advice and guidance to achieve your financial goals.</p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'ai-advisor' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('ai-advisor')}
          >
            AI Financial Advisor
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'human-advisor' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('human-advisor')}
          >
            Human Advisors
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'personalized-advice' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('personalized-advice')}
          >
            Personalized Advice
          </button>
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default Advisory;
