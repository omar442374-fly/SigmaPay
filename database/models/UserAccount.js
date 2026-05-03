'use strict';

/**
 * UserAccount — core account record (authentication identity).
 * Derived from IUserAccount / UserAccount in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserAccountSchema = new Schema(
  {
    username:      { type: String, required: true, unique: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:         { type: String, required: true },
    address:       { type: String, default: '' },
    enabled:       { type: Boolean, default: true },
    twoFAEnabled:  { type: Boolean, default: false },
    twoFAMethod:   { type: String, enum: ['sms', 'email', 'authenticator', null], default: null },
  },
  { timestamps: true }
);

// email and username unique indexes are created automatically via the schema field definitions above

module.exports = mongoose.model('UserAccount', UserAccountSchema);
