import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L02',
  course_id: 'T17',
  title: 'Aerial vs. Underground Cost Components',
  order: 2,
  prerequisites: ['T17.L01'],
  learning_objectives: [
    'Enumerate the distinct cost components for aerial OSP construction',
    'Enumerate the distinct cost components for underground OSP construction',
    'Explain why underground typically costs 3–8× more than aerial per foot',
    'Apply force account labor documentation requirements to a mixed-crew estimate',
    'Identify make-ready as the most unpredictable aerial cost variable',
  ],
  estimated_minutes: 40,
  vocabulary_introduced: [
    'make-ready cost',
    'lashed aerial cable',
    'ADSS (All-Dielectric Self-Supporting)',
    'bore cost',
    'force account labor',
  ],
  vocabulary_assumed: [
    'unit cost (construction)',
    'cost per foot (CPFT)',
    'scope of work (SOW)',
    'direct cost',
    'indirect cost / overhead',
    'messenger strand',
    'conduit',
    'handhole',
    'splice closure',
    'NESC loading district',
    'joint-use pole',
    { term: 'pavement restoration', source_lesson_id: 'T06.L01' },
  ],
};

const key_terms = [
  {
    term: 'make-ready cost',
    definition:
      'Money paid to a pole owner to prepare their poles before a new attacher can install cable. Make-ready includes rearranging existing cables, transferring equipment, replacing deteriorated hardware, and any pole replacement or reinforcement needed to meet NESC clearance requirements.',
  },
  {
    term: 'lashed aerial cable',
    definition:
      'A fiber optic cable that relies on a separate steel or stainless-steel messenger strand for mechanical support. The cable is attached to the messenger with a stainless-steel lashing wire or pre-formed lashing straps. The messenger carries the cable weight; the cable jacket carries no load.',
  },
  {
    term: 'ADSS (All-Dielectric Self-Supporting)',
    definition:
      'A fiber optic cable with aramid yarn (Kevlar) or fiberglass strength members built into the cable jacket — no separate messenger required. ADSS hangs between poles on its own, making it electrically non-conductive end-to-end. Used on joint-use poles where ground potential rise or induced voltage is a concern.',
  },
  {
    term: 'bore cost',
    definition:
      'The cost to install conduit underground using a directional drill (bore) rather than open trenching. Bore cost per foot depends on soil type, depth, bore length, diameter, and underground congestion. Rocky soil can be 5–10× more expensive than easy sand/clay.',
  },
  {
    term: 'pavement restoration',
    definition:
      'The cost to repair any road, sidewalk, driveway, or paved surface disturbed during underground installation. Pavement restoration is separate from bore or trench cost and is often the single largest line item on urban underground projects — asphalt patching, concrete replacement, traffic management, and inspection fees all roll into this category.',
  },
  {
    term: 'force account labor',
    definition:
      'Construction work performed by the project owner\'s own employees rather than by an outside contractor. Under 7 CFR Part 1788 and RUS program rules, force account labor costs must be documented with detailed time sheets, equipment usage logs, and overhead cost allocations. Force account costs appear as a separate budget line in RUS loan/grant applications.',
  },
];

export { key_terms };

