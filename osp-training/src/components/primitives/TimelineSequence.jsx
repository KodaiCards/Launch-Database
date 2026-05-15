import React, { useRef, useState } from 'react';

/**
 * TimelineSequence — chronological drag-to-order timeline activity.
 *
 * Similar to Sortable but rendered as a horizontal timeline. Users drag events
 * into chronological order. Validates against the correct sequence on submit.
 * Useful for permitting workflows, construction sequence, and project phases.
 *
 * Uses HTML5 native drag-and-drop (no external deps). Falls back gracefully
 * on touch devices by providing Up/Down arrow buttons as an alternative.
 *
 * @param {string}   title          - Section title.
 * @param {string}   [prompt]       - Instruction text shown above the timeline.
 * @param {Array}    events         - Array of event objects (presented scrambled):
 *   {
 *     id:    string,  // unique key
 *     label: string,  // short event name shown on the timeline node
 *     date?:  string, // optional date/time label shown below the node (not used for ordering)
 *   }
 * @param {Array}    correctOrder   - Array of event ids in the correct chronological order.
 * @param {string}   [explanation]  - Shown after submission.
 * @param {string}   [citation]     - Standards reference shown after submission.
 * @param {string}   [fieldNote]    - Field practice note shown after submission.
 */
export default function TimelineSequence({
  title,
  prompt,
  events,
  correctOrder,
  explanation,
  citation,
  fieldNote,
}) {
  // Scramble initial order (same deterministic approach as Sortable)
  const initial = [...events].sort((a, b) => {
    const ai = correctOrder.indexOf(a.id);
    const bi = correctOrder.indexOf(b.id);
    const aS = ai % 2 === 0 ? ai + events.length : ai;
    const bS = bi % 2 === 0 ? bi + events.length : bi;
    return aS - bS;
  });

  const [order, setOrder]      = useState(initial);
  const [submitted, setSubmit] = useState(false);
  const [dragIdx, setDragIdx]  = useState(null);
  const [overIdx, setOverIdx]  = useState(null);

  const isCorrect = submitted &&
    order.every((ev, i) => ev.id === correctOrder[i]);

  // ── Drag handlers ──

  function onDragStart(e, idx) {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  }

  function onDragOver(e, idx) {
    e.preventDefault();
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

  function onDragEnd() { setDragIdx(null); setOverIdx(null); }

  // ── Touch-friendly arrow controls ──

  function moveLeft(idx) {
    if (idx === 0 || submitted) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  }

  function moveRight(idx) {
    if (idx === order.length - 1 || submitted) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
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
        <p className="text-sm text-slate-300/80 mb-5 leading-relaxed">{prompt}</p>
      )}

      {/* Timeline strip — horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-2">
        <div
          className="flex items-start gap-0 min-w-max relative"
          style={{ minWidth: `${order.length * 9}rem` }}
        >
          {order.map((ev, i) => {
            const correctPos  = correctOrder.indexOf(ev.id);
            const inPlace     = submitted && i === correctPos;
            const outOfPlace  = submitted && i !== correctPos;
            const isDragging  = dragIdx === i;
            const isOver      = overIdx === i && dragIdx !== null && dragIdx !== i;

            let nodeColor = 'border-white/30 bg-ospnavy';
            if (submitted && inPlace)     nodeColor = 'border-ospgreen bg-ospgreen/20';
            else if (submitted)           nodeColor = 'border-rose-400 bg-rose-400/10';
            else if (isDragging)          nodeColor = 'border-ospamber/40 bg-ospamber/10 opacity-50';
            else if (isOver)              nodeColor = 'border-ospamber bg-ospamber/20 scale-110';

            return (
              <div
                key={ev.id}
                className="flex flex-col items-center relative"
                style={{ width: '9rem' }}
              >
                {/* Connector line (skip for last item) */}
                {i < order.length - 1 && (
                  <div
                    className="absolute top-[1.375rem] left-1/2 w-full h-0.5 z-0"
                    style={{ background: submitted ? (inPlace ? '#16a34a40' : '#f8717140') : '#ffffff15' }}
                  />
                )}

                {/* Node */}
                <div
                  draggable={!submitted}
                  onDragStart={e => onDragStart(e, i)}
                  onDragOver={e => onDragOver(e, i)}
                  onDrop={e => onDrop(e, i)}
                  onDragEnd={onDragEnd}
                  className={[
                    'relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center',
                    'font-bold text-sm transition-all duration-150 select-none',
                    submitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
                    nodeColor,
                  ].join(' ')}
                  title={ev.label}
                >
                  {i + 1}
                </div>

                {/* Label below node */}
                <div
                  className={[
                    'mt-2 text-center text-xs leading-snug px-1 max-w-[8rem]',
                    submitted
                      ? inPlace ? 'text-ospgreen' : 'text-rose-300'
                      : 'text-slate-300/80',
                  ].join(' ')}
                >
                  {ev.label}
                  {ev.date && (
                    <div className="text-[10px] text-slate-300/40 mt-0.5">{ev.date}</div>
                  )}
                  {submitted && !inPlace && (
                    <div className="text-[10px] text-rose-400/80 mt-0.5">
                      → position {correctPos + 1}
                    </div>
                  )}
                </div>

                {/* Arrow controls (touch fallback) */}
                {!submitted && (
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => moveLeft(i)}
                      disabled={i === 0}
                      className="text-slate-300/40 hover:text-slate-300/80 disabled:opacity-20 text-xs px-1"
                      aria-label="Move earlier"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveRight(i)}
                      disabled={i === order.length - 1}
                      className="text-slate-300/40 hover:text-slate-300/80 disabled:opacity-20 text-xs px-1"
                      aria-label="Move later"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!submitted ? (
        <div className="mt-5">
          <button className="btn-primary" onClick={() => setSubmit(true)}>
            Check sequence
          </button>
          <span className="ml-3 text-xs text-slate-300/50">
            Drag nodes or use ← → to rearrange.
          </span>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <p className={`text-sm font-semibold ${isCorrect ? 'text-ospgreen' : 'text-rose-300'}`}>
            {isCorrect
              ? '✓ Correct sequence.'
              : '✗ Not quite — arrows show where each event should be.'}
          </p>

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
