"""
Validation exceptions
"""

from typing import Dict, List, Any
from .base import BaseException


class ValidationException(BaseException):
    """Exception raised for validation errors"""
    
    def __init__(
        self,
        message: str = "Validation failed",
        errors: Optional[Dict[str, List[str]]] = None,
        field: Optional[str] = None
    ):
        self.errors = errors or {}
        self.field = field
        super().__init__(
            message=message,
            status_code=422,
            details={'errors': self.errors, 'field': self.field},
            error_code='VALIDATION_ERROR'
        )
    
    def add_error(self, field: str, error: str) -> None:
        """Add validation error for a field"""
        if field not in self.errors:
            self.errors[field] = []
        self.errors[field].append(error)
    
    def has_errors(self) -> bool:
        """Check if there are any validation errors"""
        return len(self.errors) > 0
