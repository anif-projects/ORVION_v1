const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/checkout', protect, paymentController.checkout);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/history', protect, paymentController.getHistory);

module.exports = router;
