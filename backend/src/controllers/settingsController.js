const SiteSetting = require('../models/SiteSetting');
const os = require('os');
const mongoose = require('mongoose');

// In-memory cache for settings
let settingsCache = {};
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60000; // 1 minute

const loadCache = async () => {
  const now = Date.now();
  if (now - cacheTimestamp < CACHE_TTL_MS && Object.keys(settingsCache).length > 0) {
    return settingsCache;
  }
  const allSettings = await SiteSetting.find({});
  const cache = {};
  allSettings.forEach((s) => {
    cache[s.key] = s.data;
  });
  settingsCache = cache;
  cacheTimestamp = now;
  return cache;
};

const invalidateCache = () => {
  settingsCache = {};
  cacheTimestamp = 0;
};

// ─── Default values for each settings section ──────────────────────────

const DEFAULTS = {
  general: {
    websiteName: 'SS Matrimony',
    websiteLogo: '',
    websiteFavicon: '',
    websiteTagline: 'Premium Telugu Matrimony',
    websiteDescription: 'Connecting hearts and families with traditional values.',
    supportEmail: 'support@ssmatrimony.com',
    contactEmail: 'contact@ssmatrimony.com',
    contactNumber: '',
    whatsappNumber: '',
    officeAddress: '',
    googleMapsEmbedUrl: '',
    footerCopyright: '© 2024 SS Matrimony. All rights reserved.',
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      twitter: '',
    },
  },
  homepage: {
    heroHeading: 'Find Your Perfect Life Partner',
    heroSubHeading: 'Trusted by thousands of Telugu families.',
    heroBackgroundImage: '',
    heroButtonText: 'Register Free',
    heroButtonLink: '/register',
    statistics: {
      happyMarriages: 500,
      activeProfiles: 2000,
      successStories: 150,
      yearsOfService: 5,
    },
    sections: {
      successStories: true,
      membershipPlans: false,
      testimonials: true,
      blog: false,
      featuredProfiles: true,
      registrationBanner: true,
    },
  },
  membership: {
    plans: [],
  },
  registration: {
    mobileOtp: false,
    emailVerification: false,
    aadhaarVerification: false,
    profileApproval: false,
    autoLoginAfterRegistration: true,
    allowProfileEditing: true,
    allowMultiplePhotos: true,
    mandatoryHoroscope: false,
    mandatoryPhotoUpload: false,
  },
  profile: {
    maximumPhotos: 6,
    maximumGalleryImages: 10,
    allowedFileTypes: 'jpg, jpeg, png, webp',
    profileImageSizeLimit: '5MB',
    documentUploadSize: '10MB',
    defaultPrivacy: 'Public',
    defaultProfileStatus: 'active',
    enableOnlineStatus: true,
    enableRecentlyActive: true,
  },
  notification: {
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    adminAlerts: true,
    inquiryAlerts: true,
    matchAlerts: true,
    smtp: {
      host: '',
      port: 587,
      username: '',
      password: '',
      encryption: 'TLS',
    },
  },
  payment: {
    razorpay: { enabled: false, apiKey: '', secretKey: '' },
    stripe: { enabled: false, apiKey: '', secretKey: '' },
    cashPayment: { enabled: false },
    currency: 'INR',
    taxPercentage: 18,
    invoicePrefix: 'SSM-',
  },
  seo: {
    metaTitle: 'SS Matrimony - Premium Telugu Matrimony',
    metaDescription: 'Find your perfect Telugu life partner on SS Matrimony.',
    metaKeywords: 'telugu matrimony, marriage, bride, groom',
    ogImage: '',
    robotsTxt: 'User-agent: *\nAllow: /',
    googleAnalyticsId: '',
    googleSearchConsoleVerification: '',
    facebookPixelId: '',
  },
  security: {
    enableTwoFactorAuth: false,
    passwordPolicy: 'medium',
    sessionTimeout: 60,
    loginAttemptLimit: 5,
    captcha: false,
    adminIpRestriction: '',
    activityLogging: true,
  },
  backup: {
    automaticBackupFrequency: 'weekly',
    lastBackupDate: null,
  },
  emailTemplates: {
    registrationSuccess: { subject: 'Welcome to SS Matrimony!', body: 'Dear {{name}},\n\nThank you for registering on SS Matrimony.' },
    otp: { subject: 'Your OTP Code', body: 'Dear {{name}},\n\nYour OTP is: {{otp}}' },
    forgotPassword: { subject: 'Reset Your Password', body: 'Dear {{name}},\n\nClick the link to reset your password: {{link}}' },
    profileApproved: { subject: 'Profile Approved!', body: 'Dear {{name}},\n\nYour profile has been verified and approved.' },
    profileRejected: { subject: 'Profile Needs Attention', body: 'Dear {{name}},\n\nYour profile verification was not approved. Reason: {{reason}}' },
    membershipPurchased: { subject: 'Membership Activated', body: 'Dear {{name}},\n\nYour {{plan}} membership is now active.' },
    contactInquiry: { subject: 'New Contact Inquiry', body: 'You have received a new inquiry from {{name}} ({{email}}).\n\nMessage: {{message}}' },
  },
  theme: {
    mode: 'light',
    primaryColor: '#0B3B91',
    secondaryColor: '#D4AF37',
    fontFamily: 'Inter',
    borderRadius: '12px',
  },
};

