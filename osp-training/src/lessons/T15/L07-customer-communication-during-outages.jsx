import React from 'react';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';

export const meta = {
  id: 'T15.L07',
  course_id: 'T15',
  title: 'Customer Communication During Outages',
  order: 7,
  prerequisites: ['T15.L01', 'T15.L06'],
  learning_objectives: [
    'Explain the purpose and required frequency of outage updates in a carrier bridge-call structure',
    'Distinguish between an ETR (Estimated Time to Restore) and an ETR revision, and explain when each is appropriate',
    'Describe the escalation trigger points in a major outage communication chain',
    'Apply the 3-element outage update structure (current status, next milestone, expected ETR)',
    'Explain the post-restoration notification sequence and 48-hour verification protocol',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'ETR (Estimated Time to Restore)',
    'ETR revision',
    'major outage escalation',
    'post-restoration notification',
    '48-hour verification window',
  ],
  vocabulary_assumed: [
    { term: 'outage bridge call', source_lesson_id: 'T15.L01' },
    { term: 'RTO', source_lesson_id: 'T15.L01' },
    { term: 'NOC', source_lesson_id: 'T15.L01' },
    { term: 'mobilization', source_lesson_id: 'T15.L01' },
    { term: 'MTTR', source_lesson_id: 'T15.L01' },
  ],
  key_terms: [
    {
      term: 'ETR (Estimated Time to Restore)',
      definition: 'The crew\'s current best estimate of when service will be restored to the affected customer or circuit — communicated at the beginning of a restoration response and updated whenever the estimate changes by more than 30 minutes. An ETR is a commitment to communicate, not a guarantee of outcome.',
    },
    {
      term: 'ETR revision',
      definition: 'A formal update to a previously communicated ETR when new information (extended civil work, additional break points discovered, equipment failure) changes the restoration timeline. Proactive ETR revisions prevent the outage from appearing uncontrolled; reactive revisions (customer calls first) indicate a communication failure.',
    },
    {
      term: 'major outage escalation',
      definition: 'The process of notifying additional management levels and customer stakeholders when an outage exceeds defined thresholds — typically based on circuit count, customer tier, outage duration, or service type (e.g., 911, hospital, critical infrastructure). Most carriers have specific escalation matrices tied to these triggers.',
    },
    {
      term: 'post-restoration notification',
      definition: 'The formal confirmation sent to the customer or NOC that service has been restored, circuit testing has been completed, and the outage is closed — distinct from simply restoring signal. Post-restoration notification requires the customer to confirm service is performing as expected.',
    },
    {
      term: '48-hour verification window',
      definition: 'The period following an emergency restoration during which the NOC and crew remain on watch for anomalies that may indicate an incomplete repair — elevated splice loss, intermittent signal, or secondary damage not identified during the initial restoration. A repair that tests clean but fails within 48 hours indicates a hidden problem.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

// ─── BranchingScenario ────────────────────────────────────────────────────────
const COMM_SCENARIO_STATES = {
  start: {
    id: 'start',
    prompt: 'It is 2:15 AM. You are the senior field technician on a restoration of a fiber cut affecting 847 business customers, a county hospital (on a dedicated fiber path), and a 911 center (on a separate path that is still up). The NOC bridge call opened at 1:45 AM. Your initial ETR was 5:00 AM (3.25 hours from fault confirmation). You are now at the fault site and the trench is open. OTDR shows two break points, not one — the backhoe operator hit two locations 80 feet apart. Your revised estimate is now 6:30 AM. What do you do?',
    choices: [
      { label: 'Wait until 4:00 AM to see if you can recover the original ETR before reporting the change', next: 'wait_wrong' },
      { label: 'Immediately call the NOC with an ETR revision: 6:30 AM, reason (two breaks discovered), next milestone (splicing begins at 2:45 AM)', next: 'etr_revision_correct' },
      { label: 'Continue working and report the delay only if you miss the 5:00 AM ETR', next: 'reactive_wrong' },
    ],
  },
  wait_wrong: {
    id: 'wait_wrong',
    prompt: 'At 3:50 AM, you determine with certainty that 5:00 AM is unreachable. You call the NOC. The hospital\'s on-call administrator, who had planned staffing around the 5:00 AM restore, is notified at 4:15 AM that the outage will run until 6:30 AM. They had patients scheduled for procedures beginning at 6:00 AM that depend on connectivity. The 90-minute delay in your ETR revision costs the hospital significant operational disruption. Proactive revisions preserve trust; reactive ones erode it.',
    choices: [
      { label: 'Understood — revise the ETR as soon as the change is confirmed, not when the original target expires', next: 'etr_revision_correct' },
    ],
    is_failure: true,
  },
  etr_revision_correct: {
    id: 'etr_revision_correct',
    prompt: 'Correct. You call the NOC at 2:20 AM: "ETR revision — two breaks found, revised ETR 6:30 AM. Splicing setup begins at 2:45 AM. 847 business customers affected, hospital on dedicated path affected, 911 center path is clear. Next update at 4:00 AM." The NOC notifies the hospital and business customers. The hospital administrator adjusts staffing with 4 hours notice instead of 45 minutes. At 4:00 AM, first splice complete, second splice in progress. Your next update to NOC should contain:',
    choices: [
      { label: 'Current status (splice 1 complete, all fibers restored; splice 2 in progress), next milestone (closure and backfill est. 5:30 AM), revised ETR (6:00 AM — slightly improved)', next: 'update_correct' },
      { label: 'Just confirm you\'re still on track for 6:30 AM — no detail needed', next: 'no_detail_wrong' },
    ],
  },
  reactive_wrong: {
    id: 'reactive_wrong',
    prompt: 'At 5:10 AM — 10 minutes past your 5:00 AM ETR — the hospital administrator calls the NOC asking for an update. The NOC calls you. You\'ve been heads-down on splicing and haven\'t reported since 1:45 AM. Now the customer is asking, not you proactively reporting. This is a communication failure. In a major outage, the customer should always hear from you before they need to call asking for status. The 30-minute update rule exists for this reason.',
    choices: [
      { label: 'Understood — proactive updates every 30–45 minutes prevent customers from chasing the crew for status', next: 'etr_revision_correct' },
    ],
    is_failure: true,
  },
  no_detail_wrong: {
    id: 'no_detail_wrong',
    prompt: '"Still on track" is not a useful update. The NOC needs to know what has been accomplished and what is remaining so they can manage the customer-facing communication. An update that only says "still on track" gives the NOC nothing to tell the hospital administrator except "they say it\'ll be done at 6:30 AM." The 3-element update structure (current status / next milestone / revised ETR) lets the NOC communicate substantively.',
    choices: [
      { label: 'Understood — always give current status + next milestone + ETR in every update', next: 'update_correct' },
    ],
    is_failure: true,
  },
  update_correct: {
    id: 'update_correct',
    prompt: 'At 5:45 AM, splicing is complete on both breaks. OTDR verification is running. Estimated completion of verification and closure: 6:15 AM. Traffic control is still in place. At this point, what constitutes a proper post-restoration notification?',
    choices: [
      { label: 'Call NOC when OTDR shows clean traces — signal is restored, job is done', next: 'premature_close' },
      { label: 'Call NOC only after: (1) OTDR traces clean on all fibers, (2) closure sealed and traffic control removed, (3) NOC has confirmed with the customer that service is up and performing normally', next: 'full_restore_correct' },
    ],
  },
  premature_close: {
    id: 'premature_close',
    prompt: 'Closing the outage ticket when your OTDR shows clean traces is premature. The customer-side service confirmation is a separate step. Between "OTDR shows clean" and "customer confirms service normal" there can be: routing restoration delays, legacy equipment re-sync, and customer-side issues masked by the outage that now become visible. The post-restoration notification protocol requires customer confirmation, not just technical confirmation. Call the NOC with your OTDR results; the NOC initiates the customer-confirmation step before closing the ticket.',
    choices: [
      { label: 'Understood — post-restoration notification requires customer confirmation, not just technical signal restoration', next: 'full_restore_correct' },
    ],
    is_failure: true,
  },
  full_restore_correct: {
    id: 'full_restore_correct',
    prompt: 'At 6:18 AM, OTDR traces clean (all 12 fibers, both splice points, <0.05 dB per splice), closure sealed, traffic control removed. You call the NOC. NOC contacts the hospital and business customer groups. By 6:35 AM, all services confirmed restored and performing normally. Outage ticket closed at 6:35 AM — 5 minutes past revised ETR of 6:30 AM. What is the 48-hour verification window requirement?',
    choices: [
      { label: 'Nothing — the ticket is closed and the repair is complete', next: 'no_verification_wrong' },
      { label: 'The NOC and crew remain on alert for anomalies: elevated splice loss on monitoring, intermittent signal, or customer-reported instability during the 48 hours following restoration. A repair that fails within 48 hours indicates a hidden problem.', next: 'correct_stop' },
    ],
  },
  no_verification_wrong: {
    id: 'no_verification_wrong',
    prompt: 'Emergency repairs that fail within 24–48 hours after restoration are not uncommon — a temporary patch moisture-wicks overnight, a closure that wasn\'t fully seated cracks under thermal cycling, or a second damage point just outside the OTDR resolution limit was missed. The 48-hour verification window keeps the NOC watching circuit performance so that a recurrence is caught quickly instead of becoming a second emergency outage ticket. "Closed" means the immediate ticket is resolved; it doesn\'t mean the crew disperses and forgets about it.',
    choices: [
      { label: 'Understood — 48-hour watch period after emergency restoration is standard NOC practice', next: 'correct_stop' },
    ],
    is_failure: true,
  },
  correct_stop: {
    id: 'correct_stop',
    prompt: 'Excellent. Customer communication discipline: (1) Proactive ETR at the start and revised ETR immediately when estimates change. (2) 30–45 minute update cycle during active restoration using the 3-element format (current status / next milestone / revised ETR). (3) Escalate early for major outages — hospital, 911, and critical infrastructure customers have escalation contacts separate from standard NOC. (4) Post-restoration notification requires customer confirmation, not just technical signal. (5) 48-hour watch period after restoration. Communication is not a soft skill in outage response — it is as critical as the splice itself.',
    choices: [],
    is_success: true,
  },
};

// ─── Quiz questions ──────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'A crew provides an initial ETR of 4:00 AM. At 2:30 AM, they discover a second break that will push the restoration to 5:30 AM. When should the ETR revision be communicated to the NOC?',
    options: [
      'Immediately upon discovery of the second break — before attempting the repair',
      'At 3:30 AM, when the original ETR is still 30 minutes away',
      'At 4:15 AM, once the original ETR has passed and the delay is confirmed',
      'Only if the customer calls first to ask for an update',
    ],
    correct: 0,
    explanation: 'ETR revisions must be communicated proactively and immediately upon discovery of the condition that changes the timeline — not held until the original ETR expires. Proactive ETR revisions allow the NOC to notify the customer with enough lead time to make operational adjustments (hospital staffing, business contingency planning). Waiting until the original ETR expires means the customer had no warning, which is a communication failure regardless of the technical complexity of the repair.',
  },
  {
    id: 'q2',
    question: 'What is the 3-element outage update structure that should be included in every NOC call during an active restoration?',
    options: [
      'Crew size, equipment on-site, and expected billing hours',
      'Current status (what has been done), next milestone (what is being done now or next), and revised ETR',
      'Fault location GPS, depth of burial, and soil type',
      'Cause of outage, responsible party, and preventive action plan',
    ],
    correct: 1,
    explanation: 'Every outage update to the NOC should contain three elements: (1) Current status — what has been completed since the last update (e.g., "splice point 1 complete, 12 fibers restored"), (2) Next milestone — what the crew is actively doing or will do next (e.g., "splicing point 2, estimated complete at 5:15 AM"), (3) Revised ETR — the current best estimate for full service restoration. These three elements give the NOC the substance they need for customer-facing communication. "Still working" or "on track" without these elements is not a useful update.',
  },
  {
    id: 'q3',
    question: 'After fusion splicing and OTDR verification show clean results, what additional step is required before closing the outage ticket?',
    options: [
      'Customer or NOC confirmation that service is performing normally on the customer side',
      'Physical inspection of the closure by the project manager',
      'Filing an updated as-built drawing within 1 hour of restoration',
      'Nothing — OTDR verification of clean splice results is the final step',
    ],
    correct: 0,
    explanation: 'Post-restoration notification requires customer-side confirmation that service is up and performing normally — not just technical confirmation that the physical plant is intact. Between "OTDR shows clean" and "service confirmed" there can be routing restoration delays, equipment re-sync on the customer\'s end, or secondary issues that only become visible once the main circuit is restored. The NOC typically handles the customer-confirmation outreach; the crew provides the technical signal-restored report to the NOC, and the NOC manages the customer-facing confirmation loop.',
  },
  {
    id: 'q4',
    question: 'What is the primary purpose of a 48-hour verification window following an emergency restoration?',
    options: [
      'To allow the billing department to calculate the outage duration for SLA credit',
      'To keep the NOC and crew on alert for anomalies that may indicate a hidden or incomplete repair before the problem becomes a second emergency',
      'To satisfy the OSHA post-incident reporting timeline',
      'To allow the customer to report any dissatisfaction with the restoration response',
    ],
    correct: 1,
    explanation: 'The 48-hour verification window exists because emergency restorations are more likely to have hidden issues than planned splicing work: temporary patches may wick moisture overnight, closures sealed under time pressure may develop leaks under thermal cycling, and secondary damage points just outside OTDR resolution may degrade further. These failures show up as gradual signal loss or intermittent drops in the 12–48 hours after restoration. Keeping the NOC on elevated watch during this window means that a recurrence is caught quickly and dispatched without a full re-entry into the emergency response process.',
  },
];

export default function L07CustomerCommunicationDuringOutages() {
  return (
    <div className="lesson-container">
      <h1>T15.L07 — Customer Communication During Outages</h1>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English</h2>
        <p>
          When a fiber cut happens at 2 AM, the field crew's job is obvious: find the break and fix it.
          But there's a parallel job happening the entire time: keeping the customer and the NOC informed
          so they can manage their own response. A hospital needs to know if the outage will last 2 hours
          or 6 hours — those two answers require very different staffing decisions.
        </p>
        <p>
          The field crew tends to focus on the technical work, which is natural. But from the customer's
          perspective, silence during an outage is almost as bad as the outage itself. "What's happening?
          When will it be back?" Those questions need answers on a schedule, not when the crew surfaces
          from the trench.
        </p>
        <p>
          This lesson covers: how to structure outage updates, when to revise an ETR, what post-restoration
          notification actually means, and the 48-hour verification window.
        </p>
      </section>

      {/* ── ETR STRUCTURE ─────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>ETR: What It Is and What It Isn't</h2>
        <p>
          An <strong>ETR (Estimated Time to Restore)</strong> is your best current estimate of when service
          will be back. It is not a guarantee. It is a communication commitment: "Based on what we know
          right now, here is our best estimate, and we will tell you if it changes."
        </p>
        <p>
          The first ETR is given within 30 minutes of field arrival and fault confirmation — not before
          (you don't have enough information), and not much later (the customer is already waiting).
          At fault confirmation, you know:
        </p>
        <ul>
          <li>The break location and approximate access conditions</li>
          <li>How many break points your OTDR trace shows</li>
          <li>Your crew size and equipment on-hand</li>
          <li>The civil work required (trench open, backfill remaining)</li>
        </ul>
        <p>
          With that information, a reasonable ETR is achievable. Build in realistic time estimates for
          each step; don't low-ball to sound responsive and then miss it badly.
        </p>

        <h3>ETR Revision Rules</h3>
        <ul>
          <li>
            <strong>Revise proactively</strong> as soon as you know the ETR will change by more than
            30 minutes — not when the original ETR passes.
          </li>
          <li>
            <strong>Revise once with a new committed estimate</strong> — don't revise repeatedly in
            15-minute increments ("now 5:15 AM... now 5:30 AM... now 5:45 AM"). That signals an
            uncontrolled situation. Revise when you have a new confident estimate.
          </li>
          <li>
            <strong>Provide a reason with every revision</strong>: "ETR revised to 6:30 AM — second
            break discovered at fault site, additional splicing required." The reason prevents the
            revision from appearing like the crew just underestimated the original.
          </li>
        </ul>
      </section>

      {/* ── UPDATE FREQUENCY ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Update Frequency and Content</h2>
        <p>
          During an active restoration, provide updates to the NOC every <strong>30–45 minutes</strong>,
          using the 3-element structure:
        </p>
        <ol>
          <li><strong>Current status</strong>: what has been accomplished since the last update</li>
          <li><strong>Next milestone</strong>: what is being done now or will be done next, with expected completion time</li>
          <li><strong>Revised ETR</strong>: the current best estimate for full service restoration</li>
        </ol>

        <div className="example-update">
          <p><strong>Example update (2:00 AM field call to NOC):</strong></p>
          <blockquote>
            "Update at 0200: Civil complete — trench open at both break points. Splicing setup in progress.
            First splice point will be done by 0230. Second splice point by 0315. ETR remains 0430. All
            847 customers affected. Hospital path still affected. 911 path clear. Next update at 0230."
          </blockquote>
        </div>

        <p>
          This gives the NOC exactly what they need to update the customer: what's happening, what's next,
          and when to expect resolution.
        </p>

        <h3>Escalation Triggers</h3>
        <p>
          Most carriers have an escalation matrix that defines when additional management levels must be
          notified. Common triggers:
        </p>
        <ul>
          <li>Outage duration exceeds 2 hours on any circuit (initial escalation to supervisor)</li>
          <li>Critical infrastructure affected: 911, hospital, public safety, military (immediate escalation regardless of duration)</li>
          <li>Outage duration exceeds 4 hours (escalation to regional director or equivalent)</li>
          <li>500+ customers affected (escalation per carrier SLA matrix)</li>
          <li>ETR revised more than twice (indicates uncontrolled situation — management awareness required)</li>
        </ul>
        <p>
          The field crew's responsibility is to provide accurate information to the NOC so the NOC can
          execute the escalation matrix. The crew should also alert the NOC to critical-infrastructure
          impact at first report — don't wait for the NOC to discover the hospital is on the affected
          circuit.
        </p>
      </section>

      {/* ── POST-RESTORATION ─────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Post-Restoration Notification and 48-Hour Verification</h2>
        <p>
          Restoration is complete when:
        </p>
        <ol>
          <li>OTDR verification shows all fibers spliced to within carrier loss budget (bidirectional average)</li>
          <li>Closure is sealed and buried (or documented as temporary with permanent date scheduled)</li>
          <li>Traffic control is removed</li>
          <li>NOC confirms customer-side service is performing normally</li>
        </ol>
        <p>
          Only when all four are complete is the outage ticket closed. The crew's call to the NOC
          triggers step 4: NOC contacts the customer. The crew should not leave the site until NOC
          confirms customer acknowledgment of restored service — this prevents the situation where
          service is restored but the customer is unaware and still in crisis mode.
        </p>

        <h3>48-Hour Verification Window</h3>
        <p>
          After an emergency restoration, the NOC maintains elevated monitoring for 48 hours. The crew
          is on call for rapid re-dispatch if anomalies appear. Specific watch items:
        </p>
        <ul>
          <li>Circuit monitoring showing gradual loss increase (moisture ingress into a compromised closure)</li>
          <li>Intermittent signal drops (thermal cycling on a marginal splice or temporary patch)</li>
          <li>Customer reports of service instability or lower-than-normal performance</li>
          <li>OTDR monitoring traces that deviate from the post-restoration baseline</li>
        </ul>
        <p>
          A repair that fails within 48 hours indicates a hidden problem: a second break outside OTDR
          resolution, a closure that wasn't fully seated, or a temporary patch that wasn't replaced.
          The 48-hour window is the practical catch period for these issues.
        </p>
      </section>

      {/* ── SCENARIO ──────────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Communication Scenario</h2>
        <BranchingScenario
          states={COMM_SCENARIO_STATES}
          startState="start"
        />
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Advanced: SLA Penalty and Credit Implications</h2>
        <p>
          Carrier contracts typically include Service Level Agreements (SLAs) that specify maximum
          outage duration and credit/penalty structures. Common thresholds:
        </p>
        <ul>
          <li>
            <strong>Outage duration &gt; MTR (Maximum Time to Restore)</strong>: triggers automatic
            credit to the customer. MTR varies by circuit type — typically 4 hours for enterprise,
            2 hours for carrier-grade, and specific contractual values for critical infrastructure.
          </li>
          <li>
            <strong>Poor communication</strong>: some SLAs include communication standards — failure
            to provide updates at specified intervals can trigger additional credits independent of
            outage duration. An on-time restoration with no customer communication may still trigger
            a communication-failure credit.
          </li>
          <li>
            <strong>Root cause analysis (RCA)</strong>: major outages typically require a post-incident
            RCA report within 24–72 hours. The MOP closeout documentation, GPS coordinates, and OTDR
            trace archive are the primary source materials for the RCA. This is another reason why
            documentation during the restoration isn't optional — it's the input to the post-incident
            review that the carrier uses to prevent recurrence.
          </li>
        </ul>
        <p>
          The field crew's role in SLA compliance is: accurate first ETR, proactive revisions, and
          complete documentation. The business and legal exposure from a poorly communicated outage
          can significantly exceed the technical cost of the repair.
        </p>
      </section>

      {/* ── FLASHCARDS ────────────────────────────────────────────────────── */}
      <section className="lesson-section flashcards">
        <h2>Key Terms</h2>
        <div className="flashcard-grid">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section className="lesson-section quiz">
        <h2>Lesson Quiz</h2>
        <Quiz questions={QUIZ_QUESTIONS} lessonId={meta.id} />
      </section>
    </div>
  );
}
