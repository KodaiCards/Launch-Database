// Net-new — T09 Capstone Review integrating all T09 lessons
// D031: graded inline Quiz retired — the T09-final pool is the graded capstone gate now.
// T09.L12 — T09 Capstone Review: Permitting & Environmental

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L12',
  course_id: 'T09',
  title: 'T09 Capstone Review — Permitting & Environmental',
  order: 12,
  lesson_type: 'capstone-review',
  completesOnView: true,
  prerequisites: [
    'T09.L01', 'T09.L02', 'T09.L03', 'T09.L04',
    'T09.L05', 'T09.L06', 'T09.L07', 'T09.L08',
    'T09.L09', 'T09.L10', 'T09.L11',
  ],
  vocabulary_introduced: [],
  vocabulary_assumed: [
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L01' },
    { term: 'NEPA', source_lesson_id: 'T09.L02' },
    { term: 'categorical exclusion (CE)', source_lesson_id: 'T09.L02' },
    { term: 'EA', source_lesson_id: 'T09.L02' },
    { term: 'CE C-8', source_lesson_id: 'T09.L02' },
    { term: 'extraordinary circumstances', source_lesson_id: 'T09.L02' },
    { term: 'NHPA §106', source_lesson_id: 'T09.L03' },
    { term: 'SHPO', source_lesson_id: 'T09.L03' },
    { term: 'APE (Area of Potential Effect)', source_lesson_id: 'T09.L03' },
    { term: '30-day clock', source_lesson_id: 'T09.L03' },
    { term: 'ESA', source_lesson_id: 'T09.L04' },
        { term: 'NWP 57', source_lesson_id: 'T09.L05' },
        { term: 'Section 404 (CWA)', source_lesson_id: 'T09.L05' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L01' },
    { term: 'PE stamp', source_lesson_id: 'T09.L06' },
    { term: 'prescriptive easement', source_lesson_id: 'T09.L07' },
    { term: 'express easement', source_lesson_id: 'T09.L07' },
    { term: 'recording', source_lesson_id: 'T09.L07' },
    { term: 'franchise agreement', source_lesson_id: 'T09.L08' },
    { term: 'pavement cut moratorium', source_lesson_id: 'T09.L08' },
    { term: 'ROW restoration bond', source_lesson_id: 'T09.L08' },
    { term: 'THPO', source_lesson_id: 'T09.L09' },
    { term: 'NHO (Native Hawaiian Organization)', source_lesson_id: 'T09.L09' },
    { term: 'government-to-government consultation', source_lesson_id: 'T09.L09' },
    { term: 'permit matrix', source_lesson_id: 'T09.L10' },
    { term: 'permit critical path', source_lesson_id: 'T09.L10' },
    { term: 'permit-to-construction date lag', source_lesson_id: 'T09.L10' },
        { term: 'Environmental Impact Memorandum (EIM)', source_lesson_id: 'T09.L11' },
    { term: 'RUS CE checklist', source_lesson_id: 'T09.L11' },
  ],
  learning_objectives: [
    'Determine which environmental and cultural-resource reviews (NEPA, NHPA §106, ESA, state permits) apply to a given OSP project based on federal nexus and geography',
    'Apply the NEPA categorical-exclusion (CE) process to qualify a routine fiber build, or identify extraordinary circumstances that require an EA or EIS',
    'Coordinate NHPA §106 historic-properties review with state SHPOs and tribal THPOs to resolve conflicts and generate required documentation',
    'Complete endangered-species screening via IPaC and USACE wetlands review under NWP 57 to ensure project compliance',
    'Sequence permits across federal agencies (FCC, USACE, USFWS), state DOTs, local AHJs, and tribal governments to build a realistic permit-critical-path timeline',
  ],
  estimated_minutes: 30,
};

