const Interest = require('../models/Interest');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to notify admins
const notifyAdmins = async (title, message, relatedInterestId) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminNotifications = adminUsers.map((admin) => ({
      recipient: admin._id,
      title,
      message,
      type: 'mutual_interest',
      relatedInterest: relatedInterestId,
    }));
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }
  } catch (err) {
    console.error('Error notifying admins:', err);
  }
};

// @desc    Send Express Interest to a Profile
// @route   POST /api/interests/send/:profileId
// @access  Private
const sendInterest = async (req, res) => {
  try {
    const recipientProfileId = req.params.profileId;
    const { message } = req.body;

    const senderProfile = await Profile.findOne({ user: req.user._id });
    if (!senderProfile) {
      return res.status(404).json({ message: 'Your profile is required to send interest' });
    }

    const recipientProfile = await Profile.findById(recipientProfileId);
    if (!recipientProfile) {
      return res.status(404).json({ message: 'Target profile not found' });
    }

    if (senderProfile._id.toString() === recipientProfile._id.toString()) {
      return res.status(400).json({ message: 'You cannot send interest to yourself' });
    }

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      sender: req.user._id,
      recipient: recipientProfile.user,
    });

    if (existingInterest) {
      return res.status(400).json({
        message: `Interest already sent. Status: ${existingInterest.status}`,
        interest: existingInterest,
      });
    }

    const interestCount = await Interest.countDocuments();
    const generatedId = `INT-${10001 + interestCount}`;

    const interest = await Interest.create({
      interestId: generatedId,
      sender: req.user._id,
      senderProfile: senderProfile._id,
      recipient: recipientProfile.user,
      recipientProfile: recipientProfile._id,
      message: message || `Hi ${recipientProfile.fullName}, I am interested in your profile. Let's connect!`,
      status: 'pending',
    });

    // Send notification to recipient
    await Notification.create({
      recipient: recipientProfile.user,
      title: 'New Interest Received',
      message: `${senderProfile.fullName} has expressed interest in your profile.`,
      type: 'interest_received',
      relatedInterest: interest._id,
    });

    res.status(201).json({
      message: 'Interest request sent successfully!',
      interest,
    });
  } catch (error) {
    console.error('Send Interest Error:', error);
    res.status(500).json({ message: 'Error sending interest request' });
  }
};

// @desc    Respond to Interest (Accept / Reject)
// @route   PUT /api/interests/respond/:interestId
// @access  Private
const respondToInterest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected' / 'declined'
    const { interestId } = req.params;

    const normalizedStatus = status === 'declined' ? 'rejected' : status;

    if (!['accepted', 'rejected'].includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const interest = await Interest.findById(interestId)
      .populate('senderProfile', 'fullName gender age city')
      .populate('recipientProfile', 'fullName gender age city');

    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    if (interest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this interest' });
    }

    if (normalizedStatus === 'rejected') {
      interest.status = 'rejected';
      interest.rejectedAt = new Date();
      await interest.save();

      // Notify sender
      await Notification.create({
        recipient: interest.sender,
        title: 'Interest Request Declined',
        message: 'Your interest request was declined.',
        type: 'interest_rejected',
        relatedInterest: interest._id,
      });

      return res.json({
        message: 'Interest request declined',
        interest,
      });
    }

    if (normalizedStatus === 'accepted') {
      interest.status = 'accepted';
      interest.acceptedAt = new Date();
      await interest.save();

      // Notify Sender
      await Notification.create({
        recipient: interest.sender,
        title: '❤️ Mutual Interest Established!',
        message: `${interest.recipientProfile?.fullName || 'Member'} accepted your interest proposal. Our Relationship Team has been notified.`,
        type: 'interest_accepted',
        relatedInterest: interest._id,
      });

      // Notify Recipient
      await Notification.create({
        recipient: interest.recipient,
        title: '❤️ Mutual Interest Established!',
        message: `You accepted interest from ${interest.senderProfile?.fullName || 'Member'}. Our Relationship Team will contact both families.`,
        type: 'mutual_interest',
        relatedInterest: interest._id,
      });

      // Notify Admin Panel
      const senderName = interest.senderProfile?.fullName || 'Member';
      const recipientName = interest.recipientProfile?.fullName || 'Member';
      await notifyAdmins(
        '🔔 New Mutual Interest Established',
        `Mutual Interest between ${senderName} and ${recipientName}. Awaiting Admin Review.`,
        interest._id
      );

      return res.json({
        message: 'Interest request accepted! Mutual Interest established.',
        interest,
      });
    }
  } catch (error) {
    console.error('Respond Interest Error:', error);
    res.status(500).json({ message: 'Error updating interest response' });
  }
};

// @desc    Get all interests for logged in user (Sent, Received & Mutual)
// @route   GET /api/interests
// @access  Private
const getInterests = async (req, res) => {
  try {
    const received = await Interest.find({ recipient: req.user._id })
      .populate('senderProfile', 'fullName age gender city photos occupation highEducation highestEducation caste religion')
      .populate('sender', 'email mobile phone')
      .sort({ createdAt: -1 });

    const sent = await Interest.find({ sender: req.user._id })
      .populate('recipientProfile', 'fullName age gender city photos occupation highEducation highestEducation caste religion')
      .populate('recipient', 'email mobile phone')
      .sort({ createdAt: -1 });

    // Sanitize contact info unless status === 'contact_shared'
    const sanitize = (list) => {
      return list.map((item) => {
        const obj = item.toObject();
        const contactAllowed = obj.status === 'contact_shared' || obj.status === 'closed';

        if (!contactAllowed) {
          if (obj.sender) {
            delete obj.sender.mobile;
            delete obj.sender.phone;
            delete obj.sender.email;
          }
          if (obj.recipient) {
            delete obj.recipient.mobile;
            delete obj.recipient.phone;
            delete obj.recipient.email;
          }
        }
        return obj;
      });
    };

    res.json({
      received: sanitize(received),
      sent: sanitize(sent),
    });
  } catch (error) {
    console.error('Get Interests Error:', error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
};

// @desc    Get User Notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// @desc    Mark Notifications as Read
// @route   PUT /api/notifications/read-all
// @access  Private
const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Mark Notifications Error:', error);
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

module.exports = {
  sendInterest,
  respondToInterest,
  getInterests,
  getUserNotifications,
  markNotificationsRead,
};
