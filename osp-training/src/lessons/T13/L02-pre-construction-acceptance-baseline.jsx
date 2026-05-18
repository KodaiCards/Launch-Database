// T13.L02 — Pre-Construction Acceptance Baseline
// Standards: RUS Form 515 §3(a) [confirm edition]; 7 CFR §1753.8; FHWA CPMI; AIA A201 [confirm edition]
// H-14: pre-construction conference checklist; H-15: inspection cadence models

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';

export const meta = {
  id: 'T13.L02',
  course_id: 'T13',
  title: 'Pre-Construction Acceptance Baseline',
  order: 4,
  lesson_type: 'foundation',
  prerequisites: ['T13.L12'],
  learning_objectives: [
    'Complete a pre-construction conference checklist covering RUS Form 515 §3(a) required elements',
    'Write quantified pass/fail acceptance criteria for burial depth, lashing pitch, slack, and ground resistance',
    'Choose the appropriate inspection cadence (continuous, milestone, sampling) for a given construction activity',
    'State the inspector\'s obligation under 7 CFR §1755.400(b) to be present at OTDR testing',
    'Explain why constructive acceptance doctrine applies when the inspector is never present',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'pre-construction acceptance baseline',
    'acceptance criteria document',
    'inspection cadence',
  ],
  key_terms: [
    {
      term: 'pre-construction acceptance baseline',
      definition:
        'A written document, prepared before any construction begins, that establishes specific, measurable pass/fail thresholds for every inspectable parameter on the project. Signed by the borrower, contractor, and engineer of record. Required by RUS Form 515 §3(a). Eliminates ambiguity about what "acceptable" means before disputes arise. Parameters include: burial depth tolerance, lashing pitch range, slack minimums (per project MSA schedule), ground resistance acceptance threshold, OTDR pass/fail budget, and any project-specific additional criteria.',
    },
    {
      term: 'acceptance criteria document',
      definition:
        'The formal written record of the pre-construction acceptance baseline. Contains a table of inspectable items, the specification reference for each, the quantified pass/fail threshold, and the measurement method to be used. This document becomes part of the contract record and is referenced by the inspector throughout construction. Disputes about whether a measurement constitutes a deficiency are resolved by reference to the acceptance criteria document, not by opinion.',
    },
    {
      term: 'inspection cadence',
      definition:
        'The frequency and pattern of inspector presence at the construction site. Three FHWA-recognized models: (1) Continuous — inspector present throughout all active construction activities (required for HDD pulls, joint-use surveys, OTDR witnessing); (2) Milestone — inspector present at specific key events (trench bottom before cover, pedestal installation before backfill); (3) Sampling — inspector present for a statistically defined fraction of work activities (appropriate for repetitive work such as burial depth after a consistent pattern is established). The inspection cadence is documented in the quality management plan and on Form 565.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'punch list', source_lesson_id: 'T10.L11' },
    { term: 'inspection segment', source_lesson_id: 'T13.L01' },
    { term: 'QA/QC', source_lesson_id: 'T13.L01' },
    { term: 'RUS Form 565 (Inspector\'s Daily Report)', source_lesson_id: 'T13.L11' },
    { term: 'MSA', source_lesson_id: 'T10.L06' },
    { term: 'proctor density', source_lesson_id: 'T10.L08' },
    { term: 'OTDR', source_lesson_id: 'T12.L07' },
    { term: 'ground resistance threshold (25Ω, NEC §250.56)', source_lesson_id: 'T14.L06' },
    { term: 'MUTCD traffic control', source_lesson_id: 'T10.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L02PreConstructionBaseline() {
  const conferenceItems = [
    { id: 'a', label: 'Verify borrower, contractor, and engineer all present and documented' },
    { id: 'b', label: 'Review acceptance criteria document — confirm all sign-off' },
    { id: 'c', label: 'Confirm wage determination number matches SAM.gov and is posted at site' },
    { id: 'd', label: 'Establish inspection cadence for each phase (continuous HDD, milestone underground, sampling lashing)' },
    { id: 'e', label: 'Confirm OTDR instrument serial number and calibration date logged' },
    { id: 'f', label: 'Review NEPA conditions of approval — all parties acknowledge each condition' },
    { id: 'g', label: 'Establish Form 565 distribution: who gets originals, who gets copies, where archived' },
  ];

  const quizQuestions = [
    {
      id: 'q1',
      question: 'The pre-construction acceptance baseline must be signed by:',
      type: 'multiple-choice',
      options: [
        'The inspector alone — it is the inspector\'s personal quality plan',
        'The borrower and contractor only — the engineer reviews but does not sign',
        'The borrower, contractor, and engineer of record — all three parties',
        'The GFR, since it is a federal loan requirement',
      ],
      correct: 2,
      explanation:
        'RUS Form 515 §3(a) requires a pre-construction conference with the borrower, contractor, and engineer present. The acceptance criteria document that comes from that conference should be signed by all three parties. This three-party agreement is what gives the document legal weight — it cannot later be claimed that one party was not aware of the requirements.',
    },
    {
      id: 'q2',
      question: 'Continuous inspection cadence is REQUIRED for which activity?',
      type: 'multiple-choice',
      options: [
        'Routine lashing of aerial cable — inspector should be present at all times',
        'Underground burial depth checks — inspector must observe every probe reading',
        'OTDR acceptance testing witnessing per 7 CFR §1755.400(b)',
        'Material delivery to the site',
      ],
      correct: 2,
      explanation:
        '7 CFR §1755.400(b) requires the inspector to WITNESS OTDR acceptance testing — "shall witness" language, not optional attendance. HDD pulls and joint-use surveys also require continuous presence. Routine lashing and depth checks may use milestone or sampling cadence once a consistent pattern is established. Material delivery requires inspection but does not require continuous presence.',
    },
    {
      id: 'q3',
      question: 'The constructive acceptance doctrine applies when:',
      type: 'multiple-choice',
      options: [
        'The contractor submits their own quality control reports as a substitute for inspection',
        'The inspector is never present during certain phases of construction, implying the owner accepted the work as-is',
        'The borrower makes a progress payment, which constitutes acceptance of that period\'s work',
        'The engineer approves the shop drawings before installation',
      ],
      correct: 1,
      explanation:
        'Constructive acceptance: if the inspector is never present during a construction phase, the contractor can argue the owner implicitly accepted the work by allowing it to proceed unobserved. This is the legal consequence of failing to maintain the "competent resident inspection at all times" requirement. Progress payments alone do NOT constitute acceptance under RUS contract terms. Proper inspection cadence documentation on Form 565 is the defense against constructive acceptance claims.',
    },
    {
      id: 'q4',
      question: 'A quantified acceptance criterion for burial depth should state:',
      type: 'multiple-choice',
      options: [
        '"Burial depth shall be adequate" — specific numbers should be avoided',
        '"Burial depth shall be per the applicable standard" — reference the standard without a number',
        '"Minimum 36 inches at road crossings, 30 inches in open field, tolerance ±2 inches; measurement by depth probe at 100-foot intervals"',
        '"Burial depth shall match the engineered drawings"',
      ],
      correct: 2,
      explanation:
        'Quantified acceptance criteria must be specific and measurable: the minimum depth for each location type, the tolerance (±2 inches), and the measurement method and frequency. Vague language ("adequate," "per standard") creates disputes because different parties interpret it differently. The inspector needs a number to measure against; "adequate" is not measurable.',
    },
    {
      id: 'q5',
      question: 'Sampling cadence is appropriate for which inspection activity?',
      type: 'multiple-choice',
      options: [
        'Witnessing OTDR test of every fiber',
        'Observing the first entry into a confined-space vault',
        'Lashing pitch verification after a consistent installation pattern is established over multiple spans',
        'Verifying atmospheric testing before vault entry',
      ],
      correct: 2,
      explanation:
        'Sampling cadence is appropriate for high-volume repetitive activities where the contractor has demonstrated consistent performance. After verifying that a crew consistently lashes at the correct pitch over several spans, the inspector may sample (e.g., one in five spans) rather than observe every span. OTDR testing requires continuous witnessing (7 CFR §1755.400(b)). Safety-critical activities (confined space entry, atmospheric testing) require continuous presence — sampling creates unacceptable safety risk.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The most expensive inspection mistake is waiting until after the work is done to figure
          out what "acceptable" means. If you show up after a mile of underground cable is buried
          and THEN try to establish that 36 inches was the required depth, you and the contractor
          will argue. If you established "36-inch minimum, ±2-inch tolerance, measured by depth
          probe at 100-foot intervals" in a signed document before the first shovel moved — there
          is nothing to argue about.
        </p>
        <p>
          This lesson covers everything that must be established BEFORE Day 1 of construction.
          It builds directly on L01's discussion of inspector authority and the six-step
          arrival workflow — you can only execute that workflow effectively if you already
          know what you're measuring against.
        </p>
      </section>

      {/* ── Flashcards ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>Key Terms</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Pre-Construction Conference</h2>
        <p>
          RUS Form 515 §3(a) requires a pre-construction conference before any work begins on
          RUS-financed projects. This is not a formality — it is where all parties formally
          acknowledge their obligations and sign the acceptance criteria document.
        </p>
        <p>
          Required attendees: the borrower (or their designated representative), the contractor's
          project manager, and the engineer of record. The inspector attends and facilitates.
        </p>
        <p>
          Arrange the following conference checklist items into logical order:
        </p>

        <Sortable
          items={conferenceItems}
          prompt="Arrange these pre-construction conference checklist items into a logical order (multiple orderings may be defensible — aim for the most natural sequence):"
        />

        <h3>Quantified Acceptance Criteria</h3>
        <p>
          For each inspectable parameter, the acceptance criteria document must specify:
        </p>
        <ul>
          <li>
            <strong>Burial depth:</strong> Minimum depth by location type (road crossing, easement,
            open field), measurement method (depth probe, GPR), measurement frequency (every 100
            ft or every probe opportunity), and tolerance (±2 inches is typical).
          </li>
          <li>
            <strong>Lashing pitch:</strong> Maximum interval per the project spec (often 36-48
            inches) and measurement method (tape, by count over a span).
          </li>
          <li>
            <strong>Slack storage:</strong> Per the project MSA schedule (per T10.L06) — not
            independently specified by the inspector.
          </li>
          <li>
            <strong>Ground resistance:</strong> Maximum 25Ω per NEC §250.56 (introduced in
            T14.L06). Measurement method: clamp-on or fall-of-potential per IEEE 81.
          </li>
          <li>
            <strong>Optical loss (OTDR):</strong> Per the contract budget — splice max, connector
            max, link budget pass/fail from T12. The inspector witnesses; the fiber techs measure.
          </li>
          <li>
            <strong>Compaction:</strong> Minimum Proctor density per project spec (from T10.L08
            — verify in acceptance criteria document for this project).
          </li>
        </ul>

        <h3>The Three Inspection Cadence Models</h3>
        <p>
          The FHWA Construction Program Management and Inspection Guide (CPMI) describes three
          cadence models. Document which model applies to each construction phase in the quality
          management plan and on Form 565:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Cadence</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>When Inspector Is Present</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Best For</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Risk If Skipped</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Continuous</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>All times during that activity</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>HDD pulls, OTDR witnessing, joint-use survey, first vault entry</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Constructive acceptance; undetected safety violation</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Milestone</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>At specific hold-points (e.g., trench bottom before sand bedding)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Underground trench, pedestal installation, concrete pours</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Buried deficiency that cannot be corrected without rework</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Sampling</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Statistically defined fraction (e.g., 1 in 5 spans)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Lashing pitch (established pattern), depth probing (post-backfill verification)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Systematic deficiency missed across unsampled spans</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>LO-3: Field Technique for Baseline Establishment</h2>
        <p>
          The acceptance criteria document is valuable only if the field measurements it defines
          are actually taken correctly. Before Day 1, the inspector should walk the project route
          with the contractor's foreman to establish shared understanding of measurement methods:
        </p>
        <ul>
          <li>
            <strong>Depth probe technique:</strong> Probe is inserted at 90° to the cable run,
            not angled. Record the depth to the top of the conduit/cable — not to the bottom.
            At road crossings, probe from the existing finished surface. Document probe location
            by station reference or GPS.
          </li>
          <li>
            <strong>Lashing pitch:</strong> Use a tape measure along the strand, counting lashing
            wraps over a 10-foot span. Divide 10 feet by the number of wraps to get average
            pitch. Record on Form 565 as "10 wraps over 37 ft = 3.7-inch pitch" — do not
            just record "passes."
          </li>
          <li>
            <strong>OTDR witnessing pre-test:</strong> Before the contractor begins testing,
            confirm OTDR calibration label is current (annual per Telcordia GR-196-CORE), log
            the instrument serial number on Form 565, and observe the launch fiber reference
            check. These are covered in L07 but must be established at the pre-construction
            conference as requirements.
          </li>
        </ul>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
