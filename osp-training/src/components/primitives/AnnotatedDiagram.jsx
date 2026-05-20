import React from 'react';

/**
 * Stub component — rendered as text-only after diagram feature was removed.
 * Preserves label content for pedagogy without rendering images.
 */
export default function AnnotatedDiagram({ caption, labels, points, hotPoints, items, children }) {
  const labelList = labels || points || hotPoints || items;

  return (
    <div className="my-4 p-4 border border-slate-700 rounded bg-slate-800/30">
      {caption && (
        <p className="text-sm font-semibold text-slate-200 mb-3">{caption}</p>
      )}
      {Array.isArray(labelList) && labelList.length > 0 && (
        <ul className="space-y-2 text-sm text-slate-300 list-disc ml-5">
          {labelList.map((item, idx) => {
            const label = item?.label || item?.title || item?.name || item?.text || `Item ${idx + 1}`;
            const desc = item?.description || item?.explanation || item?.tip || item?.body || '';
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
