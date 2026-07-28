const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

router.post('/apply', internshipController.applyInternship);
router.get('/applications', protect, restrictTo('admin', 'super_admin'), internshipController.getInternshipApplications);

module.exports = router;
