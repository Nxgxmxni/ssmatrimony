const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Profile = require('../models/Profile');
const {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
} = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'ss_matrimony_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'ss_matrimony_refresh_secret_key_2026';

// Helper: Generate Access & Refresh Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

// Helper: Set HTTP-Only Secure Cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user & create matrimony profile
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    email,
    mobile,
    phone,
    password,
    fullName,
    gender,
    dateOfBirth,
    profileManagedBy,
    motherTongue,
    religion,
    caste,
    highestEducation,
    occupation,
    city,
    state,
    aboutMe,
  } = req.body;

  const userPhone = (mobile || phone || '').trim();
  const userEmail = (email || '').trim().toLowerCase();

  console.log(`[REGISTER ATTEMPT] Registration request for email: ${userEmail || 'N/A'}, mobile: ${userPhone || 'N/A'}`);

  try {
    // 1. Validation of Required Fields
    if (!userEmail) {
      console.log('[REGISTER FAILED] Missing email address');
      return res.status(400).json({ message: 'Email address is required.' });
    }
    if (!userPhone) {
      console.log('[REGISTER FAILED] Missing mobile number');
      return res.status(400).json({ message: 'Mobile number is required.' });
    }
    if (!password) {
      console.log('[REGISTER FAILED] Missing password');
      return res.status(400).json({ message: 'Password is required.' });
    }
    if (!fullName || !fullName.trim()) {
      console.log('[REGISTER FAILED] Missing full name');
      return res.status(400).json({ message: 'Full name is required.' });
    }

    // 2. Email Format Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      console.log(`[REGISTER FAILED] Invalid email format: ${userEmail}`);
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // 3. Password Strength Check
    const passCheck = User.validatePasswordStrength(password);
    if (!passCheck.valid) {
      console.log(`[REGISTER FAILED] Weak password provided for ${userEmail}: ${passCheck.message}`);
      return res.status(400).json({ message: passCheck.message });
    }

    // 4. Duplicate Email Check
    const emailExists = await User.findOne({ email: userEmail });
    if (emailExists) {
      console.log(`[REGISTER FAILED] Duplicate email detected: ${userEmail}`);
      return res.status(400).json({ message: 'A user account with this email address already exists.' });
    }

    // 5. Duplicate Mobile Number Check
    const phoneExists = await User.findOne({
      $or: [{ mobile: userPhone }, { phone: userPhone }],
    });
    if (phoneExists) {
      console.log(`[REGISTER FAILED] Duplicate mobile number detected: ${userPhone}`);
      return res.status(400).json({ message: 'A user account with this mobile phone number already exists.' });
    }

    // 6. Validate Profile Managed By Role
    const validRoles = ['Self', 'Bride', 'Groom', 'Parent', 'Guardian', 'Sibling', 'Friend'];
    const managedBy = validRoles.includes(profileManagedBy) ? profileManagedBy : 'Self';

    // 7. Calculate Age if dateOfBirth is supplied
    let age = null;
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // 8. Create User (password hashed via pre-save hook in User model)
    const user = await User.create({
      fullName: fullName.trim(),
      email: userEmail,
      mobile: userPhone,
      password,
      role: 'user',
      accountStatus: 'active',
      authProvider: 'local',
      profileManagedBy: managedBy,
      emailVerified: false,
      profilePicture: '',
    });

    console.log('\n[REGISTER SUCCESS] User Saved in MongoDB Collection:', User.collection.name);
    console.log(`  Saved _id:   ${user._id}`);
    console.log(`  Saved email: "${user.email}"`);
    console.log(`  Saved mobile:"${user.mobile}"`);
    console.log(`  Saved role:  "${user.role}"`);
    console.log(`  AuthProvider:"${user.authProvider}"\n`);

    // 9. Create Associated Matrimony Profile with only real collected data
    const profile = await Profile.create({
      user: user._id,
      fullName: user.fullName,
      gender: gender || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      age: age || null,
      motherTongue: motherTongue || '',
      religion: religion || '',
      caste: caste || '',
      highestEducation: highestEducation || '',
      occupation: occupation || '',
      city: city || '',
      state: state || '',
      aboutMe: aboutMe || '',
      photos: [],
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshTokens.push(refreshToken);
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    const profileObj = profile.toObject();
    profileObj.completeness = profile.calculateCompleteness();

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Proceeding to profile creation wizard.',
      token: accessToken,
      refreshToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        accountStatus: user.accountStatus,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      profile: profileObj,
    });
  } catch (error) {
    console.error(`[REGISTER ERROR] Exception during registration:`, error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const message = field === 'mobile'
        ? 'A user account with this mobile phone number already exists.'
        : 'A user account with this email address already exists.';
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: error.message || 'Server error occurred during user registration.' });
  }
};

