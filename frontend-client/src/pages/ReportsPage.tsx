import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface ReportsPageProps {
  userId: string;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ userId }) => {
  const [monthlySummary, setMonthlySummary] = useState('');
  const [incomeStatement, setIncomeStatement] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateMonthlySummary = async () => {
    setLoading(true);
    const response = await apiClient.generateMonthlySummary(userId);
    setLoading(false);
    
    if (response.success) {
      setMonthlySummary(response.report);
    } else {
      setMonthlySummary('Failed to generate monthly summary');
    }
  };

  const handleGenerateIncomeStatement = async () => {
    setLoading(true);
    const response = await apiClient.generateIncomeStatement(userId);
    setLoading(false);
    
    if (response.success) {
      setIncomeStatement(response.report);
    } else {
      setIncomeStatement('Failed to generate income statement');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Financial Reports</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Monthly Summary</h2>
        <button 
          onClick={handleGenerateMonthlySummary} 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Monthly Summary'}
        </button>
        {monthlySummary && (
          <div style={styles.reportCard}>
            <pre style={styles.reportContent}>{monthlySummary}</pre>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Income Statement</h2>
        <button 
          onClick={handleGenerateIncomeStatement} 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Income Statement'}
        </button>
        {incomeStatement && (
          <div style={styles.reportCard}>
            <pre style={styles.reportContent}>{incomeStatement}</pre>
          </div>
        )}
      </div>

      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>About Reports</h3>
        <p style={styles.infoText}>
          Reports are generated based on your budget, expenses, and transactions. 
          The monthly summary provides an overview of your spending patterns, 
          while the income statement shows your income vs expenses.
        </p>
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
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#FF9800',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #2196F3',
  },
  infoTitle: {
    color: '#1976D2',
    marginTop: 0,
  },
  infoText: {
    color: '#555',
    lineHeight: '1.6',
  },
};

export default ReportsPage;
