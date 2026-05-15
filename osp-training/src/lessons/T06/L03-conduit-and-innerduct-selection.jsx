// T06.L03 — Conduit and Innerduct Selection
// Working lesson: Schedule 40/80 PVC, HDPE, microduct, innerduct — when to use each
// Source: Module09_OSPConstruction.jsx §9.4 partial + RUS 1751F-635 §5 + RUS 1751F-643 reference

import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L03',
  course_id: 'T06',
  title: 'Conduit and Innerduct Selection',
  order: 3,
  lesson_type: 'standard',
  prerequisites: ['T06.L01', 'T06.L02'],
  learning_objectives: [
    'Distinguish Schedule 40 from Schedule 80 PVC by wall thickness and application',
    'Explain when HDPE conduit is preferred over PVC, particularly for HDD installations',
    'Define innerduct and microduct and state how they fit inside a larger conduit',
    'Select the appropriate conduit material and schedule based on loading, chemical exposure, UV, and installation method',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'Schedule 40 PVC',
    'Schedule 80 PVC',
    'HDPE conduit',
    'innerduct',
    'microduct',
    'pull string',
    'conduit trade size',
  ],
  vocabulary_assumed: [
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'plowing', source_lesson_id: 'T06.L01' },
    { term: 'minimum cover', source_lesson_id: 'T06.L02' },
    { term: 'RUS 1751F-635', source_lesson_id: 'T06.L02' },
  ],
  key_terms: [
    {
      term: 'Schedule 40 PVC',
      definition:
        'A PVC (polyvinyl chloride) electrical conduit with a standard wall thickness defined by NEMA TC-2. The "Schedule 40" designation specifies wall thickness — thinner walls than Schedule 80, which means a larger interior diameter for the same trade size. Standard for direct-buried conduit in non-traffic, residential, and utility-easement applications. Color is typically gray for communications.',
    },
    {
      term: 'Schedule 80 PVC',
      definition:
        'A PVC conduit with heavier wall thickness than Schedule 40 for the same trade size. The thicker wall provides greater crush resistance, making it appropriate for higher traffic-load areas (parking lots, driveways, under pavement). Trades the larger interior bore of Schedule 40 for mechanical strength. Same gray color coding for communications.',
    },
    {
      term: 'HDPE conduit',
      definition:
        'High-density polyethylene conduit — a flexible plastic conduit that can be bent, coiled on reels, and pulled through HDD bores without joint failure. HDPE has higher impact resistance than PVC in cold temperatures, excellent chemical resistance, and can withstand the torsion and tensile loads of HDD pullback. Most HDD conduit installations use HDPE, designated as DR (dimension ratio) rather than Schedule.',
    },
    {
      term: 'innerduct',
      definition:
        'A smaller conduit installed inside a larger (host) conduit to subdivide the space for multiple fiber cables or multiple carriers. Example: a 4-inch PVC conduit might contain three 1.25-inch innerducts, each carrying a separate fiber cable. Innerducts are color-coded by carrier convention; orange is the APWA color for telecommunications facilities.',
    },
    {
      term: 'microduct',
      definition:
        'A very small conduit (typically 7–16 mm outer diameter) designed for air-blown fiber (micro-cable) installation. Microducts are bundled inside a standard host conduit — a 1.25-inch or 2-inch conduit might contain 7 microducts. Air-blown micro-cable is pushed through the microduct by compressed air rather than pulled by a rope, allowing installation after the conduit system is already in the ground.',
    },
    {
      term: 'pull string',
      definition:
        'A pre-installed rope, nylon string, or polypropylene tape inside an empty conduit, used to pull the fiber cable (or innerduct) through the conduit after the conduit is buried. Pull string is included in new conduit installations at the factory. A conduit installed without pull string requires fishing or blowing to retrieve a pull line before cable can be installed.',
    },
    {
      term: 'conduit trade size',
      definition:
        'The nominal size designation of a conduit (1-inch, 1.25-inch, 2-inch, 4-inch, etc.). Trade size is not the actual inner or outer diameter — it is a standardized name. The actual inner diameter (ID) varies by schedule/material: a 2-inch Schedule 40 PVC has an ID of approximately 2.067 inches; a 2-inch Schedule 80 PVC has an ID of approximately 1.939 inches.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// AnnotatedDiagram data: conduit cross-section stack
// ---------------------------------------------------------------------------
const conduitStackDiagram = {
  title: 'Underground Conduit Stack — Cross-Section',
  description:
    'A 4-inch HDPE host conduit containing three 1.25-inch innerducts. Click any label to see what it is and why it matters.',
  // SVG-described layout (text-described for AnnotatedDiagram text fallback)
  regions: [
    {
      id: 'host-conduit',
      label: 'Host conduit (4-inch HDPE)',
      x: '10%', y: '20%', width: '80%', height: '60%',
      description:
        'The outer conduit — in this case, 4-inch HDPE suitable for HDD installation. HDPE flexes without cracking under HDD pullback tension and torsion. The 4-inch trade size provides enough interior room for three 1.25-inch innerducts plus spare room for future additions.',
    },
    {
      id: 'innerduct-1',
      label: 'Innerduct #1 (orange — carrier A)',
      x: '18%', y: '30%', width: '18%', height: '40%',
      description:
        'The first of three innerducts. Orange is the APWA color for telecommunications. This innerduct carries Carrier A\'s fiber cable. The innerduct\'s interior diameter determines the maximum cable OD and thus the fill ratio. Pull string is pre-installed inside each innerduct at the factory.',
    },
    {
      id: 'innerduct-2',
      label: 'Innerduct #2 (blue — carrier B)',
      x: '41%', y: '30%', width: '18%', height: '40%',
      description:
        'A second innerduct for Carrier B\'s fiber, color-coded blue by contractor convention. This isn\'t an APWA normative standard — the orange/blue/green color sequence for sub-ducts is carrier or contractor convention. Confirm color assignment with the construction contract documents.',
    },
    {
      id: 'innerduct-3',
      label: 'Innerduct #3 (green — spare)',
      x: '64%', y: '30%', width: '18%', height: '40%',
      description:
        'A third innerduct left empty as a spare — the most common design practice. An empty innerduct with pull string costs very little at construction time and is enormously valuable if a future cable needs to be added without boring new conduit. RUS design guidance recommends spare capacity in underground plant.',
    },
    {
      id: 'annular-space',
      label: 'Annular space (air gap)',
      x: '10%', y: '20%', width: '80%', height: '10%',
      description:
        'The space between the innerducts and the host conduit wall. In a good installation, the innerducts are racked or banded together and the annular space is left open for drainage and expansion. Some installations fill this space with an expandable foam or grout at conduit ends to prevent groundwater infiltration into structures.',
    },
  ],
  textFallback: `
    [DIAGRAM: Cross-section of a 4-inch HDPE host conduit containing three 1.25-inch innerducts.
    Outer ring = host conduit (4-inch HDPE, HDD-capable).
    Inside: three circular innerducts side by side.
    Left innerduct = orange (Carrier A).
    Center innerduct = blue (Carrier B).
    Right innerduct = green (spare, with pull string).
    Space between innerducts and outer wall = annular space (air gap / drainage).]
  `,
};

// ---------------------------------------------------------------------------
// Quiz data
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt:
      'A fiber conduit must be installed via HDD bore through 800 feet of mixed clay and gravel. The bore will include two 90° bends in the path profile. Which conduit material is most appropriate?',
    choices: [
      'Schedule 40 PVC — standard conduit for all underground applications',
      'Schedule 80 PVC — thicker walls provide crush resistance for HDD pullback',
      'HDPE — flexible, withstands HDD pullback tension, torsion, and cold-temperature impact',
      'EMT (electrical metallic tubing) — maximum crush resistance for boring applications',
    ],
    answerIndex: 2,
    rationale:
      'HDPE is the standard for HDD applications. Its flexibility allows it to coil on a reel and navigate the bore path profile without joint failure. PVC (Schedule 40 or 80) is rigid and joined with solvent-cement bells — those joints can separate under HDD pullback tension. EMT is a metal electrical conduit not used in underground OSP fiber applications.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'What is the practical difference between Schedule 40 and Schedule 80 PVC for the same trade size (e.g., 2-inch)?',
    choices: [
      'Schedule 80 has a larger outer diameter for the same nominal size',
      'Schedule 40 has thicker walls, providing more crush resistance',
      'Schedule 80 has thicker walls, providing more crush resistance, but smaller interior diameter',
      'Schedule 40 and Schedule 80 have identical inner and outer diameters; only the material grade differs',
    ],
    answerIndex: 2,
    rationale:
      'For the same trade size (e.g., 2-inch), Schedule 80 has thicker walls than Schedule 40. This means the outer diameter (OD) is the same, but the inner diameter (ID) is smaller — a 2-inch Schedule 40 PVC has ID ≈ 2.067 inches; 2-inch Schedule 80 has ID ≈ 1.939 inches. You pay for Schedule 80\'s crush resistance with a slightly smaller bore. In most OSP applications, Schedule 40 is sufficient; Schedule 80 is used under pavements and in high-traffic-load zones.',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'Three fiber cables from three different carriers need to share a single conduit in an urban duct bank. What is the correct way to separate them?',
    choices: [
      'Install all three cables directly in one large conduit with no separation',
      'Install three separate small conduits in the duct bank, one per carrier',
      'Install one host conduit with three innerducts, one per carrier, color-coded separately',
      'Wrap each cable in spiral split loom tubing inside the host conduit',
    ],
    answerIndex: 2,
    rationale:
      'Innerducts are the standard mechanism for separating multiple carriers in a shared host conduit. Each carrier gets their own innerduct, which provides physical separation (no fiber contact between carriers), separate pull capability, and clear identification by color code. Installing all cables directly in one conduit makes future access and re-pulling impossible. Three separate conduits in a duct bank is also valid but more expensive in conduit material and duct bank space.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    prompt:
      'A new conduit is being installed for a route expected to be upgraded to air-blown micro-cable in 3–5 years. What design feature should be included in the conduit system now?',
    choices: [
      'Install a larger conduit (4-inch vs 2-inch) to accommodate future cable diameter',
      'Install microducts inside the host conduit so air-blown cable can be added without re-boring',
      'Leave the conduit empty and plan to re-bore with a new conduit when the micro-cable is needed',
      'Install innerducts rated for conventional pull instead — they can be converted to microducts later',
    ],
    answerIndex: 1,
    rationale:
      'The forward-thinking design for air-blown fiber is to install microducts inside the host conduit at initial construction. Microducts cost very little at initial installation (adding them later requires access at every structure), and air-blown fiber can be pushed through the microducts years later without any ground disturbance or re-boring. A 2-inch host conduit can contain 7 or more microducts. Innerducts are for conventional pull cable, not air-blown micro-cable.',
  },
  {
    id: 'q5',
    type: 'drag-match',
    prompt: 'Match each conduit type to its primary application.',
    pairs: [
      { left: 'Schedule 40 PVC', right: 'Direct-buried residential or utility-easement conduit' },
      { left: 'Schedule 80 PVC', right: 'Conduit under pavement or in high-traffic-load areas' },
      { left: 'HDPE', right: 'HDD bore conduit; flexible, torsion-resistant' },
      { left: 'Innerduct (1.25-inch)', right: 'Carrier separation inside a 4-inch host conduit' },
    ],
    rationale:
      'Each conduit type has a dominant application based on its physical properties: PVC Schedule 40 for standard burial, Schedule 80 for crush-resistance at pavement crossings, HDPE for HDD flexibility, and innerducts for multi-carrier separation within a host conduit.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L03_ConduitAndInnerductSelection() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Conduit is just a pipe that protects a fiber cable underground. But "just a pipe"
          comes in several materials and sizes — and picking the wrong one costs a re-dig.
          The key choices are: what material (PVC or HDPE), what wall thickness (Schedule 40
          or Schedule 80), whether to sub-divide the interior (innerduct or microduct), and
          what size to install for the expected cable count. Get these choices right at design
          time; changing them after the conduit is buried is expensive.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym / term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PVC</td>
              <td className="px-3 py-2">Polyvinyl Chloride</td>
              <td className="px-3 py-2">Rigid plastic conduit; standard for most direct-buried telecom conduit</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">Flexible plastic conduit; the standard for HDD bore installations</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DR</td>
              <td className="px-3 py-2">Dimension Ratio</td>
              <td className="px-3 py-2">How HDPE conduit wall thickness is rated (OD / wall thickness); smaller DR number = thicker wall</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OD / ID</td>
              <td className="px-3 py-2">Outer Diameter / Inner Diameter</td>
              <td className="px-3 py-2">OD = outside of the conduit; ID = inside bore where cables travel; wall thickness = (OD − ID) / 2</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The "pipe inside a pipe" concept</h3>
        <p className="mt-2">
          Picture a section of 4-inch water main. Now imagine that instead of carrying
          water, it carries three smaller 1.25-inch plastic tubes — one for each cable
          tenant sharing the duct. Each tenant has their own tube (innerduct), and the space
          between tubes is empty air. That's exactly how a conduit-with-innerducts system
          works. The outer pipe (host conduit) protects everything from the soil environment;
          the inner tubes (innerducts) separate the cables and allow each cable to be pulled
          independently.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {key_terms.slice(0, 4).map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {key_terms.slice(4).map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>Material Selection — PVC vs. HDPE</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Property</th>
                <th className="px-3 py-2 text-left">Schedule 40 PVC</th>
                <th className="px-3 py-2 text-left">Schedule 80 PVC</th>
                <th className="px-3 py-2 text-left">HDPE</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Wall thickness (2-inch trade)</td>
                <td className="px-3 py-2">0.154 in (ID = 2.067 in)</td>
                <td className="px-3 py-2">0.218 in (ID = 1.939 in)</td>
                <td className="px-3 py-2">Varies by DR; DR-11 2-inch ≈ 0.189 in wall</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Flexibility</td>
                <td className="px-3 py-2 text-red-400">Rigid — requires fittings at bends</td>
                <td className="px-3 py-2 text-red-400">Rigid — requires fittings at bends</td>
                <td className="px-3 py-2 text-green-400">Flexible — bends, coils on reel</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">HDD suitability</td>
                <td className="px-3 py-2 text-red-400">Not recommended — joints can separate under pullback tension</td>
                <td className="px-3 py-2 text-amber-400">Limited — same joint risk as Sch 40</td>
                <td className="px-3 py-2 text-green-400">Standard for HDD — heat-fused joints, no separation risk</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Cold-temperature impact resistance</td>
                <td className="px-3 py-2 text-amber-400">PVC becomes brittle below ~32°F</td>
                <td className="px-3 py-2 text-amber-400">Same as Sch 40</td>
                <td className="px-3 py-2 text-green-400">HDPE remains flexible to well below 0°F</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">UV resistance (above grade)</td>
                <td className="px-3 py-2 text-red-400">Degrades rapidly; must be painted or covered</td>
                <td className="px-3 py-2 text-red-400">Same as Sch 40</td>
                <td className="px-3 py-2 text-green-400">UV-stabilized HDPE holds up for years above grade</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Primary OSP application</td>
                <td className="px-3 py-2">Direct-buried residential, easement, open-cut</td>
                <td className="px-3 py-2">Under pavement, driveways, high-load areas</td>
                <td className="px-3 py-2">HDD bores; above-grade risers on pedestals</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Innerduct and Microduct — Hierarchy</h3>
        <p className="mt-2">
          When a single host conduit needs to serve multiple cables or multiple carriers,
          innerducts subdivide the interior space. The hierarchy from largest to smallest:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm text-slate-300/90">
          <li>
            <strong>Host conduit</strong> (2-inch, 4-inch) — the outer pipe installed in the trench or HDD bore.
          </li>
          <li>
            <strong>Innerduct</strong> (1.25-inch, 1.5-inch) — inside the host, separated by carrier or fiber group.
            Standard pull-in installation. Color-coded: orange (Carrier A), blue (Carrier B), green (spare).
            [Note: Orange is the APWA Uniform Color Code standard for telecommunications surface marking;
            the orange/blue/green innerduct color sequence is carrier convention, not a nationally
            normative standard. Confirm assignment with contract documents.]
          </li>
          <li>
            <strong>Microduct</strong> (7–16 mm OD) — inside the host, for air-blown micro-cable.
            A 2-inch host conduit can accommodate 7 microducts. Each microduct is individually addressed
            and blown separately. Air-blown fiber requires a compressor at one end and a receiver at
            the other — no pull rope or cable grip.
          </li>
        </ol>

        <div className="mt-5 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (RUS design convention):</p>
          <p className="mt-1 text-slate-300/90">
            RUS 1751F-635 §5 specifies conduit types and innerduct requirements for RUS-financed buried
            plant. For RUS jobs, innerduct must meet RUS specifications (see RUS 1751F-643 for innerduct
            qualification and traceability requirements [confirm current innerduct acceptance test per
            RUS 1751F-643 — paywalled standard referenced via RUS 1751F-635]). The required color
            sequence and documentation are part of the project closeout deliverables.
          </p>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (how crews actually deal with conduit choice):</p>
          <p className="mt-1 text-slate-300/90">
            On a typical rural RUS job, the conduit arriving on site is Schedule 40 PVC for the
            open-cut and plow sections, HDPE for the bore sections. The crew doesn't mix them on
            the same segment — PVC joints underground, HDPE heat-fused or mechanical-coupled
            aboveground at the transition. Where innerducts are specified, they arrive pre-installed
            in the host conduit from the supplier or are installed at the reel before the conduit
            goes in the ground. Pulling in innerducts after the host is buried is possible but
            much harder — a lesson crews learn once.
          </p>
        </div>

        {/* Annotated Diagram */}
        <h3 className="mt-6 font-semibold">Conduit Stack — Cross-Section Diagram</h3>
        <AnnotatedDiagram
          title={conduitStackDiagram.title}
          description={conduitStackDiagram.description}
          regions={conduitStackDiagram.regions}
          textFallback={conduitStackDiagram.textFallback}
        />

        <h3 className="mt-6 font-semibold">Conduit Size Selection</h3>
        <p className="mt-2">
          Conduit size (trade size) is driven by the fiber cable count, cable OD, and the
          40% fill rule (covered in detail in L04). At the design stage, size selection
          follows this logic:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Determine the number of fiber cables to be installed in this conduit (or innerduct).</li>
          <li>Find the OD (outer diameter) of each cable from the manufacturer's datasheet.</li>
          <li>Calculate the total cable cross-sectional area and apply the 40% fill rule (L04).</li>
          <li>Select the innerduct or conduit with ID ≥ the required ID from the fill calculation.</li>
          <li>Round up one size to maintain a spare-capacity margin (the cables that are always added later).</li>
        </ol>
        <p className="mt-2 text-sm text-slate-400">
          Rule of thumb for RUS rural aerial-to-underground transition: 2-inch host conduit with
          two 1.25-inch innerducts handles a 144-count cable plus a spare innerduct in 80% of
          rural-route scenarios. Larger cable counts or multiple splitter housings require a 4-inch host.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: HDPE DR Ratings and HDPE Fusion Joints</h2>
        <p>
          PVC conduit is rated by Schedule (40, 80). HDPE conduit is rated by{' '}
          <strong>Dimension Ratio (DR)</strong> — the ratio of the outer diameter to the wall
          thickness:
        </p>
        <p className="mt-2 font-mono text-sm bg-white/5 rounded p-2">
          DR = Outer Diameter (OD) / Wall Thickness (t)
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          A lower DR number means a thicker wall relative to the OD — stronger. Common HDPE
          conduit DRs for OSP:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li><strong>DR-11</strong> — standard heavy-wall; used for HDD and direct-buried in most OSP applications</li>
          <li><strong>DR-13.5</strong> — medium wall; used in open-cut trench applications with low traffic loading</li>
          <li><strong>DR-17</strong> — lighter wall; used in duct banks with concrete encasement providing external support</li>
        </ul>
        <p className="mt-3">
          HDPE conduit is joined by butt-fusion or electrofusion, not solvent cement. Butt-fusion:
          the two pipe ends are heated against a flat heating plate until both faces melt, then
          pressed together under controlled force and allowed to cool. The result is a joint that
          is <em>stronger than the pipe itself</em> — it won't separate under HDD pullback tension.
          This is why HDPE is the standard for HDD: the continuous-fused pipe string can be pulled
          through a bore without joint failure risk.
        </p>

        <div className="mt-4 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">UV stability above grade</p>
          <p className="mt-2 text-slate-300/90">
            Both PVC and HDPE degrade under UV exposure if not UV-stabilized. Standard gray PVC
            conduit is NOT UV-stabilized — it becomes brittle and chalky within months of UV
            exposure. If conduit runs above grade (pole riser, pedestal riser), use HDPE conduit
            with UV stabilization (carbon black compounded or UV-stabilized additive), or apply
            a UV-protective paint or sleeve to PVC. An unprotected PVC riser that shatters in
            year 3 is a guarantee of a field repair call.
          </p>
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2>Check Your Understanding</h2>
        <Quiz questions={quizQuestions} lessonId={meta.id} />
      </section>

    </LessonLayout>
  );
}
