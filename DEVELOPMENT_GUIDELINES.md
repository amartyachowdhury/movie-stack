# Development Guidelines

## 🎯 Overview

This document outlines the development guidelines and best practices for the Movie Stack project. Following these guidelines ensures code quality, maintainability, and consistency across the team.

## 📋 Code Standards

### TypeScript/JavaScript

#### Naming Conventions
- **Variables**: camelCase (`userName`, `movieList`)
- **Functions**: camelCase (`getMovieDetails`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Components**: PascalCase (`MovieCard`, `UserProfile`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case (`movie-card`, `user-profile`)

#### Code Style
```typescript
// ✅ Good
const getUserMovies = async (userId: string): Promise<Movie[]> => {
  try {
    const response = await api.get(`/users/${userId}/movies`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user movies:', error);
    throw error;
  }
};

// ❌ Bad
const getusermovies = async (userid) => {
  const response = await api.get('/users/' + userid + '/movies');
  return response.data;
};
```

#### Component Structure
```typescript
// ✅ Good component structure
interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
  className?: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = useCallback(() => {
    onSelect?.(movie);
  }, [movie, onSelect]);
  
  return (
    <div className={`movie-card ${className}`}>
      {/* Component content */}
    </div>
  );
};
```

### Python

#### Naming Conventions
- **Variables**: snake_case (`user_name`, `movie_list`)
- **Functions**: snake_case (`get_movie_details`, `handle_request`)
- **Classes**: PascalCase (`MovieService`, `UserController`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Files**: snake_case (`movie_service.py`, `user_controller.py`)

#### Code Style
```python
# ✅ Good
class MovieService:
    def __init__(self, db_session):
        self.db_session = db_session
    
    def get_movie_details(self, movie_id: int) -> Optional[Movie]:
        """Get movie details by ID."""
        try:
            return self.db_session.query(Movie).filter(
                Movie.id == movie_id
            ).first()
        except Exception as e:
            logger.error(f"Failed to fetch movie {movie_id}: {e}")
            raise

# ❌ Bad
class movieservice:
    def __init__(self, dbsession):
        self.dbsession = dbsession
    
    def getmoviedetails(self, movieid):
        return self.dbsession.query(Movie).filter(Movie.id == movieid).first()
```

## 🏗️ Architecture Patterns

### Frontend Patterns

#### 1. Feature-Based Organization
```
features/
├── movies/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
```

#### 2. Custom Hooks
```typescript
// ✅ Good custom hook
export const useMovies = (filters?: MovieFilters) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await movieService.getMovies(filters);
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  
  return { movies, loading, error, refetch: fetchMovies };
};
```

#### 3. Error Boundaries
```typescript
// ✅ Good error boundary
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### Backend Patterns

#### 1. Service Layer Pattern
```python
# ✅ Good service layer
class MovieService:
    def __init__(self, db_session, tmdb_client):
        self.db_session = db_session
        self.tmdb_client = tmdb_client
    
    def get_movie_details(self, movie_id: int) -> MovieDetails:
        """Get movie details with external data."""
        # Get from database
        movie = self._get_movie_from_db(movie_id)
        if not movie:
            raise MovieNotFoundException(movie_id)
        
        # Enrich with external data
        tmdb_data = self.tmdb_client.get_movie_details(movie.tmdb_id)
        
        return self._merge_movie_data(movie, tmdb_data)
    
    def _get_movie_from_db(self, movie_id: int) -> Optional[Movie]:
        """Private method to get movie from database."""
        return self.db_session.query(Movie).filter(
            Movie.id == movie_id
        ).first()
```

#### 2. Repository Pattern
```python
# ✅ Good repository pattern
class MovieRepository:
    def __init__(self, db_session):
        self.db_session = db_session
    
    def find_by_id(self, movie_id: int) -> Optional[Movie]:
        return self.db_session.query(Movie).filter(
            Movie.id == movie_id
        ).first()
    
    def find_by_tmdb_id(self, tmdb_id: int) -> Optional[Movie]:
        return self.db_session.query(Movie).filter(
            Movie.tmdb_id == tmdb_id
        ).first()
    
    def create(self, movie_data: dict) -> Movie:
        movie = Movie(**movie_data)
        self.db_session.add(movie)
        self.db_session.commit()
        return movie
```

## 🧪 Testing Guidelines

### Frontend Testing

#### Component Testing
```typescript
// ✅ Good component test
describe('MovieCard', () => {
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    // ... other properties
  };
  
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />);
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test overview')).toBeInTheDocument();
  });
  
  it('calls onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<MovieCard movie={mockMovie} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
  });
});
```

#### Hook Testing
```typescript
// ✅ Good hook test
describe('useMovies', () => {
  it('fetches movies successfully', async () => {
    const mockMovies = [mockMovie1, mockMovie2];
    jest.spyOn(movieService, 'getMovies').mockResolvedValue(mockMovies);
    
    const { result } = renderHook(() => useMovies());
    
    await waitFor(() => {
      expect(result.current.movies).toEqual(mockMovies);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
```

### Backend Testing

#### Unit Testing
```python
# ✅ Good unit test
class TestMovieService:
    def test_get_movie_details_success(self):
        # Arrange
        mock_movie = Movie(id=1, title='Test Movie')
        mock_db_session.query.return_value.filter.return_value.first.return_value = mock_movie
        
        # Act
        result = movie_service.get_movie_details(1)
        
        # Assert
        assert result.id == 1
        assert result.title == 'Test Movie'
    
    def test_get_movie_details_not_found(self):
        # Arrange
        mock_db_session.query.return_value.filter.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(MovieNotFoundException):
            movie_service.get_movie_details(999)
```

#### Integration Testing
```python
# ✅ Good integration test
class TestMovieAPI:
    def test_get_movie_details_endpoint(self, client, test_movie):
        response = client.get(f'/api/movies/{test_movie.id}')
        
        assert response.status_code == 200
        assert response.json['data']['title'] == test_movie.title
```

## 🔒 Security Guidelines

### Frontend Security
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper authentication
- Handle sensitive data securely

### Backend Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Set security headers
- Log security events
- Use environment variables for secrets

## 📊 Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement lazy loading
- Optimize images and assets
- Use proper caching strategies
- Monitor bundle size

### Backend Performance
- Use database indexes
- Implement caching
- Optimize queries
- Use connection pooling
- Monitor performance metrics

## 📝 Documentation Standards

### Code Documentation
```typescript
/**
 * Fetches movie details from the API
 * @param movieId - The ID of the movie to fetch
 * @param includeCast - Whether to include cast information
 * @returns Promise resolving to movie details
 * @throws {MovieNotFoundException} When movie is not found
 */
export const getMovieDetails = async (
  movieId: number,
  includeCast: boolean = false
): Promise<MovieDetails> => {
  // Implementation
};
```

### API Documentation
```python
@api.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id: int):
    """
    Get movie details by ID.
    
    Args:
        movie_id (int): The ID of the movie
        
    Returns:
        dict: Movie details including title, overview, cast, etc.
        
    Raises:
        MovieNotFoundException: If movie is not found
        ValidationException: If movie_id is invalid
    """
    # Implementation
```

## 🚀 Deployment Guidelines

### Environment Configuration
- Use environment variables for configuration
- Separate development, staging, and production configs
- Never commit secrets to version control
- Use proper logging levels

### Docker Best Practices
- Use multi-stage builds
- Minimize image size
- Use specific version tags
- Implement health checks
- Use proper networking

## 🔄 Code Review Process

### Before Submitting
1. Run all tests
2. Check code style
3. Update documentation
4. Test manually
5. Review your own code

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Error handling is proper

## 📚 Resources

### Frontend
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/)

### Backend
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Python Best Practices](https://docs.python.org/3/tutorial/)

### General
- [Clean Code](https://www.oreilly.com/library/view/clean-code/9780136083238/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)
