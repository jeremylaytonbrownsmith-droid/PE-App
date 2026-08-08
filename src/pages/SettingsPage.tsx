import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import type { ScheduleSettings, ScheduleRow } from '../types/schedule';
import { DAY_LETTERS } from '../types/common';
import { getSchedule, saveSchedule } from '../lib/scheduleStore';
import { exportAllData, downloadExport, importAllData, parseImportFile } from '../lib/exportImport';
import { newId } from '../lib/db';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';

type Tab = 'schedule' | 'data' | 'about';

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('schedule');

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Your class schedule, backups, and app info." />

      <div className="flex gap-1 border-b border-gray-200">
        <TabButton active={tab === 'schedule'} onClick={() => setTab('schedule')} label="My Schedule" />
        <TabButton active={tab === 'data'} onClick={() => setTab('data')} label="Data" />
        <TabButton active={tab === 'about'} onClick={() => setTab('about')} label="About" />
      </div>

      {tab === 'schedule' && <ScheduleTab />}
      {tab === 'data' && <DataTab />}
      {tab === 'about' && <AboutTab />}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        active ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function ScheduleTab() {
  const [schedule, setSchedule] = useState<ScheduleSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSchedule().then(setSchedule);
  }, []);

  if (!schedule) return <p className="text-gray-400">Loading...</p>;

  function updateRow(id: string, patch: Partial<ScheduleRow>) {
    setSchedule((prev) => (prev ? { ...prev, rows: prev.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) } : prev));
  }

  async function handleSave() {
    if (!schedule) return;
    setSaving(true);
    await saveSchedule(schedule);
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter your own class schedule here. It auto-fills the schedule table whenever you generate a sub lesson.
      </p>

      <div className="grid sm:grid-cols-3 gap-3">
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">School Name</span>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={schedule.schoolName ?? ''}
            onChange={(e) => setSchedule({ ...schedule, schoolName: e.target.value })}
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Morning Duty</span>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={schedule.morningDuty ?? ''}
            onChange={(e) => setSchedule({ ...schedule, morningDuty: e.target.value })}
          />
        </label>
        <label className="text-sm space-y-1">
          <span className="font-medium text-gray-700">Afternoon Duty</span>
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={schedule.afternoonDuty ?? ''}
            onChange={(e) => setSchedule({ ...schedule, afternoonDuty: e.target.value })}
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-brand-100 text-left">
              <th className="border border-brand-200 px-2 py-2">Start</th>
              <th className="border border-brand-200 px-2 py-2">End</th>
              <th className="border border-brand-200 px-2 py-2">Grade</th>
              {DAY_LETTERS.map((d) => (
                <th key={d} className="border border-brand-200 px-2 py-2">
                  {d} Day
                </th>
              ))}
              <th className="border border-brand-200 px-2 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {schedule.rows.map((row) => (
              <tr key={row.id}>
                <td className="border border-brand-200 px-1 py-1">
                  <input
                    className="w-24 border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={row.startTime}
                    onChange={(e) => updateRow(row.id, { startTime: e.target.value })}
                  />
                </td>
                <td className="border border-brand-200 px-1 py-1">
                  <input
                    className="w-24 border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={row.endTime}
                    onChange={(e) => updateRow(row.id, { endTime: e.target.value })}
                  />
                </td>
                <td className="border border-brand-200 px-1 py-1">
                  <input
                    className="w-28 border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                    value={row.gradeLabel}
                    onChange={(e) => updateRow(row.id, { gradeLabel: e.target.value })}
                  />
                </td>
                {DAY_LETTERS.map((d) => (
                  <td key={d} className="border border-brand-200 px-1 py-1">
                    <input
                      className="w-24 border-none focus:outline-none focus:ring-1 focus:ring-brand-400 rounded px-1"
                      value={row.teachers[d] ?? ''}
                      onChange={(e) => updateRow(row.id, { teachers: { ...row.teachers, [d]: e.target.value } })}
                    />
                  </td>
                ))}
                <td className="border border-brand-200 px-1 py-1 text-center">
                  <button
                    onClick={() => setSchedule({ ...schedule, rows: schedule.rows.filter((r) => r.id !== row.id) })}
                    className="text-gray-400 hover:text-red-600"
                    aria-label="Remove row"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() =>
            setSchedule({
              ...schedule,
              rows: [...schedule.rows, { id: newId('row'), startTime: '', endTime: '', gradeLabel: '', teachers: {} }],
            })
          }
          className="flex items-center gap-1 text-sm text-brand-700 hover:underline"
        >
          <Plus size={14} /> Add Row
        </button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>
    </div>
  );
}

function DataTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleExport() {
    const bundle = await exportAllData();
    downloadExport(bundle);
    setStatus('Backup downloaded.');
  }

  async function handleImportFile(file: File) {
    try {
      const bundle = await parseImportFile(file);
      await importAllData(bundle);
      setStatus('Import complete! Reloading...');
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setStatus('That file could not be read. Make sure it is a PE Planner backup JSON file.');
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <h2 className="font-semibold text-gray-900">Export Backup</h2>
        <p className="text-sm text-gray-500">
          Download all your lessons, warm-ups, pacing guides, and schedule as a single JSON file. Keep it as a
          backup, or email it to another PE teacher to share your library.
        </p>
        <Button onClick={handleExport}>
          <Download size={16} /> Export Backup
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-gray-900">Import Backup</h2>
        <p className="text-sm text-gray-500">
          Import a PE Planner JSON backup. Lessons and warm-ups with matching IDs will be overwritten; everything
          else is added.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
          }}
        />
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} /> Import Backup
        </Button>
      </div>

      {status && <p className="text-sm text-brand-700">{status}</p>}
    </div>
  );
}

function AboutTab() {
  return (
    <div className="space-y-3 max-w-lg text-sm text-gray-600">
      <p>
        PE Planner is a free tool built by a PE teacher, for PE teachers - lesson plans, sub plans, and pacing
        guides that live entirely on your device.
      </p>
      <p>
        Everything you create is stored locally in your browser. Nothing is sent to a server, so it works offline
        and stays private. Use Export Backup regularly, and before switching devices or browsers.
      </p>
      <p>Install this app to your home screen from your browser's menu for the full app experience.</p>
    </div>
  );
}
