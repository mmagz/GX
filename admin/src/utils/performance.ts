import { useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook to track component mount status
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return () => isMounted.current;
}

/**
 * Performance monitoring utility
 */
export const performanceMonitor = {
  mark: (name: string) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      } catch (e) {
        // Ignore errors
      }
    }
  },
};

/**
 * Utility to check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Utility to optimize image loading
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  // In a real app, this would use Cloudinary transformations
  // For now, just return the original URL
  return url;
}

import { useState } from 'react';
