const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary with API credentials
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Verify Cloudinary connection
 */
const verifyCloudinaryConfig = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.warn('⚠️ Cloudinary configuration is incomplete');
    return false;
  }
  console.log('✅ Cloudinary Configured Successfully');
  return true;
};

module.exports = {
  cloudinary,
  verifyCloudinaryConfig,
};
