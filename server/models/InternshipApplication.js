const mongoose = require('../config/mongoose-mysql');

const internshipApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    domain: { type: String, required: true },
    resumeLink: { type: String, default: '' },
    statement: { type: String, default: '' },
    status: { type: String, default: 'applied' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
