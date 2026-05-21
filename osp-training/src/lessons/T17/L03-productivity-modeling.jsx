import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L03',
  course_id: 'T17',
  title: 'Productivity Modeling — The Real Driver',
  order: 3,
  prerequisites: ['T17.L02'],
  learning_objectives: [
    'Define crew productivity in terms of installed units per crew-day',
    'Explain why labor productivity is the dominant variable in OSP construction cost',
    'Convert productivity rates into labor-hour estimates for aerial and underground work',
    'Identify the factors that degrade crew productivity and quantify their effect',
    'Apply a productivity model to validate or challenge a subcontractor quote',
  ],
  estimated_minutes: 38,
  vocabulary_introduced: [
    'crew productivity rate',
    'crew-day',
    'labor burden',
    'production unit',
    'crew loading',
    'productivity factor (efficiency factor)',
  ],
  vocabulary_assumed: [
    { term: 'unit cost (construction)', source_lesson_id: 'T17.L01' },
    { term: 'direct cost', source_lesson_id: 'T17.L01' },
    { term: 'indirect cost / overhead', source_lesson_id: 'T17.L01' },
    { term: 'make-ready cost', source_lesson_id: 'T17.L02' },
    { term: 'lashed aerial cable', source_lesson_id: 'T17.L02' },
    { term: 'ADSS (All-Dielectric Self-Supporting)', source_lesson_id: 'T17.L02' },
    { term: 'bore cost', source_lesson_id: 'T17.L02' },
    { term: 'pavement restoration', source_lesson_id: 'T06.L01' },
    { term: 'force account labor', source_lesson_id: 'T17.L02' },
    { term: 'cost per foot (CPFT)', source_lesson_id: 'T17.L01' },
  ],
};

const key_terms = [
  {
    term: 'crew productivity rate',
    definition:
      'The amount of work a specific crew configuration accomplishes in one working day under specific conditions. Expressed as production units per crew-day — for example, 800 ft of cable lashed per crew-day for a 3-person aerial lashing crew in flat terrain. Productivity rates are site-specific and must be calibrated to local conditions.',
  },
  {
    term: 'crew-day',
    definition:
      'One calendar day of work for a defined crew configuration. A "2-person crew-day" is different from a "5-person crew-day" — when comparing productivity rates, always verify whether the rate is per person or per crew and what the crew size is.',
  },
  {
    term: 'labor burden',
    definition:
      'The total cost of employment beyond base wages. Labor burden includes payroll taxes (FICA, FUTA, SUTA), workers\' compensation insurance, health insurance, retirement contributions, and paid time off. Burden rates typically run 28–45% on top of base wages depending on the state, union status, and benefits package.',
  },
  {
    term: 'production unit',
    definition:
      'The measurable unit used to track construction progress and drive cost. Common OSP production units: feet of cable installed (aerial or underground), splice closures completed, handholes set, conduit feet pulled, service drops completed. Every line item in a unit-price contract is denominated in a production unit.',
  },
  {
    term: 'crew loading',
    definition:
      'The number of crews working simultaneously on a project and the way work is divided among them. Optimal crew loading matches crew count to the available work front — too few crews = slow progress, too many crews = bottlenecks where crews are waiting on each other.',
  },
  {
    term: 'productivity factor (efficiency factor)',
    definition:
      'A multiplier applied to a baseline productivity rate to account for conditions that slow or speed up a crew. A productivity factor of 0.70 means the crew operates at 70% of baseline productivity — for example, 800 ft/day baseline × 0.70 = 560 ft/day in difficult terrain. Factors below 1.0 represent degraded conditions; factors above 1.0 are rare and represent ideal conditions.',
  },
];

export { key_terms };

