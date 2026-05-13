import React from 'react';

/**
 * Shared building blocks used by every module:
 *   <ModuleHeader number title intro />
 *   <Section title>...</Section>
 *   <Callout kind="book|field|verify" title>...</Callout>
 *   <RefList items=[{ tag, text, url? }] />     - shows the editorial citations
 */

export function ModuleHeader({ number, title, intro }) {
  return (
    <header className="panel">
      <div className="text-xs uppercase tracking-widest text-amber-300/80">
        Module {String(number).padStart(2, '0')}
      </div>
      <h1 className="text-2xl font-bold mt-1">{title}</h1>
      {intro && <p className="text-slate-300/90 mt-2">{intro}</p>}
    </header>
  );
}

export function Section({ title, children }) {
  return (
    <section className="panel">
      <h2 className="text-xl font-semibold border-b border-white/10 pb-2 mb-3">{title}</h2>
      <div className="space-y-2 text-slate-200 leading-relaxed">{children}</div>
    </section>
  );
}

export function Callout({ kind = 'book', title, children }) {
  const stripe = kind === 'field'  ? 'border-l-ospamber bg-ospamber/5'
              : kind === 'verify' || kind === 'warn' ? 'border-l-rose-400 bg-rose-400/5'
              :                       'border-l-sky-400  bg-sky-400/5';
  const badge  = kind === 'field'  ? 'badge-field'
              : kind === 'verify' || kind === 'warn' ? 'badge-warn'
              :                       'badge-book';
  const label  = kind === 'field'  ? 'Field'
              : kind === 'verify' || kind === 'warn' ? 'Verify'
              :                       'Book';
  return (
    <div className={`mt-3 border-l-4 ${stripe} pl-4 py-2 rounded-r-md`}>
      <div className="flex items-center gap-2">
        <span className={badge}>{label}</span>
        <span className="text-sm font-semibold text-slate-100">{title}</span>
      </div>
      <div className="text-sm text-slate-200/90 mt-1">{children}</div>
    </div>
  );
}

export function RefList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="panel">
      <h2 className="text-xs uppercase tracking-widest text-slate-300/60 mb-2">
        Sources & references
      </h2>
      <ul className="text-xs space-y-1.5 text-slate-300/85">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={
              it.tag === 'field'  ? 'badge-field'
            : it.tag === 'verify' ? 'badge-warn'
            : it.tag === 'forum'  ? 'badge bg-fuchsia-700/30 text-fuchsia-200 border border-fuchsia-400/40'
            :                       'badge-book'
            }>{it.tag}</span>
            <span className="flex-1">
              {it.url
                ? <a href={it.url} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-amber-200">{it.text}</a>
                : it.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-sm border border-white/10 rounded-lg">
        <thead className="bg-white/5 text-slate-200">
          <tr>{headers.map((h, i) => <th key={i} className="px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody className="text-slate-300/90">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-white/10">
              {r.map((c, j) => <td key={j} className="px-3 py-2">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
