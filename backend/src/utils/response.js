// Response utility for consistent API responses
const logger = require('./logger');

class ResponseHelper {
  static success(res, message, data = null, pagination = null, statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== null) {
      response.data = pagination ? { items: data, pagination } : data;
    }

    logger.info(`API Success: ${message}`, { statusCode, hasData: !!data });
    return res.status(statusCode).json(response);
  }

  static error(res, message, error = null, statusCode = 500) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error;
    }

    logger.error(`API Error: ${message}`, { statusCode, error: error?.message });
    return res.status(statusCode).json(response);
  }

  static validationError(res, message, errors = []) {
    const response = {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };

    logger.warn(`Validation Error: ${message}`, { errors });
    return res.status(400).json(response);
  }

  static notFound(res, message = 'Resource not found') {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    logger.warn(`Not Found: ${message}`);
    return res.status(404).json(response);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    logger.warn(`Unauthorized: ${message}`);
    return res.status(401).json(response);
  }

  static rateLimitExceeded(res, message = 'Too many requests') {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    logger.warn(`Rate Limit Exceeded: ${message}`);
    return res.status(429).json(response);
  }
}

module.exports = ResponseHelper;
