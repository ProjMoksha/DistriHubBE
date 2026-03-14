const request = require('supertest');
const app = require('../../../src/app');
const Business = require('../../../src/models/Business');
const User = require('../../../src/models/User');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../../src/models/Business');
jest.mock('../../../src/models/User');

describe('Business API Integration Tests - New Endpoints', () => {
  let token;
  let userId = 'user123';
  let businessId = 'business123';

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate mock JWT token
    token = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '1h',
    });
  });

  // ==================== GET BUSINESS TYPES ====================

  describe('GET /api/business/types', () => {
    it('should return all business types without authentication', async () => {
      const response = await request(app).get('/api/business/types');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.businessTypes).toEqual([
        'Wholesaler',
        'Manufacturer',
        'Distributor',
        'Retailer',
      ]);
    });
  });

  // ==================== CREATE BUSINESS ====================

  describe('POST /api/business/CreateBusiness', () => {
    it('should create a new business with valid data', async () => {
      const mockBusiness = {
        _id: businessId,
        userId,
        legalBusinessName: 'ABC Distribution',
        proprietorName: 'John Doe',
        businessPhone: '9876543210',
        businessEmail: 'john@example.com',
        addressLine1: '123 Street',
        area: 'Downtown',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: 'ABC Distribution',
          proprietorName: 'John Doe',
          businessPhone: '9876543210',
          businessEmail: 'john@example.com',
          addressLine1: '123 Street',
          area: 'Downtown',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.businessId).toBe(businessId);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: 'ABC Distribution',
          // Missing other required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .send({
          legalBusinessName: 'ABC Distribution',
        });

      expect(response.status).toBe(401);
    });
  });

  // ==================== GET BUSINESS ====================

  describe('GET /api/business/CreateBusiness/:id', () => {
    it('should retrieve business details by ID', async () => {
      const mockBusiness = {
        _id: businessId,
        legalBusinessName: 'ABC Distribution',
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .get(`/api/business/CreateBusiness/${businessId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.legalBusinessName).toBe('ABC Distribution');
    });

    it('should return 404 if business not found', async () => {
      Business.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/business/CreateBusiness/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  // ==================== UPDATE BUSINESS ====================

  describe('PUT /api/business/CreateBusiness/:id', () => {
    it('should update business details', async () => {
      const mockBusiness = {
        _id: businessId,
        legalBusinessName: 'Updated Business Name',
      };

      Business.findByIdAndUpdate.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .put(`/api/business/CreateBusiness/${businessId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: 'Updated Business Name',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== DELETE BUSINESS ====================

  describe('DELETE /api/business/CreateBusiness/:id', () => {
    it('should delete business', async () => {
      const mockBusiness = {
        _id: businessId,
        legalBusinessName: 'ABC Distribution',
      };

      Business.findByIdAndDelete.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .delete(`/api/business/CreateBusiness/${businessId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== VERIFY BUSINESS ====================

  describe('POST /api/business/VerifyBusiness', () => {
    it('should verify business with GST, PAN, and business type', async () => {
      const mockBusiness = {
        _id: businessId,
        businessType: 'Distributor',
        gstNumber: '27AABCU1234H1Z0',
        panNumber: 'ABCDE1234F',
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .post('/api/business/VerifyBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          businessType: 'Distributor',
          gstNumber: '27AABCU1234H1Z0',
          panNumber: 'ABCDE1234F',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.businessId).toBe(businessId);
    });

    it('should reject invalid GST format', async () => {
      const response = await request(app)
        .post('/api/business/VerifyBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          businessType: 'Distributor',
          gstNumber: 'INVALID_GST',
          panNumber: 'ABCDE1234F',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid PAN format', async () => {
      const response = await request(app)
        .post('/api/business/VerifyBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          businessType: 'Distributor',
          gstNumber: '27AABCU1234H1Z0',
          panNumber: 'INVALID_PAN',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid business type', async () => {
      const response = await request(app)
        .post('/api/business/VerifyBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          businessType: 'InvalidType',
          gstNumber: '27AABCU1234H1Z0',
          panNumber: 'ABCDE1234F',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ==================== CREATE WAREHOUSE ====================

  describe('POST /api/business/CreateWareHouse', () => {
    it('should create warehouse and return distributor code', async () => {
      const mockBusiness = {
        _id: businessId,
        warehouseName: 'Main Warehouse',
        contactPerson: 'Jane Smith',
        fullAddress: '123 Warehouse Lane',
        warehouseCity: 'Mumbai',
        warehousePincode: '400020',
        warehouseState: 'Maharashtra',
        distributorCode: 'DIST5678',
        isCompleted: true,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .post('/api/business/CreateWareHouse')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          warehouseName: 'Main Warehouse',
          contactPerson: 'Jane Smith',
          fullAddress: '123 Warehouse Lane',
          warehouseCity: 'Mumbai',
          warehousePincode: '400020',
          warehouseState: 'Maharashtra',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.distributorCode).toMatch(/^DIST\d{4}$/);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/business/CreateWareHouse')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          warehouseName: 'Main Warehouse',
          // Missing other required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid pincode format', async () => {
      const response = await request(app)
        .post('/api/business/CreateWareHouse')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          warehouseName: 'Main Warehouse',
          contactPerson: 'Jane Smith',
          fullAddress: '123 Warehouse Lane',
          warehouseCity: 'Mumbai',
          warehousePincode: '12345', // Invalid - should be 6 digits
          warehouseState: 'Maharashtra',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ==================== GET WAREHOUSE ====================

  describe('GET /api/business/CreateWareHouse/:businessId', () => {
    it('should retrieve warehouse details', async () => {
      const mockBusiness = {
        _id: businessId,
        warehouseName: 'Main Warehouse',
        distributorCode: 'DIST5678',
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .get(`/api/business/CreateWareHouse/${businessId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== UPDATE WAREHOUSE ====================

  describe('PUT /api/business/CreateWareHouse', () => {
    it('should update warehouse details', async () => {
      const mockBusiness = {
        _id: businessId,
        warehouseCity: 'Pune',
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .put('/api/business/CreateWareHouse')
        .set('Authorization', `Bearer ${token}`)
        .send({
          businessId,
          warehouseCity: 'Pune',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== DELETE WAREHOUSE ====================

  describe('DELETE /api/business/CreateWareHouse', () => {
    it('should delete warehouse and reset registration', async () => {
      const mockBusiness = {
        _id: businessId,
        warehouseName: undefined,
        distributorCode: undefined,
        isCompleted: false,
      };

      Business.findById.mockResolvedValue(mockBusiness);

      const response = await request(app)
        .delete('/api/business/CreateWareHouse')
        .set('Authorization', `Bearer ${token}`)
        .send({ businessId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ==================== AUTHENTICATION TESTS ====================

  describe('Authentication Requirements', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app).post('/api/business/CreateBusiness');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          legalBusinessName: 'Test',
        });

      expect(response.status).toBe(401);
    });

    it('should allow requests with valid token', async () => {
      const mockBusiness = {
        _id: businessId,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: 'ABC Distribution',
          proprietorName: 'John Doe',
          businessPhone: '9876543210',
          businessEmail: 'john@example.com',
          addressLine1: '123 Street',
          area: 'Downtown',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        });

      expect(response.status).toBe(201);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      Business.findById.mockRejectedValue(
        new Error('Database connection error')
      );

      const response = await request(app)
        .get(`/api/business/CreateBusiness/${businessId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it('should validate incoming request data', async () => {
      const response = await request(app)
        .post('/api/business/CreateBusiness')
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: '', // Empty string
          proprietorName: 'J', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ==================== BACKWARD COMPATIBILITY ====================

  describe('Backward Compatibility - Legacy Endpoints', () => {
    it('should still support /api/business/step1 endpoint', async () => {
      const mockBusiness = {
        _id: businessId,
        save: jest.fn().mockResolvedValue(true),
      };

      Business.mockImplementation(() => mockBusiness);
      Business.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/business/step1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          legalBusinessName: 'ABC Distribution',
          proprietorName: 'John Doe',
          businessPhone: '9876543210',
          businessEmail: 'john@example.com',
          addressLine1: '123 Street',
          area: 'Downtown',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
