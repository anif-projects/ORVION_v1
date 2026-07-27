const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');
const AppError = require('../utils/appError');
const emailService = require('./emailService');

class AuthService {
  async register({ name, email, password }) {
    let student = await User.findOne({ email });

    if (student) {
      if (student.isVerified) {
        throw new AppError('Email address is already registered. Please log in.', 400);
      }
      // If student exists but is not verified, update name & password
      if (name) student.name = name;
      if (password) student.password = password;
    } else {
      student = new User({ name, email, password });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = otpCode;
    student.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiration
    student.isVerified = false; // Reset to false just in case

    await student.save();

    // Send Email (Non-blocking fallback)
    emailService.sendOTP(email, otpCode).catch((err) => console.error(err));

    return {
      user: { id: student.id, name: student.name, email: student.email },
      otpCode,
      message: `OTP verification code sent to ${email}.`,
    };
  }

  async verifyOTP(email, otpCode) {
    // Allow master dev code 123456 or exact matching OTP record
    let isMasterCode = otpCode === '123456';
    const student = await User.findOne({ email });
    if (!student) throw new AppError('Student not found', 404);

    if (!isMasterCode) {
      if (student.otp !== otpCode || !student.otpExpiresAt || new Date() > new Date(student.otpExpiresAt)) {
        throw new AppError('Invalid or expired OTP code', 400);
      }
    }

    student.isVerified = true;
    student.otp = null;
    student.otpExpiresAt = null;
    await student.save();

    return { message: 'Email verified successfully. You can now login.' };
  }

  async login(email, password) {
    const student = await User.findOne({ email }).select('+password');
    if (!student) throw new AppError('Invalid email or password', 401);

    const isMatch = await student.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    if (!student.isVerified) {
      throw new AppError('Your email is not verified. Please register or verify via OTP.', 401);
    }

    const payload = { id: student.id, role: 'student', email: student.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const studentObj = student.toObject();
    delete studentObj.password;
    studentObj.role = 'student';

    return { user: studentObj, accessToken, refreshToken };
  }

  async adminLogin(email, password) {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) throw new AppError('Invalid email or password', 401);

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const payload = { id: admin.id, role: 'admin', email: admin.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const adminObj = admin.toObject();
    delete adminObj.password;
    adminObj.role = 'admin';

    return { user: adminObj, accessToken, refreshToken };
  }
}

module.exports = new AuthService();
