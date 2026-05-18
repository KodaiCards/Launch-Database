// T15.L01 — Outage Response: The First 30 Minutes
// Standards: FOA Restoration Guide; Telcordia SR-4422; carrier SLA practice
// Net-new lesson

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';

export const meta = {
  id: 'T15.L01',
  course_id: 'T15',
  title: 'Outage Response: The First 30 Minutes',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T13.L07'],
  learning_objectives: [
    'Execute the first-30-minutes outage response sequence in the correct order',
    'Distinguish RTO (Recovery Time Objective) from MTTR (Mean Time to Repair)',
    'Describe the roles of the NOC, field crew, and customer on an outage bridge call',
    'Draft an initial ETR statement that meets standard carrier communication practice',
    'Identify when an emergency MOP is required and who must authorize it',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'outage bridge call',
    'RTO (Recovery Time Objective)',
    'RPO (Recovery Point Objective)',
    'MTTR (Mean Time to Repair)',
    'ETR (Estimated Time to Restore)',
    'mobilization',
    'emergency MOP',
    'verbal emergency authorization',
    'NOC (Network Operations Center)',
  ],
  key_terms: [
    {
      term: 'outage bridge call',
      definition:
        'A multi-party telephone conference call opened immediately when a fiber outage is declared. Participants: NOC lead (host), field crew lead, customer technical contact, and optionally the account manager. Purpose: real-time coordination so every party hears the same status update at the same time. The bridge call produces a running log of timestamped action items, which becomes the audit trail for SLA dispute resolution. Industry practice: open bridge within 15–30 minutes of outage declaration.',
    },
    {
      term: 'RTO (Recovery Time Objective)',
      definition:
        'The maximum acceptable downtime defined in a Service Level Agreement (SLA). If the SLA says RTO = 4 hours, the carrier must restore service within 4 hours or face financial penalties (usually credit against the customer\'s bill). RTO is a COMMITMENT set in the contract before any outage occurs.',
    },
    {
      term: 'RPO (Recovery Point Objective)',
      definition:
        'The maximum acceptable data loss, expressed in time. For a fiber transport circuit, RPO may be "zero" (any lost data is unacceptable) because the customer\'s equipment at each end handles regeneration and buffering. RPO is usually an IT/network architecture concern that the OSP crew must be aware of — it affects how urgently the temporary patch vs. permanent repair decision is made.',
    },
    {
      term: 'MTTR (Mean Time to Repair)',
      definition:
        'The average time it takes to restore service after an outage, measured over many events. MTTR is a HISTORICAL METRIC — it tells you how the crew has performed in the past. It is NOT the same as RTO. A crew might have an MTTR of 3.2 hours (average performance) while the customer SLA requires RTO of 4 hours. Confusing MTTR with RTO leads to underestimating the urgency of individual outage events.',
    },
    {
      term: 'ETR (Estimated Time to Restore)',
      definition:
        'A time estimate communicated to the customer during an outage, stating when service is expected to be restored. ETR is not a promise — it is a best estimate that must be updated whenever the estimate changes materially (typically: >25% shift, or >30 minute change). Industry practice: issue initial ETR within 30 minutes of outage declaration. "Unknown ETR" is never acceptable once fault locate has started.',
    },
    {
      term: 'mobilization',
      definition:
        'The act of dispatching field crew and equipment to the outage site. Mobilization includes: paging/calling on-call crew, loading OTDR van and splice trailer, confirming route access (any locked gates, active traffic, permit requirements), and checking fuel levels on equipment. Mobilization time is a significant component of MTTR — a crew that has to drive 45 minutes and set up for 30 minutes before locating a fault is already 75 minutes into their RTO before doing any repair work.',
    },
    {
      term: 'emergency MOP',
      definition:
        'A simplified Method of Procedure document created during an active outage. Unlike a scheduled-maintenance MOP (which is written and approved 24–48 hours in advance), an emergency MOP may be documented CONCURRENTLY with the work, with verbal authorization from the NOC supervisor or network manager substituting for the advance written-approval. The verbal authorization is documented post-fact in the MOP. Most carrier change-control policies require at least a concurrent MOP — "no MOP at all" is a contract violation.',
    },
    {
      term: 'verbal emergency authorization',
      definition:
        'An oral approval, given by the NOC supervisor or change-control authority, that allows field work to begin on an emergency basis before a full written MOP is completed. The authorization is logged with a timestamp on the bridge call and documented in the concurrent MOP. Verbal authorization does not waive safety requirements (fall protection, confined space, LOTO — all still apply).',
    },
    {
      term: 'NOC (Network Operations Center)',
      definition:
        'The centralized monitoring and dispatch center that detects fiber outages (typically via network management alarms when circuit power falls below threshold), opens the outage ticket, initiates the bridge call, coordinates field crew dispatch, and communicates with affected customers. In a small telecom company, the NOC function may be handled by a single on-call network engineer rather than a staffed 24/7 center.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'as-built drawings', source_lesson_id: 'T10.L11' },
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'OTDR trace (event table)', source_lesson_id: 'T12.L07' },
    { term: 'RUS Form 565 (Inspector\'s Daily Report)', source_lesson_id: 'T13.L11' },
    { term: 'Form 219', source_lesson_id: 'T13.L07' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T15L01OutageResponseFirst30() {
  const mobilizationScenario = {
    id: 'mobilize',
    title: 'Outage Response — First Decision',
    opening:
      'It is 2:47 AM. Your on-call pager fires. The NOC reports: "Fiber cut on Route 14 feeder between Node A and Node B. All circuits down. Customer is PSC dispatch center — they have backup radio but no landline. SLA is 4-hour RTO." You are the field crew lead. What is your first action?',
    nodes: {
      start: {
        text: 'You receive the page. What do you do first?',
        choices: [
          { label: 'Call the NOC, get on the bridge, and start gathering information', nextNode: 'bridge_first' },
          { label: 'Drive immediately to the route — every minute counts', nextNode: 'drive_first' },
          { label: 'Call your supervisor to authorize you to respond', nextNode: 'supervisor_first' },
        ],
      },
      bridge_first: {
        text: '✅ Correct. Getting on the bridge call first gives you: the exact alarm time (for ETR calculation), any known cause (vehicle strike call came in? storm damage?), whether the NOC has a line-card map showing which fibers are affected, and the customer contact information. You spend 4 minutes on the bridge, get the information you need, confirm the splice trailer is fueled, and mobilize. Time lost: 4 minutes. Time saved: you now know the exact route section to head to instead of guessing.',
        choices: [{ label: 'Continue', nextNode: 'issue_etr' }],
      },
      drive_first: {
        text: '⚠️ Driving immediately without getting on the bridge means: you might drive to the wrong end of the route, you don\'t know if the NOC has already dispatched another crew, you haven\'t issued an ETR to the customer, and your splice trailer might not be fueled. Field urgency is real — but 4 minutes on the bridge call before you leave saves you from a 45-minute drive in the wrong direction.',
        choices: [{ label: 'Go back and get on the bridge call first', nextNode: 'bridge_first' }],
      },
      supervisor_first: {
        text: '⚠️ You are the on-call crew lead. Your on-call authorization IS the emergency authorization. Calling your supervisor to get permission to respond costs precious RTO minutes. The correct call: get on the NOC bridge, confirm the outage, mobilize. Your supervisor can be updated via the bridge call if needed.',
        choices: [{ label: 'Go back and get on the bridge call', nextNode: 'bridge_first' }],
      },
      issue_etr: {
        text: 'You\'re 8 minutes into the outage. You have confirmed the damage is a vehicle strike at mile marker 14.7. You have no visual yet. When do you issue the first ETR?',
        choices: [
          { label: 'Now — issue an ETR based on your drive time + estimated locate and repair time', nextNode: 'etr_now' },
          { label: 'After you physically see the damage — you can\'t estimate without seeing it', nextNode: 'etr_wait' },
          { label: 'After you complete the OTDR trace — that\'s the accurate data', nextNode: 'etr_wait' },
        ],
      },
      etr_now: {
        text: '✅ Issue the ETR now, even with uncertainty. A good initial ETR: "Estimated time to repair: 3–4 hours from alarm time. Current status: crew mobilizing, ETR will be updated on confirmation of damage scope." The customer needs SOMETHING — "unknown ETR" for 30 minutes is worse than an estimate that may be revised. Update at the site when you have damage assessment.',
        choices: [],
      },
      etr_wait: {
        text: '⚠️ Waiting to issue an ETR until you have perfect information means the customer has no ETR for 45+ minutes. Carrier best practice: issue an initial ETR based on your experience with similar events, explicitly labeled as an estimate. "We\'ll have an updated ETR on site arrival in approximately 40 minutes" is a valid ETR. Silence is not.',
        choices: [{ label: 'Issue a preliminary ETR', nextNode: 'etr_now' }],
      },
    },
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'A carrier SLA specifies a 4-hour RTO. The crew\'s historical MTTR is 3.2 hours. The dispatcher says "we\'re under our MTTR, we have time." This reasoning is:',
      type: 'multiple-choice',
      options: [
        'Correct — if MTTR < RTO, the crew is meeting the SLA requirement',
        'Wrong — RTO is the SLA target for THIS outage; MTTR is historical average performance. Each outage must be treated as if it could be the one that exceeds RTO.',
        'Correct — RTO and MTTR are the same metric, just different names',
        'Wrong — MTTR is more stringent than RTO for RUS-financed networks',
      ],
      correct: 1,
      explanation:
        'MTTR (Mean Time To Repair) is the mathematical average across all past incidents — it is the sum of all repair times divided by the number of incidents. An MTTR of 3.2 hours means some outages resolved faster than 3.2 hours and some slower; you cannot assume any individual outage will come in at or below the average. The RTO is the target for EVERY individual outage. Using "MTTR < RTO" as a reason to reduce urgency is a category error that leads to SLA breaches.',
    },
    {
      id: 'q2',
      question: 'On an outage bridge call, who is the HOST (the one responsible for running the call, keeping action-item log, and issuing updates)?',
      type: 'multiple-choice',
      options: [
        'The customer — it\'s their service that\'s down',
        'The field crew lead — they have the most current on-site information',
        'The NOC lead — they opened the ticket and are the central coordination point',
        'The account manager — they have the customer relationship',
      ],
      correct: 2,
      explanation:
        'The NOC lead hosts the bridge call. They: opened the alarm ticket, have the network management view of the outage, coordinate all parties, log action items, and issue status updates. The field crew provides on-site status to the NOC. The customer participates to receive updates. The account manager may join for escalation but is not the primary coordinator.',
    },
    {
      id: 'q3',
      question: 'An emergency MOP requires:',
      type: 'multiple-choice',
      options: [
        'Full written approval by the change-control authority before any work begins — no exceptions',
        'At minimum, verbal authorization from the NOC supervisor logged with a timestamp, with concurrent MOP documentation',
        'No documentation during an emergency — document post-restoration',
        'Only the field crew lead\'s signature — emergency conditions remove approval requirements',
      ],
      correct: 1,
      explanation:
        'Emergency MOPs use verbal authorization (logged on the bridge call with timestamp) to allow work to begin without a fully pre-written plan. The MOP is documented CONCURRENTLY — the second person on the crew or the NOC engineer documents each step as the field crew executes them. Zero documentation during an emergency is a contract violation under most carrier change-control policies.',
    },
    {
      id: 'q4',
      question: 'A hospital customer states they have "zero RPO" on their network connection. For the OSP restoration crew, this means:',
      type: 'multiple-choice',
      options: [
        'The hospital does not care about data loss — only about downtime',
        'The hospital\'s architecture cannot tolerate any data loss, which means their equipment at each end handles regeneration and buffering — the crew\'s job is still to restore the fiber as fast as possible',
        'RPO is the same as RTO — both are targets for service restoration time',
        'Zero RPO means the crew must install redundant fiber before completing the repair',
      ],
      correct: 1,
      explanation:
        'RPO (Recovery Point Objective) is the maximum acceptable DATA LOSS, expressed in time. "Zero RPO" means the hospital\'s systems cannot afford to lose any in-transit data. For OSP crew, this is mostly an IT/network architecture concern — the customer\'s equipment (switches, routers, SONET ADMs) handles regeneration and buffering at each end. The field crew\'s job is to restore fiber continuity as fast as possible; the equipment handles data-layer recovery. RPO and RTO are distinct: RTO = maximum acceptable downtime (minutes/hours); RPO = maximum acceptable data loss (seconds/minutes/hours of in-transit data).',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A fiber outage is an emergency. Someone's 911 center, hospital network, or dispatch
          system just went dark. The first 30 minutes of your response set the trajectory for
          whether you make your SLA target or pay credits — and whether the customer ever trusts
          you again.
        </p>
        <p>
          This lesson teaches the outage response sequence — what to do, in what order, in the
          first 30 minutes of an active fiber outage. Not the repair itself (that comes in
          L02–L06), but the critical coordination work that makes the repair possible.
        </p>

        <h3>The Three Parallel Tracks</h3>
        <p>
          An outage response runs three things simultaneously:
        </p>
        <ol>
          <li><strong>Technical track:</strong> fault locate → access → repair → test. This is what the field crew does.</li>
          <li><strong>Communication track:</strong> customer ETR → bridge call updates → SLA clock management. This is what NOC does, with field crew input.</li>
          <li><strong>Documentation track:</strong> emergency MOP → bridge call log → post-restoration records. This runs in parallel with both tracks.</li>
        </ol>
        <p>
          Failing the communication or documentation track is almost as bad as failing the repair. A
          carrier that restores service in 3.5 hours but never issued an ETR and opened no MOP is in
          breach of most SLA frameworks even if the repair was technically perfect.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T13.L01 Inspector Role and QA/QC Framework</strong> — the inspector's role is quality verification and documentation. <strong>T10.L11 Acceptance Walk and Project Closure</strong> — formal acceptance and close-out procedures. This lesson shifts focus: from daily inspection during construction to emergency response during an outage. The same documentation discipline (bridge call log, MOP, as-built records) now runs in parallel with fault-finding and repair work.
        </p>
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The First 30 Minutes: Step by Step</h2>

        <h3>Minute 0: NOC Detects the Outage</h3>
        <p>
          Network management systems alarm when circuit power (optical signal level) drops below
          threshold. The NOC engineer sees the alarm, confirms it's a real outage (not a transient),
          and opens an outage ticket. Alarm time = the official start of the outage clock.
        </p>
        <p>
          <strong>Important:</strong> the outage clock starts at ALARM TIME, not when the field
          crew is on site. A crew that spends 20 minutes deciding whether to respond has already
          burned 20 minutes of their RTO before driving a single mile.
        </p>

        <h3>Minutes 1–5: NOC Opens Bridge + Notifies Crew</h3>
        <p>
          The NOC opens the outage bridge call number, pages or calls the on-call field crew
          lead, notifies the customer's technical contact, and initiates the mobilization. The
          first thing on the bridge call:
        </p>
        <ul>
          <li>Alarm time and affected circuit(s)</li>
          <li>Any known cause (vehicle strike called in? storm system visible on radar?)</li>
          <li>Route segment likely affected (based on which circuits are down and where they route)</li>
          <li>Customer SLA and RTO target</li>
        </ul>

        <h3>Minutes 5–10: Crew Gets on Bridge + Mobilizes</h3>
        <p>
          The field crew lead joins the bridge, confirms the information, and begins mobilization:
          OTDR van loaded, splice trailer fueled and hitched, traffic control materials verified,
          emergency tools inventory check.
        </p>
        <p>
          <strong>Field vs. Book:</strong> The book says mobilization begins after the bridge call.
          In practice, a good on-call crew will be grabbing keys and checking equipment while
          still on the phone — concurrent mobilization is fine. What's NOT fine: driving away
          before getting on the bridge call at all.
        </p>

        <h3>Minutes 10–15: Issue Initial ETR</h3>
        <p>
          Within 30 minutes of alarm (industry target: 15 minutes), the NOC must issue an initial
          ETR to the customer's technical contact. The ETR format:
        </p>
        <blockquote style={{ borderLeft: '3px solid #007bff', paddingLeft: '1rem', fontStyle: 'italic' }}>
          "Outage confirmed at 02:47 on Route 14 feeder. Field crew is mobilizing. Based on the
          damage type (vehicle strike reported) and route distance, our estimated time to restore
          is 3–5 hours from alarm time (06:47–08:47 EST). We will update this ETR on site arrival
          at approximately 03:32."
        </blockquote>
        <p>
          Two key elements: a specific time window (not "a few hours"), and a commitment to update
          on site arrival. The customer can now make decisions about backup communications with
          a real time estimate.
        </p>

        <h3>Minutes 15–30: Emergency MOP Documentation Begins</h3>
        <p>
          Even for emergency restores, a MOP is required. The emergency MOP process:
        </p>
        <ol>
          <li>NOC supervisor gives verbal authorization: "Authorization granted at 02:52 for emergency restoration of Route 14 fiber outage. [NOC lead name] authorizing." This is logged in the bridge call record with timestamp.</li>
          <li>A second person (NOC engineer, second crew member, or office coordinator) begins the concurrent MOP document, noting the verbal authorization timestamp.</li>
          <li>As the field crew reports actions, the MOP is filled in real-time.</li>
        </ol>
        <p>
          <strong>RTO vs. MTTR — the common mistake:</strong>
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Term</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>What it is</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Common mistake</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>RTO</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>SLA target for this outage (commitment)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Treating it as a "maximum allowed average"</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>MTTR</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Historical average repair time (metric)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Using it to justify slower response ("we're under MTTR")</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── SCENARIO ───────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Scenario: 2:47 AM Response</h2>
        <BranchingScenario scenario={mobilizationScenario} />
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>RPO and Dark Fiber Considerations</h2>
        <p>
          For RUS-financed rural networks that carry public-safety or critical-infrastructure
          circuits (911 dispatch, hospital networks, utility SCADA), RPO may effectively be zero —
          any data lost during the outage is unacceptable because the customer has no redundant path.
          This drives prioritization: a critical-circuit outage gets the on-call crew, the
          supervisor paged, and the NOC senior engineer on the bridge, even at 2:47 AM on a
          Tuesday. A residential internet service outage on the same route gets the same technical
          response but with different escalation pressure.
        </p>
        <p>
          <strong>Book vs. Field Practice:</strong> The book (carrier SLA frameworks) treats RPO
          and RTO as separate parameters negotiated per circuit type. In field practice, on small
          RUS networks, most crews treat every outage as if RPO = 0 and RTO = 4 hours regardless
          of the specific SLA, because the borrower can't afford the reputational damage of a
          single missed critical-circuit SLA with a government or public-safety customer.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            The first-30-minutes response cascades into root-cause analysis and MOP execution:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T13.L07 Close-Out Documentation &amp; Form 219</strong> — As-built records (the Form 219 and fiber splice matrix) are your diagnostic starting point on an outage call. You need to know which routes, fiber types, splice methods, and test baseline are on record to narrow fault location. A missing or inaccurate Form 219 delays the first-30-minute response and extends MTTR.</li>
            <li><strong>T16.L06 Reconciling As-Built to As-Designed</strong> — If the actual plant (observed in GIS) doesn't match the as-built records (Form 219), fault location during outage becomes guesswork. Accurate Form 219 + accurate as-built records = you can dispatch the crew confidently to the right location within the first 15 minutes.</li>
            <li><strong>T17.L08 Emergency MOP &amp; Crew Authorization</strong> — If your ETR assessment at minute 20 says "we need to make an emergency splice," the emergency MOP must be approved in real time (verbal authorization, documented in the bridge call notes, followed by procedure). Understanding MOP hierarchy and authorization roles is essential during outage bridges.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The first 30 minutes are about information gathering and decision-making, not panic. Accurate as-built records are the single biggest time-saver.
          </p>
        </section>
      </section>

      {/* ── FLASHCARDS ─────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Key Terms</h2>
        {meta.key_terms.map(({ term, definition }) => (
          <Flashcard key={term} term={term} definition={definition} />
        ))}
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
