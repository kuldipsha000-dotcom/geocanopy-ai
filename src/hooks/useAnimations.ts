import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — attaches IntersectionObserver to any ref.
 * Adds the `visible` class when element enters viewport.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          el.classList.add('visible');
          observer.disconnect(); // fire once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/**
 * useCountUp — animates a number from 0 → target when `active` becomes true.
 */
export function useCountUp(
  target: number,
  duration = 1800,
  active = false
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return value;
}

/**
 * useBatchReveal — returns a ref + array of booleans for staggered children.
 * childCount = number of children to stagger.
 */
export function useBatchReveal<T extends HTMLElement>(
  childCount: number,
  staggerMs = 120,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < childCount; i++) {
            setTimeout(() => setVisibleIndex(i), i * staggerMs);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [childCount, staggerMs]);

  return { ref, visibleIndex };
}
