'use strict';

/**
 * AuthRepository
 * Implements IAuth as defined in the Data Layer diagram.
 * Handles credentials, sessions, and auth audit events.
 */

const Credential   = require('../models/Credential');
const Session      = require('../models/Session');
const AuthEvent    = require('../models/AuthEvent');
const LoginActivity = require('../models/LoginActivity');

class AuthRepository {
  /**
   * Retrieve hashed password + metadata for a user.
   * @param {string} userId
   * @returns {Promise<object|null>}
   */
  async getCredentialsByUserId(userId) {
    return Credential.findOne({ userId }).lean();
  }

  /**
   * Update the user's password hash.
   * @param {string} userId
   * @param {string} passwordHash
   * @param {Date}   updatedAt
   * @returns {Promise<boolean>}
   */
  async updatePassword(userId, passwordHash, updatedAt) {
    const result = await Credential.updateOne(
      { userId },
      { passwordHash, updatedAt: updatedAt || new Date() },
      { upsert: true }
    );
    return result.acknowledged;
  }

  /**
   * Create a new auth session.
   * @param {string} userId
   * @param {string} token
   * @param {Date}   expiresAt
   * @param {object} meta
   * @returns {Promise<boolean>}
   */
  async createSession(userId, token, expiresAt, meta = {}) {
    await Session.create({ userId, token, expiresAt, meta });
    return true;
  }

  /**
   * Fetch an active (non-revoked, non-expired) session by token.
   * @param {string} token
   * @returns {Promise<object|null>}
   */
  async getSession(token) {
    return Session.findOne({ token, revoked: false, expiresAt: { $gt: new Date() } }).lean();
  }

  /**
   * Revoke (soft-delete) a session.
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async revokeSession(token) {
    const result = await Session.updateOne({ token }, { revoked: true });
    return result.modifiedCount > 0;
  }

  /**
   * Write an authentication audit event.
   * @param {string} userId
   * @param {string} eventType  e.g. 'login', 'logout', 'password_reset'
   * @param {string} details
   * @param {Date}   at
   * @returns {Promise<boolean>}
   */
  async logAuthEvent(userId, eventType, details, at) {
    await AuthEvent.create({ userId, eventType, details, at: at || new Date() });
    return true;
  }

  /**
   * Record a login attempt (success or failure) with device / IP info.
   * @param {string} userId
   * @param {string} status  'success' | 'failed'
   * @param {string} device
   * @param {string} ip
   * @returns {Promise<object>}
   */
  async recordLoginActivity(userId, status, device, ip) {
    return LoginActivity.create({ userId, status, device, ip });
  }

  /**
   * List recent login activity for a user.
   * @param {string} userId
   * @param {number} limit
   * @returns {Promise<object[]>}
   */
  async getLoginActivity(userId, limit = 20) {
    return LoginActivity.find({ userId }).sort({ at: -1 }).limit(limit).lean();
  }
}

module.exports = new AuthRepository();
