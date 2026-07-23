const mongoose = require('../config/mongoose-mysql');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    type: { type: String, enum: ['webinar', 'workshop', 'live_qa'], default: 'webinar' },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetingLink: String,
    capacity: { type: Number, default: 100 },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
