import React, { useMemo, useState } from 'react';

/**
 * InteractiveQuiz
 *
 * A single component that handles two question types:
 *   1. type: 'mc'        — multiple choice (single correct answer index)
 *   2. type: 'dragdrop'  — fiber-routing: drag labeled "fibers" from a tray
 *                         onto labeled "ports". Question is correct only if
 *                         every required pairing matches.
 *
 * Question shape:
 *   {
 *     id: string,
 *     type: 'mc' | 'dragdrop',
 *     prompt: string,
 *     // mc:
 *     choices?: string[],
 *     answerIndex?: number,
 *     // dragdrop:
 *     items?:   [{ id, label }],          // draggable fibers
 *     targets?: [{ id, label }],          // drop zones
 *     correctMap?: { [targetId]: itemId },// required mapping
 *     explanation?: string,
 *     citation?:    string,                // standards or rule of thumb
 *     fieldNote?:   string,                // how the field commonly does it
 *   }
 */
export default function InteractiveQuiz({ title, questions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});      // qid -> {value, correct}
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const rawQ = questions[idx];
  // Defensive normalization: accept both old (question/options/correct) and new (prompt/choices/answerIndex) shapes
  const q = {
    ...rawQ,
    prompt: rawQ.prompt ?? rawQ.text ?? rawQ.question ?? rawQ.stem ?? '',
    choices: rawQ.choices ?? rawQ.options ?? [],
    answerIndex: rawQ.answerIndex ?? rawQ.correct ?? rawQ.correctIndex ?? 0,
  };
  const score = useMemo(
    () => Object.values(answers).filter(a => a.correct).length,
    [answers],
  );

  function recordAnswer(value, correct) {
    setAnswers(prev => ({ ...prev, [q.id]: { value, correct } }));
    setRevealed(true);
  }

  function next() {
    setRevealed(false);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      onComplete?.({ score, total: questions.length, answers });
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="panel">
        <h3 className="text-lg font-semibold mb-2">{title} — Results</h3>
        <p className="text-3xl font-bold text-amber-300">{score} / {questions.length} <span className="text-base font-normal text-slate-300/70">({pct}%)</span></p>
        <p className="text-sm text-slate-300/80 mt-2">
          {pct >= 80 ? 'Solid. You can probably move on.' :
           pct >= 60 ? 'Passable. Re-read the field-vs-book notes before the cert exam.' :
                       'Review the module before retaking. Pay attention to where field practice diverges from the spec.'}
        </p>
        <button className="btn-primary mt-4" onClick={() => { setIdx(0); setAnswers({}); setDone(false); }}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs text-slate-300/70">Question {idx + 1} / {questions.length}</span>
      </div>

      <p className="text-slate-100 mb-4 leading-relaxed">{q.prompt}</p>

      {q.type === 'mc' && (
        <MultipleChoice q={q} revealed={revealed} onAnswer={recordAnswer} />
      )}
      {q.type === 'dragdrop' && (
        <DragDropRouting q={q} revealed={revealed} onAnswer={recordAnswer} />
      )}

      {revealed && (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-2 text-sm">
          {q.explanation && <p className="text-slate-200"><strong>Why: </strong>{q.explanation}</p>}
          {q.citation    && <p><span className="badge-book">Book</span> <span className="text-slate-300/90">{q.citation}</span></p>}
          {q.fieldNote   && <p><span className="badge-field">Field</span> <span className="text-slate-300/90">{q.fieldNote}</span></p>}
          <div className="pt-2">
            <button className="btn-primary" onClick={next}>
              {idx + 1 < questions.length ? 'Next' : 'See score'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------- Multiple Choice --------------------- */

function MultipleChoice({ q, revealed, onAnswer }) {
  const [picked, setPicked] = useState(null);

  // Defensive normalization: support both `choices` and `options` keys.
  const choices = q.choices || q.options || [];

  if (!choices || choices.length === 0) {
    console.warn(`[InteractiveQuiz] MultipleChoice: no options provided for question "${q.id || '(unknown)'}"`, q);
    return (
      <div className="rounded-lg border border-rose-400/30 bg-rose-400/5 p-3 text-sm text-rose-300">
        (no options provided)
      </div>
    );
  }

  function pick(i) {
    if (revealed) return;
    setPicked(i);
    onAnswer(i, i === q.answerIndex);
  }

  return (
    <ul className="space-y-2">
      {choices.map((c, i) => {
        const isPicked  = picked === i;
        const isCorrect = i === q.answerIndex;
        let cls = 'border-white/15 hover:border-white/40';
        if (revealed && isCorrect)             cls = 'border-ospgreen bg-ospgreen/10';
        else if (revealed && isPicked)         cls = 'border-rose-400 bg-rose-400/10';
        return (
          <li key={i}>
            <button
              onClick={() => pick(i)}
              className={`w-full text-left px-4 py-2 rounded-lg border transition ${cls}`}
            >
              <span className="font-mono text-xs text-slate-300/60 mr-2">{String.fromCharCode(65 + i)}.</span>
              {typeof c === 'string' ? c : c.text}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------- Drag & Drop Fiber Routing --------------------- */

function DragDropRouting({ q, revealed, onAnswer }) {
  // mapping: targetId -> itemId  (the item dropped on that target)
  const [mapping, setMapping]   = useState({});
  const [dragging, setDragging] = useState(null);

  const usedItems = new Set(Object.values(mapping));
  const trayItems = q.items.filter(it => !usedItems.has(it.id));

  function onDragStart(e, itemId) {
    setDragging(itemId);
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  }
  function onDragOver(e)  { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
  function onDrop(e, targetId) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || dragging;
    if (!itemId) return;
    setMapping(prev => {
      // remove this item from any prior target (a fiber can only land on one port)
      const next = {};
      for (const [t, i] of Object.entries(prev)) if (i !== itemId) next[t] = i;
      next[targetId] = itemId;
      return next;
    });
    setDragging(null);
  }
  function clearTarget(targetId) {
    setMapping(prev => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
  }

  function submit() {
    const correct = Object.entries(q.correctMap).every(
      ([t, expected]) => mapping[t] === expected,
    ) && Object.keys(mapping).length === Object.keys(q.correctMap).length;
    onAnswer(mapping, correct);
  }

  const allFilled = Object.keys(mapping).length === q.targets.length;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Tray */}
        <div className="rounded-lg border border-dashed border-white/20 p-3 min-h-[140px]">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">Fiber Tray</div>
          <div className="flex flex-wrap gap-2">
            {trayItems.length === 0 && <span className="text-xs text-slate-300/50">All fibers placed.</span>}
            {trayItems.map(it => (
              <div
                key={it.id}
                draggable={!revealed}
                onDragStart={(e) => onDragStart(e, it.id)}
                className="cursor-grab active:cursor-grabbing select-none px-3 py-1.5 rounded-md bg-ospamber/20 border border-ospamber/50 text-amber-100 text-sm"
              >
                {it.label}
              </div>
            ))}
          </div>
        </div>

        {/* Targets */}
        <div className="rounded-lg border border-white/15 p-3">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">Patch Panel / Ports</div>
          <ul className="space-y-2">
            {q.targets.map(t => {
              const placedId = mapping[t.id];
              const placed   = q.items.find(i => i.id === placedId);
              const correct  = revealed && q.correctMap[t.id] === placedId;
              const wrong    = revealed && placedId && q.correctMap[t.id] !== placedId;
              return (
                <li
                  key={t.id}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, t.id)}
                  className={[
                    'flex items-center justify-between gap-3 px-3 py-2 rounded-md border transition',
                    correct ? 'border-ospgreen bg-ospgreen/10' :
                    wrong   ? 'border-rose-400 bg-rose-400/10' :
                              'border-white/20 hover:border-white/40',
                  ].join(' ')}
                >
                  <span className="text-sm text-slate-200">{t.label}</span>
                  {placed
                    ? <button
                        onClick={() => !revealed && clearTarget(t.id)}
                        className="px-2 py-1 rounded bg-white/10 text-xs text-amber-100 border border-ospamber/40"
                      >
                        {placed.label}{!revealed && ' ✕'}
                      </button>
                    : <span className="text-xs text-slate-300/40 italic">drop here</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {!revealed && (
        <div className="mt-4">
          <button className="btn-primary disabled:opacity-50" disabled={!allFilled} onClick={submit}>
            Check routing
          </button>
          {!allFilled && <span className="ml-3 text-xs text-slate-300/60">Place every fiber to submit.</span>}
        </div>
      )}
    </div>
  );
}
