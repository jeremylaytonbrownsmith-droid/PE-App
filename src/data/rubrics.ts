import type { Rubric } from '../types/lesson';

export const LOCOMOTOR_SKILLS_RUBRIC: Rubric = {
  title: 'Locomotor Skills Rubric',
  levels: [
    { score: 1, label: 'Seldom', description: 'Student does not demonstrate any of the essential elements used in any locomotor skills.' },
    { score: 2, label: 'Sometimes', description: 'Student demonstrates essential elements of mature patterns of 1-3 locomotor skills using various pathways.' },
    { score: 3, label: 'Consistently', description: 'Student demonstrates the proper essential elements of a mature pattern in 4-5 locomotor skills using various pathways.' },
    {
      score: 4,
      label: 'Exceeds',
      description:
        'Student demonstrates the proper essential elements of a mature pattern in 4-5 locomotor skills using various pathways. In addition, they can verbalize more than 2 of the essential elements of any given locomotor or non-locomotor skill.',
    },
  ],
};
