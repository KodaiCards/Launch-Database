import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T20.L01',
  course_id: 'T20',
  title: 'RUS Program Overview: Telecom Loan Program Structure',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T04.L01', 'T10.L01'],
  learning_objectives: [
    'Explain the RUS Telecommunications Loan Program (7 CFR Part 1735) and its role in rural broadband deployment',
    'Distinguish between RUS loan-financed, RUS grant-funded, and non-RUS projects',
    'Identify borrower obligations and cost-share requirements under RUS financing',
    'Understand why OSP engineers need to know RUS program structure when designing fiber projects',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'RUS Borrower',
    'RUS Loan Program',
    'RUS Loan Drawdown',
    'Cost-per-Mile Allowance',
    'RUS Covenant',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'feeder', source_lesson_id: 'T01.L07' },
    { term: 'FTTH', source_lesson_id: 'T01.L08' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T20L01_RUSProgramStructures() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Rural fiber projects don't happen by accident. Most FTTH or fiber-to-rural-business
          builds in the United States are financed by the USDA — either through loans from the
          Rural Utilities Service (RUS) or through grant programs. Understanding the RUS program
          structure tells you: who pays for what, what standards your design must meet, when you
          have to certify completion, and what happens if the project budget runs over. This lesson
          lays the foundation for every RUS topic that follows.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">In practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">USDA agency that loans money for rural telecom + broadband</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CFR</td>
              <td className="px-3 py-2">Code of Federal Regulations</td>
              <td className="px-3 py-2">Federal regulations published by topic (e.g., 7 CFR = USDA regs)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DSL</td>
              <td className="px-3 py-2">Distance Learning + Telemedicine</td>
              <td className="px-3 py-2">RUS grant program for educational broadband (now merged into broader programs)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What is RUS?</h3>
        <p className="mt-2">
          The Rural Utilities Service is a USDA agency. Its job: make loans and grants so that
          rural areas can build telecommunications infrastructure. RUS has been lending money
          since the 1950s. Today, RUS finances fiber-to-the-home, broadband wireless, and
          traditional copper or coax networks in rural counties where the business case is weak
          (low population density, high build cost per subscriber).
        </p>

        <h3 className="mt-5 font-semibold">Three project types you'll encounter</h3>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-blue-300">RUS-Loan-Financed Project</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The borrower (typically a rural telecom cooperative or small utility) takes out
              a loan from RUS at favorable rates (~3-4% interest). The borrower repays over
              35–40 years. In exchange, RUS sets the engineering standards (via RUS Bulletins),
              requires specific forms (Form 307, Form 219), and conducts audits. Your job as
              the OSP engineer: design to RUS standards, complete the Forms, and certify
              construction was done per the design.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-green-300">RUS-Grant-Funded Project (DLT, ReConnect, etc.)</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The borrower doesn't repay. RUS grants a certain amount ($X per mile, or total cap).
              The borrower matches with local funding (cost-share requirement: typically 10-25%).
              RUS standards still apply; RUS Forms still required. Grant programs include Distance
              Learning + Telemedicine (DLT, now merged into broader broadband programs), ReConnect
              (post-2018 broadband-specific grant), and others.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-purple-300">Non-RUS Project</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The project is financed entirely from borrower funds, private investment, or
              state/municipal bonds. No RUS involvement, no RUS standards, no RUS Forms required.
              However, the borrower may still adopt RUS-standard design practices (RUS Bulletins
              are excellent engineering guidance). Your job is lighter on paperwork but the
              engineering quality bar may be set by the borrower's internal standards or by NESC only.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Cost-per-mile allowance: the budget constraint</h3>
        <p className="mt-2">
          RUS doesn't reimburse dollar-for-dollar for actual costs. Instead, RUS sets a
          <strong> cost-per-mile allowance</strong> — typically $X,000 per mile of aerial or
          underground plant, depending on the program and region. The borrower gets that amount
          per mile, regardless of actual cost. If the project costs less, the borrower pockets
          the savings. If it costs more, the borrower absorbs the overage (or amends the budget
          with RUS approval).
        </p>
        <p className="mt-2">
          Example: RUS allowance = $50,000 per mile aerial. Your design calculates $52,000
          per mile due to terrain and rock. The borrower can either (a) tighten the design
          to fit the allowance, (b) request a budget amendment (which RUS may or may not
          approve), or (c) pay the overage themselves.
        </p>

        {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
        <Flashcard
          deckId="T20-L01"
          cards={[
            {
              id: 'T20-L01-fc-rus',
              front: 'What is RUS?',
              back: 'Rural Utilities Service — a USDA agency that makes loans and grants for rural telecommunications infrastructure. RUS sets engineering standards via Bulletins and requires specific forms (307, 219) for borrower projects.',
            },
            {
              id: 'T20-L01-fc-borrower',
              front: 'What is an RUS Borrower?',
              back: 'A telecommunications cooperative, utility, or other entity that takes out an RUS loan or grant to build fiber or broadband infrastructure. The borrower is responsible for repaying (loans) or cost-sharing (grants) and for following RUS standards.',
            },
            {
              id: 'T20-L01-fc-loan',
              front: 'How is an RUS-loan-financed project different from a grant?',
              back: 'Loan: Borrower repays over 35–40 years at favorable RUS rates (~3-4%). Grant: No repayment required, but borrower must cost-share (local match, typically 10-25%). Both require RUS standards and Forms.',
            },
            {
              id: 'T20-L01-fc-cpm',
              front: 'What is a cost-per-mile allowance?',
              back: 'RUS funding model: borrower receives $X per mile of fiber installed (varies by region/program). Actual project cost under allowance = borrower profit. Over allowance = borrower cost (unless RUS amends).',
            },
            {
              id: 'T20-L01-fc-covenant',
              front: 'What is an RUS Covenant?',
              back: 'A loan agreement obligation. RUS covenants include "design to RUS standards," "obtain Form 219 grounding certification," "maintain USOA records," and "certify as-built plant meets design." Failure to meet covenants can trigger loan acceleration or renegotiation.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Borrower Obligations Under RUS Financing</h2>

        <p>
          When a rural telecom takes an RUS loan or grant, they agree to follow RUS rules.
          As the OSP engineer, you're the one who translates those rules into a design.
        </p>

        <h3 className="mt-4 font-semibold">The four main obligations</h3>
        <ol className="list-decimal list-inside space-y-3 mt-3 text-slate-300/90">
          <li>
            <strong>Design to RUS engineering standards</strong> (RUS Bulletins 1751F-630, 1735F-635, etc.).
            NESC is the minimum; RUS often requires more (e.g., Form 219 ground-rod testing).
          </li>
          <li>
            <strong>Complete RUS Forms</strong> (Form 307 construction ledger, Form 740 contractor cert, Form 219 grounding test).
            Without signed Forms, RUS won't release loan drawdown.
          </li>
          <li>
            <strong>Maintain records per USOA</strong> (47 CFR Part 32 plant accounting).
            Plant accounts (Cable & Wire, Poles, Conduit, Land) must be tracked and reconciled
            to the RUS audit standard.
          </li>
          <li>
            <strong>Obtain third-party verification</strong> on major milestones
            (design review, construction QA, as-built certification). RUS inspector or engineer
            sign-off is required before drawdown approval.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Why engineers care: the Form 307 drawdown cycle</h3>
        <p className="mt-2">
          Construction is paid for in increments. The borrower builds a segment, submits Form 307
          (construction ledger showing costs by account), and RUS releases the next chunk of loan
          money. If your as-built documentation is incomplete or if Forms have errors, drawdown stalls.
          Late drawdown = borrower's cash flow breaks. As the engineer, your documentation speed
          directly affects the borrower's ability to pay the contractor.
        </p>

        <h3 className="mt-5 font-semibold">Cost-share and matched funding</h3>
        <p className="mt-2">
          For grant programs, RUS requires the borrower to match a percentage (10-25%, varies by program).
          That match can come from borrower equity, state grants, municipal bonds, or private capital.
          RUS won't fund 100%. The borrower's match requirement affects project scope — if the match
          runs out, the project scope shrinks unless more capital is raised.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>RUS Program Landscape</h2>

        <p>
          RUS administers several loan and grant programs. Your role focuses on the
          Telecommunications Loan Program (7 CFR Part 1735), but it's useful to know the broader
          landscape.
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-blue-300">Telecommunications Loan Program (7 CFR Part 1735)</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              The main RUS program for fiber and broadband deployment in rural areas. Loans available
              at favorable rates for qualified rural telephone companies and municipalities. Average
              loan size varies, but program has financed hundreds of FTTH builds nationwide.
            </p>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-green-300">Broadband Programs (ReConnect, Community Connect)</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              RUS expanded broadband authorities post-2018. ReConnect is a dedicated broadband grant/loan program.
              Community Connect (7 CFR Part 1703) combines broadband, distance learning, and telemedicine grants.
              All enforce RUS engineering standards.
            </p>
          </div>

          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-purple-300">Electric Loans (for joint-use poles)</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              RUS also finances rural electric cooperatives. Their poles may be shared with telecom (joint-use).
              If electric and telecom are both RUS-funded on the same poles, both must meet RUS standards (and
              NESC). Your OSP design must account for joint-use constraints.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Why this matters</h3>
        <p className="mt-2">
          The specific RUS program determines (a) the cost-per-mile cap, (b) the match requirement,
          (c) which Bulletins apply, and (d) the audit cycle. A ReConnect broadband grant has different
          rules than a traditional Telecom Loan. Always verify which program finances your project
          before finalizing design specs.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T20-L01-Q1',
            type: 'mc',
            prompt: 'What is the primary role of RUS (Rural Utilities Service)?',
            options: [
              { key: 'a', text: 'To regulate electric utility rates nationwide' },
              { key: 'b', text: 'To make loans and grants for rural telecommunications and broadband infrastructure' },
              { key: 'c', text: 'To inspect completed telecom projects for safety violations' },
              { key: 'd', text: 'To manufacture fiber-optic cable' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L01-Q2',
            type: 'mc',
            prompt: 'In an RUS-loan-financed project, the borrower must repay the loan over how many years?',
            options: [
              { key: 'a', text: '5-10 years' },
              { key: 'b', text: '20-25 years' },
              { key: 'c', text: '35-40 years' },
              { key: 'd', text: '50+ years' },
            ],
            correct: 'c',
          },
          {
            id: 'T20-L01-Q3',
            type: 'mc',
            prompt: 'What is the cost-per-mile allowance?',
            options: [
              { key: 'a', text: 'The maximum price RUS will negotiate for fiber cable' },
              { key: 'b', text: 'The amount RUS reimburses per mile of plant installed, regardless of actual cost' },
              { key: 'c', text: 'The borrower\'s required cost-share percentage' },
              { key: 'd', text: 'The annual maintenance fee RUS charges' },
            ],
            correct: 'b',
          },
          {
            id: 'T20-L01-Q4',
            type: 'mc',
            prompt: 'Which of the following is NOT an RUS borrower obligation?',
            options: [
              { key: 'a', text: 'Design to RUS engineering standards (Bulletins)' },
              { key: 'b', text: 'Complete RUS Forms (307, 740, 219)' },
              { key: 'c', text: 'Export all as-built documents to the FCC' },
              { key: 'd', text: 'Maintain USOA plant accounting records' },
            ],
            correct: 'c',
          },
        ]}
      />
    </LessonLayout>
  );
}
