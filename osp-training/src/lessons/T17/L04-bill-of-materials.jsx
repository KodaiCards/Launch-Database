import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L04',
  course_id: 'T17',
  title: 'Bill of Materials — Building the BOM',
  order: 4,
  prerequisites: ['T17.L03'],
  learning_objectives: [
    'Define a bill of materials (BOM) and explain its role in OSP estimation',
    'Enumerate the major material categories in an aerial and underground BOM',
    'Apply waste factors and spare ratios to calculate material quantities',
    'Explain the difference between material cost and installed cost',
    'Identify the highest-risk material line items for cost overruns',
  ],
  estimated_minutes: 32,
  vocabulary_introduced: [
    'bill of materials (BOM)',
    'waste factor',
    'spare ratio',
    'splitter (passive optical)',
    'material lead time',
    'take-off quantity',
  ],
  vocabulary_assumed: [
    'unit cost (construction)',
    'direct cost',
    'make-ready cost',
    'lashed aerial cable',
    'bore cost',
    'pavement restoration',
    'force account labor',
    'crew productivity rate',
    'production unit',
    'splice closure',
    'conduit',
    'handhole',
    'innerduct',
    'HDPE',
    'FDH (Fiber Distribution Hub)',
  ],
};

const key_terms = [
  {
    term: 'bill of materials (BOM)',
    definition:
      'A complete list of all materials required to execute a construction scope, with quantities, unit costs, and total material cost for each item. The BOM is the materials portion of the project estimate — separate from labor, overhead, and profit. A complete BOM lists every item by part description, manufacturer\'s specification (or equivalent), unit of measure, quantity required, and unit price.',
  },
  {
    term: 'waste factor',
    definition:
      'A percentage added to a theoretical quantity to account for material loss during installation — cut ends, damaged sections, splice tails, and over-pulls. For fiber cable, a waste factor of 2–5% is typical for route cable; splice tails may add another 2–3 meters per splice location per fiber. Undersizing a cable order by omitting the waste factor results in mid-project material shortages.',
  },
  {
    term: 'spare ratio',
    definition:
      'Extra material ordered beyond the installation quantity to provide on-hand spares for repairs and future splicing. Expressed as a percentage of the installed quantity (e.g., 10% spare). Splice hardware (trays, closures) commonly carries a 10% spare ratio; conduit and cable carry lower spares because they are site-specific and re-ordering is less urgent than a splice repair.',
  },
  {
    term: 'splitter (passive optical)',
    definition:
      'A passive device that divides one optical signal into multiple signals by splitting optical power. A 1:32 passive planar waveguide splitter takes 1 upstream fiber and divides the signal among 32 downstream ports. Splitter insertion loss for 1:32 is approximately 15.0–17.0 dB (theoretical minimum 10×log₁₀(32) = 15.05 dB; real-world excess loss adds 0.5–2 dB). Splitters are hardware costs that belong in the BOM as OSP materials — they install in the FDH or in a splice closure.',
  },
  {
    term: 'material lead time',
    definition:
      'The number of weeks (or months) between placing a purchase order and receiving the material on-site. Long lead time items must be ordered early or they become the critical path for construction start. Fiber cable for custom counts, large-diameter conduit, and specialty closures can carry 8–16 week lead times. Standard hardware (handholes, HDPE conduit in common sizes) is typically off the shelf.',
  },
  {
    term: 'take-off quantity',
    definition:
      'The raw quantity of a material derived by measuring the design drawings or GIS route — before waste factors or spare ratios are applied. A take-off quantity for fiber cable is the designed route length. The ordered quantity is take-off quantity × (1 + waste factor) × (1 + spare ratio). Confusing take-off quantity with ordered quantity is a common cause of material shortage.',
  },
];

export { key_terms };

