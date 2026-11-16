import { useState, useCallback, useMemo, useRef } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';
import { debounce } from '../utils';
import { getCacheKey, getCachedData, setCachedData } from './apiCache';
import { logError } from '../services/logger';

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
        logError('Error searching movies:', err);
      }
    }
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((query, page = 1) => {
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
    clearSearch,
  };
};
