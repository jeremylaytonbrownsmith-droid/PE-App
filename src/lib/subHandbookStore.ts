import { STORE, getOne, putOne, getAll, deleteOne, newId } from './db';
import type { SubHandbook, SubResource } from '../types/subHandbook';
import { EMPTY_SUB_HANDBOOK } from '../types/subHandbook';

export async function getSubHandbook(): Promise<SubHandbook> {
  const existing = await getOne(STORE.subHandbook, 'default');
  return existing ?? EMPTY_SUB_HANDBOOK;
}

export async function saveSubHandbook(handbook: SubHandbook): Promise<void> {
  await putOne(STORE.subHandbook, { ...handbook, id: 'default', updatedAt: Date.now() });
}

export async function listSubResources(): Promise<SubResource[]> {
  const resources = await getAll(STORE.subResources);
  return resources.sort((a, b) => b.uploadedAt - a.uploadedAt);
}

export async function addSubResource(input: Omit<SubResource, 'id' | 'uploadedAt'>): Promise<SubResource> {
  const resource: SubResource = { ...input, id: newId('resource'), uploadedAt: Date.now() };
  await putOne(STORE.subResources, resource);
  return resource;
}

export async function deleteSubResource(id: string): Promise<void> {
  await deleteOne(STORE.subResources, id);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
