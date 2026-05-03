'use strict';

/**
 * PaymentsRepository
 * Implements IBill / IPaymentMethod / IPaymentTransaction as defined in the Data Layer.
 */

const PaymentMethod      = require('../models/PaymentMethod');
const PaymentTransaction = require('../models/PaymentTransaction');
const Bill               = require('../models/Bill');

class PaymentsRepository {
  // ─── Payment Methods ──────────────────────────────────────────────────────

  /**
   * Store a tokenised card/wallet/bank instrument.
   * @param {string} userId
   * @param {string} token   Tokenised reference from payment provider
   * @param {string} scheme  'visa' | 'mastercard' | 'meeza' | 'vodafone_cash' etc.
   * @param {string} last4
   * @param {string} type    'card' | 'wallet' | 'bank'
   * @returns {Promise<string>}  new method _id
   */
  async storeTokenizedCard(userId, token, scheme, last4, type = 'card') {
    const method = await PaymentMethod.create({ userId, token, scheme, last4, type });
    return method._id.toString();
  }

  /**
   * Retrieve a specific payment method.
   * @param {string} userId
   * @param {string} methodId
   * @returns {Promise<object|null>}
   */
  async getPaymentMethod(userId, methodId) {
    return PaymentMethod.findOne({ _id: methodId, userId }).lean();
  }

  /**
   * List all payment methods for a user.
   * @param {string} userId
   * @returns {Promise<object[]>}
   */
  async listPaymentMethods(userId) {
    return PaymentMethod.find({ userId }).lean();
  }

  /**
   * Mark a payment method as verified.
   * @param {string} userId
   * @param {string} methodId
   * @returns {Promise<boolean>}
   */
  async verifyPaymentMethod(userId, methodId) {
    const result = await PaymentMethod.updateOne({ _id: methodId, userId }, { verified: true });
    return result.modifiedCount > 0;
  }

  // ─── Payment Transactions ─────────────────────────────────────────────────

  /**
   * Create a payment transaction record (status defaults to 'pending').
   * @param {string} userId
   * @param {string} methodId
   * @param {number} amount
   * @param {string} merchantId
   * @param {string} authRef
   * @returns {Promise<string>}  new transaction _id
   */
  async createTransaction(userId, methodId, amount, merchantId, authRef) {
    const txn = await PaymentTransaction.create({ userId, methodId, amount, merchantId, authRef });
    return txn._id.toString();
  }

  /**
   * Update transaction status and provider reference after processing.
   * @param {string} txnId
   * @param {string} status       'completed' | 'failed' | 'refunded'
   * @param {string} providerRef
   * @returns {Promise<boolean>}
   */
  async updateTransactionStatus(txnId, status, providerRef) {
    const result = await PaymentTransaction.updateOne({ _id: txnId }, { status, providerRef });
    return result.modifiedCount > 0;
  }

  /**
   * Fetch transaction history for a user.
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<object[]>}
   */
  async getTransactionHistory(userId, limit = 50) {
    return PaymentTransaction.find({ userId }).sort({ at: -1 }).limit(limit).lean();
  }

  // ─── Bills ────────────────────────────────────────────────────────────────

  /**
   * Add a new bill for a user.
   * @param {string} userId
   * @param {string} provider
   * @param {string} accountRef  User's account number at the provider
   * @param {object} money       { amount, currency }
   * @param {Date}   dueAt
   * @returns {Promise<string>}  new bill _id
   */
  async addBill(userId, provider, accountRef, money, dueAt) {
    const bill = await Bill.create({
      userId,
      provider,
      accountRef,
      amount:   money.amount,
      currency: money.currency || 'EGP',
      dueAt:    new Date(dueAt),
    });
    return bill._id.toString();
  }

  /**
   * Schedule a bill payment (one-off or recurring).
   * @param {string}  userId
   * @param {string}  billId
   * @param {Date}    when
   * @param {boolean} recurring
   * @returns {Promise<boolean>}
   */
  async scheduleBill(userId, billId, when, recurring) {
    const result = await Bill.updateOne(
      { _id: billId, userId },
      { scheduledAt: new Date(when), recurring, status: 'scheduled' }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Mark a bill as paid.
   * @param {string} billId
   * @returns {Promise<boolean>}
   */
  async markBillPaid(billId) {
    const result = await Bill.updateOne({ _id: billId }, { status: 'paid' });
    return result.modifiedCount > 0;
  }

  /**
   * List bills for a user, optionally filtered by status.
   * @param {string} userId
   * @param {string} [status]
   * @returns {Promise<object[]>}
   */
  async listBills(userId, status) {
    const filter = { userId };
    if (status) filter.status = status;
    return Bill.find(filter).sort({ dueAt: 1 }).lean();
  }
}

module.exports = new PaymentsRepository();
