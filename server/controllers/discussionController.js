const Discussion = require('../models/Discussion');
const asyncHandler = require('../utils/asyncHandler');

const getCourseDiscussions = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const discussions = await Discussion.find({ course: courseId })
    .populate('user', 'name avatar role')
    .populate('replies.user', 'name avatar role')
    .sort({ createdAt: -1 });

  res.status(200).json({ status: 'success', data: { discussions } });
});

const createDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(201).json({ status: 'success', data: { discussion } });
});

const replyDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const discussion = await Discussion.findById(id);

  discussion.replies.push({
    user: req.user._id,
    content,
  });
  await discussion.save();

  res.status(200).json({ status: 'success', data: { discussion } });
});

module.exports = { getCourseDiscussions, createDiscussion, replyDiscussion };
