"""
Logging middleware configuration
"""

import logging
import sys
from datetime import datetime
from flask import Flask, request, g
from werkzeug.serving import WSGIRequestHandler


class CustomFormatter(logging.Formatter):
    """Custom log formatter"""
    
    def format(self, record):
        timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        return f"[{timestamp}] {record.levelname}: {record.getMessage()}"


def setup_logging(app: Flask) -> None:
    """Setup logging configuration"""
    
    # Set log level
    log_level = app.config.get('LOG_LEVEL', 'INFO')
    app.logger.setLevel(getattr(logging, log_level.upper()))
    
    # Remove default handlers
    for handler in app.logger.handlers[:]:
        app.logger.removeHandler(handler)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, log_level.upper()))
    console_handler.setFormatter(CustomFormatter())
    
    # Add handler to app logger
    app.logger.addHandler(console_handler)
    
    # Set werkzeug logger level
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)
    
    # Request logging middleware
    @app.before_request
    def log_request_info():
        g.start_time = datetime.utcnow()
        app.logger.info(f"Request: {request.method} {request.path}")
    
    @app.after_request
    def log_response_info(response):
        if hasattr(g, 'start_time'):
            duration = (datetime.utcnow() - g.start_time).total_seconds()
            app.logger.info(
                f"Response: {response.status_code} - "
                f"{request.method} {request.path} - "
                f"{duration:.3f}s"
            )
        return response
    
    # Error logging
    @app.errorhandler(Exception)
    def log_exception(error):
        app.logger.error(f"Unhandled exception: {str(error)}", exc_info=True)
        return error
