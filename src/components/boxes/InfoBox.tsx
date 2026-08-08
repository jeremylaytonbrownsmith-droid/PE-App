import type { ReactNode } from 'react';
import type { BoxColor } from '../../types/common';

const COLOR_STYLES: Record<BoxColor, { border: string; bg: string; text: string }> = {
  green: { border: '#4CAF50', bg: '#F0FAF1', text: '#1B5E20' },
  yellow: { border: '#FFD700', bg: '#FFFBEA', text: '#7A5D00' },
  orange: { border: '#FF9800', bg: '#FFF4E5', text: '#8A4B00' },
  blue: { border: '#2196F3', bg: '#EAF5FE', text: '#0D3C61' },
  purple: { border: '#7B1FA2', bg: '#F6ECFA', text: '#4A1263' },
  red: { border: '#F44336', bg: '#FDECEA', text: '#7A1712' },
};

interface InfoBoxProps {
  color: BoxColor;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function InfoBox({ color, title, children, className = '' }: InfoBoxProps) {
  const style = COLOR_STYLES[color];
  return (
    <div
      className={`rounded-lg border-2 px-4 py-3 ${className}`}
      style={{ borderColor: style.border, backgroundColor: style.bg, color: style.text }}
    >
      {title && <p className="font-semibold mb-1">{title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
