"""
Validation utilities for the Movie Stack application
"""

import re
from typing import Dict, List, Any, Optional
from datetime import datetime
from email_validator import validate_email, EmailNotValidError


class ValidationError(Exception):
    """Custom validation error"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(self.message)


class Validator:
    """Base validator class"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email address"""
        try:
            validate_email(email)
            return True
        except EmailNotValidError:
            return False
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
        """Validate password strength"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_username(username: str) -> Dict[str, Any]:
        """Validate username"""
        errors = []
        
        if len(username) < 3:
            errors.append("Username must be at least 3 characters long")
        
        if len(username) > 20:
            errors.append("Username must be no more than 20 characters long")
        
        if not re.match(r'^[a-zA-Z0-9_-]+$', username):
            errors.append("Username can only contain letters, numbers, underscores, and hyphens")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_movie_data(movie_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate movie data"""
        errors = []
        
        if not movie_data.get('title'):
            errors.append("Movie title is required")
        
        if not movie_data.get('release_date'):
            errors.append("Release date is required")
        else:
            try:
                datetime.strptime(movie_data['release_date'], '%Y-%m-%d')
            except ValueError:
                errors.append("Invalid release date format (expected YYYY-MM-DD)")
        
        vote_average = movie_data.get('vote_average')
        if vote_average is not None:
            if not isinstance(vote_average, (int, float)) or vote_average < 0 or vote_average > 10:
                errors.append("Vote average must be between 0 and 10")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_rating(rating: int) -> bool:
        """Validate rating value"""
        return isinstance(rating, int) and 1 <= rating <= 5
    
    @staticmethod
    def validate_search_query(query: str) -> bool:
        """Validate search query"""
        return isinstance(query, str) and 2 <= len(query.strip()) <= 100
    
    @staticmethod
    def validate_pagination_params(page: int, per_page: int) -> Dict[str, Any]:
        """Validate pagination parameters"""
        errors = []
        
        if not isinstance(page, int) or page < 1:
            errors.append("Page must be a positive integer")
        
        if not isinstance(per_page, int) or per_page < 1 or per_page > 100:
            errors.append("Per page must be between 1 and 100")
        
        return {
            'is_valid': len(errors) == 0,
            'errors': errors
        }


class MovieValidator(Validator):
    """Movie-specific validators"""
    
    @staticmethod
    def validate_tmdb_id(tmdb_id: int) -> bool:
        """Validate TMDB ID"""
        return isinstance(tmdb_id, int) and tmdb_id > 0
    
    @staticmethod
    def validate_genre_ids(genre_ids: List[int]) -> bool:
        """Validate genre IDs"""
        return isinstance(genre_ids, list) and all(isinstance(id, int) and id > 0 for id in genre_ids)
    
    @staticmethod
    def validate_runtime(runtime: int) -> bool:
        """Validate movie runtime"""
        return isinstance(runtime, int) and runtime > 0


class UserValidator(Validator):
    """User-specific validators"""
    
    @staticmethod
    def validate_bio(bio: str) -> bool:
        """Validate user bio"""
        return isinstance(bio, str) and len(bio) <= 500
    
    @staticmethod
    def validate_favorite_genres(genres: List[str]) -> bool:
        """Validate favorite genres"""
        valid_genres = [
            'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
            'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
            'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
        ]
        return isinstance(genres, list) and all(genre in valid_genres for genre in genres)


def validate_request_data(data: Dict[str, Any], validators: Dict[str, callable]) -> Dict[str, Any]:
    """Validate request data against provided validators"""
    errors = {}
    is_valid = True
    
    for field, validator in validators.items():
        if field in data:
            result = validator(data[field])
            if isinstance(result, dict) and 'is_valid' in result:
                if not result['is_valid']:
                    errors[field] = result['errors']
                    is_valid = False
            elif not result:
                errors[field] = [f"Invalid {field}"]
                is_valid = False
    
    return {
        'is_valid': is_valid,
        'errors': errors
    }
