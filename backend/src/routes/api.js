const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleSignIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
  getMe,
} = require('../controllers/authController');

const {
  getProfiles,
  getProfileById,
  updateMyProfile,
  saveWizardDraft,
  uploadPhoto,
  setPrimaryPhoto,
  deletePhoto,
  uploadIdDocument,
  updatePrivacySettings,
  toggleShortlist,
  getFeaturedProfiles,
} = require('../controllers/profileController');

const {
  sendInterest,
  respondToInterest,
  getInterests,
} = require('../controllers/interestController');

const {
  getConversation,
  sendMessage,
  getConversationsList,
} = require('../controllers/messageController');

const {
  getAdminStats,
  getAllUsers,
  toggleVerifyProfile,
  getSuccessStories,
  addSuccessStory,
} = require('../controllers/adminController');

const { protect, admin, optionalAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'SS Matrimony Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes
router.post('/auth/register', authLimiter, registerUser);
router.post('/auth/login', authLimiter, loginUser);
router.post('/auth/google', authLimiter, googleSignIn);
router.get('/auth/verify-email/:token', verifyEmail);
router.post('/auth/forgot-password', authLimiter, forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/refresh-token', refreshToken);
router.post('/auth/logout', logoutUser);
router.get('/auth/me', protect, getMe);

// Profile Routes
router.get('/profiles/featured', getFeaturedProfiles);
router.get('/profiles', optionalAuth, getProfiles);
router.get('/profiles/:id', optionalAuth, getProfileById);
router.put('/profiles/my-profile', protect, updateMyProfile);
router.post('/profiles/draft', protect, saveWizardDraft);
router.post('/profiles/upload-photo', protect, uploadPhoto);
router.put('/profiles/primary-photo', protect, setPrimaryPhoto);
router.delete('/profiles/photo/:index', protect, deletePhoto);
router.post('/profiles/upload-id', protect, uploadIdDocument);
router.put('/profiles/privacy', protect, updatePrivacySettings);
router.post('/profiles/shortlist/:id', protect, toggleShortlist);

// Interest Routes
router.get('/interests', protect, getInterests);
router.post('/interests/send/:profileId', protect, sendInterest);
router.put('/interests/respond/:interestId', protect, respondToInterest);

// Messaging Routes
router.get('/messages/conversations', protect, getConversationsList);
router.get('/messages/conversation/:userId', protect, getConversation);
router.post('/messages/send', protect, sendMessage);

// Admin Routes
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/admin/users', protect, admin, getAllUsers);
router.put('/admin/verify-profile/:id', protect, admin, toggleVerifyProfile);

// Success Stories Routes
router.get('/stories', getSuccessStories);
router.post('/stories', protect, admin, addSuccessStory);

module.exports = router;
