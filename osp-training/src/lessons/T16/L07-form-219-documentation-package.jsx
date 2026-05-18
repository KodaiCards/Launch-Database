// T16.L07 — Form 219 Documentation Package — Final Close-Out
// RUS Form 219 (Inventory of Telecommunications Plant)
// 7 CFR §1755.400(c) — final construction documentation requirements
// 7 CFR Part 1755, Subpart A — RUS telecommunications loan/grant close-out
// RUS Bulletin 1751F-630 §12 — project close-out documentation

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';

export const meta = {
  id: 'T16.L07',
  course_id: 'T16',
  title: 'Form 219 Documentation Package — Final Close-Out',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T16.L01', 'T16.L06'],
  learning_objectives: [
    'Identify the documents required in a complete RUS Form 219 final close-out package',
    'Describe the role of Form 219 (Inventory of Telecommunications Plant) in the RUS loan lifecycle',
    'Explain the relationship between the as-built record set and the final Form 219 submission',
    'Apply the checklist approach to verify a close-out package is complete before submission',
    'Identify common close-out deficiencies that delay RUS final advance disbursement',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'Form 219 (RUS)',
    'telecommunications plant inventory',
    'final advance (RUS loan)',
    'close-out package',
    'construction contract completion certificate',
  ],
  vocabulary_assumed: [
    'as-built record',
    'GIS record of record',
    'reconciliation (as-built)',
    'engineer of record sign-off',
    'RUS audit discrepancy',
    'splice matrix',
    'link record',
    'pathway record',
    'location record',
    '7 CFR §1755.400',
  ],
};

export const key_terms = [
  {
    term: 'Form 219 (RUS)',
    definition:
      'RUS Form 219, Inventory of Telecommunications Plant — the official summary schedule submitted to RUS that itemizes all telecommunications plant installed under a loan or grant, organized by the 47 CFR Part 32 plant account categories. Form 219 is the central accounting document of the close-out package and triggers the final advance disbursement.',
  },
  {
    term: 'Telecommunications Plant Inventory',
    definition:
      'A complete itemized list of all telecommunications infrastructure installed under a construction project, organized by plant account (47 CFR Part 32) and unit of property. For OSP fiber projects, this includes cable footage by type, splice closures, conduit footage, handholes, poles, and associated hardware. The inventory supports both the Form 219 submission and the borrower\'s depreciation accounting.',
  },
  {
    term: 'Final Advance (RUS Loan)',
    definition:
      'The last disbursement from the RUS loan or grant, released after the borrower submits a complete and approved close-out package — including signed as-built drawings, Form 219, contractor invoices/receipts, force account records, and the engineer\'s certification. The final advance completes the loan drawdown cycle.',
  },
  {
    term: 'Close-Out Package',
    definition:
      'The complete set of documentation submitted to RUS at the end of a construction project to certify that the work is complete, the costs are eligible, and the plant is properly recorded. The close-out package is the definitive project record retained by both the borrower and RUS for the life of the facility.',
  },
  {
    term: 'Construction Contract Completion Certificate',
    definition:
      'A signed document from the prime contractor certifying that all work under the construction contract has been completed in accordance with the plans and specifications. Required in the close-out package and must reference the final as-built drawing set by date and revision level.',
  },
];

