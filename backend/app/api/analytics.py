from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import json
import time
from collections import defaultdict, Counter
import sqlite3
import os

bp = Blueprint('analytics', __name__)

# In-memory analytics storage (in production, use Redis or database)
analytics_data = {
    'page_views': [],
    'user_actions': [],
    'performance_metrics': [],
    'errors': [],
    'search_queries': [],
    'movie_interactions': [],
    'system_health': []
}

def get_db_connection():
    """Get database connection for analytics storage"""
    db_path = os.path.join(current_app.instance_path, 'analytics.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_analytics_db():
    """Initialize analytics database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Page views table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            page_url TEXT NOT NULL,
            referrer TEXT,
            user_agent TEXT,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id TEXT,
            load_time REAL
        )
    ''')
    
    # User actions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action_type TEXT NOT NULL,
            action_data TEXT,
            page_url TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id TEXT
        )
    ''')
    
    # Performance metrics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS performance_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            metric_type TEXT NOT NULL,
            metric_value REAL,
            page_url TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id TEXT
        )
    ''')
    
    # Search analytics table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS search_analytics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            query TEXT NOT NULL,
            results_count INTEGER,
            click_position INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id TEXT
        )
    ''')
    
    # Movie interactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS movie_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            movie_id INTEGER,
            interaction_type TEXT NOT NULL,
            rating INTEGER,
            watchlist_action TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            session_id TEXT
        )
    ''')
    
    # System health table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_health (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            metric_type TEXT NOT NULL,
            metric_value REAL,
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@bp.route('/track/pageview', methods=['POST'])
@jwt_required(optional=True)
def track_pageview():
    """Track page view analytics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Validate required fields
        page_url = data.get('page_url')
        if not page_url:
            return jsonify({'status': 'error', 'message': 'page_url is required'}), 422
        
        cursor.execute('''
            INSERT INTO page_views (user_id, page_url, referrer, user_agent, ip_address, session_id, load_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            page_url,
            data.get('referrer') or None,
            data.get('user_agent') or None,
            request.remote_addr or None,
            data.get('session_id') or None,
            data.get('load_time') or None
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Page view tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking page view: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track page view'}), 500

@bp.route('/track/action', methods=['POST'])
@jwt_required(optional=True)
def track_user_action():
    """Track user action analytics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO user_actions (user_id, action_type, action_data, page_url, session_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            data.get('action_type'),
            json.dumps(data.get('action_data', {})),
            data.get('page_url'),
            data.get('session_id')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Action tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking user action: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track action'}), 500

@bp.route('/track/performance', methods=['POST'])
@jwt_required(optional=True)
def track_performance():
    """Track performance metrics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Validate required fields
        metric_type = data.get('metric_type')
        metric_value = data.get('metric_value')
        if not metric_type or metric_value is None:
            return jsonify({'status': 'error', 'message': 'metric_type and metric_value are required'}), 422
        
        cursor.execute('''
            INSERT INTO performance_metrics (user_id, metric_type, metric_value, page_url, session_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            metric_type,
            metric_value,
            data.get('page_url') or None,
            data.get('session_id') or None
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Performance metric tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking performance: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track performance'}), 500

@bp.route('/track/search', methods=['POST'])
@jwt_required(optional=True)
def track_search():
    """Track search analytics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO search_analytics (user_id, query, results_count, click_position, session_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            data.get('query'),
            data.get('results_count', 0),
            data.get('click_position'),
            data.get('session_id')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Search tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking search: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track search'}), 500

@bp.route('/track/movie-interaction', methods=['POST'])
@jwt_required(optional=True)
def track_movie_interaction():
    """Track movie interaction analytics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO movie_interactions (user_id, movie_id, interaction_type, rating, watchlist_action, session_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            data.get('movie_id'),
            data.get('interaction_type'),
            data.get('rating'),
            data.get('watchlist_action'),
            data.get('session_id')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Movie interaction tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking movie interaction: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track movie interaction'}), 500

@bp.route('/track/system-health', methods=['POST'])
@jwt_required(optional=True)
def track_system_health():
    """Track system health metrics"""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO system_health (metric_type, metric_value, status)
            VALUES (?, ?, ?)
        ''', (
            data.get('metric_type'),
            data.get('metric_value'),
            data.get('status')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'System health tracked'}), 200
    except Exception as e:
        current_app.logger.error(f"Error tracking system health: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to track system health'}), 500

@bp.route('/dashboard/overview', methods=['GET'])
@jwt_required()
def get_dashboard_overview():
    """Get analytics dashboard overview"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get date range (last 30 days)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        # Page views
        cursor.execute('''
            SELECT COUNT(*) as count, DATE(timestamp) as date
            FROM page_views
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY DATE(timestamp)
            ORDER BY date
        ''', (start_date, end_date))
        page_views = [dict(row) for row in cursor.fetchall()]
        
        # User actions
        cursor.execute('''
            SELECT action_type, COUNT(*) as count
            FROM user_actions
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY action_type
            ORDER BY count DESC
        ''', (start_date, end_date))
        user_actions = [dict(row) for row in cursor.fetchall()]
        
        # Performance metrics
        cursor.execute('''
            SELECT metric_type, AVG(metric_value) as avg_value, MAX(metric_value) as max_value
            FROM performance_metrics
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY metric_type
        ''', (start_date, end_date))
        performance = [dict(row) for row in cursor.fetchall()]
        
        # Search analytics
        cursor.execute('''
            SELECT query, COUNT(*) as count
            FROM search_analytics
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY query
            ORDER BY count DESC
            LIMIT 10
        ''', (start_date, end_date))
        popular_searches = [dict(row) for row in cursor.fetchall()]
        
        # Movie interactions
        cursor.execute('''
            SELECT interaction_type, COUNT(*) as count
            FROM movie_interactions
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY interaction_type
            ORDER BY count DESC
        ''', (start_date, end_date))
        movie_interactions = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'page_views': page_views,
            'user_actions': user_actions,
            'performance': performance,
            'popular_searches': popular_searches,
            'movie_interactions': movie_interactions
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting dashboard overview: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get dashboard data'}), 500

@bp.route('/dashboard/real-time', methods=['GET'])
@jwt_required()
def get_real_time_analytics():
    """Get real-time analytics data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Last 24 hours
        end_date = datetime.now()
        start_date = end_date - timedelta(hours=24)
        
        # Active users (last 5 minutes)
        active_start = end_date - timedelta(minutes=5)
        cursor.execute('''
            SELECT COUNT(DISTINCT user_id) as active_users
            FROM page_views
            WHERE timestamp BETWEEN ? AND ? AND user_id IS NOT NULL
        ''', (active_start, end_date))
        active_users = cursor.fetchone()['active_users']
        
        # Page views in last hour
        hour_start = end_date - timedelta(hours=1)
        cursor.execute('''
            SELECT COUNT(*) as page_views
            FROM page_views
            WHERE timestamp BETWEEN ? AND ?
        ''', (hour_start, end_date))
        page_views = cursor.fetchone()['page_views']
        
        # Recent searches
        cursor.execute('''
            SELECT query, timestamp
            FROM search_analytics
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp DESC
            LIMIT 10
        ''', (start_date, end_date))
        recent_searches = [dict(row) for row in cursor.fetchall()]
        
        # Recent errors
        cursor.execute('''
            SELECT COUNT(*) as error_count
            FROM system_health
            WHERE metric_type = 'error' AND timestamp BETWEEN ? AND ?
        ''', (start_date, end_date))
        error_count = cursor.fetchone()['error_count']
        
        conn.close()
        
        return jsonify({
            'active_users': active_users,
            'page_views_last_hour': page_views,
            'recent_searches': recent_searches,
            'error_count': error_count,
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting real-time analytics: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get real-time data'}), 500

@bp.route('/dashboard/user-behavior', methods=['GET'])
@jwt_required()
def get_user_behavior_analytics():
    """Get user behavior analytics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        # User journey analysis
        cursor.execute('''
            SELECT page_url, COUNT(*) as visits
            FROM page_views
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY page_url
            ORDER BY visits DESC
            LIMIT 10
        ''', (start_date, end_date))
        popular_pages = [dict(row) for row in cursor.fetchall()]
        
        # User engagement by action type
        cursor.execute('''
            SELECT action_type, COUNT(*) as count
            FROM user_actions
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY action_type
            ORDER BY count DESC
        ''', (start_date, end_date))
        action_breakdown = [dict(row) for row in cursor.fetchall()]
        
        # Session duration (mock data for now)
        session_duration = {
            'avg_duration': 180,  # seconds
            'median_duration': 120,
            'max_duration': 3600
        }
        
        # Bounce rate (mock data)
        bounce_rate = 0.35  # 35%
        
        conn.close()
        
        return jsonify({
            'popular_pages': popular_pages,
            'action_breakdown': action_breakdown,
            'session_duration': session_duration,
            'bounce_rate': bounce_rate
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting user behavior analytics: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get user behavior data'}), 500

@bp.route('/dashboard/performance', methods=['GET'])
@jwt_required()
def get_performance_analytics():
    """Get performance analytics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Last 24 hours
        end_date = datetime.now()
        start_date = end_date - timedelta(hours=24)
        
        # Performance metrics by type
        cursor.execute('''
            SELECT metric_type, AVG(metric_value) as avg_value, 
                   MIN(metric_value) as min_value, MAX(metric_value) as max_value
            FROM performance_metrics
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY metric_type
        ''', (start_date, end_date))
        performance_metrics = [dict(row) for row in cursor.fetchall()]
        
        # Performance trends (hourly)
        cursor.execute('''
            SELECT strftime('%H', timestamp) as hour, AVG(metric_value) as avg_value
            FROM performance_metrics
            WHERE timestamp BETWEEN ? AND ? AND metric_type = 'page_load_time'
            GROUP BY strftime('%H', timestamp)
            ORDER BY hour
        ''', (start_date, end_date))
        performance_trends = [dict(row) for row in cursor.fetchall()]
        
        # System health
        cursor.execute('''
            SELECT metric_type, metric_value, status, timestamp
            FROM system_health
            WHERE timestamp BETWEEN ? AND ?
            ORDER BY timestamp DESC
            LIMIT 20
        ''', (start_date, end_date))
        system_health = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'performance_metrics': performance_metrics,
            'performance_trends': performance_trends,
            'system_health': system_health
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting performance analytics: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get performance data'}), 500

@bp.route('/dashboard/business', methods=['GET'])
@jwt_required()
def get_business_analytics():
    """Get business analytics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        # User growth
        cursor.execute('''
            SELECT DATE(timestamp) as date, COUNT(DISTINCT user_id) as new_users
            FROM page_views
            WHERE timestamp BETWEEN ? AND ? AND user_id IS NOT NULL
            GROUP BY DATE(timestamp)
            ORDER BY date
        ''', (start_date, end_date))
        user_growth = [dict(row) for row in cursor.fetchall()]
        
        # Content engagement
        cursor.execute('''
            SELECT movie_id, COUNT(*) as interactions
            FROM movie_interactions
            WHERE timestamp BETWEEN ? AND ?
            GROUP BY movie_id
            ORDER BY interactions DESC
            LIMIT 10
        ''', (start_date, end_date))
        top_movies = [dict(row) for row in cursor.fetchall()]
        
        # Search effectiveness
        cursor.execute('''
            SELECT AVG(results_count) as avg_results,
                   COUNT(*) as total_searches,
                   COUNT(CASE WHEN click_position IS NOT NULL THEN 1 END) as searches_with_clicks
            FROM search_analytics
            WHERE timestamp BETWEEN ? AND ?
        ''', (start_date, end_date))
        search_metrics = dict(cursor.fetchone())
        
        # Retention metrics (mock data)
        retention_metrics = {
            'daily_retention': 0.45,  # 45%
            'weekly_retention': 0.28,  # 28%
            'monthly_retention': 0.15   # 15%
        }
        
        conn.close()
        
        return jsonify({
            'user_growth': user_growth,
            'top_movies': top_movies,
            'search_metrics': search_metrics,
            'retention_metrics': retention_metrics
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting business analytics: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get business data'}), 500

@bp.route('/health', methods=['GET'])
def get_system_health():
    """Get system health status"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Record current health check
        cursor.execute('''
            INSERT INTO system_health (metric_type, metric_value, status)
            VALUES (?, ?, ?)
        ''', ('health_check', time.time(), 'healthy'))
        
        # Get recent health metrics
        cursor.execute('''
            SELECT metric_type, metric_value, status, timestamp
            FROM system_health
            ORDER BY timestamp DESC
            LIMIT 10
        ''')
        health_metrics = [dict(row) for row in cursor.fetchall()]
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'health_metrics': health_metrics
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting system health: {str(e)}")
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# Note: Database initialization will be handled when the blueprint is registered
