const mongoose = require('../config/mongoose-mysql');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    price: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    category: { type: String, default: '' },
    type: { type: String, default: 'online' },
    rating: { type: Number, default: 4.80 },
    enrolledCount: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 480 },
    totalLessons: { type: Number, default: 12 },
    previewVideo: { type: String, default: '' },
    language: { type: String, default: 'English (Subtitles available)' },
    isCertificateIncluded: { type: Boolean, default: true },
    modules: { type: mongoose.Schema.Types.Mixed, default: [] },
    learningOutcomes: { type: mongoose.Schema.Types.Mixed, default: [] },
    certificateTemplate: { type: String, default: '' },
    certificateLayout: { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
