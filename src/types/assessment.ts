export type AssessmentLevel = 'notYet' | 'developing' | 'gotIt';

export interface AssessmentTally {
  lessonId: string;
  /** Keyed by the technique cue's index within the lesson. */
  counts: Record<number, Record<AssessmentLevel, number>>;
  updatedAt: number;
}