// Convert vocabulary_assumed to key_terms for Flashcard rendering
export const key_terms = [
  { term: 'federal nexus', definition: 'A trigger for federal environmental and cultural reviews: when a federal agency funds, permits, or authorizes a project, federal NEPA and NHPA §106 reviews apply; absent federal involvement, reviews are state/local only.' },
  { term: 'AHJ', definition: 'Authority Having Jurisdiction — the local city, county, or state agency with permitting and regulatory authority over the project area; varies by geography.' },
  { term: 'encroachment permit', definition: 'A local permit issued by an AHJ or utility owner for work affecting public ROW, utility infrastructure, or private land; required before construction can proceed in most jurisdictions.' },
  { term: 'NEPA', definition: 'National Environmental Policy Act — the federal law requiring environmental review and public disclosure of impacts for projects with federal funding, permits, or authorization.' },
  { term: 'categorical exclusion (CE)', definition: 'A NEPA category for routine, low-impact actions (e.g., routine fiber builds in existing ROW) that do not require a full Environmental Assessment; still requires documentation and verification that no "extraordinary circumstances" apply.' },
  { term: 'EA', definition: 'Environmental Assessment — a mid-level NEPA review documenting environmental impacts and proposing mitigation; required when categorical exclusion does not apply but an EIS is not needed.' },
  { term: 'CE C-8', definition: 'A NEPA categorical exclusion (CE) category covering telecommunications infrastructure installations in existing rights-of-way; commonly used for routine fiber builds.' },
  { term: 'extraordinary circumstances', definition: 'Conditions triggering a heightened level of NEPA review (EA or EIS instead of CE): endangered species habitat, historic properties, significant visual impact, etc.' },
  { term: 'NHPA §106', definition: 'Section 106 of the National Historic Preservation Act — a federal requirement to consider effects on historic properties and allow the Advisory Council on Historic Preservation and Tribal Historic Preservation Officers (THPOs) to review and comment.' },
  { term: 'SHPO', definition: 'State Historic Preservation Office — the state agency responsible for reviewing federal projects for impacts to historic properties and Native American cultural resources.' },
  { term: 'APE (Area of Potential Effect)', definition: 'The geographic area defined by the project applicant within which the project may have direct or indirect effects on historic properties; must be clearly defined to engage SHPOs and THPOs.' },
  { term: '30-day clock', definition: 'The NHPA §106 timeline: once SHPOs and THPOs receive notification of a Section 106 review, they have 30 days to comment; failure to respond waives their right to object.' },
  { term: 'ESA', definition: 'Endangered Species Act — the federal law protecting endangered and threatened species and their habitats; requires consultation with the U.S. Fish and Wildlife Service if the project may affect listed species.' },
  { term: 'IPaC', definition: 'Information, Planning, and Consultation system — a USFWS tool for screening projects against endangered species lists and generating required consultation letters.' },
  { term: 'NWP 57', definition: 'Nationwide Permit #57 (Telecommunications) issued by USACE to streamline permits for routine telecom projects in waters of the U.S., wetlands, and navigable waterways.' },
  { term: 'PCN', definition: 'Pre-Construction Notification — a USACE requirement to notify the Corps of Engineers (via "PCN") before beginning work under a Nationwide Permit; triggers a 15-day review window.' },
  { term: 'Section 404 (CWA)', definition: 'Section 404 of the Clean Water Act — a federal permit requirement for discharging dredged or fill material into waters of the U.S. and wetlands; Nationwide Permit 57 authorizes routine compliance.' },
  { term: 'encroachment permit (DOT)', definition: 'A state Department of Transportation permit required for work in or near state highways; includes requirements for sight-line clearance, traffic control, and restoration.' },
  { term: 'PE stamp', definition: 'Professional Engineer stamp/seal on design drawings and documents, required by state DOT for certain projects and often mandated before permits are issued.' },
  { term: 'prescriptive easement', definition: 'An easement acquired by years of open, uninterrupted use (typically 10–20 years depending on state) without owner permission; may apply to long-established utility corridors.' },
  { term: 'express easement', definition: 'An easement explicitly granted in writing by the property owner through a deed or agreement; the standard form for new utility ROW and attachments.' },
  { term: 'recording', definition: 'The process of filing (recording) a deed, easement, or other property document with the county recorder to create a permanent public record and bind future owners.' },
  { term: 'franchise agreement', definition: 'A municipal agreement granting a utility the right to operate infrastructure in city ROW; includes provisions for annual fees, maintenance, restoration, and liability.' },
  { term: 'pavement cut moratorium', definition: 'A municipal restriction (e.g., 2–5 years after street resurfacing) prohibiting utility cuts in newly paved roads; requires coordination with city capital budgets.' },
  { term: 'ROW restoration bond', definition: 'A financial guarantee posted with the city to ensure that utility work in public ROW (trenching, boring, pavement cuts) is properly restored; bond is released after inspection approval.' },
  { term: 'THPO', definition: 'Tribal Historic Preservation Officer — the tribal government\'s representative for historic preservation and cultural resource protection; consulted under NHPA §106 when tribal lands or interests are involved.' },
  { term: 'NHO (Native Hawaiian Organization)', definition: 'Native Hawaiian Organization — a Hawaiian community organization designated by the Office of Hawaiian Affairs to consult on historic properties in Hawaii under NHPA §106.' },
  { term: 'government-to-government consultation', definition: 'The formalized consultation process between federal agencies and federally recognized tribes on projects affecting tribal lands or cultural resources; required by NHPA §106 and the American Indian Religious Freedom Act Amendments.' },
  { term: 'permit matrix', definition: 'A table documenting all federal, state, and local permits required for the project, their approval agency, timeline, and dependencies; used to track critical path.' },
  { term: 'permit critical path', definition: 'The sequence of permits that determines the minimum possible project schedule; delays on the critical path delay the entire project.' },
  { term: 'permit-to-construction date lag', definition: 'The time between final permit issuance and the ability to begin construction; may include post-permit design refinement, ROW acquisition, and stakeholder notifications.' },
  { term: '7 CFR Part 1b (formerly 7 CFR Part 1970)', definition: 'USDA/RUS regulation covering environmental and cultural review procedures for RUS-funded programs (effective April 3, 2026, replacing the former 7 CFR Part 1970, now reserved); specifies when NEPA categorical exclusions and NHPA §106 reviews apply.' },
  { term: 'Environmental Impact Memorandum (EIM)', definition: 'An RUS document summarizing NEPA review results and confirming that a project qualifies for categorical exclusion or other compliance path under 7 CFR Part 1b (formerly 7 CFR Part 1970).' },
  { term: 'RUS CE checklist', definition: 'A mandatory RUS form for qualifying projects for categorical exclusion; documents that no extraordinary circumstances are present and all RUS environmental requirements are met.' },
];

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;

