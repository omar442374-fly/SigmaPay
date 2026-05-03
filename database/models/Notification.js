'use strict';

/**
 * Notification — history of messages delivered to users.
 * Derived from INotification / NotificationsRepository in Data Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    messageId:   { type: String, default: '' },
    message:     { type: String, required: true },
    channel:     { type: String, enum: ['push', 'sms', 'email'], required: true },
    status:      { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    at:          { type: Date, default: Date.now },
    scheduledAt: { type: Date, default: null },
  },
  { _id: true }
);

NotificationSchema.index({ userId: 1, at: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
