const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminEmail: {
      type: String,
      default: 'admin@ssmatrimony.com',
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
