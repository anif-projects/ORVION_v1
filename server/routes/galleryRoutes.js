const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/rbacMiddleware');

// Public route to retrieve highlights gallery images
router.get('/', galleryController.getGalleryImages);

// Admin-only routes to add and delete images
router.post('/', protect, restrictTo('admin', 'super_admin'), galleryController.createGalleryImage);
router.delete('/:id', protect, restrictTo('admin', 'super_admin'), galleryController.deleteGalleryImage);

module.exports = router;
