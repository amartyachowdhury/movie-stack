const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class OMDbService {
  constructor() {
    this.apiKey = config.omdb.apiKey;
    this.baseURL = config.omdb.baseUrl;
    this.timeout = config.omdb.timeout;
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      params: {
        apikey: this.apiKey,
        plot: 'full' // Get full plot summary
      }
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('OMDb API Request', { url: config.url, params: config.params });
        return config;
      },
      (error) => {
        logger.error('OMDb API Request Error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('OMDb API Response', { 
          url: response.config.url, 
          status: response.status,
          title: response.data?.Title
        });
        return response;
      },
      (error) => {
        logger.error('OMDb API Response Error', { 
          error: error.message,
          status: error.response?.status,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
    
    if (!this.apiKey) {
      logger.warn('OMDB_API_KEY not found. OMDb features will be disabled.');
    }
  }

  async getMovieByTitle(title, year = null) {
    if (!this.apiKey) {
      logger.warn('No OMDb API key available, returning null');
      return null;
    }

    try {
      const params = { t: title };
      if (year) {
        params.y = year;
      }

      const response = await this.client.get('/', { params });
      
      if (response.data.Response === 'False') {
        logger.warn('OMDb movie not found', { title, year, error: response.data.Error });
        return null;
      }

      logger.info('Successfully fetched OMDb movie data', { 
        title: response.data.Title, 
        year: response.data.Year 
      });
      
      return this.formatOMDbData(response.data);
    } catch (error) {
      logger.error('Error fetching OMDb movie data', { 
        error: error.message, 
        title, 
        year 
      });
      return null;
    }
  }

  async getMovieByIMDbId(imdbId) {
    if (!this.apiKey) {
      logger.warn('No OMDb API key available, returning null');
      return null;
    }

    try {
      const response = await this.client.get('/', {
        params: { i: imdbId }
      });
      
      if (response.data.Response === 'False') {
        logger.warn('OMDb movie not found', { imdbId, error: response.data.Error });
        return null;
      }

      logger.info('Successfully fetched OMDb movie data by IMDB ID', { 
        imdbId, 
        title: response.data.Title 
      });
      
      return this.formatOMDbData(response.data);
    } catch (error) {
      logger.error('Error fetching OMDb movie data by IMDB ID', { 
        error: error.message, 
        imdbId 
      });
      return null;
    }
  }

  formatOMDbData(data) {
    // Parse ratings from the Ratings array
    const ratings = {};
    if (data.Ratings && Array.isArray(data.Ratings)) {
      data.Ratings.forEach(rating => {
        switch (rating.Source) {
          case 'Internet Movie Database':
            ratings.imdb = {
              rating: parseFloat(rating.Value.split('/')[0]),
              votes: data.imdbVotes ? parseInt(data.imdbVotes.replace(/,/g, '')) : null
            };
            break;
          case 'Rotten Tomatoes':
            ratings.rottenTomatoes = {
              score: parseInt(rating.Value.replace('%', '')),
              type: rating.Value.includes('%') ? 'percentage' : 'rating'
            };
            break;
          case 'Metacritic':
            ratings.metacritic = {
              score: parseInt(rating.Value.split('/')[0]),
              maxScore: parseInt(rating.Value.split('/')[1]) || 100
            };
            break;
        }
      });
    }

    return {
      imdbId: data.imdbID,
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      released: data.Released,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      writer: data.Writer,
      actors: data.Actors,
      plot: data.Plot,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      poster: data.Poster,
      ratings: ratings,
      metascore: data.Metascore ? parseInt(data.Metascore) : null,
      imdbRating: data.imdbRating ? parseFloat(data.imdbRating) : null,
      imdbVotes: data.imdbVotes ? parseInt(data.imdbVotes.replace(/,/g, '')) : null,
      type: data.Type,
      dvd: data.DVD,
      boxOffice: data.BoxOffice,
      production: data.Production,
      website: data.Website,
      response: data.Response === 'True'
    };
  }

  // Helper method to extract year from TMDB release date
  extractYearFromDate(dateString) {
    if (!dateString) return null;
    return new Date(dateString).getFullYear();
  }

  // Helper method to clean title for better matching
  cleanTitle(title) {
    if (!title) return null;
    return title
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
}

module.exports = OMDbService;
