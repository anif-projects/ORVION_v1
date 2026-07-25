const Enrollment = require('../models/Enrollment');

class EnrollmentRepository {
  async findByStudentAndCourse(studentId, courseId) {
    return await Enrollment.findOne({ studentId, courseId });
  }

  async createEnrollment(studentId, courseId) {
    // Check if already enrolled to prevent unique key constraint error
    const exists = await this.findByStudentAndCourse(studentId, courseId);
    if (exists) return exists;

    return await Enrollment.create({
      studentId,
      courseId,
    });
  }

  async getStudentEnrollments(studentId) {
    const enrollments = await Enrollment.find({ studentId }).populate('courseId');
    return enrollments.map(e => {
      const obj = e.toObject();
      obj.course = obj.courseId; // Map courseId to course for frontend compatibility
      return obj;
    });
  }
}

module.exports = new EnrollmentRepository();
