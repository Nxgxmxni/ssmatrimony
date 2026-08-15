const User = require('../models/User');
const Profile = require('../models/Profile');
const Interest = require('../models/Interest');
const SuccessStory = require('../models/SuccessStory');
const ContactMessage = require('../models/ContactMessage');
const AdminLog = require('../models/AdminLog');
const CmsContent = require('../models/CmsContent');
const CmsVersionHistory = require('../models/CmsVersionHistory');
const { sendEmail } = require('../utils/email');

// Helper to log admin activity
const logAdminAction = async (adminId, action, details, targetId = '') => {
  try {
    await AdminLog.create({
      adminUser: adminId,
      action,
      details,
      targetId,
    });
  } catch (err) {
    console.error('Failed to log admin action:', err.message);
  }
};

// @desc    Get complete dynamic dashboard stats & recent activities for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
// @desc    Get complete dynamic dashboard stats & recent activities for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);

    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' }, isDeleted: { $ne: true } });
    const totalBrides = await Profile.countDocuments({ gender: { $in: ['bride', 'female', 'Bride', 'Female'] }, user: { $nin: adminIds } });
    const totalGrooms = await Profile.countDocuments({ gender: { $in: ['groom', 'male', 'Groom', 'Male'] }, user: { $nin: adminIds } });
    const verifiedProfiles = await Profile.countDocuments({ isVerified: true, user: { $nin: adminIds } });
    
    const pendingVerifications = await Profile.countDocuments({
      isVerified: false,
      user: { $nin: adminIds },
      gender: { $in: ['bride', 'groom', 'female', 'male'] },
    });

    const blockedUsers = await User.countDocuments({ role: { $ne: 'admin' }, accountStatus: 'blocked' });
    const publishedSuccessStories = await SuccessStory.countDocuments({ status: 'Published' });
    const unreadMessages = await ContactMessage.countDocuments({ status: 'Unread' });

    // Today & Monthly Registrations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayRegistrations = await User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: startOfToday } });
    const monthlyRegistrations = await User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: startOfMonth } });
    const activeUsersToday = await User.countDocuments({ role: { $ne: 'admin' }, $or: [{ lastLogin: { $gte: startOfToday } }, { createdAt: { $gte: startOfToday } }] });

    // Recent 5 Registrations with full details (EXCLUDING ADMINS)
    const recentUsersRaw = await User.find({ role: { $ne: 'admin' }, isDeleted: { $ne: true } }).select('-password').sort({ createdAt: -1 }).limit(5);
    const recentUserIds = recentUsersRaw.map((u) => u._id);
    const recentProfiles = await Profile.find({ user: { $in: recentUserIds } });

    const recentRegistrations = recentUsersRaw.map((u) => {
      const p = recentProfiles.find((prof) => prof.user.toString() === u._id.toString());
      return {
        _id: u._id,
        fullName: p?.fullName || u.fullName || 'Member Profile',
        email: u.email,
        mobile: u.mobile || 'N/A',
        gender: p?.gender || 'N/A',
        city: p?.city || 'Hyderabad',
        role: u.role,
        isVerified: p?.isVerified || false,
        accountStatus: u.accountStatus || 'active',
        createdAt: u.createdAt,
        photos: p?.photos || [],
        profileId: p ? `SSM${p._id.toString().slice(-6).toUpperCase()}` : 'N/A',
      };
    });

    // Recent 5 Success Stories
    const latestSuccessStories = await SuccessStory.find({ status: 'Published' }).sort({ createdAt: -1 }).limit(5);

    // Pending Verification Profiles (Up to 5, excluding admins & non-bride/groom)
    const pendingVerificationProfiles = await Profile.find({
      isVerified: false,
      user: { $nin: adminIds },
      gender: { $in: ['bride', 'groom', 'female', 'male'] },
    })
      .populate('user', 'email mobile accountStatus role')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent Contact Messages (Up to 5)
    const recentContactMessages = await ContactMessage.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalMembers: totalUsers,
      totalBrides,
      totalGrooms,
      verifiedProfiles,
      pendingVerifications,
      blockedUsers,
      publishedSuccessStories,
      unreadMessages,
      todayRegistrations,
      newToday: todayRegistrations,
      monthlyRegistrations,
      activeUsersToday,
      onlineToday: activeUsersToday,
      recentRegistrations,
      latestSuccessStories,
      pendingVerificationList: pendingVerificationProfiles,
      recentContactMessages,
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ message: 'Error retrieving admin statistics' });
  }
};

// @desc    Get Paginated & Multi-Filtered Users List for User Management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      gender,
      verificationStatus,
      accountStatus,
      completionRange,
      sort = 'newest',
      tab = 'active', // 'active' | 'deleted'
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Exclude Admin Users
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id.toString());

    // 1. Fetch Registered Non-Admin Users
    let userQuery = { role: { $ne: 'admin' } };
    if (tab === 'deleted') {
      userQuery.isDeleted = true;
    } else {
      userQuery.isDeleted = { $ne: true };
    }

    if (accountStatus && ['active', 'suspended', 'blocked', 'deleted'].includes(accountStatus)) {
      userQuery.accountStatus = accountStatus;
    }

    let usersRaw = await User.find(userQuery).select('-password').sort({ createdAt: sort === 'oldest' ? 1 : -1 });
    let profilesRaw = await Profile.find();

    // Set of profile IDs associated with registered users
    const userLinkedProfileIds = new Set();

    // Map Registered Users + their linked profiles
    let combined = usersRaw.map((u) => {
      const p = profilesRaw.find((prof) => prof.user && prof.user.toString() === u._id.toString());
      if (p) {
        userLinkedProfileIds.add(p._id.toString());
      }
      const completeness = p && typeof p.calculateCompleteness === 'function' ? p.calculateCompleteness() : { score: 40, missingFields: [] };
      
      const genderVal = ((p?.gender || '').toLowerCase().includes('bride') || (p?.gender || '').toLowerCase().includes('female')) ? 'bride' :
                        ((p?.gender || '').toLowerCase().includes('groom') || (p?.gender || '').toLowerCase().includes('male')) ? 'groom' : (p?.gender || '');

      return {
        _id: u._id,
        userId: u._id,
        user: u,
        profile: p || null,
        fullName: p?.fullName || u.fullName || 'Member Profile',
        email: p?.contactEmail || u.email,
        mobile: p?.contactPhone || u.mobile || u.phone || 'N/A',
        gender: genderVal,
        city: p?.city || 'N/A',
        age: p?.age || 'N/A',
        religion: p?.religion || 'N/A',
        caste: p?.caste || 'N/A',
        occupation: p?.occupation || 'N/A',
        highestEducation: p?.highestEducation || 'N/A',
        annualIncome: p?.annualIncome || 'N/A',
        photos: p?.photos || [],
        isVerified: p?.isVerified || false,
        idVerificationStatus: p?.idVerificationStatus || 'Unverified',
        idDocumentUrl: p?.idDocumentUrl || '',
        accountStatus: u.accountStatus || 'active',
        status: p?.status || 'Approved',
        profileSource: p?.profileSource || 'Registered User',
        isDeleted: u.isDeleted || false,
        deletedAt: u.deletedAt || null,
        blockReason: u.blockReason || '',
        blockType: u.blockType || '',
        adminNotes: u.adminNotes || [],
        internalTags: u.internalTags || [],
        loginHistory: u.loginHistory || [],
        activityTimeline: u.activityTimeline || [],
        completionScore: completeness.score,
        profileId: p ? (p.customId || `SSM${p._id.toString().slice(-6).toUpperCase()}`) : `SSM${u._id.toString().slice(-6).toUpperCase()}`,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      };
    });

    // 2. Fetch Standalone Admin-Imported Profiles (not linked to any non-admin registered user)
    if (tab !== 'deleted') {
      const standaloneProfiles = profilesRaw.filter((p) => {
        if (userLinkedProfileIds.has(p._id.toString())) return false;
        if (p.user && adminIds.includes(p.user.toString())) return false;
        return true;
      });

      standaloneProfiles.forEach((p) => {
        const completeness = typeof p.calculateCompleteness === 'function' ? p.calculateCompleteness() : { score: 80, missingFields: [] };
        const genderVal = ((p.gender || '').toLowerCase().includes('bride') || (p.gender || '').toLowerCase().includes('female')) ? 'bride' :
                          ((p.gender || '').toLowerCase().includes('groom') || (p.gender || '').toLowerCase().includes('male')) ? 'groom' : (p.gender || '');

        combined.push({
          _id: p._id,
          userId: null,
          user: null,
          profile: p,
          fullName: p.fullName,
          email: p.contactEmail || 'N/A',
          mobile: p.contactPhone || 'N/A',
          gender: genderVal,
          city: p.city || 'N/A',
          age: p.age || 'N/A',
          religion: p.religion || 'N/A',
          caste: p.caste || 'N/A',
          occupation: p.occupation || 'N/A',
          highestEducation: p.highestEducation || 'N/A',
          annualIncome: p.annualIncome || 'N/A',
          photos: p.photos || [],
          isVerified: p.isVerified || false,
          idVerificationStatus: p.idVerificationStatus || 'Unverified',
          idDocumentUrl: p.idDocumentUrl || '',
          accountStatus: p.status === 'Suspended' ? 'suspended' : p.status === 'Rejected' ? 'blocked' : 'active',
          status: p.status || 'Approved',
          profileSource: p.profileSource || 'Admin Imported',
          isDeleted: false,
          deletedAt: null,
          blockReason: '',
          blockType: '',
          adminNotes: [],
          internalTags: [],
          loginHistory: [],
          activityTimeline: [],
          completionScore: completeness.score,
          profileId: p.customId || `SSM${p._id.toString().slice(-6).toUpperCase()}`,
          createdAt: p.createdAt,
          lastLogin: null,
        });
      });
    }

    // 3. Multi-field Text Search
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      combined = combined.filter(
        (item) =>
          (item.fullName || '').toLowerCase().includes(s) ||
          (item.email || '').toLowerCase().includes(s) ||
          (item.mobile || '').toLowerCase().includes(s) ||
          (item.city || '').toLowerCase().includes(s) ||
          (item.profileId || '').toLowerCase().includes(s) ||
          (item.occupation || '').toLowerCase().includes(s) ||
          (item.religion || '').toLowerCase().includes(s) ||
          (item.caste || '').toLowerCase().includes(s)
      );
    }

    // 4. Gender Filter
    if (gender) {
      const gLower = gender.toLowerCase();
      combined = combined.filter((item) => {
        const itemGender = (item.gender || '').toLowerCase();
        if (gLower === 'bride' || gLower === 'female') {
          return itemGender === 'bride' || itemGender === 'female';
        } else if (gLower === 'groom' || gLower === 'male') {
          return itemGender === 'groom' || itemGender === 'male';
        }
        return itemGender === gLower;
      });
    }

    // 5. Verification Status Filter
    if (verificationStatus) {
      if (verificationStatus === 'verified') {
        combined = combined.filter((item) => item.isVerified === true);
      } else if (verificationStatus === 'pending') {
        combined = combined.filter((item) => item.idVerificationStatus === 'Pending' || item.isVerified === false);
      } else if (verificationStatus === 'rejected') {
        combined = combined.filter((item) => item.idVerificationStatus === 'Rejected');
      }
    }

    // 6. Account Status Filter
    if (accountStatus) {
      combined = combined.filter((item) => item.accountStatus === accountStatus || item.status === accountStatus);
    }

    // 7. Completion Score Filter (0-25, 25-50, 50-75, 75-100)
    if (completionRange) {
      const [min, max] = completionRange.split('-').map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        combined = combined.filter((item) => item.completionScore >= min && item.completionScore <= max);
      }
    }

    // 8. Sorting
    if (sort === 'oldest') {
      combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'active') {
      combined.sort((a, b) => new Date(b.lastLogin || b.createdAt) - new Date(a.lastLogin || a.createdAt));
    } else {
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = combined.length;
    const paginated = combined.slice(skip, skip + limitNum);

    const stats = {
      totalMembers: await User.countDocuments({ role: { $ne: 'admin' }, isDeleted: { $ne: true } }) + await Profile.countDocuments({ profileSource: 'Admin Imported' }),
      brides: await Profile.countDocuments({ gender: { $in: ['bride', 'female', 'Bride', 'Female'] }, user: { $nin: adminIds } }),
      grooms: await Profile.countDocuments({ gender: { $in: ['groom', 'male', 'Groom', 'Male'] }, user: { $nin: adminIds } }),
      verifiedMembers: await Profile.countDocuments({ isVerified: true, user: { $nin: adminIds } }),
      pendingVerification: await Profile.countDocuments({ isVerified: false, user: { $nin: adminIds }, gender: { $in: ['bride', 'groom', 'female', 'male'] } }),
      blockedUsers: await User.countDocuments({ role: { $ne: 'admin' }, accountStatus: 'blocked' }),
      onlineToday: await User.countDocuments({ role: { $ne: 'admin' }, lastLogin: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
      newToday: await User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
    };

    res.json({
      users: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      stats,
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ message: 'Error retrieving user list' });
  }
};

// @desc    Get Detailed User & Profile Data for Admin Drawer
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select('-password');
    let profile = null;

    if (user) {
      profile = await Profile.findOne({ user: user._id }).populate('verifiedBy', 'fullName email');
    } else {
      profile = await Profile.findById(req.params.id).populate('verifiedBy', 'fullName email');
    }

    if (!user && !profile) {
      return res.status(404).json({ message: 'Member profile not found' });
    }

    const receivedInterests = user ? await Interest.find({ recipient: user._id }).populate('senderProfile') : [];
    const sentInterests = user ? await Interest.find({ sender: user._id }).populate('recipientProfile') : [];
    const contactMessages = (user?.email || profile?.contactEmail)
      ? await ContactMessage.find({ email: (user?.email || profile?.contactEmail).toLowerCase() })
      : [];

    const profileObj = profile ? profile.toObject() : {};
    if (profile) {
      profileObj.completeness = typeof profile.calculateCompleteness === 'function' ? profile.calculateCompleteness() : { score: 80, missingFields: [] };
    }

    res.json({
      user: user || null,
      profile: profileObj,
      receivedInterests,
      sentInterests,
      contactMessages,
    });
  } catch (error) {
    console.error('Get User Details Error:', error);
    res.status(500).json({ message: 'Error retrieving member details' });
  }
};

