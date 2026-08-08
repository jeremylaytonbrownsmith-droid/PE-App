import type { GymSpace } from './common';

export type WarmUpType = 'tag' | 'non-tag' | 'small-space';

export interface WarmUp {
  id: string;
  name: string;
  type: WarmUpType;
  description: string;
  rules: string[];
  restZoneRule?: string;
  minGymSpace: GymSpace;
  suggestedMinutes: number;
  reminderQuote?: string;
  source: 'seed' | 'custom';
}

export const HULA_HOOP_REST_ZONE_RULE =
  'Students can step into a hula hoop to hide/rest, but only for 5 seconds! Then they must move to a new hoop or keep playing.';
