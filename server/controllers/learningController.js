const enrollmentRepo = require('../repositories/enrollmentRepo');
const asyncHandler = require('../utils/asyncHandler');

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentRepo.getStudentEnrollments(req.user.id);
  res.status(200).json({ status: 'success', data: { enrollments } });
});

module.exports = {
  getMyEnrollments,
};
