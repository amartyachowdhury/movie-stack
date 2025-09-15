// Genre controller for handling genre-related requests
const TMDBService = require('../services/tmdbService');
const ResponseHelper = require('../utils/response');
const logger = require('../utils/logger');

class GenreController {
  constructor() {
    this.tmdbService = new TMDBService();
  }

  // Get all genres
  getGenres = async (req, res) => {
    try {
      const genres = await this.tmdbService.getGenres();
      return ResponseHelper.success(res, 'Genres retrieved successfully', genres);
    } catch (error) {
      logger.error('Error in getGenres controller', { error: error.message });
      return ResponseHelper.error(res, 'Error fetching genres', error);
    }
  };
}

module.exports = new GenreController();
