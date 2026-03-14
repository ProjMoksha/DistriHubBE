/**
 * Custom Error Class for Application
 * Extends the built-in Error class with additional properties
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error
   */
  static validation(message) {
    return new AppError(message, 400);
  }

  /**
   * Create an authentication error
   */
  static authentication(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  /**
   * Create a forbidden error
   */
  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  /**
   * Create a not found error
   */
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  /**
   * Create a conflict error
   */
  static conflict(message) {
    return new AppError(message, 409);
  }

  /**
   * Create a server error
   */
  static serverError(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}

module.exports = AppError;
