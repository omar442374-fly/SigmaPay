import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../utils/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const resetToken = await requestPasswordReset(email);
      setSuccess('Password reset instructions sent. Please check your console for the reset token (in a real app, this would be sent to your email).');
      
      // In a real app, we would redirect to a confirmation page
      // For this demo, we'll just show the success message
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
            <div className="mt-2">
              <Link to="/reset-password" className="text-green-700 font-medium hover:underline">
                Continue to Reset Password
              </Link>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your registered email"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              We'll send you a link to reset your password.
            </p>
          </div>
          
          <button 
            type="submit" 
            className="w-full btn-primary mb-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="text-primary hover:text-secondary">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
