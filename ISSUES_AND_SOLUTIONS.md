# 🚨 Movie Stack - Current Issues and Solutions

## 📋 Overview

This document outlines the current issues with the reorganized Movie Stack project and provides solutions for each problem.

## 🔧 Issue 1: Docker Build Problems

### **Problem**
Docker builds are failing due to path and configuration issues.

### **Root Causes**
1. **Nginx configuration path**: Fixed ✅
2. **Build context mismatches**: Need to update docker-compose.yml
3. **File structure changes**: Dockerfiles need path updates

### **Solutions**

#### 1.1 Fix Docker Compose Configuration
```yaml
# Update docker-compose.yml
services:
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend
    volumes:
      - ./backend:/app  # Updated path
      
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
```

#### 1.2 Update Dockerfile Paths
```dockerfile
# backend/Dockerfile.backend
COPY . .  # Copy entire backend directory

# frontend/Dockerfile.frontend  
COPY . .  # Copy entire frontend directory
```

## 🐍 Issue 2: Python Environment Problems

### **Problem**
Local Python environment has dependency conflicts and missing modules.

### **Root Causes**
1. **Python 3.12 compatibility**: `distutils` module removed
2. **Missing dependencies**: Flask-CORS and other packages
3. **Build environment conflicts**: numpy compilation issues

### **Solutions**

#### 2.1 Use Docker for Development (Recommended)
```bash
# Instead of local Python, use Docker
docker-compose up -d --build
docker-compose exec backend python run.py
```

#### 2.2 Fix Local Environment (Alternative)
```bash
# Create new virtual environment with Python 3.9
python3.9 -m venv venv_new
source venv_new/bin/activate

# Install dependencies with compatible versions
pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt
```

#### 2.3 Update Requirements for Python 3.12
```txt
# backend/requirements.txt - Updated versions
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Cors==4.0.0
python-dotenv==1.0.0
mysqlclient==2.1.1
redis==4.6.0
requests==2.31.0
numpy==1.26.0  # Updated for Python 3.12
scikit-learn==1.3.0
Werkzeug==2.3.7
```

## 📁 Issue 3: Import Path Problems

### **Problem**
The new modular structure has import conflicts and missing dependencies.

### **Root Causes**
1. **Circular imports**: Blueprint registration issues
2. **Missing __init__.py files**: Package structure problems
3. **Configuration loading**: Environment variable handling

### **Solutions**

#### 3.1 Fix Blueprint Registration
```python
# backend/app/__init__.py
def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration first
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app.config.from_object(f'app.config.{config_name.capitalize()}Config')
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Register blueprints with error handling
    try:
        from .api import movies, recommendations, users
        app.register_blueprint(movies.bp, url_prefix='/api/movies')
        app.register_blueprint(recommendations.bp, url_prefix='/api/recommendations')
        app.register_blueprint(users.bp, url_prefix='/api/users')
    except ImportError as e:
        app.logger.warning(f"Could not import blueprints: {e}")
    
    return app
```

#### 3.2 Add Missing __init__.py Files
```bash
# Ensure all packages have __init__.py files
touch backend/app/api/__init__.py
touch backend/app/models/__init__.py
touch backend/app/services/__init__.py
touch backend/app/utils/__init__.py
touch backend/app/config/__init__.py
```

#### 3.3 Fix Configuration Loading
```python
# backend/app/config/__init__.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql://movie_user:password@localhost:3308/movie_stack'
    TMDB_API_KEY = os.environ.get('TMDB_API_KEY')
```

## 🔄 Issue 4: Database Migration Problems

### **Problem**
Database needs to be recreated with the new model structure.

### **Root Causes**
1. **New model relationships**: User favorites, enhanced ratings
2. **Schema changes**: New fields and constraints
3. **Data migration**: Existing data compatibility

### **Solutions**

#### 4.1 Create Database Migration Script
```python
# backend/scripts/migrate_db.py
from app import create_app, db
from app.models import User, Movie, Rating

def migrate_database():
    app = create_app()
    with app.app_context():
        # Drop all tables
        db.drop_all()
        
        # Create new tables
        db.create_all()
        
        # Seed with sample data
        from scripts.seed_database import seed_database
        seed_database()
        
        print("Database migration completed!")

if __name__ == "__main__":
    migrate_database()
```

#### 4.2 Update Database Initialization
```sql
-- docker/init.sql
USE movie_stack;

-- The tables will be created by SQLAlchemy
-- This file can be empty or contain custom initialization
```

## 🛠️ Issue 5: Development Environment Problems

### **Problem**
Development scripts and tools need updating for the new structure.

### **Root Causes**
1. **Script paths**: Need to reflect new directory structure
2. **Environment variables**: Configuration handling
3. **Development workflow**: Commands and processes

### **Solutions**

#### 5.1 Update Development Scripts
```bash
# scripts/dev.sh - Updated paths
#!/bin/bash

# Update script paths for new structure
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Update commands
docker-compose exec backend python scripts/seed_database.py
docker-compose exec backend python scripts/migrate_db.py
```

#### 5.2 Create Environment Setup Script
```python
# backend/scripts/setup_dev.py
import os
import subprocess

def setup_development_environment():
    """Setup development environment"""
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write("""# Development Environment
FLASK_ENV=development
DATABASE_URL=mysql://movie_user:password@localhost:3308/movie_stack
TMDB_API_KEY=your_tmdb_api_key_here
SECRET_KEY=dev-secret-key-change-in-production
REDIS_URL=redis://localhost:6379/0
""")
        print("Created .env file")
    
    # Start Docker services
    subprocess.run(['docker-compose', 'up', '-d', '--build'])
    
    # Wait for services to be ready
    import time
    time.sleep(10)
    
    # Initialize database
    subprocess.run(['docker-compose', 'exec', 'backend', 'python', 'scripts/migrate_db.py'])
    
    print("Development environment setup complete!")

if __name__ == "__main__":
    setup_development_environment()
```

## 🚀 Quick Fix Commands

### **Immediate Actions**
```bash
# 1. Fix Docker build
docker-compose down
docker-compose up -d --build

# 2. Initialize database
docker-compose exec backend python scripts/migrate_db.py

# 3. Test the application
curl http://localhost:5001/health
curl http://localhost:3000

# 4. Check logs for errors
docker-compose logs backend
docker-compose logs frontend
```

### **Development Workflow**
```bash
# Start development
./scripts/dev.sh start

# View logs
./scripts/dev.sh logs

# Run tests
./scripts/dev.sh test

# Format code
./scripts/dev.sh format
```

## ✅ Success Criteria

The project is considered fixed when:

1. ✅ **Docker builds successfully** without errors
2. ✅ **Backend starts** and responds to health checks
3. ✅ **Frontend loads** without errors
4. ✅ **Database initializes** with sample data
5. ✅ **API endpoints work** correctly
6. ✅ **Development scripts** function properly

## 🔍 Troubleshooting

### **Common Error Messages**

1. **"ModuleNotFoundError"**: Use Docker instead of local Python
2. **"Connection refused"**: Check if services are running
3. **"Database connection failed"**: Verify MySQL is running on port 3308
4. **"Build failed"**: Check Dockerfile paths and contexts

### **Debug Commands**
```bash
# Check service status
docker-compose ps

# View detailed logs
docker-compose logs -f backend

# Access container shell
docker-compose exec backend bash

# Check database connection
docker-compose exec db mysql -u movie_user -ppassword movie_stack -e "SELECT 1;"
```

---

**Next Steps**: Run the quick fix commands above to resolve the current issues.
