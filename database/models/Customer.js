'use strict';

/**
 * Customer — personal / KYC details linked to a UserAccount.
 * Derived from Customer in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true, unique: true },
    fullName:   { type: String, required: true },
    nationalId: { type: String, required: true },
    phone:      { type: String, required: true },
    email:      { type: String, required: true, lowercase: true },
  },
  { timestamps: true }
);

// userId unique index is created automatically via the schema field definition above

module.exports = mongoose.model('Customer', CustomerSchema);
