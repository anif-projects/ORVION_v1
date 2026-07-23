const mongoose = require('../config/mongoose-mysql');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    icon: { type: String, default: 'folder' },
    color: { type: String, default: '#4F46E5' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
