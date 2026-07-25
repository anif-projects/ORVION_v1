const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

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

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.adminLogin(email, password);
  res.status(200).json({ status: 'success', data: result });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});

const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    }
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone } = req.body;
  
  const student = await User.findById(userId);
  if (!student) {
    return res.status(404).json({ status: 'fail', message: 'Student not found' });
  }
  
  student.name = name;
  student.phone = phone || '';
  await student.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      name: student.name,
      phone: student.phone,
    }
  });
});

module.exports = {
  register,
  verifyOTP,
  login,
  adminLogin,
  getMe,
  getProfile,
  updateProfile,
};
