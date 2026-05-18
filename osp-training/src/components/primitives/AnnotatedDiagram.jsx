import React, { useState } from 'react';

/**
 * AnnotatedDiagram — SVG/image overlay with clickable and hoverable hot-points.
 *
 * Renders an image (or an inline SVG string) with labeled annotation points
 * overlaid. Each hot-point can be triggered by click or hover. Mobile-friendly:
 * tap behavior mirrors click on touch devices.
 *
 * @param {string}  title          - Section title above the diagram.
 * @param {string}  [description]  - Short explanatory caption below the title.
 * @param {string}  src            - Image URL (PNG/JPG/SVG file path).
 * @param {string}  [alt]          - Alt text for the image (accessibility).
 * @param {number}  [aspectRatio]  - Width/height ratio of the source image.
 *                                   Used to size the overlay correctly.
 *                                   Default 16/9.
 * @param {Array}   hotPoints      - Array of hot-point descriptor objects:
 *   {
 *     id:          string,   // unique key
 *     x:           number,   // 0–100, percentage of image width
 *     y:           number,   // 0–100, percentage of image height
 *     label:       string,   // short label shown on the pin
 *     explanation: string,   // longer explanation shown in the callout panel
 *     type:        'click' | 'hover'  // interaction mode (default 'click')
 *   }
 */
export default function AnnotatedDiagram({
  title,
  description,
  src,
  alt = 'Annotated diagram',
  aspectRatio = 16 / 9,
  hotPoints = [],
}) {
  const [active, setActive] = useState(null); // id of currently shown hot-point

  function toggle(id, type) {
    if (type === 'hover') return; // hover handled separately
    setActive(prev => (prev === id ? null : id));
  }

  function onMouseEnter(id, type) {
    if (type === 'hover') setActive(id);
  }

  function onMouseLeave(id, type) {
    if (type === 'hover') setActive(null);
  }

  const activePoint = hotPoints.find(p => p.id === active);

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-300/70 mb-3">{description}</p>
      )}

      {/* Diagram container — relative so pins can be positioned absolutely */}
      <div
        className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/30"
        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
      >
        {/* The source image */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {/* Hot-point pins */}
        {(hotPoints ?? []).map(hp => {
          const isActive = active === hp.id;
          return (
            <button
              key={hp.id}
              style={{ left: `${hp.x}%`, top: `${hp.y}%` }}
              className={[
                'absolute -translate-x-1/2 -translate-y-1/2',
                'flex items-center justify-center',
                'w-7 h-7 rounded-full border-2 text-xs font-bold',
                'transition-all duration-150 cursor-pointer select-none',
                'focus:outline-none focus:ring-2 focus:ring-ospamber',
                isActive
                  ? 'bg-ospamber border-amber-200 text-ospnavy scale-125 z-20'
                  : 'bg-ospnavy/80 border-ospamber/70 text-amber-200 hover:scale-110 z-10',
              ].join(' ')}
              onClick={() => toggle(hp.id, hp.type ?? 'click')}
              onMouseEnter={() => onMouseEnter(hp.id, hp.type ?? 'click')}
              onMouseLeave={() => onMouseLeave(hp.id, hp.type ?? 'click')}
              aria-label={`Hot-point: ${hp.label}`}
              aria-expanded={isActive}
            >
              {hp.label.charAt(0).toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Legend — shows all labels; active one is highlighted */}
      <div className="mt-3 flex flex-wrap gap-2">
        {(hotPoints ?? []).map(hp => (
          <button
            key={hp.id}
            onClick={() => toggle(hp.id, hp.type ?? 'click')}
            className={[
              'px-2 py-1 rounded text-xs border transition',
              active === hp.id
                ? 'bg-ospamber/20 border-ospamber text-amber-200'
                : 'bg-white/5 border-white/15 text-slate-300/80 hover:border-white/40',
            ].join(' ')}
          >
            {hp.label}
          </button>
        ))}
      </div>

      {/* Explanation panel for the active hot-point */}
      {activePoint && (
        <div className="mt-3 rounded-lg border border-ospamber/30 bg-ospamber/5 p-4 text-sm text-slate-200 leading-relaxed">
          <p className="font-semibold text-amber-300 mb-1">{activePoint.label}</p>
          <p>{activePoint.explanation}</p>
        </div>
      )}

      {!activePoint && hotPoints.length > 0 && (
        <p className="mt-3 text-xs text-slate-300/50 italic">
          {hotPoints.some(p => (p.type ?? 'click') === 'hover')
            ? 'Hover over a pin or label to see details.'
            : 'Click a pin or label to see details.'}
        </p>
      )}
    </div>
  );
}
