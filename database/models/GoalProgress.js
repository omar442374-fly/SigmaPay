'use strict';

/**
 * GoalProgress — tracks contribution progress toward a FinancialGoal.
 * Derived from GoalProgress / IGoalProgress in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GoalProgressSchema = new Schema(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    goalId:        { type: Schema.Types.ObjectId, ref: 'FinancialGoal', required: true },
    currentAmount: { type: Number, required: true, min: 0 },
    percentage:    { type: Number, required: true, min: 0, max: 100 },
    status:        { type: String, enum: ['on_track', 'behind', 'achieved', 'paused'], default: 'on_track' },
    recordedAt:    { type: Date, default: Date.now },
  },
  { _id: true }
);

GoalProgressSchema.index({ userId: 1, goalId: 1, recordedAt: -1 });

module.exports = mongoose.model('GoalProgress', GoalProgressSchema);
