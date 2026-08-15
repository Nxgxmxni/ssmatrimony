const mongoose = require('mongoose');

const cmsContentSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Published',
    },
    version: {
      type: Number,
      default: 1,
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

module.exports = mongoose.model('CmsContent', cmsContentSchema);
