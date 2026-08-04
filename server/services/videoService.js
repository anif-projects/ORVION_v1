class VideoService {
  generateSignedUploadUrl(folder = 'lms_courses') {
    const timestamp = Math.round(new Date().getTime() / 1000);
    return {
      timestamp,
      signature: 'mock_signature',
      apiKey: 'mock_key',
      cloudName: 'mock_cloud',
      folder,
    };
  }

  generateSecureStreamUrl(publicId) {
    if (!publicId) return '';
    return publicId;
  }
}

module.exports = new VideoService();
