import type { SPData, Listing } from '../types';
import { windowState } from './utils';
import { Icons } from './Icons';

interface Props {
  data: SPData;
  listings: Listing[];
  now: Date;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onOpen: (id: string) => void;
}

export function MapPanel({ data, listings, now, selectedId, onSelect, onOpen }: Props) {
  return (
    <aside className="map-panel">
      <div className="map-head">
        <h3>Nearby</h3>
        <span style={{ fontSize: 12, color: 'var(--mute)' }}>
          <span className="live-pulse" style={{ marginRight: 6 }} />
          Live · Eugene
        </span>
      </div>

      <div className="map-svg-wrap">
        <svg viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="river" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(82% 0.06 220)" />
              <stop offset="1" stopColor="oklch(86% 0.05 200)" />
            </linearGradient>
          </defs>
          <path d="M -5 22 Q 30 32 50 18 Q 70 6 105 16" stroke="url(#river)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="74" cy="72" rx="18" ry="11" fill="oklch(86% 0.07 145)" opacity="0.5" />
          <text x="74" y="74" textAnchor="middle" fontSize="3" fill="oklch(40% 0.07 145)" fontFamily="var(--mono)" opacity="0.7">Alton Baker</text>
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1="0" x2="100" y1={28 + i * 10} y2={28 + i * 10} stroke="oklch(88% 0.012 75)" strokeWidth="0.6" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={12 + i * 12} x2={12 + i * 12} y1="14" y2="92" stroke="oklch(88% 0.012 75)" strokeWidth="0.6" />
          ))}
          <line x1="50" y1="14" x2="46" y2="92" stroke="oklch(80% 0.020 75)" strokeWidth="1.2" />
          <text x="48" y="50" fontSize="2.4" fill="oklch(50% 0.02 75)" fontFamily="var(--mono)" transform="rotate(-3, 48, 50)">Willamette</text>
          <g>
            <circle cx="48" cy="58" r="3.2" fill="oklch(60% 0.18 235 / 0.20)" />
            <circle cx="48" cy="58" r="1.6" fill="oklch(50% 0.15 235)" stroke="white" strokeWidth="0.4" />
          </g>
        </svg>

        {listings.map((l, i) => {
          const pin = data.mapPins.find(p => p.id === l.id);
          if (!pin) return null;
          const ws = windowState(l.window, now);
          const cls = l.full || l.claims >= l.max ? 'full' : l.urgent ? 'urgent' : ws.kind === 'future' ? 'future' : '';
          return (
            <button
              key={l.id}
              className={`map-pin ${cls} ${selectedId === l.id ? 'active' : ''}`}
              style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
              onMouseEnter={() => onSelect(l.id)}
              onMouseLeave={() => onSelect(null)}
              onClick={() => onOpen(l.id)}
              title={l.title}
            >
              <span className="dot">{i + 1}</span>
            </button>
          );
        })}
      </div>

      <div className="map-list">
        {listings.slice(0, 6).map((l, i) => {
          const b = data.businesses.find(x => x.id === l.biz)!;
          const ws = windowState(l.window, now);
          const wsShort = ws.label
            .replace('Closes in ', '')
            .replace('Opens in ', 'in ')
            .replace('Open · until ', '→ ');
          return (
            <div
              key={l.id}
              className="row"
              onMouseEnter={() => onSelect(l.id)}
              onMouseLeave={() => onSelect(null)}
              onClick={() => onOpen(l.id)}
            >
              <span className="num">{(i + 1).toString().padStart(2, '0')}</span>
              <span className="t">
                <span style={{ fontWeight: 500 }}>{b.name}</span>
                <span style={{ color: 'var(--mute)' }}> · {l.distance} mi</span>
              </span>
              <span className="w">{wsShort}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
