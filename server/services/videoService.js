const cloudinary = require('../config/cloudinary');

class VideoService {
  generateSignedUploadUrl(folder = 'lms_courses') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET || 'secret'
    );

    return {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY || '123456789012345',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
      folder,
    };
  }

  generateSecureStreamUrl(publicId) {
    if (!publicId) return '';
    // Cloudinary signed token URL generator for adaptive streaming
    if (publicId.startsWith('http')) return publicId;
    return cloudinary.url(publicId, {
      resource_type: 'video',
      streaming_profile: 'auto',
      secure: true,
    });
  }
}

module.exports = new VideoService();
