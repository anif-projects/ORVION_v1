const mongoose = require('../config/mongoose-mysql');

const settingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'LMS Platform' },
    supportEmail: { type: String, default: 'support@lmsplatform.com' },
    paymentProvider: { type: String, enum: ['stripe', 'razorpay', 'paypal'], default: 'stripe' },
    enableSMTP: { type: Boolean, default: true },
    themeColor: { type: String, default: '#4F46E5' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
