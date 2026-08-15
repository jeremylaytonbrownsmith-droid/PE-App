import { Link } from 'react-router-dom';
import { Accessibility, Eye, Ear, Brain, ArrowRight } from 'lucide-react';
import type { Accommodation } from '../../types/lesson';
import type { AccommodationCategory } from '../../types/common';
import { ACCOMMODATION_CATEGORIES, ACCOMMODATION_LABEL } from '../../types/common';
import { PanelCard } from '../boxes/PanelCard';

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
            <PanelCard key={category} icon={<Icon size={15} className="text-brand-700" />} title={ACCOMMODATION_LABEL[category]}>
              {note}
            </PanelCard>
          );
        })}
      </div>
      <Link to="/adaptive-pe" className="no-print inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        See the full Adaptive PE Toolkit <ArrowRight size={14} />
      </Link>
    </section>
  );
}
