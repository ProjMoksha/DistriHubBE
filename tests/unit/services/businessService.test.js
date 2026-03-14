const businessService = require('../../../src/services/businessService');
const Business = require('../../../src/models/Business');
const AppError = require('../../../src/utils/appError');

// Mock the Business model
jest.mock('../../../src/models/Business');

describe('Business Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDistributorCode', () => {
    it('should generate a unique distributor code', async () => {
      Business.findOne.mockResolvedValue(null);

      const code = await businessService.generateDistributorCode();

      expect(code).toMatch(/^DIST\d{4}$/);
    });

    it('should ensure generated code is unique', async () => {
      // First call returns existing code, second returns null
      Business.findOne
        .mockResolvedValueOnce({ distributorCode: 'DIST1234' })
        .mockResolvedValueOnce(null);

      const code = await businessService.generateDistributorCode();

      expect(code).toMatch(/^DIST\d{4}$/);
      expect(Business.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error if unable to generate unique code after max attempts', async () => {
      Business.findOne.mockResolvedValue({ distributorCode: 'DIST1234' });

      await expect(
        businessService.generateDistributorCode()
      ).rejects.toThrow();
    });
  });

  describe('Step 1 Operations', () => {
    it('should create step 1 business details', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'Test Business',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      const data = {
        legalBusinessName: 'Test Business',
        gstNumber: '19AABCT1234H1Z0',
      };

      const result = await businessService.createStep1('user123', data);

      expect(result).toEqual(mockBusiness);
      expect(mockBusiness.save).toHaveBeenCalled();
    });

    it('should get step 1 details', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'Test Business',
      };

      Business.findOne.mockResolvedValue(mockBusiness);

      const result = await businessService.getStep1('user123');

      expect(result).toEqual(mockBusiness);
      expect(Business.findOne).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should throw error if business not found', async () => {
      Business.findOne.mockResolvedValue(null);

      await expect(businessService.getStep1('user123')).rejects.toThrow(
        AppError
      );
    });
  });

  describe('Complete Step 4', () => {
    it('should complete registration and generate distributor code', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'Test Business',
        gstNumber: '19AABCT1234H1Z0',
        businessType: 'Wholesaler',
        warehouseName: 'Warehouse 1',
        distributorCode: null,
        isCompleted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findOne.mockResolvedValue(mockBusiness);

      const result = await businessService.completeStep4('user123');

      expect(result.isCompleted).toBe(true);
      expect(result.distributorCode).toMatch(/^DIST\d{4}$/);
    });

    it('should throw error if required fields are missing', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'Test Business',
        gstNumber: null,
        businessType: null,
        warehouseName: null,
      };

      Business.findOne.mockResolvedValue(mockBusiness);

      await expect(businessService.completeStep4('user123')).rejects.toThrow(
        /Please complete all steps/
      );
    });
  });
});
