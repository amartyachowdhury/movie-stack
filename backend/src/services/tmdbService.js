const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class TMDBService {
  constructor() {
    this.apiKey = config.tmdb.apiKey;
    this.baseURL = config.tmdb.baseUrl;
    this.imageBaseURL = config.tmdb.imageBaseUrl;
    this.timeout = config.tmdb.timeout;
    
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
          append_to_response: 'credits,videos,similar'
        }
      });

      logger.info('Successfully fetched movie details', { movieId, title: response.data.title });
      return this.formatMovieDetails(response.data);
    } catch (error) {
      logger.error('Error fetching movie details', { error: error.message, movieId });
      return this.getSampleMovieDetails(movieId);
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

  formatMovieDetails(movie) {
    const genres = movie.genres ? movie.genres.map(g => ({
      id: g.id,
      name: g.name
    })) : [];

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

    return {
      tmdb_id: movie.id,
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
      }
    };
  }

  // Fallback sample data when API is not available
  getSampleMovies() {
    return [
      {
        id: 550,
        tmdb_id: 550,
        title: "Fight Club",
        overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        genres: "Drama",
        release_date: "1999-10-15",
        poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        backdrop_path: "/87hTDiay2N2qWyX4Dx7d0T6B9Y.jpg",
        vote_average: 8.4,
        vote_count: 26280,
        popularity: 61.42,
        adult: 0,
        original_language: "en",
        original_title: "Fight Club",
        video: 0
      },
      {
        id: 13,
        tmdb_id: 13,
        title: "Forrest Gump",
        overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
        genres: "Comedy,Drama,Romance",
        release_date: "1994-06-23",
        poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        backdrop_path: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
        vote_average: 8.5,
        vote_count: 24593,
        popularity: 61.42,
        adult: 0,
        original_language: "en",
        original_title: "Forrest Gump",
        video: 0
      },
      {
        id: 238,
        tmdb_id: 238,
        title: "The Godfather",
        overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
        genres: "Drama,Crime",
        release_date: "1972-03-14",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        vote_average: 8.7,
        vote_count: 17519,
        popularity: 61.42,
        adult: 0,
        original_language: "en",
        original_title: "The Godfather",
        video: 0
      }
    ];
  }

  getSampleMovieDetails(movieId) {
    const sampleMovies = this.getSampleMovies();
    const movie = sampleMovies.find(m => m.tmdb_id === parseInt(movieId));
    
    if (!movie) {
      throw new Error('Movie not found');
    }

    return this.formatMovieDetails(movie);
  }

  getSampleGenres() {
    return [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" }
    ];
  }
}

module.exports = TMDBService;
