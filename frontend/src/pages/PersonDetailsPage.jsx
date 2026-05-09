import React from 'react';
import { usePersonDetails } from '../hooks/useMovies';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { getProfileUrl, getPosterUrl, getYear } from '../utils';
import { LOADING_STATES } from '../constants';

const PersonDetailsPage = ({ personId, onBack, onMovieClick }) => {
  const { person, loading, error } = usePersonDetails(personId);

  if (loading === LOADING_STATES.LOADING) {
    return <LoadingSpinner message="Loading person details..." size="large" />;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>❌ Error Loading Person</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="not-found-page">
        <div className="not-found-content">
          <h2>🎭 Person Not Found</h2>
          <p>The person you're looking for doesn't exist or has been removed.</p>
          <button className="retry-button" onClick={onBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="person-details-page">
      <button className="back-btn-hero" onClick={onBack}>
        ← Back
      </button>

      <div className="person-hero">
        <div className="person-profile-column">
          {person.profile_path ? (
            <img
              src={getProfileUrl(person.profile_path)}
              alt={person.name}
              className="person-profile-image"
            />
          ) : (
            <div className="person-profile-placeholder">{person.name?.charAt(0) || '?'}</div>
          )}
        </div>

        <div className="person-info-column">
          <h1>{person.name}</h1>
          <div className="person-meta">
            {person.known_for_department && <span>Known For: {person.known_for_department}</span>}
            {person.birthday && <span>Born: {person.birthday}</span>}
            {person.place_of_birth && <span>Birthplace: {person.place_of_birth}</span>}
            {person.popularity > 0 && <span>Popularity: {person.popularity.toFixed(1)}</span>}
          </div>
          {person.biography ? (
            <p className="person-biography">{person.biography}</p>
          ) : (
            <p className="person-biography">No biography available.</p>
          )}
        </div>
      </div>

      <section className="known-for-section">
        <h3>Known For</h3>
        {person.known_for_movies?.length ? (
          <div className="known-for-grid">
            {person.known_for_movies.map((movie) => (
              <div
                key={movie.id}
                className="known-for-card"
                onClick={() => onMovieClick && onMovieClick(movie)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onMovieClick && onMovieClick(movie);
                  }
                }}
              >
                <div className="known-for-poster">
                  {movie.poster_path ? (
                    <img src={getPosterUrl(movie.poster_path)} alt={movie.title} />
                  ) : (
                    <div className="known-for-poster-placeholder">No Image</div>
                  )}
                </div>
                <div className="known-for-info">
                  <h4>{movie.title}</h4>
                  <p>{getYear(movie.release_date)}</p>
                  <p>{movie.character ? `as ${movie.character}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No known movie credits available.</p>
        )}
      </section>
    </div>
  );
};

export default PersonDetailsPage;
