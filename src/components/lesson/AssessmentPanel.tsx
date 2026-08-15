import { useEffect, useState } from 'react';
import { RotateCcw, ClipboardList, ListChecks, ThumbsUp, PenLine } from 'lucide-react';
import type { Lesson } from '../../types/lesson';
import type { AssessmentLevel, AssessmentTally } from '../../types/assessment';
import { getTally, incrementTally, resetTally } from '../../lib/assessmentTallyStore';
import { PanelCard } from '../boxes/PanelCard';

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

      {lesson.customRubric && (
        <PanelCard icon={<ClipboardList size={15} className="text-brand-700" />} title={lesson.customRubric.title}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border-collapse mt-1">
              <thead>
                <tr className="bg-brand-100 text-left">
                  <th className="border border-brand-200 px-2 py-1 w-12 text-center">Score</th>
                  <th className="border border-brand-200 px-2 py-1 w-32">Level</th>
                  <th className="border border-brand-200 px-2 py-1">Description</th>
                </tr>
              </thead>
              <tbody>
                {lesson.customRubric.levels.map((level) => (
                  <tr key={level.score}>
                    <td className="border border-brand-200 px-2 py-1 text-center font-semibold">{level.score}</td>
                    <td className="border border-brand-200 px-2 py-1 font-semibold">{level.label}</td>
                    <td className="border border-brand-200 px-2 py-1">{level.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      )}

      {hasCues && (
        <PanelCard
          icon={<ListChecks size={15} className="text-brand-700" />}
          title={
            <span className="flex-1 flex items-center justify-between">
              Skill Observation Checklist
              {hasAnyCounts && (
                <button
                  onClick={handleReset}
                  className="no-print flex items-center gap-1 text-xs font-normal text-gray-400 hover:text-red-600"
                >
                  <RotateCcw size={12} /> Reset counts
                </button>
              )}
            </span>
          }
        >
          <p className="text-xs text-gray-500 mb-1.5">
            Tap a column while students practice to tally what you see - good for a quick scan of the whole group.
          </p>
          <div className="overflow-x-auto -mx-1">
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
        </PanelCard>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <PanelCard icon={<ThumbsUp size={15} className="text-brand-700" />} title="Student Self-Check (K-2)">
          Show me: 👍 if you felt like a pro today, 👉 if you're getting there, or 👎 if you want more practice at{' '}
          {lesson.unit}.
        </PanelCard>
        <PanelCard icon={<PenLine size={15} className="text-brand-700" />} title="Student Reflection (3-5)">
          Quick write or turn-and-talk: "One thing I did well today in {lesson.unit} was ___. One thing I want to
          practice more is ___."
        </PanelCard>
      </div>
    </section>
  );
}
