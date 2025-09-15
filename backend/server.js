const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import TMDB service
const tmdbService = require('./services/tmdbService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function for consistent API responses
const createResponse = (success, message, data = null, pagination = null) => {
  const response = { success, message };
  if (data !== null) {
    response.data = pagination ? { items: data, pagination } : data;
  }
  return response;
};

// API Routes - TMDB Only

// Get popular movies from TMDB
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    
    const pagination = {
      page,
      limit: 20,
      total: movies.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: page > 1
    };
    
    res.json(createResponse(true, 'Popular movies retrieved successfully', movies, pagination));
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json(createResponse(false, 'Error fetching popular movies'));
  }
});

// Get top rated movies from TMDB
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getTopRatedMovies(page);
    
    const pagination = {
      page,
      limit: 20,
      total: movies.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: page > 1
    };
    
    res.json(createResponse(true, 'Top rated movies retrieved successfully', movies, pagination));
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json(createResponse(false, 'Error fetching top rated movies'));
  }
});

// Search movies using TMDB
app.get('/api/movies/search', async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    
    if (!query) {
      res.status(400).json(createResponse(false, 'Search query is required'));
      return;
    }
    
    const movies = await tmdbService.searchMovies(query, page);
    
    const pagination = {
      page,
      limit: 20,
      total: movies.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: page > 1
    };
    
    res.json(createResponse(true, 'Search results retrieved successfully', movies, pagination));
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json(createResponse(false, 'Error searching movies'));
  }
});

// Get movie details from TMDB
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const movieDetails = await tmdbService.getMovieDetails(movieId);
    
    res.json(createResponse(true, 'Movie details retrieved successfully', movieDetails));
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json(createResponse(false, 'Error fetching movie details'));
  }
});

// Get genres from TMDB
app.get('/api/genres', async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();
    
    res.json(createResponse(true, 'Genres retrieved successfully', genres));
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json(createResponse(false, 'Error fetching genres'));
  }
});

// Get movies (defaults to popular movies)
app.get('/api/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    
    const pagination = {
      page,
      limit: 20,
      total: movies.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: page > 1
    };
    
    res.json(createResponse(true, 'Movies retrieved successfully', movies, pagination));
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json(createResponse(false, 'Error fetching movies'));
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json(createResponse(true, 'API is healthy', { status: 'running' }));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(createResponse(false, 'Something went wrong!'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse(false, 'Route not found'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Movie Stack Backend running on port ${PORT}`);
  console.log(`🎬 Using TMDB API only - no local database`);
});