const productivityWorkedExample = {
  title: 'Converting Productivity Rates Into a Labor-Hour Estimate',
  description:
    'A 4.2-mile aerial lash project. Build the labor-hour estimate from productivity benchmarks, then convert to cost.',
  variables: [
    { symbol: 'L_ft', name: 'Route length', value: '22,176', unit: 'ft' },
    { symbol: 'P_base', name: 'Baseline lash rate (flat, clean, 3-person crew)', value: '1,200', unit: 'ft/crew-day' },
    { symbol: 'PF', name: 'Productivity factor (moderate terrain + some obstructions)', value: '0.75', unit: 'dimensionless' },
    { symbol: 'P_adj', name: 'Adjusted productivity', value: '900', unit: 'ft/crew-day' },
    { symbol: 'crew_size', name: 'Crew size', value: '3', unit: 'workers' },
    { symbol: 'day_rate', name: 'Worker loaded day rate (wage + burden)', value: '$520', unit: '/worker/day' },
  ],
  steps: [
    {
      label: 'Step 1 — Adjust baseline productivity for site conditions',
      expression: 'P_adj = P_base × PF = 1,200 ft/day × 0.75 = 900 ft/crew-day',
      explanation:
        'The baseline of 1,200 ft/crew-day assumes flat terrain and unobstructed access. This route has moderate rolling terrain and intermittent tree canopy. A productivity factor of 0.75 (75% of baseline) accounts for the slower pace — crews repositioning bucket trucks around trees and managing hillside tension.',
    },
    {
      label: 'Step 2 — Calculate crew-days required',
      expression: 'Crew-days = L_ft ÷ P_adj = 22,176 ÷ 900 = 24.6 ≈ 25 crew-days',
      explanation:
        'Dividing route feet by adjusted productivity gives crew-days needed. Round up (25 days) — partial days still cost a full day-rate for crew mobilization and demobilization.',
    },
    {
      label: 'Step 3 — Calculate total person-days',
      expression: 'Person-days = crew_days × crew_size = 25 × 3 = 75 person-days',
      explanation:
        'A 3-person crew working 25 days = 75 person-days of labor. This is the basis for labor cost calculation.',
    },
    {
      label: 'Step 4 — Convert to labor cost',
      expression: 'Labor = Person-days × day_rate = 75 × $520 = $39,000',
      explanation:
        'At a loaded day rate of $520/worker/day (base wage ~$27–$32/hr × 8 hr + burden at ~35%), 75 person-days = $39,000 in labor cost. Note: $520/day is an estimate for a journeyman aerial splicer/installer in a right-to-work state — rates are significantly higher in union markets ($700–$950/day loaded).',
    },
    {
      label: 'Step 5 — Calculate labor cost per foot',
      expression: 'Labor CPFT = $39,000 ÷ 22,176 ft = $1.76/ft (labor only)',
      explanation:
        'This $1.76/ft is just the lashing labor — no materials, no strand, no make-ready, no overhead. Labor is the starting point, not the whole number. Add material costs from L02 to get to total direct cost.',
    },
    {
      label: 'Step 6 — Sanity check against FBA benchmark',
      expression: 'FBA aerial median $6.55/ft. Labor at $1.76/ft = 26.9% of total. Labor as % of OSP total is typically 60–80% per FBA.',
      explanation:
        'Something seems off — this labor rate is only 27% of the FBA median, far below the 60–80% labor fraction. The discrepancy comes from two sources: (1) the lashing labor rate used here is lower than an all-in crew rate that would include strand installation, make-ready, and management overhead; (2) $6.55/ft is a median across many project types including those with heavy make-ready. For this specific scope (lashing only, no make-ready), $1.76/ft labor is plausible — but the estimator must still add make-ready, materials, overhead, and profit to get a complete number.',
  },
  ],
  sanityCheck:
    'The labor-only calculation of $1.76/ft for lashing is reasonable as a partial scope. A complete estimate adding moderate make-ready ($2.25/ft equivalent), materials ($1.10/ft strand + cable), splices ($0.18/ft), mobilization ($0.12/ft), overhead (18%), and profit (10%) would yield approximately $5.29/ft — consistent with the aerial estimate in L02. Productivity modeling is how you build that labor line from first principles rather than guessing.',
};

