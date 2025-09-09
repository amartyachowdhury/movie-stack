"""
API package for Movie Stack
"""
from ..domains.movies.controllers import movies
from ..domains.recommendations.controllers import recommendations
from ..domains.users.controllers import users
from ..domains.auth.controllers import auth
from ..domains.analytics.controllers import analytics

__all__ = ['movies', 'recommendations', 'users', 'auth', 'analytics']
