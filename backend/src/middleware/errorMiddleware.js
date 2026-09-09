const { sendError } = require('../utils/responseHandler');

/**
 * 404 Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack || err.message || err);

  // PostgreSQL Connection Errors
  if (err.code === 'ECONNREFUSED' || err.code === '28P01' || err.code === '3D000') {
    return sendError(res, 500, 'Database connection error. Please verify PostgreSQL service and credentials.');
  }

  // PostgreSQL syntax / query errors
  if (err.code && err.code.length === 5) {
    return sendError(res, 500, 'Database query error occurred.');
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';

  return sendError(res, statusCode, message);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
