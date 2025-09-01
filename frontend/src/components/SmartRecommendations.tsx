import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie } from './MovieCard';
import './SmartRecommendations.css';

interface RecommendationReason {
  type: 'genre' | 'actor' | 'director' | 'similar' | 'trending' | 'rating' | 'collaborative' | 'hidden-gems';
  description: string;
  confidence: number;
  data?: any;
}

interface SmartRecommendation {
  movie: Movie;
  score: number;
  reasons: RecommendationReason[];
  matchPercentage: number;
}

interface SmartRecommendationsProps {
  userId: number;
  onMovieClick?: (movie: Movie) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ userId, onMovieClick }) => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high-confidence' | 'new-releases' | 'hidden-gems'>('all');
  const [showInsights, setShowInsights] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<SmartRecommendation | null>(null);

  useEffect(() => {
    fetchSmartRecommendations();
  }, [userId]);

  const fetchSmartRecommendations = async () => {
    try {
      setLoading(true);
      // Mock AI-powered recommendations - replace with actual ML API call
      const mockRecommendations: SmartRecommendation[] = [
        {
          movie: {
            id: 1,
            title: 'Inception',
            overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
            vote_average: 8.8,
            release_date: '2010-07-16'
          },
          score: 0.94,
          matchPercentage: 94,
          reasons: [
            {
              type: 'genre',
              description: 'You love sci-fi movies (rated 5 similar films highly)',
              confidence: 0.92,
              data: { genre: 'Sci-Fi', similarRated: 5 }
            },
            {
              type: 'director',
              description: 'Christopher Nolan films match your taste perfectly',
              confidence: 0.89,
              data: { director: 'Christopher Nolan', avgRating: 4.8 }
            },
            {
              type: 'collaborative',
              description: 'Users with similar taste to you loved this movie',
              confidence: 0.87,
              data: { similarUsers: 127, avgRating: 4.6 }
            }
          ]
        },
        {
          movie: {
            id: 2,
            title: 'The Grand Budapest Hotel',
            overview: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
            poster_path: '/eWdyYQreja6F6B1RSr9y3H9MQvO.jpg',
            vote_average: 8.1,
            release_date: '2014-03-07'
          },
          score: 0.87,
          matchPercentage: 87,
          reasons: [
            {
              type: 'genre',
              description: 'You enjoy quirky comedies and ensemble casts',
              confidence: 0.85,
              data: { genre: 'Comedy', similarRated: 3 }
            },
            {
              type: 'actor',
              description: 'Ralph Fiennes appears in several movies you rated highly',
              confidence: 0.82,
              data: { actor: 'Ralph Fiennes', avgRating: 4.2 }
            }
          ]
        },
        {
          movie: {
            id: 3,
            title: 'Parasite',
            overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
            poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
            vote_average: 8.6,
            release_date: '2019-10-11'
          },
          score: 0.83,
          matchPercentage: 83,
          reasons: [
            {
              type: 'genre',
              description: 'You appreciate thought-provoking dramas',
              confidence: 0.81,
              data: { genre: 'Drama', similarRated: 8 }
            },
            {
              type: 'rating',
              description: 'High critical acclaim matches your preference for quality films',
              confidence: 0.79,
              data: { awards: 'Oscar Winner', rating: 8.6 }
            }
          ]
        },
        {
          movie: {
            id: 4,
            title: 'Spirited Away',
            overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.',
            poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
            vote_average: 8.6,
            release_date: '2001-07-20'
          },
          score: 0.79,
          matchPercentage: 79,
          reasons: [
            {
              type: 'genre',
              description: 'You enjoy animated films with deep storytelling',
              confidence: 0.77,
              data: { genre: 'Animation', similarRated: 4 }
            },
            {
              type: 'hidden-gems',
              description: 'This acclaimed film might have flown under your radar',
              confidence: 0.75,
              data: { category: 'Hidden Gem', year: 2001 }
            }
          ]
        },
        {
          movie: {
            id: 5,
            title: 'The Social Network',
            overview: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.',
            poster_path: '/n0ybibhJtQdrm9q8e0cNQ2jq9j8.jpg',
            vote_average: 7.8,
            release_date: '2010-10-01'
          },
          score: 0.76,
          matchPercentage: 76,
          reasons: [
            {
              type: 'director',
              description: 'David Fincher\'s style appeals to your taste',
              confidence: 0.74,
              data: { director: 'David Fincher', avgRating: 4.1 }
            },
            {
              type: 'trending',
              description: 'Currently trending among users with similar preferences',
              confidence: 0.72,
              data: { trending: true, similarUsers: 89 }
            }
          ]
        }
      ];

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to fetch smart recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    switch (activeFilter) {
      case 'high-confidence':
        return rec.score >= 0.85;
      case 'new-releases':
        return rec.movie.release_date ? new Date(rec.movie.release_date).getFullYear() >= 2020 : false;
      case 'hidden-gems':
        return rec.reasons.some(r => r.type === 'hidden-gems');
      default:
        return true;
    }
  });

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return '#10b981'; // Green
    if (score >= 0.8) return '#f59e0b'; // Yellow
    if (score >= 0.7) return '#ef4444'; // Red
    return '#6b7280'; // Gray
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.9) return 'Excellent Match';
    if (score >= 0.8) return 'Great Match';
    if (score >= 0.7) return 'Good Match';
    return 'Decent Match';
  };

  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'genre': return '🎭';
      case 'actor': return '👤';
      case 'director': return '🎬';
      case 'similar': return '🔗';
      case 'trending': return '🔥';
      case 'rating': return '⭐';
      case 'collaborative': return '👥';
      case 'hidden-gems': return '💎';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="smart-recommendations loading">
        <div className="recommendations-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-filters"></div>
          <div className="skeleton-items">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-recommendations">
      <div className="recommendations-header">
        <div className="header-info">
          <h2>🤖 AI-Powered Recommendations</h2>
          <p>Personalized movie suggestions based on your taste and behavior</p>
        </div>
        <button 
          className="insights-button"
          onClick={() => setShowInsights(!showInsights)}
        >
          {showInsights ? 'Hide' : 'Show'} AI Insights
        </button>
      </div>

      {showInsights && (
        <div className="ai-insights">
          <h3>🎯 Your Taste Profile</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🎭</div>
              <div className="insight-content">
                <h4>Favorite Genres</h4>
                <p>Sci-Fi, Drama, Thriller</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">👤</div>
              <div className="insight-content">
                <h4>Preferred Directors</h4>
                <p>Christopher Nolan, David Fincher</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">⭐</div>
              <div className="insight-content">
                <h4>Rating Pattern</h4>
                <p>You prefer critically acclaimed films</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📊</div>
              <div className="insight-content">
                <h4>Average Rating</h4>
                <p>3.8/5 (generous rater)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recommendations-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Recommendations ({recommendations.length})
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'high-confidence' ? 'active' : ''}`}
            onClick={() => setActiveFilter('high-confidence')}
          >
            High Confidence ({recommendations.filter(r => r.score >= 0.85).length})
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'new-releases' ? 'active' : ''}`}
            onClick={() => setActiveFilter('new-releases')}
          >
            New Releases ({recommendations.filter(r => r.movie.release_date && new Date(r.movie.release_date).getFullYear() >= 2020).length})
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'hidden-gems' ? 'active' : ''}`}
            onClick={() => setActiveFilter('hidden-gems')}
          >
            Hidden Gems ({recommendations.filter(r => r.reasons.some(reason => reason.type === 'hidden-gems')).length})
          </button>
        </div>
      </div>

      <div className="recommendations-grid">
        {filteredRecommendations.map((recommendation, index) => (
          <div key={recommendation.movie.id} className="recommendation-card">
            <div className="recommendation-header">
              <div className="match-info">
                <div 
                  className="confidence-badge"
                  style={{ backgroundColor: getConfidenceColor(recommendation.score) }}
                >
                  {recommendation.matchPercentage}% Match
                </div>
                <span className="confidence-label">
                  {getConfidenceLabel(recommendation.score)}
                </span>
              </div>
              <button 
                className="insights-toggle"
                onClick={() => setSelectedMovie(selectedMovie?.movie.id === recommendation.movie.id ? null : recommendation)}
              >
                {selectedMovie?.movie.id === recommendation.movie.id ? '−' : '+'}
              </button>
            </div>

            <MovieCard
              movie={recommendation.movie}
              onMovieClick={onMovieClick}
            />

            {selectedMovie?.movie.id === recommendation.movie.id && (
              <div className="recommendation-insights">
                <h4>Why We Think You'll Love This</h4>
                <div className="reasons-list">
                  {recommendation.reasons.map((reason, idx) => (
                    <div key={idx} className="reason-item">
                      <div className="reason-header">
                        <span className="reason-icon">{getReasonIcon(reason.type)}</span>
                        <span className="reason-type">{reason.type.replace('-', ' ').toUpperCase()}</span>
                        <span className="reason-confidence">
                          {Math.round(reason.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="reason-description">{reason.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="no-recommendations">
          <div className="no-recommendations-icon">🤖</div>
          <h3>No recommendations found</h3>
          <p>Try adjusting your filters or rate more movies to get better recommendations!</p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
