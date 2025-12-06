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
    maxWidth: '900px',
    margin: '30px auto',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px',
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  section: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    animation: 'fadeInUp 0.5s ease',
  },
  subtitle: {
    color: '#2d3748',
    marginBottom: '24px',
    fontSize: '22px',
    fontWeight: '600',
    borderBottom: '3px solid #FF9800',
    paddingBottom: '10px',
  },
  button: {
    padding: '16px 28px',
    fontSize: '17px',
    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
  },
  reportCard: {
    marginTop: '24px',
    padding: '24px',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
  },
  reportContent: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    margin: 0,
    color: '#2d3748',
  },
  infoBox: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: '24px',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
  },
  infoTitle: {
    color: '#1976D2',
    marginTop: 0,
    fontSize: '20px',
    fontWeight: '600',
  },
  infoText: {
    color: '#2d3748',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default ReportsPage;
