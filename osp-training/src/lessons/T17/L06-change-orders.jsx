import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T17.L06',
  course_id: 'T17',
  title: 'Change Orders — Anatomy and Prevention',
  order: 6,
  prerequisites: ['T17.L05'],
  learning_objectives: [
    'Define a change order and identify the events that trigger one',
    'Explain the owner-directed vs. contractor-initiated change order distinction',
    'Calculate the cost impact of a change order on a unit-price contract',
    'Identify the most common root causes of change orders on OSP projects',
    'Describe prevention strategies that reduce change order frequency and value',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'change order',
    'change order request (COR)',
    'owner-directed change',
    'constructive change',
    'differing site condition',
    'change order log',
  ],
  vocabulary_assumed: [
    { term: 'unit-price contract', source_lesson_id: 'T17.L05' },
    { term: 'lump-sum contract', source_lesson_id: 'T17.L05' },
    { term: 'time-and-materials contract (T&M)', source_lesson_id: 'T17.L05' },
    { term: 'not-to-exceed (NTE)', source_lesson_id: 'T17.L05' },
    { term: '7 CFR Part 1788', source_lesson_id: 'T17.L05' },
    { term: 'force account labor', source_lesson_id: 'T17.L02' },
    { term: 'production unit', source_lesson_id: 'T17.L03' },
    { term: 'labor burden', source_lesson_id: 'T17.L03' },
    { term: 'bore cost', source_lesson_id: 'T17.L02' },
    { term: 'make-ready cost', source_lesson_id: 'T17.L02' },
    { term: 'scope of work (SOW)', source_lesson_id: 'T17.L01' },
  ],
};

const key_terms = [
  {
    term: 'change order',
    definition:
      'A written amendment to a construction contract that modifies the scope, schedule, or price. A change order must be signed by both the owner and the contractor before additional work is authorized. Verbal authorizations do not create a valid change order; any work performed on verbal direction before a signed change order is a risk borne by the contractor.',
  },
  {
    term: 'change order request (COR)',
    definition:
      'The contractor\'s written notice to the owner that a condition exists which the contractor believes entitles them to additional compensation or time. The COR is not the same as the change order — it is the contractor\'s formal initiation of the process. The owner reviews, negotiates, and either approves (which becomes a signed change order) or rejects the COR.',
  },
  {
    term: 'owner-directed change',
    definition:
      'A change to the contract scope that is initiated by the owner. Examples: the owner adds an additional splice closure to the design, changes the fiber count, or adds a route extension. Owner-directed changes are generally straightforward — the owner decides to change something, and the contractor prices the additional work.',
  },
  {
    term: 'constructive change',
    definition:
      'A change in the contractor\'s work that was directed by the owner\'s actions or inactions, even though no formal change order was issued. Examples: the owner delays providing easement access (forcing the contractor to remobilize), or the owner\'s representative verbally directs the crew to add an unplanned handhole. Constructive changes can create contractor entitlement to additional compensation even without a written change order initiation.',
  },
  {
    term: 'differing site condition',
    definition:
      'A subsurface or concealed condition that differs materially from what the contract documents or a reasonable pre-bid site inspection would have indicated. For OSP underground work, differing site conditions commonly include: rock where the soil borings showed dirt, buried utilities not shown on the utility locate, and water table higher than the contract documents indicated. A valid differing site condition claim entitles the contractor to additional compensation.',
  },
  {
    term: 'change order log',
    definition:
      'A running record of all change orders and change order requests on a project, tracking: COR number, description, date submitted, current status (pending/approved/rejected), dollar value, and schedule impact. The change order log is a critical project management tool — it shows cumulative scope growth and tracks which items are unresolved. On large OSP projects, unmanaged change order logs become significant cost exposure.',
  },
];

export { key_terms };

