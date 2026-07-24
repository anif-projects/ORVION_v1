const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');
const { auditLog } = require('../middlewares/auditMiddleware');

router.get('/', courseController.getCourses);
router.get('/categories', courseController.getCategories);
router.get('/slug/:slug', courseController.getCourseBySlug);

// Admin / Instructor Routes
router.use(protect, restrictTo('admin', 'super_admin', 'instructor'));
router.post('/', auditLog('CREATE_COURSE'), courseController.createCourse);
router.put('/:id', auditLog('UPDATE_COURSE'), courseController.updateCourse);
router.delete('/:id', auditLog('DELETE_COURSE'), courseController.deleteCourse);
router.patch('/:id/toggle-featured', auditLog('TOGGLE_FEATURED_COURSE'), courseController.toggleFeatured);

router.post('/modules', courseController.addModule);
router.post('/lessons', courseController.addLesson);
router.get('/upload-signature', courseController.getUploadSignature);

module.exports = router;
