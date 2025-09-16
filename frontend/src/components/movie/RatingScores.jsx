// Rating Scores Component - Displays IMDB, Rotten Tomatoes, and Metacritic scores
import React from 'react';

const RatingScores = ({ omdbData }) => {
  if (!omdbData || !omdbData.ratings) {
    return null;
  }

  const { ratings } = omdbData;

  const getScoreColor = (score, maxScore = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#4ade80'; // Green
    if (percentage >= 60) return '#fbbf24'; // Yellow
    if (percentage >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getRottenTomatoesColor = (score) => {
    if (score >= 60) return '#4ade80'; // Fresh (Green)
    return '#ef4444'; // Rotten (Red)
  };

  const getMetacriticColor = (score) => {
    if (score >= 75) return '#4ade80'; // Green
    if (score >= 50) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="rating-scores">
      <h3>🎯 Professional Ratings</h3>
      <div className="scores-grid">
        {/* IMDB Rating */}
        {ratings.imdb && (
          <div className="score-card imdb">
            <div className="score-header">
              <div className="score-logo">IMDb</div>
              <div className="score-value" style={{ color: getScoreColor(ratings.imdb.rating) }}>
                {ratings.imdb.rating}/10
              </div>
            </div>
            <div className="score-details">
              <div className="score-votes">
                {ratings.imdb.votes ? `${ratings.imdb.votes.toLocaleString()} votes` : 'No votes'}
              </div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${(ratings.imdb.rating / 10) * 100}%`,
                  backgroundColor: getScoreColor(ratings.imdb.rating)
                }}
              />
            </div>
          </div>
        )}

        {/* Rotten Tomatoes */}
        {ratings.rottenTomatoes && (
          <div className="score-card rotten-tomatoes">
            <div className="score-header">
              <div className="score-logo">🍅 RT</div>
              <div className="score-value" style={{ color: getRottenTomatoesColor(ratings.rottenTomatoes.score) }}>
                {ratings.rottenTomatoes.score}%
              </div>
            </div>
            <div className="score-details">
              <div className="score-status">
                {ratings.rottenTomatoes.score >= 60 ? 'Fresh' : 'Rotten'}
              </div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${ratings.rottenTomatoes.score}%`,
                  backgroundColor: getRottenTomatoesColor(ratings.rottenTomatoes.score)
                }}
              />
            </div>
          </div>
        )}

        {/* Metacritic */}
        {ratings.metacritic && (
          <div className="score-card metacritic">
            <div className="score-header">
              <div className="score-logo">MC</div>
              <div className="score-value" style={{ color: getMetacriticColor(ratings.metacritic.score) }}>
                {ratings.metacritic.score}/{ratings.metacritic.maxScore}
              </div>
            </div>
            <div className="score-details">
              <div className="score-status">
                {ratings.metacritic.score >= 75 ? 'Universal Acclaim' : 
                 ratings.metacritic.score >= 50 ? 'Mixed Reviews' : 'Generally Unfavorable'}
              </div>
            </div>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${(ratings.metacritic.score / ratings.metacritic.maxScore) * 100}%`,
                  backgroundColor: getMetacriticColor(ratings.metacritic.score)
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional OMDb Info */}
      {omdbData && (
        <div className="omdb-additional-info">
          {omdbData.awards && (
            <div className="awards-section">
              <h4>🏆 Awards</h4>
              <p>{omdbData.awards}</p>
            </div>
          )}
          
          {omdbData.boxOffice && (
            <div className="box-office-section">
              <h4>💰 Box Office</h4>
              <p>{omdbData.boxOffice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingScores;
