const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
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

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
