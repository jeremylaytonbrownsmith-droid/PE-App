import { STORE, getAll, getOne, putOne, deleteOne, putMany, countAll, newId } from './db';
import type { WarmUp } from '../types/warmup';
import { SEED_WARMUPS } from '../data/seedWarmups';

export async function ensureWarmUpsSeeded(): Promise<void> {
  const count = await countAll(STORE.warmups);
  if (count === 0) {
    await putMany(STORE.warmups, SEED_WARMUPS);
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
