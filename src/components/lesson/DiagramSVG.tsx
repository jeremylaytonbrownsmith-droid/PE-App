import type { ReactNode } from 'react';

export type DiagramVariant = 'goals' | 'court' | 'endzone' | 'stations';

interface DiagramSVGProps {
  variant: DiagramVariant;
}

const GYM = { x: 20, y: 20, width: 360, height: 200 };
const MID_X = GYM.x + GYM.width / 2;

function Gym({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-md mx-auto" role="img" aria-label="Gym setup diagram">
      <rect x={GYM.x} y={GYM.y} width={GYM.width} height={GYM.height} rx={8} fill="#fafafa" stroke="#9ca3af" strokeWidth={2} />
      <text x={MID_X} y={GYM.y - 6} textAnchor="middle" className="fill-gray-500" fontSize={11} fontWeight={600}>
        WALL
      </text>
      <text x={MID_X} y={GYM.y + GYM.height + 16} textAnchor="middle" className="fill-gray-500" fontSize={11} fontWeight={600}>
        STAGE
      </text>
      {children}
    </svg>
  );
}

function Teacher() {
  return (
    <g>
      <circle cx={MID_X} cy={GYM.y + GYM.height / 2} r={7} fill="#7B1FA2" />
      <text x={MID_X} y={GYM.y + GYM.height / 2 + 3} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={700}>
        T
      </text>
    </g>
  );
}

