'use strict';

/**
 * GroupContribution — individual deposit/contribution to a savings group.
 * Derived from GroupContribution / IGroupContribution in Business Domain Layer.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupContributionSchema = new Schema(
  {
    groupId:  { type: Schema.Types.ObjectId, ref: 'SavingsGroup', required: true },
    memberId: { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    amount:   { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'EGP' },
    at:       { type: Date, default: Date.now },
  },
  { _id: true }
);

GroupContributionSchema.index({ groupId: 1, at: -1 });
GroupContributionSchema.index({ memberId: 1 });

module.exports = mongoose.model('GroupContribution', GroupContributionSchema);
