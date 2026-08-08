import { openDB, type IDBPDatabase } from 'idb';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import type { PacingGuide } from '../types/pacing';
import type { ScheduleSettings } from '../types/schedule';
import type { AssessmentTally } from '../types/assessment';
import type { SubHandbook, SubResource } from '../types/subHandbook';

const DB_NAME = 'pe-planner';
const DB_VERSION = 3;

export const STORE = {
  lessons: 'lessons',
  warmups: 'warmups',
  pacingGuides: 'pacingGuides',
  settings: 'settings',
  meta: 'meta',
  assessmentTallies: 'assessmentTallies',
  subHandbook: 'subHandbook',
  subResources: 'subResources',
} as const;

interface Schema {
  [STORE.lessons]: Lesson;
  [STORE.warmups]: WarmUp;
  [STORE.pacingGuides]: PacingGuide;
  [STORE.settings]: ScheduleSettings;
  [STORE.meta]: { key: string; value: unknown };
  [STORE.assessmentTallies]: AssessmentTally;
  [STORE.subHandbook]: SubHandbook;
  [STORE.subResources]: SubResource;
}

let dbPromise: Promise<IDBPDatabase<Schema>> | null = null;

export function getDb(): Promise<IDBPDatabase<Schema>> {
  if (!dbPromise) {
    dbPromise = openDB<Schema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE.lessons)) {
          db.createObjectStore(STORE.lessons, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE.warmups)) {
          db.createObjectStore(STORE.warmups, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE.pacingGuides)) {
          db.createObjectStore(STORE.pacingGuides, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE.settings)) {
          db.createObjectStore(STORE.settings, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE.meta)) {
          db.createObjectStore(STORE.meta, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE.assessmentTallies)) {
          db.createObjectStore(STORE.assessmentTallies, { keyPath: 'lessonId' });
        }
        if (!db.objectStoreNames.contains(STORE.subHandbook)) {
          db.createObjectStore(STORE.subHandbook, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE.subResources)) {
          db.createObjectStore(STORE.subResources, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAll<K extends keyof Schema>(store: K): Promise<Schema[K][]> {
  const db = await getDb();
  return db.getAll(store);
}

export async function getOne<K extends keyof Schema>(store: K, id: string): Promise<Schema[K] | undefined> {
  const db = await getDb();
  return db.get(store, id);
}

export async function putOne<K extends keyof Schema>(store: K, value: Schema[K]): Promise<void> {
  const db = await getDb();
  await db.put(store, value);
}

export async function putMany<K extends keyof Schema>(store: K, values: Schema[K][]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(store, 'readwrite');
  await Promise.all(values.map((v) => tx.store.put(v)));
  await tx.done;
}

export async function deleteOne<K extends keyof Schema>(store: K, id: string): Promise<void> {
  const db = await getDb();
  await db.delete(store, id);
}

export async function countAll<K extends keyof Schema>(store: K): Promise<number> {
  const db = await getDb();
  return db.count(store);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
