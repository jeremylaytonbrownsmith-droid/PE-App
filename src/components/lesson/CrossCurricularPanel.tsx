import { Calculator, Atom, Globe, BookOpen } from 'lucide-react';
import type { CrossCurricularLink } from '../../types/lesson';
import type { AcademicSubject } from '../../types/common';
import { ACADEMIC_SUBJECT_LABEL } from '../../types/common';
import { InfoBox } from '../boxes/InfoBox';

const SUBJECT_ICON: Record<AcademicSubject, typeof Calculator> = {
  math: Calculator,
  science: Atom,
  'social-studies': Globe,
  english: BookOpen,
};

export function CrossCurricularPanel({ links }: { links?: CrossCurricularLink[] }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">Cross-Curricular Connections</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {links.map((link, i) => {
          const Icon = SUBJECT_ICON[link.subject];
          return (
            <InfoBox key={i} color="purple" title={
              <span className="flex items-center gap-1.5">
                <Icon size={14} /> {ACADEMIC_SUBJECT_LABEL[link.subject]}
              </span>
            }>
              {link.connection}
            </InfoBox>
          );
        })}
      </div>
    </section>
  );
}