const aerialWorkedExample = {
  title: 'Aerial Cost Breakdown — Lashed Cable on Existing Poles',
  description:
    'Build a per-foot cost estimate for 2.6 miles of lashed aerial construction on existing poles with moderate make-ready requirements.',
  variables: [
    { symbol: 'L', name: 'Route length', value: '2.6', unit: 'miles' },
    { symbol: 'L_ft', name: 'Route length in feet', value: '13,728', unit: 'ft' },
    { symbol: 'poles', name: 'Pole count', value: '172', unit: 'poles' },
    { symbol: 'MR_pole', name: 'Make-ready cost per pole (moderate)', value: '$180', unit: '/pole' },
    { symbol: 'strand_ft', name: 'Messenger strand installed cost', value: '$0.48', unit: '/ft' },
    { symbol: 'cable_ft', name: 'Lash cable (material + labor)', value: '$0.95', unit: '/ft' },
    { symbol: 'lash_wire', name: 'Lashing wire + hardware', value: '$0.08', unit: '/ft' },
    { symbol: 'splice_ea', name: 'Mid-span splice closure (4 total)', value: '$620', unit: '/each' },
    { symbol: 'mobilization', name: 'Crew mobilization', value: '$1,800', unit: 'lump sum' },
  ],
  steps: [
    {
      label: 'Step 1 — Calculate make-ready subtotal',
      expression: 'MR = poles × MR_pole = 172 × $180 = $30,960',
      explanation:
        'Make-ready is per-pole, not per-foot. At $180/pole for a moderate-complexity route (some rearrangements, no pole replacements), 172 poles costs $30,960.',
    },
    {
      label: 'Step 2 — Calculate strand, cable, and lashing wire',
      expression: 'Linear = (strand_ft + cable_ft + lash_wire) × L_ft = ($0.48 + $0.95 + $0.08) × 13,728 = $1.51 × 13,728 = $20,729',
      explanation:
        'These three items scale directly with route feet. Messenger strand at $0.48/ft, lash cable at $0.95/ft (combined material and installation labor), and lashing wire hardware at $0.08/ft.',
    },
    {
      label: 'Step 3 — Splice closures',
      expression: 'Splices = 4 × $620 = $2,480',
      explanation:
        'Four splice closures at $620 each — price includes closure hardware, heat-shrink boots, tray count for the fiber count, and labor to prep and seal. This is a per-each cost, not a per-foot cost.',
    },
    {
      label: 'Step 4 — Add mobilization',
      expression: 'Mob = $1,800 (lump sum)',
      explanation:
        'Crew mobilization — truck transport, traffic control setup for this segment, initial pole inspection walk.',
    },
    {
      label: 'Step 5 — Direct cost total',
      expression: 'Direct = MR + Linear + Splices + Mob = $30,960 + $20,729 + $2,480 + $1,800 = $55,969',
      explanation:
        'Sum of all direct (field) costs before overhead and profit.',
    },
    {
      label: 'Step 6 — Cost per foot',
      expression: 'CPFT = Direct ÷ L_ft = $55,969 ÷ 13,728 = $4.08/ft',
      explanation:
        'The make-ready ($30,960 ÷ 13,728 = $2.25/ft equivalent) is the dominant cost here — more than the cable and strand combined. This is why make-ready is called the "wildcard" of aerial estimates.',
    },
    {
      label: 'Step 7 — Apply overhead and profit (18% + 10%)',
      expression: 'Loaded = $55,969 × 1.18 × 1.10 = $55,969 × 1.298 = $72,648',
      explanation:
        'Overhead at 18% (labor burden, insurance, equipment depreciation, field supervision) and contractor profit at 10%. Loaded total = $72,648 for 2.6 miles.',
    },
    {
      label: 'Step 8 — Loaded CPFT',
      expression: 'Loaded CPFT = $72,648 ÷ 13,728 = $5.29/ft',
      explanation:
        'The fully-loaded aerial cost is $5.29/ft. This sits in the middle of the FBA/Cartesian 2024 median range ($3–$9/ft for aerial, median $6.55/ft). A route with heavy make-ready (pole replacements, $400–$600/pole) would push above $9/ft; a clean rural route with minimal make-ready might be under $3/ft.',
    },
  ],
  sanityCheck:
    'At $5.29/ft for moderate make-ready aerial, this is consistent with FBA/Cartesian 2024 aerial benchmarks ($6.55/ft median). Our example sits below the median because we assumed moderate make-ready ($180/pole) and no pole replacements. A real estimate must include a make-ready survey before committing to this figure — if the pole inspector finds 20 replacement candidates at $3,500/pole, the total jumps by $70,000 and the CPFT climbs to $10.38/ft.',
};

