import type { Lesson } from '../types/lesson';

export interface TimeCheckRow {
  label: string;
  minutesLabel: string;
  minutes: number | null;
}

export function buildTimeCheckTable(lesson: Lesson, warmUpName?: string): TimeCheckRow[] {
  const rows: TimeCheckRow[] = [{ label: 'Arrival and Setup', minutesLabel: '5 minutes', minutes: 5 }];

  const warmUpLabel = warmUpName ?? lesson.customWarmUpName ?? 'Warm-Up';
  rows.push({ label: `Warm-Up: ${warmUpLabel}`, minutesLabel: `${lesson.warmUpMinutes} minutes`, minutes: lesson.warmUpMinutes });

  for (const activity of lesson.mainActivities) {
    rows.push({ label: activity.name, minutesLabel: `${activity.minutes} minutes`, minutes: activity.minutes });
  }

  if (lesson.optionalActivities.length > 0) {
    rows.push({
      label: lesson.optionalActivities.map((a) => a.name).join(' / '),
      minutesLabel: 'If time allows',
      minutes: null,
    });
  }

  rows.push({ label: 'Closure and Dismissal', minutesLabel: '5 minutes', minutes: 5 });

  return rows;
}

export function totalRequiredMinutes(lesson: Lesson): number {
  return 5 + lesson.warmUpMinutes + lesson.mainActivities.reduce((sum, a) => sum + a.minutes, 0) + 5;
}
