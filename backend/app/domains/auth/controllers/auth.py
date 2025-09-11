"""
Authentication API endpoints
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from app import db
from ...domains.users.models.user import User
from app.utils.response import success_response, error_response
import re

bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('username') or not data.get('password'):
            return error_response("Username and password are required", 400)
        
        username = data.get('username').strip()
        email = data.get('email', '').strip()
        password = data.get('password')
        
        # Validate username
        if len(username) < 3:
            return error_response("Username must be at least 3 characters long", 400)
        
        if not username.replace('_', '').isalnum():
            return error_response("Username can only contain letters, numbers, and underscores", 400)
        
        # Validate email if provided
        if email and not validate_email(email):
            return error_response("Invalid email format", 400)
        
        # Validate password
        is_valid, message = validate_password(password)
        if not is_valid:
            return error_response(message, 400)
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return error_response("Username already exists", 409)
        
        # Check if email already exists (if provided)
        if email and User.query.filter_by(email=email).first():
            return error_response("Email already exists", 409)
        
        # Create new user
        user = User(
            username=username,
            email=email if email else None,
            avatar_url=data.get('avatar_url'),
            bio=data.get('bio'),
            favorite_genres=data.get('favorite_genres', []),
            preferences=data.get('preferences', {})
        )
        user.password = password
        
        db.session.add(user)
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return success_response({
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }, "User registered successfully", 201)
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Registration failed: {str(e)}", 500)

@bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return error_response("Username and password are required", 400)
        
        username = data.get('username').strip()
        password = data.get('password')
        
        # Find user by username or email
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not user.verify_password(password):
            return error_response("Invalid username or password", 401)
        
        if not user.is_active:
            return error_response("Account is deactivated", 401)
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return success_response({
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }, "Login successful")
        
    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return error_response("User not found or inactive", 401)
        
        access_token = create_access_token(identity=str(current_user_id))
        
        return success_response({
            'access_token': access_token
        }, "Token refreshed successfully")
        
    except Exception as e:
        return error_response(f"Token refresh failed: {str(e)}", 500)

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return error_response("User not found", 404)
        
        return success_response(user.to_dict(), "Profile retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to get profile: {str(e)}", 500)

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return error_response("User not found", 404)
        
        data = request.get_json()
        
        # Update allowed fields
        if 'email' in data and data['email']:
            email = data['email'].strip()
            if not validate_email(email):
                return error_response("Invalid email format", 400)
            
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=email).first()
            if existing_user and existing_user.id != current_user_id:
                return error_response("Email already exists", 409)
            
            user.email = email
        
        if 'bio' in data:
            user.bio = data['bio']
        
        if 'avatar_url' in data:
            user.avatar_url = data['avatar_url']
        
        if 'favorite_genres' in data:
            user.favorite_genres = data['favorite_genres']
        
        if 'preferences' in data:
            user.preferences = data['preferences']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(user.to_dict(), "Profile updated successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Failed to update profile: {str(e)}", 500)

@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return error_response("User not found", 404)
        
        data = request.get_json()
        
        if not data or not data.get('current_password') or not data.get('new_password'):
            return error_response("Current password and new password are required", 400)
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        # Verify current password
        if not user.verify_password(current_password):
            return error_response("Current password is incorrect", 401)
        
        # Validate new password
        is_valid, message = validate_password(new_password)
        if not is_valid:
            return error_response(message, 400)
        
        # Update password
        user.password = new_password
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return success_response(None, "Password changed successfully")
        
    except Exception as e:
        db.session.rollback()
        return error_response(f"Failed to change password: {str(e)}", 500)

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should discard tokens)"""
    try:
        # In a more advanced implementation, you could blacklist the token
        # For now, we'll just return a success message
        return success_response(None, "Logout successful")
        
    except Exception as e:
        return error_response(f"Logout failed: {str(e)}", 500)
