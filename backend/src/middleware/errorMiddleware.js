const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  const isProduction = process.env.NODE_ENV === 'production';

  // Default error shape
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'An unexpected internal server error occurred.';
  let errors = null;

  // ── express-validator validation errors ────────────────────────────────────
  if (Array.isArray(err.errors) && err.errors.length > 0 && err.errors[0].msg) {
    statusCode = 422;
    message = 'Validation failed.';
    errors = err.errors.map((e) => ({ field: e.path || e.param, message: e.msg }));
  }

  // ── JWT errors ──────────────────────────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // ── PostgreSQL / pg errors ──────────────────────────────────────────────────
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        statusCode = 409;
        message = 'A record with those details already exists.';
        break;
      case '23503': // foreign_key_violation
        statusCode = 409;
        message = 'Referenced resource does not exist.';
        break;
      case '22P02': // invalid_text_representation (e.g. bad UUID)
        statusCode = 400;
        message = 'Invalid ID format supplied.';
        break;
      case 'ECONNREFUSED':
      case '08006':
      case '08001':
      case '08004':
        statusCode = 503;
        message = 'Database connection error. Please try again later.';
        break;
      default:
        break;
    }
  }

  // Log full error in non-production environments
  if (!isProduction) {
    console.error('[Error]', err);
  } else {
    // In production, log only essential details (no stack)
    console.error(`[Error] ${statusCode} - ${message} | Path: ${req.path}`);
  }

  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Only attach stack trace in development
  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
