"""
Rate limiting middleware configuration
"""

from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis


def setup_rate_limiting(app: Flask) -> Limiter:
    """Setup rate limiting configuration"""
    
    # Redis configuration for rate limiting
    redis_url = app.config.get('REDIS_URL', 'redis://localhost:6379/0')
    
    try:
        redis_client = redis.from_url(redis_url)
        redis_client.ping()  # Test connection
    except redis.ConnectionError:
        # Fallback to memory storage if Redis is not available
        redis_client = None
    
    # Create limiter
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        storage_uri=redis_url if redis_client else "memory://",
        default_limits=["1000 per hour", "100 per minute"]
    )
    
    # Specific rate limits for different endpoints
    @app.before_request
    def set_rate_limits():
        if request.endpoint:
            # API endpoints
            if request.endpoint.startswith('api.'):
                if 'search' in request.endpoint:
                    limiter.limit("10 per minute")(lambda: None)()
                elif 'auth' in request.endpoint:
                    limiter.limit("5 per minute")(lambda: None)()
                elif 'analytics' in request.endpoint:
                    limiter.limit("100 per minute")(lambda: None)()
    
    # Rate limit exceeded handler
    @limiter.limit_exceeded_handler
    def rate_limit_exceeded(e):
        return jsonify({
            'success': False,
            'error': 'Rate limit exceeded',
            'message': str(e.description),
            'retry_after': e.retry_after
        }), 429
    
    return limiter
