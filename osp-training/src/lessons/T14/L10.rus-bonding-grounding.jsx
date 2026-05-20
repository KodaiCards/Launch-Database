// T14.L10 — RUS Bonding and Grounding Requirements
// Advanced lesson: RUS bonding schedule, ground test log, Form 219 close-out

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L10',
  course_id: 'T14',
  title: 'RUS Bonding and Grounding Requirements',
  order: 10,
  lesson_type: 'advanced',
  prerequisites: ['T14.L06', 'T14.L03'],
  vocabulary_introduced: [
    'aerial plant bonding schedule',
    'ground test log',
  ],
  key_terms: [
    {
      term: 'aerial plant bonding schedule',
      definition:
        'A documentation artifact (typically included in the RUS-funded project close-out package) that lists each grounding electrode on the aerial plant route: pole ID, electrode type, downlead conductor size, and measured ground resistance. The bonding schedule maps to the design drawings so the RUS inspector can verify that every required electrode was installed, tested, and passes the acceptance threshold.',
    },
    {
      term: 'ground test log',
      definition:
        'The field record of ground resistance measurements for each electrode on the project. Minimum fields: electrode ID (pole number or location), electrode type (rod, ring, Ufer), measured resistance (Ω), acceptance threshold (25 Ω for aerial poles; 5 Ω for FDH/CO), pass/fail determination, test date, test method (fall-of-potential per IEEE 81-2012), and retest due date for any failed electrodes. Required for RUS project close-out per the applicable RUS bulletin.',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'bonding', source_lesson_id: 'T14.L01' },
    { term: 'fall-of-potential', source_lesson_id: 'T14.L06' },
    { term: '62% rule', source_lesson_id: 'T14.L06' },
    { term: 'ground rod', source_lesson_id: 'T14.L04' },
    { term: 'supplemental electrode', source_lesson_id: 'T14.L04' },
    { term: 'messenger bond', source_lesson_id: 'T14.L03' },
    { term: 'downlead', source_lesson_id: 'T14.L03' },
    { term: 'GES', source_lesson_id: 'T01.L08' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
  ],
  learning_objectives: [
    'Apply the RUS bonding schedule requirements to an aerial plant segment',
    'Complete a RUS-format ground test log record for each electrode including failed electrodes',
    'Distinguish the NEC 25 Ω threshold from the GR-1275 5 Ω threshold and know when each applies on RUS jobs',
    'Describe what RUS Form 219 close-out documentation requires for the grounding section',
  ],
  estimated_minutes: 25,
};

