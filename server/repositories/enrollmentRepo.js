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
    const LessonProgress = require('../models/LessonProgress');
    const enrollments = await Enrollment.find({ studentId }).populate('courseId');
    
    const results = [];
    for (const e of enrollments) {
      const obj = e.toObject();
      obj.course = obj.courseId; // Map courseId to course for frontend compatibility
      
      let totalLessons = 0;
      let completedCount = 0;

      if (obj.course) {
        if (obj.course.modules && Array.isArray(obj.course.modules)) {
          obj.course.modules.forEach(mod => {
            if (mod.lessons && Array.isArray(mod.lessons)) {
              totalLessons += mod.lessons.length;
            }
          });
        }
        
        completedCount = await LessonProgress.countDocuments({
          student: studentId,
          course: obj.course.id || obj.course._id,
          isCompleted: true
        });
      }
      
      obj.progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
      results.push(obj);
    }
    
    return results;
  }
}

module.exports = new EnrollmentRepository();
