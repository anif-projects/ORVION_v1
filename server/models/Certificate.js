const mongoose = require('../config/mongoose-mysql');

const certificateSchema = new mongoose.Schema(
  {
    certificateHash: { type: String, required: true, unique: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    issueDate: { type: Date, default: Date.now },
    pdfUrl: String,
    qrCodeUrl: String,
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