// @desc    Admin Edit User & Profile Details
// @route   PUT /api/admin/users/:id/edit
// @access  Private/Admin
const editUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let profile = null;

    const {
      fullName,
      email,
      mobile,
      gender,
      dateOfBirth,
      heightCm,
      religion,
      caste,
      highestEducation,
      occupation,
      company,
      annualIncome,
      city,
      state,
      aboutMe,
    } = req.body;

    if (user) {
      if (fullName) user.fullName = fullName;
      if (email) user.email = email.toLowerCase().trim();
      if (mobile) user.mobile = mobile.trim();
      await user.save();

      profile = await Profile.findOne({ user: user._id });
      if (!profile) {
        profile = await Profile.create({ user: user._id, fullName: user.fullName });
      }
    } else {
      profile = await Profile.findById(req.params.id);
    }

    if (!user && !profile) {
      return res.status(404).json({ message: 'Member record not found' });
    }

    if (profile) {
      if (fullName) profile.fullName = fullName;
      if (email) profile.contactEmail = email;
      if (mobile) profile.contactPhone = mobile;
      if (gender !== undefined) profile.gender = gender;
      if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
      if (heightCm !== undefined) profile.heightCm = heightCm;
      if (religion !== undefined) profile.religion = religion;
      if (caste !== undefined) profile.caste = caste;
      if (highestEducation !== undefined) profile.highestEducation = highestEducation;
      if (occupation !== undefined) profile.occupation = occupation;
      if (company !== undefined) profile.company = company;
      if (annualIncome !== undefined) profile.annualIncome = annualIncome;
      if (city !== undefined) profile.city = city;
      if (state !== undefined) profile.state = state;
      if (aboutMe !== undefined) profile.aboutMe = aboutMe;
      await profile.save();
    }

    if (user) {
      user.activityTimeline.push({
        action: 'ADMIN_EDIT_PROFILE',
        details: `Profile updated by Administrator ${req.user.email}`,
        timestamp: new Date(),
      });
      await user.save();
      await logAdminAction(req.user._id, 'EDIT_USER_PROFILE', `Edited profile details for ${user.email}`, user._id);
    } else if (profile) {
      await logAdminAction(req.user._id, 'EDIT_IMPORTED_PROFILE', `Edited imported profile ${profile.fullName}`);
    }

    res.json({ message: 'User profile updated successfully', user, profile });
  } catch (error) {
    console.error('Edit User Error:', error);
    res.status(500).json({ message: 'Error editing user profile: ' + error.message });
  }
};

// @desc    Block User with Reason & Temp/Perm Type
// @route   POST /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
  try {
    const { reason, blockType } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot block system administrator' });
      }

      user.accountStatus = 'blocked';
      user.blockReason = reason || 'Violation of matrimony portal terms';
      user.blockType = blockType || 'Permanent';
      user.blockedAt = new Date();
      user.refreshTokens = [];

      user.activityTimeline.push({
        action: 'ACCOUNT_BLOCKED',
        details: `Blocked (${user.blockType}): ${user.blockReason}`,
        timestamp: new Date(),
      });

      await user.save();
      await logAdminAction(req.user._id, 'BLOCK_USER', `Blocked account ${user.email} (${user.blockType}). Reason: ${user.blockReason}`, user._id);

      return res.json({ message: `User account blocked successfully`, accountStatus: user.accountStatus });
    }

    const profile = await Profile.findById(req.params.id);
    if (profile) {
      profile.status = 'Rejected';
      await profile.save();
      await logAdminAction(req.user._id, 'BLOCK_IMPORTED_PROFILE', `Blocked imported profile ${profile.fullName}`);
      return res.json({ message: 'Imported profile blocked successfully', accountStatus: 'blocked' });
    }

    return res.status(404).json({ message: 'User account not found' });
  } catch (error) {
    console.error('Block User Error:', error);
    res.status(500).json({ message: 'Error blocking user account' });
  }
};

// @desc    Unblock User
// @route   POST /api/admin/users/:id/unblock
// @access  Private/Admin
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.accountStatus = 'active';
      user.blockReason = '';
      user.blockType = '';
      user.blockedAt = null;

      user.activityTimeline.push({
        action: 'ACCOUNT_UNBLOCKED',
        details: `Unblocked by Administrator ${req.user.email}`,
        timestamp: new Date(),
      });

      await user.save();
      await logAdminAction(req.user._id, 'UNBLOCK_USER', `Unblocked account ${user.email}`, user._id);

      return res.json({ message: 'User account unblocked and restored to Active', accountStatus: user.accountStatus });
    }

    const profile = await Profile.findById(req.params.id);
    if (profile) {
      profile.status = 'Approved';
      await profile.save();
      await logAdminAction(req.user._id, 'UNBLOCK_IMPORTED_PROFILE', `Unblocked imported profile ${profile.fullName}`);
      return res.json({ message: 'Imported profile restored to Active', accountStatus: 'active' });
    }

    return res.status(404).json({ message: 'User account not found' });
  } catch (error) {
    console.error('Unblock User Error:', error);
    res.status(500).json({ message: 'Error unblocking user account' });
  }
};

// @desc    Soft Delete User (Moves to Deleted status)
// @route   DELETE /api/admin/users/:id/soft-delete
// @access  Private/Admin
const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete system administrator' });
      }

      user.isDeleted = true;
      user.deletedAt = new Date();
      user.accountStatus = 'deleted';
      user.refreshTokens = [];

      await user.save();
      await logAdminAction(req.user._id, 'SOFT_DELETE_USER', `Soft-deleted user ${user.email}`, user._id);

      return res.json({ message: `User account moved to Deleted Users tab` });
    }

    const profile = await Profile.findById(req.params.id);
    if (profile) {
      profile.status = 'Suspended';
      await profile.save();
      await logAdminAction(req.user._id, 'SOFT_DELETE_IMPORTED_PROFILE', `Soft-deleted imported profile ${profile.fullName}`);
      return res.json({ message: 'Imported profile suspended' });
    }

    return res.status(404).json({ message: 'User account not found' });
  } catch (error) {
    console.error('Soft Delete User Error:', error);
    res.status(500).json({ message: 'Error soft deleting user account' });
  }
};

// @desc    Restore Soft-Deleted User
// @route   POST /api/admin/users/:id/restore
// @access  Private/Admin
const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isDeleted = false;
      user.deletedAt = null;
      user.accountStatus = 'active';

      user.activityTimeline.push({
        action: 'ACCOUNT_RESTORED',
        details: `Restored from Deleted queue by ${req.user.email}`,
        timestamp: new Date(),
      });

      await user.save();
      await logAdminAction(req.user._id, 'RESTORE_USER', `Restored user account ${user.email}`, user._id);

      return res.json({ message: 'User account restored to Active Members' });
    }

    const profile = await Profile.findById(req.params.id);
    if (profile) {
      profile.status = 'Approved';
      await profile.save();
      await logAdminAction(req.user._id, 'RESTORE_IMPORTED_PROFILE', `Restored imported profile ${profile.fullName}`);
      return res.json({ message: 'Imported profile restored to Active' });
    }

    return res.status(404).json({ message: 'User account not found' });
  } catch (error) {
    console.error('Restore User Error:', error);
    res.status(500).json({ message: 'Error restoring user account' });
  }
};

