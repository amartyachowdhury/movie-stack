// Movie Card Component
import React, { memo, useMemo, useCallback } from 'react';
import { 
  getYear, 
  formatCurrency, 
  formatRuntime, 
  formatVoteCount, 
  getLanguageFlag, 
  getPopularityBadge, 
  parseGenres,
  getBackdropUrl,
  getPosterUrl,
  truncateText
} from '../../utils';
import { MOVIE_CONFIG } from '../../constants';
import LazyImage from '../common/LazyImage';

const MovieCard = memo(({ movie, onClick }) => {
  // Memoize expensive computations
  const genres = useMemo(() => parseGenres(movie.genres), [movie.genres]);
  const popularityBadge = useMemo(() => getPopularityBadge(movie.popularity), [movie.popularity]);
  const backdropUrl = useMemo(() => getBackdropUrl(movie.backdrop_path), [movie.backdrop_path]);
  const posterUrl = useMemo(() => getPosterUrl(movie.poster_path), [movie.poster_path]);
  const truncatedOverview = useMemo(() => 
    truncateText(movie.overview, MOVIE_CONFIG.MAX_OVERVIEW_LENGTH), 
    [movie.overview]
  );

  // Memoize click handler
  const handleClick = useCallback(() => {
    onClick(movie);
  }, [onClick, movie]);

  return (
    <div className="movie-card-enhanced" onClick={handleClick}>
      {/* Backdrop Image */}
      <div className="movie-backdrop">
        <LazyImage
          src={backdropUrl}
          alt={movie.title}
          className="backdrop-image"
          placeholder={<span>No Image</span>}
        />
        
        {/* Overlay with Poster */}
        <div className="movie-overlay">
          <LazyImage
            src={posterUrl}
            alt={movie.title}
            className="movie-poster-small"
            placeholder={<span>No Poster</span>}
          />
        </div>

        {/* Badges */}
        <div className="movie-badges">
          {movie.adult && <span className="badge adult-badge">18+</span>}
          {popularityBadge && (
            <span className={`badge popularity-badge ${popularityBadge.class}`}>
              {popularityBadge.text}
            </span>
          )}
        </div>
      </div>

      {/* Movie Info */}
      <div className="movie-info-enhanced">
        <div className="movie-header">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="movie-year">{getYear(movie.release_date)}</span>
            <span className="movie-language">{getLanguageFlag(movie.original_language)}</span>
            {movie.runtime && (
              <span className="movie-runtime">{formatRuntime(movie.runtime)}</span>
            )}
          </div>
        </div>

        {/* Rating Section */}
        <div className="movie-rating-section">
          <div className="rating-main">
            <span className="rating-star">⭐</span>
            <span className="rating-score">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            <span className="rating-max">/10</span>
          </div>
          <div className="rating-details">
            <span className="vote-count">{formatVoteCount(movie.vote_count)} votes</span>
            <span className="popularity-score">Popularity: {movie.popularity?.toFixed(0) || 'N/A'}</span>
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="movie-genres">
            {genres.slice(0, MOVIE_CONFIG.MAX_GENRES_DISPLAY).map((genre) => (
              <span key={genre.id} className="genre-chip">
                {genre.name}
              </span>
            ))}
            {genres.length > MOVIE_CONFIG.MAX_GENRES_DISPLAY && (
              <span className="genre-more">
                +{genres.length - MOVIE_CONFIG.MAX_GENRES_DISPLAY} more
              </span>
            )}
          </div>
        )}

        {/* Overview */}
        {movie.overview && (
          <div className="movie-overview">
            <p>{truncatedOverview}</p>
          </div>
        )}

        {/* Financial Info */}
        {(movie.budget || movie.revenue) && (
          <div className="movie-financial">
            {movie.budget && (
              <div className="budget">
                <strong>Budget:</strong> {formatCurrency(movie.budget)}
              </div>
            )}
            {movie.revenue && (
              <div className="revenue">
                <strong>Revenue:</strong> {formatCurrency(movie.revenue)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
