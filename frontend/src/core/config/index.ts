// Core configuration management

import { API_BASE_URL, STORAGE_KEYS, THEMES, DEFAULT_THEME } from '../../shared/constants';

// ===== ENVIRONMENT CONFIG =====
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: process.env.REACT_APP_API_URL || API_BASE_URL,
  APP_NAME: process.env.REACT_APP_NAME || 'Movie Stack',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_MONITORING: process.env.REACT_APP_ENABLE_MONITORING === 'true',
  DEBUG_MODE: process.env.REACT_APP_DEBUG === 'true',
} as const;

// ===== API CONFIG =====
export const API_CONFIG = {
  BASE_URL: ENV.API_URL,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// ===== AUTH CONFIG =====
export const AUTH_CONFIG = {
  TOKEN_KEY: STORAGE_KEYS.AUTH_TOKEN,
  REFRESH_TOKEN_KEY: STORAGE_KEYS.REFRESH_TOKEN,
  USER_DATA_KEY: STORAGE_KEYS.USER_DATA,
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
  AUTO_REFRESH_THRESHOLD: 10 * 60 * 1000, // 10 minutes before expiry
} as const;

// ===== THEME CONFIG =====
export const THEME_CONFIG = {
  DEFAULT_THEME: DEFAULT_THEME,
  STORAGE_KEY: STORAGE_KEYS.THEME,
  AVAILABLE_THEMES: Object.values(THEMES),
  SYSTEM_THEME_DETECTION: true,
} as const;

// ===== CACHE CONFIG =====
export const CACHE_CONFIG = {
  PREFIX: STORAGE_KEYS.CACHE_PREFIX,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100, // Maximum number of cached items
  ENABLE_PERSISTENCE: true,
} as const;

// ===== ANALYTICS CONFIG =====
export const ANALYTICS_CONFIG = {
  ENABLED: ENV.ENABLE_ANALYTICS,
  SESSION_KEY: STORAGE_KEYS.ANALYTICS_SESSION,
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 5000, // 5 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// ===== MONITORING CONFIG =====
export const MONITORING_CONFIG = {
  ENABLED: ENV.ENABLE_MONITORING,
  PERFORMANCE_THRESHOLD: 2000, // 2 seconds
  ERROR_REPORTING: true,
  USER_INTERACTION_TRACKING: true,
  NETWORK_MONITORING: true,
} as const;

// ===== PERFORMANCE CONFIG =====
export const PERFORMANCE_CONFIG = {
  IMAGE_LAZY_LOAD_THRESHOLD: 100,
  INFINITE_SCROLL_THRESHOLD: 200,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  VIRTUAL_SCROLLING_THRESHOLD: 1000,
} as const;

// ===== DEVELOPMENT CONFIG =====
export const DEV_CONFIG = {
  ENABLE_LOGGING: ENV.DEBUG_MODE,
  ENABLE_REDUX_DEVTOOLS: ENV.NODE_ENV === 'development',
  ENABLE_HOT_RELOAD: ENV.NODE_ENV === 'development',
  MOCK_API: process.env.REACT_APP_MOCK_API === 'true',
} as const;

// ===== EXPORT ALL CONFIG =====
export {
  ENV,
  API_CONFIG,
  AUTH_CONFIG,
  THEME_CONFIG,
  CACHE_CONFIG,
  ANALYTICS_CONFIG,
  MONITORING_CONFIG,
  PERFORMANCE_CONFIG,
  DEV_CONFIG,
};
