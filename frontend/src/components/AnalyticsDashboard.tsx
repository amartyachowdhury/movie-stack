import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './AnalyticsDashboard.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface UserInsights {
  totalMoviesWatched: number;
  averageRating: number;
  favoriteGenres: Array<{ genre: string; count: number; percentage: number }>;
  watchingTrends: Array<{ month: string; moviesWatched: number }>;
  ratingDistribution: Record<number, number>;
  topRatedMovies: Movie[];
  recentlyWatched: Movie[];
  watchlistSize: number;
  completionRate: number;
}

interface CommunityAnalytics {
  totalUsers: number;
  totalRatings: number;
  mostPopularMovies: Movie[];
  trendingGenres: Array<{ genre: string; popularity: number }>;
  averageCommunityRating: number;
  topRatedThisWeek: Movie[];
  mostActiveUsers: Array<{ username: string; activity: number }>;
}

interface RecommendationInsights {
  totalRecommendations: number;
  recommendationAccuracy: number;
  mostSuccessfulAlgorithms: Array<{ algorithm: string; accuracy: number }>;
  userEngagement: number;
  clickThroughRate: number;
  conversionRate: number;
}

interface AnalyticsDashboardProps {
  userId: number;
  onMovieClick?: (movie: Movie) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, onMovieClick }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'community' | 'recommendations'>('personal');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [loading, setLoading] = useState(true);
  const [userInsights, setUserInsights] = useState<UserInsights | null>(null);
  const [communityAnalytics, setCommunityAnalytics] = useState<CommunityAnalytics | null>(null);
  const [recommendationInsights, setRecommendationInsights] = useState<RecommendationInsights | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockUserInsights: UserInsights = {
        totalMoviesWatched: 47,
        averageRating: 3.8,
        favoriteGenres: [
          { genre: 'Sci-Fi', count: 12, percentage: 25.5 },
          { genre: 'Drama', count: 10, percentage: 21.3 },
          { genre: 'Thriller', count: 8, percentage: 17.0 },
          { genre: 'Comedy', count: 7, percentage: 14.9 },
          { genre: 'Action', count: 6, percentage: 12.8 },
          { genre: 'Romance', count: 4, percentage: 8.5 }
        ],
        watchingTrends: [
          { month: 'Jan', moviesWatched: 8 },
          { month: 'Feb', moviesWatched: 6 },
          { month: 'Mar', moviesWatched: 12 },
          { month: 'Apr', moviesWatched: 9 },
          { month: 'May', moviesWatched: 7 },
          { month: 'Jun', moviesWatched: 5 }
        ],
        ratingDistribution: {
          5: 12,
          4: 18,
          3: 10,
          2: 5,
          1: 2
        },
        topRatedMovies: [
          {
            id: 1,
            title: 'Inception',
            overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            vote_average: 8.8,
            release_date: '2010-07-16'
          },
          {
            id: 2,
            title: 'The Shawshank Redemption',
            overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
            vote_average: 9.3,
            release_date: '1994-09-22'
          },
          {
            id: 3,
            title: 'Parasite',
            overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
            poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
            vote_average: 8.6,
            release_date: '2019-10-11'
          }
        ],
        recentlyWatched: [
          {
            id: 4,
            title: 'Dune: Part Two',
            overview: 'Paul Atreides unites with Chani and the Fremen.',
            poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
            vote_average: 8.4,
            release_date: '2024-03-01'
          },
          {
            id: 5,
            title: 'Poor Things',
            overview: 'The incredible tale about the fantastical evolution of Bella Baxter.',
            poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
            vote_average: 7.8,
            release_date: '2023-12-08'
          }
        ],
        watchlistSize: 23,
        completionRate: 78.5
      };

      const mockCommunityAnalytics: CommunityAnalytics = {
        totalUsers: 15420,
        totalRatings: 89234,
        mostPopularMovies: [
          {
            id: 6,
            title: 'Oppenheimer',
            overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
            poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
            vote_average: 8.1,
            release_date: '2023-07-21'
          },
          {
            id: 7,
            title: 'Barbie',
            overview: 'Barbie suffers a crisis that leads her to question her world and her existence.',
            poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
            vote_average: 7.2,
            release_date: '2023-07-21'
          },
          {
            id: 8,
            title: 'Killers of the Flower Moon',
            overview: 'When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one.',
            poster_path: '/dB6Krk806zeqd0nppXgT7RMRFth.jpg',
            vote_average: 7.6,
            release_date: '2023-10-20'
          }
        ],
        trendingGenres: [
          { genre: 'Drama', popularity: 85 },
          { genre: 'Sci-Fi', popularity: 72 },
          { genre: 'Thriller', popularity: 68 },
          { genre: 'Comedy', popularity: 65 },
          { genre: 'Action', popularity: 58 }
        ],
        averageCommunityRating: 3.6,
        topRatedThisWeek: [
          {
            id: 9,
            title: 'The Zone of Interest',
            overview: 'The commandant of Auschwitz, Rudolf Höss, and his wife Hedwig, strive to build a dream life for their family.',
            poster_path: '/hUu9zyEjDl4CdMhDJgx6T5dQUVl.jpg',
            vote_average: 7.5,
            release_date: '2023-12-15'
          }
        ],
        mostActiveUsers: [
          { username: 'MovieBuff2024', activity: 156 },
          { username: 'CinemaLover', activity: 142 },
          { username: 'FilmCritic', activity: 128 },
          { username: 'MovieExplorer', activity: 115 },
          { username: 'Cinephile', activity: 98 }
        ]
      };

      const mockRecommendationInsights: RecommendationInsights = {
        totalRecommendations: 2340,
        recommendationAccuracy: 87.3,
        mostSuccessfulAlgorithms: [
          { algorithm: 'Collaborative Filtering', accuracy: 89.2 },
          { algorithm: 'Content-Based', accuracy: 85.7 },
          { algorithm: 'Hybrid', accuracy: 87.3 }
        ],
        userEngagement: 73.8,
        clickThroughRate: 34.2,
        conversionRate: 28.7
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setUserInsights(mockUserInsights);
      setCommunityAnalytics(mockCommunityAnalytics);
      setRecommendationInsights(mockRecommendationInsights);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInsights = () => {
    if (!userInsights) return null;

    return (
      <div className="analytics-content">
        <div className="insights-overview">
          <div className="overview-card">
            <div className="overview-icon">🎬</div>
            <div className="overview-info">
              <h3>{userInsights.totalMoviesWatched}</h3>
              <p>Movies Watched</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">⭐</div>
            <div className="overview-info">
              <h3>{userInsights.averageRating.toFixed(1)}</h3>
              <p>Average Rating</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📋</div>
            <div className="overview-info">
              <h3>{userInsights.watchlistSize}</h3>
              <p>Watchlist Items</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📊</div>
            <div className="overview-info">
              <h3>{userInsights.completionRate}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="insights-grid">
          <div className="insight-card">
            <h3>Favorite Genres</h3>
            <div className="genre-chart">
              {userInsights.favoriteGenres.map((genre, index) => (
                <div key={genre.genre} className="genre-bar">
                  <div className="genre-info">
                    <span className="genre-name">{genre.genre}</span>
                    <span className="genre-count">{genre.count} movies</span>
                  </div>
                  <div className="genre-progress">
                    <div 
                      className="genre-fill" 
                      style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <h3>Watching Trends</h3>
            <div className="trend-chart">
              {userInsights.watchingTrends.map((trend) => (
                <div key={trend.month} className="trend-bar">
                  <div className="trend-label">{trend.month}</div>
                  <div className="trend-value">{trend.moviesWatched}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <h3>Rating Distribution</h3>
            <div className="rating-chart">
              {Object.entries(userInsights.ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className="rating-bar">
                  <div className="rating-stars">{'⭐'.repeat(parseInt(rating))}</div>
                  <div className="rating-progress">
                    <div 
                      className="rating-fill" 
                      style={{ width: `${(count / Math.max(...Object.values(userInsights.ratingDistribution))) * 100}%` }}
                    ></div>
                  </div>
                  <div className="rating-count">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <h3>Top Rated Movies</h3>
            <div className="movie-list">
              {userInsights.topRatedMovies.map((movie) => (
                <div key={movie.id} className="movie-item" onClick={() => onMovieClick?.(movie)}>
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                  <div className="movie-info">
                    <h4>{movie.title}</h4>
                    <span className="movie-rating">⭐ {movie.vote_average}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCommunityAnalytics = () => {
    if (!communityAnalytics) return null;

    return (
      <div className="analytics-content">
        <div className="community-overview">
          <div className="overview-card">
            <div className="overview-icon">👥</div>
            <div className="overview-info">
              <h3>{communityAnalytics.totalUsers.toLocaleString()}</h3>
              <p>Active Users</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">⭐</div>
            <div className="overview-info">
              <h3>{communityAnalytics.totalRatings.toLocaleString()}</h3>
              <p>Total Ratings</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📊</div>
            <div className="overview-info">
              <h3>{communityAnalytics.averageCommunityRating.toFixed(1)}</h3>
              <p>Community Rating</p>
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Most Popular Movies</h3>
            <div className="popular-movies">
              {communityAnalytics.mostPopularMovies.map((movie, index) => (
                <div key={movie.id} className="popular-movie" onClick={() => onMovieClick?.(movie)}>
                  <div className="popular-rank">#{index + 1}</div>
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                  <div className="movie-info">
                    <h4>{movie.title}</h4>
                    <span className="movie-rating">⭐ {movie.vote_average}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>Trending Genres</h3>
            <div className="trending-genres">
              {communityAnalytics.trendingGenres.map((genre) => (
                <div key={genre.genre} className="trending-genre">
                  <span className="genre-name">{genre.genre}</span>
                  <div className="trending-progress">
                    <div 
                      className="trending-fill" 
                      style={{ width: `${genre.popularity}%` }}
                    ></div>
                  </div>
                  <span className="genre-popularity">{genre.popularity}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>Most Active Users</h3>
            <div className="active-users">
              {communityAnalytics.mostActiveUsers.map((user, index) => (
                <div key={user.username} className="active-user">
                  <div className="user-rank">#{index + 1}</div>
                  <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="activity">{user.activity} activities</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendationInsights = () => {
    if (!recommendationInsights) return null;

    return (
      <div className="analytics-content">
        <div className="recommendations-overview">
          <div className="overview-card">
            <div className="overview-icon">🎯</div>
            <div className="overview-info">
              <h3>{recommendationInsights.totalRecommendations.toLocaleString()}</h3>
              <p>Recommendations Given</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">📈</div>
            <div className="overview-info">
              <h3>{recommendationInsights.recommendationAccuracy}%</h3>
              <p>Accuracy Rate</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">👆</div>
            <div className="overview-info">
              <h3>{recommendationInsights.clickThroughRate}%</h3>
              <p>Click-Through Rate</p>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-icon">✅</div>
            <div className="overview-info">
              <h3>{recommendationInsights.conversionRate}%</h3>
              <p>Conversion Rate</p>
            </div>
          </div>
        </div>

        <div className="recommendations-grid">
          <div className="recommendations-card">
            <h3>Algorithm Performance</h3>
            <div className="algorithm-chart">
              {recommendationInsights.mostSuccessfulAlgorithms.map((algorithm) => (
                <div key={algorithm.algorithm} className="algorithm-bar">
                  <div className="algorithm-info">
                    <span className="algorithm-name">{algorithm.algorithm}</span>
                    <span className="algorithm-accuracy">{algorithm.accuracy}%</span>
                  </div>
                  <div className="algorithm-progress">
                    <div 
                      className="algorithm-fill" 
                      style={{ width: `${algorithm.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-card">
            <h3>User Engagement</h3>
            <div className="engagement-metrics">
              <div className="metric-item">
                <div className="metric-circle" style={{ background: `conic-gradient(var(--accent-primary) 0deg ${recommendationInsights.userEngagement * 3.6}deg, var(--border-primary) 0deg)` }}>
                  <span>{recommendationInsights.userEngagement}%</span>
                </div>
                <p>User Engagement</p>
              </div>
              <div className="metric-item">
                <div className="metric-circle" style={{ background: `conic-gradient(var(--accent-secondary) 0deg ${recommendationInsights.clickThroughRate * 3.6}deg, var(--border-primary) 0deg)` }}>
                  <span>{recommendationInsights.clickThroughRate}%</span>
                </div>
                <p>Click-Through Rate</p>
              </div>
              <div className="metric-item">
                <div className="metric-circle" style={{ background: `conic-gradient(var(--accent-tertiary) 0deg ${recommendationInsights.conversionRate * 3.6}deg, var(--border-primary) 0deg)` }}>
                  <span>{recommendationInsights.conversionRate}%</span>
                </div>
                <p>Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="analytics-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-tabs"></div>
          <div className="skeleton-content">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div className="header-info">
          <h2>📊 Analytics Dashboard</h2>
          <p>Deep insights into your movie watching patterns and community trends</p>
        </div>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="time-range-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`analytics-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          👤 Personal Insights
        </button>
        <button 
          className={`analytics-tab ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          🌍 Community Analytics
        </button>
        <button 
          className={`analytics-tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          🎯 Recommendation Insights
        </button>
      </div>

      <div className="analytics-body">
        {activeTab === 'personal' && renderPersonalInsights()}
        {activeTab === 'community' && renderCommunityAnalytics()}
        {activeTab === 'recommendations' && renderRecommendationInsights()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
