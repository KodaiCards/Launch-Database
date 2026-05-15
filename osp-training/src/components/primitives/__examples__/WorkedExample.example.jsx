import React from 'react';
import WorkedExample from '../WorkedExample.jsx';

/**
 * WorkedExample.example — Cable sag formula demo.
 *
 * The parabolic sag formula is the go-to planning calculation for aerial
 * fiber: it tells you how much a cable will droop at midspan. NESC §235
 * specifies minimum ground clearance; if your sag puts you below that
 * clearance you need a shorter span or a different loading condition.
 *
 * Formula:  sag = (w × S²) / (8 × T)
 *   w  = cable weight per unit length (lb/ft)
 *   S  = span length (ft)
 *   T  = horizontal tension (lb) — typically 60% of RBS at installation
 */

const SAG_VARIABLES = [
  { key: 'w', label: 'Cable weight',      units: 'lb/ft', default: 0.08, min: 0.01, step: 0.01 },
  { key: 'S', label: 'Span length',       units: 'ft',    default: 125,  min: 10,   step: 1    },
  { key: 'T', label: 'Horizontal tension', units: 'lb',   default: 180,  min: 10,   step: 1    },
];

function sagFormula({ w, S, T }) {
  return (w * S * S) / (8 * T);
}

function sagSteps({ w, S, T }, result) {
  const numerator   = w * S * S;
  const denominator = 8 * T;
  return [
    { expression: `sag = (w × S²) / (8 × T)` },
    { expression: `     = (${w} lb/ft × ${S} ft × ${S} ft)`, value: numerator, unit: 'lb·ft' },
    { expression: `     ÷ (8 × ${T} lb)`, value: denominator, unit: 'lb' },
    { expression: `     = ${numerator.toFixed(2)} ÷ ${denominator}`, value: result, unit: 'ft' },
  ];
}

function sagSanityCheck(result) {
  const inches = (result * 12).toFixed(1);
  if (result < 1) {
    return `${result.toFixed(2)} ft of sag means the cable is under high tension and barely droops — verify the rated breaking strength isn't being exceeded.`;
  }
  if (result > 10) {
    return `${result.toFixed(2)} ft (${inches} inches) of sag is substantial. Double-check NESC §235 ground clearance requirements for this span and loading district before signing off.`;
  }
  return `${result.toFixed(2)} ft (${inches} inches) of sag at midspan. Verify this leaves adequate NESC §235 clearance above the highest point the line crosses (road, railway, etc.).`;
}

export default function WorkedExampleDemo() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <h1 className="text-2xl font-bold text-amber-300">WorkedExample — Example Usage</h1>

      <WorkedExample
        title="Aerial Cable Sag Calculator"
        description={
          'The parabolic sag formula tells you how much a cable droops at the center of a span. '
          + 'NESC §235 sets the minimum ground clearance — if your sag brings the cable too low, '
          + 'shorten the span or increase the tension (within the cable\'s rated breaking strength).'
        }
        variables={SAG_VARIABLES}
        formula={sagFormula}
        steps={sagSteps}
        sanityCheck={sagSanityCheck}
        resultLabel="Sag at midspan"
        resultUnit="ft"
        resultDecimals={2}
      />
    </div>
  );
}
