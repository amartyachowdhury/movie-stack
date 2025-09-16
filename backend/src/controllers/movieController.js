// Movie controller for handling movie-related requests
const TMDBService = require('../services/tmdbService');
const ResponseHelper = require('../utils/response');
const logger = require('../utils/logger');

class MovieController {
  constructor() {
    this.tmdbService = new TMDBService();
  }

  // Get popular movies
  getPopularMovies = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const movies = await this.tmdbService.getPopularMovies(page);
      
      const pagination = {
        page,
        limit: 20,
        total: movies.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1
      };
      
      return ResponseHelper.success(res, 'Popular movies retrieved successfully', movies, pagination);
    } catch (error) {
      logger.error('Error in getPopularMovies controller', { error: error.message });
      return ResponseHelper.error(res, 'Error fetching popular movies', error);
    }
  };

  // Get top rated movies
  getTopRatedMovies = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const movies = await this.tmdbService.getTopRatedMovies(page);
      
      const pagination = {
        page,
        limit: 20,
        total: movies.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1
      };
      
      return ResponseHelper.success(res, 'Top rated movies retrieved successfully', movies, pagination);
    } catch (error) {
      logger.error('Error in getTopRatedMovies controller', { error: error.message });
      return ResponseHelper.error(res, 'Error fetching top rated movies', error);
    }
  };

  // Search movies
  searchMovies = async (req, res) => {
    try {
      const { q: query } = req.query;
      const page = parseInt(req.query.page) || 1;
      
      if (!query || query.trim().length === 0) {
        return ResponseHelper.validationError(res, 'Search query is required');
      }

      if (query.trim().length < 2) {
        return ResponseHelper.validationError(res, 'Search query must be at least 2 characters long');
      }
      
      const movies = await this.tmdbService.searchMovies(query.trim(), page);
      
      const pagination = {
        page,
        limit: 20,
        total: movies.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1
      };
      
      return ResponseHelper.success(res, 'Search results retrieved successfully', movies, pagination);
    } catch (error) {
      logger.error('Error in searchMovies controller', { error: error.message, query: req.query.q });
      return ResponseHelper.error(res, 'Error searching movies', error);
    }
  };

  // Get movie details
  getMovieDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const movieId = parseInt(id);
      
      if (!movieId || isNaN(movieId)) {
        return ResponseHelper.validationError(res, 'Invalid movie ID');
      }
      
      const movieDetails = await this.tmdbService.getMovieDetails(movieId);
      
      if (!movieDetails) {
        return ResponseHelper.notFound(res, 'Movie not found');
      }
      
      return ResponseHelper.success(res, 'Movie details retrieved successfully', movieDetails);
    } catch (error) {
      logger.error('Error in getMovieDetails controller', { error: error.message, movieId: req.params.id });
      return ResponseHelper.error(res, 'Error fetching movie details', error);
    }
  };

  // Advanced search with filters
  discoverMovies = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const filters = {
        query: req.query.query,
        genre: req.query.genre,
        year: req.query.year,
        minRating: req.query.minRating,
        maxRating: req.query.maxRating,
        language: req.query.language,
        sortBy: req.query.sortBy || 'popularity.desc'
      };

      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === '') {
          delete filters[key];
        }
      });

      const movies = await this.tmdbService.discoverMovies(filters, page);
      
      const pagination = {
        page,
        limit: 20,
        total: movies.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1
      };
      
      return ResponseHelper.success(res, 'Movies discovered successfully', movies, pagination);
    } catch (error) {
      logger.error('Error in discoverMovies controller', { error: error.message, filters: req.query });
      return ResponseHelper.error(res, 'Error discovering movies', error);
    }
  };

  // Get movies (defaults to popular)
  getMovies = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const movies = await this.tmdbService.getPopularMovies(page);
      
      const pagination = {
        page,
        limit: 20,
        total: movies.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: page > 1
      };
      
      return ResponseHelper.success(res, 'Movies retrieved successfully', movies, pagination);
    } catch (error) {
      logger.error('Error in getMovies controller', { error: error.message });
      return ResponseHelper.error(res, 'Error fetching movies', error);
    }
  };
}

module.exports = new MovieController();
