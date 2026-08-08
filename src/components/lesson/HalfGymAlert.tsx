import { InfoBox } from '../boxes/InfoBox';

export function HalfGymAlert({ reason }: { reason?: string }) {
  return (
    <InfoBox color="red" title="IMPORTANT – HALF GYM ONLY">
      {reason ? `${reason} ` : ''}You will only have about half the space available. This lesson is designed for
      the smaller space.
    </InfoBox>
  );
}
