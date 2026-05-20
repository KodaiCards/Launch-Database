// T10.L11 — Field QA and Inspector Interface
// Working lesson: punch list, kick-back authority, inspector verification role
// Source: RUS 1751F-635 §6, BICSI OSPDRM Ch.14, general construction QA practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L11',
  course_id: 'T10',
  title: 'Field QA and the Inspector Interface',
  order: 11,
  lesson_type: 'working',
  prerequisites: ['T10.L04', 'T10.L06', 'T10.L10', 'T04.L02'],
  learning_objectives: [
    'Distinguish the inspector\'s role as independent verifier from a supervisory or directing role',
    'Define punch list and kick-back authority and explain when each applies',
    'Describe the specific field checks an inspector performs during and after construction',
    'Explain the documentation the inspector signs on final acceptance and why each signature matters',
    'Identify the boundary between inspector authority on RUS projects vs. contractor authority',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'punch list',
    'kick-back authority',
    'field inspector',
    'substantial completion',
    'acceptance walk',
  ],
  key_terms: [
    {
      term: 'punch list',
      definition: 'A written list of deficiencies identified during the acceptance walk that the contractor must correct before the owner signs off on final completion.',
    },
    {
      term: 'kick-back authority',
      definition: 'The inspector\'s power to reject work that fails to meet spec — stopping construction or requiring removal and replacement before the work can continue.',
    },
    {
      term: 'field inspector',
      definition: 'An independent third party (or owner\'s representative) who verifies that work meets plans, specs, and permit conditions — not the person directing the crew.',
    },
    {
      term: 'substantial completion',
      definition: 'The point at which the work is sufficiently complete that the owner can use it for its intended purpose, even if minor punch list items remain.',
    },
    {
      term: 'acceptance walk',
      definition: 'A formal site walkthrough between the contractor and inspector (and often the owner\'s engineer) to document the condition of the finished work and generate the punch list.',
    },
  ],
  vocabulary_assumed: [
    { term: 'DFR', source_lesson_id: 'T10.L10' },
    { term: 'as-built redline', source_lesson_id: 'T10.L10' },
    { term: 'deviation log', source_lesson_id: 'T10.L10' },
    { term: 'depth probe', source_lesson_id: 'T10.L04' },
    { term: 'cover card', source_lesson_id: 'T10.L04' },
    { term: 'slack loop', source_lesson_id: 'T10.L06' },
    { term: 'as-designed', source_lesson_id: 'T04.L08' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L06' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'RUS Form 219', source_lesson_id: 'T01.L05' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

// ─── Annotated diagram: acceptance walk checkpoints ───────────────────────────
const acceptanceAnnotations = [
  {
    id: 'depth',
    x: 18,
    y: 72,
    label: 'Depth probe',
    description: 'Inspector verifies buried conduit depth at intervals — minimum one probe per 500 ft plus every crossing. Results logged on cover card and DFR.',
  },
  {
    id: 'slack',
    x: 42,
    y: 55,
    label: 'Slack coil check',
    description: 'Inspector verifies slack loop lengths and coil IDs are present at every handhole and building entrance per the design plan and the MSA schedule from T10.L06.',
  },
  {
    id: 'cover',
    x: 65,
    y: 60,
    label: 'Frame & cover elevation',
    description: 'Inspector checks that handhole and manhole frame-and-cover sets are at finished grade — not proud, not recessed. Photo taken as documentation.',
  },
  {
    id: 'redline',
    x: 82,
    y: 38,
    label: 'As-built redline review',
    description: 'Inspector cross-references the contractor\'s DFR deviation log against the marked-up plan set to confirm every field deviation is captured and dimensioned.',
  },
  {
    id: 'restoration',
    x: 30,
    y: 85,
    label: 'Surface restoration',
    description: 'Inspector verifies pavement match, trench settlement, and sod condition. Ghost trenches or mismatched pavement surfaces = punch list items.',
  },
];

// ─── Quiz questions ────────────────────────────────────────────────────────────
const quizQuestions = [
  {
    id: 'q1',
    text: 'The contractor\'s foreman asks the inspector for directions on where to place the next handhole. The inspector\'s correct response is:',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Direct the foreman to the design plan and refer any deviations to the engineer of record.' },
      { id: 'b', text: 'Instruct the foreman where to place it, then document the decision in the DFR.' },
      { id: 'c', text: 'Refuse to answer — inspectors are not allowed to speak with crews.' },
      { id: 'd', text: 'Place a stake at the correct location and instruct the crew to center the box on the stake.' },
    ],
    correctId: 'a',
    explanation: 'Inspectors verify compliance — they don\'t direct construction. If the inspector directs placement and it\'s wrong, the owner can be held liable for the error. Deviations go through the engineer of record, not the inspector.',
  },
  {
    id: 'q2',
    text: 'During an acceptance walk, the inspector finds 14 inches of cover at a road crossing where the permit requires 42 inches. The inspector\'s authority is:',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Issue a punch list item requiring correction before final acceptance.' },
      { id: 'b', text: 'Issue a kick-back requiring excavation and re-installation before any additional work continues at this crossing.' },
      { id: 'c', text: 'Note the deficiency but allow work to continue — punch list is the correct mechanism for any deficiency.' },
      { id: 'd', text: 'Contact the state DOT and request a waiver on the contractor\'s behalf.' },
    ],
    correctId: 'b',
    explanation: 'A buried-depth deficiency at a road crossing is a permit non-compliance — it cannot be left in-place and covered with a punch list item. Kick-back authority requires removal and re-installation now. The punch list is for minor cosmetic or accessory items discovered at final walk. Safety-critical or permit-required depths are kick-back territory.',
  },
  {
    id: 'q3',
    text: 'RUS Form 219 is signed by the inspector at:',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Each day construction work is performed.' },
      { id: 'b', text: 'Final acceptance — after all punch list items are resolved.' },
      { id: 'c', text: 'Substantial completion — before punch list items are resolved.' },
      { id: 'd', text: 'Both the start and end of construction.' },
    ],
    correctId: 'b',
    explanation: 'RUS Form 219 is the final acceptance document. It is signed after all punch list items have been corrected and the inspector has verified the work meets plans and specs. Signing 219 before punch list closure would certify deficient work as acceptable — a serious liability.',
  },
];

