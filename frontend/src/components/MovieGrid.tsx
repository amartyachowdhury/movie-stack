import React from 'react';
import MovieCard, { Movie } from './MovieCard';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  showRating?: boolean;
  userRatings?: Record<number, number>;
  onRateMovie?: (movieId: number, rating: number) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  onMovieClick,
  showRating = false,
  userRatings = {},
  onRateMovie
}) => {
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="movie-card-skeleton">
            <div className="skeleton-poster"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="no-movies">
        <div className="no-movies-icon">🎬</div>
        <h3>No movies found</h3>
        <p>Try adjusting your search criteria or browse popular movies.</p>
      </div>
    );
  }

  return (
    <div className={`movie-grid ${loading ? 'loading' : ''}`}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id || movie.tmdb_id}
          movie={movie}
          onMovieClick={onMovieClick}
          showRating={showRating}
          userRating={userRatings[movie.id || movie.tmdb_id || 0]}
          onRateMovie={onRateMovie}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
