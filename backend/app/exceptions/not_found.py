"""
Not found exceptions
"""

from .base import BaseException


class NotFoundException(BaseException):
    """Exception raised when a resource is not found"""
    
    def __init__(self, resource: str = "Resource", resource_id: str = None):
        message = f"{resource} not found"
        if resource_id:
            message += f" with ID: {resource_id}"
        
        super().__init__(
            message=message,
            status_code=404,
            error_code='NOT_FOUND'
        )


class MovieNotFoundException(NotFoundException):
    """Exception raised when a movie is not found"""
    
    def __init__(self, movie_id: str = None):
        super().__init__("Movie", movie_id)
        self.error_code = 'MOVIE_NOT_FOUND'


class UserNotFoundException(NotFoundException):
    """Exception raised when a user is not found"""
    
    def __init__(self, user_id: str = None):
        super().__init__("User", user_id)
        self.error_code = 'USER_NOT_FOUND'


class ReviewNotFoundException(NotFoundException):
    """Exception raised when a review is not found"""
    
    def __init__(self, review_id: str = None):
        super().__init__("Review", review_id)
        self.error_code = 'REVIEW_NOT_FOUND'
