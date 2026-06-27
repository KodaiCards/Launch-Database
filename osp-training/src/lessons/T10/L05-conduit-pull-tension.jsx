// T10.L05 — Conduit Pulling — Load Calculation
// Working lesson: 600 lbf pull tension, capstan formula, 40% fill convention, weakest-link rule
// Source: M09 §9.4 + Corning SRP-005-011 + OCC 206-2 + PPI MAB

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L05',
  course_id: 'T10',
  title: 'Conduit Pulling — Load Calculation',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T10.L02', 'T10.L03', 'T06.L04'],
  learning_objectives: [
    'State the 600 lbf representative maximum pull tension for OSP loose-tube cable and identify its source',
    'Explain why the rig gauge tension differs from cable-end tension on a multi-bend pull',
    'Apply the conduit fill 40% convention and explain why it is NOT a mandatory NEC code requirement for telecom cable',
    'Calculate pull tension at a cable exit point using the capstan formula with one or more bends',
    'Apply the weakest-link rule to set a breakaway swivel for a multi-sub-duct bundle',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'pull tension',
    'capstan formula',
    'mid-assist',
    'fish tape',
  ],
  key_terms: [
    {
      term: 'pull tension',
      definition:
        'The longitudinal force (measured in pounds-force, lbf) applied to a cable or conduit bundle during installation. Must remain below the cable manufacturer\'s maximum rated value throughout the pull. For standard OSP loose-tube fiber cable, the representative maximum is 600 lbf (Corning SRP-005-011 and OCC 206-2) — always verify the specific cable datasheet.',
    },
    {
      term: 'capstan formula',
      definition:
        'The equation that calculates how friction at a bend in a conduit multiplies the tension from one end of the bend to the other. The formula is: T_exit = T_entry × e^(μ × θ), where μ is the coefficient of friction (0.25 for dry PVC conduit as a starting value), θ is the bend angle in radians (90° = π/2 radians), and e is Euler\'s number (~2.718). Each bend multiplies downstream tension.',
    },
    {
      term: 'conduit fill',
      definition:
        'The ratio of the total cross-sectional area of cables/ducts inside a conduit to the inner cross-sectional area of the conduit itself. The 40% industry convention (not a NEC mandate for telecom cable) is used for traditional pull installation — keeping fill below 40% ensures cables can pull through without excessive friction. For microduct jetting, fill ratios of 50–70%+ are normal.',
    },
    {
      term: 'mid-assist',
      definition:
        'An intermediate capstan (mechanical pulling device) placed at a vault or handhole at the midpoint of a long conduit run to split the total tension across two shorter pulls. By reducing the pull length, mid-assist reduces the cumulative friction and allows routes with higher total bend angles or longer distances to stay within pull-tension limits.',
    },
    {
      term: 'fish tape',
      definition:
        'A steel or fiberglass tape threaded through a conduit to pull in a pull string or cable. The pull string is then used to pull the actual cable or conduit bundle. Used when the conduit is empty and there is no pre-installed pull string.',
    },
  ],
  vocabulary_assumed: [
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'innerduct', source_lesson_id: 'T06.L03' },
    { term: 'conduit fill', source_lesson_id: 'T06.L04' },
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'breakaway swivel', source_lesson_id: 'T10.L02' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L05_ConduitPullTension() {
  const capstanVariables = [
    { symbol: 'T0', label: 'Entry tension (force you apply at the start of the pull)', unit: 'lbf', defaultValue: 100 },
    { symbol: 'mu', label: 'Coefficient of friction (0.25 for dry PVC)', unit: 'dimensionless', defaultValue: 0.25 },
    { symbol: 'bends_90', label: 'Number of 90-degree bends in the conduit run', unit: 'count', defaultValue: 2 },
  ];

  const capstanSteps = (vars) => {
    const T0 = vars.T0 || 100;
    const mu = vars.mu || 0.25;
    const bends = vars.bends_90 || 2;
    const thetaTotal = bends * (Math.PI / 2);
    const multiplier = Math.exp(mu * thetaTotal);
    const Texit = (T0 * multiplier).toFixed(1);
    const percentOfLimit = ((T0 * multiplier) / 600 * 100).toFixed(1);
    const passes = (T0 * multiplier) <= 600;

    return [
      {
        label: 'Step 1 — Convert bend angle to radians',
        expression: `${bends} × 90° bends. One 90° bend = π/2 radians ≈ 1.5708 radians. Total: ${bends} × 1.5708 = ${(thetaTotal).toFixed(4)} radians`,
        result: `θ_total = ${thetaTotal.toFixed(4)} radians`,
      },
      {
        label: 'Step 2 — Calculate the tension multiplier',
        expression: `Multiplier = e^(μ × θ) = e^(${mu} × ${thetaTotal.toFixed(4)}) = e^(${(mu * thetaTotal).toFixed(4)})`,
        result: `Multiplier = ${multiplier.toFixed(3)}`,
      },
      {
        label: 'Step 3 — Calculate exit tension',
        expression: `T_exit = T_entry × multiplier = ${T0} lbf × ${multiplier.toFixed(3)}`,
        result: `T_exit = ${Texit} lbf`,
      },
      {
        label: 'Step 4 — Compare to cable limit',
        expression: `Cable limit = 600 lbf. T_exit = ${Texit} lbf. Utilization = ${Texit}/600 = ${percentOfLimit}%`,
        result: passes
          ? `${Texit} lbf ≤ 600 lbf — PASSES. Cable is within rated tension. ✓`
          : `${Texit} lbf > 600 lbf — FAILS. Entry tension is too high; reduce to stay under limit.`,
      },
      {
        label: 'Sanity check',
        expression: `Each 90° bend at μ=0.25 multiplies tension by e^(0.25 × π/2) ≈ 1.48. Two bends: 1.48 × 1.48 = ${multiplier.toFixed(3)}. Every additional 90° bend adds roughly 48% more tension at the exit.`,
        result: `With ${bends} × 90° bends, exit tension is ${multiplier.toFixed(2)}× the entry tension.`,
      },
    ];
  };

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you pull a cable or conduit through underground duct, it generates friction
          against the duct walls. Every bend in the duct multiplies that friction. At the
          wrong tension, the cable jacket crushes, the conduit kinks, or the swivel snaps —
          and you've got an expensive problem that requires exposing the duct and starting
          over.
        </p>
        <p className="mt-2">
          The good news: the math tells you the safe tension before you start pulling.
          This lesson walks through the two numbers you need to know — the cable's maximum
          rated pull tension (600 lbf for most OSP fiber) and how to calculate whether
          the tension at the far end of your pull will stay under that limit.
        </p>

        <h3 className="mt-5 font-semibold">The 40% fill rule — convention, not code</h3>
        <p>
          You've probably heard "don't fill the conduit more than 40%." That's an industry
          convention for traditional pulled installations — if the cables fill more than 40%
          of the conduit area, the friction and pull tension tend to get problematic. It
          comes from telecommunications industry practice codified by BICSI and widely
          reproduced, but{' '}
          <strong>it is NOT a mandatory NEC code requirement for telecom cable.</strong>
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          NEC 770.110(B) and 800.110(B) exempt communications cables from the fill tables
          in NEC Chapter 9 Table 1 that apply to electrical wiring. The 40% figure is an
          industry convention for traditional pull installations — a good rule of thumb,
          but not a codified requirement for fiber. For microduct jetting (where air
          pressure drives the cable, not mechanical pull tension), fill ratios of 50–70%+
          are normal and accepted.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L05"
            cards={[
              {
                id: 'T10-L05-fc-pull-tension',
                front: 'What is the representative maximum pull tension for OSP loose-tube fiber cable?',
                back: '600 lbf (pounds-force) per Corning SRP-005-011 and OCC 206-2. Always verify the specific cable datasheet — this is a representative value, not universal. Exceeding it risks cable jacket crushing or fiber damage.',
              },
              {
                id: 'T10-L05-fc-capstan',
                front: 'What does the capstan formula calculate?',
                back: 'How friction at a conduit bend multiplies cable tension from one side of the bend to the other. Formula: T_exit = T_entry × e^(μ × θ), where μ is friction coefficient (0.25 for dry PVC) and θ is bend angle in radians (90° = π/2). Each 90° bend at μ=0.25 multiplies tension by approximately 1.48.',
              },
              {
                id: 'T10-L05-fc-conduit-fill',
                front: 'What is the 40% conduit fill convention and why is it NOT a NEC mandate for telecom?',
                back: '40% fill is an industry convention for traditional pulled installations. NEC 770.110(B) and 800.110(B) exempt communications cables from NEC Chapter 9 Table 1 fill requirements. The 40% rule is a good field guideline for managing pull tension — not a code requirement for fiber.',
              },
              {
                id: 'T10-L05-fc-mid-assist',
                front: 'What is a mid-assist capstan and when is it needed?',
                back: 'An intermediate capstan placed at a vault or handhole midpoint on a long pull to split the total tension across two shorter pulls. Needed when the cumulative effect of route length and bends would push exit tension above the cable\'s rated limit.',
              },
              {
                id: 'T10-L05-fc-fish-tape',
                front: 'What is a fish tape and when is it used in conduit work?',
                back: 'A steel or fiberglass tape threaded through a conduit to pull in a pull string or cable. The pull string is then used to pull the actual cable or conduit bundle. Used when the conduit is empty and there is no pre-installed pull string.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Capstan Formula: Calculating Cable-End Tension</h2>

        <h3 className="mt-4 font-semibold">Why the rig gauge isn't the whole story</h3>
        <p>
          The rig gauge — or the capstan machine's force gauge — reads the tension at the
          machine end of the pull. At the cable exit point (the far end), tension is
          <em> higher</em> because friction at every bend in the conduit run has multiplied it.
          You can be pulling at 300 lbf at the machine and simultaneously exceeding 600 lbf
          at the cable end if there are enough bends in the run.
        </p>

        <h3 className="mt-4 font-semibold">Capstan formula — the math behind every bend</h3>
        <p>
          The capstan equation models how a rope or cable's tension is amplified by friction
          when it wraps around a surface. For conduit pulls, the "wrapping surface" is the
          inside of the conduit at a bend:
        </p>
        <div className="my-4 p-4 bg-white/5 border border-white/10 rounded-lg font-mono text-center">
          <p className="text-lg">T_exit = T_entry × e<sup>(μ × θ)</sup></p>
          <p className="text-sm text-slate-400 mt-2">
            T_exit = tension at cable end | T_entry = tension applied at pull machine |
            μ = coefficient of friction | θ = total bend angle in radians | e ≈ 2.718
          </p>
        </div>

        <p>
          Variable definitions:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li><strong>μ (mu)</strong> — friction coefficient: 0.25 for dry PVC conduit (Corning installation guide); 0.33 for wet or dirty conduit; 0.15 with pulling lubricant</li>
          <li><strong>θ (theta)</strong> — total bend angle in radians: 90° = π/2 ≈ 1.571 rad; 180° = π ≈ 3.14 rad; multiply for multiple bends</li>
          <li><strong>e<sup>x</sup></strong> — exponential function (your calculator's e^x button)</li>
        </ul>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Worked Example: Capstan Formula</h3>
          <WorkedExample
            id="T10-L05-worked-capstan"
            title="Pull Tension at Cable Exit"
            description="Calculate the tension at the cable exit point for a conduit run with multiple 90-degree bends."
            variables={capstanVariables}
            computeSteps={capstanSteps}
          />
        </div>

        <h3 className="mt-6 font-semibold">The weakest-link rule for multi-duct bundles</h3>
        <p>
          When pulling a bundle of two or more sub-ducts (each rated for different maximum
          pull tension), the breakaway swivel must be set to the pull tension rating of the{' '}
          <strong>weakest duct in the bundle.</strong>
        </p>
        <p className="mt-2">
          Example: ducts rated 600/500/700 lbf → swivel set at 500 lbf. If the swivel
          is set at 600 lbf (thinking the average), the 500 lbf duct can be permanently
          deformed or split before the swivel breaks. The swivel protects the weakest link.
          Always set for the weakest link.
        </p>

        <h3 className="mt-6 font-semibold">When to add a mid-assist</h3>
        <p>
          Calculate your expected exit tension BEFORE pulling. If it comes out over 600 lbf
          (or your cable's specific limit), you have two options:
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300">
          <li>Add pulling lubricant — reduces μ from 0.25 to 0.15, substantially reducing the multiplier</li>
          <li>Install a mid-assist capstan at an intermediate vault — splits the route into two shorter pulls, each starting at near-zero tension</li>
        </ol>
        <p className="mt-2">
          On straight runs (no bends), friction adds tension linearly with distance (small
          for lightweight cable). On curved runs, the exponential multiplier at each bend
          dominates — even a 200-ft run with 3 bends can exceed a 2,000-ft straight run.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L05-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'You are pulling a single OSP loose-tube fiber cable (max pull tension: 600 lbf) through a conduit with three 90-degree bends. The pull machine gauge reads 200 lbf. μ = 0.25. Is the installation within the cable\'s rated tension? (Use: multiplier per 90° bend ≈ 1.48; three 90° bends ≈ 3.24×)',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Yes — the gauge reads 200 lbf, well under the 600 lbf limit' },
                  { id: 'b', text: 'No — exit tension ≈ 200 × 3.24 = 648 lbf, which exceeds the 600 lbf limit' },
                  { id: 'c', text: 'Uncertain — you need to know the conduit length to calculate exit tension' },
                  { id: 'd', text: 'Yes — the multiplier only applies to the weakest duct in a bundle' },
                ],
                correctId: 'b',
                explanation:
                  'The gauge reads tension at the machine (200 lbf). With three 90° bends and μ=0.25, the multiplier is e^(0.25 × 3 × π/2) = e^(1.178) ≈ 3.25. Exit tension ≈ 200 × 3.25 = 650 lbf — over the 600 lbf limit. You need to either reduce the entry tension (pull slower/less force), add lubricant to reduce μ, or add a mid-assist to split the run.',
              },
              {
                id: 'q2',
                text: 'An inspector cites you for exceeding the NEC 40% conduit fill limit on your fiber installation. Is this citation valid?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Yes — NEC Chapter 9 Table 1 mandates 40% fill for all cable types' },
                  { id: 'b', text: 'No — NEC 770.110(B) and 800.110(B) exempt communications cables from NEC Chapter 9 fill tables; 40% is an industry convention, not a NEC mandate for fiber' },
                  { id: 'c', text: 'Yes — 40% is a TIA mandate that the NEC incorporates by reference' },
                  { id: 'd', text: 'It depends on whether the conduit carries other wiring methods alongside the fiber' },
                ],
                correctId: 'b',
                explanation:
                  'NEC Articles 770 and 800 (optical fiber and communications cables) each contain an explicit provision (770.110(B) and 800.110(B)) exempting those cable types from NEC Chapter 9 Table 1 fill calculations. The 40% fill figure is an industry convention from BICSI and similar organizations — a reasonable guideline for managing pull friction, but not a codified NEC requirement for fiber or telecom cable.',
              },
              {
                id: 'q3',
                text: 'A pulling crew adds wire-pulling lubricant to the conduit before a long pull. In the capstan tension equation T_exit = T_entry × e^(μθ), what effect does the lubricant have and why does it matter?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Lubricant increases μ by filling the air gap between cable and conduit — exit tension increases' },
                  { id: 'b', text: 'Lubricant reduces the friction coefficient μ, which reduces exit tension and lowers the risk of exceeding the cable\'s maximum pulling force rating' },
                  { id: 'c', text: 'Lubricant reduces the entry tension T_entry — the gauge will read lower' },
                  { id: 'd', text: 'Lubricant has no effect on the equation — it only prevents jacket surface scuffing' },
                ],
                correctId: 'b',
                explanation:
                  'Lubricant lowers the coefficient of friction μ between the cable jacket and conduit inner wall. In T_exit = T_entry × e^(μθ), a lower μ produces a smaller exponent, reducing e^(μθ) and therefore reducing exit tension. On a run with three 90-degree bends and an unlubricant μ of 0.35, the multiplier is e^(0.35×3×π/2) ≈ 5.2×. With lubricant dropping μ to 0.15, the multiplier falls to e^(0.15×3×π/2) ≈ 2.0× — cutting the exit tension to less than half.',
              },
              {
                id: 'q4',
                text: 'Three OSP fiber cables, each with a 1.125-inch outside diameter, are to be pulled through a single 2-inch inside-diameter conduit. Approximately what is the conduit fill percentage, and does it exceed the 40% industry guideline?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '≈ 28% — within the 40% guideline' },
                  { id: 'b', text: '≈ 57% — exceeds the 40% guideline moderately' },
                  { id: 'c', text: '≈ 95% — far exceeds the 40% guideline; this conduit is too small for three cables' },
                  { id: 'd', text: '≈ 40% — exactly at the guideline boundary' },
                ],
                correctId: 'c',
                explanation:
                  'Fill % = (sum of cable cross-section areas) ÷ (conduit inner area) × 100. Each cable: π × (0.5625 in)² ≈ 0.995 in²; three cables: 2.985 in². Conduit inner area: π × (1 in)² ≈ 3.14 in². Fill = 2.985 ÷ 3.14 ≈ 95%. Far exceeds the 40% convention. Three 1.125-inch cables require at least a 3-inch conduit (fill ≈ 42%) or ideally a 4-inch conduit (fill ≈ 24%). This error is caught by running the fill calculation before procurement — not after the pull machine stalls.',
              },
              {
                id: 'q5',
                type: 'fill-in-blank',
                text: 'In the capstan tension equation T_exit = T_entry × e^(μθ), the symbol μ represents the ___ coefficient between the cable jacket and conduit wall.',
                answer: 'friction',
                explanation:
                  'μ (mu) is the coefficient of friction — a dimensionless ratio of the frictional force to the normal force pressing the cable against the conduit wall. Typical values range from 0.35–0.50 for dry conduit to 0.10–0.20 with wire-pulling lubricant. The θ term is the total angle of bends in radians (a 90° bend = π/2 radians). The exponential relationship means that multiple bends compound — two 90° bends with μ = 0.25 give a multiplier of e^(0.25 × π) ≈ 2.19×.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Microduct Jetting and Multi-Duct HDD Tension</h2>

        <h3 className="mt-4 font-semibold">Microduct jetting — a different physics model</h3>
        <p>
          Microduct jetting (blowing fiber into microduct using compressed air) does not
          apply the capstan formula in the same way. The air pressure acts on the cable
          cross-section along its entire length, not just at the entry point. The friction
          at bends still matters, but the driving force is distributed rather than applied
          at one end.
        </p>
        <p className="mt-2">
          For jetting, the relevant specification is the maximum installation distance and
          maximum air pressure from the cable and microduct manufacturers. Fill ratios for
          jetting applications routinely run 50–70% (some manufacturers up to 80%) without
          exceeding pull tension because the distributed air drive reduces the mechanical
          tension at any individual point. Attempting to apply a 40% fill limit to a jetting
          application would unnecessarily constrain the design.
        </p>

        <h3 className="mt-4 font-semibold">Pre-pull tension calculation discipline</h3>
        <p>
          On any conduit run with more than one bend, calculate the expected exit tension
          before sending the crew to pull. The capstan formula takes 90 seconds on a phone
          calculator. The cost of a failed pull (exposing conduit, splicing cable, re-running
          the pull) is orders of magnitude more.
        </p>
        <p className="mt-2">
          Pre-pull checklist:
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li>Get the cable datasheet — confirm max pull tension (don't assume 600 lbf)</li>
          <li>Count the bends in the conduit run and their angles</li>
          <li>Estimate μ (dry conduit = 0.25; lubricated = 0.15; old dirty conduit = 0.33)</li>
          <li>Calculate T_exit = T_entry × e^(μ × Σθ) for expected entry tension</li>
          <li>If T_exit &gt; cable limit: add lubricant, add mid-assist, or route the conduit to reduce bends</li>
          <li>Set the breakaway swivel before the pull — not afterward</li>
        </ol>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Pull-tension math is where OSP physics (T02), underground design (T06), and construction
          execution (T10) converge into a single decision: can this cable survive this pull?
          The capstan formula you applied here relies on the coefficient of friction for PVC conduit —
          a value that only makes sense in context of the conduit types covered in T06.L03 and the
          fill conventions from T06.L04. The 600 lbf maximum pull tension is the weakest-link constraint
          imposed by the cable's tensile strength rating, which is an intrinsic property of the
          loose-tube cable construction covered in T02.L03. When you set a breakaway swivel calibrated
          to 90% of that limit, you are protecting a fiber design with a specific count and sheath
          geometry that the designer specified in T06 — and a failed pull that snaps the cable without
          a swivel costs the entire cable segment plus excavation to reopen. This tension discipline
          also gates the slack-loop lesson that follows in T10.L06: slack loops require the cable to
          exit the conduit with enough residual length to coil, and that only works if the pull
          succeeded without stretch damage to the fiber core.
        </p>
      </section>
    </LessonLayout>
  );
}
