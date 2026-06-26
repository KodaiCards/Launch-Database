import React, { useMemo, useState, useContext } from 'react';
import { LessonProgressContext } from '../LessonLayout.jsx';

/**
 * Quiz — unified quiz primitive supporting three question modes.
 *
 * This is an EXTENSION of the InteractiveQuiz component pattern. It adds
 * fill-in-blank support and unifies mode selection via a prop rather than
 * per-question type. Existing InteractiveQuiz usage in modules continues
 * to work unchanged — Quiz is a NEW component, not a replacement.
 *
 * @param {string}   title      - Quiz section title displayed in the header.
 * @param {string}   [mode]     - Default mode when question has no explicit type.
 *                                'multiple-choice' | 'drag-match' | 'fill-in-blank'
 *                                Falls back to question.type for backwards compat.
 * @param {Array}    questions  - Array of question objects (see shapes below).
 * @param {Function} [onComplete] - Called with { score, total, answers } on finish.
 *
 * Question shapes by mode:
 *
 *   multiple-choice (type: 'mc'):
 *     { id, prompt, choices: string[], answerIndex: number,
 *       explanation?, citation?, fieldNote? }
 *
 *   drag-match (type: 'dragdrop' or 'drag-match'):
 *     { id, prompt, items: [{id, label}], targets: [{id, label}],
 *       correctMap: { targetId: itemId }, explanation?, citation?, fieldNote? }
 *
 *   fill-in-blank (type: 'fill-in-blank'):
 *     { id, prompt, blank: string (the ____ placeholder in the prompt),
 *       answer: string (exact or regex-pattern),
 *       answerDisplay: string (shown after reveal),
 *       caseSensitive?: boolean (default false),
 *       explanation?, citation?, fieldNote? }
 *     The prompt string may contain "____" which will be replaced by the
 *     input field in the rendered question.
 */
