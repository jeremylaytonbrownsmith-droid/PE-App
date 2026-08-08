import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../lib/useReducedMotion';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({ value, max, size = 56, strokeWidth = 6, color = '#16a34a' }: ProgressRingProps) {
  const reducedMotion = useReducedMotion();
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (reducedMotion) {
      setOffset(circumference * (1 - pct));
      return;
    }
    const raf = requestAnimationFrame(() => setOffset(circumference * (1 - pct)));
    return () => cancelAnimationFrame(raf);
  }, [pct, circumference, reducedMotion]);

  const percentLabel = Math.round(pct * 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: reducedMotion ? 'none' : 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
        {percentLabel}%
      </div>
    </div>
  );
}
