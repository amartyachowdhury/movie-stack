// Utility Functions
import { TMDB_IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE, PROFILE_SIZE, GENRE_MAP, LANGUAGE_FLAGS } from './constants';

// Date utilities
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).getFullYear().toString();
  } catch (error) {
    return 'N/A';
  }
};

// Currency formatting
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Runtime formatting
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Vote count formatting
export const formatVoteCount = (count) => {
  if (!count) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Language flag utility
export const getLanguageFlag = (languageCode) => {
  if (!languageCode) return '🌍';
  return LANGUAGE_FLAGS[languageCode.toLowerCase()] || '🌍';
};

// Popularity badge utility
export const getPopularityBadge = (popularity) => {
  if (!popularity) return null;
  
  if (popularity >= 1000) {
    return { text: '🔥 Hot', class: 'hot' };
  } else if (popularity >= 500) {
    return { text: '⭐ Popular', class: 'popular' };
  } else if (popularity >= 100) {
    return { text: '📈 Rising', class: 'rising' };
  }
  return null;
};

// Genre parsing utility
export const parseGenres = (genres) => {
  if (!genres) return [];
  
  // If it's already an array of objects, return as is
  if (Array.isArray(genres) && genres.length > 0 && typeof genres[0] === 'object') {
    return genres;
  }
  
  // If it's a string of comma-separated IDs, parse it
  if (typeof genres === 'string') {
    const genreIds = genres.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    return genreIds.map(id => ({
      id,
      name: GENRE_MAP[id] || `Genre ${id}`
    }));
  }
  
  // If it's an array of IDs, convert to objects
  if (Array.isArray(genres)) {
    return genres.map(id => ({
      id: typeof id === 'number' ? id : parseInt(id),
      name: GENRE_MAP[id] || `Genre ${id}`
    }));
  }
  
  return [];
};

// Image URL utilities
export const getImageUrl = (path, size = POSTER_SIZE) => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path) => {
  return getImageUrl(path, BACKDROP_SIZE);
};

export const getPosterUrl = (path, size = POSTER_SIZE) => {
  return getImageUrl(path, size);
};

export const getProfileUrl = (path) => {
  return getImageUrl(path, PROFILE_SIZE);
};

// Text utilities
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// API response handler
export const handleApiResponse = (response) => {
  if (response.success) {
    return response.data;
  } else {
    throw new Error(response.message || 'API request failed');
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

// Validation utilities
export const isValidMovieId = (id) => {
  return id && !isNaN(id) && parseInt(id) > 0;
};

export const isValidSearchQuery = (query) => {
  return query && typeof query === 'string' && query.trim().length > 0;
};