const quizQuestions = [
  {
    id: 'T17L03_q1',
    question:
      'A crew has a baseline productivity of 600 ft/day for underground conduit installation in easy sandy soil. The next project is through rocky fill in an urban area. What productivity factor range is most appropriate to apply?',
    options: [
      '0.90–0.95 — minor degradation expected in urban environments',
      '0.70–0.80 — moderate degradation for difficult soil in urban setting',
      '0.40–0.60 — severe degradation for rocky soil in urban environment',
      '1.10–1.20 — experienced crew with modern equipment outperforms baseline',
    ],
    correct: 2,
    explanation:
      'Rocky fill in an urban environment combines two major productivity killers: hard rock requiring rotary cutting or pre-drilling rather than direct bore, and urban congestion (utility conflicts, traffic management delays, limited staging space). Productivity factors of 0.40–0.60 are common in these conditions, meaning the crew may accomplish only 240–360 ft/day instead of the 600 ft/day baseline. Applying a 0.90 factor would produce a severely underestimated schedule and budget.',
  },
  {
    id: 'T17L03_q2',
    question:
      'Labor burden is described as "running 28–45% on top of base wages." If a splicer earns a base wage of $34/hr and burden is 38%, what is the loaded hourly cost to the employer?',
    options: [
      '$34.00/hr — burden is included in the stated wage rate',
      '$38.72/hr — burden is 38% of wages divided by total hours',
      '$46.92/hr — base plus 38% burden',
      '$72.00/hr — standard union loaded rate regardless of base wage',
    ],
    correct: 2,
    explanation:
      'Labor burden is calculated as a percentage of base wages and added on top. $34.00 × 1.38 = $46.92/hr loaded. This covers the employer\'s share of FICA (7.65%), FUTA/SUTA (~2–3%), workers\' compensation insurance (~5–12% for OSP construction), health insurance, retirement contributions, and paid time off. A $34/hr splicer actually costs the employer ~$47/hr before any overhead allocation.',
  },
  {
    id: 'T17L03_q3',
    question:
      'A subcontractor quotes $85,000 to install 8,500 ft of aerial strand and lash cable (a 2-item scope). Your productivity model says the work should require 18 crew-days for a 3-person crew at a loaded day rate of $520/worker/day. What does your model predict for labor cost alone?',
    options: [
      '$9,360 — 18 crew-days at $520/day (1 person)',
      '$28,080 — 18 crew-days × 3 persons × $520/day',
      '$41,040 — includes a 30% materials allowance',
      '$85,000 — the subcontractor quote should be used directly',
    ],
    correct: 1,
    explanation:
      'Labor = crew-days × crew_size × day_rate = 18 × 3 × $520 = $28,080. With materials (strand + cable + hardware) typically running $1.50–$2.00/ft × 8,500 ft = $12,750–$17,000, overhead at 18%, and profit at 10%, a fully-loaded estimate would be roughly $28,080 + $15,000 materials = $43,080 × 1.18 × 1.10 ≈ $55,900. The subcontractor quote of $85,000 is significantly above your model. This either means your productivity rate is too optimistic, the subcontractor knows something about site conditions that drives up their estimate, or the quote includes scope you haven\'t modeled. Before accepting or rejecting the quote, reconcile the gap.',
  },
  {
    id: 'T17L03_q4',
    question:
      'Which statement about the relationship between crew size and crew productivity is most accurate?',
    options: [
      'Doubling the crew size always doubles productivity — two crews do twice the work of one crew',
      'Productivity per person stays constant regardless of crew size — larger crews are always more efficient',
      'Productivity gains diminish as crew size increases beyond the optimal configuration for the work type',
      'Smaller crews are always more productive per person because of reduced coordination overhead',
    ],
    correct: 2,
    explanation:
      'For most OSP construction work, there is an optimal crew size dictated by the work type. An aerial lashing crew needs a truck driver, a bucket operator, and a ground-hand — three people. Adding a fourth person doesn\'t give you 133% productivity; the ground-hand is already adequate. For a splice operation, a splicer and one helper is often optimal — a three-person team may not reduce splice time proportionally. Beyond the optimal size, crew members spend time waiting on each other, and coordination overhead grows. Understanding the optimal crew size for each work type is part of realistic productivity modeling.',
  },
];

