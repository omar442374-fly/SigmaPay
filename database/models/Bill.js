'use strict';

/**
 * Bill — recurring or one-off bills added by a user.
 * Derived from IBill in Business Domain Layer / IPaymentsServiceBL.addBill().
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const BillSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    provider:    { type: String, required: true },   // e.g. 'Vodafone', 'Cairo Electricity'
    accountRef:  { type: String, required: true },   // user's account / meter number at provider
    amount:      { type: Number, required: true, min: 0 },
    currency:    { type: String, default: 'EGP' },
    dueAt:       { type: Date, required: true },
    recurring:   { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null },      // next scheduled payment date
    status:      { type: String, enum: ['unpaid', 'scheduled', 'paid', 'overdue'], default: 'unpaid' },
  },
  { timestamps: true }
);

BillSchema.index({ userId: 1, dueAt: 1 });
BillSchema.index({ status: 1 });

module.exports = mongoose.model('Bill', BillSchema);
