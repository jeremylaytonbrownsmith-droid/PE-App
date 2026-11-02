import type { ReactNode } from 'react';

export type DiagramVariant = 'goals' | 'court' | 'endzone' | 'stations' | 'circle' | 'personal-space' | 'lanes' | 'partners' | 'diamond' | 'open-floor' | 'ice-cream-tag';

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

function Tagger({ x, y }: { x: number; y: number }) {
  return (
    <text x={x} y={y} fontSize={11} fill="#F44336" fontWeight={700}>
      T
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

  if (variant === 'circle') {
    const cx = MID_X;
    const cy = GYM.y + GYM.height / 2;
    const rx = GYM.width * 0.42;
    const ry = GYM.height * 0.42;
    const circleStudents = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
    });
    return (
      <div>
        <Gym>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 4" />
          {circleStudents.map((p, i) => (
            <Student key={i} x={p.x - 4} y={p.y + 4} />
          ))}
          <Teacher />
        </Gym>
        <Legend
          items={[
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Whole class forms one big circle - teacher calls the activity from the center or edge.</p>
      </div>
    );
  }

  if (variant === 'personal-space') {
    const cols = 6;
    const rows = 3;
    const gridStudents: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gridStudents.push({
          x: GYM.x + 28 + c * ((GYM.width - 56) / (cols - 1)),
          y: GYM.y + 30 + r * ((GYM.height - 60) / (rows - 1)),
        });
      }
    }
    return (
      <div>
        <Gym>
          <Teacher />
          {gridStudents.map((p, i) => (
            <Student key={i} x={p.x} y={p.y} />
          ))}
        </Gym>
        <Legend
          items={[
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student, own space' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Students spread out evenly, each with their own personal-space bubble and equipment.</p>
      </div>
    );
  }

  if (variant === 'lanes') {
    const laneCount = 4;
    const laneY = Array.from({ length: laneCount }, (_, i) => GYM.y + 22 + i * ((GYM.height - 44) / (laneCount - 1)));
    const leftX = GYM.x + 20;
    const rightX = GYM.x + GYM.width - 20;
    return (
      <div>
        <Gym>
          <Teacher />
          {laneY.map((y, i) => (
            <g key={i}>
              <line x1={leftX} y1={y} x2={rightX} y2={y} stroke="#d1d5db" strokeWidth={1} strokeDasharray="3 3" />
              <Cone x={leftX} y={y} />
              <Cone x={rightX} y={y} />
              <Student x={leftX + 10} y={y + 4} />
              <Student x={leftX + 22} y={y + 4} />
            </g>
          ))}
        </Gym>
        <Legend
          items={[
            { swatch: <path d="M8 3 L13 13 L3 13 Z" fill="#FF9800" />, label: 'Cone (turnaround point)' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Teams line up behind a cone in parallel lanes and travel to the far cone and back.</p>
      </div>
    );
  }

  if (variant === 'diamond') {
    const home = { x: MID_X, y: GYM.y + GYM.height - 20 };
    const first = { x: MID_X + 90, y: GYM.y + GYM.height * 0.55 };
    const second = { x: MID_X, y: GYM.y + 24 };
    const third = { x: MID_X - 90, y: GYM.y + GYM.height * 0.55 };
    return (
      <div>
        <Gym>
          <path
            d={`M ${home.x} ${home.y} L ${first.x} ${first.y} L ${second.x} ${second.y} L ${third.x} ${third.y} Z`}
            fill="none"
            stroke="#9ca3af"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <Cone x={home.x} y={home.y} />
          <Cone x={first.x} y={first.y} />
          <Cone x={second.x} y={second.y} />
          <Cone x={third.x} y={third.y} />
          <Ball x={home.x} y={home.y - 16} />
          <Student x={home.x + 8} y={home.y - 12} />
          <Student x={first.x + 10} y={first.y} />
          <Student x={second.x - 30} y={second.y + 20} />
          <Student x={third.x - 10} y={third.y} />
          <Teacher />
        </Gym>
        <Legend
          items={[
            { swatch: <path d="M8 3 L13 13 L3 13 Z" fill="#FF9800" />, label: 'Base' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#111827" />, label: 'Tee / ball' },
            { swatch: <circle cx={8} cy={8} r={3} fill="#7B1FA2" />, label: 'Teacher' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Home plate and three bases laid out in a diamond, batting tee at home plate, fielders spread out.</p>
      </div>
    );
  }

  if (variant === 'partners') {
    const pairCount = 4;
    const pairY = Array.from({ length: pairCount }, (_, i) => GYM.y + 26 + i * ((GYM.height - 52) / (pairCount - 1)));
    const leftX = MID_X - 55;
    const rightX = MID_X + 55;
    return (
      <div>
        <Gym>
          <Teacher />
          {pairY.map((y, i) => (
            <g key={i}>
              <line x1={leftX + 10} y1={y} x2={rightX - 10} y2={y} stroke="#d1d5db" strokeWidth={1} strokeDasharray="3 3" />
              <Student x={leftX} y={y + 4} />
              <Student x={rightX} y={y + 4} />
            </g>
          ))}
        </Gym>
        <Legend items={[{ swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' }]} />
        <p className="text-xs text-gray-400 text-center mt-1">Partners spread out facing each other across the gym, an arm’s length of extra room on each side.</p>
      </div>
    );
  }

  if (variant === 'open-floor') {
    const scattered = [
      { x: GYM.x + 30, y: GYM.y + 35 },
      { x: GYM.x + 70, y: GYM.y + 150 },
      { x: GYM.x + 110, y: GYM.y + 70 },
      { x: GYM.x + 150, y: GYM.y + 160 },
      { x: GYM.x + 250, y: GYM.y + 40 },
      { x: GYM.x + 280, y: GYM.y + 150 },
      { x: GYM.x + 320, y: GYM.y + 90 },
      { x: GYM.x + 330, y: GYM.y + 170 },
      { x: GYM.x + 200, y: GYM.y + 100 },
    ];
    const taggers = [
      { x: GYM.x + 170, y: GYM.y + 50 },
      { x: GYM.x + 100, y: GYM.y + 170 },
    ];
    return (
      <div>
        <Gym>
          {scattered.map((p, i) => (
            <Student key={i} x={p.x} y={p.y} />
          ))}
          {taggers.map((p, i) => (
            <Tagger key={i} x={p.x} y={p.y} />
          ))}
        </Gym>
        <Legend
          items={[
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700} fill="#F44336">T</text>, label: 'Tagger(s)' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700}>x</text>, label: 'Student' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">No equipment setup required - students spread out across the open floor, with a few chosen as taggers.</p>
      </div>
    );
  }

  if (variant === 'ice-cream-tag') {
    const waitingGroups = [
      { x: GYM.x + 20, y: GYM.y + 35 },
      { x: GYM.x + 20, y: GYM.y + 100 },
      { x: GYM.x + 20, y: GYM.y + 165 },
      { x: GYM.x + GYM.width - 20, y: GYM.y + 35 },
      { x: GYM.x + GYM.width - 20, y: GYM.y + 100 },
      { x: GYM.x + GYM.width - 20, y: GYM.y + 165 },
    ];
    const carriers = [
      { x: GYM.x + 140, y: GYM.y + 55 },
      { x: GYM.x + 190, y: GYM.y + 135 },
    ];
    const taggers = [
      { x: GYM.x + 110, y: GYM.y + 110 },
      { x: GYM.x + 240, y: GYM.y + 70 },
    ];
    return (
      <div>
        <Gym>
          {waitingGroups.map((g, i) => (
            <g key={i}>
              <circle cx={g.x - 7} cy={g.y} r={3.5} fill="#7B1FA2" />
              <circle cx={g.x + 7} cy={g.y} r={3.5} fill="#7B1FA2" />
              <circle cx={g.x} cy={g.y + 9} r={3.5} fill="#7B1FA2" />
            </g>
          ))}
          {carriers.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r={5} fill="#2563eb" />
              <Cone x={c.x} y={c.y - 11} />
            </g>
          ))}
          {taggers.map((t, i) => (
            <Tagger key={i} x={t.x} y={t.y} />
          ))}
        </Gym>
        <Legend
          items={[
            { swatch: <circle cx={8} cy={8} r={4} fill="#7B1FA2" />, label: 'Group (waiting for their turn)' },
            { swatch: <circle cx={8} cy={8} r={4} fill="#2563eb" />, label: 'Ice cream carrier (ball on cone)' },
            { swatch: <text x={4} y={12} fontSize={10} fontWeight={700} fill="#F44336">T</text>, label: 'Tagger (noodle)' },
          ]}
        />
        <p className="text-xs text-gray-400 text-center mt-1">Groups wait on each side of the gym. One carrier per group balances the ball on their cone and moves through the middle while taggers try to tap it off with a noodle.</p>
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
