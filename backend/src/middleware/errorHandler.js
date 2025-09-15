// Error handling middleware for Movie Stack Backend
const logger = require('../utils/logger');
const ResponseHelper = require('../utils/response');

class ErrorHandler {
  static handleError(err, req, res, next) {
    // Log the error
    logger.error('Unhandled Error', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
      return ResponseHelper.validationError(res, 'Validation failed', err.errors);
    }

    if (err.name === 'CastError') {
      return ResponseHelper.validationError(res, 'Invalid ID format');
    }

    if (err.code === 11000) {
      return ResponseHelper.validationError(res, 'Duplicate entry');
    }

    if (err.name === 'JsonWebTokenError') {
      return ResponseHelper.unauthorized(res, 'Invalid token');
    }

    if (err.name === 'TokenExpiredError') {
      return ResponseHelper.unauthorized(res, 'Token expired');
    }

    // Default error response
    const message = process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message;

    return ResponseHelper.error(res, message, err);
  }

  static handleNotFound(req, res, next) {
    return ResponseHelper.notFound(res, `Route ${req.originalUrl} not found`);
  }

  static handleAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = ErrorHandler;
