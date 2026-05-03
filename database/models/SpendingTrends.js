'use strict';

/**
 * SpendingTrends — precomputed/aggregated per-period spending by category.
 * Derived from SpendingTrends / ISpendingTrends in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpendingTrendsSchema = new Schema(
  {
    userId:         { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    period:         { type: String, required: true }, // e.g. '2025-04', '2025-Q1'
    categoryTotals: { type: Schema.Types.Mixed, default: {} }, // { food: 500, transport: 200 }
  },
  { timestamps: true }
);

SpendingTrendsSchema.index({ userId: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('SpendingTrends', SpendingTrendsSchema);
