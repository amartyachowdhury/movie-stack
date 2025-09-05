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
def track_pageview():
    """Track page view analytics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def track_user_action():
    """Track user action analytics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def track_performance():
    """Track performance metrics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def track_search():
    """Track search analytics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def track_movie_interaction():
    """Track movie interaction analytics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def track_system_health():
    """Track system health metrics"""
    try:
        data = request.get_json()
        try:
            user_id = get_jwt_identity()
        except:
            user_id = None
        
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
def get_dashboard_overview():
    """Get analytics dashboard overview data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get basic counts
        cursor.execute('SELECT COUNT(*) FROM page_views')
        total_page_views = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM performance_metrics')
        total_performance_metrics = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM search_analytics')
        total_searches = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM movie_interactions')
        total_movie_interactions = cursor.fetchone()[0]
        
        # Get recent activity (last 24 hours)
        cursor.execute('''
            SELECT COUNT(*) FROM page_views 
            WHERE timestamp >= datetime('now', '-1 day')
        ''')
        recent_page_views = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'total_page_views': total_page_views,
                'total_performance_metrics': total_performance_metrics,
                'total_searches': total_searches,
                'total_movie_interactions': total_movie_interactions,
                'recent_page_views': recent_page_views,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting dashboard overview: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get dashboard overview'}), 500

@bp.route('/dashboard/real-time', methods=['GET'])
def get_real_time_dashboard():
    """Get real-time analytics data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get current session count (approximate)
        cursor.execute('''
            SELECT COUNT(DISTINCT session_id) FROM page_views 
            WHERE timestamp >= datetime('now', '-1 hour')
        ''')
        active_sessions = cursor.fetchone()[0]
        
        # Get recent page views
        cursor.execute('''
            SELECT page_url, COUNT(*) as count 
            FROM page_views 
            WHERE timestamp >= datetime('now', '-1 hour')
            GROUP BY page_url 
            ORDER BY count DESC 
            LIMIT 5
        ''')
        recent_pages = [{'page': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'active_sessions': active_sessions,
                'recent_pages': recent_pages,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting real-time dashboard: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get real-time dashboard'}), 500

@bp.route('/dashboard/user-behavior', methods=['GET'])
def get_user_behavior_dashboard():
    """Get user behavior analytics data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get user interaction patterns
        cursor.execute('''
            SELECT interaction_type, COUNT(*) as count 
            FROM movie_interactions 
            GROUP BY interaction_type
        ''')
        interaction_types = [{'type': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        # Get search patterns
        cursor.execute('''
            SELECT query, COUNT(*) as count 
            FROM search_analytics 
            GROUP BY query 
            ORDER BY count DESC 
            LIMIT 10
        ''')
        popular_searches = [{'query': row[0], 'count': row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'interaction_types': interaction_types,
                'popular_searches': popular_searches,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting user behavior dashboard: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get user behavior dashboard'}), 500

@bp.route('/dashboard/performance', methods=['GET'])
def get_performance_dashboard():
    """Get performance analytics data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get performance metrics summary
        cursor.execute('''
            SELECT metric_type, AVG(metric_value) as avg_value, COUNT(*) as count
            FROM performance_metrics 
            GROUP BY metric_type
        ''')
        performance_summary = [{'type': row[0], 'avg_value': row[1], 'count': row[2]} for row in cursor.fetchall()]
        
        # Get recent performance trends
        cursor.execute('''
            SELECT metric_type, metric_value, timestamp 
            FROM performance_metrics 
            WHERE timestamp >= datetime('now', '-24 hours')
            ORDER BY timestamp DESC 
            LIMIT 50
        ''')
        recent_performance = [{'type': row[0], 'value': row[1], 'timestamp': row[2]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'performance_summary': performance_summary,
                'recent_performance': recent_performance,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting performance dashboard: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get performance dashboard'}), 500

@bp.route('/dashboard/business', methods=['GET'])
def get_business_dashboard():
    """Get business analytics data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get user engagement metrics
        cursor.execute('''
            SELECT COUNT(DISTINCT user_id) as unique_users,
                   COUNT(*) as total_interactions
            FROM movie_interactions
        ''')
        user_engagement = cursor.fetchone()
        
        # Get content popularity
        cursor.execute('''
            SELECT movie_id, COUNT(*) as interaction_count
            FROM movie_interactions 
            GROUP BY movie_id 
            ORDER BY interaction_count DESC 
            LIMIT 10
        ''')
        popular_content = [{'movie_id': row[0], 'interactions': row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'user_engagement': {
                    'unique_users': user_engagement[0] if user_engagement else 0,
                    'total_interactions': user_engagement[1] if user_engagement else 0
                },
                'popular_content': popular_content,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting business dashboard: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Failed to get business dashboard'}), 500

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
