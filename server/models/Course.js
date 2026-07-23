const mongoose = require('../config/mongoose-mysql');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    subtitle: String,
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    previewVideo: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all_levels'], default: 'all_levels' },
    language: { type: String, default: 'English' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    tags: [String],
    requirements: [String],
    learningOutcomes: [String],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    totalDuration: { type: Number, default: 0 }, // in minutes
    totalLessons: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
