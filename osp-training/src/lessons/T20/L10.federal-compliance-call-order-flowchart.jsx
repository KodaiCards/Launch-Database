// T20.L10 — Federal Compliance Call-Order Flowchart: RUS Borrower Triggers, Escalation Paths
// Interactive lesson teaching when to contact RUS state office vs national, and escalation procedures

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T20.L10',
  course_id: 'T20',
  title: 'Federal Compliance Call-Order: RUS State/National Escalation + GAGAS Audit Triggers',
  order: 10,
  lesson_type: 'standard',
  prerequisites: [
    'T20.L01', 'T20.L02', 'T20.L03', 'T20.L04',
    'T20.L05', 'T20.L06', 'T20.L07', 'T20.L08', 'T20.L09',
  ],
  vocabulary_introduced: [
    'RUS state office',
    'RUS national office',
    'RUS loan officer',
    'GAGAS audit',
    'Generally Accepted Government Auditing Standards',
    'audit trigger threshold',
    'compliance deviation',
    'loan modification request',
    'rural broadband funds',
    'environmental assessment',
    'NEPA review',
  ],
  vocabulary_assumed: [
    { term: 'RUS', source_lesson_id: 'T20.L01' },
    { term: 'borrower', source_lesson_id: 'T20.L01' },
    { term: 'Form 740', source_lesson_id: 'T20.L09' },
    { term: 'Davis-Bacon', source_lesson_id: 'T20.L09' },
  ],
  estimated_minutes: 45,
};

// ────────────────────────────────────────────────────────────────────────────
// § FOUNDATIONS: Why You Need to Know the Escalation Path
// ────────────────────────────────────────────────────────────────────────────

