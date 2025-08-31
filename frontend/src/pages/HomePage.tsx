import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MovieGrid from '../components/MovieGrid';
import SmartSearch from '../components/SmartSearch';
import ThemeToggle from '../components/ThemeToggle';
import HeroSection from '../components/HeroSection';
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
  
  // Separate state for search results to prevent conflicts
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
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

  const handleSearch = async (query: string, filters: any) => {
    // Prevent multiple simultaneous searches
    if (isSearching) return;
    
    // Create a search key to track if this search is still relevant
    const searchKey = `${query}-${JSON.stringify(filters)}`;
    
    setSearchQuery(query);
    setSearchFilters(filters);
    
    // Only switch to search tab if there's actually a search query or filters
    const hasSearchCriteria = query.trim() || Object.values(filters).some(filter => filter);
    
    if (hasSearchCriteria) {
      // Only switch tab if we're not already on search tab
      if (activeTab !== 'search') {
        setActiveTab('search');
      }
      
      // Custom search implementation to avoid conflicts
      setIsSearching(true);
      setSearchLoading(true);
      setSearchError(null);
      
      // Add minimum loading time to prevent flickering
      const startTime = Date.now();
      const minLoadingTime = 300; // Minimum 300ms loading time
      
      try {
        const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=1&genre=${filters.genre}&year=${filters.year}&min_rating=${filters.minRating}`);
        
        // Check if this search is still relevant (user hasn't typed more)
        if (searchKey !== `${query}-${JSON.stringify(filters)}`) {
          return; // Search is outdated, ignore results
        }
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setSearchResults(data.data?.results || []);
      } catch (err) {
        // Only set error if this search is still relevant
        if (searchKey === `${query}-${JSON.stringify(filters)}`) {
          setSearchError(err instanceof Error ? err.message : 'Search failed');
          setSearchResults([]);
        }
      } finally {
        // Only update loading state if this search is still relevant
        if (searchKey === `${query}-${JSON.stringify(filters)}`) {
          // Ensure minimum loading time to prevent flickering
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
          
          setTimeout(() => {
            // Double-check that this search is still relevant before updating state
            if (searchKey === `${query}-${JSON.stringify(filters)}`) {
              setSearchLoading(false);
              setIsSearching(false);
            }
          }, remainingTime);
        }
      }
    } else {
      // Only switch back to popular if we're currently on search tab
      if (activeTab === 'search') {
        setActiveTab('popular');
      }
      // Clear search results when no search criteria
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
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

  // Memoize the current movies to prevent unnecessary re-renders
  const currentMovies = useMemo(() => getCurrentMovies(), [
    activeTab,
    searchResults,
    recommendations,
    popularMovies
  ]);

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
                  className="nav-button"
                  onClick={() => navigate('/watchlist')}
                >
                  📋 Watchlist
                </button>
                <button 
                  className="nav-button"
                  onClick={() => navigate('/recommendations')}
                >
                  🤖 AI Recommendations
                </button>
                <button 
                  className="nav-button"
                  onClick={() => navigate('/analytics')}
                >
                  📊 Analytics
                </button>
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
        <div className="theme-controls">
          <ThemeToggle />
        </div>
      </div>
      
      <HeroSection 
        featuredMovies={popularMovies.slice(0, 5)} 
        loading={popularLoading}
      />

      <div className="content-section">
        <SmartSearch 
          onSearch={handleSearch} 
          onSuggestionSelect={(suggestion) => {
            console.log('Suggestion selected:', suggestion);
            // Handle suggestion selection - could navigate to movie details or search
            if (suggestion.type === 'movie') {
              // Find the movie in our data and navigate to it
              const movie = popularMovies.find(m => m.title === suggestion.title);
              if (movie) {
                handleMovieClick(movie);
              }
            } else {
              // For genres, actors, directors - perform a search
              handleSearch(suggestion.title, {});
            }
          }}
          loading={searchLoading}
          recentSearches={['The Dark Knight', 'Inception', 'Interstellar']}
          popularSearches={['Action', 'Drama', 'Comedy', 'Sci-Fi']}
        />
        
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
                    handleSearch(searchQuery, searchFilters);
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
            key={`${activeTab}-${selectedAlgorithm}`} // Stable key to prevent unnecessary re-renders
            movies={currentMovies}
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
