'use client';

import { useState, useEffect, useCallback } from 'react';
import { SP_DATA } from './data';
import type { Listing, AppContext } from './types';
import { Icons } from './components/Icons';
import { ListingDrawer } from './components/ListingDrawer';
import { PostListingModal } from './components/PostListingModal';
import { HubView } from './views/HubView';
import { BusinessView } from './views/BusinessView';
import { AboutView } from './views/AboutView';

type View = 'hub' | 'business' | 'about';
type Role = 'recipient' | 'business';

interface Toast {
  id: string;
  msg: string;
}

export default function SPApp() {
  const [role, setRole] = useState<Role>('recipient');
  const [view, setView] = useState<View>('hub');
  const [listings, setListings] = useState<Listing[]>(SP_DATA.listings);
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [showPost, setShowPost] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [now, setNow] = useState(new Date(SP_DATA.now));

  // Tick the clock every 30 s (simulates real-time)
  useEffect(() => {
    const id = setInterval(() => setNow(prev => new Date(prev.getTime() + 60000)), 30000);
    return () => clearInterval(id);
  }, []);

  const addToast = useCallback((msg: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const openListing  = useCallback((id: string) => setDrawerId(id), []);
  const claimListing = useCallback((id: string) => {
    setListings(ls => ls.map(l => l.id === id ? { ...l, claims: Math.min(l.max, l.claims + 1) } : l));
  }, []);
  const addListing = useCallback((l: Listing) => setListings(ls => [l, ...ls]), []);

  function switchRole(r: Role) {
    setRole(r);
    setView(r === 'business' ? 'business' : 'hub');
  }

  const ctx: AppContext = { data: SP_DATA, now, listings, openListing, claimListing, addListing, addToast };
  const activeListing = listings.find(l => l.id === drawerId);

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a className="brand" onClick={() => setView(role === 'business' ? 'business' : 'hub')}>
            <span className="brand-mark" />
            <span className="brand-name">Spare<em>Plate</em></span>
          </a>

          <div className="nav-links">
            {role === 'recipient' && (
              <>
                <button className={`nav-link ${view === 'hub'   ? 'active' : ''}`} onClick={() => setView('hub')}>Find food</button>
                <button className={`nav-link ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>How it works</button>
              </>
            )}
            {role === 'business' && (
              <>
                <button className={`nav-link ${view === 'business' ? 'active' : ''}`} onClick={() => setView('business')}>Dashboard</button>
                <button className={`nav-link ${view === 'hub'      ? 'active' : ''}`} onClick={() => setView('hub')}>Live map</button>
                <button className={`nav-link ${view === 'about'    ? 'active' : ''}`} onClick={() => setView('about')}>How it works</button>
              </>
            )}
          </div>

          <div className="role-pill">
            <button className={role === 'recipient' ? 'on' : ''} onClick={() => switchRole('recipient')}>
              <Icons.User size={13} />Recipient
            </button>
            <button className={role === 'business' ? 'on' : ''} onClick={() => switchRole('business')}>
              <Icons.Truck size={13} />Business
            </button>
          </div>

          <div className="nav-actions">
            <button className="bell">
              <Icons.Bell size={15} /><span className="pulse" />
            </button>
            <div className="avatar-sm">{role === 'business' ? 'ND' : 'JC'}</div>
          </div>
        </nav>
      </div>

      <main>
        {view === 'hub'      && <HubView ctx={ctx} />}
        {view === 'business' && <BusinessView ctx={ctx} openPost={() => setShowPost(true)} />}
        {view === 'about'    && <AboutView ctx={ctx} setView={setView} />}
      </main>

      {activeListing && (
        <ListingDrawer ctx={ctx} listing={activeListing} onClose={() => setDrawerId(null)} />
      )}
      {showPost && (
        <PostListingModal ctx={ctx} onClose={() => setShowPost(false)} />
      )}

      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span className="dot" />{t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
