const express = require('express');
const validateRequest = require('../middleware/validateRequest');
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/uploadMiddleware');
const businessController = require('../controllers/businessController');
const {
  createBusinessSchema,
  verifyBusinessSchema,
  createWarehouseSchema,
} = require('../validations/businessValidation');

const router = express.Router();

/**
 * Business Registration Routes (All Protected except /types)
 */

// ==================== BUSINESS TYPES ====================

/**
 * @swagger
 * /business/types:
 *   get:
 *     summary: Get all available business types
 *     tags: [Business]
 *     description: Retrieve list of available business types for registration
 *     responses:
 *       200:
 *         description: Business types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     businessTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Wholesaler", "Manufacturer", "Distributor", "Retailer"]
 */
router.get('/types', businessController.getBusinessTypes);

// ==================== CREATE BUSINESS (Step 1) ====================

/**
 * @swagger
 * /business/CreateBusiness:
 *   post:
 *     summary: Create business basic details (Step 1)
 *     tags: [Business - Step 1]
 *     description: Initialize a new business with basic details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - legalBusinessName
 *               - proprietorName
 *               - businessPhone
 *               - businessEmail
 *               - addressLine1
 *               - area
 *               - city
 *               - state
 *               - pincode
 *             properties:
 *               legalBusinessName:
 *                 type: string
 *                 example: "ABC Distribution Pvt Ltd"
 *               proprietorName:
 *                 type: string
 *                 example: "John Doe"
 *               businessPhone:
 *                 type: string
 *                 example: "9876543210"
 *               businessEmail:
 *                 type: string
 *                 example: "business@example.com"
 *               addressLine1:
 *                 type: string
 *                 example: "123 Business Street"
 *               area:
 *                 type: string
 *                 example: "Downtown"
 *               city:
 *                 type: string
 *                 example: "Mumbai"
 *               state:
 *                 type: string
 *                 example: "Maharashtra"
 *               pincode:
 *                 type: string
 *                 example: "400001"
 *     responses:
 *       201:
 *         description: Business created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   get:
 *     summary: Get business basic details
 *     tags: [Business - Step 1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business details retrieved successfully
 *       404:
 *         description: Business not found
 */

router.post(
  '/CreateBusiness',
  authenticate,
  validateRequest(createBusinessSchema),
  businessController.createBusiness
);

/**
 * @swagger
 * /business/CreateBusiness/{id}:
 *   get:
 *     summary: Get business by ID
 *     tags: [Business - Step 1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business retrieved successfully
 *
 *   put:
 *     summary: Update business basic details
 *     tags: [Business - Step 1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               legalBusinessName:
 *                 type: string
 *               proprietorName:
 *                 type: string
 *               businessPhone:
 *                 type: string
 *               businessEmail:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               area:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business updated successfully
 *
 *   delete:
 *     summary: Delete business
 *     tags: [Business - Step 1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business deleted successfully
 */

router.get(
  '/CreateBusiness/:id',
  authenticate,
  businessController.getBusinessById
);

router.put(
  '/CreateBusiness/:id',
  authenticate,
  validateRequest(createBusinessSchema),
  businessController.updateBusiness
);

router.delete(
  '/CreateBusiness/:id',
  authenticate,
  businessController.deleteBusiness
);

// ==================== VERIFY BUSINESS (Step 2) ====================

/**
 * @swagger
 * /business/VerifyBusiness:
 *   post:
 *     summary: Verify business with GST, PAN and Licence (Step 2)
 *     tags: [Business - Step 2]
 *     description: Complete business verification with business type, GST, PAN, and optional licence upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - businessType
 *               - gstNumber
 *               - panNumber
 *             properties:
 *               businessId:
 *                 type: string
 *                 description: Business ID from Step 1
 *               businessType:
 *                 type: string
 *                 enum: [Wholesaler, Manufacturer, Distributor, Retailer]
 *               gstNumber:
 *                 type: string
 *                 example: "27AABCU1234H1Z0"
 *               panNumber:
 *                 type: string
 *                 example: "ABCDE1234F"
 *               businessLicenceImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional business licence image
 *     responses:
 *       200:
 *         description: Business verified successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update business verification details
 *     tags: [Business - Step 2]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *               businessType:
 *                 type: string
 *               gstNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               businessLicenceImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Business verification details updated
 *
 *   delete:
 *     summary: Delete business verification details
 *     tags: [Business - Step 2]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Business verification details deleted
 */

router.post(
  '/VerifyBusiness',
  authenticate,
  upload.single('businessLicenceImage'),
  validateRequest(verifyBusinessSchema),
  businessController.verifyBusiness
);

/**
 * @swagger
 * /business/VerifyBusiness/{id}:
 *   get:
 *     summary: Get business verification details
 *     tags: [Business - Step 2]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Business verification details retrieved
 */

