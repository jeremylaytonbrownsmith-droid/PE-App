import type { AccommodationCategory, Grade, GymSpace } from './common';

export interface StandardsForGrade {
  grade: Grade;
  /** Full NC standard codes, e.g. "PE.3.MS.1.2" */
  codes: string[];
}

export interface Accommodation {
  category: AccommodationCategory;
  note: string;
}

export interface TimedActivity {
  id: string;
  name: string;
  description?: string;
  minutes: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  note?: string;
  /** Red-box warning, e.g. "We are NOT using regular soccer balls. Use SOFT GATOR BALLS only." */
  warning?: string;
}

export interface GradeModification {
  id: string;
  grades: Grade[];
  note: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** e.g. "Soccer", "Jump Rope", "Volleyball", "Tag Games" */
  unit: string;
  gradeLevels: Grade[];
  gymSpace: GymSpace;
  halfGymReason?: string;
  specialCircumstances?: string;
  equipment: EquipmentItem[];
  gradeModifications: GradeModification[];
  techniqueCues: string[];
  numberOneRule: string;
  arrivalSetup: string[];
  warmUpId?: string;
  customWarmUpName?: string;
  customWarmUpDescription?: string;
  warmUpMinutes: number;
  mainActivities: TimedActivity[];
  optionalActivities: TimedActivity[];
  closure: string[];
  needsMusic?: boolean;
  diagramNotes?: string;
  standardsByGrade?: StandardsForGrade[];
  accommodations?: Accommodation[];
  /**
   * True if this lesson needs no PE-specific coaching, skill feedback, or specialized safety
   * supervision - safe to hand to a substitute with the printed plan and nothing else.
   * Skill/equipment-heavy units (stick sports, racket skills, spotting-based gymnastics,
   * multi-station meets) are left false/undefined since they're genuinely hard to run cold.
   */
  subFriendly?: boolean;
  tags: string[];
  source: 'seed' | 'custom';
  createdAt: number;
  updatedAt: number;
}

export const STANDARD_ARRIVAL_SETUP = [
  'Students enter the gym walking on the blue line all the way around to the stage.',
  'Students fill in on the front line first, then move back to the second line.',
  'Briefly explain today’s lesson, then go into the warm-up game.',
];

export const STANDARD_CLOSURE = [
  'Students return all equipment neatly.',
  'Students get a quick sip of water.',
  'Students line up on the blue line. Thank students for a great class.',
];
