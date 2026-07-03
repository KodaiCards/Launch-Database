/**
 * ReferencesBlock — collapsible per-lesson citation list.
 *
 * PRODUCT_BAR §1.4: "Codes are references, not curriculum." Exact code/form/CFR
 * citations belong here, not in body prose — body prose explains what a code
 * governs and why it matters on the job; this block is where a trainee looks
 * up the exact number if they need it.
 *
 * Usage:
 *   <ReferencesBlock items={[
 *     { citation: 'NESC Rule 232', note: 'Vertical clearance table' },
 *     { citation: 'TIA-598-D', note: 'Fiber color-code sequence' },
 *   ]} />
 */

import React, { useId, useState } from 'react';

export default function ReferencesBlock({ items = [], title = 'References', children }) {
  const [open, setOpen] = useState(false);
  const bodyId = `references-block-body-${useId()}`;

  if ((!items || items.length === 0) && !children) return null;

  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
          {title}
        </span>
        <span className="flex-1 border-t border-white/10" />
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div id={bodyId} className="px-4 pb-4 space-y-2 text-sm text-slate-300/90">
          {items.map((item, i) => (
            <div
              key={item.citation || i}
              className="pt-2 border-t border-white/10 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-amber-300/90">{item.citation}</span>
              {item.note && <span className="ml-2 text-slate-400">— {item.note}</span>}
            </div>
          ))}
          {children}
        </div>
      )}
    </div>
  );
}
