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

// API Routes - TMDB Only

// Get popular movies from TMDB
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    
    res.json({
      success: true,
      message: 'Popular movies retrieved successfully',
      data: {
        items: movies,
        pagination: {
          page,
          limit: 20,
          total: movies.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ success: false, message: 'Error fetching popular movies', data: null });
  }
});

// Get top rated movies from TMDB
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getTopRatedMovies(page);
    
    res.json({
      success: true,
      message: 'Top rated movies retrieved successfully',
      data: {
        items: movies,
        pagination: {
          page,
          limit: 20,
          total: movies.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json({ success: false, message: 'Error fetching top rated movies', data: null });
  }
});

// Search movies using TMDB
app.get('/api/movies/search', async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    
    if (!query) {
      res.status(400).json({ success: false, message: 'Search query is required', data: null });
      return;
    }
    
    const movies = await tmdbService.searchMovies(query, page);
    
    res.json({
      success: true,
      message: 'Search results retrieved successfully',
      data: {
        items: movies,
        pagination: {
          page,
          limit: 20,
          total: movies.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ success: false, message: 'Error searching movies', data: null });
  }
});

// Get movie details from TMDB
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const movieDetails = await tmdbService.getMovieDetails(movieId);
    
    res.json({
      success: true,
      message: 'Movie details retrieved successfully',
      data: movieDetails
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ success: false, message: 'Error fetching movie details', data: null });
  }
});

// Get genres from TMDB
app.get('/api/genres', async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();
    
    res.json({
      success: true,
      message: 'Genres retrieved successfully',
      data: genres
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ success: false, message: 'Error fetching genres', data: null });
  }
});

// Get movies (defaults to popular movies)
app.get('/api/movies', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    
    res.json({
      success: true,
      message: 'Movies retrieved successfully',
      data: {
        items: movies,
        pagination: {
          page,
          limit: 20,
          total: movies.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Error fetching movies', data: null });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is healthy', data: { status: 'running' } });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', data: null });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', data: null });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Movie Stack Backend running on port ${PORT}`);
  console.log(`🎬 Using TMDB API only - no local database`);
});