// @desc    Permanent Delete User & Profile from MongoDB
// @route   DELETE /api/admin/users/:id/permanent
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete system administrator account' });
      }

      await Profile.findOneAndDelete({ user: user._id });
      await User.findByIdAndDelete(user._id);

      await logAdminAction(req.user._id, 'PERMANENT_DELETE_USER', `Permanently deleted user account ${user.email}`, user._id);

      return res.json({ message: 'User account and profile deleted permanently' });
    }

    const profile = await Profile.findById(req.params.id);
    if (profile) {
      await Profile.findByIdAndDelete(profile._id);
      await logAdminAction(req.user._id, 'PERMANENT_DELETE_IMPORTED_PROFILE', `Permanently deleted imported profile ${profile.fullName}`);
      return res.json({ message: 'Imported profile deleted permanently' });
    }

    return res.status(404).json({ message: 'Record not found' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Error deleting record' });
  }
};

// @desc    Reset User Password
// @route   POST /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    user.password = newPassword;
    user.refreshTokens = [];
    user.activityTimeline.push({
      action: 'PASSWORD_RESET_BY_ADMIN',
      details: `Password reset by Administrator ${req.user.email}`,
      timestamp: new Date(),
    });
    await user.save();

    await logAdminAction(req.user._id, 'RESET_USER_PASSWORD', `Reset password for user ${user.email}`, user._id);

    res.json({ message: `Password reset successfully for ${user.email}` });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc    Add Private Admin Note to User
// @route   POST /api/admin/users/:id/notes
// @access  Private/Admin
const addAdminNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Note text cannot be empty' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    user.adminNotes.push({
      note: note.trim(),
      adminEmail: req.user.email,
      createdAt: new Date(),
    });
    await user.save();

    res.json({ message: 'Admin note saved successfully', adminNotes: user.adminNotes });
  } catch (error) {
    console.error('Add Admin Note Error:', error);
    res.status(500).json({ message: 'Error saving admin note' });
  }
};

// @desc    Update Internal Admin Tags for User
// @route   PUT /api/admin/users/:id/tags
// @access  Private/Admin
const updateInternalTags = async (req, res) => {
  try {
    const { tags } = req.body;
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    user.internalTags = tags;
    await user.save();

    res.json({ message: 'Internal tags updated successfully', internalTags: user.internalTags });
  } catch (error) {
    console.error('Update Internal Tags Error:', error);
    res.status(500).json({ message: 'Error updating internal tags' });
  }
};

// @desc    Update user account status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'blocked', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status parameter' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    user.accountStatus = status;
    if (status === 'deleted') {
      user.isDeleted = true;
      user.deletedAt = new Date();
    }
    await user.save();

    await logAdminAction(req.user._id, `ACCOUNT_STATUS_${status.toUpperCase()}`, `Updated status of user ${user.email} to ${status}`, user._id);

    res.json({ message: `User account status updated to ${status}`, accountStatus: user.accountStatus });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// =========================================================
// PROFILE VERIFICATION MODULE CONTROLLERS (PHASE 1.4)
// =========================================================

// @desc    Get Filtered & Paginated Pending ID Verifications Queue
// @route   GET /api/admin/verifications
// @access  Private/Admin
const getPendingVerifications = async (req, res) => {
  try {
    const {
      search,
      status, // 'Pending', 'Verified', 'Rejected', 'ReuploadRequested', 'Suspended'
      gender,
      religion,
      state,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Exclude admin accounts
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((u) => u._id);

    let profileFilter = {
      user: { $nin: adminIds },
      gender: { $in: ['bride', 'groom'] },
    };

    if (status) {
      if (status === 'Verified') {
        profileFilter.isVerified = true;
      } else if (status === 'Pending') {
        profileFilter.isVerified = false;
        profileFilter.idVerificationStatus = { $in: ['Pending', 'Unverified'] };
      } else if (status === 'Rejected') {
        profileFilter.idVerificationStatus = 'Rejected';
      } else if (status === 'ReuploadRequested') {
        profileFilter.idVerificationStatus = 'ReuploadRequested';
      }
    }

    if (gender) {
      profileFilter.gender = gender;
    }

    let rawProfiles = await Profile.find(profileFilter)
      .populate('user', 'email mobile accountStatus role createdAt lastLogin')
      .populate('verifiedBy', 'fullName email')
      .sort({ updatedAt: sort === 'oldest' ? 1 : -1 });

    // Multi-field search
    if (search) {
      const s = search.toLowerCase();
      rawProfiles = rawProfiles.filter(
        (p) =>
          p.fullName?.toLowerCase().includes(s) ||
          p.user?.email?.toLowerCase().includes(s) ||
          p.user?.mobile?.toLowerCase().includes(s) ||
          p.city?.toLowerCase().includes(s) ||
          `SSM${p._id.toString().slice(-6).toUpperCase()}`.toLowerCase().includes(s)
      );
    }

    if (religion) {
      rawProfiles = rawProfiles.filter((p) => p.religion?.toLowerCase().includes(religion.toLowerCase()));
    }

    if (state) {
      rawProfiles = rawProfiles.filter((p) => p.state?.toLowerCase().includes(state.toLowerCase()));
    }

    const total = rawProfiles.length;
    const paginated = rawProfiles.slice(skip, skip + limitNum);

    // Calculate Top 5 Stats directly from MongoDB
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const pendingCount = await Profile.countDocuments({ isVerified: false, user: { $nin: adminIds }, gender: { $in: ['bride', 'groom'] } });
    const verifiedCount = await Profile.countDocuments({ isVerified: true, user: { $nin: adminIds } });
    const rejectedCount = await Profile.countDocuments({ idVerificationStatus: 'Rejected', user: { $nin: adminIds } });
    const reuploadCount = await Profile.countDocuments({ idVerificationStatus: 'ReuploadRequested', user: { $nin: adminIds } });
    const todayRequestsCount = await Profile.countDocuments({ updatedAt: { $gte: startOfToday }, user: { $nin: adminIds } });

    res.json({
      profiles: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      stats: {
        pendingCount,
        verifiedCount,
        rejectedCount,
        reuploadCount,
        todayRequestsCount,
      },
    });
  } catch (error) {
    console.error('Pending Verifications Error:', error);
    res.status(500).json({ message: 'Error fetching verifications list' });
  }
};

// @desc    Approve Profile Verification & Grant Badge
// @route   POST /api/admin/verifications/:id/approve
// @access  Private/Admin
const approveProfileVerification = async (req, res) => {
  try {
    const { note } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerified = true;
    profile.idVerificationStatus = 'Verified';
    profile.verifiedBy = req.user._id;
    profile.verifiedAt = new Date();
    if (note) profile.verificationNote = note;

    profile.verificationAuditLog.push({
      action: 'APPROVED_VERIFICATION',
      adminEmail: req.user.email,
      reason: note || 'Verified government ID and profile details',
      timestamp: new Date(),
    });

    await profile.save();

    const user = await User.findById(profile.user);
    if (user) {
      user.activityTimeline.push({
        action: 'VERIFICATION_APPROVED',
        details: `Profile verified by Administrator ${req.user.email}`,
        timestamp: new Date(),
      });
      await user.save();
    }

    await logAdminAction(req.user._id, 'APPROVE_VERIFICATION', `Approved verification badge for ${profile.fullName}`, profile._id);

    res.json({ message: 'Profile verified successfully', profile });
  } catch (error) {
    console.error('Approve Verification Error:', error);
    res.status(500).json({ message: 'Error approving profile verification' });
  }
};

// @desc    Reject Profile Verification
// @route   POST /api/admin/verifications/:id/reject
// @access  Private/Admin
const rejectProfileVerification = async (req, res) => {
  try {
    const { reason, note } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerified = false;
    profile.idVerificationStatus = 'Rejected';
    profile.rejectionReason = reason || 'Document verification failed';
    if (note) profile.verificationNote = note;

    profile.verificationAuditLog.push({
      action: 'REJECTED_VERIFICATION',
      adminEmail: req.user.email,
      reason: `${profile.rejectionReason} - ${note || ''}`,
      timestamp: new Date(),
    });

    await profile.save();

    const user = await User.findById(profile.user);
    if (user) {
      user.activityTimeline.push({
        action: 'VERIFICATION_REJECTED',
        details: `Verification rejected (${profile.rejectionReason})`,
        timestamp: new Date(),
      });
      await user.save();
    }

    await logAdminAction(req.user._id, 'REJECT_VERIFICATION', `Rejected verification for ${profile.fullName}. Reason: ${profile.rejectionReason}`, profile._id);

    res.json({ message: 'Profile verification rejected', profile });
  } catch (error) {
    console.error('Reject Verification Error:', error);
    res.status(500).json({ message: 'Error rejecting profile verification' });
  }
};

// @desc    Request ID Document Re-upload
// @route   POST /api/admin/verifications/:id/reupload
// @access  Private/Admin
const reuploadProfileVerification = async (req, res) => {
  try {
    const { reason, note } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerified = false;
    profile.idVerificationStatus = 'ReuploadRequested';
    profile.reuploadReason = reason || 'Clearer document required';
    if (note) profile.verificationNote = note;

    profile.verificationAuditLog.push({
      action: 'REUPLOAD_REQUESTED',
      adminEmail: req.user.email,
      reason: `${profile.reuploadReason} - ${note || ''}`,
      timestamp: new Date(),
    });

    await profile.save();

    const user = await User.findById(profile.user);
    if (user) {
      user.activityTimeline.push({
        action: 'REUPLOAD_REQUESTED',
        details: `Re-upload requested (${profile.reuploadReason})`,
        timestamp: new Date(),
      });
      await user.save();
    }

    await logAdminAction(req.user._id, 'REUPLOAD_VERIFICATION', `Requested ID re-upload for ${profile.fullName}. Reason: ${profile.reuploadReason}`, profile._id);

    res.json({ message: 'Re-upload request recorded and user notified', profile });
  } catch (error) {
    console.error('Reupload Request Error:', error);
    res.status(500).json({ message: 'Error requesting document re-upload' });
  }
};

// @desc    Remove Verification Badge
// @route   POST /api/admin/verifications/:id/remove-badge
// @access  Private/Admin
const removeVerificationBadge = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerified = false;
    profile.idVerificationStatus = 'Pending';
    profile.verifiedBy = null;
    profile.verifiedAt = null;

    profile.verificationAuditLog.push({
      action: 'REMOVED_VERIFICATION',
      adminEmail: req.user.email,
      reason: 'Verification badge revoked by admin',
      timestamp: new Date(),
    });

    await profile.save();
    await logAdminAction(req.user._id, 'REMOVE_VERIFICATION_BADGE', `Revoked verification badge for ${profile.fullName}`, profile._id);

    res.json({ message: 'Verification badge removed', profile });
  } catch (error) {
    console.error('Remove Badge Error:', error);
    res.status(500).json({ message: 'Error removing verification badge' });
  }
};

