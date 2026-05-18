// T16.L08 — 47 CFR Part 32 — Plant Accounting and As-Built Records
// 47 CFR Part 32 — Uniform System of Accounts (USOA)
// 47 CFR §32.2001 — engineering of record (unit of property)
// 47 CFR §32.2410/§32.2411/§32.2423/§32.2441 — cable, pole, UG, conduit accounts
// RUS Form 1755-A — statement of materials used
// RUS Bulletin 1751F-630 §8 — accounting and record requirements

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T16.L08',
  course_id: 'T16',
  title: '47 CFR Part 32 — Plant Accounting and As-Built Records',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T16.L01', 'T16.L07'],
  learning_objectives: [
    'Identify the 47 CFR Part 32 plant account categories relevant to OSP fiber construction',
    'Define "unit of property" under 47 CFR §32.2001 and explain why it matters for as-built records',
    'Match common OSP construction items to their correct Part 32 account classification',
    'Explain the relationship between the as-built record and the borrower\'s plant accounting ledger',
    'Describe how RUS Form 1755-A ties material usage to plant account entries',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'unit of property (47 CFR §32.2001)',
    '47 CFR Part 32 plant account',
    'Uniform System of Accounts (USOA)',
    'Form 1755-A (Statement of Materials Used)',
    'capitalized plant cost',
  ],
  vocabulary_assumed: [
    'as-built record',
    'Form 219 (RUS)',
    'telecommunications plant inventory',
    'close-out package',
    'reconciliation (as-built)',
    'GIS record of record',
    '7 CFR §1755.400',
  ],
};

export const key_terms = [
  {
    term: 'Unit of Property (47 CFR §32.2001)',
    definition:
      'The minimum identifiable component of telecommunications plant that is individually recorded in the plant ledger. Under the FCC\'s Uniform System of Accounts, a "unit of property" is an item substantial enough to be capitalized when installed and retired when removed. For OSP fiber: a splice closure is a unit of property; an individual splice tray typically is not (it is a component of the closure). Understanding UOP boundaries determines what gets an individual as-built record entry.',
  },
  {
    term: '47 CFR Part 32 Plant Account',
    definition:
      'A specific ledger account code defined in the FCC\'s Uniform System of Accounts (47 CFR Part 32) that classifies telecommunications plant by type and function. OSP fiber equipment is primarily recorded in accounts §32.2410 (Cable and Wire Facilities), §32.2411 (Poles), §32.2423 (Underground Cable and Wire), §32.2441 (Conduit Systems), and related accounts. Account codes appear directly on RUS Form 219.',
  },
  {
    term: 'Uniform System of Accounts (USOA)',
    definition:
      'The standardized accounting framework established by the FCC at 47 CFR Part 32 that all incumbent local exchange carriers (ILECs) and most RUS borrowers use to record telecommunications plant, expenses, and revenues. The USOA ensures consistent classification of plant costs across all carriers for regulatory and rate-making purposes.',
  },
  {
    term: 'Form 1755-A (Statement of Materials Used)',
    definition:
      'RUS Form 1755-A, Statement of Materials Used on Force Account Work or Contract Work — a supporting schedule used to document specific materials installed on a project and tie them to the Part 32 plant accounts in Form 219. For OSP fiber projects, Form 1755-A captures cable type/length, conduit type/length, hardware, and splice closures by account.',
  },
  {
    term: 'Capitalized Plant Cost',
    definition:
      'The cost of telecommunications infrastructure that is added to the plant ledger as an asset, as opposed to expensed immediately. Under 47 CFR §32.2001, plant costs that are expected to provide service for more than one year and meet the unit-of-property threshold are capitalized. Capitalized costs must be supported by as-built records showing what was installed, where, and at what cost.',
  },
];
export const vocabulary_introduced = [
  'unit of property (47 CFR §32.2001)',
  '47 CFR Part 32 plant account',
  'Uniform System of Accounts (USOA)',
  'Form 1755-A (Statement of Materials Used)',
  'capitalized plant cost',
];

