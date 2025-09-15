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

  const getLanguageFlag = (languageCode) => {
    const flags = {
      'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
      'hi': '🇮🇳', 'ar': '🇸🇦', 'th': '🇹🇭', 'nl': '🇳🇱', 'sv': '🇸🇪',
      'da': '🇩🇰', 'no': '🇳🇴', 'fi': '🇫🇮', 'pl': '🇵🇱', 'tr': '🇹🇷'
    }
    return flags[languageCode] || '🌍'
  }

  const formatVoteCount = (count) => {
    if (!count) return 'No votes'
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M votes`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K votes`
    return `${count} votes`
  }

  const getPopularityBadge = (popularity) => {
    if (popularity >= 100) return { text: '🔥 Trending', class: 'trending' }
    if (popularity >= 50) return { text: '⭐ Popular', class: 'popular' }
    if (popularity >= 20) return { text: '📈 Rising', class: 'rising' }
    return null
  }

  const parseGenres = (genres) => {
    if (!genres) return []
    
    if (typeof genres === 'string') {
      // Convert comma-separated string to array of genre names
      const genreMap = {
        '28': 'Action', '12': 'Adventure', '16': 'Animation', '35': 'Comedy',
        '80': 'Crime', '99': 'Documentary', '18': 'Drama', '10751': 'Family',
        '14': 'Fantasy', '36': 'History', '27': 'Horror', '10402': 'Music',
        '9648': 'Mystery', '10749': 'Romance', '878': 'Science Fiction',
        '10770': 'TV Movie', '53': 'Thriller', '10752': 'War', '37': 'Western'
      }
      return genres.split(',').map(id => ({
        id: id.trim(),
        name: genreMap[id.trim()] || `Genre ${id.trim()}`
      }))
    } else if (Array.isArray(genres)) {
      return genres
    }
    
    return []
  }

  const popularityBadge = getPopularityBadge(movie.popularity)

  return (
    <div className="movie-card-enhanced" onClick={() => onClick(movie)}>
      {/* Backdrop Image */}
      <div className="movie-backdrop">
        {movie.backdrop_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
            alt={movie.title}
            className="backdrop-image"
          />
        ) : (
          <div className="backdrop-placeholder"></div>
        )}
        
        {/* Overlay with poster */}
        <div className="movie-overlay">
          <div className="movie-poster-small">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="poster-image"
              />
            ) : (
              <div className="poster-placeholder">No Image</div>
            )}
          </div>
          
          {/* Top badges */}
          <div className="movie-badges">
            {movie.adult && <span className="badge adult-badge">18+</span>}
            {popularityBadge && (
              <span className={`badge popularity-badge ${popularityBadge.class}`}>
                {popularityBadge.text}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="movie-info-enhanced">
        <div className="movie-header">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{getYear(movie.release_date)}</span>
            <span className="movie-language">{getLanguageFlag(movie.original_language)}</span>
            {movie.runtime && <span className="movie-runtime">{movie.runtime}min</span>}
          </div>
        </div>

        <div className="movie-rating-section">
          <div className="rating-main">
            <span className="rating-star">⭐</span>
            <span className="rating-score">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            <span className="rating-max">/10</span>
          </div>
          <div className="rating-details">
            <span className="vote-count">{formatVoteCount(movie.vote_count)}</span>
            <span className="popularity-score">Popularity: {movie.popularity?.toFixed(0) || 'N/A'}</span>
          </div>
        </div>

        {(() => {
          const genresArray = parseGenres(movie.genres)
          return genresArray.length > 0 && (
            <div className="movie-genres">
              {genresArray.slice(0, 3).map((genre, index) => (
                <span key={index} className="genre-chip">
                  {genre.name}
                </span>
              ))}
              {genresArray.length > 3 && (
                <span className="genre-more">+{genresArray.length - 3} more</span>
              )}
            </div>
          )
        })()}

        {movie.overview && (
          <div className="movie-overview">
            <p>{movie.overview.length > 120 ? `${movie.overview.substring(0, 120)}...` : movie.overview}</p>
          </div>
        )}

        {/* Financial info for high-budget movies */}
        {movie.budget > 0 && (
          <div className="movie-financial">
            <span className="budget">Budget: ${movie.budget.toLocaleString()}</span>
            {movie.revenue > 0 && (
              <span className="revenue">Revenue: ${movie.revenue.toLocaleString()}</span>
            )}
          </div>
        )}
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
