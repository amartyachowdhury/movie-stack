import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMicroInteractions } from '../hooks/useMicroInteractions';
import './AnalyticsDashboard.css';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [userBehaviorData, setUserBehaviorData] = useState<UserBehaviorData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const microInteractions = useMicroInteractions();

  console.log('🔍 [AnalyticsDashboard] Component rendered with props:', { userId, onMovieClick });
  console.log('🔍 [AnalyticsDashboard] Current state:', { loading, error, analyticsData: !!analyticsData });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard/overview`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      console.log('🔍 [AnalyticsDashboard] Raw API response:', data);
      
      if (data.status === 'success' && data.data) {
        setAnalyticsData(data.data);
        console.log('🔍 [AnalyticsDashboard] Set analytics data:', data.data);
      } else {
        console.error('🔍 [AnalyticsDashboard] Invalid data format:', data);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time data
  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard/real-time`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

              if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            setRealTimeData(data.data);
          }
        }
    } catch (err) {
      console.error('Failed to fetch real-time data:', err);
    }
  };

  // Fetch user behavior data
  const fetchUserBehaviorData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard/user-behavior`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

              if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            setUserBehaviorData(data.data);
          }
        }
    } catch (err) {
      console.error('Failed to fetch user behavior data:', err);
    }
  };

  // Fetch performance data
  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard/performance`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

              if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            setPerformanceData(data.data);
          }
        }
    } catch (err) {
      console.error('Failed to fetch performance data:', err);
    }
  };

  // Fetch business data
  const fetchBusinessData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard/business`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

              if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            setBusinessData(data.data);
          }
        }
    } catch (err) {
      console.error('Failed to fetch business data:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
    fetchRealTimeData();
    fetchUserBehaviorData();
    fetchPerformanceData();
    fetchBusinessData();
  }, []);

  // Auto-refresh real-time data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!analyticsData) return null;

    const totalPageViews = analyticsData.page_views?.reduce((sum, pv) => sum + pv.count, 0) || 0;
    const totalActions = analyticsData.user_actions?.reduce((sum, action) => sum + action.count, 0) || 0;
    const avgPerformance = analyticsData.performance && analyticsData.performance.length > 0 
      ? analyticsData.performance.reduce((sum, perf) => sum + perf.avg_value, 0) / analyticsData.performance.length 
      : 0;

    return {
      totalPageViews,
      totalActions,
      avgPerformance: avgPerformance.toFixed(2),
      uniqueSearches: analyticsData.popular_searches?.length || 0
    };
  }, [analyticsData]);

  // Render overview tab
  const renderOverview = () => (
    <div className="analytics-overview">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Total Page Views</h3>
            <p className="metric-value">{metrics?.totalPageViews || 0}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>User Actions</h3>
            <p className="metric-value">{metrics?.totalActions || 0}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Avg Performance</h3>
            <p className="metric-value">{metrics?.avgPerformance || 0}ms</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <h3>Unique Searches</h3>
            <p className="metric-value">{metrics?.uniqueSearches || 0}</p>
          </div>
        </div>
      </div>

      {/* Real-time Data */}
      {realTimeData && (
        <div className="real-time-section">
          <h3>Real-time Activity</h3>
          <div className="real-time-grid">
            <div className="real-time-card">
              <h4>Active Users</h4>
              <p className="real-time-value">{realTimeData.active_users}</p>
            </div>
            <div className="real-time-card">
              <h4>Page Views (1h)</h4>
              <p className="real-time-value">{realTimeData.page_views_last_hour}</p>
            </div>
            <div className="real-time-card">
              <h4>Errors (24h)</h4>
              <p className="real-time-value error">{realTimeData.error_count}</p>
            </div>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {analyticsData?.popular_searches && (
        <div className="popular-searches">
          <h3>Popular Searches</h3>
          <div className="search-list">
            {analyticsData.popular_searches.slice(0, 5).map((search, index) => (
              <div key={index} className="search-item">
                <span className="search-query">{search.query}</span>
                <span className="search-count">{search.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render user behavior tab
  const renderUserBehavior = () => (
    <div className="user-behavior">
      {userBehaviorData ? (
        <>
          <div className="behavior-metrics">
            <div className="behavior-card">
              <h3>Popular Pages</h3>
              <div className="page-list">
                {userBehaviorData.popular_pages.map((page, index) => (
                  <div key={index} className="page-item">
                    <span className="page-url">{page.page_url}</span>
                    <span className="page-visits">{page.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="behavior-card">
              <h3>User Actions</h3>
              <div className="action-list">
                {userBehaviorData.action_breakdown.map((action, index) => (
                  <div key={index} className="action-item">
                    <span className="action-type">{action.action_type}</span>
                    <span className="action-count">{action.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="engagement-metrics">
            <div className="engagement-card">
              <h3>Session Duration</h3>
              <p>Average: {userBehaviorData.session_duration.avg_duration}s</p>
              <p>Median: {userBehaviorData.session_duration.median_duration}s</p>
              <p>Max: {userBehaviorData.session_duration.max_duration}s</p>
            </div>
            <div className="engagement-card">
              <h3>Bounce Rate</h3>
              <p className="bounce-rate">{(userBehaviorData.bounce_rate * 100).toFixed(1)}%</p>
            </div>
          </div>
        </>
      ) : (
        <div className="loading-placeholder">Loading user behavior data...</div>
      )}
    </div>
  );

  // Render performance tab
  const renderPerformance = () => (
    <div className="performance-analytics">
      {performanceData ? (
        <>
          <div className="performance-metrics">
            <h3>Performance Metrics</h3>
            <div className="metrics-table">
              {performanceData.performance_metrics.map((metric, index) => (
                <div key={index} className="metric-row">
                  <span className="metric-name">{metric.metric_type}</span>
                  <span className="metric-avg">{metric.avg_value.toFixed(2)}ms</span>
                  <span className="metric-max">{metric.max_value.toFixed(2)}ms</span>
                </div>
              ))}
            </div>
          </div>
          <div className="system-health">
            <h3>System Health</h3>
            <div className="health-list">
              {performanceData.system_health.map((health, index) => (
                <div key={index} className={`health-item ${health.status}`}>
                  <span className="health-type">{health.metric_type}</span>
                  <span className="health-value">{health.metric_value}</span>
                  <span className="health-status">{health.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="loading-placeholder">Loading performance data...</div>
      )}
    </div>
  );

  // Render business tab
  const renderBusiness = () => (
    <div className="business-analytics">
      {businessData ? (
        <>
          <div className="business-metrics">
            <div className="business-card">
              <h3>User Growth</h3>
              <div className="growth-chart">
                {businessData.user_growth.slice(-7).map((growth, index) => (
                  <div key={index} className="growth-bar">
                    <div 
                      className="growth-fill" 
                      style={{ height: `${(growth.new_users / 10) * 100}%` }}
                    ></div>
                    <span className="growth-label">{growth.new_users}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="business-card">
              <h3>Search Effectiveness</h3>
              <div className="search-stats">
                <p>Average Results: {businessData.search_metrics.avg_results.toFixed(1)}</p>
                <p>Total Searches: {businessData.search_metrics.total_searches}</p>
                <p>Click-through Rate: {((businessData.search_metrics.searches_with_clicks / businessData.search_metrics.total_searches) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="retention-metrics">
            <h3>Retention Rates</h3>
            <div className="retention-grid">
              <div className="retention-card">
                <h4>Daily</h4>
                <p>{(businessData.retention_metrics.daily_retention * 100).toFixed(1)}%</p>
              </div>
              <div className="retention-card">
                <h4>Weekly</h4>
                <p>{(businessData.retention_metrics.weekly_retention * 100).toFixed(1)}%</p>
              </div>
              <div className="retention-card">
                <h4>Monthly</h4>
                <p>{(businessData.retention_metrics.monthly_retention * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading-placeholder">Loading business data...</div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="analytics-dashboard loading">
        <div className="loading-spinner">📊</div>
        <p>Loading analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-dashboard error">
        <div className="error-icon">❌</div>
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={fetchAnalyticsData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="analytics-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
          >
            {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
          </button>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavior')}
        >
          👥 User Behavior
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          ⚡ Performance
        </button>
        <button 
          className={`tab-button ${activeTab === 'business' ? 'active' : ''}`}
          onClick={() => setActiveTab('business')}
        >
          💼 Business
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'behavior' && renderUserBehavior()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'business' && renderBusiness()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
