import { Languages } from 'lucide-react';
import type { GlobalConnectionNote } from '../../types/lesson';
import { PanelCard } from '../boxes/PanelCard';

export function GlobalConnectionPanel({ note }: { note?: GlobalConnectionNote }) {
  if (!note) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">Global Connection &amp; Spanish Immersion</h2>
      <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="How this lesson builds it">
        <div className="space-y-3">
          <p>{note.connection}</p>

          {note.competencies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.competencies.map((c) => (
                <span key={c} className="rounded-full bg-brand-100 text-brand-700 text-xs font-medium px-2 py-0.5">
                  {c}
                </span>
              ))}
            </div>
          )}

          {note.vocabulary.length > 0 && (
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-100 text-left">
                    <th className="border border-brand-200 px-2 py-1">Español</th>
                    <th className="border border-brand-200 px-2 py-1">English</th>
                  </tr>
                </thead>
                <tbody>
                  {note.vocabulary.map((w) => (
                    <tr key={w.spanish}>
                      <td className="border border-brand-200 px-2 py-1 font-medium italic">{w.spanish}</td>
                      <td className="border border-brand-200 px-2 py-1">{w.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PanelCard>
    </section>
  );
}
