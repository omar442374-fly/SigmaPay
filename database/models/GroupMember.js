'use strict';

/**
 * GroupMember — membership records linking users to savings groups.
 * Derived from GroupMember / IGroupMember in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupMemberSchema = new Schema(
  {
    groupId:  { type: Schema.Types.ObjectId, ref: 'SavingsGroup', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

GroupMemberSchema.index({ groupId: 1 });
GroupMemberSchema.index({ memberId: 1 });
GroupMemberSchema.index({ groupId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model('GroupMember', GroupMemberSchema);
