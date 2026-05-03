'use strict';

/**
 * NotificationsRepository
 * Implements INotification / INotificationPreferences as defined in the Data Layer.
 */

const Notification            = require('../models/Notification');
const NotificationPreferences = require('../models/NotificationPreferences');

class NotificationsRepository {
  /**
   * Persist a notification template / message body.
   * @param {string} templateId
   * @param {string} content
   * @param {string} channel  'push' | 'sms' | 'email'
   * @returns {Promise<boolean>}
   */
  async saveTemplate(templateId, content, channel) {
    // Templates stored as a special system notification record with userId='system'
    await Notification.create({
      userId:    '000000000000000000000000',
      messageId: templateId,
      message:   content,
      channel,
      status:    'sent',
    });
    return true;
  }

  /**
   * Retrieve notification preferences for a user.
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getPreferences(userId) {
    let prefs = await NotificationPreferences.findOne({ userId }).lean();
    if (!prefs) {
      // Return defaults without persisting — service layer can upsert on first save
      prefs = { userId, pushEnabled: true, smsEnabled: true, emailEnabled: true };
    }
    return prefs;
  }

  /**
   * Upsert notification preferences for a user.
   * @param {string}  userId
   * @param {string}  type    'push' | 'sms' | 'email'
   * @param {boolean} enabled
   * @returns {Promise<boolean>}
   */
  async setPreference(userId, type, enabled) {
    const field = `${type}Enabled`;
    await NotificationPreferences.findOneAndUpdate(
      { userId },
      { [field]: enabled },
      { upsert: true }
    );
    return true;
  }

  /**
   * Write a notification delivery record to the history.
   * @param {string} userId
   * @param {string} messageId
   * @param {string} channel
   * @param {string} status    'sent' | 'failed'
   * @param {string} at        ISO date string
   * @returns {Promise<boolean>}
   */
  async saveHistory(userId, messageId, channel, status, at) {
    await Notification.create({
      userId,
      messageId,
      message: messageId, // message content stored separately; use messageId as reference
      channel,
      status,
      at: new Date(at),
    });
    return true;
  }

  /**
   * Schedule a future notification (e.g. bill reminder).
   * @param {string} userId
   * @param {string} message
   * @param {string} channel
   * @param {string} at   ISO date string for when to send
   * @returns {Promise<string>}  new notification _id
   */
  async scheduleMessage(userId, message, channel, at) {
    const notif = await Notification.create({
      userId,
      message,
      channel,
      status:      'pending',
      scheduledAt: new Date(at),
    });
    return notif._id.toString();
  }

  /**
   * Retrieve notification history for a user.
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<object[]>}
   */
  async getHistory(userId, limit = 50) {
    return Notification.find({
      userId,
      userId: { $ne: '000000000000000000000000' }, // exclude system template records
    }).sort({ at: -1 }).limit(limit).lean();
  }
}

module.exports = new NotificationsRepository();
