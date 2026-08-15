const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    interestId: {
      type: String,
      unique: true,
      index: true,
    },
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
      enum: ['pending', 'accepted', 'rejected', 'under_admin_review', 'contact_shared', 'closed'],
      default: 'pending',
    },
    message: {
      type: String,
      default: 'I found your profile interesting and would like to connect.',
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    adminAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminReviewedAt: {
      type: Date,
      default: null,
    },
    familyContactedAt: {
      type: Date,
      default: null,
    },
    meetingScheduledAt: {
      type: Date,
      default: null,
    },
    meetingDetails: {
      meetingDate: Date,
      venueNotes: String,
      status: String,
    },
    contactSharedAt: {
      type: Date,
      default: null,
    },
    contactSharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    notes: [
      {
        text: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        addedByName: String,
        category: {
          type: String,
          enum: [
            'Family contacted',
            'Parents interested',
            'Meeting arranged',
            'Follow-up required',
            'Wedding fixed',
            'Cancelled',
            'General',
          ],
          default: 'General',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate interestId before save if missing
interestSchema.pre('save', async function (next) {
  if (!this.interestId) {
    const count = await mongoose.model('Interest').countDocuments();
    this.interestId = `INT-${10001 + count}`;
  }
  next();
});

// Prevent duplicate interest requests between same profiles
interestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
