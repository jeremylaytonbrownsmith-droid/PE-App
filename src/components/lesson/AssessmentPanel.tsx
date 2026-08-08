import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { Lesson } from '../../types/lesson';
import type { AssessmentLevel, AssessmentTally } from '../../types/assessment';
import { getTally, incrementTally, resetTally } from '../../lib/assessmentTallyStore';
import { InfoBox } from '../boxes/InfoBox';

const LEVELS: { key: AssessmentLevel; label: string }[] = [
  { key: 'notYet', label: 'Not Yet' },
  { key: 'developing', label: 'Getting There' },
  { key: 'gotIt', label: 'Got It!' },
];

export function AssessmentPanel({ lesson }: { lesson: Lesson }) {
  const hasCues = lesson.techniqueCues.length > 0;
  const [tally, setTally] = useState<AssessmentTally | null>(null);

  useEffect(() => {
    if (!hasCues) return;
    getTally(lesson.id).then(setTally);
  }, [lesson.id, hasCues]);

  async function handleTap(cueIndex: number, level: AssessmentLevel) {
    const next = await incrementTally(lesson.id, cueIndex, level);
    setTally(next);
  }

  async function handleReset() {
    if (!confirm('Reset today’s tally counts for this lesson?')) return;
    setTally(await resetTally(lesson.id));
  }

  const hasAnyCounts = tally ? Object.values(tally.counts).some((c) => c.notYet || c.developing || c.gotIt) : false;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold border-b pb-1">Quick Assessment Ideas</h2>

      {hasCues && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Skill Observation Checklist</p>
            {hasAnyCounts && (
              <button
                onClick={handleReset}
                className="no-print flex items-center gap-1 text-xs text-gray-400 hover:text-red-600"
              >
                <RotateCcw size={12} /> Reset counts
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Tap a column while students practice to tally what you see - good for a quick scan of the whole group.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-100 text-left">
                  <th className="border border-brand-200 px-2 py-1">Look For</th>
                  {LEVELS.map((level) => (
                    <th key={level.key} className="border border-brand-200 px-2 py-1 w-24 text-center">
                      {level.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lesson.techniqueCues.map((cue, i) => {
                  const counts = tally?.counts[i] ?? { notYet: 0, developing: 0, gotIt: 0 };
                  return (
                    <tr key={i}>
                      <td className="border border-brand-200 px-2 py-1">{cue}</td>
                      {LEVELS.map((level) => (
                        <td key={level.key} className="border border-brand-200 p-0 text-center">
                          <button
                            onClick={() => handleTap(i, level.key)}
                            className="no-print w-full h-full px-2 py-1 hover:bg-brand-50 font-semibold text-gray-700"
                            aria-label={`Tally ${level.label} for ${cue}`}
                          >
                            {counts[level.key] || ''}
                          </button>
                          <span className="hidden print:inline">{counts[level.key] || ''}</span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <InfoBox color="blue" title="Student Self-Check (K-2)">
          Show me: 👍 if you felt like a pro today, 👉 if you're getting there, or 👎 if you want more practice at{' '}
          {lesson.unit}.
        </InfoBox>
        <InfoBox color="blue" title="Student Reflection (3-5)">
          Quick write or turn-and-talk: "One thing I did well today in {lesson.unit} was ___. One thing I want to
          practice more is ___."
        </InfoBox>
      </div>
    </section>
  );
}
