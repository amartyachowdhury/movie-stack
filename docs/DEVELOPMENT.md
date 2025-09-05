# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Docker** and Docker Compose
- **Git**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-stack
   ```

2. **Copy environment file**
   ```bash
   cp env.example .env
   ```

3. **Start development environment**
   ```bash
   docker-compose -f infrastructure/docker/docker-compose.dev.yml up -d
   ```

4. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend (if running locally)
   cd backend
   pip install -r requirements.txt
   ```

## Project Structure

### Frontend Structure

```
frontend/src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── movies/           # Movie management
│   ├── analytics/        # Analytics and monitoring
│   ├── search/           # Search functionality
│   ├── recommendations/  # Recommendation engine
│   ├── user/             # User management
│   └── watchlist/        # Watchlist management
├── shared/               # Shared components and utilities
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Application constants
│   └── utils/           # Utility functions
├── core/                # Core application logic
│   ├── api/             # API layer
│   ├── config/          # Configuration management
│   ├── router/          # Routing logic
│   └── store/           # State management
└── assets/              # Static assets
```

### Backend Structure

```
backend/app/
├── domains/              # Business domains
│   ├── auth/            # Authentication domain
│   ├── movies/          # Movies domain
│   ├── analytics/       # Analytics domain
│   ├── users/           # Users domain
│   └── recommendations/ # Recommendations domain
├── infrastructure/      # Infrastructure layer
│   ├── database/        # Database utilities
│   ├── external/        # External service integrations
│   └── utils/           # Infrastructure utilities
├── middleware/          # Application middleware
└── exceptions/          # Custom exceptions
```

## Development Workflow

### Feature Development

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop feature**
   - Create components in appropriate feature directory
   - Add types to `shared/types`
   - Update constants in `shared/constants`
   - Add tests in `__tests__` directory

3. **Test your changes**
   ```bash
   # Frontend tests
   cd frontend
   npm test
   
   # Backend tests
   cd backend
   python -m pytest
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Code Standards

#### Frontend Standards

- **TypeScript**: Use TypeScript for all new code
- **Components**: Use functional components with hooks
- **Styling**: Use CSS-in-JS with design tokens
- **Testing**: Write unit tests for all components and hooks
- **Naming**: Use PascalCase for components, camelCase for functions

#### Backend Standards

- **Python**: Follow PEP 8 style guide
- **Architecture**: Follow domain-driven design principles
- **Testing**: Write unit and integration tests
- **Documentation**: Document all public APIs
- **Error Handling**: Use custom exceptions for business logic errors

### Component Development

#### Creating a New Component

1. **Create component file**
   ```typescript
   // features/movies/components/MovieCard.tsx
   import React from 'react';
   import { Movie } from '../../../shared/types';
   
   interface MovieCardProps {
     movie: Movie;
     onSelect?: (movie: Movie) => void;
   }
   
   export const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect }) => {
     return (
       <div className="movie-card">
         {/* Component implementation */}
       </div>
     );
   };
   ```

2. **Create component styles**
   ```css
   /* features/movies/components/MovieCard.css */
   .movie-card {
     /* Component styles using design tokens */
   }
   ```

3. **Add to feature exports**
   ```typescript
   // features/movies/index.ts
   export { MovieCard } from './components/MovieCard';
   ```

#### Creating a Custom Hook

1. **Create hook file**
   ```typescript
   // features/movies/hooks/useMovies.ts
   import { useState, useEffect } from 'react';
   import { Movie } from '../../../shared/types';
   import { moviesApi } from '../../../core/api';
   
   export const useMovies = () => {
     const [movies, setMovies] = useState<Movie[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
   
     const fetchMovies = async () => {
       setLoading(true);
       try {
         const data = await moviesApi.getMovies();
         setMovies(data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
   
     useEffect(() => {
       fetchMovies();
     }, []);
   
     return { movies, loading, error, refetch: fetchMovies };
   };
   ```

### API Development

#### Creating a New API Endpoint

1. **Create controller**
   ```python
   # domains/movies/controllers/movies.py
   from flask import Blueprint, request, jsonify
   from ..services.movie_service import MovieService
   from ..schemas.movie_schema import MovieSchema
   
   movies_bp = Blueprint('movies', __name__)
   movie_service = MovieService()
   movie_schema = MovieSchema()
   
   @movies_bp.route('/movies', methods=['GET'])
   def get_movies():
       try:
           movies = movie_service.get_movies()
           return jsonify({
               'status': 'success',
               'data': movie_schema.dump(movies, many=True)
           })
       except Exception as e:
           return jsonify({
               'status': 'error',
               'message': str(e)
           }), 500
   ```

2. **Create service**
   ```python
   # domains/movies/services/movie_service.py
   from ..repositories.movie_repository import MovieRepository
   
   class MovieService:
       def __init__(self):
           self.movie_repository = MovieRepository()
       
       def get_movies(self):
           return self.movie_repository.find_all()
   ```

3. **Create repository**
   ```python
   # domains/movies/repositories/movie_repository.py
   from ...infrastructure.database import db
   from ..models.movie import Movie
   
   class MovieRepository:
       def find_all(self):
           return Movie.query.all()
   ```

### Testing

#### Frontend Testing

```typescript
// __tests__/components/MovieCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MovieCard } from '../../features/movies/components/MovieCard';
import { Movie } from '../../shared/types';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  // ... other properties
};

describe('MovieCard', () => {
  it('renders movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
});
```

#### Backend Testing

```python
# tests/unit/movies/test_movie_service.py
import pytest
from app.domains.movies.services.movie_service import MovieService

class TestMovieService:
    def test_get_movies(self):
        service = MovieService()
        movies = service.get_movies()
        assert isinstance(movies, list)
```

### Database Migrations

#### Creating a Migration

```bash
cd backend
flask db migrate -m "Add new column to movies table"
flask db upgrade
```

#### Running Migrations

```bash
# Apply all pending migrations
flask db upgrade

# Rollback last migration
flask db downgrade
```

### Environment Configuration

#### Frontend Environment Variables

```bash
# .env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_DEBUG=true
```

#### Backend Environment Variables

```bash
# .env
FLASK_ENV=development
DATABASE_URL=mysql://user:password@localhost/movie_stack
SECRET_KEY=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
```

### Debugging

#### Frontend Debugging

- Use React Developer Tools browser extension
- Enable debug mode in environment variables
- Use console.log for temporary debugging
- Use React's built-in error boundaries

#### Backend Debugging

- Use Flask's debug mode
- Use Python debugger (pdb)
- Check application logs
- Use database query logging

### Performance Optimization

#### Frontend Optimization

- Use React.memo for expensive components
- Implement lazy loading for routes and components
- Optimize images with proper sizing and formats
- Use virtual scrolling for large lists

#### Backend Optimization

- Add database indexes for frequently queried columns
- Use connection pooling for database connections
- Implement caching for expensive operations
- Optimize SQL queries

### Security Best Practices

#### Frontend Security

- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper authentication flows

#### Backend Security

- Validate all incoming data
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use environment variables for sensitive data

### Deployment

#### Local Development

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.dev.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.dev.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.dev.yml down
```

#### Production Deployment

```bash
# Build production images
docker-compose -f infrastructure/docker/docker-compose.yml build

# Deploy to production
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose files
2. **Database connection issues**: Check database credentials and network
3. **Build failures**: Clear Docker cache and rebuild
4. **Permission issues**: Check file permissions and Docker user

### Getting Help

- Check the documentation in the `docs/` directory
- Review existing issues in the repository
- Create a new issue with detailed information
- Ask questions in the development team chat
