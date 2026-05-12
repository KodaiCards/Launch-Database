import React, { useEffect, useMemo, useState } from 'react';

/**
 * Flashcard deck with a simplified SM-2 (SuperMemo-2) spaced-repetition
 * scheduler. Persisted to localStorage so a user's review state survives
 * reloads.
 *
 * Card shape:
 *   { id, front, back, tags?: string[] }
 *
 * Scheduler state per card (kept in localStorage):
 *   { ef: number,            // ease factor (start 2.5, floor 1.3)
 *     interval: number,      // days
 *     reps: number,
 *     dueAt: ISOString }
 *
 * Quality grading (5-button SM-2):
 *   0 = blackout (forgot)
 *   3 = correct with effort
 *   4 = correct
 *   5 = perfect
 */

const STORAGE_KEY = 'osp.flashcards.v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function sm2(prev, q) {
  const ef0 = prev?.ef ?? 2.5;
  const reps0 = prev?.reps ?? 0;
  let ef = ef0 + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < 1.3) ef = 1.3;
  let reps, interval;
  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps = reps0 + 1;
    interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.round((prev.interval || 1) * ef);
  }
  const dueAt = new Date(Date.now() + interval * 86400000).toISOString();
  return { ef, interval, reps, dueAt };
}

export default function Flashcard({ deckId, cards }) {
  const [state, setState] = useState(() => loadState());
  const [showBack, setShowBack] = useState(false);

  useEffect(() => saveState(state), [state]);

  const deckState = state[deckId] || {};
  const now = Date.now();

  const due = useMemo(
    () => cards.filter(c => {
      const st = deckState[c.id];
      return !st || new Date(st.dueAt).getTime() <= now;
    }),
    [cards, deckState, now],
  );

  const card = due[0];

  function grade(q) {
    const prev = deckState[card.id];
    const next = sm2(prev, q);
    setState(s => ({
      ...s,
      [deckId]: { ...(s[deckId] || {}), [card.id]: next },
    }));
    setShowBack(false);
  }

  function reset() {
    setState(s => { const n = { ...s }; delete n[deckId]; return n; });
    setShowBack(false);
  }

  if (!card) {
    return (
      <div className="panel">
        <h3 className="text-lg font-semibold">Flashcards — caught up</h3>
        <p className="text-sm text-slate-300/80 mt-2">
          Nothing due right now. The next card will return when its review
          interval elapses (SM-2 schedule).
        </p>
        <button className="btn-ghost mt-3" onClick={reset}>Reset deck progress</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Flashcards</h3>
        <span className="text-xs text-slate-300/70">{due.length} due / {cards.length} total</span>
      </div>

      <div
        className="rounded-xl border border-white/15 bg-black/20 px-5 py-8 min-h-[180px] flex items-center justify-center cursor-pointer select-none"
        onClick={() => setShowBack(s => !s)}
      >
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">
            {showBack ? 'Back' : 'Front'} &middot; tap to flip
          </div>
          <div className="text-lg leading-relaxed text-slate-100 max-w-prose">
            {showBack ? card.back : card.front}
          </div>
          {card.tags?.length > 0 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {card.tags.map(t => (
                <span key={t} className="badge bg-white/5 text-slate-300/70 border border-white/10">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showBack && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button onClick={() => grade(0)} className="btn-ghost border-rose-400/40 hover:bg-rose-400/10">Forgot</button>
          <button onClick={() => grade(3)} className="btn-ghost border-amber-400/40 hover:bg-amber-400/10">Hard</button>
          <button onClick={() => grade(4)} className="btn-ghost border-sky-400/40 hover:bg-sky-400/10">Good</button>
          <button onClick={() => grade(5)} className="btn-ghost border-ospgreen/50 hover:bg-ospgreen/10">Easy</button>
        </div>
      )}
    </div>
  );
}
