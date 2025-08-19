import { Movie } from '../components/MovieCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface RecommendationResponse {
  recommendations: Movie[];
  algorithm: string;
  user_id: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Movies API
  async getMovies(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Movie>> {
    const response = await this.request<ApiResponse<{ results: Movie[] }>>(
      `/api/movies/?page=${page}&per_page=${perPage}`
    );
    return {
      items: response.data.results,
      pagination: {
        page: page,
        pages: 1,
        per_page: perPage,
        total: response.data.results.length,
        has_next: false,
        has_prev: false
      }
    };
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await this.request<ApiResponse<Movie>>(`/api/movies/${movieId}`);
    return response.data;
  }

  async searchMovies(query: string, page: number = 1, filters?: any): Promise<PaginatedResponse<Movie>> {
    let url = `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`;
    
    if (filters) {
      if (filters.genre) url += `&genre=${encodeURIComponent(filters.genre)}`;
      if (filters.year) url += `&year=${encodeURIComponent(filters.year)}`;
      if (filters.minRating) url += `&min_rating=${encodeURIComponent(filters.minRating)}`;
    }
    
    const response = await this.request<ApiResponse<{ results: Movie[] }>>(url);
    return {
      items: response.data.results,
      pagination: {
        page: page,
        pages: 1,
        per_page: 20,
        total: response.data.results.length,
        has_next: false,
        has_prev: false
      }
    };
  }

  async getPopularMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
    const response = await this.request<ApiResponse<{ results: Movie[] }>>(
      `/api/movies/popular?page=${page}`
    );
    return {
      items: response.data.results,
      pagination: {
        page: page,
        pages: 1,
        per_page: 20,
        total: response.data.results.length,
        has_next: false,
        has_prev: false
      }
    };
  }

  async rateMovie(movieId: number, rating: number, userId: number = 1): Promise<void> {
    await this.request(`/api/movies/${movieId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, user_id: userId }),
    });
  }

  // Recommendations API
  async getCollaborativeRecommendations(userId: number = 1): Promise<RecommendationResponse> {
    const response = await this.request<ApiResponse<RecommendationResponse>>(
      `/api/recommendations/collaborative/${userId}`
    );
    return response.data;
  }

  async getContentBasedRecommendations(userId: number = 1): Promise<RecommendationResponse> {
    const response = await this.request<ApiResponse<RecommendationResponse>>(
      `/api/recommendations/content-based/${userId}`
    );
    return response.data;
  }

  async getHybridRecommendations(userId: number = 1): Promise<RecommendationResponse> {
    const response = await this.request<ApiResponse<RecommendationResponse>>(
      `/api/recommendations/hybrid/${userId}`
    );
    return response.data;
  }

  // Users API
  async getUsers(): Promise<any[]> {
    const response = await this.request<ApiResponse<any[]>>('/api/users/');
    return response.data;
  }

  async getUserDetails(userId: number): Promise<any> {
    const response = await this.request<ApiResponse<any>>(`/api/users/${userId}`);
    return response.data;
  }

  async getUserRatings(userId: number): Promise<any[]> {
    const response = await this.request<ApiResponse<any[]>>(`/api/users/${userId}/ratings`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await this.request<{ status: string; service: string }>('/health');
    return response;
  }
}

export const apiService = new ApiService();
export default apiService;
