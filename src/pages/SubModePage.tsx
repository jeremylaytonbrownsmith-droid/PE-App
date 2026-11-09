import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shuffle, AlertTriangle, MapPin } from 'lucide-react';
import type { SubHandbook } from '../types/subHandbook';
import type { PacingGuide } from '../types/pacing';
import type { Lesson } from '../types/lesson';
import { ALL_GRADES, gradeLabel, type Grade } from '../types/common';
import { getSubHandbook } from '../lib/subHandbookStore';
import { listPacingGuides } from '../lib/pacingStore';
import { listLessons } from '../lib/lessonStore';
import { PrintButton } from '../components/ui/PrintButton';
import { InfoBox } from '../components/boxes/InfoBox';
import { LessonCard } from '../components/lesson/LessonCard';

function inRange(dateIso: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  return dateIso >= start && dateIso <= end;
}

export function SubModePage() {
  const navigate = useNavigate();
  const [handbook, setHandbook] = useState<SubHandbook | null>(null);
  const [guides, setGuides] = useState<PacingGuide[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade | null>(null);

  useEffect(() => {
    getSubHandbook().then(setHandbook);
    listPacingGuides().then(setGuides);
    listLessons().then(setLessons);
  }, []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return lessons
      .filter((l) => l.title.toLowerCase().includes(q) || l.unit.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q)))
      .slice(0, 12);
  }, [lessons, search]);

  const gradeResults = useMemo(() => {
    if (!gradeFilter) return [];
    return lessons.filter((l) => l.subFriendly && l.gradeLevels.includes(gradeFilter));
  }, [lessons, gradeFilter]);

  const coverageWeeks = useMemo(() => {
    if (!handbook) return [];
    const activeGuide = guides.find((g) => g.id === handbook.activeGuideId);
    if (!activeGuide) return [];
    return activeGuide.weeks
      .map((w) => ({ ...w, guideName: activeGuide.name }))
      .filter((w) => inRange(w.startDate, handbook.coverageStart, handbook.coverageEnd))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [guides, handbook]);

  function handleSurpriseMe() {
    const pool = lessons.filter((l) => l.subFriendly);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/sub/lesson/${pick.id}`);
  }

  if (!handbook) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;

  const hasContactInfo = handbook.importantContacts || handbook.emergencyProcedures;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img src="/icons/icon.svg" alt="" className="w-7 h-7 rounded-lg" />
          <div>
            <p className="font-bold text-gray-900 leading-tight">PE Planner</p>
            <p className="text-xs text-gray-500 leading-tight">Substitute Day</p>
          </div>
        </div>
        <PrintButton />
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <InfoBox color="red" title={
          <span className="flex items-center gap-1.5">
            <AlertTriangle size={16} /> In a real emergency, call 911 immediately
          </span>
        }>
          {hasContactInfo ? (
            <div className="space-y-1.5 mt-1">
              {handbook.importantContacts && <p>{handbook.importantContacts}</p>}
              {handbook.emergencyProcedures && <p>{handbook.emergencyProcedures}</p>}
            </div>
          ) : (
            <p className="mt-1">No other contact info has been added yet - if you need help, ask any teacher nearby or go to the front office.</p>
          )}
        </InfoBox>

        {handbook.welcomeMessage && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{handbook.welcomeMessage}</p>
          </div>
        )}

        {handbook.equipmentNotes && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 flex gap-2.5">
            <MapPin size={18} className="text-brand-600 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">{handbook.equipmentNotes}</p>
          </div>
        )}

        {guides.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900">Pacing Guide</h2>
            {handbook.activeGuideId && guides.find((g) => g.id === handbook.activeGuideId) ? (
              <Link
                to={`/sub/pacing/${handbook.activeGuideId}`}
                className="block rounded-xl border border-brand-200 bg-brand-50 p-4 hover:border-brand-400 transition"
              >
                <p className="text-sm font-medium text-gray-900">{guides.find((g) => g.id === handbook.activeGuideId)?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {guides.find((g) => g.id === handbook.activeGuideId)?.weeks.length} weeks - tap to see the full plan
                </p>
              </Link>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">No specific guide has been picked yet - here are all of them:</p>
                {guides.map((g) => (
                  <Link key={g.id} to={`/sub/pacing/${g.id}`} className="block rounded-xl border border-gray-200 bg-white p-3 hover:border-brand-300 transition">
                    <p className="text-sm font-medium text-gray-900">{g.name}</p>
                    <p className="text-xs text-gray-500">
                      {g.grade} · {g.schoolYear} · {g.weeks.length} weeks
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {coverageWeeks.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-semibold text-gray-900">Today's / This Week's Plan</h2>
            <div className="space-y-2">
              {coverageWeeks.map((week) => {
                const lesson = lessons.find((l) => l.id === week.lessonId);
                return (
                  <div key={`${week.guideName}-${week.weekNumber}`} className="rounded-xl border border-brand-200 bg-brand-50 p-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">{week.startDate}</p>
                      <p className="text-sm font-medium text-gray-900">{week.unit || lesson?.title || '—'}</p>
                    </div>
                    {lesson && (
                      <Link to={`/sub/lesson/${lesson.id}`} className="shrink-0 text-sm font-medium text-brand-700 hover:underline">
                        View →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">Find a Lesson</h2>
          <div className="relative no-print">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm bg-white"
              placeholder="Type a lesson name or activity (e.g. 'tag', 'basketball')..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setGradeFilter(null);
              }}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
              {searchResults.map((lesson) => (
                <Link key={lesson.id} to={`/sub/lesson/${lesson.id}`} className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-brand-50">
                  <span className="text-gray-800">
                    {lesson.title}
                    {lesson.subFriendly && <span className="ml-2 text-xs text-brand-700">(sub-friendly)</span>}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {search.trim() && searchResults.length === 0 && <p className="text-sm text-gray-500">No lessons match "{search}".</p>}

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Or browse sub-friendly lessons by grade</p>
            <div className="flex flex-wrap gap-2">
              {ALL_GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setGradeFilter(gradeFilter === g ? null : g);
                    setSearch('');
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    gradeFilter === g ? 'border-brand-400 bg-brand-100 text-brand-700' : 'border-gray-300 bg-white text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {gradeLabel(g)}
                </button>
              ))}
            </div>
          </div>

          {gradeFilter && (
            <div className="grid sm:grid-cols-2 gap-3">
              {gradeResults.length ? (
                gradeResults.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} linkTo={`/sub/lesson/${lesson.id}`} />)
              ) : (
                <p className="text-sm text-gray-500 sm:col-span-2">No sub-friendly lessons found for {gradeLabel(gradeFilter)}.</p>
              )}
            </div>
          )}

          <button
            onClick={handleSurpriseMe}
            className="no-print w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 hover:bg-brand-100 transition"
          >
            <Shuffle size={16} /> Surprise Me - Pick Any Sub-Friendly Lesson
          </button>
        </section>

        <p className="no-print text-center text-xs text-gray-400 pt-4">
          Are you the teacher?{' '}
          <Link to="/" className="text-brand-700 hover:underline">
            Open the full app
          </Link>
        </p>
      </main>
    </div>
  );
}
