import { useState, useCallback } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';
import { getCacheKey, getCachedData, setCachedData } from './apiCache';

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
    clearDiscovery,
  };
};
