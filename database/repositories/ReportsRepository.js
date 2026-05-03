'use strict';

/**
 * ReportsRepository
 * Implements IReport as defined in the Data Layer diagram.
 * Stores and retrieves financial report metadata and exported files.
 */

const Report        = require('../models/Report');
const Transaction   = require('../models/Transaction');
const BudgetPlan    = require('../models/BudgetPlan');
const FinancialGoal = require('../models/FinancialGoal');

class ReportsRepository {
  /**
   * Fetch all transactions for a user within a period (YYYY-MM).
   * @param {string} userId
   * @param {string} period
   * @returns {Promise<object[]>}
   */
  async fetchTransactions(userId, period) {
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month,     0, 23, 59, 59);
    return Transaction.find({ userId, at: { $gte: start, $lte: end } }).sort({ at: -1 }).lean();
  }

  /**
   * Fetch all budget plans for a user within a period.
   * @param {string} userId
   * @param {string} period  YYYY-MM
   * @returns {Promise<object[]>}
   */
  async fetchBudgets(userId, period) {
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month,     0, 23, 59, 59);
    return BudgetPlan.find({
      userId,
      startDate: { $lte: end },
      endDate:   { $gte: start },
    }).lean();
  }

  /**
   * Fetch all goals for a user.
   * @param {string} userId
   * @returns {Promise<object[]>}
   */
  async fetchGoals(userId) {
    return FinancialGoal.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  /**
   * Save a report export record (PDF / CSV blob reference).
   * @param {string} userId
   * @param {string} type     'income_statement' | 'monthly_summary' | 'comparison'
   * @param {string} blobRef  Storage key / URL for the exported file
   * @param {object} meta
   * @returns {Promise<string>}  new report _id
   */
  async saveExport(userId, type, blobRef, meta = {}) {
    const report = await Report.create({ userId, type, period: meta.period || '', blobRef, meta });
    return report._id.toString();
  }

  /**
   * Retrieve a saved report record by ID.
   * @param {string} reportId
   * @returns {Promise<object|null>}
   */
  async getReport(reportId) {
    return Report.findById(reportId).lean();
  }

  /**
   * List all reports for a user.
   * @param {string} userId
   * @returns {Promise<object[]>}
   */
  async listReports(userId) {
    return Report.find({ userId }).sort({ createdAt: -1 }).lean();
  }
}

module.exports = new ReportsRepository();
