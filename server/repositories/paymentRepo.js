const Payment = require('../models/Payment');

class PaymentRepository {
  async createPayment(paymentData) {
    return await Payment.create(paymentData);
  }

  async findByTransactionId(transactionId) {
    return await Payment.findOne({ transactionId });
  }

  async updateStatus(id, status, receiptUrl = null) {
    return await Payment.findByIdAndUpdate(
      id,
      { status, ...(receiptUrl && { receiptUrl }) },
      { new: true }
    );
  }

  async getRevenueStats() {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('student', 'name email')
      .populate('course', 'title price')
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      totalAmount: Number(totalRevenue[0] && totalRevenue[0].total ? totalRevenue[0].total : 0),
      recentPayments,
    };
  }
}

module.exports = new PaymentRepository();
