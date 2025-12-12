import { createContext, useContext, useState, useEffect } from 'react';
import {
  isAuthenticated as checkAuth,
  getCurrentUser,
  loginUser as login,
  logoutUser as logout,
  registerUser as register,
  updateUserProfile
} from '../utils/auth';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (checkAuth()) {
          setUser(getCurrentUser());
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await register(userData);
      // Auto-login after registration
      const loggedInUser = await login(userData.email, userData.password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = () => {
    setLoading(true);
    try {
      logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    try {
      // First update the user in local storage using the auth utility
      const updatedUser = await updateUserProfile(updatedUserData);

      // Then update the user state
      setUser(prevUser => ({
        ...prevUser,
        ...updatedUserData
      }));

      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    updateUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
