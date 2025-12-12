# AI Integration

## Overview

Sigmapay integrates artificial intelligence capabilities through Google's Gemini API to provide personalized financial advice, investment recommendations, and budget suggestions. This integration enhances the user experience by offering intelligent insights based on the user's financial data.

## Implementation

The AI integration is implemented in `src/utils/ai.js`, which provides utility functions for interacting with the Gemini API:

```javascript
// src/utils/ai.js
// Constants for API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';

/**
 * Call the Gemini API with a prompt
 * @param {string} prompt - The text prompt to send to the API
 * @returns {Promise<Object>} - The response from the API
 */
export const callGeminiAPI = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Get an AI response for financial advice
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} - The AI's response
 */
export const getFinancialAdvice = async (userMessage) => {
  try {
    // Create a prompt that focuses on financial advice
    const prompt = `As a financial advisor, please provide advice on the following question: ${userMessage}. 
    Focus on practical financial advice related to budgeting, saving, investing, or debt management.`;
    
    const response = await callGeminiAPI(prompt);
    
    if (response.candidates && response.candidates.length > 0 && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts.length > 0) {
      return response.candidates[0].content.parts[0].text;
    }
    
    return "I'm sorry, I couldn't generate financial advice at this time. Please try again later.";
  } catch (error) {
    console.error('Error getting financial advice:', error);
    return "I'm sorry, there was an error generating financial advice. Please try again later.";
  }
};

/**
 * Generate investment recommendations based on user profile and preferences
 * @param {Object} userProfile - The user's financial profile
 * @returns {Promise<string>} - Investment recommendations
 */
export const getInvestmentRecommendations = async (userProfile) => {
  try {
    const { monthlyIncome, riskTolerance, investmentGoals, timeHorizon } = userProfile;
    
    const prompt = `As a financial advisor, please provide investment recommendations for a user with the following profile:
    - Monthly Income: $${monthlyIncome}
    - Risk Tolerance: ${riskTolerance || 'Moderate'}
    - Investment Goals: ${investmentGoals || 'Long-term growth'}
    - Time Horizon: ${timeHorizon || '5-10 years'}
    
    Provide specific investment strategies and asset allocation recommendations.`;
    
    const response = await callGeminiAPI(prompt);
    
    if (response.candidates && response.candidates.length > 0 && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts.length > 0) {
      return response.candidates[0].content.parts[0].text;
    }
    
    return "I'm sorry, I couldn't generate investment recommendations at this time. Please try again later.";
  } catch (error) {
    console.error('Error getting investment recommendations:', error);
    return "I'm sorry, there was an error generating investment recommendations. Please try again later.";
  }
};

/**
 * Generate budget recommendations based on user's financial data
 * @param {Object} financialData - The user's financial data
 * @returns {Promise<string>} - Budget recommendations
 */
export const getBudgetRecommendations = async (financialData) => {
  try {
    const { monthlyIncome, expenses, savingsGoal } = financialData;
    
    const prompt = `As a financial advisor, please provide budget recommendations for a user with the following financial data:
    - Monthly Income: $${monthlyIncome}
    - Current Expenses: ${JSON.stringify(expenses)}
    - Savings Goal: $${savingsGoal}
    
    Provide specific budget allocation recommendations and savings strategies.`;
    
    const response = await callGeminiAPI(prompt);
    
    if (response.candidates && response.candidates.length > 0 && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts.length > 0) {
      return response.candidates[0].content.parts[0].text;
    }
    
    return "I'm sorry, I couldn't generate budget recommendations at this time. Please try again later.";
  } catch (error) {
    console.error('Error getting budget recommendations:', error);
    return "I'm sorry, there was an error generating budget recommendations. Please try again later.";
  }
};

/**
 * Generate a general AI response to any query
 * @param {string} prompt - The user's prompt
 * @returns {Promise<string>} - The AI's response
 */
export const getGeneralAIResponse = async (prompt) => {
  try {
    const response = await callGeminiAPI(prompt);
    
    if (response.candidates && response.candidates.length > 0 && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts.length > 0) {
      return response.candidates[0].content.parts[0].text;
    }
    
    return "I'm sorry, I couldn't generate a response at this time. Please try again later.";
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
  }
};
```

## AI Features

The AI integration enables several features in the application:

