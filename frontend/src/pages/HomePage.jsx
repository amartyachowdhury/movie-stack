// Home Page Component
import React, { useState } from 'react';
import { useMovies, useMovieSearch } from '../hooks/useMovies';
import MovieCard from '../components/movie/MovieCard';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { LOADING_STATES } from '../constants';

const HomePage = ({ onMovieClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEndpoint, setCurrentEndpoint] = useState('popular');
  
  const { movies, loading: moviesLoading, error: moviesError } = useMovies(currentEndpoint);
  const { 
    searchResults, 
    loading: searchLoading, 
    error: searchError, 
    searchMovies, 
    clearSearch 
  } = useMovieSearch();

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      searchMovies(query);
    } else {
      setSearchQuery('');
      clearSearch();
    }
  };

  const handleEndpointChange = (endpoint) => {
    setCurrentEndpoint(endpoint);
    setSearchQuery('');
    clearSearch();
  };

  const displayMovies = searchQuery ? searchResults : movies;
  const isLoading = searchQuery ? searchLoading : moviesLoading;
  const error = searchQuery ? searchError : moviesError;


  return (
    <div className="home-page">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={searchLoading === LOADING_STATES.LOADING}
      />

      {/* Navigation Tabs */}
      {!searchQuery && (
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
                {searchQuery 
                  ? `Search Results for "${searchQuery}" (${displayMovies.length} movies)`
                  : `${currentEndpoint === 'popular' ? 'Popular' : 'Top Rated'} Movies (${displayMovies.length} movies)`
                }
              </h2>
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
