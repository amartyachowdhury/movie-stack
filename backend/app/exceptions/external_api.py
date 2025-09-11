"""
External API exceptions
"""

from .base import BaseException


class ExternalAPIException(BaseException):
    """Exception raised for external API errors"""
    
    def __init__(
        self,
        service: str,
        message: str = "External API error",
        status_code: int = 502
    ):
        super().__init__(
            message=f"{service}: {message}",
            status_code=status_code,
            error_code='EXTERNAL_API_ERROR'
        )


class TMDBAPIException(ExternalAPIException):
    """Exception raised for TMDB API errors"""
    
    def __init__(self, message: str = "TMDB API error"):
        super().__init__("TMDB", message)
        self.error_code = 'TMDB_API_ERROR'


class RateLimitExceededException(ExternalAPIException):
    """Exception raised when external API rate limit is exceeded"""
    
    def __init__(self, service: str = "External API"):
        super().__init__(
            service,
            "Rate limit exceeded",
            429
        )
        self.error_code = 'RATE_LIMIT_EXCEEDED'


class ServiceUnavailableException(ExternalAPIException):
    """Exception raised when external service is unavailable"""
    
    def __init__(self, service: str = "External Service"):
        super().__init__(
            service,
            "Service unavailable",
            503
        )
        self.error_code = 'SERVICE_UNAVAILABLE'
