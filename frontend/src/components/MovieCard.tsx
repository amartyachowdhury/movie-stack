import React from 'react';
import './MovieCard.css';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MovieCardProps {
  movie: Movie;
  onMovieClick?: (movie: Movie) => void;
  showRating?: boolean;
  userRating?: number;
  onRateMovie?: (movieId: number, rating: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onMovieClick,
  showRating = false,
  userRating,
  onRateMovie
}) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder-movie.jpg';

  const handleRatingChange = (rating: number) => {
    if (onRateMovie) {
      onRateMovie(movie.id, rating);
    }
  };

  return (
    <div className="movie-card" onClick={() => onMovieClick?.(movie)}>
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-overlay">
          <div className="movie-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
        <p className="movie-overview">
          {movie.overview.length > 100 
            ? `${movie.overview.substring(0, 100)}...` 
            : movie.overview}
        </p>
        
        {showRating && (
          <div className="rating-section">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star ${userRating && userRating >= star ? 'filled' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRatingChange(star);
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
            {userRating && <span className="user-rating">Your rating: {userRating}/5</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
