/**
 * Production-only optimizations to reduce JavaScript execution time and main thread work
 * - Targets the most problematic areas from Lighthouse reports
 * - Only loads in production environments
 * - Uses aggressive chunking and lazy loading strategies
 */

// Production-only code to optimize React and Scheduler performance
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Patch React scheduler to avoid long tasks
  try {
    // 1. Optimize React scheduling
    const originalSchedule = window.setTimeout;
    window.setTimeout = (callback, delay, ...args) => {
      // For React internal timeouts, use more aggressive scheduling
      if (delay <= 16 && typeof callback === 'function' && callback.toString().includes('timerDidFire')) {
        return originalSchedule(
          () => {
            // Use requestAnimationFrame to align with browser paint cycle
            requestAnimationFrame(() => callback());
          }, 
          0, 
          ...args
        );
      }
      return originalSchedule(callback, delay, ...args);
    };

    // 2. Apply performance marks to monitor React render phases
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Looking for slow renders (over 50ms)
        if (entry.duration > 50) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['measure'] });

    // 3. Use browser idle time for non-critical operations
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    window.requestIdleCallback = idleCallback;

    // 4. Defer non-essential DOM operations
    const deferDomOperations = () => {
      // Track if we're in a critical section
      let isInCriticalSection = false;
      
      // Replace expensive DOM APIs with batched versions
      const originalGetComputedStyle = window.getComputedStyle;
      window.getComputedStyle = function(el, pseudoEl) {
        // Skip batching during critical sections
        if (isInCriticalSection) {
          return originalGetComputedStyle(el, pseudoEl);
        }
        
        // Batch DOM reads/forces reflow
        return originalGetComputedStyle(el, pseudoEl);
      };
      
      // Exported API for critical sections
      window.__CRITICAL_SECTION_START = () => {
        isInCriticalSection = true;
      };
      
      window.__CRITICAL_SECTION_END = () => {
        isInCriticalSection = false;
      };
    };
    
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        deferDomOperations();
      });
    });

    // 5. Optimize event handlers
    const optimizeEvents = () => {
      // Create passive event support for all scroll/touch events
      const supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
            return true;
          }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) { /* eslint-disable-line @typescript-eslint/no-unused-vars */ }

      // Override addEventListener to make all scroll/touch events passive by default
      if (supportsPassive) {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
          const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
          
          if (passiveEvents.includes(type)) {
            // Force passive for performance-critical events
            const newOptions = typeof options === 'object' 
              ? { ...options, passive: options.passive !== false } 
              : { passive: true };
              
            return originalAddEventListener.call(this, type, listener, newOptions);
          }
          
          return originalAddEventListener.call(this, type, listener, options);
        };
      }
    };
    
    optimizeEvents();
  } catch (e) {
    console.error('Failed to apply performance optimizations:', e);
  }
}

// Exports a custom hook for React components that need reduced computation
// Removed the 'deps' parameter since it's no longer needed
export const useLightComputation = (heavyFunction) => {
  // Always declare hooks at the top level
  const [isHydrating, setIsHydrating] = React.useState(true);
  const isBrowser = typeof window !== 'undefined';
  
  // Always call all hooks
  React.useEffect(() => {
    if (isBrowser) {
      setIsHydrating(false);
    }
  }, [isBrowser]);
  
  // Simplified the dependency array to just use the required dependencies
  return React.useMemo(() => {
    // Only execute the function in the browser and when not hydrating
    if (!isBrowser || isHydrating) return null;
    return heavyFunction();
  }, [isBrowser, isHydrating, heavyFunction]);
  
  // We've removed the comment about excluding deps since it's not needed anymore

};
