/**
 * Standardized API Response Formatter
 */
class ApiResponse {
  constructor(success, message, data = null, error = null) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  /**
   * Create a success response
   */
  static success(message, data = null) {
    return new ApiResponse(true, message, data, null);
  }

  /**
   * Create an error response
   */
  static error(message, error = null) {
    return new ApiResponse(false, message, null, error);
  }
}

module.exports = ApiResponse;
