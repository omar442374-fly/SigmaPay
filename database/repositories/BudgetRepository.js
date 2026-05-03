'use strict';

/**
 * BudgetRepository
 * Implements IBudgetPlan / ITransaction / ISpendingTrends as defined in the Data Layer.
 */

const BudgetPlan      = require('../models/BudgetPlan');
const Transaction     = require('../models/Transaction');
const SpendingTrends  = require('../models/SpendingTrends');

class BudgetRepository {
  /**
   * Create a new budget plan.
   * @param {string}   userId
   * @param {number}   totalAmount
   * @param {string}   startDate   ISO date string
   * @param {string}   endDate     ISO date string
   * @param {string[]} categories
   * @returns {Promise<string>}  new budget _id
   */
  async createBudget(userId, totalAmount, startDate, endDate, categories) {
    const plan = await BudgetPlan.create({
      userId,
      totalAmount,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      categories,
    });
    return plan._id.toString();
  }

  /**
   * Record a new expense transaction and update budget aggregates.
   * @param {string} userId
   * @param {number} amount
   * @param {string} category
   * @param {string} date     ISO date string
   * @param {string} method   Payment method label
   * @returns {Promise<string>}  new transaction _id
   */
  async addExpense(userId, amount, category, date, method) {
    const tx = await Transaction.create({
      userId,
      amount,
      category,
      at:            new Date(date),
      paymentMethod: method,
    });

    // Derive period key (YYYY-MM) and update budget aggregates
    const period = new Date(date).toISOString().slice(0, 7);
    await BudgetPlan.updateOne(
      { userId, startDate: { $lte: new Date(date) }, endDate: { $gte: new Date(date) } },
      { $inc: { [`aggregates.${category}`]: amount } }
    );

    // Upsert spending trends
    await SpendingTrends.findOneAndUpdate(
      { userId, period },
      { $inc: { [`categoryTotals.${category}`]: amount } },
      { upsert: true }
    );

    return tx._id.toString();
  }

  /**
   * Retrieve the budget plan for a user in a given period (YYYY-MM).
   * @param {string} userId
   * @param {string} period  e.g. '2025-04'
   * @returns {Promise<object|null>}
   */
  async getBudget(userId, period) {
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month,     0, 23, 59, 59);
    return BudgetPlan.findOne({ userId, startDate: { $lte: end }, endDate: { $gte: start } }).lean();
  }

  /**
   * Apply incremental updates to budget aggregates (e.g. after category change).
   * @param {string} userId
   * @param {string} period  YYYY-MM
   * @param {object} deltas  { category: deltaAmount }
   * @returns {Promise<boolean>}
   */
  async updateAggregates(userId, period, deltas) {
    const inc = {};
    for (const [cat, delta] of Object.entries(deltas)) {
      inc[`aggregates.${cat}`] = delta;
    }
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month,     0, 23, 59, 59);
    const result = await BudgetPlan.updateOne(
      { userId, startDate: { $lte: end }, endDate: { $gte: start } },
      { $inc: inc }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Fetch spending trends for a user in a given period.
   * @param {string} userId
   * @param {string} period
   * @returns {Promise<object|null>}
   */
  async getSpendingTrends(userId, period) {
    return SpendingTrends.findOne({ userId, period }).lean();
  }
}

module.exports = new BudgetRepository();