export default function T14L10_RUSBondingGrounding() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've installed the grounding system — bond clamps, downleads, rods — per the NESC
          and NEC requirements covered in earlier lessons. Now you have to prove you did it.
          On a RUS-funded project, "prove it" means tested, measured, logged, and documented
          in a format the RUS inspector expects.
        </p>
        <p className="mt-2">
          RUS grounding documentation is part of the project close-out package. The inspector
          doesn't just want to see that rods were driven — they want the measured resistance
          for each rod, compared against the acceptance threshold, with a pass/fail
          determination. If a rod failed, they want to see the remediation (supplemental rod
          added) and the re-test result.
        </p>
        <p className="mt-2">
          This lesson covers the RUS bonding schedule, the ground test log format, and what
          the Form 219 close-out section expects.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L06 Ground Resistance Testing</strong> — IEEE 81 test method measures and verifies electrode resistance. <strong>T14.L05 GES</strong> — you design and install a grounding electrode system. This lesson explains how RUS captures that design and test data: the bonding schedule (what equipment bonds where) and ground test log (what resistance was measured + when).
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Relevance here</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service (USDA)</td>
              <td className="px-3 py-2">The federal lender/grantor requiring project documentation including bonding schedule + ground test log</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FDH</td>
              <td className="px-3 py-2">Fiber Distribution Hub</td>
              <td className="px-3 py-2">Field cabinet housing splitters, OLTs, or patch panels; uses the 5 Ω GR-1275 threshold, not 25 Ω</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GR-1275</td>
              <td className="px-3 py-2">Telcordia GR-1275</td>
              <td className="px-3 py-2">Industry guideline (not a regulation) for CO/FDH ground resistance — ≤5 Ω acceptance threshold [confirm edition]</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-4">
          <p className="text-sm text-slate-300 font-semibold mb-2">Quick refresher:</p>
          <ul className="text-sm space-y-1 text-slate-300/90">
            <li><strong>Grounding:</strong> Installing electrodes (ground rods) and measuring their resistance to earth per NEC §250.56 (≤25Ω) and RUS requirements. From T14.L01.</li>
            <li><strong>Ground resistance testing:</strong> The IEEE 81 fall-of-potential method to verify each installed electrode meets the 25 Ω threshold. From T14.L06.</li>
            <li><strong>Bonding:</strong> Connecting the messenger downlead to the ground rod at each pole to keep everything at the same potential. From T14.L03.</li>
            <li><strong>NESC Rule 96:</strong> The requirements for bonding intervals and downlead protection on aerial plant. From T14.L03.</li>
          </ul>
        </div>

        <h3 className="mt-6 font-semibold">The RUS bonding schedule — what it captures</h3>
        <p className="mt-2">
          The aerial plant bonding schedule is a table in the project close-out documentation
          that maps each grounding point on the route to its measured performance. Each row
          represents one electrode installation. Required columns:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Column</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Example</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Pole / Location ID</td>
              <td className="px-3 py-2">Utility pole number or GPS coordinates from the design drawings</td>
              <td className="px-3 py-2">Pole 4471, Hwy 42 N</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Electrode type</td>
              <td className="px-3 py-2">Rod (NEC §250.52(A)(5)), Ring, or Ufer</td>
              <td className="px-3 py-2">5/8 × 8-ft Cu-clad rod</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Downlead size</td>
              <td className="px-3 py-2">AWG conductor from bond clamp to rod</td>
              <td className="px-3 py-2">#6 AWG bare Cu</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Measured resistance</td>
              <td className="px-3 py-2">Fall-of-potential result in ohms (IEEE 81-2012 §9.3 method)</td>
              <td className="px-3 py-2">18 Ω</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Threshold</td>
              <td className="px-3 py-2">Applicable acceptance threshold — 25 Ω for aerial pole; 5 Ω for FDH/CO</td>
              <td className="px-3 py-2">25 Ω (aerial)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Pass / Fail</td>
              <td className="px-3 py-2">Comparison to threshold</td>
              <td className="px-3 py-2">PASS</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Remediation</td>
              <td className="px-3 py-2">Action if failed (supplemental rod, bentonite backfill, ring electrode)</td>
              <td className="px-3 py-2">N/A (passed)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Retest result</td>
              <td className="px-3 py-2">Post-remediation measurement if failed originally</td>
              <td className="px-3 py-2">N/A</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Test date</td>
              <td className="px-3 py-2">Date of measurement</td>
              <td className="px-3 py-2">2026-05-14</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 font-semibold">Which threshold applies where — the most common inspection failure</h3>
        <p className="mt-2">
          Applying the wrong threshold is the most common grounding documentation error on RUS
          close-outs. The rule:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>
            <strong>≤25 Ω (NEC §250.56):</strong> Applies to all aerial pole ground rods and
            general OSP grounding where no sensitive electronics are housed. If a single rod
            reads ≤25 Ω, it passes. If &gt;25 Ω, add a supplemental rod.
          </li>
          <li>
            <strong>≤5 Ω (Telcordia GR-1275 §5 [confirm edition]):</strong> Applies to FDH
            cabinets, headend buildings, CO facilities, and any enclosure housing electronic
            telecommunications equipment. This is NOT an NEC requirement — it is an industry
            guideline that the equipment manufacturer's warranty and the RUS engineer typically
            specify. A 6 Ω reading at an FDH site FAILS even though it would pass an aerial pole.
          </li>
        </ul>
        <p className="mt-2">
          <em>
            Book vs. field note: Crews sometimes test every electrode against the 25 Ω threshold
            because that's the only number they've memorized. When the RUS inspector opens the
            close-out package and sees a 7 Ω reading at the FDH cabinet logged as "PASS (≤25 Ω),"
            they will flag it. Know your site types and apply the correct threshold.
          </em>
        </p>
      </section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-6">
        <WorkedExample
          title="Complete a Ground Test Log for a 3-Electrode Route Segment"
          description="A 1-mile aerial segment has three electrodes: a splice-closure pole, a mid-run pole, and an FDH cabinet. Complete the pass/fail determination for each."
          variables={[
            { key: 'r1', label: 'Electrode 1 (splice pole) resistance', units: 'Ω', default: 18, min: 1, max: 200, step: 1 },
            { key: 'r2', label: 'Electrode 2 (mid-run pole) resistance', units: 'Ω', default: 28, min: 1, max: 200, step: 1 },
            { key: 'r3', label: 'Electrode 3 (FDH cabinet) resistance', units: 'Ω', default: 7, min: 1, max: 200, step: 1 },
          ]}
          formula={(v) => {
            // Count how many pass their respective thresholds
            const e1Pass = v.r1 <= 25;
            const e2Pass = v.r2 <= 25;
            const e3Pass = v.r3 <= 5;
            return e1Pass && e2Pass && e3Pass ? 1 : 0;
          }}
          steps={(v) => {
            const e1 = v.r1 <= 25 ? 'PASS' : 'FAIL — add supplemental rod';
            const e2 = v.r2 <= 25 ? 'PASS' : 'FAIL — add supplemental rod (≥8 ft spacing)';
            const e3 = v.r3 <= 5 ? 'PASS' : 'FAIL — add supplemental rod or ring electrode (GR-1275 5 Ω threshold for FDH)';
            return [
              { expression: `Electrode 1 (splice pole): ${v.r1} Ω vs. 25 Ω NEC threshold → ${e1}`, value: null },
              { expression: `Electrode 2 (mid-run pole): ${v.r2} Ω vs. 25 Ω NEC threshold → ${e2}`, value: null },
              { expression: `Electrode 3 (FDH cabinet): ${v.r3} Ω vs. 5 Ω GR-1275 threshold → ${e3}`, value: null },
            ];
          }}
          sanityCheck={(result, v) =>
            result === 1
              ? `All three electrodes pass their respective thresholds (${v.r1} Ω, ${v.r2} Ω, ${v.r3} Ω). Close-out documentation can be completed without remediation.`
              : `At least one electrode failed. Log the failed electrode with its measured value, the applicable threshold, "FAIL" in the pass/fail column, and the planned remediation. After remediation, re-test and log the new result. The close-out package cannot be submitted until all electrodes show PASS.`
          }
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h3 className="mt-6 font-semibold">Form 219 close-out — the grounding section</h3>
        <p className="mt-2">
          RUS Form 219 is the standard engineer's certification of completed construction used
          on RUS-funded telecom projects. The grounding section of Form 219 (or equivalent
          close-out documentation per the applicable RUS bulletin) requires the engineer of
          record to certify:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>That grounding was installed per the design drawings and the applicable RUS bulletin (1751F-630 §7 for aerial, 1751F-635 §5 for underground; or per 1751F-810 / 1751F-815 if applicable [confirm current RUS bulletin for bonding/grounding]).</li>
          <li>That ground resistance was tested using the fall-of-potential method per IEEE 81-2012.</li>
          <li>That all electrodes achieved the applicable acceptance threshold, or that failed electrodes were remediated and re-tested to pass.</li>
          <li>The ground test log (all results, dates, methods, pass/fail) is attached.</li>
        </ul>
        <p className="mt-2">
          The engineer's signature on Form 219 certifies the grounding data is accurate. Do
          not sign off on a close-out package with an incomplete or falsified ground test log —
          that is both a regulatory violation and professional liability exposure.
        </p>
        <p className="mt-2">
          <em>
            Note on RUS 1751F-815: The brief research for this topic identified "RUS 1751F-815"
            as a potentially relevant bulletin covering bonding and grounding for communication
            facilities. The existence and current section numbers of 1751F-815 as a discrete
            bulletin have NOT been independently verified in preparing this lesson. Before
            citing 1751F-815 section numbers on a live project, verify the bulletin index at
            the USDA/RUS publication catalog. Fallback anchors confirmed available: RUS
            1751F-630 §7 (aerial plant grounding) and RUS 1751F-635 §5 (underground plant
            grounding) and RUS 1751F-810 (electrical protection of communication facilities).
            [Confirm 1751F-815 section numbers from current USDA RUS bulletin index.]
          </em>
        </p>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <section data-tier="foundations" className="mt-8">
        <h3 className="font-semibold mb-3">Key Terms — Flashcards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <Quiz
          questions={[
            {
              id: 'T14L10Q1',
              text: 'A ground test log shows an aerial pole electrode read 22 Ω. The inspector sees it logged as "PASS (≤25 Ω)." Is this correct?',
              options: [
                'Incorrect — aerial poles require ≤5 Ω per GR-1275',
                'Correct — 22 Ω is below the 25 Ω NEC §250.56 threshold for aerial poles',
                'Incorrect — any reading above 10 Ω requires a supplemental rod on RUS projects',
                'Correct only if the soil resistivity is documented in the log',
              ],
              correct: 1,
              explanation:
                'For aerial pole electrodes, the acceptance threshold is ≤25 Ω per NEC §250.56. 22 Ω is below 25 Ω — PASS is the correct determination. The ≤5 Ω threshold from Telcordia GR-1275 applies to FDH cabinets and CO/equipment-room electrodes, not to aerial poles. (Source: NEC §250.56.)',
            },
            {
              id: 'T14L10Q2',
              text: 'An FDH cabinet electrode reads 6 Ω on the fall-of-potential test. The crew logs it as "PASS (≤25 Ω)." What is wrong with this?',
              options: [
                'Nothing is wrong — 6 Ω passes the 25 Ω threshold',
                'The wrong threshold was applied. FDH equipment rooms require ≤5 Ω per GR-1275; 6 Ω is a FAIL that requires remediation',
                'The fall-of-potential method is not valid for FDH cabinets — clamp-on method is required',
                'The log entry must also include the soil resistivity value to be valid',
              ],
              correct: 1,
              explanation:
                'The FDH cabinet is an equipment enclosure, so the Telcordia GR-1275 threshold of ≤5 Ω applies — not the NEC 25 Ω aerial-pole threshold. 6 Ω > 5 Ω = FAIL for an FDH site. The crew must add a supplemental electrode, re-test, and update the log before close-out can be certified. (Source: Telcordia GR-1275 §5 [confirm edition].)',
            },
            {
              id: 'T14L10Q3',
              text: 'A ground test log entry shows a failed electrode (28 Ω at an aerial pole). What must be present in the close-out documentation for this electrode?',
              options: [
                'Only the initial 28 Ω result and a note that it was close to passing',
                'The initial 28 Ω result (FAIL), the remediation taken (supplemental rod installed), the re-test result showing ≤25 Ω, and the re-test date',
                'A waiver from the RUS state office approving the above-threshold result',
                'Only the re-test result after remediation; the initial failure can be removed from the log',
              ],
              correct: 1,
              explanation:
                'The ground test log must be a complete audit trail: initial measurement (28 Ω), FAIL determination, remediation (supplemental rod installed at ≥8 ft spacing), re-test measurement (must be ≤25 Ω), and re-test date. Omitting the initial failure or replacing it with only the passing re-test would misrepresent the construction record — a Form 219 certification error. (Sources: NEC §250.56; RUS 1751F-630 §7.)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
