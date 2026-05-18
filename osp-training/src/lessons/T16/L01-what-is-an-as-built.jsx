// T16.L01 — What Is an As-Built and Why It Matters
// TIA-606-C (2018); RUS 1751F-630 §14; 7 CFR §1755.400; 811 notification system

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T16.L01',
  course_id: 'T16',
  title: 'What Is an As-Built and Why It Matters',
  order: 1,
  lesson_type: 'foundations',
  prerequisites: ['T15.L09'],
  learning_objectives: [
    'Explain what an as-built record is and how it differs from a construction drawing',
    'Identify the three primary stakeholders who depend on accurate as-built records',
    'State the 811 consequence of inaccurate as-built records',
    'Name the TIA standard that governs fiber infrastructure administration and its class structure',
    'Explain why RUS borrowers are legally required to maintain accurate as-built records',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'as-built record',
    'ANSI/TIA-606-C',
    'administration (fiber infrastructure)',
    'GIS record of record',
  ],
  vocabulary_assumed: [
    { term: 'as-built', source_lesson_id: 'T01.L05' },
    { term: 'as-built redline', source_lesson_id: 'T10.L10' },
    { term: 'as-designed', source_lesson_id: 'T04.L08' },
    { term: 'RUS Form 219', source_lesson_id: 'T01.L05' },
    { term: 'Form 219 certification scope', source_lesson_id: 'T13.L07' },
    { term: 'GIS', source_lesson_id: 'T01.L08' },
    { term: 'post-restoration as-built', source_lesson_id: 'T15.L09' },
    { term: 'DFR (Daily Field Report)', source_lesson_id: 'T10.L10' },
    { term: 'deviation log', source_lesson_id: 'T10.L10' },
  ],
  key_terms: [
    {
      term: 'as-built record',
      definition:
        'The permanent, authoritative documentation of what was physically installed — not what was designed. An as-built record answers the question "exactly where is this fiber, how deep is it buried, how is it spliced, and what is its condition as of the day construction was accepted?" It incorporates every deviation from the as-designed drawings captured during construction. Once the owner accepts the work and files the as-built, it becomes the legal record of the plant.',
    },
    {
      term: 'ANSI/TIA-606-C',
      definition:
        'The ANSI-accredited TIA standard (current edition: TIA-606-C, 2018) that establishes the administration requirements for telecommunications infrastructure — the labeling conventions, record types (link, pathway, location, media), and documentation classes (A, B, C, D) that define what records must exist for a given installation. Often referenced by the shorthand "TIA-606-D" in BICSI TDMM materials, but the published standard designation is TIA-606-C. [confirm current edition]',
    },
    {
      term: 'administration (fiber infrastructure)',
      definition:
        'In TIA-606-C terminology, "administration" means the systematic identification, documentation, and tracking of every component in a telecommunications infrastructure — cables, pathways (conduit, duct, cable tray), spaces (manholes, vaults, pedestals, buildings), and terminations (splice points, connectors). Without a consistent administration system, finding a specific fiber in a large plant becomes guesswork. Administration is the bridge between physical plant and records.',
    },
    {
      term: 'GIS record of record',
      definition:
        'The authoritative, accepted GIS dataset that represents the official location and configuration of the fiber plant. Once a project closes out (Form 219 signed, as-built drawings accepted), the GIS record of record is the version that feeds the 811 one-call system, the borrower\'s plant accounting records, and any future design work on the route. It supersedes any draft or working GIS layers. Changes to the plant after close-out require a formal as-built update and a new GIS record of record.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T16L01WhatIsAnAsBuilt() {
  const quizQuestions = [
    {
      id: 'q1',
      question: 'A construction crew installed a 288-fiber cable 6 inches shallower than the design specified at a road crossing. The as-built drawing reflects the actual 42-inch depth (not the designed 48-inch). Three years later, a paving contractor hits the cable. Which statement BEST describes the as-built\'s role in this scenario?',
      options: [
        'The as-built protects the fiber owner — 42 inches meets NESC minimums, so the paving contractor is liable regardless',
        'The as-built is irrelevant — the design drawing governs liability',
        'The as-built is the legal record of the plant\'s actual location. The 811 system uses this record to warn excavators. If the as-built correctly shows 42 inches and the contractor excavated with full 811 notification, the contractor\'s excavation depth governs liability',
        'The as-built should have reflected 48 inches to avoid liability for the fiber owner',
      ],
      correct: 2,
      explanation: 'The as-built is the authoritative record of actual conditions. If the 811 notification system was used and the as-built correctly showed 42 inches at that location, the contractor and the one-call system are in the chain of liability for excavating without appropriate caution. The as-built\'s job is to ACCURATELY reflect actual conditions — not the design. Falsifying an as-built (recording 48 inches when 42 inches was installed) would expose the fiber owner to far greater liability.',
      citation: 'RUS 1751F-630 §14; 7 CFR §1755.400; One-call (811) notification system.',
    },
    {
      id: 'q2',
      question: 'A RUS borrower\'s inspector signs Form 219 (Inspector\'s Certificate of Construction) certifying the project is complete. As part of the close-out package, the GIS as-built is submitted. Under 7 CFR §1755.400, what is the borrower\'s obligation regarding as-built records AFTER close-out?',
      options: [
        'No obligation after close-out — Form 219 releases all record-keeping duties',
        'Maintain as-built records for 7 years per FCC schedule',
        'Maintain as-built records for the life of the plant and update them whenever the plant is modified — the records must be sufficient to support future construction, emergency restoration, and 811 locate responses',
        'Submit updated as-built records to RUS annually',
      ],
      correct: 2,
      explanation: '7 CFR §1755.400 requires RUS borrowers to maintain telecommunications plant records for the life of the plant. As-built records are living documents — when splices are rerouted, cable is replaced, or new construction connects to the existing plant, the as-built must be updated. The 811 system depends on current records; a stale as-built that does not reflect a restoration repair creates a locate hazard for future excavators.',
      citation: '7 CFR §1755.400; RUS 1751F-630 §14.',
    },
    {
      id: 'q3',
      question: 'Which TIA standard governs the administration (identification, labeling, and documentation) of telecommunications infrastructure including fiber plant?',
      options: [
        'TIA-568-D (structured cabling)',
        'TIA-598-D (fiber color codes)',
        'ANSI/TIA-606-C (administration of telecommunications infrastructure) — sometimes cited as TIA-606-D in BICSI materials',
        'TIA-942-C (data center standards)',
      ],
      correct: 2,
      explanation: 'ANSI/TIA-606-C (2018) is the administration standard. It defines Classes A through D, record types (link, pathway, location, media), and labeling conventions. TIA-568 covers structured cabling installation requirements. TIA-598 covers fiber color coding. TIA-942 covers data centers. Note: BICSI TDMM materials sometimes cite this standard as "TIA-606-D" — the actual ANSI/TIA standard designation is TIA-606-C. [confirm current edition]',
      citation: 'ANSI/TIA-606-C (2018).',
    },
    {
      id: 'q4',
      question: 'An excavator calls 811 two days before digging near a buried fiber route. The 811 system shows the route as active and provides a locate ticket. The excavator damages the fiber. Later investigation reveals the as-built GIS has the route shifted 15 feet from its actual location. Who bears primary liability?',
      options: [
        'The excavator — they called 811 and received a ticket, which satisfies their duty',
        'The 811 center — they should have identified the discrepancy',
        'The fiber owner — because their inaccurate as-built caused the locate marks to be placed in the wrong location, leading the excavator to dig where the cable actually was',
        'No one — 811 tickets provide absolute immunity to all parties',
      ],
      correct: 2,
      explanation: 'The fiber owner\'s obligation is to maintain accurate as-built records so that locate marks can be placed correctly. If the as-built is wrong by 15 feet, the locator places flags 15 feet from the cable — the excavator works in what they believe is the clear zone and hits the cable. The inaccurate as-built is the root cause. The fiber owner bears primary liability for the locate error. This is why as-built accuracy is not just a paperwork requirement — it is a safety and liability issue.',
      citation: 'CGA Best Practices for Damage Prevention v19; state one-call laws; 7 CFR §1755.400.',
    },
  ];

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>In Plain English — What Is an As-Built?</h2>
        <p>
          An as-built record is the answer to one simple question: <strong>"Where is the cable, and what did we actually do with it?"</strong>
        </p>
        <p>
          Before construction, engineers draw a design — where the conduit should go, how deep it should be, where the splice cases should be placed. That design is the as-designed drawing. It describes what we planned.
        </p>
        <p>
          During construction, the field does not follow the design exactly. A buried rock forces the conduit 10 feet east. A utility conflict drops the burial depth from 36 inches to 30 inches for a short run. A splice case gets moved 50 feet because the original location was in a water table. These are deviations — they happen on every job.
        </p>
        <p>
          The as-built record captures what actually happened. It takes every deviation logged in the Daily Field Report (DFR) and redline drawings (from T10.L10) and converts them into a permanent record that reflects physical reality. Once the project closes out, the as-built supersedes the design. The as-built is what the 811 one-call system uses to warn excavators. The as-built is what emergency restoration crews read at 2 a.m. when they are trying to find a break.
        </p>
        <p>
          Think of the as-built like a birth certificate for the fiber plant — it is the document that says "this cable exists, it is located here, and it was installed on this date." Without it, the plant exists physically but not legally.
        </p>

        {/* Key Terms Flashcards */}
        <h3 className="mt-6">Key Terms</h3>
        <div className="flashcard-grid">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>Who Depends on As-Built Records — and Why</h2>

        <p>
          Three groups depend on accurate as-built records. Understanding all three helps you appreciate why the records matter beyond the paperwork requirement.
        </p>

        <h3>1. Future Excavators and the 811 System</h3>
        <p>
          Every state has a one-call center (811 in the U.S.). When anyone plans to excavate — a homeowner, a road crew, a new utility contractor — they call 811. The one-call center notifies every utility whose plant may be in the excavation area. The fiber owner's locating crew then goes to the site, uses the as-built GIS records to find the cable's position, and places flags or paint marks showing where the cable is.
        </p>
        <p>
          <strong>The accuracy of the locate marks is only as good as the as-built.</strong> If the as-built shows the cable 15 feet north of its actual location, the locators place flags 15 feet from the cable. The excavator digs in what they believe is the clear zone — and hits the cable. The fiber owner is liable, not the excavator. This is why as-built accuracy is not bureaucratic box-checking — it is a direct liability exposure and a safety issue for excavators.
        </p>

        <h3>2. Emergency Restoration Crews</h3>
        <p>
          At 2 a.m. on a Sunday, a backhoe hits your feeder cable. A restoration crew gets dispatched. The crew chief opens the as-built GIS on a tablet, finds the affected splice case, identifies which cable segment is involved, checks the splice matrix to see how many fibers are affected and where they go, and dispatches to the right location with the right splice kit. The crew can begin work immediately because the as-built told them everything they needed to know.
        </p>
        <p>
          Without an accurate as-built, the crew has to physically trace the route in the dark, hunt for the splice cases, and guess at the fiber assignments. Each hour of delay is service-level agreement (SLA) exposure and MTTR impact — the numbers from T15.L01.
        </p>

        <h3>3. RUS Auditors and Loan Accountability</h3>
        <p>
          For RUS-financed projects, the borrower certifies on Form 219 that construction was completed per contract documents and specifications. The as-built GIS and splice matrix are part of that close-out package. When an RUS auditor reviews the project, they compare:
        </p>
        <ul>
          <li>The construction cost ledger (what you billed for) against the as-built (what you built)</li>
          <li>The as-built GIS against the approved route to verify plant was installed where it was approved</li>
          <li>The splice matrix against the design to verify fiber assignments are complete</li>
        </ul>
        <p>
          An inaccurate or incomplete as-built at the time of a RUS audit creates findings that can require rework, delay the release of retainage, or in serious cases trigger a False Claims Act investigation if the discrepancy suggests billing for work not performed. The records are the audit trail from field work to federal accountability.
        </p>

        <h3>The 811 Consequence — Plain Statement</h3>
        <p>
          <strong>An inaccurate as-built is a buried bomb.</strong> It sits quietly for years. Then someone picks up a shovel where you told them it was safe, and they cut a cable, or an underground gas line that was also near the cable, or in worst cases they are injured by a cable they struck while operating heavy equipment. As-built accuracy protects other people. It is not paperwork theater.
        </p>

        <h3>TIA-606-C — The Administration Standard</h3>
        <p>
          ANSI/TIA-606-C is the standard that defines how fiber infrastructure documentation should be organized. "Administration" in TIA-606-C means: systematic identification, labeling, and tracking of cables, pathways, spaces, and terminations so that any technician, on any day, with no prior knowledge, can find any component in the system by reading the records.
        </p>
        <p>
          TIA-606-C defines four classes of administration — A, B, C, and D — based on the complexity of the installation:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
          <thead>
            <tr style={{ background: '#1e293b' }}>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Class</th>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Typical Installation</th>
              <th style={{ border: '1px solid #475569', padding: '8px', textAlign: 'left' }}>Minimum Record Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>A</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Small single-tenant building or campus</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Basic: cable labels + termination records + floor plan</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>B</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Multi-tenant building or moderate network</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Class A + pathway records + link records (point-to-point)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>C</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Multi-building campus or medium carrier network</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Class B + location records (manholes, vaults, pedestals) + work order records</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>D</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Complex campus or large carrier network</td>
              <td style={{ border: '1px solid #475569', padding: '8px' }}>Class C + full link record database with path tracing + maintenance records</td>
            </tr>
          </tbody>
        </table>
        <p>
          For a rural telecom RUS borrower building an FTTH network covering a county, <strong>Class B or Class C</strong> is the typical target. The network has multiple buildings (CO, remote terminals, splice huts), multiple cable routes, and hundreds of individual splice cases. Class A (designed for a single office building) is insufficient. Class D (designed for a hospital campus or large carrier backbone) may be more than required. T16.L03 covers Class A through D requirements in detail.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>As-Built Is a Living Record</h2>
        <p>
          The as-built is not a one-time deliverable. It is a living record that must be updated every time the plant changes:
        </p>
        <ul>
          <li><strong>Emergency restoration (T15 topic):</strong> When a cable section is replaced or a new splice case is added, the as-built must reflect the new splice location, new cable section, and new OTDR baseline. T15.L09 introduced post-restoration as-built update requirements — T16 builds the full documentation system those updates feed into.</li>
          <li><strong>Make-ready rearrangements (T08 topic):</strong> When an aerial section is rerouted to a new pole line, the as-built route must be updated to reflect the new pole numbers and GPS coordinates.</li>
          <li><strong>Service adds:</strong> Every time a new subscriber is connected, the splice matrix must be updated to show which fiber pair was assigned.</li>
          <li><strong>Damage and repair:</strong> Every time a cable is damaged and repaired — even if the repair exactly matches the original installation — the as-built gets an update with the repair date, technician, splice loss data, and any change in physical configuration.</li>
        </ul>
        <p>
          The engineering firm (and borrower) has an ongoing obligation to maintain the GIS record of record in current condition. A five-year-old as-built that predates three restoration events is worse than no as-built for the emergency restoration crew — because it gives them false confidence about where the plant is.
        </p>

        <h3>Book vs. Field Practice — As-Built Update Timing</h3>
        <p>
          <strong>Book (7 CFR §1755.400; RUS 1751F-630 §14):</strong> As-built records must be maintained in current condition for the life of the plant. No specific deadline for updating after a post-construction change is stated — but the implication is "promptly."
        </p>
        <p>
          <strong>Field practice:</strong> Emergency restoration as-builts are frequently updated within 24–72 hours of restoration completion, because the restoration crew fills out the post-restoration packet (GPS coordinates, new splice data, OTDR traces) before leaving the site. Non-emergency plant changes — a make-ready rearrangement, a slack relocation — may sit in a queue for weeks or months before the GIS tech processes them. This creates a window where the physical plant does not match the GIS record of record.
        </p>
        <p>
          <strong>Risk of the field practice window:</strong> If an excavation or emergency event occurs during the update-pending window, the as-built is stale. The organization bears locate liability for that period. Best practice is to update the GIS record within 48 hours of any plant change — not when time permits.
        </p>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        lessonId="T16.L01"
        questions={quizQuestions}
        title="T16.L01 Check — What Is an As-Built?"
      />
    </LessonLayout>
  );
}
