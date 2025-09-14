import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom'

// API Service
const api = {
  baseURL: '/api',
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
  
  async getMovies(page = 1) {
    return this.request(`/movies?page=${page}`)
  },
  
  async getPopularMovies(page = 1) {
    return this.request(`/movies/popular?page=${page}`)
  },
  
  async getTopRatedMovies(page = 1) {
    return this.request(`/movies/top-rated?page=${page}`)
  },
  
  async getMovie(id) {
    return this.request(`/movies/${id}`)
  },
  
  async searchMovies(query, page = 1) {
    return this.request(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`)
  },
  
  async searchMoviesTMDB(query, page = 1) {
    return this.request(`/movies/search/tmdb?q=${encodeURIComponent(query)}&page=${page}`)
  }
}

// Movie Card Component
function MovieCard({ movie, onClick }) {
  const getYear = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).getFullYear()
  }

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <div className="movie-poster">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          'No Image'
        )}
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-year">{getYear(movie.release_date)}</div>
        <div className="movie-rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</div>
      </div>
    </div>
  )
}

// Home Page Component
function HomePage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      // Try to load popular movies from TMDB first, fallback to local movies
      try {
        const response = await api.getPopularMovies()
        if (response.success) {
          setMovies(response.data.items)
          return
        }
      } catch (tmdbError) {
        console.log('TMDB not available, using local movies:', tmdbError.message)
      }
      
      // Fallback to local movies
      const response = await api.getMovies()
      if (response.success) {
        setMovies(response.data.items)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Failed to load movies')
      console.error('Error loading movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadMovies()
      return
    }

    try {
      setIsSearching(true)
      setError(null)
      
      // Try TMDB search first, fallback to local search
      try {
        const response = await api.searchMoviesTMDB(searchQuery)
        if (response.success) {
          setMovies(response.data.items)
          return
        }
      } catch (tmdbError) {
        console.log('TMDB search not available, using local search:', tmdbError.message)
      }
      
      // Fallback to local search
      const response = await api.searchMovies(searchQuery)
      if (response.success) {
        setMovies(response.data.items)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Search failed')
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`)
  }

  if (loading) {
    return <div className="loading">Loading movies...</div>
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🎬 Movie Stack</h1>
        <p>Discover your next favorite movie</p>
        
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={handleMovieClick}
          />
        ))}
      </div>

      {movies.length === 0 && !loading && (
        <div className="error">No movies found</div>
      )}
    </div>
  )
}

// Movie Details Page Component
function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMovieDetails()
  }, [id])

  const loadMovieDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try TMDB endpoint first for TMDB movies
      try {
        const response = await api.request(`/movies/${id}/tmdb`)
        if (response.success) {
          setMovie(response.data)
          return
        }
      } catch (tmdbError) {
        console.log('TMDB endpoint not available, trying local endpoint:', tmdbError.message)
      }
      
      // Fallback to local endpoint
      const response = await api.getMovie(id)
      if (response.success) {
        setMovie(response.data)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Failed to load movie details')
      console.error('Error loading movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const getYear = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).getFullYear()
  }

  if (loading) {
    return <div className="loading">Loading movie details...</div>
  }

  if (error) {
    return (
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Movies
        </button>
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Movies
        </button>
        <div className="error">Movie not found</div>
      </div>
    )
  }

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Movies
      </button>

      <div className="movie-details">
        <div className="movie-details-header">
          <div className="movie-details-poster">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              'No Image'
            )}
          </div>
          
          <div className="movie-details-info">
            <h1>{movie.title}</h1>
            <div className="year">{getYear(movie.release_date)}</div>
            <div className="rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10</div>
            
            <div className="genres">
              {movie.genres && movie.genres.map((genre, index) => (
                <span key={index} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="overview">
              <h3>Overview</h3>
              <p>{movie.overview || 'No overview available.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Router>
  )
}

export default App
