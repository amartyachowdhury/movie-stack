#!/bin/bash

# Movie Stack Docker Development Script

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

# Function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please update the .env file with your actual API keys and configuration."
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting Movie Stack development environment..."
    check_docker
    setup_env
    
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5001"
    print_status "Database: localhost:3308"
    print_status "Redis: localhost:6379"
}

# Function to start production environment
start_prod() {
    print_status "Starting Movie Stack production environment..."
    check_docker
    setup_env
    
    docker-compose up --build -d
    
    print_success "Production environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5001"
    print_status "Database: localhost:3308"
    print_status "Redis: localhost:6379"
}

# Function to stop environment
stop() {
    print_status "Stopping Movie Stack environment..."
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose down 2>/dev/null || true
    print_success "Environment stopped!"
}

# Function to clean up
clean() {
    print_status "Cleaning up Docker resources..."
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
    docker-compose down -v --remove-orphans 2>/dev/null || true
    docker system prune -f
    print_success "Cleanup completed!"
}

# Function to show logs
logs() {
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Function to show status
status() {
    print_status "Docker containers status:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || docker-compose ps
}

# Function to show help
show_help() {
    echo "Movie Stack Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment"
    echo "  prod      Start production environment"
    echo "  stop      Stop all environments"
    echo "  clean     Stop and clean up all resources"
    echo "  logs      Show logs (add 'dev' for development logs)"
    echo "  status    Show container status"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Start development environment"
    echo "  $0 logs dev     # Show development logs"
    echo "  $0 clean        # Clean up everything"
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop
        ;;
    "clean")
        clean
        ;;
    "logs")
        logs "$2"
        ;;
    "status")
        status
        ;;
    "help"|*)
        show_help
        ;;
esac
