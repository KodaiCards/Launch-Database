// Net-new — T04.L09 Pre-Engineering for RUS Jobs
// Working lesson: RUS construction package conventions, unit codes, and field engineering data sheets

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T04.L09',
  course_id: 'T04',
  title: 'Pre-Engineering for RUS Jobs',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T01.L01', 'T04.L01', 'T04.L02', 'T04.L03', 'T04.L04', 'T04.L05', 'T04.L06', 'T04.L07', 'T04.L08'],
  vocabulary_introduced: [
    'RUS pre-engineering',
    'construction unit code',
    'RUS field engineering data sheet',
    'RUS contract forms',
    'construction package',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'pole', source_lesson_id: 'T01.L01' },
    { term: 'conduit', source_lesson_id: 'T01.L01' },
    { term: 'attachment', source_lesson_id: 'T01.L01' },
    { term: 'make-ready', source_lesson_id: 'T01.L01' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'photo log', source_lesson_id: 'T04.L01' },
    { term: 'existing utility', source_lesson_id: 'T04.L01' },
    { term: 'pole audit', source_lesson_id: 'T04.L04' },
    { term: 'make-ready flag', source_lesson_id: 'T04.L04' },
    { term: 'route scoring', source_lesson_id: 'T04.L05' },
    { term: 'deliverable package', source_lesson_id: 'T04.L06' },
    { term: 'versioning', source_lesson_id: 'T04.L06' },
    { term: 'plant accounting', source_lesson_id: 'T04.L07' },
    { term: 'RUS Form 1755-A', source_lesson_id: 'T04.L07' },
    { term: 'construction cost ledger', source_lesson_id: 'T04.L07' },
    { term: 'handoff package', source_lesson_id: 'T04.L08' },
    { term: 'design input', source_lesson_id: 'T04.L08' },
    { term: 'as-surveyed', source_lesson_id: 'T04.L08' },
    { term: 'design constraints', source_lesson_id: 'T04.L08' },
    { term: 'gap analysis', source_lesson_id: 'T04.L08' },
  ],
  estimated_minutes: 20,
};

export const key_terms = [
  {
    term: 'RUS pre-engineering',
    definition:
      'The phase of a RUS-funded telecommunications project that follows the route survey and precedes the detailed engineering design. During pre-engineering, the borrower and their engineer compile the field data, identify construction requirements, prepare preliminary cost estimates, and assemble the initial construction package that will be submitted to RUS for loan authorization review. Pre-engineering is the bridge between "we surveyed the route" and "we are ready to design and build."',
  },
  {
    term: 'construction unit code',
    definition:
      'A standardized code used in RUS construction documentation to describe a specific unit of telecommunications plant — for example, a single wood pole, a mile of aerial cable, or a handhole. Construction unit codes allow RUS to compare construction costs across borrowers and verify that loan funds were used for the type of plant proposed. Unit codes are defined in the applicable RUS construction standards and referenced on the Form 1755-A cost ledger.',
  },
  {
    term: 'RUS field engineering data sheet',
    definition:
      'A form completed by the field engineer or survey crew to document the physical characteristics of the proposed construction route: pole class and height requirements, span lengths, crossing types (road, waterway, railroad), attachment requirements, and make-ready flags. The field engineering data sheet is the primary input from the field survey into the formal engineering design and the pre-engineering cost estimate.',
  },
  {
    term: 'RUS contract forms',
    definition:
      'The standard contract and procurement documents used on RUS-funded construction projects, published by the Rural Utilities Service. Examples include the construction contract (based on RUS standard general conditions), the equipment procurement contract, and the engineer-borrower agreement. Using RUS contract forms is a loan condition — borrowers may not substitute their own contract forms without RUS approval.',
  },
  {
    term: 'construction package',
    definition:
      'The complete set of documents required to authorize and execute a RUS-funded construction project: the engineering design plan set, construction specifications, material specifications, cost estimate, construction unit breakdown, environmental checklist, and required certifications. The construction package is reviewed by RUS before the loan is authorized and before construction begins. An incomplete or non-conforming construction package triggers a rejection and re-submission cycle.',
  },
];

