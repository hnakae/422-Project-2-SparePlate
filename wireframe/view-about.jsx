// "How it works" — placeholder pre-interview, used to set the pitch
function AboutView({ ctx, setView }) {
  const I = window.SPIcons;
  return (
    <div className="page">
      <section className="about">
        <div>
          <h1>A neighborhood hub for food that&rsquo;s about to be tossed.</h1>
          <p>
            Bakeries, restaurants, and grocers post surplus right when it&rsquo;s ready — usually 30 to 90 minutes
            before close. Anyone can browse what&rsquo;s available nearby, reserve a bag, and pick it up.
            No income check. No paperwork. Just food that would&rsquo;ve been thrown away, on a map.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button className="btn btn-primary btn-lg" onClick={() => setView('hub')}>
              See what&rsquo;s available <I.Arrow size={14}/>
            </button>
            <button className="btn btn-lg" onClick={() => setView('business')}>For businesses</button>
          </div>
        </div>
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          aspectRatio: '4/3',
          background: 'linear-gradient(135deg, var(--terra-50) 0%, var(--leaf-50) 100%)',
          border: '1px solid var(--line)',
          padding: 24,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 22px)',
            opacity: 0.5
          }}/>
          <div style={{ position: 'relative', display: 'flex', gap: 8, fontSize: 64, justifyContent: 'center', marginBottom: 30 }}>
            <span>🥐</span><span>🥗</span><span>🥖</span><span>🍲</span>
          </div>
          <div style={{ position: 'relative', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--terra-ink)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Drop photo / hero illustration here
          </div>
        </div>
      </section>

      <div className="three-up">
        <div className="step-card">
          <span className="n">01 · Business</span>
          <h4>Post surplus in 30 seconds</h4>
          <p>Snap a photo, set a pickup window, choose how many bags. Live for everyone in the area within seconds.</p>
        </div>
        <div className="step-card">
          <span className="n">02 · Hub</span>
          <h4>Live map of what&rsquo;s available</h4>
          <p>Anyone can see what&rsquo;s on offer right now — categories, distance, dietary tags, time-until-close.</p>
        </div>
        <div className="step-card">
          <span className="n">03 · Pickup</span>
          <h4>Reserve a bag, walk over</h4>
          <p>Tap reserve, get a four-letter code, show it at the counter. Food that would&rsquo;ve been waste, in your hands.</p>
        </div>
      </div>

      <div style={{
        marginTop: 36, padding: '28px 28px',
        background: 'var(--paper)', border: '1px solid var(--line)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open questions for partner interviews</div>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 500, fontSize: 26, letterSpacing: '-0.015em', margin: '6px 0 14px' }}>
              What we still need to learn
            </h2>
            <ul style={{ paddingLeft: 18, color: 'var(--ink-2)', margin: 0 }}>
              <li>How do shops <i>currently</i> handle end-of-day surplus? Composted, staff-meal, donated, trashed?</li>
              <li>What&rsquo;s the friction with existing options (Food For Lane County, etc.)?</li>
              <li>Liability concerns — Bill Emerson Act awareness, in-house policy?</li>
              <li>Right time-window for posting? Is "30 min before close" realistic?</li>
              <li>Photo capture or skip? Pickup verification — code, signature, nothing?</li>
              <li>Tax-receipt importance — would 501(c)(3) routing change the answer?</li>
            </ul>
          </div>
          <div style={{
            background: 'var(--cream)',
            padding: 24,
            borderRadius: 'var(--radius)',
            border: '1px dashed var(--line-2)',
            fontSize: 13.5,
            color: 'var(--ink-2)',
            lineHeight: 1.6
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Demo flow for the interview
            </div>
            1.&nbsp; Open the Hub — point at live availability and the map.<br/>
            2.&nbsp; Tap a card to show the recipient pickup flow + reservation code.<br/>
            3.&nbsp; Flip the role toggle to <b>Business</b>.<br/>
            4.&nbsp; Walk through "Post surplus" — show how fast the 3-step form is.<br/>
            5.&nbsp; Land on impact stats — "this is what they&rsquo;d get back".
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AboutView });
