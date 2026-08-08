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

    const query = {
      'privacy.hideFromSearch': { $ne: true }, // Exclude hidden profiles
    };

    let currentUserProfile = null;
    if (req.user) {
      currentUserProfile = await Profile.findOne({ user: req.user._id });
      if (currentUserProfile) {
        // Exclude logged in user profile
        query._id = { $ne: currentUserProfile._id };
        query.user = { $ne: req.user._id };

        // Enforce strict gender matching if not explicitly requested
        const userGender = (currentUserProfile.gender || '').toLowerCase();
        if (userGender === 'bride' || userGender === 'female') {
          query.gender = { $in: ['groom', 'male'] };
        } else if (userGender === 'groom' || userGender === 'male') {
          query.gender = { $in: ['bride', 'female'] };
        }
      }
    }

    // Explicit gender filter override if provided
    if (gender) {
      const gLower = gender.toLowerCase();
      if (gLower === 'bride' || gLower === 'female') {
        query.gender = { $in: ['bride', 'female'] };
      } else if (gLower === 'groom' || gLower === 'male') {
        query.gender = { $in: ['groom', 'male'] };
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

    // Populate user to exclude inactive/suspended users
    const profiles = await Profile.find(query)
      .populate({
        path: 'user',
        select: 'accountStatus role email mobile',
        match: { accountStatus: { $eq: 'active' } },
      })
      .sort(sort === 'newest' ? { createdAt: -1 } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Filter out profiles whose user reference failed match (i.e. suspended or inactive user)
    const validProfiles = profiles.filter((p) => p.user !== null);
    const total = validProfiles.length;

    const profilesWithScore = validProfiles.map((p) => {
      const profileObj = p.toObject();
      if (currentUserProfile) {
        profileObj.matchPercentage = currentUserProfile.calculateMatchPercentage(p);
      } else {
        profileObj.matchPercentage = Math.floor(Math.random() * (98 - 75 + 1)) + 75;
      }
      return profileObj;
    });

    res.json({
      profiles: profilesWithScore,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
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
    const profile = await Profile.findById(req.params.id).populate('user', 'email phone createdAt');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profileObj = profile.toObject();

    // Check if requesting user is connected match or profile owner
    const isOwner = req.user && req.user._id.toString() === profile.user._id.toString();

    // Enforce Privacy Rules:
    if (!isOwner) {
      if (profile.privacy?.hidePhone && profileObj.user) {
        profileObj.user.phone = '🔒 Hidden by Member';
      }
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

    const fieldsToUpdate = req.body;

    if (fieldsToUpdate.dateOfBirth) {
      const dob = new Date(fieldsToUpdate.dateOfBirth);
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      fieldsToUpdate.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    const completeness = profile.calculateCompleteness();
    const profileObj = profile.toObject();
    profileObj.completeness = completeness;

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
    const { wizardStep, draftData } = req.body;
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.wizardStep = wizardStep || profile.wizardStep;
    profile.draftData = { ...profile.draftData, ...draftData };
    await profile.save();

    res.json({
      message: 'Wizard draft auto-saved successfully!',
      wizardStep: profile.wizardStep,
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
    const grooms = await Profile.find({ gender: 'groom', 'privacy.hideFromSearch': { $ne: true } }).limit(4);
    const brides = await Profile.find({ gender: 'bride', 'privacy.hideFromSearch': { $ne: true } }).limit(4);
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
