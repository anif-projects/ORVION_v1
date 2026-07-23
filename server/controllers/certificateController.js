const certificateService = require('../services/certificateService');
const Certificate = require('../models/Certificate');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const claimCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const certificate = await certificateService.generateCertificate(req.user._id, courseId);
  res.status(201).json({ status: 'success', data: { certificate } });
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { hash } = req.params;
  const certificate = await Certificate.findOne({ certificateHash: hash })
    .populate('student', 'name email')
    .populate('course', 'title totalDuration');

  if (!certificate) throw new AppError('Invalid certificate verification link or hash', 404);

  res.status(200).json({ status: 'success', data: { certificate } });
});

module.exports = { claimCertificate, verifyCertificate };
