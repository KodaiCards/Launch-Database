// T09.L04 — ESA, Bats, and IPaC
// Working lesson: ESA Section 7 consultation, bat species triggers, IPaC DKey tool, tree-clearing windows
// Source: M03 §3.4 (ESA, bats, IPaC)
// Authority: 16 USC §1536 (ESA §7); USFWS IPaC tool (ipac.ecosphere.fws.gov)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L04',
  course_id: 'T09',
  title: 'ESA, Bats, and IPaC',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T09.L01', 'T09.L02'],
  learning_objectives: [
    'Use IPaC outputs to determine whether a project footprint triggers a bat species consultation',
    'Identify the standard tree-clearing avoidance window mitigation for bat species',
    'Distinguish between informal and formal Section 7 consultation under the ESA',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'ESA',
    'T&E species',
    'threatened',
    'endangered',
    'IPaC DKey',
    'Section 7 consultation',
    'biological assessment',
    'tree-clearing window',
  ],
  key_terms: [
    {
      term: 'ESA',
      definition:
        'Endangered Species Act — the 1973 federal law (16 USC §§1531–1544) that prohibits "take" of federally listed threatened or endangered species and requires federal agencies to consult with the USFWS (for terrestrial and freshwater species) or NOAA Fisheries (for marine and anadromous species) when their actions may affect listed species. For fiber projects with a federal nexus, ESA Section 7 consultation is required whenever the project footprint overlaps with listed species or designated critical habitat.',
    },
    {
      term: 'T&E species',
      definition:
        'Threatened and Endangered species — the two categories of federal protection under the ESA. "Threatened" means likely to become endangered in the foreseeable future throughout all or a significant portion of its range. "Endangered" means in danger of extinction throughout all or a significant portion of its range. Both categories trigger Section 7 consultation for federal actions. [Species listing status is dynamic — always verify at fws.gov/species at time of project.]',
    },
    {
      term: 'threatened',
      definition:
        'A species that is likely to become endangered in the foreseeable future throughout all or a significant portion of its range. Threatened status triggers Section 7 consultation obligations for federal actions in the species\' range, but "take" rules may vary from those for Endangered species. For bats, both Threatened and Endangered listings require ESA analysis during fiber permitting.',
    },
    {
      term: 'endangered',
      definition:
        'A species that is in danger of extinction throughout all or a significant portion of its range. Endangered status triggers the full Section 7 consultation and "take" prohibition under the ESA (16 USC §1538). For fiber permitting, the Northern Long-Eared Bat (NLEB) was reclassified from Threatened to Endangered effective February 2023 (88 FR 6358). [Confirm current listing status at fws.gov/species at time of project.]',
    },
    {
      term: 'IPaC DKey',
      definition:
        'Information for Planning and Consultation — Decision Key tool, available at ipac.ecosphere.fws.gov. A free USFWS web tool that allows project applicants to define a project footprint and receive a report of federally listed species and designated critical habitat potentially present in the area. The IPaC DKey also provides activity-specific guidance (e.g., tree-clearing, aerial construction) and avoidance recommendations. Running IPaC is the standard first step in ESA screening for fiber projects.',
    },
    {
      term: 'Section 7 consultation',
      definition:
        'The formal process under ESA Section 7 (16 USC §1536) in which the federal action agency consults with the USFWS (or NOAA Fisheries) to determine whether a federal action may adversely affect a listed species or critical habitat. Informal consultation (can result in a "not likely to adversely affect" finding in a concurrence letter) is sufficient for most fiber projects with proper mitigation. Formal consultation (results in a Biological Opinion) is required when there may be adverse effects that cannot be avoided through standard measures.',
    },
    {
      term: 'biological assessment',
      definition:
        'A document prepared by the project applicant for formal ESA Section 7 consultation, evaluating the likely effects of the project on listed species and critical habitat. Required for major federal actions that may affect listed species. For most fiber projects, informal consultation and a brief effects analysis suffice — a full biological assessment is the threshold step for formal consultation.',
    },
    {
      term: 'tree-clearing window',
      definition:
        'The time period during which tree clearing is prohibited or restricted to protect bat species from disturbance during their most sensitive life stages. For the Northern Long-Eared Bat (NLEB) and Tricolored Bat, the standard avoidance window for tree clearing runs from approximately April 1 through October 31 (the active roosting and pup-rearing season). Tree clearing outside this window (November through March) is generally acceptable under standard avoidance measures. [Confirm current IPaC guidance for your specific species and project location — windows can vary by geography and species.]',
    },
  ],
  vocabulary_assumed: [
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
    { term: 'BEAD', source_lesson_id: 'T09.L01' },
    { term: 'extraordinary circumstances', source_lesson_id: 'T09.L02' },
    { term: 'CE C-8', source_lesson_id: 'T09.L02' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'vegetation observation', source_lesson_id: 'T04.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L04_ESABatsIPaC() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The <strong>Endangered Species Act (ESA)</strong> is the federal law that
          protects plants and animals at risk of extinction. For fiber projects with a
          federal nexus, it means: if a species on the federal protected list lives in
          or passes through your project area, you need to check whether your project
          might harm it — and if so, coordinate with the U.S. Fish and Wildlife Service
          (USFWS) before construction starts.
        </p>
        <p className="mt-2">
          In rural OSP fiber deployment, the most frequently encountered ESA issue is
          <strong> bat species</strong> — specifically species that roost in trees along
          utility corridors and are sensitive to tree clearing. The Northern Long-Eared Bat
          (NLEB) and Tricolored Bat are both under active federal protection and commonly
          occur in eastern, southern, and midwestern states.
        </p>
        <p className="mt-2">
          The good news: most fiber projects can clear the ESA check quickly with the right
          tool. The tool is called <strong>IPaC</strong> — the USFWS Information for Planning
          and Consultation system. You draw your project footprint on a map, the tool tells
          you what species are potentially in the area, and you get activity-specific
          guidance on what (if anything) you need to do.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ESA</td>
              <td className="px-3 py-2">Endangered Species Act</td>
              <td className="px-3 py-2">Federal law protecting T&E species; Section 7 requires consultation for federal actions</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">USFWS</td>
              <td className="px-3 py-2">U.S. Fish and Wildlife Service</td>
              <td className="px-3 py-2">The federal agency that administers ESA for terrestrial and freshwater species</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IPaC</td>
              <td className="px-3 py-2">Information for Planning and Consultation</td>
              <td className="px-3 py-2">Free USFWS web tool at ipac.ecosphere.fws.gov — screen for T&E species in your footprint</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NLEB</td>
              <td className="px-3 py-2">Northern Long-Eared Bat (Myotis septentrionalis)</td>
              <td className="px-3 py-2">Endangered bat species common in eastern/midwestern US; sensitive to tree clearing April–October</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">T&E</td>
              <td className="px-3 py-2">Threatened and Endangered</td>
              <td className="px-3 py-2">The two federal protection categories under the ESA</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T09-L04"
          cards={[
            {
              id: 'T09-L04-fc-esa',
              front: 'What is the ESA and when does it apply to a fiber project?',
              back: 'Endangered Species Act — the 1973 federal law (16 USC §§1531–1544) that prohibits "take" of federally listed threatened or endangered species and requires federal agencies to consult with the USFWS when their actions may affect listed species. For fiber projects with a federal nexus, ESA Section 7 consultation is required whenever the project footprint overlaps with listed species or designated critical habitat.',
            },
            {
              id: 'T09-L04-fc-te',
              front: 'What is the difference between Threatened and Endangered species?',
              back: 'T&E species — the two categories of federal protection under the ESA. "Threatened" means likely to become endangered in the foreseeable future throughout all or a significant portion of its range. "Endangered" means in danger of extinction throughout all or a significant portion of its range. Both categories trigger Section 7 consultation for federal actions. [Species listing status is dynamic — always verify at fws.gov/species at time of project.]',
            },
            {
              id: 'T09-L04-fc-ipac',
              front: 'What is IPaC DKey and how is it used in fiber permitting?',
              back: 'Information for Planning and Consultation — Decision Key tool, available at ipac.ecosphere.fws.gov. A free USFWS web tool that allows project applicants to define a project footprint and receive a report of federally listed species and designated critical habitat potentially present in the area. The IPaC DKey also provides activity-specific guidance (e.g., tree-clearing, aerial construction) and avoidance recommendations. Running IPaC is the standard first step in ESA screening for fiber projects.',
            },
            {
              id: 'T09-L04-fc-sec7',
              front: 'What is Section 7 consultation under the ESA?',
              back: 'The formal process under ESA Section 7 (16 USC §1536) in which the federal action agency consults with the USFWS to determine whether a federal action may adversely affect a listed species or critical habitat. Informal consultation (can result in a "not likely to adversely affect" finding in a concurrence letter) is sufficient for most fiber projects with proper mitigation. Formal consultation (results in a Biological Opinion) is required when there may be adverse effects that cannot be avoided.',
            },
            {
              id: 'T09-L04-fc-tree-window',
              front: 'What is the tree-clearing window for bat species protection?',
              back: 'The time period during which tree clearing is prohibited or restricted to protect bat species from disturbance during their most sensitive life stages. For the Northern Long-Eared Bat (NLEB) and Tricolored Bat, the standard avoidance window for tree clearing runs from approximately April 1 through October 31 (the active roosting and pup-rearing season). Tree clearing outside this window (November through March) is generally acceptable under standard avoidance measures. [Confirm current IPaC guidance for your specific species and project location.]',
            },
            {
              id: 'T09-L04-fc-bio-assessment',
              front: 'What is a biological assessment?',
              back: 'A document prepared by the project applicant for formal ESA Section 7 consultation, evaluating the likely effects of the project on listed species and critical habitat. Required for major federal actions that may affect listed species. For most fiber projects, informal consultation and a brief effects analysis suffice — a full biological assessment is the threshold step for formal consultation.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Running IPaC and Interpreting the Results</h2>

        <h3 className="mt-4 font-semibold">How to use IPaC for a fiber project</h3>
        <p>
          IPaC (ipac.ecosphere.fws.gov) is the USFWS's project-screening tool. Here's the
          workflow for a fiber project:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Create a project.</strong> Go to IPaC, create an account, and start a
            new project. Enter the project name, federal funding source (BEAD, RUS, etc.),
            and the lead federal agency.
          </li>
          <li>
            <strong>Define the project location.</strong> Draw or upload the project footprint
            (the pole corridor or trench corridor — not the entire county). IPaC screens
            the specific geographic area, not the surroundings. Accuracy here prevents
            false positives.
          </li>
          <li>
            <strong>Run the DKey.</strong> The Decision Key walks you through a series of
            questions about project activities (tree clearing, ground disturbance, aerial
            construction, etc.) and returns species-specific guidance based on your answers.
            For fiber: answer "yes" to aerial construction and/or ground disturbance; answer
            "yes" or "no" to tree clearing based on your actual scope.
          </li>
          <li>
            <strong>Review the species list.</strong> IPaC returns a list of T&E species
            potentially present in the project area, including: listed status, critical
            habitat designation, and whether the species is "likely to occur" or "may occur."
            For each bat species flagged: read the activity-specific guidance for tree clearing
            and aerial construction.
          </li>
          <li>
            <strong>Apply the avoidance measures or initiate consultation.</strong> If IPaC
            guidance says "implement standard avoidance measures" (e.g., no tree clearing
            April–October), you document that commitment and proceed. If IPaC flags a
            species where standard avoidance is insufficient, you initiate informal
            consultation with the USFWS field office.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Bat species and the tree-clearing window</h3>
        <p>
          The most common ESA mitigation measure for bat-sensitive fiber projects is the
          <strong> tree-clearing window</strong>. Bat species that roost in trees (like the
          NLEB and Tricolored Bat) are most vulnerable during the active season when they
          are present, raising pups, and dependent on roost trees. The standard avoidance
          measure: no tree clearing from approximately <strong>April 1 through October 31</strong>.
          Tree clearing in the winter months (November–March) is generally acceptable under
          standard avoidance.
        </p>
        <p className="mt-2">
          <strong>Why this matters for project scheduling:</strong> If your route requires
          any tree clearing (new pole placement requiring tree removal, ROW clearing for
          access), and the project start date is in the spring, you either clear trees in
          winter before the window closes, or you wait until November. A project that misses
          the fall clearing window may not be able to mobilize until spring of the following
          year — a 5–8 month schedule hit for a single mitigation requirement.
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Month range</th>
                <th className="px-3 py-2 text-left">Tree clearing allowed?</th>
                <th className="px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">November 1 – March 31</td>
                <td className="px-3 py-2 text-green-400 font-medium">Generally allowed</td>
                <td className="px-3 py-2">Bats in hibernation; standard avoidance period for NLEB and Tricolored Bat</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">April 1 – October 31</td>
                <td className="px-3 py-2 text-red-400 font-medium">Avoid (standard mitigation)</td>
                <td className="px-3 py-2">Active roosting and pup-rearing season; tree clearing can constitute "take" under ESA</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: USFWS IPaC DKey guidance for NLEB and Tricolored Bat; 16 USC §§1531–1544.
          [Confirm current avoidance window dates via IPaC DKey for your specific project
          location and species at time of project — windows and guidance can be updated by
          USFWS as species status and population data evolve.]
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (USFWS IPaC guidance):</strong> Run IPaC, get the species list,
            apply the standard avoidance measures (no tree clearing April–October), document
            the commitment, and proceed. No consultation needed if standard avoidance applies
            and the project has no additional impact pathways.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Many subgrantees skip the IPaC run on the assumption that
            "we're using existing poles — no tree clearing — so bats don't apply." This misses
            two real exposure pathways: (1) New pole placements in wooded areas that require
            even a few trees to be removed; (2) Hand-line placement near roost trees during
            active season. IPaC also catches species other than bats (birds with sensitive
            nesting seasons, reptiles near waterways) that can create similar timing
            constraints. Running IPaC takes 15 minutes. Discovering a compliance gap after
            construction starts can cost months and grant compliance risk.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The listing status trap:</strong> Bat species listings are dynamic. The
            NLEB moved from Threatened to Endangered in February 2023. The Tricolored Bat was
            proposed for Endangered listing in October 2022. A project team that checked
            species status in 2021 and didn't re-verify may be operating with outdated
            information. Always verify current listing status via fws.gov/species immediately
            before the ESA screening — not at project kickoff months earlier.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Informal vs. formal Section 7 consultation</h3>
        <p>
          Section 7 consultation exists on a spectrum:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Informal consultation:</strong> The action agency (NTIA/RUS) and the
            project applicant contact the USFWS field office, describe the project and the
            species potentially present, and present the avoidance measures proposed.
            If USFWS concurs that the project is "not likely to adversely affect" listed
            species with the proposed measures, they issue a concurrence letter (sometimes
            called an "NLA letter"). Informal consultation typically takes 30–60 days
            and requires no biological assessment.
          </li>
          <li>
            <strong>Formal consultation:</strong> Required when the action agency determines
            (or USFWS requests) that the project "may adversely affect" listed species even
            with proposed measures. Formal consultation requires a biological assessment from
            the applicant and results in a Biological Opinion (BO) from USFWS. The BO may
            include an Incidental Take Permit (ITP) allowing limited, unavoidable "take"
            of listed species within specified conditions. Formal consultation can take
            90–180 days.
          </li>
        </ul>
        <p className="mt-2">
          For most aerial fiber routes using existing poles with standard avoidance measures,
          informal consultation and an NLA concurrence letter are the expected outcome.
          Formal consultation is the exception — typically required when tree clearing in
          Endangered bat habitat is unavoidable during the active season, or when the project
          impacts critical habitat.
        </p>

        <h3 className="mt-5 font-semibold">What "take" means for bat species</h3>
        <p>
          Under ESA Section 9 (16 USC §1538), "take" of a listed species is prohibited.
          Take means to "harass, harm, pursue, hunt, shoot, wound, kill, trap, capture, or
          collect" a listed species. USFWS has defined "harm" to include significant habitat
          modification that actually kills or injures listed species.
        </p>
        <p className="mt-2">
          For bats: felling a tree containing a bat roost during the active season (April–
          October) constitutes harm — potentially killing roosting bats or pups. This is
          what the tree-clearing window is designed to prevent. Following the avoidance
          window reduces the risk of take to near zero, which is why the standard mitigation
          is sufficient for informal consultation.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 16 USC §§1531–1544 (ESA); 16 USC §1538 (take prohibition); 50 CFR §17.3
          (harm definition) [confirm current edition against ecfr.gov]. USFWS Northern
          Long-Eared Bat Final Rule (88 FR 6358, Jan. 30, 2023 — Endangered reclassification).
          [Confirm current NLEB and Tricolored Bat listing status at fws.gov/species at
          time of project.]
        </p>
      </section>

      {/* ── LABELED LIST — IPaC output sections ──────────────────────────── */}
      <div className="lesson-callout">
        <h4>Reading an IPaC Output — What Each Section Means for a Fiber Project</h4>
        <ol>
          <li>
            <strong>Species Found</strong> — The list of federally listed T&amp;E species
            potentially present in your project footprint, each with its federal status
            (Endangered / Threatened / Proposed / Candidate). For fiber projects: flag every bat
            species and any bird species with nesting-season restrictions. Presence on the list
            is based on range maps and habitat models — it does not confirm the species is in
            your corridor, but it triggers the need for further analysis.
          </li>
          <li>
            <strong>Critical Habitat</strong> — Areas designated by USFWS as essential to the
            conservation of a listed species. Crossing designated critical habitat with a
            BEAD-funded project triggers a higher level of ESA scrutiny than simply having
            species present — informal consultation almost certainly becomes formal consultation.
            Check the IPaC map layers against your route alignment.
          </li>
          <li>
            <strong>Activity-Specific Guidance</strong> — For each listed species in your
            footprint, IPaC provides guidance organized by project activity (tree clearing,
            ground disturbance, aerial construction, etc.). This is the most actionable output.
            For bat species: look for the tree-clearing guidance — it states the avoidance
            window (typically April 1–October 31), the buffer distance from roost trees if
            applicable, and whether informal or formal consultation is recommended.
          </li>
          <li>
            <strong>Consultation Recommended flag</strong> — IPaC flags species-activity
            combinations where standard avoidance is insufficient and contact with the USFWS
            field office is recommended. This does not mean automatic formal Section 7
            consultation — it means you should call the field office to confirm whether
            informal consultation (NLA concurrence letter) is achievable, or whether formal
            consultation is required.
          </li>
          <li>
            <strong>"Not Likely to Adversely Affect" screen result</strong> — The IPaC DKey
            may return an NLA determination based on your project description and committed
            avoidance measures. This is a screening determination, NOT a formal USFWS
            concurrence. For BEAD compliance documentation, you generally need a written NLA
            concurrence letter from the USFWS field office — not just the IPaC screen result.
          </li>
        </ol>
      </div>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T09.L04 Check — ESA, Bats, and IPaC"
        mode="multiple-choice"
        questions={[
          {
            id: 'T09-L04-Q1',
            type: 'mc',
            prompt:
              'A BEAD-funded aerial fiber route will require removing 12 trees to place 4 new poles in a wooded gap. The project area is in documented Northern Long-Eared Bat (NLEB) range. The project is scheduled to begin April 15. The NLEB is federally listed as Endangered. What is the correct action before mobilizing?',
            choices: [
              'Proceed — existing-pole attachment is the primary activity and the 12-tree removal is minor',
              'Run IPaC DKey, apply the standard tree-clearing avoidance window (April 1–October 31), and delay tree clearing until November — OR clear trees in winter before April 1',
              'No ESA review required because the NLEB is only Threatened, not Endangered',
              'Request a formal Biological Opinion from USFWS; no tree clearing is ever allowed in NLEB range',
            ],
            answerIndex: 1,
            explanation:
              'Tree clearing in documented NLEB Endangered range during the active season (April 1–October 31) can constitute "take" under ESA §9 — specifically, felling a roost tree during the season when bats are present. The standard mitigation is the tree-clearing avoidance window: clear trees outside the April–October window. Starting April 15 means you must either (a) clear the 12 trees before April 1, or (b) delay tree clearing until November 1. Note: The NLEB was reclassified from Threatened to Endangered in February 2023 (88 FR 6358). [Confirm current listing status at fws.gov/species.]',
            citation: '16 USC §1538 (take prohibition); USFWS IPaC DKey NLEB guidance; 88 FR 6358 (NLEB Endangered reclassification, 2023).',
          },
          {
            id: 'T09-L04-Q2',
            type: 'mc',
            prompt:
              'An IPaC DKey output flags two bat species in a fiber project footprint. The activity-specific guidance says "standard avoidance measures sufficient for tree-clearing activities outside April 1–October 31." No critical habitat is designated in the footprint. What level of ESA consultation is typically required?',
            choices: [
              'No consultation required — IPaC output clears the project',
              'Informal Section 7 consultation — contact the USFWS field office for a written "not likely to adversely affect" concurrence letter documenting the standard avoidance commitment',
              'Formal Section 7 consultation — a biological assessment and Biological Opinion required for all bat species',
              'No consultation required if the project uses existing poles and no new pole placement involves tree clearing',
            ],
            answerIndex: 1,
            explanation:
              'When IPaC returns standard avoidance measures as sufficient, the typical pathway is informal Section 7 consultation — contacting the USFWS field office to document the "not likely to adversely affect" determination with a written concurrence letter. The IPaC screen result alone is not formal USFWS documentation; the concurrence letter from the field office is the document needed for BEAD compliance. Formal consultation (Biological Opinion) is reserved for situations where adverse effects to listed species cannot be avoided.',
            citation: 'ESA §7 (16 USC §1536); USFWS IPaC DKey guidance; informal consultation process.',
          },
          {
            id: 'T09-L04-Q3',
            type: 'mc',
            prompt:
              'A project team reviewed bat species listings in January 2022 and confirmed the Northern Long-Eared Bat was "Threatened" at that time. The project begins construction in June 2023. What action is required before starting construction?',
            choices: [
              'No action — the January 2022 review is sufficient for the 2023 construction start',
              'Reverify current NLEB listing status at fws.gov/species — the NLEB was reclassified to Endangered in February 2023, which may change consultation requirements',
              'Begin construction — Threatened species do not require tree-clearing avoidance windows',
              'Consult with the ACHP — bat species listing changes require historic review updates',
            ],
            answerIndex: 1,
            explanation:
              'ESA listing status is dynamic. The Northern Long-Eared Bat was reclassified from Threatened to Endangered effective February 2023 (88 FR 6358). A team operating on 2022 data would not know about this reclassification. Endangered status can increase consultation obligations beyond those required for Threatened status. ESA status must be verified immediately before any permitting decision, not just at project kickoff months or years earlier. ACHP is the Section 106 historic preservation body — it has no role in ESA bat species listings.',
            citation: '88 FR 6358 (NLEB Endangered reclassification, effective Feb. 2023); 16 USC §1536.',
          },
          {
            id: 'T09-L04-Q4',
            type: 'mc',
            prompt:
              'Which USFWS tool is the standard first step for ESA screening on a BEAD-funded fiber project?',
            choices: [
              'National Wetland Inventory (NWI) mapper',
              'IPaC DKey (Information for Planning and Consultation Decision Key) at ipac.ecosphere.fws.gov',
              'NatureServe Explorer',
              'USGS Gap Analysis Project (GAP) species maps',
            ],
            answerIndex: 1,
            explanation:
              'IPaC (Information for Planning and Consultation) at ipac.ecosphere.fws.gov is the USFWS\'s official project-screening tool for ESA review. It accepts a user-defined project footprint and returns federally listed species potentially present in the area, critical habitat designations, and activity-specific guidance. NWI maps wetlands (useful for USACE permitting, covered in T09.L05). NatureServe and GAP are third-party/USGS tools — useful supplementary references but not the USFWS-official ESA consultation starting point.',
            citation: 'USFWS IPaC (ipac.ecosphere.fws.gov); 16 USC §1536 (ESA §7 consultation trigger).',
          },
        ]}
      />

    </LessonLayout>
  );
}
