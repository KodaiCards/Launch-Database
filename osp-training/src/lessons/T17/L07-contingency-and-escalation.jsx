import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L07',
  course_id: 'T17',
  title: 'Contingency and Escalation — Two Different Risks',
  order: 7,
  prerequisites: ['T17.L06'],
  learning_objectives: [
    'Distinguish between contingency and escalation as separate estimating allowances',
    'Apply appropriate contingency percentages based on OSP project type and design maturity',
    'Explain the 10–15% contingency floor for OSP construction and the conditions that require higher allowances',
    'Define a material price escalation clause and describe when it protects the owner vs. the contractor',
    'Calculate a project budget with both contingency and escalation allowances correctly applied',
  ],
  estimated_minutes: 36,
  vocabulary_introduced: [
    'contingency allowance',
    'escalation allowance',
    'price escalation clause',
    'design contingency',
    'construction contingency',
    'allowance item',
  ],
  vocabulary_assumed: [
    'scope of work (SOW)',
    'unit-price contract',
    'lump-sum contract',
    'change order',
    'differing site condition',
    'make-ready cost',
    'bore cost',
    'direct cost',
    'indirect cost / overhead',
    'bill of materials (BOM)',
    'RUS (Rural Utilities Service)',
  ],
};

const key_terms = [
  {
    term: 'contingency allowance',
    definition:
      'A percentage of the base estimate set aside to cover scope unknowns, quantity variances, and reasonably foreseeable but unspecified risks. Contingency is NOT a slush fund — it has a basis (level of design completeness, type of work, risk profile). OSP construction typically carries a 10–15% contingency floor even on well-defined projects. Contingency is drawn against change orders and quantity overruns as they occur; any remaining contingency at project end is a saving to the owner.',
  },
  {
    term: 'escalation allowance',
    definition:
      'A separate percentage added to a project budget to account for the expected increase in labor and material costs between the date the estimate is prepared and the date the work is actually performed. Escalation is a TIME risk — the estimate is correct today, but prices will be higher when you buy the materials and hire the crews. Escalation and contingency are calculated and tracked separately.',
  },
  {
    term: 'price escalation clause',
    definition:
      'A contract provision that allows the contract price to be adjusted if the cost of specified materials (typically fiber cable, steel conduit, or fuel) changes more than a stated percentage from the bid price. Escalation clauses protect contractors from extreme commodity price swings on multi-year projects. They became standard on OSP contracts after the 2021–2022 material price spikes (HDPE and steel nearly doubled in 12 months).',
  },
  {
    term: 'design contingency',
    definition:
      'Contingency applied during the design phase of a project to account for the risk that the design will add scope as it matures. A conceptual-level estimate (design is 10–20% complete) carries a higher design contingency (25–35%) than a construction-ready estimate (design is 100% complete) where design contingency drops to near zero.',
  },
  {
    term: 'construction contingency',
    definition:
      'Contingency retained during construction to cover field-condition changes (differing site conditions, make-ready overruns, minor scope adjustments) that arise after the contract is awarded. On OSP projects, 10–15% construction contingency is considered a floor — OSP civil work is inherently uncertain enough that this minimum is justified on all but the simplest projects.',
  },
  {
    term: 'allowance item',
    definition:
      'A line item in a project budget for which the exact scope and cost cannot be determined at estimate time but which is known to be required. The allowance is a placeholder based on judgment or historical data. Common OSP allowance items: make-ready allowance (until the pole survey is complete), permitting fees (until the route is final), unexplored subsurface conditions.',
  },
];

export { key_terms };

