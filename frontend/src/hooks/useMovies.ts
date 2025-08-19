import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../components/MovieCard';
import { PaginatedResponse } from '../services/api';
import apiService from '../services/api';

interface UseMoviesOptions {
  initialPage?: number;
  perPage?: number;
}

export const useMovies = (options: UseMoviesOptions = {}) => {
  const { initialPage = 1, perPage = 20 } = options;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<Movie>['pagination'] | null>(null);

  const fetchMovies = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getMovies(page, perPage);
      setMovies(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      await fetchMovies(page);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.searchMovies(query, page);
      setMovies(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search movies');
    } finally {
      setLoading(false);
    }
  }, [fetchMovies]);

  const fetchPopularMovies = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPopularMovies(page);
      setMovies(response.items);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular movies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(initialPage);
  }, [fetchMovies, initialPage]);

  return {
    movies,
    loading,
    error,
    pagination,
    fetchMovies,
    searchMovies,
    fetchPopularMovies,
  };
};
