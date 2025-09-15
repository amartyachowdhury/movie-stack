// Movie Details Component
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

const MovieDetails = ({ movie, onBack }) => {
  const genres = parseGenres(movie.genres);
  const popularityBadge = getPopularityBadge(movie.popularity);
  const profit = movie.revenue && movie.budget ? movie.revenue - movie.budget : null;

  return (
    <div className="movie-details-page">
      {/* Hero Section */}
      <div className="movie-hero">
        {movie.backdrop_path && (
          <div className="movie-backdrop-hero">
            <img 
              src={getBackdropUrl(movie.backdrop_path)} 
              alt={movie.title}
              className="backdrop-hero-image"
            />
            <div className="backdrop-overlay"></div>
          </div>
        )}
        
        <button className="back-btn-hero" onClick={onBack}>
          ← Back to Movies
        </button>
      </div>

      {/* Main Content */}
      <div className="movie-details-enhanced">
        <div className="movie-main-info">
          {/* Large Poster */}
          <div className="movie-poster-large">
            {movie.poster_path ? (
              <img 
                src={getPosterUrl(movie.poster_path)} 
                alt={movie.title}
                className="poster-large"
              />
            ) : (
              <div className="poster-placeholder-large">
                <span>No Poster Available</span>
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="movie-info-main">
            {/* Title Section */}
            <div className="movie-title-section">
              <h1 className="movie-title-main">{movie.title}</h1>
              {movie.original_title !== movie.title && (
                <h2 className="movie-original-title">{movie.original_title}</h2>
              )}
              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}
            </div>

            {/* Meta Information */}
            <div className="movie-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Release Date:</span>
                <span className="meta-value">{getYear(movie.release_date)}</span>
              </div>
              {movie.runtime && (
                <div className="meta-item">
                  <span className="meta-label">Runtime:</span>
                  <span className="meta-value">{formatRuntime(movie.runtime)}</span>
                </div>
              )}
              <div className="meta-item">
                <span className="meta-label">Language:</span>
                <span className="meta-value">
                  {getLanguageFlag(movie.original_language)} {movie.original_language?.toUpperCase()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <span className="meta-value">{movie.status || 'N/A'}</span>
              </div>
              {movie.adult && (
                <div className="meta-item">
                  <span className="meta-label">Rating:</span>
                  <span className="meta-value adult-rating">18+</span>
                </div>
              )}
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
                {popularityBadge && (
                  <span className={`popularity-badge ${popularityBadge.class}`}>
                    {popularityBadge.text}
                  </span>
                )}
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="movie-genres-section">
                <h3>Genres</h3>
                <div className="genres-list">
                  {genres.map((genre) => (
                    <span key={genre.id} className="genre-tag-large">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div className="movie-overview-section">
                <h3>Overview</h3>
                <p className="overview-text">{movie.overview}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Information */}
        {(movie.budget || movie.revenue) && (
          <div className="movie-financial-section">
            <h3>Financial Information</h3>
            <div className="financial-grid">
              {movie.budget && (
                <div className="financial-item">
                  <span className="financial-label">Budget:</span>
                  <span className="financial-value">{formatCurrency(movie.budget)}</span>
                </div>
              )}
              {movie.revenue && (
                <div className="financial-item">
                  <span className="financial-label">Revenue:</span>
                  <span className="financial-value">{formatCurrency(movie.revenue)}</span>
                </div>
              )}
              {profit !== null && (
                <div className="financial-item">
                  <span className="financial-label">Profit/Loss:</span>
                  <span className={`financial-value ${profit >= 0 ? 'profit' : 'loss'}`}>
                    {formatCurrency(Math.abs(profit))} {profit >= 0 ? 'Profit' : 'Loss'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="movie-cast-section">
            <h3>Cast</h3>
            <div className="cast-grid">
              {movie.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="cast-member">
                  <div className="cast-photo">
                    {actor.profile_path ? (
                      <img 
                        src={getPosterUrl(actor.profile_path, 'w185')} 
                        alt={actor.name}
                        className="cast-image"
                      />
                    ) : (
                      <div className="cast-placeholder">No Photo</div>
                    )}
                  </div>
                  <div className="cast-name">{actor.name}</div>
                  <div className="cast-character">{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew */}
        {movie.crew && movie.crew.length > 0 && (
          <div className="movie-crew-section">
            <h3>Crew</h3>
            <div className="crew-grid">
              {movie.crew.slice(0, 10).map((member) => (
                <div key={member.id} className="crew-member">
                  <div className="crew-name">{member.name}</div>
                  <div className="crew-job">{member.job}</div>
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
                <h4>Companies</h4>
                <div className="companies-list">
                  {movie.production_companies.map((company) => (
                    <span key={company.id} className="company-tag">
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
                  {movie.production_countries.map((country) => (
                    <span key={country.iso_3166_1} className="country-tag">
                      {country.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* External Links */}
        {(movie.homepage || movie.imdb_id) && (
          <div className="movie-links-section">
            <h3>External Links</h3>
            <div className="links-grid">
              {movie.homepage && (
                <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="external-link">
                  Official Website
                </a>
              )}
              {movie.imdb_id && (
                <a 
                  href={`https://www.imdb.com/title/${movie.imdb_id}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="external-link"
                >
                  IMDB Page
                </a>
              )}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {movie.similar_movies && movie.similar_movies.length > 0 && (
          <div className="similar-movies-section">
            <h3>Similar Movies</h3>
            <div className="similar-movies-grid">
              {movie.similar_movies.slice(0, 6).map((similarMovie) => (
                <div key={similarMovie.id} className="similar-movie-card">
                  <div className="similar-movie-poster">
                    {similarMovie.poster_path ? (
                      <img 
                        src={getPosterUrl(similarMovie.poster_path)} 
                        alt={similarMovie.title}
                        className="similar-poster"
                      />
                    ) : (
                      <div className="similar-poster-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="similar-movie-info">
                    <div className="similar-movie-title">{similarMovie.title}</div>
                    <div className="similar-movie-year">{getYear(similarMovie.release_date)}</div>
                    <div className="similar-movie-rating">
                      ⭐ {similarMovie.vote_average?.toFixed(1) || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
