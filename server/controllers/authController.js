const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ status: 'success', data: result });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP(email, otp);
  res.status(200).json({ status: 'success', data: result });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({ status: 'success', data: result });
});

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  let profile = await StudentProfile.findOne({ user: userId });
  if (!profile && req.user.role === 'student') {
    profile = await StudentProfile.create({ user: userId, phone: '', socials: {} });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      name: req.user.name,
      email: req.user.email,
      phone: profile ? profile.phone : '',
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, phone } = req.body;
  
  const user = await User.findById(userId);
  if (user) {
    user.name = name;
    await user.save();
  }
  
  let profile = await StudentProfile.findOne({ user: userId });
  if (!profile) {
    profile = new StudentProfile({ user: userId });
  }
  profile.phone = phone || '';
  await profile.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      name,
      phone,
    }
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  getMe,
  getProfile,
  updateProfile,
};

