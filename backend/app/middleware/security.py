"""
Security middleware configuration
"""

from flask import Flask, request, jsonify
from flask_talisman import Talisman
import os


def setup_security(app: Flask) -> None:
    """Setup security headers and configurations"""
    
    # Security headers
    security_policy = {
        'default-src': "'self'",
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://cdn.jsdelivr.net",
            "https://unpkg.com"
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com"
        ],
        'font-src': [
            "'self'",
            "https://fonts.gstatic.com"
        ],
        'img-src': [
            "'self'",
            "data:",
            "https:",
            "http:"
        ],
        'connect-src': [
            "'self'",
            "https://api.themoviedb.org",
            "https://image.tmdb.org"
        ],
        'frame-ancestors': "'none'",
        'base-uri': "'self'",
        'form-action': "'self'"
    }
    
    # Initialize Talisman with security policy
    Talisman(
        app,
        content_security_policy=security_policy,
        force_https=app.config.get('FORCE_HTTPS', False),
        strict_transport_security=True,
        strict_transport_security_max_age=31536000,
        strict_transport_security_include_subdomains=True,
        strict_transport_security_preload=True
    )
    
    # Additional security headers
    @app.after_request
    def add_security_headers(response):
        # Prevent MIME type sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        
        # Prevent clickjacking
        response.headers['X-Frame-Options'] = 'DENY'
        
        # XSS Protection
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy
        response.headers['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=(), '
            'magnetometer=(), '
            'gyroscope=(), '
            'speaker=()'
        )
        
        return response
    
    # API key validation middleware
    @app.before_request
    def validate_api_key():
        # Skip validation for non-API routes
        if not request.path.startswith('/api/'):
            return
        
        # Skip validation for health check and public endpoints
        public_endpoints = [
            '/api/health',
            '/api/auth/login',
            '/api/auth/register',
            '/api/movies/popular',
            '/api/movies/'
        ]
        
        if any(request.path.startswith(endpoint) for endpoint in public_endpoints):
            return
        
        # Check for API key in headers
        api_key = request.headers.get('X-API-Key')
        expected_api_key = app.config.get('API_KEY')
        
        if expected_api_key and api_key != expected_api_key:
            return jsonify({
                'success': False,
                'error': 'Invalid API key',
                'message': 'API key is required for this endpoint'
            }), 401
    
    # Request size limiting
    @app.before_request
    def limit_request_size():
        max_size = app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)  # 16MB
        if request.content_length and request.content_length > max_size:
            return jsonify({
                'success': False,
                'error': 'Request too large',
                'message': f'Request size exceeds {max_size} bytes'
            }), 413
