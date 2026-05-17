// T06.L05 — Manhole, Handhole, and Vault Sizing
// Working lesson: access structure types, H-20/H-25 loading, sizing for cable count, spacing
// Source: Module09_OSPConstruction.jsx §9.5 + RUS 1751F-635 §7 + OFS IP-079 reference

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L05',
  course_id: 'T06',
  title: 'Manhole, Handhole, and Vault Sizing',
  order: 5,
  lesson_type: 'standard',
  prerequisites: ['T06.L03', 'T06.L04'],
  learning_objectives: [
    'Distinguish manhole, handhole, and vault by function and traffic-loading rating',
    'Select the correct access structure size based on cable count, splice tray count, and minimum bend radius',
    'Apply the pedestal-spacing rule and identify when a larger structure is required vs. a pull point',
    'Explain the H-20 vs. H-25 live loading distinction and when each applies',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'manhole',
    'handhole',
    'vault',
    'H-20 live loading',
    'H-25 live loading',
    'pull point',
    'slack loop',
    'sump',
  ],
  vocabulary_assumed: [
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'innerduct', source_lesson_id: 'T06.L03' },
    { term: 'pull tension', source_lesson_id: 'T06.L04' },
    { term: 'mid-assist', source_lesson_id: 'T06.L04' },
    { term: 'minimum cover', source_lesson_id: 'T06.L02' },
  ],
  key_terms: [
    {
      term: 'manhole',
      definition:
        'An underground access structure large enough for a technician to enter and work inside. In OSP fiber plant, a manhole is used at major splice points, cable crossings, or conduit transitions where the interior work volume justifies a man-entry structure. Manholes are rated for traffic loading (H-20 or H-25) and have a removable lid at grade.',
    },
    {
      term: 'handhole',
      definition:
        'An underground access structure too small to enter — the technician reaches in from the top with tools. Also called a "pull box" or "junction box." Handholes are used for pull points (where cable is guided between conduit runs), slack storage, and minor splice points. Available in non-traffic (NTC) and traffic-rated versions.',
    },
    {
      term: 'vault',
      definition:
        'A larger precast concrete underground access structure, typically man-entry, used at major network nodes — splice hubs, distribution points, node-site equipment enclosures. Vaults are specified in the contract with interior dimensions (L×W×D) and traffic-loading class. May include cable racks, splice-tray shelving, and sump drainage.',
    },
    {
      term: 'H-20 live loading',
      definition:
        'A standard highway live load class designating a single-unit 2-axle truck at 40,000 lb gross vehicle weight (GVW) — 20 short tons — with a 32,000 lb rear axle and 8,000 lb front axle (the original AASHO 1944 H-series designation). H-20-rated access structures are designed to withstand that rear-axle loading. Suitable for driveways, parking lots, and secondary roads; most common rating for residential and light-commercial OSP access structures. The related AASHTO HS-20 designation refers to a 3-axle semi-trailer combination (72,000 lb GVW) that produces similar peak live loads on bridge spans — industry ratings often cite both together, but H-20 is the correct designation for access-structure load ratings under AASHTO and ASTM standards.',
    },
    {
      term: 'H-25 live loading',
      definition:
        'An enhanced live load class corresponding to an AASHTO HS-25 design vehicle — 25% heavier than HS-20. Required for primary roadways, intersections, and locations subject to heavy truck traffic (freight routes, loading docks, DOT highway ROW). H-25 requires heavier structure walls and lid/frame than H-20.',
    },
    {
      term: 'pull point',
      definition:
        'An access structure placed specifically to enable a cable pull to be continued — either as a mid-assist location or as the transition between two conduit sections. Pull points may not contain splices; they exist only to allow cable feeding. A handhole used purely as a pull point needs enough interior space to coil the cable and attach a pulling grip, but not the full working volume of a splice handhole.',
    },
    {
      term: 'slack loop',
      definition:
        'Extra cable, coiled and stored inside an access structure, beyond the length needed to reach the splice location. Slack provides enough fiber reach for a splice technician to pull the cable out of the structure, up to the splice trailer parked on the shoulder, and work with the cable while both trailer and structure are accessible. Minimum slack bands: 50 ft at intermediate handholes, 100 ft at designated splice points.',
    },
    {
      term: 'sump',
      definition:
        'A depression at the lowest point inside a manhole or vault that allows groundwater to collect in one spot and be pumped or drained. Without a sump, water fills the entire floor and requires access from above — dangerous and slow. Sumps are standard in man-entry structures in any location with groundwater or surface-water infiltration risk.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// AnnotatedDiagram — access structure cross-section comparison
// ---------------------------------------------------------------------------
const accessStructureDiagram = {
  title: 'Access Structure Types — Side-by-Side Cross-Section',
  description:
    'Three underground access structures side by side: handhole (left), manhole (center), vault (right). Click a labeled region to see its function and sizing considerations.',
  regions: [
    {
      id: 'handhole-body',
      label: 'Handhole (pull box)',
      x: '5%', y: '15%', width: '25%', height: '60%',
      description:
        'Small precast concrete or polymer box, typically 17×30×24 to 24×36×24 inches (L×W×D). Too small to enter. Technician reaches in from above. Used for pull points, slack storage, and minor splices. Available in NTC (non-traffic cover) and H-20 rated versions. Cover and frame are flush with grade.',
    },
    {
      id: 'handhole-lid',
      label: 'Handhole lid (NTC or H-20 rated)',
      x: '5%', y: '5%', width: '25%', height: '10%',
      description:
        'NTC (non-traffic cover) lids are used in yards, easements, and off-pavement locations. H-20 rated frame-and-cover is used in driveways, parking areas, and on-pavement locations. Do not substitute NTC for H-20 — an NTC lid under vehicle traffic will crack and create a road hazard.',
    },
    {
      id: 'manhole-body',
      label: 'Manhole (man-entry)',
      x: '37%', y: '10%', width: '26%', height: '70%',
      description:
        'Precast concrete man-entry structure, typically 4×6 ft to 6×8 ft interior, depth 4–6 ft. Technician descends through the opening via rungs or a ladder. Used for major splice points and conduit transitions. Requires confined-space entry permit in most jurisdictions. Standard opening diameter 22–26 inches at grade.',
    },
    {
      id: 'manhole-sump',
      label: 'Sump (floor drain)',
      x: '42%', y: '72%', width: '16%', height: '8%',
      description:
        'Depression at the lowest point of the manhole floor. Allows groundwater to pool in one location for pumping. Without a sump, water covers the entire floor and technicians work ankle-deep. Sumps typically 6–12 inches deep. A pump-out access hose fits through the manhole opening.',
    },
    {
      id: 'vault-body',
      label: 'Vault (large man-entry node)',
      x: '70%', y: '5%', width: '25%', height: '78%',
      description:
        'Large precast concrete structure, often 8×10 ft or larger interior, for major network hubs. Contains cable racks, splice-tray shelving, and sometimes powered equipment. H-20 or H-25 rated. May include HVAC ventilation if temperature-sensitive equipment is housed. Vault lid is typically a separate pre-assembled unit with frame set in the pour.',
    },
    {
      id: 'vault-rack',
      label: 'Interior cable rack / tray',
      x: '72%', y: '20%', width: '6%', height: '50%',
      description:
        'Vertical cable rack along the vault wall. Fiber cables are routed from conduit entries at the bottom, along the rack in their minimum-bend-radius arc, to splice trays at working height. Rack capacity is one of the primary vault-sizing drivers — count the splice trays, multiply by 2–3 inches per tray height, add growth margin.',
    },
  ],
  textFallback: `
    [DIAGRAM: Three underground access structures shown in cross-section, side by side.
    LEFT: Handhole — small box, no entry. Lid at grade (NTC or H-20 rated). Interior ~17×30×24 in. Pull point or slack storage use.
    CENTER: Manhole — man-entry rectangular structure, 4×6 to 6×8 ft interior. Access opening at top with cover and frame. Sump depression at floor. Rungs on wall.
    RIGHT: Vault — large man-entry node structure. Taller/wider than manhole. Interior cable racks along the wall. H-20 or H-25 rated cover and frame. Splice-tray shelving at working height.]
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
      'A handhole is being placed in a private residential driveway. The homeowner uses the driveway for daily car traffic. What cover rating is required?',
    choices: [
      'NTC (non-traffic cover) — residential driveways are light-traffic and NTC is sufficient',
      'H-20 — driveways and parking areas with vehicle traffic require H-20 rated frame and cover',
      'H-25 — all residential applications require H-25 for future-proofing',
      'No cover rating is required — a plastic lid is acceptable in residential settings',
    ],
    answerIndex: 1,
    rationale:
      'H-20 — the standard 2-axle highway live load class at 40,000 lb GVW (20 short tons) with a 32,000 lb rear axle — is the standard for driveways, parking areas, and any location subject to vehicle traffic. A personal car weighs 2–4 tons; even a small truck or delivery vehicle can overload an NTC cover. NTC is appropriate only in yards, unpaved easements, and locations clearly off any vehicle path. A cracked NTC lid in a driveway is a trip hazard and a permit violation.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'What is the functional difference between a splice handhole and a pull-point handhole?',
    choices: [
      'A splice handhole is man-entry; a pull-point handhole is reach-in only',
      'A splice handhole contains fiber connections and may have splice trays; a pull-point handhole contains only slack cable with no splices — it exists to enable cable pulls to be extended',
      'A pull-point handhole is rated for H-25 traffic loading; a splice handhole uses an NTC cover',
      'There is no functional difference; the terms are interchangeable',
    ],
    answerIndex: 1,
    rationale:
      'The functional distinction matters for sizing: a splice handhole needs enough interior depth to accommodate bend-radius transitions, splice-tray mounting, and slack coils. A pull-point handhole only needs enough room to coil the cable briefly and attach a Kellems grip to continue the pull — it may be smaller. Confusing the two during design leads to either an oversized structure (wasted cost) or an undersized splice point (can\'t fit the trays needed).',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'A vault is being sized for a 12-cable splice node (each cable is 144-count, OD 0.75 inches). The minimum bend radius for these cables is 10× OD = 7.5 inches. What is the MINIMUM interior dimension consideration driven by the bend radius?',
    choices: [
      'Minimum interior width must be ≥ 2 × bend radius = 15 inches to allow a U-turn inside the vault',
      'Minimum interior depth must be ≥ minimum bend radius = 7.5 inches',
      'Minimum interior width must be ≥ bend radius = 7.5 inches for each cable',
      'Bend radius does not affect vault sizing — only cable count and splice tray count matter',
    ],
    answerIndex: 0,
    rationale:
      'To make a 180° turnaround inside a vault (from conduit entry at the bottom up to the splice tray at working height), the interior dimension must accommodate the minimum bend radius on both sides of the turn. The cable sweeps through a semicircle with a minimum radius of 7.5 inches, requiring 2 × 7.5 = 15 inches of clearance width for the cable turn alone. The actual vault interior must be wider than 15 inches to allow for the cable body plus working clearance. Vendors provide tables matching cable OD, bend radius, and minimum interior dimension.',
  },
  {
    id: 'q4',
    type: 'drag-match',
    prompt: 'Match each access structure to its primary use case.',
    pairs: [
      { left: 'Handhole (NTC rated)', right: 'Pull point in a residential utility easement, no vehicle traffic' },
      { left: 'Handhole (H-20 rated)', right: 'Slack storage location in a commercial parking lot' },
      { left: 'Manhole', right: 'Major splice point on a campus backbone route, man-entry required for splice tray work' },
      { left: 'Vault (H-25 rated)', right: 'Network hub node under a primary state highway with heavy truck traffic' },
    ],
    rationale:
      'NTC handholes: non-traffic, easement, yard. H-20 handholes: vehicle-traffic areas (driveways, parking). Manholes: man-entry splice points where the volume of work justifies entry. H-25 vaults: primary roads and highway ROW with heavy truck loading.',
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    prompt:
      'The rule of thumb for access structure spacing along a conduit route is 500–1,000 ft. What does this spacing actually optimize?',
    choices: [
      'It ensures conduit fill stays below 40% by providing an intermediate access point to reduce cable count per segment',
      'It keeps the required pull tension within the cable\'s rated maximum by limiting the conduit-run length between pull points',
      'It satisfies the NESC §35 requirement for underground access spacing',
      'It ensures the access structures are visible to the 811 locate technician for marking',
    ],
    answerIndex: 1,
    rationale:
      'The 500–1,000 ft spacing is a pull-tension-management rule. Beyond 1,000 ft of conduit between pull points, bends and friction accumulate enough that a single-end pull frequently exceeds cable-rated tension. Access structures at ≤1,000 ft allow mid-assist pulls. In practice, the exact spacing is adjusted to the nearest safe access point — a textbook 1,000-ft spacing that falls in a highway median is moved to the nearest side street.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L05_ManholeHanhholeVaultSizing() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Underground fiber doesn't just sit in a continuous conduit from one end to the other.
          Every few hundred feet, the route needs an access point — a box in the ground where
          a technician can reach in or climb into to splice cables, guide a cable pull, or
          store extra slack. These access structures come in three sizes: handholes (reach-in
          boxes), manholes (climb-in chambers), and vaults (larger chambers for major nodes).
          The wrong size means the technician can't fit the splice trays, can't keep the cable
          bend radius, or — if you picked a non-traffic cover for a driveway — the structure
          gets crushed by a truck.
        </p>

        <h3 className="mt-4 font-semibold">Quick reference: which structure for which job</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Structure</th>
                <th className="px-3 py-2 text-left">Typical size</th>
                <th className="px-3 py-2 text-left">Entry type</th>
                <th className="px-3 py-2 text-left">Primary use</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Handhole (small)</td>
                <td className="px-3 py-2">17×30×24 in</td>
                <td className="px-3 py-2">Reach-in from above</td>
                <td className="px-3 py-2">Pull point, ≤144 count cable</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Handhole (medium)</td>
                <td className="px-3 py-2">24×36×24 in</td>
                <td className="px-3 py-2">Reach-in from above</td>
                <td className="px-3 py-2">Slack storage, 144–288 count</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Handhole (large)</td>
                <td className="px-3 py-2">48×60×48 in</td>
                <td className="px-3 py-2">Reach-in (deep), semi-entry</td>
                <td className="px-3 py-2">Major pull point, 576+ count</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Manhole</td>
                <td className="px-3 py-2">4×6 ft to 6×8 ft, 4–6 ft deep</td>
                <td className="px-3 py-2">Man-entry (confined space)</td>
                <td className="px-3 py-2">Major splice node, conduit transition</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Vault</td>
                <td className="px-3 py-2">8×10 ft+ interior</td>
                <td className="px-3 py-2">Man-entry (confined space)</td>
                <td className="px-3 py-2">Hub node, multi-cable splice center</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Sizes sourced from OFS IP-079 [VERIFIED-public-source] as vendor reference; not a normative standard. Confirm with project spec and RUS 1751F-635 §7 for RUS-funded projects.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {key_terms.slice(0, 4).map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {key_terms.slice(4).map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>Sizing Access Structures: The Four Drivers</h2>

        <h3 className="mt-4 font-semibold">1. Cable count and splice tray count</h3>
        <p className="mt-2">
          Each fiber cable entering the structure needs a splice-tray housing if it's a
          splice point. Each splice-tray housing takes up vertical space on the cable rack
          (typically 1–3 inches per tray). Count the cables, multiply by trays per cable,
          add 25% growth reserve, and that gives you the minimum rack height. Interior
          depth = rack height + bend-radius geometry + floor clearance.
        </p>

        <h3 className="mt-4 font-semibold">2. Minimum bend radius</h3>
        <p className="mt-2">
          Every fiber cable has a minimum installation bend radius (typically 10–20× the
          cable OD). Inside the structure, the cable must sweep from the conduit entry at the
          bottom wall up to the splice tray at working height. That sweep must not be tighter
          than the minimum bend radius. If the structure interior is too narrow to accommodate
          the bend, the cable is damaged at installation.
        </p>
        <p className="mt-2 text-sm bg-white/5 rounded p-2">
          Rule: minimum interior width ≥ 2 × minimum bend radius (to allow a 180° turn inside the structure).
          For a cable with 10× OD minimum bend radius and OD = 0.75 in: min width = 2 × (10 × 0.75) = 15 inches minimum interior clear dimension for the cable sweep alone.
        </p>

        <h3 className="mt-4 font-semibold">3. Traffic loading</h3>
        <p className="mt-2">
          Traffic loading drives the structure wall thickness, lid/frame rating, and concrete
          mix strength:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li><strong>NTC (non-traffic)</strong> — yards, unpaved easements, clearly off any vehicle path</li>
          <li><strong>H-20</strong> — driveways, parking areas, secondary roads, most county roads</li>
          <li><strong>H-25</strong> — state highways, primary roads, freight routes, DOT-specified locations</li>
        </ul>
        <p className="mt-2 text-sm text-slate-400">
          [H-20 and H-25 per AASHTO HS load classification; confirm with AHJ permit for specific road classification — some state DOTs require H-25 on all state-owned ROW regardless of road class]
        </p>

        <h3 className="mt-4 font-semibold">4. Spacing — how often do structures appear?</h3>
        <p className="mt-2">
          The 500–1,000 ft access-structure spacing is a pull-tension management interval.
          In practice, the textbook spacing is an interval — the actual structure location
          is moved to the nearest safe access point where a splice trailer can park.
        </p>
        <div className="mt-3 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">The axiom from field practice:</p>
          <p className="mt-1 text-slate-300/90">
            "Plan at 500–1,000 ft; build where the splice trailer can park."
            A textbook-correct structure location in a highway median, a flooded ditch, or a
            private yard without easement is worse than no structure — it's inaccessible.
            The spacing rule and the access-practicality rule both apply.
            [Per Module09 field notes — OFS IP-009]
          </p>
        </div>

        {/* Annotated Diagram */}
        <h3 className="mt-6 font-semibold">Access Structure Cross-Section Comparison</h3>
        <AnnotatedDiagram
          title={accessStructureDiagram.title}
          description={accessStructureDiagram.description}
          regions={accessStructureDiagram.regions}
          textFallback={accessStructureDiagram.textFallback}
        />

        {/* Book vs Field */}
        <div className="mt-5 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (vault sizing checklist from OFS IP-079 and RUS 1751F-635):</p>
          <ol className="mt-1 list-decimal pl-4 space-y-1 text-slate-300/90">
            <li>Confirm the largest cable's minimum bend radius fits within the vault interior without forcing a tight bend at the conduit entrance</li>
            <li>Confirm enough rack space for planned splice-tray count plus 25% growth reserve</li>
            <li>Confirm the vault lid can be removed with standard equipment at the chosen location</li>
            <li>Confirm the traffic-loading class matches the location (H-20 for driveways, H-25 for roadways)</li>
          </ol>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (what gets skipped and what goes wrong):</p>
          <p className="mt-1 text-slate-300/90">
            In practice, vault sizing is often delegated to the contractor with a "match or exceed OFS
            IP-079 for the cable count" specification. This works well if the contractor knows the
            specs and the PM catches undersize submittals. The most common field mistake: installing
            a structure that is technically sized for the initial cable count but has no rack space
            for the 3 additional cables the operator will add in year 2. Growth reserve is the
            first thing cut when the structure cost seems high and the "we'll deal with it later"
            argument sounds reasonable in a tight budget meeting.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: Confined Space Entry for Manholes and Vaults</h2>
        <p>
          Any man-entry structure that meets OSHA's permit-required confined-space definition
          requires a confined-space entry permit under OSHA 1910.146 (general industry) or
          29 CFR 1926.1200 (construction). Key criteria for a permit-required confined space:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Large enough for a person to enter and work</li>
          <li>Has limited or restricted means of entry and exit</li>
          <li>Not designed for continuous occupancy</li>
          <li>AND contains an actual or potential hazard (atmospheric, physical, or other)</li>
        </ul>
        <p className="mt-3 text-sm">
          Underground fiber manholes typically meet all four criteria: atmospheric hazard
          (oxygen deficiency from O₂ displacement by CO₂ from soil; methane from adjacent
          gas lines; hydrogen sulfide from adjacent sewer) + the confined space definition.
        </p>
        <p className="mt-3 text-sm">
          <strong>Minimum pre-entry protocol (abridged):</strong>
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Continuous air monitoring (O₂ 19.5–23.5%, LEL &lt; 10%, H₂S &lt; 1 ppm ceiling) before entry</li>
          <li>Forced-air ventilation while occupant is in the space</li>
          <li>Attendant stationed outside the structure at all times — never leaves the opening</li>
          <li>Rescue plan and retrieval system staged before any entry begins</li>
          <li>Written permit signed by a qualified person (employer-designated)</li>
        </ol>
        <p className="mt-2 text-sm text-slate-400">
          [OSHA 1910.146 (general industry) and 29 CFR 1926.1200 (construction) — VERIFIED-public-source;
          confirm with applicable OSHA regional interpretation for the specific jurisdiction]
        </p>

        <div className="mt-4 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-300">Book vs. field divergence — confined space:</p>
          <p className="mt-1 text-slate-300/90">
            <strong>Book:</strong> Every man-entry underground structure receives a confined-space
            atmospheric test and permit before entry per OSHA 1910.146.
            <strong> Field:</strong> On residential routes in new subdivisions, some crews skip
            the permit and monitoring because "the manhole just went in, there's no gas." This
            is a recognized violation. Gas migrates — a leaking private gas service 50 feet from
            the manhole can fill the space in hours. The two most common incidents at new-installation
            manholes are O₂ displacement (unexpected soil gas) and delayed H₂S accumulation. The
            permit and monitoring exist because "new" doesn't mean "safe." This is also why T18
            (Safety and OSHA) is taught before T06 in the curriculum — the safety foundation
            comes first, before the underground construction content that builds on it.
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