// @desc    Manage Individual Profile Photos (Approve / Reject / Delete / Primary)
// @route   POST /api/admin/verifications/:id/photo-action
// @access  Private/Admin
const manageProfilePhoto = async (req, res) => {
  try {
    const { photoUrl, action } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (action === 'delete' || action === 'reject') {
      profile.photos = profile.photos.filter((p) => p !== photoUrl);
    } else if (action === 'primary') {
      profile.photos = [photoUrl, ...profile.photos.filter((p) => p !== photoUrl)];
    }

    await profile.save();
    res.json({ message: `Photo action '${action}' completed`, photos: profile.photos });
  } catch (error) {
    console.error('Manage Photo Error:', error);
    res.status(500).json({ message: 'Error managing profile photo' });
  }
};

// @desc    Toggle verify profile shortcut
// @route   PUT /api/admin/verify-profile/:id
// @access  Private/Admin
const toggleVerifyProfile = async (req, res) => {
  try {
    const { action, isVerified, idVerificationStatus, verificationNote, rejectionReason } = req.body;
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (action === 'approve' || isVerified === true) {
      profile.isVerified = true;
      profile.idVerificationStatus = 'Verified';
      profile.verifiedBy = req.user._id;
      profile.verifiedAt = new Date();
      if (verificationNote) profile.verificationNote = verificationNote;
    } else if (action === 'reject' || idVerificationStatus === 'Rejected') {
      profile.isVerified = false;
      profile.idVerificationStatus = 'Rejected';
      if (rejectionReason) profile.rejectionReason = rejectionReason;
    } else if (action === 'reupload' || idVerificationStatus === 'ReuploadRequested') {
      profile.isVerified = false;
      profile.idVerificationStatus = 'ReuploadRequested';
      if (verificationNote) profile.verificationNote = verificationNote;
    } else {
      profile.isVerified = !profile.isVerified;
      profile.idVerificationStatus = profile.isVerified ? 'Verified' : 'Unverified';
    }

    await profile.save();

    await logAdminAction(
      req.user._id,
      'VERIFY_PROFILE',
      `Set verification for profile ${profile.fullName} to ${profile.isVerified ? 'Verified' : 'Unverified'} (${profile.idVerificationStatus})`,
      profile._id
    );

    res.json({
      message: `Profile verification updated`,
      isVerified: profile.isVerified,
      idVerificationStatus: profile.idVerificationStatus,
    });
  } catch (error) {
    console.error('Toggle Verification Error:', error);
    res.status(500).json({ message: 'Error toggling verification status' });
  }
};

// @desc    Perform Bulk User Actions
// @route   POST /api/admin/users/bulk-action
// @access  Private/Admin
const bulkUserAction = async (req, res) => {
  try {
    const { action, userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'No users selected for bulk action' });
    }

    if (action === 'verify') {
      await Profile.updateMany({ user: { $in: userIds } }, { isVerified: true, idVerificationStatus: 'Verified' });
      await logAdminAction(req.user._id, 'BULK_VERIFY', `Bulk verified ${userIds.length} profiles`);
      return res.json({ message: `Successfully verified ${userIds.length} selected profiles` });
    }

    if (action === 'suspend') {
      await User.updateMany({ _id: { $in: userIds }, role: { $ne: 'admin' } }, { accountStatus: 'suspended' });
      await logAdminAction(req.user._id, 'BULK_SUSPEND', `Bulk suspended ${userIds.length} users`);
      return res.json({ message: `Successfully suspended ${userIds.length} selected users` });
    }

    if (action === 'block') {
      await User.updateMany({ _id: { $in: userIds }, role: { $ne: 'admin' } }, { accountStatus: 'blocked', blockType: 'Permanent', blockReason: 'Bulk admin restriction' });
      await logAdminAction(req.user._id, 'BULK_BLOCK', `Bulk blocked ${userIds.length} users`);
      return res.json({ message: `Successfully blocked ${userIds.length} selected users` });
    }

    if (action === 'delete') {
      const nonAdminUsers = await User.find({ _id: { $in: userIds }, role: { $ne: 'admin' } });
      const nonAdminIds = nonAdminUsers.map((u) => u._id);

      await User.updateMany({ _id: { $in: nonAdminIds } }, { isDeleted: true, accountStatus: 'deleted', deletedAt: new Date() });
      await logAdminAction(req.user._id, 'BULK_SOFT_DELETE', `Bulk soft-deleted ${nonAdminIds.length} users`);
      return res.json({ message: `Successfully soft-deleted ${nonAdminIds.length} selected users` });
    }

    res.status(400).json({ message: 'Invalid bulk action' });
  } catch (error) {
    console.error('Bulk Action Error:', error);
    res.status(500).json({ message: 'Error processing bulk action' });
  }
};

// =========================================================
// CONTACT MESSAGES INBOX CONTROLLERS
// =========================================================

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const contactMsg = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'Unread',
    });

    res.status(201).json({
      message: 'Your message has been sent successfully. Our support team will get back to you shortly.',
      contactMsg,
    });
  } catch (error) {
    console.error('Submit Contact Message Error:', error);
    res.status(500).json({ message: 'Error submitting contact message' });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 15 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      const s = new RegExp(search, 'i');
      filter.$or = [{ name: s }, { email: s }, { subject: s }, { message: s }];
    }

    const total = await ContactMessage.countDocuments(filter);
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
    const unreadCount = await ContactMessage.countDocuments({ status: 'Unread' });

    res.json({
      messages,
      total,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('Get Contact Messages Error:', error);
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
};

const replyContactMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ message: 'Reply text cannot be empty' });
    }

    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    msg.replyText = replyText;
    msg.status = 'Replied';
    msg.repliedAt = new Date();
    await msg.save();

    try {
      await sendEmail({
        email: msg.email,
        subject: `Re: ${msg.subject} - SS Matrimony Support`,
        message: `Hello ${msg.name},\n\nThank you for reaching out to SS Matrimony Support.\n\nOur Response:\n${replyText}\n\nBest Regards,\nSS Matrimony Support Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1E293B;">
            <h2 style="color: #0B3B91;">SS Matrimony Customer Support</h2>
            <p>Dear <strong>${msg.name}</strong>,</p>
            <p>Thank you for contacting SS Matrimony Support regarding: <em>"${msg.subject}"</em>.</p>
            <div style="background-color: #F1F5F9; border-left: 4px solid #0B3B91; padding: 15px; margin: 15px 0;">
              <strong>Admin Response:</strong>
              <p style="white-space: pre-line; margin-top: 5px;">${replyText}</p>
            </div>
            <p style="font-size: 0.85rem; color: #64748B;">If you have further questions, feel free to reply to this email or visit our website.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.log('Email delivery note:', emailErr.message);
    }

    await logAdminAction(req.user._id, 'REPLY_CONTACT', `Replied to contact message from ${msg.email}`, msg._id);

    res.json({ message: 'Reply sent successfully', contactMessage: msg });
  } catch (error) {
    console.error('Reply Contact Error:', error);
    res.status(500).json({ message: 'Error replying to contact message' });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    msg.status = status;
    await msg.save();

    res.json({ message: `Message status updated to ${status}`, contactMessage: msg });
  } catch (error) {
    console.error('Update Contact Status Error:', error);
    res.status(500).json({ message: 'Error updating contact status' });
  }
};

const deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ message: 'Error deleting contact message' });
  }
};

const getAdminLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find().populate('adminUser', 'fullName email').sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    console.error('Get Admin Logs Error:', error);
    res.status(500).json({ message: 'Error retrieving admin activity logs' });
  }
};

// =========================================================
// SUCCESS STORIES CMS CONTROLLERS
// =========================================================

// Public fetch (Only Published stories, featured first)
const getSuccessStories = async (req, res) => {
  try {
    const { featured, page = 1, limit = 12 } = req.query;
    const filter = { status: 'Published' };
    if (featured === 'true') filter.featured = true;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await SuccessStory.countDocuments(filter);
    // Sort: Featured true first, then newest
    const stories = await SuccessStory.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      stories,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasMore: pageNum * limitNum < total,
    });
  } catch (error) {
    console.error('Success Stories Public Error:', error);
    res.status(500).json({ message: 'Error fetching success stories' });
  }
};

// Admin CMS Fetch with Search, Filters, Stats & Pagination
const getAdminSuccessStories = async (req, res) => {
  try {
    const { search, status, featured, sort = 'newest', page = 1, limit = 10 } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { coupleNames: regex },
        { brideName: regex },
        { groomName: regex },
        { location: regex },
        { city: regex },
      ];
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (featured === 'true') filter.featured = true;
    if (featured === 'false') filter.featured = false;

    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Top CMS Stat Cards Data
    const totalStories = await SuccessStory.countDocuments();
    const publishedStories = await SuccessStory.countDocuments({ status: 'Published' });
    const draftStories = await SuccessStory.countDocuments({ status: 'Draft' });
    const featuredStories = await SuccessStory.countDocuments({ featured: true });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAdded = await SuccessStory.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    const totalFiltered = await SuccessStory.countDocuments(filter);
    const stories = await SuccessStory.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      stats: {
        totalStories,
        publishedStories,
        draftStories,
        featuredStories,
        recentlyAdded,
      },
      stories,
      total: totalFiltered,
      page: pageNum,
      totalPages: Math.ceil(totalFiltered / limitNum) || 1,
    });
  } catch (error) {
    console.error('Admin Success Stories Error:', error);
    res.status(500).json({ message: 'Error fetching admin success stories' });
  }
};

const getSuccessStoryById = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Success story not found' });
    res.json(story);
  } catch (error) {
    console.error('Get Story Error:', error);
    res.status(500).json({ message: 'Error retrieving success story' });
  }
};

const addSuccessStory = async (req, res) => {
  try {
    const {
      title,
      brideName,
      groomName,
      coupleNames,
      weddingDate,
      location,
      city,
      state,
      country,
      shortDescription,
      description,
      story,
      images,
      gallery,
      featuredImage,
      coverImage,
      image,
      rating,
      displayOrder,
      status,
      featured,
      seoTitle,
      seoDescription,
    } = req.body;

    const resolvedCoupleNames = coupleNames || [groomName, brideName].filter(Boolean).join(' & ') || 'Happy Couple';
    const resolvedDescription = description || story || '';
    const resolvedCoverImg = featuredImage || coverImage || image || (Array.isArray(images) && images[0]) || '';
    const resolvedGalleryList = Array.isArray(gallery) && gallery.length > 0
      ? gallery
      : Array.isArray(images) && images.length > 0
        ? images
        : resolvedCoverImg ? [resolvedCoverImg] : [];

    const storyStatus = status || 'Published';
    const adminEmail = req.user?.email || 'Admin';

    const newStory = await SuccessStory.create({
      title: title || `${resolvedCoupleNames}'s Wedding Announcement`,
      brideName: brideName || '',
      groomName: groomName || '',
      coupleNames: resolvedCoupleNames,
      weddingDate: weddingDate || 'Wedded Recently',
      location: location || 'Hyderabad, Telangana',
      city: city || 'Hyderabad',
      state: state || 'Telangana',
      country: country || 'India',
      shortDescription: shortDescription || '',
      description: resolvedDescription,
      images: resolvedGalleryList,
      featuredImage: resolvedCoverImg,
      rating: Number(rating) || 5,
      displayOrder: Number(displayOrder) || 0,
      status: storyStatus,
      featured: Boolean(featured),
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      createdBy: adminEmail,
      updatedBy: adminEmail,
      publishedBy: storyStatus === 'Published' ? adminEmail : '',
      publishedAt: storyStatus === 'Published' ? new Date() : null,
    });

    await logAdminAction(req.user._id, 'CREATE_SUCCESS_STORY', `Created success story for ${newStory.coupleNames}`, newStory._id);

    res.status(201).json(newStory);
  } catch (error) {
    console.error('Add Success Story Error:', error);
    res.status(500).json({ message: 'Error adding success story: ' + error.message });
  }
};

const updateSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Success story not found' });

    const adminEmail = req.user?.email || 'Admin';
    const updateData = { ...req.body, updatedBy: adminEmail };

    if (updateData.status && updateData.status === 'Published' && story.status !== 'Published') {
      updateData.publishedBy = adminEmail;
      updateData.publishedAt = new Date();
    }

    if (updateData.description || updateData.story) {
      updateData.description = updateData.description || updateData.story;
    }
    if (updateData.featuredImage || updateData.coverImage) {
      updateData.featuredImage = updateData.featuredImage || updateData.coverImage;
    }

    const updated = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    await logAdminAction(req.user._id, 'UPDATE_SUCCESS_STORY', `Updated success story for ${updated.coupleNames}`, updated._id);

    res.json(updated);
  } catch (error) {
    console.error('Update Success Story Error:', error);
    res.status(500).json({ message: 'Error updating success story: ' + error.message });
  }
};

const deleteSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: 'Success story not found' });
    await logAdminAction(req.user._id, 'DELETE_SUCCESS_STORY', `Deleted success story ${req.params.id}`);
    res.json({ message: 'Success story deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Success Story Error:', error);
    res.status(500).json({ message: 'Error deleting success story' });
  }
};

const togglePublishSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Success story not found' });

    const adminEmail = req.user?.email || 'Admin';
    const newStatus = story.status === 'Published' ? 'Draft' : 'Published';
    story.status = newStatus;
    story.updatedBy = adminEmail;

    if (newStatus === 'Published') {
      story.publishedBy = adminEmail;
      story.publishedAt = new Date();
    }

    await story.save();

    await logAdminAction(req.user._id, 'TOGGLE_SUCCESS_STORY_STATUS', `Set status of ${story.coupleNames} to ${story.status}`, story._id);

    res.json({
      message: `Success story status changed to ${story.status}`,
      status: story.status,
      story,
    });
  } catch (error) {
    console.error('Toggle Publish Status Error:', error);
    res.status(500).json({ message: 'Error toggling publish status' });
  }
};

const toggleFeatureSuccessStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Success story not found' });

    story.featured = !story.featured;
    story.updatedBy = req.user?.email || 'Admin';
    await story.save();

    await logAdminAction(req.user._id, 'TOGGLE_SUCCESS_STORY_FEATURED', `Set featured status of ${story.coupleNames} to ${story.featured}`, story._id);

    res.json({
      message: `Success story ${story.featured ? 'marked as Featured' : 'removed from Featured'}`,
      featured: story.featured,
      story,
    });
  } catch (error) {
    console.error('Toggle Featured Error:', error);
    res.status(500).json({ message: 'Error toggling featured status' });
  }
};

// =========================================================
// BULK PROFILE IMPORT MODULE (Replaces Membership Plans)
// =========================================================

// @desc    Bulk Import Member Profiles (CSV, Excel, JSON or Manual Record)
// @route   POST /api/admin/profiles/import
// @access  Private/Admin
// =========================================================
// BULK PROFILE IMPORT & MANUAL PROFILE MANAGEMENT MODULE
// =========================================================

// @desc    Create Manually Imported Profile (No User login account created)
// @route   POST /api/admin/profiles
// @access  Private/Admin
const createAdminProfile = async (req, res) => {
  try {
    const profileData = { ...req.body };

    // Generate customId if not provided
    if (!profileData.customId) {
      const count = await Profile.countDocuments();
      profileData.customId = `SSM${10000 + count + 1}`;
    }

    // Default source and status
    profileData.profileSource = profileData.profileSource || 'Admin Imported';
    profileData.status = profileData.status || 'Draft';

    // Format gender
    if (profileData.gender) {
      const gLower = profileData.gender.toLowerCase();
      profileData.gender = gLower.includes('bride') || gLower.includes('female') ? 'bride' : 'groom';
    }

    // Convert dateOfBirth to Date if present
    if (profileData.dateOfBirth) {
      profileData.dateOfBirth = new Date(profileData.dateOfBirth);
    }

    const newProfile = await Profile.create(profileData);

    await logAdminAction(
      req.user._id,
      'CREATE_ADMIN_PROFILE',
      `Created imported profile ${newProfile.fullName} (${newProfile.customId})`,
      newProfile._id
    );

    res.status(201).json({
      message: 'Profile created successfully!',
      profile: newProfile,
    });
  } catch (error) {
    console.error('Create Admin Profile Error:', error);
    res.status(500).json({ message: 'Error creating profile: ' + error.message });
  }
};

// @desc    Get Admin Profiles / Imported Profiles with Filters & Search
// @route   GET /api/admin/profiles/imported
// @access  Private/Admin
const getImportedProfiles = async (req, res) => {
  try {
    const {
      search,
      gender, // 'All', 'Bride', 'Groom', 'bride', 'groom'
      status, // 'All', 'Draft', 'Pending Review', 'Approved', 'Rejected', 'Suspended'
      source, // 'All', 'Admin Imported', 'Registered User'
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map((u) => u._id);

    const filter = {
      user: { $nin: adminUserIds },
    };

    // Source filter
    if (source && source !== 'All') {
      filter.profileSource = source;
    }

    // Gender filter
    if (gender && gender !== 'All') {
      const gLower = gender.toLowerCase();
      if (gLower === 'bride' || gLower === 'female') {
        filter.gender = { $in: ['bride', 'female', 'Bride', 'Female'] };
      } else if (gLower === 'groom' || gLower === 'male') {
        filter.gender = { $in: ['groom', 'male', 'Groom', 'Male'] };
      }
    }

    // Status filter
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Multi-field search
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { fullName: regex },
        { customId: regex },
        { city: regex },
        { contactPhone: regex },
        { contactAltPhone: regex },
        { contactEmail: regex },
      ];
    }

    const totalFiltered = await Profile.countDocuments(filter);
    const rawProfiles = await Profile.find(filter)
      .populate('user', 'email mobile role accountStatus createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const profiles = rawProfiles.map((p) => {
      const pObj = p.toObject();
      if (!pObj.customId) {
        pObj.customId = `SSM${p._id.toString().slice(-6).toUpperCase()}`;
      }
      return pObj;
    });

    // Calculate Stats
    const totalImportedProfiles = await Profile.countDocuments({ profileSource: 'Admin Imported' });
    const draftCount = await Profile.countDocuments({ status: 'Draft' });
    const pendingCount = await Profile.countDocuments({ status: 'Pending Review' });
    const approvedCount = await Profile.countDocuments({ status: 'Approved' });
    const rejectedCount = await Profile.countDocuments({ status: 'Rejected' });
    const suspendedCount = await Profile.countDocuments({ status: 'Suspended' });

    res.json({
      stats: {
        totalImportedProfiles: totalImportedProfiles || await Profile.countDocuments(),
        draftCount,
        pendingCount,
        approvedCount,
        rejectedCount,
        suspendedCount,
        successfullyImported: approvedCount,
        pendingImport: pendingCount + draftCount,
      },
      profiles,
      total: totalFiltered,
      page: pageNum,
      totalPages: Math.ceil(totalFiltered / limitNum) || 1,
    });
  } catch (error) {
    console.error('Get Imported Profiles Error:', error);
    res.status(500).json({ message: 'Error fetching imported profiles list: ' + error.message });
  }
};

// @desc    Get single Profile details for Admin
// @route   GET /api/admin/profiles/:id
// @access  Private/Admin
const getAdminProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'email mobile role accountStatus');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const pObj = profile.toObject();
    if (!pObj.customId) {
      pObj.customId = `SSM${profile._id.toString().slice(-6).toUpperCase()}`;
    }

    res.json(pObj);
  } catch (error) {
    console.error('Get Admin Profile By ID Error:', error);
    res.status(500).json({ message: 'Error fetching profile details' });
  }
};

// @desc    Update Admin Profile
// @route   PUT /api/admin/profiles/:id
// @access  Private/Admin
const updateAdminProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const updateData = { ...req.body };

    if (updateData.gender) {
      const gLower = updateData.gender.toLowerCase();
      updateData.gender = gLower.includes('bride') || gLower.includes('female') ? 'bride' : 'groom';
    }

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    await logAdminAction(
      req.user._id,
      'UPDATE_ADMIN_PROFILE',
      `Updated profile for ${updatedProfile.fullName}`,
      updatedProfile._id
    );

    res.json({ message: 'Profile updated successfully!', profile: updatedProfile });
  } catch (error) {
    console.error('Update Admin Profile Error:', error);
    res.status(500).json({ message: 'Error updating profile: ' + error.message });
  }
};

