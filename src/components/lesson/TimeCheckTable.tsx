import type { TimeCheckRow } from '../../lib/timeCheck';

export function TimeCheckTable({ rows, totalMinutes }: { rows: TimeCheckRow[]; totalMinutes: number }) {
  return (
    <div>
      <p className="font-semibold mb-2">
        45-Minute Time Check
        {totalMinutes !== 45 && (
          <span className="ml-2 text-sm font-normal text-gray-500">(required activities total {totalMinutes} minutes)</span>
        )}
      </p>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-brand-100 text-left">
            <th className="border border-brand-200 px-2 py-1">Activity</th>
            <th className="border border-brand-200 px-2 py-1">Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border border-brand-200 px-2 py-1">{row.label}</td>
              <td className="border border-brand-200 px-2 py-1 whitespace-nowrap">{row.minutesLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
