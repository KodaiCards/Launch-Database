import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
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
  vocabulary_introduced: [
    'Form 307',
    'Form 740',
    'drawdown',
    'loan advance',
    'contractor certification',
  ],
  vocabulary_assumed: [
    { term: 'construction', source_lesson_id: 'T01.L05' },
  ],
};

export const key_terms = [
  {
    term: 'Form 307',
    definition: 'RUS construction ledger showing costs (labor, material, equipment) allocated to plant accounts (Cable & Wire, Poles, Conduit, Land). Submitted quarterly with construction phase; RUS reviews costs, approves, and releases next drawdown.',
  },
  {
    term: 'Form 740',
    definition: 'RUS contractor certification form. Contractor certifies no discrimination, bonding/insurance in place, no conflicts of interest, prevailing wage rates paid (if applicable). Must be signed before work begins.',
  },
  {
    term: 'drawdown',
    definition: 'Disbursement of loan funds by RUS to the borrower after reviewing and approving Form 307 cost documentation. Late Form 307 = late payment = contractor cash flow breaks.',
  },
  {
    term: 'loan advance',
    definition: 'Each quarterly release of RUS loan funds tied to a completed construction phase and approved Form 307. No valid Form 307 = no loan advance.',
  },
  {
    term: 'contractor certification',
    definition: 'The signed Form 740 attesting to contractor eligibility, bonding/insurance coverage, non-discrimination, and prevailing wage commitment. RUS won\'t allow work to proceed without it on file.',
  },
];

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

      <Flashcard
        deckId="T20-L03"
        cards={[
          {
            id: 'T20-L03-fc-307',
            front: 'What is RUS Form 307 and when is it submitted?',
            back: 'RUS construction ledger showing costs (labor, material, equipment) allocated to plant accounts (Cable & Wire, Poles, Conduit, Land). Submitted quarterly with construction phase; RUS reviews costs, approves, and releases next drawdown.',
          },
          {
            id: 'T20-L03-fc-740',
            front: 'What is RUS Form 740 and when must it be signed?',
            back: 'RUS contractor certification form. Contractor certifies no discrimination, bonding/insurance in place, no conflicts of interest, prevailing wage rates paid (if applicable). Must be signed before work begins.',
          },
          {
            id: 'T20-L03-fc-drawdown',
            front: 'What is a RUS drawdown?',
            back: 'Disbursement of loan funds by RUS to the borrower after reviewing and approving Form 307 cost documentation. Late Form 307 = late payment = contractor cash flow breaks.',
          },
          {
            id: 'T20-L03-fc-advance',
            front: 'What is a loan advance in RUS program terms?',
            back: 'Each quarterly release of RUS loan funds tied to a completed construction phase and approved Form 307. No valid Form 307 = no loan advance.',
          },
          {
            id: 'T20-L03-fc-certif',
            front: 'What does contractor certification mean in the RUS context?',
            back: 'The signed Form 740 attesting to contractor eligibility, bonding/insurance coverage, non-discrimination, and prevailing wage commitment. RUS won\'t allow work to proceed without it on file.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>Form 307 Drawdown Cycle</h2>
        <p className="mt-2">Quarterly construction cycle: (1) Contractor completes phase (e.g., 50 miles aerial installed). (2) Engineer inspects, measures actual costs. (3) Form 307 filled out by borrower, attaching invoices + test reports. (4) RUS approves (or requests rework). (5) Loan funds disbursed. Late Form 307 = late payment = contractor cash flow breaks. Your inspection speed directly affects borrower's ability to pay.</p>

        <h3 className="mt-4 font-semibold">Form 307: What's in Each Column</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-1 text-slate-300/90">
          <p>Form 307 is structured as a construction ledger with columns:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Plant account code</strong> — 47 CFR Part 32 account (§32.2410, §32.2411, §32.2441, §32.2220)</li>
            <li><strong>Description</strong> — What was installed (e.g., "Aerial ADSS 144-ct SMF, 20 miles")</li>
            <li><strong>Cost this period</strong> — Invoice amount for this construction phase</li>
            <li><strong>Cumulative cost</strong> — Running total against the approved cost-per-mile allowance</li>
            <li><strong>% complete</strong> — RUS tracks proportional drawdown vs. proportional completion</li>
            <li><strong>Engineer certification</strong> — Licensed PE must sign Form 307 confirming costs are for work actually completed and in place</li>
          </ul>
          <p className="mt-2">The borrower submits Form 307 with supporting documentation: contractor invoices, material purchase orders, payroll summaries (if labor is included), and test results (OLTS printouts, Form 219 copies).</p>
        </div>

        <h3 className="mt-4 font-semibold">Form 740: Contractor Certification Line-by-Line</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-1 text-slate-300/90">
          <p>Form 740 is a multi-page document. Critical certifications the contractor signs:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Non-discrimination:</strong> No discrimination in hiring by race, sex, national origin (Executive Order 11246).</li>
            <li><strong>Conflicts of interest:</strong> No improper financial interest in the borrower or RUS project award.</li>
            <li><strong>Insurance:</strong> Minimum liability and workers comp coverage verified active.</li>
            <li><strong>Bonding:</strong> Performance bond and payment bond in place at correct percentage of contract.</li>
            <li><strong>Prevailing wage:</strong> Acknowledgment that Davis-Bacon applies (if applicable) and commitment to post wage rates.</li>
            <li><strong>Debarment:</strong> Contractor not on federal debarment list (verified by borrower via SAM.gov).</li>
          </ul>
          <p className="mt-2">The borrower must verify SAM.gov status themselves — a contractor that passed debarment check at contract signing but is suspended mid-project must be removed immediately.</p>
        </div>

        <h3 className="mt-4 font-semibold">Form 219: Ground Test Log Fields</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-1 text-slate-300/90">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Pole/structure ID</strong> — matches staking sheet pole number</li>
            <li><strong>GPS coordinates</strong> — latitude/longitude for each test point</li>
            <li><strong>Date of test</strong> — must be within construction window (not pre-dated)</li>
            <li><strong>Measured resistance (Ω)</strong> — per IEEE 81-2012 method</li>
            <li><strong>Test method used</strong> — fall-of-potential or clamp-on (clamp-on acceptable for in-service verification)</li>
            <li><strong>Pass/fail vs. RUS threshold</strong> — ≤25 Ω aerial, ≤5 Ω building/vault</li>
            <li><strong>Corrective action taken</strong> — if failed, what was done (second rod, chemical, relocation)</li>
            <li><strong>Re-test result</strong> — if corrective action taken, show final measurement</li>
            <li><strong>Engineer signature</strong> — licensed PE signs each page</li>
          </ul>
        </div>

        <h3 className="mt-4 font-semibold">Book vs. Field: Form 307 Detail</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">Each cost item in Form 307 must be allocated to the correct USOA plant account with line-item detail (e.g., "50 mi aerial cable: $2,500 to account 32.2210").</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">Borrower often aggregates quarterly costs into summary line items, then RUS spreadsheet back-allocates to accounts. Detail exists in contractor invoices; Form 307 is the summary. RUS accepts if the summary reconciles to invoices. The most common Form 307 rejection: a line-item cost that doesn't tie to any attached invoice. Fix: maintain a construction cost log throughout the project so Form 307 is assembled from real-time tracking, not reconstructed after the quarter ends.</p>
        </div>

        <h3 className="mt-5 font-semibold">Worked Example: Quarterly Drawdown</h3>
        <div className="rounded bg-white/5 p-3 mt-3 text-sm space-y-2 text-slate-300/90">
          <p><strong>Q2 construction progress:</strong> Contractor installed 35 aerial miles of 96-ct ADSS fiber, set 120 poles, and completed OLTS testing on Segment A.</p>
          <p><strong>Costs this quarter:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>35 mi × $8,400/mi cable installed = $294,000 → §32.2410 Cable & Wire</li>
            <li>120 poles × $850/pole = $102,000 → §32.2411 Poles</li>
            <li>Engineering inspection this quarter = $12,500 → §32.2681 Engineering (non-plant, tracked separately)</li>
          </ul>
          <p><strong>Form 307 line items:</strong> $294,000 (Cable & Wire) + $102,000 (Poles) = $396,000 eligible plant cost this quarter.</p>
          <p><strong>Engineer certification:</strong> PE reviews contractor invoices, confirms 35 miles installed per as-built staking sheets, signs Form 307.</p>
          <p><strong>Loan drawdown:</strong> RUS reviews, approves within 30 days (typical), releases $396,000 (or loan-to-grant ratio equivalent) to borrower. Borrower pays contractor invoice.</p>
          <p><strong>Timeline risk:</strong> If engineer delay means Form 307 is submitted 45 days late, the contractor waits 45 extra days for payment. On a $400K monthly burn, that's the contractor floating nearly $400K — and they'll price future bids to cover that float cost.</p>
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
          {
            id: 'T20-L03-Q3',
            type: 'mc',
            prompt: 'What is the direct consequence of submitting RUS Form 307 late?',
            options: [
              { key: 'a', text: 'RUS imposes a 10% penalty on the drawdown amount' },
              { key: 'b', text: 'The next loan drawdown is delayed, potentially breaking contractor cash flow' },
              { key: 'c', text: 'The contractor must re-certify on Form 740' },
              { key: 'd', text: 'RUS cancels the loan and requires a new application' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L03-Q4',
            type: 'mc',
            prompt: 'RUS Form 219 must be completed and approved before:',
            options: [
              { key: 'a', text: 'The contractor submits Form 740' },
              { key: 'b', text: 'Underground conduit is installed' },
              { key: 'c', text: 'OSP plant can be accepted — no valid Form 219 means OSP cannot be accepted' },
              { key: 'd', text: 'The NEPA environmental worksheet is submitted' },
            ],
            correct: 'c',
          },
        ]}
      />
    </LessonLayout>
  );
}
