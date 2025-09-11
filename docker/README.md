# Movie Stack Docker Configuration

This directory contains all Docker-related configuration files for the Movie Stack application.

## 📁 Directory Structure

```
docker/
├── docker-compose.yml          # Production environment configuration
├── docker-compose.dev.yml      # Development environment configuration
├── backend/
│   └── Dockerfile             # Backend container configuration
├── frontend/
│   └── Dockerfile             # Frontend container configuration
├── nginx/
│   ├── nginx-frontend.conf    # Nginx configuration for frontend
│   └── nginx.conf             # Nginx configuration for backend
├── scripts/
│   └── docker-dev.sh          # Development management script
├── init.sql                   # Database initialization script
├── analytics_schema.sql       # Analytics database schema
├── env.example                # Environment variables template
└── README.md                  # This documentation
```

## 🚀 Quick Start

### Development Environment

```bash
# Navigate to docker directory
cd docker

# Start development environment
./scripts/docker-dev.sh dev

# View logs
./scripts/docker-dev.sh logs dev

# Stop environment
./scripts/docker-dev.sh stop
```

### Production Environment

```bash
# Navigate to docker directory
cd docker

# Start production environment
./scripts/docker-dev.sh prod

# View logs
./scripts/docker-dev.sh logs

# Stop environment
./scripts/docker-dev.sh stop
```

## 🔧 Manual Commands

### Development

```bash
# Navigate to docker directory
cd docker

# Start development environment
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Navigate to docker directory
cd docker

# Start production environment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down
```

## 🌐 Service URLs

### Development
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **Database**: localhost:3308
- **Redis**: localhost:6379

### Production
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **Database**: localhost:3308
- **Redis**: localhost:6379

## ⚙️ Configuration

### Environment Variables

Copy `env.example` to `.env` and update with your values:

```bash
cp env.example .env
```

Required variables:
- `TMDB_API_KEY` - The Movie Database API key
- `SECRET_KEY` - Flask secret key for sessions
- `API_KEY` - API key for authentication

### Database

The application uses MySQL 8.0 with the following default configuration:
- **Database**: movie_stack
- **User**: movie_user
- **Password**: password
- **Root Password**: rootpassword

### Redis

Redis is used for caching and rate limiting:
- **Port**: 6379
- **Database**: 0

## 🏗️ Architecture

### Services

1. **Frontend** - React application served by Nginx
2. **Backend** - Flask API with Gunicorn
3. **Database** - MySQL 8.0
4. **Redis** - Caching and rate limiting

### Networking

All services communicate through a custom Docker network:
- **Network**: movie-stack-network
- **Driver**: bridge

### Volumes

- `mysql_data` - MySQL data persistence
- `redis_data` - Redis data persistence

## 🔍 Health Checks

All services include health checks:

- **Backend**: `GET /api/health`
- **Frontend**: `GET /health`
- **Database**: MySQL admin ping
- **Redis**: Built-in health check

## 🧹 Cleanup

### Remove all containers and volumes

```bash
./docker-dev.sh clean
```

### Manual cleanup

```bash
# Stop and remove containers
docker-compose down -v --remove-orphans

# Remove unused images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Full system cleanup
docker system prune -a -f
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5001, 3308, and 6379 are available
2. **Permission issues**: Make sure Docker has proper permissions
3. **Environment variables**: Verify `.env` file exists and has correct values
4. **Database connection**: Check if MySQL container is healthy

### Debug Commands

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs [service-name]

# Execute commands in container
docker-compose exec [service-name] [command]

# Check network connectivity
docker network ls
docker network inspect movie-stack-network
```

### Reset Everything

```bash
# Stop all containers
docker-compose down -v --remove-orphans

# Remove all images
docker rmi $(docker images -q) -f

# Remove all volumes
docker volume rm $(docker volume ls -q) -f

# Start fresh
./docker-dev.sh dev
```

## 📝 Notes

- Development environment includes hot reloading for both frontend and backend
- Production environment uses optimized builds and Gunicorn
- All services are configured with proper health checks
- Security headers are configured in Nginx
- Database initialization is handled automatically
