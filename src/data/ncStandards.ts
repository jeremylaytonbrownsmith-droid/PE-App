import type { Grade } from '../types/common';

export type Strand = 'MS' | 'MC' | 'HF' | 'PR';

export const STRAND_LABEL: Record<Strand, string> = {
  MS: 'Motor Skills',
  MC: 'Movement Concepts',
  HF: 'Health-Related Fitness',
  PR: 'Personal/Social Responsibility',
};

/** A stable color per strand, used for chips/borders wherever standards are shown. */
export const STRAND_COLOR: Record<Strand, string> = {
  MS: '#e63946',
  MC: '#457b9d',
  HF: '#2a9d8f',
  PR: '#f4a261',
};

interface StandardEntry {
  code: string;
  description: string;
}

/**
 * NC Standard Course of Study, K-12 Physical Education (2024).
 * Transcribed directly from the state document for grades K-5, the four
 * elementary strands (Motor Skills, Movement Concepts, Health-Related
 * Fitness, Personal/Social Responsibility) and their numbered objectives.
 */
const RAW_STANDARDS: Record<Grade, Record<string, string>> = {
  K: {
    'MS.1.1': 'Demonstrate recognizable forms of the locomotor skills (walk, run, jump, hop, skip, gallop, leap, slide).',
    'MS.1.2': 'Demonstrate recognizable forms of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MS.1.3': 'Demonstrate transitions between locomotor skills with recognizable forms.',
    'MS.1.4': 'Demonstrate rhythmic locomotor and non-locomotor movements to a beat.',
    'MC.2.1': 'Demonstrate understanding of the movement concepts of space, pathways, and speed through movement.',
    'MC.2.2': 'Identify one or more of the critical elements for fundamental manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MC.2.3': 'Use teacher feedback to improve basic motor performance.',
    'HF.3.1': 'Identify one or more of the five health-related fitness components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, or body composition) and their associated exercises.',
    'HF.3.2': 'Identify opportunities for increased physical activity.',
    'HF.3.3': 'Actively participate in physical education class.',
    'PR.4.1': 'Demonstrate cooperation by following directions in group settings.',
    'PR.4.2': 'Identify physical activities that are personally enjoyable.',
    'PR.4.3': 'Demonstrate safe practices when engaging in physical activities with minimal teacher reminders.',
  },
  '1': {
    'MS.1.1': 'Demonstrate emerging forms of all eight basic locomotor skills (walk, run, jump, hop, skip, gallop, leap, slide) in different pathways, levels, or directions.',
    'MS.1.2': 'Demonstrate emerging forms of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MS.1.3': 'Demonstrate transitions between sequential locomotor skills.',
    'MS.1.4': 'Demonstrate a combination of rhythmic locomotor and non-locomotor movements to a beat.',
    'MC.2.1': 'Demonstrate understanding of the movement concepts of space, pathways, and speed through movement.',
    'MC.2.2': 'Identify two or more of the critical elements for fundamental manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MC.2.3': 'Use teacher and/or peer feedback to improve basic motor performance.',
    'HF.3.1': 'Identify two or more of the five health-related fitness components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, or body composition) and their associated exercises.',
    'HF.3.2': 'Identify benefits of being physically active.',
    'HF.3.3': 'Actively engage in physical education class.',
    'PR.4.1': 'Demonstrate cooperation by following directions and accepting responsibility in group settings.',
    'PR.4.2': 'Identify positive feelings that result from participation in physical activity.',
    'PR.4.3': 'Demonstrate safe practices when engaging in physical activities with minimal teacher reminders.',
  },
  '2': {
    'MS.1.1': 'Demonstrate mature form of six or more locomotor skills (walk, run, jump, hop, skip, gallop, leap, slide) using different pathways, levels, or directions.',
    'MS.1.2': 'Demonstrate emerging forms of a variety of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MS.1.3': 'Demonstrate combinations of locomotor skills with emerging form.',
    'MS.1.4': 'Perform a teacher and/or student designed rhythmic activity with correct response to simple rhythms.',
    'MC.2.1': 'Demonstrate understanding of the movement concepts of space, pathways, levels, speed, and force through combined movement skills.',
    'MC.2.2': 'Identify three or more of the critical elements for fundamental manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking).',
    'MC.2.3': 'Explain the value of feedback in improving motor performance.',
    'HF.3.1': 'Identify three or more of the five health-related fitness components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, and body composition) and their associated exercises.',
    'HF.3.2': 'Identify ways to be physically active outside of physical education class.',
    'HF.3.3': 'Actively engage in physical education class in response to instruction and practice.',
    'PR.4.1': 'Demonstrate ability to work independently and cooperatively with others in a variety of class environments.',
    'PR.4.2': 'Demonstrate understanding of physical activities that provide opportunities for self-expression.',
    'PR.4.3': 'Demonstrate the ability to work independently and safely in Physical Education.',
  },
  '3': {
    'MS.1.1': 'Demonstrate combinations of locomotor skills (walk, run, jump, hop, skip, gallop, leap, slide) with maturing form and smooth transitions.',
    'MS.1.2': 'Demonstrate maturing form of a variety of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking) using different pathways, levels, or directions.',
    'MS.1.3': 'Demonstrate combinations of locomotor and manipulative skills with emerging form.',
    'MS.1.4': 'Demonstrate rhythmic sequences with smooth transitions.',
    'MC.2.1': 'Demonstrate combinations of the movement concepts of direction, levels, force, and time with skills as directed by the teacher.',
    'MC.2.2': 'Demonstrate understanding of the critical elements of manipulative skills through successful performance.',
    'MC.2.3': 'Use evaluative tools to demonstrate understanding of successful skill performance.',
    'HF.3.1': 'Identify four or more of the five health-related fitness components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, and body composition) and their associated exercises.',
    'HF.3.2': 'Demonstrate understanding of physical activity as a way to become healthier.',
    'HF.3.3': 'Develop personal goals to improve one or more of the health-related fitness components.',
    'PR.4.1': 'Demonstrate personal and social responsibility in a variety of class environments.',
    'PR.4.2': 'Demonstrate understanding of the positive social interactions that come when engaged with others in physical activity.',
    'PR.4.3': 'Demonstrate independent and safe practices when engaging in various physical activities.',
  },
  '4': {
    'MS.1.1': 'Demonstrate mature form of locomotor skills required in a variety of physical activity settings.',
    'MS.1.2': 'Demonstrate mature form of a variety of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking) in varied physical activity settings.',
    'MS.1.3': 'Demonstrate combinations of locomotor and manipulative skills in a variety of physical activity settings.',
    'MS.1.4': 'Demonstrate combinations of movement patterns and/or dance steps in an original sequence.',
    'MC.2.1': 'Demonstrate understanding of manipulative skill combinations in small-sided practice tasks.',
    'MC.2.2': 'Demonstrate understanding of simple offensive and defensive strategies and tactics.',
    'MC.2.3': 'Use evaluative tools to improve skill performance of self and others.',
    'HF.3.1': 'Identify each of the five health-related fitness components (cardiorespiratory endurance, muscular strength, muscular endurance, flexibility, and body composition) and their associated exercises.',
    'HF.3.2': 'Identify personal opportunities for physical activity outside of physical education class.',
    'HF.3.3': 'Develop personal goals to improve two or more of the health-related fitness components.',
    'PR.4.1': 'Demonstrate personal and social responsibility in independent group situations.',
    'PR.4.2': 'Demonstrate understanding of how positive social interactions help achieve common goals when engaged with others in a variety of physical activities.',
    'PR.4.3': 'Demonstrate independent and safe practices when working with peers and equipment in various physical activities.',
  },
  '5': {
    'MS.1.1': 'Demonstrate mature form in locomotor skills required in a variety of small-sided practice tasks.',
    'MS.1.2': 'Demonstrate mature form of a variety of manipulative skills (throwing, catching, dribbling, passing, volleying, striking, and kicking) in small-sided practice tasks.',
    'MS.1.3': 'Demonstrate combinations of locomotor and manipulative skills in small-sided practice tasks.',
    'MS.1.4': 'Demonstrate combinations of rhythmic movement patterns and/or dance steps with smooth transitions.',
    'MC.2.1': 'Apply combinations of movement concepts with skills to improve performance.',
    'MC.2.2': 'Explain basic offensive and defensive strategies used in small-sided practice tasks.',
    'MC.2.3': 'Demonstrate understanding of manipulative skills through successful evaluation of performance.',
    'HF.3.1': 'Identify differences between health-related and skill-related fitness components.',
    'HF.3.2': 'Identify differences in aerobic and anaerobic activities.',
    'HF.3.3': 'Develop personal goals to improve three or more of the health-related fitness components.',
    'PR.4.1': 'Demonstrate engagement in physical activity with responsible interpersonal behavior.',
    'PR.4.2': 'Demonstrate understanding of the social benefits gained from participating in physical activities to achieve common goals.',
    'PR.4.3': 'Demonstrate age-appropriate safety principles independently when engaging in various physical activities.',
  },
};

/** Full code, e.g. "PE.3.MS.1.2" */
export function standardCode(grade: Grade, objective: string): string {
  return `PE.${grade}.${objective}`;
}

export function describeStandard(fullCode: string): StandardEntry | undefined {
  const match = /^PE\.(K|[1-5])\.([A-Z]{2}\.\d\.\d)$/.exec(fullCode);
  if (!match) return undefined;
  const [, grade, objective] = match;
  const description = RAW_STANDARDS[grade as Grade]?.[objective];
  if (!description) return undefined;
  return { code: fullCode, description };
}

export function strandOf(fullCode: string): Strand | undefined {
  const match = /^PE\.(?:K|[1-5])\.([A-Z]{2})\./.exec(fullCode);
  return match ? (match[1] as Strand) : undefined;
}
