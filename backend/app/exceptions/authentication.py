"""
Authentication and authorization exceptions
"""

from .base import BaseException


class AuthenticationException(BaseException):
    """Exception raised for authentication errors"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            status_code=401,
            error_code='AUTHENTICATION_ERROR'
        )


class AuthorizationException(BaseException):
    """Exception raised for authorization errors"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            status_code=403,
            error_code='AUTHORIZATION_ERROR'
        )


class TokenExpiredException(AuthenticationException):
    """Exception raised when token is expired"""
    
    def __init__(self, message: str = "Token has expired"):
        super().__init__(message)
        self.error_code = 'TOKEN_EXPIRED'


class InvalidTokenException(AuthenticationException):
    """Exception raised when token is invalid"""
    
    def __init__(self, message: str = "Invalid token"):
        super().__init__(message)
        self.error_code = 'INVALID_TOKEN'


class InsufficientPermissionsException(AuthorizationException):
    """Exception raised when user lacks required permissions"""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message)
        self.error_code = 'INSUFFICIENT_PERMISSIONS'
