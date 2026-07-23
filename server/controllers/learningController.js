const enrollmentRepo = require('../repositories/enrollmentRepo');
const LessonProgress = require('../models/LessonProgress');
const Lesson = require('../models/Lesson');
const videoService = require('../services/videoService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentRepo.getStudentEnrollments(req.user._id);
  res.status(200).json({ status: 'success', data: { enrollments } });
});

const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;
  const studentId = req.user._id;

  let progress = await LessonProgress.findOne({ student: studentId, lesson: lessonId });
  if (!progress) {
    progress = await LessonProgress.create({
      student: studentId,
      lesson: lessonId,
      course: courseId,
      isCompleted: true,
      lastWatchedAt: new Date(),
    });
  } else {
    progress.isCompleted = true;
    progress.lastWatchedAt = new Date();
    await progress.save();
  }

  // Update enrollment summary
  const enrollment = await enrollmentRepo.findByStudentAndCourse(studentId, courseId);
  if (enrollment) {
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    const totalCourseLessons = await Lesson.countDocuments({ course: courseId });
    const percent = Math.min(100, Math.round((enrollment.completedLessons.length / Math.max(1, totalCourseLessons)) * 100));
    await enrollmentRepo.updateProgress(enrollment._id, percent, enrollment.completedLessons);
  }

  res.status(200).json({ status: 'success', data: { progress } });
});

const getStreamUrl = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) throw new AppError('Lesson not found', 404);

  // Check enrollment if not preview
  if (!lesson.isPreview) {
    const enrollment = await enrollmentRepo.findByStudentAndCourse(req.user._id, lesson.course);
    if (!enrollment && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      throw new AppError('You are not enrolled in this course', 403);
    }
  }

  const streamUrl = videoService.generateSecureStreamUrl(lesson.videoUrl);
  res.status(200).json({ status: 'success', data: { streamUrl, lesson } });
});

module.exports = {
  getMyEnrollments,
  markLessonComplete,
  getStreamUrl,
};
