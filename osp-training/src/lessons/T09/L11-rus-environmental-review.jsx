// T09.L11 — RUS Environmental Review
// Advanced lesson: 7 CFR Part 1b (formerly Part 1970) RUS NEPA; CE checklist; EIM vs. full report; BEAD vs. RUS procedures
// Sources: net-new; 7 CFR Part 1b (effective April 3, 2026, FR 2026-06537, replaces 7 CFR Part 1970); RUS Form 307; NTIA BEAD NEPA
// Note: CE C-8 is NTIA's BEAD categorical exclusion; RUS uses its own CE under 7 CFR Part 1b — see body text

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L11',
  course_id: 'T09',
  title: 'RUS Environmental Review',
  order: 11,
  lesson_type: 'advanced',
  prerequisites: ['T09.L02', 'T09.L01'],
  learning_objectives: [
    'Explain the difference between RUS/USDA 7 CFR Part 1b NEPA procedures and NTIA/BEAD NEPA procedures',
    'Complete a RUS CE determination checklist for a sample aerial-fiber project',
    'Identify which circumstances trigger an Environmental Impact Memorandum (EIM) rather than a CE checklist',
    'Describe what the RUS construction closeout certification documents and when it is required',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'RUS environmental report',
    'RUS CE checklist',
    'BEAD environmental compliance milestone',
    '7 CFR Part 1b',
    'Environmental Impact Memorandum (EIM)',
  ],
  vocabulary_assumed: [
    { term: 'NEPA', source_lesson_id: 'T09.L02' },
    { term: 'categorical exclusion (CE)', source_lesson_id: 'T09.L02' },
    { term: 'EA', source_lesson_id: 'T09.L02' },
    { term: 'FONSI', source_lesson_id: 'T09.L02' },
    { term: 'extraordinary circumstances', source_lesson_id: 'T09.L02' },
    { term: 'CE C-8', source_lesson_id: 'T09.L02' },
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
  ],
  key_terms: [
    {
      term: 'RUS environmental report',
      definition:
        'A formal environmental review document required by the Rural Utilities Service (RUS) for telecommunications infrastructure projects receiving RUS loans or grants. The type of RUS environmental report required (CE checklist, EIM, or full environmental report) depends on the nature and scale of the project and the presence of extraordinary circumstances.',
    },
    {
      term: 'RUS CE checklist',
      definition:
        'A structured form used to document whether a proposed RUS-financed project qualifies for a categorical exclusion under 7 CFR Part 1b (effective April 3, 2026) — specifically, whether the project falls within a defined CE class and has no extraordinary circumstances requiring elevated review. The checklist is completed by the applicant (the RUS borrower) and reviewed by RUS prior to loan or grant approval.',
    },
    {
      term: 'BEAD environmental compliance milestone',
      definition:
        'A project milestone in a BEAD subgrant agreement requiring the subgrantee to demonstrate completion of the required environmental review (CE determination, EA with FONSI, or full EIS) before NTIA or the state broadband office will authorize construction. Failure to clear the environmental compliance milestone blocks construction authorization regardless of other permit status.',
    },
    {
      term: '7 CFR Part 1b',
      definition:
        'Title 7, Code of Federal Regulations, Part 1b — the USDA/RUS Environmental Policies and Procedures regulation, effective April 3, 2026 (FR 2026-06537). Part 1b replaced 7 CFR Part 1970 (which itself replaced 7 CFR Part 1794) and governs how RUS and USDA Rural Development implement NEPA for all financed projects, including telecommunications, electric, and water/waste programs. It defines categorical exclusions and extraordinary circumstances for RUS project review. Verify current section numbers and CE class designations against eCFR at time of application.',
    },
    {
      term: 'Environmental Impact Memorandum (EIM)',
      definition:
        'An intermediate-level environmental review document under 7 CFR Part 1b (formerly 7 CFR Part 1970), used when a project does not qualify for a CE but the anticipated environmental impacts are limited enough that a full Environmental Assessment (EA) may not be necessary. An EIM documents the environmental effects of the proposed project and any mitigation measures, and is reviewed by RUS before loan or grant approval.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L11_RusEnvironmentalReview() {
  return (
    <LessonLayout meta={meta}>

      <section data-tier="foundations">
        <h2>RUS Environmental Review</h2>
        <p>
          If your fiber project is financed through the USDA Rural Utilities Service (RUS) —
          via a RUS loan, a ReConnect grant, or a similar USDA rural broadband program — you
          have an additional layer of environmental review on top of the general NEPA framework
          you learned in the NEPA lesson. This is the RUS-specific implementation of NEPA, codified in
          7 CFR Part 1b (effective April 3, 2026; this regulation replaced the prior 7 CFR Part
          1970 — verify current section numbers against eCFR at time of application).
        </p>
        <p className="mt-2">
          The good news: for most routine aerial or buried fiber construction in existing ROW,
          the RUS process leads to the same outcome as the general NEPA CE — no EA or EIS
          required. The RUS CE checklist is the form that documents that determination.
          The less-good news: if your project has any extraordinary circumstances, the RUS
          process adds its own review steps and its own timelines on top of the general process.
        </p>
        <p className="mt-2">
          This lesson also addresses the question that comes up constantly on BEAD projects:
          "Do RUS NEPA procedures and NTIA/BEAD NEPA procedures use the same CE categories?"
          Short answer: yes, mostly. The detail matters — it's in the section below.
        </p>
      </section>

      {/* FLASHCARDS */}
      <section data-tier="foundations">
        <h3>Key Terms — Flashcards</h3>
        <Flashcard
          deckId="T09-L11"
          cards={[
            {
              id: 'T09-L11-fc-rus-env-report',
              front: 'What is a RUS environmental report and what determines which type is required?',
              back: 'A formal environmental review document required by the Rural Utilities Service (RUS) for telecommunications infrastructure projects receiving RUS loans or grants. The type required (CE checklist, EIM, or full environmental report) depends on the nature and scale of the project and the presence of extraordinary circumstances.',
            },
            {
              id: 'T09-L11-fc-rus-ce-checklist',
              front: 'What is the RUS CE checklist and who prepares it?',
              back: 'A structured form used to document whether a proposed RUS-financed project qualifies for a categorical exclusion under 7 CFR Part 1b (effective April 3, 2026) — whether the project falls within a defined CE class and has no extraordinary circumstances requiring elevated review. The checklist is completed by the applicant (the RUS borrower) and reviewed by RUS prior to loan or grant approval.',
            },
            {
              id: 'T09-L11-fc-bead-milestone',
              front: 'What is the BEAD environmental compliance milestone?',
              back: 'A project milestone in a BEAD subgrant agreement requiring the subgrantee to demonstrate completion of the required environmental review (CE determination, EA with FONSI, or full EIS) before NTIA or the state broadband office will authorize construction. Failure to clear this milestone blocks construction authorization regardless of other permit status.',
            },
            {
              id: 'T09-L11-fc-part-1b',
              front: 'What is 7 CFR Part 1b?',
              back: '7 CFR Part 1b — the USDA/RUS Environmental Policies and Procedures regulation, effective April 3, 2026 (FR 2026-06537). Part 1b replaced 7 CFR Part 1970 and governs how RUS and USDA Rural Development implement NEPA for all financed projects, including telecommunications, electric, and water/waste programs. It defines categorical exclusions and extraordinary circumstances for RUS project review.',
            },
            {
              id: 'T09-L11-fc-eim',
              front: 'What is an Environmental Impact Memorandum (EIM) and when is it used?',
              back: 'An intermediate-level environmental review document under 7 CFR Part 1b (formerly 7 CFR Part 1970), used when a project does not qualify for a CE but the anticipated environmental impacts are limited enough that a full EA may not be necessary. An EIM documents the environmental effects and any mitigation measures, and is reviewed by RUS before loan or grant approval.',
            },
          ]}
        />
      </section>

      <section data-tier="working">
        <h3>7 CFR Part 1b — The RUS NEPA Rule in Plain English</h3>
        <p>
          7 CFR Part 1b is the regulation that tells the Rural Utilities Service how to
          implement the National Environmental Policy Act (NEPA) for projects it finances.
          Think of it as USDA's version of the CEQ rules — same underlying law, same three
          tiers (CE, EA/FONSI, EIS), but with USDA-specific categorical exclusion categories
          and extraordinary-circumstances lists.
        </p>
        <p className="mt-2">
          <strong>Regulatory history note:</strong> This rule was previously codified at
          7 CFR Part 1970 (effective March 2, 2016) and before that at 7 CFR Part 1794.
          The current citation is 7 CFR Part 1b (effective April 3, 2026, FR 2026-06537).
          Older project files and RUS guidance documents may still reference Part 1970 section
          numbers — verify against current eCFR at time of application.
        </p>

        <h3 className="mt-6">The Three RUS Review Tiers</h3>

        <h4 className="mt-4 font-semibold">Tier 1: Categorical Exclusion (CE) — The Normal Path</h4>
        <p>
          A categorical exclusion is the determination that a class of actions does not normally
          cause significant environmental effects and therefore does not require an EA or EIS.
          Under 7 CFR Part 1b, RUS has defined specific classes of CEs for telecommunications projects.
        </p>
        <p className="mt-2">
          For aerial or buried telecommunications fiber in existing ROW — the standard BEAD/RUS
          aerial project — the applicable CE is in the "construction within existing ROW" class
          under 7 CFR Part 1b. The key requirement: the project must not trigger any extraordinary
          circumstances listed in the regulation (verify current section references against eCFR).
        </p>
        <p className="mt-2">
          Extraordinary circumstances under 7 CFR Part 1b include (among others):
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Threatened or endangered species or critical habitat present in the project area (triggers ESA §7 consultation)</li>
          <li>Historic properties within the Area of Potential Effect (triggers Section 106 consultation)</li>
          <li>Wetlands or floodplains within the project footprint (triggers USACE Section 404 / NWP 57 review)</li>
          <li>Prime farmland or farmland of statewide importance within the project corridor</li>
          <li>Coastal zones, wilderness areas, or wild and scenic rivers affected</li>
          <li>Environmental justice concerns — disproportionate impacts on low-income or minority communities</li>
          <li>Controversial or highly uncertain environmental effects</li>
        </ul>
        <p className="mt-2">
          If any extraordinary circumstance applies, the project cannot proceed on a CE alone —
          it moves to either an EIM or a full EA.
        </p>

        <h4 className="mt-6 font-semibold">Tier 1.5: Environmental Impact Memorandum (EIM) — The Middle Tier</h4>
        <p>
          The EIM is a USDA-specific intermediate document that doesn't have a direct equivalent
          in the CEQ rules. It's used when a project triggers one or more extraordinary
          circumstances but the anticipated impacts appear limited enough that a full
          Environmental Assessment may be unnecessary.
        </p>
        <p className="mt-2">
          <strong>When does an EIM apply vs. a CE checklist?</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>CE checklist applies when:</strong> The project falls within a RUS CE class
            AND no extraordinary circumstances from 7 CFR Part 1b apply. CE checklist documents
            this determination. RUS reviews and approves. No additional environmental study required.
          </li>
          <li>
            <strong>EIM applies when:</strong> The project triggers one or more extraordinary
            circumstances, but the applicant can document through limited analysis (agency
            consultations, existing databases, field observation) that the actual impact is not
            significant. Examples: a route crosses prime farmland but follows an existing buried
            conduit corridor — the EIM documents that minimal new farmland disturbance results.
            Or the route is adjacent to a listed bat species' documented range but is entirely
            within existing cleared ROW where the species doesn't forage — the EIM documents
            the species limitation and the IPaC screen results.
          </li>
          <li>
            <strong>Full EA applies when:</strong> Extraordinary circumstances are present AND
            the EIM analysis cannot demonstrate limited impact. The EA evaluates alternatives
            and produces either a FONSI (Finding of No Significant Impact — no EIS required)
            or a determination that an EIS is needed.
          </li>
        </ul>

        <h4 className="mt-6 font-semibold">Tier 3: Full Environmental Assessment (EA) / EIS</h4>
        <p>
          Same as the general NEPA process — the RUS 7 CFR Part 1b procedure for EA and EIS
          follows CEQ rules with USDA-specific agency coordination requirements. For a routine
          aerial fiber project, reaching this tier is uncommon. Projects that require a full
          EA are typically those with significant route deviations from existing ROW, wetland
          fill above NWP thresholds, or documented impacts on T&amp;E species critical habitat.
        </p>

        <h3 className="mt-6">The Construction Closeout Certification</h3>
        <p>
          At the end of a RUS-financed project, the borrower files a construction closeout
          certification — documentation that the project was built in accordance with the
          approved loan/grant conditions, including the environmental review findings.
        </p>
        <p className="mt-2">
          The closeout certification is not an environmental review document itself — it's an
          attestation that the project was built as approved. But it is where the environmental
          conditions from the CE, EIM, or EA (the tree-clearing avoidance window, the bore
          required at a wetland crossing under the NWP 57 conditions) get confirmed as actually
          satisfied during construction. This is the moment mitigation commitments made on paper
          during the review become binding on the field crew: if a condition was not met, that
          has to be disclosed at closeout rather than quietly ignored. The lesson for the field
          is simple — the promises made to win the environmental clearance are the promises the
          crew has to keep on the ground.
        </p>

        <h3 className="mt-6">RUS NEPA vs. NTIA/BEAD NEPA — Are They the Same CE?</h3>
        <p>
          This question comes up constantly when a project has both RUS and BEAD funding, or
          when a project team has done BEAD NEPA work and wants to know if RUS accepts it.
        </p>
        <p className="mt-2">
          <strong>Important clarification — RUS and NTIA use different CE frameworks:</strong>{' '}
          RUS runs its categorical exclusions under the USDA NEPA rules (7 CFR Part 1b). NTIA
          established its own NEPA procedures for BEAD in 2024 — a separate set of categorical
          exclusions with its own numbering, not RUS's. Because the two agencies use different
          CE frameworks, a categorical-exclusion designation that applies to a RUS-financed
          project does not automatically carry over to a BEAD determination, even when both cover
          the same kind of work.
        </p>
        <p className="mt-2">
          <strong>The practical answer:</strong> Both RUS (7 CFR Part 1b) and NTIA/BEAD cover
          the same general category — aerial or buried utility and communications construction
          within or adjacent to existing rights-of-way. But they use different CE designations
          and different procedural frameworks. Do not assume a RUS categorical-exclusion
          designation applies to a BEAD project just because it applies to the RUS-financed one.
        </p>
        <p className="mt-2">
          <strong>Procedural differences:</strong>
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>RUS:</strong> The RUS borrower (the fiber company or electric cooperative)
            prepares the CE checklist and submits it to RUS for review and approval as part
            of the loan/grant application. RUS makes the formal NEPA determination using
            7 CFR Part 1b CE classes.
          </li>
          <li>
            <strong>BEAD/NTIA:</strong> The state broadband office is the lead federal agency
            for BEAD NEPA. The subgrantee prepares the required environmental documentation,
            but the state broadband office makes the NEPA determination (or delegates to NTIA).
            NTIA uses its own BEAD categorical exclusions — not RUS CE numbering. The process and
            forms differ by state broadband office.
          </li>
          <li>
            <strong>Dual-funded projects:</strong> If a project receives both RUS financing
            and BEAD funding, both agencies must independently make their NEPA determinations
            under their respective CE frameworks. In practice, agencies often cooperate to
            avoid duplicating the same environmental review — but the formal determinations
            are separate. Coordinate early with both agencies to establish whether a joint
            environmental review is acceptable.
          </li>
        </ul>

        <h3 className="mt-6">The RUS CE Checklist in Practice</h3>
        <p>
          The CE checklist for a typical RUS-financed aerial-fiber project follows these steps:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>
            <strong>Identify the applicable CE class.</strong> Review 7 CFR Part 1b to
            identify which CE class covers the proposed project action. For aerial fiber
            in existing ROW, the applicable class is in the "construction within existing ROW"
            category — cite the specific class designation from the current regulation (confirm
            section number against current eCFR at time of application; Part 1b section numbers
            may differ from the prior Part 1970 Exhibit B structure).
          </li>
          <li>
            <strong>Screen for extraordinary circumstances.</strong> Go through every item in
            7 CFR Part 1b systematically (verify current section reference against eCFR). For each item: document whether it applies, and if
            it applies, what the impact is. This is where your prior environmental work pays off:
            IPaC results (from the ESA lesson), SHPO pre-consultation (from the Section 106 lesson),
            and route survey documentation (from the Route Survey topic) all feed into this screening.
          </li>
          <li>
            <strong>Document the agency consultations completed.</strong> Even for a CE,
            RUS expects to see that you've engaged the relevant agencies: IPaC run for ESA,
            SHPO pre-consultation letter for Section 106, 811 notification for underground
            utilities. These don't require formal consultation results — just evidence that
            you screened and found no extraordinary circumstances.
          </li>
          <li>
            <strong>Prepare the checklist form.</strong> The RUS CE checklist is a structured
            form (format varies by RUS program and may be updated — request the current version
            from your RUS state director's office). Complete every section; leave nothing blank.
          </li>
          <li>
            <strong>Submit with the loan/grant application.</strong> The CE checklist is part
            of the RUS application package. RUS reviews it and issues a formal CE determination
            (or requests additional information if any extraordinary circumstances need
            clarification).
          </li>
        </ol>

        <h3 className="mt-6">Book vs. Field: The CE Is Not Automatic</h3>
        <p>
          <strong>Book:</strong> 7 CFR Part 1b defines CEs for classes of actions that normally
          do not cause significant environmental effects. Aerial fiber in existing ROW qualifies.
          File the checklist and proceed.
        </p>
        <p className="mt-2">
          <strong>Field:</strong> Many BEAD subgrantees treat the CE as a checkbox — "we're in
          existing ROW, we automatically qualify." This is wrong in at least two ways:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong>Extraordinary circumstances are not rare.</strong> ESA screening alone —
            even for a project entirely within existing highway ROW — can reveal a listed bat
            species with a documented foraging range that includes the corridor. CE doesn't
            automatically apply to the route just because it's in existing ROW; it applies
            only if no extraordinary circumstances are present after a proper screen.
          </li>
          <li>
            <strong>RUS can and does return incomplete checklists.</strong> A CE checklist
            that says "no extraordinary circumstances apply" without documenting the screen
            (IPaC outputs, SHPO pre-consultation, wetland mapping results) is not acceptable
            to most RUS state directors. The return-and-resubmit cycle adds weeks to the
            loan/grant processing timeline — which is on the critical path for BEAD project
            milestones.
          </li>
        </ul>
        <p className="mt-2">
          <strong>The correct approach:</strong> Treat the CE checklist as documentation of
          a real screen, not a formality. Do the IPaC run. Send the SHPO pre-consultation
          letter. Check wetland mapping. Document each finding. If everything screens clean,
          the checklist is straightforward to complete — and complete documentation is what
          makes RUS approve it quickly.
        </p>
      </section>

      <ReferencesBlock
        items={[
          { citation: '7 CFR Part 1b', note: 'The USDA department-wide NEPA regulation (final rule effective April 3, 2026, FR 2026-06537) that replaced the RUS-specific 7 CFR Part 1970 — the rulebook RUS now uses to decide whether a financed project gets a CE, an EIM, or a full EA. Confirm current section numbers on eCFR.' },
          { citation: '42 USC §4321 et seq.', note: 'NEPA itself — the underlying law that 7 CFR Part 1b implements for RUS-financed projects.' },
          { citation: '16 USC §1536', note: 'ESA Section 7 — the consultation triggered when a listed species (e.g. the northern long-eared bat) is an extraordinary circumstance in a RUS review.' },
          { citation: '87 FR 73488 (Nov. 30, 2022); 88 FR 5528', note: 'Northern long-eared bat reclassification from threatened to endangered (listing rule; effective date delayed to March 31, 2023) — the example extraordinary-circumstance in this lesson. Confirm current status at fws.gov/species.' },
          { citation: '54 USC §306108', note: 'Section 106 of the NHPA — the historic-properties review that is another extraordinary circumstance under 7 CFR Part 1b.' },
          { citation: '33 USC §1344; USACE Nationwide Permit 57', note: 'CWA Section 404 and the telecommunications nationwide permit — the wetland/waterway extraordinary circumstance.' },
          { citation: 'NTIA BEAD NEPA procedures (2024)', note: 'NTIA’s own categorical exclusions for BEAD (established 2024, effective April 2, 2024) — a separate CE framework from RUS’s, which is why a RUS CE designation does not automatically carry to a BEAD determination.' },
        ]}
      />

      {/* QUIZ */}
      <GatedAssessment
        courseId="T09"
        assessmentId="T09-L11"
        title="Practice Quiz — RUS Environmental Review"
        fallback={
        <Quiz
          title="Practice Quiz — RUS Environmental Review"
          mode="multiple-choice"
          questions={[
            {
              id: 'T09-L11-Q01',
              type: 'mc',
              prompt:
                'A RUS-financed aerial-fiber project follows an existing highway ROW for 15 miles. An IPaC screen reveals a documented population of Northern Long-Eared Bat (NLEB) within the route corridor. The proposed construction includes 2 miles of tree clearing on a forested segment adjacent to the ROW. What is the most likely outcome for the RUS environmental review?',
              choices: [
                'The CE automatically applies because the project is in existing ROW — bat species presence in the corridor doesn\'t affect the CE determination',
                'An extraordinary circumstance (T&E species) is triggered — the CE checklist cannot be completed without either an EIM documenting limited impact or a formal ESA §7 consultation with USFWS. The CE may still apply after the ESA screen resolves, but it is not automatic at this point',
                'The project requires a full Environmental Impact Statement (EIS) because NLEB was present',
                'The CE is cancelled entirely; the project must convert to an EA before any construction can begin',
              ],
              answerIndex: 1,
              explanation:
                'NLEB presence triggers an extraordinary circumstance under 7 CFR Part 1b (T&E species). The CE is not automatic when an extraordinary circumstance is present. The applicant must either: (a) complete an EIM documenting that the impact is limited (e.g., construction avoids the tree-clearing window, IPaC shows the route corridor is not critical habitat), or (b) complete ESA §7 informal consultation. If the consultation results in a no-jeopardy finding with standard conditions (tree-clearing avoidance window), the CE may still apply after the consultation. Note: confirm current NLEB listing status at fws.gov/species at time of project — species status is dynamic.',
            },
            {
              id: 'T09-L11-Q02',
              type: 'mc',
              prompt:
                'What is the key difference between the Environmental Impact Memorandum (EIM) and a full Environmental Assessment (EA) in the 7 CFR Part 1b framework?',
              choices: [
                'They are the same document with different names — the EIM is just an older term for EA',
                'An EIM is used when extraordinary circumstances are triggered but limited analysis can document that the actual impact is not significant — it\'s an intermediate tier between the CE checklist and a full EA. A full EA is required when the EIM analysis cannot demonstrate limited impact',
                'An EA is required only for projects over 50 miles in length; an EIM applies to shorter projects',
                'An EIM is prepared by the RUS agency; an EA is prepared by the project applicant',
              ],
              answerIndex: 1,
              explanation:
                'The EIM is a USDA-specific intermediate review tier — not found in the CEQ rules as a separate document type. It\'s used when an extraordinary circumstance applies but the applicant can demonstrate through limited analysis (IPaC consultation, agency communication, field observation) that the impact is not significant. A full EA is needed when that demonstration cannot be made. The EIM saves the applicant from a full EA process when the extraordinary circumstance is real but the impact is clearly limited.',
            },
            {
              id: 'T09-L11-Q03',
              type: 'mc',
              prompt:
                'A project is funded by both RUS (ReConnect grant) and BEAD (NTIA/state broadband office). Both programs cover the same kind of work (existing-ROW aerial fiber). Does this mean the project only needs ONE NEPA determination?',
              choices: [
                'Yes — if both programs cover the same kind of work, one CE determination applies to both',
                'No — RUS and NTIA/state broadband office are separate federal agencies; both must independently make their NEPA determinations, though they may cooperate on a joint environmental review to avoid duplicating the analysis',
                'No — BEAD NEPA is a state process, not a federal process, so it doesn\'t count as NEPA',
                'Yes — once the state broadband office approves the CE, RUS automatically accepts it under an MOU between USDA and NTIA',
              ],
              answerIndex: 1,
              explanation:
                'RUS (USDA) and NTIA/state broadband offices are separate federal agencies. Both must make independent NEPA determinations — they cannot simply adopt each other\'s determination without formal interagency coordination. However, they CAN cooperate on a joint environmental review that satisfies both agencies\' requirements in a single document. Coordinate with both agencies early in the project — ask explicitly whether a joint review is possible — to avoid duplicating the same analysis twice.',
            },
            {
              id: 'T09-L11-Q04',
              type: 'mc',
              prompt:
                'RUS requires a construction closeout certification at the end of a financed project. At what point in the project lifecycle is it filed, and what does it document regarding environmental review?',
              choices: [
                'Filed before construction begins — it documents the NEPA determination and authorizes construction',
                'Filed after construction is complete — it attests that construction was completed in accordance with approved conditions, including that all environmental mitigation commitments (tree-clearing avoidance windows, bore requirements at wetland crossings, etc.) were satisfied',
                'Filed annually during the project\'s operating life — it documents ongoing environmental compliance',
                'Filed only when an EIM or EA was required — CE projects have no closeout certification',
              ],
              answerIndex: 1,
              explanation:
                'The RUS construction closeout certification is filed after the project is built. It attests that the project was constructed according to the approved plans and that all environmental conditions were met. If the CE or EIM required a tree-clearing avoidance window (April–October for NLEB), the closeout confirms that clearing occurred outside that window. If the wetland crossing required a bore per the NWP 57 conditions, the closeout confirms bore was used. Environmental commitments made during the review process become enforceable through the closeout.',
            },
          ]}
          onComplete={(result) => {
            console.info('T09 L11 Quiz complete:', result);
          }}
        />
        }
      />

    </LessonLayout>
  );
}
