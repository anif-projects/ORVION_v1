const mongoose = require('../config/mongoose-mysql');

const eventEnrollmentSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, required: true },
    agreedToTerms: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    paymentId: { type: String, default: null },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model('EventEnrollment', eventEnrollmentSchema);
