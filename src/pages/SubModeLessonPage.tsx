import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Timer } from 'lucide-react';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import { getLesson } from '../lib/lessonStore';
import { getWarmUp } from '../lib/warmupStore';
import { LessonView } from '../components/lesson/LessonView';
import { PrintButton } from '../components/ui/PrintButton';
import { Button } from '../components/ui/Button';

export function SubModeLessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [warmUp, setWarmUp] = useState<WarmUp | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getLesson(id).then((found) => {
      if (!found) {
        setNotFound(true);
        return;
      }
      setLesson(found);
      if (found.warmUpId) getWarmUp(found.warmUpId).then(setWarmUp);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <Link to="/sub" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-700">
          <ArrowLeft size={16} /> Back to Sub Home
        </Link>
        {lesson && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate(`/library/${lesson.id}/timer`)}>
              <Timer size={16} /> Start Class Timer
            </Button>
            <PrintButton />
          </div>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {notFound && <p className="text-gray-500">Lesson not found.</p>}
        {!notFound && !lesson && <p className="text-gray-400">Loading…</p>}
        {lesson && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8">
            <LessonView lesson={lesson} warmUp={warmUp} />
          </div>
        )}
      </main>
    </div>
  );
}
