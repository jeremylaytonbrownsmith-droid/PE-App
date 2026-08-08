import type { ScheduleSettings } from '../../types/schedule';
import { DAY_LETTERS } from '../../types/common';
import { DayIdentificationTip } from './DayIdentificationTip';

export function ScheduleTable({ schedule }: { schedule: ScheduleSettings }) {
  if (!schedule.rows.length) return null;
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-brand-100 text-left">
              <th className="border border-brand-200 px-2 py-1">Time</th>
              <th className="border border-brand-200 px-2 py-1">Grade</th>
              {DAY_LETTERS.map((d) => (
                <th key={d} className="border border-brand-200 px-2 py-1">
                  {d} Day
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.rows.map((row) => (
              <tr key={row.id}>
                <td className="border border-brand-200 px-2 py-1 whitespace-nowrap">
                  {row.startTime} – {row.endTime}
                </td>
                <td className="border border-brand-200 px-2 py-1">{row.gradeLabel}</td>
                {DAY_LETTERS.map((d) => (
                  <td key={d} className="border border-brand-200 px-2 py-1">
                    {row.teachers[d] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DayIdentificationTip />
    </div>
  );
}
