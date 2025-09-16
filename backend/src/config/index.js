// Configuration management for Movie Stack Backend
require('dotenv').config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // TMDB API Configuration
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
    timeout: parseInt(process.env.TMDB_TIMEOUT) || 10000,
  },

  // OMDb API Configuration
  omdb: {
    apiKey: process.env.OMDB_API_KEY,
    baseUrl: process.env.OMDB_BASE_URL || 'http://www.omdbapi.com',
    timeout: parseInt(process.env.OMDB_TIMEOUT) || 10000,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // API Configuration
  api: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
    },
    timeout: parseInt(process.env.API_TIMEOUT) || 30000,
  },
};

// Validation
const validateConfig = () => {
  const errors = [];

  if (!config.tmdb.apiKey) {
    errors.push('TMDB_API_KEY is required');
  }

  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
};

// Validate configuration on load
try {
  validateConfig();
} catch (error) {
  console.error('❌ Configuration Error:', error.message);
  if (config.server.nodeEnv === 'production') {
    process.exit(1);
  } else {
    console.warn('⚠️  Running in development mode with invalid configuration');
  }
}

module.exports = config;
