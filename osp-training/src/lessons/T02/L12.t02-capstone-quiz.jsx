// Net-new — T02 Capstone Review integrating all T02 lessons
// D031: graded inline Quiz retired — the T02-final pool is the graded capstone gate now.

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T02.L12',
  course_id: 'T02',
  title: 'T02 Capstone Review — Fiber Physics',
  order: 12,
  lesson_type: 'capstone-review',
  completesOnView: true,
  prerequisites: [
    'T02.L01', 'T02.L02', 'T02.L03', 'T02.L04',
    'T02.L05', 'T02.L06', 'T02.L07', 'T02.L08',
    'T02.L09', 'T02.L10', 'T02.L11',
  ],
  vocabulary_introduced: [],
  learning_objectives: [
    'Synthesize fiber-physics knowledge to build a complete link budget from optical source to receiver',
    'Select appropriate fiber type (SMF grade, wavelength, span) given a distance and bit-rate requirement',
    'Verify that splice/connector/macrobend losses plus attenuation leave positive link margin',
    'Apply the full toolkit (dB math, PMD specs, MFD matching, field-adjustment rules) to justify design recommendations',
  ],
  vocabulary_assumed: [
    { term: 'total internal reflection', source_lesson_id: 'T02.L01' },
    { term: 'core', source_lesson_id: 'T02.L01' },
    { term: 'cladding', source_lesson_id: 'T02.L01' },
    { term: 'NA', source_lesson_id: 'T02.L01' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'chromatic dispersion', source_lesson_id: 'T02.L03' },
    { term: 'PMD', source_lesson_id: 'T02.L03' },
    { term: 'macrobend', source_lesson_id: 'T02.L04' },
    { term: 'microbend', source_lesson_id: 'T02.L04' },
    { term: 'dB', source_lesson_id: 'T02.L05' },
    { term: 'dBm', source_lesson_id: 'T02.L05' },
    { term: 'link budget', source_lesson_id: 'T02.L06' },
    { term: 'optical headroom', source_lesson_id: 'T02.L06' },
    { term: 'wavelength window', source_lesson_id: 'T02.L07' },
    { term: 'OS2', source_lesson_id: 'T02.L08' },
    { term: 'OM4', source_lesson_id: 'T02.L08' },
    { term: 'DGD', source_lesson_id: 'T02.L09' },
  ],
  estimated_minutes: 30,
};

export default function T02L12_CapstoneQuiz() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>T02 Capstone Review — Fiber Physics</h2>
        <p>
          This review spans all eleven content lessons in T02. Work through the link-budget
          calculator below — it pressure-tests the full toolkit (dB math, attenuation planning
          values, splice/connector loss, safety margin) the way a real fiber-physics design
          check would. The graded T02 capstone assessment — drawn from the full T02 pool — is
          the gate for the topic; this page is reading/review material, not a graded quiz.
        </p>
      </section>

      {/* WORKED EXAMPLE: capstone link budget verification */}
      <WorkedExample
        title="Capstone Budget Verification — Before You Start the Quiz"
        description="Work through this budget first. The quiz will include questions about it. A 22 km OS2 SMF link at 1550 nm: Tx = +4 dBm, Rx sensitivity = −26 dBm, 7 splices, 6 connectors, 3 dB safety margin."
        variables={[
          { key: 'tx', label: 'Tx power', units: 'dBm', default: 4, min: -5, max: 10, step: 0.5 },
          { key: 'rx', label: 'Rx sensitivity', units: 'dBm', default: -26, min: -40, max: -5, step: 0.5 },
          { key: 'km', label: 'Fiber length', units: 'km', default: 22, min: 1, max: 100, step: 0.5 },
          { key: 'atten', label: 'Attenuation (planning value)', units: 'dB/km', default: 0.25, min: 0.18, max: 0.40, step: 0.01 },
          { key: 'splices', label: 'Number of fusion splices', units: '', default: 7, min: 0, max: 50, step: 1 },
          { key: 'splLoss', label: 'Loss per splice', units: 'dB', default: 0.15, min: 0.05, max: 0.50, step: 0.01 },
          { key: 'conns', label: 'Number of connector pairs', units: '', default: 6, min: 0, max: 30, step: 1 },
          { key: 'connLoss', label: 'Loss per connector pair', units: 'dB', default: 0.30, min: 0.10, max: 0.75, step: 0.01 },
          { key: 'margin', label: 'Safety margin', units: 'dB', default: 3, min: 0, max: 6, step: 0.5 },
        ]}
        formula={({ tx, rx, km, atten, splices, splLoss, conns, connLoss, margin }) => {
          const budget = tx - rx;
          const totalLoss = km * atten + splices * splLoss + conns * connLoss + margin;
          return budget - totalLoss;
        }}
        steps={({ tx, rx, km, atten, splices, splLoss, conns, connLoss, margin }, headroom) => {
          const budget = tx - rx;
          const fiberLoss = km * atten;
          const spliceLoss = splices * splLoss;
          const connTotal = conns * connLoss;
          const totalLoss = fiberLoss + spliceLoss + connTotal + margin;
          return [
            { expression: `Budget = Tx − Rx = ${tx} − (${rx}) = ${budget.toFixed(1)} dB` },
            { expression: `Fiber loss = ${km} km × ${atten} dB/km`, value: fiberLoss, unit: 'dB' },
            { expression: `Splice loss = ${splices} × ${splLoss} dB`, value: spliceLoss, unit: 'dB' },
            { expression: `Connector loss = ${conns} × ${connLoss} dB`, value: connTotal, unit: 'dB' },
            { expression: `Safety margin = ${margin} dB` },
            { expression: `Total loss = ${fiberLoss.toFixed(2)} + ${spliceLoss.toFixed(2)} + ${connTotal.toFixed(2)} + ${margin} = ${totalLoss.toFixed(2)} dB` },
            { expression: `Headroom = ${budget} − ${totalLoss.toFixed(2)}`, value: headroom, unit: 'dB' },
          ];
        }}
        sanityCheck={(headroom) =>
          headroom >= 0
            ? `Headroom = ${headroom.toFixed(2)} dB — link passes. You have ${headroom.toFixed(2)} dB of reserve above the safety margin.`
            : `Headroom = ${headroom.toFixed(2)} dB — link FAILS. Total loss exceeds available budget by ${Math.abs(headroom).toFixed(2)} dB. Redesign required.`
        }
        resultLabel="Headroom"
        resultUnit="dB"
        resultDecimals={2}
      />


      {/* ── 20 MC/DRAG-MATCH QUESTIONS RETIRED (D031) — see T02-final pool for the graded capstone ── */}

    </LessonLayout>
  );
}
