import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L03',
  course_id: 'T20',
  title: 'RUS Forms & Loan Reporting: 481, 231, 307, 219',
  order: 3,
  prerequisites: ['T04.L01', 'T10.L01'],
  learning_objectives: [
    'Identify RUS Form 481 as the Financial Requirement Statement used for loan advances (drawdown)',
    'Distinguish Form 307 (bid bond) from Form 481 (cost-tracking/drawdown)',
    'Describe Form 231 (Certificate of Contractor) and the insurance/bonding requirements under 7 CFR Part 1788',
    'Explain RUS Form 219 (ground-electrode testing and acceptance)',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'Form 481',
    'Form 231',
    'Form 307',
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
    term: 'Form 481',
    definition: 'RUS Financial Requirement Statement (OMB 0572-0023). The form RUS awardees submit to request loan advances. Costs are entered by line item (labor, material, equipment) allocated to plant accounts; RUS reviews, approves, and releases the next advance. This is the primary cost-tracking and drawdown document — not Form 307.',
  },
  {
    term: 'Form 307',
    definition: 'RUS Bid Bond form. Submitted by contractors with their bid to guarantee they will enter the contract if selected, in the penal sum of 10% of the bid amount. Form 307 is a bidding document — it is not the construction cost ledger or the loan drawdown form (that is Form 481).',
  },
  {
    term: 'Form 231',
    definition: 'Certificate of Contractor — the standard RUS telecom contractor certificate listed in the standard contract forms under 7 CFR §1755.30. [VERIFY specific content of Form 231 against the current USDA eForms version before formal credentialing use.] Insurance and bonding requirements are governed by 7 CFR Part 1788.',
  },
  {
    term: 'drawdown',
    definition: 'Disbursement of loan funds by RUS to the awardee after reviewing and approving Form 481 (Financial Requirement Statement). Late or incomplete Form 481 = delayed payment = contractor cash flow problems.',
  },
  {
    term: 'loan advance',
    definition: 'Each release of RUS loan funds tied to a completed construction phase, approved through Form 481. No valid Form 481 = no loan advance.',
  },
  {
    term: 'contractor certification',
    definition: 'Formal certification by a contractor prior to beginning RUS-funded work. In the RUS Telecommunications program, the standard contractor certificate is Form 231 (Certificate of Contractor) per 7 CFR §1755.30. Insurance and bonding requirements are defined in 7 CFR Part 1788 (Subpart C for telecom). Certifications typically cover bonding, insurance, non-discrimination, and prevailing wage compliance where applicable.',
  },
];

