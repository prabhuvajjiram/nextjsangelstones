/**
 * Performance utilities for optimizing loading and rendering
 */

// Preload critical resources
export const preloadCriticalAssets = () => {
  if (typeof window === 'undefined') return;
  
  const preloadLinks = [
    // Preload critical fonts
    { rel: 'preload', href: '/fonts/playfair-display.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    // Preload critical images (hero image, logo)
    { rel: 'preload', href: '/images/logo.png', as: 'image' },
    { rel: 'preload', href: '/images/hero.jpg', as: 'image' },
  ];
  
  preloadLinks.forEach(link => {
    const linkEl = document.createElement('link');
    Object.entries(link).forEach(([key, value]) => {
      linkEl.setAttribute(key, value as string);
    });
    document.head.appendChild(linkEl);
  });
};

// Add intersection observer for lazy loading components
export const useLazyComponent = <T extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = { rootMargin: '200px' }
) => {
  return (ref: T | null) => {
    if (ref && typeof window !== 'undefined') {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry);
            // Unobserve after triggering
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      observer.observe(ref);
      
      // Return cleanup function
      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  };
};

// Defer non-critical JavaScript
export const deferNonCriticalJS = (src: string, id?: string) => {
  if (typeof window === 'undefined') return;
  
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  if (id) script.id = id;
  
  window.requestIdleCallback(() => {
    document.body.appendChild(script);
  });
};

// Helper for CSS optimizations
export const optimizeCSSDelivery = (css: string) => {
  if (typeof window === 'undefined') return;
  
  const style = document.createElement('style');
  style.textContent = css;
  
  // Append critical CSS during idle time
  window.requestIdleCallback(() => {
    document.head.appendChild(style);
  });
};