const quizQuestions = [
  {
    id: 'T17L02_q1',
    question:
      'On a joint-use pole route through a substation ROW with elevated ground potential rise risk, which aerial cable type should the estimator specify?',
    options: [
      'Lashed cable on galvanized steel messenger — lowest materials cost',
      'ADSS (All-Dielectric Self-Supporting) — no conductive path from pole to cable',
      'Armored direct-buried cable installed in aerial configuration',
      'Lashed cable on stainless-steel messenger — reduced corrosion risk',
    ],
    correct: 1,
    explanation:
      'ADSS contains no metal — only aramid (Kevlar) or fiberglass strength members — so there is no conductive path from the pole structure to the cable. In areas with elevated ground potential rise (GPR) or high induced voltage from parallel power lines, ADSS eliminates the shock and fire hazard that a steel messenger or armored cable would introduce. The cable cost is higher than lashed, but it is the correct specification for this environment.',
  },
  {
    id: 'T17L02_q2',
    question:
      'A project manager says "underground bore is $12/ft and aerial is $5/ft, so we should go aerial everywhere." What critical cost is missing from this comparison?',
    options: [
      'Splice closure hardware — underground closures cost more than aerial closures',
      'Pavement restoration — on roads, restoration alone can exceed $15–30/ft in urban areas',
      'Engineering fees — underground routes require more design hours',
      'Permit fees — underground permits are more expensive than aerial pole attachments',
    ],
    correct: 1,
    explanation:
      'The bore cost of $12/ft is only the drilling cost — conduit, pull, and restoration are separate. In an urban road environment, pavement restoration (saw-cutting, asphalt patching, concrete replacement, traffic management) commonly runs $15–$30/ft or more and frequently exceeds the bore cost itself. A comparison that uses bore-only cost against fully-loaded aerial cost is not apples-to-apples.',
  },
  {
    id: 'T17L02_q3',
    question:
      'A RUS borrower plans to use their own maintenance crew (force account labor) for splicing on a fiber build. Under 7 CFR Part 1788, what documentation must the borrower maintain for force account labor costs?',
    options: [
      'A single invoice from the crew supervisor summarizing hours and materials',
      'No documentation required — force account labor is not subject to procurement rules',
      'Detailed time sheets per employee, equipment usage logs, and overhead cost allocations',
      'A certified payroll report submitted to RUS monthly during construction',
    ],
    correct: 2,
    explanation:
      'Under 7 CFR Part 1788 (Methods of Contracting) and related RUS program guidance, force account labor — construction performed by the borrower\'s own employees — requires detailed timekeeping: individual time sheets recording hours by task, equipment usage logs recording machine hours and fuel costs, and documentation of overhead cost allocations (how the borrower distributes shared costs like supervision, warehouse, and vehicle depreciation). These records support the cost certification required at loan close-out and are subject to RUS audit.',
  },
  {
    id: 'T17L02_q4',
    question:
      'On a 3-mile underground conduit route through urban streets, a contractor quotes $18/ft for directional bore and $6/ft for conduit and pull. The city requires pavement restoration. An estimator uses $18 + $6 = $24/ft as the underground cost. What is the most likely outcome?',
    options: [
      'The estimate is accurate — bore and conduit costs are the dominant underground expenses',
      'The estimate is slightly high — pavement restoration is usually under $2/ft in urban areas',
      'The estimate is significantly low — pavement restoration in urban areas commonly adds $15–30/ft or more',
      'The estimate is accurate if the conduit is HDPE — restoration costs only apply to steel conduit installs',
    ],
    correct: 2,
    explanation:
      'Pavement restoration is one of the most consistently underestimated costs on urban underground projects. Saw-cutting, removing existing asphalt or concrete, placing and compacting base material, resurfacing to city standards, restriping, and traffic management during the process commonly add $15–$30/ft in dense urban areas — sometimes more on arterial roads with special surface requirements. The $24/ft estimate missing restoration means the true cost could be $39–$54/ft, a 60–125% underestimate that would blow the project budget.',
  },
];

