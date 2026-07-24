const courseRepo = require('../repositories/courseRepo');
const videoService = require('../services/videoService');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const Course = require('../models/Course');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, level, search, sort, isFeatured } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (level) filters.level = level;
  if (isFeatured) filters.isFeatured = isFeatured === 'true';
  if (search) filters.title = { $regex: search, $options: 'i' };

  let sortOption = { createdAt: -1 };
  if (sort === 'price_low') sortOption = { price: 1 };
  if (sort === 'price_high') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };

  const result = await courseRepo.findPublished(filters, { page: Number(page), limit: Number(limit) }, sortOption);
  res.status(200).json({ status: 'success', data: result });
});

const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await courseRepo.findBySlug(req.params.slug);
  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ status: 'success', data: { course } });
});

const createCourse = asyncHandler(async (req, res) => {
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const courseData = { ...req.body, slug, instructor: req.user._id };
  if (req.body.learningOutcomes) {
    courseData.learningOutcomes = Array.isArray(req.body.learningOutcomes)
      ? req.body.learningOutcomes
      : JSON.parse(req.body.learningOutcomes || '[]');
  }

  delete courseData.modules;
  const course = await courseRepo.create(courseData);

  // Save child modules & lessons/quizzes
  if (req.body.modules && Array.isArray(req.body.modules)) {
    for (let mIdx = 0; mIdx < req.body.modules.length; mIdx++) {
      const mod = req.body.modules[mIdx];
      const moduleItem = await Module.create({
        course: course._id,
        title: mod.title,
        order: mIdx + 1,
      });

      if (mod.lessons && Array.isArray(mod.lessons)) {
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const les = mod.lessons[lIdx];
          await Lesson.create({
            module: moduleItem._id,
            course: course._id,
            title: les.title,
            type: les.type || 'video',
            quizData: les.quizData || null,
            duration: les.duration || 0,
            order: lIdx + 1,
          });
        }
      }
    }
  }

  res.status(201).json({ status: 'success', data: { course } });
});

const updateCourse = asyncHandler(async (req, res) => {
  const courseData = { ...req.body };
  if (req.body.learningOutcomes) {
    courseData.learningOutcomes = Array.isArray(req.body.learningOutcomes)
      ? req.body.learningOutcomes
      : JSON.parse(req.body.learningOutcomes || '[]');
  }

  delete courseData.modules;
  const course = await courseRepo.update(req.params.id, courseData);

  if (req.body.modules && Array.isArray(req.body.modules)) {
    await Module.deleteMany({ course: course._id });
    await Lesson.deleteMany({ course: course._id });

    for (let mIdx = 0; mIdx < req.body.modules.length; mIdx++) {
      const mod = req.body.modules[mIdx];
      const moduleItem = await Module.create({
        course: course._id,
        title: mod.title,
        order: mIdx + 1,
      });

      if (mod.lessons && Array.isArray(mod.lessons)) {
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const les = mod.lessons[lIdx];
          await Lesson.create({
            module: moduleItem._id,
            course: course._id,
            title: les.title,
            type: les.type || 'video',
            quizData: les.quizData || null,
            duration: les.duration || 0,
            order: lIdx + 1,
          });
        }
      }
    }
  }

  res.status(200).json({ status: 'success', data: { course } });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseRepo.delete(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});

const addModule = asyncHandler(async (req, res) => {
  const { courseId, title, description, order } = req.body;
  const moduleItem = await Module.create({ course: courseId, title, description, order });
  res.status(201).json({ status: 'success', data: { module: moduleItem } });
});

const addLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);
  await Course.findByIdAndUpdate(req.body.course, { $inc: { totalLessons: 1 } });
  res.status(201).json({ status: 'success', data: { lesson } });
});

const getUploadSignature = asyncHandler(async (req, res) => {
  const signatureData = videoService.generateSignedUploadUrl();
  res.status(200).json({ status: 'success', data: signatureData });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 'active' });
  res.status(200).json({ status: 'success', data: { categories } });
});

const toggleFeatured = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);

  const updated = await courseRepo.update(req.params.id, { isFeatured: !course.isFeatured });
  res.status(200).json({ status: 'success', data: { course: updated } });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  addLesson,
  getUploadSignature,
  getCategories,
  toggleFeatured,
};
