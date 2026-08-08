import type { StandardsForGrade } from '../../types/lesson';
import { describeStandard, strandOf, STRAND_LABEL, STRAND_COLOR, type Strand } from '../../data/ncStandards';
import { gradeLabel } from '../../types/common';

const ALL_STRANDS: Strand[] = ['MS', 'MC', 'HF', 'PR'];

export function NCStandardsPanel({ standards }: { standards?: StandardsForGrade[] }) {
  if (!standards || standards.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">NC Standards Addressed</h2>
      <p className="text-xs text-gray-500">NC Standard Course of Study, K-12 Physical Education (2024)</p>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {ALL_STRANDS.map((strand) => (
          <span key={strand} className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STRAND_COLOR[strand] }} />
            {STRAND_LABEL[strand]}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {standards.map((entry) => (
          <div key={entry.grade}>
            <p className="text-sm font-semibold text-gray-800">{gradeLabel(entry.grade)}</p>
            <ul className="text-sm space-y-1.5 mt-1">
              {entry.codes.map((code) => {
                const info = describeStandard(code);
                const strand = strandOf(code);
                const color = strand ? STRAND_COLOR[strand] : '#9ca3af';
                return (
                  <li key={code} className="flex gap-2">
                    <span
                      className="shrink-0 rounded text-xs font-mono px-1.5 py-0.5 h-fit whitespace-nowrap text-white"
                      style={{ backgroundColor: color }}
                    >
                      {code.replace('PE.', '')}
                    </span>
                    <span className="text-gray-600">
                      {strand && <span className="text-gray-400">({STRAND_LABEL[strand]}) </span>}
                      {info?.description ?? 'Unknown standard code.'}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
