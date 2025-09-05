import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  memoryUsage?: number;
  networkRequests: number;
  errors: number;
}

interface PerformanceObserver {
  observe: (options: any) => void;
  disconnect: () => void;
}

interface UsePerformanceOptions {
  trackPageLoad?: boolean;
  trackUserInteractions?: boolean;
  trackMemoryUsage?: boolean;
  trackNetworkRequests?: boolean;
  trackErrors?: boolean;
  reportToAnalytics?: boolean;
}

export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    trackPageLoad = true,
    trackUserInteractions = true,
    trackMemoryUsage = false,
    trackNetworkRequests = true,
    trackErrors = true,
    reportToAnalytics = false
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: 0
  });

  const observersRef = useRef<PerformanceObserver[]>([]);
  const startTimeRef = useRef<number>(performance.now());

  // Track page load performance
  const trackPageLoadPerformance = useCallback(() => {
    if (!trackPageLoad) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metricsRef.current.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
      metricsRef.current.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
    }

    // Track First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new (window as any).PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metricsRef.current.firstContentfulPaint = entries[0].startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
      observersRef.current.push(fcpObserver);
    }

    // Track Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new (window as any).PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metricsRef.current.largestContentfulPaint = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);
    }

    // Track Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      const clsObserver = new (window as any).PerformanceObserver((list: any) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metricsRef.current.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);
    }

    // Track First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new (window as any).PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metricsRef.current.firstInputDelay = entries[0].processingStart - entries[0].startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);
    }
  }, [trackPageLoad]);

  // Track memory usage
  const trackMemoryUsageCallback = useCallback(() => {
    if (!trackMemoryUsage || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    if (memory) {
      metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }
  }, [trackMemoryUsage]);

  // Track network requests
  const trackNetworkRequestsCallback = useCallback(() => {
    if (!trackNetworkRequests) return;

    if ('PerformanceObserver' in window) {
      const resourceObserver = new (window as any).PerformanceObserver((list: any) => {
        const entries = list.getEntries();
        metricsRef.current.networkRequests = entries.length;
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      observersRef.current.push(resourceObserver);
    }
  }, [trackNetworkRequests]);

  // Track errors
  const trackErrorsCallback = useCallback(() => {
    if (!trackErrors) return;

    const handleError = (event: ErrorEvent) => {
      metricsRef.current.errors++;
      console.error('Performance Error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      metricsRef.current.errors++;
      console.error('Performance Unhandled Rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackErrors]);

  // Track user interactions
  const trackUserInteractionsCallback = useCallback(() => {
    if (!trackUserInteractions) return;

    let firstInteraction = true;
    const handleInteraction = () => {
      if (firstInteraction) {
        metricsRef.current.firstInputDelay = performance.now() - startTimeRef.current;
        firstInteraction = false;
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, [trackUserInteractions]);

  // Report metrics to analytics
  const reportMetrics = useCallback(() => {
    if (!reportToAnalytics) return;

    const metrics = metricsRef.current;
    const performanceData = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics
    };

    // Send to analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceData)
    }).catch(error => {
      console.error('Failed to report performance metrics:', error);
    });
  }, [reportToAnalytics]);

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      timeToInteractive: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errors: 0
    };
    startTimeRef.current = performance.now();
  }, []);

  // Performance score calculation
  const getPerformanceScore = useCallback(() => {
    const metrics = metricsRef.current;
    let score = 100;

    // Deduct points for poor performance
    if (metrics.largestContentfulPaint > 2500) score -= 20;
    if (metrics.firstInputDelay > 100) score -= 20;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 20;
    if (metrics.errors > 0) score -= 10;

    return Math.max(0, score);
  }, []);

  // Initialize performance tracking
  useEffect(() => {
    trackPageLoadPerformance();
    trackMemoryUsageCallback();
    trackNetworkRequestsCallback();

    const errorCleanup = trackErrorsCallback();
    const interactionCleanup = trackUserInteractionsCallback();

    // Periodic memory usage tracking
    let memoryInterval: NodeJS.Timeout;
    if (trackMemoryUsage) {
      memoryInterval = setInterval(trackMemoryUsageCallback, 30000); // Every 30 seconds
    }

    // Report metrics on page unload
    const handleBeforeUnload = () => {
      reportMetrics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup observers
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];

      // Cleanup event listeners
      if (errorCleanup) errorCleanup();
      if (interactionCleanup) interactionCleanup();
      if (memoryInterval) clearInterval(memoryInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    trackPageLoadPerformance,
    trackMemoryUsageCallback,
    trackNetworkRequestsCallback,
    trackErrorsCallback,
    trackUserInteractionsCallback,
    reportMetrics
  ]);

  return {
    getMetrics,
    resetMetrics,
    getPerformanceScore,
    reportMetrics
  };
};
