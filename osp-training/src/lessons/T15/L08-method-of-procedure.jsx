import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T15.L08',
  course_id: 'T15',
  title: 'Method of Procedure (MOP)',
  order: 8,
  prerequisites: ['T15.L07'],
  learning_objectives: [
    'Define the purpose and required elements of a Method of Procedure (MOP) for emergency restoration',
    'Explain the verbal emergency authorization process and what it accomplishes in change-control policy',
    'Apply the emergency MOP structure to a real restoration scenario, including rollback plan',
    'Distinguish between an emergency MOP and a standard MOP in terms of approval depth and concurrent documentation',
    'Identify the required elements of a post-restoration MOP closeout',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'MOP (Method of Procedure)',
    'rollback plan',
    'change-control window',
    'emergency MOP authorization authority',
    'concurrent documentation',
  ],
  vocabulary_assumed: [
    { term: 'emergency MOP', source_lesson_id: 'T15.L01' },
    { term: 'verbal emergency authorization', source_lesson_id: 'T15.L01' },
    { term: 'NOC', source_lesson_id: 'T15.L01' },
    { term: 'ETR', source_lesson_id: 'T15.L07' },
    { term: 'post-restoration notification', source_lesson_id: 'T15.L07' },
    { term: 'as-built drawings', source_lesson_id: 'T10.L11' },
    { term: 'splice closure reinstallation', source_lesson_id: 'T15.L04' },
    { term: 'temporary patch', source_lesson_id: 'T15.L04' },
  ],
  key_terms: [
    {
      term: 'MOP (Method of Procedure)',
      definition: 'A step-by-step documented procedure specifying the actions to be taken, the sequence of steps, the rollback plan if the procedure fails, and the verification criteria for success. Used in telecom operations to manage network changes in a controlled, repeatable way.',
    },
    {
      term: 'rollback plan',
      definition: 'The section of a MOP that describes how to reverse or mitigate the procedure\'s actions if a step fails or produces unexpected results. For an emergency restoration, the rollback plan typically specifies what circuit-switching or rerouting actions can restore partial service if the physical repair cannot be completed within the RTO window.',
    },
    {
      term: 'change-control window',
      definition: 'The carrier\'s scheduled maintenance period — typically in overnight low-traffic hours (1:00–5:00 AM) — during which network changes are authorized under standard change-control policy. Emergency restorations occur outside scheduled change-control windows by definition; they require a verbal emergency authorization.',
    },
    {
      term: 'emergency MOP authorization authority',
      definition: 'The specific individual (by title or role) who can verbally authorize emergency change-control work outside a scheduled maintenance window — typically a network manager, NOC supervisor, or on-call director. The carrier\'s change-control policy specifies who holds this authority. Knowing this in advance prevents a delay calling up the wrong person at 2 AM.',
    },
    {
      term: 'concurrent documentation',
      definition: 'The practice of recording MOP steps in real time during an emergency restoration rather than reconstructing the record after completion — capturing actual times, deviations from the planned procedure, and decisions made during the work. Concurrent documentation produces an accurate incident record; post-hoc reconstruction produces a sanitized approximation.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

// ─── Quiz questions ──────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'An emergency restoration begins at 2:15 AM outside the carrier\'s scheduled change-control window (1:00–5:00 AM). Which statement best describes the emergency MOP process?',
    options: [
      'Emergency restorations are exempt from the MOP requirement — they are documented only after the fact in the incident report',
      'An emergency MOP follows the same full approval chain as a standard MOP but is expedited by priority routing to approvers',
      'An emergency MOP uses verbal authorization from the designated emergency authority (NOC supervisor or network manager), which is then documented concurrent with the work and formalized post-restoration',
      'Emergency MOPs require approval only from the crew\'s direct supervisor, not from the NOC chain',
    ],
    correct: 2,
    explanation: 'Emergency MOPs use verbal authorization from the designated emergency authorization authority — typically a NOC supervisor or network manager who holds that authority by role in the carrier\'s change-control policy. This verbal authorization replaces the standard multi-step written approval process for the duration of the emergency. The authorization is then documented in the MOP concurrent with the work (or immediately after, per carrier policy) and formalized in the post-restoration closeout. The key phrase is "verbal authorization, documented immediately" — not "no authorization needed."',
  },
  {
    id: 'q2',
    question: 'What is the primary purpose of a rollback plan in an emergency restoration MOP?',
    options: [
      'To provide a list of spare parts needed for the repair',
      'To describe how to reverse or mitigate the procedure\'s actions if a step fails, and what circuit actions can restore partial service if the physical repair cannot complete within the RTO window',
      'To document who is responsible for the outage cause for later billing',
      'To provide the customer with a refund calculation if the ETR is missed',
    ],
    correct: 1,
    explanation: 'The rollback plan addresses what happens if the restoration procedure fails or produces unexpected results mid-execution. For an emergency restoration, this typically means: (1) what switching or rerouting actions can provide partial service if the physical repair cannot be completed, and (2) how to return the network to a known-stable state if the repair attempt makes things worse. The rollback plan is written before the work begins — not improvised during a failure. A MOP without a rollback plan is not a complete MOP.',
  },
  {
    id: 'q3',
    question: 'Why is concurrent documentation (real-time recording during the restoration) preferable to post-hoc reconstruction (writing the MOP log after restoration is complete)?',
    options: [
      'Concurrent documentation is required by OSHA for all telecom fieldwork',
      'Concurrent documentation captures actual times, deviations, and decisions as they occur; post-hoc reconstruction tends to sanitize the record and loses the real sequence of events',
      'Concurrent documentation is faster and takes less total time than post-hoc reconstruction',
      'Post-hoc reconstruction is actually preferred by most carriers because it allows the crew to present a cleaner incident record',
    ],
    correct: 1,
    explanation: 'Concurrent documentation captures the ground truth of the restoration: actual step completion times, deviations from the planned procedure, and real-time decisions (e.g., "decided to skip the pre-soak test due to time pressure; noted in MOP"). Post-hoc reconstruction tends to produce a sanitized record that doesn\'t reflect what actually happened — teams tend to remember the planned sequence rather than the actual sequence under stress. Post-incident RCAs (Root Cause Analyses) depend on the real record, not the sanitized version. Concurrent documentation is also the basis for accurate MTTR calculation.',
  },
  {
    id: 'q4',
    question: 'A standard MOP for a scheduled maintenance window at a carrier typically requires review by the NOC, network engineering, and operations leadership (2–5 business days for approvals). An emergency MOP for the same type of network change requires:',
    options: [
      'The same 2–5 day approval chain, executed in hours',
      'No approval — emergency authorization is always implied when there is an active service outage',
      'Verbal authorization from the designated emergency authority, documented immediately and formalized in the post-restoration closeout',
      'Approval from the field crew supervisor only',
    ],
    correct: 2,
    explanation: 'Emergency MOPs reduce the approval chain to a single verbal authorization from the designated emergency authorization authority. Most carrier change-control policies specifically define this role — usually an on-call network manager, NOC supervisor, or director-level designee. The verbal authorization is documented in the MOP log concurrent with the work, and the full post-restoration documentation formalizes it afterward. This design allows rapid execution while maintaining accountability — the authorization is real, it\'s just compressed into a phone call rather than a written approval chain.',
  },
];