### 1. Financial Advice

Users can ask questions and receive personalized financial advice based on their specific situation.

```jsx
// src/pages/Advisory.jsx (partial)
function Advisory() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await getFinancialAdvice(question);
      setAdvice(response);
    } catch (error) {
      console.error('Error getting advice:', error);
      setAdvice("Sorry, I couldn't generate advice at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Advisory</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Ask for Financial Advice</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              rows="3"
              className="input-field"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How can I save more money each month?"
            ></textarea>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Getting Advice...' : 'Get Advice'}
          </button>
        </form>
      </div>
      
      {advice && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Personalized Advice</h2>
          <div className="prose max-w-none">
            {advice.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. Investment Recommendations

The application can generate investment recommendations based on the user's financial profile and preferences.

```jsx
// src/pages/Investments.jsx (partial)
function Investments() {
  const { user } = useAuth();
  const { income } = useFinance();
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    monthlyIncome: income,
    riskTolerance: 'Moderate',
    investmentGoals: 'Long-term growth',
    timeHorizon: '5-10 years'
  });
  
  const handleGetRecommendations = async () => {
    setLoading(true);
    
    try {
      const response = await getInvestmentRecommendations(userProfile);
      setRecommendations(response);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations("Sorry, I couldn't generate recommendations at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Render investment form and recommendations...
}
```

### 3. Budget Recommendations

The application can generate budget recommendations based on the user's financial data.

```jsx
// src/components/BudgetRecommendations.jsx
function BudgetRecommendations() {
  const { user } = useAuth();
  const { income, expenses, savingsGoal } = useFinance();
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleGetRecommendations = async () => {
    setLoading(true);
    
    try {
      const financialData = {
        monthlyIncome: income,
        expenses: expenses.slice(0, 10), // Send only recent expenses
        savingsGoal
      };
      
      const response = await getBudgetRecommendations(financialData);
      setRecommendations(response);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations("Sorry, I couldn't generate recommendations at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Render budget recommendations...
}
```

### 4. Gemini Demo Page

The application includes a dedicated page for demonstrating the Gemini API integration:

```jsx
// src/pages/GeminiDemo.jsx
import { useState } from 'react';
import { getGeneralAIResponse } from '../utils/ai';

function GeminiDemo() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const aiResponse = await getGeneralAIResponse(prompt);
      setResponse(aiResponse);
    } catch (err) {
      console.error('Error calling Gemini API:', err);
      setError('Failed to get a response from the AI. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gemini AI Demo</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your prompt:
          </label>
          <textarea
            id="prompt"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Gemini AI anything..."
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {response && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">AI Response:</h3>
          <div className="prose max-w-none">
            {response.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GeminiDemo;
```

## Environment Configuration

The Gemini API key is stored in an environment variable to keep it secure:

```javascript
// .env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

The application accesses this environment variable using Vite's import.meta.env:

```javascript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY';
```

## Error Handling

The AI integration includes robust error handling to ensure a good user experience even when the API is unavailable or returns an error:

1. **API Errors**: Errors from the API are caught and displayed to the user
2. **Network Errors**: Network issues are caught and handled gracefully
3. **Fallback Messages**: Default messages are provided when the API fails
4. **Loading States**: Loading indicators are shown during API calls

## Security Considerations

When implementing AI integration in a production environment, several security considerations should be addressed:

1. **API Key Security**: Store API keys securely and never expose them in client-side code
2. **Data Privacy**: Be careful about what user data is sent to the AI service
3. **Content Filtering**: Implement filters to prevent inappropriate content
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **User Consent**: Obtain user consent before using their data for AI processing

## Future Enhancements

The AI integration could be enhanced in several ways:

1. **More Personalized Advice**: Incorporate more user data for more tailored recommendations
2. **Conversational Interface**: Implement a chat interface for more natural interaction
3. **Proactive Insights**: Generate insights automatically based on user behavior
4. **Multi-Modal Inputs**: Allow users to upload documents or images for analysis
5. **Integration with Financial News**: Incorporate financial news and market data into recommendations

## Conclusion

The AI integration in Sigmapay enhances the user experience by providing personalized financial advice, investment recommendations, and budget suggestions. By leveraging the power of Google's Gemini API, the application offers intelligent insights that help users make better financial decisions.
