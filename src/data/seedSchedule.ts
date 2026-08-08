import type { ScheduleSettings } from '../types/schedule';

const SEEDED_AT = 1_700_000_000_000;

/**
 * Placeholder example schedule shown the first time a teacher opens "My Schedule."
 * Uses generic teacher labels (not any real person's name) - replace with your own schedule.
 */
export const SEED_SCHEDULE: ScheduleSettings = {
  id: 'default',
  schoolName: '',
  rows: [
    { id: 'row-1', startTime: '9:30 AM', endTime: '10:15 AM', gradeLabel: '5th Grade', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
    { id: 'row-2', startTime: '10:25 AM', endTime: '11:10 AM', gradeLabel: '3rd Grade', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
    { id: 'row-3', startTime: '11:20 AM', endTime: '12:05 PM', gradeLabel: '4th Grade', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
    { id: 'row-4', startTime: '1:00 PM', endTime: '1:45 PM', gradeLabel: 'Kindergarten', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
    { id: 'row-5', startTime: '1:55 PM', endTime: '2:40 PM', gradeLabel: '2nd Grade', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
    { id: 'row-6', startTime: '2:50 PM', endTime: '3:35 PM', gradeLabel: '1st Grade', teachers: { A: 'Teacher A', B: 'Teacher B', C: 'Teacher C', D: 'Teacher D' } },
  ],
  morningDuty: 'Carpool duty',
  afternoonDuty: 'None - after the last class ends, you are done for the day.',
  updatedAt: SEEDED_AT,
};