// ─── MOP Template display data ───────────────────────────────────────────────
const MOP_ELEMENTS = [
  {
    section: 'Header',
    content: [
      'MOP number / version',
      'Circuit ID and customer name',
      'Outage ticket number',
      'Date and time of emergency',
      'Authorization authority name and time of verbal authorization',
      'Crew lead name and contact',
    ],
  },
  {
    section: 'Scope',
    content: [
      'Brief description of the outage: cause, affected circuits, customer impact',
      'Location: GPS coordinates of fault site',
      'Affected fiber count and specific buffer tubes',
    ],
  },
  {
    section: 'Preconditions / Safety',
    content: [
      'Locate ticket number and status',
      'Traffic control in place (yes/no)',
      'Trench shoring: (yes/no, type used)',
      'Atmospheric testing if confined-space applicable: O₂, LEL, H₂S, CO readings',
      'PPE required: (list applicable)',
    ],
  },
  {
    section: 'Step-by-Step Procedure',
    content: [
      'Each step numbered; include expected time per step',
      'Fiber type confirmation: method used, result',
      'Fault locate confirmation: OTDR distance, route distance with slack factor applied',
      'Civil work: hand-dig/soft-dig zone documented, shoring type',
      'Splicing: each buffer tube, fiber assignment, expected splice loss per fiber',
      'OTDR verification: wavelength, direction, pass/fail per fiber',
      'Closure reinstallation: manufacturer spec reference, pressure test if applicable',
      'Backfill and compaction: depth confirmed, traffic control removed',
    ],
  },
  {
    section: 'Rollback Plan',
    content: [
      'If physical repair cannot complete within RTO: what circuit switch/reroute action is available',
      'If splice loss exceeds budget: resplice on affected fibers before closure',
      'If closure seal fails pressure test: re-seal per manufacturer and retest before burial',
    ],
  },
  {
    section: 'Verification Criteria',
    content: [
      'OTDR loss per splice: ≤0.1 dB (or carrier specification) bidirectional average',
      'ORL (optical return loss): ≥55 dB at splice point (carrier specification)',
      'Customer service confirmed restored by NOC',
    ],
  },
  {
    section: 'Post-Restoration Closeout',
    content: [
      'Actual step completion times (concurrent documentation)',
      'Deviations from planned procedure with reason',
      'OTDR trace file names archived',
      'As-built update: GPS of new splice point, closure type/model, cover depth',
      'Temporary conditions documented with follow-up date if applicable',
      'NOC notification time and customer confirmation time',
    ],
  },
];

