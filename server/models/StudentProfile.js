const mongoose = require('../config/mongoose-mysql');

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
    },
    learningStreak: { type: Number, default: 0 },
    lastActiveDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
