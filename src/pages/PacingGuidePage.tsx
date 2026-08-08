import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { PacingGuide, PacingWeek } from '../types/pacing';
import type { Lesson } from '../types/lesson';
import { getPacingGuide, savePacingGuide } from '../lib/pacingStore';
import { listLessons } from '../lib/lessonStore';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { PrintButton } from '../components/ui/PrintButton';
import { ProgressRing } from '../components/ui/ProgressRing';

function formatWeekDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PacingGuidePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<PacingGuide | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPacingGuide(id).then((found) => setGuide(found ?? null));
    listLessons().then(setLessons);
  }, [id]);

  if (!guide) return <p className="text-gray-400">Loading...</p>;

  function updateWeek(weekNumber: number, patch: Partial<PacingWeek>) {
    setGuide((prev) =>
      prev
        ? { ...prev, weeks: prev.weeks.map((w) => (w.weekNumber === weekNumber ? { ...w, ...patch } : w)) }
        : prev,
    );
  }

  async function handleSave() {
    if (!guide) return;
    setSaving(true);
    await savePacingGuide(guide);
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={guide.name}
        subtitle={`${guide.grade} · ${guide.schoolYear}`}
        back
        actions={
          <>
            <PrintButton />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      />

      <div className="no-print flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <ProgressRing value={guide.weeks.filter((w) => w.completed).length} max={guide.weeks.length} size={48} strokeWidth={5} />
        <p className="text-sm text-gray-600">
          {guide.weeks.filter((w) => w.completed).length} of {guide.weeks.length} weeks marked taught
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-brand-100 text-left">
              <th className="border border-brand-200 px-2 py-2 w-12">Wk</th>
              <th className="border border-brand-200 px-2 py-2 w-28">Week Of</th>
              <th className="border border-brand-200 px-2 py-2">Unit</th>
              <th className="border border-brand-200 px-2 py-2 no-print">Linked Lesson</th>
              <th className="border border-brand-200 px-2 py-2">Notes</th>
              <th className="border border-brand-200 px-2 py-2 no-print w-16 text-center">Taught</th>
            </tr>
          </thead>
          <tbody>
            {guide.weeks.map((week) => (
              <tr key={week.weekNumber} className={week.completed ? 'bg-brand-50' : undefined}>
                <td className="border border-brand-200 px-2 py-1 text-center text-gray-500">{week.weekNumber}</td>
                <td className="border border-brand-200 px-2 py-1 whitespace-nowrap text-gray-600">{formatWeekDate(week.startDate)}</td>
                <td className="border border-brand-200 px-2 py-1">
                  <input
                    className="w-full min-w-[8rem] border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={week.unit ?? ''}
                    onChange={(e) => updateWeek(week.weekNumber, { unit: e.target.value })}
                    placeholder="e.g. Soccer"
                  />
                </td>
                <td className="border border-brand-200 px-2 py-1 no-print">
                  <select
                    className="w-full border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={week.lessonId ?? ''}
                    onChange={(e) => updateWeek(week.weekNumber, { lessonId: e.target.value || undefined })}
                  >
                    <option value="">—</option>
                    {lessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-brand-200 px-2 py-1">
                  <input
                    className="w-full min-w-[8rem] border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={week.notes ?? ''}
                    onChange={(e) => updateWeek(week.weekNumber, { notes: e.target.value })}
                  />
                </td>
                <td className="border border-brand-200 px-2 py-1 no-print text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(week.completed)}
                    onChange={(e) => updateWeek(week.weekNumber, { completed: e.target.checked })}
                    aria-label={`Mark week ${week.weekNumber} taught`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="ghost" onClick={() => navigate('/pacing')}>
        Back to all pacing guides
      </Button>
    </div>
  );
}
