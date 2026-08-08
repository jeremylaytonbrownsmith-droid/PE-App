import type { PacingGuide, PacingWeek } from '../types/pacing';

const SEEDED_AT = 1_700_000_000_000;

/**
 * A realistic rotation through the full K-5 lesson library across a school year - most units
 * run 2-3 weeks, a handful of "fun day" units (Parachute Play, Lacrosse intro, Scooter Games,
 * Field Day) run just one. Ordered so indoor/skill-heavy units land in the winter months and
 * Field Day closes out the year in the spring.
 */
const YEAR_PLAN: { unit: string; lessonId: string; weeks: number }[] = [
  { unit: 'Games & Movement', lessonId: 'lesson-games-movement-half-gym', weeks: 1 },
  { unit: 'Soccer', lessonId: 'lesson-soccer-goal-games', weeks: 3 },
  { unit: 'Cooperative Games & Team Building', lessonId: 'lesson-cooperative-games', weeks: 1 },
  { unit: 'Frisbee / Disc Skills', lessonId: 'lesson-frisbee-disc', weeks: 2 },
  { unit: 'Jump Rope', lessonId: 'lesson-jump-rope', weeks: 2 },
  { unit: 'Fitness Circuit', lessonId: 'lesson-fitness-circuit', weeks: 2 },
  { unit: 'Basketball', lessonId: 'lesson-basketball', weeks: 3 },
  { unit: 'Floor Hockey', lessonId: 'lesson-floor-hockey', weeks: 3 },
  { unit: 'Gymnastics & Tumbling', lessonId: 'lesson-gymnastics-tumbling', weeks: 3 },
  { unit: 'Yoga & Mindful Movement', lessonId: 'lesson-yoga-mindful-movement', weeks: 1 },
  { unit: 'Rhythm & Dance', lessonId: 'lesson-rhythm-dance', weeks: 2 },
  { unit: 'Volleyball', lessonId: 'lesson-volleyball', weeks: 3 },
  { unit: 'Racket & Paddle Skills', lessonId: 'lesson-racket-paddle', weeks: 2 },
  { unit: 'Parachute Play', lessonId: 'lesson-parachute-play', weeks: 1 },
  { unit: 'Lacrosse', lessonId: 'lesson-lacrosse', weeks: 1 },
  { unit: 'Baseball / Striking & Fielding', lessonId: 'lesson-baseball-striking-fielding', weeks: 2 },
  { unit: 'Football Throw & Catch', lessonId: 'lesson-football-throw-catch', weeks: 2 },
  { unit: 'Scooter Games', lessonId: 'lesson-scooter-games', weeks: 1 },
  { unit: 'Track & Field / Field Day', lessonId: 'lesson-track-and-field', weeks: 1 },
];

const YEAR_START_DATE = '2026-08-24';

function buildWeeks(): PacingWeek[] {
  const start = new Date(`${YEAR_START_DATE}T00:00:00`);
  const weeks: PacingWeek[] = [];
  let weekNumber = 1;
  for (const block of YEAR_PLAN) {
    for (let i = 0; i < block.weeks; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + (weekNumber - 1) * 7);
      weeks.push({ weekNumber, startDate: d.toISOString().slice(0, 10), unit: block.unit, lessonId: block.lessonId });
      weekNumber++;
    }
  }
  return weeks;
}

function buildSampleYearGuide(): PacingGuide {
  return {
    id: 'pacing-sample-k5-year',
    name: 'Sample K-5 Year Pacing Guide',
    schoolYear: '2026-2027',
    grade: 'K-5',
    weeks: buildWeeks(),
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  };
}

export const SEED_PACING_GUIDES: PacingGuide[] = [buildSampleYearGuide()];