export default function L02AerialVsUndergroundCostComponents() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>Why Aerial and Underground Cost Completely Differently</h2>

        <p>
          The most dangerous thing you can say in an OSP estimate meeting is "aerial is cheaper than underground." That
          statement is sometimes true, sometimes false, and always incomplete. The real answer is:{' '}
          <strong>it depends on make-ready, soil conditions, and pavement.</strong>
        </p>

        <p>
          Both aerial and underground construction share the same end goal — getting fiber from Point A to Point B in a
          conduit or on a pole. But the cost components are almost entirely different. Understanding what drives each one
          is the foundation of building estimates that survive contact with reality.
        </p>

        <h3>Aerial Construction — What You're Actually Paying For</h3>

        <p>An aerial OSP project has four buckets of cost:</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Cost Bucket</th>
              <th>What It Covers</th>
              <th>Cost Driver</th>
              <th>Scales With</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Make-ready</strong></td>
              <td>Pole preparation before you can attach — rearranging existing cables, hardware replacement, pole replacement if needed</td>
              <td>Pole condition, existing attachment count, pole owner's requirements</td>
              <td>Number of poles</td>
            </tr>
            <tr>
              <td><strong>Strand and cable</strong></td>
              <td>Messenger strand installation, cable lashing or ADSS installation, lashing wire and hardware</td>
              <td>Cable type (lashed vs. ADSS), fiber count, span length</td>
              <td>Route feet</td>
            </tr>
            <tr>
              <td><strong>Splicing</strong></td>
              <td>Mid-span and dead-end splice closures, splice tray installation, fusion splicing labor</td>
              <td>Fiber count, splice count, closure type</td>
              <td>Number of splices</td>
            </tr>
            <tr>
              <td><strong>Mobilization and overhead</strong></td>
              <td>Crew travel, traffic control, bucket truck positioning, field supervision</td>
              <td>Project length, urban vs. rural, access difficulty</td>
              <td>Project complexity</td>
            </tr>
          </tbody>
        </table>

        <div className="callout callout-warning">
          <strong>Make-ready is the wildcard.</strong> On a clean rural route with newer poles and no attachments,
          make-ready might cost $50/pole. On a crowded urban route with old poles, four existing attachers, and some
          poles that need replacement, make-ready can hit $600–$1,200/pole or more. A 172-pole project with those two
          scenarios is a $8,600 vs. $172,000+ swing — on make-ready alone.
        </div>

        <h3>Two Types of Aerial Cable — and Why It Matters for Cost</h3>

        <p>
          There are two primary ways to install aerial fiber, and each has different cost and application profiles.
        </p>

        <p>
          <strong>Lashed cable on messenger strand</strong> is the most common approach for telecom aerial plant. A
          galvanized steel or stainless-steel messenger strand is installed first under tension between dead-end
          assemblies. The fiber cable is then attached (lashed) to the strand using a stainless-steel lashing machine
          that spirals lashing wire around both. The strand carries all the mechanical load — the cable just rides along.
        </p>

        <p>
          <strong>ADSS (All-Dielectric Self-Supporting)</strong> cable has its own aramid yarn (Kevlar) or fiberglass
          rod strength members built into the jacket. It hangs between poles without any separate strand. ADSS is more
          expensive per foot of cable but eliminates the strand installation cost. More importantly, ADSS is entirely
          non-conductive — critical on routes near high-voltage power lines, through substations, or anywhere ground
          potential rise is a concern. In those environments, a steel messenger is a safety hazard, not just a cost
          consideration.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Lashed on Messenger</th>
              <th>ADSS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cable cost</td>
              <td>Lower per foot</td>
              <td>Higher per foot (strength members built in)</td>
            </tr>
            <tr>
              <td>Installation cost</td>
              <td>Strand + lashing labor = extra steps</td>
              <td>Single-pass installation — no strand, no lash wire</td>
            </tr>
            <tr>
              <td>Electrical hazard</td>
              <td>Messenger is conductive — GPR and induction risk</td>
              <td>Fully non-conductive — safe near high voltage</td>
            </tr>
            <tr>
              <td>Span capability</td>
              <td>Messenger strand gauge limits span</td>
              <td>ADSS rated for specific span ranges (check sag table)</td>
            </tr>
            <tr>
              <td>Common use</td>
              <td>Standard telecom aerial on co-op/municipal poles</td>
              <td>Power company joint-use routes, substation ROW</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKED EXAMPLE ── */}
      <section className="lesson-section working">
        <h2>Aerial Cost Breakdown — Step by Step</h2>
        <WorkedExample {...aerialWorkedExample} />
      </section>

      {/* ── UNDERGROUND ── */}
      <section className="lesson-section working">
        <h2>Underground Construction — A Completely Different Cost Structure</h2>

        <p>
          Underground OSP has no make-ready equivalent — you don't need a pole owner's permission to bore through soil.
          But you trade that uncertainty for a different set of cost drivers that can be just as unpredictable.
        </p>

        <h3>The Four Underground Cost Buckets</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Cost Bucket</th>
              <th>What It Covers</th>
              <th>Cost Driver</th>
              <th>Typical Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Bore / trench</strong></td>
              <td>Directional drill (HDD), open trench, rock saw, or hand-dig to create the underground pathway</td>
              <td>Soil type, depth, bore length, urban congestion, rock content</td>
              <td>$4–$60+/ft depending on conditions</td>
            </tr>
            <tr>
              <td><strong>Conduit and pull</strong></td>
              <td>HDPE conduit, innerduct, pull tape, and the labor to pull fiber cable through installed conduit</td>
              <td>Conduit size/type, fiber count (determines cable OD), pull length, number of bends</td>
              <td>$2–$8/ft material + labor</td>
            </tr>
            <tr>
              <td><strong>Structures</strong></td>
              <td>Handholes, manholes, vaults, splice pedestals — the access points that allow future maintenance</td>
              <td>Structure size, spacing requirements, buried vs. flush, frost depth</td>
              <td>$400–$4,000+ per structure</td>
            </tr>
            <tr>
              <td><strong>Pavement restoration</strong></td>
              <td>Saw-cutting existing pavement, removal, base restoration, resurfacing to municipal standards, striping, traffic control</td>
              <td>Pavement type (asphalt vs. concrete), road classification, city requirements, traffic volume</td>
              <td>$8–$50+/ft on paved roads</td>
            </tr>
          </tbody>
        </table>

        <div className="callout callout-warning">
          <strong>Pavement restoration is the underground equivalent of make-ready.</strong> Estimators consistently
          underestimate it. In an urban environment, pavement restoration frequently exceeds the bore cost itself. A
          project that looks like $15/ft underground (bore only) can easily become $35–$45/ft when restoration, traffic
          management, and city inspection fees are added.
        </div>

        <h3>Why Underground Typically Costs 3–8× More Than Aerial</h3>

        <p>
          FBA/Cartesian 2024 benchmark data shows aerial median around $6.55/ft and underground median around $22–$28/ft
          for mixed urban/rural work. The spread is real and has a structural explanation:
        </p>

        <ul>
          <li>
            <strong>Aerial reuses existing infrastructure.</strong> The poles are already there. You're paying to
            attach, not to build a new pathway from scratch. Underground must create the entire pathway — bore, conduit,
            structures — from zero.
          </li>
          <li>
            <strong>Underground disturbs existing infrastructure.</strong> Every bore has a risk of hitting a gas main,
            water line, or existing conduit. Locates (811) add cost and time. Unanticipated rock or utility conflicts
            can double a bore cost overnight.
          </li>
          <li>
            <strong>Underground restoration is permanent.</strong> A cut road must be fully restored to city standards.
            There's no equivalent aerial cost — if you drop a cable span, you re-pull and re-lash; you don't repave a
            street.
          </li>
        </ul>

        <h3>When Underground Wins Anyway</h3>

        <p>
          Despite the higher cost, underground is sometimes the only option or the right option:
        </p>

        <ul>
          <li>No usable pole route exists (roads without utility poles, subdivisions with underground utilities)</li>
          <li>Aerial pole attachments are denied by the pole owner or cost-prohibitive in make-ready</li>
          <li>Local ordinance requires underground in the jurisdiction</li>
          <li>Long-term reliability requirements favor underground (no storm damage, no ice loading, no vehicle strikes)</li>
          <li>Fiber count is very high (100+ fibers) and aerial sag/tension limits require multiple spans</li>
        </ul>
      </section>

      {/* ── FORCE ACCOUNT ── */}
      <section className="lesson-section working">
        <h2>Force Account Labor — When Your Own Crew Does the Work</h2>

        <p>
          Most OSP construction uses outside contractors — you competitively bid the work and pay an invoice. But some
          RUS borrowers (rural phone companies, co-ops, electric cooperatives building fiber) have their own
          construction crews and use them for some or all of the build.
        </p>

        <p>
          When the borrower's own employees do the construction work, that's called <strong>force account labor</strong>.
          It can reduce cost on paper (no contractor markup), but it comes with strict RUS documentation requirements.
        </p>

        <h3>What Force Account Documentation Requires</h3>

        <p>Under 7 CFR Part 1788 and related RUS program guidance, force account costs must be supported by:</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>What It Records</th>
              <th>Why RUS Requires It</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Employee time sheets</td>
              <td>Hours worked per day per employee, coded to the specific project task (aerial lashing, splicing, trenching, etc.)</td>
              <td>Prevents double-billing — same hours can't be billed to two projects</td>
            </tr>
            <tr>
              <td>Equipment usage logs</td>
              <td>Machine hours per day per piece of equipment, fuel consumed, operator ID</td>
              <td>Equipment depreciation and fuel are allocable costs only when logged</td>
            </tr>
            <tr>
              <td>Overhead cost allocation</td>
              <td>How the borrower distributes shared costs (supervision, warehouse space, vehicles, payroll burden) across projects</td>
              <td>Ensures overhead is allocated consistently — can't dump overhead on an RUS project to inflate the loan draw</td>
            </tr>
            <tr>
              <td>Force account work order</td>
              <td>Scope of the force account work, crew authorization, materials issued</td>
              <td>Establishes what work was authorized and when it was completed</td>
            </tr>
          </tbody>
        </table>

        <div className="callout callout-info">
          <strong>In practice:</strong> force account is most common for activities the borrower's crew does routinely
          — aerial lashing, splicing, staking, or service drops — where they have trained people and equipment. The
          directional bore, major civil work, and specialized closures often still go to outside contractors even when
          the borrower self-performs other scope.
        </div>

        <p>
          When you're building an estimate that includes force account labor, the force account costs appear as a
          separate budget line from contractor costs. RUS Form 524 (the budget submission for loan/grant applications)
          organizes costs by work category — force account labor under "outside plant" gets its own subtotal separate
          from contracted outside plant.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Reading a Bore Quote and Flagging Hidden Cost</h2>

        <p>
          A directional bore contractor will give you a price per foot for bore only. That number doesn't include
          conduit, innerduct, pull tape, cable pull, or surface restoration. When reviewing a bore sub-contractor quote,
          check for each of these exclusions explicitly.
        </p>

        <p>
          Common exclusions that appear in small print on bore quotes:
        </p>

        <ul>
          <li><strong>Rock surcharge:</strong> bore in rock costs 3–10× more per foot; many quotes include a rock surcharge clause that adjusts price if rock is encountered</li>
          <li><strong>Restoration not included:</strong> bore quote = bore only; restoration is Owner-furnished or separate bid</li>
          <li><strong>Locates owner-furnished:</strong> contractor assumes 811 locates are complete before mobilization; if not, delay charges apply</li>
          <li><strong>Bore pits owner-furnished:</strong> entry and exit pit excavation and sheeting are sometimes excluded</li>
          <li><strong>Conduit OD limit:</strong> quote based on a specific conduit diameter; larger conduit = higher price</li>
          <li><strong>Mobilization extra:</strong> mobilization fee added on short bore runs (under 500 ft)</li>
        </ul>

        <p>
          A well-structured underground estimate itemizes bore, conduit, pull, structures, and restoration as separate
          line items — not as a single "underground cost." This lets you track which component is driving cost and
          allows the contractor to adjust quantities without re-pricing the entire job.
        </p>
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
        <Quiz questions={quizQuestions} lessonId="T17.L02" />
      </section>
    </LessonLayout>
  );
}
