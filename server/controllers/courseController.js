const courseRepo = require('../repositories/courseRepo');
const videoService = require('../services/videoService');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, level, search, sort } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (level) filters.level = level;
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
  const course = await courseRepo.create({
    ...req.body,
    slug,
    instructor: req.user._id,
  });
  res.status(201).json({ status: 'success', data: { course } });
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseRepo.update(req.params.id, req.body);
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
};