router.get(
  '/VerifyBusiness/:id',
  authenticate,
  businessController.getBusinessById
);

router.put(
  '/VerifyBusiness',
  authenticate,
  upload.single('businessLicenceImage'),
  validateRequest(verifyBusinessSchema),
  businessController.updateVerifyBusiness
);

router.delete(
  '/VerifyBusiness',
  authenticate,
  businessController.deleteVerifyBusiness
);

// ==================== CREATE WAREHOUSE (Step 3) ====================

/**
 * @swagger
 * /business/CreateWareHouse:
 *   post:
 *     summary: Create warehouse and complete registration (Step 3)
 *     tags: [Business - Step 3]
 *     description: Create warehouse details and generate 8-digit distributor code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessId
 *               - warehouseName
 *               - contactPerson
 *               - fullAddress
 *               - warehouseCity
 *               - warehousePincode
 *               - warehouseState
 *             properties:
 *               businessId:
 *                 type: string
 *                 description: Business ID from Step 1
 *               warehouseName:
 *                 type: string
 *                 example: "Main Warehouse"
 *               contactPerson:
 *                 type: string
 *                 example: "Jane Smith"
 *               fullAddress:
 *                 type: string
 *                 example: "123 Warehouse Lane, Industrial Area"
 *               warehouseCity:
 *                 type: string
 *                 example: "Mumbai"
 *               warehousePincode:
 *                 type: string
 *                 example: "400020"
 *               warehouseState:
 *                 type: string
 *                 example: "Maharashtra"
 *               locationLink:
 *                 type: string
 *                 description: Optional Google Maps or location link
 *                 example: "https://maps.google.com/..."
 *     responses:
 *       201:
 *         description: Warehouse created and registration completed with distributor code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     distributorCode:
 *                       type: string
 *                       example: "DIST1234"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update warehouse details
 *     tags: [Business - Step 3]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *               warehouseName:
 *                 type: string
 *               contactPerson:
 *                 type: string
 *               fullAddress:
 *                 type: string
 *               warehouseCity:
 *                 type: string
 *               warehousePincode:
 *                 type: string
 *               warehouseState:
 *                 type: string
 *               locationLink:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse details updated
 *
 *   delete:
 *     summary: Delete warehouse and reset registration
 *     tags: [Business - Step 3]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Warehouse deleted and distributor code reset
 */

router.post(
  '/CreateWareHouse',
  authenticate,
  validateRequest(createWarehouseSchema),
  businessController.createWarehouse
);

/**
 * @swagger
 * /business/CreateWareHouse/{businessId}:
 *   get:
 *     summary: Get warehouse details
 *     tags: [Business - Step 3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Warehouse details retrieved
 */

router.get(
  '/CreateWareHouse/:businessId',
  authenticate,
  businessController.getWarehouse
);

router.put(
  '/CreateWareHouse',
  authenticate,
  validateRequest(createWarehouseSchema),
  businessController.updateWarehouse
);

router.delete(
  '/CreateWareHouse',
  authenticate,
  businessController.deleteWarehouse
);

// ==================== LEGACY STEP ENDPOINTS (Backward Compatibility) ====================

/**
 * @deprecated Use /CreateBusiness instead
 */
router.post(
  '/step1',
  authenticate,
  validateRequest(createBusinessSchema),
  businessController.createStep1
);

router.get('/step1/:id', authenticate, businessController.getStep1);

router.put(
  '/step1/:id',
  authenticate,
  validateRequest(createBusinessSchema),
  businessController.updateStep1
);

router.delete('/step1/:id', authenticate, businessController.deleteStep1);

/**
 * @deprecated Use /VerifyBusiness instead
 */
router.post(
  '/step2',
  authenticate,
  upload.single('businessLicenceImage'),
  validateRequest(verifyBusinessSchema),
  businessController.createStep2
);

router.get('/step2/:id', authenticate, businessController.getStep2);

router.put(
  '/step2/:id',
  authenticate,
  upload.single('businessLicenceImage'),
  validateRequest(verifyBusinessSchema),
  businessController.updateStep2
);

router.delete('/step2/:id', authenticate, businessController.deleteStep2);

/**
 * @deprecated Use /CreateWareHouse instead
 */
router.post(
  '/step3',
  authenticate,
  validateRequest(createWarehouseSchema),
  businessController.createStep3
);

router.get('/step3/:id', authenticate, businessController.getStep3);

router.put(
  '/step3/:id',
  authenticate,
  validateRequest(createWarehouseSchema),
  businessController.updateStep3
);

router.delete('/step3/:id', authenticate, businessController.deleteStep3);

/**
 * @deprecated Distributor code is now generated in /CreateWareHouse
 */
router.post('/step4', authenticate, businessController.completeStep4);

module.exports = router;
