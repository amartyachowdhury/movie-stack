import { v4 as uuidv4 } from 'uuid';

// Analytics event types
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  USER_ACTION = 'user_action',
  PERFORMANCE = 'performance',
  SEARCH = 'search',
  MOVIE_INTERACTION = 'movie_interaction',
  ERROR = 'error',
  SYSTEM_HEALTH = 'system_health'
}

// Analytics event interfaces
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  sessionId: string;
  userId?: number;
  data: any;
}

export interface PageViewEvent {
  page_url: string;
  referrer?: string;
  user_agent: string;
  load_time?: number;
}

export interface UserActionEvent {
  action_type: string;
  action_data: any;
  page_url: string;
}

export interface PerformanceEvent {
  metric_type: string;
  metric_value: number;
  page_url: string;
}

export interface SearchEvent {
  query: string;
  results_count: number;
  click_position?: number;
}

export interface MovieInteractionEvent {
  movie_id: number;
  interaction_type: string;
  rating?: number;
  watchlist_action?: string;
}

export interface ErrorEvent {
  error_type: string;
  error_message: string;
  error_stack?: string;
  page_url: string;
}

export interface SystemHealthEvent {
  metric_type: string;
  metric_value: number;
  status: string;
}

// Analytics service class
class AnalyticsService {
  private sessionId: string;
  private userId?: number;
  private isEnabled: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeService();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private initializeService(): void {
    // Start flush timer
    this.startFlushTimer();
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushEvents();
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Track performance metrics
    this.trackPerformanceMetrics();
  }