export default function T10L11_FieldQAInspectorInterface() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of the inspector like a referee at a game. The referee doesn't coach the team,
          doesn't call plays, and doesn't tell players where to run. The referee watches what happens
          and calls it when a rule gets broken. An OSP field inspector works the same way: they watch
          the contractor build, verify that the work matches the plans and permit conditions, and stop
          the work if something is wrong — but they don't direct the crew.
        </p>
        <p>
          Two specific powers matter: <strong>punch list authority</strong> and <strong>kick-back authority</strong>.
          The punch list is a written "fix-it list" created at the end of the job — minor items that need
          to be resolved before the owner signs off. Kick-back authority is stronger: it stops construction
          mid-job and requires removal and re-installation before anything else can proceed. Understanding
          when each applies is the core skill in this lesson.
        </p>

        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Inspector</td>
              <td>Independent verifier — confirms work meets plans/specs/permit. Does NOT direct crew.</td>
            </tr>
            <tr>
              <td>Punch list</td>
              <td>End-of-job written list of minor deficiencies the contractor must correct before final sign-off.</td>
            </tr>
            <tr>
              <td>Kick-back authority</td>
              <td>Power to stop work and require removal/re-installation of non-compliant work before continuing.</td>
            </tr>
            <tr>
              <td>Substantial completion</td>
              <td>Work is usable for intended purpose; minor punch list items may remain open.</td>
            </tr>
            <tr>
              <td>Acceptance walk</td>
              <td>Formal site walkthrough at project end to document conditions and generate the punch list.</td>
            </tr>
            <tr>
              <td>RUS Form 219</td>
              <td>RUS inspection report; signed at final acceptance after all punch list items are resolved.</td>
            </tr>
          </tbody>
        </table>

        <Flashcard
          deckId="T10-L11"
          cards={[
            {
              id: 'fc1',
              front: 'What is the inspector\'s role on an OSP construction project?',
              back: 'Independent verifier: confirms work meets plans, specifications, and permit conditions. The inspector does NOT direct or supervise the crew — directing creates liability for the inspector\'s employer.',
            },
            {
              id: 'fc2',
              front: 'What is a punch list?',
              back: 'A written list of deficiencies identified during the acceptance walk that the contractor must correct before final acceptance is signed. Punch list items are minor — cosmetic, incomplete accessories, or documentation gaps.',
            },
            {
              id: 'fc3',
              front: 'What is kick-back authority?',
              back: 'The inspector\'s power to stop construction and require that non-compliant work be removed and re-installed correctly before any further work continues at that location. Used for safety-critical or permit-required conditions that cannot be left in-place.',
            },
            {
              id: 'fc4',
              front: 'When does substantial completion occur?',
              back: 'When the work is sufficiently complete that the owner can use the system for its intended purpose — even if minor punch list items remain open. Substantially complete ≠ finally accepted.',
            },
            {
              id: 'fc5',
              front: 'What is RUS Form 219?',
              back: 'The RUS Inspection Report: documents as-built conditions, inspector observations, materials used, and final acceptance on RUS-funded projects. Signed by the inspector only after all punch list items are resolved. Full detail covered in T13.',
            },
            {
              id: 'fc6',
              front: 'What is an acceptance walk?',
              back: 'A formal walkthrough of the finished construction site between the contractor, inspector, and often the owner\'s engineer. Purpose: document final condition, verify all work against plans and permits, generate the punch list.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Inspector's Verification Checklist</h2>
        <p>
          Inspectors don't just show up at the end. On a well-run RUS project, the inspector is
          present during critical operations — HDD bore completion, open-cut backfill before
          pavement restoration, handhole setting, and conduit sealing. Think of it in three phases:
          during construction, at substantial completion, and at final acceptance.
        </p>

        <h3>Phase 1: During Construction Checks</h3>
        <p>
          These happen while the ground is still open and work is reversible. The inspector
          verifies the things that become invisible once backfill is placed:
        </p>
        <ul>
          <li>
            <strong>Burial depth:</strong> depth probe readings at intervals (minimum 1 per 500 ft
            plus every road/utility crossing). Signed cover card per crossing. Results logged in DFR.
            If depth is short, this is a kick-back — backfill cannot proceed until depth is corrected.
          </li>
          <li>
            <strong>Conduit type and configuration:</strong> confirm the conduit type installed matches
            the plan (schedule 40 vs. schedule 80, number of innerducts, color coding). Wrong conduit
            type = kick-back.
          </li>
          <li>
            <strong>Bedding sand placement:</strong> confirm sand bed is placed before and above conduit
            per OCC 206-3 (or AHJ spec) before granular backfill is placed on top.
          </li>
          <li>
            <strong>Warning tape:</strong> confirm OCC 206-4 type tape placed 12 in above conduit
            in open trench before backfill covers it. Inspector photos the tape-in-trench as documentation.
          </li>
          <li>
            <strong>HDD bore log:</strong> verify bore diameter and depth log is being maintained by the
            driller. Confirm final bore path depth at entry/exit pits before duct pull.
          </li>
        </ul>

        <h3>Phase 2: Substantial Completion Walk</h3>
        <p>
          Once construction is physically complete, the inspector walks the full route with the contractor
          to document overall condition. This is the acceptance walk that generates the punch list:
        </p>

          <h4>The Five Checkpoint Categories</h4>
        <ol>
          <li>
            <strong>Buried depth verification:</strong> spot-check depth probes at any location that
            wasn't directly witnessed during construction. Any road crossing or utility parallel not
            already covered-carted gets probed.
          </li>
          <li>
            <strong>Slack coil verification:</strong> open every handhole. Verify slack loop lengths match
            the plan's MSA schedule (50 ft intermediate, 100 ft splice-point HH minimum). Coil IDs (labels
            identifying which cable and loop purpose) must be present and legible.
          </li>
          <li>
            <strong>Frame and cover elevation:</strong> every handhole and manhole frame-and-cover must
            be at finished grade — not proud (sticking up above the surface) and not recessed. A proud
            frame-and-cover is a traffic hazard and a permit violation; a recessed frame-and-cover collects
            water. Both are kick-back items if the surrounding surface is final.
          </li>
          <li>
            <strong>As-built redline review:</strong> inspector cross-references the contractor's DFR
            deviation log against the marked-up plan set. Every deviation must be captured, dimensioned,
            and tied to a station or landmark. Undocumented deviations = punch list item.
          </li>
          <li>
            <strong>Surface restoration:</strong> pavement match quality, absence of ghost trenches,
            sod survivability if applicable. Surface restoration items are typically punch list (cosmetic)
            unless a permit requires specific restoration standard within a defined time window.
          </li>
        </ol>

        <h3>Phase 3: Final Acceptance Sign-Off</h3>
        <p>
          After all punch list items are corrected, the inspector (and the engineer of record on RUS
          projects) sign the final acceptance documents. On RUS projects, this is RUS Form 219.
          The inspector's signature certifies:
        </p>
        <ul>
          <li>Work was constructed in conformance with the approved plans and specifications.</li>
          <li>Materials installed match the bill of materials in the project file.</li>
          <li>All permit conditions were met (burial depths, restoration, erosion control).</li>
          <li>The deviation log and as-built redlines are complete and accurate.</li>
          <li>All punch list items have been resolved.</li>
        </ul>
        <p>
          That signature is the inspector's professional attestation. Signing off on deficient work
          creates serious liability for the inspector and their employer.
        </p>

        <Quiz
          questions={quizQuestions}
          lessonId="T10.L11"
        />
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Book vs. Field: The Inspector's Boundary Problem</h2>

        <h3>The Textbook Standard</h3>
        <p>
          BICSI OSPDRM and RUS construction manuals describe the inspector as a "non-participating
          observer" during construction — present, watching, documenting, but not directing.
          The inspector's formal authority is reactive: they can reject work after it's done
          (punch list) or stop work that's in progress (kick-back). They cannot initiate construction
          decisions, select equipment methods, or instruct the crew on how to execute their work.
          The contractor is responsible for means and methods; the inspector is responsible for
          verifying outcomes.
        </p>

        <h3>Common Field Reality</h3>
        <p>
          In field practice, inspectors often get drawn into directing decisions — especially on
          fast-paced crews where the inspector is the most technically knowledgeable person present.
          The crew foreman asks "should we hand-dig or bore here?" and the inspector answers. That
          answer, if it leads to a damaged utility, makes the inspector's employer a party to the
          incident.
        </p>
        <p>
          Experienced OSP inspectors use a consistent redirect:
        </p>
        <blockquote>
          "I can tell you what the plan requires and what the permit says. I can tell you if what
          you've built meets spec. I can't tell you how to build it — that's your call as the
          contractor."
        </blockquote>
        <p>
          When the crew genuinely needs a design decision — an unforeseen obstacle, a utility
          conflict, a grade change — the correct escalation is to the engineer of record, not the
          inspector. The inspector can facilitate that call, but the answer should come from the
          designer, not the verifier.
        </p>

        <h3>The Kick-Back Judgment Call</h3>
        <p>
          The textbook says kick-back authority is clear: non-compliant work = stop and fix it.
          Field reality is that kick-back is the nuclear option — it stops all productivity,
          creates adversarial dynamics, and costs the contractor real money. Inspectors who use
          kick-back frivolously get blocked from future projects. Inspectors who never use it
          miss real deficiencies.
        </p>
        <p>The practical test experienced inspectors apply before invoking kick-back:</p>
        <ol>
          <li>
            <strong>Is it a safety issue?</strong> Short cover at a road crossing, missing warning
            tape before backfill, improper shoring in an open excavation — stop immediately,
            no negotiation.
          </li>
          <li>
            <strong>Is it a permit condition?</strong> Burial depth, conduit type, restoration
            timeline — all required by permit. Non-compliance with a permit condition cannot
            be resolved with a punch list item because the permit is still in effect and the
            AHJ can pull it.
          </li>
          <li>
            <strong>Can it be fixed without excavation?</strong> If the correction can be made
            without opening the ground again (slack loop length adjustment, coil ID labeling,
            documentation gap), it's punch list territory.
          </li>
          <li>
            <strong>Will backfill make it invisible and uncorrectable?</strong> If yes, it's a
            kick-back. Once that trench is closed and the road is paved, there is no cost-effective
            path to correct a short-depth installation.
          </li>
        </ol>

        <h3>Inspector Authority on RUS Projects</h3>
        <p>
          RUS-funded projects have a formal inspector designation (often the borrower's own
          qualified inspector or a third-party hired by the borrower). RUS Form 219 requires the
          inspector to certify construction quality. The RUS engineer reviewing the inspection
          report is looking for:
        </p>
        <ul>
          <li>Depth verification entries — was the work actually inspected, or is the 219 rubber-stamped?</li>
          <li>Materials verification — does the 219 match the bill of materials in the project file?</li>
          <li>Deviation entries — does the 219 reference deviations from the design plan and explain them?</li>
          <li>Punch list resolution — is there a signed punch list showing all items closed?</li>
        </ul>
        <p>
          A Form 219 that says "work meets plans and specs" with no deviation entries on a project
          where the DFRs show deviations is a red flag that raises audit scrutiny. Form 219 and
          the DFR package must tell the same story.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Field QA and the inspector interface are where the entire T10 construction sequence is
          verified or rejected. The inspector's depth probe check connects directly to T10.L04 —
          if burial depth is insufficient, the inspector has kick-back authority to require re-excavation
          before pavement restoration proceeds. The slack-loop check from T10.L06 is a specific
          acceptance-walk item: the inspector measures or counts the coil inside each handhole and
          records it against the contract MSA requirement; a structure with under-specified slack
          triggers a punch-list item that must be resolved before the RUS 1751F-635 final sign-off.
          The DFR and deviation log from T10.L10 are the documentary foundation for the inspector's
          acceptance walk — the inspector cross-references field deviations against the as-designed
          plans from T04 to verify that every change from design was authorized and documented, not
          silently executed. On RUS projects, the inspector's sign-off on RUS Form 219 (introduced
          in T01.L05) is the trigger for final RUS payment, which means the inspector's punch-list
          authority has direct financial consequence — a single unresolved item can withhold disbursement
          on the entire project.
        </p>
      </section>
    </LessonLayout>
  );
}
