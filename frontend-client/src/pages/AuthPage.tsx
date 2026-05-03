import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface AuthPageProps {
  onLoginSuccess: (userId: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.register(username, email, password, phoneNumber);
    
    if (response.success) {
      setMessage('Account created successfully! You can now login.');
      // For mock purposes, we'll auto-login by generating a userId
      // NOTE: In production, use crypto.randomUUID() or proper auth token
      const mockUserId = 'user-' + Date.now();
      setTimeout(() => onLoginSuccess(mockUserId), 1500);
    } else {
      setMessage('Failed to create account: ' + (response.message || 'Unknown error'));
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SigmaPay - Register</h1>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Create Account
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '60px auto',
    padding: '40px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'fadeInUp 0.5s ease',
  },
  title: {
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: '35px',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  button: {
    padding: '16px',
    fontSize: '17px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '10px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  message: {
    marginTop: '24px',
    padding: '16px',
    background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    border: 'none',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(150, 230, 161, 0.3)',
  },
};

export default AuthPage;
