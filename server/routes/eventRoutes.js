const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

router.get('/', eventController.getUpcomingEvents);
router.get('/my-events', protect, eventController.getMyEvents);
router.post('/', protect, restrictTo('admin', 'super_admin'), eventController.createEvent);
router.post('/:id/register', protect, eventController.registerForEvent);

module.exports = router;
