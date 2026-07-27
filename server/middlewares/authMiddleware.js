const { verifyAccessToken } = require('../utils/jwtUtils');
const User = require('../models/User');
const Admin = require('../models/Admin');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    let currentUser;

    if (decoded.role === 'admin' || decoded.role === 'super_admin') {
      const doc = await Admin.findById(decoded.id);
      if (doc) {
        currentUser = doc.toObject();
        currentUser.role = 'admin';
      }
    } else {
      const doc = await User.findById(decoded.id);
      if (doc) {
        currentUser = doc.toObject();
        currentUser.role = 'student';
      }
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token.', 401));
  }
});

module.exports = { protect };
