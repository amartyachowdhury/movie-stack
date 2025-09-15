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
      
      const response = await api.getPopularMovies()
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

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
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

  const parseGenres = (genres) => {
    if (!genres) return []
    
    if (typeof genres === 'string') {
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

  const genresArray = parseGenres(movie.genres)

  return (
    <div className="movie-details-page">
      {/* Hero Section with Backdrop */}
      <div className="movie-hero">
        {movie.backdrop_path && (
          <div className="movie-backdrop-hero">
            <img 
              src={`https://image.tmdb.org/t/p/w1920${movie.backdrop_path}`} 
              alt={movie.title}
              className="backdrop-hero-image"
            />
            <div className="backdrop-overlay"></div>
          </div>
        )}
        
    <div className="container">
          <button className="back-btn-hero" onClick={() => navigate('/')}>
        ← Back to Movies
      </button>
        </div>
      </div>

      <div className="container">
        <div className="movie-details-enhanced">
          {/* Main Movie Info Section */}
          <div className="movie-main-info">
            <div className="movie-poster-large">
            {movie.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                  className="poster-large"
              />
            ) : (
                <div className="poster-placeholder-large">No Image</div>
              )}
            </div>
            
            <div className="movie-info-main">
              <div className="movie-title-section">
                <h1 className="movie-title-main">{movie.title}</h1>
                {movie.original_title && movie.original_title !== movie.title && (
                  <h2 className="movie-original-title">({movie.original_title})</h2>
                )}
                {movie.tagline && (
                  <p className="movie-tagline">"{movie.tagline}"</p>
                )}
              </div>

              <div className="movie-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Release Date</span>
                  <span className="meta-value">{getYear(movie.release_date)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Runtime</span>
                  <span className="meta-value">{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Language</span>
                  <span className="meta-value">{getLanguageFlag(movie.original_language)} {movie.original_language?.toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value">{movie.status || 'Released'}</span>
                </div>
                {movie.adult && (
                  <div className="meta-item">
                    <span className="meta-label">Rating</span>
                    <span className="meta-value adult-rating">18+</span>
                  </div>
            )}
          </div>
          
              <div className="movie-rating-section">
                <div className="rating-main">
                  <span className="rating-star">⭐</span>
                  <span className="rating-score">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  <span className="rating-max">/10</span>
                </div>
                <div className="rating-details">
                  <span className="vote-count">Based on {movie.vote_count?.toLocaleString() || 0} votes</span>
                  <span className="popularity-score">Popularity: {movie.popularity?.toFixed(0) || 'N/A'}</span>
                </div>
              </div>

              {genresArray.length > 0 && (
                <div className="movie-genres-section">
                  <h3>Genres</h3>
                  <div className="genres-list">
                    {genresArray.map((genre, index) => (
                      <span key={index} className="genre-tag-large">
                  {genre.name}
                </span>
              ))}
            </div>
                </div>
              )}
            
              {movie.overview && (
                <div className="movie-overview-section">
              <h3>Overview</h3>
                  <p className="overview-text">{movie.overview}</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          {(movie.budget > 0 || movie.revenue > 0) && (
            <div className="movie-financial-section">
              <h3>Financial Information</h3>
              <div className="financial-grid">
                {movie.budget > 0 && (
                  <div className="financial-item">
                    <span className="financial-label">Budget</span>
                    <span className="financial-value">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="financial-item">
                    <span className="financial-label">Revenue</span>
                    <span className="financial-value revenue">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
                {movie.budget > 0 && movie.revenue > 0 && (
                  <div className="financial-item">
                    <span className="financial-label">Profit/Loss</span>
                    <span className={`financial-value ${movie.revenue > movie.budget ? 'profit' : 'loss'}`}>
                      {formatCurrency(movie.revenue - movie.budget)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="movie-cast-section">
              <h3>Cast</h3>
              <div className="cast-grid">
                {movie.cast.slice(0, 10).map((actor, index) => (
                  <div key={index} className="cast-member">
                    <div className="cast-photo">
                      {actor.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} 
                          alt={actor.name}
                          className="cast-image"
                        />
                      ) : (
                        <div className="cast-placeholder">No Photo</div>
                      )}
                    </div>
                    <div className="cast-info">
                      <span className="cast-name">{actor.name}</span>
                      <span className="cast-character">{actor.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Crew Section */}
          {movie.crew && movie.crew.length > 0 && (
            <div className="movie-crew-section">
              <h3>Crew</h3>
              <div className="crew-grid">
                {movie.crew.slice(0, 8).map((member, index) => (
                  <div key={index} className="crew-member">
                    <span className="crew-name">{member.name}</span>
                    <span className="crew-job">{member.job}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Information */}
          {(movie.production_companies?.length > 0 || movie.production_countries?.length > 0) && (
            <div className="movie-production-section">
              <h3>Production</h3>
              {movie.production_companies?.length > 0 && (
                <div className="production-companies">
                  <h4>Production Companies</h4>
                  <div className="companies-list">
                    {movie.production_companies.map((company, index) => (
                      <span key={index} className="company-tag">
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {movie.production_countries?.length > 0 && (
                <div className="production-countries">
                  <h4>Countries</h4>
                  <div className="countries-list">
                    {movie.production_countries.map((country, index) => (
                      <span key={index} className="country-tag">
                        {country.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* External Links */}
          <div className="movie-links-section">
            <h3>External Links</h3>
            <div className="links-grid">
              {movie.homepage && (
                <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="external-link">
                  🌐 Official Website
                </a>
              )}
              {movie.imdb_id && (
                <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer" className="external-link">
                  🎬 IMDB
                </a>
              )}
            </div>
          </div>

          {/* Similar Movies */}
          {movie.similar_movies && movie.similar_movies.length > 0 && (
            <div className="similar-movies-section">
              <h3>Similar Movies</h3>
              <div className="similar-movies-grid">
                {movie.similar_movies.map((similarMovie, index) => (
                  <div key={index} className="similar-movie-card" onClick={() => navigate(`/movie/${similarMovie.id}`)}>
                    <div className="similar-movie-poster">
                      {similarMovie.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`} 
                          alt={similarMovie.title}
                          className="similar-poster"
                        />
                      ) : (
                        <div className="similar-poster-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="similar-movie-info">
                      <h4 className="similar-movie-title">{similarMovie.title}</h4>
                      <span className="similar-movie-year">{getYear(similarMovie.release_date)}</span>
                      <span className="similar-movie-rating">⭐ {similarMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
