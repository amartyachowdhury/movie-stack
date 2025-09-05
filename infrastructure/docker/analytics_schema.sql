-- Analytics Database Schema for Movie Stack
-- This script adds the missing analytics tables

USE movie_stack;

-- Page views table
CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    page_url VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    session_id VARCHAR(255),
    load_time FLOAT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    metric_type VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    page_url VARCHAR(500),
    session_id VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_metric_type (metric_type),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- User actions table
CREATE TABLE IF NOT EXISTS user_actions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    action_type VARCHAR(100) NOT NULL,
    action_data JSON,
    page_url VARCHAR(500),
    session_id VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    query VARCHAR(500) NOT NULL,
    results_count INTEGER DEFAULT 0,
    click_position INTEGER,
    session_id VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_query (query),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- Movie interactions table
CREATE TABLE IF NOT EXISTS movie_interactions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    movie_id INTEGER NOT NULL,
    interaction_type VARCHAR(100) NOT NULL,
    rating INTEGER,
    watchlist_action VARCHAR(50),
    session_id VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_movie_id (movie_id),
    INDEX idx_interaction_type (interaction_type),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp)
);

-- System health table
CREATE TABLE IF NOT EXISTS system_health (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    metric_type VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    status VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_type (metric_type),
    INDEX idx_status (status),
    INDEX idx_timestamp (timestamp)
);

-- Error events table
CREATE TABLE IF NOT EXISTS error_events (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    error_stack TEXT,
    page_url VARCHAR(500),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_error_type (error_type),
    INDEX idx_timestamp (timestamp)
);
