import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L05',
  course_id: 'T20',
  title: 'RUS Compliance & Audit Trail',
  order: 5,
  prerequisites: ['T08.L01', 'T09.L01', 'T10.L01'],
  learning_objectives: [
    'Explain RUS loan covenants (design-to-standard, as-built certification)',
    'Understand USOA record retention (47 CFR §32.27 = 5 years minimum)',
    'Identify audit exposure and non-compliance consequences',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'loan covenant',
    'as-built certification',
    'loan acceleration',
    'corrective action',
    'audit finding',
    'cost overrun',
    'record retention',
  ],
  vocabulary_assumed: [],
};

export const key_terms = [
  {
    term: 'loan covenant',
    definition:
      'A promise the borrower makes to RUS as a condition of the loan. Main covenants: design to RUS standards, certify construction per design, pass RUS inspection, maintain records 5+ years. Fail a covenant and RUS can accelerate the loan.',
  },
  {
    term: 'as-built certification',
    definition:
      'After construction, the borrower signs as-built drawings certifying plant matches design. The engineer inspects and countersigns.',
  },
  {
    term: 'loan acceleration',
    definition:
      'When RUS declares a covenant breach, it may demand full repayment of the outstanding loan balance immediately. Rare, but catastrophic for the borrower.',
  },
  {
    term: 'corrective action',
    definition:
      'RUS requests the borrower submit missing or corrected documentation to resolve a minor audit finding. The most common outcome for documentation gaps.',
  },
  {
    term: 'audit finding',
    definition:
      'A non-compliance item identified by an RUS auditor during review of design compliance, cost allocation (Form 307), as-built documentation, or covenants.',
  },
  {
    term: 'cost overrun',
    definition:
      'When actual construction costs exceed the RUS-approved cost-per-mile allowance without an approved amendment. RUS may disallow the overage, meaning the borrower absorbs it.',
  },
  {
    term: 'record retention',
    definition:
      'Per 47 CFR §32.27, RUS borrowers must keep design, test reports, invoices, and as-built documents for a minimum of 5 years. RUS audit can request any document from the file at any time.',
  },
];

