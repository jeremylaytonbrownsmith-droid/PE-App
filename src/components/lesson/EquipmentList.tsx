import type { EquipmentItem } from '../../types/lesson';
import { InfoBox } from '../boxes/InfoBox';

export function EquipmentList({ items }: { items: EquipmentItem[] }) {
  if (!items.length) return null;
  const warnings = items.filter((i) => i.warning);
  return (
    <div className="space-y-2">
      <p className="font-semibold">Equipment Needed:</p>
      <ul className="list-disc pl-5 text-sm space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            {item.note && <span className="text-gray-600"> – {item.note}</span>}
          </li>
        ))}
      </ul>
      {warnings.map((item) => (
        <InfoBox key={item.id} color="red">
          {item.warning}
        </InfoBox>
      ))}
    </div>
  );
}
