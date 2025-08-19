import React from 'react';
import './RatingAnalytics.css';

interface RatingAnalyticsProps {
  movieId: number;
  tmdbRating: number;
  userRating?: number;
  totalRatings?: number;
  averageRating?: number;
  ratingDistribution?: {
    [key: number]: number;
  };
}

const RatingAnalytics: React.FC<RatingAnalyticsProps> = ({
  movieId,
  tmdbRating,
  userRating,
  totalRatings = 0,
  averageRating = 0,
  ratingDistribution = {}
}) => {
  const getRatingPercentage = (rating: number) => {
    if (totalRatings === 0) return 0;
    return Math.round((ratingDistribution[rating] || 0) / totalRatings * 100);
  };

  const getRatingInsight = () => {
    if (!userRating) return null;
    
    const difference = userRating - tmdbRating;
    if (Math.abs(difference) < 0.5) {
      return "You agree with the general consensus!";
    } else if (difference > 0) {
      return "You rated this higher than average - you really enjoyed it!";
    } else {
      return "You rated this lower than average - not quite your taste.";
    }
  };

  return (
    <div className="rating-analytics">
      <h3>Rating Insights</h3>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-header">
            <span className="analytics-label">TMDB Rating</span>
            <span className="analytics-value">⭐ {tmdbRating.toFixed(1)}</span>
          </div>
          <div className="analytics-bar">
            <div 
              className="analytics-fill" 
              style={{ width: `${(tmdbRating / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {userRating && (
          <div className="analytics-card">
            <div className="analytics-header">
              <span className="analytics-label">Your Rating</span>
              <span className="analytics-value">⭐ {userRating}</span>
            </div>
            <div className="analytics-bar">
              <div 
                className="analytics-fill user-rating-fill" 
                style={{ width: `${(userRating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {totalRatings > 0 && (
          <div className="analytics-card">
            <div className="analytics-header">
              <span className="analytics-label">Community Average</span>
              <span className="analytics-value">⭐ {averageRating.toFixed(1)}</span>
            </div>
            <div className="analytics-bar">
              <div 
                className="analytics-fill community-fill" 
                style={{ width: `${(averageRating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {Object.keys(ratingDistribution).length > 0 && (
        <div className="rating-distribution">
          <h4>Rating Distribution</h4>
          <div className="distribution-bars">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="distribution-row">
                <span className="distribution-label">{rating} ⭐</span>
                <div className="distribution-bar">
                  <div 
                    className="distribution-fill"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  ></div>
                </div>
                <span className="distribution-count">
                  {ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {getRatingInsight() && (
        <div className="rating-insight">
          <h4>Your Rating Insight</h4>
          <p>{getRatingInsight()}</p>
        </div>
      )}

      {totalRatings > 0 && (
        <div className="rating-stats">
          <div className="stat-item">
            <span className="stat-number">{totalRatings}</span>
            <span className="stat-label">Total Ratings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round(averageRating * 20)}%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingAnalytics;