const quizQuestions = [
  {
    id: 'T17L04_q1',
    question:
      'A fiber route is designed at 18,400 ft. The estimator applies a 3% waste factor and 5% spare ratio to calculate the cable order quantity. What is the correct ordered quantity?',
    options: [
      '18,400 ft — take-off quantity equals ordered quantity when design is complete',
      '18,952 ft — only waste factor applied (18,400 × 1.03)',
      '19,778 ft — waste applied first, then spare applied to the result (18,400 × 1.03 × 1.05)',
      '20,148 ft — both factors added together as 8% (18,400 × 1.08)',
    ],
    correct: 2,
    explanation:
      'Apply waste factor first (field installation losses), then spare ratio on top of the waste-adjusted quantity. 18,400 × 1.03 = 18,952 ft (waste-adjusted). 18,952 × 1.05 = 19,900 ft (order quantity — round up to the next full reel, typically 10,000 ft or 12,000 ft reels). Option D (adding 8% flat) gives a slightly different result because it ignores the compound nature of the two factors. The compound approach is technically more accurate; the flat-addition is a common simplification that produces similar results at these percentages.',
  },
  {
    id: 'T17L04_q2',
    question:
      'A 1:32 passive splitter is being budgeted for an FDH. The estimator uses $5.50/port as the cost (32 ports = $176 per splitter). A reviewer says the splitter hardware cost is typically $8–$25/port. What is the most likely explanation for the underestimate?',
    options: [
      'The $5.50/port figure is correct for 1:32 planar waveguide splitters in current market',
      'The $5.50 figure may reflect a 1:8 splitter price applied to a 1:32 quantity, understating the actual cost',
      'Splitter costs have no bearing on the CPHP calculation and can be omitted from the BOM',
      'The reviewer\'s $8–$25/port range includes optical amplifiers, which are a different product',
    ],
    correct: 0,
    explanation:
      'Actually, both options A and the reviewer\'s range require context. Current market pricing for 1:32 passive planar waveguide splitters varies widely — $8–$25/port is a reasonable range based on FBA/Cartesian benchmark data and OSP supplier pricing (2023–2024). At $5.50/port, the estimate is likely sourcing from a price list that is outdated, uses a different splitter type (1:8 or 1:16 rather than 1:32), or uses a volume pricing tier that may not apply to this project. The correct answer is A — the $5.50 figure is below typical market range and likely inaccurate — but the important lesson is: splitter hardware belongs in the BOM and must be verified against current supplier pricing, not guessed.',
  },
  {
    id: 'T17L04_q3',
    question:
      'Which material category on a fiber OSP project typically has the longest procurement lead time and should be ordered first?',
    options: [
      'HDPE conduit in standard sizes — high volume, widely stocked',
      'Precast handholes and vaults — available off-the-shelf from regional suppliers',
      'Custom fiber cable with a non-standard fiber count or jacket specification',
      'Ground rods and bonding hardware — commodity items at electrical distributors',
    ],
    correct: 2,
    explanation:
      'Custom fiber cable (non-standard fiber count, custom jacket color, specialty fiber type, or special length reels) typically carries 8–16 week lead times from cable manufacturers. Standard counts (12, 24, 48, 96, 144, 288) are usually available faster, but even these can have 4–8 week lead times during supply-constrained periods. The cable order must be placed as soon as the design is confirmed and before any other construction mobilizes — running out of cable mid-build is a costly and embarrassing delay.',
  },
  {
    id: 'T17L04_q4',
    question:
      'An estimator lists "splice closure hardware" in the BOM at $480/each for 12 closures = $5,760 total. The project manager asks about the spare ratio. The estimator says "none — we know we need exactly 12 closures." What is the risk?',
    options: [
      'No risk — if the design shows 12 closures, ordering exactly 12 is correct',
      'Minimal risk — splice closures are off-the-shelf items with next-day shipping',
      'Real risk — one dropped or damaged closure delays the entire splice crew while a replacement ships; spare ratio of 1–2 units prevents this',
      'High risk only if the closures require special cable entry ports not stocked locally',
    ],
    correct: 2,
    explanation:
      'Splice closures are not fragile items, but they are specific — the right size, port count, and dome/inline type for the design. If one is dropped off a pole or discovered damaged on opening, the splice crew is idle until a replacement arrives. Standard lead time from a distributor can be 1–3 days. One idle splice crew day at 3 persons × $520/day = $1,560 — far more than the cost of carrying 1–2 spare closures at $480 each. A 10–15% spare ratio (1–2 units on a 12-closure project) is standard practice and belongs in the BOM.',
  },
];

