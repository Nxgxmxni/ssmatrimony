const Interest = require('../models/Interest');
const Profile = require('../models/Profile');
const User = require('../models/User');

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

    const interest = await Interest.create({
      sender: req.user._id,
      senderProfile: senderProfile._id,
      recipient: recipientProfile.user,
      recipientProfile: recipientProfile._id,
      message: message || `Hi ${recipientProfile.fullName}, I am interested in your profile. Let's connect!`,
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

// @desc    Respond to Interest (Accept / Decline)
// @route   PUT /api/interests/respond/:interestId
// @access  Private
const respondToInterest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'
    const { interestId } = req.params;

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or declined' });
    }

    const interest = await Interest.findById(interestId);
    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    if (interest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this interest' });
    }

    interest.status = status;
    await interest.save();

    res.json({
      message: `Interest request ${status}`,
      interest,
    });
  } catch (error) {
    console.error('Respond Interest Error:', error);
    res.status(500).json({ message: 'Error updating interest response' });
  }
};

// @desc    Get all interests (Sent & Received)
// @route   GET /api/interests
// @access  Private
const getInterests = async (req, res) => {
  try {
    const received = await Interest.find({ recipient: req.user._id })
      .populate('senderProfile', 'fullName age gender city photos occupation highEducation')
      .populate('sender', 'email phone')
      .sort({ createdAt: -1 });

    const sent = await Interest.find({ sender: req.user._id })
      .populate('recipientProfile', 'fullName age gender city photos occupation highEducation')
      .populate('recipient', 'email phone')
      .sort({ createdAt: -1 });

    res.json({
      received,
      sent,
    });
  } catch (error) {
    console.error('Get Interests Error:', error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
};

module.exports = {
  sendInterest,
  respondToInterest,
  getInterests,
};
