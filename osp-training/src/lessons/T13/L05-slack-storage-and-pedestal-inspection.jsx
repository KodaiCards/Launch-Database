// T13.L05 — Slack Storage and Pedestal Inspection
// H-03: no independent minimums, defer to T10.L06 MSA; M-08: recording format; M-25: GPS slack register

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T13.L05',
  course_id: 'T13',
  title: 'Slack Storage and Pedestal Inspection',
  order: 5,
  lesson_type: 'technical',
  prerequisites: ['T13.L04'],
  learning_objectives: [
    'Verify slack storage against the project-specific MSA schedule rather than independent minimums',
    'Record a complete slack verification entry on Form 565 (coil count, estimated length, GPS coordinates)',
    'Build a slack location register with the fields required for 24/7 emergency restoration dispatch',
    'Apply the outside-in pedestal access sequential checklist',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [],
  key_terms: [],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'acceptance walk', source_lesson_id: 'T10.L11' },
    { term: 'MSA', source_lesson_id: 'T10.L06' },
    { term: 'slack loop', source_lesson_id: 'T10.L06' },
    { term: 'NIU slack', source_lesson_id: 'T10.L06' },
    { term: 'expansion loop', source_lesson_id: 'T10.L06' },
    { term: 'RUS Form 565 (Inspector\'s Daily Report)', source_lesson_id: 'T13.L11' },
    { term: 'locate ticket', source_lesson_id: 'T10.L01' },
    { term: 'material deficiency', source_lesson_id: 'T13.L01' },
    { term: 'as-built drawings', source_lesson_id: 'T10.L11' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L05SlackInspection() {
  const quizQuestions = [
    {
      id: 'q1',
      question: 'T13 slack inspection standards are:',
      type: 'multiple-choice',
      options: [
        '30 feet minimum at aerial attachment points, 50–100 feet in vaults',
        'Verify against the contract MSA schedule (commonly 50 ft at intermediate points / 100 ft at splice points per T10.L06, but the contract governs)',
        'Independently defined by the inspector based on the fiber count',
        'Whatever the contractor installed — slack minimums are a design deliverable, not an inspection parameter',
      ],
      correct: 1,
      explanation:
        'T13 does NOT introduce independent slack minimums. The project MSA (Minimum Slack Allocation) schedule, introduced in T10.L06, defines the minimums for this specific project. T13 verifies installed slack against those contract values. The 50 ft / 100 ft figures are a common industry band (often used as defaults in T10.L06 examples) but the actual enforceable numbers for any project come from the contract MSA schedule — the inspector verifies against that document, not against T13 or T10 standalone values.',
    },
    {
      id: 'q2',
      question: 'A Form 565 slack verification entry should include:',
      type: 'multiple-choice',
      options: [
        '"Slack adequate" — no specific measurement needed',
        'Coil count × estimated per-wrap length, GPS coordinates of the storage location, structure type',
        'Total route footage and number of splice points only',
        'Inspector initials and date only',
      ],
      correct: 1,
      explanation:
        'Form 565 slack entry must be specific: count the number of coil wraps, estimate length per wrap (typically 6–8 feet per wrap for a standard coil), multiply for total estimated slack length. Record GPS coordinates of the storage location (vault, pedestal, structure) and the structure type (handhole, above-grade vault, aerial coil at attachment). "Slack adequate" is unacceptable — it cannot be audited later.',
    },
    {
      id: 'q3',
      question: 'The slack location register maintained at close-out must include which field for emergency restoration use?',
      type: 'multiple-choice',
      options: [
        'The contractor\'s name who installed the slack',
        'Street address AND GPS coordinates of each slack storage location, structure type, and lock/access information',
        'Cable reel number and spool footage',
        'Slack length only',
      ],
      correct: 1,
      explanation:
        'Emergency restoration at 2 AM requires that a dispatch technician can locate slack without pre-planning. The register must include: GPS coordinates (for navigation), street address or closest address (for verbal dispatch instructions), structure type (handhole lid, pedestal door, aerial coil — determines what tools are needed), and lock or access information (padlock combination, key type, key location). Without these fields, the register has limited emergency value.',
    },
    {
      id: 'q4',
      question: 'The pedestal access sequential checklist begins with which step?',
      type: 'multiple-choice',
      options: [
        'Terminal connections — verify all fibers are spliced',
        'Ground connection — verify bonding wire is attached',
        'Exterior visual — door hardware, weatherseal, physical damage from outside',
        'Rodent seal — check all entry points',
      ],
      correct: 2,
      explanation:
        'Outside-in: start exterior. The sequence is: (1) exterior visual (door hardware, weatherseal, physical damage, graffiti or vandalism), (2) door hardware (opens freely, hinges not corroded, lock functional), (3) interior clearance (adequate space, no water accumulation), (4) rodent seal (all conduit entries sealed), (5) terminal connections (properly routed, labeled, spliced), (6) grounding wire (bonded per T14.L06 requirements). Starting exterior ensures you identify damage before opening and avoids opening a door that will be stuck or damaged.',
    },
    {
      id: 'q5',
      question: 'A slack coil has 8 wraps. Each wrap is approximately 7 feet of cable. The total estimated slack is:',
      type: 'multiple-choice',
      options: ['7 feet', '15 feet', '56 feet', '80 feet'],
      correct: 2,
      explanation:
        '8 wraps × 7 feet per wrap = 56 feet of estimated slack. This is an estimate — the per-wrap length depends on the coil diameter, which varies by structure type. For a handhole coil, typical wrap length is 6–8 feet; for a pedestal coil, 4–6 feet. Record the estimate with the wrap count (not just the total) so the calculation can be verified. 56 feet at an intermediate point would satisfy a T10.L06-style 50-foot MSA minimum; at a splice point it may fall short if the project MSA schedule requires 100 ft — always verify against the contract MSA schedule, not a standalone T13 minimum.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Slack is the extra cable deliberately left at key points so technicians can make
          repairs without pulling the whole route. If there's not enough slack at a splice
          point, a dig-in that damages the cable may require pulling new cable across the
          entire segment rather than just splicing in a short section. Slack is cheap to
          leave and expensive to add later.
        </p>
        <p>
          The inspector's job on slack is: measure it, record it specifically, and verify
          it meets the project MSA schedule. This lesson teaches you exactly what to measure
          and how to record it so the information is useful later — including for emergency
          restoration.
        </p>

        <h3>No Independent Slack Minimums in T13</h3>
        <p>
          This is important: T13 does NOT define its own slack minimums. The minimums for any
          specific project are defined in the project's MSA (Minimum Slack Allocation) schedule
          introduced in T10.L06. Those numbers come from the engineer of record and reflect the
          project's splice plan, restoration strategy, and cable type.
        </p>
        <p>
          What T13 adds is the inspection method — HOW to measure slack and HOW to record it.
          The threshold (50 feet intermediate / 100 feet at a splice point, or whatever the
          MSA schedule specifies) comes from T10.L06.
        </p>
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <h3 className="text-blue-900 font-semibold mb-2">Quick Refresher</h3>
          <ul className="text-sm space-y-1">
            <li><strong>Acceptance walk:</strong> The inspection of the completed network to confirm all work conforms to specification.</li>
            <li><strong>Punch list:</strong> A written record of all material deficiencies requiring correction before acceptance.</li>
            <li><strong>RUS Form 565:</strong> The daily inspection record documenting construction progress and findings.</li>
          </ul>
        </div>

        <h2>Measuring and Recording Slack</h2>

        <h3>Step 1: Measure the Coil</h3>
        <p>
          Do not try to uncoil and measure the cable directly — that would disturb the
          installation. Instead, use the estimation method:
        </p>
        <ol>
          <li>
            Count the number of complete wraps in the stored coil. A "wrap" is one full
            360-degree loop of the cable.
          </li>
          <li>
            Estimate the circumference of one wrap. For a handhole coil: measure the coil
            diameter with a tape measure and calculate circumference = π × diameter. For a
            4-foot diameter coil: 3.14 × 4 ft = 12.6 ft per wrap. Halve this to get a
            conservative estimate (cable lies in a multi-layer coil, not a perfect circle):
            ~6–7 feet per wrap.
          </li>
          <li>
            Total slack = wraps × estimated feet per wrap.
          </li>
        </ol>
        <p>
          Example: 10 wraps × 7 ft/wrap = 70 feet estimated slack.
        </p>

        <h3>Step 2: Record on Form 565</h3>
        <p>
          The Form 565 entry must include all of the following — "slack adequate" is never
          acceptable:
        </p>
        <ul>
          <li>Structure identifier (handhole H-22, pedestal P-14, pole attachment Span 44)</li>
          <li>GPS coordinates (latitude/longitude to 5 decimal places minimum)</li>
          <li>Coil count: "12 wraps"</li>
          <li>Estimated feet per wrap: "7 ft/wrap (coil diameter 3.5 ft)"</li>
          <li>Total estimated slack: "84 feet"</li>
          <li>MSA requirement for this location: "50 ft (intermediate) per MSA schedule §3.4" or "100 ft (splice point)"</li>
          <li>Pass/Fail verdict: "PASS — 84 ft &gt; 50 ft required"</li>
        </ul>

        <h3>Building the Slack Location Register</h3>
        <p>
          At close-out, the inspector assembles a slack location register — a complete inventory
          of all slack storage locations on the project. This document is transferred to the
          borrower as part of the close-out records package and maintained in the O&M (Operations
          and Maintenance) files.
        </p>
        <p>
          <strong>Emergency restoration use case:</strong> It's 2 AM. A fiber cut is reported
          at mile marker 14.3 on the rural route. The on-call technician needs to find the
          nearest slack storage within 30 minutes. Without a slack register with GPS coordinates
          AND street address AND access information, they are driving a dark road looking for
          unmarked vaults.
        </p>
        <p>
          The register must include:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Field</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Why It Matters for Emergency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>GPS coordinates</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Navigate to exact location in the dark</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Street address or closest address</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Dispatch verbal instructions to crew; enter in nav app</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Structure type</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Know what tools to bring (vault hook, pedestal key, lineman's belt)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Access info</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Padlock combo, key type, spare key location</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Estimated slack length</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Pre-plan whether enough slack exists for the repair</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Fiber count and cable type</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Confirm the right cable is at this location</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Pedestal Access Inspection Sequence</h2>
        <p>
          Pedestal inspection follows an outside-in sequential checklist. The order matters
          because each step informs the next:
        </p>
        <ol>
          <li>
            <strong>Exterior visual:</strong> Condition of the cabinet or pedestal housing.
            Physical damage (vehicle strike, vandalism). Weatherseal intact. No exposed wiring.
            Ground wire visible and attached.
          </li>
          <li>
            <strong>Door hardware:</strong> Door opens smoothly (hinges not corroded or seized).
            Lock is functional and keyed correctly. Latch mechanism works. Weatherstrip in good
            condition.
          </li>
          <li>
            <strong>Interior clearance:</strong> Sufficient working space inside for a technician
            to service terminal connections. No standing water. No evidence of flooding history
            (rust stain lines, mud residue).
          </li>
          <li>
            <strong>Rodent seal:</strong> All conduit entries have riser seal or appropriate
            bushing with rodent-resistant material. No gaps where mice or squirrels can enter.
          </li>
          <li>
            <strong>Terminal connections:</strong> Fibers properly routed in splice trays or
            terminal panels. Cable properly secured (no hanging loads on fiber). Labels match
            the project fiber assignment schedule.
          </li>
          <li>
            <strong>Ground connection:</strong> Bonding wire from cabinet to ground rod visually
            present and mechanically secure. Ground rod visible (if exposed ground rod at the
            pedestal). Ground resistance test (if this is a first-installation acceptance
            inspection — per L04 IEEE 81 procedure).
          </li>
        </ol>
        <p>
          <strong>Book vs. Field Practice:</strong> The textbook says inspect all six items
          every time. In the field, post-acceptance annual inspections on fully operational
          pedestals often skip the ground resistance test (assumed stable once accepted). This
          is acceptable only if the borrower's maintenance plan specifically documents annual
          ground resistance verification at a different interval. For a first-installation
          acceptance, ALL six items are required, including ground resistance measurement.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T01.L06</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T10.L11</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T10.L06</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
