'use strict';

/**
 * LoginActivity — per-login device/IP record shown to the user.
 * Derived from LoginActivity / ILoginActivity in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const LoginActivitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    at:     { type: Date, default: Date.now },
    device: { type: String, default: '' },
    ip:     { type: String, default: '' },
    status: { type: String, enum: ['success', 'failed'], required: true },
  },
  { _id: true }
);

LoginActivitySchema.index({ userId: 1, at: -1 });

module.exports = mongoose.model('LoginActivity', LoginActivitySchema);
