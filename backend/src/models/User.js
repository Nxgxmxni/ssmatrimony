const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerifiedAt: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'blocked', 'deleted'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    blockReason: {
      type: String,
      default: '',
    },
    blockType: {
      type: String,
      enum: ['Temporary', 'Permanent', ''],
      default: '',
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    adminNotes: [
      {
        note: String,
        adminEmail: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    internalTags: [String],
    loginHistory: [
      {
        loginTime: { type: Date, default: Date.now },
        ipAddress: { type: String, default: '127.0.0.1' },
        userAgent: { type: String, default: 'Web Browser' },
        status: { type: String, default: 'Success' },
      },
    ],
    activityTimeline: [
      {
        action: String,
        details: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastLogin: {
      type: Date,
      default: null,
    },
    profileManagedBy: {
      type: String,
      enum: ['Self', 'Bride', 'Groom', 'Parent', 'Guardian', 'Sibling', 'Friend'],
      default: 'Self',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    refreshTokens: [String],
    isImported: {
      type: Boolean,
      default: false,
    },
    importBatchId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Auto adds createdAt and updatedAt
  }
);

// Phone virtual getter/setter for backwards compatibility
userSchema
  .virtual('phone')
  .get(function () {
    return this.mobile;
  })
  .set(function (val) {
    this.mobile = val;
  });

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  // Prevent double-hashing if password is already a bcrypt hash
  if (this.password.startsWith('$2b$') || this.password.startsWith('$2a$')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Password strength validator helper
userSchema.statics.validatePasswordStrength = function (password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*).' };
  }
  return { valid: true };
};

module.exports = mongoose.model('User', userSchema);
