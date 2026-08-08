import { Link } from 'react-router-dom';
import type { Lesson } from '../../types/lesson';
import { gradeLabel } from '../../types/common';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      to={`/library/${lesson.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-brand-300 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
        {lesson.gymSpace === 'half' && (
          <span className="shrink-0 rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5">Half Gym</span>
        )}
      </div>
      <p className="text-sm text-brand-700 font-medium mt-0.5">{lesson.unit}</p>
      <p className="text-xs text-gray-500 mt-2">
        {lesson.gradeLevels.map(gradeLabel).join(', ') || 'All grades'}
      </p>
      {lesson.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {lesson.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
