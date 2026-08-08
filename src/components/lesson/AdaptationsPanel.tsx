import { Link } from 'react-router-dom';
import { Accessibility, Eye, Ear, Brain, ArrowRight } from 'lucide-react';
import type { Accommodation } from '../../types/lesson';
import type { AccommodationCategory } from '../../types/common';
import { ACCOMMODATION_CATEGORIES, ACCOMMODATION_LABEL } from '../../types/common';

const CATEGORY_ICON: Record<AccommodationCategory, typeof Accessibility> = {
  mobility: Accessibility,
  visual: Eye,
  sensory: Ear,
  cognitive: Brain,
};

export function AdaptationsPanel({ accommodations }: { accommodations?: Accommodation[] }) {
  if (!accommodations || accommodations.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">Adaptations for Students with Disabilities</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {ACCOMMODATION_CATEGORIES.map((category) => {
          const note = accommodations.find((a) => a.category === category)?.note;
          if (!note) return null;
          const Icon = CATEGORY_ICON[category];
          return (
            <div key={category} className="rounded-lg border border-gray-200 p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-1">
                <Icon size={15} className="text-brand-700" />
                {ACCOMMODATION_LABEL[category]}
              </p>
              <p className="text-sm text-gray-600">{note}</p>
            </div>
          );
        })}
      </div>
      <Link to="/adaptive-pe" className="no-print inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        See the full Adaptive PE Toolkit <ArrowRight size={14} />
      </Link>
    </section>
  );
}
