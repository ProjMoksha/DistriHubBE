const multer = require('multer');
const AppError = require('../utils/appError');

/**
 * Multer Configuration for File Uploads
 * Stores files in memory for processing with Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only images
 */
const fileFilter = (req, file, cb) => {
  // Allowed mime types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      AppError.validation(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      ),
      false
    );
  }
};

/**
 * Multer upload configuration
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
