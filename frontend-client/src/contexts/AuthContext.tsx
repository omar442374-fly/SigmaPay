import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (userData: { username: string; email: string; password: string; phoneNumber: string }) => Promise<void>;
  logoutUser: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock login for now - in production this would call the API
      const mockUser: User = {
        id: 'user-' + Date.now(),
        username: email.split('@')[0],
        email,
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (userData: { username: string; email: string; password: string; phoneNumber: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Mock registration - in production this would call the API
      const newUser: User = {
        id: 'user-' + Date.now(),
        username: userData.username,
        email: userData.email,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginUser, registerUser, logoutUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
