const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

// Public route to submit contact messages
router.post('/', contactController.createContactMessage);

// Admin-only routes to retrieve and delete messages
router.get('/', protect, restrictTo('admin', 'super_admin'), contactController.getContactMessages);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), contactController.deleteContactMessage);

module.exports = router;
