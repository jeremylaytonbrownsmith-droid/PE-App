import type { ReactNode } from 'react';

interface PanelCardProps {
  icon?: ReactNode;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Shared "block" style for the cards inside the Beyond the Lesson Plan panels
 * (NC Standards, Adaptations, Cross-Curricular, Assessment) so they read as one
 * consistent design system instead of four different box styles.
 */
export function PanelCard({ icon, title, children, className = '' }: PanelCardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-3 ${className}`}>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1">
        {icon}
        {title}
      </p>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}
