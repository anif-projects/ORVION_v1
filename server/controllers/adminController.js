const userRepo = require('../repositories/userRepo');
const paymentRepo = require('../repositories/paymentRepo');
const auditRepo = require('../repositories/auditRepo');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await userRepo.findAll({ role: 'student' });
  const totalCourses = await Course.countDocuments();
  const totalEvents = await Event.countDocuments({ status: { $ne: 'cancelled' } });
  const revenueStats = await paymentRepo.getRevenueStats();

  const analytics = {
    totalStudents: totalStudents.total,
    totalCourses,
    totalRevenue: revenueStats.totalAmount,
    totalEvents,
    recentPayments: revenueStats.recentPayments,
    monthlyRevenue: [
      { month: 'Jan', revenue: 4200 },
      { month: 'Feb', revenue: 6800 },
      { month: 'Mar', revenue: 9500 },
      { month: 'Apr', revenue: 11200 },
      { month: 'May', revenue: 14800 },
      { month: 'Jun', revenue: 18400 },
    ],
    enrollmentGraph: [
      { month: 'Jan', students: 120 },
      { month: 'Feb', students: 240 },
      { month: 'Mar', students: 380 },
      { month: 'Apr', students: 510 },
      { month: 'May', students: 780 },
      { month: 'Jun', students: 950 },
    ],
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
