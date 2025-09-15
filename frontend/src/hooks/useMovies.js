// Custom React Hooks for Movie Data
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';

// Hook for fetching movies by type (popular, top-rated)
export const useMovies = (type = 'popular', page = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    setLoading(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      let response;
      switch (type) {
        case 'popular':
          response = await api.getPopularMovies(page);
          break;
        case 'top-rated':
          response = await api.getTopRatedMovies(page);
          break;
        default:
          response = await api.getMovies(page);
      }

      if (response.success) {
        setMovies(response.data.items || response.data);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || 'Failed to fetch movies');
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError('Failed to load movies');
      setLoading(LOADING_STATES.ERROR);
      console.error('Error fetching movies:', err);
    }
  }, [type, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return { movies, loading, error, refetch: fetchMovies };
};

// Hook for movie search functionality
export const useMovieSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(LOADING_STATES.IDLE);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      const response = await api.searchMovies(query, page);
      
      if (response.success) {
        setSearchResults(response.data.items || response.data);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || 'Search failed');
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError('Search failed');
      setLoading(LOADING_STATES.ERROR);
      console.error('Error searching movies:', err);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
    setLoading(LOADING_STATES.IDLE);
  }, []);

  return { 
    searchResults, 
    loading, 
    error, 
    searchMovies, 
    clearSearch 
  };
};

// Hook for fetching individual movie details
export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    if (!movieId) return;

    setLoading(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      const response = await api.getMovie(movieId);
      
      if (response.success) {
        setMovie(response.data);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || 'Movie not found');
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError('Failed to load movie details');
      setLoading(LOADING_STATES.ERROR);
      console.error('Error fetching movie details:', err);
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  return { movie, loading, error, refetch: fetchMovieDetails };
};

// Default export for backward compatibility
export default useMovies;