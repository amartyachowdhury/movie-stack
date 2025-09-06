// Shared TypeScript types and interfaces

// ===== USER TYPES =====
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  is_authenticated: boolean;
}

// ===== MOVIE TYPES =====
export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime?: number;
  budget?: number;
  revenue?: number;
  status: string;
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  cast?: Array<{
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  }>;
  crew?: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
  }>;
  similar_movies?: Movie[];
  rating_count?: number;
  average_rating?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// ===== RATING TYPES =====
export interface Rating {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingRequest {
  movie_id: number;
  rating: number;
}

// ===== SEARCH TYPES =====
export interface SearchParams {
  query: string;
  page?: number;
  year?: number;
  genre?: number;
  sort_by?: string;
}

export interface SearchResults {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

// ===== RECOMMENDATION TYPES =====
export interface RecommendationRequest {
  user_id: number;
  limit?: number;
  algorithm?: string;
}

export interface Recommendation {
  movie: Movie;
  score: number;
  reason: string;
}

// ===== ANALYTICS TYPES =====
export interface AnalyticsEvent {
  event_type: string;
  user_id?: number;
  session_id: string;
  page_url: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PageViewEvent extends AnalyticsEvent {
  event_type: 'pageview';
  page_title: string;
  referrer?: string;
}

export interface ActionEvent extends AnalyticsEvent {
  event_type: 'action';
  action_type: string;
  element_id?: string;
  element_text?: string;
}

export interface PerformanceEvent extends AnalyticsEvent {
  event_type: 'performance';
  metric_type: string;
  metric_value: number;
  metric_unit?: string;
}

export interface SearchEvent extends AnalyticsEvent {
  event_type: 'search';
  search_query: string;
  results_count: number;
  filters?: Record<string, any>;
}

export interface MovieInteractionEvent extends AnalyticsEvent {
  event_type: 'movie_interaction';
  movie_id: number;
  interaction_type: 'view' | 'rate' | 'add_to_watchlist' | 'remove_from_watchlist';
  rating?: number;
}

export interface SystemHealthEvent extends AnalyticsEvent {
  event_type: 'system_health';
  metric_type: string;
  metric_value: number;
  status: 'healthy' | 'warning' | 'error';
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ===== FORM TYPES =====
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name?: string;
  last_name?: string;
}

// ===== THEME TYPES =====
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ===== COMPONENT PROPS TYPES =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

// ===== ERROR TYPES =====
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ===== LOADING STATES =====
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  data?: any;
}

// ===== NAVIGATION TYPES =====
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

// ===== WATCHLIST TYPES =====
export interface WatchlistItem {
  id: number;
  user_id: number;
  movie_id: number;
  movie: Movie;
  added_at: string;
}

export interface WatchlistRequest {
  movie_id: number;
  action: 'add' | 'remove';
}

// ===== EXPORT ALL TYPES =====
// All types are already exported above
