const AppError = require('../utils/appError');

/**
 * Joi Validation Middleware
 * Validates request body/params/query against a schema
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const { error, value } = schema.validate(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const messages = error.details.map((detail) => detail.message);
        throw AppError.validation(messages.join(', '));
      }

      // Replace with validated data
      req[source] = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validateRequest;