export default function T09L12_CapstoneQuiz() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>T09 Capstone Review — Permitting &amp; Environmental</h2>
        <p>
          This review spans all of T09.L01–L11 (and draws on the prerequisite topics T01 and
          T04). Work through the multi-permit scenario below — it integrates permitting
          decisions across the full topic the way a real project would. The graded T09
          capstone assessment — drawn from the full T09 pool — is the gate for the topic;
          this page is reading/review material, not a graded quiz.
        </p>

        <h3 className="mt-6 font-semibold text-lg">Key Terms Review</h3>
        <p className="mt-2 text-sm text-slate-400">
          Before working through the scenario below, use these flashcards to refresh your memory on core T09 permitting and environmental terminology.
        </p>
        <Flashcard
          deckId="T09-L12"
          cards={key_terms.map((kt, i) => ({
            id: `T09-L12-fc-${i}`,
            front: kt.term,
            back: kt.definition,
          }))}
        />
      </section>

      <BranchingScenario
        id="T09-CAP-BS1"
        title="Capstone Scenario: 12-Mile BEAD Aerial Route — Full Permit Stack"
        description="You're permitting a 12-mile BEAD aerial-fiber route. Segment A (8 miles): along existing state highway ROW. Segment B (4 miles): deviates into a rural corridor with a 1920s farmhouse in the APE, a seasonal stream crossing, and 0.25 miles of tree clearing in documented NLEB bat range. Walk through the permit identification, sequencing, and critical-path decision for this project."
        nodes={[
          {
            id: 'start',
            type: 'decision',
            text: "Day 0: Project kickoff. Identify every permit required for the full 12-mile route. How many distinct permit processes does this project trigger?",
            choices: [
              { label: "Two: a state DOT encroachment permit for Segment A and a private easement for Segment B", nextId: 'two-permits-wrong' },
              { label: "At least five: (1) State DOT encroachment permit (Segment A), (2) Section 106 SHPO consultation (both segments — BEAD = federal nexus), (3) ESA §7 / USFWS consultation for NLEB (Segment B tree clearing), (4) USACE NWP 57 PCN for the stream crossing (Segment B), (5) Private express easement for the Segment B corridor", nextId: 'five-permits-correct' },
            ],
          },
          {
            id: 'two-permits-wrong',
            type: 'outcome',
            text: "Incomplete. You've missed three critical permit processes: BEAD funding creates a federal nexus that triggers Section 106 for the 1920s farmhouse in the APE on Segment B. The NLEB tree clearing triggers ESA §7 / USFWS consultation. The seasonal stream crossing triggers USACE NWP 57 review. Missing any of these can result in a stop-work order after construction begins — the worst possible time to discover a permit gap.",
            variant: 'bad',
          },
          {
            id: 'five-permits-correct',
            type: 'decision',
            text: "Correct. Five permit processes, all required. Now sequence them: which do you submit first, and which runs the critical path? Review timelines to estimate: DOT encroachment = 90 days; Section 106 SHPO = 30-day clock (but package takes 15 days to prepare); ESA §7 USFWS informal consultation = 60 days typical; USACE NWP 57 PCN = 45 days; easement negotiation with private landowner = unknown (estimate 30–60 days). Which is the critical path?",
            choices: [
              { label: "Section 106 — the 1920s farmhouse in the APE is the biggest regulatory risk and longest timeline", nextId: 'wrong-106-critical' },
              { label: "State DOT encroachment permit — 90 days review starting Day 0, assuming PE-stamped drawings are ready at kickoff. All other permits are expected to complete before Day 90 if submitted promptly", nextId: 'correct-dot-critical' },
            ],
          },
          {
            id: 'wrong-106-critical',
            type: 'outcome',
            text: "Not quite. Section 106 with a 30-day clock starting at Day 15 completes at Day 45 — well before the DOT's 90-day review. Unless the SHPO issues an adverse-effect finding that triggers extended resolution (MOA/PA), Section 106 is not the critical path. The DOT permit (Day 90) is the critical path. However, you're correct that the farmhouse is the biggest regulatory risk — an adverse-effect finding could extend Section 106 to 90–150 days, potentially becoming the critical path. Flag it as a key risk item in the permit matrix.",
            variant: 'bad',
          },
          {
            id: 'correct-dot-critical',
            type: 'decision',
            text: "Correct. DOT at Day 90 is the critical path under baseline assumptions. Now: the Section 106 package comes back from the SHPO on Day 45 with a finding of 'adverse effect' — the 1920s farmhouse is in the APE and the route deviation approaches within 30 feet. What happens to the critical path?",
            choices: [
              { label: "Nothing — Section 106 is complete now that SHPO has responded. The adverse effect finding is just their opinion.", nextId: 'wrong-106-done' },
              { label: "Section 106 enters the resolution phase (MOA negotiation). Typical MOA negotiation takes 30–90 days. If it takes 60 days (completing Day 105), Section 106 replaces DOT as the critical path. Update the permit matrix immediately and assess mitigation options.", nextId: 'correct-moa-critical' },
            ],
          },
          {
            id: 'wrong-106-done',
            type: 'outcome',
            text: "Wrong. An adverse-effect finding is NOT the end of Section 106 — it's the beginning of the resolution phase. The lead agency, SHPO, and consulting parties must negotiate a Memorandum of Agreement (MOA) or Programmatic Agreement (PA) that documents how the adverse effect will be mitigated (rerouting the cable, archaeological monitoring during construction, documentation of the historic property). This process typically takes 30–90 days. Construction cannot begin until the MOA is executed.",
            variant: 'bad',
          },
          {
            id: 'correct-moa-critical',
            type: 'decision',
            text: "Good. You've correctly identified that Section 106 adverse effect resolution may become the new critical path. You update the permit matrix with a revised Section 106 completion estimate of Day 105 (optimistic MOA at 60 days). Now: the NLEB tree clearing (0.25 miles in Segment B). It's currently October 1. The ESA avoidance window runs April through October. Construction is scheduled to begin Day 97 (DOT baseline critical path). Can tree clearing proceed at Day 97?",
            choices: [
              { label: "Yes — Day 97 from October 1 kickoff is mid-January, outside the April–October avoidance window", nextId: 'correct-clearing-ok' },
              { label: "No — the avoidance window doesn't expire until the end of November, so Day 97 is still in the restricted period", nextId: 'wrong-clearing-restricted' },
            ],
          },
          {
            id: 'wrong-clearing-restricted',
            type: 'outcome',
            text: "Recalculate. Day 97 from an October 1 kickoff = October 1 + 97 days = approximately January 6. The NLEB avoidance window is April through October — so January 6 is outside the restricted window. Tree clearing can proceed at Day 97 (assuming permits are in hand). Verify the precise avoidance window against current USFWS guidance for NLEB at time of project execution.",
            variant: 'bad',
          },
          {
            id: 'correct-clearing-ok',
            type: 'outcome',
            text: "Correct. Day 97 from October 1 is approximately January 6 — outside the April–October avoidance window. Tree clearing can proceed. Final summary of your permit critical path management: (1) DOT encroachment permit = 90-day baseline critical path. (2) Section 106 adverse effect resolution = 105-day revised critical path if MOA takes 60 days. (3) NLEB tree clearing: timing is OK at Day 97 construction start from October 1 kickoff. (4) Most important single action to shorten the overall timeline: proactively engage the SHPO and farmhouse owner on a voluntary reroute or mitigation option before the adverse-effect finding becomes formal — avoiding the MOA phase entirely saves 30–90 days. Start that conversation the day the Section 106 package is submitted, not the day the adverse-effect finding arrives.",
            variant: 'good',
          },
        ]}
      />

    </LessonLayout>
  );
}
