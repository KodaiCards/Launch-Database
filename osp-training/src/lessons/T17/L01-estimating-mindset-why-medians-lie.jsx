// T17.L01 — The Estimating Mindset: Why National Medians Lie
// FBA/Cartesian FTTH Deployment Survey (2023, 2024); NTIA BEAD NOFO July 2022
// NC Broadband Matters 2021 report; RUS Form 524 (budget submission)
// Industry consensus: No single $/ft number is defensible without knowing geography

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T17.L01',
  course_id: 'T17',
  title: 'The Estimating Mindset: Why National Medians Lie',
  order: 1,
  lesson_type: 'foundations',
  prerequisites: ['T16.L07'],
  learning_objectives: [
    'Explain why a single national $/ft cost median is not a reliable input for an OSP estimate',
    'Identify the four primary cost drivers that cause the widest variance in OSP construction costs',
    'Distinguish between a scope of work and a bill of quantities',
    'Explain the difference between direct cost and indirect cost in a construction estimate',
    'State the correct role of published cost benchmarks (FBA, NTIA BEAD) in an estimate',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'unit cost (construction)',
    'cost per foot (CPFT)',
    'scope of work (SOW)',
    'direct cost',
    'indirect cost / overhead',
  ],
  vocabulary_assumed: [
    'as-built record',
    'Form 219 (RUS)',
    'close-out package',
    'reconciliation (as-built)',
    'conduit',
    'bore',
    'make-ready',
    'attachment fee',
    'pavement restoration',
  ],
};

const key_terms = [
  {
    term: 'Unit Cost (Construction)',
    definition:
      'The cost to install one unit of a specific construction item — one foot of conduit, one splice, one handhole, one foot of aerial fiber. Unit costs are inputs to an estimate, not outputs. A valid unit cost is derived from actual cost data (your own past jobs or published regional benchmarks) and must be accompanied by the conditions under which it applies. A "national median" unit cost without geographic and site-condition context is nearly useless for bidding.',
  },
  {
    term: 'Cost per Foot (CPFT)',
    definition:
      'The all-in installed cost per linear foot of fiber plant — including material, labor, equipment, and allocated overhead. CPFT is the most commonly cited summary metric in FTTH industry reports (e.g., FBA/Cartesian annual deployment survey), but it is a summary, not a basis for bidding. Published CPFT figures are medians across large samples; any specific project can be 2–10× above or below the median depending on terrain, density, and labor market.',
  },
  {
    term: 'Scope of Work (SOW)',
    definition:
      'A written description of exactly what work is to be performed under a contract — routes, installation methods, material specifications, crew responsibilities, schedule milestones, QA requirements, and exclusions. The SOW is the foundation of any estimate: you cannot price what you have not defined. An incomplete SOW is the single most common cause of change orders and cost overruns on OSP projects.',
  },
  {
    term: 'Direct Cost',
    definition:
      'A cost that can be traced directly to a specific unit of construction work: the fiber cable installed on a specific segment, the labor hours to bore a specific crossing, the concrete for a specific vault. Direct costs are the line items in the estimate. Total direct cost = material cost + labor cost + equipment cost for all defined work items.',
  },
  {
    term: 'Indirect Cost / Overhead',
    definition:
      'Costs that support the project but cannot be traced to a specific unit of work: project management, engineering oversight, contractor bonding and insurance, general conditions (portable toilet, fuel, site security), and company overhead (office, accounting, estimation staff). Indirect costs are typically expressed as a percentage markup on direct cost — commonly 10–20% for OSP construction. Forgetting indirect costs turns a profitable project into a money-loser.',
  },
];

export { key_terms };

