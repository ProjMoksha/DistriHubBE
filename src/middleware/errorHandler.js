const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

/**
 * Centralized Error Handler Middleware
 * Handles all errors and returns standardized response
 */
const errorHandler = (err, req, res, next) => {
  // Set default error properties
  let error = { ...err };
  error.message = err.message;

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(', '), 400);
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ID format: ${err.value}`, 400);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new AppError(
      `Duplicate value for field: ${field}. This value already exists.`,
      409
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', 401);
  }

  // Set status code
  const statusCode = error.statusCode || 500;
  const message =
    error.message ||
    (statusCode >= 500 ? 'Internal Server Error' : 'Bad Request');

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }

  // Send error response
  res.status(statusCode).json(
    ApiResponse.error(message, error.message || error)
  );
};

module.exports = errorHandler;
