'use client';

import { useState } from 'react';
import type { AppContext, Listing } from '../types';
import { windowState, fmtTime } from './utils';
import { Icons } from './Icons';

interface Props {
  ctx: AppContext;
  listing: Listing;
  onClose: () => void;
}

export function ListingDrawer({ ctx, listing, onClose }: Props) {
  const { data, now, claimListing } = ctx;
  const [reserved, setReserved] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const biz = data.businesses.find(b => b.id === listing.biz)!;
  const c = data.cat[listing.category];
  const ws = windowState(listing.window, now);
  const pin = data.mapPins.find(p => p.id === listing.id);

  const countdownBg =
    ws.kind === 'urgent' ? 'var(--terra-50)' :
    ws.kind === 'now'    ? 'var(--leaf-50)'  : 'var(--cream-2)';
  const countdownBorder =
    ws.kind === 'urgent' ? 'var(--terra-100)' :
    ws.kind === 'now'    ? 'var(--leaf-100)'  : 'var(--line)';
  const countdownColor =
    ws.kind === 'urgent' ? 'var(--terra-ink)' :
    ws.kind === 'now'    ? 'var(--leaf-ink)'  : 'var(--ink)';
  const countdownLabelColor =
    ws.kind === 'urgent' ? 'var(--terra-ink)' :
    ws.kind === 'now'    ? 'var(--leaf-ink)'  : 'var(--mute)';

  function reserve() {
    const generated = Math.random().toString(36).slice(2, 6).toUpperCase();
    setCode(generated);
    setReserved(true);
    claimListing(listing.id);
  }

  const canReserve = !listing.full && listing.claims < listing.max && ws.kind !== 'past';

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-head">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--mute)' }}>{listing.id}</span>
          <button className="icon-btn" onClick={onClose}><Icons.X size={14} /></button>
        </div>

        <div className="drawer-body">
          {!reserved ? (
            <>
              <div className="drawer-hero" style={{ '--hero-color': c.color } as React.CSSProperties}>
                <span className="tag flag" style={{ background: 'rgba(255,255,255,0.9)' }}>{c.label}</span>
                <span className="emoji">{c.emoji}</span>
              </div>

              <div className="drawer-content">
                <h3>{listing.title}</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {listing.diet.map(d => <span key={d} className="diet-chip">{d}</span>)}
                </div>

                <div className="biz-row">
                  <div className="ava">{biz.name.split(' ').map(x => x[0]).join('').slice(0, 2)}</div>
                  <div className="info">
                    <div className="name">
                      {biz.name}{' '}
                      {biz.verified && <Icons.Check size={12} style={{ color: 'var(--leaf-2)' }} />}
                    </div>
                    <div className="addr">{biz.address} · {biz.hood}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>★ {biz.rating}</span>
                </div>

                <div className="countdown" style={{ background: countdownBg, borderColor: countdownBorder }}>
                  <div>
                    <div className="label" style={{ color: countdownLabelColor }}>Pickup window</div>
                    <div className="value" style={{ color: countdownColor }}>
                      {fmtTime(listing.window.start)} – {fmtTime(listing.window.end)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {ws.label}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
                      {listing.claims}/{listing.max} bags claimed
                    </div>
                  </div>
                </div>

                <dl className="kv">
                  <dt>Servings</dt><dd>~{listing.servings} ({listing.weight})</dd>
                  <dt>Pickup at</dt><dd>{biz.address}</dd>
                  <dt>Pickup note</dt>
                  <dd>{listing.notes || <span className="dist">No specific notes</span>}</dd>
                  <dt>Container</dt><dd>Reusable bag preferred. Compostable bag provided if needed.</dd>
                  <dt>Posted by</dt><dd>{biz.name} · verified partner since Mar 2026</dd>
                </dl>

                <div className="minimap" aria-hidden="true">
                  <svg viewBox="0 0 100 92" preserveAspectRatio="none">
                    <path d="M -5 22 Q 30 32 50 18 Q 70 6 105 16" stroke="oklch(82% 0.06 220)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <line key={i} x1="0" x2="100" y1={32 + i * 12} y2={32 + i * 12} stroke="oklch(88% 0.012 75)" strokeWidth="0.6" />
                    ))}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <line key={i} x1={14 + i * 14} x2={14 + i * 14} y1="14" y2="92" stroke="oklch(88% 0.012 75)" strokeWidth="0.6" />
                    ))}
                  </svg>
                  {pin && (
                    <button className="map-pin urgent" style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}>
                      <span className="dot"><Icons.Pin size={10} /></span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 12.5, color: 'var(--mute)' }}>
                  <Icons.Nav size={14} />
                  {listing.distance} mi · ~{Math.round(listing.distance * 4)}min walk · ~{Math.round(listing.distance * 1.4)}min bike
                </div>
              </div>
            </>
          ) : (
            <div className="success-box">
              <div className="check"><Icons.Check size={32} sw={2.4} /></div>
              <h3>You&rsquo;re on the list.</h3>
              <p style={{ color: 'var(--mute)', maxWidth: 360, margin: '6px auto 0' }}>
                Show this code at pickup. Head to <b>{biz.name}</b> between{' '}
                <b>{fmtTime(listing.window.start)}</b> and{' '}
                <b>{fmtTime(listing.window.end)}</b>.
              </p>
              <div className="code">{code}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
                <button className="btn"><Icons.Nav size={13} />Directions</button>
                <button className="btn"><Icons.Share size={13} />Share with a friend</button>
              </div>
            </div>
          )}
        </div>

        {!reserved && (
          <div className="drawer-foot">
            <button className="btn" onClick={onClose} style={{ flex: 1 }}>Close</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={reserve}
              disabled={!canReserve}
              style={{ flex: 2 }}
            >
              {ws.kind === 'past'          ? 'Window closed'  :
               listing.claims >= listing.max ? 'Fully claimed' :
               'Reserve a bag'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