const closingScenario = {
  id: 'T16L07-SCENARIO',
  title: 'Close-Out Package Review',
  description:
    'You are the engineer of record for a RUS-funded 200-mile OSP fiber project. The project manager has assembled what they believe is a complete close-out package and asks you to certify it. Walk through the review.',
  states: [
    {
      id: 'start',
      text: 'The PM hands you a box with the close-out package. Which component do you review first to anchor the rest of the review?',
      choices: [
        { text: 'The Form 219 — to confirm the plant inventory is complete', next: 'form219' },
        { text: 'The contractor invoices — to verify costs are eligible', next: 'invoices_first' },
      ],
    },
    {
      id: 'form219',
      text: 'Good — Form 219 is the spine of the package. You open it and compare the cable footage to the as-built drawings. The Form 219 shows 186 miles of 144-count fiber; the as-built GIS layer shows 193 miles. What do you do?',
      choices: [
        {
          text: 'Flag the discrepancy — the Form 219 and as-built must reconcile before you certify',
          next: 'flag_discrepancy',
        },
        {
          text: 'Sign anyway — small discrepancies are common and RUS usually accepts them',
          next: 'sign_anyway',
        },
      ],
    },
    {
      id: 'flag_discrepancy',
      text: 'Correct. The 7-mile gap means either the GIS is wrong, the Form 219 is wrong, or some cable was installed but not captured in one of the records. You send it back to the PM. They find that a final spur — 7 miles of 48-count — was accidentally entered in the GIS but not in Form 219 because the quantity take-off used the original design, not the as-built. The PM updates Form 219 and returns it. Now all quantities reconcile. What is your next checkpoint?',
      choices: [
        {
          text: 'Verify that the signed as-built drawings are the correct, sealed set matching the GIS',
          next: 'verify_asbuilt',
        },
        {
          text: 'Move straight to reviewing contractor invoices — the hard part is done',
          next: 'invoices_too_early',
        },
      ],
    },
    {
      id: 'verify_asbuilt',
      text: 'You pull out the as-built drawing set. The title block shows "AS BUILT — Revision 2 — 2024-10-15" but the engineer\'s seal is dated 2024-09-12, which predates Revision 2. What is the problem?',
      choices: [
        {
          text: 'The engineer sealed an earlier revision. Revision 2 changes are not covered by the certification — a re-seal is required',
          next: 'reseal_required',
        },
        {
          text: 'Minor dating discrepancy — the intent is clear, RUS will accept this',
          next: 'minor_date',
        },
      ],
    },
    {
      id: 'reseal_required',
      text: 'Correct. The engineer\'s seal date must be after the final as-built revision date. If revision 2 incorporated field changes after 2024-09-12, those changes are not covered by the certification. You send the package back for a fresh seal. After re-sealing, you confirm the package now includes: (1) Form 219 with reconciled quantities, (2) as-built drawings sealed post-revision 2, (3) contractor completion certificate, (4) invoices/receipts, (5) FCOs on file, (6) inspector daily reports. Package is complete — you certify.',
      choices: [{ text: 'Scenario complete — see the checklist below', next: 'end' }],
    },
    {
      id: 'invoices_first',
      text: 'Invoices are important, but without reconciling Form 219 to as-built drawings first, you may be certifying costs for plant that does not exist in the record. The correct anchor is Form 219 → as-built reconciliation. Go back and start with Form 219.',
      choices: [{ text: 'Return to Form 219 review', next: 'form219' }],
    },
    {
      id: 'sign_anyway',
      text: 'Wrong call. A 7-mile cable discrepancy is a material difference that represents potentially millions of dollars in plant costs. Signing a Form 219 that does not reconcile with the as-built is a false certification — it exposes you to professional liability and the borrower to an RUS audit finding. You must reconcile first.',
      choices: [{ text: 'Return and flag the discrepancy', next: 'flag_discrepancy' }],
    },
    {
      id: 'invoices_too_early',
      text: 'Not yet. Verifying that the sealed as-built matches the GIS record is the next critical step. If the sealed drawings reference an earlier revision than the GIS, the engineer\'s certification does not cover the final as-built condition.',
      choices: [{ text: 'Return to verify as-built drawings', next: 'verify_asbuilt' }],
    },
    {
      id: 'minor_date',
      text: 'This is not a minor discrepancy. A seal applied before the final revision was made does not certify the final revision. RUS reviewers specifically check seal date vs. drawing revision date — this is a known close-out deficiency that delays final advance disbursement.',
      choices: [{ text: 'Return and require re-seal', next: 'reseal_required' }],
    },
    {
      id: 'end',
      text: 'Close-out package approved. The complete package includes: Form 219 (plant inventory, reconciled to as-built), sealed as-built drawings (P.E. seal date ≥ final revision date), contractor completion certificate, all invoices and receipts, all Field Change Orders, inspector daily reports, and engineer certification letter. This is what triggers the final advance.',
      choices: [],
    },
  ],
  initialState: 'start',
};

