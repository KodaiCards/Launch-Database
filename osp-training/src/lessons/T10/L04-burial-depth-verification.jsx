// T10.L04 — Burial Depth Verification
// Working lesson: depth hierarchy, depth probe, cover card, GPR verification, worked example
// Source: M09 §9.3 (depth table) + RUS 1751F-635 + OCC 206-4 + FDOT 18202 + VDOT IIM-LD-230

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L04',
  course_id: 'T10',
  title: 'Burial Depth Verification',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T10.L01', 'T10.L02', 'T10.L03', 'T07.L01'],
  learning_objectives: [
    'State the four-level depth hierarchy: NEC floor → RUS standard → state DOT → AHJ permit (the permit always governs)',
    'Explain how to use a depth probe and when a GPR survey is warranted instead',
    'Describe the cover card documentation requirement and who signs it',
    'Calculate the required installation depth when a permit specifies "from finished grade" vs. "from natural grade"',
    'Identify when a post-installation GPR survey is warranted for critical crossings',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'depth probe',
    'cover card',
    'GPR',
    'finished grade',
    'natural grade',
  ],
  key_terms: [
    {
      term: 'depth probe',
      definition:
        'A metal rod (typically 1/2-inch diameter, 48–60 inches long) pushed vertically into the ground above the installed conduit to physically verify burial depth. The probe hits the conduit and the measured insertion depth is the burial depth. Simple, cheap, and required by most inspection protocols at regular intervals (commonly every 100 feet and at every structure).',
    },
    {
      term: 'cover card',
      definition:
        'A written or electronic document certifying that the installed conduit was depth-probed at the required intervals and met the permit-required depth specification. Signed by the inspector. Required by most AHJ permits and RUS project closeout packages. Becomes part of the as-built documentation set.',
    },
    {
      term: 'GPR',
      definition:
        'Ground-Penetrating Radar — a non-destructive survey method that emits radar pulses into the ground and detects reflections from subsurface objects. Used to verify burial depth of HDD bores and direct-buried conduit where depth probing is impractical (under pavement, under a road crossing, in a protected area). More expensive than depth probing but provides a continuous depth profile rather than point measurements.',
    },
    {
      term: 'finished grade',
      definition:
        'The final surface elevation after all construction is complete — including pavement overlays, fill, or grading. The elevation you walk on when construction is done. Differs from natural grade when fill has been placed or pavement has been overlaid. When a permit specifies depth "from finished grade," the burial depth measurement starts from this final surface level.',
    },
    {
      term: 'natural grade',
      definition:
        'The existing ground surface elevation before any construction fill, grading, or pavement overlay. When a permit specifies depth "from natural grade," the burial depth measurement starts from the pre-construction ground level. This can produce a SHALLOWER installation than "from finished grade" if fill is added during construction.',
    },
  ],
  vocabulary_assumed: [
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'conduit', source_lesson_id: 'T06.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'ROW', source_lesson_id: 'T09.L01' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L01' },
    { term: 'stake', source_lesson_id: 'T07.L01' },
    { term: 'station', source_lesson_id: 'T07.L01' },
    { term: 'plan-and-profile', source_lesson_id: 'T07.L01' },
    { term: 'bedding sand', source_lesson_id: 'T10.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L04_BurialDepthVerification() {
  const depthCalcVariables = [
    { symbol: 'D_permit', label: 'Permit-required depth from finished grade', unit: 'inches', defaultValue: 36 },
    { symbol: 'overlay', label: 'Pavement overlay thickness above natural grade', unit: 'inches', defaultValue: 4 },
  ];

  const depthCalcSteps = (vars) => {
    const dPermit = vars.D_permit || 36;
    const overlay = vars.overlay || 4;
    const requiredFromNatural = dPermit + overlay;
    const exampleProbe = requiredFromNatural - 2;
    const exampleFromFinished = exampleProbe - overlay;
    const passed = exampleFromFinished >= dPermit;
    return [
      {
        label: 'Step 1 — Identify the permit requirement and grade datum',
        expression: `Permit requires ${dPermit} in from finished grade. Finished grade is ${overlay} in above natural grade.`,
        result: `Finished grade = natural grade + ${overlay} in`,
      },
      {
        label: 'Step 2 — Convert permit requirement to depth from natural grade',
        expression: `Required depth from natural grade = ${dPermit} (from finished) + ${overlay} (overlay) = ${requiredFromNatural} in`,
        result: `Conduit top must be at least ${requiredFromNatural} in below natural grade`,
      },
      {
        label: 'Step 3 — Take depth probe reading',
        expression: `Depth probe reads ${exampleProbe} in below natural grade`,
        result: `Measured depth from natural grade = ${exampleProbe} in`,
      },
      {
        label: 'Step 4 — Convert probe reading back to finished-grade datum',
        expression: `Depth from finished grade = ${exampleProbe} (probe) − ${overlay} (overlay) = ${exampleFromFinished} in from finished grade`,
        result: `${exampleFromFinished} in from finished grade vs. ${dPermit} in required → ${passed ? 'PASSES' : 'FAILS'} permit`,
      },
      {
        label: 'Sanity check',
        expression: 'We measure from what you walk on (finished grade), not from where dirt starts (natural grade). Adding pavement on top pushes the effective depth requirement deeper.',
        result: passed
          ? `${exampleFromFinished} in ≥ ${dPermit} in — conduit meets permit. ✓`
          : `${exampleFromFinished} in < ${dPermit} in — conduit is too shallow. Must expose and re-bury deeper.`,
      },
    ];
  };

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          After the conduit goes in the ground, someone has to prove it's deep enough.
          That's burial depth verification. It's not a bureaucratic checkbox — it's the
          documentation that protects the contractor, the system owner, and the future
          crew who digs here in 20 years without knowing what's below them.
        </p>
        <p className="mt-2">
          The depth requirement isn't a single number. There's a hierarchy: a federal
          baseline, a RUS standard on top of that, a state DOT requirement on top of that,
          and your specific permit on top of everything. <strong>The permit always wins.</strong>{' '}
          You build to what the permit says — not to the RUS standard, not to the
          "everybody does 36 inches" field norm.
        </p>

        <h3 className="mt-5 font-semibold">The four-level depth hierarchy</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Level</th>
              <th className="px-3 py-2 text-left">Standard / Source</th>
              <th className="px-3 py-2 text-left">Typical requirement</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">1 — NEC floor</td>
              <td className="px-3 py-2">NEC Table 300.5 [confirm edition]</td>
              <td className="px-3 py-2">18–24 in for direct-buried wiring methods; varies by circuit type</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">2 — RUS standard</td>
              <td className="px-3 py-2">RUS 1751F-635</td>
              <td className="px-3 py-2">36 in for direct-buried fiber conduit on RUS-financed projects</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">3 — State DOT</td>
              <td className="px-3 py-2">FDOT 18202; VDOT IIM-LD-230; CalTrans TR-0448; etc.</td>
              <td className="px-3 py-2">42–54 in under paved roadways; varies by state and road class</td>
            </tr>
            <tr className="border-t border-white/10 font-semibold text-white">
              <td className="px-3 py-2">4 — AHJ permit (governs)</td>
              <td className="px-3 py-2">Your specific permit conditions</td>
              <td className="px-3 py-2">Whatever the permit says — this number governs and must be met</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-slate-400">
          Higher levels set the floor; each level can only add more stringency, not less.
          Your permit from the AHJ is the governing document on the job site.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L04"
            cards={[
              {
                id: 'T10-L04-fc-depth-probe',
                front: 'What is a depth probe and how is it used to verify conduit depth?',
                back: 'A metal rod (typically ½-inch diameter, 48–60 inches long) pushed vertically into the ground above the installed conduit to physically verify burial depth. The rod hits the conduit; the measured insertion depth is the burial depth. Required at regular intervals (commonly every 100 ft and at every structure).',
              },
              {
                id: 'T10-L04-fc-cover-card',
                front: 'What is a cover card and who signs it?',
                back: 'A document certifying that installed conduit was depth-probed at required intervals and met the permit-required depth specification. Signed by the inspector. Required by most AHJ permits and RUS closeout packages. Becomes part of the as-built documentation set.',
              },
              {
                id: 'T10-L04-fc-gpr',
                front: 'What is GPR and when is it used for burial depth verification?',
                back: 'Ground-Penetrating Radar — emits radar pulses into the ground and detects reflections from subsurface objects. Used to verify depth of HDD bores and direct-buried conduit under pavement or in areas where depth probing is impractical. Provides a continuous depth profile; more expensive than depth probing.',
              },
              {
                id: 'T10-L04-fc-finished-grade',
                front: 'What is "finished grade" and how does it differ from "natural grade"?',
                back: '"Finished grade" is the final surface elevation after all construction — including pavement overlays and fill. "Natural grade" is the pre-construction ground surface. When a permit says depth from "finished grade," the measurement starts from the final walking surface — which may be several inches higher than where dirt starts.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Depth Verification in Practice</h2>

        <h3 className="mt-4 font-semibold">Using a depth probe</h3>
        <p>
          The depth probe is the primary field tool for verifying burial depth. After
          backfill (but before final grade restoration if possible), the inspector pushes
          the probe rod vertically through the backfill directly above the conduit centerline.
          The probe hits the conduit top; the insertion depth to that point is the burial depth.
        </p>
        <p className="mt-2">
          Best practice: probe at every 100-foot station AND at every structure, crossing,
          and elevation change. Record each reading on the cover card with the corresponding
          station number and GPS coordinates. Any reading that fails the permit requirement
          must be flagged, the conduit must be re-exposed at that location, and the
          contractor must deepen the installation before the inspector signs off.
        </p>

        <h3 className="mt-4 font-semibold">Finished grade vs. natural grade: the common depth trap</h3>
        <p>
          The single most common depth-verification mistake is measuring from the wrong datum.
          A permit says "36 inches from finished grade." The conduit is laid at 36 inches below
          natural grade. A 4-inch pavement overlay is added. After overlay, the conduit is
          only 32 inches from finished grade — it fails the permit by 4 inches.
        </p>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Worked Example: Finished vs. Natural Grade</h3>
          <WorkedExample
            id="T10-L04-worked-depth"
            title="Burial Depth When Pavement Is Overlaid"
            description="Calculate the required burial depth when a permit specifies depth from finished grade but measurements are taken from natural grade (pre-construction ground level)."
            variables={depthCalcVariables}
            computeSteps={depthCalcSteps}
          />
        </div>

        <h3 className="mt-6 font-semibold">When to require GPR instead of probing</h3>
        <p>
          Depth probing is impractical in several situations: conduit under paved road
          surfaces (you can't push a rod through asphalt without coring), HDD bores under
          wide crossings (the bore is 6+ feet deep and lateral deviation means the probe
          might not hit it), and conduit in dense rock fill where the probe hits rock before
          it hits conduit.
        </p>
        <p className="mt-2">
          For these situations, a GPR survey provides better data. A GPR operator walks the
          survey line with a radar antenna, and the resulting radargram shows a continuous
          cross-section of the subsurface with the conduit visible as a hyperbolic reflection.
          Depth is calculated from the time delay of the reflection.
        </p>
        <p className="mt-2 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-200 text-sm">
          When is GPR warranted? On any HDD bore under a highway, railroad, or regulated waterway.
          These are the crossings where future excavation liability is highest and where the
          as-built bore depth is least reliable (locator-log interpolation over long spans with
          potential deviation). The cost of a GPR pass at the crossing is $800–$2,000 vs. the
          cost of future excavation liability.
        </p>

        <h3 className="mt-6 font-semibold">Cover card documentation</h3>
        <p>
          The cover card (or equivalent inspection record) must include: contractor name,
          project name, date of installation, installation method, conduit type and size,
          burial depth at each probe location (with station numbers), permit requirement
          referenced, any locations that failed and the corrective action taken, and the
          inspector's signature. On RUS projects, this becomes part of the Form 219 closeout
          package (detail in T13).
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L04-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'A permit specifies "minimum 36 inches from finished grade to top of conduit." Finished grade will be 6 inches above natural grade due to a road reconstruction overlay. Your depth probe reads 40 inches below natural grade. Does the installation meet the permit?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Yes — 40 inches exceeds the 36-inch requirement' },
                  { id: 'b', text: 'No — depth from finished grade = 40 − 6 = 34 inches, which is less than 36 inches required' },
                  { id: 'c', text: 'Yes — natural grade is the correct measurement datum for permits' },
                  { id: 'd', text: 'The permit cannot specify "finished grade" before the road overlay is complete' },
                ],
                correctId: 'b',
                explanation:
                  'The permit references finished grade — the final surface after the overlay is placed. Finished grade will be 6 inches above current natural grade. Depth probe reads 40 inches below natural grade = 40 − 6 = 34 inches from finished grade. The requirement is 36 inches from finished grade. 34 < 36 → FAILS. The conduit must be re-buried 2 inches deeper.',
              },
              {
                id: 'q2',
                text: 'When should a GPR survey replace depth probing for burial verification?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Always — GPR is more accurate than probing in all situations' },
                  { id: 'b', text: 'When the conduit is under pavement, under a wide crossing, or in dense fill where the probe cannot reliably reach the conduit' },
                  { id: 'c', text: 'Only when the AHJ specifically requires it on the permit' },
                  { id: 'd', text: 'Only for HDD bores — never for open-cut installations' },
                ],
                correctId: 'b',
                explanation:
                  'Depth probing is the standard, low-cost method. GPR is warranted when probing is impractical: under paved surfaces (rod can\'t penetrate asphalt), on HDD bores under wide crossings (bore may have deviated), and in dense rock fill (probe hits rock, not conduit). GPR provides a continuous depth profile where probing gives only point measurements.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Depth Hierarchy Conflicts and Documentation Chain</h2>

        <h3 className="mt-4 font-semibold">When state DOT exceeds RUS requirements</h3>
        <p>
          On RUS-financed builds crossing state highway ROW, the depth requirement is
          typically <em>the larger of</em> RUS 1751F-635 (36 inches) and the DOT permit
          depth. For Florida (FDOT Standard Plan 18202): 48 inches under pavement. For
          Virginia (VDOT IIM-LD-230): 42 inches plus additional depth in freeze-thaw zones.
          For California (CalTrans TR-0448): approximately 42 inches from surface.
        </p>
        <p className="mt-2">
          On a BEAD-funded project crossing a Florida state highway, the design engineer
          of record must specify 48 inches (FDOT governs over RUS's 36 inches). The permit
          specifies this number explicitly. If your plan-and-profile shows 36 inches at that
          crossing, the inspector will reject the shop drawings before construction starts.
        </p>

        <h3 className="mt-4 font-semibold">Accountability chain when depth fails</h3>
        <p>
          If buried conduit is too shallow and a future excavator strikes it, the liability
          chain is:
          1. <strong>Contractor</strong> — responsible for installing to permit-required depth
          2. <strong>Inspector</strong> — responsible for verifying and documenting depth at required intervals
          3. <strong>Engineer</strong> — responsible for specifying correct depth on design drawings
          4. <strong>Owner</strong> — responsible for ensuring the permit conditions were met
        </p>
        <p className="mt-2">
          A complete cover card signed by the inspector at every probe location is the
          contractor's primary defense against liability. If the cover card shows probing at
          100-ft intervals with passing depths, and a future excavator strikes at an
          intermediate point where the conduit was somehow shallower, the documentation
          establishes that the contractor met their verification obligation.
        </p>
      </section>

    </LessonLayout>
  );
}
