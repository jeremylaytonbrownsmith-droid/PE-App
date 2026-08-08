import { ALL_GRADES, gradeLabel, type Grade } from '../../types/common';

export function GradeSelector({ value, onChange }: { value: Grade[]; onChange: (grades: Grade[]) => void }) {
  function toggle(grade: Grade) {
    onChange(value.includes(grade) ? value.filter((g) => g !== grade) : [...value, grade]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_GRADES.map((grade) => {
        const active = value.includes(grade);
        return (
          <button
            key={grade}
            type="button"
            onClick={() => toggle(grade)}
            className={`rounded-full px-3 py-1 text-sm border ${
              active ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
            }`}
          >
            {gradeLabel(grade)}
          </button>
        );
      })}
    </div>
  );
}
