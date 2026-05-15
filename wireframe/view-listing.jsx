// Listing detail drawer + reservation success
const { useState: useStateL, useEffect: useEffectL } = React;

function ListingDrawer({ ctx, listing, onClose }) {
  const { data, now, claimListing } = ctx;
  const I = window.SPIcons;
  const [reserved, setReserved] = useStateL(false);
  const [code, setCode] = useStateL(null);
  if (!listing) return null;
  const biz = data.businesses.find(b => b.id === listing.biz);
  const c = data.cat[listing.category];
  const ws = window.windowState(listing.window, now);
  const pin = data.mapPins.find(p => p.id === listing.id);

  const reserve = () => {
    const generated = Math.random().toString(36).slice(2, 6).toUpperCase();
    setCode(generated);
    setReserved(true);
    claimListing(listing.id);
  };

  return (
    <>
      <div className="scrim" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--mute)' }}>{listing.id}</span>
          <button className="icon-btn" onClick={onClose}><I.X size={14}/></button>
        </div>

        <div className="drawer-body">
          {!reserved ? (
            <>
              <div className="drawer-hero" style={{ '--hero-color': c.color }}>
                <span className="tag flag" style={{ background: 'rgba(255,255,255,0.9)' }}>{c.label}</span>
                <span className="emoji">{c.emoji}</span>
              </div>
              <div className="drawer-content">
                <h3>{listing.title}</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {listing.diet.map(d => <span key={d} className="diet-chip">{d}</span>)}
                </div>

                <div className="biz-row">
                  <div className="ava">{biz.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
                  <div className="info">
                    <div className="name">{biz.name} {biz.verified && <I.Check size={12} style={{color:'var(--leaf-2)'}}/>}</div>
                    <div className="addr">{biz.address} · {biz.hood}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--mute)' }}>★ {biz.rating}</span>
                </div>

                <div className={`countdown`} style={{
                  background: ws.kind === 'urgent' ? 'var(--terra-50)' : ws.kind === 'now' ? 'var(--leaf-50)' : 'var(--cream-2)',
                  borderColor: ws.kind === 'urgent' ? 'var(--terra-100)' : ws.kind === 'now' ? 'var(--leaf-100)' : 'var(--line)',
                }}>
                  <div>
                    <div className="label" style={{ color: ws.kind === 'urgent' ? 'var(--terra-ink)' : ws.kind === 'now' ? 'var(--leaf-ink)' : 'var(--mute)' }}>
                      Pickup window
                    </div>
                    <div className="value" style={{ color: ws.kind === 'urgent' ? 'var(--terra-ink)' : ws.kind === 'now' ? 'var(--leaf-ink)' : 'var(--ink)' }}>
                      {window.fmtTime(listing.window.start, now)} – {window.fmtTime(listing.window.end, now)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ws.label}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
                      {listing.claims}/{listing.max} bags claimed
                    </div>
                  </div>
                </div>

                <dl className="kv">
                  <dt>Servings</dt><dd>~{listing.servings} ({listing.weight})</dd>
                  <dt>Pickup at</dt><dd>{biz.address}</dd>
                  <dt>Pickup note</dt><dd>{listing.notes || <span className="dist">No specific notes</span>}</dd>
                  <dt>Container</dt><dd>Reusable bag preferred. Compostable bag provided if needed.</dd>
                  <dt>Posted by</dt><dd>{biz.name} · verified partner since Mar 2026</dd>
                </dl>

                <div className="minimap" aria-hidden="true">
                  <svg viewBox="0 0 100 92" preserveAspectRatio="none">
                    <path d="M -5 22 Q 30 32 50 18 Q 70 6 105 16" stroke="oklch(82% 0.06 220)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7"/>
                    {Array.from({length:5}).map((_,i)=>(
                      <line key={i} x1="0" x2="100" y1={32+i*12} y2={32+i*12} stroke="oklch(88% 0.012 75)" strokeWidth="0.6"/>
                    ))}
                    {Array.from({length:6}).map((_,i)=>(
                      <line key={i} x1={14+i*14} x2={14+i*14} y1="14" y2="92" stroke="oklch(88% 0.012 75)" strokeWidth="0.6"/>
                    ))}
                  </svg>
                  {pin && (
                    <button className="map-pin urgent" style={{ left: `${pin.x*100}%`, top: `${pin.y*100}%` }}>
                      <span className="dot"><I.Pin size={10}/></span>
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, fontSize: 12.5, color: 'var(--mute)' }}>
                  <I.Nav size={14}/>{listing.distance} mi · ~{Math.round(listing.distance * 4)}min walk · ~{Math.round(listing.distance * 1.4)}min bike
                </div>
              </div>
            </>
          ) : (
            <div className="success-box">
              <div className="check"><I.Check size={32} sw={2.4}/></div>
              <h3>You&rsquo;re on the list.</h3>
              <p style={{ color: 'var(--mute)', maxWidth: 360, margin: '6px auto 0' }}>
                Show this code at pickup. Head to <b>{biz.name}</b> between{' '}
                <b>{window.fmtTime(listing.window.start, now)}</b> and{' '}
                <b>{window.fmtTime(listing.window.end, now)}</b>.
              </p>
              <div className="code">{code}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
                <button className="btn"><I.Nav size={13}/>Directions</button>
                <button className="btn"><I.Share size={13}/>Share with a friend</button>
              </div>
            </div>
          )}
        </div>

        {!reserved && (
          <div className="drawer-foot">
            <button className="btn" onClick={onClose} style={{ flex: 1 }}>Close</button>
            <button className="btn btn-primary btn-lg"
              onClick={reserve}
              disabled={listing.full || listing.claims >= listing.max || ws.kind === 'past'}
              style={{ flex: 2 }}>
              {ws.kind === 'past' ? 'Window closed' :
                listing.claims >= listing.max ? 'Fully claimed' :
                'Reserve a bag'}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

Object.assign(window, { ListingDrawer });
