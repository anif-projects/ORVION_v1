const userRepo = require('../repositories/userRepo');
const OTP = require('../models/OTP');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');
const AppError = require('../utils/appError');
const emailService = require('./emailService');

class AuthService {
  async register({ name, email, password, role }) {
    let user = await userRepo.findByEmail(email);

    if (user) {
      if (user.isVerified) {
        throw new AppError('Email address is already registered. Please log in.', 400);
      }
      // If user exists but is not verified, update name & password
      if (name) user.name = name;
      if (password) user.password = password;
      await user.save();
    } else {
      user = await userRepo.create({ name, email, password, role });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email }); // Clear previous OTPs for this email
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });

    // Send Email (Non-blocking fallback)
    emailService.sendOTP(email, otpCode).catch((err) => console.error(err));

    return {
      user: { id: user._id, name: user.name, email: user.email },
      otpCode,
      message: `OTP verification code sent to ${email}.`,
    };
  }

  async verifyOTP(email, otpCode) {
    // Allow master dev code 123456 or exact matching OTP record
    let isMasterCode = otpCode === '123456';
    let record = null;

    if (!isMasterCode) {
      record = await OTP.findOne({ email, otp: otpCode });
      if (!record) {
        throw new AppError('Invalid or expired OTP code', 400);
      }
    }

    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('User not found', 404);

    user.isVerified = true;
    await user.save();

    if (record) {
      await OTP.deleteOne({ _id: record._id });
    }

    return { message: 'Email verified successfully. You can now login.' };
  }

  async login(email, password) {
    const user = await userRepo.findByEmail(email, true);
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    if (user.status === 'blocked') throw new AppError('Account is blocked. Contact support.', 403);

    user.lastLogin = new Date();
    await user.save();

    const payload = { id: user._id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, accessToken, refreshToken };
  }
}

module.exports = new AuthService();
