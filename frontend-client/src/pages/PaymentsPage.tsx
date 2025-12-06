import React, { useState } from 'react';
import apiClient from '../api/apiClient';

interface PaymentsPageProps {
  userId: string;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ userId }) => {
  const [methodId, setMethodId] = useState('card');
  const [amount, setAmount] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [verifyMethodId, setVerifyMethodId] = useState('');
  const [CVV, setCVV] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [message, setMessage] = useState('');

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.processPayment(userId, methodId, parseFloat(amount), merchantId);
    setMessage(response.success ? 'Payment processed successfully!' : 'Failed to process payment');
    if (response.success) {
      setAmount('');
      setMerchantId('');
    }
  };

  const handleVerifyPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.verifyPaymentMethod(userId, verifyMethodId, CVV);
    setMessage(response.success ? 'Payment method verified!' : 'Failed to verify payment method');
    if (response.success) {
      setCVV('');
    }
  };

  const handleRequestRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.requestRefund(userId, transactionId, parseFloat(refundAmount), refundReason);
    setMessage(response.success ? 'Refund requested successfully!' : 'Failed to request refund');
    if (response.success) {
      setTransactionId('');
      setRefundAmount('');
      setRefundReason('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payments</h1>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Process Payment</h2>
        <form onSubmit={handleProcessPayment} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method:</label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              style={styles.input}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount ($):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Merchant ID:</label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Process Payment
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Verify Payment Method</h2>
        <form onSubmit={handleVerifyPaymentMethod} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method ID:</label>
            <input
              type="text"
              value={verifyMethodId}
              onChange={(e) => setVerifyMethodId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CVV:</label>
            <input
              type="text"
              value={CVV}
              onChange={(e) => setCVV(e.target.value)}
              required
              style={styles.input}
              maxLength={4}
            />
          </div>
          <button type="submit" style={styles.button}>
            Verify Payment Method
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subtitle}>Request Refund</h2>
        <form onSubmit={handleRequestRefund} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Transaction ID:</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Refund Amount ($):</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              required
              style={styles.input}
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason:</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              required
              style={{ ...styles.input, minHeight: '80px' }}
            />
          </div>
          <button type="submit" style={styles.button}>
            Request Refund
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
    backgroundColor: '#FF5722',
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

export default PaymentsPage;
