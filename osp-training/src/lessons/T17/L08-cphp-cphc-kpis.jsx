import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';

export const meta = {
  id: 'T17.L08',
  course_id: 'T17',
  title: 'CPHP, CPHC, and FTTH Financial KPIs',
  order: 8,
  prerequisites: ['T17.L07'],
  learning_objectives: [
    'Calculate Cost per Home Passed (CPHP) from total build cost and homes passed',
    'Calculate Cost per Home Connected (CPHC) from CPHP and take rate',
    'Explain why CPHP and CPHC are distinct metrics and must not be conflated',
    'Define take rate and explain its role in evaluating FTTH project viability',
    'Interpret CPHP and CPHC benchmark values from FBA/Cartesian industry data',
  ],
  estimated_minutes: 40,
  vocabulary_introduced: [
    'cost per home passed (CPHP)',
    'cost per home connected (CPHC)',
    'homes passed',
    'take rate',
    'subscriber penetration rate',
    'addressable location',
  ],
  vocabulary_assumed: [
    'unit cost (construction)',
    'cost per foot (CPFT)',
    'direct cost',
    'indirect cost / overhead',
    'contingency allowance',
    'escalation allowance',
    'splitter (passive optical)',
    'FDH (Fiber Distribution Hub)',
    'GPON',
    'aerial cable',
    'underground conduit',
  ],
};

const key_terms = [
  {
    term: 'cost per home passed (CPHP)',
    definition:
      'Total build cost divided by the number of homes (or addressable locations) passed by the network — regardless of whether those homes have subscribed to service. CPHP = Total Build Cost ÷ Homes Passed. CPHP measures the cost efficiency of the network infrastructure build.',
  },
  {
    term: 'cost per home connected (CPHC)',
    definition:
      'Total build cost divided by the number of homes actually subscribed to service (connected). CPHC = Total Build Cost ÷ Homes Connected = CPHP ÷ Take Rate. CPHC measures how much the network costs per paying customer. CPHC is always higher than CPHP because take rate is always less than 100%.',
  },
  {
    term: 'homes passed',
    definition:
      'The number of residential addresses (or addressable locations) that are within the service area of a deployed network and could receive service without additional outside plant construction. A home is "passed" when the network is deployed to the street, pole, or pedestal in front of it — even if the homeowner hasn\'t ordered service yet.',
  },
  {
    term: 'take rate',
    definition:
      'The percentage of homes passed that actually subscribe to service. Take rate = Homes Connected ÷ Homes Passed. A take rate of 40% means 40 out of every 100 homes passed have subscribed. Take rate is one of the most critical variables in FTTH project financial modeling — a project that is viable at 40% take rate may be unviable at 25% take rate with the same build cost.',
  },
  {
    term: 'subscriber penetration rate',
    definition:
      'Essentially synonymous with take rate in the FTTH context — the fraction of potential customers in the service area who have subscribed to service. Sometimes used to distinguish between "addressable penetration" (out of all homes passed) and "active penetration" (out of homes actually marketable/serviceable at a given time).',
  },
  {
    term: 'addressable location',
    definition:
      'Any location that can receive service from the network — residential homes, businesses, multi-family units, and any other serviceable endpoint. In rural broadband programs (BEAD, RUS), programs count "locations" (using FCC challenge process or NTIA Broadband Data Collection) rather than just households, because businesses, anchor institutions, and farms are also served.',
  },
];

export { key_terms };

