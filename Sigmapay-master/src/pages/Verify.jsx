import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyUserAccount, resendVerificationCode } from '../utils/auth';

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  useEffect(() => {
    // Get email from query params or location state
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const emailState = location.state?.email;
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (emailState) {
      setEmail(emailState);
    }
  }, [location]);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!code) {
      setError('Verification code is required');
      return;
    }
    
    try {
      await verifyUserAccount(email, code);
      setSuccess('Account verified successfully! You can now log in.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    setIsResending(true);
    
    if (!email) {
      setError('Email is required');
      setIsResending(false);
      return;
    }
    
    try {
      await resendVerificationCode(email);
      setSuccess('Verification code resent. Please check your console for the code (in a real app, this would be sent to your email).');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="code" className="block text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input-field"
              placeholder="Enter the 6-digit code"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Check your console for the verification code (in a real app, this would be sent to your email).
            </p>
          </div>
          
          <button type="submit" className="w-full btn-primary mb-4">
            Verify Account
          </button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend Verification Code'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Already verified?{' '}
            <Link to="/login" className="text-primary hover:text-secondary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verify;
