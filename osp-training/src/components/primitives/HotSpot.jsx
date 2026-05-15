import React, { useState } from 'react';

/**
 * HotSpot — click-to-identify region quiz over an image.
 *
 * Overlays clickable regions on an image. The user clicks a region;
 * the component highlights it and reveals feedback. Supports "find the
 * safety violation" / "identify the make-ready issue" teaching patterns.
 *
 * Regions can be marked correct or incorrect. In "challenge" mode (default)
 * the user must click the correct region(s); in "explore" mode every click
 * immediately reveals the feedback for that region.
 *
 * @param {string}  title           - Section title.
 * @param {string}  [description]   - Instruction text shown above the image.
 * @param {string}  src             - Image URL.
 * @param {string}  [alt]           - Alt text for the image.
 * @param {number}  [aspectRatio]   - Width/height ratio. Default 16/9.
 * @param {string}  [mode]          - 'challenge' (user must find correct region)
 *                                    | 'explore' (all regions reveal on click).
 *                                    Default 'challenge'.
 * @param {Array}   regions         - Array of region descriptor objects:
 *   {
 *     id:          string,   // unique key
 *     x:           number,   // left edge, 0–100 (% of image width)
 *     y:           number,   // top edge, 0–100 (% of image height)
 *     w:           number,   // width, 0–100 (% of image width)
 *     h:           number,   // height, 0–100 (% of image height)
 *     isCorrect:   boolean,  // true = this is the "right" region to click
 *     label:       string,   // short name shown in the region list
 *     feedback:    string,   // explanation revealed after clicking
 *   }
 */
export default function HotSpot({
  title,
  description,
  src,
  alt = 'Hot-spot activity image',
  aspectRatio = 16 / 9,
  mode = 'challenge',
  regions = [],
}) {
  const [clicked, setClicked]   = useState(new Set()); // ids of clicked regions
  const [resolved, setResolved] = useState(false);

  const correctIds = new Set(regions.filter(r => r.isCorrect).map(r => r.id));
  const allCorrectFound = [...correctIds].every(id => clicked.has(id));

  function handleClick(regionId) {
    if (resolved) return;
    const next = new Set(clicked);
    next.add(regionId);
    setClicked(next);
    if (mode === 'challenge') {
      const region = regions.find(r => r.id === regionId);
      if (region?.isCorrect) {
        // Check if all correct regions are now found
        const allFound = [...correctIds].every(id => next.has(id));
        if (allFound) setResolved(true);
      } else {
        // Wrong click — still show feedback but don't resolve
      }
    }
    // In explore mode, just reveal and continue
  }

  function reset() {
    setClicked(new Set());
    setResolved(false);
  }

  const clickedRegions = regions.filter(r => clicked.has(r.id));

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-300/70 mb-3 leading-relaxed">{description}</p>
      )}

      {/* Image with region overlays */}
      <div
        className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/30"
        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />

        {regions.map(r => {
          const isClicked  = clicked.has(r.id);
          const isCorrect  = r.isCorrect;
          const showResult = isClicked || resolved;

          let overlayClass = 'border-2 border-dashed border-white/20 hover:border-ospamber/60 cursor-pointer';
          if (showResult && isCorrect)           overlayClass = 'border-2 border-ospgreen bg-ospgreen/20 cursor-default';
          else if (showResult && !isCorrect)     overlayClass = 'border-2 border-rose-400 bg-rose-400/10 cursor-default';
          else if (!showResult)                  overlayClass = 'border-2 border-dashed border-white/20 hover:border-ospamber/60 cursor-pointer';

          return (
            <div
              key={r.id}
              style={{
                position: 'absolute',
                left:   `${r.x}%`,
                top:    `${r.y}%`,
                width:  `${r.w}%`,
                height: `${r.h}%`,
              }}
              className={`rounded transition-all duration-150 ${overlayClass}`}
              onClick={() => !showResult && handleClick(r.id)}
              role="button"
              tabIndex={0}
              aria-label={`Click region: ${r.label}`}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && !showResult && handleClick(r.id)}
            />
          );
        })}
      </div>

      {/* Status message */}
      {!resolved && mode === 'challenge' && (
        <p className="mt-3 text-xs text-slate-300/50 italic">
          Click the region that shows{' '}
          {correctIds.size === 1 ? 'the issue' : `all ${correctIds.size} issues`}.
        </p>
      )}
      {resolved && (
        <p className="mt-3 text-sm text-ospgreen font-medium">
          ✓ You found {correctIds.size === 1 ? 'it' : 'all issues'}.
        </p>
      )}

      {/* Feedback for clicked regions */}
      {clickedRegions.length > 0 && (
        <div className="mt-3 space-y-2">
          {clickedRegions.map(r => (
            <div
              key={r.id}
              className={[
                'rounded-lg border p-3 text-sm leading-relaxed',
                r.isCorrect
                  ? 'border-ospgreen/40 bg-ospgreen/5 text-slate-200'
                  : 'border-rose-400/40 bg-rose-400/5 text-slate-200',
              ].join(' ')}
            >
              <span className={`font-semibold mr-2 ${r.isCorrect ? 'text-ospgreen' : 'text-rose-300'}`}>
                {r.isCorrect ? '✓' : '✗'} {r.label}:
              </span>
              {r.feedback}
            </div>
          ))}
        </div>
      )}

      {(resolved || (mode === 'explore' && clickedRegions.length > 0)) && (
        <button className="btn-ghost mt-4 text-sm" onClick={reset}>
          Reset
        </button>
      )}
    </div>
  );
}