const budgetWorkedExample = {
  title: 'Project Budget with Contingency and Escalation',
  description:
    'A 9-mile rural FTTH project estimated today with construction starting in 18 months. Apply contingency and escalation correctly.',
  variables: [
    { key: 'Base', label: 'Base estimate (direct cost + overhead + profit)', units: '$', default: 2240000, type: 'number' },
    { key: 'Design_pct', label: 'Design maturity at estimate time', units: '%', default: 70, type: 'number' },
    { key: 'Contingency_pct', label: 'Contingency percentage', units: '%', default: 15, type: 'number' },
    { key: 'Escalation_rate', label: 'Annual escalation rate', units: '%/year', default: 3.5, type: 'number' },
    { key: 'Time_to_construction', label: 'Time to construction start', units: 'months', default: 18, type: 'number' },
  ],
  formula: (values) => {
    const base = Number(values.Base);
    const contingency_pct = Number(values.Contingency_pct) / 100;
    const escalation_rate = Number(values.Escalation_rate) / 100;
    const time_years = Number(values.Time_to_construction) / 12;

    const contingency_amt = base * contingency_pct;
    const contingency_inclusive = base + contingency_amt;
    const escalation_multiplier = Math.pow(1 + escalation_rate, time_years);
    const escalation_amt = contingency_inclusive * (escalation_multiplier - 1);
    const total_budget = contingency_inclusive + escalation_amt;

    return Number(total_budget);
  },
  steps: (values, result) => {
    const base = Number(values.Base);
    const contingency_pct = Number(values.Contingency_pct) / 100;
    const escalation_rate = Number(values.Escalation_rate) / 100;
    const time_years = Number(values.Time_to_construction) / 12;

    const contingency_amt = base * contingency_pct;
    const contingency_inclusive = base + contingency_amt;
    const escalation_multiplier = Math.pow(1 + escalation_rate, time_years);
    const escalation_amt = contingency_inclusive * (escalation_multiplier - 1);

    return [
      {
        expression: `Contingency amount = Base × (${values.Contingency_pct}% / 100)`,
        value: contingency_amt,
        unit: '$',
      },
      {
        expression: `Base + Contingency = ${base.toFixed(0)} + ${contingency_amt.toFixed(0)}`,
        value: contingency_inclusive,
        unit: '$',
      },
      {
        expression: `Escalation period = ${values.Time_to_construction} months ÷ 12`,
        value: time_years,
        unit: 'years',
      },
      {
        expression: `Escalation multiplier = (1 + ${(escalation_rate * 100).toFixed(1)}%)^${time_years.toFixed(2)}`,
        value: escalation_multiplier,
        unit: '',
      },
      {
        expression: `Escalation amount = ${contingency_inclusive.toFixed(0)} × (${(escalation_multiplier - 1).toFixed(5)})`,
        value: escalation_amt,
        unit: '$',
      },
      {
        expression: `Total Budget = ${base.toFixed(0)} + ${contingency_amt.toFixed(0)} + ${escalation_amt.toFixed(0)}`,
        value: result,
        unit: '$',
      },
    ];
  },
  sanityCheck: (result, values) => {
    const base = Number(values.Base);
    const result_num = Number(result);
    const design_pct = Number(values.Design_pct);
    const time_to_construction = Number(values.Time_to_construction);
    const pct_over_base = ((result_num - base) / base * 100).toFixed(1);
    return `Total project budget of $${result_num.toFixed(0)} represents a ${pct_over_base}% reserve over the base estimate of $${base.toFixed(0)} — appropriate for a project with ${design_pct}% design maturity and ${time_to_construction}-month construction delay.`;
  },
  resultLabel: 'Total Project Budget',
  resultUnit: '$',
  resultDecimals: 0,
};

