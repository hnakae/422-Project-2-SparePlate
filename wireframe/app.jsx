// SparePlate root
const { useState, useEffect, useMemo, useCallback } = React;

const SP_TWEAKS = /*EDITMODE-BEGIN*/{
  "role": "recipient",
  "accent": "terra",
  "showAbout": true
}/*EDITMODE-END*/;

function SPApp() {
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(SP_TWEAKS) : [SP_TWEAKS, () => {}];
  const [view, setView] = useState('hub'); // 'hub' | 'business' | 'about'
  const [listings, setListings] = useState(window.SP_DATA.listings);
  const [drawerId, setDrawerId] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [now, setNow] = useState(new Date(window.SP_DATA.now));

  useEffect(() => {
    const id = setInterval(() => setNow(prev => new Date(prev.getTime() + 60000)), 30000);
    return () => clearInterval(id);
  }, []);

  // accent swap
  useEffect(() => {
    const map = {
      terra: { c: 'oklch(58% 0.14 40)',  c2: 'oklch(66% 0.14 40)',  c50: 'oklch(94% 0.04 40)',  c100: 'oklch(88% 0.07 40)',  ink: 'oklch(34% 0.10 40)' },
      leaf:  { c: 'oklch(46% 0.09 150)', c2: 'oklch(58% 0.11 150)', c50: 'oklch(95% 0.025 150)', c100: 'oklch(88% 0.06 150)', ink: 'oklch(30% 0.07 150)' },
      indigo:{ c: 'oklch(46% 0.13 280)', c2: 'oklch(58% 0.15 280)', c50: 'oklch(95% 0.03 280)',  c100: 'oklch(88% 0.07 280)',  ink: 'oklch(30% 0.10 280)' },
    };
    const a = map[tweaks.accent] || map.terra;
    const r = document.documentElement;
    r.style.setProperty('--terra', a.c);
    r.style.setProperty('--terra-2', a.c2);
    r.style.setProperty('--terra-50', a.c50);
    r.style.setProperty('--terra-100', a.c100);
    r.style.setProperty('--terra-ink', a.ink);
  }, [tweaks.accent]);

  // when role flips → switch view
  useEffect(() => {
    if (tweaks.role === 'business' && view === 'hub') setView('business');
    if (tweaks.role === 'recipient' && view === 'business') setView('hub');
  }, [tweaks.role]);

  const addToast = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const openListing = useCallback((id) => setDrawerId(id), []);

  const claimListing = useCallback((id) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, claims: Math.min(l.max, l.claims + 1) } : l));
  }, []);

  const addListing = useCallback((l) => {
    setListings(ls => [l, ...ls]);
  }, []);

  const ctx = {
    data: window.SP_DATA,
    now,
    listings,
    openListing,
    claimListing,
    addListing,
    addToast,
  };

  const listing = listings.find(l => l.id === drawerId);

  const setRole = (r) => {
    setTweak('role', r);
    setView(r === 'business' ? 'business' : 'hub');
  };

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a className="brand" onClick={() => setView(tweaks.role === 'business' ? 'business' : 'hub')} style={{ cursor: 'pointer' }}>
            <span className="brand-mark"></span>
            <span className="brand-name">Spare<em>Plate</em></span>
          </a>

          <div className="nav-links">
            {tweaks.role === 'recipient' && (
              <>
                <button className={`nav-link ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>Find food</button>
                <button className={`nav-link ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>How it works</button>
              </>
            )}
            {tweaks.role === 'business' && (
              <>
                <button className={`nav-link ${view === 'business' ? 'active' : ''}`} onClick={() => setView('business')}>Dashboard</button>
                <button className={`nav-link ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>Live map</button>
                <button className={`nav-link ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>How it works</button>
              </>
            )}
          </div>

          <div className="role-pill">
            <button className={tweaks.role === 'recipient' ? 'on' : ''} onClick={() => setRole('recipient')}>
              <window.SPIcons.User size={13}/>Recipient
            </button>
            <button className={tweaks.role === 'business' ? 'on' : ''} onClick={() => setRole('business')}>
              <window.SPIcons.Truck size={13}/>Business
            </button>
          </div>

          <div className="nav-actions">
            <button className="bell"><window.SPIcons.Bell size={15}/><span className="pulse"/></button>
            <div className="avatar-sm">{tweaks.role === 'business' ? 'ND' : 'JC'}</div>
          </div>
        </nav>
      </div>

      <main>
        {view === 'hub'      && <HubView ctx={ctx}/>}
        {view === 'business' && <BusinessView ctx={ctx} openPost={() => setShowPost(true)}/>}
        {view === 'about'    && <AboutView ctx={ctx} setView={setView}/>}
      </main>

      {listing && <ListingDrawer ctx={ctx} listing={listing} onClose={() => setDrawerId(null)}/>}
      {showPost && <PostListingModal ctx={ctx} onClose={() => setShowPost(false)}/>}

      <SPTweaksPanel tweaks={tweaks} setTweak={setTweak}/>

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast"><span className="dot"/>{t.msg}</div>
        ))}
      </div>
    </>
  );
}

function SPTweaksPanel({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio } = window;
  return (
    <TweaksPanel>
      <TweakSection label="Role">
        <TweakRadio
          label="View as"
          value={tweaks.role}
          onChange={v => setTweak('role', v)}
          options={[
            { value: 'recipient', label: 'Recipient' },
            { value: 'business',  label: 'Business' },
          ]}
        />
      </TweakSection>
      <TweakSection label="Brand">
        <TweakRadio
          label="Accent"
          value={tweaks.accent}
          onChange={v => setTweak('accent', v)}
          options={[
            { value: 'terra',  label: 'Terra' },
            { value: 'leaf',   label: 'Leaf' },
            { value: 'indigo', label: 'Indigo' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SPApp/>);
