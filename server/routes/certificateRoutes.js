const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/claim', protect, certificateController.claimCertificate);
router.get('/my-certificates', protect, certificateController.getMyCertificates);
router.get('/verify/:hash', certificateController.verifyCertificate);

module.exports = router;
