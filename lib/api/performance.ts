/**
 * Performance monitoring utilities for RAG API
 */

export interface PerformanceMetrics {
  warmupTime?: number;
  queryTime?: number;
  coldStart?: boolean;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 100;

  /**
   * Record a warmup event
   */
  recordWarmup(duration: number, isColdStart: boolean) {
    this.addMetric({
      warmupTime: duration,
      coldStart: isColdStart,
      timestamp: Date.now()
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Warmup completed in ${duration}ms (Cold start: ${isColdStart})`);
    }
  }

  /**
   * Record a query event
   */
  recordQuery(duration: number) {
    this.addMetric({
      queryTime: duration,
      timestamp: Date.now()
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Query completed in ${duration}ms`);
    }
  }

  /**
   * Get average warmup time
   */
  getAverageWarmupTime(): number | null {
    const warmupMetrics = this.metrics.filter(m => m.warmupTime !== undefined);
    if (warmupMetrics.length === 0) return null;

    const total = warmupMetrics.reduce((sum, m) => sum + (m.warmupTime || 0), 0);
    return Math.round(total / warmupMetrics.length);
  }

  /**
   * Get average query time
   */
  getAverageQueryTime(): number | null {
    const queryMetrics = this.metrics.filter(m => m.queryTime !== undefined);
    if (queryMetrics.length === 0) return null;

    const total = queryMetrics.reduce((sum, m) => sum + (m.queryTime || 0), 0);
    return Math.round(total / queryMetrics.length);
  }

  /**
   * Get cold start rate
   */
  getColdStartRate(): number {
    const warmupMetrics = this.metrics.filter(m => m.warmupTime !== undefined);
    if (warmupMetrics.length === 0) return 0;

    const coldStarts = warmupMetrics.filter(m => m.coldStart).length;
    return coldStarts / warmupMetrics.length;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
  }

  private addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('ragPerformanceMetrics', JSON.stringify(this.metrics));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  /**
   * Load metrics from localStorage
   */
  loadMetrics() {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.localStorage.getItem('ragPerformanceMetrics');
      if (stored) {
        this.metrics = JSON.parse(stored);
        this.clearOldMetrics();
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();