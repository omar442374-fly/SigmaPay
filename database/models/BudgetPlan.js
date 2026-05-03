'use strict';

/**
 * BudgetPlan — a user's budget for a given time period with spending categories.
 * Derived from BudgetPlan / IBudgetPlan in Business Domain Layer and BudgetRepository.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const BudgetPlanSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    currency:    { type: String, default: 'EGP' },
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    categories:  { type: [String], default: [] },
    // aggregates: map of category => amount spent
    aggregates:  { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

BudgetPlanSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('BudgetPlan', BudgetPlanSchema);
