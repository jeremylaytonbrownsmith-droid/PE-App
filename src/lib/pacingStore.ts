import { STORE, getAll, getOne, putOne, putMany, deleteOne, newId } from './db';
import type { PacingGuide, PacingWeek } from '../types/pacing';
import { SEED_PACING_GUIDES } from '../data/seedPacingGuides';

/** Adds the sample pacing guide the first time, without touching one a teacher has already edited. */
export async function ensurePacingGuidesSeeded(): Promise<void> {
  const existing = await getAll(STORE.pacingGuides);
  const existingIds = new Set(existing.map((g) => g.id));
  const missing = SEED_PACING_GUIDES.filter((g) => !existingIds.has(g.id));
  if (missing.length) {
    await putMany(STORE.pacingGuides, missing);
  }
}

export async function listPacingGuides(): Promise<PacingGuide[]> {
  const guides = await getAll(STORE.pacingGuides);
  return guides.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getPacingGuide(id: string): Promise<PacingGuide | undefined> {
  return getOne(STORE.pacingGuides, id);
}

export async function savePacingGuide(guide: PacingGuide): Promise<void> {
  await putOne(STORE.pacingGuides, { ...guide, updatedAt: Date.now() });
}

export async function deletePacingGuide(id: string): Promise<void> {
  await deleteOne(STORE.pacingGuides, id);
}

export function createPacingGuide(name: string, schoolYear: string, grade: string, startDate: string, numWeeks: number): PacingGuide {
  const weeks: PacingWeek[] = [];
  const start = new Date(`${startDate}T00:00:00`);
  for (let i = 0; i < numWeeks; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    weeks.push({ weekNumber: i + 1, startDate: d.toISOString().slice(0, 10) });
  }
  const now = Date.now();
  return {
    id: newId('pacing'),
    name,
    schoolYear,
    grade,
    weeks,
    createdAt: now,
    updatedAt: now,
  };
}
