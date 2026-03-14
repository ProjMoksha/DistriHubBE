const Joi = require('joi');
const {
  GST_REGEX,
  PAN_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  PINCODE_REGEX,
} = require('../constants/regex');

/**
 * Business Registration Validation Schemas
 */

// CreateBusiness (Step 1): Business Basic Details
const createBusinessSchema = Joi.object({
  legalBusinessName: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Legal business name must be at least 3 characters',
    'string.max': 'Legal business name cannot exceed 255 characters',
    'any.required': 'Legal business name is required',
  }),
  proprietorName: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Proprietor name must be at least 3 characters',
    'string.max': 'Proprietor name cannot exceed 255 characters',
    'any.required': 'Proprietor name is required',
  }),
  businessPhone: Joi.string()
    .pattern(PHONE_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number. Must be a 10-digit number.',
      'any.required': 'Business phone number is required',
    }),
  businessEmail: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'any.required': 'Business email is required',
    }),
  addressLine1: Joi.string().min(5).max(255).required().messages({
    'string.min': 'Address line 1 must be at least 5 characters',
    'string.max': 'Address line 1 cannot exceed 255 characters',
    'any.required': 'Address line 1 is required',
  }),
  area: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Area must be at least 2 characters',
    'string.max': 'Area cannot exceed 100 characters',
    'any.required': 'Area is required',
  }),
  city: Joi.string().min(2).max(100).required().messages({
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City cannot exceed 100 characters',
    'any.required': 'City is required',
  }),
  state: Joi.string().min(2).max(100).required().messages({
    'string.min': 'State must be at least 2 characters',
    'string.max': 'State cannot exceed 100 characters',
    'any.required': 'State is required',
  }),
  pincode: Joi.string()
    .pattern(PINCODE_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid pincode. Must be a 6-digit number.',
      'any.required': 'Pincode is required',
    }),
});

// VerifyBusiness (Step 2): Document & Business Type Details
const verifyBusinessSchema = Joi.object({
  businessId: Joi.string().required().messages({
    'any.required': 'Business ID is required',
  }),
  businessType: Joi.string()
    .valid('Wholesaler', 'Manufacturer', 'Distributor', 'Retailer')
    .required()
    .messages({
      'any.only':
        'Business type must be one of: Wholesaler, Manufacturer, Distributor, Retailer',
      'any.required': 'Business type is required',
    }),
  gstNumber: Joi.string()
    .pattern(GST_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid GST number format',
      'any.required': 'GST number is required',
    }),
  panNumber: Joi.string()
    .pattern(PAN_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid PAN number format',
      'any.required': 'PAN number is required',
    }),
  businessLicenceImage: Joi.any().optional(), // File validation handled by multer
});

// CreateWareHouse (Step 3): Warehouse Details
const createWarehouseSchema = Joi.object({
  businessId: Joi.string().required().messages({
    'any.required': 'Business ID is required',
  }),
  warehouseName: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Warehouse name must be at least 3 characters',
    'string.max': 'Warehouse name cannot exceed 255 characters',
    'any.required': 'Warehouse name is required',
  }),
  contactPerson: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Contact person name must be at least 3 characters',
    'string.max': 'Contact person name cannot exceed 255 characters',
    'any.required': 'Contact person name is required',
  }),
  fullAddress: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Full address must be at least 10 characters',
    'string.max': 'Full address cannot exceed 500 characters',
    'any.required': 'Full address is required',
  }),
  warehouseCity: Joi.string().min(2).max(100).required().messages({
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City cannot exceed 100 characters',
    'any.required': 'Warehouse city is required',
  }),
  warehousePincode: Joi.string()
    .pattern(PINCODE_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid pincode. Must be a 6-digit number.',
      'any.required': 'Warehouse pincode is required',
    }),
  warehouseState: Joi.string().min(2).max(100).required().messages({
    'string.min': 'State must be at least 2 characters',
    'string.max': 'State cannot exceed 100 characters',
    'any.required': 'Warehouse state is required',
  }),
  locationLink: Joi.string().uri().min(5).max(500).optional().messages({
    'string.uri': 'Location link must be a valid URL',
    'string.min': 'Location link must be at least 5 characters',
    'string.max': 'Location link cannot exceed 500 characters',
  }),
});

module.exports = {
  createBusinessSchema,
  verifyBusinessSchema,
  createWarehouseSchema,
  // Keep old names for backward compatibility
  step1Schema: createBusinessSchema,
  step2Schema: verifyBusinessSchema,
  step3Schema: createWarehouseSchema,
};
