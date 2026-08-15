const mongoose = require('mongoose');

const cmsVersionHistorySchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CmsVersionHistory', cmsVersionHistorySchema);
