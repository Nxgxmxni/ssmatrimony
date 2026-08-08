const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
    message: {
      type: String,
      default: 'I found your profile interesting and would like to connect.',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate interest requests between same profiles
interestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
