/**
 * Script optimization utilities to improve First Input Delay (FID) and Time to Interactive (TTI)
 * This helps address one of the key issues affecting Lighthouse performance scores
 */

// Use this in client components to defer non-critical JavaScript
(function() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Store original requestIdleCallback for browsers that support it
  const originalRequestIdleCallback = window.requestIdleCallback || 
    function(cb) {
      const start = Date.now();
      return setTimeout(function() {
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start));
          }
        });
      }, 1);
    };

  // Chunk large work into smaller pieces to avoid main thread blockage
  const chunkedWork = (items, process, context, callback) => {
    let i = 0;
    const len = items.length;
    
    function doChunk() {
      const start = performance.now();
      while (i < len && performance.now() - start < 5) {
        process.call(context, items[i], i);
        i++;
      }
      
      if (i < len) {
        originalRequestIdleCallback(doChunk);
      } else if (callback) {
        callback();
      }
    }
    
    originalRequestIdleCallback(doChunk);
  };
  
  // Defer scripts based on visibility and priority
  const deferScripts = () => {
    // Defer third-party scripts until page is interactive
    const deferThirdParty = () => {
      const scripts = [
        { src: 'https://www.googletagmanager.com/gtag/js', id: 'ga-script', async: true, defer: true },
        { src: 'https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js', id: 'cookie-script', async: true, defer: true }
      ];
      
      chunkedWork(scripts, (scriptData) => {
        const script = document.createElement('script');
        script.src = scriptData.src;
        script.id = scriptData.id;
        script.async = scriptData.async;
        script.defer = scriptData.defer;
        document.body.appendChild(script);
      });
    };
    
    // Delay non-critical scripts until user interaction or idle time
    if (document.readyState === 'complete') {
      originalRequestIdleCallback(deferThirdParty);
    } else {
      window.addEventListener('load', () => {
        originalRequestIdleCallback(deferThirdParty);
      });
    }
  };
  
  // Initialize optimization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferScripts);
  } else {
    deferScripts();
  }
  
  // Expose utils globally with a namespace to prevent conflicts
  window.AngelOptimizer = {
    chunkedWork,
    deferScripts
  };
})();
