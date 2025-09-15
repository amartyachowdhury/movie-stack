// Movie routes for the Movie Stack API
const express = require('express');
const movieController = require('../controllers/movieController');
const ErrorHandler = require('../middleware/errorHandler');

const router = express.Router();

// Movie routes
router.get('/', ErrorHandler.handleAsync(movieController.getMovies));
router.get('/popular', ErrorHandler.handleAsync(movieController.getPopularMovies));
router.get('/top-rated', ErrorHandler.handleAsync(movieController.getTopRatedMovies));
router.get('/search', ErrorHandler.handleAsync(movieController.searchMovies));
router.get('/:id', ErrorHandler.handleAsync(movieController.getMovieDetails));

module.exports = router;
