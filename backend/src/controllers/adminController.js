const User = require('../models/User');
const Profile = require('../models/Profile');
const Interest = require('../models/Interest');
const SuccessStory = require('../models/SuccessStory');

// @desc    Get dashboard metrics & analytics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBrides = await Profile.countDocuments({ gender: 'bride' });
    const totalGrooms = await Profile.countDocuments({ gender: 'groom' });
    const verifiedProfiles = await Profile.countDocuments({ isVerified: true });
    const totalInterests = await Interest.countDocuments();
    const acceptedInterests = await Interest.countDocuments({ status: 'accepted' });
    const successStoriesCount = await SuccessStory.countDocuments();

    res.json({
      totalUsers,
      totalBrides,
      totalGrooms,
      verifiedProfiles,
      totalInterests,
      acceptedInterests,
      successStoriesCount,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Error retrieving admin statistics' });
  }
};

// @desc    Get all users list with profile details for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const profiles = await Profile.find();

    const result = users.map((u) => {
      const p = profiles.find((prof) => prof.user.toString() === u._id.toString());
      return {
        user: u,
        profile: p || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ message: 'Error retrieving user list' });
  }
};

// @desc    Toggle profile verification status (Admin badge)
// @route   PUT /api/admin/verify-profile/:id
// @access  Private/Admin
const toggleVerifyProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.isVerified = !profile.isVerified;
    await profile.save();

    res.json({
      message: `Profile verification set to ${profile.isVerified}`,
      isVerified: profile.isVerified,
    });
  } catch (error) {
    console.error('Toggle Verification Error:', error);
    res.status(500).json({ message: 'Error toggling verification status' });
  }
};

// @desc    Get success stories
// @route   GET /api/admin/stories
// @access  Public
const getSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    console.error('Success Stories Error:', error);
    res.status(500).json({ message: 'Error fetching success stories' });
  }
};

// @desc    Create new success story
// @route   POST /api/admin/stories
// @access  Private/Admin
const addSuccessStory = async (req, res) => {
  try {
    const { coupleNames, weddingDate, story, image, location } = req.body;
    
    const newStory = await SuccessStory.create({
      coupleNames,
      weddingDate,
      story,
      image,
      location: location || 'India',
    });

    res.status(201).json(newStory);
  } catch (error) {
    console.error('Add Success Story Error:', error);
    res.status(500).json({ message: 'Error adding success story' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleVerifyProfile,
  getSuccessStories,
  addSuccessStory,
};