  public setUserId(userId: number): void {
    this.userId = userId;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  // Track page view
  public trackPageView(pageUrl: string, loadTime?: number): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.PAGE_VIEW,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        page_url: pageUrl,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        load_time: loadTime
      } as PageViewEvent
    };

    this.addEvent(event);
  }

  // Track user action
  public trackUserAction(actionType: string, actionData: any = {}): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.USER_ACTION,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        action_type: actionType,
        action_data: actionData,
        page_url: window.location.pathname
      } as UserActionEvent
    };

    this.addEvent(event);
  }

  // Track performance metric
  public trackPerformance(metricType: string, metricValue: number): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.PERFORMANCE,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        metric_type: metricType,
        metric_value: metricValue,
        page_url: window.location.pathname
      } as PerformanceEvent
    };

    this.addEvent(event);
  }

  // Track search
  public trackSearch(query: string, resultsCount: number, clickPosition?: number): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.SEARCH,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        query,
        results_count: resultsCount,
        click_position: clickPosition
      } as SearchEvent
    };

    this.addEvent(event);
  }

  // Track movie interaction
  public trackMovieInteraction(
    movieId: number, 
    interactionType: string, 
    rating?: number, 
    watchlistAction?: string
  ): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.MOVIE_INTERACTION,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        movie_id: movieId,
        interaction_type: interactionType,
        rating,
        watchlist_action: watchlistAction
      } as MovieInteractionEvent
    };

    this.addEvent(event);
  }

  // Track error
  public trackError(errorType: string, errorMessage: string, errorStack?: string): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.ERROR,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        error_type: errorType,
        error_message: errorMessage,
        error_stack: errorStack,
        page_url: window.location.pathname
      } as ErrorEvent
    };

    this.addEvent(event);
  }

  // Track system health
  public trackSystemHealth(metricType: string, metricValue: number, status: string): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      id: uuidv4(),
      type: AnalyticsEventType.SYSTEM_HEALTH,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data: {
        metric_type: metricType,
        metric_value: metricValue,
        status
      } as SystemHealthEvent
    };

    this.addEvent(event);
  }

  // Add event to queue
  private addEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    // Flush if queue is full
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  // Start flush timer
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  // Flush events to backend
  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send events to backend
      await this.sendEventsToBackend(events);
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-add events to queue for retry, but limit retry attempts
      if (events.length < 100) { // Prevent infinite retry loops
        this.eventQueue.unshift(...events);
      }
    }
  }

  // Send events to backend
  private async sendEventsToBackend(events: AnalyticsEvent[]): Promise<void> {
    const token = localStorage.getItem('token');
    
    // Group events by type
    const eventsByType = events.reduce((acc, event) => {
      if (!acc[event.type]) {
        acc[event.type] = [];
      }
      acc[event.type].push(event);
      return acc;
    }, {} as Record<string, AnalyticsEvent[]>);

    // Send each type of event to its respective endpoint
    const promises = Object.entries(eventsByType).map(([type, typeEvents]) => {
      return this.sendEventType(type as AnalyticsEventType, typeEvents);
    });

    await Promise.all(promises);
  }

  // Send specific event type to backend
  private async sendEventType(type: AnalyticsEventType, events: AnalyticsEvent[]): Promise<void> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let endpoint = '';
    let payload: any = {};

    switch (type) {
      case AnalyticsEventType.PAGE_VIEW:
        endpoint = '/api/analytics/track/pageview';
        payload = events.map(event => event.data);
        break;
      case AnalyticsEventType.USER_ACTION:
        endpoint = '/api/analytics/track/action';
        payload = events.map(event => event.data);
        break;
      case AnalyticsEventType.PERFORMANCE:
        endpoint = '/api/analytics/track/performance';
        payload = events.map(event => event.data);
        break;
      case AnalyticsEventType.SEARCH:
        endpoint = '/api/analytics/track/search';
        payload = events.map(event => event.data);
        break;
      case AnalyticsEventType.MOVIE_INTERACTION:
        endpoint = '/api/analytics/track/movie-interaction';
        payload = events.map(event => event.data);
        break;
      default:
        console.warn(`Unknown analytics event type: ${type}`);
        return;
    }

    // Send events in batches
    for (let i = 0; i < payload.length; i += this.batchSize) {
      const batch = payload.slice(i, i + this.batchSize);
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(batch.length === 1 ? batch[0] : batch)
        });

        if (!response.ok) {
          // Don't throw error for analytics failures, just log them
          console.warn(`Analytics endpoint ${endpoint} returned ${response.status}: ${response.statusText}`);
          return;
        }
      } catch (error) {
        // Don't throw error for analytics failures, just log them
        console.warn(`Failed to send ${type} events to ${endpoint}:`, error);
        return;
      }
    }
  }

  // Track performance metrics
  private trackPerformanceMetrics(): void {
    // Track page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
            this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            this.trackPerformance('first_paint', performance.getEntriesByName('first-paint')[0]?.startTime || 0);
            this.trackPerformance('first_contentful_paint', performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0);
          }
        }, 0);
      });
    }

    // Track memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.trackPerformance('memory_usage', memory.usedJSHeapSize);
        this.trackPerformance('memory_limit', memory.jsHeapSizeLimit);
      }, 30000); // Every 30 seconds
    }

    // Track network performance
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.trackPerformance('network_speed', connection.downlink || 0);
        this.trackPerformance('network_latency', connection.rtt || 0);
      }
    }
  }

  // Get analytics data
  public async getAnalyticsData(endpoint: string): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/analytics/dashboard/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Get system health
  public async getSystemHealth(): Promise<any> {
    const response = await fetch('/api/analytics/health');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Cleanup
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents();
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Export singleton and class
export default analyticsService;
export { AnalyticsService };

// Global error tracking
window.addEventListener('error', (event) => {
  analyticsService.trackError('javascript_error', event.message, event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  analyticsService.trackError('unhandled_promise_rejection', event.reason?.message || 'Unknown error');
});

// Track common user actions
export const trackCommonActions = {
  // Movie interactions
  movieView: (movieId: number) => analyticsService.trackMovieInteraction(movieId, 'view'),
  movieRate: (movieId: number, rating: number) => analyticsService.trackMovieInteraction(movieId, 'rate', rating),
  movieAddToWatchlist: (movieId: number) => analyticsService.trackMovieInteraction(movieId, 'watchlist_add', undefined, 'add'),
  movieRemoveFromWatchlist: (movieId: number) => analyticsService.trackMovieInteraction(movieId, 'watchlist_remove', undefined, 'remove'),
  moviePlayTrailer: (movieId: number) => analyticsService.trackMovieInteraction(movieId, 'play_trailer'),

  // Search interactions
  searchPerformed: (query: string, resultsCount: number) => analyticsService.trackSearch(query, resultsCount),
  searchResultClicked: (query: string, resultsCount: number, clickPosition: number) => 
    analyticsService.trackSearch(query, resultsCount, clickPosition),

  // Navigation
  navigationClick: (destination: string) => analyticsService.trackUserAction('navigation_click', { destination }),
  buttonClick: (buttonId: string, context?: string) => analyticsService.trackUserAction('button_click', { button_id: buttonId, context }),
  
  // Form interactions
  formSubmit: (formId: string) => analyticsService.trackUserAction('form_submit', { form_id: formId }),
  formFieldFocus: (fieldId: string) => analyticsService.trackUserAction('form_field_focus', { field_id: fieldId }),
  formFieldBlur: (fieldId: string) => analyticsService.trackUserAction('form_field_blur', { field_id: fieldId }),

  // UI interactions
  modalOpen: (modalId: string) => analyticsService.trackUserAction('modal_open', { modal_id: modalId }),
  modalClose: (modalId: string) => analyticsService.trackUserAction('modal_close', { modal_id: modalId }),
  dropdownOpen: (dropdownId: string) => analyticsService.trackUserAction('dropdown_open', { dropdown_id: dropdownId }),
  dropdownClose: (dropdownId: string) => analyticsService.trackUserAction('dropdown_close', { dropdown_id: dropdownId }),

  // Theme and settings
  themeChange: (theme: string) => analyticsService.trackUserAction('theme_change', { theme }),
  settingChange: (setting: string, value: any) => analyticsService.trackUserAction('setting_change', { setting, value }),

  // Authentication
  loginAttempt: (method: string) => analyticsService.trackUserAction('login_attempt', { method }),
  loginSuccess: (method: string) => analyticsService.trackUserAction('login_success', { method }),
  loginFailure: (method: string, reason: string) => analyticsService.trackUserAction('login_failure', { method, reason }),
  logout: () => analyticsService.trackUserAction('logout'),

  // Performance tracking
  trackPageLoad: (pageUrl: string, loadTime: number) => analyticsService.trackPageView(pageUrl, loadTime),
  trackApiCall: (endpoint: string, duration: number, status: number) => 
    analyticsService.trackPerformance('api_call', duration),
  trackImageLoad: (imageUrl: string, loadTime: number) => 
    analyticsService.trackPerformance('image_load', loadTime),
};
