export type Grade = 'K' | '1' | '2' | '3' | '4' | '5';

export const ALL_GRADES: Grade[] = ['K', '1', '2', '3', '4', '5'];

export function gradeLabel(grade: Grade): string {
  return grade === 'K' ? 'Kindergarten' : `${grade}${ordinalSuffix(grade)} Grade`;
}

function ordinalSuffix(grade: Grade): string {
  const n = Number(grade);
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export type GymSpace = 'full' | 'half';

export type BoxColor = 'green' | 'yellow' | 'orange' | 'blue' | 'purple' | 'red';

export type DayLetter = 'A' | 'B' | 'C' | 'D';

export const DAY_LETTERS: DayLetter[] = ['A', 'B', 'C', 'D'];
