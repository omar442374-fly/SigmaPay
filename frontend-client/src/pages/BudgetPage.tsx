import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface BudgetPageProps {
  userId: string;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ userId }) => {
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
      setMessage(`Budget created successfully! Budget ID: ${response.budget?.budgetId}`);
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
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#e3f2fd',
    border: '1px solid #2196F3',
    borderRadius: '4px',
  },
};

export default BudgetPage;