export default function T04L09_RusPreEngineering() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've surveyed the route and handed off the survey package to the design engineer.
          But on a RUS-funded project, there's a step between the survey and the drawing board
          that doesn't exist on a standard commercial project: <strong>pre-engineering</strong>.
        </p>
        <p className="mt-2">
          Think of RUS pre-engineering like a contractor's bid package. Before you can submit
          a bid for a government construction contract, you have to put together a specific
          set of documents in a specific format. You can't just hand the government a Post-it
          note that says "gonna build some fiber, probably costs $2M." You need a detailed
          scope, a materials list, a cost breakdown, certifications, and documentation that
          proves the work was properly planned. RUS pre-engineering produces that package.
        </p>
        <p className="mt-2">
          For a field crew, the most important thing to understand about pre-engineering
          is that <strong>your field data feeds the package</strong>. The field engineering
          data sheet — a form you help fill out after the survey — is the source document
          for the engineer's preliminary design and cost estimate. Inaccurate field data
          = inaccurate pre-engineering = an RUS submission that gets kicked back for
          corrections = schedule delay on a federal loan timeline.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym / Term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">USDA agency that funds rural telecom construction; sets loan conditions and document-submission requirements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FEDS</td>
              <td className="px-3 py-2">Field Engineering Data Sheet</td>
              <td className="px-3 py-2">The form the field crew completes to document physical construction requirements: pole specs, spans, crossings, make-ready flags</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">7 CFR 1755</td>
              <td className="px-3 py-2">Code of Federal Regulations, Title 7, Part 1755</td>
              <td className="px-3 py-2">The RUS telecommunications construction standards that define acceptable materials, construction methods, and documentation requirements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PE</td>
              <td className="px-3 py-2">Professional Engineer</td>
              <td className="px-3 py-2">A licensed engineer whose stamp is required on RUS construction plan sets and cost certifications; the engineer of record for the project</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEPA</td>
              <td className="px-3 py-2">National Environmental Policy Act</td>
              <td className="px-3 py-2">Federal law requiring environmental review of federally funded projects; RUS construction packages must include an environmental checklist (Categorical Exclusion, EA, or full EIS depending on project scope)</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T04-L09"
          cards={key_terms.map(kt => ({
            id: `T04-L09-fc-${kt.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            front: `What is ${kt.term}?`,
            back: kt.definition,
          }))}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The RUS Construction Package — What Goes In</h2>

        <p>
          A complete RUS construction package contains multiple document types, each serving
          a specific review function. Here's what each section is and where it comes from:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">1. Engineering Plan Set</h4>
            <p className="text-slate-300/90">
              The full engineering drawings: route map, pole placement plan, aerial/underground
              detail sheets, crossing details, equipment placement. Stamped by a licensed PE.
              Drawn by the design engineer from the survey handoff data.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: design engineer using your survey handoff package.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">2. Field Engineering Data Sheet (FEDS)</h4>
            <p className="text-slate-300/90">
              The form documenting physical route conditions: every pole (class, height,
              set depth), every span (type, length), every crossing (road, waterway,
              railroad — crossing type and depth), every make-ready flag, and every
              underground segment (conduit type, trench depth, bore method).
              Completed by field crew or field engineer during survey.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: field crew — you fill this out from the site walk and pole audit data.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">3. Construction Unit Breakdown</h4>
            <p className="text-slate-300/90">
              A line-item list of every <strong>construction unit code</strong> in the project:
              "X poles — 40 ft Class 4 (unit code XYZ), Y poles — 45 ft Class 3 (unit code ABC),
              Z miles aerial cable (unit code DEF)." Each line includes the unit quantity,
              unit cost, and total cost. This is the bill of quantities the RUS reviewer
              uses to verify cost reasonableness.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: design engineer using field data + unit costs from RUS construction standards (7 CFR 1755).</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">4. Preliminary Cost Estimate</h4>
            <p className="text-slate-300/90">
              The total projected construction cost organized by category: materials,
              labor, overhead, engineering, contingency. On a RUS project, the cost estimate
              must be prepared by or verified by a licensed PE and must be traceable to the
              unit breakdown. Unsupported contingency lines (e.g., "contingency: $500,000"
              with no basis) are a common RUS rejection reason.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: design engineer, based on unit breakdown + current market pricing.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">5. Environmental Checklist (NEPA Compliance)</h4>
            <p className="text-slate-300/90">
              The NEPA environmental review documentation. Most RUS telecom construction
              projects qualify for a Categorical Exclusion (CatEx) — a finding that the
              project doesn't require a full Environmental Assessment or Environmental
              Impact Statement because the work type is on the pre-approved CatEx list.
              The checklist confirms the project meets the CatEx criteria (no wetland
              impacts exceeding thresholds, no historic property within APE, no threatened
              species in project corridor).
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: borrower + engineer; data from survey (wetland observations, proximity to historic properties).</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
            <h4 className="font-semibold text-slate-200 mb-2">6. Engineer Certification</h4>
            <p className="text-slate-300/90">
              A letter from the PE certifying that the design was prepared in accordance
              with RUS standards (7 CFR 1755), that the cost estimate is reasonable and
              based on current market pricing, and that the plan set is complete and
              ready for construction. Without the PE certification, RUS will not approve
              the loan drawdown for construction.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">Source: licensed PE — their stamp and signature.</p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Construction unit codes — what they are and why they matter</h3>
        <p>
          A <strong>construction unit code</strong> is a standardized shorthand for a specific
          type and configuration of telecommunications plant. Instead of describing every
          individual construction element in prose, the RUS system uses unit codes to
          categorize plant by type, material class, and construction method.
        </p>
        <p className="mt-2">
          For example, a typical aerial plant unit breakdown might look like:
        </p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Unit Type (example)</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Quantity</th>
                <th className="px-3 py-2 text-left">Why field data matters</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono text-xs">Pole — 40 ft Cl. 4</td>
                <td className="px-3 py-2">New 40-foot, Class 4 wood pole, set in soil</td>
                <td className="px-3 py-2">Counted from field data</td>
                <td className="px-3 py-2">Field audit identifies whether an existing pole needs replacement or a new pole is being added; the as-surveyed height determines whether 40 ft or 45 ft is specified</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono text-xs">Aerial Cable — ADSS 144F</td>
                <td className="px-3 py-2">All-Dielectric Self-Supporting cable, 144-fiber count, per mile</td>
                <td className="px-3 py-2">Measured from route centerline</td>
                <td className="px-3 py-2">The GIS route centerline length determines miles of cable — measurement errors compound directly into cost-estimate errors</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono text-xs">Road Crossing — HDD</td>
                <td className="px-3 py-2">Horizontal directional drill road crossing, per crossing</td>
                <td className="px-3 py-2">Counted from field crossing inventory</td>
                <td className="px-3 py-2">Each road crossing flagged during the site walk (crossing type, road width, pavement type) determines whether it's an HDD bore or open-cut — a $5,000 vs. $50,000 cost difference</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-mono text-xs">Make-Ready — Transfer</td>
                <td className="px-3 py-2">Make-ready work: rearrangement of existing attachments, per pole</td>
                <td className="px-3 py-2">Counted from make-ready flags in pole audit</td>
                <td className="px-3 py-2">Make-ready flags from the pole audit directly determine this unit count — a missed make-ready flag means an under-estimated construction package and a cost overrun during construction</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-300/70">
          Construction unit codes in RUS documentation are defined per 7 CFR Part 1755 and
          referenced in the applicable RUS construction bulletins (including RUS Bulletin
          1751F-630 for aerial plant). Verify unit code definitions against the current
          published standards when preparing the pre-engineering package — codes can be
          revised between RUS bulletin editions.
        </p>

        <h3 className="mt-5 font-semibold">The field engineering data sheet — your role in filling it out</h3>
        <p>
          The <strong>field engineering data sheet</strong> (FEDS) is the document where the
          field crew's survey observations are formally recorded in the format the design
          engineer needs for the pre-engineering package. Think of it as a structured version
          of your field notes — organized by the categories the engineer will use in the
          plan set.
        </p>
        <p className="mt-2">
          Key sections of a typical FEDS for an aerial route:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Pole inventory:</strong> For each pole — station, pole number,
            existing class and height (as-surveyed), proposed class and height if replacement
            is needed, make-ready flag (yes/no/type), existing occupancy (carriers present,
            heights from ground), proposed fiber attachment height (to be confirmed by engineer).
          </li>
          <li>
            <strong>Span inventory:</strong> For each span — from station to station,
            span length (measured or GIS-derived), span type (aerial, underground, crossing),
            any overhead obstructions observed.
          </li>
          <li>
            <strong>Crossing inventory:</strong> For each road, waterway, railroad, or
            utility crossing — station, crossing type, road name / waterway name,
            crossing method (aerial, HDD, open-cut, lash), required permits flagged.
          </li>
          <li>
            <strong>Underground segments:</strong> For each underground segment — start/end
            station, length, proposed conduit type (Schedule 40 PVC, HDPE), trench depth,
            bore method for crossings, existing conduit available (yes/no).
          </li>
          <li>
            <strong>Design constraints and hazards:</strong> Everything flagged during
            the site walk and pole audit that limits the design engineer's options,
            in the format described in T04.L08.
          </li>
        </ol>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">The RUS review and approval timeline</h3>
        <p>
          Understanding the RUS review timeline helps field crews understand why accuracy
          matters from day one. A typical RUS pre-engineering-to-authorization timeline:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li><strong>Pre-engineering complete</strong> — borrower and engineer finalize the construction package.</li>
          <li><strong>RUS submission</strong> — package submitted to the RUS district office for review.</li>
          <li><strong>RUS review (typically 30–90 days)</strong> — RUS area engineer reviews the design, cost estimate, environmental compliance, and completeness. Issues a deficiency letter if anything is missing or non-conforming.</li>
          <li><strong>Deficiency response</strong> — borrower and engineer address each deficiency. If field data was inaccurate (wrong pole heights, wrong unit counts), the engineer may have to return to the field — adding weeks or months.</li>
          <li><strong>Loan authorization</strong> — RUS issues the approval; the borrower can begin procurement and construction.</li>
        </ol>
        <p className="mt-2">
          Field data accuracy directly affects the deficiency rate. A pre-engineering package
          built on well-documented field data typically passes RUS review in one round. A
          package built on estimated or incomplete field data commonly returns 2–3 rounds of
          deficiency responses before authorization — each round adding 30–60 days to the
          timeline and engineering revision costs.
        </p>

        <h3 className="mt-5 font-semibold">RUS standard construction forms — where they come from</h3>
        <p>
          RUS contract forms and construction package templates are published by the Rural
          Utilities Service and available at the RUS website (rd.usda.gov/programs-services/
          telecommunications-programs). The relevant forms include:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>RUS Form 740:</strong> Contract for construction of telecommunications lines (telecommunications system construction contract). The standard RUS construction agreement between the borrower and the construction contractor.</li>
          <li><strong>RUS Form 307:</strong> Specifications and drawings checklist — used to verify the construction package is complete before submission.</li>
          <li><strong>RUS Form 1755-A:</strong> Construction cost ledger (covered in T04.L07) — reconciles actual construction costs against the authorized budget.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Form numbers and submission procedures are subject to RUS revision. Always confirm
          current form versions and submission requirements with the RUS district office at
          the start of the project. Using a superseded form version is a common deficiency
          finding. (Source: 7 CFR Part 1755 — RUS Telecommunications Standards; RUS
          Bulletin 1751F-630 Appendix; RUS.USDA.gov forms repository.)
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ───────────────────────────────────────────── */}
      <AnnotatedDiagram
        src="/training/diagrams/t04-l09-rus-package-cover.svg"
        alt="An annotated RUS construction package cover sheet showing labeled sections: borrower name, project description, loan application number, RUS district office, submittal date, engineer certification block, PE stamp location, and document revision/version label."
        hotPoints={[
          {
            x: 15,
            y: 15,
            label: 'Borrower Identification',
            explanation:
              'The legal name of the RUS borrower (the telephone company or cooperative receiving the loan). This must exactly match the name on the loan application and borrower agreement — a mismatch triggers a correction request from the RUS district office.',
          },
          {
            x: 40,
            y: 15,
            label: 'Loan Application / Case Number',
            explanation:
              'The RUS case number assigned to this project. All submittals, correspondence, and design revisions reference this number. Using an incorrect case number routes the submittal to the wrong reviewer. Confirm the case number with the RUS district office at the start of the project.',
          },
          {
            x: 70,
            y: 15,
            label: 'Submittal Date',
            explanation:
              'The date the construction package is submitted to RUS. The submittal date starts the RUS review clock. If the package is incomplete, the clock resets on the re-submittal date. Accurate dating is required for tracking review timelines and loan-condition deadlines.',
          },
          {
            x: 25,
            y: 55,
            label: 'Project Description',
            explanation:
              'A brief narrative describing the project scope: "Construction of 8.2 miles of aerial fiber optic cable along County Road 14 in [County], [State], connecting the Exchange central office to [community name]." The project description must be consistent with the loan application scope — if the scope changed between application and pre-engineering, a scope-change request must accompany the submittal.',
          },
          {
            x: 65,
            y: 55,
            label: 'Engineer Certification Block',
            explanation:
              'The space where the Professional Engineer certifies that the design was prepared in accordance with RUS standards (7 CFR 1755), the cost estimate is reasonable, and the package is complete. Without the PE certification signature and stamp, RUS will not process the submittal. Verify that the certifying PE\'s license is current and valid in the project state.',
          },
          {
            x: 80,
            y: 78,
            label: 'PE Stamp Location',
            explanation:
              'The physical or digital PE stamp location. RUS requires the stamp on the cover sheet and on each sheet of the engineering plan set. State licensing requirements determine whether a wet stamp, a scanned stamp, or a digital seal is acceptable. Confirm with the RUS district office and the state engineering licensing board before submitting.',
          },
          {
            x: 20,
            y: 88,
            label: 'Revision / Version Label',
            explanation:
              'The revision number and date of this submittal. If this is the initial submission, "Rev 0 — [date]". If this is a re-submittal after a deficiency response, "Rev 1 — [date]" with a change summary. RUS reviewers must be able to identify which revision they are reviewing. Using "FINAL" or "FINAL-REV" instead of a numbered revision is a common deficiency — use numeric revision numbers.',
          },
        ]}
      />

      {/* ── SORTABLE ─────────────────────────────────────────────────────── */}
      <Sortable
        title="RUS Construction Package — Submission Document Order"
        description="Drag these documents into the correct submission order for an RUS pre-engineering construction package, from the first document the reviewer sees (top) to the last supporting document (bottom)."
        items={[
          { id: 'cover-sheet', label: 'Cover sheet with borrower ID, case number, submittal date, and PE certification block' },
          { id: 'form-307', label: 'RUS Form 307 (specifications and drawings checklist) — confirms package completeness' },
          { id: 'plan-set', label: 'Engineering plan set — route map, pole placement plan, detail sheets (PE-stamped, each sheet)' },
          { id: 'feds', label: 'Field Engineering Data Sheet (FEDS) — pole inventory, span inventory, crossing inventory, design constraints' },
          { id: 'unit-breakdown', label: 'Construction unit code breakdown with quantities and unit costs' },
          { id: 'cost-estimate', label: 'Preliminary cost estimate — materials, labor, engineering, contingency (PE-certified)' },
          { id: 'environmental-checklist', label: 'Environmental checklist (NEPA Categorical Exclusion checklist or EA as applicable)' },
        ]}
        correctOrder={['cover-sheet', 'form-307', 'plan-set', 'feds', 'unit-breakdown', 'cost-estimate', 'environmental-checklist']}
        feedbackCorrect="Correct RUS submission order. The cover sheet is always first — it identifies the project and the reviewer routes the package. The completeness checklist (Form 307) follows so the reviewer can immediately verify the package is complete before diving into the technical content. The PE-stamped plan set is the core engineering document. The FEDS supports the plan set with field detail. The unit breakdown and cost estimate follow — the reviewer traces cost to units to the plan set to verify reasonableness. The environmental checklist closes the package."
        feedbackIncorrect="Reconsider the order. The cover sheet must be first — it identifies the project. The completeness checklist follows the cover sheet so the reviewer knows what to expect. The plan set is the core technical document. Supporting data (FEDS, unit codes, cost) follows the plan set. The environmental compliance documentation closes the package. Think: what does the reviewer need to see first to begin their review?"
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T04.L09 Check — Pre-Engineering for RUS Jobs"
        mode="multiple-choice"
        questions={[
          {
            id: 'T04-L09-Q1',
            type: 'mc',
            prompt:
              'During a pole audit for a RUS-funded project, a crew member misidentifies three wood poles as Class 4 (40 ft) when they are actually Class 3 (45 ft). How does this field error affect the RUS construction package?',
            choices: [
              'It has no effect — the PE will verify pole classes during the engineering review',
              'The construction unit breakdown will show the wrong unit code (40 ft Class 4 vs. 45 ft Class 3), producing an incorrect materials list and cost estimate; if the error is discovered during RUS review, it triggers a deficiency response and a return field visit',
              'RUS reviewers do not verify individual pole classes — only total pole count matters',
              'The contractor will catch the error during construction and adjust the order — no pre-engineering impact',
            ],
            answerIndex: 1,
            explanation:
              'Construction unit codes are specific to pole class and height — a 40 ft Class 4 and a 45 ft Class 3 are different unit codes with different material costs. Using the wrong code in the unit breakdown produces an incorrect cost estimate. If the error is caught during RUS review, it generates a deficiency finding and requires a corrected FEDS and revised unit breakdown — adding 30–60 days to the review timeline. If caught during construction, the contractor must reorder the correct poles and may incur change-order costs chargeable to the borrower.',
            citation: 'RUS Bulletin 1751F-630 § 7 (aerial plant — pole specifications); 7 CFR Part 1755 (RUS construction standards); ANSI O5.1 (wood pole classes and dimensions).',
          },
          {
            id: 'T04-L09-Q2',
            type: 'mc',
            prompt:
              'What is the primary purpose of the field engineering data sheet (FEDS) in the RUS pre-engineering process?',
            choices: [
              'To certify that the design engineer is licensed in the project state',
              'To document physical route conditions — pole specs, spans, crossings, make-ready flags — from the field survey, providing the structured field data the design engineer uses for the plan set and cost estimate',
              'To serve as the construction contract between the borrower and the contractor',
              'To satisfy the NEPA environmental review requirement for the construction package',
            ],
            answerIndex: 1,
            explanation:
              'The FEDS is the structured field-data form that translates the field crew\'s site walk and pole audit observations into the format the design engineer needs for the pre-engineering package. Every pole, span, crossing, and make-ready flag from the field survey is recorded on the FEDS. The design engineer uses it to prepare the plan set, the construction unit breakdown, and the cost estimate. Without an accurate FEDS, the engineer is designing from incomplete or inaccurate field data.',
            citation: 'RUS Bulletin 1751F-630 Appendix; 7 CFR Part 1755 (RUS pre-engineering documentation requirements).',
          },
          {
            id: 'T04-L09-Q3',
            type: 'fill-in-blank',
            prompt:
              'A standardized code used in RUS construction documentation to describe a specific unit of telecommunications plant — such as a single pole, a mile of cable, or a road crossing — is called a ____.',
            answer: 'construction unit code',
            answerDisplay: 'construction unit code',
            explanation:
              'Construction unit codes allow RUS to standardize the description and costing of plant components across all borrowers and all projects. Each code specifies a distinct type and configuration of plant. The unit breakdown lists every code in the project with its quantity and unit cost, producing the total cost estimate that RUS reviews for reasonableness before authorizing the loan for construction.',
            citation: '7 CFR Part 1755 (RUS Telecommunications Standards); RUS Bulletin 1751F-630 (aerial plant construction unit references).',
          },
          {
            id: 'T04-L09-Q4',
            type: 'mc',
            prompt:
              'An RUS construction package is submitted and the RUS district office returns it with a deficiency: "The cover sheet uses revision number \'FINAL\' rather than a numeric revision. Please resubmit with numeric revision labeling per RUS requirements." This is an example of:',
            choices: [
              'A substantive engineering deficiency that requires a return field visit to correct',
              'A formatting deficiency — the reviewer cannot determine which version they are reviewing without numeric revision labeling; correction is administrative but must be done before RUS will continue the review',
              'A trivial comment that can be ignored — the engineering content is what matters',
              'An error that the PE can waive with a certification letter',
            ],
            answerIndex: 1,
            explanation:
              'RUS requires numeric revision numbering (Rev 0, Rev 1, etc.) on all submittal packages. "FINAL" or "FINAL-REV" without a number makes it impossible to track which version the reviewer is evaluating, especially when multiple design revisions are submitted over the life of a project. This is a formatting deficiency — the engineering content may be sound, but the submittal must be corrected and resubmitted before the review continues. While it seems minor, it resets the review clock and adds days to the authorization timeline.',
            citation: 'RUS Bulletin 1751F-630 Appendix (submittal requirements); 7 CFR Part 1755 (construction package documentation standards).',
          },
        ]}
      />

    </LessonLayout>
  );
}
