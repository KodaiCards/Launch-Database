import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { startAssessment, submitAssessment } from '../../hooks/useAssessment.js';
import { PROGRESS_QUERY_KEY } from '../../hooks/useProgress.js';

/**
 * PooledAssessment — the server-authoritative, anti-cheat assessment runner.
 *
 * Unlike the in-lesson <Quiz> (which holds answer keys in the bundle and reveals
 * each question immediately), this runs in EXAM MODE against the engine:
 *   1. start  → server draws a random subset (different per attempt/account) and
 *      returns the questions WITHOUT answer keys.
 *   2. the learner answers all drawn questions (no correctness shown mid-exam —
 *      keys never reach the client, so nothing can be revealed early).
 *   3. submit → the server grades from the keys it kept, records the attempt, and
 *      (for a lesson) credits completion. Only then is per-question correctness shown.
 *
 * Supported question types mirror the engine's ban-clean set: 'mc' + 'drag-match'.
 *
 * @param {string}   assessmentId  pool id, e.g. 'T01.L01' (lesson) or 'T01-final'.
 * @param {string}   [title]
 * @param {Function} [onComplete]  called with the server result on submit.
 */
export default function PooledAssessment({ assessmentId, title = 'Assessment', onComplete }) {
  const qc = useQueryClient();
  const [phase, setPhase]   = useState('loading'); // loading|active|submitting|result|error|unavailable
  const [error, setError]   = useState(null);
  const [attempt, setAttempt] = useState(null);    // { attempt_id, questions, pass_threshold, kind, ... }
  const [answers, setAnswers] = useState({});
  const [idx, setIdx]       = useState(0);
  const [result, setResult] = useState(null);
  const startedAt = useRef(null);

  const load = () => {
    setPhase('loading'); setError(null); setResult(null); setAnswers({}); setIdx(0);
    startAssessment(assessmentId)
      .then(data => {
        if (!data) return;                        // 401 bounce already navigated
        startedAt.current = Date.now();
        setAttempt(data);
        setPhase('active');
      })
      .catch(err => {
        if (err.code === 404) { setPhase('unavailable'); return; }
        setError(err.message || 'Could not start the assessment.');
        setPhase('error');
      });
  };

  useEffect(load, [assessmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = attempt?.questions || [];
  const q = questions[idx];
  const answeredCount = useMemo(
    () => questions.filter(x => answers[x.id] !== undefined).length,
    [questions, answers],
  );

  function setAnswer(qid, value) {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }

  function submit() {
    setPhase('submitting');
    const duration_seconds = startedAt.current
      ? Math.round((Date.now() - startedAt.current) / 1000)
      : undefined;
    submitAssessment(assessmentId, { attempt_id: attempt.attempt_id, answers, duration_seconds })
      .then(res => {
        if (!res) return;                         // 401 bounce
        setResult(res);
        setPhase('result');
        // A passing lesson attempt credits completion server-side → refresh the cache.
        qc.invalidateQueries({ queryKey: PROGRESS_QUERY_KEY });
        onComplete?.(res);
      })
      .catch(err => {
        setError(err.message || 'Could not submit the assessment.');
        setPhase('error');
      });
  }

  // ── States ──────────────────────────────────────────────────────────────────
  if (phase === 'loading')     return <Shell title={title}><p className="text-slate-300/70 text-sm">Loading assessment…</p></Shell>;
  if (phase === 'unavailable') return <Shell title={title}><p className="text-slate-300/70 text-sm">This assessment isn’t available yet.</p></Shell>;
  if (phase === 'error') {
    return (
      <Shell title={title}>
        <p className="text-rose-300 text-sm mb-3">{error}</p>
        <button className="btn-primary" onClick={load}>Try again</button>
      </Shell>
    );
  }
  if (phase === 'result') {
    return <Result title={title} attempt={attempt} result={result} onRetry={load} />;
  }

  // ── Active / submitting ──────────────────────────────────────────────────────
  const isLast = idx === questions.length - 1;
  return (
    <Shell title={title}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-300/70">Question {idx + 1} / {questions.length}</span>
        <span className="text-xs text-slate-300/60">{answeredCount} / {questions.length} answered</span>
      </div>

      <p className="text-slate-100 mb-4 leading-relaxed">{q.prompt}</p>

      {q.type === 'mc' && (
        <ChoiceList
          choices={q.choices || []}
          picked={answers[q.id]}
          onPick={i => setAnswer(q.id, i)}
        />
      )}
      {q.type === 'drag-match' && (
        <MatchSelect
          items={q.items || []}
          targets={q.targets || []}
          value={answers[q.id] || {}}
          onChange={m => setAnswer(q.id, m)}
        />
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
        <button className="btn-ghost disabled:opacity-40" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Back</button>
        {!isLast && (
          <button className="btn-primary" onClick={() => setIdx(idx + 1)}>Next</button>
        )}
        {isLast && (
          <button
            className="btn-primary disabled:opacity-50"
            disabled={phase === 'submitting'}
            onClick={submit}
          >
            {phase === 'submitting' ? 'Submitting…' : 'Submit assessment'}
          </button>
        )}
        {isLast && answeredCount < questions.length && (
          <span className="text-xs text-slate-300/60">{questions.length - answeredCount} unanswered will be marked wrong.</span>
        )}
      </div>
    </Shell>
  );
}

/* ── presentational bits ─────────────────────────────────────────────────────── */

function Shell({ title, children }) {
  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ChoiceList({ choices, picked, onPick }) {
  return (
    <ul className="space-y-2">
      {choices.map((c, i) => (
        <li key={i}>
          <button
            onClick={() => onPick(i)}
            className={`w-full text-left px-4 py-2 rounded-lg border transition ${
              picked === i ? 'border-ospamber bg-ospamber/10' : 'border-white/15 hover:border-white/40'
            }`}
          >
            <span className="font-mono text-xs text-slate-300/60 mr-2">{String.fromCharCode(65 + i)}.</span>
            {typeof c === 'string' ? c : c.text}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Exam-mode matcher: one dropdown per target (accessible; grades identically to
// drag-and-drop → answers[qid] = { targetId: itemId }).
function MatchSelect({ items, targets, value, onChange }) {
  function set(targetId, itemId) {
    const next = { ...value };
    if (itemId) next[targetId] = itemId; else delete next[targetId];
    onChange(next);
  }
  return (
    <ul className="space-y-2">
      {targets.map(t => (
        <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-white/20">
          <span className="text-sm text-slate-200">{t.label}</span>
          <select
            className="bg-black/40 border border-white/25 rounded px-2 py-1 text-sm text-slate-100"
            value={value[t.id] || ''}
            onChange={e => set(t.id, e.target.value)}
          >
            <option value="">— choose —</option>
            {items.map(it => <option key={it.id} value={it.id}>{it.label}</option>)}
          </select>
        </li>
      ))}
    </ul>
  );
}

function Result({ title, attempt, result, onRetry }) {
  const pass = result.passed;
  const questions = attempt?.questions || [];
  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-2">{title} — Results</h3>
      <p className="text-3xl font-bold" style={{ color: pass ? 'var(--ospgreen, #34d399)' : '#fb7185' }}>
        {result.score}%
        <span className="text-base font-normal text-slate-300/70 ml-2">
          ({result.correct} / {result.total}) · {pass ? 'Passed' : 'Not passed'} · need {result.pass_threshold}%
        </span>
      </p>
      {result.completion_credited && (
        <p className="text-sm text-emerald-300/90 mt-1">Lesson completion credited.</p>
      )}

      <ul className="mt-4 space-y-2 text-sm">
        {questions.map((q, i) => {
          const ok = result.per_question?.[q.id];
          return (
            <li key={q.id} className="border-t border-white/10 pt-2">
              <div className="flex items-start gap-2">
                <span className={ok ? 'text-emerald-300' : 'text-rose-300'}>{ok ? '✓' : '✗'}</span>
                <div>
                  <p className="text-slate-200">{i + 1}. {q.prompt}</p>
                  {q.explanation && <p className="text-slate-300/80 mt-1"><strong>Why: </strong>{q.explanation}</p>}
                  {q.citation && <p className="mt-1"><span className="badge-book">Book</span> <span className="text-slate-300/90">{q.citation}</span></p>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="btn-primary mt-4" onClick={onRetry}>Try again</button>
    </div>
  );
}
