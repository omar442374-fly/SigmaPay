'use strict';

/**
 * AccountsRepository
 * Implements IUserAccount as defined in the Data Layer diagram.
 * Manages user account CRUD and customer profile.
 */

const UserAccount = require('../models/UserAccount');
const Customer    = require('../models/Customer');
const Credential  = require('../models/Credential');

class AccountsRepository {
  /**
   * Create a new user account (with hashed password stored separately).
   * @param {string} username
   * @param {string} email
   * @param {string} phoneNumber
   * @param {string} passwordHash
   * @param {object} meta  Optional additional fields (fullName, nationalId, etc.)
   * @returns {Promise<string>}  New user's _id as string
   */
  async createAccount(username, email, phoneNumber, passwordHash, meta = {}) {
    const user = await UserAccount.create({ username, email, phone: phoneNumber });
    await Credential.create({ userId: user._id, passwordHash });

    if (meta.fullName || meta.nationalId) {
      await Customer.create({
        userId:     user._id,
        fullName:   meta.fullName   || '',
        nationalId: meta.nationalId || '',
        phone:      phoneNumber,
        email,
      });
    }
    return user._id.toString();
  }

  /**
   * Fetch a full account record by ID.
   * @param {string} userId
   * @returns {Promise<object|null>}
   */
  async getAccountById(userId) {
    return UserAccount.findById(userId).lean();
  }

  /**
   * Update mutable profile fields.
   * @param {string} userId
   * @param {string} email
   * @param {string} phone
   * @param {string} address
   * @returns {Promise<boolean>}
   */
  async updateAccount(userId, email, phone, address) {
    const result = await UserAccount.updateOne(
      { _id: userId },
      { email, phone, address }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Change the username.
   * @param {string} userId
   * @param {string} newUsername
   * @returns {Promise<boolean>}
   */
  async changeUsername(userId, newUsername) {
    const result = await UserAccount.updateOne({ _id: userId }, { username: newUsername });
    return result.modifiedCount > 0;
  }

  /**
   * Enable or disable an account.
   * @param {string}  userId
   * @param {boolean} enabled
   * @returns {Promise<boolean>}
   */
  async setStatus(userId, enabled) {
    const result = await UserAccount.updateOne({ _id: userId }, { enabled });
    return result.modifiedCount > 0;
  }

  /**
   * Permanently delete a user account and all sub-documents.
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async deleteAccount(userId) {
    await Credential.deleteOne({ userId });
    await Customer.deleteOne({ userId });
    const result = await UserAccount.deleteOne({ _id: userId });
    return result.deletedCount > 0;
  }

  /**
   * Toggle 2FA on/off.
   * @param {string}      userId
   * @param {string|null} method  'sms' | 'email' | 'authenticator' | null
   * @returns {Promise<boolean>}
   */
  async set2FA(userId, method) {
    const result = await UserAccount.updateOne(
      { _id: userId },
      { twoFAEnabled: !!method, twoFAMethod: method || null }
    );
    return result.modifiedCount > 0;
  }
}

module.exports = new AccountsRepository();
