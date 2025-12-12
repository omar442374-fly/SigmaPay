import GeminiDemoComponent from '../components/GeminiDemo';

function GeminiDemo() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gemini AI Integration</h1>
        <p className="mt-2 text-gray-600">
          This page demonstrates the integration of Google's Gemini AI API into our application.
        </p>
      </div>

      <GeminiDemoComponent />
      
      <div className="mt-12 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">About Gemini AI</h2>
        <p className="text-gray-700 mb-4">
          Gemini is Google's most capable AI model, designed to be helpful, harmless, and honest. 
          It can understand and generate text, code, images, and more.
        </p>
        <p className="text-gray-700 mb-4">
          In this demo, we're using the Gemini 2.0 Flash model, which is optimized for fast responses
          while maintaining high quality output.
        </p>
        <p className="text-gray-700">
          The integration is done through a simple API call to Google's Generative AI API service.
        </p>
      </div>
    </div>
  );
}

export default GeminiDemo;
