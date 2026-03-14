const ApiResponse = require('../utils/apiResponse');
const asyncWrapper = require('../middleware/asyncWrapper');
const businessService = require('../services/businessService');
const fileService = require('../services/fileService');

/**
 * Business Controller
 * Handles business registration and operations
 */

// ==================== BUSINESS TYPES ====================

/**
 * Get All Business Types
 */
const getBusinessTypes = asyncWrapper(async (req, res, next) => {
  const businessTypes = await businessService.getBusinessTypes();

  res.status(200).json(
    ApiResponse.success('Business types retrieved successfully', {
      businessTypes,
    })
  );
});

// ==================== CREATE BUSINESS (Step 1) ====================

/**
 * Create Business: Basic Business Details
 */
const createBusiness = asyncWrapper(async (req, res, next) => {
  const userId = req.user.userId;
  const data = req.body;

  const business = await businessService.createBusiness(userId, data);

  res.status(201).json(
    ApiResponse.success('Business created successfully. Proceeding to verification step..', {
      businessId: business._id,
      business,
    })
  );
});

/**
 * Get Business by ID
 */
const getBusinessById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const business = await businessService.getBusinessById(id);

  res.status(200).json(
    ApiResponse.success('Business details retrieved', business)
  );
});

/**
 * Update Business: Basic Business Details
 */
const updateBusiness = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const business = await businessService.updateBusiness(id, data);

  res.status(200).json(
    ApiResponse.success('Business details updated', business)
  );
});

/**
 * Delete Business
 */
const deleteBusiness = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  await businessService.deleteBusiness(id);

  res.status(200).json(
    ApiResponse.success('Business deleted successfully', null)
  );
});

// ==================== VERIFY BUSINESS (Step 2) ====================

/**
 * Verify Business: Business Type, GST, PAN, and Licence
 */
const verifyBusiness = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;
  const data = req.body;

  // Upload image to Cloudinary if provided
  if (req.file) {
    const uploadResult = await fileService.uploadToCloudinary(
      req.file,
      'distrihub/business-licences'
    );
    data.businessLicenceImage = uploadResult;
  }

  const business = await businessService.verifyBusiness(businessId, data);

  res.status(200).json(
    ApiResponse.success('Business verified successfully. Proceeding to warehouse setup..', {
      businessId: business._id,
      business,
    })
  );
});

/**
 * Update Verify Business Details
 */
const updateVerifyBusiness = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;
  const data = req.body;

  // Upload new image if provided
  if (req.file) {
    const uploadResult = await fileService.uploadToCloudinary(
      req.file,
      'distrihub/business-licences'
    );
    data.businessLicenceImage = uploadResult;
  }

  const business = await businessService.updateVerifyBusiness(businessId, data);

  res.status(200).json(
    ApiResponse.success('Business verification details updated', {
      businessId: business._id,
      business,
    })
  );
});

/**
 * Delete Verify Business Details
 */
const deleteVerifyBusiness = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;

  const business = await businessService.getBusinessById(businessId);

  // Delete image from Cloudinary if exists
  if (business.businessLicenceImage?.publicId) {
    await fileService.deleteFromCloudinary(
      business.businessLicenceImage.publicId
    );
  }

  await businessService.deleteVerifyBusiness(businessId);

  res.status(200).json(
    ApiResponse.success('Business verification details deleted', null)
  );
});

// ==================== CREATE WAREHOUSE (Step 3) ====================

/**
 * Create Warehouse: Warehouse Details and Generate Distributor Code
 */
const createWarehouse = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;
  const data = req.body;

  const business = await businessService.createWarehouse(businessId, data);

  res.status(201).json(
    ApiResponse.success(
      'Registration completed! Your distributor code has been generated.',
      {
        businessId: business._id,
        distributorCode: business.distributorCode,
        business,
      }
    )
  );
});

/**
 * Get Warehouse Details
 */
const getWarehouse = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.params;

  const business = await businessService.getWarehouse(businessId);

  res.status(200).json(
    ApiResponse.success('Warehouse details retrieved', business)
  );
});

/**
 * Update Warehouse Details
 */
const updateWarehouse = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;
  const data = req.body;

  const business = await businessService.updateWarehouse(businessId, data);

  res.status(200).json(
    ApiResponse.success('Warehouse details updated', {
      businessId: business._id,
      business,
    })
  );
});

/**
 * Delete Warehouse Details (and reset distributor code)
 */
const deleteWarehouse = asyncWrapper(async (req, res, next) => {
  const { businessId } = req.body;

  await businessService.deleteWarehouse(businessId);

  res.status(200).json(
    ApiResponse.success('Warehouse details deleted', null)
  );
});

// ==================== LEGACY STEP ENDPOINTS (Backward Compatibility) ====================

// Step 1 (Backward compatible)
const createStep1 = createBusiness;
const getStep1 = getBusinessById;
const updateStep1 = updateBusiness;
const deleteStep1 = deleteBusiness;

// Step 2 (Backward compatible)
const createStep2 = verifyBusiness;
const getStep2 = getBusinessById;
const updateStep2 = updateVerifyBusiness;
const deleteStep2 = deleteVerifyBusiness;

// Step 3 (Backward compatible)
const createStep3 = createWarehouse;
const getStep3 = getWarehouse;
const updateStep3 = updateWarehouse;
const deleteStep3 = deleteWarehouse;

/**
 * Complete Step 4: (Legacy - now part of createWarehouse)
 */
const completeStep4 = asyncWrapper(async (req, res, next) => {
  const userId = req.user.userId;

  // For legacy support, find business by userId
  const business = await businessService.getStep1(userId);

  res.status(200).json(
    ApiResponse.success(
      'Registration completed! Your distributor code has been generated.',
      {
        business,
        distributorCode: business.distributorCode,
      }
    )
  );
});

module.exports = {
  // New API names
  getBusinessTypes,
  createBusiness,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  verifyBusiness,
  updateVerifyBusiness,
  deleteVerifyBusiness,
  createWarehouse,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse,
  // Legacy API names (backward compatibility)
  createStep1,
  getStep1,
  updateStep1,
  deleteStep1,
  createStep2,
  getStep2,
  updateStep2,
  deleteStep2,
  createStep3,
  getStep3,
  updateStep3,
  deleteStep3,
  completeStep4,
};
