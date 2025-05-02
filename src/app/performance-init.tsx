'use client';

import { useEffect } from 'react';

/**
 * Performance initialization component that safely defers third-party scripts
 * This component helps reduce JavaScript execution time by loading non-critical
 * scripts only when the browser is idle
 */
export default function PerformanceInit() {
  useEffect(() => {
    // Safe feature detection
    const hasIdleCallback = typeof window !== 'undefined' && 'requestIdleCallback' in window;
    const hasRAF = typeof window !== 'undefined' && 'requestAnimationFrame' in window;
    
    // Safely defer scripts with a fallback mechanism
    const deferScript = (src: string, priority: number = 0) => {
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      };
      
      // Choose appropriate scheduling based on priority and available APIs
      if (hasIdleCallback && priority < 1) {
        // Low priority - wait for idle time
        (window as any).requestIdleCallback(() => loadScript(), { timeout: 3000 });
      } else if (hasRAF && priority >= 1) {
        // Higher priority - use next animation frame
        window.requestAnimationFrame(() => setTimeout(loadScript, 0));
      } else {
        // Fallback - small timeout
        setTimeout(loadScript, priority >= 1 ? 100 : 1000);
      }
    };
    
    // Function to defer loading of third-party scripts
    const deferThirdPartyScripts = () => {
      // Google Tag Manager - higher priority
      deferScript('https://www.googletagmanager.com/gtm.js?id=GTM-56P7KZDV', 1);
      
      // Osano Cookie Consent - lower priority
      deferScript('https://cmp.osano.com/16BlGRUNRhRsy6cS2/951c545c-64c9-4a8f-886a-b22b0ff1528d/osano.js', 0);
    };
    
    // Monitor for long tasks if the API is available
    let observer: PerformanceObserver | null = null;
    try {
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.duration > 50) {
              console.debug(`Long task detected: ${Math.round(entry.duration)}ms`);
            }
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    } catch (e) {
      console.debug('PerformanceObserver not supported');
    }
    
    // Wait for page to become interactive before loading third-party scripts
    if (typeof document !== 'undefined') {
      if (document.readyState === 'complete') {
        deferThirdPartyScripts();
      } else {
        window.addEventListener('load', deferThirdPartyScripts);
      }
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', deferThirdPartyScripts);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}
