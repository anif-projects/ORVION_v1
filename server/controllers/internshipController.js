const Internship = require('../models/Internship');
const InternshipApplication = require('../models/InternshipApplication');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// Get all internships
const getInternships = asyncHandler(async (req, res) => {
  const internships = await Internship.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { internships },
  });
});

// Get a single internship by ID
const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) {
    throw new AppError('Internship not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: { internship },
  });
});

// Create internship (Admin only)
const createInternship = asyncHandler(async (req, res) => {
  const { title, description, duration, requirements, skills, stipend, location, category } = req.body;

  if (!title || !description) {
    throw new AppError('Title and description are required', 400);
  }

  const internship = await Internship.create({
    title,
    description,
    duration: duration || '3 Months (Remote)',
    requirements: requirements || '',
    skills: skills || '',
    stipend: stipend || 'Unpaid',
    location: location || 'Remote',
    category: category || '',
  });

  res.status(201).json({
    status: 'success',
    message: 'Internship posted successfully!',
    data: { internship },
  });
});

// Update internship (Admin only)
const updateInternship = asyncHandler(async (req, res) => {
  const { title, description, duration, requirements, skills, stipend, location, category } = req.body;

  const internship = await Internship.findByIdAndUpdate(req.params.id, {
    title,
    description,
    duration,
    requirements,
    skills,
    stipend,
    location,
    category,
  });

  if (!internship) {
    throw new AppError('Internship not found', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Internship updated successfully!',
    data: { internship },
  });
});

// Delete internship (Admin only)
const deleteInternship = asyncHandler(async (req, res) => {
  const result = await Internship.findByIdAndDelete(req.params.id);
  if (result.deletedCount === 0) {
    throw new AppError('Internship not found', 404);
  }
  res.status(200).json({
    status: 'success',
    message: 'Internship deleted successfully!',
  });
});

// Apply for an internship (Student)
const applyInternship = asyncHandler(async (req, res) => {
  const { name, email, phone, college, domain, internshipId, resumeLink, statement } = req.body;

  if (!name || !email || !phone || !college || !domain) {
    throw new AppError('Please provide all required fields (name, email, phone, college, domain)', 400);
  }

  const application = await InternshipApplication.create({
    name,
    email,
    phone,
    college,
    domain,
    internshipId: internshipId ? Number(internshipId) : null,
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

// Retrieve all internship applications (Admin only)
const getInternshipApplications = asyncHandler(async (req, res) => {
  const applications = await InternshipApplication.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { applications },
  });
});

// Update application status (Admin only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    throw new AppError('Status is required', 400);
  }

  const application = await InternshipApplication.findByIdAndUpdate(req.params.id, { status });
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Application status updated successfully!',
    data: { application },
  });
});

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  applyInternship,
  getInternshipApplications,
  updateApplicationStatus,
};
