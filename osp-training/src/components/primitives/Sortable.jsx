import React, { useRef, useState } from 'react';

// Fisher–Yates shuffle on a copy — true randomness for anti-cheat answer order.
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sortable — drag-to-reorder list with correct-order validation.
 *
 * Presents a scrambled list of items. The user drags them into the correct
 * sequence and submits. Uses HTML5 native drag-and-drop (no external deps).
 * Touch support uses a pointer-event fallback for mobile.
 *
 * @param {string}   title          - Section title.
 * @param {string}   [prompt]       - Instruction shown above the sortable list.
 * @param {Array}    items          - Array of item objects: [{id: string, label: string}]
 *                                    Presented in scrambled order on first render.
 * @param {Array}    correctOrder   - Array of ids in the correct sequence.
 *                                    e.g. ['step-3', 'step-1', 'step-4', 'step-2']
 * @param {string}   [explanation]  - Shown after submission explaining the correct order.
 * @param {string}   [citation]     - Standards reference shown after submission.
 * @param {string}   [fieldNote]    - Field practice note shown after submission.
 */
export default function Sortable({
  title,
  prompt,
  items: rawItems,
  correctOrder,
  explanation,
  citation,
  fieldNote,
}) {
  // ── Defensive normalization ───────────────────────────────────────────────
  // Normalize items: each entry may be a string or {id, label} object.
  const items = (rawItems ?? []).map((item, i) =>
    typeof item === 'string'
      ? { id: String(i), label: item }
      : { id: item.id ?? String(i), label: item.label ?? item.text ?? String(item) },
  );

  // Guard: if correctOrder is absent, render as a practice-only drag list
  // (no validation, no Check button crash).
  const hasAnswerKey = Array.isArray(correctOrder) && correctOrder.length > 0;

  // Scramble initial order with a TRUE random shuffle (Fisher–Yates), computed
  // ONCE per mount via a lazy initializer so it's stable across re-renders but
  // differs every attempt. The old deterministic even/odd interleave was
  // predictable and gameable (Carter 2026-06-29 anti-cheat). With an answer key,
  // re-roll if the shuffle happens to land already-correct.
  const [order, setOrder]       = useState(() => {
    if (!hasAnswerKey || items.length < 2) return [...items];
    const isSorted = arr => arr.every((it, i) => it.id === correctOrder[i]);
    let shuffled = fisherYates(items);
    for (let t = 0; t < 8 && isSorted(shuffled); t++) shuffled = fisherYates(items);
    return shuffled;
  });
  const [submitted, setSubmit]  = useState(false);
  const [dragIdx, setDragIdx]   = useState(null);
  const [overIdx, setOverIdx]   = useState(null);

  const isCorrect = submitted && hasAnswerKey &&
    order.every((item, i) => item.id === correctOrder[i]);

  // ── HTML5 drag-and-drop handlers ──

  function onDragStart(e, idx) {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  }

  function onDragOver(e, idx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIdx(idx);
  }

  function onDrop(e, idx) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData('text/plain') ?? dragIdx);
    if (from === idx) { setDragIdx(null); setOverIdx(null); return; }
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setOrder(next);
    setDragIdx(null);
    setOverIdx(null);
  }

  function onDragEnd() {
    setDragIdx(null);
    setOverIdx(null);
  }

  function reset() {
    setOrder(initial);
    setSubmit(false);
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {prompt && (
        <p className="text-sm text-slate-300/80 mb-4 leading-relaxed">{prompt}</p>
      )}

      <ul className="space-y-2 select-none">
        {order.map((item, i) => {
          const correctPos  = hasAnswerKey ? correctOrder.indexOf(item.id) : -1;
          const inPlace     = submitted && hasAnswerKey && i === correctPos;
          const outOfPlace  = submitted && hasAnswerKey && i !== correctPos;
          const isDragging  = dragIdx === i;
          const isOver      = overIdx === i && dragIdx !== null && dragIdx !== i;

          return (
            <li
              key={item.id}
              draggable={!submitted}
              onDragStart={e => onDragStart(e, i)}
              onDragOver={e => onDragOver(e, i)}
              onDrop={e => onDrop(e, i)}
              onDragEnd={onDragEnd}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-lg border transition',
                submitted
                  ? inPlace
                    ? 'border-ospgreen bg-ospgreen/10 cursor-default'
                    : 'border-rose-400 bg-rose-400/10 cursor-default'
                  : isDragging
                    ? 'opacity-40 border-ospamber/50 bg-ospamber/5 cursor-grabbing'
                    : isOver
                      ? 'border-ospamber bg-ospamber/10 scale-[1.02] cursor-grab'
                      : 'border-white/15 hover:border-white/40 cursor-grab',
              ].join(' ')}
            >
              {/* Position indicator */}
              <span className="font-mono text-xs text-slate-300/50 w-5 text-right shrink-0">
                {i + 1}.
              </span>

              <span className="flex-1 text-sm text-slate-200">{item.label}</span>

              {/* Post-submit indicator */}
              {submitted && hasAnswerKey && (
                <span className={`text-xs font-semibold shrink-0 ${inPlace ? 'text-ospgreen' : 'text-rose-300'}`}>
                  {inPlace ? '✓' : `→ ${correctOrder.indexOf(item.id) + 1}`}
                </span>
              )}

              {!submitted && (
                <span className="text-slate-300/30 text-sm shrink-0" aria-hidden="true">⠿</span>
              )}
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <div className="mt-4">
          {hasAnswerKey ? (
            <button className="btn-primary" onClick={() => setSubmit(true)}>
              Check order
            </button>
          ) : (
            <p className="text-xs text-slate-300/50 italic">
              Practice only — no answer key for this exercise.
            </p>
          )}
          <span className="ml-3 text-xs text-slate-300/50">Drag to rearrange.</span>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {hasAnswerKey && (
            <p className={`text-sm font-semibold ${isCorrect ? 'text-ospgreen' : 'text-rose-300'}`}>
              {isCorrect
                ? '✓ Correct order.'
                : '✗ Not quite — the numbers on the right show the correct positions.'}
            </p>
          )}

          {explanation && (
            <p className="text-sm text-slate-200 leading-relaxed">
              <strong>Why: </strong>{explanation}
            </p>
          )}
          {citation && (
            <p className="text-sm">
              <span className="badge-book">Book</span>{' '}
              <span className="text-slate-300/90">{citation}</span>
            </p>
          )}
          {fieldNote && (
            <p className="text-sm">
              <span className="badge-field">Field</span>{' '}
              <span className="text-slate-300/90">{fieldNote}</span>
            </p>
          )}

          <button className="btn-ghost text-sm mt-2" onClick={reset}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
