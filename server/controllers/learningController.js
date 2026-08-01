const enrollmentRepo = require('../repositories/enrollmentRepo');
const LessonProgress = require('../models/LessonProgress');
const asyncHandler = require('../utils/asyncHandler');

const Course = require('../models/Course');
const AppError = require('../utils/appError');

const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await enrollmentRepo.getStudentEnrollments(req.user.id);
  res.status(200).json({ status: 'success', data: { enrollments } });
});

const completeLesson = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;
  const studentId = req.user.id;

  let progress = await LessonProgress.findOne({ student: studentId, course: courseId, lesson: lessonId });
  if (!progress) {
    progress = await LessonProgress.create({
      student: studentId,
      course: courseId,
      lesson: lessonId,
      isCompleted: true,
    });
  } else {
    progress.isCompleted = true;
    await progress.save();
  }

  res.status(200).json({ status: 'success', data: { progress } });
});

const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  const progressList = await LessonProgress.find({ student: studentId, course: courseId, isCompleted: true });
  const completedLessonIds = progressList.map(p => p.lesson);

  res.status(200).json({ status: 'success', data: { completedLessonIds } });
});

const streamVideo = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  // Find the course that contains this lessonId in its modules JSON
  const courses = await Course.find({});
  let matchingLesson = null;

  for (const c of courses) {
    const modules = typeof c.modules === 'string' ? JSON.parse(c.modules) : c.modules;
    if (modules && Array.isArray(modules)) {
      for (const mod of modules) {
        if (mod.lessons && Array.isArray(mod.lessons)) {
          // Map fallback IDs for legacy lessons to ensure they match client requests
          mod.lessons.forEach((les, idx) => {
            if (!les._id) {
              les._id = `les-fallback-${mod.order || 1}-${idx}`;
            }
          });
          const found = mod.lessons.find(les => les._id === lessonId);
          if (found) {
            matchingLesson = found;
            break;
          }
        }
      }
    }
    if (matchingLesson) break;
  }

  if (!matchingLesson) {
    throw new AppError('Lesson not found', 404);
  }

  const rawUrl = matchingLesson.videoUrl || '';
  let streamUrl = rawUrl;

  // Robust YouTube ID extraction (handles watch, shorts, embed, mobile, share urls, and raw IDs)
  let videoId = null;
  if (rawUrl) {
    if (rawUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(rawUrl)) {
      videoId = rawUrl;
    } else {
      const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = rawUrl.match(regExp);
      if (match) videoId = match[1];
    }
  }

  if (videoId) {
    streamUrl = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&autoplay=1`;
  } else if (!streamUrl) {
    // Fallback sample video
    streamUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  res.status(200).json({
    status: 'success',
    data: { streamUrl }
  });
});

module.exports = {
  getMyEnrollments,
  completeLesson,
  getCourseProgress,
  streamVideo,
};
