const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const adminRoutes = require('./adminRoutes');
const paymentRoutes = require('./paymentRoutes');
const learningRoutes = require('./learningRoutes');
const certificateRoutes = require('./certificateRoutes');
const eventRoutes = require('./eventRoutes');
const discussionRoutes = require('./discussionRoutes');
const internshipRoutes = require('./internshipRoutes');
const fs = require('fs');
const path = require('path');

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/learning', learningRoutes);
router.use('/certificates', certificateRoutes);
router.use('/events', eventRoutes);
router.use('/discussions', discussionRoutes);
router.use('/internships', internshipRoutes);

router.post('/upload', (req, res) => {
  try {
    const { base64Data } = req.body;
    if (!base64Data) {
      return res.status(400).json({ status: 'fail', message: 'No file data provided' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let dataBuffer;
    let fileExtension = 'png';

    if (matches && matches.length === 3) {
      const type = matches[1];
      fileExtension = type.split('/')[1] || 'png';
      dataBuffer = Buffer.from(matches[2], 'base64');
    } else {
      dataBuffer = Buffer.from(base64Data, 'base64');
    }

    const uniqueName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExtension}`;
    const filePath = path.join(__dirname, '..', 'uploads', uniqueName);

    fs.writeFileSync(filePath, dataBuffer);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${uniqueName}`;

    return res.status(200).json({
      status: 'success',
      data: {
        url: fileUrl
      }
    });
  } catch (err) {
    console.error('File upload error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
