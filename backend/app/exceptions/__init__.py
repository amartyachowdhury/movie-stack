"""
Custom exceptions for the Movie Stack application
"""

from .base import BaseException
from .validation import ValidationException
from .authentication import AuthenticationException, AuthorizationException
from .not_found import NotFoundException
from .external_api import ExternalAPIException

__all__ = [
    'BaseException',
    'ValidationException',
    'AuthenticationException',
    'AuthorizationException',
    'NotFoundException',
    'ExternalAPIException'
]
