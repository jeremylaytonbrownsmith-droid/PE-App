import { STORE, getAll, putMany, putOne } from './db';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import type { PacingGuide } from '../types/pacing';
import type { ScheduleSettings } from '../types/schedule';

export interface ExportBundle {
  version: 1;
  exportedAt: number;
  lessons: Lesson[];
  warmups: WarmUp[];
  pacingGuides: PacingGuide[];
  schedule: ScheduleSettings[];
}

export async function exportAllData(): Promise<ExportBundle> {
  const [lessons, warmups, pacingGuides, schedule] = await Promise.all([
    getAll(STORE.lessons),
    getAll(STORE.warmups),
    getAll(STORE.pacingGuides),
    getAll(STORE.settings),
  ]);
  return { version: 1, exportedAt: Date.now(), lessons, warmups, pacingGuides, schedule };
}

export function downloadExport(bundle: ExportBundle, filename = 'pe-planner-backup.json'): void {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importAllData(bundle: ExportBundle): Promise<void> {
  if (bundle.lessons?.length) await putMany(STORE.lessons, bundle.lessons);
  if (bundle.warmups?.length) await putMany(STORE.warmups, bundle.warmups);
  if (bundle.pacingGuides?.length) await putMany(STORE.pacingGuides, bundle.pacingGuides);
  if (bundle.schedule?.length) {
    for (const s of bundle.schedule) await putOne(STORE.settings, s);
  }
}

export function parseImportFile(file: File): Promise<ExportBundle> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string) as ExportBundle);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
