import { useState } from 'react';
import { getGeneralAIResponse } from '../utils/ai';

function GeminiDemo() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await getGeneralAIResponse(prompt);
      setResponse(result);
    } catch (err) {
      console.error('Error calling Gemini API:', err);
      setError(err.message || 'An error occurred while calling the Gemini API');
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
          className={`${
            isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center`}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Get Response'
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response:</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500">
        <p>This demo uses the Gemini 2.0 Flash model via the Google Generative AI API.</p>
        <p className="mt-1">API Key: AIzaSyAFBb53anG2WAHcUqV04bd04EffcSdh--4</p>
      </div>
    </div>
  );
}

export default GeminiDemo;
