"""
Base exception classes
"""

from typing import Any, Dict, Optional


class BaseException(Exception):
    """Base exception class for the application"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
        error_code: Optional[str] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        self.error_code = error_code
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary"""
        return {
            'error': self.message,
            'status_code': self.status_code,
            'details': self.details,
            'error_code': self.error_code
        }
