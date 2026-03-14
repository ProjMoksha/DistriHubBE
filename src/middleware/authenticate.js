const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw AppError.authentication('No token provided. Please log in.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(AppError.authentication(error.message));
  }
};

module.exports = authenticate;
