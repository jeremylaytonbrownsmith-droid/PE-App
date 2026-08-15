import { Plus, Trash2 } from 'lucide-react';
import type { TimedActivity } from '../../types/lesson';
import { newId } from '../../lib/db';

interface ActivityListEditorProps {
  activities: TimedActivity[];
  onChange: (activities: TimedActivity[]) => void;
  showMinutes?: boolean;
}

export function ActivityListEditor({ activities, onChange, showMinutes = true }: ActivityListEditorProps) {
  function update(id: string, patch: Partial<TimedActivity>) {
    onChange(activities.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium"
              placeholder="Activity name"
              value={activity.name}
              onChange={(e) => update(activity.id, { name: e.target.value })}
            />
            {showMinutes && (
              <input
                type="number"
                min={0}
                className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
                value={activity.minutes}
                onChange={(e) => update(activity.id, { minutes: Number(e.target.value) })}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(activities.filter((a) => a.id !== activity.id))}
              className="text-gray-400 hover:text-red-600"
              aria-label="Remove activity"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Description / instructions"
            rows={2}
            value={activity.description ?? ''}
            onChange={(e) => update(activity.id, { description: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...activities, { id: newId('activity'), name: '', description: '', minutes: 5 }])}
        className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
      >
        <Plus size={14} /> Add Activity
      </button>
    </div>
  );
}
