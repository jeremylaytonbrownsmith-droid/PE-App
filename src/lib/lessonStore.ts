import { STORE, getAll, getOne, putOne, deleteOne, putMany, newId } from './db';
import type { Lesson } from '../types/lesson';
import { STANDARD_ARRIVAL_SETUP, STANDARD_CLOSURE } from '../types/lesson';
import { SEED_LESSONS } from '../data/seedLessons';

const SHARK_PATTERN = /shark/i;

/**
 * A device that seeded a lesson before "Sharks and Minnows" (or a shark-tag variant) was
 * removed from it keeps its own copy forever - seeding is additive-by-id on purpose, so an
 * app update never clobbers a teacher's own edits. This heals just the specific entries that
 * still mention "shark" by replacing them with the current seed's version of that same entry
 * (matched by id/category), leaving every other edit on the lesson untouched. A lesson like
 * Parachute Fitness that still legitimately has a shark-themed game is a no-op here, since its
 * seed entry still matches what's already stored.
 */
function healSharkReferences(lesson: Lesson, seedLesson: Lesson): Lesson {
  function healList<T extends { id: string; name?: string; description?: string; note?: string }>(
    existingList: T[],
    seedList: T[],
  ): T[] {
    return existingList.map((item) => {
      const text = `${item.name ?? ''} ${item.description ?? ''} ${item.note ?? ''}`;
      if (!SHARK_PATTERN.test(text)) return item;
      const replacement = seedList.find((s) => s.id === item.id);
      return (replacement as T) ?? item;
    });
  }
  function healByCategory<T extends { category: string; note: string }>(existingList: T[], seedList: T[]): T[] {
    return existingList.map((item) => {
      if (!SHARK_PATTERN.test(item.note)) return item;
      const replacement = seedList.find((s) => s.category === item.category);
      return (replacement as T) ?? item;
    });
  }

  return {
    ...lesson,
    mainActivities: healList(lesson.mainActivities, seedLesson.mainActivities),
    optionalActivities: healList(lesson.optionalActivities, seedLesson.optionalActivities),
    equipment: healList(lesson.equipment, seedLesson.equipment),
    gradeModifications: healList(lesson.gradeModifications, seedLesson.gradeModifications),
    accommodations: healByCategory(lesson.accommodations ?? [], seedLesson.accommodations ?? []),
  };
}

/**
 * Adds any seed lessons the device doesn't already have, keyed by id, without touching
 * existing rows - so a future app update can ship new starter lessons without clobbering
 * a teacher's own edits to the lessons they already have. Also runs a narrow one-time heal
 * (see healSharkReferences) for lessons seeded before a shark-tag game was removed from them.
 */
export async function ensureLessonsSeeded(): Promise<void> {
  const existing = await getAll(STORE.lessons);
  const existingIds = new Set(existing.map((l) => l.id));
  const missing = SEED_LESSONS.filter((l) => !existingIds.has(l.id));
  if (missing.length) {
    await putMany(STORE.lessons, missing);
  }

  const seedById = new Map(SEED_LESSONS.map((l) => [l.id, l]));
  const healed: Lesson[] = [];
  for (const lesson of existing) {
    if (lesson.source !== 'seed') continue;
    const seedLesson = seedById.get(lesson.id);
    if (!seedLesson) continue;
    const next = healSharkReferences(lesson, seedLesson);
    if (JSON.stringify(next) !== JSON.stringify(lesson)) {
      healed.push(next);
    }
  }
  if (healed.length) {
    await putMany(STORE.lessons, healed);
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