const quizQuestions = [
  {
    id: 'T17L07_q1',
    question:
      'A project manager says "We have $150,000 in contingency left over from a completed project — let\'s apply it to the next project and reduce their contingency by $150,000." What is wrong with this reasoning?',
    options: [
      'Nothing — unused contingency should carry forward to reduce future project budgets',
      'Contingency from one project cannot be transferred to another — it reverts to the owner as savings',
      'The transfer would require RUS approval if either project is RUS-funded',
      'The correct transfer is to apply only the labor contingency, not the material contingency',
    ],
    correct: 1,
    explanation:
      'Contingency is project-specific. Unused contingency at project completion is a saving to the owner on that project — it reverts to the owner\'s reserve, loan draw reduction, or is returned to the program budget. It does not carry forward to reduce another project\'s contingency. Each project starts with its own contingency assessment based on that project\'s design maturity and risk profile. Transferring contingency confuses two separate project budgets and obscures whether each project was individually cost-effective.',
  },
  {
    id: 'T17L07_q2',
    question:
      'A contractor is bidding a unit-price contract for an 18-month construction period. The contractor is concerned about HDPE conduit price increases. Which mechanism is the appropriate way to address this risk in the contract?',
    options: [
      'Add a 15% markup to all conduit unit prices to hedge against price increases',
      'Negotiate a price escalation clause tied to a published HDPE resin price index, allowing unit price adjustment if the index moves more than ±5%',
      'Bid the contract as T&M for conduit installation only, with materials at invoice cost',
      'Specify a delivery schedule requiring all conduit to be purchased and warehoused before construction starts',
    ],
    correct: 1,
    explanation:
      'A price escalation clause tied to a published commodity price index (such as the HDPE resin spot price index or a construction materials index) is the correct contract mechanism for managing material price risk on multi-year projects. The clause defines a base price at bid time, a trigger threshold (e.g., ±5% change), and an adjustment formula. If the commodity moves beyond the trigger, the unit price adjusts proportionally. This protects the contractor from catastrophic cost spikes while protecting the owner from paying for normal price volatility. Option A (hiding the hedge in the unit price) obscures the risk allocation and makes the bid non-competitive. Option C (T&M for one scope item) creates administrative complexity and is not standard.',
  },
  {
    id: 'T17L07_q3',
    question:
      'Why do OSP projects carry a 10–15% contingency FLOOR even when the design is 100% complete?',
    options: [
      'RUS requires 10–15% by regulation on all program-funded projects',
      'OSP civil work inherently involves subsurface and field conditions that cannot be fully determined from design documents alone — 10–15% covers construction-phase unknowns even on a complete design',
      'Contractor profit margins are lower in OSP than in commercial construction, so higher contingency is needed to make contracts workable',
      'The 10–15% floor was established by AIA standard forms for infrastructure projects',
    ],
    correct: 1,
    explanation:
      'OSP construction involves civil work in the ground and on poles — both environments where conditions cannot be fully known from design documents. A complete design shows the intended route, but it doesn\'t eliminate: rock encountered during bore, pole conditions requiring unexpected rearrangements, utility conflicts not resolved during locate, access problems caused by weather or third-party delays, and minor route adjustments for unforeseen obstacles. These are not design failures — they\'re inherent characteristics of civil infrastructure work. The 10–15% floor (per Chuck Bowser RCDD and Procore construction contingency guidelines) reflects the practical reality that even a perfect design will encounter field adjustments. Below 10%, you\'re telling the project team there\'s no room for any field adjustment — which is unrealistic.',
  },
  {
    id: 'T17L07_q4',
    question:
      'An estimator builds a base estimate of $1,800,000, adds 12% contingency, then adds 4% escalation to the contingency-inclusive total. What is the project budget?',
    options: [
      '$2,088,000 — base × (1 + 0.12 + 0.04) = base × 1.16, adding percentages flat',
      '$2,096,640 — base × 1.12 for contingency, then × 1.04 for escalation as compound multipliers',
      '$2,052,000 — contingency on base only, escalation calculated separately on base then added',
      '$2,017,600 — escalation calculated first on base, then contingency applied on top',
    ],
    correct: 1,
    explanation:
      'Contingency and escalation are sequential (compound) multipliers. Escalation applies to the contingency-inclusive total because the contingency reserve will also cost more if prices rise before it is drawn. The calculation: Step 1 — Base × (1 + Contingency) = $1,800,000 × 1.12 = $2,016,000. Step 2 — $2,016,000 × (1 + Escalation) = $2,016,000 × 1.04 = $2,096,640. Option A ($2,088,000) is wrong because it adds the percentages flat ($1,800,000 × 1.16), which understates the budget by $8,640 — a meaningful error on a multi-million-dollar project. Option C ($2,052,000) incorrectly applies escalation only to the base, not the contingency-inclusive total. Option D ($2,017,600) does not match any standard calculation method — it is a distractor designed to catch guessing.',
  },
];

