import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';
import { getCacheKey, getCachedData, setCachedData } from './apiCache';

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
