'use strict';

/**
 * AuthEvent — audit log of authentication events (login, logout, 2FA, reset).
 * Derived from logAuthEvent in AuthRepository (Data Layer).
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuthEventSchema = new Schema(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    eventType: { type: String, required: true }, // e.g. 'login', 'logout', 'password_reset', '2fa_enabled'
    details:   { type: String, default: '' },
    at:        { type: Date, default: Date.now },
  },
  { _id: true }
);

AuthEventSchema.index({ userId: 1, at: -1 });

module.exports = mongoose.model('AuthEvent', AuthEventSchema);
