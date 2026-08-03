const mongoose = require('../config/mongoose-mysql');

const galleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide the image URL or base64 data.']
  },
  isHero: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
