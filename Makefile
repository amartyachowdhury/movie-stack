.PHONY: help build up down logs clean dev prod test db-init

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	docker-compose build

up: ## Start all services in production mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs from all services
	docker-compose logs -f

dev: ## Start development environment with hot reloading
	docker-compose -f docker-compose.dev.yml up --build

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Show development logs
	docker-compose -f docker-compose.dev.yml logs -f

clean: ## Remove all containers, volumes, and images
	docker-compose down -v
	docker system prune -a -f

test: ## Run tests
	docker-compose exec backend python -m pytest

db-init: ## Initialize database tables
	docker-compose exec backend python -c "from app import db; db.create_all()"

db-reset: ## Reset database (WARNING: This will delete all data)
	docker-compose down -v
	docker-compose up -d db
	sleep 5
	docker-compose exec backend python -c "from app import db; db.create_all()"

shell-backend: ## Open shell in backend container
	docker-compose exec backend bash

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend bash

shell-db: ## Open PostgreSQL shell
	docker-compose exec db psql -U postgres -d movie_stack

status: ## Show status of all containers
	docker-compose ps

restart: ## Restart all services
	docker-compose restart

rebuild: ## Rebuild and restart all services
	docker-compose down
	docker-compose up --build -d
