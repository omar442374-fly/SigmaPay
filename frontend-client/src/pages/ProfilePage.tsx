import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.updateAccount(userId, email, phoneNumber, address);
    setMessage(response.message || (response.success ? 'Profile updated successfully' : 'Failed to update profile'));
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.changeUsername(userId, newUsername);
    setMessage(response.message || (response.success ? 'Username changed successfully' : 'Failed to change username'));
    if (response.success) {
      setNewUsername('');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.changePassword(userId, oldPassword, newPassword);
    setMessage(response.message || (response.success ? 'Password changed successfully' : 'Failed to change password'));
    if (response.success) {
      setOldPassword('');
      setNewPassword('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Account Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Update Profile Information</h2>
        <form onSubmit={handleUpdateProfile} style={styles.form}>
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
            <label style={styles.label}>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Update Profile
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Change Username</h2>
        <form onSubmit={handleChangeUsername} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Username:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Change Username
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Change Password</h2>
        <form onSubmit={handleChangePassword} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    color: '#555',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e3f2fd',
    border: '1px solid #2196F3',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default ProfilePage;
