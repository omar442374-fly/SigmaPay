'use strict';

/**
 * SavingsGroup — a shared savings group with a collective target.
 * Derived from SavingsGroup / ISavingsGroup in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SavingsGroupSchema = new Schema(
  {
    name:         { type: String, required: true },
    targetAmount: { type: Number, required: true, min: 0 },
    currency:     { type: String, default: 'EGP' },
    adminId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    rules:        { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

SavingsGroupSchema.index({ adminId: 1 });

module.exports = mongoose.model('SavingsGroup', SavingsGroupSchema);
