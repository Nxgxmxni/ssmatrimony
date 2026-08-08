const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ss_matrimony_super_secret_jwt_key_2026';

// Protect routes - JWT token verification from Authorization Header OR HTTP-Only Cookie
const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization Bearer header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check HTTP-Only Cookies if header is not present
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User account no longer exists' });
    }

    if (req.user.accountStatus === 'suspended' || req.user.accountStatus === 'inactive') {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    return next();
  } catch (error) {
    console.error('Auth Middleware Verification Error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token expired or invalid', code: 'TOKEN_EXPIRED' });
  }
};

// Role-Based Authorization Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

// Admin shortcut middleware
const admin = authorize('admin');

// Optional Auth (Parses user if token present, does not block if missing)
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token verification errors in optional auth
    }
  }
  next();
};

module.exports = { protect, authorize, admin, optionalAuth };
