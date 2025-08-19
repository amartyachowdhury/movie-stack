#!/bin/bash

# Movie Stack Development Script
# Usage: ./scripts/dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    check_docker
    
    docker-compose up -d --build
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5001"
    print_status "Database: localhost:3308"
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    start_dev
}

# Function to view logs
logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Function to run backend tests
test_backend() {
    print_status "Running backend tests..."
    docker-compose exec backend pytest
}

# Function to run frontend tests
test_frontend() {
    print_status "Running frontend tests..."
    docker-compose exec frontend npm test
}

# Function to seed database
seed_db() {
    print_status "Seeding database..."
    docker-compose exec backend python scripts/seed_database.py
}

# Function to access database
db_shell() {
    print_status "Opening database shell..."
    docker-compose exec db mysql -u movie_user -ppassword movie_stack
}

# Function to format code
format_code() {
    print_status "Formatting backend code..."
    docker-compose exec backend black /app
    
    print_status "Formatting frontend code..."
    docker-compose exec frontend npm run format
}

# Function to lint code
lint_code() {
    print_status "Linting backend code..."
    docker-compose exec backend flake8 /app
    
    print_status "Linting frontend code..."
    docker-compose exec frontend npm run lint
}

# Function to show status
status() {
    print_status "Development environment status:"
    docker-compose ps
}

# Function to show help
show_help() {
    echo "Movie Stack Development Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start development environment"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  logs [svc]  View logs (optional: specify service)"
    echo "  test        Run all tests"
    echo "  test-backend Run backend tests only"
    echo "  test-frontend Run frontend tests only"
    echo "  seed        Seed database with sample data"
    echo "  db          Open database shell"
    echo "  format      Format code"
    echo "  lint        Lint code"
    echo "  status      Show environment status"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 test"
}

# Main script logic
case "${1:-help}" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        restart_dev
        ;;
    logs)
        logs "$2"
        ;;
    test)
        test_backend
        test_frontend
        ;;
    test-backend)
        test_backend
        ;;
    test-frontend)
        test_frontend
        ;;
    seed)
        seed_db
        ;;
    db)
        db_shell
        ;;
    format)
        format_code
        ;;
    lint)
        lint_code
        ;;
    status)
        status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
