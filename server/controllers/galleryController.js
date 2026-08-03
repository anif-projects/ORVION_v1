const GalleryImage = require('../models/GalleryImage');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

// Get all gallery images
const getGalleryImages = asyncHandler(async (req, res) => {
  const images = await GalleryImage.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    data: { images }
  });
});

// Create a new gallery image (Admin only)
const createGalleryImage = asyncHandler(async (req, res) => {
  const { url, isHero } = req.body;

  if (!url) {
    throw new AppError('Please provide the image URL or base64 data.', 400);
  }

  const image = await GalleryImage.create({
    url,
    isHero: Boolean(isHero)
  });

  res.status(201).json({
    status: 'success',
    message: 'Gallery image uploaded successfully!',
    data: { image }
  });
});

// Delete a gallery image (Admin only)
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const result = await GalleryImage.findByIdAndDelete(req.params.id);
  if (result.deletedCount === 0) {
    throw new AppError('Gallery image not found.', 404);
  }
  res.status(200).json({
    status: 'success',
    message: 'Gallery image deleted successfully.'
  });
});

module.exports = {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage
};
