'use strict';

/**
 * NotificationPreferences — per-user notification channel settings.
 * Derived from NotificationPreferences / INotificationPreferences in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationPreferencesSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true, unique: true },
    pushEnabled: { type: Boolean, default: true },
    smsEnabled:  { type: Boolean, default: true },
    emailEnabled:{ type: Boolean, default: true },
  },
  { timestamps: true }
);

// userId unique index is created automatically via the schema field definition above

module.exports = mongoose.model('NotificationPreferences', NotificationPreferencesSchema);
