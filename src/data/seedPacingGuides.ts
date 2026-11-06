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

/**
 * A ready-made backlog of every sub-friendly lesson in the library, for handing off to a
 * substitute during an extended absence (e.g. paternity leave). Not tied to real calendar
 * dates - the "Week" numbers and order are what matters, not the placeholder start date. A
 * substitute just works through them in order, checking off "Taught" on the pacing guide page
 * as they go, regardless of what the actual date is.
 */
const PATERNITY_LEAVE_PLAN: { unit: string; lessonId: string }[] = [
  { unit: 'Math Tag, Cone Catch & Ice Cream Tag', lessonId: 'lesson-cone-catch-ice-cream-tag' },
  { unit: 'Striker Ball', lessonId: 'lesson-striker-ball' },
  { unit: 'Classic Playground Games Day', lessonId: 'lesson-classic-playground-games' },
  { unit: 'Scoop & Cup Toss', lessonId: 'lesson-scoop-cup-toss' },
  { unit: 'Parachute Play', lessonId: 'lesson-parachute-play' },
  { unit: 'Red Light Rally', lessonId: 'lesson-red-light-rally' },
  { unit: 'Rhythm & Dance', lessonId: 'lesson-rhythm-dance' },
  { unit: 'Tag Game Mania', lessonId: 'lesson-tag-game-mania' },
  { unit: 'Cooperative Games & Team Building', lessonId: 'lesson-cooperative-games' },
  { unit: 'Bean Bag Toss, Throw & Catch', lessonId: 'lesson-toss-throw-catch' },
  { unit: 'Hula Hoop Skills', lessonId: 'lesson-hula-hoop-skills' },
  { unit: 'Fitness Fun & Games', lessonId: 'lesson-fitness-fun-and-games' },
  { unit: 'Juggling', lessonId: 'lesson-juggling' },
  { unit: 'Category Tag Challenge', lessonId: 'lesson-category-tag-challenge' },
  { unit: 'Soccer Dribbling Skills', lessonId: 'lesson-soccer-dribbling-skills' },
  { unit: 'Yoga & Mindful Movement', lessonId: 'lesson-yoga-mindful-movement' },
  { unit: 'Hoop & Cone Games Day', lessonId: 'lesson-hoop-and-cone-games-day' },
  { unit: 'Freeze Tag Frenzy', lessonId: 'lesson-freeze-tag-frenzy' },
  { unit: 'Jump Rope', lessonId: 'lesson-jump-rope' },
  { unit: 'Mellow Movement Day', lessonId: 'lesson-mellow-movement-day' },
  { unit: 'Steal the Treasure', lessonId: 'lesson-steal-the-treasure' },
  { unit: 'Soccer Passing & Shooting', lessonId: 'lesson-soccer-passing-shooting' },
  { unit: 'Circle Time Classics', lessonId: 'lesson-circle-time-classics' },
  { unit: 'Build-a-Snowman Relay', lessonId: 'lesson-build-a-snowman-relay' },
  { unit: 'Frisbee / Disc Skills', lessonId: 'lesson-frisbee-disc' },
  { unit: 'Partner Juggling & Steal the Tail', lessonId: 'lesson-partner-juggling-steal-the-tail' },
  { unit: 'Scooter Safety & Games', lessonId: 'lesson-scooter-games' },
  { unit: 'Baseball / Striking & Fielding Games', lessonId: 'lesson-baseball-striking-fielding' },
  { unit: 'Laps & Running', lessonId: 'lesson-laps-and-running' },
  { unit: 'Volleyball', lessonId: 'lesson-volleyball' },
  { unit: 'Fitness Circuit', lessonId: 'lesson-fitness-circuit' },
  { unit: 'Jump Rope Skills & Stations', lessonId: 'lesson-jump-rope-skills-stations' },
  { unit: 'Football Throw & Catch Games', lessonId: 'lesson-football-throw-catch' },
  { unit: 'Parachute Fitness', lessonId: 'lesson-parachute-fitness' },
  { unit: 'Volleying & Striking Skills', lessonId: 'lesson-volleying-striking-skills' },
  { unit: 'Games & Movement', lessonId: 'lesson-games-movement-half-gym' },
  { unit: 'Locomotor Relay Races', lessonId: 'lesson-locomotor-relay-races' },
  { unit: 'Scooter Fitness Circuit', lessonId: 'lesson-scooter-fitness-circuit' },
  { unit: 'Soccer / Handball Goal Games', lessonId: 'lesson-soccer-goal-games' },
  { unit: 'Fitness Testing & Goal Setting', lessonId: 'lesson-fitness-testing-goal-setting' },
  { unit: 'PE Expectations & Team Building', lessonId: 'lesson-pe-expectations-team-building' },
];