export default function Quiz({ title, mode = 'multiple-choice', questions, onComplete }) {
  const lessonCtx = useContext(LessonProgressContext);
  const [idx, setIdx]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [done, setDone]     = useState(false);

  const rawQ = questions[idx];
  const q = rawQ ? {
    ...rawQ,
    id: rawQ.id ?? `q-${idx}`,
    prompt: rawQ.prompt ?? rawQ.text ?? rawQ.question ?? '',
    choices: rawQ.choices ?? rawQ.options,
    answerIndex: rawQ.answerIndex ?? rawQ.correct ?? rawQ.correctIndex ??
      (rawQ.correctId && rawQ.options
        ? rawQ.options.findIndex(o => o.id === rawQ.correctId)
        : 0),
    items: rawQ.items ?? rawQ.pairs,
  } : null;

  const score = useMemo(
    () => Object.values(answers).filter(a => a.correct).length,
    [answers],
  );

  function resolveMode(question) {
    if (question.type === 'mc' || question.type === 'multiple-choice') return 'multiple-choice';
    if (question.type === 'dragdrop' || question.type === 'drag-match') return 'drag-match';
    if (question.type === 'fill-in-blank') return 'fill-in-blank';
    return mode;
  }

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
      const pct = Math.round((score / questions.length) * 100);
      onComplete?.({ score, total: questions.length, answers });
      lessonCtx?.reportScore(pct);
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="panel">
        <h3 className="text-lg font-semibold mb-2">{title} — Results</h3>
        <p className="text-3xl font-bold text-amber-300">
          {score} / {questions.length}{' '}
          <span className="text-base font-normal text-slate-300/70">({pct}%)</span>
        </p>
        <p className="text-sm text-slate-300/80 mt-2">
          {pct >= 80
            ? 'Solid. You can probably move on.'
            : pct >= 60
            ? 'Passable. Re-read the field-vs-book notes before the cert exam.'
            : 'Review the material before retaking. Pay attention to where field practice diverges from the spec.'}
        </p>
        <button
          className="btn-primary mt-4"
          onClick={() => { setIdx(0); setAnswers({}); setDone(false); setRevealed(false); }}
        >
          Retry
        </button>
      </div>
    );
  }

  const currentMode = resolveMode(q);

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs text-slate-300/70">
          Question {idx + 1} / {questions.length}
        </span>
      </div>

      <p className="text-slate-100 mb-4 leading-relaxed">
        {currentMode === 'fill-in-blank' ? null : q.prompt}
      </p>

      {currentMode === 'multiple-choice' && (
        <MultipleChoice q={q} revealed={revealed} onAnswer={recordAnswer} />
      )}
      {currentMode === 'drag-match' && (
        <DragMatch q={q} revealed={revealed} onAnswer={recordAnswer} />
      )}
      {currentMode === 'fill-in-blank' && (
        <FillInBlank q={q} revealed={revealed} onAnswer={recordAnswer} />
      )}

      {revealed && (
        <div className="mt-4 border-t border-white/10 pt-4 space-y-2 text-sm">
          {q.explanation && (
            <p className="text-slate-200">
              <strong>Why: </strong>{q.explanation}
            </p>
          )}
          {q.citation && (
            <p>
              <span className="badge-book">Book</span>{' '}
              <span className="text-slate-300/90">{q.citation}</span>
            </p>
          )}
          {q.fieldNote && (
            <p>
              <span className="badge-field">Field</span>{' '}
              <span className="text-slate-300/90">{q.fieldNote}</span>
            </p>
          )}
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

/* ─────────────────────── Multiple Choice ─────────────────────── */

function MultipleChoice({ q, revealed, onAnswer }) {
  const [picked, setPicked] = useState(null);

  // Defensive normalization: support both `choices` and `options` keys.
  const choices = q.choices || q.options || [];

  if (!choices || choices.length === 0) {
    console.warn(`[Quiz] MultipleChoice: no options provided for question "${q.id || '(unknown)'}"`, q);
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
        if (revealed && isCorrect)        cls = 'border-ospgreen bg-ospgreen/10';
        else if (revealed && isPicked)    cls = 'border-rose-400 bg-rose-400/10';
        return (
          <li key={i}>
            <button
              onClick={() => pick(i)}
              className={`w-full text-left px-4 py-2 rounded-lg border transition ${cls}`}
            >
              <span className="font-mono text-xs text-slate-300/60 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {typeof c === 'string' ? c : c.text}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────── Drag Match ─────────────────────── */

function DragMatch({ q, revealed, onAnswer }) {
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
      const next = {};
      for (const [t, i] of Object.entries(prev)) if (i !== itemId) next[t] = i;
      next[targetId] = itemId;
      return next;
    });
    setDragging(null);
  }
  function clearTarget(targetId) {
    setMapping(prev => { const n = { ...prev }; delete n[targetId]; return n; });
  }

  function submit() {
    const correct =
      Object.entries(q.correctMap).every(([t, exp]) => mapping[t] === exp) &&
      Object.keys(mapping).length === Object.keys(q.correctMap).length;
    onAnswer(mapping, correct);
  }

  const allFilled = Object.keys(mapping).length === q.targets.length;

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Source tray */}
        <div className="rounded-lg border border-dashed border-white/20 p-3 min-h-[120px]">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">
            Items
          </div>
          <div className="flex flex-wrap gap-2">
            {trayItems.length === 0 && (
              <span className="text-xs text-slate-300/50">All items placed.</span>
            )}
            {trayItems.map(it => (
              <div
                key={it.id}
                draggable={!revealed}
                onDragStart={e => onDragStart(e, it.id)}
                className="cursor-grab active:cursor-grabbing select-none px-3 py-1.5 rounded-md bg-ospamber/20 border border-ospamber/50 text-amber-100 text-sm"
              >
                {it.label}
              </div>
            ))}
          </div>
        </div>

        {/* Drop targets */}
        <div className="rounded-lg border border-white/15 p-3">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">
            Targets
          </div>
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
                  onDrop={e => onDrop(e, t.id)}
                  className={[
                    'flex items-center justify-between gap-3 px-3 py-2 rounded-md border transition',
                    correct ? 'border-ospgreen bg-ospgreen/10'
                    : wrong ? 'border-rose-400 bg-rose-400/10'
                            : 'border-white/20 hover:border-white/40',
                  ].join(' ')}
                >
                  <span className="text-sm text-slate-200">{t.label}</span>
                  {placed ? (
                    <button
                      onClick={() => !revealed && clearTarget(t.id)}
                      className="px-2 py-1 rounded bg-white/10 text-xs text-amber-100 border border-ospamber/40"
                    >
                      {placed.label}{!revealed && ' ✕'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-300/40 italic">drop here</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {!revealed && (
        <div className="mt-4">
          <button
            className="btn-primary disabled:opacity-50"
            disabled={!allFilled}
            onClick={submit}
          >
            Check answers
          </button>
          {!allFilled && (
            <span className="ml-3 text-xs text-slate-300/60">
              Match every item to submit.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────── Fill in the Blank ─────────────────────── */

function FillInBlank({ q, revealed, onAnswer }) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  // Split the prompt on the blank placeholder so we can insert an input inline
  const parts = q.prompt.split('____');

  function checkAnswer() {
    if (!value.trim()) return;
    let correct;
    if (q.answer instanceof RegExp) {
      correct = q.answer.test(value.trim());
    } else {
      const expected = q.caseSensitive ? q.answer : q.answer.toLowerCase();
      const given    = q.caseSensitive ? value.trim() : value.trim().toLowerCase();
      correct = given === expected;
    }
    setChecked(true);
    onAnswer(value.trim(), correct);
  }

  const isCorrect = checked && answers_correct(q, value);

  return (
    <div>
      {/* Inline blank rendering */}
      <p className="text-slate-100 mb-4 leading-relaxed flex flex-wrap items-center gap-1">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span>{part}</span>
            {i < parts.length - 1 && (
              <input
                type="text"
                value={value}
                disabled={revealed}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !revealed && checkAnswer()}
                className={[
                  'inline-block px-2 py-0.5 rounded border font-mono text-sm min-w-[8rem] bg-black/40',
                  revealed
                    ? isCorrect
                      ? 'border-ospgreen text-ospgreen'
                      : 'border-rose-400 text-rose-300'
                    : 'border-white/30 focus:border-ospamber focus:outline-none',
                ].join(' ')}
                placeholder="type answer"
              />
            )}
          </React.Fragment>
        ))}
      </p>

      {revealed && q.answerDisplay && (
        <p className="text-sm mb-3">
          <span className={isCorrect ? 'text-ospgreen' : 'text-rose-300'}>
            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
          </span>
          {!isCorrect && (
            <span className="text-slate-300/80 ml-2">
              — correct answer: <span className="font-mono text-amber-200">{q.answerDisplay}</span>
            </span>
          )}
        </p>
      )}

      {!revealed && (
        <button
          className="btn-primary disabled:opacity-50"
          disabled={!value.trim()}
          onClick={checkAnswer}
        >
          Check answer
        </button>
      )}
    </div>
  );
}

function answers_correct(q, value) {
  if (q.answer instanceof RegExp) return q.answer.test(value.trim());
  const expected = q.caseSensitive ? q.answer : q.answer.toLowerCase();
  const given    = q.caseSensitive ? value.trim() : value.trim().toLowerCase();
  return given === expected;
}
