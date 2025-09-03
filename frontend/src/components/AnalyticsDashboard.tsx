import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './AnalyticsDashboard.css';

console.log('🔍 [AnalyticsDashboard] Module loaded successfully');

interface AnalyticsData {
  // New API format
  total_page_views?: number;
  total_performance_metrics?: number;
  total_searches?: number;
  total_movie_interactions?: number;
  recent_page_views?: number;
  timestamp?: string;
  
  // Old API format (fallback)
  page_views?: Array<{ date: string; count: number }>;
  user_actions?: Array<{ action_type: string; count: number }>;
  performance?: Array<{ metric_type: string; avg_value: number; max_value: number }>;
  popular_searches?: Array<{ query: string; count: number }>;
  movie_interactions?: Array<{ interaction_type: string; count: number }>;
}

interface RealTimeData {
  active_users: number;
  page_views_last_hour: number;
  recent_searches: Array<{ query: string; timestamp: string }>;
  error_count: number;
  timestamp: string;
}

interface UserBehaviorData {
  popular_pages: Array<{ page_url: string; visits: number }>;
  action_breakdown: Array<{ action_type: string; count: number }>;
  session_duration: {
    avg_duration: number;
    median_duration: number;
    max_duration: number;
  };
  bounce_rate: number;
}

interface PerformanceData {
  performance_metrics: Array<{
    metric_type: string;
    avg_value: number;
    min_value: number;
    max_value: number;
  }>;
  performance_trends: Array<{ hour: string; avg_value: number }>;
  system_health: Array<{
    metric_type: string;
    metric_value: number;
    status: string;
    timestamp: string;
  }>;
}

interface BusinessData {
  user_growth: Array<{ date: string; new_users: number }>;
  top_movies: Array<{ movie_id: number; interactions: number }>;
  search_metrics: {
    avg_results: number;
    total_searches: number;
    searches_with_clicks: number;
  };
  retention_metrics: {
    daily_retention: number;
    weekly_retention: number;
    monthly_retention: number;
  };
}

interface AnalyticsDashboardProps {
  userId: number;
  onMovieClick?: (movie: any) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId, onMovieClick }) => {
  console.log('🔍 [AnalyticsDashboard] Component starting to render...');
  
  // Simple test render to see if component mounts
  return (
    <div className="analytics-dashboard">
      <h1>Analytics Dashboard Test</h1>
      <p>Component is rendering! User ID: {userId}</p>
      <p>Check console for debug logs.</p>
      <button onClick={() => console.log('Button clicked!')}>Test Button</button>
    </div>
  );
};

export default AnalyticsDashboard;
