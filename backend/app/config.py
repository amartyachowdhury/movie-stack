import os

class Config:
    """Base configuration class."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'
    JWT_ACCESS_TOKEN_EXPIRES = False
    
    # Database
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'mysql://movie_user:password@localhost:3306/movie_stack'
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    
    # TMDB API
    TMDB_API_KEY = os.environ.get('TMDB_API_KEY') or ''
    TMDB_BASE_URL = 'https://api.themoviedb.org/3'
    
    # Redis
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # Pagination
    MOVIES_PER_PAGE = 20
    MAX_PER_PAGE = 100
    
    # Security
    FORCE_HTTPS = False
    API_KEY = os.environ.get('API_KEY_SECRET') or 'default-api-key'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # Logging
    LOG_LEVEL = 'INFO'

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    FLASK_ENV = 'production'
    FORCE_HTTPS = True

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
