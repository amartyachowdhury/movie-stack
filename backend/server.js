const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import TMDB service
const tmdbService = require('./services/tmdbService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.join(__dirname, 'movies.db');
const db = new sqlite3.Database(dbPath);

// Create movies table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tmdb_id INTEGER UNIQUE,
    title TEXT NOT NULL,
    overview TEXT,
    genres TEXT,
    release_date TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    vote_average REAL,
    vote_count INTEGER,
    popularity REAL,
    adult INTEGER DEFAULT 0,
    original_language TEXT,
    original_title TEXT,
    video INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample movies if table is empty
  db.get("SELECT COUNT(*) as count FROM movies", (err, row) => {
    if (row.count === 0) {
      const sampleMovies = [
        {
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

      const stmt = db.prepare(`INSERT INTO movies (
        tmdb_id, title, overview, genres, release_date, poster_path, backdrop_path,
        vote_average, vote_count, popularity, adult, original_language, original_title, video
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      sampleMovies.forEach(movie => {
        stmt.run([
          movie.tmdb_id, movie.title, movie.overview, movie.genres, movie.release_date,
          movie.poster_path, movie.backdrop_path, movie.vote_average, movie.vote_count,
          movie.popularity, movie.adult, movie.original_language, movie.original_title, movie.video
        ]);
      });

      stmt.finalize();
      console.log('Sample movies inserted successfully');
    }
  });
});

// API Routes

// Get all movies
app.get('/api/movies', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  db.all(
    "SELECT * FROM movies ORDER BY popularity DESC LIMIT ? OFFSET ?",
    [limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Database error', data: null });
        return;
      }

      db.get("SELECT COUNT(*) as total FROM movies", (err, countRow) => {
        const total = countRow.total;
        const totalPages = Math.ceil(total / limit);

        res.json({
          success: true,
          message: 'Movies retrieved successfully',
          data: {
            items: rows,
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasNext: page < totalPages,
              hasPrev: page > 1
            }
          }
        });
      });
    }
  );
});

// TMDB API Routes (must be before /api/movies/:id to avoid conflicts)

// Get popular movies from TMDB
app.get('/api/movies/popular', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getPopularMovies(page);
    
    // Store movies in database
    await storeMoviesInDatabase(movies);
    
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
    
    // Store movies in database
    await storeMoviesInDatabase(movies);
    
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
app.get('/api/movies/search/tmdb', async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    
    if (!query) {
      res.status(400).json({ success: false, message: 'Search query is required', data: null });
      return;
    }
    
    const movies = await tmdbService.searchMovies(query, page);
    
    // Store movies in database
    await storeMoviesInDatabase(movies);
    
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
app.get('/api/movies/:id/tmdb', async (req, res) => {
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

// Get single movie
app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);

  db.get("SELECT * FROM movies WHERE id = ?", [movieId], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Database error', data: null });
      return;
    }

    if (!row) {
      res.status(404).json({ success: false, message: 'Movie not found', data: null });
      return;
    }

    // Parse genres string into array
    const genres = row.genres ? row.genres.split(',').map(genre => ({
      id: Math.random().toString(36).substr(2, 9),
      name: genre.trim()
    })) : [];

    const movieData = {
      ...row,
      genres,
      genre_ids: genres.map(g => g.id),
      runtime: 120, // Default runtime
      budget: 0,
      revenue: 0,
      status: 'Released',
      tagline: '',
      homepage: '',
      imdb_id: '',
      production_companies: [],
      production_countries: [],
      spoken_languages: [],
      cast: [],
      crew: [],
      similar_movies: [],
      rating_count: row.vote_count,
      average_rating: row.vote_average
    };

    res.json({
      success: true,
      message: 'Movie details retrieved successfully',
      data: movieData
    });
  });
});

// Search movies
app.get('/api/movies/search', (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  if (!query) {
    res.status(400).json({ success: false, message: 'Search query is required', data: null });
    return;
  }

  db.all(
    "SELECT * FROM movies WHERE title LIKE ? OR overview LIKE ? ORDER BY popularity DESC LIMIT ? OFFSET ?",
    [`%${query}%`, `%${query}%`, limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Database error', data: null });
        return;
      }

      db.get(
        "SELECT COUNT(*) as total FROM movies WHERE title LIKE ? OR overview LIKE ?",
        [`%${query}%`, `%${query}%`],
        (err, countRow) => {
          const total = countRow.total;
          const totalPages = Math.ceil(total / limit);

          res.json({
            success: true,
            message: 'Search results retrieved successfully',
            data: {
              items: rows,
              pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
              }
            }
          });
        }
      );
    }
  );
});

// Helper function to store movies in database
async function storeMoviesInDatabase(movies) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO movies (
      tmdb_id, title, overview, genres, release_date, poster_path, backdrop_path,
      vote_average, vote_count, popularity, adult, original_language, original_title, video
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    let completed = 0;
    movies.forEach(movie => {
      stmt.run([
        movie.tmdb_id, movie.title, movie.overview, movie.genres, movie.release_date,
        movie.poster_path, movie.backdrop_path, movie.vote_average, movie.vote_count,
        movie.popularity, movie.adult, movie.original_language, movie.original_title, movie.video
      ], (err) => {
        if (err) {
          console.error('Error storing movie:', err);
        }
        completed++;
        if (completed === movies.length) {
          stmt.finalize();
          resolve();
        }
      });
    });
  });
}

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
  console.log(`🚀 Minimal Movie Stack Backend running on port ${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