function Goal({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const d = flip ? `M ${x - 14} ${y - 10} L ${x - 14} ${y + 10} M ${x - 14} ${y - 10} Q ${x} ${y - 10} ${x} ${y} Q ${x} ${y + 10} ${x - 14} ${y + 10}` : `M ${x + 14} ${y - 10} L ${x + 14} ${y + 10} M ${x + 14} ${y - 10} Q ${x} ${y - 10} ${x} ${y} Q ${x} ${y + 10} ${x + 14} ${y + 10}`;
  return <path d={d} fill="none" stroke="#2196F3" strokeWidth={3} strokeLinecap="round" />;
}

function Cone({ x, y }: { x: number; y: number }) {
  return <path d={`M ${x} ${y - 7} L ${x + 6} ${y + 6} L ${x - 6} ${y + 6} Z`} fill="#FF9800" />;
}

function Student({ x, y }: { x: number; y: number }) {
  return (
    <text x={x} y={y} fontSize={11} fill="#374151" fontWeight={600}>
      x
    </text>
  );
}

function Ball({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4} fill="#111827" />;
}

function CenterLine() {
  return (
    <line x1={MID_X} y1={GYM.y} x2={MID_X} y2={GYM.y + GYM.height} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 4" />
  );
}

function TeamLabels({ left, right }: { left: string; right: string }) {
  return (
    <>
      <text x={GYM.x + GYM.width * 0.25} y={GYM.y + GYM.height + 30} textAnchor="middle" fontSize={10} className="fill-gray-600">
        {left}
      </text>
      <text x={GYM.x + GYM.width * 0.75} y={GYM.y + GYM.height + 30} textAnchor="middle" fontSize={10} className="fill-gray-600">
        {right}
      </text>
    </>
  );
}

function Legend({ items }: { items: { swatch: ReactNode; label: string }[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-1 text-xs text-gray-500">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <svg width={16} height={16} viewBox="0 0 16 16">
            {item.swatch}
          </svg>
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function DiagramSVG({ variant }: DiagramSVGProps) {
  const quarterX1 = GYM.x + GYM.width * 0.12;
  const quarterX2 = GYM.x + GYM.width * 0.38;
  const quarterX3 = GYM.x + GYM.width * 0.62;
  const quarterX4 = GYM.x + GYM.width * 0.88;
  const topY = GYM.y + GYM.height * 0.28;
  const botY = GYM.y + GYM.height * 0.72;

  if (variant === 'goals') {
    return (
      <div>
        <Gym>
          <CenterLine />
          <Goal x={quarterX1} y={topY} />
          <Goal x={quarterX1} y={botY} />
          <Goal x={quarterX4} y={topY} flip />
          <Goal x={quarterX4} y={botY} flip />
          <Teacher />
          <Student x={quarterX2 - 10} y={topY} />
          <Student x={quarterX2 + 6} y={botY + 4} />
          <Ball x={quarterX2} y={GYM.y + GYM.height / 2} />
          <Student x={quarterX3 - 6} y={topY - 4} />
          <Student x={quarterX3 + 8} y={botY} />
          <Ball x={quarterX3} y={GYM.y + GYM.height / 2} />
          <TeamLabels left="Team A / Team B" right="Team C / Team D" />
        </Gym>
        <Legend
          items={[
            { swatch: <path d="M4 3 L4 13 M4 3 Q10 3 10 8 Q10 13 4 13" fill="none" stroke="#2196F3" strokeWidth={2} />, label: 'Goal' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#111827" />, label: 'Ball' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Two games run at the same time (left side &amp; right side).</p>
      </div>
    );
  }

  if (variant === 'court') {
    const netY = GYM.y + GYM.height / 2;
    return (
      <div>
        <Gym>
          <CenterLine />
          <line x1={GYM.x + 8} y1={netY} x2={MID_X - 8} y2={netY} stroke="#16a34a" strokeWidth={2} />
          <line x1={MID_X + 8} y1={netY} x2={GYM.x + GYM.width - 8} y2={netY} stroke="#16a34a" strokeWidth={2} />
          <Teacher />
          <Student x={quarterX1} y={topY} />
          <Student x={quarterX1 + 10} y={topY + 8} />
          <Student x={quarterX1} y={botY} />
          <Student x={quarterX4 - 10} y={topY} />
          <Student x={quarterX4} y={botY} />
          <Student x={quarterX4 - 8} y={botY - 8} />
          <TeamLabels left="Court 1" right="Court 2" />
        </Gym>
        <Legend
          items={[
            { swatch: <line x1={2} y1={8} x2={14} y2={8} stroke="#16a34a" strokeWidth={2} />, label: 'Net line (jump rope)' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Two courts run at the same time, side by side.</p>
      </div>
    );
  }

  if (variant === 'endzone') {
    const zoneW = 26;
    return (
      <div>
        <Gym>
          <CenterLine />
          <rect x={GYM.x + 4} y={GYM.y + 4} width={GYM.width / 2 - 8} height={zoneW} fill="#F44336" opacity={0.15} />
          <rect x={GYM.x + 4} y={GYM.y + GYM.height - zoneW - 4} width={GYM.width / 2 - 8} height={zoneW} fill="#F44336" opacity={0.15} />
          <rect x={MID_X + 4} y={GYM.y + 4} width={GYM.width / 2 - 8} height={zoneW} fill="#F44336" opacity={0.15} />
          <rect x={MID_X + 4} y={GYM.y + GYM.height - zoneW - 4} width={GYM.width / 2 - 8} height={zoneW} fill="#F44336" opacity={0.15} />
          <Cone x={quarterX1} y={GYM.y + 4 + zoneW / 2} />
          <Cone x={quarterX1} y={GYM.y + GYM.height - 4 - zoneW / 2} />
          <Cone x={quarterX4} y={GYM.y + 4 + zoneW / 2} />
          <Cone x={quarterX4} y={GYM.y + GYM.height - 4 - zoneW / 2} />
          <Teacher />
          <Student x={quarterX1 + 6} y={GYM.y + GYM.height / 2} />
          <Student x={quarterX4 - 10} y={GYM.y + GYM.height / 2 - 10} />
          <TeamLabels left="Half A" right="Half B" />
        </Gym>
        <Legend
          items={[
            { swatch: <rect x={2} y={4} width={12} height={8} fill="#F44336" opacity={0.3} />, label: 'End zone' },
            { swatch: <path d="M8 3 L13 13 L3 13 Z" fill="#FF9800" />, label: 'Cone' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Two end-zone games run at the same time (left half &amp; right half).</p>
      </div>
    );
  }

  const stationPoints = [
    { x: GYM.x + 10, y: GYM.y + 10 },
    { x: MID_X, y: GYM.y + 8 },
    { x: GYM.x + GYM.width - 10, y: GYM.y + 10 },
    { x: GYM.x + GYM.width - 8, y: GYM.y + GYM.height / 2 },
    { x: GYM.x + GYM.width - 10, y: GYM.y + GYM.height - 10 },
    { x: MID_X, y: GYM.y + GYM.height - 8 },
    { x: GYM.x + 10, y: GYM.y + GYM.height - 10 },
    { x: GYM.x + 8, y: GYM.y + GYM.height / 2 },
  ];

  return (
    <div>
      <Gym>
        <Teacher />
        {stationPoints.map((p, i) => (
          <g key={i}>
            <Cone x={p.x} y={p.y} />
            <Student x={p.x + 8} y={p.y + 4} />
          </g>
        ))}
      </Gym>
      <Legend
        items={[
          { swatch: <path d="M8 3 L13 13 L3 13 Z" fill="#FF9800" />, label: 'Station (cone)' },
          { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
          { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
        ]}
      />
      <p className="text-xs text-gray-400 text-center mt-1">Stations spread around the perimeter - groups rotate through each one.</p>
    </div>
  );
}
