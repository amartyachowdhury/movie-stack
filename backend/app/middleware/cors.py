"""
CORS middleware configuration
"""

from flask_cors import CORS
from flask import Flask


def setup_cors(app: Flask) -> None:
    """Setup CORS configuration"""
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://movie-stack.vercel.app",
                "https://movie-stack.netlify.app"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": [
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "Accept",
                "Origin"
            ],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
