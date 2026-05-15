// SparePlate shared components
function fmtTime(iso, now) {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const am = h < 12;
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2,'0')}${am ? 'a' : 'p'}`;
}

function windowState(window, now) {
  const start = new Date(window.start);
  const end = new Date(window.end);
  const diffStart = (start - now) / 60000;
  const diffEnd = (end - now) / 60000;
  if (diffEnd < 0) return { kind: 'past', label: 'Window closed' };
  if (diffStart > 0) {
    if (diffStart < 90) return { kind: 'future', label: `Opens in ${Math.round(diffStart)}m` };
    return { kind: 'future', label: `Opens ${fmtTime(window.start, now)}` };
  }
  // open now
  if (diffEnd < 60) return { kind: 'urgent', label: `Closes in ${Math.round(diffEnd)}m` };
  return { kind: 'now', label: `Open · until ${fmtTime(window.end, now)}` };
}

function ListingCard({ listing, biz, onOpen, now, data }) {
  const c = data.cat[listing.category];
  const ws = windowState(listing.window, now);
  const filled = listing.claims / listing.max;
  const I = window.SPIcons;
  const full = listing.full || listing.claims >= listing.max;

  return (
    <article className={`card ${full ? 'full' : ''}`} onClick={() => onOpen(listing.id)}>
      <div className="card-hero" style={{ '--hero-color': c.color }}>
        <div className="top">
          {full ? <span className="flag full">Fully claimed</span>
            : listing.urgent ? <span className="flag urgent">Urgent · go now</span>
            : ws.kind === 'now' ? <span className="flag new">Open now</span>
            : <span className="flag">{c.label}</span>}
          <span className="flag" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <I.Pin size={10}/>{listing.distance} mi
          </span>
        </div>
        <span className="emoji">{c.emoji}</span>
      </div>
      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-biz">
          {biz.verified && <span className="verified"><I.Check size={7} sw={3}/></span>}
          <span>{biz.name}</span>
          <span style={{ color: 'var(--mute-2)' }}>·</span>
          <span>{biz.hood}</span>
        </div>
        <div className="card-foot">
          <span className={`window-pill ${ws.kind}`}>
            <I.Clock size={11}/>{ws.label}
          </span>
          <span className={`qty ${filled >= 1 ? 'full' : filled >= 0.66 ? 'low' : ''}`}>
            <span className="bar"><span style={{ width: `${Math.min(100, filled * 100)}%` }}/></span>
            {listing.servings} servings
          </span>
        </div>
        {listing.diet.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {listing.diet.map(d => <span key={d} className="diet-chip">{d}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}

function MapPanel({ data, listings, now, selectedId, onSelect, onOpen }) {
  const I = window.SPIcons;
  return (
    <aside className="map-panel">
      <div className="map-head">
        <h3>Nearby</h3>
        <span style={{ fontSize: 12, color: 'var(--mute)' }}>
          <span className="live-pulse" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }}/>
          Live · Eugene
        </span>
      </div>
      <div className="map-svg-wrap">
        <svg viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true">
          {/* stylized streets */}
          <defs>
            <linearGradient id="river" x1="0" x2="1">
              <stop offset="0" stopColor="oklch(82% 0.06 220)"/>
              <stop offset="1" stopColor="oklch(86% 0.05 200)"/>
            </linearGradient>
          </defs>
          {/* River curve */}
          <path d="M -5 22 Q 30 32 50 18 Q 70 6 105 16" stroke="url(#river)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8"/>
          {/* park */}
          <ellipse cx="74" cy="72" rx="18" ry="11" fill="oklch(86% 0.07 145)" opacity="0.5"/>
          <text x="74" y="74" textAnchor="middle" fontSize="3" fill="oklch(40% 0.07 145)" fontFamily="var(--mono)" opacity="0.7">Alton Baker</text>
          {/* main streets */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1="0" x2="100" y1={28 + i * 10} y2={28 + i * 10}
              stroke="oklch(88% 0.012 75)" strokeWidth="0.6"/>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={12 + i * 12} x2={12 + i * 12} y1="14" y2="92"
              stroke="oklch(88% 0.012 75)" strokeWidth="0.6"/>
          ))}
          {/* highlighted Willamette street */}
          <line x1="50" y1="14" x2="46" y2="92" stroke="oklch(80% 0.020 75)" strokeWidth="1.2"/>
          <text x="48" y="50" fontSize="2.4" fill="oklch(50% 0.02 75)" fontFamily="var(--mono)" transform="rotate(-3, 48, 50)">Willamette</text>
          {/* user dot */}
          <g>
            <circle cx="48" cy="58" r="3.2" fill="oklch(60% 0.18 235 / 0.20)"/>
            <circle cx="48" cy="58" r="1.6" fill="oklch(50% 0.15 235)" stroke="white" strokeWidth="0.4"/>
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
          const b = data.businesses.find(x => x.id === l.biz);
          const ws = windowState(l.window, now);
          return (
            <div className="row" key={l.id}
              onMouseEnter={() => onSelect(l.id)}
              onMouseLeave={() => onSelect(null)}
              onClick={() => onOpen(l.id)}>
              <span className="num">{(i+1).toString().padStart(2,'0')}</span>
              <span className="t">
                <span style={{ fontWeight: 500 }}>{b.name}</span>
                <span style={{ color: 'var(--mute)' }}> · {l.distance} mi</span>
              </span>
              <span className="w">{ws.label.replace('Closes in ', '').replace('Opens in ', 'in ').replace('Open · until ', '→ ')}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// Tiny SVG sparkline
function Sparkline({ values, w = 64, h = 22, color = 'var(--leaf-2)' }) {
  const mn = Math.min(...values), mx = Math.max(...values);
  const r = mx - mn || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => `${i * step},${h - ((v - mn) / r) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Line chart with filled area
function AreaLine({ values, labels, w = 720, h = 200, color = 'oklch(58% 0.14 40)' }) {
  const pad = { t: 14, r: 14, b: 24, l: 32 };
  const inner = { w: w - pad.l - pad.r, h: h - pad.t - pad.b };
  const mx = Math.max(...values) * 1.1;
  const step = inner.w / (values.length - 1);
  const pts = values.map((v, i) => ({ x: pad.l + i * step, y: pad.t + inner.h - (v / mx) * inner.h }));
  const linePath = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const area = `${linePath} L${pts[pts.length-1].x},${pad.t + inner.h} L${pts[0].x},${pad.t + inner.h} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(mx * t));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', width: '100%' }}>
      {yTicks.map((v, i) => {
        const y = pad.t + inner.h - (v / mx) * inner.h;
        return (
          <g key={i}>
            <line x1={pad.l} x2={pad.l + inner.w} y1={y} y2={y}
              stroke="oklch(91% 0.012 75)" strokeDasharray={i === 0 ? '' : '2,3'}/>
            <text x={pad.l - 6} y={y + 3} textAnchor="end" fontSize="10" fill="oklch(55% 0.01 75)" fontFamily="var(--mono)">{v}</text>
          </g>
        );
      })}
      <path d={area} fill={color} fillOpacity="0.12"/>
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={color}/>
      ))}
      {labels && labels.map((l, i) => (
        i % 2 === 0 ? (
          <text key={i} x={pad.l + i * step} y={h - 6} textAnchor="middle" fontSize="10" fill="oklch(55% 0.01 75)" fontFamily="var(--mono)">{l}</text>
        ) : null
      ))}
    </svg>
  );
}

Object.assign(window, { fmtTime, windowState, ListingCard, MapPanel, Sparkline, AreaLine });
