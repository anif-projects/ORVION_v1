const mongoose = require('../config/mongoose-mysql');

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, default: '3 Months (Remote)' },
    requirements: { type: String, default: '' },
    skills: { type: String, default: '' },
    stipend: { type: String, default: 'Unpaid' },
    location: { type: String, default: 'Remote' },
    category: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
