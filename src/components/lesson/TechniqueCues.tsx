import { InfoBox } from '../boxes/InfoBox';

export function TechniqueCues({ cues }: { cues: string[] }) {
  if (!cues.length) return null;
  return (
    <InfoBox color="blue" title="Key Technique Cues">
      <ol className="list-decimal pl-5 space-y-1">
        {cues.map((cue, i) => (
          <li key={i}>{cue}</li>
        ))}
      </ol>
    </InfoBox>
  );
}
