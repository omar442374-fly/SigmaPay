import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';

const BudgetPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [totalAmount, setTotalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categories, setCategories] = useState('Food,Transport,Entertainment,Shopping');
  const [message, setMessage] = useState('');

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [expenseMessage, setExpenseMessage] = useState('');

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryList = categories.split(',').map(c => c.trim());
    const response = await apiClient.createBudget(
      userId,
      parseFloat(totalAmount),
      startDate,
      endDate,
      categoryList
    );

    if (response.success) {
      const budgetId = (response as any).budgetId || (response as any).budget?.id;
      setMessage(`Budget created successfully! Budget ID: ${budgetId}`);
    } else {
      setMessage('Failed to create budget');
    }
  };

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.recordExpense(
      userId,
      parseFloat(expenseAmount),
      expenseCategory,
      new Date().toISOString(),
      'card'
    );

    if (response.success) {
      setExpenseMessage('Expense recorded successfully!');
      setExpenseAmount('');
    } else {
      setExpenseMessage('Failed to record expense');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Budget Management</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Create Budget</h2>
        <form onSubmit={handleCreateBudget} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Total Amount ($):</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Categories (comma-separated):</label>
            <input
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Create Budget
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Record Expense</h2>
        <form onSubmit={handleRecordExpense} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount ($):</label>
            <input
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category:</label>
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              style={styles.input}
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
            </select>
          </div>
          <button type="submit" style={styles.button}>
            Record Expense
          </button>
        </form>
        {expenseMessage && <p style={styles.message}>{expenseMessage}</p>}
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
    borderBottom: '3px solid #667eea',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
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
    marginTop: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  message: {
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#2d3748',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(132, 250, 176, 0.3)',
  },
};

export default BudgetPage;
