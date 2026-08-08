import { useState } from 'react';
import type { WarmUp, WarmUpType } from '../../types/warmup';
import { createBlankWarmUp } from '../../lib/warmupStore';
import { Button } from '../ui/Button';

export function AddWarmUpForm({ onSave, onCancel }: { onSave: (warmUp: WarmUp) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(createBlankWarmUp());
  const [rulesText, setRulesText] = useState('');

  return (
    <form
      className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.name.trim()) return;
        onSave({
          ...draft,
          rules: rulesText.split('\n').map((r) => r.trim()).filter(Boolean),
        });
      }}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Name</span>
          <input
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. Sharks and Minnows"
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Type</span>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value as WarmUpType })}
          >
            <option value="tag">Tag Game</option>
            <option value="non-tag">Non-Tag Warm-Up</option>
            <option value="small-space">Small-Space Game</option>
          </select>
        </label>
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Suggested minutes</span>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={draft.suggestedMinutes}
            onChange={(e) => setDraft({ ...draft, suggestedMinutes: Number(e.target.value) })}
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Minimum gym space</span>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={draft.minGymSpace}
            onChange={(e) => setDraft({ ...draft, minGymSpace: e.target.value as 'full' | 'half' })}
          >
            <option value="half">Works in half gym</option>
            <option value="full">Needs full gym</option>
          </select>
        </label>
      </div>
      <label className="text-sm space-y-1 block">
        <span className="font-medium text-gray-700">Description</span>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>
      <label className="text-sm space-y-1 block">
        <span className="font-medium text-gray-700">Rules (one per line)</span>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
          rows={3}
          value={rulesText}
          onChange={(e) => setRulesText(e.target.value)}
        />
      </label>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Warm-Up</Button>
      </div>
    </form>
  );
}
