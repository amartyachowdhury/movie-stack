// Movie Card Component
import React from 'react';
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

const MovieCard = ({ movie, onClick }) => {
  const genres = parseGenres(movie.genres);
  const popularityBadge = getPopularityBadge(movie.popularity);

  return (
    <div className="movie-card-enhanced" onClick={() => onClick(movie)}>
      {/* Backdrop Image */}
      <div className="movie-backdrop">
        {movie.backdrop_path ? (
          <img 
            src={getBackdropUrl(movie.backdrop_path)} 
            alt={movie.title}
            className="backdrop-image"
            loading="lazy"
          />
        ) : (
          <div className="backdrop-placeholder">
            <span>No Image</span>
          </div>
        )}
        
        {/* Overlay with Poster */}
        <div className="movie-overlay">
          {movie.poster_path ? (
            <img 
              src={getPosterUrl(movie.poster_path)} 
              alt={movie.title}
              className="movie-poster-small"
              loading="lazy"
            />
          ) : (
            <div className="poster-placeholder">
              <span>No Poster</span>
            </div>
          )}
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
            <p>{truncateText(movie.overview, MOVIE_CONFIG.MAX_OVERVIEW_LENGTH)}</p>
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
};

export default MovieCard;
