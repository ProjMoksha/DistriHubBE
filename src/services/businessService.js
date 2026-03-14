const Business = require('../models/Business');
const AppError = require('../utils/appError');

/**
 * Business Service
 * Handles business registration and operations
 */

/**
 * Business types enum
 */
const BUSINESS_TYPES = ['Wholesaler', 'Manufacturer', 'Distributor', 'Retailer'];

/**
 * Get all available business types
 */
const getBusinessTypes = async () => {
  return BUSINESS_TYPES;
};

/**
 * Generate unique distributor code
 * Format: DIST + 4 random digits
 */
const generateDistributorCode = async () => {
  let code;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    const randomFourDigits = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    code = `DIST${randomFourDigits}`;

    // Check if code already exists in database
    const existingCode = await Business.findOne({ distributorCode: code });
    if (!existingCode) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    throw AppError.serverError('Failed to generate unique distributor code');
  }

  return code;
};

/**
 * Create Business (Step 1): Business Basic Details
 */
const createBusiness = async (userId, data) => {
  try {
    // Check if business already exists for this user
    let business = await Business.findOne({ userId });

    if (!business) {
      business = new Business({
        userId,
        ...data,
      });
    } else {
      // Update existing business with step 1 data
      Object.assign(business, data);
    }

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Business by ID
 */
const getBusinessById = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Update Business (Step 1): Business Basic Details
 */
const updateBusiness = async (businessId, data) => {
  try {
    const business = await Business.findByIdAndUpdate(businessId, data, {
      new: true,
      runValidators: true,
    });

    if (!business) {
      throw AppError.notFound('Business not found');
    }

    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete Business
 */
const deleteBusiness = async (businessId) => {
  try {
    const business = await Business.findByIdAndDelete(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify Business (Step 2): Business Type, GST, PAN, and Licence
 */
const verifyBusiness = async (businessId, data) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found. Please complete Step 1 first.');
    }

    // Update business with step 2 data
    business.businessType = data.businessType;
    business.gstNumber = data.gstNumber;
    business.panNumber = data.panNumber;

    if (data.businessLicenceImage) {
      business.businessLicenceImage = {
        imageURL: data.businessLicenceImage.imageURL,
        publicId: data.businessLicenceImage.publicId,
      };
    }

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Update Verify Business (Step 2)
 */
const updateVerifyBusiness = async (businessId, data) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }

    business.businessType = data.businessType || business.businessType;
    business.gstNumber = data.gstNumber || business.gstNumber;
    business.panNumber = data.panNumber || business.panNumber;

    if (data.businessLicenceImage) {
      business.businessLicenceImage = {
        imageURL: data.businessLicenceImage.imageURL,
        publicId: data.businessLicenceImage.publicId,
      };
    }

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete Verify Business (Step 2)
 */
const deleteVerifyBusiness = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }

    business.businessType = undefined;
    business.gstNumber = undefined;
    business.panNumber = undefined;
    business.businessLicenceImage = {
      imageURL: undefined,
      publicId: undefined,
    };

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Create Warehouse (Step 3): Warehouse Details and Generate Distributor Code
 */
const createWarehouse = async (businessId, data) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found. Please complete Step 1 first.');
    }

    // Update business with warehouse data
    business.warehouseName = data.warehouseName;
    business.contactPerson = data.contactPerson;
    business.fullAddress = data.fullAddress;
    business.warehouseCity = data.warehouseCity;
    business.warehousePincode = data.warehousePincode;
    business.warehouseState = data.warehouseState;
    business.locationLink = data.locationLink || null;

    // Generate unique distributor code if not already generated
    if (!business.distributorCode) {
      const distributorCode = await generateDistributorCode();
      business.distributorCode = distributorCode;
    }

    business.isCompleted = true;
    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Warehouse (Step 3) Details
 */
const getWarehouse = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Update Warehouse (Step 3): Warehouse Details
 */
const updateWarehouse = async (businessId, data) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }

    business.warehouseName = data.warehouseName || business.warehouseName;
    business.contactPerson = data.contactPerson || business.contactPerson;
    business.fullAddress = data.fullAddress || business.fullAddress;
    business.warehouseCity = data.warehouseCity || business.warehouseCity;
    business.warehousePincode = data.warehousePincode || business.warehousePincode;
    business.warehouseState = data.warehouseState || business.warehouseState;
    business.locationLink = data.locationLink || business.locationLink;

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete Warehouse (Step 3): Warehouse Details
 */
const deleteWarehouse = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      throw AppError.notFound('Business not found');
    }

    business.warehouseName = undefined;
    business.contactPerson = undefined;
    business.fullAddress = undefined;
    business.warehouseCity = undefined;
    business.warehousePincode = undefined;
    business.warehouseState = undefined;
    business.locationLink = undefined;
    business.distributorCode = undefined;
    business.isCompleted = false;

    await business.save();
    return business;
  } catch (error) {
    throw error;
  }
};

// Export old names for backward compatibility
const createStep1 = createBusiness;
const getStep1 = getBusinessById;
const updateStep1 = updateBusiness;
const deleteStep1 = deleteBusiness;
const createStep2 = verifyBusiness;
const getStep2 = getBusinessById;
const updateStep2 = updateVerifyBusiness;
const deleteStep2 = deleteVerifyBusiness;
const createStep3 = createWarehouse;
const getStep3 = getWarehouse;
const updateStep3 = updateWarehouse;
const deleteStep3 = deleteWarehouse;

module.exports = {
  BUSINESS_TYPES,
  getBusinessTypes,
  generateDistributorCode,
  // New API names
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
  // Old API names (for backward compatibility)
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
};
