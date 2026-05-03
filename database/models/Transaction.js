'use strict';

/**
 * Transaction — individual expense/income records.
 * Derived from Transaction / ITransaction in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    category:      { type: String, required: true },
    amount:        { type: Number, required: true },
    currency:      { type: String, default: 'EGP' },
    at:            { type: Date, default: Date.now },
    paymentMethod: { type: String, default: '' }, // 'card', 'wallet', 'bank', etc.
    description:   { type: String, default: '' },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, at: -1 });
TransactionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
