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
  getUserNotifications,
  markNotificationsRead,
} = require('../controllers/interestController');

const {
  getAdminStats,
  getAllUsers,
  getUserDetails,
  editUser,
  blockUser,
  unblockUser,
  softDeleteUser,
  restoreUser,
  deleteUser,
  resetUserPassword,
  addAdminNote,
  updateInternalTags,
  updateUserAccountStatus,
  toggleVerifyProfile,
  bulkUserAction,
  getPendingVerifications,
  approveProfileVerification,
  rejectProfileVerification,
  reuploadProfileVerification,
  removeVerificationBadge,
  manageProfilePhoto,
  submitContactMessage,
  getContactMessages,
  replyContactMessage,
  updateContactStatus,
  deleteContactMessage,
  getAdminLogs,
  getSuccessStories,
  getAdminSuccessStories,
  getSuccessStoryById,
  addSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  togglePublishSuccessStory,
  toggleFeatureSuccessStory,
  bulkImportProfiles,
  getImportedProfiles,
  createAdminProfile,
  getAdminProfileById,
  updateAdminProfile,
  updateAdminProfileStatus,
  deleteAdminProfile,
  getPublicCmsSection,
  getAdminCmsSection,
  updateCmsSection,
  getCmsStats,
  rollbackCmsSection,
  getAdminAnalytics,
  // Interest Admin Controllers
  getAdminInterests,
  getAdminInterestById,
  updateAdminInterestStatus,
  addAdminInterestNote,
  convertInterestToSuccessStory,
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

// Interest & Member Notification Routes
router.get('/interests', protect, getInterests);
router.post('/interests/send/:profileId', protect, sendInterest);
router.put('/interests/respond/:interestId', protect, respondToInterest);
router.get('/notifications', protect, getUserNotifications);
router.put('/notifications/read-all', protect, markNotificationsRead);

// Contact Routes (Public Submission)
router.post('/contact', authLimiter, submitContactMessage);

// Admin User Management Routes
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/users/:id', protect, admin, getUserDetails);
router.put('/admin/users/:id/edit', protect, admin, editUser);
router.post('/admin/users/:id/block', protect, admin, blockUser);
router.post('/admin/users/:id/unblock', protect, admin, unblockUser);
router.delete('/admin/users/:id/soft-delete', protect, admin, softDeleteUser);
router.post('/admin/users/:id/restore', protect, admin, restoreUser);
router.delete('/admin/users/:id/permanent', protect, admin, deleteUser);
router.post('/admin/users/:id/reset-password', protect, admin, resetUserPassword);
router.post('/admin/users/:id/notes', protect, admin, addAdminNote);
router.put('/admin/users/:id/tags', protect, admin, updateInternalTags);
router.put('/admin/users/:id/status', protect, admin, updateUserAccountStatus);
router.put('/admin/verify-profile/:id', protect, admin, toggleVerifyProfile);
router.post('/admin/users/bulk-action', protect, admin, bulkUserAction);

// Admin Interest Management Routes
router.get('/admin/interests', protect, admin, getAdminInterests);
router.get('/admin/interests/:id', protect, admin, getAdminInterestById);
router.put('/admin/interests/:id/status', protect, admin, updateAdminInterestStatus);
router.post('/admin/interests/:id/notes', protect, admin, addAdminInterestNote);
router.post('/admin/interests/:id/convert-success-story', protect, admin, convertInterestToSuccessStory);

// Admin Profile Verification Queue Routes
router.get('/admin/verifications', protect, admin, getPendingVerifications);
router.post('/admin/verifications/:id/approve', protect, admin, approveProfileVerification);
router.post('/admin/verifications/:id/reject', protect, admin, rejectProfileVerification);
router.post('/admin/verifications/:id/reupload', protect, admin, reuploadProfileVerification);
router.post('/admin/verifications/:id/remove-badge', protect, admin, removeVerificationBadge);
router.post('/admin/verifications/:id/photo-action', protect, admin, manageProfilePhoto);

// Admin Inbox & Log Routes
router.get('/admin/contacts', protect, admin, getContactMessages);
router.post('/admin/contacts/:id/reply', protect, admin, replyContactMessage);
router.put('/admin/contacts/:id/status', protect, admin, updateContactStatus);
router.delete('/admin/contacts/:id', protect, admin, deleteContactMessage);
router.get('/admin/logs', protect, admin, getAdminLogs);

// Profile Import & Management Routes (Admin Panel)
router.post('/admin/profiles', protect, admin, createAdminProfile);
router.get('/admin/profiles/imported', protect, admin, getImportedProfiles);
router.get('/admin/profiles/:id', protect, admin, getAdminProfileById);
router.put('/admin/profiles/:id', protect, admin, updateAdminProfile);
router.put('/admin/profiles/:id/status', protect, admin, updateAdminProfileStatus);
router.delete('/admin/profiles/:id', protect, admin, deleteAdminProfile);
router.post('/admin/profiles/import', protect, admin, bulkImportProfiles);

// Success Stories Routes (Public & Admin CMS)
router.get('/stories', getSuccessStories);
router.get('/stories/admin', protect, admin, getAdminSuccessStories);
router.get('/stories/:id', getSuccessStoryById);
router.post('/stories', protect, admin, addSuccessStory);
router.put('/stories/:id', protect, admin, updateSuccessStory);
router.delete('/stories/:id', protect, admin, deleteSuccessStory);
router.patch('/stories/:id/status', protect, admin, togglePublishSuccessStory);
router.patch('/stories/:id/feature', protect, admin, toggleFeatureSuccessStory);

// Website CMS Routes (Public & Admin CMS)
router.get('/cms/:sectionKey', getPublicCmsSection);
router.get('/admin/cms/stats', protect, admin, getCmsStats);
router.get('/admin/cms/:sectionKey', protect, admin, getAdminCmsSection);
router.put('/admin/cms/:sectionKey', protect, admin, updateCmsSection);
router.post('/admin/cms/:sectionKey/rollback', protect, admin, rollbackCmsSection);

// Business Intelligence Reports & Analytics Route
router.get('/admin/reports', protect, admin, getAdminAnalytics);

// Admin Settings Routes
const {
  getSettings,
  getAllSettings,
  saveSettings,
  resetSettings,
  getSystemInfo,
} = require('../controllers/settingsController');

router.get('/admin/settings', protect, admin, getAllSettings);
router.get('/admin/settings/system-info', protect, admin, getSystemInfo);
router.get('/admin/settings/:key', protect, admin, getSettings);
router.put('/admin/settings/:key', protect, admin, saveSettings);
router.post('/admin/settings/:key/reset', protect, admin, resetSettings);

module.exports = router;
