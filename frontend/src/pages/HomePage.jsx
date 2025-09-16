// Home Page Component
import React, { useState } from 'react';
import { useMovies, useMovieSearch, useMovieDiscovery } from '../hooks/useMovies';
import MovieCard from '../components/movie/MovieCard';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import AdvancedSearch from '../components/search/AdvancedSearch';
import { LOADING_STATES } from '../constants';

const HomePage = ({ onMovieClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEndpoint, setCurrentEndpoint] = useState('popular');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchMode, setSearchMode] = useState('basic'); // 'basic', 'advanced', 'discovery'
  
  const { movies, loading: moviesLoading, error: moviesError } = useMovies(currentEndpoint);
  const { 
    searchResults, 
    loading: searchLoading, 
    error: searchError, 
    searchMovies, 
    clearSearch 
  } = useMovieSearch();
  
  const {
    discoveryResults,
    loading: discoveryLoading,
    error: discoveryError,
    currentFilters,
    discoverMovies,
    clearDiscovery
  } = useMovieDiscovery();

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      setSearchMode('basic');
      searchMovies(query);
    } else {
      setSearchQuery('');
      setSearchMode('basic');
      clearSearch();
    }
  };

  const handleAdvancedSearch = (filters) => {
    setSearchMode('discovery');
    setSearchQuery('');
    clearSearch();
    discoverMovies(filters);
  };

  const handleAdvancedSearchToggle = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  const handleEndpointChange = (endpoint) => {
    setCurrentEndpoint(endpoint);
    setSearchQuery('');
    setSearchMode('basic');
    clearSearch();
    clearDiscovery();
  };

  // Determine which movies to display based on current mode
  const getDisplayMovies = () => {
    switch (searchMode) {
      case 'discovery':
        return discoveryResults;
      case 'basic':
        return searchQuery ? searchResults : movies;
      default:
        return movies;
    }
  };

  const getLoadingState = () => {
    switch (searchMode) {
      case 'discovery':
        return discoveryLoading;
      case 'basic':
        return searchQuery ? searchLoading : moviesLoading;
      default:
        return moviesLoading;
    }
  };

  const getError = () => {
    switch (searchMode) {
      case 'discovery':
        return discoveryError;
      case 'basic':
        return searchQuery ? searchError : moviesError;
      default:
        return moviesError;
    }
  };

  const displayMovies = getDisplayMovies();
  const isLoading = getLoadingState();
  const error = getError();


  return (
    <div className="home-page">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={searchLoading === LOADING_STATES.LOADING}
        onAdvancedSearch={handleAdvancedSearchToggle}
      />

      {/* Navigation Tabs */}
      {searchMode === 'basic' && !searchQuery && (
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${currentEndpoint === 'popular' ? 'active' : ''}`}
            onClick={() => handleEndpointChange('popular')}
          >
            Popular Movies
          </button>
          <button 
            className={`nav-tab ${currentEndpoint === 'top-rated' ? 'active' : ''}`}
            onClick={() => handleEndpointChange('top-rated')}
          >
            Top Rated
          </button>
        </div>
      )}

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onSearch={handleAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />

      {/* Content */}
      <main className="main-content">
        {isLoading === LOADING_STATES.LOADING && (
          <LoadingSpinner 
            message={searchQuery ? "Searching movies..." : "Loading movies..."} 
          />
        )}

        {error && (
          <div className="error-message">
            <h3>❌ Error Loading Movies</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => searchQuery ? searchMovies(searchQuery) : window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && displayMovies.length === 0 && (
          <div className="no-results">
            <h3>🔍 No Movies Found</h3>
            <p>
              {searchQuery 
                ? `No movies found for "${searchQuery}". Try a different search term.`
                : 'No movies available at the moment.'
              }
            </p>
          </div>
        )}

                 {displayMovies.length > 0 && (
                   <>
                     <div className="results-header">
                       <h2>
                         {searchMode === 'discovery' 
                           ? `Discovery Results (${displayMovies.length} movies)`
                           : searchQuery 
                             ? `Search Results for "${searchQuery}" (${displayMovies.length} movies)`
                             : `${currentEndpoint === 'popular' ? 'Popular' : 'Top Rated'} Movies (${displayMovies.length} movies)`
                         }
                       </h2>
                       {searchMode === 'discovery' && Object.keys(currentFilters).length > 0 && (
                         <div className="active-filters">
                           <span>Active filters: </span>
                           {Object.entries(currentFilters).map(([key, value]) => (
                             <span key={key} className="filter-tag">
                               {key}: {value}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
            
            <div className="movies-grid">
              {displayMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieClick}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
