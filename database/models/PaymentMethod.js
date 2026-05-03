'use strict';

/**
 * PaymentMethod — stored / tokenised payment instruments (cards, wallets, banks).
 * Derived from IPaymentMethod in Business Domain Layer and PaymentsRepository.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentMethodSchema = new Schema(
  {
    userId:   { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    type:     { type: String, enum: ['card', 'wallet', 'bank'], required: true },
    token:    { type: String, required: true },   // tokenised card/bank reference
    scheme:   { type: String, default: '' },      // 'visa', 'mastercard', 'meeza', etc.
    last4:    { type: String, default: '' },
    verified: { type: Boolean, default: false },
    label:    { type: String, default: '' },      // friendly name shown in UI
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ userId: 1 });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
