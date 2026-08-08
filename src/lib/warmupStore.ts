import { STORE, getAll, getOne, putOne, deleteOne, putMany, newId } from './db';
import type { WarmUp } from '../types/warmup';
import { SEED_WARMUPS } from '../data/seedWarmups';

/** Adds any seed warm-ups the device doesn't already have yet, keyed by id. */
export async function ensureWarmUpsSeeded(): Promise<void> {
  const existing = await getAll(STORE.warmups);
  const existingIds = new Set(existing.map((w) => w.id));
  const missing = SEED_WARMUPS.filter((w) => !existingIds.has(w.id));
  if (missing.length) {
    await putMany(STORE.warmups, missing);
  }
}

export async function listWarmUps(): Promise<WarmUp[]> {
  const warmups = await getAll(STORE.warmups);
  return warmups.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getWarmUp(id: string): Promise<WarmUp | undefined> {
  return getOne(STORE.warmups, id);
}

export async function saveWarmUp(warmUp: WarmUp): Promise<void> {
  await putOne(STORE.warmups, warmUp);
}

export async function deleteWarmUp(id: string): Promise<void> {
  await deleteOne(STORE.warmups, id);
}

export function createBlankWarmUp(): WarmUp {
  return {
    id: newId('warmup'),
    name: '',
    type: 'tag',
    description: '',
    rules: [],
    minGymSpace: 'full',
    suggestedMinutes: 10,
    source: 'custom',
  };
}
