# Movie Stack - Recommendation Engine

A full-stack movie recommendation system built with Flask, React, and Docker.

## 🚀 Features

- **Smart Recommendations**: Collaborative and content-based filtering
- **Movie Database**: Integration with TMDB API
- **User Ratings**: Rate and review movies
- **Modern UI**: React frontend with responsive design
- **Dockerized**: Easy deployment and development

## 🏗️ Architecture

- **Backend**: Flask API with scikit-learn for ML
- **Frontend**: React with modern UI components
- **Database**: MySQL with SQLAlchemy ORM
- **Cache**: Redis for performance optimization
- **Proxy**: Nginx for routing and load balancing

## 🐳 Quick Start with Docker

### Prerequisites

- Docker and Docker Compose installed
- TMDB API key (get one at [themoviedb.org](https://www.themoviedb.org/documentation/api))
- MySQL port 3308 available (or change in docker-compose.yml)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd movie-stack
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the template
cp .env.example .env

# Edit with your TMDB API key
# ⚠️ IMPORTANT: Never commit your .env file to version control!
TMDB_API_KEY=your_tmdb_api_key_here
SECRET_KEY=your_secret_key_here
```

### 3. Development Mode

```bash
# Start all services with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Or start in background
docker-compose -f docker-compose.dev.yml up -d --build
```

### 4. Production Mode

```bash
# Build and start production services
docker-compose up --build

# Or start in background
docker-compose up -d --build
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000 (dev) or http://localhost (prod)
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📁 Project Structure

```
movie-stack/
├── app/                    # Flask backend
│   ├── __init__.py        # App configuration
│   ├── models.py          # Database models
│   └── routes.py          # API endpoints
├── movie-stack-frontend/   # React frontend
├── docker/                # Docker configurations
│   ├── nginx.conf         # Nginx reverse proxy
│   └── init.sql           # Database initialization
├── Dockerfile.backend     # Backend container
├── Dockerfile.frontend    # Frontend container
├── docker-compose.yml     # Production orchestration
├── docker-compose.dev.yml # Development orchestration
└── requirements.txt       # Python dependencies
```

## 🔧 Development

### Backend Development

```bash
# Access backend container
docker exec -it movie-stack-backend-dev bash

# Run database migrations
python -c "from app import db; db.create_all()"

# Test API endpoints
curl http://localhost:5000/api/movies
```

### Frontend Development

```bash
# Access frontend container
docker exec -it movie-stack-frontend-dev bash

# Install new dependencies
npm install package-name

# Build for production
npm run build
```

## 🗄️ Database Management

### Initialize Database

```bash
# Create tables
docker exec -it movie-stack-backend-dev python -c "from app import db; db.create_all()"
```

### Database Access

```bash
# Connect to PostgreSQL
docker exec -it movie-stack-db-dev psql -U postgres -d movie_stack
```

## 🔍 API Endpoints

### Movies
- `GET /api/movies` - List movies with pagination
- `GET /api/movies/<id>` - Get movie details
- `GET /api/movies/search?query=<search>` - Search movies

### Recommendations
- `GET /api/recommendations/collaborative/<user_id>` - User-based recommendations
- `GET /api/recommendations/content/<movie_id>` - Content-based recommendations

### Ratings
- `POST /api/movies/<id>/rate` - Rate a movie

## 🚀 Deployment

### Production Deployment

1. **Build and push images**:
```bash
docker-compose build
docker-compose push
```

2. **Deploy to production server**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TMDB_API_KEY` | TMDB API key | Required |
| `DATABASE_URL` | Database connection string | `sqlite:///movie_stack.db` |
| `SECRET_KEY` | Flask secret key | `dev-secret-key` |
| `FLASK_ENV` | Flask environment | `development` |

## 🧪 Testing

```bash
# Run backend tests
docker exec -it movie-stack-backend-dev python -m pytest

# Run frontend tests
docker exec -it movie-stack-frontend-dev npm test
```

## 📊 Monitoring

### Health Checks

- Backend: http://localhost:5000/
- Frontend: http://localhost:3000
- Database: Check container logs

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose files
2. **Database connection**: Check PostgreSQL container status
3. **API key issues**: Verify TMDB_API_KEY in .env file
4. **Build failures**: Clear Docker cache with `docker system prune`

### Reset Everything

```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```
