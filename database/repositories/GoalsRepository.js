'use strict';

/**
 * GoalsRepository
 * Implements IFinancialGoal / IGoalProgress as defined in the Data Layer.
 */

const FinancialGoal  = require('../models/FinancialGoal');
const GoalProgress   = require('../models/GoalProgress');

class GoalsRepository {
  /**
   * Create a new financial goal.
   * @param {string} userId
   * @param {string} type         'savings' | 'debt_payoff' | 'purchase'
   * @param {number} targetAmount
   * @param {string} deadline     ISO date string
   * @param {string} priority     'high' | 'medium' | 'low'
   * @returns {Promise<string>}   new goal _id
   */
  async createGoal(userId, type, targetAmount, deadline, priority) {
    const goal = await FinancialGoal.create({
      userId,
      name:   type,
      type,
      targetAmount,
      deadline: new Date(deadline),
      priority,
    });
    return goal._id.toString();
  }

  /**
   * Fetch a single goal by ID.
   * @param {string} goalId
   * @returns {Promise<object|null>}
   */
  async getGoal(goalId) {
    return FinancialGoal.findById(goalId).lean();
  }

  /**
   * List all goals for a user, optionally filtered by status.
   * @param {string} userId
   * @param {string} [status]
   * @returns {Promise<object[]>}
   */
  async listGoals(userId, status) {
    const filter = { userId };
    if (status) filter.status = status;
    return FinancialGoal.find(filter).sort({ createdAt: -1 }).lean();
  }

  /**
   * Write a progress snapshot for a goal.
   * @param {string} userId
   * @param {string} goalId
   * @param {object} progress  { currentAmount, percentage, status }
   * @returns {Promise<boolean>}
   */
  async writeProgress(userId, goalId, progress) {
    await GoalProgress.create({
      userId,
      goalId,
      currentAmount: progress.currentAmount,
      percentage:    progress.percentage,
      status:        progress.status,
    });

    // Keep the goal's own status in sync
    if (progress.status === 'achieved') {
      await FinancialGoal.updateOne({ _id: goalId }, { status: 'achieved' });
    }
    return true;
  }

  /**
   * Adjust goal target and/or deadline.
   * @param {string} goalId
   * @param {number} newTarget
   * @param {Date}   newDeadline
   * @returns {Promise<boolean>}
   */
  async adjustPlan(goalId, newTarget, newDeadline) {
    const result = await FinancialGoal.updateOne(
      { _id: goalId },
      { targetAmount: newTarget, deadline: new Date(newDeadline) }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Get latest progress for a goal.
   * @param {string} goalId
   * @returns {Promise<object|null>}
   */
  async getLatestProgress(goalId) {
    return GoalProgress.findOne({ goalId }).sort({ recordedAt: -1 }).lean();
  }
}

module.exports = new GoalsRepository();
