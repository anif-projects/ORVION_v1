const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

// Admin-only routes
router.post('/', protect, restrictTo('admin', 'super_admin'), internshipController.createInternship);
router.get('/applications', protect, restrictTo('admin', 'super_admin'), internshipController.getInternshipApplications);
router.patch('/applications/:id/status', protect, restrictTo('admin', 'super_admin'), internshipController.updateApplicationStatus);
router.put('/:id', protect, restrictTo('admin', 'super_admin'), internshipController.updateInternship);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), internshipController.deleteInternship);

// Public routes
router.get('/', internshipController.getInternships);
router.post('/apply', internshipController.applyInternship);
router.get('/:id', internshipController.getInternshipById);

module.exports = router;
