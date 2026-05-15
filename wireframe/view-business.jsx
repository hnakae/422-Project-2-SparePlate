// Business-side: dashboard + post new listing
const { useState: useStateB } = React;

function BusinessView({ ctx, openPost }) {
  const { data, now, listings, openListing } = ctx;
  const I = window.SPIcons;
  const biz = data.businesses.find(b => b.id === data.myBiz);
  const myListings = listings.filter(l => l.biz === data.myBiz);
  const impact = data.impact;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Business · {biz.type}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontWeight: 500, fontSize: 38, letterSpacing: '-0.02em', margin: '6px 0 4px' }}>
            {biz.name}
          </h1>
          <div style={{ color: 'var(--mute)' }}>
            <I.Sparkle size={13} style={{ verticalAlign: '-2px', color: 'var(--terra)' }}/>{' '}
            {impact.streak_days} day rescue streak · keep it going
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn"><I.Edit size={13}/>Business profile</button>
          <button className="btn btn-primary btn-lg" onClick={openPost}>
            <I.Plus size={15}/>Post surplus
          </button>
        </div>
      </div>

      {/* Impact stats */}
      <div className="biz-grid">
        <div className="stat terra">
          <div className="l">Meals rescued · May</div>
          <div className="v">{impact.meals_this_month}</div>
          <div className="d"><I.Trend size={11} style={{verticalAlign:'-1px'}}/> +28% vs April</div>
          <Sparkline values={impact.sparkline} color="oklch(58% 0.14 40)" w={70} h={26}/>
        </div>
        <div className="stat leaf">
          <div className="l">Pounds diverted</div>
          <div className="v">{impact.lb_diverted}<span style={{fontSize:18,color:'var(--mute)'}}>&thinsp;lb</span></div>
          <div className="d">≈ {impact.co2_avoided_lb} lb CO₂ avoided</div>
        </div>
        <div className="stat">
          <div className="l">Value recovered</div>
          <div className="v">${impact.value_recovered.toLocaleString()}</div>
          <div className="d" style={{ color: 'var(--mute)' }}>Tax-deductible receipts auto-generated</div>
        </div>
        <div className="stat">
          <div className="l">Avg pickup time</div>
          <div className="v">42<span style={{fontSize:18,color:'var(--mute)'}}>&thinsp;min</span></div>
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
                const ws = window.windowState(l.window, now);
                const c = data.cat[l.category];
                return (
                  <tr key={l.id} className="clickable" onClick={() => openListing(l.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: c.color,
                          display: 'grid', placeItems: 'center',
                          fontSize: 18
                        }}>{c.emoji}</div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{l.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--mute)' }}>{l.servings} servings · {l.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`window-pill ${ws.kind}`}>
                        <I.Clock size={11}/>{ws.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
                        {l.claims}/{l.max} bags
                      </div>
                      <div style={{ height: 4, background: 'var(--cream-2)', borderRadius: 999, overflow: 'hidden', maxWidth: 80 }}>
                        <div style={{
                          height: '100%',
                          width: `${(l.claims/l.max)*100}%`,
                          background: l.claims >= l.max ? 'var(--danger)' : l.claims/l.max > 0.66 ? 'var(--warn)' : 'var(--leaf-2)',
                          transition: 'width 240ms'
                        }}/>
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); }}>
                        <I.Edit size={11}/>Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {myListings.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: 30, color: 'var(--mute)' }}>
                  No active posts. <button className="btn-ghost" style={{ background: 'none', border: 0, color: 'var(--terra)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }} onClick={openPost}>Post your first surplus listing</button>
                </td></tr>
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
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: r.status === 'picked-up' ? 'var(--leaf-50)' : 'var(--terra-50)',
                      color: r.status === 'picked-up' ? 'var(--leaf-ink)' : 'var(--terra-ink)',
                      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
                      {r.who.split(' ').map(x => x[0]).join('').slice(0,2)}
                    </div>
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <div><b>{r.who}</b> {r.status === 'picked-up' ? 'picked up' : 'reserved'}</div>
                      <div style={{ color: 'var(--mute)', fontSize: 11.5 }}>{l.title.slice(0, 40)}</div>
                    </div>
                    <span style={{
                      fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
                      background: r.status === 'picked-up' ? 'var(--leaf-50)' : 'var(--terra-50)',
                      color: r.status === 'picked-up' ? 'var(--leaf-ink)' : 'var(--terra-ink)',
                      textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600
                    }}>{r.status}</span>
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

function PostListingModal({ ctx, onClose }) {
  const { data, addListing, addToast } = ctx;
  const I = window.SPIcons;
  const [step, setStep] = useStateB(1);
  const [form, setForm] = useStateB({
    title: '', category: '', servings: 8, weight: '',
    startMin: 0, endMin: 120,
    diet: [], notes: '', max: 4,
  });
  const [err, setErr] = useStateB({});

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleDiet = (d) => update('diet', form.diet.includes(d) ? form.diet.filter(x => x !== d) : [...form.diet, d]);

  const v1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Give it a short, friendly name';
    if (!form.category) e.category = 'Pick a category';
    setErr(e);
    return Object.keys(e).length === 0;
  };
  const v2 = () => {
    const e = {};
    if (form.endMin <= form.startMin) e.window = 'End must be after start';
    if (form.servings < 1) e.servings = 'Must serve at least 1';
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    const start = new Date(Date.now() + form.startMin * 60000).toISOString();
    const end   = new Date(Date.now() + form.endMin * 60000).toISOString();
    addListing({
      id: 'L-' + Math.floor(205 + Math.random() * 50),
      biz: data.myBiz,
      title: form.title,
      category: form.category,
      servings: parseInt(form.servings),
      weight: form.weight || `${Math.round(form.servings * 0.5)} lb`,
      window: { start, end },
      diet: form.diet,
      notes: form.notes,
      claims: 0,
      max: parseInt(form.max),
      distance: 0,
    });
    addToast(`Listing posted · ${form.title}`);
    onClose();
  };

  const totalSteps = 3;

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-title">Post surplus food</div>
            <div style={{ color: 'var(--mute)', fontSize: 12.5, marginTop: 2 }}>
              Step {step} of {totalSteps} · {['What you have', 'Pickup window', 'A few details'][step-1]}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><I.X size={14}/></button>
        </div>

        <div className="modal-body">
          <div className="steps">
            {[1,2,3].map(s => <div key={s} className={s < step ? 'done' : s === step ? 'on' : ''}/>)}
          </div>

          {step === 1 && (
            <>
              <div className="field">
                <label>What are you setting aside?</label>
                <input value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g. End-of-day sourdough + ciabatta"/>
                {err.title && <span className="err">{err.title}</span>}
              </div>
              <div className="field">
                <label>Category</label>
                <div className="cat-grid">
                  {Object.entries(data.cat).filter(([k]) => k !== 'coffee').map(([k, v]) => (
                    <button key={k}
                      className={`cat-card ${form.category === k ? 'on' : ''}`}
                      onClick={() => update('category', k)}>
                      <span className="e">{v.emoji}</span>
                      <span className="l">{v.label}</span>
                    </button>
                  ))}
                </div>
                {err.category && <span className="err">{err.category}</span>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <label>Pickup window (from now)</label>
                <div style={{ padding: 16, background: 'var(--cream)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: 'var(--mute)' }}>Opens in</span>
                    <b style={{ fontFamily: 'var(--mono)' }}>{form.startMin === 0 ? 'right now' : `+${form.startMin}m`}</b>
                  </div>
                  <input type="range" min={0} max={240} step={15} value={form.startMin}
                    onChange={e => update('startMin', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--terra)' }}/>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, margin: '14px 0 8px' }}>
                    <span style={{ color: 'var(--mute)' }}>Closes in</span>
                    <b style={{ fontFamily: 'var(--mono)' }}>+{form.endMin}m ({Math.round(form.endMin/60*10)/10}h)</b>
                  </div>
                  <input type="range" min={30} max={360} step={15} value={form.endMin}
                    onChange={e => update('endMin', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--terra)' }}/>
                </div>
                {err.window && <span className="err">{err.window}</span>}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Servings (≈)</label>
                  <input type="number" value={form.servings} onChange={e => update('servings', e.target.value)}/>
                  {err.servings && <span className="err">{err.servings}</span>}
                </div>
                <div className="field">
                  <label>Bags to give out</label>
                  <input type="number" value={form.max} onChange={e => update('max', e.target.value)}/>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Dietary tags</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free'].map(d => (
                    <button key={d}
                      className={`chip tone ${form.diet.includes(d) ? 'on' : ''}`}
                      onClick={() => toggleDiet(d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Pickup note (optional)</label>
                <textarea rows="3" value={form.notes} onChange={e => update('notes', e.target.value)}
                  placeholder="e.g. Ring the bell at the back door labeled 'Donations'. Ask for Aurora."/>
              </div>
              <div style={{
                padding: 14, background: 'var(--cream)', borderRadius: 'var(--radius)',
                fontSize: 12.5, color: 'var(--mute)', lineHeight: 1.5
              }}>
                <b style={{ color: 'var(--ink)' }}>What happens next:</b><br/>
                Your post goes live immediately. Recipients within 3 miles get a push notification.
                They reserve a bag and bring a code to your counter — that&rsquo;s it.
                You can edit or close the listing any time.
              </div>
            </>
          )}
        </div>

        <div className="modal-foot">
          {step > 1 ? <button className="btn" onClick={() => setStep(step - 1)}>Back</button> : <span/>}
          <span style={{ flex: 1 }}/>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {step < totalSteps ? (
            <button className="btn btn-primary" onClick={() => {
              if (step === 1 && !v1()) return;
              if (step === 2 && !v2()) return;
              setStep(step + 1);
            }}>Continue <I.ChevronR size={13}/></button>
          ) : (
            <button className="btn btn-primary" onClick={submit}>
              <I.Check size={13}/>Post listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BusinessView, PostListingModal });
