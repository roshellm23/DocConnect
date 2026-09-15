const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

/**
 * Middleware: Verify JWT and attach req.user
 * Expects: Authorization: Bearer <token>
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authentication required. Please log in to continue.');
  }

  const token = authHeader.slice(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, full_name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Your session has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token. Please log in again.');
  }
};

/**
 * Middleware: Require admin role
 * Must be used AFTER authenticate
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'Access denied. Administrator privileges required.');
  }
  next();
};

module.exports = { authenticate, requireAdmin };
