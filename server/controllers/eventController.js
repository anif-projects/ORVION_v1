const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const getUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: { $ne: 'cancelled' } }).sort({ startTime: 1 });
  res.status(200).json({ status: 'success', data: { events } });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json({ status: 'success', data: { event } });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new AppError('Event not found', 404);

  if (event.registeredUsers.includes(req.user._id)) {
    return res.status(200).json({ status: 'success', message: 'Already registered' });
  }

  event.registeredUsers.push(req.user._id);
  await event.save();
  res.status(200).json({ status: 'success', message: 'Registered for event successfully' });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const allEvents = await Event.find({ status: { $ne: 'cancelled' } }).sort({ startTime: 1 });
  const myEvents = allEvents.filter(event => {
    const users = Array.isArray(event.registeredUsers) ? event.registeredUsers : [];
    return users.map(String).includes(String(req.user._id));
  });
  res.status(200).json({ status: 'success', data: { events: myEvents } });
});

module.exports = { getUpcomingEvents, createEvent, registerForEvent, getMyEvents };