const quizQuestions = [
  {
    id: 'T17L06_q1',
    question:
      'A contractor is performing conduit installation on a unit-price contract at $14.50/ft. During bore, the crew encounters a large unmapped concrete storm drain requiring a 280-ft bypass bore through different alignment. The bypass bore takes 3 additional crew-days at $520/person/day for a 4-person crew. The original alignment was 280 ft shorter. Under a unit-price contract, what happens to the contractor\'s revenue?',
    options: [
      'Revenue stays the same — the unit price covers all field conditions, including unexpected obstacles',
      'Revenue increases slightly — the bypass is 280 additional feet at $14.50/ft = $4,060 extra, but does not cover the extra crew time through the harder material',
      'Revenue may increase via a change order — the unmapped storm drain is a differing site condition that entitles the contractor to additional compensation beyond the unit price for the affected footage',
      'Revenue decreases — the contractor should have discovered the obstacle during the 811 locate process',
    ],
    correct: 2,
    explanation:
      'An unmapped concrete storm drain that doesn\'t appear on utility locates or contract documents is a differing site condition — a subsurface condition that differs materially from what a reasonable pre-bid inspection would have indicated. The contractor is entitled to additional compensation for the additional labor and equipment time caused by this condition. The $14.50/ft unit price covers the expected production rate; it does not cover 3 crew-days of extra labor at a lower-than-expected productivity rate. The contractor should submit a change order request (COR) documenting the differing condition, the extra time, and the cost impact.',
  },
  {
    id: 'T17L06_q2',
    question:
      'Which of the following is NOT a valid change order? Choose the answer that describes an invalid or improper change order process.',
    options: [
      'Owner sends written direction to add 2 miles of route extension; contractor prices it; both sign a change order before the extra work begins',
      'Owner\'s field representative verbally tells the splicing crew to add an extra splice closure; crew adds it; contractor submits COR for the closure cost afterward',
      'Contractor encounters rock during bore and submits a differing site conditions claim; owner and contractor negotiate the extra cost and sign a change order',
      'Owner and contractor agree in a phone call that the fiber count can change; contractor orders more fiber; both later sign a written change order',
    ],
    correct: 1,
    explanation:
      'Option B describes a problematic situation that frequently leads to disputes. A verbal field direction is not a written change order. The contractor performs the extra work based on verbal direction, then submits a COR after the fact. Whether this is valid depends on the contract terms — most construction contracts require written authorization before extra work, not after. The best practice is to pause, submit a COR, get a signed change order, then do the work. Performing first and claiming later is risky. Option D (phone call followed by written documentation) is legally acceptable in most contracts as long as the written documentation precedes or accompanies the work.',
  },
  {
    id: 'T17L06_q3',
    question:
      'What is the most common root cause of change orders on OSP projects, and what design-phase activity would most effectively reduce them?',
    options: [
      'Weather delays — longer construction windows with seasonal scheduling prevents most change orders',
      'Incomplete staking and subsurface investigation — pre-bid geotechnical borings, utility locates, and full-route staking completed before bidding prevents most underground change orders',
      'Contractor error — requiring higher contractor bonding requirements reduces change order frequency',
      'Material price escalation — locking in material prices before bidding eliminates price-driven change orders',
    ],
    correct: 1,
    explanation:
      'The most common root cause of change orders on OSP projects is incomplete information at bid time — particularly for underground work. If the route isn\'t fully staked, if subsurface conditions aren\'t investigated, and if utility locates aren\'t complete before contractors bid, contractors must price in risk contingencies or low-ball the bid and recover through change orders. Pre-bid activities that reduce change orders: (1) complete route staking with grade and obstacle identification, (2) geotechnical borings or ground-penetrating radar on critical bore segments, (3) full 811 utility locates with conflict resolution before bid, (4) easement clearance verified before bid. Each of these activities costs money up front but reduces change order costs — and schedule delays — during construction.',
  },
  {
    id: 'T17L06_q4',
    question:
      'A project manager reviews the change order log and sees that the approved change orders total $127,000 on a $1.2M original contract (a 10.6% change order rate). What does this indicate about the original estimate?',
    options: [
      'Nothing unusual — a 10.6% change order rate is within normal expectations for OSP construction',
      'The original estimate was too high — change orders show the contractor found efficiencies that reduced the base scope',
      'The original estimate was incomplete or the design was not sufficiently developed before bid — a 10.6% change order rate suggests significant scope that wasn\'t captured pre-bid',
      'The contractor is padding change orders — change order rate above 5% always indicates contractor fraud',
    ],
    correct: 2,
    explanation:
      'A 10.6% change order rate on a $1.2M contract is on the high end but not unheard of for OSP construction — especially for underground work in complex terrain or urban environments. What it signals: the original estimate or design was missing something. Either the design wasn\'t complete enough for the bid, site conditions weren\'t adequately investigated, or the owner added scope during construction. A target change order rate for well-managed OSP projects with complete designs is typically under 5%. A 10.6% rate warrants a post-project review: what drove the changes? Were they preventable with better pre-bid work? The answer informs future project planning, not change order disputes.',
  },
];

