import { Plus, Trash2 } from 'lucide-react';
import type { GradeModification } from '../../types/lesson';
import { newId } from '../../lib/db';
import { GradeSelector } from './GradeSelector';

export function GradeModEditor({ mods, onChange }: { mods: GradeModification[]; onChange: (mods: GradeModification[]) => void }) {
  function update(id: string, patch: Partial<GradeModification>) {
    onChange(mods.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  return (
    <div className="space-y-3">
      {mods.map((mod) => (
        <div key={mod.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
          <GradeSelector value={mod.grades} onChange={(grades) => update(mod.id, { grades })} />
          <div className="flex gap-2">
            <textarea
              className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              placeholder="Modification note"
              rows={2}
              value={mod.note}
              onChange={(e) => update(mod.id, { note: e.target.value })}
            />
            <button
              type="button"
              onClick={() => onChange(mods.filter((m) => m.id !== mod.id))}
              className="text-gray-400 hover:text-red-600"
              aria-label="Remove modification"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...mods, { id: newId('gradeMod'), grades: [], note: '' }])}
        className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
      >
        <Plus size={14} /> Add Grade Modification
      </button>
    </div>
  );
}
