const AppError = require('../../../src/utils/appError');

describe('AppError', () => {
  describe('Constructor', () => {
    it('should create an AppError with message and statusCode', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.success).toBe(false);
    });

    it('should have default statusCode of 500', () => {
      const error = new AppError('Server error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('Static Methods', () => {
    it('should create validation error with 400 status', () => {
      const error = AppError.validation('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid input');
    });

    it('should create authentication error with 401 status', () => {
      const error = AppError.authentication('No token');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('No token');
    });

    it('should create forbidden error with 403 status', () => {
      const error = AppError.forbidden('Access denied');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });

    it('should create notFound error with 404 status', () => {
      const error = AppError.notFound('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('User not found');
    });

    it('should create conflict error with 409 status', () => {
      const error = AppError.conflict('Email already exists');
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Email already exists');
    });

    it('should create serverError with 500 status', () => {
      const error = AppError.serverError('Internal error');
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal error');
    });
  });

  describe('Error extends Error', () => {
    it('should be instance of Error', () => {
      const error = new AppError('Test', 400);
      expect(error instanceof Error).toBe(true);
    });
  });
});