const FoundationsSection = () => (
  <div className="lesson-section foundations">
    <h2>In Plain English: The Call-Order Question</h2>
    <p>
      You're building a rural broadband project with RUS funding. Midway through construction, something goes wrong:
      maybe the contractor is behind schedule, or the project cost overrun is $50,000 more than budgeted, or you discovered
      an environmental constraint that affects the design, or the Davis-Bacon wage determination didn't get posted.
    </p>
    <p>
      <strong>The question: Who do you call?</strong> Your local RUS state office? RUS headquarters? Do you need RUS
      approval to fix it, or can the borrower (the rural telecom company) decide on their own?
    </p>
    <p>
      This lesson teaches the <strong>escalation flowchart</strong> — which RUS office handles which type of problem,
      when RUS approval is mandatory, and when the audit happens afterward to verify compliance.
    </p>

    <h3>Key Terms You'll Learn</h3>
    <ul>
      <li><Flashcard term="RUS state office" definition="The USDA RUS regional office responsible for your state. First point of contact for project issues, compliance questions, and routine approvals." /></li>
      <li><Flashcard term="RUS national office" definition="USDA RUS headquarters in Washington, D.C. Handles policy questions, large funding modifications (>10% or >$50K), and appeals of state office decisions." /></li>
      <li><Flashcard term="loan officer" definition="The RUS state office staff member assigned to your specific loan. They track the project, answer questions, and route issues to the state office / national office as needed." /></li>
      <li><Flashcard term="GAGAS audit" definition="Generally Accepted Government Auditing Standards audit. An independent financial and compliance audit required for RUS projects, typically triggered when the project exceeds certain thresholds ($100K+) or when RUS suspects non-compliance." /></li>
      <li><Flashcard term="audit trigger threshold" definition="The project cost, loan amount, or compliance-risk level that requires a GAGAS audit. RUS Bulletin 1751F-630 specifies thresholds (typically >$100K loan amount or >$250K total project cost)." /></li>
      <li><Flashcard term="environmental assessment" definition="A NEPA (National Environmental Policy Act) review required for federal projects. Determines if the project impacts wetlands, endangered species, historic properties, or other environmental resources. Required BEFORE construction starts on some RUS projects." /></li>
      <li><Flashcard term="compliance deviation" definition="A violation of RUS requirements discovered during project audit (e.g., contractor paid below prevailing wage, environmental permit not obtained, procurement rules violated). Auditor flags deviations; borrower must correct or repay RUS." /></li>
    </ul>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// § WORKING: The Escalation Decision Tree
// ────────────────────────────────────────────────────────────────────────────

const WorkingSection = () => (
  <div className="lesson-section working">
    <h2>RUS Escalation Flowchart: Know When to Call</h2>

    <h3>Your Default Contact: The RUS State Office</h3>
    <p>
      <strong>When in doubt, contact your RUS loan officer at the state office first.</strong> They are the primary point
      of contact for the project and can either answer your question directly or route it to the right office.
    </p>

    <h3>Routine Decisions (State Office Handles)</h3>
    <p>
      <strong>You can call the state office and expect an answer within 2–5 business days on:</strong>
    </p>
    <ul>
      <li><strong>Schedule delays</strong> — contractor is 2 weeks behind. Ask state office: "Should we issue a timeline extension, or does this require borrower action?"</li>
      <li><strong>Small change orders</strong> — cost increase is $15,000 on a $500K project (3%). Ask: "Can the borrower approve this, or does RUS need to modify the loan?"</li>
      <li><strong>Contractor compliance questions</strong> — "Is the wage determination I'm looking at the right one?" State office confirms.</li>
      <li><strong>Environmental questions</strong> — "Do we need a wetland permit for this section?" State office escalates to RUS environmental staff if needed.</li>
      <li><strong>Procurement questions</strong> — "Can the borrower sole-source this equipment, or must they bid?" State office knows the RUS rules.</li>
    </ul>

    <h3>Major Decisions (National Office Handles)</h3>
    <p>
      <strong>The RUS national office (or your state office escalating to national) handles:</strong>
    </p>
    <ul>
      <li><strong>Loan modifications >10% or >$50,000</strong> — "The project cost overrun is $75,000. Can we modify the loan?" State office escalates to national.</li>
      <li><strong>Scope changes</strong> — "The route has to change due to easement issues. Does this require a new environmental review?" National office coordinates with environmental staff.</li>
      <li><strong>Appeals</strong> — If the state office says "no," borrower can appeal to national office for reconsideration (rare, but it happens).</li>
      <li><strong>Policy questions</strong> — "The borrower has two RUS loans and wants to cross-collateralize them. Is that allowed?" National office handles policy.</li>
    </ul>

    <h3>GAGAS Audit Trigger Thresholds</h3>
    <p>
      <strong>RUS Bulletin 1751F-630 requires a GAGAS audit if:</strong>
    </p>
    <ul>
      <li>Loan amount ≥ $100,000, OR</li>
      <li>Total project cost ≥ $250,000, OR</li>
      <li>RUS suspects material non-compliance (e.g., Form 740 not signed, prevailing wage not paid, procurement rules violated)</li>
    </ul>
    <p>
      <strong>What happens in a GAGAS audit:</strong>
    </p>
    <ol>
      <li>RUS selects an independent audit firm (CPA or government auditor).</li>
      <li>Auditor reviews all invoices, payroll, procurement records, environmental compliance, contractor Forms 740 + bonding.</li>
      <li>Auditor produces a report listing any deviations (non-compliance findings).</li>
      <li>If deviations exist, borrower must: (a) provide written explanation, (b) correct the problem going forward, or (c) repay RUS for any disallowed costs.</li>
    </ol>

    <h3>Book vs. Field: Escalation in Practice</h3>
    <div className="rounded bg-amber-900/30 p-3 mt-3 text-sm">
      <p className="font-semibold text-amber-300">Book (RUS Bulletin)</p>
      <p className="text-slate-300/90 mt-1">Loan modifications, scope changes, and major compliance questions go to the national office. State office handles routine approvals and questions.</p>
    </div>
    <div className="rounded bg-green-900/30 p-3 mt-3 text-sm">
      <p className="font-semibold text-green-300">Field (What Actually Happens)</p>
      <p className="text-slate-300/90 mt-1">The state office loan officer often resolves issues without formal escalation if they have authority. But if they're unsure, or if the issue is high-risk (environmental deviation, major cost overrun), they escalate to national. The key: always call the state office first and let them decide whether to escalate.</p>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// § ADVANCED: Escalation Scenario (BranchingScenario)
// ────────────────────────────────────────────────────────────────────────────

const AdvancedSection = () => (
  <div className="lesson-section advanced">
    <h2>Interactive: Escalation Decision Tree</h2>
    <p>
      Use this scenario to practice identifying: which RUS office should you call, and is GAGAS audit required?
      Work through each situation and decide: <strong>State Office, National Office, or Both?</strong>
    </p>

    <BranchingScenario
      scenario_id="T20_L10_escalation_tree"
      title="RUS Compliance Escalation: Who Do You Call?"
      start_state="start"
      states={{
        start: {
          prompt: 'You are the OSP engineer on a RUS-funded rural broadband project. Your RUS loan amount is $150,000 (GAGAS audit required per threshold). Midway through construction, the contractor reports a cost overrun of $35,000. The borrower (rural telephone company) wants to know: "Can we approve this ourselves, or do we need RUS permission?" What do you tell them?',
          choices: [
            { text: 'Call the RUS state office first to ask if the borrower can approve a $35,000 overrun.', next_state: 'escalation_q1_state' },
            { text: 'Tell the borrower to call RUS national office directly — this is a major decision.', next_state: 'escalation_q1_national' },
            { text: 'Tell the borrower they can approve it themselves if the total project cost doesn\'t exceed 10% of the original budget.', next_state: 'escalation_q1_self' },
          ],
        },
        escalation_q1_state: {
          prompt: 'CORRECT — state office is the first point of contact. You call, and the state office loan officer says: "$35,000 is a 7% overrun on your $500K project. This is within the borrower\'s discretion, but I\'ll flag it in the audit." The loan will trigger a GAGAS audit because it exceeds $100,000. The auditor will review whether the overrun was authorized and properly documented. What do you tell the borrower?',
          context: '(The loan officer is saying the borrower CAN approve the overrun, but it will be audited.)',
          choices: [
            { text: 'Borrower can approve the overrun now. Ensure the change order is documented (signed by borrower and contractor). Auditor will review it during GAGAS audit.', next_state: 'outcome_state_escalation_resolved' },
            { text: 'Borrower must still get RUS written approval before spending the extra $35,000.', next_state: 'escalation_q1_state_wrong' },
          ],
        },
        escalation_q1_state_wrong: {
          prompt: 'Not quite. The loan officer said the borrower CAN approve it — they have delegated authority for cost changes within a percentage threshold. RUS will audit the decision to verify it was reasonable, but the borrower doesn\'t need pre-approval. If the loan officer had said "this requires national office approval," then yes, you\'d need RUS written consent before proceeding.',
          choices: [
            { text: 'OK, I understand — state office confirmed the borrower can approve it. We\'ll document the change order and let RUS audit it later.', next_state: 'outcome_state_escalation_resolved' },
          ],
        },
        escalation_q1_national: {
          prompt: 'Not quite. Always call the state office first. They may handle the decision themselves, or they may say "this needs national office approval." Jumping straight to national wastes time and frustrates the RUS state office, who is supposed to manage the day-to-day relationship with the borrower.',
          choices: [
            { text: 'Got it — state office is the first call.', next_state: 'escalation_q1_state' },
          ],
        },
        escalation_q1_self: {
          prompt: 'Not quite. A 7% overrun on a $500K project is within the borrower\'s authority, but you can\'t tell them that without confirming with RUS. The state office loan officer makes that call — you ask them first.',
          choices: [
            { text: 'Right, I should have called the state office first.', next_state: 'escalation_q1_state' },
          ],
        },
        outcome_state_escalation_resolved: {
          prompt: 'SCENARIO RESOLVED. The borrower can approve the $35,000 overrun. You ensure: (1) change order is signed by both borrower and contractor, (2) change order is attached to the project file, (3) new invoices reference the change order. When the GAGAS auditor arrives (which they will, because the loan is $150K), they will verify the change order was reasonable and properly executed. No audit finding.',
          outcome_text: 'STATE OFFICE RESOLVED — Borrower approved overrun within delegated authority.',
          is_terminal: true,
        },

        // ──── Second scenario ────
      }}
    />

    <h3 className="mt-8">Key Takeaway: Three Levels of Escalation</h3>
    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300/90">
      <li><strong>State Office (Your First Call):</strong> Routine approvals, questions, and flagging of issues. They decide if you need to go higher.</li>
      <li><strong>National Office (If State Escalates):</strong> Policy decisions, major modifications, environmental/scope changes, and appeals.</li>
      <li><strong>GAGAS Auditor (After Project Completion):</strong> Independent verification that you followed RUS rules. If deviations found, borrower must correct or repay.</li>
    </ol>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// § QUIZ
// ────────────────────────────────────────────────────────────────────────────

const QuizSection = () => (
  <Quiz
    id="T20_L10_quiz"
    title="RUS Escalation: Call-Order + Audit Triggers"
    questions={[
      {
        id: 'Q1',
        type: 'multiple-choice',
        prompt: 'You discover the contractor did not post the Davis-Bacon wage rate sheet on the job site, as required. What is your first action?',
        options: [
          { letter: 'A', text: 'Tell the contractor to post it immediately, and do not report it to RUS.' },
          { letter: 'B', text: 'Call the RUS state office loan officer and report the violation.' },
          { letter: 'C', text: 'Call RUS national office directly — wage violations are serious.' },
          { letter: 'D', text: 'Assume the auditor will catch it later and note it in your field report.' },
        ],
        correct: 'B',
        rationale: 'Call the RUS state office first. The loan officer will advise: "Have the contractor post immediately, and send us written confirmation when it\'s done." This prevents the violation from becoming an audit finding. The state office manages day-to-day compliance; national office handles appeals and policy.',
      },
      {
        id: 'Q2',
        type: 'multiple-choice',
        prompt: 'Your project loan amount is $180,000 (RUS-funded). A GAGAS audit is required because:',
        options: [
          { letter: 'A', text: 'The loan amount exceeds $100,000.' },
          { letter: 'B', text: 'The total project cost exceeds $250,000.' },
          { letter: 'C', text: 'RUS suspects non-compliance.' },
          { letter: 'D', text: 'All of the above are audit triggers.' },
        ],
        correct: 'D',
        rationale: 'RUS Bulletin 1751F-630 requires GAGAS audit if ANY of these conditions is met: (1) loan ≥$100K, (2) total project cost ≥$250K, or (3) RUS suspects material non-compliance. Your $180K loan meets the first trigger, so an audit is mandatory.',
      },
      {
        id: 'Q3',
        type: 'multiple-choice',
        prompt: 'The project cost overrun is $78,000 on a $400,000 project (19.5% overrun). The borrower wants to approve it themselves. Should they?',
        options: [
          { letter: 'A', text: 'Yes, it\'s under 20% so it\'s in their authority.' },
          { letter: 'B', text: 'No, all cost overruns require RUS national office approval.' },
          { letter: 'C', text: 'Unknown — call the RUS state office loan officer to confirm the borrower\'s authority threshold.' },
          { letter: 'D', text: 'Yes, if the overrun is due to contractor actions (not design changes).' },
        ],
        correct: 'C',
        rationale: 'Borrower authority thresholds vary by loan agreement. The state office loan officer knows the specific threshold for this loan. Some borrowers have authority up to 10%, others up to 15%. Always confirm with the state office before the borrower acts.',
      },
      {
        id: 'Q4',
        type: 'fill-in-the-blank',
        prompt: 'The independent financial and compliance audit required for RUS projects is called a __________ audit, which stands for "Generally Accepted Government Auditing Standards."',
        blank_answer: 'GAGAS',
        acceptable_answers: ['GAGAS', 'gagas', 'Generally Accepted Government Auditing Standards'],
        rationale: 'GAGAS audit is the federal standard for auditing RUS projects. It verifies compliance with RUS rules, reviews all invoices and payroll, and flags any deviations (non-compliance findings).',
      },
      {
        id: 'Q5',
        type: 'multiple-choice',
        prompt: 'Which of the following is NOT typically a trigger for calling the RUS state office during project execution?',
        options: [
          { letter: 'A', text: 'Contractor is 3 weeks behind schedule.' },
          { letter: 'B', text: 'You discovered a wetland at the alternate route and want to understand NEPA implications.' },
          { letter: 'C', text: 'The borrower wants to know if a specific equipment model meets RUS procurement rules.' },
          { letter: 'D', text: 'You want to update the OSP engineer\'s field notes in the as-built documentation.' },
        ],
        correct: 'D',
        rationale: 'Updating field notes and as-built documentation is routine documentation work — you don\'t need RUS approval for that. All the other scenarios require RUS input because they affect project approval, scope, or compliance.',
      },
    ]}
  />
);

// ────────────────────────────────────────────────────────────────────────────
// LESSON EXPORT
// ────────────────────────────────────────────────────────────────────────────

export default function Lesson() {
  return (
    <LessonLayout meta={meta}>
      <FoundationsSection />
      <WorkingSection />
      <AdvancedSection />
      <QuizSection />
    </LessonLayout>
  );
}

export const key_terms = [
  'RUS state office',
  'RUS national office',
  'loan officer',
  'GAGAS audit',
  'Generally Accepted Government Auditing Standards',
  'audit trigger threshold',
  'compliance deviation',
  'loan modification request',
  'environmental assessment',
  'NEPA review',
];
