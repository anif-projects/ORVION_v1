const mongoose = require('../config/mongoose-mysql');

const contactMessageSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide your full name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.']
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number.']
  },
  college: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  branch: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
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

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
