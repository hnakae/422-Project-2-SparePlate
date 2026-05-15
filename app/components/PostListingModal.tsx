'use client';

import { useState } from 'react';
import type { AppContext } from '../types';
import { Icons } from './Icons';

interface Props {
  ctx: AppContext;
  onClose: () => void;
}

interface FormState {
  title: string;
  category: string;
  servings: number;
  weight: string;
  startMin: number;
  endMin: number;
  diet: string[];
  notes: string;
  max: number;
}

export function PostListingModal({ ctx, onClose }: Props) {
  const { data, addListing, addToast } = ctx;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    title: '', category: '', servings: 8, weight: '',
    startMin: 0, endMin: 120,
    diet: [], notes: '', max: 4,
  });
  const [err, setErr] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function toggleDiet(d: string) {
    update('diet', form.diet.includes(d) ? form.diet.filter(x => x !== d) : [...form.diet, d]);
  }

  function v1() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Give it a short, friendly name';
    if (!form.category)     e.category = 'Pick a category';
    setErr(e);
    return Object.keys(e).length === 0;
  }

  function v2() {
    const e: Record<string, string> = {};
    if (form.endMin <= form.startMin) e.window = 'End must be after start';
    if (form.servings < 1)            e.servings = 'Must serve at least 1';
    setErr(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    const start = new Date(Date.now() + form.startMin * 60000).toISOString();
    const end   = new Date(Date.now() + form.endMin   * 60000).toISOString();
    addListing({
      id: 'L-' + Math.floor(205 + Math.random() * 50),
      biz: data.myBiz,
      title: form.title,
      category: form.category,
      servings: Number(form.servings),
      weight: form.weight || `${Math.round(Number(form.servings) * 0.5)} lb`,
      window: { start, end },
      diet: form.diet,
      notes: form.notes,
      claims: 0,
      max: Number(form.max),
      distance: 0,
    });
    addToast(`Listing posted · ${form.title}`);
    onClose();
  }

  function advance() {
    if (step === 1 && !v1()) return;
    if (step === 2 && !v2()) return;
    setStep(s => s + 1);
  }

  const stepLabels = ['What you have', 'Pickup window', 'A few details'];

  return (
    <div className="modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-head">
          <div>
            <div className="modal-title">Post surplus food</div>
            <div style={{ color: 'var(--mute)', fontSize: 12.5, marginTop: 2 }}>
              Step {step} of 3 · {stepLabels[step - 1]}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icons.X size={14} /></button>
        </div>

        <div className="modal-body">
          <div className="steps">
            {[1, 2, 3].map(s => (
              <div key={s} className={s < step ? 'done' : s === step ? 'on' : ''} />
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="field">
                <label>What are you setting aside?</label>
                <input
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder="e.g. End-of-day sourdough + ciabatta"
                />
                {err.title && <span className="err">{err.title}</span>}
              </div>
              <div className="field">
                <label>Category</label>
                <div className="cat-grid">
                  {Object.entries(data.cat)
                    .filter(([k]) => k !== 'coffee')
                    .map(([k, v]) => (
                      <button
                        key={k}
                        className={`cat-card ${form.category === k ? 'on' : ''}`}
                        onClick={() => update('category', k)}
                      >
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
                    style={{ width: '100%', accentColor: 'var(--terra)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, margin: '14px 0 8px' }}>
                    <span style={{ color: 'var(--mute)' }}>Closes in</span>
                    <b style={{ fontFamily: 'var(--mono)' }}>+{form.endMin}m ({Math.round(form.endMin / 60 * 10) / 10}h)</b>
                  </div>
                  <input type="range" min={30} max={360} step={15} value={form.endMin}
                    onChange={e => update('endMin', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--terra)' }} />
                </div>
                {err.window && <span className="err">{err.window}</span>}
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Servings (≈)</label>
                  <input type="number" value={form.servings} onChange={e => update('servings', parseInt(e.target.value) || 0)} />
                  {err.servings && <span className="err">{err.servings}</span>}
                </div>
                <div className="field">
                  <label>Bags to give out</label>
                  <input type="number" value={form.max} onChange={e => update('max', parseInt(e.target.value) || 0)} />
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
                    <button
                      key={d}
                      className={`chip tone ${form.diet.includes(d) ? 'on' : ''}`}
                      onClick={() => toggleDiet(d)}
                    >{d}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Pickup note (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder="e.g. Ring the bell at the back door labeled 'Donations'. Ask for Aurora."
                />
              </div>
              <div style={{ padding: 14, background: 'var(--cream)', borderRadius: 'var(--radius)', fontSize: 12.5, color: 'var(--mute)', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--ink)' }}>What happens next:</b><br />
                Your post goes live immediately. Recipients within 3 miles get a push notification.
                They reserve a bag and bring a code to your counter — that&rsquo;s it.
                You can edit or close the listing any time.
              </div>
            </>
          )}
        </div>

        <div className="modal-foot">
          {step > 1
            ? <button className="btn" onClick={() => setStep(s => s - 1)}>Back</button>
            : <span />}
          <span style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {step < 3 ? (
            <button className="btn btn-primary" onClick={advance}>
              Continue <Icons.ChevronR size={13} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submit}>
              <Icons.Check size={13} />Post listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
