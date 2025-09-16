// Movie Details Component - Enhanced with combined TMDB and OMDb data
import React from 'react';
import { 
  getYear, 
  getPosterUrl
} from '../../utils';
import TrailerSection from './TrailerSection';
import RatingScores from './RatingScores';
import EnhancedMovieInfo from './EnhancedMovieInfo';

const MovieDetails = ({ movie, onBack }) => {
  return (
    <div className="movie-details-page">
      {/* Back Button */}
      <button className="back-btn-hero" onClick={onBack}>
        ← Back to Movies
      </button>

      {/* Enhanced Movie Information - Combines TMDB and OMDb data */}
      <EnhancedMovieInfo movie={movie} />

      {/* Professional Ratings */}
      {movie.omdb && (
        <RatingScores omdbData={movie.omdb} />
      )}

      {/* Trailers & Videos */}
      {movie.videos && (
        <TrailerSection videos={movie.videos} />
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
  );
};

export default MovieDetails;