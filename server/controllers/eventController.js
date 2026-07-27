const Event = require('../models/Event');
const EventEnrollment = require('../models/EventEnrollment');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  
  // Calculate registrant counts dynamically for each event
  const registrations = await EventEnrollment.find({});
  const eventsWithCount = events.map(event => {
    const count = registrations.filter(r => String(r.eventId) === String(event.id)).length;
    const obj = event.toObject();
    obj.registrantCount = count;
    return obj;
  });

  res.status(200).json({ status: 'success', data: { events: eventsWithCount } });
});

const createEvent = asyncHandler(async (req, res) => {
  const { name, description, thumbnail, paymentAmount } = req.body;
  const amount = Number(paymentAmount) || 0;
  const event = await Event.create({
    name,
    description,
    thumbnail,
    paymentAmount: amount,
    isPaymentEnabled: amount > 0,
  });
  res.status(201).json({ status: 'success', data: { event } });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const { name, phone, email, organization, agreedToTerms, isPaid, paymentId } = req.body;

  const studentEmail = email || req.user?.email;
  if (!studentEmail) {
    throw new AppError('Email is required for registration', 400);
  }

  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  // Check if already registered
  const existingEnrollment = await EventEnrollment.findOne({
    eventId,
    email: studentEmail
  });

  if (existingEnrollment) {
    throw new AppError('You are already registered for this live event.', 400);
  }

  // Create enrollment
  const enrollment = await EventEnrollment.create({
    eventId,
    name: name || req.user?.name || 'Student',
    phone: phone || req.user?.phone || '0000000000',
    email: studentEmail,
    organization: organization || 'LMS Platform',
    agreedToTerms: agreedToTerms === true || agreedToTerms === 'true' || true,
    isPaid: event.isPaymentEnabled ? (isPaid === true || isPaid === 'true') : false,
    paymentId: paymentId || null,
  });

  res.status(201).json({
    status: 'success',
    data: {
      message: 'Registered for event successfully!',
      enrollment,
    }
  });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const registrations = await EventEnrollment.find({ email: req.user.email }).populate('eventId');
  const events = registrations.map(r => r.eventId).filter(Boolean);
  res.status(200).json({ status: 'success', data: { events } });
});

const getRegistrations = asyncHandler(async (req, res) => {
  const registrations = await EventEnrollment.find({}).populate('eventId');
  res.status(200).json({ status: 'success', data: { registrations } });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new AppError('Event not found', 404);
  // Also delete associated enrollments
  await EventEnrollment.deleteMany({ eventId: req.params.id });
  res.status(204).json({ status: 'success', data: null });
});

module.exports = {
  getUpcomingEvents,
  createEvent,
  registerForEvent,
  getMyEvents,
  getRegistrations,
  deleteEvent,
};
