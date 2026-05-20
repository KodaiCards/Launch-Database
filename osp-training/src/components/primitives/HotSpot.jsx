import React from 'react';

/**
 * Stub component — rendered as text-only after image-based feature was removed.
 * Preserves regional content as a labeled list.
 */
export default function HotSpot({ caption, regions, hotspots, items, children }) {
  const regionList = regions || hotspots || items;

  return (
    <div className="my-4 p-4 border border-slate-700 rounded bg-slate-800/30">
      {caption && (
        <p className="text-sm font-semibold text-slate-200 mb-3">{caption}</p>
      )}
      {Array.isArray(regionList) && regionList.length > 0 && (
        <ul className="space-y-2 text-sm text-slate-300 list-disc ml-5">
          {regionList.map((r, idx) => {
            const label = r?.label || r?.title || r?.name || r?.text || `Region ${idx + 1}`;
            const desc = r?.description || r?.explanation || r?.body || r?.violation || '';
            return (
              <li key={idx}>
                <strong className="text-slate-200">{label}</strong>
                {desc && <span className="text-slate-300">{' — ' + desc}</span>}
              </li>
            );
          })}
        </ul>
      )}
      {children}
    </div>
  );
}
