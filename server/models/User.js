const mongoose = require('../config/mongoose-mysql');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    study_mon: { type: Number, default: 0 },
    study_tue: { type: Number, default: 0 },
    study_wed: { type: Number, default: 0 },
    study_thu: { type: Number, default: 0 },
    study_fri: { type: Number, default: 0 },
    study_sat: { type: Number, default: 0 },
    study_sun: { type: Number, default: 0 },
    study_week_start: { type: String, default: '' },
    token_version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
