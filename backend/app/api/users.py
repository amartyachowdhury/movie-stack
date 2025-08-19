"""
Users API endpoints
"""
from flask import Blueprint, request, current_app
from app.models import User, Rating, Movie
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