// ─── GET settings for a specific key ─────────────────────────────────

const getSettings = async (req, res) => {
  try {
    const { key } = req.params;
    const cache = await loadCache();
    const data = cache[key] || DEFAULTS[key] || {};
    res.json({ key, data });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings: ' + error.message });
  }
};

// ─── GET all settings at once ────────────────────────────────────────

const getAllSettings = async (req, res) => {
  try {
    const cache = await loadCache();
    // Merge with defaults so new keys always appear
    const merged = {};
    for (const key of Object.keys(DEFAULTS)) {
      merged[key] = cache[key] ? { ...DEFAULTS[key], ...cache[key] } : { ...DEFAULTS[key] };
    }
    res.json(merged);
  } catch (error) {
    console.error('Error fetching all settings:', error);
    res.status(500).json({ message: 'Error fetching all settings: ' + error.message });
  }
};

// ─── SAVE (upsert) settings for a specific key ──────────────────────

const saveSettings = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({ message: 'Invalid settings data.' });
    }

    await SiteSetting.findOneAndUpdate(
      { key },
      { key, data, updatedBy: req.user?.email || 'Admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    invalidateCache();
    res.json({ message: `${key} settings saved successfully.`, key });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Error saving settings: ' + error.message });
  }
};

// ─── RESET a settings key back to defaults ───────────────────────────

const resetSettings = async (req, res) => {
  try {
    const { key } = req.params;

    if (!DEFAULTS[key]) {
      return res.status(400).json({ message: `No default configuration exists for "${key}".` });
    }

    await SiteSetting.findOneAndUpdate(
      { key },
      { key, data: DEFAULTS[key], updatedBy: req.user?.email || 'Admin' },
      { upsert: true, new: true }
    );

    invalidateCache();
    res.json({ message: `${key} settings reset to defaults.`, key, data: DEFAULTS[key] });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings: ' + error.message });
  }
};

// ─── System Information ──────────────────────────────────────────────

const getSystemInfo = async (req, res) => {
  try {
    const dbStats = await mongoose.connection.db.stats();

    res.json({
      websiteVersion: '1.0.0',
      nodeVersion: process.version,
      mongoVersion: (await mongoose.connection.db.admin().serverInfo()).version,
      serverTime: new Date().toISOString(),
      platform: `${os.type()} ${os.release()}`,
      uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`,
      storageUsed: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)}MB`,
      databaseSize: `${(dbStats.storageSize / 1024 / 1024).toFixed(2)}MB`,
      collections: dbStats.collections,
      documents: dbStats.objects,
    });
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ message: 'Error fetching system information: ' + error.message });
  }
};

module.exports = {
  getSettings,
  getAllSettings,
  saveSettings,
  resetSettings,
  getSystemInfo,
};
