const Joi = require('joi');
const { EMAIL_REGEX } = require('../constants/regex');

/**
 * Authentication Validation Schemas
 */

// Register validation schema
const registerSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
      'any.required': 'Password is required',
    }),
  confirmPassword: Joi.when('password', {
    is: Joi.exist(),
    then: Joi.string()
      .valid(Joi.ref('password'))
      .optional()
      .messages({
        'any.only': 'Passwords do not match',
      }),
    otherwise: Joi.any().optional(),
  }),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'any.required': 'Email is required',
    }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Profile update validation schema
const updateProfileSchema = Joi.object({
  email: Joi.string()
    .pattern(EMAIL_REGEX)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid email format',
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .optional()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
    }),
  confirmPassword: Joi.when('password', {
    is: Joi.exist(),
    then: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
      }),
  }),
}).min(1);

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