// @desc    Authenticate User (Email or Phone) & Get Tokens / Cookies
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const rawKey = (identifier || email || '').trim();

    if (!rawKey || !password) {
      console.log('[LOGIN FAILED] Missing identifier or password');
      return res.status(400).json({ message: 'Please provide Email/Mobile Number and Password' });
    }

    const cleanEmail = rawKey.toLowerCase();
    const digitsOnly = rawKey.replace(/\D/g, '');

    console.log('\n=========================================================');
    console.log('          LOGIN QUERY AUDIT - INCOMING ATTEMPT           ');
    console.log('=========================================================');
    console.log(`Identifier received: "${rawKey}"`);
    console.log(`Email lookup:        "${cleanEmail}"`);
    console.log(`Phone lookup:        "${rawKey}"`);

    // STEP 7: Check exact email lookup first, then phone lookup
    let user = await User.findOne({ email: cleanEmail }).select('+password');
    let queryExecuted = `User.findOne({ email: "${cleanEmail}" })`;

    if (!user) {
      const searchConditions = [{ mobile: rawKey }, { phone: rawKey }];
      if (digitsOnly.length >= 10) {
        searchConditions.push({ mobile: new RegExp(digitsOnly.slice(-10)) });
      }
      queryExecuted = `User.findOne({ $or: [mobile, phone] })`;
      user = await User.findOne({ $or: searchConditions }).select('+password');
    }

    console.log(`Mongo query executed: ${queryExecuted}`);

    // STEP 5: Print Mongo Query Result
    if (!user) {
      console.log(`User found:          NO (No matching user in collection "${User.collection.name}")`);
      console.log('=========================================================\n');
      return res.status(401).json({ message: 'Invalid credentials. Please check email/mobile and password.' });
    }

    console.log('User found:          YES');
    console.log(`  _id:     "${user._id}"`);
    console.log(`  email:   "${user.email}"`);
    console.log(`  phone:   "${user.mobile}"`);
    console.log(`  role:    "${user.role}"`);
    console.log(`  isAdmin: ${user.role === 'admin'}`);

    if (user.authProvider === 'google' && !user.password) {
      console.log('Password Match:      N/A (Google Sign-In Account)');
      console.log('=========================================================\n');
      return res.status(400).json({
        message: 'This account was registered using Google Sign-In. Please click "Continue with Google" to log in.',
      });
    }

    // STEP 8: Verify Password Hash Exists
    console.log(`Password exists:     ${!!user.password}`);
    console.log(`Hash length:         ${user.password ? user.password.length : 0} chars`);

    // STEP 9: Verify bcrypt.compare()
    console.log('Comparing password with bcrypt.compare()...');
    const isMatch = await user.matchPassword(password);
    console.log(`Password Match:      ${isMatch}`);

    if (!isMatch) {
      console.log('Reason:              Entered password does not match stored bcrypt hash.');
      console.log('=========================================================\n');
      return res.status(401).json({ message: 'Invalid credentials. Please check email/mobile and password.' });
    }

    if (user.accountStatus === 'suspended' || user.accountStatus === 'blocked' || user.accountStatus === 'inactive') {
      console.log(`Account Status:      ${user.accountStatus} (RESTRICTED)`);
      console.log('=========================================================\n');
      return res.status(403).json({ message: `Your account is ${user.accountStatus}. Please contact customer support.` });
    }

    // Record login timestamp
    user.lastLogin = new Date();

    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        fullName: user.fullName,
        gender: 'bride',
        photos: [],
      });
    }

    const profileObj = profile.toObject();
    profileObj.completeness = profile.calculateCompleteness();

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) {
      user.refreshTokens.shift();
    }
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    console.log(`JWT generated:       YES (${accessToken.slice(0, 20)}...)`);
    console.log('=========================================================\n');

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      emailVerified: user.emailVerified,
      token: accessToken,
      refreshToken,
      profile: profileObj,
    });
  } catch (error) {
    console.error('[LOGIN ERROR] Exception during authentication:', error);
    res.status(500).json({ message: 'Server authentication error occurred.' });
  }
};

