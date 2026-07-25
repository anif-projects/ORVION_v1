const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/my-courses', learningController.getMyEnrollments);

module.exports = router;
