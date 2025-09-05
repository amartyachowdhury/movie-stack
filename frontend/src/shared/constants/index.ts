// Shared constants

// ===== API CONSTANTS =====
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  MOVIES: {
    LIST: '/api/movies',
    DETAIL: '/api/movies/:id',
    SEARCH: '/api/movies/search',
    POPULAR: '/api/movies/popular',
    TOP_RATED: '/api/movies/top-rated',
    NOW_PLAYING: '/api/movies/now-playing',
    UPCOMING: '/api/movies/upcoming',
    RATE: '/api/movies/:id/rate',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
    DELETE: '/api/users/delete',
  },
  RECOMMENDATIONS: {
    GET: '/api/recommendations',
    PERSONALIZED: '/api/recommendations/personalized',
    COLLABORATIVE: '/api/recommendations/collaborative',
    CONTENT_BASED: '/api/recommendations/content-based',
  },
  ANALYTICS: {
    TRACK: '/api/analytics/track',
    PAGEVIEW: '/api/analytics/track/pageview',
    ACTION: '/api/analytics/track/action',
    PERFORMANCE: '/api/analytics/track/performance',
    SEARCH: '/api/analytics/track/search',
    MOVIE_INTERACTION: '/api/analytics/track/movie-interaction',
    SYSTEM_HEALTH: '/api/analytics/track/system-health',
    DASHBOARD: {
      OVERVIEW: '/api/analytics/dashboard/overview',
      REAL_TIME: '/api/analytics/dashboard/real-time',
      USER_BEHAVIOR: '/api/analytics/dashboard/user-behavior',
      PERFORMANCE: '/api/analytics/dashboard/performance',
      BUSINESS: '/api/analytics/dashboard/business',
    },
  },
  WATCHLIST: {
    LIST: '/api/watchlist',
    ADD: '/api/watchlist/add',
    REMOVE: '/api/watchlist/remove',
    CHECK: '/api/watchlist/check/:movieId',
  },
} as const;

// ===== ROUTES =====
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  MOVIES: '/movies',
  MOVIE_DETAIL: '/movies/:id',
  SEARCH: '/search',
  RECOMMENDATIONS: '/recommendations',
  WATCHLIST: '/watchlist',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  ANALYTICS_SESSION: 'analytics_session',
  CACHE_PREFIX: 'movie_stack_cache_',
} as const;

// ===== THEME CONSTANTS =====
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export const DEFAULT_THEME = THEMES.LIGHT;

// ===== MOVIE CONSTANTS =====
export const MOVIE_GENRES = {
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
} as const;

export const MOVIE_SORT_OPTIONS = {
  POPULARITY_DESC: 'popularity.desc',
  POPULARITY_ASC: 'popularity.asc',
  RELEASE_DATE_DESC: 'release_date.desc',
  RELEASE_DATE_ASC: 'release_date.asc',
  VOTE_AVERAGE_DESC: 'vote_average.desc',
  VOTE_AVERAGE_ASC: 'vote_average.asc',
  VOTE_COUNT_DESC: 'vote_count.desc',
  VOTE_COUNT_ASC: 'vote_count.asc',
} as const;

export const MOVIE_LIST_TYPES = {
  POPULAR: 'popular',
  TOP_RATED: 'top_rated',
  NOW_PLAYING: 'now_playing',
  UPCOMING: 'upcoming',
  SEARCH: 'search',
} as const;

// ===== RATING CONSTANTS =====
export const RATING_SCALE = {
  MIN: 1,
  MAX: 10,
  DEFAULT: 5,
} as const;

// ===== PAGINATION CONSTANTS =====
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// ===== SEARCH CONSTANTS =====
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
} as const;

// ===== ANALYTICS CONSTANTS =====
export const ANALYTICS = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 5000, // 5 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// ===== PERFORMANCE CONSTANTS =====
export const PERFORMANCE = {
  IMAGE_LAZY_LOAD_THRESHOLD: 100,
  INFINITE_SCROLL_THRESHOLD: 200,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300,
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MOVIE_RATED: 'Movie rated successfully!',
  WATCHLIST_ADDED: 'Movie added to watchlist!',
  WATCHLIST_REMOVED: 'Movie removed from watchlist!',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  MOVIE_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
} as const;

// ===== BREAKPOINTS =====
export const BREAKPOINTS = {
  XS: '480px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// ===== Z-INDEX VALUES =====
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// ===== ANIMATION DURATIONS =====
export const ANIMATION_DURATION = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
} as const;

// ===== EXPORT ALL CONSTANTS =====
export {
  API_BASE_URL,
  API_ENDPOINTS,
  ROUTES,
  STORAGE_KEYS,
  THEMES,
  DEFAULT_THEME,
  MOVIE_GENRES,
  MOVIE_SORT_OPTIONS,
  MOVIE_LIST_TYPES,
  RATING_SCALE,
  PAGINATION,
  SEARCH,
  ANALYTICS,
  PERFORMANCE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_RULES,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION_DURATION,
};
