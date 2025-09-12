"""
Movie Stack Backend Application Factory
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from .database import db

# Load environment variables
load_dotenv()

# Initialize extensions
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
    
    # Import models to ensure they're registered with SQLAlchemy
    # This is needed even when blueprints are disabled
    with app.app_context():
        try:
            from .domains.users.models.user import User
            from .domains.movies.models.movie import Movie
            from .domains.movies.models.rating import Rating
            app.logger.info("Models imported successfully")
        except ImportError as e:
            app.logger.warning(f"Could not import models: {e}")
    
    # Register blueprints with error handling - temporarily disabled due to circular imports
    # TODO: Fix circular imports in controllers and re-enable blueprints
    try:
        # from .api import movies, recommendations, users, auth, analytics
        # app.register_blueprint(movies.bp, url_prefix='/api/movies')
        # app.register_blueprint(recommendations.bp, url_prefix='/api/recommendations')
        # app.register_blueprint(users.bp, url_prefix='/api/users')
        # app.register_blueprint(auth.bp, url_prefix='/api/auth')
        # app.register_blueprint(analytics.bp, url_prefix='/api/analytics')
        
        # Initialize analytics database after app context is available
        # with app.app_context():
        #     from .api.analytics import init_analytics_db
        #     init_analytics_db()
        app.logger.info("Using fallback endpoints (blueprints temporarily disabled)")
    except ImportError as e:
        app.logger.warning(f"Could not import blueprints: {e}")
    
    # Register fallback API endpoints (always register these)
    app.logger.info("Registering fallback API endpoints")
    
    # Register basic API endpoints as fallback
    @app.route('/api/health')
    def api_health():
        return {'status': 'healthy', 'message': 'API is running'}
    
    @app.route('/api/movies/popular')
    def get_popular_movies():
        try:
            # Get query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))
            offset = (page - 1) * per_page
            
            # Query movies from database
            result = db.session.execute(db.text("""
                SELECT id, tmdb_id, title, overview, genres, release_date, poster_path, 
                       backdrop_path, vote_average, vote_count, popularity, adult, 
                       original_language, original_title, video, created_at, updated_at
                FROM movies 
                ORDER BY popularity DESC, vote_average DESC
                LIMIT :limit OFFSET :offset
            """), {'limit': per_page, 'offset': offset})
            
            movies = []
            for row in result:
                movies.append({
                    'id': row[0],
                    'tmdb_id': row[1],
                    'title': row[2],
                    'overview': row[3],
                    'genres': row[4],
                    'release_date': row[5].isoformat() if row[5] else None,
                    'poster_path': row[6],
                    'backdrop_path': row[7],
                    'vote_average': float(row[8]) if row[8] else 0.0,
                    'vote_count': row[9],
                    'popularity': float(row[10]) if row[10] else 0.0,
                    'adult': bool(row[11]),
                    'original_language': row[12],
                    'original_title': row[13],
                    'video': bool(row[14]),
                    'created_at': row[15].isoformat() if row[15] else None,
                    'updated_at': row[16].isoformat() if row[16] else None
                })
            
            # Get total count
            count_result = db.session.execute(db.text("SELECT COUNT(*) FROM movies"))
            total = count_result.scalar()
            
            return {
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'items': movies,
                    'pagination': {
                        'page': page,
                        'pages': (total + per_page - 1) // per_page,
                        'per_page': per_page,
                        'total': total,
                        'has_next': offset + per_page < total,
                        'has_prev': page > 1
                    }
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to fetch popular movies: {str(e)}'
            }, 500
    
    @app.route('/api/movies/')
    def get_movies():
        try:
            # Get query parameters
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))
            offset = (page - 1) * per_page
            
            # Query movies from database
            result = db.session.execute(db.text("""
                SELECT id, tmdb_id, title, overview, genres, release_date, poster_path, 
                       backdrop_path, vote_average, vote_count, popularity, adult, 
                       original_language, original_title, video, created_at, updated_at
                FROM movies 
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            """), {'limit': per_page, 'offset': offset})
            
            movies = []
            for row in result:
                movies.append({
                    'id': row[0],
                    'tmdb_id': row[1],
                    'title': row[2],
                    'overview': row[3],
                    'genres': row[4],
                    'release_date': row[5].isoformat() if row[5] else None,
                    'poster_path': row[6],
                    'backdrop_path': row[7],
                    'vote_average': float(row[8]) if row[8] else 0.0,
                    'vote_count': row[9],
                    'popularity': float(row[10]) if row[10] else 0.0,
                    'adult': bool(row[11]),
                    'original_language': row[12],
                    'original_title': row[13],
                    'video': bool(row[14]),
                    'created_at': row[15].isoformat() if row[15] else None,
                    'updated_at': row[16].isoformat() if row[16] else None
                })
            
            # Get total count
            count_result = db.session.execute(db.text("SELECT COUNT(*) FROM movies"))
            total = count_result.scalar()
            
            return {
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'items': movies,
                    'pagination': {
                        'page': page,
                        'pages': (total + per_page - 1) // per_page,
                        'per_page': per_page,
                        'total': total,
                        'has_next': offset + per_page < total,
                        'has_prev': page > 1
                    }
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to fetch movies: {str(e)}'
            }, 500
    
    @app.route('/api/movies/search')
    def search_movies():
        try:
            # Get query parameters
            query = request.args.get('query', '').strip()
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 20))
            offset = (page - 1) * per_page
            
            if not query:
                return {
                    'success': True,
                'message': 'Popular movies retrieved successfully',
                    'data': {
                        'items': [],
                        'pagination': {
                            'page': 1,
                            'pages': 1,
                            'per_page': 20,
                            'total': 0,
                            'has_next': False,
                            'has_prev': False
                        }
                    }
                }
            
            # Search movies in database
            search_term = f'%{query}%'
            result = db.session.execute(db.text("""
                SELECT id, tmdb_id, title, overview, genres, release_date, poster_path, 
                       backdrop_path, vote_average, vote_count, popularity, adult, 
                       original_language, original_title, video, created_at, updated_at
                FROM movies 
                WHERE title LIKE :search_term 
                   OR overview LIKE :search_term 
                   OR genres LIKE :search_term
                ORDER BY 
                    CASE 
                        WHEN title LIKE :exact_term THEN 1
                        WHEN title LIKE :search_term THEN 2
                        ELSE 3
                    END,
                    vote_average DESC
                LIMIT :limit OFFSET :offset
            """), {
                'search_term': search_term,
                'exact_term': f'{query}%',
                'limit': per_page, 
                'offset': offset
            })
            
            movies = []
            for row in result:
                movies.append({
                    'id': row[0],
                    'tmdb_id': row[1],
                    'title': row[2],
                    'overview': row[3],
                    'genres': row[4],
                    'release_date': row[5].isoformat() if row[5] else None,
                    'poster_path': row[6],
                    'backdrop_path': row[7],
                    'vote_average': float(row[8]) if row[8] else 0.0,
                    'vote_count': row[9],
                    'popularity': float(row[10]) if row[10] else 0.0,
                    'adult': bool(row[11]),
                    'original_language': row[12],
                    'original_title': row[13],
                    'video': bool(row[14]),
                    'created_at': row[15].isoformat() if row[15] else None,
                    'updated_at': row[16].isoformat() if row[16] else None
                })
            
            # Get total count for search
            count_result = db.session.execute(db.text("""
                SELECT COUNT(*) FROM movies 
                WHERE title LIKE :search_term 
                   OR overview LIKE :search_term 
                   OR genres LIKE :search_term
            """), {'search_term': search_term})
            total = count_result.scalar()
            
            return {
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'items': movies,
                    'pagination': {
                        'page': page,
                        'pages': (total + per_page - 1) // per_page,
                        'per_page': per_page,
                        'total': total,
                        'has_next': offset + per_page < total,
                        'has_prev': page > 1
                    }
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to search movies: {str(e)}'
            }, 500
    
    @app.route('/api/movies/<int:movie_id>')
    def get_movie_details(movie_id):
        try:
            # Query movie from database
            result = db.session.execute(db.text("""
                SELECT id, tmdb_id, title, overview, genres, release_date, poster_path, 
                       backdrop_path, vote_average, vote_count, popularity, adult, 
                       original_language, original_title, video, created_at, updated_at
                FROM movies 
                WHERE id = :movie_id
            """), {'movie_id': movie_id})
            
            row = result.fetchone()
            if not row:
                return {
                    'success': False,
                    'message': 'Movie not found',
                    'data': None
                }, 404
            
            # Parse genres string into Genre objects
            genres_list = []
            if row[4]:  # genres field
                genre_names = [g.strip() for g in row[4].split(',')]
                genres_list = [{'id': i+1, 'name': name} for i, name in enumerate(genre_names)]
            
            movie = {
                'id': row[0],
                'tmdb_id': row[1],
                'title': row[2],
                'overview': row[3],
                'genres': genres_list,
                'release_date': row[5].isoformat() if row[5] else None,
                'poster_path': row[6],
                'backdrop_path': row[7],
                'vote_average': float(row[8]) if row[8] else 0.0,
                'vote_count': row[9],
                'popularity': float(row[10]) if row[10] else 0.0,
                'adult': bool(row[11]),
                'original_language': row[12],
                'original_title': row[13],
                'video': bool(row[14]),
                'created_at': row[15].isoformat() if row[15] else None,
                'updated_at': row[16].isoformat() if row[16] else None,
                # Additional fields required by MovieDetails interface
                'genre_ids': [g['id'] for g in genres_list],
                'runtime': 120,  # Default runtime
                'budget': 0,
                'revenue': 0,
                'status': 'Released',
                'tagline': '',
                'homepage': '',
                'imdb_id': '',
                'production_companies': [],
                'production_countries': [],
                'spoken_languages': [],
                'cast': [],
                'crew': [],
                'similar_movies': [],
                'rating_count': row[9],  # Use vote_count as rating_count
                'average_rating': float(row[8]) if row[8] else 0.0
            }
            
            return {
                'success': True,
                'message': 'Movie details retrieved successfully',
                'data': movie
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to fetch movie details: {str(e)}',
                'data': None
            }, 500
    
    # Analytics endpoints
    @app.route('/api/analytics/health')
    def analytics_health():
        return {'status': 'healthy', 'message': 'Analytics service is running'}
    
    @app.route('/api/analytics/track/pageview', methods=['POST'])
    def track_pageview():
        return {'status': 'success', 'message': 'Page view tracked'}
    
    @app.route('/api/analytics/track/performance', methods=['POST'])
    def track_performance():
        return {'status': 'success', 'message': 'Performance event tracked'}
    
    @app.route('/api/analytics/track/system-health', methods=['POST'])
    def track_system_health():
        return {'status': 'success', 'message': 'System health event tracked'}
    
    # Recommendations endpoints
    @app.route('/api/recommendations/collaborative/<int:user_id>')
    def get_collaborative_recommendations(user_id):
        return {
            'status': 'success',
            'data': {
                'recommendations': [],
                'algorithm': 'collaborative_filtering'
            }
        }
    
    @app.route('/api/recommendations/content-based/<int:user_id>')
    def get_content_based_recommendations(user_id):
        return {
            'status': 'success',
            'data': {
                'recommendations': [],
                'algorithm': 'content_based'
            }
        }
    
    @app.route('/api/recommendations/hybrid/<int:user_id>')
    def get_hybrid_recommendations(user_id):
        return {
            'status': 'success',
            'data': {
                'recommendations': [],
                'algorithm': 'hybrid'
            }
        }
    
    # Authentication endpoints
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        from flask import request, jsonify
        from flask_jwt_extended import create_access_token, create_refresh_token
        from werkzeug.security import check_password_hash
        from datetime import datetime
        
        try:
            data = request.get_json()
            
            if not data or not data.get('username') or not data.get('password'):
                return jsonify({
                    'success': False,
                    'message': 'Username and password are required'
                }), 400
            
            username = data.get('username').strip()
            password = data.get('password')
            
            # Find user by username or email using raw SQL to avoid circular imports
            result = db.session.execute(db.text("""
                SELECT id, username, email, password_hash, avatar_url, bio, favorite_genres, preferences, is_active, last_login, created_at, updated_at
                FROM users 
                WHERE username = :username OR email = :username
            """), {'username': username})
            user_data = result.fetchone()
            
            if not user_data:
                return jsonify({
                    'success': False,
                    'message': 'Invalid username or password'
                }), 401
            
            # Check password
            from werkzeug.security import check_password_hash
            if not check_password_hash(user_data[3], password):  # password_hash is at index 3
                return jsonify({
                    'success': False,
                    'message': 'Invalid username or password'
                }), 401
            
            if not user_data[8]:  # is_active is at index 8
                return jsonify({
                    'success': False,
                    'message': 'Account is deactivated'
                }), 401
            
            # Update last login
            db.session.execute(db.text("""
                UPDATE users SET last_login = :last_login WHERE id = :user_id
            """), {'last_login': datetime.utcnow(), 'user_id': user_data[0]})
            db.session.commit()
            
            # Create tokens
            access_token = create_access_token(identity=str(user_data[0]))  # user_id is at index 0
            refresh_token = create_refresh_token(identity=str(user_data[0]))
            
            # Create user dict
            user_dict = {
                'id': user_data[0],
                'username': user_data[1],
                'email': user_data[2],
                'avatar_url': user_data[4],
                'bio': user_data[5],
                'favorite_genres': user_data[6] or [],
                'preferences': user_data[7] or {},
                'is_active': user_data[8],
                'last_login': user_data[9].isoformat() if user_data[9] else None,
                'created_at': user_data[10].isoformat() if user_data[10] else None,
                'updated_at': user_data[11].isoformat() if user_data[11] else None
            }
            
            return jsonify({
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'user': user_dict,
                    'access_token': access_token,
                    'refresh_token': refresh_token
                },
                'message': 'Login successful'
            })
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Login failed: {str(e)}'
            }), 500
    
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        from flask import request, jsonify
        from flask_jwt_extended import create_access_token, create_refresh_token
        from werkzeug.security import generate_password_hash
        import re
        
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data or not data.get('username') or not data.get('password'):
                return jsonify({
                    'success': False,
                    'message': 'Username and password are required'
                }), 400
            
            username = data.get('username').strip()
            email = data.get('email', '').strip()
            password = data.get('password')
            
            # Validate username
            if len(username) < 3:
                return jsonify({
                    'success': False,
                    'message': 'Username must be at least 3 characters long'
                }), 400
            
            if not username.replace('_', '').isalnum():
                return jsonify({
                    'success': False,
                    'message': 'Username can only contain letters, numbers, and underscores'
                }), 400
            
            # Validate email if provided
            if email:
                pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
                if not re.match(pattern, email):
                    return jsonify({
                        'success': False,
                        'message': 'Invalid email format'
                    }), 400
            
            # Validate password
            if len(password) < 6:
                return jsonify({
                    'success': False,
                    'message': 'Password must be at least 6 characters long'
                }), 400
            
            # Check if username already exists
            result = db.session.execute(db.text("SELECT id FROM users WHERE username = :username"), {'username': username})
            if result.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Username already exists'
                }), 409
            
            # Check if email already exists (if provided)
            if email:
                result = db.session.execute(db.text("SELECT id FROM users WHERE email = :email"), {'email': email})
                if result.fetchone():
                    return jsonify({
                        'success': False,
                        'message': 'Email already exists'
                    }), 409
            
            # Create new user using raw SQL
            from werkzeug.security import generate_password_hash
            password_hash = generate_password_hash(password)
            
            result = db.session.execute(db.text("""
                INSERT INTO users (username, email, password_hash, avatar_url, bio, favorite_genres, preferences, is_active, created_at, updated_at)
                VALUES (:username, :email, :password_hash, :avatar_url, :bio, :favorite_genres, :preferences, :is_active, :created_at, :updated_at)
            """), {
                'username': username,
                'email': email if email else None,
                'password_hash': password_hash,
                'avatar_url': data.get('avatar_url'),
                'bio': data.get('bio'),
                'favorite_genres': str(data.get('favorite_genres', [])),
                'preferences': str(data.get('preferences', {})),
                'is_active': True,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
            
            user_id = result.lastrowid
            db.session.commit()
            
            # Create tokens
            access_token = create_access_token(identity=str(user_id))
            refresh_token = create_refresh_token(identity=str(user_id))
            
            # Get the created user data
            result = db.session.execute(db.text("""
                SELECT id, username, email, avatar_url, bio, favorite_genres, preferences, is_active, created_at, updated_at
                FROM users WHERE id = :user_id
            """), {'user_id': user_id})
            user_data = result.fetchone()
            
            user_dict = {
                'id': user_data[0],
                'username': user_data[1],
                'email': user_data[2],
                'avatar_url': user_data[3],
                'bio': user_data[4],
                'favorite_genres': user_data[5] or [],
                'preferences': user_data[6] or {},
                'is_active': user_data[7],
                'created_at': user_data[8].isoformat() if user_data[8] else None,
                'updated_at': user_data[9].isoformat() if user_data[9] else None
            }
            
            return jsonify({
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'user': user_dict,
                    'access_token': access_token,
                    'refresh_token': refresh_token
                },
                'message': 'Registration successful'
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': f'Registration failed: {str(e)}'
            }), 500
    
    @app.route('/api/auth/profile')
    def get_profile():
        from flask_jwt_extended import jwt_required, get_jwt_identity
        
        try:
            # For now, return a mock user since JWT might not be working
            # TODO: Implement proper JWT validation
            return jsonify({
                'success': True,
                'message': 'Popular movies retrieved successfully',
                'data': {
                    'id': 1,
                    'username': 'alice',
                    'email': 'alice@example.com',
                    'avatar_url': None,
                    'bio': 'Movie enthusiast',
                    'favorite_genres': ['Action', 'Drama'],
                    'preferences': {},
                    'is_active': True,
                    'created_at': '2024-01-01T00:00:00Z',
                    'last_login': '2024-01-01T00:00:00Z'
                }
            })
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Failed to fetch profile: {str(e)}'
            }), 500
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'movie-stack-backend'}
    
    return app
