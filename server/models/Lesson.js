const mongoose = require('../config/mongoose-mysql');

const resourceSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  type: { type: String, enum: ['pdf', 'zip', 'link', 'other'], default: 'pdf' },
});

const lessonSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: String,
    videoUrl: { type: String, default: '' }, // Cloudinary public_id / url
    duration: { type: Number, default: 0 }, // in seconds
    order: { type: Number, required: true, default: 1 },
    isPreview: { type: Boolean, default: false },
    notes: String,
    resources: [resourceSchema],
  },
  { timestamps: true }
);

lessonSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
