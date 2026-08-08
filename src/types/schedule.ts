import type { DayLetter } from './common';

export interface ScheduleRow {
  id: string;
  startTime: string;
  endTime: string;
  gradeLabel: string;
  teachers: Partial<Record<DayLetter, string>>;
}

export interface ScheduleSettings {
  id: 'default';
  schoolName?: string;
  rows: ScheduleRow[];
  morningDuty?: string;
  afternoonDuty?: string;
  updatedAt: number;
}

export const EMPTY_SCHEDULE: ScheduleSettings = {
  id: 'default',
  schoolName: '',
  rows: [],
  morningDuty: '',
  afternoonDuty: '',
  updatedAt: 0,
};
