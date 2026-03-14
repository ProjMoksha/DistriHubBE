/**
 * Async Wrapper Middleware
 * Wraps async route handlers to catch promise rejections
 */
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncWrapper;
