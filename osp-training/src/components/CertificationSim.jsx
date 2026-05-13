import React, { useEffect, useMemo, useState } from 'react';

/**
 * Randomized, timed certification simulator for Module 12.
 *
 * Inputs: a question bank with `domain` tags. The sim draws `count`
 * questions, weighting domains roughly to mirror a published BICSI exam
 * blueprint. The actual blueprint should be confirmed against BICSI's
 * current public RCDD / OSP exam pages — placeholder weights live in the
 * module data file and are clearly marked.
 *
 * This is NOT a leaked exam. All questions are platform-original, framed
 * to test the same competencies as the certifications.
 */

export default function CertificationSim({ bank, domainWeights, count = 100, minutes = 150 }) {
  const questions = useMemo(() => sample(bank, domainWeights, count), [bank, domainWeights, count]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secs, setSecs] = useState(minutes * 60);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || done) return;
    if (secs <= 0) { setDone(true); setRunning(false); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, running, done]);

  const q = questions[idx];
  const progress = Object.keys(answers).length;

  function answer(i) {
    setAnswers(a => ({ ...a, [q.id]: i }));
  }

  function submit() { setDone(true); setRunning(false); }

  if (done) {
    const correct = questions.filter(qq => answers[qq.id] === qq.answerIndex).length;
    const pct = Math.round((correct / questions.length) * 100);
    const byDomain = groupBy(questions, 'domain');
    return (
      <div className="panel space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Certification Sim — Result</h3>
          <p className="text-3xl font-bold text-amber-300 mt-1">
            {correct} / {questions.length} <span className="text-base font-normal text-slate-300/70">({pct}%)</span>
          </p>
          <p className="text-xs text-slate-300/70 mt-1">
            BICSI's actual passing thresholds vary; this score is a study
            indicator, not a pass/fail prediction.
          </p>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">By domain</div>
          <ul className="text-sm space-y-1">
            {Object.entries(byDomain).map(([d, qs]) => {
              const c = qs.filter(qq => answers[qq.id] === qq.answerIndex).length;
              return (
                <li key={d} className="flex justify-between border-b border-white/5 py-1">
                  <span>{d}</span>
                  <span className="font-mono">{c} / {qs.length}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-[11px] uppercase tracking-widest text-slate-300/60 mb-2">Review missed questions</div>
          <ul className="space-y-3">
            {questions.filter(qq => answers[qq.id] !== qq.answerIndex).slice(0, 25).map(qq => (
              <li key={qq.id} className="border-l-2 border-rose-400/40 pl-3">
                <div className="text-slate-100">{qq.prompt}</div>
                <div className="text-xs text-slate-300/80 mt-1">
                  Correct: <span className="text-emerald-300">{qq.choices[qq.answerIndex]}</span>
                </div>
                {qq.explanation && <div className="text-xs text-slate-300/70 mt-1">{qq.explanation}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (!q) {
    return <div className="panel">No questions available — populate the bank first.</div>;
  }

  return (
    <div className="panel">
      <header className="flex items-center justify-between mb-3 text-sm">
        <span>Question {idx + 1} / {questions.length}</span>
        <span className="font-mono">⏱ {fmt(secs)}</span>
        <span>Answered: {progress} / {questions.length}</span>
      </header>

      <div className="text-[11px] uppercase tracking-widest text-amber-300/80 mb-1">{q.domain}</div>
      <p className="text-slate-100 mb-3">{q.prompt}</p>

      <ul className="space-y-2">
        {q.choices.map((c, i) => {
          const picked = answers[q.id] === i;
          return (
            <li key={i}>
              <button
                onClick={() => answer(i)}
                className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                  picked ? 'border-ospamber bg-ospamber/10' : 'border-white/15 hover:border-white/40'}`}>
                <span className="font-mono text-xs text-slate-300/60 mr-2">{String.fromCharCode(65+i)}.</span>{c}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Back</button>
          <button className="btn-ghost" onClick={() => setIdx(i => Math.min(questions.length - 1, i + 1))} disabled={idx === questions.length - 1}>Next →</button>
        </div>
        <button className="btn-primary" onClick={submit}>Submit exam</button>
      </div>
    </div>
  );
}

function fmt(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

function groupBy(arr, key) {
  return arr.reduce((acc, x) => { (acc[x[key]] = acc[x[key]] || []).push(x); return acc; }, {});
}

function sample(bank, weights, count) {
  // weights: { domain: number } — relative weight; weights are normalized.
  // If a domain doesn't exist in bank, its weight is silently dropped.
  const byDomain = groupBy(bank, 'domain');
  const usableDomains = Object.keys(byDomain);
  const wEntries = Object.entries(weights || {}).filter(([d]) => usableDomains.includes(d));
  const wTotal = wEntries.reduce((s, [, w]) => s + w, 0) || 1;
  const out = [];
  for (const [domain, w] of wEntries) {
    const target = Math.round((w / wTotal) * count);
    const pool = shuffle([...byDomain[domain]]);
    out.push(...pool.slice(0, target));
  }
  // top up if rounding came up short
  if (out.length < count) {
    const remaining = shuffle(bank.filter(q => !out.includes(q)));
    out.push(...remaining.slice(0, count - out.length));
  }
  return shuffle(out).slice(0, count);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
