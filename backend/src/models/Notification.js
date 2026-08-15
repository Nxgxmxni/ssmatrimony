const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'interest_received',
        'interest_accepted',
        'interest_rejected',
        'mutual_interest',
        'admin_review',
        'family_contacted',
        'meeting_scheduled',
        'contact_shared',
        'case_closed',
        'system',
      ],
      default: 'system',
    },
    relatedInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest',
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
