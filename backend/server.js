// Movie Stack Backend Server Entry Point
const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');

// Start server
const server = app.listen(config.server.port, config.server.host, () => {
  logger.success('Movie Stack Backend Server Started', {
    port: config.server.port,
    host: config.server.host,
    environment: config.server.nodeEnv,
    tmdbConfigured: !!config.tmdb.apiKey
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});
