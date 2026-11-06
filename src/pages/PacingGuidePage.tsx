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

  const completedWeeks = guide.weeks.filter((w) => w.completed).length;

  function LessonSelect({ week, className }: { week: PacingWeek; className: string }) {
    return (
      <select
        className={className}
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
    );
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

      <div className="no-print flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <ProgressRing value={completedWeeks} max={guide.weeks.length} size={56} strokeWidth={6} />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {completedWeeks} of {guide.weeks.length} weeks taught
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {guide.weeks.length - completedWeeks === 0 ? 'All caught up!' : `${guide.weeks.length - completedWeeks} weeks to go`}
          </p>
        </div>
      </div>

      <div className="no-print space-y-1.5">
        <p className="text-xs text-gray-400">Tap a week to mark it taught - scroll for the whole year.</p>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 md:-mx-8 md:px-8">
          {guide.weeks.map((week) => (
            <button
              key={week.weekNumber}
              onClick={() => updateWeek(week.weekNumber, { completed: !week.completed })}
              className={`shrink-0 snap-start w-32 rounded-xl border p-2.5 text-left shadow-sm transition hover:shadow ${
                week.completed ? 'border-brand-400 bg-brand-50' : 'border-gray-200 bg-white'
              }`}
            >
              <p className="text-xs font-semibold text-gray-500">
                Wk {week.weekNumber} · {formatWeekDate(week.startDate)}
              </p>
              <p className="text-sm font-medium text-gray-900 truncate mt-0.5">{week.unit || '—'}</p>
              <p className={`text-xs mt-1 ${week.completed ? 'text-brand-700 font-medium' : 'text-gray-400'}`}>
                {week.completed ? '✓ Taught' : 'Not yet'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop/tablet: full table. Below sm, a table this wide forces horizontal scrolling
          through tiny truncated columns, so phones get a stacked card layout instead. Printing
          always uses the table, regardless of the device it was printed from. */}
      <div className="hidden sm:block print:!block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
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
                  <LessonSelect week={week} className="w-full border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1" />
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

      {/* Phone-width layout: one stacked card per week, no horizontal scrolling needed. */}
      <div className="sm:hidden print:!hidden space-y-3">
        {guide.weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`rounded-2xl border p-4 space-y-3 shadow-sm ${
              week.completed ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-500">Week {week.weekNumber}</p>
                <p className="text-sm text-gray-700">{formatWeekDate(week.startDate)}</p>
              </div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 shrink-0">
                <input
                  type="checkbox"
                  checked={Boolean(week.completed)}
                  onChange={(e) => updateWeek(week.weekNumber, { completed: e.target.checked })}
                  aria-label={`Mark week ${week.weekNumber} taught`}
                  className="h-4 w-4"
                />
                Taught
              </label>
            </div>
            <label className="block text-xs font-medium text-gray-500">
              Unit
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-2.5 py-2 text-sm bg-white"
                value={week.unit ?? ''}
                onChange={(e) => updateWeek(week.weekNumber, { unit: e.target.value })}
                placeholder="e.g. Soccer"
              />
            </label>
            <label className="block text-xs font-medium text-gray-500">
              Linked Lesson
              <LessonSelect week={week} className="mt-1 w-full rounded-lg border border-gray-300 px-2.5 py-2 text-sm bg-white" />
            </label>
            <label className="block text-xs font-medium text-gray-500">
              Notes
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 px-2.5 py-2 text-sm bg-white"
                value={week.notes ?? ''}
                onChange={(e) => updateWeek(week.weekNumber, { notes: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>

      <Button variant="ghost" onClick={() => navigate('/pacing')}>
        Back to all pacing guides
      </Button>
    </div>
  );
}
