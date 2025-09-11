# Movie Stack API Documentation

## 📋 Overview

The Movie Stack API provides endpoints for managing movies, users, recommendations, and analytics. This document describes all available endpoints, request/response formats, and authentication requirements.

## 🔗 Base URL

- **Development**: `http://localhost:5001`
- **Production**: `https://api.moviestack.com`

## 🔐 Authentication

### API Key Authentication
Some endpoints require an API key in the request header:

```http
X-API-Key: your-api-key-here
```

### JWT Authentication
User-specific endpoints require JWT authentication:

```http
Authorization: Bearer your-jwt-token-here
```

## 📊 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status_code": 400,
  "details": { ... },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  },
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🎬 Movies API

### Get Popular Movies
```http
GET /api/movies/popular?page=1&per_page=20
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "The Shawshank Redemption",
        "overview": "Two imprisoned men bond over a number of years...",
        "release_date": "1994-09-23",
        "runtime": "142m",
        "vote_average": 8.7,
        "vote_count": "24,000",
        "popularity": 85.5,
        "poster_path": "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        "backdrop_path": "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
        "genre_ids": [18, 80],
        "adult": false,
        "original_language": "en",
        "original_title": "The Shawshank Redemption",
        "video": false
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Movie Details
```http
GET /api/movies/{movie_id}
```

**Path Parameters:**
- `movie_id`: Movie ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "The Shawshank Redemption",
    "overview": "Two imprisoned men bond over a number of years...",
    "release_date": "1994-09-23",
    "runtime": "142m",
    "vote_average": 8.7,
    "vote_count": "24,000",
    "popularity": 85.5,
    "budget": "$25,000,000",
    "revenue": "$28,341,469",
    "status": "Released",
    "tagline": "Fear can hold you prisoner. Hope can set you free.",
    "homepage": "https://www.warnerbros.com/movies/shawshank-redemption",
    "imdb_id": "tt0111161",
    "production_companies": [
      {
        "id": 174,
        "name": "Warner Bros. Pictures",
        "logo_path": "/ky0xOc5OrhzkZ1N6KyUxacfQsCk.jpg",
        "origin_country": "US"
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "spoken_languages": [
      {
        "iso_639_1": "en",
        "name": "English"
      }
    ],
    "genres": ["Drama", "Crime"],
    "cast": [
      {
        "id": 1,
        "name": "Tim Robbins",
        "character": "Andy Dufresne",
        "order": 0,
        "profile_path": "/A4fHNLX73EQsDf1uFrhNlWX7Y8.jpg"
      }
    ],
    "crew": [
      {
        "id": 1,
        "name": "Frank Darabont",
        "job": "Director",
        "department": "Directing",
        "profile_path": "/8Vt6mWEReuy4W61QkFy9B7e4oE.jpg"
      }
    ],
    "similar_movies": [ ... ],
    "rating_count": 150,
    "average_rating": 4.5
  }
}
```

### Search Movies
```http
GET /api/movies/search?query=shawshank&page=1&per_page=20
```

**Query Parameters:**
- `query`: Search query (required)
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": { ... }
  }
}
```

## 👤 Users API

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "bio": "Movie enthusiast"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "Movie enthusiast",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "Movie enthusiast",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer your-jwt-token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "Movie enthusiast",
    "favorite_genres": ["Drama", "Action"],
    "preferences": {
      "language": "en",
      "region": "US"
    },
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "watchlist_count": 25,
    "reviews_count": 10,
    "ratings_count": 50
  }
}
```

## 🎯 Recommendations API

### Get Collaborative Recommendations
```http
GET /api/recommendations/collaborative/{user_id}?limit=20
Authorization: Bearer your-jwt-token
```

**Path Parameters:**
- `user_id`: User ID

**Query Parameters:**
- `limit` (optional): Number of recommendations (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "movie": {
          "id": 1,
          "title": "The Godfather",
          "overview": "The aging patriarch of an organized crime dynasty...",
          "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          "vote_average": 8.7
        },
        "score": 0.95,
        "reason": "Users with similar tastes also liked this movie"
      }
    ],
    "algorithm": "collaborative_filtering",
    "total_recommendations": 20
  }
}
```

### Get Content-Based Recommendations
```http
GET /api/recommendations/content-based/{user_id}?limit=20
Authorization: Bearer your-jwt-token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "movie": { ... },
        "score": 0.88,
        "reason": "Similar to movies you've rated highly"
      }
    ],
    "algorithm": "content_based",
    "total_recommendations": 20
  }
}
```

### Get Hybrid Recommendations
```http
GET /api/recommendations/hybrid/{user_id}?limit=20
Authorization: Bearer your-jwt-token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "movie": { ... },
        "score": 0.92,
        "reason": "Combined collaborative and content-based analysis"
      }
    ],
    "algorithm": "hybrid",
    "total_recommendations": 20
  }
}
```

## 📊 Analytics API

### Track Page View
```http
POST /api/analytics/track/pageview
```

**Request Body:**
```json
{
  "page": "/movies/123",
  "user_id": 1,
  "session_id": "session-123",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Page view tracked successfully"
}
```

### Track Performance Metrics
```http
POST /api/analytics/track/performance
```

**Request Body:**
```json
{
  "page": "/movies/123",
  "load_time": 1.5,
  "dom_content_loaded": 0.8,
  "first_contentful_paint": 0.6,
  "largest_contentful_paint": 1.2,
  "cumulative_layout_shift": 0.1,
  "first_input_delay": 0.05
}
```

### Get Analytics Health
```http
GET /api/analytics/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": "99.9%",
    "response_time": "150ms",
    "active_users": 1250,
    "total_requests": 50000
  }
}
```

## ❌ Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 502 | Bad Gateway - External service error |
| 503 | Service Unavailable - Service temporarily unavailable |

## 🔄 Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 1000 requests per hour
- **Search endpoints**: 10 requests per minute
- **Authentication endpoints**: 5 requests per minute
- **Analytics endpoints**: 100 requests per minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📝 Examples

### JavaScript/TypeScript
```typescript
// Fetch popular movies
const response = await fetch('/api/movies/popular?page=1&per_page=20');
const data = await response.json();

if (data.success) {
  console.log('Movies:', data.data.items);
} else {
  console.error('Error:', data.error);
}

// Authenticated request
const token = localStorage.getItem('authToken');
const response = await fetch('/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Python
```python
import requests

# Fetch popular movies
response = requests.get('http://localhost:5001/api/movies/popular')
data = response.json()

if data['success']:
    print('Movies:', data['data']['items'])
else:
    print('Error:', data['error'])

# Authenticated request
token = 'your-jwt-token'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}
response = requests.get('http://localhost:5001/api/auth/profile', headers=headers)
```

### cURL
```bash
# Fetch popular movies
curl -X GET "http://localhost:5001/api/movies/popular?page=1&per_page=20"

# Authenticated request
curl -X GET "http://localhost:5001/api/auth/profile" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

## 🔧 SDKs and Libraries

### Frontend
- **React**: Use `fetch` or `axios` for API calls
- **Vue**: Use `axios` or `fetch`
- **Angular**: Use `HttpClient`

### Backend
- **Python**: Use `requests` library
- **Node.js**: Use `axios` or `fetch`
- **PHP**: Use `Guzzle` or `cURL`

## 📞 Support

For API support and questions:
- **Email**: api-support@moviestack.com
- **Documentation**: https://docs.moviestack.com
- **Status Page**: https://status.moviestack.com
