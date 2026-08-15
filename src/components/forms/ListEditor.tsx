import { Plus, Trash2 } from 'lucide-react';

interface ListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function ListEditor({ items, onChange, placeholder = 'Add an item...', addLabel = 'Add' }: ListEditorProps) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-gray-400 hover:text-red-600"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}
