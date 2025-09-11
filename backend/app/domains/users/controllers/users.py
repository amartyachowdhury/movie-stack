"""
Users API endpoints
"""
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ...domains.movies.models.rating import Rating
from ...domains.movies.models.movie import Movie
from app.utils.response import success_response, error_response
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('users', __name__)

@bp.route('/', methods=['GET'])
def get_users():
    """Get list of users"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = User.query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        users = [user.to_dict() for user in pagination.items]
        
        return success_response({
            'users': users,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching users: {str(e)}")
        return error_response("Failed to fetch users", 500)

@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get specific user details"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Get user's ratings
        ratings = Rating.query.filter_by(user_id=user_id).limit(10).all()
        ratings_data = [rating.to_dict() for rating in ratings]
        
        # Get user's favorite movies
        favorite_movies = [movie.to_dict() for movie in user.favorite_movies]
        
        user_data = user.to_dict()
        user_data['recent_ratings'] = ratings_data
        user_data['favorite_movies'] = favorite_movies
        
        return success_response(user_data)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching user {user_id}: {str(e)}")
        return error_response("Failed to fetch user", 500)

@bp.route('/', methods=['POST'])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        if not data:
            return error_response("No data provided", 400)
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, password]):
            return error_response("Missing required fields: username, password", 400)
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return error_response("Username already exists", 409)
        
        # Check if email already exists
        if email and User.query.filter_by(email=email).first():
            return error_response("Email already exists", 409)
        
        # Create new user
        new_user = User(
            username=username,
            email=email
        )
        new_user.password = password  # This will hash the password
        
        db.session.add(new_user)
        db.session.commit()
        
        return success_response({
            "message": "User created successfully",
            "user": new_user.to_dict()
        }, 201)
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating user: {str(e)}")
        return error_response("Failed to create user", 500)

@bp.route('/<int:user_id>/ratings', methods=['GET'])
def get_user_ratings(user_id):
    """Get all ratings for a user"""
    try:
        user = User.query.get_or_404(user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = Rating.query.filter_by(user_id=user_id).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        ratings = [rating.to_dict() for rating in pagination.items]
        
        return success_response({
            'ratings': ratings,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching ratings for user {user_id}: {str(e)}")
        return error_response("Failed to fetch user ratings", 500)

@bp.route('/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    """Get user's favorite movies"""
    try:
        user = User.query.get_or_404(user_id)
        favorites = [movie.to_dict() for movie in user.favorite_movies]
        
        return success_response({
            'favorites': favorites
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching favorites for user {user_id}: {str(e)}")
        return error_response("Failed to fetch user favorites", 500)

@bp.route('/<int:user_id>/favorites/<int:movie_id>', methods=['POST'])
def add_favorite(user_id, movie_id):
    """Add a movie to user's favorites"""
    try:
        user = User.query.get_or_404(user_id)
        movie = Movie.query.get_or_404(movie_id)
        
        if movie in user.favorite_movies:
            return error_response("Movie already in favorites", 409)
        
        user.favorite_movies.append(movie)
        db.session.commit()
        
        return success_response({
            "message": "Movie added to favorites"
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding favorite for user {user_id}: {str(e)}")
        return error_response("Failed to add favorite", 500)

@bp.route('/<int:user_id>/favorites/<int:movie_id>', methods=['DELETE'])
def remove_favorite(user_id, movie_id):
    """Remove a movie from user's favorites"""
    try:
        user = User.query.get_or_404(user_id)
        movie = Movie.query.get_or_404(movie_id)
        
        if movie not in user.favorite_movies:
            return error_response("Movie not in favorites", 404)
        
        user.favorite_movies.remove(movie)
        db.session.commit()
        
        return success_response({
            "message": "Movie removed from favorites"
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error removing favorite for user {user_id}: {str(e)}")
        return error_response("Failed to remove favorite", 500)

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        
        # Get user's recent ratings
        ratings = Rating.query.filter_by(user_id=current_user_id).limit(5).all()
        ratings_data = [rating.to_dict() for rating in ratings]
        
        # Get user's favorite movies
        favorite_movies = [movie.to_dict() for movie in user.favorite_movies]
        
        user_data = user.to_dict()
        user_data['recent_ratings'] = ratings_data
        user_data['favorite_movies'] = favorite_movies
        
        return success_response(user_data)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching current user: {str(e)}")
        return error_response("Failed to fetch user data", 500)

@bp.route('/me/favorites', methods=['GET'])
@jwt_required()
def get_my_favorites():
    """Get current user's favorite movies"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        favorites = [movie.to_dict() for movie in user.favorite_movies]
        
        return success_response({
            'favorites': favorites
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching favorites: {str(e)}")
        return error_response("Failed to fetch favorites", 500)

@bp.route('/me/favorites/<int:movie_id>', methods=['POST'])
@jwt_required()
def add_my_favorite(movie_id):
    """Add a movie to current user's favorites"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        movie = Movie.query.get_or_404(movie_id)
        
        if movie in user.favorite_movies:
            return error_response("Movie already in favorites", 409)
        
        user.favorite_movies.append(movie)
        db.session.commit()
        
        return success_response({
            "message": "Movie added to favorites"
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding favorite: {str(e)}")
        return error_response("Failed to add favorite", 500)

@bp.route('/me/favorites/<int:movie_id>', methods=['DELETE'])
@jwt_required()
def remove_my_favorite(movie_id):
    """Remove a movie from current user's favorites"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        movie = Movie.query.get_or_404(movie_id)
        
        if movie not in user.favorite_movies:
            return error_response("Movie not in favorites", 404)
        
        user.favorite_movies.remove(movie)
        db.session.commit()
        
        return success_response({
            "message": "Movie removed from favorites"
        })
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error removing favorite: {str(e)}")
        return error_response("Failed to remove favorite", 500)

@bp.route('/me/watchlist', methods=['GET'])
@jwt_required()
def get_my_watchlist():
    """Get current user's watchlist"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        
        # For now, we'll use favorites as watchlist
        # In a more advanced implementation, you'd have a separate watchlist table
        watchlist = [movie.to_dict() for movie in user.favorite_movies]
        
        return success_response({
            'watchlist': watchlist
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching watchlist: {str(e)}")
        return error_response("Failed to fetch watchlist", 500)

@bp.route('/me/stats', methods=['GET'])
@jwt_required()
def get_my_stats():
    """Get current user's statistics"""
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get_or_404(current_user_id)
        
        # Calculate user statistics
        total_ratings = len(user.ratings)
        total_favorites = len(user.favorite_movies)
        
        # Calculate average rating given by user
        if total_ratings > 0:
            avg_rating = sum(rating.rating for rating in user.ratings) / total_ratings
        else:
            avg_rating = 0
        
        # Get most rated genres
        genre_counts = {}
        for rating in user.ratings:
            if rating.movie and rating.movie.genres:
                genres = rating.movie.genres.split(',')
                for genre in genres:
                    genre = genre.strip()
                    genre_counts[genre] = genre_counts.get(genre, 0) + 1
        
        top_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        stats = {
            'total_ratings': total_ratings,
            'total_favorites': total_favorites,
            'average_rating_given': round(avg_rating, 2),
            'top_genres': [{'genre': genre, 'count': count} for genre, count in top_genres],
            'member_since': user.created_at.isoformat() if user.created_at else None,
            'last_active': user.last_login.isoformat() if user.last_login else None
        }
        
        return success_response(stats)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching user stats: {str(e)}")
        return error_response("Failed to fetch user statistics", 500)
