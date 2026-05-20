import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L05',
  course_id: 'T17',
  title: 'Contract Types — Lump-Sum, Unit-Price, and the RUS Rules',
  order: 5,
  prerequisites: ['T17.L04'],
  learning_objectives: [
    'Distinguish between lump-sum, unit-price, time-and-materials, and GMP contract types',
    'Explain when each contract type is appropriate for OSP construction',
    'State the 7 CFR Part 1788 competitive procurement requirements for RUS borrowers',
    'Identify which contract types are allowed for RUS new construction and which are not',
    'Explain why T&M is generally not used as the primary contract type for RUS new OSP builds',
  ],
  estimated_minutes: 42,
  vocabulary_introduced: [
    'lump-sum contract',
    'unit-price contract',
    'time-and-materials contract (T&M)',
    'not-to-exceed (NTE)',
    'guaranteed maximum price (GMP)',
    'competitive sealed bid (RUS)',
    '7 CFR Part 1788',
  ],
  vocabulary_assumed: [
    'scope of work (SOW)',
    'unit cost (construction)',
    'production unit',
    'bill of materials (BOM)',
    'force account labor',
    'direct cost',
    'indirect cost / overhead',
    'bore cost',
    'make-ready cost',
    'RUS (Rural Utilities Service)',
  ],
};

const key_terms = [
  {
    term: 'lump-sum contract',
    definition:
      'A contract where the contractor agrees to complete a defined scope of work for a single fixed price, regardless of the actual labor and material cost the contractor incurs. The contractor bears all the cost risk within scope. The owner\'s risk is limited to scope changes. Most appropriate when the design is complete and the scope is fully defined before bidding.',
  },
  {
    term: 'unit-price contract',
    definition:
      'A contract where the contractor is paid a fixed price per production unit (per foot of conduit, per splice, per handhole set) rather than a lump sum. The total contract value varies based on the actual quantities installed. The contractor\'s unit price is fixed; only the quantity floats. Most common in OSP construction because exact quantities (route feet, splice count) are difficult to know precisely before staking.',
  },
  {
    term: 'time-and-materials contract (T&M)',
    definition:
      'A contract where the owner pays the contractor\'s actual labor hours at agreed rates plus actual material costs plus a markup. The contractor bears no cost risk — if the job takes longer or costs more, the owner pays more. T&M is appropriate for emergency work, investigative work where scope is unknown, or small change orders. It is generally NOT allowed as the primary contract type for RUS new construction.',
  },
  {
    term: 'not-to-exceed (NTE)',
    definition:
      'A maximum dollar limit attached to a T&M contract — the contractor performs T&M work up to the NTE ceiling and cannot bill above it without written authorization. T&M-NTE is a compromise between the owner\'s cost certainty need and the contractor\'s scope uncertainty. The NTE doesn\'t make T&M appropriate for RUS new construction; it just limits the owner\'s maximum exposure.',
  },
  {
    term: 'guaranteed maximum price (GMP)',
    definition:
      'A contract type where the contractor guarantees the total project cost will not exceed a stated maximum. If the actual cost is below the GMP, savings may be shared between owner and contractor per a predetermined split. GMP is typically used on design-build projects or when the scope is partially defined. Less common in pure-OSP construction than lump-sum or unit-price.',
  },
  {
    term: 'competitive sealed bid (RUS)',
    definition:
      'A procurement process where qualified contractors submit binding price proposals in sealed envelopes, all opened simultaneously. The owner awards to the lowest responsive and responsible bidder. Required by 7 CFR Part 1788 for RUS borrowers on new construction contracts above the applicable dollar threshold. The competitive sealed bid process prevents favoritism and ensures public funds are spent at market rates.',
  },
  {
    term: '7 CFR Part 1788',
    definition:
      'The Code of Federal Regulations section governing how RUS (Rural Utilities Service) borrowers must procure construction contracts. Part 1788 (Methods of Contracting) requires RUS borrowers to use competitive bidding for construction contracts above the applicable dollar threshold. Allowed contract types for new construction are lump-sum (fixed price) and unit-price. T&M is only allowed for emergency work, force account supplements, and change orders on lump-sum contracts — not as the primary contract type for new construction.',
  },
];

