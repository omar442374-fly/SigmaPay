import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface GoalsPageProps {
  userId: string;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ userId }) => {
  const [goalType, setGoalType] = useState('Savings');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Medium');
  const [message, setMessage] = useState('');

  // Progress tracking
  const [progressGoalId, setProgressGoalId] = useState('');
  const [progressData, setProgressData] = useState<any>(null);

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.createGoal(
      userId,
      goalType,
      parseFloat(targetAmount),
      deadline,
      priorityLevel
    );

    if (response.success && response.goal) {
      setMessage(`Goal created successfully! Goal ID: ${response.goal.goalId}`);
      setProgressGoalId(response.goal.goalId);
    } else {
      setMessage('Failed to create goal');
    }
  };

  const handleTrackProgress = async () => {
    if (!progressGoalId) {
      setMessage('Please create a goal first or enter a goal ID');
      return;
    }

    const response = await apiClient.trackProgress(userId, progressGoalId);
    if (response.success && response.progress) {
      setProgressData(response.progress);
    } else {
      setMessage('Failed to track progress');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Goals</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Set Financial Goal</h2>
        <form onSubmit={handleSetGoal} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Goal Type:</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              style={styles.input}
            >
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
              <option value="Emergency Fund">Emergency Fund</option>
              <option value="Vacation">Vacation</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Target Amount ($):</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Deadline:</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Priority Level:</label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              style={styles.input}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>
            Set Goal
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Track Progress</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Goal ID:</label>
          <input
            type="text"
            value={progressGoalId}
            onChange={(e) => setProgressGoalId(e.target.value)}
            style={styles.input}
            placeholder="Enter goal ID or create a new goal"
          />
        </div>
        <button onClick={handleTrackProgress} style={styles.button}>
          Track Progress
        </button>
        
        {progressData && (
          <div style={styles.progressCard}>
            <h3>Progress Report</h3>
            <p><strong>Goal ID:</strong> {progressData.goalId}</p>
            <p><strong>Completion:</strong> {progressData.percentageComplete.toFixed(2)}%</p>
            <p><strong>Remaining Amount:</strong> ${progressData.remainingAmount.amount}</p>
            <p><strong>Days Remaining:</strong> {progressData.daysRemaining}</p>
            <p><strong>Status:</strong> {progressData.onTrack ? '✅ On Track' : '⚠️ Behind Schedule'}</p>
          </div>
        )}
      </div>
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
    backgroundColor: '#9C27B0',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f3e5f5',
    border: '1px solid #9C27B0',
    borderRadius: '4px',
  },
  progressCard: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
};

export default GoalsPage;
