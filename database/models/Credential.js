'use strict';

/**
 * Credential — stores hashed password for a user.
 * Derived from CredentialRecord / IAuth in Data Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CredentialSchema = new Schema(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true, unique: true },
    passwordHash: { type: String, required: true },
    updatedAt:    { type: Date, default: Date.now },
  },
  { _id: true }
);

// userId unique index is created automatically via the schema field definition above

module.exports = mongoose.model('Credential', CredentialSchema);
