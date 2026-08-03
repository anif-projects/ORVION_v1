const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// Create a new contact message
const createContactMessage = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, college, year, branch, address, message } = req.body;

  if (!fullName || !email || !mobile) {
    throw new AppError('Full name, email, and mobile number are required.', 400);
  }

  const contactMessage = await ContactMessage.create({
    fullName,
    email,
    mobile,
    college: college || '',
    year: year || '',
    branch: branch || '',
    address: address || '',
    message: message || ''
  });

  res.status(201).json({
    status: 'success',
    message: 'Your message has been received successfully!',
    data: { contactMessage }
  });
});

// Retrieve all contact messages (Admin only)
const getContactMessages = asyncHandler(async (req, res) => {
  const contactMessages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { contactMessages }
  });
});

// Delete a contact message (Admin only)
const deleteContactMessage = asyncHandler(async (req, res) => {
  const result = await ContactMessage.findByIdAndDelete(req.params.id);
  if (result.deletedCount === 0) {
    throw new AppError('Contact message not found.', 404);
  }
  res.status(200).json({
    status: 'success',
    message: 'Message deleted successfully.'
  });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  deleteContactMessage
};
