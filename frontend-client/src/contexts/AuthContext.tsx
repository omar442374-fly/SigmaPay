import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured, UserProfile } from '../utils/supabaseClient';

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
  const useSupabase = isSupabaseConfigured();

  useEffect(() => {
    const initAuth = async () => {
      if (useSupabase) {
        // Check for existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile from database
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
            });
          }
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email,
              });
            }
          } else {
            setUser(null);
          }
        });

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Fallback to localStorage for mock auth
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
      }
    };

    initAuth();
  }, [useSupabase]);

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      if (useSupabase) {
        // Supabase authentication
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email,
            });
          }
        }
      } else {
        // Mock login
        const mockUser: User = {
          id: 'user-' + Date.now(),
          username: email.split('@')[0],
          email,
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
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
      if (useSupabase) {
        // Supabase registration
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: data.user.id,
              username: userData.username,
              email: userData.email,
              phone_number: userData.phoneNumber,
            });

          if (profileError) throw profileError;

          setUser({
            id: data.user.id,
            username: userData.username,
            email: userData.email,
          });
        }
      } else {
        // Mock registration
        const newUser: User = {
          id: 'user-' + Date.now(),
          username: userData.username,
          email: userData.email,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    if (useSupabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('user');
    }
    setUser(null);
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
