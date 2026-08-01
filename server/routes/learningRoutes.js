const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/my-courses', learningController.getMyEnrollments);
router.post('/complete-lesson', learningController.completeLesson);
router.get('/progress/:courseId', learningController.getCourseProgress);
router.get('/stream/:lessonId', learningController.streamVideo);

module.exports = router;