export default function L06ChangeOrders() {
  const [showCards, setShowCards] = useState(false);

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ── */}
      <section className="lesson-section foundations">
        <h2>What Is a Change Order and Why Do They Happen</h2>

        <p>
          A change order is a written amendment to a construction contract that changes the scope, schedule, or price.
          Both parties must sign it. It's how the contract adjusts to reality when reality doesn't match the plan.
        </p>

        <p>
          Change orders happen because construction projects encounter unknowns. No matter how good the design, the
          real world has buried utilities not on any map, soil conditions that differ from the borings, landowners who
          change their minds, and owners who decide they want more after they see what they're getting.
        </p>

        <h3>What Triggers a Change Order</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Trigger Category</th>
              <th>Examples in OSP Work</th>
              <th>Who Typically Initiates</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Owner-directed scope changes</strong></td>
              <td>Route extension, fiber count increase, additional FDH locations, new route segments added during construction</td>
              <td>Owner</td>
            </tr>
            <tr>
              <td><strong>Differing site conditions</strong></td>
              <td>Rock encountered where soil borings showed dirt; unmapped buried utility conflict; water table higher than expected; unstable fill material</td>
              <td>Contractor (COR)</td>
            </tr>
            <tr>
              <td><strong>Design errors or omissions</strong></td>
              <td>Missing structure in the design, incorrect spanning distance, wrong handhole size spec, easement not cleared before bid</td>
              <td>Either party</td>
            </tr>
            <tr>
              <td><strong>Make-ready overrun (aerial)</strong></td>
              <td>More pole replacements needed than the make-ready survey estimated; unexpected rearrangement requirements</td>
              <td>Either party</td>
            </tr>
            <tr>
              <td><strong>Owner-caused delays</strong></td>
              <td>Easement access not available on scheduled start date; permit not ready; owner design revisions mid-construction</td>
              <td>Contractor (COR for delay costs)</td>
            </tr>
          </tbody>
        </table>

        <h3>The Change Order Process</h3>

        <p>
          A proper change order follows these steps. Skipping any step increases the risk of disputes.
        </p>

        <ol>
          <li>
            <strong>Event occurs</strong> — something in the field differs from the contract documents, or the owner
            wants to change something.
          </li>
          <li>
            <strong>Contractor submits COR</strong> (if contractor-initiated) or <strong>owner issues change
            direction</strong> (if owner-initiated). The COR describes the condition, the impact on labor and
            materials, and the requested price adjustment.
          </li>
          <li>
            <strong>Owner reviews and negotiates</strong> — the owner (or their engineer) reviews the COR, validates
            the scope, and negotiates the price. If the change is straightforward (clear scope, agreed price), this is
            fast. If there's a dispute about entitlement or price, it takes longer.
          </li>
          <li>
            <strong>Both parties sign the change order</strong> — only after signature by both parties is the change
            authorized. Work performed before a signed change order is at the contractor's risk.
          </li>
          <li>
            <strong>Log it</strong> — the approved change order is added to the change order log, updating the
            revised contract value.
          </li>
        </ol>

        <div className="callout callout-warning">
          <strong>Never perform extra work on a verbal direction alone.</strong> In practice, field crews get verbal
          directions constantly. The project manager's job is to convert those verbal directions into written change
          orders before the work happens — or at least the same day. Work performed on an unwritten verbal direction
          is an invitation to a dispute about whether it was authorized and what the agreed price was.
        </div>
      </section>

      {/* ── WORKING ── */}
      <section className="lesson-section working">
        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3">
          <strong className="text-blue-600 dark:text-blue-300">Quick Recall:</strong> <strong>7 CFR Part 1788</strong> governs RUS construction procurement (from T05); <strong>force account labor</strong> is owner-employee work with documented time (from T02); <strong>bore cost</strong> is directional drilling (from T06); and <strong>make-ready cost</strong> is pole preparation (from T02).
        </div>

        <h2>Calculating Change Order Cost Impact</h2>

        <p>
          When a change order is being priced, the contractor provides:
        </p>

        <ul>
          <li><strong>Labor cost:</strong> extra crew-hours at the agreed labor rate + burden</li>
          <li><strong>Material cost:</strong> actual extra materials at invoice or agreed unit price</li>
          <li><strong>Equipment cost:</strong> extra equipment hours at agreed equipment rates</li>
          <li><strong>Overhead:</strong> applied at the agreed overhead percentage from the original contract</li>
          <li><strong>Profit:</strong> applied at the agreed profit percentage from the original contract</li>
        </ul>

        <p>
          <strong>Example:</strong> A contractor encounters 400 ft of rock during a bore that the contract documents
          showed as soil. The extra rock-bore takes 2 additional crew-days for a 4-person crew at $520/day each, plus
          $3,200 in drill bit wear and carbide tooling.
        </p>

        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Calculation</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Extra labor (2 crew-days × 4 persons × $520/day)</td>
              <td>2 × 4 × $520</td>
              <td>$4,160</td>
            </tr>
            <tr>
              <td>Drill tooling and bit wear</td>
              <td>Actual cost</td>
              <td>$3,200</td>
            </tr>
            <tr>
              <td>Subtotal direct cost</td>
              <td>$4,160 + $3,200</td>
              <td>$7,360</td>
            </tr>
            <tr>
              <td>Overhead at 18%</td>
              <td>$7,360 × 0.18</td>
              <td>$1,325</td>
            </tr>
            <tr>
              <td>Subtotal + overhead</td>
              <td>$7,360 + $1,325</td>
              <td>$8,685</td>
            </tr>
            <tr>
              <td>Profit at 10%</td>
              <td>$8,685 × 0.10</td>
              <td>$869</td>
            </tr>
            <tr>
              <td><strong>Change order total</strong></td>
              <td></td>
              <td><strong>$9,554</strong></td>
            </tr>
          </tbody>
        </table>

        <h3>Preventing Change Orders — Pre-Construction Investment Pays Back</h3>

        <p>
          The best change order is the one that never happens. Most OSP change orders trace back to one of three
          pre-construction failures:
        </p>

        <ol>
          <li>
            <strong>Incomplete subsurface investigation for underground work.</strong> Geotechnical borings at regular
            intervals on long underground routes tell you what's below grade before you bid — not after you start
            boring. A boring program costs $1,500–$3,000 per boring; a rock-bore change order on a 200-ft rock
            encounter costs $8,000–$20,000.
          </li>
          <li>
            <strong>Incomplete utility locate resolution before bid.</strong> Unresolved utility conflicts become
            scope changes when the bore reaches them. Walk the staked route with the utility locates in hand and
            identify every conflict. Resolve the route around the conflict before bid so the contractor prices the
            actual route.
          </li>
          <li>
            <strong>Incomplete make-ready survey before aerial bid.</strong> The make-ready survey for aerial is the
            equivalent of geotechnical borings for underground — it tells you what condition the poles are in and what
            rearrangements the pole owner will require. Without it, make-ready cost is a guess. With it, make-ready
            is a defined scope.
          </li>
        </ol>
      </section>

      {/* ── ADVANCED ── */}
      <section className="lesson-section advanced">
        <h2>Advanced: Force Account on Change Orders</h2>

        <p>
          On RUS-funded projects, change orders for field-condition work (differing site conditions, emergency
          repairs) are sometimes executed as T&M or T&M-NTE. This is the approved use of T&M under 7 CFR Part 1788 —
          not the primary contract, but the mechanism for compensating a contractor for work that couldn't be
          priced in advance.
        </p>

        <p>
          When change order work is T&M, the contractor must document:
        </p>

        <ul>
          <li>Daily time sheets signed by both the contractor supervisor and the owner's field representative</li>
          <li>Equipment utilization logs showing hours used on the change order scope</li>
          <li>Material invoices for materials used on the change order</li>
          <li>Daily field reports confirming the described work was performed</li>
        </ul>

        <p>
          If the change order is force account (owner's own employees doing the extra work rather than a contractor),
          the same documentation requirements apply — per 7 CFR Part 1788 and 7 CFR §1755 force account
          requirements (covered in L02). The documentation is what makes the cost reimbursable under the RUS loan.
        </p>

        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Change orders are the safety mechanism for fixed-price contracts when conditions diverge from the estimate:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T17.L05 (Contract Types)</strong> — defines the relationship between the estimate and the actual contract. Lump-sum contracts bear risk if conditions change; change orders are how that risk gets renegotiated.</li>
            <li><strong>T17.L07 (Contingency & Escalation)</strong> — your contingency buffer is your hidden change-order protection. If conditions are better than estimated, contingency isn't spent. If worse, you can either absorb within contingency or file a formal change order.</li>
            <li><strong>T13.L02 (Inspection — As-Built vs As-Designed)</strong> — discovery of divergence between the as-designed specifications and actual site conditions is the most common trigger for change orders. The inspection record becomes the evidence for the claim.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            A well-documented change-order package is your lifeline when a project costs 20% more than estimated. Without the documentation trail, you're left defending the cost increase in negotiations instead of being reimbursed for a legitimate change.
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
        <Quiz questions={quizQuestions} lessonId="T17.L06" />
      </section>
    </LessonLayout>
  );
}
