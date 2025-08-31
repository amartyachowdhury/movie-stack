import React, { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard, { Movie } from './MovieCard';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  showRating?: boolean;
  userRatings?: Record<number, number>;
  onRateMovie?: (movieId: number, rating: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  onMovieClick,
  showRating = false,
  userRatings = {},
  onRateMovie,
  onLoadMore,
  hasMore = false
}) => {
  const [columns, setColumns] = useState(4);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else if (width < 1280) setColumns(4);
      else setColumns(5);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Infinite scroll setup
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsIntersecting(entry.isIntersecting);
    
    if (entry.isIntersecting && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin: '100px',
        threshold: 0.1
      });
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  // Split movies into columns for masonry layout
  const getColumnMovies = (columnIndex: number) => {
    return movies.filter((_, index) => index % columns === columnIndex);
  };

  // Stagger animation delay
  const getStaggerDelay = (index: number) => {
    return `${index * 0.1}s`;
  };

  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="movie-card-skeleton">
            <div className="skeleton-poster"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0 && !loading) {
    return (
      <div className="movie-grid-empty">
        <div className="movie-grid-empty-icon">🎬</div>
        <h3 className="movie-grid-empty-title">No movies found</h3>
        <p className="movie-grid-empty-description">
          Try adjusting your search criteria or browse our popular movies
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      <div className="movie-grid" style={{ '--columns': columns } as React.CSSProperties}>
        {Array.from({ length: columns }, (_, columnIndex) => (
          <div key={columnIndex} className="movie-grid-column">
            {getColumnMovies(columnIndex).map((movie, index) => (
              <div
                key={movie.id || movie.tmdb_id || index}
                className="movie-grid-item"
                style={{ animationDelay: getStaggerDelay(index) }}
              >
                <MovieCard
                  movie={movie}
                  onMovieClick={onMovieClick}
                  showRating={showRating}
                  userRating={userRatings[movie.id || movie.tmdb_id || 0]}
                  onRateMovie={onRateMovie}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="movie-grid-loading">
          <div className="movie-grid-loading-spinner"></div>
          <p className="movie-grid-loading-text">Loading more movies...</p>
        </div>
      )}

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="movie-grid-load-more-trigger" />
      )}

      {/* End of results */}
      {!hasMore && movies.length > 0 && (
        <div className="movie-grid-end">
          <div className="movie-grid-end-icon">✨</div>
          <p className="movie-grid-end-text">You've reached the end!</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
