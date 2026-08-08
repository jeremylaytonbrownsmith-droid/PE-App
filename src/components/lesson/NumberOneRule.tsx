import { InfoBox } from '../boxes/InfoBox';

export function NumberOneRule({ rule }: { rule: string }) {
  if (!rule) return null;
  return (
    <InfoBox color="yellow" title="⚠ Number One Rule">
      {rule}
    </InfoBox>
  );
}
