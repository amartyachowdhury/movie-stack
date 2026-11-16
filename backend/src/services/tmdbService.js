const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');
const OMDbService = require('./omdbService');
const {
  SAMPLE_MOVIES,
  SAMPLE_GENRES,
  getSamplePersonDetails,
} = require('./tmdbSampleData');

class TMDBService {
  constructor() {
    this.apiKey = config.tmdb.apiKey;
    this.baseURL = config.tmdb.baseUrl;
    this.imageBaseURL = config.tmdb.imageBaseUrl;
    this.timeout = config.tmdb.timeout;
    this.omdbService = new OMDbService();
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      params: {
        api_key: this.apiKey,
        language: 'en-US'
      }
    });

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug('TMDB API Request', { url: config.url, params: config.params });
        return config;
      },
      (error) => {
        logger.error('TMDB API Request Error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        logger.debug('TMDB API Response', { 
          url: response.config.url, 
          status: response.status,
          dataLength: response.data?.results?.length || 1
        });
        return response;
      },
      (error) => {
        logger.error('TMDB API Response Error', { 
          error: error.message,
          status: error.response?.status,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
    
    if (!this.apiKey) {
      logger.warn('TMDB_API_KEY not found. Using sample data only.');
    }
  }

  async getPopularMovies(page = 1) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample movies');
      return this.getSampleMovies();
    }

    try {
      const response = await this.client.get('/movie/popular', {
        params: { page }
      });

      logger.info('Successfully fetched popular movies', { page, count: response.data.results.length });
      return this.formatMovies(response.data.results);
    } catch (error) {
      logger.error('Error fetching popular movies', { error: error.message, page });
      return this.getSampleMovies();
    }
  }

  async getTopRatedMovies(page = 1) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample movies');
      return this.getSampleMovies();
    }

    try {
      const response = await this.client.get('/movie/top_rated', {
        params: { page }
      });

      logger.info('Successfully fetched top rated movies', { page, count: response.data.results.length });
      return this.formatMovies(response.data.results);
    } catch (error) {
      logger.error('Error fetching top rated movies', { error: error.message, page });
      return this.getSampleMovies();
    }
  }

  async searchMovies(query, page = 1) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample movies');
      return this.getSampleMovies();
    }

    try {
      const response = await this.client.get('/search/movie', {
        params: { query, page }
      });

      logger.info('Successfully searched movies', { query, page, count: response.data.results.length });
      return this.formatMovies(response.data.results);
    } catch (error) {
      logger.error('Error searching movies', { error: error.message, query, page });
      return this.getSampleMovies();
    }
  }

  async discoverMovies(filters = {}, page = 1) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample movies');
      return this.getSampleMovies();
    }

    try {
      const params = {
        page,
        sort_by: filters.sortBy || 'popularity.desc',
        include_adult: false
      };

      // Add filters if provided
      if (filters.genre) params.with_genres = filters.genre;
      if (filters.year) params.year = filters.year;
      if (filters.minRating) params['vote_average.gte'] = filters.minRating;
      if (filters.maxRating) params['vote_average.lte'] = filters.maxRating;
      if (filters.language) params.with_original_language = filters.language;
      if (filters.query) params.query = filters.query;

      const response = await this.client.get('/discover/movie', { params });

      logger.info('Successfully discovered movies', { 
        filters, 
        page, 
        count: response.data.results.length 
      });
      return this.formatMovies(response.data.results);
    } catch (error) {
      logger.error('Error discovering movies', { 
        error: error.message, 
        filters, 
        page 
      });
      return this.getSampleMovies();
    }
  }

  async getMovieDetails(movieId) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample movie details');
      return this.getSampleMovieDetails(movieId);
    }

    try {
      const response = await this.client.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'credits,videos,similar,watch/providers'
        }
      });

      logger.info('Successfully fetched movie details', { movieId, title: response.data.title });
      return await this.formatMovieDetails(response.data);
    } catch (error) {
      logger.error('Error fetching movie details', { error: error.message, movieId });
      return this.getSampleMovieDetails(movieId);
    }
  }

  async getPersonDetails(personId) {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample person details');
      return this.getSamplePersonDetails(personId);
    }

    try {
      const response = await this.client.get(`/person/${personId}`, {
        params: {
          append_to_response: 'movie_credits,external_ids'
        }
      });

      logger.info('Successfully fetched person details', { personId, name: response.data.name });
      return this.formatPersonDetails(response.data);
    } catch (error) {
      logger.error('Error fetching person details', { error: error.message, personId });
      return this.getSamplePersonDetails(personId);
    }
  }

  async searchPersonByName(query) {
    if (!this.apiKey) {
      logger.warn('No API key available, person search not available');
      return null;
    }

    try {
      const response = await this.client.get('/search/person', {
        params: {
          query,
          page: 1,
          include_adult: false
        }
      });

      const [person] = response.data?.results || [];
      if (!person) {
        return null;
      }

      return {
        id: person.id,
        name: person.name,
        profile_path: person.profile_path || '',
        known_for_department: person.known_for_department || ''
      };
    } catch (error) {
      logger.error('Error searching person by name', { error: error.message, query });
      return null;
    }
  }

  async getGenres() {
    if (!this.apiKey) {
      logger.warn('No API key available, returning sample genres');
      return this.getSampleGenres();
    }

    try {
      const response = await this.client.get('/genre/movie/list');
      logger.info('Successfully fetched genres', { count: response.data.genres.length });
      return response.data.genres;
    } catch (error) {
      logger.error('Error fetching genres', { error: error.message });
      return this.getSampleGenres();
    }
  }

  normalizeMovieGenres(genres) {
    if (!genres) return [];
    if (Array.isArray(genres) && genres.length > 0) {
      if (typeof genres[0] === 'object' && genres[0] !== null) {
        return genres
          .filter((g) => g && g.name)
          .map((g) => ({ id: g.id ?? 0, name: g.name }));
      }
      return genres
        .map((id) => parseInt(id, 10))
        .filter((id) => !Number.isNaN(id))
        .map((id) => ({ id, name: `Genre ${id}` }));
    }
    if (typeof genres === 'string' && genres.trim()) {
      return genres
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, index) => ({ id: index, name }));
    }
    return [];
  }

  formatMovies(movies) {
    return movies.map(movie => ({
      id: movie.id, // Use TMDB ID as the primary ID
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      genres: movie.genre_ids ? movie.genre_ids.join(',') : '',
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      adult: movie.adult ? 1 : 0,
      original_language: movie.original_language,
      original_title: movie.original_title,
      video: movie.video ? 1 : 0
    }));
  }

  async formatMovieDetails(movie) {
    const genres = this.normalizeMovieGenres(movie.genres);

    // Format videos data
    const videos = movie.videos?.results || [];
    const trailers = videos.filter(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.official === true
    );
    const teasers = videos.filter(video => 
      video.type === 'Teaser' && 
      video.site === 'YouTube' && 
      video.official === true
    );
    const clips = videos.filter(video => 
      video.type === 'Clip' && 
      video.site === 'YouTube' && 
      video.official === true
    );

    // Get OMDb data
    let omdbData = null;
    try {
      if (movie.imdb_id) {
        omdbData = await this.omdbService.getMovieByIMDbId(movie.imdb_id);
      } else {
        // Try to get by title and year if no IMDB ID
        const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
        omdbData = await this.omdbService.getMovieByTitle(movie.title, year);
      }
    } catch (error) {
      logger.warn('Failed to fetch OMDb data', { 
        movieId: movie.id ?? movie.tmdb_id, 
        title: movie.title, 
        error: error.message 
      });
    }

    return {
      tmdb_id: movie.id ?? movie.tmdb_id,
      title: movie.title,
      overview: movie.overview,
      genres: genres,
      genre_ids: genres.map(g => g.id),
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      adult: movie.adult,
      original_language: movie.original_language,
      original_title: movie.original_title,
      video: movie.video,
      runtime: movie.runtime || 120,
      budget: movie.budget || 0,
      revenue: movie.revenue || 0,
      status: movie.status || 'Released',
      tagline: movie.tagline || '',
      homepage: movie.homepage || '',
      imdb_id: movie.imdb_id || '',
      production_companies: movie.production_companies || [],
      production_countries: movie.production_countries || [],
      spoken_languages: movie.spoken_languages || [],
      cast: movie.credits?.cast?.slice(0, 10) || [],
      crew: movie.credits?.crew?.slice(0, 10) || [],
      similar_movies: movie.similar?.results?.slice(0, 5) || [],
      rating_count: movie.vote_count,
      average_rating: movie.vote_average,
      videos: {
        all: videos,
        trailers: trailers,
        teasers: teasers,
        clips: clips,
        primary_trailer: trailers[0] || teasers[0] || clips[0] || null
      },
      watch_providers: movie['watch/providers'] || null,
      omdb: omdbData
    };
  }

  formatPersonDetails(person) {
    const knownForMovies = [...(person.movie_credits?.cast || [])]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12)
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        character: movie.character,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        popularity: movie.popularity
      }));

    return {
      id: person.id,
      name: person.name,
      biography: person.biography || '',
      birthday: person.birthday || '',
      deathday: person.deathday || '',
      place_of_birth: person.place_of_birth || '',
      known_for_department: person.known_for_department || '',
      also_known_as: person.also_known_as || [],
      gender: person.gender || 0,
      profile_path: person.profile_path || '',
      popularity: person.popularity || 0,
      imdb_id: person.external_ids?.imdb_id || '',
      homepage: person.homepage || '',
      known_for_movies: knownForMovies
    };
  }

  // Fallback sample data when API is not available
  getSampleMovies() {
    return SAMPLE_MOVIES;
  }

  getSampleMovieDetails(movieId) {
    const movie = SAMPLE_MOVIES.find((m) => m.tmdb_id === parseInt(movieId, 10));

    if (!movie) {
      throw new Error('Movie not found');
    }

    return this.formatMovieDetails(movie);
  }

  getSampleGenres() {
    return SAMPLE_GENRES;
  }

  getSamplePersonDetails(personId) {
    return getSamplePersonDetails(personId);
  }
}

module.exports = TMDBService;