export default function L03ProductivityModeling() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>Labor Is 60–80% of What You're Estimating</h2>

        <p>
          If you remember one thing from this lesson: <strong>OSP construction cost is mostly a labor estimate.</strong>{' '}
          FBA/Cartesian data consistently shows labor at 60–80% of total deployed cost. Materials (fiber, conduit,
          hardware) are the smaller piece. Overhead and profit build on top. But the foundation — the number that drives
          everything else — is how long it takes your crew to do the work.
        </p>

        <p>
          That's productivity modeling: translating scope into crew-time, then crew-time into dollars.
        </p>

        <h3>What Is a Productivity Rate?</h3>

        <p>
          A <strong>crew productivity rate</strong> is simply how much work a specific crew accomplishes in one working
          day. For OSP construction, typical productivity rates are expressed as:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Work Type</th>
              <th>Crew Configuration</th>
              <th>Baseline Rate (ideal conditions)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aerial lashing (cable + wire)</td>
              <td>3-person crew (truck, bucket, ground)</td>
              <td>1,000–1,500 ft/day</td>
              <td>Flat terrain, no obstacles, short spans</td>
            </tr>
            <tr>
              <td>ADSS installation</td>
              <td>4-person crew (2 trucks, 2 climbers)</td>
              <td>800–1,200 ft/day</td>
              <td>Requires dead-end anchor setup per span</td>
            </tr>
            <tr>
              <td>Underground conduit (bore)</td>
              <td>4-person crew (drill + pipe team)</td>
              <td>400–800 ft/day</td>
              <td>Sandy/clay soil, no rock, no pavement cuts</td>
            </tr>
            <tr>
              <td>Underground conduit (open trench)</td>
              <td>3-person crew + excavator</td>
              <td>600–1,000 ft/day</td>
              <td>Open land, no restoration required</td>
            </tr>
            <tr>
              <td>Fusion splicing</td>
              <td>2-person team (splicer + helper)</td>
              <td>60–120 splices/day</td>
              <td>12-fiber ribbon counts; loose-tube is slower</td>
            </tr>
            <tr>
              <td>Service drop (aerial)</td>
              <td>2-person crew</td>
              <td>6–12 drops/day</td>
              <td>Depends on drop length and aerial vs. underground</td>
            </tr>
          </tbody>
        </table>

        <div className="callout callout-info">
          These are <strong>baseline rates for ideal conditions</strong>. Every real project deviates from ideal in
          some way. The productivity factor (efficiency factor) adjusts baseline rates for site conditions. Use these
          numbers as a starting point, not a guarantee.
        </div>

        <h3>What Degrades Productivity</h3>

        <p>
          Anything that forces the crew to slow down, wait, reposition, or solve problems rather than install cable
          reduces productivity. Common factors and their typical effect:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Productivity Factor Range</th>
              <th>Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hilly or mountainous terrain</td>
              <td>0.65–0.80</td>
              <td>Bucket trucks repositioning on grades; cable tension management; longer setup times per span</td>
            </tr>
            <tr>
              <td>Dense tree canopy</td>
              <td>0.70–0.85</td>
              <td>Manual hand-lashing required where bucket trucks can't get under; limb clearance work</td>
            </tr>
            <tr>
              <td>Urban traffic management</td>
              <td>0.70–0.80</td>
              <td>Lane closures require setup/teardown; flaggers limit work windows; permit-restricted hours</td>
            </tr>
            <tr>
              <td>Rocky soil (bore)</td>
              <td>0.30–0.60</td>
              <td>Rock requires rotary cutting equipment or blasting; progress measured in feet per hour, not per day</td>
            </tr>
            <tr>
              <td>Utility congestion (bore)</td>
              <td>0.60–0.80</td>
              <td>Tight quarters around existing utilities forces frequent depth changes and short bore runs</td>
            </tr>
            <tr>
              <td>Winter / extreme heat</td>
              <td>0.75–0.90</td>
              <td>Cold affects fusion splice quality and crew speed; extreme heat limits outdoor work hours</td>
            </tr>
            <tr>
              <td>Short route segments (frequent mob/demob)</td>
              <td>0.60–0.75</td>
              <td>Mobilization overhead amortized over fewer feet; crew spends more time setting up than producing</td>
            </tr>
          </tbody>
        </table>

        <p>
          Factors are multiplicative. A mountainous route (0.75) with dense canopy (0.80) has a combined factor of
          0.75 × 0.80 = 0.60 — the crew produces only 60% of baseline. That's a 40% labor cost increase for the same
          route length.
        </p>
      </section>

      {/* ── WORKED EXAMPLE ── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <strong className="text-blue-600 dark:text-blue-300">Quick Recall:</strong> <strong>Bore cost</strong> is the expense of directional drilling underground (from T06); <strong>pavement restoration</strong> is the cost to repair paved surfaces (from T06); <strong>lashed aerial cable</strong> is fiber installed on a separate messenger strand (from T02); <strong>ADSS</strong> is self-supporting aerial cable with no separate strand (from T02); and <strong>make-ready cost</strong> is the expense to prepare poles (from T02).
        </div>

        <h2>Productivity Model — Lashing Estimate Step by Step</h2>
        <WorkedExample {...productivityWorkedExample} />
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Using Productivity Models to Challenge Subcontractor Quotes</h2>

        <p>
          The productivity model you built in this lesson has a second use beyond estimating: it's a sanity check on
          subcontractor quotes. When a sub comes in significantly high or low, the productivity model tells you which
          scenario is actually plausible.
        </p>

        <p>
          <strong>Quote is significantly high:</strong> rebuild the productivity model. If your model says the work
          should take 18 crew-days and the sub's quote implies 30, there are three possibilities — (1) the sub is
          padding their estimate, (2) the sub knows something about site conditions that increases labor time, or (3)
          your productivity rate assumption is too optimistic. Call the sub and ask for their unit breakdown — not just
          a lump sum, but their estimated crew-days and crew cost. If they can't provide it, the quote may not be well
          supported.
        </p>

        <p>
          <strong>Quote is significantly low:</strong> the risk is different. A low-ball quote often means the sub
          hasn't accounted for a degrading factor you can see in the field data. If their quote implies 1,200 ft/day on
          a route with dense canopy and rolling terrain, they're estimating for ideal conditions they won't encounter.
          Low bids that don't hold up become change orders (which you'll study in L06) — and change orders on a
          low-bid contract are usually more expensive than a realistic original bid would have been.
        </p>

        <p>
          The productivity model doesn't replace the subcontractor's knowledge of their own crew and equipment.
          But it gives you a benchmark to ask intelligent questions and spot quotes that don't add up.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Productivity modeling is your second layer of cost control after direct-unit-cost estimation:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T17.L01 (Estimating Mindset)</strong> — established the four cost drivers. This lesson quantifies labor cost, which is typically 35–50% of direct cost. A wrong productivity model is a 10–30% estimate error.</li>
            <li><strong>T02.L03 (Fiber Splice — Splicing Labor)</strong> — splicing productivity (splices per day per fusion splicer) is a specific case of the general productivity principle. Field data from real splice work feeds your benchmarks for future estimates.</li>
            <li><strong>T17.L04 (Bill of Materials)</strong> — labor hours from your productivity model become the crew-hours line item in the BOM. That crew-hours quantity × your crew rate = your labor cost for the contract.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The most dangerous estimates are those that use unit costs from old projects but apply them to new crew compositions. A productivity model is your defense against accidentally bidding a job that should cost $50K as if it will only cost $20K.
          </p>
        </section>
      </section>

      {/* ── FLASHCARDS ── */}
      <section className="lesson-section">
        <h2>Key Terms</h2>
        <button className="btn-secondary" onClick={() => setShowCards(!showCards)}>
          {showCards ? 'Hide Flashcards' : 'Study Flashcards'}
        </button>
        {showCards && (
          <div className="flashcard-grid">
            {key_terms.map((term) => (
              <Flashcard key={term.term} term={term.term} definition={term.definition} />
            ))}
          </div>
        )}
      </section>

      {/* ── QUIZ ── */}
      <section className="lesson-section">
        <h2>Check Your Understanding</h2>
        <Quiz questions={quizQuestions} lessonId="T17.L03" />
      </section>
    </LessonLayout>
  );
}
