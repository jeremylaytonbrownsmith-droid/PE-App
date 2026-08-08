import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import { getLesson, deleteLesson, duplicateLesson, saveLesson } from '../lib/lessonStore';
import { getWarmUp } from '../lib/warmupStore';
import { PageHeader } from '../components/layout/PageHeader';
import { LessonView } from '../components/lesson/LessonView';
import { Button } from '../components/ui/Button';
import { PrintButton } from '../components/ui/PrintButton';

export function LessonDetailPage() {
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

  if (notFound) {
    return <p className="text-gray-500">Lesson not found.</p>;
  }

  if (!lesson) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lesson"
        back
        actions={
          <>
            <PrintButton />
            <Button
              variant="secondary"
              onClick={async () => {
                const copy = duplicateLesson(lesson);
                await saveLesson(copy);
                navigate(`/library/${copy.id}/edit`);
              }}
            >
              <Copy size={16} /> Duplicate &amp; Edit
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/library/${lesson.id}/edit`)}>
              <Pencil size={16} /> Edit
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (confirm('Delete this lesson? This cannot be undone.')) {
                  await deleteLesson(lesson.id);
                  navigate('/library');
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </>
        }
      />
      <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8">
        <LessonView lesson={lesson} warmUp={warmUp} />
      </div>
    </div>
  );
}