export default function L07() {
  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>What Is the Form 219 Close-Out Package?</h2>

        <p>
          At the end of every RUS-funded telecommunications construction project, the borrower must
          submit a formal close-out package to their RUS State Office. The centerpiece of that
          package is <strong>RUS Form 219, Inventory of Telecommunications Plant</strong> — a
          standardized summary that itemizes all plant installed under the loan or grant, organized
          by the 47 CFR Part 32 plant account categories.
        </p>

        <p>
          Think of Form 219 as the project's final report card to RUS: "Here is exactly what was
          built, how much it cost, and how it is classified in the plant records." When RUS accepts
          the Form 219 and certifies the package as complete, they release the{' '}
          <strong>final advance</strong> — the last disbursement from the loan or grant that closes
          out the financial obligation.
        </p>

        <p>
          The as-built records you learned to produce in L01–L06 are not just operational
          documents — they are the foundation of the Form 219 submission. Every foot of cable, every
          splice closure, every conduit run shown in the as-built drawings must reconcile with the
          quantities on Form 219. If they do not reconcile, the package is returned, the final
          advance is delayed, and someone has to go back and find the discrepancy.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>What Goes in the Close-Out Package</h2>

        <p>
          The specific requirements vary by loan/grant program and year, but a standard RUS
          telecommunications close-out package contains the following components:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Document</th>
              <th>Who Provides</th>
              <th>Key Requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <strong>RUS Form 219 — Inventory of Telecommunications Plant</strong>
              </td>
              <td>Borrower (with engineering support)</td>
              <td>
                All plant quantities must reconcile with as-built drawings; organized by 47 CFR Part
                32 account
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <strong>Signed, sealed as-built drawings</strong>
              </td>
              <td>Engineer of record</td>
              <td>P.E. seal date must be on or after final drawing revision date</td>
            </tr>
            <tr>
              <td>3</td>
              <td>
                <strong>Construction contract completion certificate</strong>
              </td>
              <td>Prime contractor</td>
              <td>
                Certifies work complete per plans and specs; references final as-built drawing
                revision
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>
                <strong>Invoices, receipts, and payment documentation</strong>
              </td>
              <td>Borrower / Contractor</td>
              <td>
                All invoiced costs must tie to Form 219 line items; force account labor must be
                separately documented
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>
                <strong>Field Change Orders (FCOs)</strong>
              </td>
              <td>Engineering firm / Borrower</td>
              <td>
                All approved FCOs on file; each references the design deviation and engineering
                authorization
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>
                <strong>Inspector daily reports / construction diaries</strong>
              </td>
              <td>Resident engineer / Inspector</td>
              <td>Contemporaneous record of progress, materials installed, and inspections</td>
            </tr>
            <tr>
              <td>7</td>
              <td>
                <strong>Engineer's certification letter</strong>
              </td>
              <td>Engineer of record</td>
              <td>
                Certifies the as-built package is complete and that the plant was constructed in
                conformance with RUS requirements, NESC, and applicable codes
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>
                <strong>GIS data submission (if required by program)</strong>
              </td>
              <td>Engineer / Borrower GIS staff</td>
              <td>
                USDA ReConnect programs require shapefile submission; RUS loan programs require GIS
                but format is borrower-chosen (see T16.L05)
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          Items 1–4 are universally required. Items 5–8 are required on most RUS projects and
          should be assumed mandatory unless your State Office explicitly states otherwise in writing.
        </p>

        <h3>The Form 219 Itself — What Gets Filled Out</h3>

        <p>
          Form 219 is organized around the 47 CFR Part 32 plant account structure (covered in depth
          in T16.L08 on plant accounting). For an OSP fiber project, the relevant accounts include:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>47 CFR §32 Account</th>
              <th>Plant Category</th>
              <th>Typical OSP Items</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>§32.2410</td>
              <td>Cable and Wire Facilities</td>
              <td>Fiber optic cable footage by type and count</td>
            </tr>
            <tr>
              <td>§32.2411</td>
              <td>Poles</td>
              <td>Pole count by class (new installations by borrower)</td>
            </tr>
            <tr>
              <td>§32.2420</td>
              <td>Aerial Cable and Wire</td>
              <td>Aerial fiber footage, messenger strand, lashing wire, ADSS footage</td>
            </tr>
            <tr>
              <td>§32.2421</td>
              <td>Underground Cable and Wire</td>
              <td>Fiber cable installed inside conduit underground</td>
            </tr>
            <tr>
              <td>§32.2423</td>
              <td>Buried Cable</td>
              <td>Direct-buried fiber cable without conduit</td>
            </tr>
            <tr>
              <td>§32.2441</td>
              <td>Conduit Systems</td>
              <td>Conduit footage by type, innerduct, handholes, vaults, inline splice closures</td>
            </tr>
          </tbody>
        </table>

        <p>
          The quantities entered on each line must match the as-built drawings and GIS records
          exactly. This is why the reconciliation process (L06) happens before close-out — you
          cannot fill out Form 219 accurately without a reconciled, engineer-sealed as-built.
        </p>

        <BranchingScenario scenario={closingScenario} />

        <h3>Common Close-Out Deficiencies</h3>

        <p>
          The following deficiencies are the most common causes of delayed final advance disbursement
          on RUS OSP projects, based on RUS State Office review experience:
        </p>

        <ol className="step-list">
          <li>
            <strong>Form 219 quantities do not reconcile with as-built drawings.</strong> The most
            common deficiency. Usually caused by using design-phase quantities instead of as-built
            quantities on Form 219. Always take your Form 219 numbers from the reconciled as-built,
            not the original design.
          </li>
          <li>
            <strong>P.E. seal date predates final drawing revision.</strong> If the drawings were
            revised after the engineer sealed them, the seal does not cover the final revision. A
            fresh seal with a date after the final revision date is required.
          </li>
          <li>
            <strong>Missing Field Change Orders.</strong> Deviation from design without a
            corresponding FCO is an unauthorized change. If FCOs were not issued in the field, the
            engineer's office must reconstruct them from daily reports and redlines before close-out
            — painful but required.
          </li>
          <li>
            <strong>Force account documentation missing or incomplete.</strong> If borrower employees
            performed construction work (force account labor), every hour and every piece of material
            must be documented separately. Generic "labor" invoices do not satisfy RUS force account
            requirements.
          </li>
          <li>
            <strong>GIS format non-compliant (ReConnect programs).</strong> USDA ReConnect grants
            require shapefile submission per 7 CFR Part 1740. Submitting a PDF map or a KMZ file
            instead of a .shp/.dbf/.prj package is a deficiency that delays close-out.
          </li>
        </ol>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>Book vs. Field Practice on Close-Out Timing</h2>

        <p>
          <strong>The book standard (7 CFR §1755.400 / RUS close-out requirements):</strong> The
          close-out package is submitted after all construction work is complete and all materials are
          installed and accepted. RUS State Offices have historically expected the package within
          60–90 days of the borrower's final inspection sign-off.
        </p>

        <p>
          <strong>Common field practice:</strong> On large OSP builds spanning multiple construction
          seasons, borrowers often negotiate a phased close-out with their RUS State Office —
          submitting Form 219 for each completed segment as it is accepted, rather than waiting for
          the entire project to finish. This reduces the risk of a single late close-out and allows
          the borrower to draw down completed segments faster.
        </p>

        <p>
          <strong>The risk of confusing them:</strong> Phased close-out is only valid if your RUS
          State Office has explicitly authorized it in writing. Starting a phased close-out pattern
          without authorization creates accounting and loan-draw complications. When in doubt, ask
          your State Office — they will tell you whether phased or full close-out applies to your
          loan agreement.
        </p>

        <p>
          Also note: the as-built records submitted with the close-out package are the ones RUS
          retains for the life of the loan. These must represent the final, accepted condition of
          the plant — not work-in-progress versions. If a segment of plant is installed but not yet
          accepted due to an open punch list, do not include it in the close-out submission until
          the punch list is cleared and the contractor certifies completion.
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
            id: 'T16L07-Q1',
            type: 'multiple_choice',
            question:
              'What is the primary function of RUS Form 219 (Inventory of Telecommunications Plant)?',
            options: [
              'To authorize the borrower to begin construction on a RUS-funded project',
              'To summarize all telecommunications plant installed under a loan/grant, organized by 47 CFR Part 32 plant account categories, triggering the final advance disbursement when accepted',
              'To document the engineer\'s compliance with NESC loading district requirements',
              'To record the borrower\'s annual depreciation schedule for existing plant',
            ],
            correct: 1,
            explanation:
              'Form 219 is the plant inventory submitted at project close-out that itemizes all installed plant by 47 CFR Part 32 account category. When RUS accepts the Form 219 as part of a complete close-out package, they release the final advance — the last loan or grant disbursement. Without an accepted Form 219, the project cannot be financially closed out.',
          },
          {
            id: 'T16L07-Q2',
            type: 'multiple_choice',
            question:
              'An engineer sealed a set of as-built drawings on 2024-08-20. The drawings were revised to Revision 3 on 2024-09-05 to incorporate late FCOs. What must happen before the close-out package can be submitted?',
            options: [
              'The drawings can be submitted as-is — the seal covers all revisions made to the same drawing set',
              'The engineer must re-seal the Revision 3 drawings with a seal date on or after 2024-09-05',
              'The contractor must certify that the changes in Revision 3 are minor before submission',
              'The borrower can submit with a cover letter explaining the date discrepancy',
            ],
            correct: 1,
            explanation:
              'An engineer\'s seal certifies the drawing set as of the seal date. Changes made after the seal date are not covered by that certification. When drawings are revised after sealing (e.g., to incorporate FCOs), the engineer must apply a fresh seal with a date on or after the final revision date. RUS reviewers specifically check seal date vs. drawing revision date.',
          },
          {
            id: 'T16L07-Q3',
            type: 'multiple_choice',
            question:
              'Which of the following is NOT typically included in a standard RUS close-out package?',
            options: [
              'Form 219 (Inventory of Telecommunications Plant)',
              'Inspector daily reports and construction diaries',
              'The borrower\'s 10-year revenue forecast approved by RUS',
              'Field Change Orders for all design deviations',
            ],
            correct: 2,
            explanation:
              'A 10-year revenue forecast is not part of the construction close-out package — that is a financial analysis submitted at the loan application stage, not at close-out. The close-out package is documentation of what was built: Form 219, sealed as-built drawings, contractor completion certificate, invoices/receipts, FCOs, inspector daily reports, and the engineer\'s certification.',
          },
          {
            id: 'T16L07-Q4',
            type: 'multiple_choice',
            question:
              'Form 219 shows 142 miles of 96-count fiber installed. The reconciled as-built drawings show 148 miles. What should happen next?',
            options: [
              'Submit Form 219 as-is — minor discrepancies are expected and RUS adjusts automatically',
              'Reconcile Form 219 to the as-built drawings before submission — the 6-mile discrepancy must be investigated and resolved',
              'Update the as-built drawings to show 142 miles to match Form 219',
              'Submit both documents and let the RUS reviewer determine which is correct',
            ],
            correct: 1,
            explanation:
              'Form 219 must reconcile with the as-built drawings before submission. A 6-mile discrepancy (representing potentially millions of dollars in plant cost) is a material difference that must be investigated. Typical causes: quantities taken from the original design instead of the as-built, a spur or segment captured in GIS but not in Form 219, or data entry error. The correct fix is to investigate, resolve, and reconcile both documents — never alter the as-built to match an incorrect Form 219.',
          },
        ]}
      />
    </LessonLayout>
  );
}
