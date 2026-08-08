import { STORE, getOne, putOne } from './db';
import type { ScheduleSettings } from '../types/schedule';
import { SEED_SCHEDULE } from '../data/seedSchedule';

export async function ensureScheduleSeeded(): Promise<void> {
  const existing = await getOne(STORE.settings, 'default');
  if (!existing) {
    await putOne(STORE.settings, SEED_SCHEDULE);
  }
}

export async function getSchedule(): Promise<ScheduleSettings> {
  const existing = await getOne(STORE.settings, 'default');
  return existing ?? SEED_SCHEDULE;
}

export async function saveSchedule(schedule: ScheduleSettings): Promise<void> {
  await putOne(STORE.settings, { ...schedule, id: 'default', updatedAt: Date.now() });
}
