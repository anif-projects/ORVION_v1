const mongoose = require('../config/mongoose-mysql');

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    provider: { type: String, enum: ['stripe', 'razorpay', 'paypal', 'free'], required: true },
    transactionId: { type: String, required: true, unique: true },
    paymentIntentId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending', index: true },
    receiptUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
