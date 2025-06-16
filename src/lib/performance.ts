// Performance monitoring and Web Vitals tracking
'use client';

import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

// Performance metrics interface
export interface PerformanceMetrics {
  cls: number;
  fid: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  timestamp: number;
  page: string;
  userAgent: string;
}

// Performance tracking class
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetrics[] = [];
  private readonly STORAGE_KEY = 'angel_granites_performance';
  private readonly MAX_STORED_METRICS = 100;

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  constructor() {
    this.loadStoredMetrics();
    this.initializeWebVitals();
  }

  // Initialize Web Vitals tracking
  private initializeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    getCLS(this.onMetric.bind(this));
    getFID(this.onMetric.bind(this));
    getFCP(this.onMetric.bind(this));
    getLCP(this.onMetric.bind(this));
    getTTFB(this.onMetric.bind(this));
  }

  // Handle Web Vitals metric
  private onMetric(metric: Metric): void {
    const performanceMetric: Partial<PerformanceMetrics> = {
      [metric.name.toLowerCase()]: metric.value,
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    };

    this.updateMetrics(performanceMetric);
    this.sendToAnalytics(metric);
  }

  // Update metrics collection
  private updateMetrics(newMetric: Partial<PerformanceMetrics>): void {
    const existingIndex = this.metrics.findIndex(
      m => m.page === newMetric.page && 
      Math.abs(m.timestamp - (newMetric.timestamp || 0)) < 5000
    );

    if (existingIndex !== -1) {
      // Update existing metric
      this.metrics[existingIndex] = { ...this.metrics[existingIndex], ...newMetric };
    } else {
      // Add new metric if we have all required fields
      if (this.isCompleteMetric(newMetric)) {
        this.metrics.push(newMetric as PerformanceMetrics);
        
        // Limit stored metrics
        if (this.metrics.length > this.MAX_STORED_METRICS) {
          this.metrics = this.metrics.slice(-this.MAX_STORED_METRICS);
        }
      }
    }

    this.saveMetrics();
  }

  // Check if metric is complete
  private isCompleteMetric(metric: Partial<PerformanceMetrics>): boolean {
    return !!(metric.timestamp && metric.page && metric.userAgent);
  }

  // Send metrics to analytics
  private sendToAnalytics(metric: Metric): void {
    // Google Analytics 4 example
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}: ${metric.value} (${metric.rating})`);
    }
  }

  // Load stored metrics
  private loadStoredMetrics(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored performance metrics:', error);
      this.metrics = [];
    }
  }

  // Save metrics to localStorage
  private saveMetrics(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  // Get metrics for a specific page
  getPageMetrics(page?: string): PerformanceMetrics[] {
    if (!page) return this.metrics;
    return this.metrics.filter(m => m.page === page);
  }

  // Get average metrics
  getAverageMetrics(page?: string): Partial<PerformanceMetrics> {
    const pageMetrics = this.getPageMetrics(page);
    if (pageMetrics.length === 0) return {};

    const averages = {
      cls: 0,
      fid: 0,
      fcp: 0,
      lcp: 0,
      ttfb: 0,
    };

    pageMetrics.forEach(metric => {
      averages.cls += metric.cls || 0;
      averages.fid += metric.fid || 0;
      averages.fcp += metric.fcp || 0;
      averages.lcp += metric.lcp || 0;
      averages.ttfb += metric.ttfb || 0;
    });

    const count = pageMetrics.length;
    return {
      cls: averages.cls / count,
      fid: averages.fid / count,
      fcp: averages.fcp / count,
      lcp: averages.lcp / count,
      ttfb: averages.ttfb / count,
    };
  }

  // Get performance score (0-100)
  getPerformanceScore(page?: string): number {
    const averages = this.getAverageMetrics(page);
    
    // Scoring based on Core Web Vitals thresholds
    let score = 0;
    let factors = 0;

    if (averages.lcp !== undefined) {
      score += averages.lcp <= 2500 ? 25 : averages.lcp <= 4000 ? 15 : 5;
      factors++;
    }

    if (averages.fid !== undefined) {
      score += averages.fid <= 100 ? 25 : averages.fid <= 300 ? 15 : 5;
      factors++;
    }

    if (averages.cls !== undefined) {
      score += averages.cls <= 0.1 ? 25 : averages.cls <= 0.25 ? 15 : 5;
      factors++;
    }

    if (averages.fcp !== undefined) {
      score += averages.fcp <= 1800 ? 25 : averages.fcp <= 3000 ? 15 : 5;
      factors++;
    }

    return factors > 0 ? score / factors * 4 : 0; // Scale to 0-100
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
    this.saveMetrics();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Export singleton instance
export const performanceTracker = PerformanceTracker.getInstance();

// Custom performance measurement utilities
export class CustomPerformanceTracker {
  private static timers = new Map<string, number>();

  // Start timing an operation
  static startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  // End timing and return duration
  static endTimer(name: string): number {
    const start = this.timers.get(name);
    if (!start) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }

    const duration = performance.now() - start;
    this.timers.delete(name);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[CustomTimer] ${name}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Measure async operation
  static async measureAsync<T>(name: string, operation: () => Promise<T>): Promise<T> {
    this.startTimer(name);
    try {
      const result = await operation();
      return result;
    } finally {
      this.endTimer(name);
    }
  }

  // Measure sync operation
  static measure<T>(name: string, operation: () => T): T {
    this.startTimer(name);
    try {
      return operation();
    } finally {
      this.endTimer(name);
    }
  }
}

// Performance observer for additional metrics
export function initializePerformanceObserver(): void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // Long Task Observer
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Navigation Observer
    const navigationObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const navEntry = entry as PerformanceNavigationTiming;
        console.log('[Performance] Navigation timing:', {
          dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
          tcpConnection: navEntry.connectEnd - navEntry.connectStart,
          serverResponse: navEntry.responseEnd - navEntry.requestStart,
          domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          domComplete: navEntry.domComplete - navEntry.navigationStart,
        });
      });
    });
    navigationObserver.observe({ entryTypes: ['navigation'] });

  } catch (error) {
    console.warn('Performance observer initialization failed:', error);
  }
}

// React hook for performance tracking
export function usePerformanceTracking(pageName?: string) {
  if (typeof window !== 'undefined') {
    const page = pageName || window.location.pathname;
    
    return {
      metrics: performanceTracker.getPageMetrics(page),
      averages: performanceTracker.getAverageMetrics(page),
      score: performanceTracker.getPerformanceScore(page),
      clearMetrics: () => performanceTracker.clearMetrics(),
      exportMetrics: () => performanceTracker.exportMetrics(),
    };
  }

  return {
    metrics: [],
    averages: {},
    score: 0,
    clearMetrics: () => {},
    exportMetrics: () => '[]',
  };
}
