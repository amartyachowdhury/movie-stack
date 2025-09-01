"""
Movie Stack Backend Application Factory
"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app.config.from_object(f'app.config.{config_name.capitalize()}Config')
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Register blueprints with error handling
    try:
        from .api import movies, recommendations, users, auth, analytics
        app.register_blueprint(movies.bp, url_prefix='/api/movies')
        app.register_blueprint(recommendations.bp, url_prefix='/api/recommendations')
        app.register_blueprint(users.bp, url_prefix='/api/users')
        app.register_blueprint(auth.bp, url_prefix='/api/auth')
        app.register_blueprint(analytics.bp, url_prefix='/api/analytics')
    except ImportError as e:
        app.logger.warning(f"Could not import blueprints: {e}")
        # Register a simple health check if blueprints fail
        @app.route('/api/health')
        def api_health():
            return {'status': 'healthy', 'message': 'API is running'}
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'movie-stack-backend'}
    
    return app