const PATERNITY_PLAN_PLACEHOLDER_START_DATE = '2026-11-02';

function buildPaternityLeaveWeeks(): PacingWeek[] {
  const start = new Date(`${PATERNITY_PLAN_PLACEHOLDER_START_DATE}T00:00:00`);
  return PATERNITY_LEAVE_PLAN.map((block, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 7);
    return { weekNumber: i + 1, startDate: d.toISOString().slice(0, 10), unit: block.unit, lessonId: block.lessonId };
  });
}

function buildPaternityLeaveGuide(): PacingGuide {
  return {
    id: 'pacing-paternity-leave-coverage',
    name: 'Paternity Leave Coverage Plan',
    schoolYear: 'As Needed - Not Date-Specific',
    grade: 'K-5',
    weeks: buildPaternityLeaveWeeks(),
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  };
}

/**
 * A January-through-April stretch of the year: basketball and soccer first (each run as a
 * short skill progression - dribble/pass/shoot building up to full games), then jump rope,
 * volleyball, gymnastics, and fitness circuit round out the spring before the school year's
 * later units pick back up. Floor Hockey is taught separately (not in this rotation) since
 * that's a unit the teacher runs himself.
 */
const JAN_APRIL_PLAN: { unit: string; lessonId: string; weeks: number }[] = [
  { unit: 'Basketball', lessonId: 'lesson-basketball', weeks: 3 },
  { unit: 'Soccer Dribbling Skills', lessonId: 'lesson-soccer-dribbling-skills', weeks: 1 },
  { unit: 'Soccer Passing & Shooting', lessonId: 'lesson-soccer-passing-shooting', weeks: 1 },
  { unit: 'Soccer / Handball Goal Games', lessonId: 'lesson-soccer-goal-games', weeks: 1 },
  { unit: 'Jump Rope', lessonId: 'lesson-jump-rope', weeks: 1 },
  { unit: 'Jump Rope Skills & Stations', lessonId: 'lesson-jump-rope-skills-stations', weeks: 1 },
  { unit: 'Jump Rope Routines & Performance', lessonId: 'lesson-jump-rope-routines-performance', weeks: 1 },
  { unit: 'Volleying & Striking Skills', lessonId: 'lesson-volleying-striking-skills', weeks: 1 },
  { unit: 'Volleyball', lessonId: 'lesson-volleyball', weeks: 1 },
  { unit: 'Gymnastics & Tumbling', lessonId: 'lesson-gymnastics-tumbling', weeks: 3 },
  { unit: 'Fitness Circuit', lessonId: 'lesson-fitness-circuit', weeks: 2 },
];

const JAN_APRIL_START_DATE = '2027-01-04';

function buildJanAprilWeeks(): PacingWeek[] {
  const start = new Date(`${JAN_APRIL_START_DATE}T00:00:00`);
  const weeks: PacingWeek[] = [];
  let weekNumber = 1;
  for (const block of JAN_APRIL_PLAN) {
    for (let i = 0; i < block.weeks; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + (weekNumber - 1) * 7);
      weeks.push({ weekNumber, startDate: d.toISOString().slice(0, 10), unit: block.unit, lessonId: block.lessonId });
      weekNumber++;
    }
  }
  return weeks;
}

function buildJanAprilGuide(): PacingGuide {
  return {
    id: 'pacing-jan-april',
    name: 'January-April Pacing Guide',
    schoolYear: '2026-2027',
    grade: 'K-5',
    weeks: buildJanAprilWeeks(),
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  };
}

export const SEED_PACING_GUIDES: PacingGuide[] = [buildSampleYearGuide(), buildPaternityLeaveGuide(), buildJanAprilGuide()];
