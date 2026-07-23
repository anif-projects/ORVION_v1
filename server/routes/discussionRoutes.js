const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/course/:courseId', discussionController.getCourseDiscussions);
router.post('/', protect, discussionController.createDiscussion);
router.post('/:id/reply', protect, discussionController.replyDiscussion);

module.exports = router;
