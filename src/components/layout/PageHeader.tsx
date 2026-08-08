import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="no-print flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <div className="flex items-center gap-2">
          {back && (
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800" aria-label="Back">
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
