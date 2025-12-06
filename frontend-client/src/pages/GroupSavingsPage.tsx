import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface GroupSavingsPageProps {
  userId: string;
}

const GroupSavingsPage: React.FC<GroupSavingsPageProps> = ({ userId }) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState('');
  const [groupId, setGroupId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [reportGroupId, setReportGroupId] = useState('');
  const [report, setReport] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const membersList = members.split(',').map(m => m.trim());
    const response = await apiClient.createGroup(groupName, membersList);
    if (response.success && response.group) {
      setMessage(`Group created successfully! Group ID: ${response.group.groupId}`);
      setGroupId(response.group.groupId);
      setReportGroupId(response.group.groupId);
      setGroupName('');
      setMembers('');
    } else {
      setMessage('Failed to create group');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.addMemberToGroup(groupId, memberId);
    setMessage(response.success ? 'Member added successfully!' : 'Failed to add member');
    if (response.success) {
      setMemberId('');
    }
  };

  const handleProcessDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.processGroupDeposit(groupId, userId, parseFloat(depositAmount));
    setMessage(response.success ? 'Deposit processed successfully!' : 'Failed to process deposit');
    if (response.success) {
      setDepositAmount('');
    }
  };

  const handleGenerateReport = async () => {
    const response = await apiClient.getGroupReport(reportGroupId);
    if (response.success && response.report) {
      setReport(response.report);
    } else {
      setReport('Failed to generate report');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Group Savings</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Create Savings Group</h2>
        <form onSubmit={handleCreateGroup} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group Name:</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Members (comma-separated user IDs):</label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              required
              style={styles.input}
              placeholder="user1, user2, user3"
            />
          </div>
          <button type="submit" style={styles.button}>
            Create Group
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Add Member to Group</h2>
        <form onSubmit={handleAddMember} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group ID:</label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Member User ID:</label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Add Member
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Make Deposit</h2>
        <form onSubmit={handleProcessDeposit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Group ID:</label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Deposit Amount ($):</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <button type="submit" style={styles.button}>
            Process Deposit
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Group Report</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Group ID:</label>
          <input
            type="text"
            value={reportGroupId}
            onChange={(e) => setReportGroupId(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleGenerateReport} style={styles.button}>
          Generate Group Report
        </button>
        {report && (
          <div style={styles.reportCard}>
            <pre style={styles.reportContent}>{report}</pre>
          </div>
        )}
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
    backgroundColor: '#00BCD4',
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
  reportCard: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  reportContent: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
};

export default GroupSavingsPage;
