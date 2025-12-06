import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

interface NotificationsPageProps {
  userId: string;
}

interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [preferenceType, setPreferenceType] = useState('email');
  const [isEnabled, setIsEnabled] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadNotifications = async () => {
    const response = await apiClient.getNotifications(userId);
    if (response.success && response.notifications) {
      setNotifications(response.notifications);
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.sendAlert(userId, alertMessage);
    setMessage(response.success ? 'Alert sent successfully!' : 'Failed to send alert');
    if (response.success) {
      setAlertMessage('');
      loadNotifications();
    }
  };

  const handleSetPreference = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.setNotificationPreference(userId, preferenceType, isEnabled);
    setMessage(response.success ? 'Preference updated successfully!' : 'Failed to update preference');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Notification History</h2>
        {notifications.length === 0 ? (
          <p style={styles.emptyMessage}>No notifications yet</p>
        ) : (
          <div style={styles.notificationList}>
            {notifications.map((notification) => (
              <div key={notification.notificationId} style={styles.notificationCard}>
                <div style={styles.notificationHeader}>
                  <span style={styles.notificationType}>{notification.type}</span>
                  <span style={styles.notificationTime}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                <p style={styles.notificationMessage}>{notification.message}</p>
                <span style={notification.read ? styles.readBadge : styles.unreadBadge}>
                  {notification.read ? 'Read' : 'Unread'}
                </span>
              </div>
            ))}
          </div>
        )}
        <button onClick={loadNotifications} style={styles.button}>
          Refresh Notifications
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Send Custom Alert</h2>
        <form onSubmit={handleSendAlert} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Alert Message:</label>
            <textarea
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              required
              style={{ ...styles.input, minHeight: '100px' }}
            />
          </div>
          <button type="submit" style={styles.button}>
            Send Alert
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Notification Preferences</h2>
        <form onSubmit={handleSetPreference} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Notification Type:</label>
            <select
              value={preferenceType}
              onChange={(e) => setPreferenceType(e.target.value)}
              style={styles.input}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notifications</option>
              <option value="budget">Budget Alerts</option>
              <option value="goals">Goal Updates</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                style={styles.checkbox}
              />
              Enabled
            </label>
          </div>
          <button type="submit" style={styles.button}>
            Update Preference
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    color: '#555',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
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
    backgroundColor: '#673AB7',
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
  notificationList: {
    marginBottom: '15px',
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '10px',
    border: '1px solid #ddd',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  notificationType: {
    fontWeight: 'bold',
    color: '#673AB7',
    textTransform: 'capitalize',
  },
  notificationTime: {
    fontSize: '12px',
    color: '#999',
  },
  notificationMessage: {
    color: '#333',
    marginBottom: '10px',
  },
  readBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    color: '#666',
  },
  unreadBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
};

export default NotificationsPage;
