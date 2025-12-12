import { getAssetPath } from './assets';

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
  profileImage: getAssetPath('photo placeholder.png'), // Use placeholder image by default
  isVerified: true, // Set to true to skip email verification
  verificationCode: null,
  preferences: {
    theme: 'light',
    notifications: true,
    twoFactorAuth: false
  }
};

// Helper function to generate random codes
const generateRandomCode = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

export const registerUser = (userData) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    throw new Error('Email already registered');
  }

  // Skip verification code generation since we're skipping email verification
  // const verificationCode = generateRandomCode();

  const newUser = {
    ...userData,
    ...DEFAULT_USER_DATA,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    verificationCode: null,
    // isVerified is already set to true in DEFAULT_USER_DATA
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Email verification is skipped
  console.log(`User registered successfully: ${userData.email} (Email verification skipped)`);

  return newUser;
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verification check is skipped
  // if (!user.isVerified) {
  //   throw new Error('Account not verified. Please check your email for verification instructions.');
  // }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const updateUserProfile = (updatedData) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('No user is currently logged in');
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

  // Save updated users array
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  return getCurrentUser();
};

export const updateFinancialInfo = (financialData) => {
  return updateUserProfile(financialData);
};

export const uploadProfileImage = (imageData) => {
  return updateUserProfile({ profileImage: imageData });
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Verify user account with verification code
export const verifyUserAccount = (email, code) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const user = users[userIndex];

  if (user.isVerified) {
    throw new Error('Account already verified');
  }

  if (user.verificationCode !== code) {
    throw new Error('Invalid verification code');
  }

  // Update user verification status
  user.isVerified = true;
  user.verificationCode = null;
  users[userIndex] = user;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // If this is the current user, update the current user in local storage
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  return user;
};

// Resend verification code
export const resendVerificationCode = (email) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const user = users[userIndex];

  if (user.isVerified) {
    throw new Error('Account already verified');
  }

  // Generate new verification code
  const verificationCode = generateRandomCode();
  user.verificationCode = verificationCode;
  users[userIndex] = user;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // In a real application, we would send an email with the verification code
  // For this demo, we'll just return the code
  console.log(`New verification code for ${email}: ${verificationCode}`);

  return verificationCode;
};

// Change password
export const changePassword = (userId, currentPassword, newPassword) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const user = users[userIndex];

  // Verify current password
  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  users[userIndex] = user;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // If this is the current user, update the current user in local storage
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  return user;
};

// Request password reset
export const requestPasswordReset = (email) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Generate reset token
  const resetToken = generateRandomCode(8);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

  // Store reset token
  const resetTokens = JSON.parse(localStorage.getItem(PASSWORD_RESET_TOKENS_KEY) || '{}');
  resetTokens[email] = {
    token: resetToken,
    expiresAt: expiresAt.toISOString()
  };

  localStorage.setItem(PASSWORD_RESET_TOKENS_KEY, JSON.stringify(resetTokens));

  // In a real application, we would send an email with the reset link
  // For this demo, we'll just return the token
  console.log(`Password reset token for ${email}: ${resetToken}`);

  return resetToken;
};

// Reset password with token
export const resetPassword = (email, token, newPassword) => {
  const resetTokens = JSON.parse(localStorage.getItem(PASSWORD_RESET_TOKENS_KEY) || '{}');

  if (!resetTokens[email]) {
    throw new Error('No reset token found for this email');
  }

  const resetData = resetTokens[email];

  // Check if token is expired
  if (new Date(resetData.expiresAt) < new Date()) {
    throw new Error('Reset token has expired');
  }

  // Check if token is valid
  if (resetData.token !== token) {
    throw new Error('Invalid reset token');
  }

  // Update password
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const user = users[userIndex];
  user.password = newPassword;
  users[userIndex] = user;

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Remove used token
  delete resetTokens[email];
  localStorage.setItem(PASSWORD_RESET_TOKENS_KEY, JSON.stringify(resetTokens));

  return user;
};