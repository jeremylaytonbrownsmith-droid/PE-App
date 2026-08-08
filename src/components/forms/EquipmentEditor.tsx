import { Plus, Trash2 } from 'lucide-react';
import type { EquipmentItem } from '../../types/lesson';
import { newId } from '../../lib/db';

export function EquipmentEditor({ items, onChange }: { items: EquipmentItem[]; onChange: (items: EquipmentItem[]) => void }) {
  function update(id: string, patch: Partial<EquipmentItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-gray-200 p-3 space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium"
              placeholder="Equipment name"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              className="text-gray-400 hover:text-red-600"
              aria-label="Remove equipment"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Note (optional)"
            value={item.note ?? ''}
            onChange={(e) => update(item.id, { note: e.target.value })}
          />
          <input
            className="w-full rounded-lg border border-red-200 px-3 py-1.5 text-sm"
            placeholder="Red-box warning (optional), e.g. 'We are NOT using regular soccer balls...'"
            value={item.warning ?? ''}
            onChange={(e) => update(item.id, { warning: e.target.value })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { id: newId('equipment'), name: '' }])}
        className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
      >
        <Plus size={14} /> Add Equipment
      </button>
    </div>
  );
}
