import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
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
  vocabulary_introduced: [],
  vocabulary_assumed: [],
};

export const key_terms = [];

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
        ]}
      />
    </LessonLayout>
  );
}