export { key_terms };

const contractScenario = {
  id: 'T17L05_scenario',
  title: 'Choosing the Right Contract Type',
  initialState: 'start',
  states: {
    start: {
      text: 'A RUS electric cooperative borrower is planning a new 18-mile FTTH overbuild. The OSP design is 80% complete — route is staked, major structures located, approximate fiber count decided. They are ready to solicit contractors. What contract type should they use for the primary OSP construction contract?',
      choices: [
        { label: 'T&M-NTE — scope isn\'t fully defined yet, so T&M with a cap makes sense', next: 'wrong_tm' },
        { label: 'Lump-sum — design is 80% complete, close enough to bid a fixed price', next: 'consider_lumpsum' },
        { label: 'Unit-price — allows quantity to float as final staking adjusts the route', next: 'correct_unitprice' },
        { label: 'GMP — gives the owner a cost ceiling while allowing scope flexibility', next: 'consider_gmp' },
      ],
    },
    wrong_tm: {
      text: 'Incorrect for a RUS project. Under 7 CFR Part 1788, T&M is not allowed as the primary contract type for RUS new construction above the competitive bidding threshold. T&M is permitted only for emergency work, force account supplements, and change orders on a primary lump-sum contract. Using T&M for an 18-mile FTTH build would likely violate the borrower\'s RUS loan agreement and could jeopardize the loan approval.',
      choices: [
        { label: 'Try again — go back to the contract selection', next: 'start' },
      ],
    },
    consider_lumpsum: {
      text: 'Lump-sum is permitted under 7 CFR §1788.11 for RUS new construction and is common when the full route is staked and located before bidding. At 80% design completion, is a lump-sum appropriate here?',
      choices: [
        { label: 'Yes — 80% design is close enough to bid a firm price', next: 'lumpsum_risk' },
        { label: 'Not yet — the 20% unfinished design creates real scope uncertainty', next: 'correct_unitprice' },
      ],
    },
    lumpsum_risk: {
      text: 'You could bid lump-sum at 80% design, but consider: the remaining 20% of design may change route quantities, structure locations, or fiber count. Contractors will price in risk — any uncertainty in a lump-sum contract becomes a contingency add in the bid. If the actual quantities come in lower than what contractors estimated, the owner paid for contingency they didn\'t use. The better practice: finish the design, then bid lump-sum. Or use unit-price while design is still in progress.',
      choices: [
        { label: 'So unit-price is better for an 80%-complete design?', next: 'correct_unitprice' },
      ],
    },
    correct_unitprice: {
      text: 'Correct. Unit-price is the most common and most appropriate contract type for OSP new construction — especially on RUS projects. The contractor bids a fixed price per production unit ($/ft of conduit, $/splice, $/handhole set). As final staking adjusts the route, quantities change but unit prices stay fixed. The contractor\'s margin is protected; the owner pays only for what\'s actually installed. Unit-price is specifically allowed under 7 CFR §1788.11 for RUS borrowers. For competitive procurement, the unit-price bid schedule becomes the bid form — contractors bid the same unit prices, quantities are held constant for bid comparison.',
      choices: [
        { label: 'What about after award — can individual items use T&M?', next: 'tm_change_orders' },
        { label: 'Good. How does competitive bidding work under 7 CFR Part 1788?', next: 'rus_bidding' },
      ],
    },
    consider_gmp: {
      text: 'GMP is less common in pure OSP construction. It requires a design-build or cost-plus relationship with the contractor where the contractor is involved in design. On a traditional bid project (owner designs, contractor builds), GMP adds complexity without clear benefit. More importantly, GMP is not the preferred procurement method under 7 CFR Part 1788 for RUS new construction. Consider unit-price or lump-sum instead.',
      choices: [
        { label: 'Go back to the contract selection', next: 'start' },
      ],
    },
    tm_change_orders: {
      text: 'Yes — T&M is appropriate for change orders on a primary lump-sum or unit-price contract. If a route change is required mid-construction (new obstacle, landowner issues, utility conflict), the change order for the rerouted section can be negotiated as T&M or T&M-NTE because the scope is unknown until the crew works through it. The key: T&M is a change-order tool, not a primary contract type for RUS new construction.',
      choices: [
        { label: 'Understood. How does the competitive bidding process work?', next: 'rus_bidding' },
      ],
    },
    rus_bidding: {
      text: 'Under 7 CFR §1788.15, RUS borrowers must use competitive sealed bids for construction contracts above the applicable dollar threshold (confirm current threshold with RUS — thresholds are updated periodically). Process: (1) publish solicitation with bid documents and unit-price schedule, (2) receive sealed bids, (3) open all bids simultaneously and publicly, (4) award to the lowest responsive and responsible bidder. "Responsive" means the bid follows the bid format. "Responsible" means the contractor is qualified to do the work. Sole-source awards (going directly to one contractor without bidding) are prohibited for new construction above the threshold.',
      choices: [
        { label: 'Scenario complete — I understand contract types for RUS projects', next: 'end' },
      ],
    },
    end: {
      text: 'You\'ve navigated the contract type decision correctly. Key takeaways: (1) Unit-price is the most common OSP contract type — it accommodates quantity changes without renegotiation. (2) 7 CFR Part 1788 requires competitive sealed bids for RUS new construction above the threshold. (3) Allowed contract types for RUS new construction: lump-sum and unit-price. (4) T&M is NOT allowed as the primary contract type for RUS new construction — only for change orders, emergency work, and force account supplements.',
      choices: [],
    },
  },
};