// @desc    Update Admin Profile Status (Draft, Pending Review, Approved, Rejected, Suspended)
// @route   PUT /api/admin/profiles/:id/status
// @access  Private/Admin
const updateAdminProfileStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Draft', 'Pending Review', 'Approved', 'Rejected', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status option' });
    }

    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.status = status;
    if (status === 'Approved') {
      profile.isVerified = true;
    }
    await profile.save();

    await logAdminAction(
      req.user._id,
      'UPDATE_PROFILE_STATUS',
      `Changed status of ${profile.fullName} to ${status}`,
      profile._id
    );

    res.json({ message: `Profile status updated to ${status}`, status: profile.status, profile });
  } catch (error) {
    console.error('Update Profile Status Error:', error);
    res.status(500).json({ message: 'Error updating profile status' });
  }
};

// @desc    Delete Imported Profile
// @route   DELETE /api/admin/profiles/:id
// @access  Private/Admin
const deleteAdminProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await Profile.findByIdAndDelete(req.params.id);

    await logAdminAction(req.user._id, 'DELETE_ADMIN_PROFILE', `Deleted profile ${profile.fullName} (${req.params.id})`);

    res.json({ message: 'Profile deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete Admin Profile Error:', error);
    res.status(500).json({ message: 'Error deleting profile' });
  }
};

// @desc    Bulk Import Member Profiles (CSV, Excel, JSON)
// @route   POST /api/admin/profiles/import
// @access  Private/Admin
const bulkImportProfiles = async (req, res) => {
  try {
    const { records, options } = req.body;
    const recordsList = Array.isArray(records) ? records : [records];

    if (!recordsList || recordsList.length === 0) {
      return res.status(400).json({ message: 'No profile records provided for import.' });
    }

    let importedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const errors = [];
    const importBatchId = `batch_${Date.now()}`;

    for (let i = 0; i < recordsList.length; i++) {
      const rec = recordsList[i];
      const fullName = (rec.fullName || rec['Full Name'] || rec['Name'] || '').trim();
      const email = (rec.email || rec['Email'] || '').trim().toLowerCase();
      const mobile = (rec.mobile || rec['Phone Number'] || rec['Phone'] || '').trim();
      const genderRaw = (rec.gender || rec['Gender'] || 'bride').toLowerCase();
      const gender = genderRaw.includes('bride') || genderRaw.includes('female') ? 'bride' : 'groom';

      if (!fullName) {
        failedCount++;
        errors.push(`Row ${i + 1}: Missing required field (Full Name).`);
        continue;
      }

      const photoUrl = rec.profilePhotoUrl || rec['Profile Photo URL'] || rec.photo || (Array.isArray(rec.photos) && rec.photos[0]) || '';

      const count = await Profile.countDocuments();
      const customId = rec.customId || rec['Profile ID'] || `SSM${10000 + count + i + 1}`;

      await Profile.create({
        customId,
        fullName,
        gender,
        dateOfBirth: rec.dateOfBirth || rec['Date of Birth'] ? new Date(rec.dateOfBirth || rec['Date of Birth']) : null,
        age: parseInt(rec.age || rec['Age'], 10) || null,
        heightCm: parseInt(rec.height || rec['Height'], 10) || null,
        motherTongue: rec.motherTongue || rec['Mother Tongue'] || 'Telugu',
        maritalStatus: rec.maritalStatus || rec['Marital Status'] || 'Never Married',
        religion: rec.religion || rec['Religion'] || 'Hindu',
        caste: rec.caste || rec['Caste'] || '',
        subCaste: rec.subCaste || rec['Sub Caste'] || '',
        gothram: rec.gothram || rec['Gothram'] || '',
        highestEducation: rec.highestEducation || rec['Education'] || '',
        occupation: rec.occupation || rec['Profession'] || '',
        annualIncome: rec.annualIncome || rec['Annual Income'] || '',
        city: rec.city || rec['City'] || 'Hyderabad',
        state: rec.state || rec['State'] || 'Telangana',
        country: rec.country || rec['Country'] || 'India',
        aboutMe: rec.aboutMe || rec['About Me'] || 'Imported profile details.',
        photos: photoUrl ? [photoUrl] : [],
        profileSource: 'Admin Imported',
        status: rec.status || 'Draft',
        contactPhone: mobile,
        contactEmail: email,
        contactAddress: rec.address || rec['Address'] || '',
        profileCreatedFor: rec.profileCreatedFor || rec['Profile Created For'] || 'Self',
      });

      importedCount++;
    }

    await logAdminAction(
      req.user._id,
      'BULK_IMPORT_PROFILES',
      `Imported ${importedCount} member profiles. Skipped: ${skippedCount}, Failed: ${failedCount}`,
      req.user._id
    );

    res.json({
      message: `Bulk profile import completed successfully!`,
      summary: {
        totalRecords: recordsList.length,
        importedCount,
        skippedCount,
        failedCount,
        errors,
        importBatchId,
      },
    });
  } catch (error) {
    console.error('Bulk Import Profiles Error:', error);
    res.status(500).json({ message: 'Error during bulk profile import: ' + error.message });
  }
};

// =========================================================
// WEBSITE CMS CONTROLLERS
// =========================================================

const getDefaultCmsData = (sectionKey) => {
  switch (sectionKey) {
    case 'homePage':
      return {
        websiteTitle: 'SS Matrimony | Trusted Telugu Matrimonial Service',
        mainHeading: 'Find Your Perfect Telugu Soulmate',
        subHeading: 'Connecting Verified Brides & Grooms Across Telangana, Andhra Pradesh & Overseas',
        heroDescription: 'Join thousands of happy families who found their lifelong partner on SS Matrimony with 100% verified profiles and family-first matchmaking.',
        heroButtonText: 'Register Free Today',
        heroButtonLink: '/register',
        bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        trustBadges: ['100% Verified Profiles', 'Family Guided Matchmaking', 'Privacy Protected Phone Numbers'],
      };
    case 'aboutUs':
      return {
        heading: 'About SS Matrimony',
        description: 'SS Matrimony is the premier Telugu matrimonial platform dedicated to preserving cultural traditions while providing modern digital matchmaking technology.',
        mission: 'To bring together eligible Telugu brides and grooms with trust, transparency, and family values.',
        vision: 'To be the most trusted Telugu matrimony network across India and the global Telugu diaspora.',
        founderMessage: 'Matchmaking is not just about profiles; it is about bringing two families together with mutual respect and joy.',
      };
    case 'services':
      return [
        { title: 'Personal Relationship Managers', icon: 'UserCheck', description: 'Dedicated matchmakers to assist families in finding compatible profiles.', order: 1 },
        { title: 'Kundali & Horoscope Matching', icon: 'Sparkles', description: 'Comprehensive horoscope compatibility reporting by experienced astrologers.', order: 2 },
        { title: 'Contact & Photo Privacy', icon: 'Lock', description: 'Full control over phone numbers and photo visibility.', order: 3 },
        { title: 'Verified ID Checks', icon: 'ShieldCheck', description: 'Government ID verification to ensure 100% genuine member profiles.', order: 4 },
      ];
    case 'heroBanners':
      return [
        {
          desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
          mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
          title: 'Premium Telugu Matrimony',
          subtitle: 'Connecting hearts and families with traditional values.',
          buttonText: 'Explore Matches',
          buttonLink: '/search',
          enabled: true,
        },
      ];
    case 'statistics':
      return {
        happyMarriages: 12500,
        registeredBrides: 45000,
        registeredGrooms: 52000,
        verifiedProfiles: 97000,
        yearsOfService: 12,
        autoCountEnabled: true,
      };
    case 'testimonials':
      return [
        { name: 'Rahul & Sravani', photo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', location: 'Hyderabad, Telangana', message: 'We met through SS Matrimony! The verified profiles made our families feel completely safe.', rating: 5 },
      ];
    case 'faq':
      return [
        { question: 'How do I register a profile on SS Matrimony?', answer: 'Click on Register Free, enter basic candidate details, and upload government ID for verification.' },
        { question: 'Is my phone number visible to everyone?', answer: 'No. Phone numbers are strictly protected and visible only to approved matches or administrators.' },
      ];
    case 'contactInfo':
      return {
        companyName: 'SS Matrimony Pvt. Ltd.',
        address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
        phone: '+91 98765 43210',
        email: 'support@ssmatrimony.com',
        whatsapp: '+91 98765 43210',
        businessHours: 'Mon - Sat: 9:00 AM to 7:00 PM IST',
      };
    case 'footer':
      return {
        companyDescription: 'India’s most trusted Telugu matchmaking service for brides and grooms worldwide.',
        copyrightText: '© 2026 SS Matrimony. All Rights Reserved.',
      };
    case 'seoSettings':
      return {
        homepageTitle: 'SS Matrimony | Trusted Telugu Matrimonial Service',
        metaDescription: 'Discover verified Telugu brides and grooms on SS Matrimony.',
        metaKeywords: 'Telugu Matrimony, Telugu Brides, Telugu Grooms, Hyderabad Matrimony',
      };
    default:
      return {};
  }
};

const getPublicCmsSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    let doc = await CmsContent.findOne({ sectionKey, status: 'Published' });
    if (!doc) {
      const defaultData = getDefaultCmsData(sectionKey);
      return res.json({ sectionKey, data: defaultData, isDefault: true });
    }
    res.json({ sectionKey: doc.sectionKey, data: doc.data, version: doc.version });
  } catch (error) {
    console.error('Public CMS Get Error:', error);
    res.status(500).json({ message: 'Error fetching CMS content' });
  }
};

const getAdminCmsSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    let doc = await CmsContent.findOne({ sectionKey });
    if (!doc) {
      const defaultData = getDefaultCmsData(sectionKey);
      doc = await CmsContent.create({
        sectionKey,
        data: defaultData,
        status: 'Published',
        version: 1,
        updatedBy: req.user?.email || 'Admin',
      });
    }

    const history = await CmsVersionHistory.find({ sectionKey }).sort({ version: -1 }).limit(10);

    res.json({
      sectionKey: doc.sectionKey,
      data: doc.data,
      status: doc.status,
      version: doc.version,
      updatedAt: doc.updatedAt,
      updatedBy: doc.updatedBy,
      history,
    });
  } catch (error) {
    console.error('Admin CMS Get Error:', error);
    res.status(500).json({ message: 'Error fetching CMS section details' });
  }
};

const updateCmsSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { data, status = 'Published' } = req.body;
    const adminEmail = req.user?.email || 'Admin';

    let doc = await CmsContent.findOne({ sectionKey });

    if (!doc) {
      doc = await CmsContent.create({
        sectionKey,
        data,
        status,
        version: 1,
        updatedBy: adminEmail,
      });
    } else {
      await CmsVersionHistory.create({
        sectionKey,
        data: doc.data,
        version: doc.version,
        updatedBy: doc.updatedBy,
      });

      doc.data = data;
      doc.status = status;
      doc.version += 1;
      doc.updatedBy = adminEmail;
      await doc.save();
    }

    await logAdminAction(req.user._id, 'UPDATE_CMS_SECTION', `Updated CMS section "${sectionKey}" to version ${doc.version}`, req.user._id);

    res.json({
      message: `CMS Section "${sectionKey}" updated successfully!`,
      doc,
    });
  } catch (error) {
    console.error('Update CMS Section Error:', error);
    res.status(500).json({ message: 'Error updating CMS section: ' + error.message });
  }
};

const getCmsStats = async (req, res) => {
  try {
    const totalCmsSections = await CmsContent.countDocuments();
    const publishedStories = await SuccessStory.countDocuments({ status: 'Published' });
    const bannersDoc = await CmsContent.findOne({ sectionKey: 'heroBanners' });
    const testimonialsDoc = await CmsContent.findOne({ sectionKey: 'testimonials' });
    
    const activeBannersCount = Array.isArray(bannersDoc?.data) ? bannersDoc.data.filter(b => b.enabled !== false).length : 1;
    const activeTestimonialsCount = Array.isArray(testimonialsDoc?.data) ? testimonialsDoc.data.length : 1;

    const latestDoc = await CmsContent.findOne().sort({ updatedAt: -1 });

    res.json({
      websiteStatus: 'Live',
      activeBanners: activeBannersCount,
      activeTestimonials: activeTestimonialsCount,
      publishedStories,
      totalCmsSections: totalCmsSections || 10,
      lastUpdated: latestDoc?.updatedAt || new Date(),
    });
  } catch (error) {
    console.error('CMS Stats Error:', error);
    res.status(500).json({ message: 'Error fetching CMS dashboard statistics' });
  }
};

const rollbackCmsSection = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { version } = req.body;

    const historyItem = await CmsVersionHistory.findOne({ sectionKey, version: Number(version) });
    if (!historyItem) {
      return res.status(404).json({ message: `Historical version ${version} not found for "${sectionKey}".` });
    }

    let doc = await CmsContent.findOne({ sectionKey });
    if (doc) {
      doc.data = historyItem.data;
      doc.version += 1;
      doc.updatedBy = req.user?.email || 'Admin';
      await doc.save();
    }

    await logAdminAction(req.user._id, 'ROLLBACK_CMS_SECTION', `Restored CMS section "${sectionKey}" to version ${version}`, req.user._id);

    res.json({
      message: `Restored CMS section "${sectionKey}" to version ${version}!`,
      doc,
    });
  } catch (error) {
    console.error('Rollback CMS Error:', error);
    res.status(500).json({ message: 'Error performing CMS rollback' });
  }
};

// =========================================================
// BUSINESS INTELLIGENCE (BI) REPORTS & ANALYTICS CONTROLLER
// =========================================================

