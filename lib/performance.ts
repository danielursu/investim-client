/**
 * Performance monitoring utilities for Core Web Vitals and bundle optimization
 */

// Core Web Vitals monitoring
export const reportWebVitals = (metric: any) => {
  if (typeof window !== 'undefined') {
    // Log performance metrics
    console.log(`[Performance] ${metric.name}: ${metric.value}ms`);
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: gtag('event', metric.name, { metric_value: metric.value });
      // Example: analytics.track(metric.name, { value: metric.value });
    }
  }
};

// Bundle size monitoring
export const trackBundleMetrics = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track initial bundle load time
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      const metrics = {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        firstByte: entry.responseStart - entry.requestStart,
      };
      
      console.log('[Bundle Metrics]', metrics);
    }
  }
};

// Performance observer for monitoring dynamic imports
export const observeLazyLoadedComponents = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Track lazy-loaded chunk performance
        if (entry.name.includes('_next/static/chunks/')) {
          console.log(`[Lazy Load] ${entry.name}: ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Memory usage monitoring
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (performance as any)) {
    const memory = (performance as any).memory;
    console.log('[Memory Usage]', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    });
  }
};

// Bundle optimization insights
export const getBundleOptimizationInsights = () => {
  if (typeof window !== 'undefined') {
    // Track number of chunks loaded
    const scripts = document.querySelectorAll('script[src*="_next/static/chunks/"]');
    const stylesheets = document.querySelectorAll('link[href*="_next/static/"]');
    
    return {
      chunksLoaded: scripts.length,
      stylesheetsLoaded: stylesheets.length,
      timestamp: Date.now()
    };
  }
  return null;
};