const cphpWorkedExample = {
  title: 'CPHP and CPHC — Side-by-Side Calculation',
  description:
    'A rural co-op builds a 38-mile FTTH network serving a sparse rural area. Calculate CPHP and CPHC, then analyze what happens to CPHC if take rate changes.',
  variables: [
    { symbol: 'Build_Cost', name: 'Total build cost (including contingency, engineering)', value: '$6,840,000', unit: '' },
    { symbol: 'HP', name: 'Total homes passed', value: '1,520', unit: 'locations' },
    { symbol: 'TR_base', name: 'Take rate (base case)', value: '38%', unit: '' },
    { symbol: 'TR_low', name: 'Take rate (low case)', value: '22%', unit: '' },
    { symbol: 'TR_high', name: 'Take rate (high case)', value: '55%', unit: '' },
  ],
  steps: [
    {
      label: 'Step 1 — Calculate CPHP',
      expression: 'CPHP = Build_Cost ÷ HP = $6,840,000 ÷ 1,520 = $4,500/home passed',
      explanation:
        'CPHP is a straight division: total project cost divided by total homes passed. At $4,500 per home passed, this is an expensive rural build — reflecting the low density (38 miles for 1,520 homes = 40 homes/mile, typical of sparse rural areas). FBA/Cartesian 2024 benchmarks show rural CPHP ranging from $2,000 to $8,000+ per home passed depending on density.',
    },
    {
      label: 'Step 2 — Calculate CPHC at base take rate',
      expression: 'CPHC = CPHP ÷ Take Rate = $4,500 ÷ 0.38 = $11,842 per connected home',
      explanation:
        'At 38% take rate, the cost per paying customer is $11,842. This is a critical metric for understanding whether the project can be justified financially.',
    },
    {
      label: 'Step 3 — Verify: CPHC = Total Cost ÷ Homes Connected',
      expression: 'Homes Connected = 1,520 × 0.38 = 578. CPHC = $6,840,000 ÷ 578 = $11,834 ✓ (rounding)',
      explanation:
        'Both formulas give the same result (small rounding difference). CPHC = CPHP ÷ take rate is the shortcut; Total Cost ÷ Homes Connected is the direct calculation. Either works.',
    },
    {
      label: 'Step 4 — CPHC at low take rate (22%)',
      expression: 'CPHC_low = $4,500 ÷ 0.22 = $20,455 per connected home',
      explanation:
        'If take rate falls to 22% (only 334 homes connect), the cost per connected home balloons to $20,455. The build cost doesn\'t change; fewer subscribers are amortizing the same infrastructure.',
    },
    {
      label: 'Step 5 — CPHC at high take rate (55%)',
      expression: 'CPHC_high = $4,500 ÷ 0.55 = $8,182 per connected home',
      explanation:
        'If take rate reaches 55% (836 homes connect), CPHC drops to $8,182. More subscribers amortizing the same build cost.',
    },
    {
      label: 'Step 6 — Interpret the range',
      expression: 'CPHC range: $8,182 (55% TR) to $20,455 (22% TR). Difference = $12,273/home — driven entirely by take rate, not by build cost.',
      explanation:
        'The build cost is fixed. The CPHC variance of $12,273 per home is entirely driven by take rate. This is why take rate is the single most important variable in FTTH financial modeling — it doesn\'t affect CPHP, but it dominates CPHC.',
    },
  ],
  sanityCheck:
    'These numbers are consistent with FBA/Cartesian 2024 CPHP benchmarks for rural dense builds ($3,000–$6,000/HP). The CPHC range ($8,182–$20,455) illustrates a critical point: at 22% take rate, this project costs more to connect each customer than many urban FTTH builds that cost 3× as much per foot to build — because urban density generates 3× as many customers per foot.',
};

const quizQuestions = [
  {
    id: 'T17L08_q1',
    question:
      'A project executive says "Our CPHP is $3,200, which is excellent — this project is financially viable." What critical information is missing from this assessment?',
    options: [
      'The project is financially viable if CPHP is below $5,000 — $3,200 means the project is confirmed viable',
      'CPHP tells you infrastructure efficiency but says nothing about financial viability — take rate (and ARPU and operating cost) determine viability',
      'CPHP should be evaluated against the per-mile cost benchmark, not the per-home benchmark',
      'A $3,200 CPHP is only viable if the project uses RUS grant funding',
    ],
    correct: 1,
    explanation:
      'CPHP tells you how efficiently you built the infrastructure. It says nothing about financial viability. A $3,200 CPHP project at 15% take rate has CPHC = $3,200 ÷ 0.15 = $21,333 per connected customer — potentially unviable. The same $3,200 CPHP at 60% take rate has CPHC = $5,333 — potentially very viable. Financial viability requires both: CPHP (infrastructure efficiency) AND take rate AND ARPU AND operating costs. CPHP alone tells you the supply side; revenue (ARPU × subscribers) tells you the demand side; viability requires both.',
  },
  {
    id: 'T17L08_q2',
    question:
      'A network passes 2,400 homes and 180 businesses. Total build cost was $8,160,000. What is the CPHP if homes and businesses are counted equally as "addressable locations"?',
    options: [
      '$3,400/HP — total cost divided by residential homes only',
      '$3,200/HP — total cost divided by all addressable locations (2,400 + 180 = 2,580)',
      '$4,000/HP — total cost divided by homes passed only, adjusted for density factor',
      '$45,333/HP — total cost divided by business locations only',
    ],
    correct: 1,
    explanation:
      '$8,160,000 ÷ (2,400 + 180) = $8,160,000 ÷ 2,580 = $3,163 per addressable location. The closest answer is B at $3,200 (rounding). CPHP uses total addressable locations — both residential and business — when the build serves both. Some programs (like BEAD) track residential and business locations separately, but for a holistic CPHP metric, you count everything the network can serve.',
  },
  {
    id: 'T17L08_q3',
    question:
      'Why is CPHC always greater than CPHP?',
    options: [
      'CPHC includes operating costs that CPHP excludes',
      'CPHC is calculated from the capital cost before contingency; CPHP uses the total cost after contingency',
      'Take rate is always less than 100% — fewer homes connect than pass, so the cost per connected home is always higher than the cost per passed home',
      'CPHC accounts for service drop costs that CPHP excludes',
    ],
    correct: 2,
    explanation:
      'CPHC = CPHP ÷ Take Rate. Since take rate is always a fraction less than 1 (less than 100% of homes will ever subscribe), dividing CPHP by a number less than 1 always gives a larger result. If take rate were 100% (every home subscribed), CPHC = CPHP. Since take rate is never 100% in practice, CPHC is always greater than CPHP. The lower the take rate, the greater the spread between CPHP and CPHC.',
  },
  {
    id: 'T17L08_q4',
    question:
      'A project has CPHP = $2,800 and take rate = 31%. A second project has CPHP = $5,200 and take rate = 67%. Which project has a lower CPHC?',
    options: [
      'Project 1 ($2,800 CPHP) — lower CPHP always means lower CPHC',
      'Project 2 ($5,200 CPHP) — the higher take rate more than compensates for the higher CPHP',
      'They are equal — the difference in CPHP and take rate cancel out',
      'Cannot be determined without knowing the total homes passed for each project',
    ],
    correct: 1,
    explanation:
      'Calculate both: Project 1: CPHC = $2,800 ÷ 0.31 = $9,032. Project 2: CPHC = $5,200 ÷ 0.67 = $7,761. Project 2 has LOWER CPHC despite having almost double the CPHP. The 67% take rate more than compensates for the higher build cost per home. This is the most important lesson of CPHP vs. CPHC: a project can look expensive by CPHP and cheap by CPHC (dense urban area with high take rate) or cheap by CPHP and expensive by CPHC (sparse rural area with low take rate). Never evaluate FTTH projects by CPHP alone.',
  },
];

