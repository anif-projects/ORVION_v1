const User = require('../models/User');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({});
  const totalCourses = await Course.countDocuments({});
  const totalEvents = await Event.countDocuments({});

  const analytics = {
    totalStudents,
    totalCourses,
    totalRevenue: 0,
    totalEvents,
    recentPayments: [],
    monthlyRevenue: [],
    enrollmentGraph: [],
  };

  res.status(200).json({ status: 'success', data: analytics });
});

const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  
  const students = await User.find({})
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments({});
  
  // Fetch all enrollments populated with course details
  const enrollments = await Enrollment.find({}).populate('courseId');

  // Map courses to each student
  const studentsWithCourses = students.map(student => {
    const studentEnrollments = enrollments.filter(e => String(e.studentId) === String(student.id));
    const courseTitles = studentEnrollments.map(e => e.courseId?.title).filter(Boolean);
    const obj = student.toObject();
    obj.courses = courseTitles.length > 0 ? courseTitles.join(', ') : 'Not Yet';
    return obj;
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      users: studentsWithCourses,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    }
  });
});

const updateStudentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const student = await User.findById(req.params.id);
  if (student) {
    student.isVerified = status === 'active';
    await student.save();
  }
  res.status(200).json({ status: 'success', data: { user: student } });
});

const getAuditLogs = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { logs: [] } });
});

const createCategory = asyncHandler(async (req, res) => {
  res.status(201).json({ status: 'success', data: { category: {} } });
});

module.exports = {
  getDashboardStats,
  getStudents,
  updateStudentStatus,
  getAuditLogs,
  createCategory,
};
