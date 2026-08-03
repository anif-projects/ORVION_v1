const User = require('../models/User');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Enrollment = require('../models/Enrollment');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({});
  const totalCourses = await Course.countDocuments({ type: { $ne: 'offline' } });
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

const getRegistrationStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  // Default values: last 30 days
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Set boundaries
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Format to MySQL DATETIME format YYYY-MM-DD HH:MM:SS
  const formatMySQLDate = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const sqlStart = formatMySQLDate(start);
  const sqlEnd = formatMySQLDate(end);

  // Query database using raw MySQL queries
  const [courseRows] = await mongoose.query(
    "SELECT COUNT(*) AS count FROM `course_enrollments` WHERE `createdAt` >= ? AND `createdAt` <= ?",
    [sqlStart, sqlEnd]
  );
  const [eventRows] = await mongoose.query(
    "SELECT COUNT(*) AS count FROM `event_enrollments` WHERE `createdAt` >= ? AND `createdAt` <= ?",
    [sqlStart, sqlEnd]
  );
  const [internshipRows] = await mongoose.query(
    "SELECT COUNT(*) AS count FROM `internship_applications` WHERE `createdAt` >= ? AND `createdAt` <= ?",
    [sqlStart, sqlEnd]
  );

  const courseCount = courseRows[0]?.count || 0;
  const eventCount = eventRows[0]?.count || 0;
  const internshipCount = internshipRows[0]?.count || 0;

  res.status(200).json({
    status: 'success',
    data: {
      courses: courseCount,
      events: eventCount,
      internships: internshipCount
    }
  });
});

const mongoose = require('../config/mongoose-mysql');

module.exports = {
  getDashboardStats,
  getStudents,
  updateStudentStatus,
  getAuditLogs,
  createCategory,
  getRegistrationStats,
};
