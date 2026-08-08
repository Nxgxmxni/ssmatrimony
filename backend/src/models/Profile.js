const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['bride', 'groom', ''],
      default: '',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    heightCm: {
      type: Number,
      default: null,
    },
    weightKg: {
      type: Number,
      default: null,
    },
    bloodGroup: {
      type: String,
      default: '',
    },
    disability: {
      type: String,
      default: '',
    },
    motherTongue: {
      type: String,
      default: '',
    },
    maritalStatus: {
      type: String,
      default: '',
    },
    religion: {
      type: String,
      default: '',
    },
    caste: {
      type: String,
      default: '',
    },
    subCaste: {
      type: String,
      default: '',
    },
    gothram: {
      type: String,
      default: '',
    },
    highestEducation: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    annualIncome: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    // Family Details
    fatherName: { type: String, default: '' },
    fatherOccupation: { type: String, default: '' },
    motherName: { type: String, default: '' },
    motherOccupation: { type: String, default: '' },
    brothersCount: { type: Number, default: 0 },
    sistersCount: { type: Number, default: 0 },
    familyType: {
      type: String,
      default: '',
    },
    familyStatus: {
      type: String,
      default: '',
    },
    familyValues: {
      type: String,
      default: '',
    },
    siblings: {
      type: String,
      default: '',
    },
    // Lifestyle & Habits
    foodPreference: {
      type: String,
      default: '',
    },
    smoking: {
      type: String,
      default: '',
    },
    drinking: {
      type: String,
      default: '',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    // Horoscope / Astro Details
    rashi: { type: String, default: '' },
    nakshatram: { type: String, default: '' },
    manglikStatus: {
      type: String,
      default: '',
    },
    aboutMe: {
      type: String,
      default: '',
    },
    partnerExpectations: {
      minAge: { type: Number, default: null },
      maxAge: { type: Number, default: null },
      preferredMinHeightCm: { type: Number, default: null },
      preferredMaxHeightCm: { type: Number, default: null },
      religion: { type: String, default: '' },
      preferredCaste: { type: String, default: '' },
      maritalStatus: { type: String, default: '' },
      education: { type: String, default: '' },
      preferredOccupation: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    photos: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    idDocumentUrl: {
      type: String,
      default: '',
    },
    idVerificationStatus: {
      type: String,
      enum: ['Unverified', 'Pending', 'Verified', 'Rejected'],
      default: 'Unverified',
    },
    privacy: {
      hidePhone: { type: Boolean, default: false },
      hideEmail: { type: Boolean, default: false },
      hideFromSearch: { type: Boolean, default: false },
      photoPrivacy: {
        type: String,
        enum: ['Public', 'ConnectedOnly'],
        default: 'Public',
      },
    },
    wizardStep: {
      type: Number,
      default: 1,
    },
    isWizardCompleted: {
      type: Boolean,
      default: false,
    },
    draftData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    shortlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method: Calculate Completeness Score & Missing Fields
profileSchema.methods.calculateCompleteness = function () {
  const fields = [
    { name: 'Full Name', value: this.fullName, weight: 10 },
    { name: 'Gender & DOB', value: this.dateOfBirth, weight: 10 },
    { name: 'City & Location', value: this.city, weight: 10 },
    { name: 'Religion & Caste', value: this.religion && this.caste, weight: 10 },
    { name: 'Highest Education', value: this.highestEducation, weight: 10 },
    { name: 'Occupation & Income', value: this.occupation, weight: 10 },
    { name: 'About Myself', value: this.aboutMe && this.aboutMe.length > 20, weight: 10 },
    { name: 'Profile Photo', value: this.photos && this.photos.length > 0, weight: 15 },
    { name: 'Family Details', value: this.fatherOccupation || this.motherOccupation, weight: 10 },
    { name: 'Horoscope Details', value: this.rashi || this.nakshatram || this.gothram, weight: 5 },
  ];

  let score = 0;
  const missingFields = [];

  fields.forEach((f) => {
    if (f.value) {
      score += f.weight;
    } else {
      missingFields.push(f.name);
    }
  });

  return {
    score: Math.min(score, 100),
    missingFields,
  };
};

// Calculate exact match percentage with another target profile
profileSchema.methods.calculateMatchPercentage = function (targetProfile) {
  let score = 0;
  let totalCriteria = 5;

  if (this.gender !== targetProfile.gender) {
    score += 1;
  }

  const exp = this.partnerExpectations || {};
  if (
    targetProfile.age >= (exp.minAge || 18) &&
    targetProfile.age <= (exp.maxAge || 60)
  ) {
    score += 1;
  }

  if (exp.religion === 'Any' || this.religion === targetProfile.religion) {
    score += 1;
  }

  if (
    exp.maritalStatus === 'Any' ||
    this.maritalStatus === targetProfile.maritalStatus
  ) {
    score += 1;
  }

  if (
    exp.education === 'Any' ||
    targetProfile.highestEducation.toLowerCase().includes(exp.education.toLowerCase())
  ) {
    score += 1;
  }

  return Math.min(Math.round((score / totalCriteria) * 100), 98);
};

module.exports = mongoose.model('Profile', profileSchema);
