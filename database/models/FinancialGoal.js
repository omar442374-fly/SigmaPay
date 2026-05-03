'use strict';

/**
 * FinancialGoal — a savings / spending goal set by a user.
 * Derived from FinancialGoal / IFinancialGoal in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const FinancialGoalSchema = new Schema(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    name:         { type: String, required: true },
    type:         { type: String, required: true }, // e.g. 'savings', 'debt_payoff', 'purchase'
    targetAmount: { type: Number, required: true, min: 0 },
    currency:     { type: String, default: 'EGP' },
    deadline:     { type: Date, required: true },
    priority:     { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    status:       { type: String, enum: ['active', 'achieved', 'paused', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

FinancialGoalSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('FinancialGoal', FinancialGoalSchema);
