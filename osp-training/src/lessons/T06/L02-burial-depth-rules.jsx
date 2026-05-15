// T06.L02 — Burial Depth Rules — Federal, State, Local
// Working lesson: applying the tiered burial-depth hierarchy (RUS → NEC → AHJ)
// Source: Module09_OSPConstruction.jsx §9.3 + RUS 1751F-635 + NEC 830.47 + FDOT/state DOT references

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L02',
  course_id: 'T06',
  title: 'Burial Depth Rules — Federal, State, Local',
  order: 2,
  lesson_type: 'standard',
  prerequisites: ['T06.L01', 'T04.L01'],
  learning_objectives: [
    'State the three-tier burial-depth hierarchy: RUS mandate → NEC floor → AHJ override',
    'Apply the correct minimum cover depth for a given soil type, surface type, and jurisdiction',
    'Explain why the AHJ permit depth is always the binding requirement, regardless of what the federal standards say',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'minimum cover',
    'RUS 1751F-635',
    'NEC 830.47',
    'AHJ override',
    'bore-pit depth',
    'frost line',
    'direct-buried cable',
  ],
  vocabulary_assumed: [
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'open-cut trench', source_lesson_id: 'T06.L01' },
    { term: 'plowing', source_lesson_id: 'T06.L01' },
    { term: 'conduit', source_lesson_id: 'T04.L01' },
    { term: 'AHJ', source_lesson_id: 'T06.L01' },
    { term: 'ROW', source_lesson_id: 'T06.L01' },
  ],
  key_terms: [
    {
      term: 'minimum cover',
      definition:
        'The vertical distance from the top of a buried conduit or cable to the finished grade (ground surface). "24-inch minimum cover" means the top of the conduit is at least 24 inches below the surface. Cover protects the cable from frost heave, surface loading, and accidental excavation.',
    },
    {
      term: 'RUS 1751F-635',
      definition:
        'USDA Rural Utilities Service Bulletin 1751F-635 — Buried Plant Engineering Design and Construction. The primary federal reference document for underground OSP design on RUS-financed telecommunications projects. Specifies minimum burial depths, conduit types, access structure requirements, and separation from foreign utilities.',
    },
    {
      term: 'NEC 830.47',
      definition:
        'National Electrical Code Section 830.47 — network-powered broadband communications systems. Specifies an 18-inch minimum burial depth for direct-buried network-powered broadband cable as the national floor. The NEC is a model code adopted by jurisdictions; the AHJ may require more depth than NEC specifies.',
    },
    {
      term: 'AHJ override',
      definition:
        'A burial depth requirement set by the Authority Having Jurisdiction (city, county, state DOT, railroad, river authority) that exceeds the federal or NEC minimum. The AHJ override is the binding requirement for a permitted job. Example: a state DOT may require 48-inch cover in highway ROW even though NEC permits 18 inches and RUS requires 36 inches.',
    },
    {
      term: 'bore-pit depth',
      definition:
        'The depth of the entry or exit excavation for an HDD bore. The bore-pit must be deep enough to allow the drill head to enter at the required bore depth (typically the target burial depth + bore-entry angle geometry). A 36-inch burial depth requires the bore pit to extend below 36 inches at the point where the drill rod enters the bore path.',
    },
    {
      term: 'frost line',
      definition:
        'The depth to which the ground freezes in a given location during a design winter event. In northern states (Minnesota, Michigan, northern Pennsylvania), frost penetrates 48 inches or more. Buried conduit above the frost line can heave vertically as the soil freezes and thaws — potentially damaging cables and disrupting grade. Standard practice: bury at least 6 inches below the local frost line.',
    },
    {
      term: 'direct-buried cable',
      definition:
        'Fiber optic cable installed in the ground without a conduit — just the cable itself buried in a trench or plow slot. Requires a cable specifically rated for direct burial (armored, with a gel-flooded or corrugated-steel protective sheath). Less common on new RUS fiber builds (which use conduit for future access); more common on legacy copper and older fiber routes.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// Worked example data
// ---------------------------------------------------------------------------
const workedExampleData = {
  title: 'Calculating Required Burial Depth for a Mixed-Surface Route Segment',
  introduction: `You're designing a conduit route in Macon, GA (Light loading district). The route starts in a residential yard, crosses a county road, then continues through a commercial parking lot. Three surface types — three different depth requirements. Here's how to determine the required depth at each segment.`,
  steps: [
    {
      label: 'Step 1 — Identify the federal/RUS floor',
      content: `RUS 1751F-635 specifies 36 inches (91 cm) minimum cover for direct-buried conduit in general situations on RUS-financed projects. This is your starting point for every segment — the floor you can't go below on an RUS job unless the AHJ explicitly permits shallower depth with compensating protection (concrete encasement, warning tape + cap).`,
      formula: 'Floor depth (RUS) = 36 inches',
      result: '36 inches',
    },
    {
      label: 'Step 2 — Check the NEC 830.47 floor',
      content: `NEC 830.47 specifies 18 inches as the minimum for direct-buried network-powered broadband cable [NEC paywalled; widely reproduced in vendor literature — VERIFIED-via-secondary-source]. This is lower than the RUS requirement, so on an RUS job, the RUS 36-inch floor governs. The NEC floor only becomes relevant if this were a non-RUS project — in that case, 18 inches is the national minimum before AHJ applies.`,
      formula: 'NEC floor = 18 inches (lower than RUS, therefore RUS governs on RUS-funded jobs)',
      result: 'RUS 36 inches governs',
    },
    {
      label: 'Step 3 — Segment A: Residential yard (utility easement)',
      content: `Residential utility easement. No AHJ depth override documented in the permit. RUS floor applies. Frost line for Macon, GA (Light loading district, central Georgia) is typically 0–6 inches [confirm with local DOT if frost protection is specified in contract]. The RUS 36-inch requirement already far exceeds the frost concern in this climate.`,
      formula: 'Required depth (residential) = max(RUS floor, AHJ override, frost line + 6 in)\n= max(36 in, none, 6 + 6 in)\n= 36 inches',
      result: '36 inches minimum cover in residential yard',
    },
    {
      label: 'Step 4 — Segment B: County road crossing',
      content: `County road ROW. The county permit specifies 42-inch minimum cover under the road surface. This AHJ override exceeds the RUS 36-inch floor. The permit is the binding document — you design to 42 inches for this segment.`,
      formula: 'Required depth (county road) = max(RUS floor, AHJ override)\n= max(36 in, 42 in)\n= 42 inches',
      result: '42 inches minimum cover under county road (AHJ override governs)',
    },
    {
      label: 'Step 5 — Segment C: Commercial parking lot',
      content: `Commercial parking lot (private property, AHJ is the city building department). The city permit requires 24-inch cover with an 8-inch concrete encasement cap. This is shallower than the RUS 36-inch floor in raw depth, but RUS 1751F-635 allows reduced depth with concrete encasement as compensating protection for non-traffic areas. Confirm with RUS area engineer that this meets the project specifications.`,
      formula: 'Required depth (parking lot with concrete cap) = 24 inches cover + 8 inches concrete cap\n= 32 inches total, with concrete cap providing traffic-load protection\n[confirm with RUS area engineer for project compliance]',
      result: '24 inches cover + concrete encasement (AHJ + RUS project engineer agreement)',
    },
    {
      label: 'Step 6 — Sanity check',
      content: `Final depth schedule for the drawings: Residential yard: 36 inches. County road crossing: 42 inches. Parking lot: 24 inches + concrete cap. The route depth changes at each segment — this is normal and should be annotated clearly on the plan-and-profile drawings with depth callouts at every grade change and surface-type transition.`,
      formula: 'The design depth is the MAXIMUM of (RUS floor, NEC floor, AHJ override, frost line + 6 inches) at each segment.',
      result: 'Route depth schedule: 36″ residential → 42″ county road → 24″ + cap parking lot. Annotate every transition on drawings.',
    },
  ],
  sanityCheck:
    '36 inches is about 3 feet — roughly knee-deep. 42 inches is waist-high on most adults. A conduit at 42-inch depth under a county road is deep enough that an excavator cleaning a roadside drainage ditch won\'t clip it on a standard scoop. That\'s exactly what the AHJ is protecting against.',
};

// ---------------------------------------------------------------------------
// Quiz data
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt:
      'An RUS-financed buried fiber route crosses through a state highway ROW. The RUS standard requires 36-inch minimum cover; the state DOT permit requires 48-inch cover. Which depth governs?',
    choices: [
      '18 inches — the NEC 830.47 national floor always takes precedence',
      '36 inches — the RUS requirement governs on RUS-funded projects',
      '48 inches — the state DOT permit (AHJ override) is the binding requirement',
      '42 inches — the average of the two conflicting requirements',
    ],
    answerIndex: 2,
    rationale:
      'The AHJ override is the binding requirement. The state DOT controls the highway ROW and issues the encroachment permit. If the permit says 48 inches, you build to 48 inches — regardless of what RUS or NEC specify as their floor. The permit is the contract document that governs on-site. RUS 36 inches is the minimum floor for the non-highway segments.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'What does "minimum cover" mean in the context of buried conduit installation?',
    choices: [
      'The total depth of the trench from grade to trench bottom',
      'The vertical distance from the top of the conduit to the finished grade surface',
      'The concrete or soil thickness placed below the conduit for bedding',
      'The minimum wall thickness of the conduit itself',
    ],
    answerIndex: 1,
    rationale:
      'Minimum cover is the distance from the top of the conduit to the finished grade surface. A 36-inch minimum cover means the top of the conduit is 36 inches below the surface. Total trench depth would be cover + conduit OD + bedding thickness. The cover is what protects the conduit from frost, traffic load, and accidental excavation.',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'Why does the frost line matter for burial depth in northern states, even when the RUS 36-inch standard is met?',
    choices: [
      'Frost makes the soil harder and more difficult to excavate, requiring deeper burial for access',
      'Conduit buried above the frost line can heave vertically as soil freezes and thaws, potentially damaging cables and disrupting grade',
      'Frost line requirements only apply to potable water lines, not to fiber conduit',
      'The frost line determines the required conduit wall thickness, not the burial depth',
    ],
    answerIndex: 1,
    rationale:
      'When water in the soil freezes, it expands and can push buried objects upward — a process called frost heave. If the conduit is above the frost line, freeze-thaw cycles over multiple winters can shift the conduit vertically, crack fittings, and create sags or humps visible as grade changes on the surface. Standard practice: bury at least 6 inches below the local frost line depth to keep the conduit in stable, non-freezing soil.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    prompt:
      'You are designing a non-RUS private fiber build. The route runs through residential yards with no specific AHJ permit depth requirement documented. What is the minimum burial depth for direct-buried cable per NEC 830.47?',
    choices: [
      '6 inches',
      '12 inches',
      '18 inches',
      '36 inches',
    ],
    answerIndex: 2,
    rationale:
      'NEC 830.47 specifies 18 inches as the national floor for direct-buried network-powered broadband communications cable. This is the minimum if no AHJ override applies and this is not an RUS-funded project (RUS would require 36 inches). Note: 18 inches is genuinely shallow for buried fiber — most prudent designs exceed this floor even when not required.',
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    prompt:
      'On a plan-and-profile drawing, you annotate a 42-inch burial depth for the county road crossing but fail to show the transition back to 36 inches on the residential segment on the other side. Why is this a problem?',
    choices: [
      'It is not a problem — the deeper depth on one segment automatically applies to adjacent segments',
      'The construction crew may install the full route at 42 inches, wasting excavation cost on the residential segment',
      'The construction crew may install the residential segment at 42 inches also, which violates NEC',
      'The annotation error will cause the permit to be denied',
    ],
    answerIndex: 1,
    rationale:
      'Without a clear transition annotation, the crew defaults to what they see on the drawing — which at the road crossing shows 42 inches. They may simply keep the blade or trencher at 42 inches through the residential segment, adding unnecessary excavation cost (deeper trench, more backfill, more compaction) with no benefit. Plan-and-profile drawings must annotate depth changes at every surface-type transition to prevent this. The risk of going too shallow (hitting 30 inches where 36 is required) is the other side of the same annotation failure.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L02_BurialDepthRules() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          "How deep do we bury it?" sounds like a simple question, but the answer comes
          from at least three different places at once: the federal RUS standard, the
          national electrical code, and the local permit. They don't always agree — and
          the permit always wins. Understanding the hierarchy means you won't underbuild
          (risking permit violation and cable damage) or overbuild (wasting excavation cost)
          on any given segment.
        </p>
        <p className="mt-3">
          Here's the one-sentence rule that governs every burial-depth decision:{' '}
          <strong>
            Build to the deepest requirement that applies to that specific segment — federal
            floor, NEC floor, or AHJ override, whichever is greatest.
          </strong>
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">USDA agency that finances rural telecom infrastructure; sets engineering standards as a condition of funding</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code (NFPA 70)</td>
              <td className="px-3 py-2">The model electrical/communications code adopted by most U.S. jurisdictions; sets the national floor for burial depth</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The local agency whose permit is required — city, county, state DOT, railroad authority, waterway authority</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DOT</td>
              <td className="px-3 py-2">Department of Transportation</td>
              <td className="px-3 py-2">State agency controlling highway ROW; typically requires deeper cover than the NEC or RUS floor</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The "deepest wins" analogy</h3>
        <p className="mt-2">
          Think of burial depth like a speed limit on a road trip. The federal highway has
          one limit (75 mph). The state has its own (65 mph on that stretch). The county
          road has another (45 mph). You always drive at the posted limit for the road you're
          on — not the federal max. Burial depth works the same way: three different
          authorities set limits, and the most restrictive one on the specific segment of
          road (or yard, or highway) governs.
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
        <h2>The Three-Tier Hierarchy</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Tier</th>
                <th className="px-3 py-2 text-left">Source</th>
                <th className="px-3 py-2 text-left">Typical depth</th>
                <th className="px-3 py-2 text-left">When it applies</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">1 — Federal floor (RUS)</td>
                <td className="px-3 py-2">RUS 1751F-635</td>
                <td className="px-3 py-2">36 inches (91 cm)</td>
                <td className="px-3 py-2">All RUS-financed buried plant; general direct-buried conduit</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">2 — National code floor (NEC)</td>
                <td className="px-3 py-2">NEC 830.47</td>
                <td className="px-3 py-2">18 inches (absolute minimum)</td>
                <td className="px-3 py-2">Non-RUS projects where NEC is adopted by AHJ; lowest floor in the hierarchy</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">3 — AHJ override (permit)</td>
                <td className="px-3 py-2">State DOT, county, city, railroad permit</td>
                <td className="px-3 py-2">42–48+ inches in highway ROW; 24 in with cap in some urban permits</td>
                <td className="px-3 py-2">Wherever the AHJ issues a separate encroachment or ROW permit — ALWAYS the binding requirement</td>
              </tr>
              <tr className="border-t border-white/10 bg-blue-900/10">
                <td className="px-3 py-2 font-medium text-blue-300">BINDING RULE</td>
                <td className="px-3 py-2 text-blue-300" colSpan={3}>Apply the maximum of all three tiers for each segment. The permit is always the binding document on a permitted job.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 font-semibold">Common AHJ depth bands (planning reference)</h3>
        <p className="mt-2 text-sm text-slate-400">
          These are typical values drawn from RUS bulletins, FDOT standard plans, VDOT IIM-LD-230, and CalTrans encroachment guidance. Always confirm with the actual AHJ permit before designing.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Surface / context</th>
                <th className="px-3 py-2 text-left">Typical depth</th>
                <th className="px-3 py-2 text-left">Source (confirmed)</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Direct-buried conduit, general (RUS floor)</td>
                <td className="px-3 py-2">36 inches</td>
                <td className="px-3 py-2">RUS 1751F-635; OCC 206-4 [VERIFIED-public-source]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">NEC floor (network-powered broadband)</td>
                <td className="px-3 py-2">18 inches</td>
                <td className="px-3 py-2">NEC 830.47 [VERIFIED-via-secondary-source — NEC paywalled]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Florida DOT highway ROW</td>
                <td className="px-3 py-2">Per FDOT Standard Plan 18202 (varies by zone)</td>
                <td className="px-3 py-2">FDOT 18202 [VERIFIED-public-source]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">CalTrans state highway ROW</td>
                <td className="px-3 py-2">~42 inches from surface; ~4 ft from edge of pavement</td>
                <td className="px-3 py-2">CalTrans encroachment TR-0448 paraphrase [VERIFIED-via-secondary-source]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">VDOT secondary road ROW</td>
                <td className="px-3 py-2">Per IIM-LD-230 (depth, bedding, warning tape)</td>
                <td className="px-3 py-2">VDOT IIM-LD-230 [VERIFIED-public-source]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Northern states (frost line concern)</td>
                <td className="px-3 py-2">Frost line depth + 6 inches</td>
                <td className="px-3 py-2">Standard practice; frost line maps from NOAA / state DOT</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (NEC and RUS as the design basis):</p>
          <p className="mt-1 text-slate-300/90">
            The textbook design workflow starts with the RUS 36-inch floor (for RUS jobs) or
            NEC 18-inch floor (for private jobs), then applies AHJ overrides at specific
            segments. This is correct engineering practice and is the method taught in RUS
            1751F-635 §5 and BICSI OSPDR.
          </p>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (what the crew actually uses):</p>
          <p className="mt-1 text-slate-300/90">
            In the field, the crew follows the blade depth set by the foreman, which is
            based on the permit and the job specs — not the NEC. Most experienced crews in
            RUS states set 36 inches as their default and increase for DOT crossings. The
            risk is in the transitions: a crew that sets 42 inches for the road crossing but
            forgets to adjust back to 36 inches on the other side just wastes excavation cost.
            A crew that doesn't increase for the DOT crossing risks a permit violation and
            required re-dig. The design drawings must annotate every transition to prevent
            both errors.
          </p>
        </div>

        <h3 className="mt-6 font-semibold">Compensating protection — when less depth is acceptable</h3>
        <p className="mt-2">
          Some AHJs allow reduced burial depth with compensating protection. Common examples:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li><strong>Concrete encasement</strong> — a concrete "cap" or full encasement around the conduit provides traffic-load distribution and damage protection equivalent to deeper burial. Some urban permits allow 18–24 inches with a 6–8 inch concrete cap.</li>
          <li><strong>Warning tape</strong> — orange warning tape ("CAUTION — BURIED FIBER OPTIC CABLE") placed 12 inches above the conduit warns future excavators before they reach the conduit. Required by some AHJs and by good practice on any buried conduit.</li>
          <li><strong>Metal detection tape</strong> — a metallic-core warning tape detectable by utility locators, addressing the fact that plastic conduit doesn't trigger 811 locate equipment.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-400">
          [confirm with AHJ permit for compensating-protection acceptance criteria at the specific jurisdiction]
        </p>

        {/* Worked Example */}
        <h3 className="mt-6 font-semibold">Worked Example: Determining Depth at Each Segment</h3>
        <WorkedExample
          title={workedExampleData.title}
          introduction={workedExampleData.introduction}
          steps={workedExampleData.steps}
          sanityCheck={workedExampleData.sanityCheck}
        />
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: River Crossings, Navigable Waterways, and HDD Depth</h2>
        <p>
          HDD river crossings introduce a third dimension: depth below the riverbed, not just
          depth below grade. The bore profile must stay deep enough to remain in stable soil
          below the riverbed scour depth — the depth to which storm events erode the riverbed.
        </p>
        <p className="mt-3">
          Standard practice: design the bore to pass below the 100-year scour depth (typically
          determined from USACE or FHWA hydraulic analysis for navigable waterways). For a
          navigable river, a USACE permit under Section 10 of the Rivers and Harbors Act is
          required; the permit typically specifies minimum clearance below the federally
          maintained channel depth.
        </p>
        <p className="mt-3">
          For smaller non-navigable streams, the state environmental agency (in Georgia, EPD)
          and the county may require additional cover. A typical design for a 50-ft-wide
          creek crossing in Georgia clay:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Entry and exit bore pits: 6 ft below grade, 10–15 ft long, shored</li>
          <li>Bore profile: 10 ft below creek centerline at crossing (well below typical 2–4 ft scour depth for small creeks)</li>
          <li>HDD casing: 4-inch HDPE conduit bundle pulled inside 6-inch steel casing for added protection in the bore zone</li>
          <li>Entry/exit angles: 10–12° (shallow enough to avoid exceeding conduit bend radius)</li>
        </ul>
        <p className="mt-3 text-sm text-slate-400">
          [confirm scour depth with hydraulic analysis for the specific waterway; confirm USACE permit requirement for navigable waterways; confirm state EPD requirements for stream buffer zones]
        </p>

        <div className="mt-4 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">Bore-pit depth geometry</p>
          <p className="mt-2 text-slate-300/90">
            For a bore-pit entry at 10° angle targeting a conduit depth of 36 inches at 50 feet
            from the bore-pit back wall:{' '}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-300">
            tan(10°) = rise / run → 0.176 = 36 in / run → run = 36 in / 0.176 ≈ 204 inches ≈ 17 feet
          </p>
          <p className="mt-1 text-slate-300/90">
            So the conduit reaches target depth approximately 17 feet from the bore-pit entry point.
            The bore pit must accommodate this entry geometry — the pit length must be at least
            the rig's drill-string length plus the entry-slope run. This is why bore pits are
            often 15–20 ft long for 36-inch target depth at 10° entry.
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
