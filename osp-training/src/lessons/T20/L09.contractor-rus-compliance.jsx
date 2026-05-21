import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T20.L09',
  course_id: 'T20',
  title: 'Contractor RUS Compliance: Form 740, Prevailing Wage, Bonding',
  order: 9,
  prerequisites: ['T10.L01'],
  learning_objectives: [
    'Explain RUS Form 740 (contractor certification)',
    'Identify Davis-Bacon prevailing wage requirement (40 USC §3141)',
    'Understand RUS bonding and insurance requirements',
    'Verify contractor compliance on site',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [],
  vocabulary_assumed: [],
};

export const key_terms = [];

export default function T20L09_ContractorCompliance() {
  return (
    <LessonLayout meta={meta}>
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>When the contractor shows up to build, they must have signed RUS Form 740 (no exceptions). They must pay prevailing wage (if project ≥$2,000 labor threshold). They must carry bonding/insurance. Your job: verify forms are signed before work starts, monitor wage rates during construction, and spot-check bonding certificates.</p>

        <h3 className="mt-4 font-semibold">Three contractor RUS requirements</h3>
        <div className="space-y-3 mt-3 text-sm">
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-blue-300">Form 740: Contractor Certification</p>
            <p className="text-slate-300/90 mt-1">Contractor certifies: no discrimination, no conflicts of interest, bonding/insurance in place, prevailing wage commitment (if applicable). Must be signed before work begins. RUS won't allow work to proceed without a signed Form 740 on file.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-green-300">Davis-Bacon Prevailing Wage (40 USC §3141)</p>
            <p className="text-slate-300/90 mt-1">Federal law. If RUS project ≥$2,000 in labor costs, worker must be paid federal prevailing wage (hourly rate by trade per federal wage determination). Contractor must post wage rates on job site. Payroll audits spot-check compliance.</p>
          </div>
          <div className="rounded bg-white/5 p-3">
            <p className="font-semibold text-purple-300">Bonding & Insurance</p>
            <p className="text-slate-300/90 mt-1">RUS requires: bid bond (small %), performance bond (100% of contract), payment bond (100%). Contractor must provide bonding agent name, policy numbers. Borrower verifies bonds are active at project start.</p>
          </div>
        </div>
      </section>

      <section data-tier="working">
        <h2>On-Site Compliance Monitoring</h2>

        <p className="mt-2">Your role during construction:</p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-slate-300/90">
          <li><strong>Week 1:</strong> Verify Form 740 is signed. Get bonding certificate copies. Post prevailing wage rate sheet on job site (if applicable).</li>
          <li><strong>Ongoing:</strong> Spot-check contractor payroll for wage rate compliance. Interview workers ("Are you being paid the posted rate?"). Note any issues.</li>
          <li><strong>Monthly:</strong> Review contractor invoice against timecards. If labor invoice doesn't align with prevailing wage rates: flag it for borrower.</li>
          <li><strong>Project close:</strong> Confirm final payroll reconciles to Form 307 cost report. RUS auditor will verify later.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Book vs. Field: Prevailing Wage</h3>
        <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-amber-300">Book (RUS rule)</p>
          <p className="text-slate-300/90 mt-1">All RUS projects ≥$2K labor → prevailing wage applies. Federal wage determination published annually. Contractor must pay or face audit disallowance.</p>
        </div>
        <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
          <p className="font-semibold text-green-300">Field (common compliance gap)</p>
          <p className="text-slate-300/90 mt-1">Rural contractors sometimes underpay, claiming "local rates are lower." Borrower then gets audit finding (costs disallowed, must repay RUS). Prevent this: enforce wage rates at project start.</p>
        </div>
      </section>

      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L09-Q1',
            type: 'mc',
            prompt: 'RUS Form 740 must be signed:',
            options: [
              { key: 'a', text: 'After construction is complete' },
              { key: 'b', text: 'Before work begins (upfront requirement)' },
              { key: 'c', text: 'Only if the project exceeds budget' },
              { key: 'd', text: 'When RUS inspector arrives' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L09-Q2',
            type: 'mc',
            prompt: 'Davis-Bacon prevailing wage applies when:',
            options: [
              { key: 'a', text: 'Project is on federal land' },
              { key: 'b', text: 'RUS-funded project with ≥$2,000 labor costs' },
              { key: 'c', text: 'Contractor is union' },
              { key: 'd', text: 'State requires it' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L09-Q3',
            type: 'mc',
            prompt: 'What does RUS require contractor to provide for bonding?',
            options: [
              { key: 'a', text: 'Bid bond only' },
              { key: 'b', text: 'Performance bond only' },
              { key: 'c', text: 'Bid, performance, and payment bonds (typically 100% of contract)' },
              { key: 'd', text: 'Insurance policy only' },
            ],
            correct: 'c',
          },
        ]}
      />
    </LessonLayout>
  );
}
