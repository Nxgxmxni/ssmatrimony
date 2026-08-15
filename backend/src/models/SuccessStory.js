const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
    },
    brideName: {
      type: String,
      trim: true,
      default: '',
    },
    groomName: {
      type: String,
      trim: true,
      default: '',
    },
    coupleNames: {
      type: String,
      required: [true, 'Couple names are required'],
      trim: true,
    },
    weddingDate: {
      type: String,
      required: [true, 'Wedding date is required'],
      trim: true,
    },
    location: {
      type: String,
      default: 'Hyderabad, Telangana',
      trim: true,
    },
    city: {
      type: String,
      default: 'Hyderabad',
      trim: true,
    },
    state: {
      type: String,
      default: 'Telangana',
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Story description / testimonial is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Published', 'Draft'],
      default: 'Published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'System Admin',
    },
    updatedBy: {
      type: String,
      default: '',
    },
    publishedBy: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
