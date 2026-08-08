import type { Grade } from '../types/common';
import type { StandardsForGrade } from '../types/lesson';
import { standardCode } from '../data/ncStandards';

function build(grades: Grade[], objectivesFor: (grade: Grade) => string[]): StandardsForGrade[] {
  return grades.map((grade) => ({ grade, codes: objectivesFor(grade).map((objective) => standardCode(grade, objective)) }));
}

const universal = (): string[] => ['PR.4.3', 'HF.3.3'];

/**
 * Manipulative-skill units (throwing, catching, dribbling, passing, volleying, striking, kicking).
 * "invasion" (goal/territory games like soccer/basketball) leans on the offense/defense objective
 * at grades 4-5; "net-field" (volleyball, striking/fielding) leans on skill-combination/evaluation
 * objectives instead, since that's what those grades' Movement Concepts standard actually names.
 */
export function manipulativeSkillStandards(grades: Grade[], style: 'invasion' | 'net-field'): StandardsForGrade[] {
  return build(grades, (grade) => {
    const codes = ['MS.1.2', 'MC.2.2', ...universal()];
    if (grade === '4') {
      codes[1] = style === 'invasion' ? 'MC.2.2' : 'MC.2.1';
    } else if (grade === '5') {
      codes[1] = style === 'invasion' ? 'MC.2.2' : 'MC.2.3';
    }
    return codes;
  });
}

/** Locomotor-focused units (tag games, small-space games, jump rope footwork). */
export function locomotorStandards(grades: Grade[]): StandardsForGrade[] {
  return build(grades, (grade) => {
    const codes = ['MS.1.1', 'MC.2.1', ...universal()];
    if (grade === '4') codes[1] = 'MC.2.3';
    return codes;
  });
}

/** Rhythm/dance units - layers the rhythmic movement objective on top of locomotor skills. */
export function rhythmStandards(grades: Grade[]): StandardsForGrade[] {
  return build(grades, () => ['MS.1.1', 'MS.1.4', ...universal()]);
}

/** Health-related fitness circuit units. */
export function fitnessStandards(grades: Grade[]): StandardsForGrade[] {
  return build(grades, () => ['HF.3.1', 'HF.3.2', ...universal()]);
}

/** Cooperative/team-building units - leans on the Personal/Social Responsibility strand. */
export function cooperativeStandards(grades: Grade[]): StandardsForGrade[] {
  return build(grades, () => ['PR.4.1', 'PR.4.2', ...universal()]);
}

/** Unions two standards sets grade-by-grade, deduping codes - for units that cross categories. */
export function mergeStandards(...sets: StandardsForGrade[][]): StandardsForGrade[] {
  const byGrade = new Map<Grade, Set<string>>();
  for (const set of sets) {
    for (const { grade, codes } of set) {
      const existing = byGrade.get(grade) ?? new Set<string>();
      codes.forEach((code) => existing.add(code));
      byGrade.set(grade, existing);
    }
  }
  return Array.from(byGrade.entries()).map(([grade, codes]) => ({ grade, codes: Array.from(codes) }));
}
