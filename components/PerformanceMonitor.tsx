'use client';

import { useEffect } from 'react';
import { trackBundleMetrics, observeLazyLoadedComponents, trackMemoryUsage, getBundleOptimizationInsights } from '@/lib/performance';

/**
 * Performance monitoring component that tracks Core Web Vitals and bundle optimization metrics
 * Only active in development mode to help with optimization efforts
 */
export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      // Track initial bundle metrics
      trackBundleMetrics();
      
      // Start observing lazy-loaded components
      observeLazyLoadedComponents();
      
      // Track memory usage periodically
      const memoryInterval = setInterval(() => {
        trackMemoryUsage();
      }, 10000); // Every 10 seconds
      
      // Track bundle optimization insights
      const insightsInterval = setInterval(() => {
        const insights = getBundleOptimizationInsights();
        if (insights) {
          console.log('[Bundle Insights]', insights);
        }
      }, 5000); // Every 5 seconds
      
      // Report Web Vitals
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
            onCLS(console.log);
            onINP(console.log); // onFID was replaced with onINP in web-vitals v4+
            onFCP(console.log);
            onLCP(console.log);
            onTTFB(console.log);
          }).catch(() => {
            // Silently fail if web-vitals is not available
          });
        });
      }
      
      return () => {
        clearInterval(memoryInterval);
        clearInterval(insightsInterval);
      };
    }
  }, []);

  // This component doesn't render anything visible
  return null;
};