export default function L08() {
  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>Why Accounting Rules Affect Your As-Built Records</h2>

        <p>
          At first glance, a lesson on accounting codes seems like it belongs in the finance
          department, not in an OSP engineering training. But understanding 47 CFR Part 32 is
          directly relevant to how you build, structure, and use your as-built records — because
          the as-built record is the source document for the plant ledger.
        </p>

        <p>
          Every piece of infrastructure your crew installs — every foot of fiber, every splice
          closure, every handhole, every conduit segment — eventually gets recorded in the borrower's
          accounting books as a <strong>capitalized plant cost</strong>. Those books are organized
          by the FCC's Uniform System of Accounts (47 CFR Part 32). When the RUS reviewer opens
          Form 219 and asks "how many feet of underground cable did you install?", the answer comes
          from the as-built records. If your as-built records are organized to match the Part 32
          account structure, close-out is straightforward. If they are not, someone has to
          sort through thousands of feet of cable footage to figure out which footage is aerial
          (§32.2420), which is underground conduit (§32.2421), and which is direct-buried (§32.2423).
        </p>

        <p>
          The practical implication: build your GIS layer attributes and administration records to
          capture the data needed for Part 32 classification from day one — not as an afterthought
          at close-out.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>The Part 32 Accounts That Matter for OSP Fiber</h2>

        <p>
          47 CFR Part 32 defines dozens of plant account codes. For an OSP fiber project, the
          relevant accounts are concentrated in the 2400-series (Network Plant):
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>47 CFR Account</th>
              <th>Account Title</th>
              <th>OSP Fiber Items Captured</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>§32.2410</td>
              <td>Cable and Wire Facilities</td>
              <td>Parent account — rarely booked directly; subaccounts carry the detail</td>
            </tr>
            <tr>
              <td>§32.2411</td>
              <td>Poles</td>
              <td>Utility poles installed by the borrower (not attachment fees to others)</td>
            </tr>
            <tr>
              <td>§32.2420</td>
              <td>Aerial Cable and Wire</td>
              <td>
                Aerial fiber cable footage, messenger strand, lashing hardware, ADSS cable, down-guys
              </td>
            </tr>
            <tr>
              <td>§32.2421</td>
              <td>Underground Cable and Wire</td>
              <td>Fiber cable installed in conduit underground</td>
            </tr>
            <tr>
              <td>§32.2423</td>
              <td>Buried Cable</td>
              <td>Direct-buried fiber cable without conduit</td>
            </tr>
            <tr>
              <td>§32.2424</td>
              <td>Submarine and Deep-Sea Cable</td>
              <td>River or lake crossings (OSP inland waterway bores)</td>
            </tr>
            <tr>
              <td>§32.2426</td>
              <td>Intrabuilding Network Cable</td>
              <td>Fiber inside a building (OSP/ISP demarcation fiber runs)</td>
            </tr>
            <tr>
              <td>§32.2441</td>
              <td>Conduit Systems</td>
              <td>
                Conduit footage by type (HDPE, PVC, steel), innerduct, handholes, vaults, manholes,
                conduit end-caps, inline splice closures (RUS practice: booked as accessory conduit
                system hardware)
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          The most common point of confusion: aerial fiber (cable lashed to a strand on a pole)
          goes into §32.2420, but the pole itself (if owned by the telecom borrower) goes into
          §32.2411. If the borrower is attaching to a power company pole, the attachment fee is an
          operating expense — not a capital plant account item at all.
        </p>

        <h3>Unit of Property — What Gets Its Own Record</h3>

        <p>
          Under 47 CFR §32.2001, telecommunications plant is recorded and retired based on the
          concept of a <strong>unit of property (UOP)</strong>. A UOP is the minimum individual
          component that the company tracks as a distinct plant asset in its accounting records.
        </p>

        <p>
          For OSP fiber, typical UOP boundaries are:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>UOP?</th>
              <th>Part 32 Account</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fiber optic cable (per footage)</td>
              <td>Yes</td>
              <td>§32.2420 / §32.2421 / §32.2423</td>
              <td>
                Recorded by route segment — a 3-mile cable run from node A to node B is one asset
                entry
              </td>
            </tr>
            <tr>
              <td>Splice closure (enclosure)</td>
              <td>Yes</td>
              <td>§32.2441</td>
              <td>
                RUS practice: inline splice closures are booked as accessory conduit-system hardware
                under §32.2441. Each closure tracked individually by location ID.
              </td>
            </tr>
            <tr>
              <td>Splice tray (inside a closure)</td>
              <td>No</td>
              <td>Component of §32.2441</td>
              <td>
                Too granular — component cost absorbed into the closure unit of property; not tracked
                individually
              </td>
            </tr>
            <tr>
              <td>Handhole (concrete or plastic)</td>
              <td>Yes</td>
              <td>§32.2441</td>
              <td>Each structure tracked by ID and GPS coordinates</td>
            </tr>
            <tr>
              <td>Conduit run segment</td>
              <td>Yes</td>
              <td>§32.2441</td>
              <td>
                Tracked per segment (between handholes); footage and diameter are the key attributes
              </td>
            </tr>
            <tr>
              <td>Pole (borrower-owned)</td>
              <td>Yes</td>
              <td>§32.2411</td>
              <td>Each pole tracked by pole ID and GPS coordinates</td>
            </tr>
            <tr>
              <td>Spiral vibration damper (aerial)</td>
              <td>No</td>
              <td>Component of §32.2420</td>
              <td>Hardware absorbed into aerial cable cost — not a standalone UOP</td>
            </tr>
          </tbody>
        </table>

        <p>
          This matters for your administration records because a TIA-606-C location record should
          correspond to a unit of property: a splice closure gets a location record, a conduit
          segment gets a pathway record, a cable run gets a link record. Items that are not
          standalone UOPs (trays, dampers, lashing hardware) do not need individual
          administration records.
        </p>

        <WorkedExample
          title="Classifying a Mixed OSP Segment for Form 219"
          steps={[
            {
              label: 'Project Segment Description',
              content:
                'A 4.2-mile OSP segment consists of: 1.8 miles of aerial 96-count fiber lashed to existing poles; 2.0 miles of 96-count fiber in HDPE conduit underground; 0.4 miles of direct-buried 96-count fiber; 3 inline splice closures; 6 handholes. Classify each item for Form 219.',
            },
            {
              label: '1.8 Miles Aerial Fiber — §32.2420',
              content:
                'Aerial cable and wire: 1.8 miles × 5,280 ft/mile = 9,504 LF of 96-count aerial fiber under §32.2420. Also recorded: lashing wire and messenger (separate line items under the same account). The pole-owner attachment fees are operating expenses — NOT capitalized under §32.2411 (only borrower-owned poles go there).',
            },
            {
              label: '2.0 Miles Underground Conduit Fiber — §32.2421 and §32.2441',
              content:
                '2.0 miles = 10,560 LF of 96-count fiber inside conduit → §32.2421 (Underground Cable and Wire). The HDPE conduit itself (2.0 miles = 10,560 LF) → §32.2441 (Conduit Systems). Conduit and cable are separate account line items on Form 219 — a single physical segment creates two account entries.',
            },
            {
              label: '0.4 Miles Direct-Buried Fiber — §32.2423',
              content:
                '0.4 miles = 2,112 LF of direct-buried 96-count fiber → §32.2423 (Buried Cable). No conduit, so no §32.2441 entry. If innerduct was used inside the conduit on the 2.0-mile segment, the innerduct footage would be a separate sub-item within §32.2441.',
            },
            {
              label: '3 Splice Closures — §32.2441',
              content:
                '3 splice closures, each with 2 splice trays → §32.2441 (Conduit Systems, accessory hardware — RUS standard practice). Unit of property is the closure, not the trays. On Form 219 line for §32.2441: Quantity = 3 (closures), Description = "96-count inline splice closure, above-grade pedestal mount." Each closure gets an individual administration record (location record) in TIA-606-C, referenced by closure ID (e.g., IFB-SC-01 through IFB-SC-03).',
            },
            {
              label: '6 Handholes — §32.2441',
              content:
                '6 plastic handholes (24" × 36" × 24") → §32.2441 (Conduit Systems — the handhole is part of the conduit system, not a standalone account). On Form 219: Quantity = 6, Description = "24×36×24 plastic handhole." Each handhole gets an individual administration record (location record) referenced by handhole ID (e.g., HH-SR42-01 through HH-SR42-06).',
            },
            {
              label: 'Form 219 Summary for This Segment',
              content:
                '§32.2420: 9,504 LF aerial 96-count fiber + lashing hardware | §32.2421: 10,560 LF underground 96-count fiber | §32.2423: 2,112 LF direct-buried 96-count fiber | §32.2441: 10,560 LF HDPE conduit + 6 handholes + 3 inline splice closures. Total 4 account line items from one 4.2-mile segment.',
            },
          ]}
        />

        <h3>RUS Form 1755-A — Tying Materials to Accounts</h3>

        <p>
          Form 1755-A (Statement of Materials Used) is the supporting schedule that backs up Form
          219. Where Form 219 summarizes total quantities per account, Form 1755-A shows the
          individual material items, their quantities, unit costs, and the account to which they
          are charged.
        </p>

        <p>
          For an OSP fiber project, Form 1755-A typically includes:
        </p>

        <ul>
          <li>
            <strong>Cable quantities:</strong> footage by cable type (count, type — aerial vs.
            underground vs. buried), with unit cost per foot.
          </li>
          <li>
            <strong>Conduit quantities:</strong> footage by conduit type and diameter, with unit
            cost per foot.
          </li>
          <li>
            <strong>Structure quantities:</strong> handholes, vaults, splice pedestals — unit count
            with unit cost each.
          </li>
          <li>
            <strong>Hardware:</strong> splice closures, connectors, bonding hardware — unit count
            with unit cost each.
          </li>
          <li>
            <strong>Labor:</strong> either contractor invoice line items or force account labor
            hours and rates.
          </li>
        </ul>

        <p>
          The quantities on Form 1755-A must tie exactly to both the as-built drawings and Form 219.
          This three-way reconciliation (as-built ↔ Form 1755-A ↔ Form 219) is the financial
          accuracy check that RUS reviewers perform at close-out.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Book vs. Field Practice on Plant Account Classification</h2>

        <p>
          <strong>The book standard (47 CFR Part 32 USOA):</strong> Plant is classified strictly
          by function and location — aerial cable to §32.2420, underground conduit cable to
          §32.2421, buried cable to §32.2423. An ADSS (self-supporting, no messenger) goes to
          §32.2420 even though it has no strand. Each account is a separate line on Form 219 and
          the plant ledger.
        </p>

        <p>
          <strong>Common field practice:</strong> On smaller, non-ILEC projects (privately-held
          telecom companies, new CLEC builds, cooperative fiber networks), plant classification
          is sometimes approximated — "all fiber goes in one bucket" — because the borrower's
          accounting system was not originally designed for USOA compliance. When such a company
          becomes an RUS borrower, their first RUS audit sometimes reveals that years of plant
          have been booked to wrong account codes.
        </p>

        <p>
          <strong>The risk:</strong> Misclassified plant means the depreciation schedule is wrong
          (each account has a different USOA-prescribed depreciation life), the Form 219 is
          incorrect, and the RUS plant ledger does not reconcile with the physical records. Fixing
          historical plant misclassification after an audit is expensive and disruptive. The correct
          approach is to build the Part 32 classification into the GIS and as-built record structure
          from the beginning — a "segment type" attribute on each cable feature in the GIS (aerial /
          underground conduit / direct buried) maps directly to the correct §32.24xx account code.
        </p>
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
            id: 'T16L08-Q1',
            type: 'multiple_choice',
            question:
              'A RUS borrower installs 2,500 feet of fiber optic cable in HDPE conduit underground. Under 47 CFR Part 32, the fiber cable and the conduit are classified in which accounts, respectively?',
            options: [
              'Both in §32.2423 (Buried Cable) as a single item',
              'Fiber in §32.2421 (Underground Cable and Wire); conduit in §32.2441 (Conduit Systems)',
              'Fiber in §32.2441 (Conduit Systems) because it is inside conduit; conduit is not separately tracked',
              'Both in §32.2410 (Cable and Wire Facilities) as the parent account',
            ],
            correct: 1,
            explanation:
              'Under 47 CFR Part 32, fiber optic cable installed in underground conduit is classified in §32.2421 (Underground Cable and Wire). The conduit itself — HDPE, PVC, or steel — is classified in §32.2441 (Conduit Systems). A single physical segment of conduit-installed fiber creates two separate account line items on Form 219. This is one of the most important Part 32 distinctions for OSP engineers completing close-out documentation.',
          },
          {
            id: 'T16L08-Q2',
            type: 'multiple_choice',
            question:
              'What is a "unit of property" under 47 CFR §32.2001, and why does it matter for as-built records?',
            options: [
              'Any item that costs more than $500 installed; determines which items are expensed vs. capitalized based on cost only',
              'The minimum identifiable component recorded individually in the plant ledger; determines which items warrant their own administration record entry',
              'Any item that can be physically removed and re-installed; determines portability classification',
              'The annual depreciation allowance for a class of plant; determines how long before an item is retired from the ledger',
            ],
            correct: 1,
            explanation:
              'A unit of property (UOP) under 47 CFR §32.2001 is the minimum component tracked as an individual asset in the plant ledger. For OSP as-built records, UOP boundaries determine granularity: a splice closure is a UOP (it gets its own administration record / location record), but a splice tray inside the closure is not a UOP (too granular — it is a component of the closure). Understanding UOP boundaries prevents over-documentation (tracking individual splice trays) and under-documentation (missing individual handholes).',
          },
          {
            id: 'T16L08-Q3',
            type: 'multiple_choice',
            question:
              'A borrower attaches fiber cable to poles owned by the local electric cooperative and pays the cooperative an annual attachment fee. Under 47 CFR Part 32, how is the attachment fee classified?',
            options: [
              'Capitalized under §32.2411 (Poles) because it relates to pole usage',
              'Capitalized under §32.2420 (Aerial Cable and Wire) as part of the aerial plant cost',
              'As an operating expense — attachment fees to other companies\' poles are not capitalized plant',
              'As a capital lease obligation under §32.2441 (Conduit Systems)',
            ],
            correct: 2,
            explanation:
              '47 CFR §32.2411 (Poles) is for poles owned by the borrower. Fees paid to another company for using their poles are operating expenses — not capitalized plant. Only the borrower\'s own infrastructure (cable, conduit, hardware, and borrower-owned poles) gets capitalized as plant under Part 32. This distinction is important for Form 219 — pole attachment fees do NOT appear on Form 219 as plant; they appear on the income statement as pole rental expense.',
          },
          {
            id: 'T16L08-Q4',
            type: 'multiple_choice',
            question:
              'Form 219 shows 8,400 LF of aerial fiber installed. Form 1755-A shows 8,400 LF of cable purchased. The as-built GIS layer shows 9,100 LF of aerial cable. What should the engineer do?',
            options: [
              'Accept Form 219 and Form 1755-A as correct — GIS may have included cable slack in its measurement',
              'Update Form 219 to show 9,100 LF to match the GIS layer',
              'Investigate the 700 LF discrepancy — reconcile all three records before certifying the close-out package',
              'Submit all three documents to RUS and ask the reviewer to determine the correct quantity',
            ],
            correct: 2,
            explanation:
              'A 700 LF discrepancy across three records (Form 219, Form 1755-A, as-built GIS) is a material inconsistency that must be investigated and resolved. The correct approach is a three-way reconciliation: trace where the 700 LF appears and which record is accurate. Possible causes: GIS measurement includes cable in handholes/closures that Form 1755-A counts differently; a late segment was added to the GIS but not to the material take-off; measurement methodology differs. The close-out package should not be submitted until all three records reconcile.',
          },
        ]}
      />
    </LessonLayout>
  );
}
