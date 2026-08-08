import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Save } from 'lucide-react';
import type { Lesson } from '../types/lesson';
import type { ScheduleSettings } from '../types/schedule';
import type { WarmUp } from '../types/warmup';
import { ALL_GRADES, gradeLabel, type Grade } from '../types/common';
import { listLessons, saveLesson, duplicateLesson } from '../lib/lessonStore';
import { getWarmUp } from '../lib/warmupStore';
import { getSchedule } from '../lib/scheduleStore';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { LessonView } from '../components/lesson/LessonView';
import { Button } from '../components/ui/Button';
import { PrintButton } from '../components/ui/PrintButton';

export function GeneratorPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [grade, setGrade] = useState<Grade | 'all'>('all');
  const [gymSpace, setGymSpace] = useState<'all' | 'full' | 'half'>('all');
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [warmUp, setWarmUp] = useState<WarmUp | undefined>(undefined);
  const [schedule, setSchedule] = useState<ScheduleSettings | null>(null);
  const [specialNote, setSpecialNote] = useState('');

  useEffect(() => {
    listLessons().then(setLessons);
    getSchedule().then(setSchedule);
  }, []);

  const matches = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesGrade = grade === 'all' || lesson.gradeLevels.includes(grade);
      const matchesGym = gymSpace === 'all' || lesson.gymSpace === gymSpace;
      return matchesGrade && matchesGym;
    });
  }, [lessons, grade, gymSpace]);

  function pick(lesson: Lesson) {
    setSelected(lesson);
    setSpecialNote(lesson.specialCircumstances ?? '');
    setWarmUp(undefined);
    if (lesson.warmUpId) getWarmUp(lesson.warmUpId).then(setWarmUp);
  }

  const generated: Lesson | null = selected ? { ...selected, specialCircumstances: specialNote || undefined } : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Sub Lesson Generator" subtitle="Pick a grade and gym space, then generate a ready-to-print sub lesson." />

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 no-print">
        <div className="flex flex-wrap gap-3">
          <label className="text-sm space-y-1">
            <span className="block font-medium text-gray-700">Grade</span>
            <select
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grade | 'all')}
            >
              <option value="all">Any grade</option>
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {gradeLabel(g)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm space-y-1">
            <span className="block font-medium text-gray-700">Gym Space</span>
            <select
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              value={gymSpace}
              onChange={(e) => setGymSpace(e.target.value as 'all' | 'full' | 'half')}
            >
              <option value="all">Any</option>
              <option value="full">Full gym</option>
              <option value="half">Half gym</option>
            </select>
          </label>
        </div>
      </div>

      {!selected ? (
        matches.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
            {matches.map((lesson) => (
              <button key={lesson.id} onClick={() => pick(lesson)} className="text-left">
                <LessonCardStatic lesson={lesson} />
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="No lessons match" description="Try a different grade or gym space, or add a lesson to your library." />
        )
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 no-print">
            <Button variant="secondary" onClick={() => setSelected(null)}>
              <Wand2 size={16} /> Choose a different lesson
            </Button>
            <PrintButton />
            <Button
              variant="secondary"
              onClick={async () => {
                if (!generated) return;
                const copy = duplicateLesson(generated);
                await saveLesson(copy);
                navigate(`/library/${copy.id}`);
              }}
            >
              <Save size={16} /> Save this version to Library
            </Button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 no-print">
            <label className="text-sm font-medium text-gray-700 block">Special circumstances note (optional)</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. The schedule is like this because of integrated testing."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8">
            {generated && <LessonView lesson={generated} warmUp={warmUp} schedule={schedule ?? undefined} />}
          </div>
        </div>
      )}
    </div>
  );
}

function LessonCardStatic({ lesson }: { lesson: Lesson }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-md transition h-full">
      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
      <p className="text-sm text-brand-700 font-medium mt-0.5">{lesson.unit}</p>
      <p className="text-xs text-gray-500 mt-2">{lesson.gradeLevels.map(gradeLabel).join(', ') || 'All grades'}</p>
    </div>
  );
}
