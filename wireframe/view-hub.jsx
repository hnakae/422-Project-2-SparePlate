// Recipient / public hub view
const { useState: useStateH, useMemo: useMemoH } = React;

function HubView({ ctx }) {
  const { data, now, listings, openListing } = ctx;
  const I = window.SPIcons;
  const [cat, setCat] = useStateH('all');
  const [openNow, setOpenNow] = useStateH(false);
  const [diet, setDiet] = useStateH('any');
  const [hoverId, setHoverId] = useStateH(null);
  const [query, setQuery] = useStateH('');

  const filtered = useMemoH(() => {
    return listings.filter(l => {
      if (cat !== 'all' && l.category !== cat) return false;
      if (diet !== 'any' && !l.diet.includes(diet)) return false;
      const ws = window.windowState(l.window, now);
      if (openNow && ws.kind !== 'now' && ws.kind !== 'urgent') return false;
      if (query) {
        const b = data.businesses.find(x => x.id === l.biz);
        const hay = (l.title + ' ' + b.name).toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [listings, cat, diet, openNow, query, now]);

  // Stats
  const openCount = listings.filter(l => {
    const ws = window.windowState(l.window, now);
    return (ws.kind === 'now' || ws.kind === 'urgent') && !l.full && l.claims < l.max;
  }).length;
  const servingsAvail = listings.reduce((a, l) => {
    if (l.full || l.claims >= l.max) return a;
    const ws = window.windowState(l.window, now);
    if (ws.kind === 'past') return a;
    return a + l.servings;
  }, 0);
  const lbToday = 184;

  const cats = [
    { id: 'all',     l: 'All' },
    { id: 'bakery',  l: 'Bakery' },
    { id: 'prepared',l: 'Prepared meals' },
    { id: 'produce', l: 'Produce' },
    { id: 'dairy',   l: 'Dairy' },
    { id: 'pantry',  l: 'Pantry' },
  ];

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>Food that would&rsquo;ve been waste, <em>on time.</em></h1>
          <p className="lede">
            Local bakeries, kitchens, and grocers post end-of-day surplus right as it&rsquo;s
            ready. Anyone can come pick it up — free, no questions. Tonight, in Eugene.
          </p>
        </div>
        <div className="live-strip">
          <div className="live">
            <span className="live-label"><span className="live-pulse"/>Open right now</span>
            <span className="live-value">{openCount}</span>
            <span className="live-sub">listings within 5 mi</span>
          </div>
          <div className="live">
            <span className="live-label">Servings available</span>
            <span className="live-value">{servingsAvail}</span>
            <span className="live-sub">across the network</span>
          </div>
          <div className="live">
            <span className="live-label">Diverted today</span>
            <span className="live-value">{lbToday}<span style={{fontSize:18, color:'var(--mute)'}}>&thinsp;lb</span></span>
            <span className="live-sub">≈ 332 lb CO₂ avoided</span>
          </div>
        </div>
      </section>

      <div className="filter-bar">
        <div className="search">
          <I.Search size={15}/>
          <input placeholder="Search bakeries, dishes, ingredients…"
            value={query} onChange={e => setQuery(e.target.value)}/>
        </div>
        <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }}/>
        {cats.map(c => (
          <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`}
            onClick={() => setCat(c.id)}>{c.l}</button>
        ))}
        <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }}/>
        <button className={`chip tone ${openNow ? 'on' : ''}`} onClick={() => setOpenNow(o => !o)}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: openNow ? 'white' : 'var(--leaf-2)' }}/>
          Open now
        </button>
        <select className="chip tone" value={diet} onChange={e => setDiet(e.target.value)} style={{ appearance: 'none', cursor: 'pointer' }}>
          <option value="any">Any diet</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten-free">Gluten-free</option>
        </select>
      </div>

      <div className="split">
        <div className="split-stack">
          <div className="section-h">
            <h2>{filtered.length} listing{filtered.length === 1 ? '' : 's'} near you</h2>
            <span className="meta">Sorted by pickup window, then distance</span>
          </div>
          <div className="cards">
            {filtered.length === 0 && (
              <div style={{
                gridColumn: '1 / -1',
                padding: 40, textAlign: 'center', color: 'var(--mute)',
                background: 'var(--paper)', borderRadius: 'var(--radius)',
                border: '1px dashed var(--line-2)'
              }}>
                Nothing matches those filters right now. Check back in 30 minutes — most evening surplus posts after 7pm.
              </div>
            )}
            {filtered
              .slice()
              .sort((a, b) => {
                const wa = window.windowState(a.window, now);
                const wb = window.windowState(b.window, now);
                const rank = { urgent: 0, now: 1, future: 2, past: 3 };
                if (rank[wa.kind] !== rank[wb.kind]) return rank[wa.kind] - rank[wb.kind];
                return a.distance - b.distance;
              })
              .map(l => {
                const biz = data.businesses.find(b => b.id === l.biz);
                return (
                  <div key={l.id}
                    onMouseEnter={() => setHoverId(l.id)}
                    onMouseLeave={() => setHoverId(null)}
                    style={{ outline: hoverId === l.id ? '2px solid var(--terra)' : 'none',
                             outlineOffset: 0, borderRadius: 'var(--radius)' }}>
                    <ListingCard listing={l} biz={biz} onOpen={openListing} now={now} data={data}/>
                  </div>
                );
              })}
          </div>
        </div>
        <MapPanel
          data={data}
          listings={filtered}
          now={now}
          selectedId={hoverId}
          onSelect={setHoverId}
          onOpen={openListing}
        />
      </div>
    </div>
  );
}

Object.assign(window, { HubView });
