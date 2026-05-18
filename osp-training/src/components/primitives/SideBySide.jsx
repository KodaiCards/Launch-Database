import React from 'react';

/**
 * SideBySide — two-column comparison table for contrasting options or standards.
 *
 * Useful for Book-vs-field, aerial-vs-underground, SMF-vs-MMF, and similar
 * "these two things differ in these ways" teaching patterns. An optional
 * `highlight` prop calls out the most decisive row.
 *
 * @param {string}   title           - Section title.
 * @param {string}   [description]   - Short intro text above the table.
 * @param {string}   leftTitle       - Header for the left column.
 * @param {string}   rightTitle      - Header for the right column.
 * @param {Array}    comparisonRows  - Array of row descriptor objects:
 *   {
 *     label:      string,           // Row category label (left-most column)
 *     leftValue:  string,           // Value in the left column
 *     rightValue: string,           // Value in the right column
 *     note?:      string,           // Optional footnote shown below the row
 *   }
 * @param {string}   [highlight]     - label value of the row to visually emphasize.
 *                                     Use this to call out the most important distinction.
 * @param {string}   [leftColor]     - Tailwind text color class for left column header.
 *                                     Default 'text-sky-300'.
 * @param {string}   [rightColor]    - Tailwind text color class for right column header.
 *                                     Default 'text-amber-300'.
 */
export default function SideBySide({
  title,
  description,
  leftTitle,
  rightTitle,
  leftLabel,
  rightLabel,
  comparisonRows,
  rows,
  highlight,
  leftColor  = 'text-sky-300',
  rightColor = 'text-amber-300',
}) {
  const headerLeft  = leftTitle  ?? leftLabel  ?? '';
  const headerRight = rightTitle ?? rightLabel ?? '';
  const data = comparisonRows ?? rows ?? [];
  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-300/70 mb-4 leading-relaxed">{description}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/15">
              <th className="py-2 pr-4 text-left text-xs uppercase tracking-wider text-slate-300/50 w-1/4">
                Category
              </th>
              <th className={`py-2 px-4 text-left font-semibold ${leftColor} w-[38%]`}>
                {headerLeft}
              </th>
              <th className={`py-2 pl-4 text-left font-semibold ${rightColor} w-[38%]`}>
                {headerRight}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const isHighlighted = row.label === highlight;
              const leftCell  = row.leftValue  ?? row.left  ?? '';
              const rightCell = row.rightValue ?? row.right ?? '';
              return (
                <React.Fragment key={i}>
                  <tr
                    className={[
                      'border-b transition',
                      isHighlighted
                        ? 'border-ospamber/40 bg-ospamber/5'
                        : 'border-white/5 hover:bg-white/3',
                    ].join(' ')}
                  >
                    <td className={`py-3 pr-4 font-medium align-top ${isHighlighted ? 'text-amber-200' : 'text-slate-300/80'}`}>
                      {isHighlighted && (
                        <span className="text-ospamber mr-1" aria-label="Key distinction">★</span>
                      )}
                      {row.label}
                    </td>
                    <td className={`py-3 px-4 align-top leading-relaxed ${isHighlighted ? 'text-slate-100' : 'text-slate-200'}`}>
                      {leftCell}
                    </td>
                    <td className={`py-3 pl-4 align-top leading-relaxed ${isHighlighted ? 'text-slate-100' : 'text-slate-200'}`}>
                      {rightCell}
                    </td>
                  </tr>
                  {row.note && (
                    <tr className="border-b border-white/5">
                      <td colSpan={3} className="pb-2 pr-4 text-xs text-slate-300/50 italic leading-relaxed">
                        Note: {row.note}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {highlight && (
        <p className="mt-3 text-xs text-slate-300/50">
          <span className="text-ospamber">★</span> marks the most decisive distinction for this comparison.
        </p>
      )}
    </div>
  );
}
