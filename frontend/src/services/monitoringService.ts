import analyticsService from './analyticsService';

// Monitoring event types
export enum MonitoringEventType {
  PERFORMANCE_ALERT = 'performance_alert',
  ERROR_ALERT = 'error_alert',
  SYSTEM_ALERT = 'system_alert',
  USER_BEHAVIOR_ALERT = 'user_behavior_alert',
  SECURITY_ALERT = 'security_alert'
}

// Alert severity levels
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Alert interface
export interface Alert {
  id: string;
  type: MonitoringEventType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  metadata: any;
  acknowledged: boolean;
  resolved: boolean;
}

// Performance thresholds
export interface PerformanceThresholds {
  pageLoadTime: number; // milliseconds
  apiResponseTime: number; // milliseconds
  memoryUsage: number; // percentage
  errorRate: number; // percentage
  userSessionDuration: number; // seconds
}

// Monitoring service class
class MonitoringService {
  private alerts: Alert[] = [];
  private thresholds: PerformanceThresholds;
  private isEnabled: boolean = true;
  private checkInterval: number = 30000; // 30 seconds
  private checkTimer?: NodeJS.Timeout;
  private performanceHistory: Map<string, number[]> = new Map();
  private errorCount: number = 0;
  private requestCount: number = 0;
  private sessionStartTime: number = Date.now();

  constructor() {
    this.thresholds = {
      pageLoadTime: 3000,
      apiResponseTime: 2000,
      memoryUsage: 80,
      errorRate: 5,
      userSessionDuration: 300 // 5 minutes
    };

    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Start monitoring timer
    this.startMonitoringTimer();

    // Monitor performance metrics
    this.monitorPerformance();

    // Monitor errors
    this.monitorErrors();

    // Monitor system resources
    this.monitorSystemResources();

    // Monitor user behavior
    this.monitorUserBehavior();

    // Monitor security events
    this.monitorSecurityEvents();
  }

