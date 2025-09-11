# Movie Stack - Codebase Structure

## 📁 Project Overview

Movie Stack is a modern full-stack application built with React/TypeScript frontend and Flask/Python backend, following industry best practices and clean architecture principles.

## 🏗️ Architecture

### Frontend Architecture
```
frontend/src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── features/           # Feature-based modules
├── shared/             # Shared utilities and components
├── core/               # Core application logic
├── lib/                # Utility libraries
├── config/             # Configuration files
└── styles/             # Global and component styles
```

### Backend Architecture
```
backend/app/
├── domains/            # Domain-driven design modules
├── infrastructure/     # Infrastructure concerns
├── middleware/         # Custom middleware
├── exceptions/         # Custom exception classes
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🎯 Key Principles

### 1. **Feature-Based Organization**
- Each feature is self-contained with its own components, hooks, and services
- Clear separation of concerns
- Easy to maintain and scale

### 2. **Domain-Driven Design (DDD)**
- Backend organized by business domains
- Each domain contains models, controllers, and services
- Clear boundaries between different business areas

### 3. **Clean Architecture**
- Separation of presentation, business logic, and data layers
- Dependency inversion principle
- Testable and maintainable code

### 4. **Industry Standards**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Comprehensive error handling
- Security best practices

## 📂 Directory Structure

### Frontend Structure
```
frontend/src/
├── components/              # Reusable UI components
│   ├── ui/                 # Basic UI components (Button, Input, etc.)
│   ├── navigation/         # Navigation components
│   └── layout/             # Layout components
├── pages/                  # Page-level components
│   ├── HomePage.tsx
│   ├── MovieDetailsPage.tsx
│   └── ...
├── features/               # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── movies/            # Movies feature
│   ├── recommendations/   # Recommendations feature
│   ├── search/            # Search feature
│   ├── watchlist/         # Watchlist feature
│   └── analytics/         # Analytics feature
├── shared/                 # Shared utilities and components
│   ├── components/        # Shared components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Application constants
│   └── contexts/          # React contexts
├── core/                   # Core application logic
│   ├── api/               # API client
│   └── config/            # Core configuration
├── lib/                    # Utility libraries
│   ├── utils/             # General utilities
│   ├── validators/        # Validation functions
│   └── formatters/        # Data formatting functions
├── config/                 # Configuration files
│   ├── env/               # Environment configuration
│   └── constants/         # Configuration constants
└── styles/                 # Global and component styles
    ├── globals/           # Global styles
    ├── components/        # Component-specific styles
    └── themes/            # Theme and design tokens
```

### Backend Structure
```
backend/app/
├── domains/                # Domain-driven design modules
│   ├── auth/              # Authentication domain
│   │   ├── controllers/   # Auth controllers
│   │   ├── models/        # Auth models
│   │   └── services/      # Auth services
│   ├── movies/            # Movies domain
│   │   ├── controllers/   # Movie controllers
│   │   ├── models/        # Movie models
│   │   └── services/      # Movie services
│   ├── users/             # Users domain
│   ├── recommendations/   # Recommendations domain
│   └── analytics/         # Analytics domain
├── infrastructure/         # Infrastructure concerns
│   ├── pagination.py      # Pagination utilities
│   └── response.py        # Response formatting
├── middleware/             # Custom middleware
│   ├── cors.py            # CORS configuration
│   ├── logging.py         # Logging middleware
│   ├── rate_limiting.py   # Rate limiting
│   └── security.py        # Security headers
├── exceptions/             # Custom exception classes
│   ├── base.py            # Base exception
│   ├── validation.py      # Validation exceptions
│   ├── authentication.py  # Auth exceptions
│   ├── not_found.py       # Not found exceptions
│   └── external_api.py    # External API exceptions
├── utils/                  # Utility functions
│   ├── validators.py      # Validation utilities
│   └── formatters.py      # Data formatting utilities
├── config/                 # Configuration files
│   └── __init__.py        # App configuration
├── database.py             # Database configuration
└── __init__.py             # Flask app factory
```

## 🔧 Development Tools

### Frontend Tools
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **React Testing Library**: Component testing
- **Jest**: Unit testing framework

### Backend Tools
- **Flask**: Web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Limiter**: Rate limiting
- **Flask-Talisman**: Security headers

### DevOps Tools
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving
- **MySQL**: Database
- **Redis**: Caching and rate limiting

## 📋 Naming Conventions

### Frontend
- **Components**: PascalCase (e.g., `MovieCard.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

### Backend
- **Files**: snake_case (e.g., `movie_service.py`)
- **Classes**: PascalCase (e.g., `MovieService`)
- **Functions**: snake_case (e.g., `get_movie_details`)
- **Variables**: snake_case
- **Constants**: UPPER_SNAKE_CASE

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.9+
- Docker and Docker Compose
- MySQL 8.0+

### Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd backend && pip install -r requirements.txt
   ```
3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

### Available Scripts

#### Frontend
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run lint`: Lint and fix code
- `npm run type-check`: TypeScript type checking

#### Backend
- `python run.py`: Start development server
- `python -m pytest`: Run tests
- `python -m flake8`: Lint code

## 📚 Best Practices

### Code Quality
- Write tests for all new features
- Follow TypeScript strict mode
- Use meaningful variable and function names
- Keep functions small and focused
- Document complex logic

### Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Set security headers
- Rate limit API endpoints

### Performance
- Use lazy loading for components
- Optimize images and assets
- Implement caching strategies
- Monitor performance metrics
- Use database indexes

## 🔄 Continuous Integration

The project includes:
- Automated testing
- Code quality checks
- Security scanning
- Performance monitoring
- Automated deployments

## 📖 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Security Guide](SECURITY.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

1. Follow the established code structure
2. Write tests for new features
3. Update documentation
4. Follow the coding standards
5. Submit pull requests for review

## 📄 License

This project is licensed under the MIT License.
