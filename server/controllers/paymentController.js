const paymentService = require('../services/paymentService');
const paymentRepo = require('../repositories/paymentRepo');
const asyncHandler = require('../utils/asyncHandler');

const checkout = asyncHandler(async (req, res) => {
  const { courseId, price, provider } = req.body;
  const result = await paymentService.processCheckout({
    studentId: req.user._id,
    courseId,
    price,
    provider,
  });
  res.status(200).json({ status: 'success', data: result });
});

const getHistory = asyncHandler(async (req, res) => {
  const stats = await paymentRepo.getRevenueStats();
  res.status(200).json({ status: 'success', data: stats });
});

module.exports = { checkout, getHistory };