export default function L08MethodOfProcedure() {
  return (
    <LessonLayout meta={meta}>
      <h1>T15.L08 — Method of Procedure (MOP)</h1>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English</h2>
        <p>
          A MOP is a recipe. If you've ever followed a recipe — where each step is numbered, each
          ingredient listed in order, and there's a note about what to do if something goes wrong —
          you understand the concept. The difference is that a recipe for a cake doesn't have a
          "rollback plan" if the oven fails. A telecom MOP does.
        </p>
        <p>
          The reason telecom operations require MOPs is that networks are interconnected. A physical
          change at one point (splicing fiber at a break) affects circuits that are running through
          that fiber. If you make a wrong move — accidentally disrupt an adjacent fiber, introduce
          a high-loss splice, or cut the wrong tube — you need to know exactly what to do to un-do it
          before it cascades into a larger outage.
        </p>
        <p>
          For emergency restorations, the MOP is compressed: you can't spend 3 days getting approvals.
          But the documentation requirement doesn't disappear — it shifts to concurrent documentation
          (writing it down as you go) and verbal authorization instead of written approval chains.
        </p>
      </section>

      {/* ── MOP ELEMENTS ──────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Emergency MOP Structure</h2>
        <p>
          An emergency MOP contains the same structural elements as a standard MOP — the difference is
          in the approval depth and the timing of documentation. Standard MOP: written in advance,
          approved over 2–5 business days, executed during a scheduled maintenance window. Emergency MOP:
          core elements documented concurrent with work, verbal authorization obtained before
          work begins, full documentation completed within hours of restoration.
        </p>

        {MOP_ELEMENTS.map((section) => (
          <div key={section.section} className="mop-section">
            <h3>{section.section}</h3>
            <ul>
              {section.content.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ── VERBAL AUTHORIZATION ──────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Verbal Emergency Authorization</h2>
        <p>
          Most carrier change-control policies require authorization before any network change — even
          emergency restorations. In practice, "emergency authorization" works as follows:
        </p>
        <ol>
          <li>
            <strong>Identify the emergency authorization authority</strong> before the emergency happens.
            This is typically a NOC supervisor or network manager on-call. The carrier's change-control
            policy specifies who holds this authority. This name and contact number should be in every
            crew's emergency contact card — not something to look up at 2 AM.
          </li>
          <li>
            <strong>Call the authority before beginning any network change</strong>. The call takes 2–3
            minutes: describe the outage, the proposed restoration action, and the expected ETR.
          </li>
          <li>
            <strong>The authority provides verbal authorization</strong>: "Authorized — proceed." This
            verbal authorization is the equivalent of the written approval chain for the duration of
            the emergency.
          </li>
          <li>
            <strong>Document the authorization in the MOP</strong>: "Verbal authorization received from
            [Name, Title] at [time]. Authorization for: [specific action]."
          </li>
          <li>
            <strong>Post-restoration formalization</strong>: within the carrier's post-incident timeline
            (typically 24–48 hours), the MOP is completed and filed as a formal change-control record.
          </li>
        </ol>

        <div className="callout field-note">
          <strong>Field Note — Why This Matters:</strong> The verbal authorization requirement exists
          because an emergency restoration changes the network state — splicing re-establishes a physical
          path, closing the closure makes the change permanent. If the repair is done incorrectly, a
          NOC supervisor needs to know that a change was made so they can troubleshoot from an accurate
          network state. The verbal authorization is not bureaucratic friction — it's the handoff that
          ensures the NOC's mental model of the network matches physical reality.
        </div>
      </section>

      {/* ── ROLLBACK ──────────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>The Rollback Plan: What Happens If the Repair Fails</h2>
        <p>
          A MOP without a rollback plan is incomplete. The rollback plan answers: "If step N fails,
          what do we do?"
        </p>
        <p>
          For emergency restorations, the most relevant rollback scenarios are:
        </p>
        <ul>
          <li>
            <strong>Physical repair cannot complete within RTO:</strong> what circuit switching or
            rerouting actions can the NOC execute to restore partial service while the physical repair
            continues? Not all outages have available reroutes, but if one exists, the MOP must identify
            it and the NOC must be ready to execute it. The field crew identifies the option; the NOC
            executes it.
          </li>
          <li>
            <strong>Splice loss exceeds budget on a fiber:</strong> resplice that fiber. The rollback
            is: do not close the closure until all fibers pass OTDR verification. Closing over a bad
            splice creates a post-restoration anomaly that requires re-opening the trench.
          </li>
          <li>
            <strong>Closure seal fails pressure test:</strong> re-seal and retest before burial.
            The rollback is: do not backfill an unsealed closure. Document the re-seal attempt and
            result in the MOP.
          </li>
          <li>
            <strong>Second break discovered during restoration:</strong> revise the ETR immediately
            (per L07), document the second break in the MOP, assess whether temporary patching is
            required on the first break while the second is addressed.
          </li>
        </ul>
      </section>

      {/* ── CONCURRENT DOCUMENTATION ──────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Concurrent Documentation vs. Post-Hoc Reconstruction</h2>
        <p>
          In a planned maintenance window, a crew has time to prepare the MOP in detail beforehand and
          write the closeout after. In an emergency at 2 AM, concurrent documentation is the only
          reliable method.
        </p>
        <p>
          Concurrent documentation means: a crew member (not the splicer — designate a second person
          if available) records each step as it happens with the actual time. "OTDR trace complete
          at 02:47. Break confirmed at 11.8 km. GPS 32.8123, -83.6547." Not reconstructed from memory
          at 7 AM.
        </p>
        <p>
          In a solo-crew situation (one technician), voice-to-text on a phone, a pocket notebook with
          timestamped entries, or a dictated voice memo is acceptable as the concurrent record. The
          formal MOP document is assembled from this concurrent record.
        </p>
        <p>
          <strong>Why concurrent documentation is critical for RCA:</strong> Post-incident root cause
          analysis (RCA) depends on accurate timing data. The time between fault confirmation and ETR
          determination, between ETR and mobilization, between site arrival and splicing complete —
          each delta tells the operations team something about where time was spent and what could be
          improved. Post-hoc reconstruction compresses these deltas based on memory and usually
          understates delays.
        </p>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Telcordia SR-4422 Emergency Restoration Guidance</h2>
        <p>
          Telcordia (formerly Bellcore) SR-4422 provides industry guidance on emergency restoration for
          network elements. The MOP structure described in this lesson aligns with SR-4422's framework
          for emergency change management: verbal authorization, concurrent documentation, and
          post-restoration formalization within 24 hours. While SR-4422 is a guidance document (not a
          regulatory standard), many carrier change-control policies reference it as the baseline for
          emergency procedure design.
        </p>
        <p>
          SR-4422's key contribution to emergency MOP thinking is the framing of "emergency change" as
          a category of change-control action — distinct from "standard change" (pre-planned, scheduled)
          and "normal change" (pre-approved template). Emergency changes have three defining
          characteristics: (1) service is actively impacted, (2) time does not allow standard approval,
          (3) the authorization chain is compressed to verbal with post-facto documentation. Understanding
          this framing helps when interacting with carrier change-control systems that use this
          three-category model.
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
    </LessonLayout>
  );
}
