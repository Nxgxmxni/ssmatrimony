const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Get & Filter Profiles with Pagination & Match Calculation
// @route   GET /api/profiles
// @access  Public / Optional Auth
const getProfiles = async (req, res) => {
  try {
    const {
      gender,
      minAge,
      maxAge,
      religion,
      caste,
      motherTongue,
      maritalStatus,
      highestEducation,
      city,
      state,
      search,
      verifiedOnly,
      isVerified,
      nearLocation,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    // Find all admin user IDs to exclude admin profiles from matchmaking
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map((u) => u._id);

    const query = {
      'privacy.hideFromSearch': { $ne: true }, // Exclude hidden profiles
      status: { $in: ['Approved', undefined, null] }, // Only Approved profiles are visible
    };

    if (adminUserIds.length > 0) {
      query.user = { $nin: adminUserIds };
    }

    let currentUserProfile = null;
    if (req.user) {
      currentUserProfile = await Profile.findOne({ user: req.user._id });
      if (currentUserProfile) {
        // Exclude logged in user profile
        if (query.user && query.user.$nin) {
          query.user.$nin.push(req.user._id);
        } else {
          query.user = { $ne: req.user._id };
        }
        query._id = { $ne: currentUserProfile._id };

        // Enforce strict gender matching if not explicitly requested
        const userGender = (currentUserProfile.gender || '').toLowerCase();
        if (userGender === 'bride' || userGender === 'female') {
          query.gender = { $in: ['groom', 'male', 'Groom', 'Male'] };
        } else if (userGender === 'groom' || userGender === 'male') {
          query.gender = { $in: ['bride', 'female', 'Bride', 'Female'] };
        }
      }
    }

    // Explicit gender filter override if provided
    if (gender) {
      const gLower = gender.toLowerCase();
      if (gLower === 'bride' || gLower === 'female') {
        query.gender = { $in: ['bride', 'female', 'Bride', 'Female'] };
      } else if (gLower === 'groom' || gLower === 'male') {
        query.gender = { $in: ['groom', 'male', 'Groom', 'Male'] };
      }
    }

    if (religion && religion !== 'All') query.religion = religion;
    if (caste && caste !== 'All') query.caste = { $regex: caste, $options: 'i' };
    if (motherTongue && motherTongue !== 'All') query.motherTongue = motherTongue;
    if (maritalStatus && maritalStatus !== 'All') query.maritalStatus = maritalStatus;
    if (highestEducation && highestEducation !== 'All') {
      query.highestEducation = { $regex: highestEducation, $options: 'i' };
    }
    if (city && city !== 'All') query.city = { $regex: city, $options: 'i' };
    if (state && state !== 'All') query.state = { $regex: state, $options: 'i' };

    // Near Location filter
    if (nearLocation === 'true' && currentUserProfile && (currentUserProfile.city || currentUserProfile.state)) {
      const locConditions = [];
      if (currentUserProfile.city) {
        locConditions.push({ city: { $regex: currentUserProfile.city, $options: 'i' } });
      }
      if (currentUserProfile.state) {
        locConditions.push({ state: { $regex: currentUserProfile.state, $options: 'i' } });
      }
      if (locConditions.length > 0) {
        query.$or = locConditions;
      }
    }

    // Verified profiles only filter
    if (verifiedOnly === 'true' || isVerified === 'true') {
      query.$or = [
        { isVerified: true },
        { idVerificationStatus: 'Verified' }
      ];
    }

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchQuery = [
        { fullName: searchRegex },
        { occupation: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { religion: searchRegex },
        { caste: searchRegex },
        { highestEducation: searchRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchQuery }];
        delete query.$or;
      } else {
        query.$or = searchQuery;
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Fetch matching profiles populated with user
    const rawProfiles = await Profile.find(query)
      .populate({
        path: 'user',
        select: 'accountStatus role email mobile',
      })
      .sort(sort === 'newest' ? { createdAt: -1 } : { createdAt: -1 });

    // Exclude profiles belonging to admins or inactive users
    const validProfiles = rawProfiles.filter((p) => {
      if (p.user) {
        if (p.user.role === 'admin') return false;
        if (p.user.accountStatus !== 'active') return false;
      }
      return true;
    });

    const totalCount = validProfiles.length;
    const paginatedProfiles = validProfiles.slice(skip, skip + limitNum);

    const profilesWithScore = paginatedProfiles.map((p) => {
      const profileObj = p.toObject();
      if (!profileObj.customId) {
        profileObj.customId = `SSM${p._id.toString().slice(-6).toUpperCase()}`;
      }

      if (currentUserProfile) {
        profileObj.matchPercentage = currentUserProfile.calculateMatchPercentage(p);
      } else {
        profileObj.matchPercentage = 85;
      }
      
      // Strict Phone & Contact Privacy: Remove admin-only contact info for non-admins
      if (req.user?.role !== 'admin') {
        delete profileObj.contactPhone;
        delete profileObj.contactAltPhone;
        delete profileObj.contactEmail;
        delete profileObj.contactAddress;
        if (profileObj.user) {
          delete profileObj.user.mobile;
          delete profileObj.user.phone;
          delete profileObj.user.phoneNumber;
        }
      }
      return profileObj;
    });

    res.json({
      profiles: profilesWithScore,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Get Profiles Error:', error);
    res.status(500).json({ message: 'Error retrieving profiles' });
  }
};

// @desc    Get single profile details by ID (with Privacy Filters)
// @route   GET /api/profiles/:id
// @access  Public / Optional Auth
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate('user', 'email mobile phone createdAt role');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profileObj = profile.toObject();

    // Check if requesting user is profile owner or admin
    const isOwner = req.user && profile.user && req.user._id.toString() === profile.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    // Check if contact details have been explicitly shared by Admin for this match
    let isContactSharedByAdmin = false;
    if (req.user && !isOwner && !isAdmin && profile.user) {
      const Interest = require('../models/Interest');
      const sharedInterest = await Interest.findOne({
        $or: [
          { sender: req.user._id, recipient: profile.user._id, status: { $in: ['contact_shared', 'closed'] } },
          { sender: profile.user._id, recipient: req.user._id, status: { $in: ['contact_shared', 'closed'] } },
        ],
      });
      if (sharedInterest && sharedInterest.contactSharedAt) {
        isContactSharedByAdmin = true;
      }
    }

    // Check profile approval status for non-admins
    if (!isAdmin && profileObj.status && profileObj.status !== 'Approved') {
      return res.status(404).json({ message: 'Profile not found or pending review' });
    }

    // Enforce Strict Phone & Contact Privacy Rules:
    if (!isAdmin && !isOwner && !isContactSharedByAdmin) {
      delete profileObj.contactPhone;
      delete profileObj.contactAltPhone;
      delete profileObj.contactEmail;
      delete profileObj.contactAddress;
      if (profileObj.user) {
        delete profileObj.user.mobile;
        delete profileObj.user.phone;
        delete profileObj.user.phoneNumber;
        profileObj.user.email = '🔒 Hidden until Admin approves family contact';
      }
    } else if (isOwner && profileObj.user?.mobile) {
      // Mask mobile for owner view (e.g. 98XXXX3210)
      const digits = profileObj.user.mobile.replace(/\D/g, '');
      if (digits.length >= 10) {
        profileObj.user.maskedMobile = `${digits.slice(0, 2)}XXXX${digits.slice(-4)}`;
      }
    }

    if (!isAdmin && !isOwner && !isContactSharedByAdmin) {
      if (profile.privacy?.hideEmail && profileObj.user) {
        profileObj.user.email = '🔒 Hidden by Member';
      }
      if (profile.privacy?.photoPrivacy === 'ConnectedOnly') {
        profileObj.photos = ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'];
      }
    }

    if (req.user) {
      const currentUserProfile = await Profile.findOne({ user: req.user._id });
      if (currentUserProfile) {
        profileObj.matchPercentage = currentUserProfile.calculateMatchPercentage(profile);
        profileObj.isShortlisted = currentUserProfile.shortlist.includes(profile._id);
      }
    } else {
      profileObj.matchPercentage = 88;
      profileObj.isShortlisted = false;
    }

    // Attach completeness score
    profileObj.completeness = profile.calculateCompleteness();

    res.json(profileObj);
  } catch (error) {
    console.error('Get Profile By ID Error:', error);
    res.status(500).json({ message: 'Error fetching profile details' });
  }
};

// @desc    Update current logged-in user profile
// @route   PUT /api/profiles/my-profile
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }

    const fieldsToUpdate = { ...req.body };

    if (fieldsToUpdate.dateOfBirth) {
      const dob = new Date(fieldsToUpdate.dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      fieldsToUpdate.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    if (fieldsToUpdate.wizardStep) {
      const currentStep = Number(fieldsToUpdate.wizardStep);
      fieldsToUpdate.wizardStep = currentStep;
      fieldsToUpdate.lastCompletedStep = Math.max(profile.lastCompletedStep || 0, currentStep - 1);
      if (currentStep >= 5) {
        fieldsToUpdate.isWizardCompleted = true;
        fieldsToUpdate.lastCompletedStep = 5;
      }
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    const completeness = profile.calculateCompleteness();
    const profileObj = profile.toObject();
    profileObj.completeness = completeness;
    profileObj.profileCompleted = profile.isWizardCompleted || completeness.score >= 90;

    res.json(profileObj);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// @desc    Save step wizard draft
// @route   POST /api/profiles/draft
// @access  Private
const saveWizardDraft = async (req, res) => {
  try {
    const { wizardStep, draftData, isWizardCompleted } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (wizardStep) {
      const stepNum = Number(wizardStep);
      profile.wizardStep = stepNum;
      profile.lastCompletedStep = Math.max(profile.lastCompletedStep || 0, stepNum - 1);
      if (stepNum >= 5 || isWizardCompleted) {
        profile.isWizardCompleted = true;
        profile.lastCompletedStep = 5;
      }
    }

    if (draftData) {
      profile.draftData = { ...profile.draftData, ...draftData };
    }

    await profile.save();

    res.json({
      message: 'Wizard draft saved successfully!',
      wizardStep: profile.wizardStep,
      lastCompletedStep: profile.lastCompletedStep,
      isWizardCompleted: profile.isWizardCompleted,
      draftData: profile.draftData,
    });
  } catch (error) {
    console.error('Save Draft Error:', error);
    res.status(500).json({ message: 'Error saving draft' });
  }
};

// @desc    Upload Gallery Photo
// @route   POST /api/profiles/upload-photo
// @access  Private
const uploadPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ message: 'Please provide a valid photo URL or image payload' });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.photos.push(photoUrl);
    await profile.save();

    res.status(201).json({
      message: 'Photo added to gallery successfully!',
      photos: profile.photos,
    });
  } catch (error) {
    console.error('Upload Photo Error:', error);
    res.status(500).json({ message: 'Error uploading photo' });
  }
};

