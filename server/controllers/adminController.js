const userRepo = require('../repositories/userRepo');
const paymentRepo = require('../repositories/paymentRepo');
const auditRepo = require('../repositories/auditRepo');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Event = require('../models/Event');
const User = require('../models/User');
const Payment = require('../models/Payment');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await userRepo.findAll({ role: 'student' });
  const totalCourses = await Course.countDocuments();
  const totalEvents = await Event.countDocuments({ status: { $ne: 'cancelled' } });
  const revenueStats = await paymentRepo.getRevenueStats();

  // 1. Get dynamic monthly revenue growth from completed payments in the DB
  const completedPayments = await Payment.find({ status: 'completed' });
  const monthlyRevenueMap = {};
  
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mName = monthsShort[d.getMonth()];
    last6Months.push(mName);
    monthlyRevenueMap[mName] = 0;
  }

  completedPayments.forEach(p => {
    if (p.createdAt) {
      const date = new Date(p.createdAt);
      const mName = monthsShort[date.getMonth()];
      if (monthlyRevenueMap[mName] !== undefined) {
        monthlyRevenueMap[mName] += parseFloat(p.amount) || 0;
      }
    }
  });

  const monthlyRevenue = last6Months.map(month => ({
    month,
    revenue: monthlyRevenueMap[month]
  }));

  // 2. Get dynamic student registrations from users table in the DB
  const allStudents = await User.find({ role: 'student' });
  const enrollmentMap = {};
  last6Months.forEach(m => {
    enrollmentMap[m] = 0;
  });

  allStudents.forEach(s => {
    if (s.createdAt) {
      const date = new Date(s.createdAt);
      const mName = monthsShort[date.getMonth()];
      if (enrollmentMap[mName] !== undefined) {
        enrollmentMap[mName]++;
      }
    }
  });

  const enrollmentGraph = last6Months.map(month => ({
    month,
    students: enrollmentMap[month]
  }));

  const analytics = {
    totalStudents: totalStudents.total,
    totalCourses,
    totalRevenue: revenueStats.totalAmount,
    totalEvents,
    recentPayments: revenueStats.recentPayments,
    monthlyRevenue,
    enrollmentGraph,
  };

  res.status(200).json({ status: 'success', data: analytics });
});

const getStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = { role: 'student' };
  if (search) query.name = { $regex: search, $options: 'i' };

  const students = await userRepo.findAll(query, { page: Number(page), limit: Number(limit) });
  res.status(200).json({ status: 'success', data: students });
});

const updateStudentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await userRepo.updateStatus(req.params.id, status);
  res.status(200).json({ status: 'success', data: { user } });
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await auditRepo.getRecentLogs(50);
  res.status(200).json({ status: 'success', data: { logs } });
});

const createCategory = asyncHandler(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ status: 'success', data: { category } });
});

module.exports = {
  getDashboardStats,
  getStudents,
  updateStudentStatus,
  getAuditLogs,
  createCategory,
};
