/**
 * Performance optimization utilities for reducing JavaScript execution time
 * This addresses the "Reduce JavaScript execution time" and "Minimize main-thread work" issues
 */

// Detect long tasks and break them up
export const monitorLongTasks = () => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return null;
  
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 50) {
          console.debug(`Long task detected: ${Math.round(entry.duration)}ms`, entry);
          // Could send to analytics or performance monitoring service
        }
      });
    });
    
    longTaskObserver.observe({ entryTypes: ['longtask'] });
    return longTaskObserver; // Return for cleanup
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.debug('LongTask observer not supported in this browser');
    return null;
  }
};

// Advanced event throttling beyond requestAnimationFrame
// This is more aggressive than standard throttling to reduce main thread work
export const createSuperThrottledCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  minTimeBetweenCalls = 150,
) => {
  let lastCallTime = 0;
  let requestId: number | null = null;
  let latestArgs: Parameters<T> | null = null;
  
  const throttledFn = (...args: Parameters<T>) => {
    latestArgs = args;
    
    const now = performance.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall >= minTimeBetweenCalls) {
      if (requestId !== null) {
        cancelAnimationFrame(requestId);
        requestId = null;
      }
      
      // Execute on next animation frame for better visual updates
      requestId = requestAnimationFrame(() => {
        lastCallTime = performance.now();
        callback(...(latestArgs as Parameters<T>));
        requestId = null;
        latestArgs = null;
      });
    }
  };
  
  return throttledFn;
};

// Passive event listener helper - ensures all event listeners are passive where appropriate
export const addPassiveEventListener = (
  element: HTMLElement | Window | Document,
  eventName: string, 
  handler: EventListenerOrEventListenerObject, 
  options: AddEventListenerOptions = {}
) => {
  if (typeof window === 'undefined') return;

  try {
    // Create options with passive flag where appropriate
    const eventOptions = { 
      ...options,
      passive: ['scroll', 'touchstart', 'touchmove', 'wheel'].includes(eventName)
        ? true
        : options.passive
    };
    
    element.addEventListener(eventName, handler, eventOptions);
    
    // Return a cleanup function
    return () => element.removeEventListener(eventName, handler);
  } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
    // Fallback for older browsers - extract just the capture property for boolean parameter
    const useCapture = options.capture ?? false;
    element.addEventListener(eventName, handler, useCapture);
    return () => element.removeEventListener(eventName, handler, useCapture);
  }
};

// Implement idle queue for non-critical operations
interface IdleTask {
  id: number;
  task: () => void;
  priority: number;
}

class IdleTaskQueue {
  private tasks: IdleTask[] = [];
  private nextId = 0;
  private isProcessing = false;
  
  constructor(private timeout = 2000) {}
  
  // Add a task to the queue
  add(task: () => void, priority = 0): number {
    const id = this.nextId++;
    this.tasks.push({ id, task, priority });
    
    // Sort by priority (higher value = higher priority)
    this.tasks.sort((a, b) => b.priority - a.priority);
    
    // Start processing if it's not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return id;
  }
  
  // Remove a task from the queue
  remove(id: number): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks.length !== initialLength;
  }
  
  // Process the queue using requestIdleCallback
  private processQueue() {
    if (typeof window === 'undefined') return;
    
    if (this.tasks.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    const scheduleNext = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(this.processTask.bind(this), { timeout: this.timeout });
      } else {
        // Fall back to setTimeout with a small delay
        setTimeout(this.processTask.bind(this), 1);
      }
    };
    
    scheduleNext();
  }
  
  // Process a single task during idle time
  private processTask(deadline: IdleDeadline | void) {
    // If no tasks, stop processing
    if (this.tasks.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    // Check if we have enough idle time
    const hasTimeRemaining = deadline 
      ? deadline.timeRemaining() > 0 || deadline.didTimeout
      : true;
    
    if (hasTimeRemaining) {
      const task = this.tasks.shift();
      if (task) {
        try {
          task.task();
        } catch (e) {
          console.error('Error in idle task:', e);
        }
      }
    }
    
    // If we have more tasks, continue processing
    if (this.tasks.length > 0) {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(this.processTask.bind(this), { timeout: this.timeout });
      } else {
        // Fall back to setTimeout with a small delay
        setTimeout(this.processTask.bind(this), 1);
      }
    } else {
      this.isProcessing = false;
    }
  }
}

// Create a global instance for use throughout the app - with safer checks
let queueInstance: IdleTaskQueue | null = null;

// Safe initialization in client environments only
if (typeof window !== 'undefined') {
  try {
    queueInstance = new IdleTaskQueue(5000);
  } catch (e) {
    console.debug('Failed to initialize IdleTaskQueue', e);
  }
}

// Export a safe wrapper that prevents undefined calls
export const idleQueue = {
  add: (task: () => void, priority = 0): number => {
    return queueInstance?.add(task, priority) ?? -1;
  },
  remove: (id: number): boolean => {
    return queueInstance?.remove(id) ?? false;
  }
};
