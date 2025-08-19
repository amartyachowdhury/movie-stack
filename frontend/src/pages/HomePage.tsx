import React, { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';
import { useRecommendations } from '../hooks/useRecommendations';
import { Movie } from '../components/MovieCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'popular' | 'recommendations'>('popular');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'collaborative' | 'content' | 'hybrid'>('collaborative');
  
  const { movies: popularMovies, loading: popularLoading, fetchPopularMovies } = useMovies();
  const { 
    recommendations, 
    loading: recommendationsLoading, 
    algorithm,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getHybridRecommendations 
  } = useRecommendations();

  useEffect(() => {
    fetchPopularMovies(1);
  }, [fetchPopularMovies]);

  useEffect(() => {
    if (activeTab === 'recommendations') {
      switch (selectedAlgorithm) {
        case 'collaborative':
          getCollaborativeRecommendations(1);
          break;
        case 'content':
          getContentBasedRecommendations(1);
          break;
        case 'hybrid':
          getHybridRecommendations(1);
          break;
      }
    }
  }, [activeTab, selectedAlgorithm, getCollaborativeRecommendations, getContentBasedRecommendations, getHybridRecommendations]);

  const handleMovieClick = (movie: Movie) => {
    // TODO: Navigate to movie details page
    console.log('Movie clicked:', movie);
  };

  const handleRateMovie = (movieId: number, rating: number) => {
    // TODO: Implement rating functionality
    console.log('Rate movie:', movieId, rating);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🎬 Movie Stack</h1>
        <p>Discover amazing movies with AI-powered recommendations</p>
      </div>

      <div className="content-section">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular Movies
          </button>
          <button
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {activeTab === 'recommendations' && (
          <div className="algorithm-selector">
            <label>Recommendation Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
            >
              <option value="collaborative">Collaborative Filtering</option>
              <option value="content">Content-Based</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {algorithm && (
              <span className="algorithm-info">
                Using: {algorithm}
              </span>
            )}
          </div>
        )}

        <div className="movies-section">
          {activeTab === 'popular' ? (
            <MovieGrid
              movies={popularMovies}
              loading={popularLoading}
              onMovieClick={handleMovieClick}
              showRating={true}
              onRateMovie={handleRateMovie}
            />
          ) : (
            <MovieGrid
              movies={recommendations}
              loading={recommendationsLoading}
              onMovieClick={handleMovieClick}
              showRating={true}
              onRateMovie={handleRateMovie}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