const quizQuestions = [
  {
    id: 'T17L05_q1',
    question:
      'A contractor submits a unit-price bid of $14.50/ft for underground conduit installation on a 6-mile RUS project. The bid schedule estimates 31,680 ft of conduit. After construction, the actual installed footage is 30,100 ft due to a route optimization. Under a unit-price contract, what is the final contract payment for this line item?',
    options: [
      '$459,360 — the original bid estimate × $14.50/ft',
      '$436,450 — actual quantity × unit price ($14.50 × 30,100)',
      '$14.50/ft regardless — unit-price contracts never adjust for quantity',
      'Subject to negotiation — actual quantities below the bid estimate trigger a change order',
    ],
    correct: 1,
    explanation:
      'Under a unit-price contract, the contractor is paid the unit price times the actual installed quantity — not the estimated quantity. $14.50 × 30,100 ft = $436,450. The unit price is fixed; the quantity floats based on what was actually built. This is the defining characteristic of unit-price contracts and why they are appropriate for OSP construction where quantities aren\'t perfectly known at bid time. The owner pays for exactly what was installed — no more, no less.',
  },
  {
    id: 'T17L05_q2',
    question:
      'Which statement about 7 CFR Part 1788 and RUS procurement is accurate?',
    options: [
      'T&M is the preferred contract type for RUS new construction because scope is never fully defined',
      'RUS borrowers may use sole-source contracts for new construction if the selected contractor has done previous RUS work',
      'Lump-sum and unit-price are the allowed contract types for RUS new construction; T&M is restricted to change orders and emergency work',
      'Competitive bidding is only required for contracts above $1 million; smaller projects can use any contract type',
    ],
    correct: 2,
    explanation:
      '7 CFR Part 1788 (Methods of Contracting) governs RUS borrower procurement. For new construction above the applicable threshold, competitive sealed bids are required — no sole-source awards. The allowed contract types for new construction are lump-sum (fixed price) and unit-price. T&M is only allowed for: (1) emergency work where competitive bidding is not practicable, (2) force account supplements, and (3) change orders on a primary lump-sum contract. T&M as the primary contract type for new RUS construction violates Part 1788 and risks jeopardizing the RUS loan.',
  },
  {
    id: 'T17L05_q3',
    question:
      'An OSP project manager is explaining T&M-NTE to a field crew. Which description is most accurate?',
    options: [
      'T&M-NTE is a lump-sum contract with a built-in contingency fund',
      'T&M-NTE pays actual labor hours and material at agreed rates, but the total cannot exceed a stated maximum without change order authorization',
      'T&M-NTE is the standard contract type for RUS new construction where scope is uncertain',
      'NTE stands for "no time extension" — the contractor must finish by a fixed date regardless of conditions',
    ],
    correct: 1,
    explanation:
      'T&M-NTE (Time and Materials, Not to Exceed) combines T&M billing (actual hours at agreed rates + actual materials + markup) with a contractual ceiling. The contractor cannot bill above the NTE without written authorization. This gives the owner a maximum exposure number while allowing flexibility for uncertain scope. The "not-to-exceed" does not change the underlying T&M structure — it just caps it. NTE absolutely does not stand for "no time extension."',
  },
  {
    id: 'T17L05_q4',
    question:
      'Why is unit-price preferred over lump-sum for most OSP projects even when the design is complete?',
    options: [
      'Unit-price costs less overall because contractors don\'t add contingency for scope risk',
      'Lump-sum requires union contractors; unit-price does not',
      'Unit-price allows route quantity changes (more or fewer feet, more or fewer handholes) without renegotiating the entire contract — only the actual quantities change',
      'Unit-price is required by BICSI OSPDR standards for all fiber construction',
    ],
    correct: 2,
    explanation:
      'Unit-price is preferred because OSP construction quantities almost always deviate from the design — route changes to avoid obstacles, additional handholes required by field conditions, revised fiber counts for late-added customers. Under lump-sum, every deviation requires a change order that renegotiates the price for the changed scope. Under unit-price, the quantities simply update; the price per unit stays fixed. The contractor\'s margin is protected against scope shrinkage (fewer feet = less revenue, but also less cost) and the owner pays only for what was installed. This makes unit-price contracts much easier to administer for both parties.',
  },
];