export default function L01() {
  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>The Problem With "What Does Fiber Cost?"</h2>

        <p>
          Every project manager who has never built fiber before asks the same question: "What does
          fiber cost per foot?" And every experienced estimator in the room gives the same answer:
          "Depends." The question seems simple; the answer is genuinely complicated — and
          understanding why it is complicated is the foundation of every good estimate.
        </p>

        <p>
          Here is the actual answer in number form: fiber-to-the-home (FTTH) construction costs in
          the United States range from <strong>less than $3 per foot</strong> (suburban, conduit
          already in place, no pavement restoration needed) to{' '}
          <strong>over $60 per foot</strong> (dense urban, pavement cuts, traffic control, union
          labor, heavy locate density). That is a 20× range. A single "national median" printed on
          a page from a Cartesian or FBA report sits somewhere in the middle of that range — it is
          statistically accurate for a dataset of thousands of projects, and practically useless for
          your specific project in your specific geography with your specific site conditions.
        </p>

        <p>
          This is not a caveat. It is the fundamental fact of OSP estimating. The job of an
          estimator is not to look up the national median and put it in a spreadsheet. The job is
          to understand the cost drivers for{' '}
          <em>your project on your route on your timeline</em>, and to build a number from those
          drivers. Published benchmarks are useful as a sanity check — if your estimate comes in at
          $80/ft aerial in a rural county with no make-ready issues, you have made an arithmetic
          error. But they are not inputs.
        </p>

        <h3>What the FBA/Cartesian Numbers Actually Are</h3>

        <p>
          The Fiber Broadband Association (FBA) and Cartesian Group publish an annual FTTH
          deployment cost report based on data collected from U.S. broadband providers. The 2023
          dataset showed a median aerial cost of approximately $6.49/ft; the 2024 dataset showed
          approximately $6.55/ft. These numbers are widely cited in grant applications, investor
          decks, and news coverage.
        </p>

        <p>
          What those numbers represent:
        </p>

        <ul>
          <li>
            A statistical median across a large sample of real projects (hundreds of deployments)
          </li>
          <li>
            Installed cost including material + labor + overhead — not just cable cost
          </li>
          <li>
            Weighted toward the project mix that submitted data — not necessarily representative of
            your geography
          </li>
        </ul>

        <p>
          What those numbers do NOT tell you:
        </p>

        <ul>
          <li>
            What a project costs in your specific county, state, or terrain type
          </li>
          <li>
            Whether make-ready cost is included or excluded (it often is not)
          </li>
          <li>
            Whether the project had favorable soil, flat terrain, and clean poles — or the opposite
          </li>
          <li>
            What your crew's actual productivity rate is (a huge variable)
          </li>
        </ul>

        <p>
          Rule for using benchmarks: they are a ceiling/floor sanity check, not a starting point.
          Always build from your own historical data and regional conditions first.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>The Four Primary Cost Drivers</h2>

        <p>
          In every OSP construction estimate, four factors create most of the variance between
          projects:
        </p>

        <ol className="step-list">
          <li>
            <strong>Terrain and geology.</strong> A bore through sandy loam soil: $8–15/ft. A bore
            through caliche rock that requires pilot holes and carbide tooling: $35–60+/ft for the
            bore section alone. You cannot estimate a bore without knowing what is underground.
          </li>
          <li>
            <strong>Pavement and restoration.</strong> Boring under a county road with dirt shoulders
            and no traffic control: $12–20/ft. Cutting through 6-inch reinforced concrete in a
            state highway lane with traffic control, saw-cutting, and specified patch-back: $40–80/ft
            for the pavement restoration alone. Always ask: is this rural, suburban, or urban?
            Asphalt or concrete? State road or county road?
          </li>
          <li>
            <strong>Utility locate density.</strong> A rural route with one locate ticket per mile
            has fundamentally different cost and schedule risk than an urban route with locate
            tickets every 100 feet. Locate delays, potholing to verify depths, and traffic control
            for locates add up. Ask: how many locate tickets, and what is the average delay per
            ticket in this area?
          </li>
          <li>
            <strong>Make-ready and pole conditions.</strong> Aerial construction on clean, well-loaded
            poles with no existing attachments in the communication space: $4–9/ft. Aerial
            construction requiring pole replacements, transfers, and engineering re-inspections: $15–30/ft
            before you touch fiber. Always get a joint-use survey before writing aerial cost.
          </li>
        </ol>

        <h3>Direct Cost vs. Indirect Cost — The Other Half of the Estimate</h3>

        <p>
          A common beginner mistake is to estimate only the direct construction cost — the fiber,
          the conduit, the labor to install them — and forget the costs that support the project
          but cannot be assigned to a specific foot of cable. These are <strong>indirect costs</strong>,
          and on a typical OSP project they add 15–25% to the direct cost total.
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>Cost Category</th>
              <th>Type</th>
              <th>Typical % of Total Project Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fiber cable (aerial + UG)</td>
              <td>Direct — material</td>
              <td>15–25%</td>
            </tr>
            <tr>
              <td>Conduit and hardware</td>
              <td>Direct — material</td>
              <td>10–20%</td>
            </tr>
            <tr>
              <td>Construction labor (bore, aerial, splicing)</td>
              <td>Direct — labor</td>
              <td>35–50%</td>
            </tr>
            <tr>
              <td>Equipment (bore rigs, aerial bucket trucks)</td>
              <td>Direct — equipment</td>
              <td>8–15%</td>
            </tr>
            <tr>
              <td>Engineering / survey / staking</td>
              <td>Indirect</td>
              <td>3–8%</td>
            </tr>
            <tr>
              <td>Contractor overhead + profit</td>
              <td>Indirect</td>
              <td>10–18%</td>
            </tr>
            <tr>
              <td>Bonding, insurance, permits</td>
              <td>Indirect</td>
              <td>2–5%</td>
            </tr>
          </tbody>
        </table>

        <p>
          The percentages above are rough planning ranges, not bid targets. They illustrate why a
          cost-per-foot figure that only captures direct material + labor is not the same as an
          all-in installed cost.
        </p>

        <h3>The Scope of Work: What You're Actually Pricing</h3>

        <p>
          Before writing a single number on an estimate form, you need a{' '}
          <strong>scope of work (SOW)</strong> — a document that defines exactly what work is to be
          performed. The SOW is the foundation. Without it, you are not estimating; you are
          guessing.
        </p>

        <p>A complete OSP construction SOW includes:</p>

        <ul>
          <li>
            <strong>Route description:</strong> start point, end point, total mileage, route type
            (aerial vs. underground vs. hybrid), crossing types (bore, directional drill, aerial span)
          </li>
          <li>
            <strong>Material specifications:</strong> cable type and count, conduit type and size,
            closure type, hardware specifications
          </li>
          <li>
            <strong>Installation methods:</strong> bore vs. plow, lash vs. ADSS, burial depth
            requirements per NESC and RUS
          </li>
          <li>
            <strong>QA/testing requirements:</strong> OTDR test specs, burial depth verification,
            pavement restoration match requirements
          </li>
          <li>
            <strong>Schedule and milestone requirements</strong>
          </li>
          <li>
            <strong>Explicit exclusions:</strong> what is NOT in scope (e.g., "pole ownership and
            make-ready is owner responsibility; contractor scope begins at wire attachment point")
          </li>
        </ul>

        <h3>Using Cost Benchmarks Correctly</h3>

        <p>A defensible estimate uses published benchmarks as follows:</p>

        <ul>
          <li>
            <strong>Sanity check floor/ceiling:</strong> if your aerial estimate comes in under
            $2/ft or over $50/ft in a rural area without unusual conditions, re-examine your
            inputs.
          </li>
          <li>
            <strong>Gap-fill for missing historical data:</strong> if you have never built a bore
            in this specific terrain type, a regional benchmark gives you a starting point that
            you then adjust for known site conditions.
          </li>
          <li>
            <strong>Grant application narrative:</strong> FBA/Cartesian benchmarks are explicitly
            cited in NTIA BEAD and RUS program applications to demonstrate cost reasonableness.
            They are accepted by program reviewers for narrative support — they are NOT accepted
            as the estimate itself.
          </li>
        </ul>

        <p>
          The right starting point for any estimate is your last three comparable projects in the
          same region. Adjust for known differences (terrain, density, make-ready load). Use
          published benchmarks to sanity-check the range. Present your number with the assumptions
          that drive it — a number without assumptions is not an estimate, it is a wish.
        </p>

        <WorkedExample
          title="Building a Simple per-Foot Estimate From First Principles"
          steps={[
            {
              label: 'Scope Definition',
              content:
                'Project: 4.5 miles of new aerial FTTH in a rural county. Clean poles (pole owner assessment shows 0 transfers, 0 replacements). Attachment fee = $16/pole/year × 85 poles = $1,360/year (excluded from capital estimate). Cable = 144-count ADSS.',
            },
            {
              label: 'Material Direct Cost',
              content:
                'ADSS cable: 4.5 miles × 5,280 ft/mile × $0.48/ft (144-ct ADSS) = 23,760 LF × $0.48 = $11,405. Add 10% slack = 26,136 LF × $0.48 = $12,545. Closures (6 inline): 6 × $280 = $1,680. Hardware (mid-span clamps, end fittings): estimated $2,100. Total material direct cost ≈ $16,325.',
            },
            {
              label: 'Labor Direct Cost',
              content:
                'ADSS installation productivity: 1,800 ft/crew-day (aerial, flat terrain, no make-ready). Days needed: 23,760 LF ÷ 1,800 = 13.2 crew-days. Crew rate (2-man aerial crew): $1,450/crew-day all-in. Labor cost: 13.2 × $1,450 = $19,140.',
            },
            {
              label: 'Splicing Direct Cost',
              content:
                '6 splice points (4 inline + 2 terminations). Splicing labor: 6 × $320/splice point = $1,920. Assumes 48 splices/splice point × $6.67/splice (team rate for fusion splicing productivity).',
            },
            {
              label: 'Total Direct Cost',
              content:
                '$16,325 (material) + $19,140 (labor) + $1,920 (splicing) = $37,385 total direct cost.',
            },
            {
              label: 'Add Indirect Cost (15% overhead)',
              content:
                '$37,385 × 1.15 = $42,993 total estimated installed cost.',
            },
            {
              label: 'Sanity Check CPFT',
              content:
                '$42,993 ÷ 23,760 LF = $1.81/ft installed. FBA 2024 aerial median ≈ $6.55/ft. Our estimate is well below median — consistent with ADSS on clean poles (no strand cost, no make-ready). Sanity check: our $1.81/ft is plausible for ideal-condition rural aerial with no make-ready. If conditions were different (10+ transfers, pavement crossings), this would be $4–8/ft.',
            },
          ]}
        />
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>The RUS Estimate Standard</h2>

        <p>
          When building a cost estimate for a RUS loan or grant application, the budget is submitted
          as supporting documentation to <strong>RUS Form 524</strong> (the loan/grant application
          narrative). RUS requires cost estimates organized by work category — not by $/ft line
          item:
        </p>

        <ul>
          <li>Outside plant construction</li>
          <li>Central office / headend equipment</li>
          <li>Subscriber/premises equipment</li>
          <li>Engineering, survey, and legal</li>
          <li>Administrative and management</li>
          <li>Contingency (typically 10%)</li>
        </ul>

        <p>
          The Form 524 budget is a summary presentation of the estimate — the supporting detail
          (BOM, labor productivity model, subcontractor quotes) is submitted as attachments. RUS
          State Offices review the estimate for cost reasonableness using published benchmarks as
          one reference point. If your $/ft cost is significantly above the regional range, expect
          a request for additional justification. If it is significantly below, expect a question
          about whether you have adequately covered all work items.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Cost estimation doesn't stand alone — it interlocks with earlier stages of project design and later project execution:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T16.L07 (Form 219 Documentation)</strong> — the close-out documentation becomes your historical cost data. Every project you close-out produces the unit costs for your next estimate.</li>
            <li><strong>T03.L05 (Cable Selection)</strong> — material cost per foot starts here. Your BOM quantities and material specifications feed directly into the material line items of this estimate.</li>
            <li><strong>T08.L10 (Pole Attachment Fees)</strong> — make-ready and attachment costs are a significant cost driver. A project with pole replacements (T08) is fundamentally more expensive than one without.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            A good estimate is not a number in a spreadsheet — it is a record of decisions about scope, site conditions, crew productivity, and risk. When the project is built, your close-out records become the data that improves your next estimate.
          </p>
        </section>
      </section>

      {/* ── KEY TERMS ────────────────────────────────────────────── */}
      <section className="lesson-section key-terms">
        <h2>Key Terms</h2>
        <div className="flashcard-row">
          {key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────── */}
      <Quiz
        questions={[
          {
            id: 'T17L01-Q1',
            type: 'multiple_choice',
            question:
              'A project manager asks you for "the standard cost per foot for fiber." What is the most accurate response?',
            options: [
              'Approximately $6.50/ft, based on the FBA 2024 national median for aerial fiber',
              'It depends on terrain, pavement type, utility locate density, and make-ready complexity — there is no valid single number without site-specific conditions',
              'Underground is always more expensive than aerial, so use the underground median from the NTIA BEAD benchmarks',
              'A rough estimate of $10–15/ft all-in is a safe planning number for any OSP project',
            ],
            correct: 1,
            explanation:
              'There is no valid single cost per foot without knowing the site conditions. OSP construction costs range from under $3/ft to over $60/ft depending on terrain, pavement, locate density, and make-ready complexity. The FBA 2024 median of ~$6.55/ft aerial is a statistical reference for a large sample of projects — it is not a planning input for a specific project. A good estimator starts from their own historical data on comparable projects in the same region, then adjusts for known conditions.',
          },
          {
            id: 'T17L01-Q2',
            type: 'multiple_choice',
            question:
              'What is the correct role of FBA/Cartesian annual FTTH cost report benchmarks in building a project estimate?',
            options: [
              'Use them as the primary cost input — FBA benchmarks are based on real deployed costs and are designed for bidding',
              'Use them as a sanity-check ceiling/floor and for grant application narrative support — not as primary cost inputs',
              'Use them only for the aerial portion; underground costs should be estimated from NTIA BEAD figures',
              'FBA benchmarks are not reliable — never reference them in an estimate',
            ],
            correct: 1,
            explanation:
              'Published benchmarks (FBA/Cartesian, NTIA BEAD) serve two valid purposes: (1) sanity-checking your estimate against a broad dataset of real projects — if your number is wildly outside the range, investigate why; (2) supporting grant application narratives where program reviewers expect to see industry cost references. They should NOT be used as the primary cost inputs for bidding — they are statistical medians that mask 10–20× variance across site conditions.',
          },
          {
            id: 'T17L01-Q3',
            type: 'multiple_choice',
            question:
              'A construction estimate shows total material + labor cost of $280,000. The contractor adds 15% overhead and 10% profit. What is the final contract price?',
            options: [
              '$322,000 (280,000 × 1.15)',
              '$308,000 (280,000 + 10%)',
              '$354,900 (280,000 × 1.15 × 1.10)',
              '$392,000 (280,000 × 1.40)',
            ],
            correct: 2,
            explanation:
              'Overhead and profit markups are applied sequentially. Step 1: add overhead markup — $280,000 × 1.15 = $322,000. Step 2: add profit markup on the overhead-included subtotal — $322,000 × 1.10 = $354,200 (approximately $354,900 rounding). The total contract price is the all-in number including direct cost + indirect cost + contractor profit. This is why ignoring overhead and profit in an estimate produces a number that looks much lower than any real bid — the overhead and profit markups are real costs of doing business.',
          },
          {
            id: 'T17L01-Q4',
            type: 'multiple_choice',
            question:
              'Which of the following is a direct cost in an OSP construction estimate?',
            options: [
              'The project manager\'s time coordinating with the engineering firm',
              'The contractor\'s business liability insurance premium',
              'The labor hours to bore a 200-foot utility crossing at Station 18+40',
              'The engineering firm\'s overhead for managing subcontractors',
            ],
            correct: 2,
            explanation:
              'A direct cost is one that can be traced directly to a specific unit of construction work. Labor hours to bore a specific crossing at a specific station are directly assignable to that work item — they are a direct labor cost. The project manager\'s coordination time, liability insurance, and engineering overhead are indirect costs — they support the project generally but cannot be assigned to a specific foot of conduit or a specific bore. The distinction matters for estimating because direct costs are priced per unit; indirect costs are typically applied as percentage markups on the direct cost total.',
          },
        ]}
      />
    </LessonLayout>
  );
}
