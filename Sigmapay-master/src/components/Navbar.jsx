import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (activeDropdown && !dropdownRefs.current[activeDropdown]?.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
  };

  // Navbar categories and their items - only shown when authenticated
  const authenticatedNavCategories = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      isDropdown: false
    },
    {
      id: 'money',
      label: 'Money',
      isDropdown: true,
      items: [
        { label: 'Payments', path: '/payments' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'Bills', path: '/bills' },
        { label: 'Budget', path: '/budget' }
      ]
    },
    {
      id: 'wealth',
      label: 'Wealth',
      isDropdown: true,
      items: [
        { label: 'Investments', path: '/investments' },
        { label: 'Advisory', path: '/advisory' },
        { label: 'Reports', path: '/reports' },
        { label: 'Gemini AI Demo', path: '/gemini-demo' }
      ]
    },
    {
      id: 'cards',
      label: 'Cards',
      path: '/cards',
      isDropdown: false
    },
    {
      id: 'community',
      label: 'Community',
      isDropdown: true,
      items: [
        { label: 'Groups', path: '/groups' },
        { label: 'Contacts', path: '/contacts' },
        { label: 'Partnerships', path: '/partnerships' }
      ]
    },
    {
      id: 'learn',
      label: 'Learn',
      path: '/tutoring',
      isDropdown: false
    }
  ];

  // Public navigation items - shown to all users
  const publicNavCategories = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      isDropdown: false
    },
    {
      id: 'about',
      label: 'About',
      path: '/about',
      isDropdown: false
    },
    {
      id: 'features',
      label: 'Features',
      isDropdown: true,
      items: [
        { label: 'Payments', path: '/#payments' },
        { label: 'Investments', path: '/#investments' },
        { label: 'Cards', path: '/#cards' }
      ]
    }
  ];

  // Use authenticated categories if user is logged in, otherwise use public categories
  const navCategories = user ? authenticatedNavCategories : publicNavCategories;

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold text-indigo-700 tracking-tight"
          >
            SIGMAPAY
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navCategories.map((category) => (
              category.isDropdown ? (
                <div
                  key={category.id}
                  className="relative"
                  ref={el => dropdownRefs.current[category.id] = el}
                >
                  <button
                    className={`text-gray-600 hover:text-indigo-600 transition duration-200 font-medium flex items-center ${activeDropdown === category.id ? 'text-indigo-600' : ''}`}
                    onClick={() => toggleDropdown(category.id)}
                    aria-expanded={activeDropdown === category.id}
                  >
                    {category.label}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform ${activeDropdown === category.id ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {activeDropdown === category.id && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={category.id}
                  to={category.path}
                  className="text-gray-600 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  {category.label}
                </Link>
              )
            ))}
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex space-x-3 items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationCenter />

                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition duration-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-medium text-indigo-600">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{user.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-50 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full font-medium text-indigo-700 border border-indigo-600 hover:bg-indigo-50 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6 text-indigo-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-white rounded-xl shadow-md p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
            {navCategories.map((category) => (
              <div key={category.id}>
                {category.isDropdown ? (
                  <div className="mb-2">
                    <button
                      className={`flex items-center justify-between w-full text-left px-2 py-1 rounded-md ${activeDropdown === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}`}
                      onClick={() => toggleDropdown(category.id)}
                    >
                      <span className="font-medium">{category.label}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${activeDropdown === category.id ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {activeDropdown === category.id && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-indigo-100 pl-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block text-gray-700 hover:text-indigo-600 transition py-1"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={category.path}
                    className="block text-gray-700 hover:text-indigo-600 transition py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {category.label}
                  </Link>
                )}
              </div>
            ))}

            <hr className="my-2" />

            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition py-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-medium text-indigo-600">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-indigo-700 font-medium hover:underline py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-indigo-700 font-medium hover:underline py-2">Login</Link>
                <Link to="/signup" className="block text-white bg-indigo-600 hover:bg-indigo-700 text-center py-2 rounded-full transition">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
