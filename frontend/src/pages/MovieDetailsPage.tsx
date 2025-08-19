import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie } from '../components/MovieCard';
import apiService from '../services/api';
import './MovieDetailsPage.css';

interface MovieDetails extends Movie {
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  original_language?: string;
  production_companies?: Array<{
    name: string;
    logo_path?: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  cast?: Array<{
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  }>;
  crew?: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
  }>;
  similar_movies?: Movie[];
}

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'similar'>('overview');

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    if (!movieId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const movieData = await apiService.getMovieDetails(parseInt(movieId));
      setMovie(movieData);
      
      // Fetch user rating if available
      // TODO: Implement user rating fetch
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleRateMovie = async (rating: number) => {
    if (!movieId) return;
    
    try {
      await apiService.rateMovie(parseInt(movieId), rating, 1); // TODO: Use actual user ID
      setUserRating(rating);
    } catch (err) {
      console.error('Failed to rate movie:', err);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-details-page">
        <div className="movie-details-skeleton">
          <div className="skeleton-poster"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details-page">
        <div className="error-container">
          <h2>Movie Not Found</h2>
          <p>{error || 'The movie you are looking for could not be found.'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Movies
      </button>

      <div className="movie-header">
        <div className="movie-poster">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
            alt={movie.title}
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="movie-year">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            {movie.runtime && (
              <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>
            )}
            {movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <span className="movie-genres">
                {movie.genres.map(genre => genre.name).join(', ')}
              </span>
            )}
          </div>

          <div className="movie-rating-section">
            <div className="movie-rating">
              <span className="rating-label">TMDB Rating:</span>
              <span className="rating-value">⭐ {movie.vote_average.toFixed(1)}</span>
            </div>
            
            <div className="user-rating">
              <span className="rating-label">Your Rating:</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${userRating >= star ? 'filled' : ''}`}
                    onClick={() => handleRateMovie(star)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="movie-overview">{movie.overview}</p>

          <div className="movie-stats">
            {movie.budget && (
              <div className="stat">
                <span className="stat-label">Budget:</span>
                <span className="stat-value">{formatCurrency(movie.budget)}</span>
              </div>
            )}
            {movie.revenue && (
              <div className="stat">
                <span className="stat-label">Revenue:</span>
                <span className="stat-value">{formatCurrency(movie.revenue)}</span>
              </div>
            )}
            {movie.status && (
              <div className="stat">
                <span className="stat-label">Status:</span>
                <span className="stat-value">{movie.status}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="movie-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'cast' ? 'active' : ''}`}
          onClick={() => setActiveTab('cast')}
        >
          Cast & Crew
        </button>
        <button
          className={`tab-button ${activeTab === 'similar' ? 'active' : ''}`}
          onClick={() => setActiveTab('similar')}
        >
          Similar Movies
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <h3>Plot Summary</h3>
            <p>{movie.overview}</p>
            
            {movie.production_companies && Array.isArray(movie.production_companies) && movie.production_companies.length > 0 && (
              <div className="production-companies">
                <h3>Production Companies</h3>
                <div className="companies-list">
                  {movie.production_companies.map((company, index) => (
                    <span key={index} className="company">
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cast' && (
          <div className="cast-content">
            {movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0 && (
              <div className="cast-section">
                <h3>Cast</h3>
                <div className="cast-list">
                  {movie.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="cast-member">
                      <div className="cast-photo">
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                          />
                        ) : (
                          <div className="cast-placeholder">👤</div>
                        )}
                      </div>
                      <div className="cast-info">
                        <span className="cast-name">{person.name}</span>
                        <span className="cast-character">{person.character}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.crew && Array.isArray(movie.crew) && movie.crew.length > 0 && (
              <div className="crew-section">
                <h3>Crew</h3>
                <div className="crew-list">
                  {movie.crew
                    .filter(person => ['Director', 'Producer', 'Writer'].includes(person.job))
                    .slice(0, 10)
                    .map((person) => (
                      <div key={person.id} className="crew-member">
                        <span className="crew-name">{person.name}</span>
                        <span className="crew-job">{person.job}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'similar' && (
          <div className="similar-content">
            <h3>Similar Movies</h3>
            {movie.similar_movies && Array.isArray(movie.similar_movies) && movie.similar_movies.length > 0 ? (
              <div className="similar-movies-grid">
                {movie.similar_movies.slice(0, 6).map((similarMovie) => (
                  <MovieCard
                    key={similarMovie.id || similarMovie.tmdb_id}
                    movie={similarMovie}
                    onMovieClick={(movie) => navigate(`/movie/${movie.id || movie.tmdb_id}`)}
                    showRating={false}
                  />
                ))}
              </div>
            ) : (
              <p>No similar movies found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;
