// Performance monitoring and health check utilities
import { supabase } from '@/integrations/supabase/client';

export class PerformanceMonitor {
  private metrics: Map<string, {
    count: number;
    totalTime: number;
    maxTime: number;
    minTime: number;
    errors: number;
  }> = new Map();

  startTimer(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, duration: number, isError: boolean = false) {
    const existing = this.metrics.get(operation) || {
      count: 0,
      totalTime: 0,
      maxTime: 0,
      minTime: Infinity,
      errors: 0
    };

    existing.count++;
    existing.totalTime += duration;
    existing.maxTime = Math.max(existing.maxTime, duration);
    existing.minTime = Math.min(existing.minTime, duration);
    
    if (isError) {
      existing.errors++;
    }

    this.metrics.set(operation, existing);

    // Log slow operations
    if (duration > 5000) { // 5 second threshold
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }
  }

  getMetrics(operation?: string) {
    if (operation) {
      const metric = this.metrics.get(operation);
      if (!metric) return null;

      return {
        operation,
        averageTime: metric.totalTime / metric.count,
        maxTime: metric.maxTime,
        minTime: metric.minTime === Infinity ? 0 : metric.minTime,
        totalCalls: metric.count,
        errorRate: metric.errors / metric.count,
        errors: metric.errors
      };
    }

    const allMetrics: any[] = [];
    this.metrics.forEach((metric, operation) => {
      allMetrics.push({
        operation,
        averageTime: metric.totalTime / metric.count,
        maxTime: metric.maxTime,
        minTime: metric.minTime === Infinity ? 0 : metric.minTime,
        totalCalls: metric.count,
        errorRate: metric.errors / metric.count,
        errors: metric.errors
      });
    });

    return allMetrics.sort((a, b) => b.averageTime - a.averageTime);
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Database connection health check
export class DatabaseHealthCheck {
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds
  private isHealthy: boolean = true;
  private listeners: Set<(healthy: boolean) => void> = new Set();

  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Don't check too frequently
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isHealthy;
    }

    this.lastHealthCheck = now;

    try {
      const endTimer = performanceMonitor.startTimer('database_health_check');
      
      // Simple query to test connection
      const { data, error } = await supabase
        .from('trip_tasks')
        .select('id')
        .limit(1);

      endTimer();

      const healthy = !error;
      
      if (healthy !== this.isHealthy) {
        this.isHealthy = healthy;
        this.notifyListeners(healthy);
      }

      return healthy;
    } catch (error) {
      console.error('Database health check failed:', error);
      performanceMonitor.recordMetric('database_health_check', 0, true);
      
      if (this.isHealthy) {
        this.isHealthy = false;
        this.notifyListeners(false);
      }
      
      return false;
    }
  }

  subscribe(listener: (healthy: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(healthy: boolean) {
    this.listeners.forEach(listener => listener(healthy));
  }

  getStatus(): boolean {
    return this.isHealthy;
  }
}

export const databaseHealthCheck = new DatabaseHealthCheck();

// Memory usage monitoring
export class MemoryMonitor {
  private measurements: Array<{
    timestamp: number;
    used: number;
    total: number;
  }> = [];

  private maxMeasurements = 100;

  measure() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const measurement = {
        timestamp: Date.now(),
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize
      };

      this.measurements.push(measurement);
      
      if (this.measurements.length > this.maxMeasurements) {
        this.measurements.shift();
      }

      // Warn if memory usage is high
      const usagePercent = (measurement.used / measurement.total) * 100;
      if (usagePercent > 90) {
        console.warn(`High memory usage detected: ${usagePercent.toFixed(1)}%`);
      }

      return measurement;
    }

    return null;
  }

  getUsageHistory() {
    return [...this.measurements];
  }

  getCurrentUsage() {
    if (this.measurements.length === 0) {
      this.measure();
    }
    return this.measurements[this.measurements.length - 1] || null;
  }
}

export const memoryMonitor = new MemoryMonitor();

// Error tracking
export class ErrorTracker {
  private errors: Array<{
    timestamp: number;
    error: string;
    stack?: string;
    context?: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  private maxErrors = 200;

  track(
    error: Error | string, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: any
  ) {
    const errorEntry = {
      timestamp: Date.now(),
      error: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      severity
    };

    this.errors.push(errorEntry);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log critical errors immediately
    if (severity === 'critical') {
      console.error('CRITICAL ERROR:', errorEntry);
    }

    return errorEntry;
  }

  getErrors(severity?: string) {
    if (severity) {
      return this.errors.filter(e => e.severity === severity);
    }
    return [...this.errors];
  }

  getErrorCount(timeWindow: number = 60000): number {
    const cutoff = Date.now() - timeWindow;
    return this.errors.filter(e => e.timestamp > cutoff).length;
  }

  clear() {
    this.errors.length = 0;
  }
}

export const errorTracker = new ErrorTracker();

// Real-time connection quality monitor
export class ConnectionQualityMonitor {
  private pingHistory: number[] = [];
  private maxHistory = 20;
  private isMonitoring = false;

  async measureLatency(): Promise<number> {
    const start = performance.now();
    
    try {
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      const latency = performance.now() - start;
      
      this.pingHistory.push(latency);
      if (this.pingHistory.length > this.maxHistory) {
        this.pingHistory.shift();
      }
      
      return latency;
    } catch (error) {
      // Network error
      return -1;
    }
  }

  getAverageLatency(): number {
    if (this.pingHistory.length === 0) return -1;
    
    const validPings = this.pingHistory.filter(p => p > 0);
    if (validPings.length === 0) return -1;
    
    return validPings.reduce((sum, ping) => sum + ping, 0) / validPings.length;
  }

  getConnectionQuality(): 'excellent' | 'good' | 'fair' | 'poor' | 'offline' {
    const avg = this.getAverageLatency();
    
    if (avg === -1) return 'offline';
    if (avg < 100) return 'excellent';
    if (avg < 300) return 'good';
    if (avg < 800) return 'fair';
    return 'poor';
  }

  startMonitoring(interval: number = 30000) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    const monitor = async () => {
      if (!this.isMonitoring) return;
      
      await this.measureLatency();
      setTimeout(monitor, interval);
    };
    
    monitor();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }
}

export const connectionQualityMonitor = new ConnectionQualityMonitor();

// Comprehensive health dashboard
export const getSystemHealth = async () => {
  const [dbHealth, memUsage, latency] = await Promise.all([
    databaseHealthCheck.checkHealth(),
    memoryMonitor.measure(),
    connectionQualityMonitor.measureLatency()
  ]);

  const recentErrors = errorTracker.getErrorCount();
  const criticalErrors = errorTracker.getErrors('critical').length;
  
  return {
    database: {
      healthy: dbHealth,
      status: dbHealth ? 'online' : 'offline'
    },
    memory: memUsage ? {
      used: memUsage.used,
      total: memUsage.total,
      percentage: (memUsage.used / memUsage.total) * 100
    } : null,
    network: {
      latency,
      quality: connectionQualityMonitor.getConnectionQuality()
    },
    errors: {
      recent: recentErrors,
      critical: criticalErrors
    },
    performance: (() => {
      const metrics = performanceMonitor.getMetrics();
      return Array.isArray(metrics) ? metrics.slice(0, 10) : [];
    })()
  };
};