const courseRepo = require('../repositories/courseRepo');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search, sort, isFeatured } = req.query;
  const filters = {};
  if (isFeatured) filters.isFeatured = isFeatured === 'true';
  
  // Clean text search on title
  if (search) filters.title = { $regex: search, $options: 'i' };

  let sortOption = { createdAt: -1 };
  if (sort === 'price_low') sortOption = { price: 1 };
  if (sort === 'price_high') sortOption = { price: -1 };

  const result = await courseRepo.findPublished(filters, { page: Number(page), limit: Number(limit) }, sortOption);
  res.status(200).json({ status: 'success', data: result });
});

const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await courseRepo.findBySlug(req.params.slug);
  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ status: 'success', data: { course } });
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, price, isFeatured, category } = req.body;
  const course = await courseRepo.create({
    title,
    description,
    thumbnail,
    price: Number(price) || 0,
    isFeatured: isFeatured === true || isFeatured === 'true',
    category: category || '',
  });

  res.status(201).json({ status: 'success', data: { course } });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, thumbnail, price, isFeatured, category } = req.body;
  const course = await courseRepo.update(req.params.id, {
    title,
    description,
    thumbnail,
    price: Number(price) || 0,
    isFeatured: isFeatured === true || isFeatured === 'true',
    category: category || '',
  });

  if (!course) throw new AppError('Course not found', 404);
  res.status(200).json({ status: 'success', data: { course } });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await courseRepo.delete(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  res.status(204).json({ status: 'success', data: null });
});

const getCategories = asyncHandler(async (req, res) => {
  // Return empty list as categories are removed in simplified schema
  res.status(200).json({ status: 'success', data: { categories: [] } });
});

const toggleFeatured = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);

  const updated = await courseRepo.update(req.params.id, { isFeatured: !course.isFeatured });
  res.status(200).json({ status: 'success', data: { course: updated } });
});

const getCourseStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollments = await Enrollment.find({ courseId: id }).populate('studentId');
  const students = enrollments.map(e => e.studentId).filter(Boolean);
  res.status(200).json({ status: 'success', data: { students } });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  toggleFeatured,
  getCourseStudents,
};
