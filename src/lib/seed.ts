import { ensureLessonsSeeded } from './lessonStore';
import { ensureWarmUpsSeeded } from './warmupStore';
import { ensureScheduleSeeded } from './scheduleStore';
import { ensurePacingGuidesSeeded } from './pacingStore';

let seeded: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seeded) {
    seeded = Promise.all([
      ensureLessonsSeeded(),
      ensureWarmUpsSeeded(),
      ensureScheduleSeeded(),
      ensurePacingGuidesSeeded(),
    ]).then(() => undefined);
  }
  return seeded;
}
