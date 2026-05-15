import type { Listing, Business, SPData } from '../types';
import { windowState } from './utils';
import { Icons } from './Icons';

interface Props {
  listing: Listing;
  biz: Business;
  onOpen: (id: string) => void;
  now: Date;
  data: SPData;
}

export function ListingCard({ listing, biz, onOpen, now, data }: Props) {
  const c = data.cat[listing.category];
  const ws = windowState(listing.window, now);
  const filled = listing.claims / listing.max;
  const full = listing.full || listing.claims >= listing.max;

  return (
    <article className={`card ${full ? 'full' : ''}`} onClick={() => onOpen(listing.id)}>
      <div className="card-hero" style={{ '--hero-color': c.color } as React.CSSProperties}>
        <div className="top">
          {full ? (
            <span className="flag full">Fully claimed</span>
          ) : listing.urgent ? (
            <span className="flag urgent">Urgent · go now</span>
          ) : ws.kind === 'now' ? (
            <span className="flag new">Open now</span>
          ) : (
            <span className="flag">{c.label}</span>
          )}
          <span className="flag" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <Icons.Pin size={10} />{listing.distance} mi
          </span>
        </div>
        <span className="emoji">{c.emoji}</span>
      </div>

      <div className="card-body">
        <div className="card-title">{listing.title}</div>
        <div className="card-biz">
          {biz.verified && (
            <span className="verified"><Icons.Check size={7} sw={3} /></span>
          )}
          <span>{biz.name}</span>
          <span style={{ color: 'var(--mute-2)' }}>·</span>
          <span>{biz.hood}</span>
        </div>
        <div className="card-foot">
          <span className={`window-pill ${ws.kind}`}>
            <Icons.Clock size={11} />{ws.label}
          </span>
          <span className={`qty ${filled >= 1 ? 'full' : filled >= 0.66 ? 'low' : ''}`}>
            <span className="bar"><span style={{ width: `${Math.min(100, filled * 100)}%` }} /></span>
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
