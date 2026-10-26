import { useEffect, useRef, useState } from 'react';

/**
 * Custom React hook for high-performance scroll reveal using IntersectionObserver.
 * - Triggers reveal when element enters viewport.
 * - Auto-reveal fail-safe ensures elements are never stuck hidden on any browser.
 * - Automatically unobserves after triggering (zero listener churn).
 * - Disconnects on unmount (zero memory leaks).
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsVisible(true);
      return;
    }

    // Safety fallback: auto-reveal after 350ms so animations never get stuck
    const fallbackTimer = setTimeout(() => {
      setIsVisible(true);
    }, options.fallbackMs ?? 350);

    // Fallback if IntersectionObserver is unsupported in older environments
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      clearTimeout(fallbackTimer);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
        clearTimeout(fallbackTimer);
      }
    }, {
      threshold: options.threshold ?? 0.05,
      rootMargin: options.rootMargin ?? '80px 0px 80px 0px',
    });

    observer.observe(element);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, options.fallbackMs]);

  return [ref, isVisible];
}
