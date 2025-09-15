// Genre routes for the Movie Stack API
const express = require('express');
const genreController = require('../controllers/genreController');
const ErrorHandler = require('../middleware/errorHandler');

const router = express.Router();

// Genre routes
router.get('/', ErrorHandler.handleAsync(genreController.getGenres));

module.exports = router;
