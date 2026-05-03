'use strict';

/**
 * PaymentTransaction — record of each processed payment.
 * Derived from PaymentTransaction / IPaymentTransaction in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentTransactionSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    methodId:    { type: Schema.Types.ObjectId, ref: 'PaymentMethod', required: true },
    merchantId:  { type: String, default: '' },
    amount:      { type: Number, required: true, min: 0 },
    currency:    { type: String, default: 'EGP' },
    status:      { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    providerRef: { type: String, default: '' }, // provider's transaction ID
    authRef:     { type: String, default: '' }, // authorisation code
    at:          { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PaymentTransactionSchema.index({ userId: 1, at: -1 });
PaymentTransactionSchema.index({ status: 1 });

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
