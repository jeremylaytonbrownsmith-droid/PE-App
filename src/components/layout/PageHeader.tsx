import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useReducedMotion } from '../../lib/useReducedMotion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: ReactNode;
}

const SHRINK_SCROLL_THRESHOLD = 24;

export function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > SHRINK_SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transitionClass = reducedMotion ? '' : 'transition-all duration-200';

  return (
    <div
      className={`no-print sticky top-0 z-10 -mx-4 px-4 md:-mx-8 md:px-8 bg-[#f8faf9]/95 backdrop-blur-sm flex items-start justify-between gap-4 flex-wrap ${transitionClass} ${
        compact ? 'py-2 mb-3' : 'py-4 mb-6'
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          {back && (
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800" aria-label="Back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className={`font-bold text-gray-900 ${transitionClass} ${compact ? 'text-base' : 'text-xl'}`}>{title}</h1>
        </div>
        {subtitle && (
          <p
            className={`text-sm text-gray-500 mt-1 overflow-hidden ${transitionClass} ${
              compact ? 'max-h-0 opacity-0 mt-0' : 'max-h-10 opacity-100'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">{actions}</div>}
    </div>
  );
}
