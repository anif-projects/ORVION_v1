const mongoose = require('../config/mongoose-mysql');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    progressPercentage: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    completedAt: Date,
    status: { type: String, enum: ['active', 'completed', 'refunded', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
