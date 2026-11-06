import { STORE, getAll, getOne, putOne, putMany, deleteOne, newId } from './db';
import type { PacingGuide, PacingWeek } from '../types/pacing';
import { SEED_PACING_GUIDES } from '../data/seedPacingGuides';

/**
 * A device that seeded one of our built-in pacing guides before its unit lineup changed (a
 * swap like "take Floor Hockey out, put in Hula Hoop Skills") keeps its own stale copy forever,
 * since seeding only adds guides the device doesn't already have. This heals week-by-week: a
 * week is only updated to match the current seed if the teacher hasn't touched it yet (not
 * marked taught, no notes added) - any week the teacher has actually used is left exactly as
 * they left it.
 */
function healSeedGuide(existingGuide: PacingGuide, seedGuide: PacingGuide): PacingGuide {
  const seedByWeek = new Map(seedGuide.weeks.map((w) => [w.weekNumber, w]));
  return {
    ...existingGuide,
    weeks: existingGuide.weeks.map((week) => {
      const seedWeek = seedByWeek.get(week.weekNumber);
      if (!seedWeek) return week;
      const untouched = !week.completed && !week.notes;
      if (!untouched) return week;
      if (week.unit === seedWeek.unit && week.lessonId === seedWeek.lessonId) return week;
      return { ...week, unit: seedWeek.unit, lessonId: seedWeek.lessonId };
    }),
  };
}

/**
 * Adds the sample pacing guides the first time, without touching one a teacher has already
 * edited, and heals untouched weeks in our own seed guides forward (see healSeedGuide).
 */
export async function ensurePacingGuidesSeeded(): Promise<void> {
  const existing = await getAll(STORE.pacingGuides);
  const existingIds = new Set(existing.map((g) => g.id));
  const missing = SEED_PACING_GUIDES.filter((g) => !existingIds.has(g.id));
  if (missing.length) {
    await putMany(STORE.pacingGuides, missing);
  }

  const seedById = new Map(SEED_PACING_GUIDES.map((g) => [g.id, g]));
  const healed: PacingGuide[] = [];
  for (const guide of existing) {
    const seedGuide = seedById.get(guide.id);
    if (!seedGuide) continue;
    const next = healSeedGuide(guide, seedGuide);
    if (JSON.stringify(next) !== JSON.stringify(guide)) {
      healed.push(next);
    }
  }
  if (healed.length) {
    await putMany(STORE.pacingGuides, healed);
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
