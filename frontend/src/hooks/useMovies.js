// Custom React Hooks for Movie Data
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';
import { debounce } from '../utils';

// Simple in-memory cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (endpoint, params = {}) => {
  return `${endpoint}_${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  apiCache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Hook for fetching movies by type (popular, top-rated)
export const useMovies = (type = 'popular', page = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchMovies = useCallback(async () => {
    const cacheKey = getCacheKey(`movies_${type}`, { page });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setMovies(cachedData);
      setLoading(LOADING_STATES.SUCCESS);
      return;
    }

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
        const movieData = response.data.items || response.data;
        setMovies(movieData);
        setCachedData(cacheKey, movieData);
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
  const abortControllerRef = useRef(null);

  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(LOADING_STATES.IDLE);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const cacheKey = getCacheKey('search', { query, page });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setSearchResults(cachedData);
      setLoading(LOADING_STATES.SUCCESS);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      const response = await api.searchMovies(query, page);
      
      if (response.success) {
        const searchData = response.data.items || response.data;
        setSearchResults(searchData);
        setCachedData(cacheKey, searchData);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || 'Search failed');
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Search failed');
        setLoading(LOADING_STATES.ERROR);
        console.error('Error searching movies:', err);
      }
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query, page = 1) => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      searchMovies(query, page);
    }, 300),
    [searchMovies]
  );

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
    debouncedSearch,
    clearSearch 
  };
};

// Hook for advanced movie discovery with filters
export const useMovieDiscovery = () => {
  const [discoveryResults, setDiscoveryResults] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const discoverMovies = useCallback(async (filters = {}, page = 1) => {
    const cacheKey = getCacheKey('discover', { ...filters, page });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setDiscoveryResults(cachedData);
      setCurrentFilters(filters);
      setLoading(LOADING_STATES.SUCCESS);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError(null);
    setCurrentFilters(filters);
    
    try {
      const response = await api.discoverMovies(filters, page);
      
      if (response.success) {
        const discoveryData = response.data.items || response.data;
        setDiscoveryResults(discoveryData);
        setCachedData(cacheKey, discoveryData);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || 'Discovery failed');
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError('Discovery failed');
      setLoading(LOADING_STATES.ERROR);
      console.error('Error discovering movies:', err);
    }
  }, []);

  const clearDiscovery = useCallback(() => {
    setDiscoveryResults([]);
    setError(null);
    setLoading(LOADING_STATES.IDLE);
    setCurrentFilters({});
  }, []);

  return { 
    discoveryResults, 
    loading, 
    error, 
    currentFilters,
    discoverMovies, 
    clearDiscovery 
  };
};

// Hook for fetching individual movie details
export const useMovieDetails = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    if (!movieId) return;

    const cacheKey = getCacheKey('movie_details', { movieId });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setMovie(cachedData);
      setLoading(LOADING_STATES.SUCCESS);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError(null);
    
    try {
      const response = await api.getMovie(movieId);
      
      if (response.success) {
        setMovie(response.data);
        setCachedData(cacheKey, response.data);
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