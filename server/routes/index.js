const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes');
const learningRoutes = require('./learningRoutes');
const certificateRoutes = require('./certificateRoutes');
const eventRoutes = require('./eventRoutes');
const discussionRoutes = require('./discussionRoutes');

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/learning', learningRoutes);
router.use('/certificates', certificateRoutes);
router.use('/events', eventRoutes);
router.use('/discussions', discussionRoutes);

module.exports = router;
