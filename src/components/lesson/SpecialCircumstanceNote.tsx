import { InfoBox } from '../boxes/InfoBox';

export function SpecialCircumstanceNote({ note }: { note?: string }) {
  if (!note) return null;
  return <InfoBox color="blue">{note}</InfoBox>;
}
