import { STORE, getOne, putOne } from './db';
import type { AssessmentLevel, AssessmentTally } from '../types/assessment';

export async function getTally(lessonId: string): Promise<AssessmentTally> {
  const existing = await getOne(STORE.assessmentTallies, lessonId);
  return existing ?? { lessonId, counts: {}, updatedAt: Date.now() };
}

export async function incrementTally(lessonId: string, cueIndex: number, level: AssessmentLevel): Promise<AssessmentTally> {
  const tally = await getTally(lessonId);
  const current = tally.counts[cueIndex] ?? { notYet: 0, developing: 0, gotIt: 0 };
  const next: AssessmentTally = {
    ...tally,
    counts: { ...tally.counts, [cueIndex]: { ...current, [level]: current[level] + 1 } },
    updatedAt: Date.now(),
  };
  await putOne(STORE.assessmentTallies, next);
  return next;
}

export async function resetTally(lessonId: string): Promise<AssessmentTally> {
  const cleared: AssessmentTally = { lessonId, counts: {}, updatedAt: Date.now() };
  await putOne(STORE.assessmentTallies, cleared);
  return cleared;
}
