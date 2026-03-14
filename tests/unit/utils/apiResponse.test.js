const ApiResponse = require('../../../src/utils/apiResponse');

describe('ApiResponse', () => {
  describe('Constructor', () => {
    it('should create an ApiResponse with all properties', () => {
      const response = new ApiResponse(true, 'Success', { id: 1 }, null);
      expect(response.success).toBe(true);
      expect(response.message).toBe('Success');
      expect(response.data).toEqual({ id: 1 });
      expect(response.error).toBe(null);
    });
  });

  describe('Static Methods', () => {
    it('should create success response', () => {
      const response = ApiResponse.success('Operation successful', { id: 1 });
      expect(response.success).toBe(true);
      expect(response.message).toBe('Operation successful');
      expect(response.data).toEqual({ id: 1 });
      expect(response.error).toBe(null);
    });

    it('should create success response with null data', () => {
      const response = ApiResponse.success('Operation successful');
      expect(response.success).toBe(true);
      expect(response.data).toBe(null);
    });

    it('should create error response', () => {
      const response = ApiResponse.error('Operation failed', 'Invalid input');
      expect(response.success).toBe(false);
      expect(response.message).toBe('Operation failed');
      expect(response.data).toBe(null);
      expect(response.error).toBe('Invalid input');
    });

    it('should create error response with null error', () => {
      const response = ApiResponse.error('Operation failed');
      expect(response.success).toBe(false);
      expect(response.error).toBe(null);
    });
  });
});
