// T12.L11 — End-Face Inspection: IEC 61300-3-35
// Working lesson: zone map (2022 Ed.3 corrected), CIC sequence, IPC, Grade A/B/C/D criteria
// Source: IEC 61300-3-35:2022 Ed.3 | TIA-455-57B | VIAVI inspection reference | Fluke Networks KB
// R-2 correction X-1 applied: Zone B = 110 µm (NOT 120 µm); Zones C/D informational only in 2022 ed.

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L11',
  course_id: 'T12',
  title: 'End-Face Inspection — IEC 61300-3-35',
  order: 11,
  lesson_type: 'working',
  prerequisites: ['T12.L01', 'T12.L08'],
  learning_objectives: [
    'Identify the four connector end-face inspection zones per IEC 61300-3-35:2022',
    'State the Zone A and Zone B outer boundary dimensions (2022 Edition 3)',
    'Apply the IEC Grade A acceptance criteria to a described connector defect',
    'Execute the CIC (Clean-Inspect-Clean) sequence in the correct order',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'IEC 61300-3-35 zone map',
    'CIC (Clean-Inspect-Clean) sequence',
    'video inspection probe (VIP)',
    'end-face contamination',
  ],
  vocabulary_assumed: [
    { term: 'OLTS', source_lesson_id: 'T12.L01' },
    { term: 'OTDR', source_lesson_id: 'T12.L01' },
    { term: 'reflection event', source_lesson_id: 'T12.L08' },
  ],
  key_terms: [
    {
      term: 'IEC 61300-3-35 zone map',
      definition:
        'The four concentric inspection zones defined in IEC 61300-3-35 (Fiber Optic Interconnecting Devices and Passive Components — End-face Inspection) for evaluating connector end-face cleanliness and quality. Zone A: core area (0–25 µm diameter). Zone B: cladding area (25–110 µm outer boundary in the 2022 Edition 3). Zones C and D are defined in the standard but were removed from mandatory pass/fail criteria in the 2022 Edition 3 — they are informational only for the current standard. Only Zones A and B are mandatory inspection zones in IEC 61300-3-35:2022.',
    },
    {
      term: 'CIC (Clean-Inspect-Clean) sequence',
      definition:
        'The correct sequence for preparing a fiber optic connector for mating or testing: (1) CLEAN the end-face with appropriate tooling (dry wipe or wet + dry wipe), (2) INSPECT with a video inspection probe (VIP) to verify the end-face meets cleanliness criteria, (3) if the inspection passes, CLEAN once more with a dry wipe immediately before mating. If the inspection fails, clean again and re-inspect. Never mate a connector without a post-inspection dry wipe. Never inspect with a connector already mated to a live source without proper eye protection.',
    },
    {
      term: 'video inspection probe (VIP)',
      definition:
        'A calibrated fiber optic microscope (usually digital with 200× or 400× magnification) used to image the connector end-face. Modern VIPs include automated zone-based pass/fail analysis against IEC 61300-3-35 criteria. Can inspect connectors without unmating (through-adapter probes) or after disconnection. Required for compliant end-face inspection per TIA-455-57B and IEC 61300-3-35.',
    },
    {
      term: 'end-face contamination',
      definition:
        'Foreign material on the connector end-face — typically oils (from bare hands), dust, cleaning solvent residue, or debris from mating with a contaminated adapter. End-face contamination is the leading cause of high connector loss and high reflectance on singlemode links. Contaminated connectors can also transfer contamination to the far-end connector during mating, potentially burning the material into the end-face under high optical power.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L11_EndFaceInspection() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Why Connector End-Faces Matter — and How to Look at Them Properly</h2>

        <p>
          Every fiber optic connector has a precision-polished end-face — the flat or slightly
          convex surface where the fiber core meets the outside world. When two connectors mate,
          their end-faces are pressed together (or nearly so), and light transfers from one core
          to the other across that contact.
        </p>
        <p>
          The fiber core is 9 µm in diameter for singlemode fiber — about one-tenth the diameter
          of a human hair. A single dust particle, oil smear, or scratch in the wrong location can
          block, scatter, or reflect a significant fraction of the light trying to pass through.
          This causes higher connection loss AND higher reflectance — both are problems for the link
          budget and for the OTDR trace quality.
        </p>
        <p>
          The internationally standardized method for evaluating connector end-faces is
          <strong> IEC 61300-3-35</strong>. The 2022 Edition 3 of this standard defines inspection
          zones, cleanliness criteria, and pass/fail rules. Understanding this standard is
          essential for splice crews, test technicians, and project engineers reviewing
          acceptance test results.
        </p>

        <h3>The IEC 61300-3-35:2022 zone map</h3>

        <AnnotatedDiagram
          imageUrl="/diagrams/T12/iec-61300-3-35-zones.svg"
          alt="IEC 61300-3-35 connector end-face zone diagram showing Zone A (core, 0-25 µm), Zone B (cladding, 25-110 µm), and informational Zones C and D"
          annotations={[
            { x: 50, y: 50, label: 'Zone A (core)', description: '0 to 25 µm diameter — the fiber core + immediate surrounding area. Any defect here causes direct light path obstruction. Strictest criteria apply. Must be completely free of contamination and most defect types for Grade A.' },
            { x: 50, y: 70, label: 'Zone B (cladding)', description: '25 to 110 µm outer boundary (IEC 61300-3-35:2022 Ed.3). The cladding area surrounding the core. Contamination here can still cause loss if material migrates to the core during mating. Mandatory inspection zone.' },
            { x: 50, y: 82, label: 'Zones C/D (informational)', description: 'Outer ferrule areas. Removed from mandatory pass/fail criteria in the 2022 Edition 3. Present in the zone map for reference but not part of the pass/fail determination under the current standard.' },
          ]}
        />

        <p>
          <strong>Important edition note:</strong> Earlier editions (pre-2022) included Zone C
          and Zone D in mandatory pass/fail criteria and defined Zone B outer boundary as
          120 µm (some references) or 125 µm (full cladding). The current 2022 Edition 3 defines:
        </p>
        <ul>
          <li>Zone A: 0–25 µm (core area)</li>
          <li>Zone B: 25–110 µm (cladding, 2022 Edition 3 boundary)</li>
          <li>Zones C/D: informational only — not mandatory pass/fail criteria</li>
        </ul>
        <p>
          When reviewing inspection reports, verify which edition of IEC 61300-3-35 was used.
          An older Grade A report using the pre-2022 Zone B = 120 µm boundary was evaluated against
          slightly different criteria.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>IEC Grade A, B, C, D Acceptance Criteria</h2>

        <p>
          IEC 61300-3-35 defines four grade levels — A through D — representing decreasing levels
          of end-face cleanliness. For acceptance testing of OSP links, <strong>Grade A</strong>
          is the target for Zone A and Zone B:
        </p>

        <table>
          <thead>
            <tr>
              <th>Grade</th>
              <th>Zone A (core, 0–25 µm)</th>
              <th>Zone B (cladding, 25–110 µm)</th>
              <th>Typical application</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>A</strong></td>
              <td>No defects or contamination</td>
              <td>No contamination; scratches ≤ 2 µm wide allowed if no pits</td>
              <td>Single-mode OSP, OTDR acceptance, high-power systems</td>
            </tr>
            <tr>
              <td><strong>B</strong></td>
              <td>No pits; scratches ≤ 3 µm wide; limited contamination</td>
              <td>Scratches ≤ 5 µm wide; limited contamination</td>
              <td>Low-loss singlemode links; less critical connections</td>
            </tr>
            <tr>
              <td><strong>C</strong></td>
              <td>Minor defects allowed</td>
              <td>More relaxed criteria</td>
              <td>Multimode premises links</td>
            </tr>
            <tr>
              <td><strong>D</strong></td>
              <td>Fails — significant defects present</td>
              <td>—</td>
              <td>Clean/replace required</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Common defect types seen on end-face inspection:</strong>
        </p>
        <ul>
          <li><strong>Contamination (dust/oil):</strong> appears as bright spots or smears under VIP illumination. Most common. Clean and re-inspect.</li>
          <li><strong>Scratches:</strong> linear grooves across the end-face. Caused by incorrect dry cleaning technique. May require professional re-polishing if in Zone A.</li>
          <li><strong>Pits/chips:</strong> concave indentations in the glass. Often caused by mating with a contaminated connector that burned a particle into the surface under high power. Cannot be cleaned — connector must be replaced.</li>
          <li><strong>Cracks:</strong> fractures in the glass. Replace connector immediately — cracks propagate and the fiber end-face integrity is compromised.</li>
        </ul>

        <h3>The CIC sequence — Clean-Inspect-Clean</h3>
        <p>
          The standardized end-face preparation protocol per TIA-455-57B and IEC 61300-3-35:
        </p>
        <ol>
          <li>
            <strong>Clean:</strong> Use a dry wipe or wet-then-dry clean (IPA + dry wipe). One stroke per direction; never drag contamination back across the core. Use appropriate tooling for the connector type (LC, SC, MPO, etc.).
          </li>
          <li>
            <strong>Inspect:</strong> Use a VIP (video inspection probe). View the entire core and cladding. Apply IEC zone-based pass/fail criteria. If contamination or defects are visible in Zone A or B → clean again and re-inspect.
          </li>
          <li>
            <strong>Clean (once more):</strong> Immediately before mating, perform one final dry-wipe to remove any particles deposited during inspection. Do NOT inspect again after the final clean (re-inspection risks re-contamination). Mate immediately.
          </li>
        </ol>
        <p>
          <strong>Never skip the final clean before mating.</strong> Inspection can deposit tiny particles. The final dry-wipe before mating removes them. This is the most commonly skipped step in the field.
        </p>

        <p>
          <strong>Eye safety:</strong> NEVER look directly into a fiber end-face or connector — even a "low-power" source (LED, VCSEL, laser diode) can cause irreversible retinal damage. Always check whether any source is connected before inspecting with a VIP that requires looking through the eyepiece. Modern digital VIPs (with a screen, not a direct eyepiece) are inherently eye-safe.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: Through-Adapter Inspection and Dirty Adapter Contamination</h2>
        <p>
          Through-adapter inspection probes allow VIP inspection of a connector without demating it
          from the adapter. The probe tip inserts into the adapter's opposite port and images the
          mated connector from the far side. This is useful for patch panels where removing
          connectors repeatedly risks wear, but comes with a risk: the adapter sleeve inside
          the port may have contamination that transfers to the connector during inspection.
        </p>
        <p>
          Adapters with ceramic alignment sleeves accumulate contamination over time — each mating
          cycle deposits small amounts of ceramic dust and connector end-face debris. For high-stakes
          connections (OTDR reference cords, precision measurement setups), inspect and clean the
          adapter sleeve separately before inserting the connector. A dirty adapter defeats the
          CIC sequence even if the connector itself is clean.
        </p>
        <p>
          Standard practice on RUS aerial builds: inspect every connector before mating at the
          splice enclosure, at the ODF (Optical Distribution Frame), and at the FDH (Fiber Distribution
          Hub). Inspection records (pass/fail grade + photo from VIP display) become part of the
          acceptance package.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L11-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'Per IEC 61300-3-35:2022 Edition 3, what is the outer boundary of Zone B (the cladding zone)?',
              options: [
                { id: 'a', text: '125 µm — the full cladding diameter of standard singlemode fiber' },
                { id: 'b', text: '120 µm — the previous edition boundary' },
                { id: 'c', text: '110 µm — the 2022 Edition 3 Zone B outer boundary' },
                { id: 'd', text: '50 µm — the Zone A outer boundary, also called the cladding zone' },
              ],
              correct: 'c',
              explanation: 'IEC 61300-3-35:2022 Edition 3 defines Zone B as the cladding area from 25 µm to 110 µm. The 120 µm boundary is from a previous edition. Zone A is the core area (0–25 µm). Zones C and D (outer areas) are informational only in the 2022 edition.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'During the CIC sequence, when should the final dry-wipe occur?',
              options: [
                { id: 'a', text: 'Before the inspection step — clean, then inspect, then mate immediately' },
                { id: 'b', text: 'After the inspection step passes, immediately before mating — Clean → Inspect → (pass) → Clean → Mate' },
                { id: 'c', text: 'Only if the inspection step fails — if it passes on the first try, skip the second clean' },
                { id: 'd', text: 'After mating — clean the adapter port from the outside' },
              ],
              correct: 'b',
              explanation: 'The CIC sequence is: Clean → Inspect → (if pass) → Clean → Mate. The final clean step happens AFTER a passing inspection and immediately BEFORE mating. Its purpose is to remove any particles deposited during the inspection process. Skipping the final clean is the most common CIC protocol error in the field.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'A VIP inspection shows a pit (concave indentation) in Zone A of a SC/APC connector. What is the correct action?',
              options: [
                { id: 'a', text: 'Clean the connector with IPA and a dry wipe, then re-inspect — pits are cleaned like contamination' },
                { id: 'b', text: 'Accept the connector — pits in Zone A are allowed under Grade B and Grade A criteria' },
                { id: 'c', text: 'Replace the connector — pits are permanent physical damage to the glass that cannot be cleaned' },
                { id: 'd', text: 'Rotate the connector 90° in the adapter — pits only cause problems when aligned directly with the mating connector core' },
              ],
              correct: 'c',
              explanation: 'A pit or chip in the fiber end-face is permanent physical damage to the glass — it cannot be removed by cleaning. Grade A criteria for Zone A specify no pits. The connector must be replaced (or returned to a re-polishing shop if it is a field-installable type). Contamination (dust, oil) is cleaned; physical damage (pits, cracks, deep scratches) requires replacement.',
            },
          ]}
        />
      </section>

      {/* ── FLASHCARDS ── */}
      <section data-tier="flashcards">
        <h2>Key Terms</h2>
        {meta.key_terms.map((kt) => (
          <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
        ))}
      </section>

    </LessonLayout>
  );
}
