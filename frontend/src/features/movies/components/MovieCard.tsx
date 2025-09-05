import React, { useState, useEffect, useRef } from 'react';
import MovieTrailer from './MovieTrailer';
import LazyImage from './LazyImage';
import './MovieCard.css';

export interface Movie {
  id?: number;
  tmdb_id?: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check if we should show placeholder immediately
  const shouldShowPlaceholder = !movie.poster_path || movie.poster_path === 'null' || movie.poster_path === '';

  // Determine the poster URL
  const getPosterUrl = () => {
    if (imageError || shouldShowPlaceholder) {
      return '/placeholder-movie.svg';
    }
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  // Set loading to false immediately if we're showing placeholder
  useEffect(() => {
    if (shouldShowPlaceholder) {
      setImageLoading(false);
    }
  }, [shouldShowPlaceholder]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleRatingChange = (rating: number) => {
    if (onRateMovie) {
      const movieId = movie.id || movie.tmdb_id || 0;
      if (movieId) {
        onRateMovie(movieId, rating);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowQuickActions(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowQuickActions(false);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleQuickAction = (action: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(`Quick action: ${action} for movie: ${movie.title}`);
    
    if (action === 'trailer') {
      setShowTrailer(true);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`movie-card ${isHovered ? 'movie-card--hovered' : ''} ${isPressed ? 'movie-card--pressed' : ''}`}
      onClick={() => onMovieClick?.(movie)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="movie-poster">
        <LazyImage
          src={getPosterUrl()}
          alt={movie.title || 'Movie poster'}
          className="movie-poster-image"
          placeholder="/placeholder-movie.svg"
          enableProgressive={true}
          enableBlur={true}
          enableFade={true}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <div className="movie-overlay">
          <div className="movie-rating">
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
          
          {/* Quick Actions */}
          {showQuickActions && (
            <div className="movie-quick-actions">
              <button
                className="movie-quick-action"
                onClick={(e) => handleQuickAction('trailer', e)}
                aria-label="Watch trailer"
              >
                🎬
              </button>
              <button
                className="movie-quick-action"
                onClick={(e) => handleQuickAction('watchlist', e)}
                aria-label="Add to watchlist"
              >
                📺
              </button>
              <button
                className="movie-quick-action"
                onClick={(e) => handleQuickAction('favorite', e)}
                aria-label="Add to favorites"
              >
                ❤️
              </button>
              <button
                className="movie-quick-action"
                onClick={(e) => handleQuickAction('share', e)}
                aria-label="Share movie"
              >
                📤
              </button>
            </div>
          )}
          
          {/* Play Button */}
          {isHovered && (
            <div className="movie-play-button">
              <span className="movie-play-icon">▶️</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title || 'Untitled'}</h3>
        <p className="movie-year">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </p>
        <p className="movie-overview">
          {movie.overview && movie.overview.length > 100 
            ? `${movie.overview.substring(0, 100)}...` 
            : movie.overview || 'No overview available'}
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
      
      {/* Movie Trailer Modal */}
      {showTrailer && (
        <MovieTrailer
          movieId={movie.id || movie.tmdb_id || 0}
          movieTitle={movie.title || 'Unknown Movie'}
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieCard;
