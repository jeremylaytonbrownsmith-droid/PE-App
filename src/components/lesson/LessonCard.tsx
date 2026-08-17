import { Link } from 'react-router-dom';
import { BadgeCheck, GraduationCap, ListOrdered } from 'lucide-react';
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
        <div className="flex flex-col items-end gap-1 shrink-0">
          {lesson.gymSpace === 'half' && (
            <span className="rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5">Half Gym</span>
          )}
          {lesson.subFriendly && (
            <span className="rounded-full bg-brand-100 text-brand-700 text-xs px-2 py-0.5">Sub-Friendly</span>
          )}
        </div>
      </div>
      <p className="text-sm text-brand-700 font-medium mt-0.5">{lesson.unit}</p>
      {lesson.series && (
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
          <ListOrdered size={13} /> Part {lesson.series.part} of {lesson.series.total}: {lesson.series.name}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        {lesson.gradeLevels.map(gradeLabel).join(', ') || 'All grades'}
      </p>
      {lesson.standardsByGrade && lesson.standardsByGrade.length > 0 && (
        <p className="flex items-center gap-1 text-xs text-brand-700 mt-1.5">
          <BadgeCheck size={13} /> NC Standards Aligned
        </p>
      )}
      {lesson.accommodations && lesson.accommodations.length > 0 && (
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <GraduationCap size={13} /> Adaptive PE notes included
        </p>
      )}
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
