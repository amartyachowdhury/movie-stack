import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

interface UserStats {
  total_ratings: number;
  total_favorites: number;
  average_rating_given: number;
  top_genres: Array<{ genre: string; count: number }>;
  member_since: string;
  last_active: string;
}

const UserProfile: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchUserStats();
    }
  }, [token]);

  const fetchUserStats = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5001/api/users/me/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        setError('Failed to load user statistics');
      }
    } catch (err) {
      setError('Failed to load user statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} />
          ) : (
            <div className="avatar-placeholder">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{user.username}</h1>
          {user.email && <p className="profile-email">{user.email}</p>}
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <p className="profile-member-since">
            Member since {formatDate(user.created_at)}
          </p>
        </div>
        
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="profile-stats">
        <h2>Your Activity</h2>
        
        {isLoading && <div className="loading">Loading statistics...</div>}
        {error && <div className="error">{error}</div>}
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total_ratings}</div>
              <div className="stat-label">Movies Rated</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.total_favorites}</div>
              <div className="stat-label">Favorites</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">{stats.average_rating_given.toFixed(1)}</div>
              <div className="stat-label">Avg Rating Given</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-number">
                {stats.last_active ? formatDate(stats.last_active) : 'Never'}
              </div>
              <div className="stat-label">Last Active</div>
            </div>
          </div>
        )}
      </div>

      {stats && stats.top_genres.length > 0 && (
        <div className="profile-genres">
          <h2>Your Favorite Genres</h2>
          <div className="genres-list">
            {stats.top_genres.map((genre, index) => (
              <div key={index} className="genre-tag">
                <span className="genre-name">{genre.genre}</span>
                <span className="genre-count">{genre.count} movies</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.favorite_genres && user.favorite_genres.length > 0 && (
        <div className="profile-preferences">
          <h2>Your Preferences</h2>
          <div className="preferences-list">
            {user.favorite_genres.map((genre, index) => (
              <span key={index} className="preference-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
