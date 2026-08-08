import type { Grade } from '../../types/common';
import { gradeLabel } from '../../types/common';
import type { StandardsForGrade } from '../../types/lesson';
import { describeStandard } from '../../data/ncStandards';

interface StandardsEditorProps {
  gradeLevels: Grade[];
  standards: StandardsForGrade[];
  onChange: (standards: StandardsForGrade[]) => void;
}

export function StandardsEditor({ gradeLevels, standards, onChange }: StandardsEditorProps) {
  function codesFor(grade: Grade): string {
    return standards.find((s) => s.grade === grade)?.codes.join(', ') ?? '';
  }

  function setCodes(grade: Grade, text: string) {
    const codes = text
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const next = standards.filter((s) => s.grade !== grade);
    if (codes.length) next.push({ grade, codes });
    onChange(next);
  }

  if (gradeLevels.length === 0) {
    return <p className="text-sm text-gray-500">Select grade levels above to tag NC standards per grade.</p>;
  }

  return (
    <div className="space-y-3">
      {gradeLevels.map((grade) => {
        const codes = standards.find((s) => s.grade === grade)?.codes ?? [];
        return (
          <div key={grade} className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">{gradeLabel(grade)}</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-mono"
              placeholder="e.g. PE.3.MS.1.2, PE.3.PR.4.3"
              value={codesFor(grade)}
              onChange={(e) => setCodes(grade, e.target.value)}
            />
            {codes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {codes.map((code) => {
                  const info = describeStandard(code);
                  return (
                    <span
                      key={code}
                      className={`text-xs px-1.5 py-0.5 rounded ${info ? 'bg-brand-100 text-brand-800' : 'bg-red-100 text-red-700'}`}
                      title={info?.description ?? 'Unrecognized code'}
                    >
                      {code.replace('PE.', '')}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
