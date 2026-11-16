import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { LOADING_STATES } from '../constants';
import { getCacheKey, getCachedData, setCachedData } from './apiCache';

const useCachedEntity = (cacheNamespace, entityId, fetcher, notFoundMessage, errorMessage) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchEntity = useCallback(async () => {
    if (!entityId) return;

    const cacheKey = getCacheKey(cacheNamespace, { id: entityId });
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      setData(cachedData);
      setLoading(LOADING_STATES.SUCCESS);
      return;
    }

    setLoading(LOADING_STATES.LOADING);
    setError(null);

    try {
      const response = await fetcher(entityId);

      if (response.success) {
        setData(response.data);
        setCachedData(cacheKey, response.data);
        setLoading(LOADING_STATES.SUCCESS);
      } else {
        setError(response.message || notFoundMessage);
        setLoading(LOADING_STATES.ERROR);
      }
    } catch (err) {
      setError(errorMessage);
      setLoading(LOADING_STATES.ERROR);
      console.error(`${errorMessage}:`, err);
    }
  }, [cacheNamespace, entityId, fetcher, notFoundMessage, errorMessage]);

  useEffect(() => {
    fetchEntity();
  }, [fetchEntity]);

  return { data, loading, error, refetch: fetchEntity };
};

const fetchMovieById = (id) => api.getMovie(id);
const fetchPersonById = (id) => api.getPerson(id);

export const useMovieDetails = (movieId) => {
  const { data: movie, loading, error, refetch } = useCachedEntity(
    'movie_details',
    movieId,
    fetchMovieById,
    'Movie not found',
    'Failed to load movie details'
  );
  return { movie, loading, error, refetch };
};

export const usePersonDetails = (personId) => {
  const { data: person, loading, error, refetch } = useCachedEntity(
    'person_details',
    personId,
    fetchPersonById,
    'Person not found',
    'Failed to load person details'
  );
  return { person, loading, error, refetch };
};
