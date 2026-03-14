const businessService = require('../../../src/services/businessService');
const Business = require('../../../src/models/Business');
const AppError = require('../../../src/utils/appError');

// Mock the Business model
jest.mock('../../../src/models/Business');

describe('Business Service - New API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== BUSINESS TYPES ====================

  describe('getBusinessTypes', () => {
    it('should return all available business types', async () => {
      const types = await businessService.getBusinessTypes();

      expect(types).toEqual([
        'Wholesaler',
        'Manufacturer',
        'Distributor',
        'Retailer',
      ]);
      expect(types).toHaveLength(4);
    });
  });

  // ==================== GENERATE DISTRIBUTOR CODE ====================

  describe('generateDistributorCode', () => {
    it('should generate a unique distributor code with DIST prefix and 4 digits', async () => {
      Business.findOne.mockResolvedValue(null);

      const code = await businessService.generateDistributorCode();

      expect(code).toMatch(/^DIST\d{4}$/);
      expect(code.length).toBe(8);
    });

    it('should ensure generated code is unique by retrying if exists', async () => {
      Business.findOne
        .mockResolvedValueOnce({ distributorCode: 'DIST1234' })
        .mockResolvedValueOnce(null);

      const code = await businessService.generateDistributorCode();

      expect(code).toMatch(/^DIST\d{4}$/);
      expect(Business.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error if unable to generate unique code after max attempts', async () => {
      Business.findOne.mockResolvedValue({ distributorCode: 'DIST9999' });

      await expect(
        businessService.generateDistributorCode()
      ).rejects.toThrow('Failed to generate unique distributor code');
    });
  });

  // ==================== CREATE BUSINESS (Step 1) ====================

  describe('createBusiness', () => {
    it('should create a new business for a user', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'ABC Distribution Pvt Ltd',
        proprietorName: 'John Doe',
        businessPhone: '9876543210',
        businessEmail: 'john@example.com',
        addressLine1: '123 Business Street',
        area: 'Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      const data = {
        legalBusinessName: 'ABC Distribution Pvt Ltd',
        proprietorName: 'John Doe',
        businessPhone: '9876543210',
        businessEmail: 'john@example.com',
        addressLine1: '123 Business Street',
        area: 'Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      };

      const result = await businessService.createBusiness('user123', data);

      expect(result).toEqual(mockBusiness);
      expect(mockBusiness.save).toHaveBeenCalled();
    });

    it('should update existing business if already created', async () => {
      const mockBusiness = {
        userId: 'user123',
        legalBusinessName: 'Old Name',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findOne.mockResolvedValue(mockBusiness);

      const newData = {
        legalBusinessName: 'New Business Name',
      };

      const result = await businessService.createBusiness('user123', newData);

      expect(result.legalBusinessName).toBe('New Business Name');
      expect(mockBusiness.save).toHaveBeenCalled();
    });
  });

  describe('getBusinessById', () => {
    it('should retrieve business by ID', async () => {
      const mockBusiness = {
        _id: 'business123',
        legalBusinessName: 'ABC Distribution',
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const result = await businessService.getBusinessById('business123');

      expect(result).toEqual(mockBusiness);
      expect(Business.findById).toHaveBeenCalledWith('business123');
    });

    it('should throw not found error if business does not exist', async () => {
      Business.findById.mockResolvedValue(null);

      await expect(businessService.getBusinessById('invalid')).rejects.toThrow(
        'Business not found'
      );
    });
  });

  describe('updateBusiness', () => {
    it('should update business basic details', async () => {
      const mockBusiness = {
        _id: 'business123',
        legalBusinessName: 'Updated Name',
      };

      Business.findByIdAndUpdate.mockResolvedValue(mockBusiness);

      const data = { legalBusinessName: 'Updated Name' };
      const result = await businessService.updateBusiness('business123', data);

      expect(result).toEqual(mockBusiness);
      expect(Business.findByIdAndUpdate).toHaveBeenCalledWith(
        'business123',
        data,
        { new: true, runValidators: true }
      );
    });

    it('should throw error if business not found during update', async () => {
      Business.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        businessService.updateBusiness('invalid', {})
      ).rejects.toThrow('Business not found');
    });
  });

  describe('deleteBusiness', () => {
    it('should delete business by ID', async () => {
      const mockBusiness = {
        _id: 'business123',
        legalBusinessName: 'Deleted Business',
      };

      Business.findByIdAndDelete.mockResolvedValue(mockBusiness);

      const result = await businessService.deleteBusiness('business123');

      expect(result).toEqual(mockBusiness);
      expect(Business.findByIdAndDelete).toHaveBeenCalledWith('business123');
    });

    it('should throw error if business not found during delete', async () => {
      Business.findByIdAndDelete.mockResolvedValue(null);

      await expect(businessService.deleteBusiness('invalid')).rejects.toThrow(
        'Business not found'
      );
    });
  });

  // ==================== VERIFY BUSINESS (Step 2) ====================

  describe('verifyBusiness', () => {
    it('should verify business with GST, PAN, and business type', async () => {
      const mockBusiness = {
        _id: 'business123',
        businessType: 'Distributor',
        gstNumber: '27AABCU1234H1Z0',
        panNumber: 'ABCDE1234F',
        businessLicenceImage: null,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const data = {
        businessType: 'Distributor',
        gstNumber: '27AABCU1234H1Z0',
        panNumber: 'ABCDE1234F',
      };

      const result = await businessService.verifyBusiness(
        'business123',
        data
      );

      expect(result.businessType).toBe('Distributor');
      expect(result.gstNumber).toBe('27AABCU1234H1Z0');
      expect(result.panNumber).toBe('ABCDE1234F');
      expect(mockBusiness.save).toHaveBeenCalled();
    });

    it('should handle optional business licence image upload', async () => {
      const mockBusiness = {
        _id: 'business123',
        businessLicenceImage: {
          imageURL: 'https://cloudinary.com/image.jpg',
          publicId: 'public123',
        },
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const data = {
        businessType: 'Wholesaler',
        gstNumber: '27AABCU1234H1Z0',
        panNumber: 'ABCDE1234F',
        businessLicenceImage: {
          imageURL: 'https://cloudinary.com/image.jpg',
          publicId: 'public123',
        },
      };

      const result = await businessService.verifyBusiness(
        'business123',
        data
      );

      expect(result.businessLicenceImage).toEqual({
        imageURL: 'https://cloudinary.com/image.jpg',
        publicId: 'public123',
      });
    });

    it('should throw error if business not found for verification', async () => {
      Business.findById.mockResolvedValue(null);

      await expect(
        businessService.verifyBusiness('invalid', {})
      ).rejects.toThrow('Business not found');
    });
  });

  // ==================== CREATE WAREHOUSE (Step 3) ====================

  describe('createWarehouse', () => {
    it('should create warehouse and generate distributor code', async () => {
      const mockBusiness = {
        _id: 'business123',
        warehouseName: 'Main Warehouse',
        contactPerson: 'Jane Smith',
        fullAddress: '123 Warehouse Lane',
        warehouseCity: 'Mumbai',
        warehousePincode: '400020',
        warehouseState: 'Maharashtra',
        locationLink: 'https://maps.google.com/...',
        distributorCode: null,
        isCompleted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      // Mock findOne for distributor code uniqueness check
      Business.findOne.mockResolvedValue(null);

      const data = {
        warehouseName: 'Main Warehouse',
        contactPerson: 'Jane Smith',
        fullAddress: '123 Warehouse Lane',
        warehouseCity: 'Mumbai',
        warehousePincode: '400020',
        warehouseState: 'Maharashtra',
        locationLink: 'https://maps.google.com/...',
      };

      const result = await businessService.createWarehouse(
        'business123',
        data
      );

      expect(result.warehouseName).toBe('Main Warehouse');
      expect(result.contactPerson).toBe('Jane Smith');
      expect(result.distributorCode).toMatch(/^DIST\d{4}$/);
      expect(result.isCompleted).toBe(true);
      expect(mockBusiness.save).toHaveBeenCalled();
    });

    it('should throw error if business not found for warehouse creation', async () => {
      Business.findById.mockResolvedValue(null);

      await expect(
        businessService.createWarehouse('invalid', {})
      ).rejects.toThrow('Business not found');
    });
  });

  describe('updateWarehouse', () => {
    it('should update warehouse details', async () => {
      const mockBusiness = {
        _id: 'business123',
        warehouseCity: 'Pune',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const data = {
        warehouseCity: 'Pune',
        contactPerson: 'Updated Person',
      };

      const result = await businessService.updateWarehouse(
        'business123',
        data
      );

      expect(result.warehouseCity).toBe('Pune');
      expect(mockBusiness.save).toHaveBeenCalled();
    });
  });

  describe('deleteWarehouse', () => {
    it('should delete warehouse and reset distributor code and completion status', async () => {
      const mockBusiness = {
        _id: 'business123',
        warehouseName: 'Main Warehouse',
        distributorCode: 'DIST5678',
        isCompleted: true,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const result = await businessService.deleteWarehouse('business123');

      expect(result.warehouseName).toBeUndefined();
      expect(result.distributorCode).toBeUndefined();
      expect(result.isCompleted).toBe(false);
      expect(mockBusiness.save).toHaveBeenCalled();
    });
  });

  // ==================== BACKWARD COMPATIBILITY ====================

  describe('Backward Compatibility', () => {
    it('should have legacy createStep1 as alias for createBusiness', () => {
      expect(businessService.createStep1).toBeDefined();
    });

    it('should have legacy createStep2 as alias for verifyBusiness', () => {
      expect(businessService.createStep2).toBeDefined();
    });

    it('should have legacy createStep3 as alias for createWarehouse', () => {
      expect(businessService.createStep3).toBeDefined();
    });
  });

  // ==================== INTEGRATION TESTS ====================

  describe('Complete Business Registration Flow', () => {
    it('should complete full registration flow from create to warehouse', async () => {
      // Step 1: Create Business
      const mockBusiness = {
        _id: 'business123',
        userId: 'user123',
        legalBusinessName: 'ABC Distribution',
        businessType: null,
        gstNumber: null,
        warehouseName: null,
        distributorCode: null,
        isCompleted: false,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      // Create business
      const createData = {
        legalBusinessName: 'ABC Distribution',
        proprietorName: 'John Doe',
        businessPhone: '9876543210',
        businessEmail: 'john@example.com',
        addressLine1: '123 Street',
        area: 'Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      };

      await businessService.createBusiness('user123', createData);

      expect(mockBusiness.save).toHaveBeenCalled();

      // Step 2: Verify Business
      Business.findById.mockResolvedValue(mockBusiness);
      mockBusiness.businessType = 'Distributor';
      mockBusiness.gstNumber = '27AABCU1234H1Z0';

      const verifyData = {
        businessType: 'Distributor',
        gstNumber: '27AABCU1234H1Z0',
        panNumber: 'ABCDE1234F',
      };

      await businessService.verifyBusiness('business123', verifyData);

      expect(mockBusiness.businessType).toBe('Distributor');

      // Step 3: Create Warehouse
      mockBusiness.warehouseName = 'Main Warehouse';
      mockBusiness.distributorCode = 'DIST5678';
      mockBusiness.isCompleted = true;

      const warehouseData = {
        warehouseName: 'Main Warehouse',
        contactPerson: 'Jane Smith',
        fullAddress: '123 Warehouse Lane',
        warehouseCity: 'Mumbai',
        warehousePincode: '400020',
        warehouseState: 'Maharashtra',
      };

      businessService.generateDistributorCode = jest
        .fn()
        .mockResolvedValue('DIST5678');

      await businessService.createWarehouse('business123', warehouseData);

      expect(mockBusiness.isCompleted).toBe(true);
      expect(mockBusiness.distributorCode).toBe('DIST5678');
    });
  });
});
