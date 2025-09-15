// Main routes index for the Movie Stack API
const express = require('express');
const movieRoutes = require('./movieRoutes');
const genreRoutes = require('./genreRoutes');
const ResponseHelper = require('../utils/response');

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  return ResponseHelper.success(res, 'API is healthy', { 
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/movies', movieRoutes);
router.use('/genres', genreRoutes);

module.exports = router;