export default function L05ContractTypes() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>The Four Main Contract Types in OSP Construction</h2>

        <p>
          A construction contract is how the owner and the contractor agree on what will be built, for how much, and
          who bears the risk when the actual cost differs from the estimate. There are four contract types you'll
          encounter in OSP work, and the choice matters — especially on RUS-funded projects.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Contract Type</th>
              <th>How Price Is Set</th>
              <th>Who Bears Cost Risk</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Lump-sum</strong></td>
              <td>Single fixed price for the entire defined scope</td>
              <td>Contractor — if it costs more than estimated, contractor absorbs it</td>
              <td>Fully designed projects; known quantities; competitive bid situations</td>
            </tr>
            <tr>
              <td><strong>Unit-price</strong></td>
              <td>Fixed price per production unit ($/ft, $/each) × actual quantities installed</td>
              <td>Shared — unit price is fixed, quantity floats with actual work</td>
              <td>OSP new construction; any work where quantities may change during construction</td>
            </tr>
            <tr>
              <td><strong>T&amp;M</strong></td>
              <td>Actual labor hours × agreed rates + actual materials + markup</td>
              <td>Owner — contractor gets paid regardless of efficiency</td>
              <td>Emergency work; investigative work; change orders where scope is unknown</td>
            </tr>
            <tr>
              <td><strong>GMP</strong></td>
              <td>Cost-plus with a contractual ceiling; savings may be shared</td>
              <td>Split — contractor absorbs cost above GMP; savings shared below GMP</td>
              <td>Design-build; complex projects; early contractor involvement in design</td>
            </tr>
          </tbody>
        </table>

        <h3>T&M-NTE — The Hybrid</h3>

        <p>
          T&M-NTE (Time and Materials, Not to Exceed) is the most common compromise for construction where scope is
          partially defined. It operates exactly like T&M — the owner pays actual labor at agreed rates plus actual
          materials — but with a contractual ceiling (the NTE) above which the contractor cannot bill without
          written authorization.
        </p>

        <p>
          T&M-NTE is appropriate for: change order work on a primary lump-sum contract, emergency repairs, or
          preliminary site investigation work before a full project scope is established. It is <em>not</em> appropriate
          as the primary contract type for RUS new OSP construction.
        </p>
      </section>

      {/* ── SCENARIO ── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <strong className="text-blue-600 dark:text-blue-300">Quick Recall:</strong> <strong>Bill of materials (BOM)</strong> is the itemized list of materials needed (from T04); <strong>force account labor</strong> is work done by the owner's own employees with documented time (from T02); <strong>bore cost</strong> is directional drilling expense (from T06); and <strong>make-ready cost</strong> is the cost to prepare poles (from T02).
        </div>

        <h2>Scenario: Choosing the Right Contract for a RUS Project</h2>
        <BranchingScenario {...contractScenario} />
      </section>

      {/* ── RUS RULES ── */}
      <section className="lesson-section working">
        <h2>7 CFR Part 1788 — The Rules That Override Your Preference</h2>

        <p>
          On private projects, the contract type is between the owner and contractor. On RUS-funded projects, the
          contract type is also a federal compliance matter. 7 CFR Part 1788 (Methods of Contracting) governs how RUS
          borrowers must procure construction work.
        </p>

        <div className="callout callout-warning">
          <strong>RUS borrower compliance is not optional.</strong> An RUS borrower who uses a non-compliant contract
          type or procurement method risks having the RUS disallow the costs — meaning the loan or grant funds don't
          cover those expenses and the borrower is left holding the bill. For projects that are 75–90% RUS-funded, this
          is existential.
        </div>

        <h3>What 7 CFR Part 1788 Requires</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Competitive sealed bids</strong></td>
              <td>New construction contracts above the applicable threshold require competitive sealed bids. All bids are submitted sealed and opened simultaneously. Award goes to the lowest responsive and responsible bidder.</td>
            </tr>
            <tr>
              <td><strong>Allowed contract types (new construction)</strong></td>
              <td>Lump-sum (fixed price) and unit-price. These are the two types specifically permitted under §1788.11 for new construction.</td>
            </tr>
            <tr>
              <td><strong>T&M restrictions</strong></td>
              <td>T&M is only allowed for: (1) emergency work where competitive bidding isn't practicable, (2) force account supplements (owner's own crew on a contractor's project), (3) change orders on a primary lump-sum contract. T&M is NOT allowed as the primary contract type for new construction.</td>
            </tr>
            <tr>
              <td><strong>No sole-source awards</strong></td>
              <td>RUS borrowers may not award new construction contracts sole-source (to one contractor without competition) above the threshold, even to a contractor who has done previous RUS work for the borrower. Exceptions are narrow and require RUS approval.</td>
            </tr>
            <tr>
              <td><strong>Force account procedures</strong></td>
              <td>Force account labor (owner's own crew) is governed separately. Requires time sheets, equipment logs, and overhead documentation per Part 1788 and 7 CFR §1755 procedures (covered in L02).</td>
            </tr>
          </tbody>
        </table>

        <h3>Unit-Price on RUS Projects — The Practical Standard</h3>

        <p>
          Most RUS new fiber construction uses unit-price contracts, for the same reason unit-price is preferred
          everywhere in OSP: the exact footage can't be known until the route is fully staked, and it changes during
          construction. Under a unit-price contract, the bid form lists the production units ($/ft conduit,
          $/ft cable pull, $/splice, $/handhole) and each bidder fills in their unit price. Quantities are held the
          same for all bidders — the award goes to the bidder with the lowest total when unit prices are multiplied
          by estimated quantities.
        </p>

        <h4>Davis-Bacon Act Prevailing Wages — RUS Grants vs. Loans</h4>

        <p>
          RUS grants (including BEAD grants) require Davis-Bacon Act prevailing wages per 40 USC §3141 et seq.
          Contractors on these projects must pay laborers and mechanics the federal prevailing wage for the county
          and trade. RUS direct loans typically do not trigger Davis-Bacon requirements — the applicability depends
          on the specific funding source and whether the project involves federal funding above the threshold. Inspectors
          and project managers must verify Davis-Bacon applicability based on the project's actual funding source(s)
          at contract award time. Non-compliance can void federal funding.
        </p>

        <h4>Bid Bonds and Performance Bonds</h4>

        <p>
          Competitive unit-price and lump-sum contracts typically require two bonds: a bid bond (5–10% of the
          bid price) due upon bid submission to ensure the bidder will sign the contract if awarded, and a
          performance bond (100% of the contract value) due at contract execution to guarantee the contractor will
          complete the work per specifications. Federal contracts (FAR 28.102) require both for contracts exceeding
          small-purchase thresholds. Private projects vary by owner policy. The bid bond is refunded to unsuccessful
          bidders; the performance bond is held through project completion.
        </p>

        <p>
          During construction, actual quantities are tracked per the staked route and as-built drawings. The owner
          pays unit price × actual quantity, not unit price × estimated quantity.
        </p>

        <h3>Lump-Sum on RUS Projects — When It's Used</h3>

        <p>
          Lump-sum is appropriate when the OSP design is complete — the full route is staked and located, exact
          structure locations are set, fiber count is final, and the contractor can walk every inch of the route before
          submitting a bid. In that case, the contractor can price the complete scope with confidence. Lump-sum is
          more common for service-drop programs (where each drop has a known scope) than for route builds.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: RFP vs. IFB — Different Solicitation Documents for Different Contract Types</h2>

        <p>
          The solicitation document (the package you send to contractors asking for bids or proposals) varies by
          contract type:
        </p>

        <ul>
          <li>
            <strong>IFB (Invitation for Bids)</strong> — used for competitive sealed bids (lump-sum or unit-price).
            The IFB specifies the exact scope, the bid form, and the award criteria (lowest responsive/responsible
            bidder). Price is the selection criterion. Used for RUS new construction.
          </li>
          <li>
            <strong>RFP (Request for Proposals)</strong> — used when technical approach, qualifications, and price
            are all evaluation factors. More common for professional services (engineering, design) than for
            construction. Some design-build projects use RFP. NOT the standard for RUS new construction bidding —
            price competition on a common scope (IFB) is the RUS requirement.
          </li>
          <li>
            <strong>RFQ (Request for Qualifications)</strong> — solicits contractor qualifications only, not price.
            Used for prequalification lists. Not a contract award mechanism; it's a preliminary screening step.
          </li>
        </ul>

        <p>
          On RUS projects, the standard is IFB → competitive sealed bid → award to lowest responsive/responsible.
          If the project includes engineering services as part of a design-build delivery, the engineer selection
          may use RFQ or RFP for the design portion, but the construction contract itself should follow IFB
          procedures per Part 1788.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Contract type determines how your estimate will be used and what flexibility you have if conditions change:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T17.L01 (Estimating Mindset)</strong> — teaches you how to build an estimate. The contract type determines whether you will be paid for that estimate as-is, or whether you'll be exposed to risk if conditions change.</li>
            <li><strong>T17.L06 (Change Orders)</strong> — change orders are the mechanism for adjusting lump-sum contracts when unexpected conditions arise. Cost-plus contracts avoid change orders but expose the owner to open-ended cost.</li>
            <li><strong>T17.L07 (Contingency & Escalation)</strong> — your contingency buffer is only valuable under certain contract types. In a fixed-price contract with no contingency, contingency IS your risk. In cost-plus with contingency, you're managing owner funds, not your own margin.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            The best estimators match their contract pricing strategy to the project's known uncertainties. High-uncertainty underground work is bid cost-plus or T&amp;M with a cap. Low-uncertainty aerial work is bid lump-sum.
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
        <Quiz questions={quizQuestions} lessonId="T17.L05" />
      </section>
    </LessonLayout>
  );
}
