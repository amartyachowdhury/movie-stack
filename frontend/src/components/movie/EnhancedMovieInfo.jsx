// Enhanced Movie Info Component - Combines TMDB and OMDb data for maximum information
import { useNavigate } from 'react-router-dom';
import {
  formatCurrency,
  formatVoteCount,
  getLanguageFlag,
  getPopularityBadge,
  getBackdropUrl,
  getPosterUrl,
} from '../../utils';
import {
  getRuntime,
  getReleaseInfo,
  getCombinedGenres,
  getCombinedCast,
  getCombinedCrew,
  getCombinedPlot,
  getCombinedLanguages,
  getCombinedCountries,
} from './enhancedMovieUtils';
import PersonCreditCard from './PersonCreditCard';
import WatchProviders from './WatchProviders';
import api from '../../services/api';

const KEY_CREW_JOBS = ['Director', 'Writer', 'Producer', 'Original Music Composer'];

const EnhancedMovieInfo = ({ movie, onPersonClick }) => {
  const navigate = useNavigate();
  if (!movie) return null;

  const popularityBadge = getPopularityBadge(movie.popularity);
  const profit = movie.revenue && movie.budget ? movie.revenue - movie.budget : null;
  const omdbData = movie.omdb;

  const releaseInfo = getReleaseInfo(movie, omdbData);
  const combinedGenres = getCombinedGenres(movie, omdbData);
  const combinedCast = getCombinedCast(movie, omdbData);
  const combinedCrew = getCombinedCrew(movie, omdbData);
  const combinedPlot = getCombinedPlot(movie, omdbData);
  const combinedLanguages = getCombinedLanguages(movie, omdbData);
  const combinedCountries = getCombinedCountries(movie, omdbData);

  const handlePersonNavigation = async (person) => {
    if (!person?.name) return;

    const navigateToPerson = (personId) => {
      if (!personId) return;
      if (onPersonClick) {
        onPersonClick({ id: personId });
      } else {
        navigate(`/person/${personId}`);
      }
    };

    if (person.id && !String(person.id).startsWith('omdb-')) {
      navigateToPerson(person.id);
      return;
    }

    try {
      const response = await api.searchPerson(person.name);
      if (response?.success && response.data?.id) {
        navigateToPerson(response.data.id);
      }
    } catch (error) {
      console.error('Unable to resolve person profile:', error);
    }
  };

  return (
    <div className="enhanced-movie-info">
      {/* Enhanced Hero Section */}
      <div className="movie-hero-enhanced">
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

        <div className="hero-content">
          <div className="movie-poster-large">
            {movie.poster_path ? (
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="poster-large"
              />
            ) : (
              <div className="poster-large-placeholder">No Image</div>
            )}
          </div>

          <div className="movie-info-main-enhanced">
            <h1 className="movie-title-main">{movie.title}</h1>
            {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}

            {/* Enhanced Meta Information */}
            <div className="movie-meta-grid-enhanced">
              {releaseInfo.year && (
                <div className="meta-item">
                  <strong>Release Year:</strong> {releaseInfo.year}
                  {releaseInfo.formatted && releaseInfo.formatted !== releaseInfo.year && (
                    <span className="meta-detail"> ({releaseInfo.formatted})</span>
                  )}
                </div>
              )}

              <div className="meta-item">
                <strong>Runtime:</strong> {getRuntime(movie, omdbData)}
              </div>

              {omdbData?.rated && (
                <div className="meta-item">
                  <strong>MPAA Rating:</strong> {omdbData.rated}
                </div>
              )}

              {movie.vote_average > 0 && (
                <div className="meta-item">
                  <strong>Community Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)} / 10 (
                  {formatVoteCount(movie.vote_count)} votes)
                </div>
              )}

              {movie.original_language && (
                <div className="meta-item">
                  <strong>Original Language:</strong> {getLanguageFlag(movie.original_language)}{' '}
                  {movie.original_language.toUpperCase()}
                </div>
              )}

              {movie.status && (
                <div className="meta-item">
                  <strong>Status:</strong> {movie.status}
                </div>
              )}

              {movie.popularity > 0 && (
                <div className="meta-item">
                  <strong>Popularity:</strong> {popularityBadge?.text || 'N/A'}
                </div>
              )}
            </div>

            {/* Enhanced Genres */}
            {combinedGenres.length > 0 && (
              <div className="movie-genres-section">
                <strong>Genres:</strong>
                <div className="movie-genres">
                  {combinedGenres.map((genre, index) => (
                    <span key={index} className="genre-chip">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Plot */}
            {combinedPlot && (
              <div className="movie-overview-section">
                <h3>Plot Summary</h3>
                <p>{combinedPlot}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Financial Information */}
      <div className="movie-financial-section-enhanced">
        <h3>💰 Financial Performance</h3>
        <div className="financial-grid-enhanced">
          {movie.budget > 0 && (
            <div className="financial-item">
              <strong>Budget:</strong> {formatCurrency(movie.budget)}
            </div>
          )}
          {movie.revenue > 0 && (
            <div className="financial-item">
              <strong>Box Office:</strong> {formatCurrency(movie.revenue)}
            </div>
          )}
          {omdbData?.boxOffice && (
            <div className="financial-item">
              <strong>Additional Box Office:</strong> {omdbData.boxOffice}
            </div>
          )}
          {profit !== null && (
            <div className="financial-item">
              <strong>Profit:</strong>
              <span style={{ color: profit >= 0 ? '#4CAF50' : '#F44336' }}>
                {formatCurrency(profit)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Cast & Crew */}
      <div className="movie-cast-crew-enhanced">
        <div className="cast-section">
          <h3>🎭 Cast</h3>
          <div className="cast-grid">
            {combinedCast.slice(0, 12).map((person) => (
              <PersonCreditCard
                key={person.id}
                person={person}
                subtitle={person.character || 'Actor'}
                variant="cast"
                onSelect={handlePersonNavigation}
              />
            ))}
          </div>
        </div>

        <div className="crew-section">
          <h3>🎬 Key Crew</h3>
          <div className="crew-grid">
            {combinedCrew
              .filter((c) => KEY_CREW_JOBS.includes(c.job))
              .map((person) => (
                <PersonCreditCard
                  key={person.credit_id || person.id}
                  person={person}
                  subtitle={person.job}
                  variant="crew"
                  onSelect={handlePersonNavigation}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Enhanced Production Information */}
      <div className="movie-production-section-enhanced">
        <h3>🏭 Production Details</h3>
        <div className="production-grid-enhanced">
          {movie.production_companies.length > 0 && (
            <div className="production-item">
              <strong>Production Companies:</strong>
              <div className="production-companies">
                {movie.production_companies.map((pc) => (
                  <span key={pc.id} className="company-chip">
                    {pc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {combinedCountries.codes.length > 0 && (
            <div className="production-item">
              <strong>Production Countries:</strong>
              <div className="country-flags">
                {combinedCountries.codes.map((code) => (
                  <span key={code} className="country-flag">
                    {code}
                  </span>
                ))}
              </div>
              {combinedCountries.names.length > 0 && (
                <div className="country-names">{combinedCountries.names.join(', ')}</div>
              )}
            </div>
          )}

          {combinedLanguages.length > 0 && (
            <div className="production-item">
              <strong>Languages:</strong> {combinedLanguages.join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Awards & Recognition */}
      {(omdbData?.awards || movie.awards) && (
        <div className="movie-awards-section">
          <h3>🏆 Awards & Recognition</h3>
          <div className="awards-content">
            {omdbData?.awards && (
              <div className="awards-item">
                <p>{omdbData.awards}</p>
              </div>
            )}
            {movie.awards && omdbData?.awards !== movie.awards && (
              <div className="awards-item">
                <p>{movie.awards}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watch Providers */}
      {movie.watch_providers && <WatchProviders watchProviders={movie.watch_providers} />}

      {/* Enhanced External Links */}
      <div className="movie-links-section-enhanced">
        <h3>🔗 External Links</h3>
        <div className="links-grid-enhanced">
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              🌐 Official Website
            </a>
          )}
          {movie.imdb_id && (
            <a
              href={`https://www.imdb.com/title/${movie.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              🎬 IMDB Page
            </a>
          )}
          {omdbData?.website && omdbData.website !== 'N/A' && (
            <a
              href={omdbData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              🌍 OMDb Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMovieInfo;
