// T13.L08 — Joint-Use and Clearance Compliance
// NESC Rule 232; 47 CFR §32.2411 (Poles) — NOT §32.2420; T05.L02 vocabulary_assumed
// H-04: §32.2411 not §32.2420; C-14: corrected

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T13.L08',
  course_id: 'T13',
  title: 'Joint-Use and Clearance Compliance',
  order: 10,
  lesson_type: 'technical',
  prerequisites: ['T13.L07', 'T05.L02'],
  learning_objectives: [
    'State the correct 47 CFR Part 32 plant account for poles (§32.2411) and distinguish it from the parent cable-and-wire category (§32.2420)',
    'Apply NESC Rule 232 clearance requirements to a clearance measurement scenario',
    'Record a compliant joint-use clearance verification log entry on Form 565',
    'Identify the required content of a clearance verification log submitted as part of the Form 219 package',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    '47 CFR §32.2411 (Poles)',
    'joint-use inspection record',
    'clearance verification log',
  ],
  key_terms: [
    {
      term: '47 CFR §32.2411 (Poles)',
      definition:
        'The FCC Part 32 plant account that covers poles — the physical wooden or concrete structures. Under 47 CFR Part 32 (Uniform System of Accounts for telecommunications carriers), pole investment and maintenance are recorded under Account 2411 (Poles). This is distinct from §32.2420, which is the parent account category "Cable and Wire Facilities" — §32.2420 covers cables and wires, not poles. When recording joint-use pole inspections in carrier accounting records, cite §32.2411 (Poles). Do not confuse with §32.2410 (Cable and wire), §32.2411 (Poles), or §32.2420 (parent "Cable and wire facilities" umbrella). For pole-attachment inspection records on RUS-financed projects, the relevant account is §32.2411.',
    },
    {
      term: 'joint-use inspection record',
      definition:
        'The formal documentation of an inspection of a jointly-used utility pole, confirming NESC Rule 232 clearance compliance between the communication utility\'s attachment and all other attachments (supply conductors, streetlights, guy wires). Required before and after any modification to the communication attachment. Includes: pole number, GPS location, date of inspection, measured vertical clearance to nearest supply conductor, whether the clearance meets the NESC minimum for the applicable voltage and loading district, inspector name and credentials, and any deficiencies noted.',
    },
    {
      term: 'clearance verification log',
      definition:
        'The project-level log compiled from individual joint-use inspection records, covering all poles where the communication cable runs in the joint-use space. At close-out, the clearance verification log demonstrates to the pole owner and the RUS that all attachments comply with NESC Rule 232 clearance minimums. The log is part of the Form 219 close-out package for aerial projects with joint-use poles. Format: one row per pole, columns for pole ID, GPS, measured clearance, NESC minimum for that location, pass/fail, and date.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'NESC (National Electrical Safety Code)', source_lesson_id: 'T05.L02' },
    { term: 'loading district', source_lesson_id: 'T05.L02' },
    { term: 'RUS Form 565 (Inspector\'s Daily Report)', source_lesson_id: 'T13.L11' },
    { term: 'pre-construction acceptance baseline', source_lesson_id: 'T13.L02' },
    { term: 'acceptance criteria document', source_lesson_id: 'T13.L02' },
    { term: 'MAD, MAB', source_lesson_id: 'T18.L07' },
    { term: 'Form 219 certification scope', source_lesson_id: 'T13.L07' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L08JointUseCompliance() {
  const clearanceWorked = {
    title: 'NESC Rule 232 Clearance Check — Worked Example',
    description:
      'You are verifying clearance between a new OSP fiber cable and the nearest power company supply conductor on a joint-use pole in Macon, GA (NESC Light loading district). The supply conductor operates at 12.47 kV phase-to-phase (7.2 kV to neutral). Your fiber cable is attached at the communication worker safety zone.',
    variables: [
      { symbol: 'V_line', name: 'Line voltage (phase-to-phase)', value: '12,470', unit: 'V' },
      { symbol: 'V_neutral', name: 'Voltage to neutral (12,470 / √3)', value: '7,200', unit: 'V (approx)' },
      { symbol: 'D_NESC_min', name: 'NESC Rule 232C minimum separation, Light loading district, 0–15 kV', value: '40', unit: 'inches' },
    ],
    steps: [
      {
        label: 'Step 1: Determine voltage class',
        content: 'The supply line is 12.47 kV phase-to-phase, which is 7.2 kV to neutral. NESC Rule 232C vertical clearance requirements in the joint-use zone are typically referenced to phase-to-ground voltage for grounded systems. 7.2 kV falls in the 0–15 kV range.',
      },
      {
        label: 'Step 2: Apply NESC Table 232-1 for Light loading district',
        content: 'For Light loading district (Macon, GA falls in Light per NESC Map 1), Rule 232C specifies minimum vertical separation in the joint-use zone. For 0–15 kV phase-to-ground, the minimum clearance is 40 inches (3 feet 4 inches). NOTE: verify the exact Rule 232C value in the current edition of NESC at publication time — specific values may differ by edition. [confirm NESC edition]',
      },
      {
        label: 'Step 3: Measure actual clearance',
        content: 'Using a non-conductive fiberglass measuring rod (NEVER a metal tape near energized conductors per 29 CFR 1910.268(b)(20)), measure the vertical distance from the center of the supply conductor to the center of the communication cable at the point of closest approach. Example: measured clearance = 46 inches.',
      },
      {
        label: 'Step 4: Compare to minimum',
        content: '46 inches measured vs. 40 inches required (Rule 232C, Light district, 0–15 kV). 46 > 40 → PASS. Record on Form 565 and clearance verification log.',
      },
    ],
    sanityCheck: '46 inches is 6 inches above the minimum — a comfortable margin. Under-sag of the supply conductor (after ice loading) could reduce this margin. If the measured clearance is within 6 inches of the minimum under warm-weather conditions, flag for engineering review — ice-load sag may reduce clearance below minimum in winter.',
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: '47 CFR §32.2411 covers:',
      type: 'multiple-choice',
      options: [
        'Cable and wire facilities (parent category)',
        'Poles — the physical utility poles on which attachments are made',
        'Conduit systems',
        'All telecommunications plant in the outside plant',
      ],
      correct: 1,
      explanation:
        '47 CFR §32.2411 = Poles. This is the FCC Part 32 plant account for the physical wooden or concrete structures. §32.2420 is the PARENT account category "Cable and wire facilities" — it covers cables, not poles. When recording pole-attachment inspection records in FCC Part 32 accounting, the applicable account is §32.2411. Confusing §32.2411 (Poles) with §32.2420 (Cable and wire parent) is a common cascade error — always cite §32.2411 for pole-specific records.',
    },
    {
      id: 'q2',
      question: 'The loading district for Macon, GA under the NESC is:',
      type: 'multiple-choice',
      options: [
        'Heavy loading district',
        'Medium loading district',
        'Light loading district',
        'Extreme wind exposure zone',
      ],
      correct: 2,
      explanation:
        'Macon, GA falls in the NESC Light loading district per NESC Map 1 (southeastern United States). Light loading district applies to areas with moderate ice and wind loading compared to Heavy (northern states) and Medium (transition zones). The loading district determines NESC mechanical requirements for pole loading and clearances.',
    },
    {
      id: 'q3',
      question: 'A clearance verification log must include which field for each pole inspected?',
      type: 'multiple-choice',
      options: [
        'Pole age and wood species',
        'Pole ID, GPS coordinates, measured clearance, NESC minimum, pass/fail, inspection date',
        'Supply company account number and tariff rate',
        'Inspector\'s OSHA certification number',
      ],
      correct: 1,
      explanation:
        'The clearance verification log is the evidentiary basis for Form 219 certification that all aerial attachments comply with NESC Rule 232. Required fields: pole ID (owner number and project ID), GPS coordinates, date of inspection, measured clearance (inches), NESC minimum for this location (Rule 232 value based on voltage class and loading district), pass/fail verdict, and inspector name. Without all these fields, the log cannot be audited by the pole owner, RUS, or NESC compliance authority.',
    },
    {
      id: 'q4',
      question: 'Measuring clearance near energized supply conductors requires:',
      type: 'multiple-choice',
      options: [
        'Metal tape for accuracy, measured from outside the NESC clearance zone',
        'Non-conductive measuring tools only — fiberglass rod, wood stick, or laser distance meter',
        'No measurement — visual estimation is sufficient for NESC compliance verification',
        'Any tool, provided the inspector is wearing Class 0 rubber gloves',
      ],
      correct: 1,
      explanation:
        'Non-conductive tools required (29 CFR 1910.268(b)(20)) — covered in L03. Metal tapes conduct electricity and create electrocution risk within the MAD of energized supply conductors (from T18.L07). Fiberglass measuring rods, wooden sticks, or non-contact laser distance meters are the compliant options. Visual estimation is not acceptable for compliance documentation — a measured value must be recorded.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Joint-use poles carry both power conductors (the power company's equipment) and
          communication cables (your fiber). The NESC (National Electrical Safety Code) sets
          minimum vertical separation between these two to protect workers and prevent arcing.
          The inspector's job is to measure whether that separation exists and document it.
        </p>
        <p>
          There are also accounting records involved — specifically the FCC Part 32 plant
          accounts that carriers use for pole investment reporting. Knowing the correct account
          number (§32.2411 for Poles, NOT §32.2420) means your records will survive a carrier
          audit.
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
        <h2>NESC Rule 232 Clearance Verification — Worked Example</h2>
        <WorkedExample example={clearanceWorked} />

        <h3>The 47 CFR Part 32 Account Structure — Avoiding the Cascade Error</h3>
        <p>
          The FCC Part 32 accounts are hierarchical. Understanding the hierarchy prevents
          the common error of citing the wrong level:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Account</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Covers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>§32.2411</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Poles</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Physical poles — use this for pole attachment inspection records</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>§32.2410</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Cable and wire facilities</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Cable plant — use for cable/wire records</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>§32.2420</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Cable and wire facilities (parent)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>PARENT category for cable/wire group — NOT poles</td>
            </tr>
          </tbody>
        </table>
        <p>
          The cascade error: citing §32.2420 (parent "Cable and wire facilities") for a
          pole inspection record. §32.2420 is for cable and wire, not poles. The correct
          account for poles is always §32.2411.
        </p>
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Joint-Use Clearance Compliance at Form 219 Close-Out</h2>
        <p>
          The clearance verification log becomes a Form 219 close-out component on any aerial
          project with joint-use poles. Before Form 219 is signed, confirm:
        </p>
        <ol>
          <li>A clearance inspection was conducted at all poles where the communication attachment was installed or modified.</li>
          <li>All measured clearances meet or exceed NESC Rule 232 minimums for the applicable loading district and voltage class.</li>
          <li>Any poles with marginal clearance (within 6 inches of minimum at warm-weather conditions) are flagged for engineering review of ice-load reduction.</li>
          <li>Deficient poles have punch-list entries with resolution documentation (re-attachment at correct height, supply company modified their attachment, etc.).</li>
          <li>The clearance log includes all required fields and is signed by the inspector.</li>
        </ol>
        <p>
          <strong>Book vs. Field Practice:</strong> On small rural projects with only
          communication-only poles (no joint-use), a clearance verification log is technically
          not required for power-company clearances. However, NESC Rule 232 still applies to
          guy wire clearances and crossing clearances from communication plant. In practice,
          many RUS engineers require a clearance attestation statement even on single-owner
          communication-only pole lines. When in doubt, document it.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
