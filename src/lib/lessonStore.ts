import { STORE, getAll, getOne, putOne, deleteOne, putMany, countAll, newId } from './db';
import type { Lesson } from '../types/lesson';
import { STANDARD_ARRIVAL_SETUP, STANDARD_CLOSURE } from '../types/lesson';
import { SEED_LESSONS } from '../data/seedLessons';

export async function ensureLessonsSeeded(): Promise<void> {
  const count = await countAll(STORE.lessons);
  if (count === 0) {
    await putMany(STORE.lessons, SEED_LESSONS);
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
