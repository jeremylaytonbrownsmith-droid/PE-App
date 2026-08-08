import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import type { WarmUp } from '../../types/warmup';
import { InfoBox } from '../boxes/InfoBox';

const TYPE_LABEL: Record<WarmUp['type'], string> = {
  tag: 'Tag Game',
  'non-tag': 'Non-Tag Warm-Up',
  'small-space': 'Small-Space Game',
};

export function WarmUpListItem({ warmUp, onDelete }: { warmUp: WarmUp; onDelete?: (id: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span>
          <span className="font-semibold text-gray-900">{warmUp.name}</span>
          <span className="ml-2 text-xs text-gray-500">
            {TYPE_LABEL[warmUp.type]} · {warmUp.suggestedMinutes} min
          </span>
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2 text-sm">
          <p className="text-gray-700">{warmUp.description}</p>
          {warmUp.rules.length > 0 && (
            <ul className="list-disc pl-5 space-y-0.5">
              {warmUp.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          )}
          {warmUp.restZoneRule && <InfoBox color="green">{warmUp.restZoneRule}</InfoBox>}
          {warmUp.reminderQuote && (
            <InfoBox color="orange">
              Remind students: <em>"{warmUp.reminderQuote}"</em>
            </InfoBox>
          )}
          {warmUp.source === 'custom' && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(warmUp.id)}
              className="flex items-center gap-1 text-red-600 text-xs mt-2 hover:underline"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
