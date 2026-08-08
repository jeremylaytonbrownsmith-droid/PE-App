import { useEffect, useState } from 'react';
import type { WarmUp } from '../../types/warmup';
import { listWarmUps } from '../../lib/warmupStore';

interface WarmUpPickerProps {
  warmUpId?: string;
  customName?: string;
  customDescription?: string;
  minutes: number;
  onChange: (patch: { warmUpId?: string; customName?: string; customDescription?: string; minutes?: number }) => void;
}

export function WarmUpPicker({ warmUpId, customName, customDescription, minutes, onChange }: WarmUpPickerProps) {
  const [warmUps, setWarmUps] = useState<WarmUp[]>([]);

  useEffect(() => {
    listWarmUps().then(setWarmUps);
  }, []);

  const isCustom = !warmUpId;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          value={warmUpId ?? ''}
          onChange={(e) => onChange({ warmUpId: e.target.value || undefined })}
        >
          <option value="">Custom warm-up...</option>
          {warmUps.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          value={minutes}
          onChange={(e) => onChange({ minutes: Number(e.target.value) })}
        />
      </div>
      {isCustom && (
        <div className="space-y-2">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Custom warm-up name"
            value={customName ?? ''}
            onChange={(e) => onChange({ customName: e.target.value })}
          />
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Describe the warm-up / rules"
            rows={2}
            value={customDescription ?? ''}
            onChange={(e) => onChange({ customDescription: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
