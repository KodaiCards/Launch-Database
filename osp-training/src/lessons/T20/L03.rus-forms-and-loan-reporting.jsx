import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L03',
  course_id: 'T20',
  title: 'RUS Forms & Loan Reporting: 307, 740, 219',
  order: 3,
  prerequisites: ['T04.L01', 'T10.L01'],
  learning_objectives: [
    'Describe RUS Form 307 (construction ledger, cost tracking, drawdown)',
    'Identify RUS Form 740 (contractor certification)',
    'Explain RUS Form 219 (ground-electrode testing)',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'construction', source_lesson_id: 'T01.L05' },
  ],
};

export const key_terms = [];

export default function T20L03_RUSForms() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS doesn't fund on a handshake. Borrowers prove they spent money and built to spec by submitting three critical forms: Form 307 (cost ledger), Form 740 (contractor certs), and Form 219 (grounding test). These forms unlock loan drawdown — no forms, no payment. Your job: ensure forms are complete, accurate, and signed.</p>

        <h3 className="mt-4 font-semibold">The Three RUS Forms</h3>
        <div className="mt-3 space-y-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">Form 307: Construction Ledger & Cost Tracking</p>
            <p className="text-slate-300/90 mt-1">Shows costs (labor, material, equipment) allocated to plant accounts (Cable & Wire, Poles, Conduit, Land). Form 307 is submitted quarterly with construction phase. RUS reviews costs, approves, releases next drawdown. Missing or inaccurate Form 307 stalls payment.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Form 740: Contractor Certification</p>
            <p className="text-slate-300/90 mt-1">Contractor certifies: no discrimination, bonding/insurance in place, no conflicts of interest, prevailing wage rates paid (if applicable). Must be signed by contractor before work begins. RUS requires Form 740 upfront; work cannot start without it.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-purple-300">Form 219: Ground-Rod Testing & Acceptance</p>
            <p className="text-slate-300/90 mt-1">Documents: ground-rod location, measured resistance (Ohms), date tested, tested-by signature, engineer approval. Must meet RUS threshold (&lt;5Ω for new, varies by region). No valid Form 219 = OSP cannot be accepted.</p>
          </div>
        </div>
      </section>

      <section data-tier="working">
        <h2>Form 307 Drawdown Cycle</h2>
        <p className="mt-2">Quarterly construction cycle: (1) Contractor completes phase (e.g., 50 miles aerial installed). (2) Engineer inspects, measures actual costs. (3) Form 307 filled out by borrower, attaching invoices + test reports. (4) RUS approves (or requests rework). (5) Loan funds disbursed. Late Form 307 = late payment = contractor cash flow breaks. Your inspection speed directly affects borrower's ability to pay.</p>

        <h3 className="mt-4 font-semibold">Book vs. Field: Form 307 Detail</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">Each cost item in Form 307 must be allocated to the correct USOA plant account with line-item detail (e.g., "50 mi aerial cable: $2,500 to account 32.2210").</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">Borrower often aggregates quarterly costs into summary line items, then RUS spreadsheet back-allocates to accounts. Detail exists in contractor invoices; Form 307 is the summary. RUS accepts if the summary reconciles to invoices.</p>
        </div>
      </section>

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Your work on <strong>construction</strong> (T10) and <strong>project estimation</strong> (T17) directly feeds into RUS Form 307.
          When you estimate costs in T17 and then oversee construction in the field, you're gathering the data that goes into Form 307.
          Forms are the bridge between engineering work (design, inspection) and RUS finance (drawdown, loan covenants).
          Accurate, timely forms = borrower gets paid on schedule. Sloppy forms = project stalls. That's why understanding RUS Forms matters beyond just paperwork — they're how construction actually gets funded.
        </p>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L03-Q1',
            type: 'mc',
            prompt: 'What is RUS Form 307 used for?',
            options: [
              { key: 'a', text: 'Contractor background checks' },
              { key: 'b', text: 'Construction cost ledger and loan drawdown' },
              { key: 'c', text: 'Ground-rod testing documentation' },
              { key: 'd', text: 'Equipment inventory' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L03-Q2',
            type: 'mc',
            prompt: 'RUS Form 740 is signed before:',
            options: [
              { key: 'a', text: 'The project is completed' },
              { key: 'b', text: 'Grounding testing' },
              { key: 'c', text: 'Work begins (upfront certification)' },
              { key: 'd', text: 'Inspection by RUS' },
            ],
            correct: 'c',
          },
        ]}
      />
    </LessonLayout>
  );
}
