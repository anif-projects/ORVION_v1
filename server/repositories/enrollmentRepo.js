const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

class EnrollmentRepository {
  async findByStudentAndCourse(studentId, courseId) {
    return await Enrollment.findOne({ student: studentId, course: courseId });
  }

  async createEnrollment(studentId, courseId, paymentId = null) {
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      payment: paymentId,
    });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    return enrollment;
  }

  async getStudentEnrollments(studentId) {
    return await Enrollment.find({ student: studentId })
      .populate({
        path: 'course',
        populate: [
          { path: 'category', select: 'name color' },
          { path: 'instructor', select: 'name avatar' },
        ],
      })
      .sort({ updatedAt: -1 });
  }

  async updateProgress(enrollmentId, progressPercentage, completedLessons) {
    const isCompleted = progressPercentage >= 100;
    return await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        progressPercentage,
        completedLessons,
        status: isCompleted ? 'completed' : 'active',
        ...(isCompleted && { completedAt: new Date() }),
      },
      { new: true }
    );
  }
}

module.exports = new EnrollmentRepository();
