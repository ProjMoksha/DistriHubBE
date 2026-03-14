const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const AppError = require('../utils/appError');

/**
 * Authentication Service
 * Handles user registration, login, and JWT operations
 */

/**
 * Generate JWT Token
 */
const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h',
  });
};

/**
 * Register a new user
 */
const registerUser = async (email, password) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw AppError.conflict('User with this email already exists');
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = generateJWT(user._id);

    return {
      user: user.toJSON(),
      business: null,
      token,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
const loginUser = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw AppError.validation('Email and password are required');
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw AppError.authentication('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw AppError.authentication('Invalid email or password');
    }

    // Generate token
    const token = generateJWT(user._id);

    // Fetch business details (may not exist yet)
    const business = await Business.findOne({ userId: user._id }) || null;

    return {
      user: user.toJSON(),
      business: business ? business.toJSON() : null,
      token,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile
 */
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  try {
    // Don't allow updating sensitive fields directly
    const allowedFields = ['email', 'password'];
    const filteredData = {};

    for (const field of allowedFields) {
      if (updateData[field]) {
        filteredData[field] = updateData[field];
      }
    }

    // Check if email already exists (if updating email)
    if (filteredData.email) {
      const existingUser = await User.findOne({
        email: filteredData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw AppError.conflict('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete user profile
 */
const deleteUserProfile = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateJWT,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