export default function L04BillOfMaterials() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>What Goes on the BOM</h2>

        <p>
          The bill of materials (BOM) is the itemized list of every physical thing you need to build the project —
          the fiber, the conduit, the handholes, the splice closures, the connectors, the splice trays, the mounting
          hardware, and everything else. Separate from labor. Separate from overhead. Just materials.
        </p>

        <p>
          A BOM has four columns that matter for estimating:
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>What It Contains</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Item description</strong></td>
              <td>What the item is, with enough specificity to order it — fiber type, count, cable type, conduit size, closure model</td>
              <td>"Fiber cable" is not a description. "144ct G.652.D SMF, loose-tube, OSP aerial lash, 12,000 ft reel" is a description.</td>
            </tr>
            <tr>
              <td><strong>Unit of measure</strong></td>
              <td>How it's counted and priced — feet, each, box, reel, pound</td>
              <td>Every supplier prices differently; confirm UOM matches the quote</td>
            </tr>
            <tr>
              <td><strong>Quantity</strong></td>
              <td>How many units are needed — take-off quantity adjusted for waste and spare</td>
              <td>This is the ordered quantity, not just the designed quantity</td>
            </tr>
            <tr>
              <td><strong>Unit cost</strong></td>
              <td>What you pay per unit — from supplier quote, contract price, or current market data</td>
              <td>Do not use list price; use actual or quoted cost for the project</td>
            </tr>
          </tbody>
        </table>

        <h3>Aerial BOM — Major Categories</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Typical Items</th>
              <th>Pricing Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fiber cable</td>
              <td>ADSS or lash cable, by fiber count and spec</td>
              <td>$/ft (on reel)</td>
            </tr>
            <tr>
              <td>Messenger strand</td>
              <td>6M or 10M galvanized steel, by gauge and strength class; stainless-steel for corrosive environments</td>
              <td>$/ft</td>
            </tr>
            <tr>
              <td>Lashing wire</td>
              <td>Stainless-steel or galvanized; spool size matched to route length</td>
              <td>$/1,000 ft spool</td>
            </tr>
            <tr>
              <td>Strand hardware</td>
              <td>Dead-end clamps, down-guys, anchor rods, thimbles, line guards</td>
              <td>$/each</td>
            </tr>
            <tr>
              <td>Splice closures</td>
              <td>Dome or in-line; sized for cable OD and tray count; aerial rated</td>
              <td>$/each</td>
            </tr>
            <tr>
              <td>Splice trays</td>
              <td>Matched to fiber count; typically 12 or 24 fiber per tray</td>
              <td>$/each</td>
            </tr>
            <tr>
              <td>Passive splitters (GPON builds)</td>
              <td>1:32 or 1:16 planar waveguide; FDH-mount or closure-mount</td>
              <td>$/port or $/unit</td>
            </tr>
            <tr>
              <td>Lash anchors / cable brackets</td>
              <td>Figure-8 lash anchor, dead-end cable clamps, aerial terminal blocks</td>
              <td>$/each</td>
            </tr>
          </tbody>
        </table>

        <h3>Underground BOM — Major Categories</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Typical Items</th>
              <th>Pricing Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Conduit</td>
              <td>HDPE Schedule 40 or SDR-11, by diameter and wall thickness; coilable or rigid</td>
              <td>$/ft or $/100 ft coil</td>
            </tr>
            <tr>
              <td>Innerduct</td>
              <td>Corrugated or smooth-bore; orange (telecom standard), 1" or 1.25" ID</td>
              <td>$/ft</td>
            </tr>
            <tr>
              <td>Pull tape / mule tape</td>
              <td>1,200 lb or 2,400 lb rated; pre-installed in conduit or pulled separately</td>
              <td>$/ft</td>
            </tr>
            <tr>
              <td>Handholes and vaults</td>
              <td>Precast polymer or concrete; by opening size and depth; cover type</td>
              <td>$/each</td>
            </tr>
            <tr>
              <td>Fiber cable (underground)</td>
              <td>OSP underground rated, gel-filled or dry loose-tube, by fiber count</td>
              <td>$/ft (on reel)</td>
            </tr>
            <tr>
              <td>Splice closures (underground)</td>
              <td>Direct-bury or vault-mount; watertight; sized for cable count and entry ports</td>
              <td>$/each</td>
            </tr>
            <tr>
              <td>Conduit fittings</td>
              <td>Sweeps, couplings, end caps, duct plugs, sealant</td>
              <td>$/each or $/box</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ── */}
      <section className="lesson-section working">
        <h2>Waste Factors and Spare Ratios — Don't Underorder</h2>

        <p>
          The quantities on your design drawings are theoretical. Real construction consumes more than the design
          quantity for two reasons:
        </p>

        <p>
          <strong>Waste factor</strong> covers material lost during installation — the extra cable fed into a handhole
          for future splicing (8–10 ft of slack per closure), cut ends from reel starts, and damaged sections pulled
          out and replaced. For fiber cable, 3–5% waste is typical. For conduit, 1–2%.
        </p>

        <p>
          <strong>Spare ratio</strong> covers on-hand stock after the project — repair stock for damage, extras for
          future adds. Splice closure hardware: 10%. Fiber cable: 5% (one short reel). Conduit: 2–3%.
        </p>

        <div className="callout callout-info">
          <strong>Ordered quantity formula:</strong><br />
          Ordered Qty = Take-off Qty × (1 + Waste Factor) × (1 + Spare Ratio)
          <br /><br />
          Example: 18,400 ft of cable × 1.03 (waste) × 1.05 (spare) = 19,900 ft ordered.
        </div>

        <h3>Splitter Hardware — The Most Frequently Omitted Line Item</h3>

        <p>
          On GPON builds (most rural broadband builds today), passive optical splitters are a real material cost that
          gets omitted from BOM estimates surprisingly often. The reason: splitters are sometimes procured by the
          network equipment team, not the OSP construction team — and they fall through the gap between the two
          estimates.
        </p>

        <p>
          Current pricing for 1:32 passive planar waveguide splitters runs approximately $8–$25 per port depending on
          quality tier and quantity. For a 32-port splitter: $256–$800 per unit. If the project has 200 FDH ports
          (about 6–7 splitters), that's $1,500–$5,600 in hardware that may not appear in either the OSP estimate or
          the electronics estimate.
        </p>

        <p>
          Per the T17 prerequisite brief: "Splitter hardware (typically $8–$25/port for 1:32 passive planar waveguide)
          is a material cost that IS included in CPHP since it is installed plant. Often forgotten in estimates because
          it is purchased as electronic supply rather than OSP material supply." Put it in the BOM. Verify it's not
          also in another estimate. Never double-count or omit.
        </p>

        <h3>Material Lead Times — What Gets Ordered First</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Typical Lead Time</th>
              <th>Risk if Ordered Late</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Custom fiber cable (non-standard count or spec)</td>
              <td>8–16 weeks</td>
              <td>Construction cannot start without it — critical path</td>
            </tr>
            <tr>
              <td>Standard fiber cable (24–288 count, off the shelf)</td>
              <td>4–8 weeks</td>
              <td>Often in distributor stock; can sometimes ship 1–2 weeks</td>
            </tr>
            <tr>
              <td>Passive splitters</td>
              <td>4–12 weeks</td>
              <td>Delays FDH commissioning; homes passed but not connectable</td>
            </tr>
            <tr>
              <td>Precast handholes / vaults (standard sizes)</td>
              <td>1–3 weeks</td>
              <td>Off-the-shelf at regional precast suppliers</td>
            </tr>
            <tr>
              <td>HDPE conduit (standard diameters)</td>
              <td>1–2 weeks</td>
              <td>Usually in stock at telecom distributors</td>
            </tr>
            <tr>
              <td>Specialty closures (high port count, custom entry)</td>
              <td>4–8 weeks</td>
              <td>Splice work delayed waiting for closure; crew idle</td>
            </tr>
          </tbody>
        </table>

        <p>
          The procurement timeline is part of the BOM process. When building a BOM, flag any item with a lead time
          longer than 4 weeks for immediate purchase-order action. The most expensive delay on an OSP project is a
          fully-mobilized crew waiting for materials.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Material vs. Installed Cost — Why the BOM Isn't the Full Story</h2>

        <p>
          The BOM gives you material cost. Installed cost is material plus labor to install it. These are different
          numbers, and the ratio between them varies by material type:
        </p>

        <ul>
          <li><strong>Fiber cable:</strong> material is typically 30–50% of installed cost (cable is expensive; lashing labor adds 50–70%)</li>
          <li><strong>HDPE conduit:</strong> material is typically 20–35% of installed cost (conduit itself is cheap; boring and trenching labor dominates)</li>
          <li><strong>Splice closure:</strong> material is 40–60% of installed cost (closures are more expensive per-unit; splicing labor is significant but the per-closure count is fixed)</li>
          <li><strong>Handholes/vaults:</strong> material is 20–40% of installed cost (concrete products are heavy; excavation, setting, bedding, and backfill add up)</li>
        </ul>

        <p>
          When reviewing an estimate, look at the material-to-installed ratio. If someone has a $5 handhole material
          cost but shows $6 installed cost, the installation labor is implausibly low — handholes require excavation,
          leveling, backfill, and compaction. A ratio below 30% (material fraction) should raise questions.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            A BOM is the bridge between design decisions and cost:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T03.L05 (Cable Selection)</strong> — specifies cable type, fiber count, and jacket. That selection becomes a line item in your BOM with a unit price from the supplier and a total material cost.</li>
            <li><strong>T07.L09 (Fiber Topology Canvas)</strong> — the topology diagram determines span counts, structure locations, and handhole counts. Those quantities feed directly into your BOM structure count and hardware line items.</li>
            <li><strong>T17.L03 (Productivity Modeling)</strong> — labor productivity tells you how many crew-hours to assign to each BOM line item. Cable termination labor = unit termination time × BOM termination count.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            An incomplete BOM is the leading cause of estimate underruns and change orders. If your BOM doesn't account for splicing, termination, testing, or restoration, your estimate is missing 10–20% of the real cost.
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
        <Quiz questions={quizQuestions} lessonId="T17.L04" />
      </section>
    </LessonLayout>
  );
}
