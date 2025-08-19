import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import { useMovies } from '../hooks/useMovies';
import { useRecommendations } from '../hooks/useRecommendations';
import { Movie } from '../components/MovieCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'popular' | 'search' | 'recommendations'>('popular');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'collaborative' | 'content' | 'hybrid'>('collaborative');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    genre: '',
    year: '',
    minRating: ''
  });
  
  const { 
    movies: popularMovies, 
    loading: popularLoading, 
    error: popularError, 
    fetchPopularMovies 
  } = useMovies();
  
  const { 
    movies: searchResults, 
    loading: searchLoading, 
    error: searchError, 
    searchMovies 
  } = useMovies();
  
  const { 
    recommendations, 
    loading: recommendationsLoading, 
    error: recommendationsError,
    algorithm,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations 
  } = useRecommendations();

  useEffect(() => {
    fetchPopularMovies(1);
  }, [fetchPopularMovies]);

  useEffect(() => {
    if (activeTab === 'recommendations') {
      switch (selectedAlgorithm) {
        case 'collaborative':
          getCollaborativeRecommendations(1);
          break;
        case 'content':
          getContentBasedRecommendations(1);
          break;
        case 'hybrid':
          getHybridRecommendations(1);
          break;
      }
    }
  }, [activeTab, selectedAlgorithm, getCollaborativeRecommendations, getContentBasedRecommendations, getHybridRecommendations]);

  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    
    // Only switch to search tab if there's actually a search query or filters
    const hasSearchCriteria = query.trim() || Object.values(filters).some(filter => filter);
    
    if (hasSearchCriteria) {
      // Only switch tab if we're not already on search tab
      if (activeTab !== 'search') {
        setActiveTab('search');
      }
      searchMovies(query, 1, filters);
    } else {
      // Only switch back to popular if we're currently on search tab
      if (activeTab === 'search') {
        setActiveTab('popular');
      }
    }
  };

  const handleMovieClick = (movie: Movie) => {
    const movieId = movie.id || movie.tmdb_id;
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  const handleRateMovie = (movieId: number, rating: number) => {
    // TODO: Implement rating functionality
    console.log('Rate movie:', movieId, rating);
  };

  const getCurrentMovies = () => {
    switch (activeTab) {
      case 'search':
        return searchResults;
      case 'recommendations':
        return recommendations;
      default:
        return popularMovies;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'search':
        return searchLoading;
      case 'recommendations':
        return recommendationsLoading;
      default:
        return popularLoading;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 'search':
        return searchError;
      case 'recommendations':
        return recommendationsError;
      default:
        return popularError;
    }
  };

  return (
    <div className="home-page">
      <div className="user-navigation">
        <div className="user-info">
          {user && (
            <>
              <span className="welcome-text">Welcome, {user.username}!</span>
              <div className="user-avatar">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-menu">
                <button 
                  className="profile-button"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </button>
                <button 
                  className="logout-button"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="hero-section">
        <h1>🎬 Movie Stack</h1>
        <p>Discover amazing movies with AI-powered recommendations</p>
      </div>

      <div className="content-section">
        <SearchBar onSearch={handleSearch} loading={searchLoading} />
        
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular Movies
          </button>
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
            disabled={!searchQuery.trim() && !Object.values(searchFilters).some(filter => filter)}
          >
            Search Results
          </button>
          <button
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {activeTab === 'recommendations' && (
          <div className="algorithm-selector">
            <label>Recommendation Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
            >
              <option value="collaborative">Collaborative Filtering</option>
              <option value="content">Content-Based</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {algorithm && (
              <span className="algorithm-info">
                Using: {algorithm}
              </span>
            )}
          </div>
        )}

        <div className={`movies-section ${getCurrentLoading() ? 'loading' : ''}`}>
          {getCurrentError() && (
            <div className="error-message">
              <p>Error loading movies: {getCurrentError()}</p>
              <button onClick={() => {
                switch (activeTab) {
                  case 'search':
                    searchMovies(searchQuery, 1);
                    break;
                  case 'recommendations':
                    switch (selectedAlgorithm) {
                      case 'collaborative':
                        getCollaborativeRecommendations(1);
                        break;
                      case 'content':
                        getContentBasedRecommendations(1);
                        break;
                      case 'hybrid':
                        getHybridRecommendations(1);
                        break;
                    }
                    break;
                  default:
                    fetchPopularMovies(1);
                }
              }}>Try Again</button>
            </div>
          )}
          
          <MovieGrid
            movies={getCurrentMovies()}
            loading={getCurrentLoading()}
            onMovieClick={handleMovieClick}
            showRating={true}
            onRateMovie={handleRateMovie}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
