import { Languages } from 'lucide-react';
import type { GlobalConnectionNote, SpanishVocabWord } from '../../types/lesson';
import { PanelCard } from '../boxes/PanelCard';

function VocabTable({ words }: { words: SpanishVocabWord[] }) {
  if (words.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="text-sm border-collapse">
        <thead>
          <tr className="bg-brand-100 text-left">
            <th className="border border-brand-200 px-2 py-1">Español</th>
            <th className="border border-brand-200 px-2 py-1">English</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => (
            <tr key={w.spanish}>
              <td className="border border-brand-200 px-2 py-1 font-medium italic">
                {w.spanish}
                {w.alternate && <span className="text-gray-400 font-normal not-italic"> ({w.alternate})</span>}
              </td>
              <td className="border border-brand-200 px-2 py-1">{w.english}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GlobalConnectionPanel({ note }: { note?: GlobalConnectionNote }) {
  if (!note) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">Conexión en Español / Global Connection</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="Vocabulary for this lesson">
          <VocabTable words={note.vocabulary} />
        </PanelCard>
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="Routine phrases">
          <VocabTable words={note.routinePhrases} />
        </PanelCard>
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="Coaching cues">
          <VocabTable words={note.coachingCues} />
        </PanelCard>
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="Global connection">
          {note.globalConnection}
        </PanelCard>
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="How students produce Spanish">
          {note.studentLanguageUse}
        </PanelCard>
        <PanelCard icon={<Languages size={15} className="text-brand-700" />} title="Grade-level scaling">
          {note.gradeScaling}
        </PanelCard>
      </div>
    </section>
  );
}
