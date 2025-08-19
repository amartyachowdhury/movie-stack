import React, { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

interface AnalyticsData {
  totalMoviesRated: number;
  averageRating: number;
  favoriteGenres: Array<{ genre: string; count: number }>;
  ratingDistribution: { [key: number]: number };
  recentActivity: Array<{
    id: number;
    movieTitle: string;
    rating: number;
    date: string;
  }>;
  watchTime: number; // in minutes
  mostRatedDecade: string;
  ratingTrend: Array<{ month: string; average: number }>;
}

interface AnalyticsDashboardProps {
  userId: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'genres' | 'activity'>('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData: AnalyticsData = {
        totalMoviesRated: 47,
        averageRating: 3.8,
        favoriteGenres: [
          { genre: 'Action', count: 12 },
          { genre: 'Drama', count: 10 },
          { genre: 'Comedy', count: 8 },
          { genre: 'Sci-Fi', count: 6 },
          { genre: 'Thriller', count: 5 }
        ],
        ratingDistribution: {
          5: 8,
          4: 15,
          3: 12,
          2: 8,
          1: 4
        },
        recentActivity: [
          { id: 1, movieTitle: 'Inception', rating: 5, date: '2024-01-15' },
          { id: 2, movieTitle: 'The Dark Knight', rating: 5, date: '2024-01-14' },
          { id: 3, movieTitle: 'Interstellar', rating: 4, date: '2024-01-13' },
          { id: 4, movieTitle: 'Pulp Fiction', rating: 4, date: '2024-01-12' },
          { id: 5, movieTitle: 'Fight Club', rating: 3, date: '2024-01-11' }
        ],
        watchTime: 2840, // 47 hours 20 minutes
        mostRatedDecade: '2010s',
        ratingTrend: [
          { month: 'Oct', average: 3.5 },
          { month: 'Nov', average: 3.7 },
          { month: 'Dec', average: 3.9 },
          { month: 'Jan', average: 4.1 }
        ]
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRatingInsight = () => {
    if (!analytics) return '';
    
    const { averageRating, totalMoviesRated } = analytics;
    
    if (averageRating >= 4.0) {
      return "You're quite generous with your ratings! You tend to enjoy most movies you watch.";
    } else if (averageRating >= 3.0) {
      return "You have a balanced approach to rating movies. You're selective but fair.";
    } else {
      return "You're quite critical in your movie ratings. You have high standards for quality.";
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="analytics-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
          <div className="skeleton-chart"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-message">
          <h3>Failed to load analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAnalytics}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Your Movie Analytics</h2>
        <p>Insights from your movie watching journey</p>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Trends
        </button>
        <button 
          className={`tab ${activeTab === 'genres' ? 'active' : ''}`}
          onClick={() => setActiveTab('genres')}
        >
          Genres
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Recent Activity
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎬</div>
                <div className="stat-value">{analytics.totalMoviesRated}</div>
                <div className="stat-label">Movies Rated</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{analytics.averageRating.toFixed(1)}</div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{formatWatchTime(analytics.watchTime)}</div>
                <div className="stat-label">Total Watch Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{analytics.mostRatedDecade}</div>
                <div className="stat-label">Favorite Decade</div>
              </div>
            </div>

            <div className="rating-insight">
              <h3>Rating Insight</h3>
              <p>{getRatingInsight()}</p>
            </div>

            <div className="rating-distribution">
              <h3>Your Rating Distribution</h3>
              <div className="distribution-bars">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="distribution-row">
                    <span className="rating-label">{rating} ⭐</span>
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill"
                        style={{ 
                          width: `${(analytics.ratingDistribution[rating] / analytics.totalMoviesRated) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="rating-count">{analytics.ratingDistribution[rating]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="trends-tab">
            <h3>Rating Trends</h3>
            <div className="trend-chart">
              {analytics.ratingTrend.map((trend, index) => (
                <div key={index} className="trend-bar">
                  <div 
                    className="trend-fill"
                    style={{ height: `${(trend.average / 5) * 100}%` }}
                  ></div>
                  <span className="trend-value">{trend.average.toFixed(1)}</span>
                  <span className="trend-month">{trend.month}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'genres' && (
          <div className="genres-tab">
            <h3>Your Favorite Genres</h3>
            <div className="genre-list">
              {analytics.favoriteGenres.map((genre, index) => (
                <div key={genre.genre} className="genre-item">
                  <div className="genre-info">
                    <span className="genre-name">{genre.genre}</span>
                    <span className="genre-count">{genre.count} movies</span>
                  </div>
                  <div className="genre-bar">
                    <div 
                      className="genre-fill"
                      style={{ 
                        width: `${(genre.count / analytics.favoriteGenres[0].count) * 100}%`,
                        background: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {analytics.recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-movie">
                    <span className="movie-title">{activity.movieTitle}</span>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                  <div className="activity-rating">
                    {'⭐'.repeat(activity.rating)}
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

export default AnalyticsDashboard;
