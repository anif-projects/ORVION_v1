const mongoose = require('../config/mongoose-mysql');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    price: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
