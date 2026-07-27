const enrollmentRepo = require('../repositories/enrollmentRepo');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const checkout = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;

  const exists = await enrollmentRepo.findByStudentAndCourse(studentId, courseId);
  if (exists) {
    throw new AppError('You are already enrolled in this course.', 400);
  }

  const enrollment = await enrollmentRepo.createEnrollment(studentId, courseId);
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Enrolled in course successfully!',
      enrollment,
    }
  });
});

const getHistory = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: [] });
});

module.exports = { checkout, getHistory };