export default function L07ContingencyAndEscalation() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>Contingency vs. Escalation — They Are Not the Same Thing</h2>

        <p>
          Budget reserves go by many names in construction estimating. The two most important are contingency and
          escalation — and they address completely different risks. Mixing them up leads to budgets that are
          undersized in one dimension and oversized in another.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Reserve Type</th>
              <th>What It Covers</th>
              <th>What It Does NOT Cover</th>
              <th>When It Applies</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Contingency</strong></td>
              <td>Scope unknowns, quantity variances, field condition changes, minor design evolution</td>
              <td>Gross scope changes, owner changes of mind (those are owner-directed change orders)</td>
              <td>Throughout the project; drawn against change orders and overruns as they occur</td>
            </tr>
            <tr>
              <td><strong>Escalation</strong></td>
              <td>The increase in labor rates and material prices between estimate date and construction date</td>
              <td>Scope changes, quantity changes — escalation is purely about TIME-driven price movement</td>
              <td>Applied at estimate time to cover the gap between today's prices and construction-day prices</td>
            </tr>
          </tbody>
        </table>

        <h3>The 10–15% Contingency Floor for OSP</h3>

        <p>
          OSP construction has a floor contingency regardless of design completeness. Why? Because civil
          infrastructure work in the ground and on poles has irreducible unknowns:
        </p>

        <ul>
          <li>Subsurface conditions are estimated from borings and locates, not directly observed</li>
          <li>Pole conditions are assessed from a survey, but hidden deterioration (insect damage, internal rot) only reveals during construction</li>
          <li>Third-party conflicts (landowner access, permit delays, utility conflicts) are inherently unpredictable</li>
          <li>Weather affects both schedule and cost in ways no estimate can capture perfectly</li>
        </ul>

        <p>
          The 10–15% floor isn't a buffer for bad estimating — it's acknowledgment that even a perfect estimate
          will face real-world adjustments. Below 10%, a project has no room for any field adjustment and will
          almost certainly experience cost overruns.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Design Maturity at Estimate</th>
              <th>Typical OSP Contingency Range</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Conceptual / planning (10–20% design)</td>
              <td>25–35%</td>
              <td>Major unknowns — route not staked, quantities are guesses</td>
            </tr>
            <tr>
              <td>Schematic (30–50% design)</td>
              <td>20–25%</td>
              <td>Route identified, major structures located, quantities approximate</td>
            </tr>
            <tr>
              <td>Design development (60–80% design)</td>
              <td>15–20%</td>
              <td>Route staked, structures located, quantities reasonably defined</td>
            </tr>
            <tr>
              <td>Construction documents (90–100% design)</td>
              <td>10–15%</td>
              <td>Design complete; construction risk only; 10% is the floor</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKED EXAMPLE ── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <strong className="text-blue-600 dark:text-blue-300">Quick Recall:</strong> <strong>Bill of materials (BOM)</strong> is the itemized material list (from T04); <strong>make-ready cost</strong> is pole preparation expense (from T02); <strong>bore cost</strong> is directional drilling (from T06); <strong>direct cost</strong> is traceable construction expense (from T01); and <strong>indirect cost/overhead</strong> is non-traceable project support (from T01).
        </div>

        <h2>Building a Project Budget With Contingency and Escalation</h2>
        <WorkedExample {...budgetWorkedExample} />
      </section>

      {/* ── ESCALATION ── */}
      <section className="lesson-section working">
        <h2>Escalation — The Risk That Grew After 2021</h2>

        <p>
          Before 2021, escalation was a minor line item in most OSP budgets — 2–3% per year was the historical norm
          for construction material inflation. Then material prices spiked dramatically: HDPE conduit nearly doubled
          in price over 12 months, steel messenger strand followed, and fuel surcharges on contractor invoices
          doubled. Projects estimated in 2020 that broke ground in 2022 experienced real cost increases of 20–35%
          on material-heavy scopes.
        </p>

        <p>
          The response from the industry: escalation clauses became standard on multi-year OSP contracts. A properly
          drafted escalation clause:
        </p>

        <ul>
          <li>Identifies the specific materials subject to the clause (fiber, HDPE, steel, fuel)</li>
          <li>References a published price index as the benchmark (e.g., Plastics News HDPE resin spot price, PPI for construction materials)</li>
          <li>Sets a trigger threshold — the clause only activates if the index changes more than X% from the bid-date baseline</li>
          <li>Defines the adjustment formula — usually the percentage change in the index applied to the affected material cost in the contract</li>
          <li>Works both ways — if prices FALL below the base by more than the trigger, the owner gets a credit</li>
        </ul>

        <p>
          Without an escalation clause, price risk on a multi-year project falls entirely on the contractor — and
          contractors price that risk into their bid. A well-structured escalation clause costs nothing if prices are
          stable and provides real protection (for both parties) if they move significantly.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Contingency vs. Allowance Items — Not the Same Budget Tool</h2>

        <p>
          Contingency is a percentage of the total estimate. An allowance item is a specific line item for a known
          but un-priced scope element.
        </p>

        <p>
          <strong>Example of an allowance item:</strong> The design shows a 2.3-mile aerial route across three
          utility pole owner jurisdictions. Make-ready surveys aren't complete for one jurisdiction. The estimator
          can't include a real make-ready number. Options:
        </p>

        <ul>
          <li><strong>Allowance item:</strong> "Make-ready — Jurisdiction C: $50,000 allowance (survey pending)." This is a placeholder that everyone knows will be replaced with a real number when the survey comes back. It appears as its own line on the budget, not buried in contingency.</li>
          <li><strong>Wrong approach:</strong> Ignoring it entirely and relying on the overall contingency to cover it. Contingency is for unknowns. Make-ready for Jurisdiction C is a known — just not yet priced. It deserves its own line.</li>
        </ul>

        <p>
          Tracking allowance items separately from contingency keeps the budget honest: you can see exactly what's
          been estimated, what's been allowed (placeholder), and what's the contingency reserve on top of both.
          When the survey comes back, replace the allowance with the real number and adjust the budget accordingly.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Contingency and escalation are the tools that make an estimate robust to the real world:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T17.L01 (Estimating Mindset)</strong> — teaches you to build an estimate from first principles. Contingency is the buffer you add on top because first principles never capture everything that could go wrong.</li>
            <li><strong>T17.L06 (Change Orders)</strong> — if actual conditions exceed your contingency buffer, change orders are how you renegotiate. Contingency is your cushion; change orders are your formal escalation when the cushion isn't enough.</li>
            <li><strong>T17.L09 (Revenue Modeling & ARPU)</strong> — project budget (estimated cost + contingency + escalation) is the numerator in your project-unit economics. If you underestimate contingency, project profitability gets compressed on the downside.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            Contingency is not a sign of a weak estimate — it's a sign of an honest estimate. Projects that are estimated with zero contingency are usually projects that will surprise you with cost overruns later.
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
        <Quiz questions={quizQuestions} lessonId="T17.L07" />
      </section>
    </LessonLayout>
  );
}
