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

const parseOptionalUser = async (req) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return null;
  try {
    const { verifyAccessToken } = require('../utils/jwtUtils');
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
};

const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await courseRepo.findBySlug(req.params.slug);
  if (!course) throw new AppError('Course not found', 404);

  const user = await parseOptionalUser(req);
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'instructor');

  if (!isAdmin) {
    const courseObj = course.toObject ? course.toObject() : course;
    const modules = typeof courseObj.modules === 'string' ? JSON.parse(courseObj.modules) : courseObj.modules;
    if (modules && Array.isArray(modules)) {
      modules.forEach(mod => {
        if (mod.lessons && Array.isArray(mod.lessons)) {
          mod.lessons.forEach(les => {
            delete les.videoUrl;
          });
        }
      });
      courseObj.modules = modules;
    }
    return res.status(200).json({ status: 'success', data: { course: courseObj } });
  }

  res.status(200).json({ status: 'success', data: { course } });
});

const createCourse = asyncHandler(async (req, res) => {
  const { title, subtitle, description, thumbnail, price, isFeatured, category, rating, enrolledCount, totalDuration, language, isCertificateIncluded, modules, learningOutcomes, certificateTemplate, certificateLayout } = req.body;
  const course = await courseRepo.create({
    title,
    subtitle: subtitle || '',
    description,
    thumbnail,
    price: Number(price) || 0,
    isFeatured: isFeatured === true || isFeatured === 'true',
    category: category || '',
    rating: (rating !== undefined && rating !== '') ? Number(rating) : 4.80,
    enrolledCount: (enrolledCount !== undefined && enrolledCount !== '') ? Number(enrolledCount) : 0,
    totalDuration: (totalDuration !== undefined && totalDuration !== '') ? Number(totalDuration) : 480,
    language: language || 'English (Subtitles available)',
    isCertificateIncluded: isCertificateIncluded === true || isCertificateIncluded === 'true',
    modules: modules || [],
    learningOutcomes: learningOutcomes || [],
    certificateTemplate: certificateTemplate || '',
    certificateLayout: certificateLayout || null,
  });

  res.status(201).json({ status: 'success', data: { course } });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, subtitle, description, thumbnail, price, isFeatured, category, rating, enrolledCount, totalDuration, language, isCertificateIncluded, modules, learningOutcomes, certificateTemplate, certificateLayout } = req.body;
  const course = await courseRepo.update(req.params.id, {
    title,
    subtitle: subtitle || '',
    description,
    thumbnail,
    price: Number(price) || 0,
    isFeatured: isFeatured === true || isFeatured === 'true',
    category: category || '',
    rating: (rating !== undefined && rating !== '') ? Number(rating) : 4.80,
    enrolledCount: (enrolledCount !== undefined && enrolledCount !== '') ? Number(enrolledCount) : 0,
    totalDuration: (totalDuration !== undefined && totalDuration !== '') ? Number(totalDuration) : 480,
    language: language || 'English (Subtitles available)',
    isCertificateIncluded: isCertificateIncluded === true || isCertificateIncluded === 'true',
    modules: modules || [],
    learningOutcomes: learningOutcomes || [],
    certificateTemplate: certificateTemplate !== undefined ? certificateTemplate : '',
    certificateLayout: certificateLayout !== undefined ? certificateLayout : null,
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
