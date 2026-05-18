// T16.L06 — Reconciling As-Built to As-Designed
// 7 CFR §1755.400(c)(4) — RUS as-built record requirements
// RUS Bulletin 1751F-630 §12.6 — final construction package
// ANSI/TIA-606-C (2018) §6 — record update triggers
// 47 CFR §32.2001 — engineering of record obligations

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T16.L06',
  course_id: 'T16',
  title: 'Reconciling As-Built to As-Designed',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T16.L01', 'T16.L03', 'T16.L04', 'T16.L05'],
  learning_objectives: [
    'Define the reconciliation process that converts as-designed drawings to final as-built records',
    'Identify the field change categories that must trigger an as-built update',
    'Describe the redline-to-final drawing workflow and sign-off chain',
    'Apply discrepancy thresholds to determine whether a change requires engineer review',
    'Explain the RUS audit exposure when as-built records do not match field conditions',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'redline drawing',
    'reconciliation (as-built)',
    'field change order (FCO)',
    'engineer of record sign-off',
    'RUS audit discrepancy',
  ],
  vocabulary_assumed: [
    'as-built record',
    'as-designed drawing',
    'ANSI/TIA-606-C',
    'administration record (completed entry)',
    'link record',
    'pathway record',
    'location record',
    'GIS record of record',
    'splice matrix',
    'route (T01)',
    'make-ready (T08)',
  ],
};

export const key_terms = [
  {
    term: 'Redline Drawing',
    definition:
      'A paper or PDF copy of the original design drawing on which the field crew marks every deviation from design in red ink — changed route, relocated splice point, additional handhole, etc. Redlines are the raw material that reconciliation converts into the official as-built record.',
  },
  {
    term: 'Reconciliation (As-Built)',
    definition:
      'The formal process of comparing the as-designed drawings against actual field conditions, documenting every discrepancy, resolving ambiguities with the engineer, and producing the final signed as-built record. Reconciliation closes the loop between design intent and physical reality.',
  },
  {
    term: 'Field Change Order (FCO)',
    definition:
      'A numbered, signed document authorizing a departure from the design during construction — e.g., relocating a splice point 80 ft to avoid a utility conflict. FCOs are the paper trail connecting the original design to the as-built deviation and are retained with the project file per 7 CFR §1755.400(c).',
  },
  {
    term: 'Engineer of Record Sign-Off',
    definition:
      'The licensed P.E. or responsible engineer\'s formal approval that the final as-built drawings accurately represent the constructed system and conform to applicable codes (NESC, NEC, TIA, RUS). Required on RUS projects before submission of Form 219 final close-out package.',
  },
  {
    term: 'RUS Audit Discrepancy',
    definition:
      'A discrepancy found during a Rural Development or OIG audit where field-verified conditions do not match the as-built records submitted with the loan/grant. Can result in disallowance of construction costs, required remediation, or loan acceleration in severe cases.',
  },
];
export const vocabulary_introduced = [
  'redline drawing',
  'reconciliation (as-built)',
  'field change order (FCO)',
  'engineer of record sign-off',
  'RUS audit discrepancy',
];

