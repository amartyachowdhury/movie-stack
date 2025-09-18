// API service for Movie Stack Frontend
import { handleApiResponse } from '../utils';

class ApiService {
  constructor() {
    this.baseURL = '/api';
    this.pendingRequests = new Map(); // For request deduplication
  }

  async request(endpoint, options = {}) {
    const requestKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check if request is already pending
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey);
    }

    const requestPromise = this._makeRequest(endpoint, options);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  async _makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Movie endpoints
  async getMovies(page = 1) {
    return this.request(`/movies?page=${page}`);
  }

  async getPopularMovies(page = 1) {
    return this.request(`/movies/popular?page=${page}`);
  }

  async getTopRatedMovies(page = 1) {
    return this.request(`/movies/top-rated?page=${page}`);
  }

  async getMovie(id) {
    return this.request(`/movies/${id}`);
  }

  async searchMovies(query, page = 1) {
    return this.request(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
  }

  async discoverMovies(filters = {}, page = 1) {
    const params = new URLSearchParams();
    params.append('page', page);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    return this.request(`/movies/discover?${params.toString()}`);
  }

  // Genre endpoints
  async getGenres() {
    return this.request('/genres');
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }
}

export default new ApiService();