export default function L08CphpCphcKpis() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>Two Metrics That Are NOT the Same</h2>

        <div className="callout callout-warning">
          <strong>CPHP ≠ CPHC.</strong> These are two completely different metrics. Confusing them is one of the most
          common mistakes in FTTH project financial discussions. This lesson is specifically about understanding
          the difference — and using each one correctly.
        </div>

        <p>
          <strong>Cost per Home Passed (CPHP)</strong> answers the question: <em>How much did it cost to deploy the
          network to each potential customer?</em> It's a measure of infrastructure efficiency.
        </p>

        <p>
          <strong>Cost per Home Connected (CPHC)</strong> answers a different question: <em>How much did the network
          cost per paying subscriber?</em> It's a measure of economic performance — how the infrastructure cost is
          borne by actual customers.
        </p>

        <h3>The Formulas</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Formula</th>
              <th>What It Measures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>CPHP</strong></td>
              <td>Total Build Cost ÷ Homes Passed</td>
              <td>Infrastructure deployment efficiency (supply side)</td>
            </tr>
            <tr>
              <td><strong>CPHC</strong></td>
              <td>Total Build Cost ÷ Homes Connected<br />— OR —<br />CPHP ÷ Take Rate</td>
              <td>Network cost per paying customer (demand side)</td>
            </tr>
            <tr>
              <td><strong>Take Rate</strong></td>
              <td>Homes Connected ÷ Homes Passed</td>
              <td>Market penetration — fraction of passed homes that subscribed</td>
            </tr>
          </tbody>
        </table>

        <h3>Why Take Rate Is the Bridge Between CPHP and CPHC</h3>

        <p>
          Take rate is the multiplier that transforms CPHP (what it costs to build past a home) into CPHC (what it
          costs per customer who actually buys service). The math: CPHC = CPHP ÷ Take Rate.
        </p>

        <p>
          Plug in some numbers to see the effect:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>CPHP</th>
              <th>Take Rate</th>
              <th>CPHC</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>$3,000</td>
              <td>70%</td>
              <td>$4,286</td>
              <td>Dense suburban; high take rate offsets modest CPHP</td>
            </tr>
            <tr>
              <td>$3,000</td>
              <td>30%</td>
              <td>$10,000</td>
              <td>Same density, low take rate (competitive market) — CPHC triples</td>
            </tr>
            <tr>
              <td>$6,000</td>
              <td>60%</td>
              <td>$10,000</td>
              <td>Higher CPHP (rural), high take rate (unserved market) — same CPHC</td>
            </tr>
            <tr>
              <td>$6,000</td>
              <td>20%</td>
              <td>$30,000</td>
              <td>High CPHP + low take rate = potentially unviable CPHC</td>
            </tr>
          </tbody>
        </table>

        <h3>Industry Benchmark Context (FBA/Cartesian 2024)</h3>

        <p>
          FBA/Cartesian 2024 FTTH deployment data provides context for interpreting CPHP:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Market Type</th>
              <th>Typical CPHP Range</th>
              <th>Typical Take Rate Range</th>
              <th>Resulting CPHC Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dense urban (200+ homes/mile)</td>
              <td>$800–$2,000</td>
              <td>25–45%</td>
              <td>$1,778–$8,000</td>
            </tr>
            <tr>
              <td>Suburban (80–200 homes/mile)</td>
              <td>$1,500–$3,500</td>
              <td>35–55%</td>
              <td>$2,727–$10,000</td>
            </tr>
            <tr>
              <td>Rural (20–80 homes/mile)</td>
              <td>$2,500–$6,000</td>
              <td>35–65% (less competition)</td>
              <td>$3,846–$17,143</td>
            </tr>
            <tr>
              <td>Sparse rural (&lt;20 homes/mile)</td>
              <td>$4,000–$12,000+</td>
              <td>45–75% (often monopoly)</td>
              <td>$5,333–$26,667</td>
            </tr>
          </tbody>
        </table>

        <div className="callout callout-info">
          Rural areas often have higher take rates than urban areas because there\'s less competition. The incumbent
          telephone company and cable provider may not serve the area well, or at all. An unserved rural community
          may see 60–75% take rates — far higher than a competitive urban build. This higher take rate partially
          offsets the higher rural CPHP.
        </div>
      </section>

      {/* ── WORKED EXAMPLE ── */}
      <section className="lesson-section working">
        <h2>CPHP and CPHC — Step-by-Step with Sensitivity Analysis</h2>
        <WorkedExample {...cphpWorkedExample} />
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Splitter Costs in CPHP — Don't Forget Them</h2>

        <p>
          On GPON (Gigabit Passive Optical Network) builds — which describes most rural broadband builds today —
          passive optical splitters are installed in the FDH or in splice closures to divide the optical signal
          among multiple subscribers. Splitter hardware is installed plant — it's part of the network — but it
          often gets missed in CPHP calculations because it's purchased as "electronic supply" rather than as OSP
          construction material.
        </p>

        <p>
          Current pricing for 1:32 passive planar waveguide splitters runs approximately $8–$25 per port depending
          on quality tier and quantity. For a 32-port splitter: $256–$800 per unit. On a network that deploys 200
          FDH ports across a rural build, that's $51,200–$160,000 in splitter hardware that must be included in the
          CPHP calculation.
        </p>

        <p>
          At $51,200–$160,000 on a 1,500-home project, splitter hardware adds $34–$107 per home passed to CPHP. That's
          a meaningful number on a rural build — the difference between reporting $4,366/HP and $4,500/HP depending on
          whether splitters are included.
        </p>

        <div className="callout callout-warning">
          <strong>Rule:</strong> splitter hardware is installed plant that IS included in CPHP. It is NOT operating
          equipment. It does NOT belong in the operating expense budget. If your CPHP calculation doesn't include
          splitters, it's understating the build cost.
        </div>

        <h3>CPHP and CPHC in RUS Form 524 Budget Submissions</h3>

        <p>
          RUS Form 524 (Loan/Grant Application Narrative) organizes costs by work category — outside plant, central
          office equipment, subscriber equipment, and engineering/administrative. CPHP is not a Form 524 line item,
          but it is a financial metric that RUS staff review when evaluating whether a proposed project is
          cost-reasonable. A CPHP significantly above the FBA benchmark range for the market type will draw
          scrutiny — the borrower should be prepared to explain why their build cost is higher than the benchmark.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            CPHP and CPHC are the RUS program's tools for controlling cost across the industry:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T17.L01 (Estimating Mindset)</strong> — shows you how to build an estimate. CPHP is the answer you'll get when you build well: reasonable cost on reasonable scope for the conditions you have.</li>
            <li><strong>T17.L09 (Revenue Modeling)</strong> — your per-household revenue (ARPU, monthly recurring revenue) has to stay above per-household cost (CPHP) for the project to be viable. CPHP is the floor beneath which project economics break down.</li>
            <li><strong>T05.L14 (RUS Program Fundamentals)</strong> — RUS uses CPHP benchmarks as a gating criterion for loan approval. Projects with CPHP above the benchmark benchmark get harder scrutiny. Understanding CPHP is how you explain to the RUS lender why your project costs what it costs.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The gap between CPHP benchmarks and actual costs in high-challenge territories (extremely rural, very sparse deployment, long aerial routes) is where many FTTH projects struggle. Communicating that gap clearly to RUS (and to your financial partners) is a critical skill for the build-out manager.
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
        <Quiz questions={quizQuestions} lessonId="T17.L08" />
      </section>
    </LessonLayout>
  );
}