export default function L06() {
  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS ─────────────────────────────────────────── */}
      <section className="lesson-section foundations">
        <h2>Why Reconciliation Exists</h2>

        <p>
          No fiber build ever goes exactly according to plan. Utility conflicts, unexpected rock, a
          property owner who moved the easement boundary, a change in the conduit route to avoid a
          buried gas main — field changes happen on every project, every day. Reconciliation is the
          formal process of capturing every one of those deviations, getting the engineer's blessing
          on the significant ones, and producing a final as-built record that says "this is what was
          actually built, not what was originally designed."
        </p>

        <p>
          Think of reconciliation as the translation layer between two documents:{' '}
          <strong>as-designed</strong> (what the engineer drew before the first shovel broke ground)
          and <strong>as-built</strong> (what the crew actually installed). Your job during
          reconciliation is to walk every inch of that gap and decide: is this deviation documented,
          approved, and recorded?
        </p>

        <p>
          Under 7 CFR §1755.400(c)(4), RUS requires that all as-built records reflect field
          conditions as constructed. An as-built that still shows the original design route when the
          crew actually went 300 ft east to dodge a gas main is not an as-built — it is a liability.
        </p>

        <h3>The Redline Workflow</h3>

        <p>
          The field crew typically carries a paper or PDF copy of the design drawings. When something
          changes in the field, they mark it in red (by convention — digital tools may use a red
          annotation layer). These are called <strong>redline drawings</strong>. Common redline
          categories:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>Change Category</th>
              <th>Example</th>
              <th>Always Redline?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Route deviation</td>
              <td>Conduit moved 40 ft east at station 24+80</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Splice point relocation</td>
              <td>Splice relocated from pole 47 to pole 51 (utility conflict)</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Added handhole / vault</td>
              <td>Extra Type I handhole added at station 31+10 (crossing conflict)</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Cable type change</td>
              <td>ADSS substituted for lashed due to span length increase</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Depth variance</td>
              <td>Depth reduced to 24″ through 80 ft of rock at station 19+40</td>
              <td>Yes — with FCO if variance exceeds threshold</td>
            </tr>
            <tr>
              <td>Minor GPS offset</td>
              <td>Splice point 6 ft from design location</td>
              <td>Yes — record actual coordinates</td>
            </tr>
          </tbody>
        </table>

        <p>
          Redlines are the <em>raw material</em> — they come off the field truck messy, sometimes
          barely legible, sometimes missing a dimension. The reconciliation process takes those
          redlines and converts them into clean, signed, final as-built drawings.
        </p>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────── */}
      <section className="lesson-section working">
        <h2>The Reconciliation Process Step by Step</h2>

        <p>
          A structured reconciliation workflow ensures nothing slips through the gap between design
          and as-built. Here is the standard sequence used on RUS telecom construction projects:
        </p>

        <ol className="step-list">
          <li>
            <strong>Collect all redlines from the field.</strong> Every crew foreman, subcontractor
            superintendent, and inspector should submit their marked-up drawings within 10 business
            days of completing their section. Do not allow redlines to sit on trucks for months — the
            memory of why a change was made degrades fast.
          </li>
          <li>
            <strong>Log each change against the design set.</strong> Create a change register with
            one row per change: drawing sheet/station, change type, description, field crew notation,
            FCO number (if one was issued), and status (Pending / Reviewed / Resolved).
          </li>
          <li>
            <strong>Apply discrepancy thresholds.</strong> Not every deviation requires the engineer's
            signature — a 3-ft offset from design at a handhole typically does not. A 300-ft route
            deviation or a cable gauge change does. The engineer defines thresholds in the project
            specifications; apply them to the change register to flag items requiring engineer review.
          </li>
          <li>
            <strong>Resolve flagged items with the engineer of record.</strong> Engineer reviews each
            flagged change and either (a) approves as-built, (b) requires a field fix, or (c) issues
            a retroactive FCO with justification. Record the resolution in the change register.
          </li>
          <li>
            <strong>Update the drawing set.</strong> Drafting/GIS staff incorporate every accepted
            change into the CAD/GIS drawing set. Convert each redline annotation to a clean final
            dimension, coordinate, or notation. Remove "AS DESIGNED" title block language; replace
            with "AS BUILT" and the final date.
          </li>
          <li>
            <strong>Update all administration records.</strong> Every change that affected a TIA-606-C
            link, pathway, or location record must be updated in the administration record system.
            Splice matrix entries for any relocated or re-spliced fibers must also be corrected. A
            drawing update without a corresponding administration record update is an incomplete
            reconciliation.
          </li>
          <li>
            <strong>Engineer of record signs and seals the final as-built set.</strong> On RUS
            projects, the engineer must certify that the as-built drawings accurately represent the
            constructed system before the project can be closed out and Form 219 submitted. The
            engineer's seal is the quality gate.
          </li>
        </ol>

        <h3>Discrepancy Thresholds — Practical Guidance</h3>

        <p>
          Thresholds are project-specific, but RUS practice and TIA-606-C provide guidance on what
          warrants formal engineering review vs. administrative update only:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>Change Type</th>
              <th>Threshold for Engineer Review</th>
              <th>Rationale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Route horizontal offset</td>
              <td>&gt; ±50 ft from design centerline</td>
              <td>May affect ROW/easement validity and NESC clearances</td>
            </tr>
            <tr>
              <td>Burial depth reduction</td>
              <td>Any reduction below minimum per 7 CFR §1755.800</td>
              <td>Safety and RUS compliance — no waiver without engineer review</td>
            </tr>
            <tr>
              <td>Splice point relocation</td>
              <td>&gt; ±100 ft from design location</td>
              <td>May affect loss budget, slack management, OTDR test reference</td>
            </tr>
            <tr>
              <td>Handhole / vault count change</td>
              <td>Any addition or deletion</td>
              <td>Affects conduit fill, pull tension calculations, maintenance access</td>
            </tr>
            <tr>
              <td>Cable specification change</td>
              <td>Any type, gauge, or count change</td>
              <td>Affects loss budget, capacity, and RUS Form 1755-A unit costs</td>
            </tr>
            <tr>
              <td>GPS coordinate offset</td>
              <td>&gt; ±30 ft (horizontal)</td>
              <td>811 / one-call accuracy — affects safe excavation zone</td>
            </tr>
          </tbody>
        </table>

        <p>
          The ±50 ft horizontal and ±30 ft GPS thresholds are practical values widely used in RUS
          telecom contracting, but your project specifications may define different values. Always
          defer to the project specs when they conflict with these general guidelines.
        </p>

        <WorkedExample
          title="Reconciling a Route Deviation at Station 24+80"
          steps={[
            {
              label: 'Field Condition Identified',
              content:
                'Crew foreman reports: conduit ran 60 ft east of design centerline between station 24+60 and 25+40 to avoid a 6-inch gas main that was not shown on the utility survey. Redline shows new centerline with offset dimensions.',
            },
            {
              label: 'Log in Change Register',
              content:
                'Row added: Sheet 7 / Sta. 24+60–25+40 / Route deviation 60 ft east / Gas main conflict / FCO-2024-017 issued / Status: Pending engineer review.',
            },
            {
              label: 'Apply Threshold',
              content:
                '60 ft > 50 ft threshold → flagged for engineer review. FCO-2024-017 documents the field decision and references the utility as-built received post-design showing the gas main.',
            },
            {
              label: 'Engineer Review',
              content:
                'Engineer of record confirms: (a) the deviation stays within the construction ROW/easement, (b) burial depth was maintained at 42 inches throughout the deviation, (c) no NESC clearance issues. Engineer approves as-built via FCO-2024-017 sign-off.',
            },
            {
              label: 'Drawing Update',
              content:
                'Drafting updates Sheet 7 to show the actual conduit centerline at station 24+60–25+40. The deviation dimensions (60 ft east, 80 ft affected span) are shown as a note. Title block updated to AS BUILT, dated, and engineer seal applied.',
            },
            {
              label: 'GIS and Administration Record Update',
              content:
                'GIS staff update the conduit polyline feature in the GIS database: pathway record CDT-S24-25 vertices adjusted to new coordinates. New GPS waypoints GPSWP-024-001 and GPSWP-025-001 added to capture the deviation endpoints. Pathway record updated in TIA-606-C system to reflect new route geometry.',
            },
          ]}
        />

        <h3>The Sign-Off Chain</h3>

        <p>
          On RUS projects, the as-built sign-off chain is defined by the project specifications and
          loan conditions. A typical chain looks like this:
        </p>

        <ol className="step-list">
          <li>
            <strong>Construction Foreman</strong> — certifies that the redlines are a complete and
            accurate record of field conditions as constructed in their scope.
          </li>
          <li>
            <strong>Project Inspector / Resident Engineer</strong> — verifies that the redlines
            are consistent with daily inspection reports and photos, and resolves any discrepancies
            between redlines and inspection records.
          </li>
          <li>
            <strong>Engineering Firm (Drafter/Designer)</strong> — incorporates all accepted
            redlines into the CAD/GIS set and performs an internal QC check.
          </li>
          <li>
            <strong>Engineer of Record (Licensed P.E.)</strong> — reviews the complete reconciled
            drawing set, applies professional seal and signature, certifies conformance to NESC,
            NEC, TIA, and RUS requirements.
          </li>
          <li>
            <strong>RUS State Office Review</strong> — on final inspections, a RUS field
            representative may review a sample of the as-built records and compare against field
            conditions. Discrepancies found at this stage = audit exposure.
          </li>
        </ol>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────── */}
      <section className="lesson-section advanced">
        <h2>RUS Audit Exposure</h2>

        <p>
          RUS construction loan and grant funds are federal dollars. RUS (and the USDA Office of
          Inspector General) has the right to audit any project receiving RUS financial assistance
          at any time within the retention period (7 CFR §1755.400(c) requires records for the
          life of the facility for O&amp;M records, and at least 10 years post-construction for
          project files). Here is what happens when the as-built does not match field conditions:
        </p>

        <table className="standard-table">
          <thead>
            <tr>
              <th>Discrepancy Type</th>
              <th>Typical Audit Finding</th>
              <th>Consequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Route shown on as-built does not match staking/GPS field verify</td>
              <td>Construction cost disallowance for the affected segment</td>
              <td>Borrower may owe RUS for disallowed costs</td>
            </tr>
            <tr>
              <td>Cable type or count differs from as-built</td>
              <td>Material substitution finding — possible unauthorized change</td>
              <td>Engineering review required; may require field correction</td>
            </tr>
            <tr>
              <td>Splice point locations not recorded in GIS</td>
              <td>Incomplete O&M records finding</td>
              <td>Cure period required; remediation cost borne by borrower</td>
            </tr>
            <tr>
              <td>Burial depth less than as-built shows</td>
              <td>RUS safety finding + NESC violation</td>
              <td>Remediation required; potential suspension of disbursements</td>
            </tr>
            <tr>
              <td>As-built drawings not sealed by licensed engineer</td>
              <td>Professional engineering certification deficiency</td>
              <td>Loan condition cure required before final advance</td>
            </tr>
          </tbody>
        </table>

        <p>
          The field lesson here is straightforward: the cost of doing reconciliation correctly —
          collecting redlines, logging changes, getting engineer sign-off, updating the GIS — is
          measured in days and hundreds of dollars per project. The cost of doing it wrong — or
          not doing it at all — shows up in audit findings that can disallow hundreds of thousands
          of dollars in construction costs and tie up loan advances for months.
        </p>

        <h3>Book vs. Field Practice</h3>

        <p>
          <strong>The book standard (TIA-606-C §6 / RUS 7 CFR §1755.400):</strong> Every change to
          a cable plant that affects cable routing, termination points, splice locations, or
          infrastructure must be reflected in the administration records as soon as the change is
          accepted. The standard contemplates a fairly tight loop — change made, engineer reviewed,
          record updated.
        </p>

        <p>
          <strong>Common field practice:</strong> On long-haul OSP builds, reconciliation often
          gets batched and done after substantial completion — sometimes as late as 60–90 days
          post-construction. The field crew moves to the next segment; the engineer's office does
          the paperwork. This is widely done and often works fine on non-RUS projects where the
          borrower is not federally obligated.
        </p>

        <p>
          <strong>The risk of confusing them:</strong> On a RUS-funded project, batching
          reconciliation and then rushing it 60 days post-construction is an invitation to errors
          that survive into the final as-built. Crew memory degrades, redlines go missing, the
          resident inspector who was on-site every day has moved to the next project. The standard
          exists precisely because the window for accurate reconciliation closes fast. Best
          practice on RUS projects: reconcile within 15 business days of completing each section,
          not after the entire project is done.
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
            id: 'T16L06-Q1',
            type: 'multiple_choice',
            question:
              'A field crew relocated a splice point 120 ft from the design location to avoid a buried gas main. Which reconciliation action is required?',
            options: [
              'Record the new location in the GIS only — no engineer review needed',
              'Issue a Field Change Order and obtain engineer of record sign-off before finalizing the as-built',
              'Note the deviation on the redline drawing and batch it for reconciliation after project completion',
              'The deviation is within normal construction tolerances — no action needed',
            ],
            correct: 1,
            explanation:
              '120 ft exceeds the ±100 ft splice relocation threshold that requires engineer review. A Field Change Order must be issued and the engineer of record must approve the deviation before the as-built record is finalized. RUS 7 CFR §1755.400(c)(4) requires as-built records to reflect actual field conditions — an unreviewed deviation does not satisfy this requirement.',
          },
          {
            id: 'T16L06-Q2',
            type: 'multiple_choice',
            question:
              'What is the correct definition of a "redline drawing" in the OSP as-built workflow?',
            options: [
              'A final signed drawing with a red title block indicating RUS review',
              'A paper or digital copy of the design drawing annotated in red by field crews to show all deviations from design',
              'A drawing set produced by the engineer after a failed RUS audit',
              'A GIS layer showing the originally designed cable route before any field changes',
            ],
            correct: 1,
            explanation:
              'A redline drawing is the field crew\'s marked-up copy of the design drawing, annotated in red to capture every deviation from design. Redlines are the raw material that the reconciliation process converts into the final, signed as-built record. They come directly from field crews and must be collected before memory of why a change was made degrades.',
          },
          {
            id: 'T16L06-Q3',
            type: 'multiple_choice',
            question:
              'Under 7 CFR §1755.400(c), a RUS borrower must retain as-built construction records for:',
            options: [
              'A minimum of 3 years after project completion',
              'A minimum of 7 years, consistent with IRS record retention rules',
              'The life of the facility (for O&M records) and at least 10 years post-construction for project files',
              'Until the RUS loan is paid in full, after which records may be destroyed',
            ],
            correct: 2,
            explanation:
              '7 CFR §1755.400(c) requires that RUS borrowers retain O&M records for the life of the facility and that project construction records be retained for at least 10 years post-construction. This is a federal obligation tied to the loan agreement — not an optional best practice. Records destroyed before this period are an audit finding.',
          },
          {
            id: 'T16L06-Q4',
            type: 'multiple_choice',
            question:
              'During a RUS audit, the field inspector verifies that a conduit segment runs 200 ft east of the route shown on the as-built drawings. The as-built drawings were submitted with the final Form 219. What is the most likely consequence?',
            options: [
              'No consequence — the borrower can submit corrected as-builts after the audit with no penalty',
              'Construction cost disallowance for the affected segment and a potential requirement to remediate the as-built records',
              'The loan is automatically accelerated and the full balance becomes due',
              'RUS will require a new engineering seal but no cost disallowance will occur',
            ],
            correct: 1,
            explanation:
              'A route discrepancy found during a RUS audit where the field condition does not match the submitted as-built typically results in a construction cost disallowance for the affected segment. The borrower may owe RUS for disallowed costs and will be required to submit corrected as-built records as a cure. Automatic loan acceleration is a severe consequence reserved for repeated or fraudulent violations — it is not the typical first response to a documentation discrepancy.',
          },
        ]}
      />
    </LessonLayout>
  );
}
