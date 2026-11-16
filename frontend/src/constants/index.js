// Application Constants
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'w1280';
export const PROFILE_SIZE = 'w185';
export const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v=';
export const IMDB_BASE_URL = 'https://www.imdb.com/title/';

// Pagination
export const ITEMS_PER_PAGE = 20;
export const MAX_GENRES_DISPLAY = 3;
export const OVERVIEW_TRUNCATE_LENGTH = 150;

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Movie Configuration
export const MOVIE_CONFIG = {
  MAX_GENRES_DISPLAY: 3,
  MAX_OVERVIEW_LENGTH: 150,
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'w1280',
  PROFILE_SIZE: 'w185',
};

// Genre Mapping (for parsing genre IDs)
export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Language Flags Mapping
export const LANGUAGE_FLAGS = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ko: '🇰🇷',
  zh: '🇨🇳',
  hi: '🇮🇳',
  ar: '🇸🇦',
  tr: '🇹🇷',
  pl: '🇵🇱',
  nl: '🇳🇱',
  sv: '🇸🇪',
  da: '🇩🇰',
  no: '🇳🇴',
  fi: '🇫🇮',
  cs: '🇨🇿',
  hu: '🇭🇺',
  ro: '🇷🇴',
  bg: '🇧🇬',
  hr: '🇭🇷',
  sk: '🇸🇰',
  sl: '🇸🇮',
  et: '🇪🇪',
  lv: '🇱🇻',
  lt: '🇱🇹',
  el: '🇬🇷',
  he: '🇮🇱',
  th: '🇹🇭',
  vi: '🇻🇳',
  id: '🇮🇩',
  ms: '🇲🇾',
  tl: '🇵🇭',
  uk: '🇺🇦',
  be: '🇧🇾',
  ka: '🇬🇪',
  hy: '🇦🇲',
  az: '🇦🇿',
  kk: '🇰🇿',
  ky: '🇰🇬',
  uz: '🇺🇿',
  tg: '🇹🇯',
  mn: '🇲🇳',
  ne: '🇳🇵',
  si: '🇱🇰',
  my: '🇲🇲',
  km: '🇰🇭',
  lo: '🇱🇦',
  'zh-cn': '🇨🇳',
  'zh-tw': '🇹🇼',
};

// API Endpoints
export const API_ENDPOINTS = {
  MOVIES: '/api/movies',
  POPULAR: '/api/movies/popular',
  TOP_RATED: '/api/movies/top-rated',
  SEARCH: '/api/movies/search',
  GENRES: '/api/genres',
  HEALTH: '/api/health',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  MOVIE_NOT_FOUND: 'Movie not found.',
  SEARCH_FAILED: 'Search failed. Please try again.',
  LOADING_FAILED: 'Failed to load data. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MOVIES_LOADED: 'Movies loaded successfully',
  SEARCH_COMPLETE: 'Search completed',
  MOVIE_LOADED: 'Movie details loaded',
};
