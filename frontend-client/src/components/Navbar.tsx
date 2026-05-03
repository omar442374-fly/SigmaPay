import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">SIGMAPAY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition">
                  Dashboard
                </Link>
                <Link to="/budgets" className="text-gray-700 hover:text-indigo-600 transition">
                  Budget
                </Link>
                <Link to="/payments" className="text-gray-700 hover:text-indigo-600 transition">
                  Payments
                </Link>
                <Link to="/groups" className="text-gray-700 hover:text-indigo-600 transition">
                  Groups
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/budgets"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Budget
                </Link>
                <Link
                  to="/payments"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Payments
                </Link>
                <Link
                  to="/groups"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Groups
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-indigo-600 transition py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
