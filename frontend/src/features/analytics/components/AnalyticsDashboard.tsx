import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useMicroInteractions } from '../../../shared/hooks/useMicroInteractions';
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
    <div className="analytics-dashboard" style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>🔍 ANALYTICS DASHBOARD TEST - WORKING!</h1>
      <p>✅ Component is rendering successfully!</p>
      <p>📊 User ID: {userId}</p>
      <p>🕒 Timestamp: {new Date().toLocaleTimeString()}</p>
      <p>📝 Check browser console for debug logs</p>
      <button 
        onClick={() => {
          console.log('🔍 [AnalyticsDashboard] Test button clicked!');
          alert('Component is working! Check console for logs.');
        }}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: 'green', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        🎯 Test Button - Click Me!
      </button>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'yellow', border: '2px solid orange' }}>
        <strong>If you can see this, the component is working!</strong>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