  // Start monitoring timer
  private startMonitoringTimer(): void {
    this.checkTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.checkInterval);
  }

  // Monitor performance metrics
  private monitorPerformance(): void {
    // Monitor page load times
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            this.checkPerformanceThreshold('pageLoadTime', loadTime, 'Page load time exceeded threshold');
          }
        }, 0);
      });
    }

    // Monitor API response times
    this.interceptApiCalls();

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        this.checkPerformanceThreshold('memoryUsage', usagePercentage, 'Memory usage exceeded threshold');
      }, 30000);
    }
  }

  // Intercept API calls to monitor response times
  private interceptApiCalls(): void {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      this.requestCount++;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;

        this.checkPerformanceThreshold('apiResponseTime', duration, 'API response time exceeded threshold');
        return response;
      } catch (error) {
        this.errorCount++;
        this.checkErrorRate();
        throw error;
      }
    };
  }

  // Monitor errors
  private monitorErrors(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.createAlert(
        MonitoringEventType.ERROR_ALERT,
        AlertSeverity.HIGH,
        'JavaScript Error',
        event.message,
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack
        }
      );
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.createAlert(
        MonitoringEventType.ERROR_ALERT,
        AlertSeverity.MEDIUM,
        'Unhandled Promise Rejection',
        event.reason?.message || 'Unknown error',
        {
          reason: event.reason
        }
      );
    });
  }

  // Monitor system resources
  private monitorSystemResources(): void {
    // Monitor network connectivity
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', () => {
          this.createAlert(
            MonitoringEventType.SYSTEM_ALERT,
            AlertSeverity.MEDIUM,
            'Network Connection Changed',
            `Connection type: ${connection.effectiveType}, Speed: ${connection.downlink} Mbps`,
            {
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt
            }
          );
        });
      }
    }

    // Monitor battery status
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2) {
            this.createAlert(
              MonitoringEventType.SYSTEM_ALERT,
              AlertSeverity.LOW,
              'Low Battery',
              `Battery level: ${(battery.level * 100).toFixed(1)}%`,
              {
                level: battery.level,
                charging: battery.charging
              }
            );
          }
        });
      });
    }
  }

  // Monitor user behavior
  private monitorUserBehavior(): void {
    // Monitor session duration
    setInterval(() => {
      const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
      this.checkPerformanceThreshold('userSessionDuration', sessionDuration, 'User session duration exceeded threshold');
    }, 120000); // Check every 2 minutes

    // Monitor user interactions with much higher threshold
    let interactionCount = 0;
    const interactionThreshold = 1000; // Increased to 1000 interactions per minute
    let lastInteractionAlert = 0;
    const interactionAlertCooldown = 600000; // 10 minutes between alerts

    const trackInteraction = () => {
      interactionCount++;
      setTimeout(() => {
        interactionCount--;
      }, 60000);

      // Only alert if threshold exceeded and cooldown has passed
      if (interactionCount > interactionThreshold && 
          Date.now() - lastInteractionAlert > interactionAlertCooldown) {
        this.createAlert(
          MonitoringEventType.USER_BEHAVIOR_ALERT,
          AlertSeverity.MEDIUM,
          'High User Interaction Rate',
          `User performed ${interactionCount} interactions in the last minute`,
          {
            interactionCount,
            threshold: interactionThreshold
          }
        );
        lastInteractionAlert = Date.now();
      }
    };

    // Track various user interactions with throttling
    let lastClickTime = 0;
    let lastKeyTime = 0;
    let lastScrollTime = 0;
    const throttleDelay = 500; // 500ms throttle to reduce spam

    document.addEventListener('click', () => {
      if (Date.now() - lastClickTime > throttleDelay) {
        trackInteraction();
        lastClickTime = Date.now();
      }
    });
    
    document.addEventListener('keydown', () => {
      if (Date.now() - lastKeyTime > throttleDelay) {
        trackInteraction();
        lastKeyTime = Date.now();
      }
    });
    
    document.addEventListener('scroll', () => {
      if (Date.now() - lastScrollTime > throttleDelay) {
        trackInteraction();
        lastScrollTime = Date.now();
      }
    });
  }

  // Monitor security events
  private monitorSecurityEvents(): void {
    // Monitor for suspicious activity
    let rapidRequests = 0;
    const rapidRequestThreshold = 10; // Alert if more than 10 requests in 1 second

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      rapidRequests++;
      setTimeout(() => {
        rapidRequests--;
      }, 1000);

      if (rapidRequests > rapidRequestThreshold) {
        this.createAlert(
          MonitoringEventType.SECURITY_ALERT,
          AlertSeverity.HIGH,
          'Suspicious Activity Detected',
          `Rapid API requests detected: ${rapidRequests} requests in 1 second`,
          {
            requestCount: rapidRequests,
            threshold: rapidRequestThreshold
          }
        );
      }

      return originalFetch(...args);
    };
  }

  // Check performance threshold
  private checkPerformanceThreshold(metric: keyof PerformanceThresholds, value: number, message: string): void {
    const threshold = this.thresholds[metric];
    
    if (value > threshold) {
      this.createAlert(
        MonitoringEventType.PERFORMANCE_ALERT,
        this.getSeverityForValue(value, threshold),
        'Performance Issue',
        `${message}: ${value.toFixed(2)} (threshold: ${threshold})`,
        {
          metric,
          value,
          threshold
        }
      );
    }

    // Store in history for trending
    if (!this.performanceHistory.has(metric)) {
      this.performanceHistory.set(metric, []);
    }
    this.performanceHistory.get(metric)!.push(value);

    // Keep only last 100 values
    if (this.performanceHistory.get(metric)!.length > 100) {
      this.performanceHistory.get(metric)!.shift();
    }
  }

  // Check error rate
  private checkErrorRate(): void {
    if (this.requestCount > 0) {
      const errorRate = (this.errorCount / this.requestCount) * 100;
      if (errorRate > this.thresholds.errorRate) {
        this.createAlert(
          MonitoringEventType.ERROR_ALERT,
          AlertSeverity.HIGH,
          'High Error Rate',
          `Error rate: ${errorRate.toFixed(2)}% (threshold: ${this.thresholds.errorRate}%)`,
          {
            errorCount: this.errorCount,
            requestCount: this.requestCount,
            errorRate
          }
        );
      }
    }
  }

  // Get severity level based on value and threshold
  private getSeverityForValue(value: number, threshold: number): AlertSeverity {
    const ratio = value / threshold;
    if (ratio >= 3) return AlertSeverity.CRITICAL;
    if (ratio >= 2) return AlertSeverity.HIGH;
    if (ratio >= 1.5) return AlertSeverity.MEDIUM;
    return AlertSeverity.LOW;
  }

  // Create alert
  private createAlert(
    type: MonitoringEventType,
    severity: AlertSeverity,
    title: string,
    message: string,
    metadata: any = {}
  ): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      acknowledged: false,
      resolved: false
    };

    this.alerts.push(alert);
    this.notifyAlert(alert);
    this.logAlert(alert);
  }

  // Notify about alert
  private notifyAlert(alert: Alert): void {
    // Show toast notification for high/critical alerts
    if (alert.severity === AlertSeverity.HIGH || alert.severity === AlertSeverity.CRITICAL) {
      if ((window as any).showToast) {
        (window as any).showToast({
          type: 'error',
          title: alert.title,
          message: alert.message,
          duration: 10000
        });
      }
    }

    // Log to console
    console.warn(`[${alert.severity.toUpperCase()}] ${alert.title}: ${alert.message}`, alert.metadata);
  }

  // Log alert to analytics
  private logAlert(alert: Alert): void {
    analyticsService.trackSystemHealth(
      alert.type,
      alert.severity === AlertSeverity.CRITICAL ? 100 : 
      alert.severity === AlertSeverity.HIGH ? 75 :
      alert.severity === AlertSeverity.MEDIUM ? 50 : 25,
      alert.severity
    );
  }

  // Perform health check
  private performHealthCheck(): void {
    // Check system health
    this.checkSystemHealth();

    // Check for stale alerts
    this.cleanupStaleAlerts();

    // Generate health report
    this.generateHealthReport();
  }

  // Check system health
  private async checkSystemHealth(): Promise<void> {
    try {
      const health = await analyticsService.getSystemHealth();
      
      if (health.status !== 'healthy') {
        this.createAlert(
          MonitoringEventType.SYSTEM_ALERT,
          AlertSeverity.HIGH,
          'System Health Issue',
          `System health check failed: ${health.status}`,
          health
        );
      }
    } catch (error) {
      this.createAlert(
        MonitoringEventType.SYSTEM_ALERT,
        AlertSeverity.CRITICAL,
        'Health Check Failed',
        'Unable to perform system health check',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  // Cleanup stale alerts
  private cleanupStaleAlerts(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => {
      const alertTime = new Date(alert.timestamp).getTime();
      return alertTime > oneHourAgo || !alert.resolved;
    });
  }

  // Generate health report
  private generateHealthReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      totalAlerts: this.alerts.length,
      activeAlerts: this.alerts.filter(a => !a.resolved).length,
      alertsBySeverity: {
        critical: this.alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
        high: this.alerts.filter(a => a.severity === AlertSeverity.HIGH).length,
        medium: this.alerts.filter(a => a.severity === AlertSeverity.MEDIUM).length,
        low: this.alerts.filter(a => a.severity === AlertSeverity.LOW).length
      },
      performanceMetrics: Object.fromEntries(this.performanceHistory),
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      sessionDuration: (Date.now() - this.sessionStartTime) / 1000
    };

    // Log health report
    console.log('Health Report:', report);

    // Send to analytics
    analyticsService.trackSystemHealth('health_report', report.activeAlerts, 'report');
  }

  // Public methods
  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  public acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  public getPerformanceHistory(metric: string): number[] {
    return this.performanceHistory.get(metric) || [];
  }

  public getHealthMetrics(): any {
    return {
      totalAlerts: this.alerts.length,
      activeAlerts: this.alerts.filter(a => !a.resolved).length,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      sessionDuration: (Date.now() - this.sessionStartTime) / 1000,
      performanceHistory: Object.fromEntries(this.performanceHistory)
    };
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public destroy(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
    }
  }
}

// Create singleton instance
const monitoringService = new MonitoringService();

// Export singleton and class
export default monitoringService;
export { MonitoringService };
