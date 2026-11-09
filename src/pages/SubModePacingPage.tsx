import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import type { PacingGuide, PacingWeek } from '../types/pacing';
import type { Lesson } from '../types/lesson';
import { getPacingGuide, savePacingGuide } from '../lib/pacingStore';
import { listLessons } from '../lib/lessonStore';
import { PrintButton } from '../components/ui/PrintButton';

function formatWeekDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function SubModePacingPage() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<PacingGuide | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPacingGuide(id).then((found) => {
      if (!found) {
        setNotFound(true);
        return;
      }
      setGuide(found);
    });
    listLessons().then(setLessons);
  }, [id]);

  async function toggleTaught(week: PacingWeek) {
    if (!guide) return;
    const next = { ...guide, weeks: guide.weeks.map((w) => (w.weekNumber === week.weekNumber ? { ...w, completed: !w.completed } : w)) };
    setGuide(next);
    await savePacingGuide(next);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <Link to="/sub" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-700">
          <ArrowLeft size={16} /> Back to Sub Home
        </Link>
        <PrintButton />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {notFound && <p className="text-gray-500">Pacing guide not found.</p>}
        {!notFound && !guide && <p className="text-gray-400">Loading…</p>}
        {guide && (
          <>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{guide.name}</h1>
              <p className="text-sm text-gray-500">
                {guide.grade} · {guide.schoolYear}
              </p>
            </div>
            <p className="text-xs text-gray-400">Check off a week once it's been taught - it'll be marked done when the teacher's back too.</p>
            <div className="space-y-2">
              {guide.weeks.map((week) => {
                const lesson = lessons.find((l) => l.id === week.lessonId);
                return (
                  <div
                    key={week.weekNumber}
                    className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
                      week.completed ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Wk {week.weekNumber} · {formatWeekDate(week.startDate)}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate">{week.unit || '—'}</p>
                      {lesson && (
                        <Link to={`/sub/lesson/${lesson.id}`} className="text-xs text-brand-700 hover:underline">
                          View lesson →
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={() => toggleTaught(week)}
                      className={`no-print shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        week.completed ? 'border-brand-400 bg-brand-100 text-brand-700' : 'border-gray-300 bg-white text-gray-600'
                      }`}
                    >
                      {week.completed && <Check size={14} />}
                      {week.completed ? 'Taught' : 'Mark taught'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
