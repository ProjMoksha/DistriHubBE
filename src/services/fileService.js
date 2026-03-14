const { cloudinary } = require('../config/cloudinary');
const AppError = require('../utils/appError');

/**
 * File Service
 * Handles file uploads and deletions with Cloudinary
 */

/**
 * Upload file to Cloudinary
 */
const uploadToCloudinary = async (file, folder = 'distrihub') => {
  try {
    if (!file) {
      throw AppError.validation('No file provided');
    }

    // Convert buffer to base64
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'auto',
    });

    return {
      imageURL: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw AppError.serverError(
      'Failed to upload file: ' + (error.message || 'Unknown error')
    );
  }
};

/**
 * Delete file from Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw AppError.validation('Public ID is required');
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw AppError.serverError('Failed to delete file from Cloudinary');
    }

    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw AppError.serverError(
      'Failed to delete file: ' + (error.message || 'Unknown error')
    );
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
