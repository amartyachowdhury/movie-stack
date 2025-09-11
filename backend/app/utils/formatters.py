"""
Data formatting utilities for the Movie Stack application
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json


class Formatter:
    """Base formatter class"""
    
    @staticmethod
    def format_date(date: datetime, format_str: str = '%Y-%m-%d') -> str:
        """Format datetime object to string"""
        if not date:
            return None
        return date.strftime(format_str)
    
    @staticmethod
    def format_currency(amount: float, currency: str = 'USD') -> str:
        """Format currency amount"""
        if currency == 'USD':
            return f"${amount:,.2f}"
        return f"{amount:,.2f} {currency}"
    
    @staticmethod
    def format_number(num: int) -> str:
        """Format number with commas"""
        return f"{num:,}"
    
    @staticmethod
    def format_percentage(value: float, decimals: int = 1) -> str:
        """Format percentage"""
        return f"{value * 100:.{decimals}f}%"
    
    @staticmethod
    def format_runtime(minutes: int) -> str:
        """Format movie runtime"""
        if not minutes:
            return "Unknown"
        
        hours = minutes // 60
        mins = minutes % 60
        
        if hours == 0:
            return f"{mins}m"
        if mins == 0:
            return f"{hours}h"
        return f"{hours}h {mins}m"
    
    @staticmethod
    def format_rating(rating: float, max_rating: int = 10) -> str:
        """Format rating"""
        return f"{rating:.1f}/{max_rating}"
    
    @staticmethod
    def format_stars(rating: float, max_stars: int = 5) -> str:
        """Format rating as stars"""
        full_stars = int(rating)
        has_half_star = rating % 1 >= 0.5
        empty_stars = max_stars - full_stars - (1 if has_half_star else 0)
        
        return '★' * full_stars + ('☆' if has_half_star else '') + '☆' * empty_stars
    
    @staticmethod
    def format_text(text: str, max_length: Optional[int] = None) -> str:
        """Format text with optional truncation"""
        if not text:
            return ""
        
        if max_length and len(text) > max_length:
            return text[:max_length].strip() + "..."
        
        return text
    
    @staticmethod
    def format_genres(genres: List[str]) -> str:
        """Format genre list"""
        if not genres:
            return "Unknown"
        
        if len(genres) == 1:
            return genres[0]
        
        if len(genres) == 2:
            return f"{genres[0]} & {genres[1]}"
        
        return f"{', '.join(genres[:-1])} & {genres[-1]}"
    
    @staticmethod
    def format_relative_date(date: datetime) -> str:
        """Format relative date"""
        if not date:
            return "Unknown"
        
        now = datetime.utcnow()
        diff = now - date
        
        if diff.days == 0:
            hours = diff.seconds // 3600
            if hours == 0:
                minutes = diff.seconds // 60
                return f"{minutes} minutes ago" if minutes > 1 else "Just now"
            return f"{hours} hours ago" if hours > 1 else "1 hour ago"
        
        if diff.days == 1:
            return "Yesterday"
        
        if diff.days < 7:
            return f"{diff.days} days ago"
        
        if diff.days < 30:
            weeks = diff.days // 7
            return f"{weeks} weeks ago" if weeks > 1 else "1 week ago"
        
        if diff.days < 365:
            months = diff.days // 30
            return f"{months} months ago" if months > 1 else "1 month ago"
        
        years = diff.days // 365
        return f"{years} years ago" if years > 1 else "1 year ago"


class MovieFormatter(Formatter):
    """Movie-specific formatters"""
    
    @staticmethod
    def format_movie_data(movie: Dict[str, Any]) -> Dict[str, Any]:
        """Format movie data for API response"""
        return {
            'id': movie.get('id'),
            'title': movie.get('title'),
            'overview': Formatter.format_text(movie.get('overview'), 200),
            'release_date': movie.get('release_date'),
            'runtime': Formatter.format_runtime(movie.get('runtime')),
            'vote_average': movie.get('vote_average'),
            'vote_count': Formatter.format_number(movie.get('vote_count', 0)),
            'popularity': movie.get('popularity'),
            'poster_path': movie.get('poster_path'),
            'backdrop_path': movie.get('backdrop_path'),
            'genre_ids': movie.get('genre_ids', []),
            'adult': movie.get('adult', False),
            'original_language': movie.get('original_language'),
            'original_title': movie.get('original_title'),
            'video': movie.get('video', False)
        }
    
    @staticmethod
    def format_movie_details(movie: Dict[str, Any]) -> Dict[str, Any]:
        """Format detailed movie data"""
        base_data = MovieFormatter.format_movie_data(movie)
        
        return {
            **base_data,
            'budget': Formatter.format_currency(movie.get('budget', 0)),
            'revenue': Formatter.format_currency(movie.get('revenue', 0)),
            'status': movie.get('status'),
            'tagline': movie.get('tagline'),
            'homepage': movie.get('homepage'),
            'imdb_id': movie.get('imdb_id'),
            'production_companies': movie.get('production_companies', []),
            'production_countries': movie.get('production_countries', []),
            'spoken_languages': movie.get('spoken_languages', []),
            'genres': [genre.get('name') for genre in movie.get('genres', [])],
            'cast': movie.get('cast', []),
            'crew': movie.get('crew', []),
            'similar_movies': movie.get('similar_movies', []),
            'rating_count': movie.get('rating_count', 0),
            'average_rating': movie.get('average_rating', 0)
        }


class UserFormatter(Formatter):
    """User-specific formatters"""
    
    @staticmethod
    def format_user_data(user: Dict[str, Any]) -> Dict[str, Any]:
        """Format user data for API response"""
        return {
            'id': user.get('id'),
            'username': user.get('username'),
            'email': user.get('email'),
            'bio': Formatter.format_text(user.get('bio'), 200),
            'favorite_genres': user.get('favorite_genres', []),
            'preferences': user.get('preferences', {}),
            'is_active': user.get('is_active', True),
            'created_at': Formatter.format_date(user.get('created_at')),
            'updated_at': Formatter.format_date(user.get('updated_at'))
        }
    
    @staticmethod
    def format_user_profile(user: Dict[str, Any]) -> Dict[str, Any]:
        """Format user profile data"""
        base_data = UserFormatter.format_user_data(user)
        
        return {
            **base_data,
            'watchlist_count': user.get('watchlist_count', 0),
            'reviews_count': user.get('reviews_count', 0),
            'ratings_count': user.get('ratings_count', 0),
            'favorite_movies': user.get('favorite_movies', []),
            'recent_activity': user.get('recent_activity', [])
        }


class ResponseFormatter:
    """API response formatters"""
    
    @staticmethod
    def format_success_response(data: Any, message: str = "Success", status_code: int = 200) -> Dict[str, Any]:
        """Format successful API response"""
        return {
            'success': True,
            'data': data,
            'message': message,
            'status_code': status_code,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def format_error_response(error: str, status_code: int = 400, details: Any = None) -> Dict[str, Any]:
        """Format error API response"""
        return {
            'success': False,
            'error': error,
            'status_code': status_code,
            'details': details,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def format_paginated_response(
        items: List[Any], 
        page: int, 
        per_page: int, 
        total: int,
        message: str = "Success"
    ) -> Dict[str, Any]:
        """Format paginated API response"""
        total_pages = (total + per_page - 1) // per_page
        
        return {
            'success': True,
            'data': {
                'items': items,
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'total_pages': total_pages,
                    'has_next': page < total_pages,
                    'has_prev': page > 1
                }
            },
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def format_validation_error(errors: Dict[str, List[str]]) -> Dict[str, Any]:
        """Format validation error response"""
        return ResponseFormatter.format_error_response(
            error="Validation failed",
            status_code=422,
            details=errors
        )
