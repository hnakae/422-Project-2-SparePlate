'use client';

import type { AppContext } from '../types';
import { windowState } from '../components/utils';
import { Icons } from '../components/Icons';
import { Sparkline, AreaLine } from '../components/Charts';

export function BusinessView({ ctx, openPost }: { ctx: AppContext; openPost: () => void }) {
  const { data, now, listings, openListing } = ctx;
  const biz = data.businesses.find(b => b.id === data.myBiz)!;
  const myListings = listings.filter(l => l.biz === data.myBiz);
  const impact = data.impact;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Business · {biz.type}
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontWeight: 500, fontSize: 38, letterSpacing: '-0.02em', margin: '6px 0 4px' }}>
            {biz.name}
          </h1>
          <div style={{ color: 'var(--mute)' }}>
            <Icons.Sparkle size={13} style={{ verticalAlign: '-2px', color: 'var(--terra)' }} />{' '}
            {impact.streak_days} day rescue streak · keep it going
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn"><Icons.Edit size={13} />Business profile</button>
          <button className="btn btn-primary btn-lg" onClick={openPost}>
            <Icons.Plus size={15} />Post surplus
          </button>
        </div>
      </div>

      <div className="biz-grid">
        <div className="stat terra">
          <div className="l">Meals rescued · May</div>
          <div className="v">{impact.meals_this_month}</div>
          <div className="d"><Icons.Trend size={11} style={{ verticalAlign: '-1px' }} /> +28% vs April</div>
          <Sparkline values={impact.sparkline} color="oklch(58% 0.14 40)" w={70} h={26} />
        </div>
        <div className="stat leaf">
          <div className="l">Pounds diverted</div>
          <div className="v">{impact.lb_diverted}<span style={{ fontSize: 18, color: 'var(--mute)' }}>&thinsp;lb</span></div>
          <div className="d">≈ {impact.co2_avoided_lb} lb CO₂ avoided</div>
        </div>
        <div className="stat">
          <div className="l">Value recovered</div>
          <div className="v">${impact.value_recovered.toLocaleString()}</div>
          <div className="d" style={{ color: 'var(--mute)' }}>Tax-deductible receipts auto-generated</div>
        </div>
        <div className="stat">
          <div className="l">Avg pickup time</div>
          <div className="v">42<span style={{ fontSize: 18, color: 'var(--mute)' }}>&thinsp;min</span></div>
          <div className="d" style={{ color: 'var(--mute)' }}>From post → first claim</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, alignItems: 'start' }}>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Your active listings</span>
            <span style={{ fontSize: 12, color: 'var(--mute)' }}>{myListings.length} active · auto-archive at window close</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Listing</th>
                <th style={{ width: 140 }}>Pickup</th>
                <th style={{ width: 110 }}>Claimed</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {myListings.map(l => {
                const ws = windowState(l.window, now);
                const c = data.cat[l.category];
                return (
                  <tr key={l.id} className="clickable" onClick={() => openListing(l.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: c.color, display: 'grid', placeItems: 'center', fontSize: 18 }}>
                          {c.emoji}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{l.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--mute)' }}>{l.servings} servings · {l.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`window-pill ${ws.kind}`}>
                        <Icons.Clock size={11} />{ws.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
                        {l.claims}/{l.max} bags
                      </div>
                      <div style={{ height: 4, background: 'var(--cream-2)', borderRadius: 999, overflow: 'hidden', maxWidth: 80 }}>
                        <div style={{
                          height: '100%',
                          width: `${(l.claims / l.max) * 100}%`,
                          background: l.claims >= l.max ? 'var(--danger)' : l.claims / l.max > 0.66 ? 'var(--warn)' : 'var(--leaf-2)',
                          transition: 'width 240ms',
                        }} />
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm" onClick={e => e.stopPropagation()}>
                        <Icons.Edit size={11} />Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {myListings.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: 30, color: 'var(--mute)' }}>
                    No active posts.{' '}
                    <button
                      style={{ background: 'none', border: 0, color: 'var(--terra)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
                      onClick={openPost}
                    >
                      Post your first surplus listing
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">14-day trend</span>
              <span style={{ fontSize: 12, color: 'var(--mute)' }}>Meals rescued · network-wide</span>
            </div>
            <div className="panel-body">
              <AreaLine
                values={data.hubSeries.map(d => d.meals)}
                labels={data.hubSeries.map(d => d.d)}
                w={400} h={170}
                color="oklch(58% 0.14 40)"
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">Recent pickups</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.reservations.slice(0, 4).map(r => {
                const l = listings.find(x => x.id === r.listing);
                if (!l) return null;
                const pickedUp = r.status === 'picked-up';
                const pillBg    = pickedUp ? 'var(--leaf-50)'  : 'var(--terra-50)';
                const pillColor = pickedUp ? 'var(--leaf-ink)' : 'var(--terra-ink)';
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: pillBg, color: pillColor, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
                      {r.who.split(' ').map(x => x[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div><b>{r.who}</b> {pickedUp ? 'picked up' : 'reserved'}</div>
                      <div style={{ color: 'var(--mute)', fontSize: 11.5 }}>{l.title.slice(0, 40)}</div>
                    </div>
                    <span style={{ fontSize: 10.5, padding: '2px 8px', borderRadius: 999, background: pillBg, color: pillColor, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      {r.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
