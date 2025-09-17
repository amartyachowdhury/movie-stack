// Movie Details Page Component
import React from 'react';
import { useMovieDetails } from '../hooks/useMovies';
import MovieDetails from '../components/movie/MovieDetails';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { LOADING_STATES } from '../constants';

const MovieDetailsPage = ({ movieId, onBack, onMovieClick }) => {
  const { movie, loading, error } = useMovieDetails(movieId);

  if (loading === LOADING_STATES.LOADING) {
    return <LoadingSpinner message="Loading movie details..." size="large" />;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>❌ Error Loading Movie</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={onBack}>
            ← Back to Movies
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="not-found-page">
        <div className="not-found-content">
          <h2>🎬 Movie Not Found</h2>
          <p>The movie you're looking for doesn't exist or has been removed.</p>
          <button className="retry-button" onClick={onBack}>
            ← Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return <MovieDetails movie={movie} onBack={onBack} onMovieClick={onMovieClick} />;
};

export default MovieDetailsPage;
