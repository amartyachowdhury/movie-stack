import { useState, useCallback } from 'react';
import { Movie } from '../components/MovieCard';
import { RecommendationResponse } from '../services/api';
import apiService from '../services/api';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<string>('');

  const getCollaborativeRecommendations = useCallback(async (userId: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: RecommendationResponse = await apiService.getCollaborativeRecommendations(userId);
      setRecommendations(response.recommendations || []);
      setAlgorithm(response.algorithm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collaborative recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getContentBasedRecommendations = useCallback(async (userId: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: RecommendationResponse = await apiService.getContentBasedRecommendations(userId);
      setRecommendations(response.recommendations || []);
      setAlgorithm(response.algorithm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content-based recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getHybridRecommendations = useCallback(async (userId: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: RecommendationResponse = await apiService.getHybridRecommendations(userId);
      setRecommendations(response.recommendations || []);
      setAlgorithm(response.algorithm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hybrid recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recommendations,
    loading,
    error,
    algorithm,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations,
  };
};
