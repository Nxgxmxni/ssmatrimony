const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema(
  {
    coupleNames: {
      type: String,
      required: true,
    },
    weddingDate: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'India',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SuccessStory', successStorySchema);