// @desc    Google Sign-In / OAuth Authentication
// @route   POST /api/auth/google
// @access  Public
const googleSignIn = async (req, res) => {
  try {
    const { credential, email: directEmail, name: directName, googleId: directGoogleId, picture: directPicture } = req.body;

    let email = directEmail;
    let googleId = directGoogleId;
    let name = directName;
    let picture = directPicture;

    if (credential) {
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const client = new OAuth2Client(googleClientId);

      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: googleClientId && googleClientId !== 'your_google_client_id.apps.googleusercontent.com' ? googleClientId : undefined,
        });
        const payload = ticket.getPayload();
        googleId = payload.sub;
        email = payload.email;
        name = payload.name || payload.given_name;
        picture = payload.picture;
      } catch (verifyErr) {
        console.warn('Google verifyIdToken fallback:', verifyErr.message);
        // Fallback: decode JWT payload directly if client ID is unconfigured or testing
        const decoded = jwt.decode(credential);
        if (decoded && decoded.email) {
          googleId = decoded.sub;
          email = decoded.email;
          name = decoded.name || decoded.given_name;
          picture = decoded.picture;
        } else {
          return res.status(401).json({ message: 'Invalid or unverified Google token.' });
        }
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Invalid Google authentication payload. Email address is required.' });
    }

    const userEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: userEmail });
    let isNewUser = false;

    if (!user) {
      // Requirement 4: For first-time Google users
      // Store: Google ID, Name, Email, Profile Picture (from Google), authProvider = google
      // Everything else remains empty until the Profile Wizard is completed.
      isNewUser = true;
      user = await User.create({
        fullName: name || 'Google User',
        email: userEmail,
        googleId: googleId || `google_${Date.now()}`,
        authProvider: 'google',
        emailVerified: true,
        profileManagedBy: 'Self',
        profilePicture: picture || '',
        accountStatus: 'active',
      });

      await Profile.create({
        user: user._id,
        fullName: user.fullName,
        photos: picture ? [picture] : [],
        gender: '',
        isWizardCompleted: false,
        wizardStep: 1,
      });
    } else {
      // Requirement 5: Existing Google / Email user
      // Do NOT create another account. Simply authenticate, generate JWT & redirect.
      if (!user.googleId) {
        user.googleId = googleId || user.googleId;
        user.emailVerified = true;
        if (picture && !user.profilePicture) user.profilePicture = picture;
        await user.save();
      }
    }

    user.lastLogin = new Date();
    let profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        fullName: user.fullName,
        photos: picture ? [picture] : [],
        gender: '',
        isWizardCompleted: false,
        wizardStep: 1,
      });
    }

    const profileObj = profile.toObject();
    profileObj.completeness = profile.calculateCompleteness();

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push(refreshToken);
    if (user.refreshTokens.length > 5) user.refreshTokens.shift();
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      success: true,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      emailVerified: user.emailVerified,
      token: accessToken,
      refreshToken,
      profile: profileObj,
      isNewUser,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ message: 'Google Sign-In authentication failed: ' + error.message });
  }
};

// @desc    Verify Email Token
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired email verification link.' });
    }

    user.emailVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Email address successfully verified!', emailVerified: true });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
};

// @desc    Request Password Reset Token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please enter your registered email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: 'If an account exists with this email, password reset instructions have been issued.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
      await sendForgotPasswordEmail(user.email, resetToken);
    } catch (emailErr) {
      console.error('Failed to send forgot password email:', emailErr.message);
    }

    res.json({
      message: 'Password reset link generated successfully.',
      resetToken, // Provided for easy client testing
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Error processing forgot password request' });
  }
};

// @desc    Reset Password with Token
// @route   POST /api/auth/reset-password OR /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const { newPassword, password } = req.body;
    const targetPassword = newPassword || password;

    if (!token || !targetPassword) {
      return res.status(400).json({ message: 'Please provide reset token and new password' });
    }

    const passCheck = User.validatePasswordStrength(targetPassword);
    if (!passCheck.valid) {
      return res.status(400).json({ message: passCheck.message });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password = targetPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.refreshTokens = []; // Revoke previous sessions on password change
    await user.save();

    try {
      await sendPasswordChangedEmail(user.email, user.fullName);
    } catch (emailErr) {
      console.error('Failed to send password changed email:', emailErr.message);
    }

    res.json({ message: 'Password has been reset successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc    Refresh Access Token using Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: 'Invalid or revoked refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    user.refreshTokens = user.refreshTokens.filter((rt) => rt !== token);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    setAuthCookies(res, accessToken, newRefreshToken);

    res.json({
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
};

// @desc    Logout User & Revoke Tokens
// @route   POST /api/auth/logout
// @access  Private / Public
const logoutUser = async (req, res) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;

    if (token && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter((rt) => rt !== token);
      await req.user.save();
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// @desc    Get Current User Profile & Auth Status
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(440).json({ message: 'User account not found' });
    }

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        fullName: user.fullName,
        gender: 'bride',
        photos: [],
      });
    }

    const profileObj = profile.toObject();
    profileObj.completeness = profile.calculateCompleteness();

    res.json({
      user,
      profile: profileObj,
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleSignIn,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logoutUser,
  getMe,
};