export default function T20L05_RUSCompliance() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>RUS loans come with loan covenants — promises the borrower makes to RUS. Main covenants: design to RUS standards, certify construction per design, pass RUS inspection, maintain records 5+ years. Fail a covenant and RUS can accelerate the loan (demand full repayment immediately). Your job: help the borrower document compliance through every phase.</p>

        <h3 className="mt-4 font-semibold">Core RUS covenants (7 CFR Part 1735)</h3>
        <div className="space-y-2 mt-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold">Design to Standard</p>
            <p className="text-slate-300/90 mt-1">Borrower must design per RUS Bulletins (1751F-630, 1751F-635, 1751F-810). Engineer responsible for design review and sign-off.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold">As-Built Certification</p>
            <p className="text-slate-300/90 mt-1">After construction, borrower signs as-built drawings certifying plant matches design. Engineer inspects and countersigns.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold">Third-Party Verification</p>
            <p className="text-slate-300/90 mt-1">RUS engineer or independent inspector audits design, inspects construction. Borrower pays; RUS approves.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold">Record Retention (47 CFR §32.27)</p>
            <p className="text-slate-300/90 mt-1">Keep design, test reports, invoices, as-built docs for minimum 5 years. RUS audit can request any document from the file at any time.</p>
          </div>
        </div>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────────── */}
      <Flashcard
        deckId="T20-L05"
        cards={[
          {
            id: 'T20-L05-fc-covenant',
            front: 'What is a loan covenant in the context of an RUS loan?',
            back: 'A promise the borrower makes to RUS as a condition of the loan. Main covenants: design to RUS standards, certify construction per design, pass RUS inspection, maintain records 5+ years. Fail a covenant and RUS can accelerate the loan.',
          },
          {
            id: 'T20-L05-fc-asbuilt',
            front: 'What is as-built certification and who signs it?',
            back: 'After construction, the borrower signs as-built drawings certifying plant matches design. The engineer inspects and countersigns.',
          },
          {
            id: 'T20-L05-fc-acceleration',
            front: 'What is loan acceleration and when does RUS trigger it?',
            back: 'When RUS declares a covenant breach, it may demand full repayment of the outstanding loan balance immediately. Rare, but catastrophic for the borrower.',
          },
          {
            id: 'T20-L05-fc-corrective',
            front: 'What is a corrective action in an RUS audit context?',
            back: 'RUS requests the borrower submit missing or corrected documentation to resolve a minor audit finding. The most common outcome for documentation gaps.',
          },
          {
            id: 'T20-L05-fc-finding',
            front: 'What is an audit finding?',
            back: 'A non-compliance item identified by an RUS auditor during review of design compliance, cost allocation (Form 307), as-built documentation, or covenants.',
          },
          {
            id: 'T20-L05-fc-overrun',
            front: 'What happens when actual costs exceed the RUS allowance without an approved amendment?',
            back: 'RUS may disallow the overage, meaning the borrower absorbs it. This is a cost overrun — actual construction costs exceeded the RUS-approved cost-per-mile allowance without an approved amendment.',
          },
          {
            id: 'T20-L05-fc-retention',
            front: 'How long must RUS borrowers retain project records and under what regulation?',
            back: 'Per 47 CFR §32.27, RUS borrowers must keep design, test reports, invoices, and as-built documents for a minimum of 5 years. RUS audit can request any document from the file at any time.',
          },
        ]}
      />

      <section data-tier="working">
        <h2>Audit Exposure & Consequences</h2>
        <p className="mt-2">RUS auditors review: design compliance, cost allocation (Form 307), as-built documentation, and covenants. If auditor finds non-compliance:</p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-slate-300/90">
          <li><strong>Minor (documentation gap):</strong> RUS requests corrective action. Borrower submits missing docs.</li>
          <li><strong>Major (design non-compliance):</strong> RUS may declare covenant breach. Loan acceleration possible (rare, but catastrophic for borrower).</li>
          <li><strong>Cost overrun:</strong> If actual costs exceeded allowance without amendment, RUS may disallow the overage (borrower absorbs it).</li>
        </ul>

        <h3 className="mt-4 font-semibold">Book vs. Field: Documentation Thoroughness</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book (RUS standard)</p>
          <p className="text-slate-300/90 mt-1">Every design decision documented. Every test result saved. Every invoice filed. Five years later, auditor can reconstruct the entire project from file.</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field (common practice)</p>
          <p className="text-slate-300/90 mt-1">Core docs (design, test reports, as-built) saved. Contractor invoices in a binder. Audit happens 1-2 years after project end — borrower scrambles to find missing receipts. Auditor usually accepts reasonable explanation if core docs are solid.</p>
        </div>
      </section>

      {/* ── WORKED EXAMPLE: Cost overrun disallowance exposure ────────────────── */}
      <WorkedExample
        title="RUS Cost Overrun Disallowance — Exposure Calculator"
        description="When an RUS auditor identifies costs that don't meet the approved cost-per-mile allowance (or were incurred without a budget amendment), the overage is disallowed. Calculate the borrower's dollar exposure: the disallowed amount plus interest accruing from the date of expenditure to the date of resolution. Use this to understand the financial stakes of documentation gaps."
        variables={[
          {
            key: 'disallowed',
            label: 'Disallowed cost',
            units: '$',
            default: 50000,
            min: 1000,
            max: 500000,
            step: 1000,
          },
          {
            key: 'afr_pct',
            label: 'Applicable Federal Rate (AFR)',
            units: '%/yr',
            default: 5.5,
            min: 1.0,
            max: 12.0,
            step: 0.1,
          },
          {
            key: 'months',
            label: 'Months from expenditure to resolution',
            units: 'months',
            default: 24,
            min: 1,
            max: 60,
            step: 1,
          },
        ]}
        formula={({ disallowed, afr_pct, months }) => {
          const rate = afr_pct / 100;
          const years = months / 12;
          const interest = disallowed * rate * years;
          return disallowed + interest;
        }}
        steps={({ disallowed, afr_pct, months }, total) => {
          const rate = afr_pct / 100;
          const years = months / 12;
          const interest = disallowed * rate * years;
          return [
            {
              expression: `Step 1 — Annual interest rate as decimal: ${afr_pct}% ÷ 100 = ${rate.toFixed(4)}`,
            },
            {
              expression: `Step 2 — Convert months to years: ${months} months ÷ 12 = ${years.toFixed(4)} years`,
            },
            {
              expression: `Step 3 — Simple interest accrued: $${disallowed.toLocaleString()} × ${rate.toFixed(4)} × ${years.toFixed(4)} years = $${interest.toFixed(2)}`,
            },
            {
              expression: `Step 4 — Total borrower exposure: $${disallowed.toLocaleString()} (disallowed) + $${interest.toFixed(2)} (interest) = $${total.toFixed(2)}`,
            },
          ];
        }}
        sanityCheck={(total, { disallowed, afr_pct, months }) => {
          const pct = (((total - disallowed) / disallowed) * 100).toFixed(1);
          return `At ${afr_pct}% AFR over ${months} months, a $${disallowed.toLocaleString()} disallowance grows by ${pct}% — total borrower exposure is $${total.toFixed(2)}. This is why borrowers should request budget amendments BEFORE incurring overages, not after.`;
        }}
        resultLabel="Total exposure (principal + interest)"
        resultUnit="$"
        resultDecimals={2}
      />

      {/* ── BRANCHING SCENARIO: RUS audit notice arrives ──────────────────────── */}
      <BranchingScenario
        scenarioId="T20-L05-audit-response"
        title="RUS Audit Notice Arrives — What's Your First Move?"
        description="Your borrower client calls: an RUS audit notice just arrived covering the 50-mile aerial project you engineered two years ago. Walk through the response decisions and see where each path leads."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'The RUS audit notice arrives. It requests design drawings, Form 307 cost ledger, test reports, and as-built certifications within 30 days. The borrower asks you what to do first. What is your immediate priority?',
            choices: [
              { label: 'Acknowledge the notice and begin document inventory immediately', nextId: 'acknowledge' },
              { label: 'Wait to see if RUS follows up before pulling documents', nextId: 'wait' },
              { label: 'Call RUS to argue the timeline before doing anything else', nextId: 'argue-first' },
            ],
          },
          acknowledge: {
            id: 'acknowledge',
            text: 'Correct first move. You send written acknowledgement to RUS within a few business days, then immediately inventory what you have: design drawings, Form 307 submissions, OTDR test reports, Form 219 (grounding), and as-built drawings with your countersignature. You find all core docs — but contractor invoices for one phase are missing. What next?',
            choices: [
              { label: 'Submit what you have and note the missing invoices in a cover letter', nextId: 'submit-partial' },
              { label: 'Request a 30-day extension from RUS to locate or reconstruct the invoices', nextId: 'request-extension' },
              { label: 'Reconstruct the invoices from memory and submit them as originals', nextId: 'fabricate' },
            ],
          },
          wait: {
            id: 'wait',
            text: 'Waiting is a mistake. RUS audit notices have a 30-day response deadline. Failing to respond is itself a covenant violation — it suggests the borrower is non-cooperative, which elevates the audit from routine to adversarial. RUS will escalate. Go back and acknowledge immediately.',
            choices: [
              { label: 'Go back and acknowledge the notice now', nextId: 'acknowledge' },
            ],
          },
          'argue-first': {
            id: 'argue-first',
            text: 'Calling RUS to dispute the timeline before doing any document work is the wrong order of operations. You have no leverage without first showing you have the documents. Arguing first signals that you\'re disorganized. Start the document inventory, THEN call if you genuinely need a timeline extension after assessing the scope.',
            choices: [
              { label: 'Start with document inventory first', nextId: 'acknowledge' },
            ],
          },
          'submit-partial': {
            id: 'submit-partial',
            text: 'Good approach. Submit all available core documents on time. In your cover letter, explain that contractor invoices for Phase 2 are being located and will be supplemented within 15 days. RUS auditors routinely accept good-faith partial submissions when core docs (design, test reports, as-built) are complete. The cover letter protects you — it shows you\'re proactive, not hiding anything. Outcome: minor audit finding (documentation gap), corrective action requested. No covenant breach declared.',
            choices: [
              { label: 'Understand the outcome and review lessons learned', nextId: 'outcome-good' },
            ],
          },
          'request-extension': {
            id: 'request-extension',
            text: 'Requesting a 30-day extension is acceptable IF the reason is substantive (e.g., contractor is out of business and invoices need reconstruction from bank records). Document the reason in writing. RUS grants reasonable extensions. However: if you request extension and then still cannot produce the invoices, the finding escalates. Use extensions to buy time for genuine document recovery — not as delay tactics.',
            choices: [
              { label: 'Extension granted — you locate the invoices', nextId: 'outcome-good' },
              { label: 'Extension granted — you still cannot find all invoices', nextId: 'outcome-partial' },
            ],
          },
          fabricate: {
            id: 'fabricate',
            text: 'Stop. Submitting reconstructed documents as originals is fraud. This is a federal felony under 18 U.S.C. §1001 (false statements to a federal agency). RUS auditors are experienced — they cross-check invoice dates against Form 307 quarterly submissions, contractor payment records, and bank transfers. Fabrication is detected, and the consequences are catastrophic: loan acceleration, debarment from all RUS programs, and potential criminal prosecution. Never do this.',
            choices: [
              { label: 'Go back and submit partial with honest cover letter', nextId: 'submit-partial' },
            ],
          },
          'outcome-good': {
            id: 'outcome-good',
            text: 'Best-case outcome. Core documents submitted on time, missing invoices addressed transparently. RUS issues a corrective action request (not a covenant breach). Borrower provides the missing invoices or an acceptable reconstruction (bank records, contractor statements). RUS closes the finding. No loan acceleration. Lesson: documentation is built during the project — not scrambled for during audit. Your contemporaneous test reports, Form 307 submissions, and as-built sign-offs are what make this outcome possible.',
            choices: [
              { label: 'Start the scenario again', nextId: 'start' },
            ],
          },
          'outcome-partial': {
            id: 'outcome-partial',
            text: 'If you genuinely cannot locate invoices for work already paid and completed, submit an affidavit from the borrower\'s CFO and cross-reference to Form 307 quarterly submissions showing the costs were reported at the time. RUS may issue an audit finding with a cost disallowance for the unverifiable amount. This is a financial hit — but not a covenant breach — if the design and as-built documentation is complete. The corrective action is a disallowance, not loan acceleration.',
            choices: [
              { label: 'Understand the disallowance outcome', nextId: 'outcome-good' },
              { label: 'Start the scenario again', nextId: 'start' },
            ],
          },
        }}
      />

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-lg bg-slate-800/40 border border-slate-700 p-4">
        <h3 className="font-semibold text-slate-200">Tying It Together</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Everything you learned in <strong>permitting</strong> (T09), <strong>construction</strong> (T10), and <strong>as-built documentation</strong> (T16) comes back in RUS compliance audits.
          The audit trail is the lens through which RUS verifies your design met standards. Audit covenants require design compliance (T05 NESC standards, T14 grounding, T18 safety).
          That's why documenting your work as you go — not retroactively — is critical. Five years later when RUS auditors knock, you need the design decision trail intact to prove compliance.
        </p>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L05-Q1',
            type: 'mc',
            prompt: 'What happens if a borrower fails to meet an RUS covenant?',
            options: [
              { key: 'a', text: 'Warning letter from RUS' },
              { key: 'b', text: 'Possible loan acceleration (demand full repayment)' },
              { key: 'c', text: 'Fine payable to RUS' },
              { key: 'd', text: 'Loss of tax benefits' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L05-Q2',
            type: 'mc',
            prompt: 'How long must RUS borrowers retain project records per 47 CFR §32.27?',
            options: [
              { key: 'a', text: '1 year' },
              { key: 'b', text: '3 years' },
              { key: 'c', text: '5 years minimum' },
              { key: 'd', text: '10 years' },
            ],
            correct: 'c',
          },
          {
            id: 'T20-L05-Q3',
            type: 'mc',
            prompt: 'Which regulation contains the RUS loan covenants that borrowers must satisfy throughout the life of the loan?',
            options: [
              { key: 'a', text: '47 CFR Part 32 (FCC Uniform System of Accounts)' },
              { key: 'b', text: '7 CFR Part 1735 (RUS general provisions and loan policies)' },
              { key: 'c', text: 'NESC C2-2023 (safety code)' },
              { key: 'd', text: '7 CFR Part 1740 (ReConnect program rules)' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L05-Q4',
            type: 'mc',
            prompt: "An RUS audit finds that invoices cannot be matched to specific plant accounts in Form 307. What is the primary consequence?",
            options: [
              { key: 'a', text: 'RUS automatically grants a 90-day cure period with no other action' },
              { key: 'b', text: 'The engineer of record loses their professional license' },
              { key: 'c', text: 'RUS may withhold or reclaim loan funds for the unverifiable costs' },
              { key: 'd', text: 'The contractor who submitted the invoice is fined by the FCC' },
            ],
            correct: 'c',
          },
        ]}
      />
    </LessonLayout>
  );
}
