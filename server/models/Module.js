const mongoose = require('../config/mongoose-mysql');

const moduleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    order: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

moduleSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Module', moduleSchema);
