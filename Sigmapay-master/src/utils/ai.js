// AI service utility functions

// Gemini API key - in a real application, this would be stored in environment variables
const GEMINI_API_KEY = 'AIzaSyAFBb53anG2WAHcUqV04bd04EffcSdh--4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
    
    // Extract the text from the response
    if (response.candidates && response.candidates.length > 0 && 
        response.candidates[0].content && 
        response.candidates[0].content.parts && 
        response.candidates[0].content.parts.length > 0) {
      return response.candidates[0].content.parts[0].text;
    }
    
    return "I'm sorry, I couldn't generate a response at this time. Please try again later.";
  } catch (error) {
    console.error('Error getting financial advice:', error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
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
