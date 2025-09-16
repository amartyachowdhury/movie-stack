// Enhanced Movie Info Component - Combines TMDB and OMDb data for maximum information
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
import WatchProviders from './WatchProviders';

const EnhancedMovieInfo = ({ movie }) => {
  if (!movie) return null;

  const genres = parseGenres(movie.genres);
  const popularityBadge = getPopularityBadge(movie.popularity);
  const profit = movie.revenue && movie.budget ? movie.revenue - movie.budget : null;
  const omdbData = movie.omdb;

  // Combine runtime data (prefer OMDb if available, fallback to TMDB)
  const getRuntime = () => {
    if (omdbData?.runtime) {
      return omdbData.runtime; // "139 min" format
    }
    return movie.runtime ? `${movie.runtime} min` : 'N/A';
  };

  // Combine release date data
  const getReleaseInfo = () => {
    const tmdbYear = getYear(movie.release_date);
    const omdbYear = omdbData?.year;
    const omdbReleased = omdbData?.released;
    
    return {
      year: omdbYear || tmdbYear,
      fullDate: omdbReleased || movie.release_date,
      formatted: omdbReleased || (movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A')
    };
  };

  // Combine genre data (merge both sources)
  const getCombinedGenres = () => {
    const tmdbGenres = genres.map(g => g.name);
    const omdbGenres = omdbData?.genre ? omdbData.genre.split(', ') : [];
    
    // Merge and deduplicate
    const combined = [...new Set([...tmdbGenres, ...omdbGenres])];
    return combined;
  };

  // Combine cast data
  const getCombinedCast = () => {
    const tmdbCast = movie.cast || [];
    const omdbActors = omdbData?.actors ? omdbData.actors.split(', ') : [];
    
    // Use TMDB cast for detailed info, supplement with OMDb if needed
    return tmdbCast.length > 0 ? tmdbCast : omdbActors.map((actor, index) => ({
      id: `omdb-${index}`,
      name: actor.trim(),
      character: 'N/A'
    }));
  };

  // Combine crew data
  const getCombinedCrew = () => {
    const tmdbCrew = movie.crew || [];
    const omdbDirector = omdbData?.director;
    const omdbWriter = omdbData?.writer;
    
    let combinedCrew = [...tmdbCrew];
    
    // Add OMDb director if not in TMDB crew
    if (omdbDirector && !tmdbCrew.some(c => c.job === 'Director' && c.name === omdbDirector)) {
      combinedCrew.push({
        id: 'omdb-director',
        name: omdbDirector,
        job: 'Director'
      });
    }
    
    // Add OMDb writer if not in TMDB crew
    if (omdbWriter && !tmdbCrew.some(c => c.job === 'Writer' && c.name === omdbWriter)) {
      combinedCrew.push({
        id: 'omdb-writer',
        name: omdbWriter,
        job: 'Writer'
      });
    }
    
    return combinedCrew;
  };

  // Combine plot/overview data
  const getCombinedPlot = () => {
    const tmdbOverview = movie.overview;
    const omdbPlot = omdbData?.plot;
    
    // Prefer OMDb plot if it's longer/more detailed
    if (omdbPlot && omdbPlot.length > (tmdbOverview?.length || 0)) {
      return omdbPlot;
    }
    return tmdbOverview || omdbPlot;
  };

  // Combine language data
  const getCombinedLanguages = () => {
    const tmdbLanguages = movie.spoken_languages || [];
    const omdbLanguage = omdbData?.language;
    
    const tmdbLangNames = tmdbLanguages.map(lang => lang.english_name);
    const omdbLangNames = omdbLanguage ? omdbLanguage.split(', ') : [];
    
    return [...new Set([...tmdbLangNames, ...omdbLangNames])];
  };

  // Combine country data
  const getCombinedCountries = () => {
    const tmdbCountries = movie.production_countries || [];
    const omdbCountry = omdbData?.country;
    
    const tmdbCountryCodes = tmdbCountries.map(country => country.iso_3166_1);
    const omdbCountryNames = omdbCountry ? omdbCountry.split(', ') : [];
    
    return {
      codes: tmdbCountryCodes,
      names: omdbCountryNames
    };
  };

  const releaseInfo = getReleaseInfo();
  const combinedGenres = getCombinedGenres();
  const combinedCast = getCombinedCast();
  const combinedCrew = getCombinedCrew();
  const combinedPlot = getCombinedPlot();
  const combinedLanguages = getCombinedLanguages();
  const combinedCountries = getCombinedCountries();

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
                <strong>Runtime:</strong> {getRuntime()}
              </div>
              
              {omdbData?.rated && (
                <div className="meta-item">
                  <strong>MPAA Rating:</strong> {omdbData.rated}
                </div>
              )}
              
              {movie.vote_average > 0 && (
                <div className="meta-item">
                  <strong>Community Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)} / 10 ({formatVoteCount(movie.vote_count)} votes)
                </div>
              )}
              
              {movie.original_language && (
                <div className="meta-item">
                  <strong>Original Language:</strong> {getLanguageFlag(movie.original_language)} {movie.original_language.toUpperCase()}
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
              <div key={person.id} className="cast-item">
                {person.profile_path ? (
                  <img 
                    src={getPosterUrl(person.profile_path, 'profile')} 
                    alt={person.name}
                    className="cast-profile-pic"
                  />
                ) : (
                  <div className="cast-profile-pic-placeholder"></div>
                )}
                <div className="cast-info">
                  <div className="cast-name">{person.name}</div>
                  <div className="cast-character">{person.character || 'Actor'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crew-section">
          <h3>🎬 Key Crew</h3>
          <div className="crew-grid">
            {combinedCrew.filter(c => ['Director', 'Writer', 'Producer', 'Original Music Composer'].includes(c.job)).map((person) => (
              <div key={person.credit_id || person.id} className="crew-item">
                {person.profile_path ? (
                  <img 
                    src={getPosterUrl(person.profile_path, 'profile')} 
                    alt={person.name}
                    className="crew-profile-pic"
                  />
                ) : (
                  <div className="crew-profile-pic-placeholder"></div>
                )}
                <div className="crew-info">
                  <div className="crew-name">{person.name}</div>
                  <div className="crew-job">{person.job}</div>
                </div>
              </div>
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
                {movie.production_companies.map(pc => (
                  <span key={pc.id} className="company-chip">{pc.name}</span>
                ))}
              </div>
            </div>
          )}
          
          {combinedCountries.codes.length > 0 && (
            <div className="production-item">
              <strong>Production Countries:</strong> 
              <div className="country-flags">
                {combinedCountries.codes.map(code => (
                  <span key={code} className="country-flag">{code}</span>
                ))}
              </div>
              {combinedCountries.names.length > 0 && (
                <div className="country-names">
                  {combinedCountries.names.join(', ')}
                </div>
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
      {movie.watch_providers && (
        <WatchProviders watchProviders={movie.watch_providers} />
      )}

      {/* Enhanced External Links */}
      <div className="movie-links-section-enhanced">
        <h3>🔗 External Links</h3>
        <div className="links-grid-enhanced">
          {movie.homepage && (
            <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="external-link">
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
