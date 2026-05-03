'use strict';

/**
 * GroupSavingsRepository
 * Implements ISavingsGroup / IGroupMember / IGroupContribution / IGroupReport
 * as defined in the Data Layer diagram.
 */

const SavingsGroup       = require('../models/SavingsGroup');
const GroupMember        = require('../models/GroupMember');
const GroupContribution  = require('../models/GroupContribution');

class GroupSavingsRepository {
  /**
   * Create a new savings group.
   * @param {string}   groupName
   * @param {string[]} memberIds
   * @param {string}   adminId    Creator / admin user
   * @param {number}   targetAmount
   * @returns {Promise<string>}  new group _id
   */
  async createGroup(groupName, memberIds, adminId, targetAmount = 0) {
    const group = await SavingsGroup.create({ name: groupName, adminId, targetAmount });

    // Add all initial members (including admin)
    const allMembers = [...new Set([adminId, ...memberIds])];
    const memberDocs = allMembers.map(memberId => ({ groupId: group._id, memberId }));
    await GroupMember.insertMany(memberDocs, { ordered: false }).catch(() => {}); // ignore duplicate key errors

    return group._id.toString();
  }

  /**
   * Add a member to an existing group.
   * @param {string} groupId
   * @param {string} memberId
   * @returns {Promise<boolean>}
   */
  async addMember(groupId, memberId) {
    await GroupMember.findOneAndUpdate(
      { groupId, memberId },
      { joinedAt: new Date() },
      { upsert: true }
    );
    return true;
  }

  /**
   * Record a contribution deposit.
   * @param {string} groupId
   * @param {string} memberId
   * @param {number} amount
   * @param {string} at   ISO date string
   * @returns {Promise<string>}  new contribution _id
   */
  async recordDeposit(groupId, memberId, amount, at) {
    const contribution = await GroupContribution.create({
      groupId,
      memberId,
      amount,
      at: new Date(at),
    });
    return contribution._id.toString();
  }

  /**
   * Build a group report: total contributed, member breakdown, progress %.
   * Derived from IGroupReport / getGroupReportData.
   * @param {string} groupId
   * @returns {Promise<object>}
   */
  async getGroupReportData(groupId) {
    const group = await SavingsGroup.findById(groupId).lean();
    if (!group) return null;

    const [members, contributions] = await Promise.all([
      GroupMember.find({ groupId }).lean(),
      GroupContribution.find({ groupId }).lean(),
    ]);

    const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
    const progressPercent  = group.targetAmount > 0
      ? Math.min((totalContributed / group.targetAmount) * 100, 100)
      : 0;

    // Per-member totals
    const memberTotals = {};
    for (const c of contributions) {
      const key = c.memberId.toString();
      memberTotals[key] = (memberTotals[key] || 0) + c.amount;
    }

    return {
      groupId:          groupId,
      groupName:        group.name,
      targetAmount:     group.targetAmount,
      totalContributed,
      progressPercent:  Number(progressPercent.toFixed(2)),
      memberCount:      members.length,
      memberTotals,
    };
  }

  /**
   * Remove a member from a group (for withdrawal / exit).
   * @param {string} groupId
   * @param {string} memberId
   * @returns {Promise<boolean>}
   */
  async removeMember(groupId, memberId) {
    const result = await GroupMember.deleteOne({ groupId, memberId });
    return result.deletedCount > 0;
  }
}

module.exports = new GroupSavingsRepository();
