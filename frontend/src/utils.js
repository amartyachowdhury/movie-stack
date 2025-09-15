// Utility functions for the Movie Stack application

// Date formatting utilities
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
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
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Language flag mapping
export const getLanguageFlag = (languageCode) => {
  const flags = {
    'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
    'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
    'hi': '🇮🇳', 'ar': '🇸🇦', 'tr': '🇹🇷', 'pl': '🇵🇱', 'nl': '🇳🇱',
    'sv': '🇸🇪', 'da': '🇩🇰', 'no': '🇳🇴', 'fi': '🇫🇮', 'cs': '🇨🇿',
    'hu': '🇭🇺', 'ro': '🇷🇴', 'bg': '🇧🇬', 'hr': '🇭🇷', 'sk': '🇸🇰',
    'sl': '🇸🇮', 'et': '🇪🇪', 'lv': '🇱🇻', 'lt': '🇱🇹', 'el': '🇬🇷',
    'he': '🇮🇱', 'th': '🇹🇭', 'vi': '🇻🇳', 'id': '🇮🇩', 'ms': '🇲🇾',
    'tl': '🇵🇭', 'uk': '🇺🇦', 'be': '🇧🇾', 'ka': '🇬🇪', 'hy': '🇦🇲',
    'az': '🇦🇿', 'kk': '🇰🇿', 'ky': '🇰🇬', 'uz': '🇺🇿', 'tg': '🇹🇯',
    'mn': '🇲🇳', 'my': '🇲🇲', 'km': '🇰🇭', 'lo': '🇱🇦', 'si': '🇱🇰',
    'ne': '🇳🇵', 'bn': '🇧🇩', 'ur': '🇵🇰', 'fa': '🇮🇷', 'ps': '🇦🇫',
    'ku': '🇮🇶', 'am': '🇪🇹', 'sw': '🇰🇪', 'zu': '🇿🇦', 'af': '🇿🇦',
    'sq': '🇦🇱', 'mk': '🇲🇰', 'sr': '🇷🇸', 'bs': '🇧🇦', 'me': '🇲🇪',
    'mt': '🇲🇹', 'cy': '🇬🇧', 'ga': '🇮🇪', 'is': '🇮🇸', 'fo': '🇫🇴',
    'kl': '🇬🇱', 'sm': '🇼🇸', 'to': '🇹🇴', 'fj': '🇫🇯', 'ty': '🇵🇫',
    'haw': '🇺🇸', 'mi': '🇳🇿', 'ar': '🇸🇦', 'he': '🇮🇱', 'fa': '🇮🇷'
  };
  return flags[languageCode] || '🌍';
};

// Popularity badge classification
export const getPopularityBadge = (popularity) => {
  if (popularity >= 1000) return { text: 'Trending', class: 'trending' };
  if (popularity >= 100) return { text: 'Popular', class: 'popular' };
  if (popularity >= 10) return { text: 'Rising', class: 'rising' };
  return null;
};

// Genre parsing utility
export const parseGenres = (genres) => {
  if (!genres) return [];
  
  if (typeof genres === 'string') {
    // Convert comma-separated string to array of genre names
    const genreMap = {
      '28': 'Action', '12': 'Adventure', '16': 'Animation', '35': 'Comedy',
      '80': 'Crime', '99': 'Documentary', '18': 'Drama', '10751': 'Family',
      '14': 'Fantasy', '36': 'History', '27': 'Horror', '10402': 'Music',
      '9648': 'Mystery', '10749': 'Romance', '878': 'Science Fiction',
      '10770': 'TV Movie', '53': 'Thriller', '10752': 'War', '37': 'Western'
    };
    return genres.split(',').map(id => ({
      id: id.trim(),
      name: genreMap[id.trim()] || `Genre ${id.trim()}`
    }));
  } else if (Array.isArray(genres)) {
    return genres;
  }
  
  return [];
};

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Text truncation utility
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// API response helper
export const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    if (response.success) {
      return { data: response.data, error: null };
    } else {
      return { data: null, error: response.message };
    }
  } catch (error) {
    return { data: null, error: error.message || 'An error occurred' };
  }
};
