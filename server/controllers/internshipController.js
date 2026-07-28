const InternshipApplication = require('../models/InternshipApplication');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const applyInternship = asyncHandler(async (req, res) => {
  const { name, email, phone, college, domain, resumeLink, statement } = req.body;

  if (!name || !email || !phone || !college || !domain) {
    throw new AppError('Please provide all required fields (name, email, phone, college, domain)', 400);
  }

  const application = await InternshipApplication.create({
    name,
    email,
    phone,
    college,
    domain,
    resumeLink: resumeLink || '',
    statement: statement || '',
    status: 'applied',
  });

  res.status(201).json({
    status: 'success',
    message: 'Internship application submitted successfully!',
    data: { application },
  });
});

const getInternshipApplications = asyncHandler(async (req, res) => {
  const applications = await InternshipApplication.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

module.exports = {
  applyInternship,
  getInternshipApplications,
};
