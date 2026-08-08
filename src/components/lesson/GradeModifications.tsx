import type { GradeModification } from '../../types/lesson';
import { InfoBox } from '../boxes/InfoBox';
import { gradeLabel } from '../../types/common';

export function GradeModifications({ mods }: { mods: GradeModification[] }) {
  if (!mods.length) return null;
  return (
    <div className="space-y-2">
      {mods.map((mod) => (
        <InfoBox key={mod.id} color="orange" title={mod.grades.map(gradeLabel).join(', ')}>
          {mod.note}
        </InfoBox>
      ))}
    </div>
  );
}
