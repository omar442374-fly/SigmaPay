'use strict';

/**
 * Session — active auth sessions / tokens.
 * Derived from createSession / getSession in AuthRepository (Data Layer).
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    token:     { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revoked:   { type: Boolean, default: false },
    meta:      { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// token unique index is created automatically via the schema field definition above
SessionSchema.index({ userId: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index — Atlas removes expired docs automatically

module.exports = mongoose.model('Session', SessionSchema);
