// Async Component Loader for Code Splitting
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '../layout/LoadingSpinner';

// Higher-order component for lazy loading
const withAsyncComponent = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Pre-configured async components
export const AsyncEnhancedMovieInfo = withAsyncComponent(
  () => import('../movie/EnhancedMovieInfo'),
  <div className="loading-placeholder">Loading movie details...</div>
);

export const AsyncTrailerSection = withAsyncComponent(
  () => import('../movie/TrailerSection'),
  <div className="loading-placeholder">Loading trailers...</div>
);

export const AsyncRatingScores = withAsyncComponent(
  () => import('../movie/RatingScores'),
  <div className="loading-placeholder">Loading ratings...</div>
);

export const AsyncWatchProviders = withAsyncComponent(
  () => import('../movie/WatchProviders'),
  <div className="loading-placeholder">Loading watch providers...</div>
);

export const AsyncAdvancedSearch = withAsyncComponent(
  () => import('../search/AdvancedSearch'),
  <div className="loading-placeholder">Loading search filters...</div>
);

export default withAsyncComponent;
