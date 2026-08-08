export interface PacingWeek {
  weekNumber: number;
  startDate: string;
  unit?: string;
  lessonId?: string;
  notes?: string;
  completed?: boolean;
}

export interface PacingGuide {
  id: string;
  name: string;
  schoolYear: string;
  grade: string;
  weeks: PacingWeek[];
  createdAt: number;
  updatedAt: number;
}
