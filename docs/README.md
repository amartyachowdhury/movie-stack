# Movie Stack Documentation

Welcome to the Movie Stack documentation! This guide will help you understand the project structure, setup, and development workflow.

## 📚 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎬 Project Overview

Movie Stack is a full-stack movie recommendation system built with modern technologies:

- **Backend**: Flask with SQLAlchemy ORM
- **Frontend**: React with TypeScript
- **Database**: MySQL
- **Cache**: Redis
- **Containerization**: Docker & Docker Compose
- **ML**: scikit-learn for recommendation algorithms

### Key Features

- 🎯 **Smart Recommendations**: Collaborative and content-based filtering
- 🎬 **Movie Database**: Integration with TMDB API
- ⭐ **User Ratings**: Rate and review movies
- 🎨 **Modern UI**: Responsive React frontend
- 🐳 **Dockerized**: Easy deployment and development

## 🏗️ Architecture

```
movie-stack/
├── backend/                 # Flask backend application
│   ├── app/
│   │   ├── api/            # API blueprints
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration classes
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Frontend utilities
│   └── package.json        # Node.js dependencies
├── docs/                   # Documentation
├── config/                 # Configuration files
├── scripts/                # Development scripts
└── docker/                 # Docker configurations
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.9+ (for backend development)
- TMDB API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-stack
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your TMDB API key
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Database: localhost:3308

### Development Setup

1. **Backend Development**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python run.py
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔧 Development Guide

### Code Style

We use several tools to maintain code quality:

- **Black**: Code formatting
- **Flake8**: Linting
- **MyPy**: Type checking
- **Pre-commit**: Git hooks

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality Checks

```bash
# Format code
black backend/

# Lint code
flake8 backend/

# Type checking
mypy backend/

# Run all checks
pre-commit run --all-files
```

### Database Management

```bash
# Create database tables
docker-compose exec backend python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"

# Seed database
docker-compose exec backend python scripts/seed_database.py

# Access database
docker-compose exec db mysql -u movie_user -ppassword movie_stack
```

## 📖 API Documentation

### Authentication

Currently, the API uses simple user ID-based authentication. In production, implement JWT tokens.

### Endpoints

#### Movies

- `GET /api/movies` - List movies with pagination
- `GET /api/movies/{id}` - Get movie details
- `POST /api/movies/{id}/rate` - Rate a movie
- `GET /api/movies/search` - Search movies via TMDB
- `GET /api/movies/popular` - Get popular movies

#### Users

- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user
- `GET /api/users/{id}/ratings` - Get user ratings
- `GET /api/users/{id}/favorites` - Get user favorites

#### Recommendations

- `GET /api/recommendations/collaborative/{user_id}` - Collaborative filtering
- `GET /api/recommendations/content/{movie_id}` - Content-based filtering
- `GET /api/recommendations/hybrid/{user_id}` - Hybrid recommendations

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    // Response data
  }
}
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   export FLASK_ENV=production
   export DATABASE_URL=mysql://user:pass@host:port/db
   export TMDB_API_KEY=your_api_key
   ```

2. **Build and Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Flask environment | `development` |
| `DATABASE_URL` | Database connection string | `mysql://movie_user:password@db:3306/movie_stack` |
| `TMDB_API_KEY` | TMDB API key | Required |
| `SECRET_KEY` | Flask secret key | Auto-generated |
| `REDIS_URL` | Redis connection string | `redis://redis:6379/0` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and quality checks
5. Submit a pull request

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Run quality checks**
   ```bash
   pre-commit run --all-files
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy coding! 🎬✨**