// @desc    Set Primary Profile Picture
// @route   PUT /api/profiles/primary-photo
// @access  Private
const setPrimaryPhoto = async (req, res) => {
  try {
    const { photoIndex } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (photoIndex < 0 || photoIndex >= profile.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    const selectedPhoto = profile.photos.splice(photoIndex, 1)[0];
    profile.photos.unshift(selectedPhoto); // Move to index 0
    await profile.save();

    res.json({
      message: 'Primary profile picture updated successfully!',
      photos: profile.photos,
    });
  } catch (error) {
    console.error('Set Primary Photo Error:', error);
    res.status(500).json({ message: 'Error updating primary photo' });
  }
};

// @desc    Delete Photo from Gallery
// @route   DELETE /api/profiles/photo/:index
// @access  Private
const deletePhoto = async (req, res) => {
  try {
    const index = parseInt(req.params.index, 10);
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (index < 0 || index >= profile.photos.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }

    profile.photos.splice(index, 1);
    await profile.save();

    res.json({
      message: 'Photo deleted from gallery',
      photos: profile.photos,
    });
  } catch (error) {
    console.error('Delete Photo Error:', error);
    res.status(500).json({ message: 'Error deleting photo' });
  }
};

// @desc    Upload Govt ID Document for Verification
// @route   POST /api/profiles/upload-id
// @access  Private
const uploadIdDocument = async (req, res) => {
  try {
    const { idDocumentUrl } = req.body;

    if (!idDocumentUrl) {
      return res.status(400).json({ message: 'Please provide ID document URL or image' });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.idDocumentUrl = idDocumentUrl;
    profile.idVerificationStatus = 'Pending';
    await profile.save();

    res.json({
      message: 'ID Document submitted for verification! Admin review in progress.',
      idVerificationStatus: profile.idVerificationStatus,
      idDocumentUrl: profile.idDocumentUrl,
    });
  } catch (error) {
    console.error('Upload ID Error:', error);
    res.status(500).json({ message: 'Error uploading verification document' });
  }
};

// @desc    Update Privacy Settings
// @route   PUT /api/profiles/privacy
// @access  Private
const updatePrivacySettings = async (req, res) => {
  try {
    const { hidePhone, hideEmail, hideFromSearch, photoPrivacy } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.privacy = {
      hidePhone: hidePhone !== undefined ? hidePhone : profile.privacy.hidePhone,
      hideEmail: hideEmail !== undefined ? hideEmail : profile.privacy.hideEmail,
      hideFromSearch: hideFromSearch !== undefined ? hideFromSearch : profile.privacy.hideFromSearch,
      photoPrivacy: photoPrivacy || profile.privacy.photoPrivacy,
    };

    await profile.save();

    res.json({
      message: 'Privacy settings updated successfully!',
      privacy: profile.privacy,
    });
  } catch (error) {
    console.error('Update Privacy Error:', error);
    res.status(500).json({ message: 'Error updating privacy settings' });
  }
};

// @desc    Toggle Shortlist
// @route   POST /api/profiles/shortlist/:id
// @access  Private
const toggleShortlist = async (req, res) => {
  try {
    const targetProfileId = req.params.id;
    const userProfile = await Profile.findOne({ user: req.user._id });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const isAlreadyShortlisted = userProfile.shortlist.includes(targetProfileId);

    if (isAlreadyShortlisted) {
      userProfile.shortlist = userProfile.shortlist.filter(
        (id) => id.toString() !== targetProfileId
      );
    } else {
      userProfile.shortlist.push(targetProfileId);
    }

    await userProfile.save();

    res.json({
      message: isAlreadyShortlisted
        ? 'Removed from shortlist'
        : 'Added to shortlist',
      isShortlisted: !isAlreadyShortlisted,
      shortlistCount: userProfile.shortlist.length,
    });
  } catch (error) {
    console.error('Shortlist Toggle Error:', error);
    res.status(500).json({ message: 'Error updating shortlist' });
  }
};

// @desc    Get Featured Profiles
// @route   GET /api/profiles/featured
// @access  Public
const getFeaturedProfiles = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map((u) => u._id);

    const baseQuery = {
      'privacy.hideFromSearch': { $ne: true },
      status: { $in: ['Approved', undefined, null] },
      user: { $nin: adminUserIds },
    };

    const grooms = await Profile.find({ ...baseQuery, gender: { $in: ['groom', 'male', 'Groom', 'Male'] } }).limit(4);
    const brides = await Profile.find({ ...baseQuery, gender: { $in: ['bride', 'female', 'Bride', 'Female'] } }).limit(4);
    res.json({ grooms, brides });
  } catch (error) {
    console.error('Featured Profiles Error:', error);
    res.status(500).json({ message: 'Error fetching featured profiles' });
  }
};

module.exports = {
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
};
