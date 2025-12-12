# Authentication System

## Overview

Sigmapay implements a complete authentication system that handles user registration, login, logout, and profile management. For demonstration purposes, the authentication system uses local storage to persist user data, but it's designed to be easily replaced with a real backend authentication system.

## Authentication Flow

1. **Registration**: Users create an account with email, password, and profile information
2. **Email Verification**: (Simulated) Users verify their email address
3. **Login**: Users log in with email and password
4. **Session Management**: The application maintains the user's session
5. **Profile Management**: Users can update their profile information
6. **Password Reset**: (Simulated) Users can reset their password if forgotten
7. **Logout**: Users can log out to end their session

## Implementation

### Authentication Utilities

The core authentication functionality is implemented in `src/utils/auth.js`:

```javascript
// Local storage keys
const USERS_KEY = 'sigmapay_users';
const CURRENT_USER_KEY = 'sigmapay_current_user';
const VERIFICATION_CODES_KEY = 'sigmapay_verification_codes';
const PASSWORD_RESET_TOKENS_KEY = 'sigmapay_password_reset_tokens';

// Default user data for new registrations
const DEFAULT_USER_DATA = {
  monthlyIncome: 5000,
  budgetPlan: 3000,
  spendingLimit: 2000,
  savingsGoal: 1000,
  profileImage: getAssetPath('photo placeholder.png'),
  isVerified: true, // Set to true to skip email verification
  verificationCode: null,
  preferences: {
    theme: 'light',
    notifications: true,
    twoFactorAuth: false
  }
};

// Get current user from local storage
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Register a new user
export const registerUser = (userData) => {
  // Get existing users
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  // Generate user ID
  const userId = `user_${Date.now()}`;
  
  // Create new user with default data
  const newUser = {
    id: userId,
    ...userData,
    ...DEFAULT_USER_DATA,
    createdAt: new Date().toISOString()
  };
  
  // Add to users array and save to local storage
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return newUser;
};

// Login user
export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Update user profile
export const updateUserProfile = (updatedData) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  
  // Get all users
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  // Find and update the current user
  const updatedUsers = users.map(user => {
    if (user.id === currentUser.id) {
      const updatedUser = { ...user, ...updatedData };
      // Update current user in local storage
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    return user;
  });
  
  // Save updated users to local storage
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  
  return { ...currentUser, ...updatedData };
};

// Generate verification code
export const generateVerificationCode = (email) => {
  // Implementation...
};

// Verify email
export const verifyEmail = (email, code) => {
  // Implementation...
};

// Generate password reset token
export const generatePasswordResetToken = (email) => {
  // Implementation...
};

// Reset password
export const resetPassword = (email, token, newPassword) => {
  // Implementation...
};
```

### Authentication Context

The authentication state is managed through the AuthContext, which provides authentication state and functions to the component tree:

```jsx
// src/contexts/AuthContext.jsx
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
    // Implementation...
  };

  // Logout function
  const logoutUser = () => {
    // Implementation...
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    // Implementation...
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Protected Routes

Protected routes are implemented using a ProtectedLayout component that checks if the user is authenticated:

```jsx
// src/layouts/ProtectedLayout.jsx
function ProtectedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}
```

These protected routes are defined in the App component:

```jsx
// src/App.jsx
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    {/* More protected routes... */}
  </Route>
</Routes>
```

### Authentication Pages

#### Login Page

```jsx
// src/pages/Login.jsx
function Login() {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render login form...
}
```

#### Signup Page

```jsx
// src/pages/Signup.jsx
function Signup() {
  const navigate = useNavigate();
  const { registerUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render signup form...
}
```

## Security Considerations

While this implementation uses local storage for demonstration purposes, a production application would implement several security measures:

1. **Server-side Authentication**: Move authentication logic to a secure backend
2. **HTTPS**: Ensure all communication is encrypted
3. **JWT or Session Tokens**: Use secure tokens instead of storing user data in local storage
4. **Password Hashing**: Hash passwords before storing them
5. **CSRF Protection**: Implement measures against cross-site request forgery
6. **Rate Limiting**: Prevent brute force attacks
7. **Two-Factor Authentication**: Add an extra layer of security

## Conclusion

The authentication system in Sigmapay provides a complete user authentication flow with registration, login, and profile management. While it uses local storage for demonstration purposes, it's designed to be easily replaced with a real backend authentication system in a production environment.
