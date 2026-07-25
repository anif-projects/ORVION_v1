const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

router.get('/', eventController.getUpcomingEvents);
router.get('/my-events', protect, eventController.getMyEvents);
router.post('/:id/register', protect, eventController.registerForEvent);

// Admin Routes
router.post('/', protect, restrictTo('admin', 'super_admin'), eventController.createEvent);
router.get('/registrations', protect, restrictTo('admin', 'super_admin'), eventController.getRegistrations);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), eventController.deleteEvent);

module.exports = router;