export default function T20L03_RUSForms() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS doesn't fund on a handshake. Borrowers and contractors prove they spent money, built to spec, and met federal contractor requirements through a set of standard forms. The four most important forms in RUS telecom construction are: Form 481 (cost tracking and drawdown), Form 231 (contractor certificate), Form 307 (bid bond), and Form 219 (grounding test). Getting these confused — especially 307 and 481 — causes loan payment delays.</p>

        <h3 className="mt-4 font-semibold">The Four Key RUS Forms</h3>
        <div className="mt-3 space-y-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">Form 481: Financial Requirement Statement — the drawdown form</p>
            <p className="text-slate-300/90 mt-1">
              This is the primary cost-tracking and loan-advance document. The awardee submits Form 481 to request each advance of loan funds, entering costs (labor, material, equipment) allocated to plant accounts (Cable &amp; Wire, Poles, Conduit, etc.). RUS reviews the Form 481, approves it, and releases the next draw. Late or inaccurate Form 481 stalls payment to the contractor.
            </p>
            <p className="text-xs text-amber-400 mt-1">Source: RUS Form 481 (Financial Requirement Statement), OMB 0572-0023 — USDA Rural Development.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-yellow-300">Form 307: Bid Bond — a bidding document, not a cost ledger</p>
            <p className="text-slate-300/90 mt-1">
              Form 307 is submitted by contractors <em>with their bid</em>, not after construction. It is a bid bond in the penal sum of 10% of the bid amount, guaranteeing that the bidder will enter the contract if selected. Do not confuse Form 307 (bid bond) with Form 481 (cost tracking). They serve completely different purposes at different stages of the project.
            </p>
            <p className="text-xs text-amber-400 mt-1">Source: rd.usda.gov/files/UP_ET_form_307.pdf — "Form 307 - Bid Bond."</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Form 231: Certificate of Contractor</p>
            <p className="text-slate-300/90 mt-1">
              The standard RUS Telecommunications contractor certificate per 7 CFR §1755.30 (list of standard telecom contract forms). Contractor certification covers bonding, insurance (governed by 7 CFR Part 1788, Subpart C), non-discrimination, and prevailing wage compliance where applicable. Must be on file before work begins on RUS-financed construction.
            </p>
            <p className="text-xs text-amber-400 mt-1">Source: 7 CFR §1755.30 — list of RUS standard telecom contract forms includes "RUS Form 231 (Certificate of Contractor)." [Verify specific form content against current USDA eForms version before formal credentialing use.]</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-purple-300">Form 219: Ground-Rod Testing &amp; Acceptance</p>
            <p className="text-slate-300/90 mt-1">
              Documents: ground-rod location, measured resistance (Ohms), date tested, tested-by signature, engineer approval. Must meet RUS threshold (&lt;5Ω for new installations; verify against project specs and RUS Bulletin 1751F-810). No valid Form 219 = OSP cannot be accepted.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded bg-red-900/30 border border-red-700 p-3 text-sm">
          <p className="font-semibold text-red-300">Common Mix-up: Form 307 ≠ Form 481</p>
          <p className="text-slate-300/90 mt-1">
            Prior training materials sometimes incorrectly described Form 307 as the "construction cost ledger." It is not — it is a bid bond. The actual cost-tracking/drawdown form is Form 481 (Financial Requirement Statement). Confusing these in the field can lead to incorrect form submissions and delayed loan advances.
          </p>
        </div>
      </section>

      <Flashcard
        deckId="T20-L03"
        cards={[
          {
            id: 'T20-L03-fc-481',
            front: 'What is RUS Form 481 and what is it used for?',
            back: 'RUS Financial Requirement Statement (OMB 0572-0023). The form RUS awardees submit to request loan advances (drawdown). Costs are entered by line item allocated to plant accounts; RUS reviews, approves, and releases the next advance.',
          },
          {
            id: 'T20-L03-fc-307',
            front: 'What is RUS Form 307?',
            back: 'RUS Bid Bond form. Submitted by contractors with their bid, guaranteeing they will enter the contract if selected (penal sum: 10% of bid amount). It is a bidding document — NOT the construction cost ledger or drawdown form (that is Form 481).',
          },
          {
            id: 'T20-L03-fc-231',
            front: 'What is RUS Form 231?',
            back: 'Certificate of Contractor — the standard RUS telecom contractor certificate (7 CFR §1755.30). Insurance and bonding requirements are governed by 7 CFR Part 1788, Subpart C. Must be on file before work begins on RUS-financed construction.',
          },
          {
            id: 'T20-L03-fc-drawdown',
            front: 'What is a RUS drawdown?',
            back: 'Disbursement of loan funds by RUS to the awardee after reviewing and approving Form 481 (Financial Requirement Statement). Late Form 481 = delayed drawdown = contractor cash flow problems.',
          },
          {
            id: 'T20-L03-fc-advance',
            front: 'What is a loan advance in RUS program terms?',
            back: 'Each release of RUS loan funds tied to a completed construction phase, approved through Form 481. No valid Form 481 = no loan advance.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>Form 481 Drawdown Cycle</h2>
        <p className="mt-2">Quarterly construction cycle: (1) Contractor completes phase (e.g., 50 miles aerial installed). (2) Engineer inspects, measures actual costs. (3) Borrower fills out Form 481, attaching invoices + test reports, with costs allocated to plant accounts (§32.2410 Cable &amp; Wire, §32.2411 Poles, §32.2441 Conduit, etc.). (4) RUS reviews Form 481 (approves or requests rework). (5) Loan funds disbursed. Late or inaccurate Form 481 = late payment = contractor cash flow breaks. Your inspection speed directly affects the borrower's ability to pay.</p>

        <h3 className="mt-4 font-semibold">Book vs. Field: Form 481 Detail</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book</p>
          <p className="text-slate-300/90 mt-1">Each cost item in Form 481 must be allocated to the correct USOA plant account with line-item detail (e.g., "50 mi aerial cable: $X to account §32.2410").</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field</p>
          <p className="text-slate-300/90 mt-1">Borrowers often aggregate quarterly costs into summary line items, then back-allocate to accounts using a spreadsheet. Detail exists in contractor invoices; Form 481 is the summary. RUS accepts if the summary reconciles to invoices and the allocation methodology is documented.</p>
        </div>

        <h3 className="mt-5 font-semibold">Contractor Certification and Bonding</h3>
        <p className="mt-2 text-sm">
          Before any RUS-financed construction begins, contractors must provide: (1) a signed contractor certificate (Form 231) attesting to eligibility and compliance; and (2) a contractor's bond (RUS Form 168b for contracts over $250,000; Form 168c for SBA-guaranteed sureties on contracts ≤$1,000,000). Insurance requirements are set out in 7 CFR Part 1788, Subpart C (Insurance for Contractors, Engineers, and Architects — Telecommunications Borrowers). The bid bond (Form 307) is separate — it is submitted before contract award as part of the competitive bid, not as a pre-construction certification.
        </p>
      </section>

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Your work on <strong>construction</strong> (T10) and <strong>project estimation</strong> (T17) directly feeds into Form 481.
          When you estimate costs in T17 and oversee construction in the field, you are gathering the data that goes into Form 481 — the cost tracking and drawdown form.
          Forms 307 (bid bond) and 231 (contractor cert) govern the contracting process. Form 219 governs grounding acceptance.
          Together, these forms are the bridge between engineering work and RUS finance: accurate, timely forms = borrower gets paid on schedule.
        </p>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L03-Q1',
            type: 'mc',
            prompt: 'Which RUS form is the Financial Requirement Statement used for loan advances (drawdown)?',
            options: [
              { key: 'a', text: 'Form 307' },
              { key: 'b', text: 'Form 219' },
              { key: 'c', text: 'Form 481' },
              { key: 'd', text: 'Form 231' },
            ],
            correct: 'c',
          },
          {
            id: 'T20-L03-Q2',
            type: 'mc',
            prompt: 'RUS Form 307 is:',
            options: [
              { key: 'a', text: 'The construction cost ledger submitted for each drawdown' },
              { key: 'b', text: 'A bid bond submitted with a contractor\'s bid (10% of bid amount)' },
              { key: 'c', text: 'The ground-rod testing acceptance form' },
              { key: 'd', text: 'The standard contractor certification form' },
            ],
            correct: 'b',
          },
        ]}
      />
    </LessonLayout>
  );
}
