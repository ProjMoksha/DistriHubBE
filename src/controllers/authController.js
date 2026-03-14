const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../middleware/asyncWrapper');
const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles user registration, login, and profile operations
 */

/**
 * Register Controller
 */
const register = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await authService.registerUser(email, password);

  res.status(201).json(
    ApiResponse.success('User registered successfully', {
      user,
      token,
    })
  );
});

/**
 * Login Controller
 */
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser(email, password);

  res.status(200).json(
    ApiResponse.success('Login successful', {
      user,
      token,
    })
  );
});

/**
 * Get Profile Controller
 */
const getProfile = asyncWrapper(async (req, res, next) => {
  const userId = req.user.userId;

  const user = await authService.getUserProfile(userId);

  res.status(200).json(
    ApiResponse.success('Profile retrieved successfully', {
      user,
    })
  );
});

/**
 * Update Profile Controller
 */
const updateProfile = asyncWrapper(async (req, res, next) => {
  const userId = req.user.userId;
  const updateData = req.body;

  const user = await authService.updateUserProfile(userId, updateData);

  res.status(200).json(
    ApiResponse.success('Profile updated successfully', {
      user,
    })
  );
});

/**
 * Delete Profile Controller
 */
const deleteProfile = asyncWrapper(async (req, res, next) => {
  const userId = req.user.userId;

  await authService.deleteUserProfile(userId);

  res.status(200).json(
    ApiResponse.success('Profile deleted successfully', null)
  );
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
};
