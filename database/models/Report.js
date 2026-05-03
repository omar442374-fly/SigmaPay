'use strict';

/**
 * Report — metadata record for a generated financial report.
 * Derived from Report / IReport in Business Domain Layer and ReportsRepository.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'UserAccount', required: true },
    type:       { type: String, required: true }, // 'income_statement', 'monthly_summary', 'comparison'
    period:     { type: String, required: true }, // e.g. '2025-04', '2025-Q1'
    contentRef: { type: String, default: '' },    // inline JSON or text reference
    blobRef:    { type: String, default: '' },    // Atlas file / S3 key for exported PDF
    meta:       { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ReportSchema.index({ userId: 1, type: 1, period: 1 });

module.exports = mongoose.model('Report', ReportSchema);