const getAdminAnalytics = async (req, res) => {
  try {
    const { range = '30days' } = req.query;

    const now = new Date();
    let dateBoundary = new Date();

    if (range === 'today') {
      dateBoundary.setHours(0, 0, 0, 0);
    } else if (range === '7days') {
      dateBoundary.setDate(now.getDate() - 7);
    } else if (range === '30days') {
      dateBoundary.setDate(now.getDate() - 30);
    } else if (range === 'thisMonth') {
      dateBoundary = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'thisYear') {
      dateBoundary = new Date(now.getFullYear(), 0, 1);
    } else {
      dateBoundary.setDate(now.getDate() - 30);
    }

    // 1. Overview Summary Cards
    const totalRegisteredMembers = await User.countDocuments({ role: 'user', isDeleted: { $ne: true } });
    const totalBrides = await Profile.countDocuments({ gender: 'bride' });
    const totalGrooms = await Profile.countDocuments({ gender: 'groom' });
    const activeMembers = await User.countDocuments({ role: 'user', accountStatus: 'active', isDeleted: { $ne: true } });
    const verifiedMembers = await Profile.countDocuments({ isVerified: true });
    const pendingVerification = await Profile.countDocuments({ idVerificationStatus: 'Pending' });
    const suspendedAccounts = await User.countDocuments({ role: 'user', accountStatus: { $in: ['suspended', 'blocked'] } });

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const newToday = await User.countDocuments({ role: 'user', createdAt: { $gte: startOfToday } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const newThisWeek = await User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } });

    const firstOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = await User.countDocuments({ role: 'user', createdAt: { $gte: firstOfCurrentMonth } });

    // 2. Profile Completion Analytics
    const completedProfiles = await Profile.countDocuments({ isWizardCompleted: true });
    const incompleteProfiles = await Profile.countDocuments({ isWizardCompleted: { $ne: true } });
    const photosMissing = await Profile.countDocuments({ $or: [{ photos: { $size: 0 } }, { photos: null }] });
    const religionMissing = await Profile.countDocuments({ $or: [{ religion: '' }, { religion: null }] });
    const educationMissing = await Profile.countDocuments({ $or: [{ highestEducation: '' }, { highestEducation: null }] });

    // 3. Verification Analytics
    const approvedToday = await Profile.countDocuments({ idVerificationStatus: 'Verified', updatedAt: { $gte: startOfToday } });
    const rejectedToday = await Profile.countDocuments({ idVerificationStatus: 'Rejected', updatedAt: { $gte: startOfToday } });
    const totalProcessedVerifications = (await Profile.countDocuments({ idVerificationStatus: { $in: ['Verified', 'Rejected'] } })) || 1;
    const approvedTotalCount = await Profile.countDocuments({ idVerificationStatus: 'Verified' });
    const approvalRate = Math.round((approvedTotalCount / totalProcessedVerifications) * 100);

    // 4. Aggregations: Location Breakdown
    const stateBreakdown = await Profile.aggregate([
      { $match: { state: { $exists: true, $ne: '' } } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const cityBreakdown = await Profile.aggregate([
      { $match: { city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 5. Aggregations: Demographics (Age, Religion, Education, Occupation)
    const ageBreakdown = await Profile.aggregate([
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [18, 23, 28, 33, 41, 100],
          default: 'Other',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    const religionBreakdown = await Profile.aggregate([
      { $match: { religion: { $exists: true, $ne: '' } } },
      { $group: { _id: '$religion', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const educationBreakdown = await Profile.aggregate([
      { $match: { highestEducation: { $exists: true, $ne: '' } } },
      { $group: { _id: '$highestEducation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const occupationBreakdown = await Profile.aggregate([
      { $match: { occupation: { $exists: true, $ne: '' } } },
      { $group: { _id: '$occupation', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // 6. Match & Interest Analytics
    const totalInterestsSent = await Interest.countDocuments();
    const interestsAccepted = await Interest.countDocuments({ status: 'accepted' });
    const interestsRejected = await Interest.countDocuments({ status: 'declined' });
    const interestsPending = await Interest.countDocuments({ status: 'pending' });

    // 7. Success Stories & Contact Enquiries Overview
    const totalPublishedStories = await SuccessStory.countDocuments({ status: 'Published' });
    const totalContactEnquiries = await ContactMessage.countDocuments();
    const openContactTickets = await ContactMessage.countDocuments({ status: { $ne: 'replied' } });
    const closedContactTickets = await ContactMessage.countDocuments({ status: 'replied' });

    res.json({
      summary: {
        totalRegisteredMembers,
        totalBrides,
        totalGrooms,
        activeMembers,
        verifiedMembers,
        pendingVerification,
        suspendedAccounts,
        newToday,
        newThisWeek,
        newThisMonth,
      },
      profileCompletion: {
        completedProfiles,
        incompleteProfiles,
        avgCompletionPercentage: totalRegisteredMembers > 0 ? Math.round((completedProfiles / totalRegisteredMembers) * 100) : 100,
        photosMissing,
        religionMissing,
        educationMissing,
      },
      verification: {
        pendingVerification,
        approvedToday,
        rejectedToday,
        approvalRate: `${approvalRate}%`,
      },
      location: {
        states: stateBreakdown,
        cities: cityBreakdown,
      },
      demographics: {
        age: ageBreakdown,
        religion: religionBreakdown,
        education: educationBreakdown,
        occupation: occupationBreakdown,
      },
      interests: {
        totalInterestsSent,
        accepted: interestsAccepted,
        rejected: interestsRejected,
        pending: interestsPending,
      },
      cmsAndContact: {
        publishedStories: totalPublishedStories,
        totalContactEnquiries,
        openContactTickets,
        closedContactTickets,
      },
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Analytics Fetch Error:', error);
    res.status(500).json({ message: 'Error generating BI analytics reports: ' + error.message });
  }
};

// ====================================================
// ADMIN INTEREST MANAGEMENT MODULE
// ====================================================

// @desc    Get all Interest Requests with Filters, Stats Cards & Search for Admin CRM
// @route   GET /api/admin/interests
// @access  Private/Admin
const getAdminInterests = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    let query = {};
    if (status && status !== 'all') {
      if (status === 'pending') query.status = 'pending';
      else if (status === 'accepted') query.status = 'accepted';
      else if (status === 'rejected') query.status = 'rejected';
      else if (status === 'under_admin_review') query.status = 'under_admin_review';
      else if (status === 'contact_shared') query.status = 'contact_shared';
      else if (status === 'closed') query.status = 'closed';
    }

    // Card counts for Dashboard Cards
    const pendingCount = await Interest.countDocuments({ status: 'pending' });
    const acceptedCount = await Interest.countDocuments({ status: 'accepted' });
    const rejectedCount = await Interest.countDocuments({ status: 'rejected' });
    const underReviewCount = await Interest.countDocuments({ status: 'under_admin_review' });
    const contactSharedCount = await Interest.countDocuments({ status: 'contact_shared' });
    const closedCount = await Interest.countDocuments({ status: 'closed' });
    const totalCount = await Interest.countDocuments();

    let interests = await Interest.find(query)
      .populate('senderProfile', 'fullName age gender city photos occupation mobile religion caste')
      .populate('sender', 'email mobile phone fullName')
      .populate('recipientProfile', 'fullName age gender city photos occupation mobile religion caste')
      .populate('recipient', 'email mobile phone fullName')
      .populate('adminAssigned', 'fullName email')
      .sort({ createdAt: -1 });

    // Optional Search by interestId, Bride name, or Groom name
    if (search) {
      const s = search.toLowerCase();
      interests = interests.filter((item) => {
        const idMatch = (item.interestId || '').toLowerCase().includes(s);
        const senderMatch = (item.senderProfile?.fullName || '').toLowerCase().includes(s);
        const recipientMatch = (item.recipientProfile?.fullName || '').toLowerCase().includes(s);
        return idMatch || senderMatch || recipientMatch;
      });
    }

    const total = interests.length;
    const paginatedInterests = interests.slice(skip, skip + limitNum);

    res.json({
      interests: paginatedInterests,
      stats: {
        total: totalCount,
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount,
        underReview: underReviewCount,
        contactShared: contactSharedCount,
        closed: closedCount,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Get Admin Interests Error:', error);
    res.status(500).json({ message: 'Error fetching interest requests for admin' });
  }
};

// @desc    Get Detailed Interest Request with Bride/Groom Profiles, Family Info, & Notes
// @route   GET /api/admin/interests/:id
// @access  Private/Admin
const getAdminInterestById = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id)
      .populate({
        path: 'senderProfile',
        populate: { path: 'user', select: 'email mobile fullName createdAt role' },
      })
      .populate({
        path: 'recipientProfile',
        populate: { path: 'user', select: 'email mobile fullName createdAt role' },
      })
      .populate('adminAssigned', 'fullName email')
      .populate('contactSharedBy', 'fullName email');

    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    // Determine Bride and Groom references regardless of who sent first
    const senderGender = (interest.senderProfile?.gender || '').toLowerCase();
    const isSenderBride = senderGender === 'bride' || senderGender === 'female';

    const brideProfile = isSenderBride ? interest.senderProfile : interest.recipientProfile;
    const groomProfile = isSenderBride ? interest.recipientProfile : interest.senderProfile;

    // Previous interest history for both members
    const senderHistory = await Interest.find({
      $or: [{ sender: interest.sender }, { recipient: interest.sender }],
      _id: { $ne: interest._id },
    }).sort({ createdAt: -1 }).limit(5);

    const recipientHistory = await Interest.find({
      $or: [{ sender: interest.recipient }, { recipient: interest.recipient }],
      _id: { $ne: interest._id },
    }).sort({ createdAt: -1 }).limit(5);

    res.json({
      interest,
      brideProfile,
      groomProfile,
      senderHistory,
      recipientHistory,
    });
  } catch (error) {
    console.error('Get Admin Interest By ID Error:', error);
    res.status(500).json({ message: 'Error fetching detailed interest request' });
  }
};

// @desc    Perform Admin Action on Interest Request
// @route   PUT /api/admin/interests/:id/status
// @access  Private/Admin
const updateAdminInterestStatus = async (req, res) => {
  try {
    const { action, status, adminId, meetingDetails, noteText, noteCategory } = req.body;
    const Notification = require('../models/Notification');

    const interest = await Interest.findById(req.params.id)
      .populate('senderProfile', 'fullName')
      .populate('recipientProfile', 'fullName');

    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    const effectiveAction = action || status;

    if (effectiveAction === 'under_admin_review' || effectiveAction === 'review_match') {
      interest.status = 'under_admin_review';
      interest.adminReviewedAt = new Date();

      await Notification.create([
        {
          recipient: interest.sender,
          title: '🟡 Match Under Admin Review',
          message: 'SS Matrimony Relationship Team is now reviewing your mutual match.',
          type: 'admin_review',
          relatedInterest: interest._id,
        },
        {
          recipient: interest.recipient,
          title: '🟡 Match Under Admin Review',
          message: 'SS Matrimony Relationship Team is now reviewing your mutual match.',
          type: 'admin_review',
          relatedInterest: interest._id,
        },
      ]);
    } else if (effectiveAction === 'mark_family_contacted') {
      interest.familyContactedAt = new Date();
      if (interest.status === 'accepted') {
        interest.status = 'under_admin_review';
      }

      await Notification.create([
        {
          recipient: interest.sender,
          title: '📞 Family Contact in Progress',
          message: 'Our relationship manager has initiated contact with the families.',
          type: 'family_contacted',
          relatedInterest: interest._id,
        },
        {
          recipient: interest.recipient,
          title: '📞 Family Contact in Progress',
          message: 'Our relationship manager has initiated contact with the families.',
          type: 'family_contacted',
          relatedInterest: interest._id,
        },
      ]);
    } else if (effectiveAction === 'assign_admin') {
      if (adminId) {
        interest.adminAssigned = adminId;
      }
    } else if (effectiveAction === 'schedule_meeting') {
      interest.meetingScheduledAt = new Date();
      if (meetingDetails) {
        interest.meetingDetails = meetingDetails;
      }

      await Notification.create([
        {
          recipient: interest.sender,
          title: '🤝 Family Meeting Scheduled',
          message: 'A formal family tele-conference or meeting has been arranged by SS Matrimony.',
          type: 'meeting_scheduled',
          relatedInterest: interest._id,
        },
        {
          recipient: interest.recipient,
          title: '🤝 Family Meeting Scheduled',
          message: 'A formal family tele-conference or meeting has been arranged by SS Matrimony.',
          type: 'meeting_scheduled',
          relatedInterest: interest._id,
        },
      ]);
    } else if (effectiveAction === 'contact_shared' || effectiveAction === 'share_contact') {
      interest.status = 'contact_shared';
      interest.contactSharedAt = new Date();
      interest.contactSharedBy = req.user._id;

      await Notification.create([
        {
          recipient: interest.sender,
          title: '📞 Contact Details Shared by Admin',
          message: 'Congratulations! Admin has approved contact sharing for this match. You can now view verified phone details.',
          type: 'contact_shared',
          relatedInterest: interest._id,
        },
        {
          recipient: interest.recipient,
          title: '📞 Contact Details Shared by Admin',
          message: 'Congratulations! Admin has approved contact sharing for this match. You can now view verified phone details.',
          type: 'contact_shared',
          relatedInterest: interest._id,
        },
      ]);
    } else if (effectiveAction === 'rejected' || effectiveAction === 'reject_match') {
      interest.status = 'rejected';
      interest.rejectedAt = new Date();

      await Notification.create([
        {
          recipient: interest.sender,
          title: 'Interest Request Closed',
          message: 'Your interest request was reviewed and closed by SS Matrimony Relationship Team.',
          type: 'interest_rejected',
          relatedInterest: interest._id,
        },
      ]);
    } else if (effectiveAction === 'closed' || effectiveAction === 'close_request') {
      interest.status = 'closed';
      interest.closedAt = new Date();

      await Notification.create([
        {
          recipient: interest.sender,
          title: '✅ Case Closed',
          message: 'Your matrimony interest case has been successfully closed.',
          type: 'case_closed',
          relatedInterest: interest._id,
        },
        {
          recipient: interest.recipient,
          title: '✅ Case Closed',
          message: 'Your matrimony interest case has been successfully closed.',
          type: 'case_closed',
          relatedInterest: interest._id,
        },
      ]);
    }

    if (noteText) {
      interest.notes.push({
        text: noteText,
        addedBy: req.user._id,
        addedByName: req.user.fullName || 'Admin',
        category: noteCategory || 'General',
        createdAt: new Date(),
      });
    }

    await interest.save();
    await logAdminAction(req.user._id, 'UPDATE_INTEREST_STATUS', `Updated interest ${interest.interestId} to ${interest.status}`);

    res.json({
      message: `Interest status updated to ${interest.status} successfully`,
      interest,
    });
  } catch (error) {
    console.error('Update Interest Status Error:', error);
    res.status(500).json({ message: 'Error updating interest status' });
  }
};

// @desc    Add Private Admin Note to Interest Request
// @route   POST /api/admin/interests/:id/notes
// @access  Private/Admin
const addAdminInterestNote = async (req, res) => {
  try {
    const { text, category } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Note text is required' });
    }

    const interest = await Interest.findById(req.params.id);
    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    interest.notes.push({
      text,
      addedBy: req.user._id,
      addedByName: req.user.fullName || 'Admin',
      category: category || 'General',
      createdAt: new Date(),
    });

    await interest.save();
    res.json({
      message: 'Admin private note added successfully',
      notes: interest.notes,
    });
  } catch (error) {
    console.error('Add Admin Interest Note Error:', error);
    res.status(500).json({ message: 'Error adding admin note' });
  }
};

// @desc    Convert Completed Interest Request into a Success Story Draft
// @route   POST /api/admin/interests/:id/convert-success-story
// @access  Private/Admin
const convertInterestToSuccessStory = async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id)
      .populate('senderProfile')
      .populate('recipientProfile');

    if (!interest) {
      return res.status(404).json({ message: 'Interest request not found' });
    }

    const senderGender = (interest.senderProfile?.gender || '').toLowerCase();
    const isSenderBride = senderGender === 'bride' || senderGender === 'female';

    const bride = isSenderBride ? interest.senderProfile : interest.recipientProfile;
    const groom = isSenderBride ? interest.recipientProfile : interest.senderProfile;

    const brideName = bride?.fullName || 'Bride';
    const groomName = groom?.fullName || 'Groom';
    const coupleTitle = `${brideName} & ${groomName}`;

    const story = await SuccessStory.create({
      groomName,
      brideName,
      groomId: groom?._id ? `SSM${groom._id.toString().slice(-6).toUpperCase()}` : 'SSM-GROOM',
      brideId: bride?._id ? `SSM${bride._id.toString().slice(-6).toUpperCase()}` : 'SSM-BRIDE',
      title: `${coupleTitle} - Happy Wedding Story`,
      story: `We are delighted to announce the union of ${brideName} and ${groomName}, who connected through SS Matrimony relationship management service.`,
      weddingDate: req.body.weddingDate || new Date(),
      city: bride?.city || groom?.city || 'Hyderabad',
      photoUrl: bride?.photos?.[0] || groom?.photos?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      status: 'Draft',
      isFeatured: false,
    });

    await logAdminAction(req.user._id, 'CONVERT_SUCCESS_STORY', `Converted interest ${interest.interestId} into Success Story ID ${story._id}`);

    res.status(201).json({
      message: `Success story draft created for ${coupleTitle}!`,
      story,
    });
  } catch (error) {
    console.error('Convert Success Story Error:', error);
    res.status(500).json({ message: 'Error converting interest to success story' });
  }
};

module.exports = {
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

  // Interest Management Module exports
  getAdminInterests,
  getAdminInterestById,
  updateAdminInterestStatus,
  addAdminInterestNote,
  convertInterestToSuccessStory,
};
