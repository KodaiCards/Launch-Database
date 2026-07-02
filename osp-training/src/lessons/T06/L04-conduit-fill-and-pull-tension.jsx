// T06.L04 — Conduit Fill and Pull Tension
// Working lesson: 40% fill rule, jam ratio, pull tension with friction factor
// Source: Module09_OSPConstruction.jsx §9.4 + RUS 1751F-643 + PPI MAB reference

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L04',
  course_id: 'T06',
  title: 'Conduit Fill and Pull Tension',
  order: 4,
  lesson_type: 'standard',
  prerequisites: ['T06.L03'],
  learning_objectives: [
    'Calculate conduit fill percentage using the area-ratio formula',
    'Explain the 40% fill rule and why exceeding it causes cable damage',
    'Apply the pull-tension formula with friction factor for a multi-bend route',
    'Identify when a mid-assist pulling setup is required',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'conduit fill',
    '40% fill rule',
    'jam ratio',
    'coefficient of friction (µ)',
    'pull tension',
    'mid-assist',
    'Kellems grip',
    'breakaway swivel',
  ],
  vocabulary_assumed: [
    { term: 'conduit trade size', source_lesson_id: 'T06.L03' },
    { term: 'Schedule 40 PVC', source_lesson_id: 'T06.L03' },
    { term: 'innerduct', source_lesson_id: 'T06.L03' },
    { term: 'HDPE conduit', source_lesson_id: 'T06.L03' },
  ],
  key_terms: [
    {
      term: '40% fill rule',
      definition:
        'The industry convention limiting total cable cross-sectional area to no more than 40% of a conduit\'s interior cross-sectional area. This limit ensures cables can be pulled without jamming and leaves room for future cable additions. Note: NEC Chapter 9 Table 1 governs fill for electrical conductors — communications cables are explicitly exempt from those tables under NEC 770.110(B) and 800.110(B). The 40% figure is an industry convention followed by OSP engineers and reflected in BICSI standards, not an NEC mandate for telecom cable.',
    },
    {
      term: 'jam ratio',
      definition:
        'The ratio of conduit inner diameter (ID) to cable outer diameter (OD): Jam Ratio = ID / OD. When three cables of the same OD are pulled in a conduit, they are most likely to jam when the jam ratio is between 2.8 and 3.2. Outside that range (smaller or larger), the cables either fit together smoothly or the conduit is too large to create jam geometry.',
    },
    {
      term: 'coefficient of friction (µ)',
      definition:
        'A dimensionless number describing how much friction exists between the cable jacket and the conduit wall during pulling. A dry, clean PVC conduit has µ ≈ 0.5. A conduit with cable lubricant applied reduces µ to ≈ 0.2–0.35. Higher µ means more pull force required per foot of cable and per bend angle.',
    },
    {
      term: 'pull tension',
      definition:
        'The tension force (measured in pounds-force, lbf) applied to a cable as it is pulled through a conduit. Pull tension accumulates as the cable travels through bends — each bend multiplies the tension by e^(µθ) where θ is the bend angle in radians. Exceeding the cable\'s rated maximum pull tension damages the fiber or weakens the cable structure.',
    },
    {
      term: 'mid-assist',
      definition:
        'An intermediate pulling setup installed at a mid-route access point (handhole or vault) that takes over cable pull from the initial pulling end, reducing tension in the second half of the route. Used when a single-end pull would exceed the cable\'s rated maximum pull tension due to route length, number of bends, or both.',
    },
    {
      term: 'Kellems grip',
      definition:
        'A woven wire mesh pulling grip that cinches tightly around the cable jacket as tension is applied. Used to attach the cable to the pull rope without damaging the cable. Also called a "cable grip" or "pulling grip." Sized by cable OD — the grip must match the cable OD for proper engagement.',
    },
    {
      term: 'breakaway swivel',
      definition:
        'A swivel connection between the pull rope and the cable (or conduit bundle) that includes a calibrated breakaway pin rated to the cable\'s or conduit\'s maximum pull tension. If tension exceeds the rated value, the breakaway pin shears, protecting the cable from overpull damage. Required by good practice on HDD pullback and long conduit pulls.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// WorkedExample data — Fill Calculation
// ---------------------------------------------------------------------------
const fillWorkedExample = {
  title: 'Conduit Fill Calculation: 12 Fibers in Schedule 40 PVC',
  introduction: `You need to pull a single 12-fiber loose-tube cable (OD = 0.51 inches) plus a second 48-fiber cable (OD = 0.75 inches) into a 2-inch Schedule 40 PVC conduit (ID = 2.067 inches). (Remember from L03, Schedule 40 has thinner walls than Schedule 80, giving a larger interior diameter for the same trade size.) Does this installation meet the 40% fill rule?`,
  steps: [
    {
      label: 'Step 1 — Calculate each cable\'s cross-sectional area',
      content: `For a circular cable, the cross-sectional area is the area of a circle: A = π × (OD/2)². We need the radius of each cable.`,
      formula: `12-fiber cable (OD = 0.51 in):
  Radius = 0.51 / 2 = 0.255 in
  Area₁ = π × (0.255)² = 3.1416 × 0.0650 = 0.2043 in²

48-fiber cable (OD = 0.75 in):
  Radius = 0.75 / 2 = 0.375 in
  Area₂ = π × (0.375)² = 3.1416 × 0.1406 = 0.4418 in²`,
      result: 'Cable 1 area = 0.2043 in². Cable 2 area = 0.4418 in².',
    },
    {
      label: 'Step 2 — Calculate total cable area',
      content: `Add the two cable areas together.`,
      formula: `Total cable area = Area₁ + Area₂
= 0.2043 + 0.4418
= 0.6461 in²`,
      result: 'Total cable cross-sectional area = 0.6461 in²',
    },
    {
      label: 'Step 3 — Calculate conduit interior area',
      content: `The 2-inch Schedule 40 PVC has an inner diameter (ID) of 2.067 inches.`,
      formula: `Conduit radius = 2.067 / 2 = 1.0335 in
Conduit area = π × (1.0335)² = 3.1416 × 1.0681 = 3.356 in²`,
      result: 'Conduit interior area = 3.356 in²',
    },
    {
      label: 'Step 4 — Calculate fill percentage',
      content: `Fill percentage = (total cable area / conduit area) × 100%.`,
      formula: `Fill% = (0.6461 / 3.356) × 100%
= 0.1925 × 100%
= 19.25%`,
      result: 'Fill = 19.25% — well under the 40% maximum.',
    },
    {
      label: 'Step 5 — Sanity check and interpretation',
      content: `19.25% fill means the two cables occupy roughly one-fifth of the conduit interior cross-section. There is room for a third cable of similar size or a future upgrade. The cable will pull with moderate friction and no jamming risk. The 40% rule is satisfied with margin to spare.`,
      formula: 'If fill% > 40%: upsize conduit. If fill% between 33-40%: OK but tight — verify jam ratio. If fill% < 33%: plenty of room.',
      result: 'Installation is compliant with the 40% fill rule. Conduit selection is correct for this cable count.',
    },
  ],
  sanityCheck:
    '19.25% fill is comfortable. Visually, the two cables sitting side by side in the conduit would look like two tennis balls in a coffee can — plenty of room to slide around. At 40% fill, the cables barely fit and friction makes pulling very difficult. Above 40%, the cables jam and can\'t be pulled without damage.',
};

// ---------------------------------------------------------------------------
// WorkedExample data — Pull Tension
// ---------------------------------------------------------------------------
const tensionWorkedExample = {
  title: 'Pull Tension Calculation: 3-Bend Route in 2-inch PVC',
  introduction: `You are pulling a 48-fiber loose-tube cable (weight W = 0.18 lb/ft, maximum rated pull tension P_max = 600 lbf) through 450 feet of 2-inch Schedule 40 PVC conduit. The route has three bends: 90°, 45°, and 90° (total 225° = 3.927 radians). The conduit is clean and dry. The coefficient of friction µ = 0.5. Does this single-end pull stay within the cable's rated pull tension?`,
  steps: [
    {
      label: 'Step 1 — Calculate straight-section tension (T_straight)',
      content: `For a straight horizontal conduit pull, tension builds from the weight of cable times the friction coefficient times the run length. For a horizontal pull:
T_straight = µ × W × L
where µ = coefficient of friction, W = cable weight (lb/ft), L = straight-run length (ft).`,
      formula: `µ = 0.5 (dry conduit)
W = 0.18 lb/ft
L = 450 ft

T_straight = 0.5 × 0.18 × 450
= 0.5 × 81
= 40.5 lbf`,
      result: 'T_straight = 40.5 lbf at end of straight pull before any bends.',
    },
    {
      label: 'Step 2 — Convert bend angles to radians',
      content: `The pull-tension formula uses radians, not degrees. Convert each bend angle:
1 radian = 57.3°, so 1° = π/180 = 0.01745 radians.`,
      formula: `90° = 90 × 0.01745 = 1.571 radians
45° = 45 × 0.01745 = 0.785 radians
90° = 90 × 0.01745 = 1.571 radians

Total angle θ_total = 1.571 + 0.785 + 1.571 = 3.927 radians`,
      result: 'Total bend angle = 3.927 radians (equivalent to 225°)',
    },
    {
      label: 'Step 3 — Apply the bend-tension multiplier',
      content: `Each bend multiplies the incoming tension by the factor e^(µθ), where e ≈ 2.718 (Euler\'s number), µ is the friction coefficient, and θ is the total bend angle in radians. This is the "capstan equation" — it describes how tension grows exponentially with each bend.`,
      formula: `Multiplier = e^(µ × θ_total)
= e^(0.5 × 3.927)
= e^(1.9635)
= 2.718^1.9635
≈ 7.13`,
      result: 'Bend multiplier = 7.13 — each 1 lbf of straight tension becomes 7.13 lbf after all three bends.',
    },
    {
      label: 'Step 4 — Calculate total pull tension at the far end',
      content: `Total tension at the pulling end = straight-section tension × bend multiplier.`,
      formula: `T_total = T_straight × multiplier
= 40.5 × 7.13
= 288.8 lbf`,
      result: 'T_total ≈ 289 lbf at the far end of the pull.',
    },
    {
      label: 'Step 5 — Compare to cable\'s rated maximum',
      content: `The cable is rated for 600 lbf maximum installation pull tension. Compare:`,
      formula: `T_total = 289 lbf
P_max = 600 lbf
289 lbf < 600 lbf ✓

Safety margin = (600 − 289) / 600 = 51.8% remaining capacity`,
      result: 'Single-end pull is within cable limits. No mid-assist required for this route.',
    },
    {
      label: 'Step 6 — Sanity check',
      content: `289 lbf is the pulling force at the winch head — about the weight of a large adult. This is reasonable for a 450-ft pull. The three bends multiplied the friction from 40.5 lbf to 289 lbf — that\'s a 7× increase just from bends. Bends are expensive. Every extra 90° bend on a long route can double the required pull tension.`,
      formula: 'Rule of thumb: each 90° bend at µ=0.5 multiplies existing tension by e^(0.5×1.571) = e^0.785 ≈ 2.19×',
      result: 'Each 90° bend at µ=0.5 roughly doubles the upstream tension. Minimize unnecessary bends.',
    },
  ],
  sanityCheck:
    '289 lbf — that\'s about the force it takes to lift two large adults. Applying that to the cable at the pull head is well within the 600 lbf limit. If the route had had six 90° bends instead of three, the multiplier would be e^(0.5×9.42) = e^4.71 ≈ 111× and the required pull tension would be 40.5 × 111 ≈ 4,496 lbf — nearly 8× the cable limit. At that point, mid-assist is not optional; the route geometry must change.',
};

// ---------------------------------------------------------------------------
// Annotated Diagram — Pull route cross-section
// ---------------------------------------------------------------------------
const pullDiagram = {
  title: 'Multi-Bend Conduit Pull — Side View',
  description:
    'A 450-ft conduit route with three bends. Click a region to understand how tension accumulates.',
  regions: [
    {
      id: 'pull-end',
      label: 'Pull end (winch)',
      x: '5%', y: '40%', width: '8%', height: '20%',
      description:
        'The winch (capstan or cable-pull machine) applies force here. Tension at the winch equals the total accumulated tension from straight sections and bends combined. The Kellems grip attaches to the cable jacket here.',
    },
    {
      id: 'bend-1',
      label: 'Bend 1 (90°)',
      x: '22%', y: '20%', width: '10%', height: '20%',
      description:
        'First 90° bend. Tension on the far side of this bend = upstream tension × e^(0.5×1.571) ≈ 2.19× the incoming tension. This is where friction first multiplies significantly. Lubricant at the bend reduces µ and the multiplier.',
    },
    {
      id: 'bend-2',
      label: 'Bend 2 (45°)',
      x: '50%', y: '40%', width: '10%', height: '20%',
      description:
        '45° bend. Multiplier for this bend alone = e^(0.5×0.785) ≈ 1.48×. Smaller than 90° but still significant. The cumulative tension after two bends is already 2.19 × 1.48 = 3.24× the straight-section tension.',
    },
    {
      id: 'bend-3',
      label: 'Bend 3 (90°)',
      x: '75%', y: '20%', width: '10%', height: '20%',
      description:
        'Third 90° bend. After this bend, total multiplier = 7.13× (all three bends combined). The cable continues to the payout reel at the far end.',
    },
    {
      id: 'payout-end',
      label: 'Payout reel (cable feeds from here)',
      x: '88%', y: '30%', width: '7%', height: '25%',
      description:
        'Cable feeds off the reel here under back-tension (the reel brake resists unspooling, adding a small amount to the tension calculation). For accurate tension analysis, include the reel back-tension in the T_straight calculation.',
    },
  ],
  textFallback: `
    [DIAGRAM: Side-view schematic of 450-ft conduit route with three bends.
    LEFT: Winch (pull end). Cable moves left to right.
    POINT 1 at ~22% of route: 90° upward bend.
    POINT 2 at ~50% of route: 45° direction change.
    POINT 3 at ~75% of route: 90° downward bend.
    RIGHT: Payout reel (cable feeds from here toward left/pull end).
    Arrows show cable travel direction and tension accumulation left-to-right.]
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
      'A 1.25-inch Schedule 40 PVC innerduct has an ID of 1.380 inches. Three 0.47-inch OD micro-cables are to be installed. What is the approximate fill percentage?',
    choices: [
      '~18% — well under the 40% limit',
      '~34% — near the 40% limit but compliant',
      '~51% — over the 40% limit, select larger innerduct',
      '~67% — far over the limit',
    ],
    answerIndex: 1,
    rationale:
      'Fill% = (total cable area / conduit area) x 100%. ' +
      'Conduit area: pi x (0.690 in)^2 = 1.496 in^2. ' +
      'Each cable area: pi x (0.235 in)^2 = 0.1735 in^2. ' +
      'Three cables total: 3 x 0.1735 = 0.5205 in^2. ' +
      'Fill% = 0.5205 / 1.496 x 100% = 34.8%. ' +
      'Closest answer is B (~34% -- near the 40% limit but compliant). The installation meets the 40% fill rule.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'Why does pull tension grow exponentially (not linearly) with the number of bends in a conduit route?',
    choices: [
      'Each bend increases the weight of cable being pulled by adding a catenary',
      'At each bend, friction acts on the full accumulated tension from all previous bends and straight sections, multiplying it',
      'Bends reduce the effective conduit ID, increasing the fill percentage and therefore the friction force',
      'Cable jackets elongate at bends, adding extra length that must be pulled',
    ],
    answerIndex: 1,
    rationale:
      'The capstan equation (T_out = T_in × e^(µθ)) captures why tension grows exponentially: each bend multiplies the ACCUMULATED tension from everything upstream — straight sections plus all prior bends. If the straight-section tension is 40 lbf and one 90° bend multiplies it to 88 lbf, then the second 90° bend multiplies those 88 lbf to 193 lbf. The multiplication stacks. A linear model would only add friction, not multiply it.',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'A cable pull calculation shows a required pull tension of 780 lbf on a single-end pull. The cable is rated for 600 lbf maximum. What is the correct response?',
    choices: [
      'Proceed — the 600 lbf rating has a built-in safety factor; 780 lbf is acceptable',
      'Add cable lubricant to reduce µ and recalculate; if still over 600 lbf, add a mid-assist pull point',
      'Use a smaller conduit — the fill percentage must be too high, increasing friction',
      'Split the cable into two separate smaller cables and pull them individually',
    ],
    answerIndex: 1,
    rationale:
      'The correct response is to first optimize what can be optimized: adding cable lubricant reduces µ from ~0.5 to ~0.2–0.35, which can significantly reduce the required pull tension. If the recalculation still exceeds 600 lbf, a mid-assist pull point is added at an intermediate structure, breaking the route into two shorter pulls each within the cable\'s rated tension. Exceeding the cable\'s rated maximum is not acceptable — it risks permanent fiber damage (microbending, jacket cracking) that may not be immediately detectable but degrades performance over time.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    prompt:
      'What is the jam ratio, and why does it matter for conduit fill planning?',
    choices: [
      'Jam ratio is the ratio of conduit OD to conduit ID; it determines wall thickness adequacy',
      'Jam ratio is conduit ID divided by cable OD; values between 2.8 and 3.2 indicate a risk of three same-size cables jamming together',
      'Jam ratio is the fill percentage above which cables can no longer be pulled; it equals 40% for three cables',
      'Jam ratio is the number of bends above which a mid-assist pull is required',
    ],
    answerIndex: 1,
    rationale:
      'Jam ratio = conduit ID / cable OD. When three cables of the same OD are pulled together, they are at highest risk of forming a triangular lock (jamming) when the jam ratio falls between 2.8 and 3.2. Outside this range — either smaller (cables fit into a tight triangle) or larger (conduit has room to separate them) — jamming risk drops. A fill calculation that comes in under 40% can still have a jam ratio in the danger zone, so engineers check both independently.',
  },
];

// Fix answer for q1 since the worked calculation in rationale is self-contradictory
// The actual correct answer for ~34.8% fill with 3 x 0.47-in cables in 1.380-in ID conduit is B (34%)
const fixedQuizQuestions = [
  {
    ...quizQuestions[0],
    answerIndex: 1,
    rationale:
      'Fill% = (total cable area / conduit area) x 100%.' +
      ' Conduit area: pi x (1.380/2)^2 = pi x 0.4761 = 1.496 in^2.' +
      ' Each cable area: pi x (0.47/2)^2 = pi x 0.0552 = 0.1735 in^2.' +
      ' Three cables: 3 x 0.1735 = 0.5205 in^2.' +
      ' Fill% = 0.5205 / 1.496 x 100% = 34.8%.' +
      ' Closest answer is B (~34% -- near the 40% limit but compliant). The installation is within the 40% rule.',
  },
  ...quizQuestions.slice(1),
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L04_ConduitFillAndPullTension() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Two things will make a fiber pull fail: too many cables crammed into the conduit
          (fill problem) and too much friction pulling against the cable as it moves through
          the conduit (tension problem). Both are predictable with simple math. The 40% fill
          rule keeps the cable from jamming; the pull-tension formula keeps you from snapping
          the cable — or burning out the winch — on a long route with lots of bends.
        </p>
        <p className="mt-3">
          Think of it like threading a wire through a garden hose. If you put in too many
          wires, they jam. If the hose has ten tight bends, the friction multiplies with each
          one. Same physics, much bigger numbers.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Symbol / term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">Typical value (dry PVC)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">µ (mu)</td>
              <td className="px-3 py-2">Coefficient of friction between cable jacket and conduit wall</td>
              <td className="px-3 py-2">0.5 dry; 0.2–0.35 lubricated</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">θ (theta)</td>
              <td className="px-3 py-2">Total bend angle in radians (not degrees)</td>
              <td className="px-3 py-2">90° = 1.571 rad; 45° = 0.785 rad</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">e^x</td>
              <td className="px-3 py-2">Euler's number (2.718) raised to the power x</td>
              <td className="px-3 py-2">e^1 = 2.718; e^2 = 7.39; e^3 = 20.1</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">lbf</td>
              <td className="px-3 py-2">Pounds-force — the unit of pull tension</td>
              <td className="px-3 py-2">600 lbf is typical max for OSP loose-tube cable</td>
            </tr>
          </tbody>
        </table>

        <Flashcard
          deckId="T06-L04"
          cards={key_terms.map((kt, idx) => ({
            id: `T06-L04-fc-${idx}`,
            front: `What is ${kt.term}?`,
            back: kt.definition,
          }))}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>The Fill Rule — How Much Cable Can You Put In?</h2>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">The formula:</p>
          <p className="mt-2 font-mono text-slate-200">
            Fill% = (Total cable area / Conduit interior area) × 100%
          </p>
          <p className="mt-2 font-mono text-slate-200">
            Cable area = π × (OD/2)²  [for each cable; sum for all cables]
          </p>
          <p className="mt-2 font-mono text-slate-200">
            Conduit area = π × (ID/2)²
          </p>
          <p className="mt-3 text-slate-300/90">
            The result must be ≤ 40% as an industry design limit. In OSP practice, designers
            use 40% as the universal fill ceiling for any number of cables — it is the one to
            know for any exam and for project specifications.
          </p>
        </div>

        <div className="mt-5 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (industry convention and NEC distinction):</p>
          <p className="mt-1 text-slate-300/90">
            NEC Chapter 9 Table 1 governs fill percentages for electrical conductors (power wiring)
            in conduit. Communications cables — including OSP fiber and innerduct — are explicitly
            exempt from those tables under NEC 770.110(B) (optical fiber) and NEC 800.110(B)
            (communications circuits). The 40% fill convention for telecom cable comes from BICSI
            ITSIMM and industry practice, not NEC mandate. BICSI ITSIMM specifies 25% initial /
            40% maximum for innerduct systems to preserve future pull-in capacity. If your project
            spec says 25%, that is the design target. If it says 40%, that is the ceiling.
          </p>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (what happens at 40%+):</p>
          <p className="mt-1 text-slate-300/90">
            Crews who load conduit to 45% or 50% on "just this one cable" create two problems:
            (1) the next cable pull is nearly impossible — even if it's theoretically within 40%,
            the actual friction from existing cables is much higher than dry-conduit math predicts;
            (2) jam-ratio geometry becomes a real risk when the third cable's OD matches the
            danger zone (conduit ID / cable OD between 2.8 and 3.2). The only recovery is to
            bore new conduit or abandon the oversold run.
          </p>
        </div>

        <h3 className="mt-6 font-semibold">Worked Example 1: Fill Calculation</h3>
        <WorkedExample
          title={fillWorkedExample.title}
          introduction={fillWorkedExample.introduction}
          steps={fillWorkedExample.steps}
          sanityCheck={fillWorkedExample.sanityCheck}
        />

        <h2 className="mt-8">Pull Tension — How Hard Is the Winch Working?</h2>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">The two-part pull-tension formula:</p>
          <p className="mt-2 font-mono text-slate-200">
            Part 1 — Straight section: T_straight = µ × W × L
          </p>
          <p className="mt-1 text-slate-300/90 text-xs">
            where µ = friction coefficient, W = cable weight (lb/ft), L = route length (ft)
          </p>
          <p className="mt-3 font-mono text-slate-200">
            Part 2 — Add bend multiplier: T_total = T_straight × e^(µ × θ_total)
          </p>
          <p className="mt-1 text-slate-300/90 text-xs">
            where θ_total = sum of all bend angles in radians
          </p>
          <p className="mt-3 text-slate-300/90">
            If T_total &gt; cable rated pull tension (typically 600 lbf for OSP loose-tube):
            add lubricant to reduce µ first; then add mid-assist if still over limit.
          </p>
        </div>

          <h3 className="mt-6 font-semibold">Worked Example 2: Pull Tension Calculation</h3>
        <WorkedExample
          title={tensionWorkedExample.title}
          introduction={tensionWorkedExample.introduction}
          steps={tensionWorkedExample.steps}
          sanityCheck={tensionWorkedExample.sanityCheck}
        />
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: Lubricant Selection and HDD Pullback Tension</h2>

        <h3 className="font-semibold">Effect of lubricant on µ</h3>
        <p className="mt-2">
          Cable pulling lubricant (polyethylene glycol gel or silicone-based compound) applied
          to the cable jacket or conduit wall reduces µ from ~0.5 (dry) to ~0.2–0.35 (lubricated).
          In the worked example above, using µ = 0.25 (well-lubricated):
        </p>
        <p className="mt-2 font-mono text-sm bg-white/5 rounded p-2">
          T_straight = 0.25 × 0.18 × 450 = 20.25 lbf{'\n'}
          Multiplier = e^(0.25 × 3.927) = e^0.982 = 2.67×{'\n'}
          T_total = 20.25 × 2.67 = 54.1 lbf
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Lubricant reduced the required tension from 289 lbf to 54 lbf — a factor of 5.3× reduction
          on the same route. Lubricant is cheap ($30–$80/gallon); it is almost always cost-effective
          on pulls longer than 200 ft or through two or more bends.
        </p>

        <h3 className="mt-5 font-semibold">HDD pullback tension — different calculation</h3>
        <p className="mt-2">
          In an HDD pullback, the conduit (not cable) is pulled first. The conduit drag through
          the bore depends on bore diameter, conduit OD, annular space, mud weight, bore length,
          and bore-path curvature. The PPI MAB HDD Tensile Loads method calculates this more
          rigorously — but the key difference from conduit pull-tension is that the bore mud adds
          an upward buoyancy force on the conduit, which reduces normal force against the bore
          wall and therefore reduces friction. Long, straight bores in mud can achieve remarkably
          low pull tension despite high route length.
        </p>
        <p className="mt-3">
          Rule of thumb: for an HDD pullback, always use a{' '}
          <strong>calibrated breakaway swivel</strong> set to the conduit's rated pull strength
          (not the cable's — the conduit is usually weaker). The swivel shears before the
          conduit parts at a mid-bore point (which would require abandoning the bore).
          [Per PPI MAB HDD Tensile Loads, Corning SRP-005-011, OCC 206-2]
        </p>
      </section>

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────── */}
      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Fill calculations and pull-tension analysis bridge multiple prior and downstream topics:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
          <li><strong>T06.L03 Conduit and Innerduct Selection</strong> — the conduit size and schedule you chose there directly determines the maximum cable count and pull-tension limits you calculate here; wrong schedule choice cascades into impossible pull conditions</li>
          <li><strong>T06.L01 HDD vs. Open-Cut vs. Plowing</strong> — HDPE conduit has lower friction than PVC, reducing pull tensions; this affects whether a plowing method is feasible under a given cable load</li>
          <li><strong>T06.L08 Riser/Pedestal Placement</strong> — the conduit routing and rise angles you design there create the pull-path geometry; steep angles and long runs amplify pull tensions, forcing you back to recalculate fill or downsize cables</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          The 40% fill rule and pull-tension math are not academic — they tell you in design whether a specific route is constructible, before the crew spends $10K on mobilization and discovers mid-pull that a cable is stuck.
        </p>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2>Check Your Understanding</h2>
        <GatedAssessment
          courseId="T06"
          assessmentId="T06-L04"
          title="T06.L04 Check — Conduit Fill and Pull Tension"
          fallback={
        <Quiz questions={fixedQuizQuestions} lessonId={meta.id} />
          }
        />
      </section>

    </LessonLayout>
  );
}
