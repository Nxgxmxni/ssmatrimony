const Message = require('../models/Message');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Interest = require('../models/Interest');

// @desc    Get conversation messages with a target user
// @route   GET /api/messages/conversation/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    // Check if connected (Accepted interest)
    const connection = await Interest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserId, status: 'accepted' },
        { sender: targetUserId, recipient: currentUserId, status: 'accepted' },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        message: 'You can only message users with whom you have an accepted interest connection.',
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: targetUserId },
        { sender: targetUserId, recipient: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { sender: targetUserId, recipient: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const targetProfile = await Profile.findOne({ user: targetUserId });

    res.json({
      messages,
      targetProfile: targetProfile
        ? {
            _id: targetProfile._id,
            fullName: targetProfile.fullName,
            photos: targetProfile.photos,
            city: targetProfile.city,
            age: targetProfile.age,
          }
        : null,
    });
  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
};

// @desc    Send a message to a user
// @route   POST /api/messages/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const currentUserId = req.user._id;

    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }

    // Verify connection status
    const connection = await Interest.findOne({
      $or: [
        { sender: currentUserId, recipient: recipientId, status: 'accepted' },
        { sender: recipientId, recipient: currentUserId, status: 'accepted' },
      ],
    });

    if (!connection) {
      return res.status(403).json({
        message: 'Messaging requires an accepted interest connection.',
      });
    }

    const message = await Message.create({
      sender: currentUserId,
      recipient: recipientId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// @desc    Get all active conversations list
// @route   GET /api/messages/conversations
// @access  Private
const getConversationsList = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all accepted interest connections
    const connections = await Interest.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
      status: 'accepted',
    })
      .populate('senderProfile', 'fullName photos city age user')
      .populate('recipientProfile', 'fullName photos city age user');

    const conversationPartners = connections.map((conn) => {
      if (conn.sender.toString() === currentUserId.toString()) {
        return {
          user: conn.recipient,
          profile: conn.recipientProfile,
          connectedAt: conn.updatedAt,
        };
      } else {
        return {
          user: conn.sender,
          profile: conn.senderProfile,
          connectedAt: conn.updatedAt,
        };
      }
    });

    res.json(conversationPartners);
  } catch (error) {
    console.error('Conversations List Error:', error);
    res.status(500).json({ message: 'Error loading conversations list' });
  }
};

module.exports = {
  getConversation,
  sendMessage,
  getConversationsList,
};
