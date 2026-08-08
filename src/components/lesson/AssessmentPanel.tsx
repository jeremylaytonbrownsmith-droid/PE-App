import type { Lesson } from '../../types/lesson';
import { InfoBox } from '../boxes/InfoBox';

export function AssessmentPanel({ lesson }: { lesson: Lesson }) {
  const hasCues = lesson.techniqueCues.length > 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold border-b pb-1">Quick Assessment Ideas</h2>

      {hasCues && (
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-gray-800">Skill Observation Checklist</p>
          <p className="text-xs text-gray-500">
            Watch for these while students practice - good for a quick scan of the group, or copy it to track
            individual students.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-100 text-left">
                  <th className="border border-brand-200 px-2 py-1">Look For</th>
                  <th className="border border-brand-200 px-2 py-1 w-24">Not Yet</th>
                  <th className="border border-brand-200 px-2 py-1 w-28">Getting There</th>
                  <th className="border border-brand-200 px-2 py-1 w-20">Got It!</th>
                </tr>
              </thead>
              <tbody>
                {lesson.techniqueCues.map((cue, i) => (
                  <tr key={i}>
                    <td className="border border-brand-200 px-2 py-1">{cue}</td>
                    <td className="border border-brand-200 px-2 py-1"></td>
                    <td className="border border-brand-200 px-2 py-1"></td>
                    <td className="border border-brand-200 px-2 py-1"></td>
                  </tr>
                ))}
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
