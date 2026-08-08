import { STORE, getAll, getOne, putOne, deleteOne, putMany, newId } from './db';
import type { Lesson } from '../types/lesson';
import { STANDARD_ARRIVAL_SETUP, STANDARD_CLOSURE } from '../types/lesson';
import { SEED_LESSONS } from '../data/seedLessons';

/**
 * Adds any seed lessons the device doesn't already have, keyed by id, without touching
 * existing rows - so a future app update can ship new starter lessons without clobbering
 * a teacher's own edits to the lessons they already have.
 */
export async function ensureLessonsSeeded(): Promise<void> {
  const existing = await getAll(STORE.lessons);
  const existingIds = new Set(existing.map((l) => l.id));
  const missing = SEED_LESSONS.filter((l) => !existingIds.has(l.id));
  if (missing.length) {
    await putMany(STORE.lessons, missing);
  }
}

export async function listLessons(): Promise<Lesson[]> {
  const lessons = await getAll(STORE.lessons);
  return lessons.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getLesson(id: string): Promise<Lesson | undefined> {
  return getOne(STORE.lessons, id);
}

export async function saveLesson(lesson: Lesson): Promise<void> {
  await putOne(STORE.lessons, { ...lesson, updatedAt: Date.now() });
}

export async function deleteLesson(id: string): Promise<void> {
  await deleteOne(STORE.lessons, id);
}

export function createBlankLesson(): Lesson {
  const now = Date.now();
  return {
    id: newId('lesson'),
    title: '',
    unit: '',
    gradeLevels: [],
    gymSpace: 'full',
    equipment: [],
    gradeModifications: [],
    techniqueCues: [],
    numberOneRule: '',
    arrivalSetup: [...STANDARD_ARRIVAL_SETUP],
    warmUpMinutes: 10,
    mainActivities: [],
    optionalActivities: [],
    closure: [...STANDARD_CLOSURE],
    tags: [],
    source: 'custom',
    createdAt: now,
    updatedAt: now,
  };
}

export function duplicateLesson(lesson: Lesson): Lesson {
  const now = Date.now();
  return {
    ...lesson,
    id: newId('lesson'),
    title: `${lesson.title} (Copy)`,
    source: 'custom',
    createdAt: now,
    updatedAt: now,
  };
}
