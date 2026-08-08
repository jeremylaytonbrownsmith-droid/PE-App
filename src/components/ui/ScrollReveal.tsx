import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../../lib/useReducedMotion';

interface ScrollRevealProps {
  children: ReactNode;
  /** Position in a list - staggers the reveal by ~60ms per index (capped). */
  index?: number;
  className?: string;
}

const STAGGER_MS = 60;
const MAX_STAGGER_STEPS = 8;

export function ScrollReveal({ children, index = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const delayMs = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: reducedMotion ? 'none' : `opacity 0.4s ease-out ${delayMs}ms, transform 0.4s ease-out ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
