interface SparklineProps {
  values: number[];
  w?: number;
  h?: number;
  color?: string;
}

export function Sparkline({ values, w = 64, h = 22, color = 'var(--leaf-2)' }: SparklineProps) {
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const r = mx - mn || 1;
  const step = w / (values.length - 1);
  const pts = values
    .map((v, i) => `${i * step},${h - ((v - mn) / r) * (h - 4) - 2}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface AreaLineProps {
  values: number[];
  labels?: string[];
  w?: number;
  h?: number;
  color?: string;
}

export function AreaLine({ values, labels, w = 720, h = 200, color = 'oklch(58% 0.14 40)' }: AreaLineProps) {
  const pad = { t: 14, r: 14, b: 24, l: 32 };
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b };
  const mx = Math.max(...values) * 1.1;
  const step = inner.w / (values.length - 1);
  const pts = values.map((v, i) => ({
    x: pad.l + i * step,
    y: pad.t + inner.h - (v / mx) * inner.h,
  }));
  const linePath = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const area = `${linePath} L${pts[pts.length - 1].x},${pad.t + inner.h} L${pts[0].x},${pad.t + inner.h} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(mx * t));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%' }}>
      {yTicks.map((v, i) => {
        const y = pad.t + inner.h - (v / mx) * inner.h;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + inner.w} y1={y} y2={y}
              stroke="oklch(91% 0.012 75)" strokeDasharray={i === 0 ? '' : '2,3'} />
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="10"
              fill="oklch(55% 0.01 75)" fontFamily="var(--mono)">{v}</text>
          </g>
        );
      })}
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={color} />)}
      {labels && labels.map((l, i) =>
        i % 2 === 0 ? (
          <text key={i} x={pad.l + i * step} y={h - 6} textAnchor="middle" fontSize="10"
            fill="oklch(55% 0.01 75)" fontFamily="var(--mono)">{l}</text>
        ) : null
      )}
    </svg>
  );
}
