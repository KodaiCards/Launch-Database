// T09.L02 — NEPA: CE, EA, and EIS
// Working lesson: NEPA tier screening, CE C-8, extraordinary circumstances, BEAD/RUS nexus
// Source: M03 §3.2 (NEPA, CE, extraordinary circumstances)
// Authority: 42 USC §4321 et seq. (NEPA); 40 CFR Part 1500-1508 (CEQ rules — removed eff. Jan. 8, 2026);
//            7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR Part 1970 RUS NEPA); NTIA BEAD NEPA procedures

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L02',
  course_id: 'T09',
  title: 'NEPA — CE, EA, and EIS',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T09.L01'],
  learning_objectives: [
    'Identify the three tiers of NEPA review and when each applies',
    'Apply the CE C-8 screening criteria to a BEAD aerial-fiber route',
    'Recognize the extraordinary-circumstances conditions that elevate a CE to an EA',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'NEPA',
    'categorical exclusion (CE)',
    'EA',
    'FONSI',
    'EIS',
    'extraordinary circumstances',
    'CE C-8',
    'ESAPTT',
  ],
  key_terms: [
    {
      term: 'NEPA',
      definition:
        'National Environmental Policy Act — the 1969 federal law (42 USC §4321 et seq.) that requires federal agencies to analyze the environmental effects of their actions before proceeding. For OSP fiber projects, NEPA applies whenever there is a federal nexus (BEAD funding, RUS loans, USACE permits). The Council on Environmental Quality (CEQ) has historically implemented NEPA through agency-specific regulations; the CEQ\'s own implementing regulations previously codified at 40 CFR Parts 1500–1508 were removed effective January 8, 2026. Verify current NEPA implementing guidance at ceq.doe.gov and with the applicable lead federal agency at time of project.',
    },
    {
      term: 'categorical exclusion (CE)',
      definition:
        'A category of federal actions that have been determined, based on experience with similar actions, to have no significant effect on the environment individually or cumulatively. A CE requires no Environmental Assessment (EA) or Environmental Impact Statement (EIS), but extraordinary circumstances must be checked and documented. For BEAD/RUS fiber projects, CE C-8 is the applicable categorical exclusion.',
    },
    {
      term: 'EA',
      definition:
        'Environmental Assessment — a concise public document that provides enough evidence and analysis to determine whether a Proposed Action requires an EIS or whether a Finding of No Significant Impact (FONSI) can be issued. An EA is required when a project does not clearly qualify for a CE, or when a CE is disqualified by an extraordinary circumstance. Typical EA timeline: 3–6 months.',
    },
    {
      term: 'FONSI',
      definition:
        'Finding of No Significant Impact — the federal agency determination that a Proposed Action, based on the Environmental Assessment, will not have a significant effect on the environment and therefore does not require an Environmental Impact Statement (EIS). A FONSI is the "green light" result of a successful EA. A project cannot proceed under federal action authority until either a CE, FONSI, or Record of Decision (for EIS) is issued.',
    },
    {
      term: 'EIS',
      definition:
        'Environmental Impact Statement — the most rigorous level of NEPA review, required when a federal action may significantly affect the quality of the human environment. An EIS must analyze the full range of environmental impacts, reasonable alternatives, and mitigation measures. For OSP fiber projects, an EIS is rare (typically triggered by large-scale ground disturbance in ecologically sensitive areas) but can extend a project timeline by 12–36 months.',
    },
    {
      term: 'extraordinary circumstances',
      definition:
        'Specific conditions or factors that, if present in a project\'s footprint, prevent a categorical exclusion from applying and require an elevated NEPA review (EA or EIS). For BEAD/RUS fiber projects under CE C-8, the extraordinary circumstances include: T&E species or critical habitat, historic properties in the project area (APE), wetlands or floodplains, coastal zones, prime farmland, and others listed in the agency\'s CE procedures.',
    },
    {
      term: 'CE C-8',
      definition:
        'CE C-8 is a categorical exclusion designation in USDA/RUS regulations (7 CFR Part 1b, formerly 7 CFR Part 1970) covering aerial or buried utility and communications construction within or adjacent to existing rights-of-way. It eliminates the need for an EA or EIS for RUS-financed fiber projects provided no extraordinary circumstances are present. Important: CE C-8 is RUS nomenclature. NTIA did not adopt CE C-8 for BEAD — NTIA\'s 2024 CE rulemaking explicitly excluded CE C-8, noting that the actions it covers are encompassed by existing Commerce Department-level CEs. BEAD projects use Commerce Dept-level CEs, not CE C-8. Verify the applicable CE designation with the lead federal agency (RUS or NTIA/state broadband office) at time of project.',
    },
    {
      term: 'ESAPTT',
      definition:
        'Endangered Species Act — Programmatic Threatened and Endangered species consultation, sometimes abbreviated ESAPTT in BEAD environmental documentation. Refers to the process of conducting a programmatic (program-wide) Section 7 consultation with USFWS rather than a project-by-project consultation. Not all BEAD programs use this approach — verify with the NTIA-approved state NEPA process at time of project.',
    },
  ],
  vocabulary_assumed: [
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'BEAD', source_lesson_id: 'T09.L01' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
      ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L02_NepaTypes() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every federal action that could affect the environment has to go through some
          level of review under <strong>NEPA (National Environmental Policy Act)</strong>,
          the 1969 federal law that essentially says: before the federal government does
          something, it has to look before it leaps.
        </p>
        <p className="mt-2">
          For fiber projects with a federal nexus, NEPA review falls into one of three
          buckets — from easiest to hardest:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            <strong>Categorical Exclusion (CE)</strong> — the fast lane. The project type
            is pre-approved as non-significant. You fill out a checklist, confirm no red
            flags, and you're done. Most BEAD aerial fiber routes qualify here.
          </li>
          <li>
            <strong>Environmental Assessment (EA) → FONSI</strong> — the middle lane.
            More analysis required, but the conclusion is still "no significant impact" and
            you get a green light (called a FONSI). Takes 3–6 months.
          </li>
          <li>
            <strong>Environmental Impact Statement (EIS)</strong> — the slow lane. Full
            analysis of major environmental impacts, alternatives, and mitigation. Required
            when a project may significantly affect the environment. Rare for standard
            fiber routes — but can take 12–36 months if triggered.
          </li>
        </ol>
        <p className="mt-3">
          The goal is always to stay in the CE lane. The threat that kicks you out of the CE
          lane is something called an <strong>extraordinary circumstance</strong> — a specific
          environmental red flag in your project footprint.
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
              <td className="px-3 py-2 font-mono">NEPA</td>
              <td className="px-3 py-2">National Environmental Policy Act</td>
              <td className="px-3 py-2">The law that triggers environmental review for all federal actions</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CE</td>
              <td className="px-3 py-2">Categorical Exclusion</td>
              <td className="px-3 py-2">Pre-approved "no significant impact" finding for standard project types</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">EA</td>
              <td className="px-3 py-2">Environmental Assessment</td>
              <td className="px-3 py-2">Mid-level review document; leads to FONSI (good) or EIS (bad)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FONSI</td>
              <td className="px-3 py-2">Finding of No Significant Impact</td>
              <td className="px-3 py-2">The "green light" result of a successful EA</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">EIS</td>
              <td className="px-3 py-2">Environmental Impact Statement</td>
              <td className="px-3 py-2">Full-scale review; rare for fiber; can add 1–3 years to a project</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CEQ</td>
              <td className="px-3 py-2">Council on Environmental Quality</td>
              <td className="px-3 py-2">White House office overseeing NEPA — CEQ regulations at 40 CFR Parts 1500–1508 removed eff. January 8, 2026 (FR 2026-00178); NEPA now implemented through agency-specific procedures</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T09-L02"
          cards={[
            {
              id: 'T09-L02-fc-nepa',
              front: 'What is NEPA and when does it apply to a fiber project?',
              back: 'National Environmental Policy Act — the 1969 federal law (42 USC §4321 et seq.) that requires federal agencies to analyze the environmental effects of their actions before proceeding. For OSP fiber projects, NEPA applies whenever there is a federal nexus (BEAD funding, RUS loans, USACE permits). CEQ\'s own NEPA implementing regulations (formerly at 40 CFR Parts 1500–1508) were removed effective January 8, 2026 — verify current guidance at ceq.doe.gov and with the lead federal agency at time of project.',
            },
            {
              id: 'T09-L02-fc-ce',
              front: 'What is a Categorical Exclusion (CE) under NEPA?',
              back: 'A category of federal actions that have been determined, based on experience with similar actions, to have no significant effect on the environment individually or cumulatively. A CE requires no Environmental Assessment (EA) or Environmental Impact Statement (EIS), but extraordinary circumstances must be checked and documented. For BEAD/RUS fiber projects, CE C-8 is the applicable categorical exclusion.',
            },
            {
              id: 'T09-L02-fc-ea',
              front: 'What is an Environmental Assessment (EA)?',
              back: 'A concise public document that provides enough evidence and analysis to determine whether a Proposed Action requires an EIS or whether a Finding of No Significant Impact (FONSI) can be issued. An EA is required when a project does not clearly qualify for a CE, or when a CE is disqualified by an extraordinary circumstance. Typical EA timeline: 3–6 months.',
            },
            {
              id: 'T09-L02-fc-fonsi',
              front: 'What is a FONSI?',
              back: 'Finding of No Significant Impact — the federal agency determination that a Proposed Action, based on the Environmental Assessment, will not have a significant effect on the environment and therefore does not require an Environmental Impact Statement (EIS). A FONSI is the "green light" result of a successful EA.',
            },
            {
              id: 'T09-L02-fc-eis',
              front: 'What is an EIS and when is it required?',
              back: 'Environmental Impact Statement — the most rigorous level of NEPA review, required when a federal action may significantly affect the quality of the human environment. An EIS must analyze the full range of environmental impacts, reasonable alternatives, and mitigation measures. For OSP fiber projects, an EIS is rare but can extend a project timeline by 12–36 months.',
            },
            {
              id: 'T09-L02-fc-extraordinary',
              front: 'What are extraordinary circumstances under NEPA?',
              back: 'Specific conditions or factors that, if present in a project\'s footprint, prevent a categorical exclusion from applying and require an elevated NEPA review (EA or EIS). For BEAD/RUS fiber projects under CE C-8, the extraordinary circumstances include: T&E species or critical habitat, historic properties in the project area (APE), wetlands or floodplains, coastal zones, prime farmland, and others listed in the agency\'s CE procedures.',
            },
            {
              id: 'T09-L02-fc-ce-c8',
              front: 'What is CE C-8 and who uses it?',
              back: 'CE C-8 is a USDA/RUS categorical exclusion designation (7 CFR Part 1b, formerly 7 CFR Part 1970) covering aerial or buried utility and communications construction within or adjacent to existing rights-of-way. It is RUS nomenclature — NTIA did not adopt CE C-8 for BEAD; NTIA uses Commerce Department-level CEs instead. For RUS-financed fiber projects, CE C-8 eliminates the need for an EA or EIS provided no extraordinary circumstances are present. Verify the applicable CE designation with the lead federal agency at time of project.',
            },
            {
              id: 'T09-L02-fc-esaptt',
              front: 'What is ESAPTT?',
              back: 'Endangered Species Act — Programmatic Threatened and Endangered species consultation, sometimes abbreviated ESAPTT in BEAD environmental documentation. Refers to the process of conducting a programmatic (program-wide) Section 7 consultation with USFWS rather than a project-by-project consultation. Not all BEAD programs use this approach — verify with the NTIA-approved state NEPA process at time of project.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Applying NEPA to a Fiber Route</h2>

        <h3 className="mt-4 font-semibold">CE C-8 — the standard fiber route exclusion</h3>
        <p>
          For most BEAD-funded aerial fiber routes running along existing utility corridors
          or highway ROW, the applicable categorical exclusion is{' '}
          <strong>CE C-8</strong> — the CE covering "aerial or buried utility and
          communications construction within or adjacent to existing rights-of-way."
          (Source: 7 CFR Part 1b [eff. April 3, 2026; replaced 7 CFR Part 1970] for RUS;
          NTIA BEAD program NEPA procedures [confirm current NTIA CE designation at time of project].)
        </p>
        <p className="mt-2">
          Applying CE C-8 means you're arguing that your fiber route is routine utility
          construction in an existing corridor — no new ground disturbance, no new ROW
          clearing, no significant environmental disruption. To make that argument, you
          complete a CE checklist that documents the project footprint and confirms that no
          extraordinary circumstances apply.
        </p>

        <h3 className="mt-5 font-semibold">The extraordinary-circumstances checklist</h3>
        <p>
          Even if CE C-8 fits your project type, you must verify that none of the following
          extraordinary circumstances exist in your project footprint. If even one fires,
          the CE cannot be used without further analysis:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Extraordinary circumstance</th>
                <th className="px-3 py-2 text-left">How to check</th>
                <th className="px-3 py-2 text-left">If present → required action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Threatened or Endangered species / critical habitat</td>
                <td className="px-3 py-2">Run IPaC DKey tool on project footprint (covered in T09.L04)</td>
                <td className="px-3 py-2">Section 7 consultation with USFWS; CE may not apply</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Historic properties in the APE (Area of Potential Effect)</td>
                <td className="px-3 py-2">Section 106 records search + SHPO coordination (covered in T09.L03)</td>
                <td className="px-3 py-2">Section 106 consultation process; CE may not apply until §106 concludes</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Wetlands or floodplains</td>
                <td className="px-3 py-2">NWI map + field confirmation + FEMA FIRM map</td>
                <td className="px-3 py-2">USACE Section 404 coordination; EA typically required if wetland impact significant</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Coastal zones</td>
                <td className="px-3 py-2">NOAA coastal zone boundary maps</td>
                <td className="px-3 py-2">Coastal Zone Management Act consistency review; EA likely required</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Prime or unique farmland</td>
                <td className="px-3 py-2">NRCS Web Soil Survey — look for prime farmland classification</td>
                <td className="px-3 py-2">FPPA Farmland Protection Policy Act analysis; EA may be required</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Wild/Scenic Rivers or protected areas</td>
                <td className="px-3 py-2">NPS Wild & Scenic River maps; USFS protected area layers</td>
                <td className="px-3 py-2">Coordination with NPS/USFS; EA almost certainly required</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 40 CFR §1508.4 (CEQ extraordinary circumstances definition — note: 40 CFR
          Parts 1500–1508 removed eff. January 8, 2026; extraordinary circumstances concept
          survives in agency procedures); 7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR
          Part 1970 RUS NEPA procedures).
        </p>

        {/* Book vs. Field — eastern US extraordinary-circumstance trigger rates */}
        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field — CE Is the Goal, Not the Assumption</p>

          <p className="text-slate-300/90">
            <strong>Book (42 U.S.C. §4332; 7 CFR Part 1b [eff. April 3, 2026]):</strong> CE C-8
            applies to aerial and buried utility construction within or adjacent to existing ROW,
            provided no extraordinary circumstances are present. The rule is national — the same
            checklist applies in Nevada as in North Carolina.
          </p>

          <p className="text-slate-300/90 mt-3">
            <strong>Field reality in the eastern US:</strong> The extraordinary-circumstances
            checklist fires far more often in the South, Mid-Atlantic, and Appalachian corridor
            than in the West. Three reasons:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300/90 mt-2">
            <li>
              <strong>Wetlands density.</strong> Coastal plain states (Georgia, the Carolinas,
              Virginia, Florida, Gulf Coast) have some of the highest concentrations of
              jurisdictional wetlands in the country. A route that runs 10 miles in these
              regions has a meaningful probability of crossing or running adjacent to a
              wetland mapped on the National Wetlands Inventory — which triggers the
              USACE Section 404 coordination row on your checklist.
            </li>
            <li>
              <strong>T&amp;E species consultation frequency.</strong> Eastern forests and coastal
              watersheds support multiple species under active ESA §7 (16 U.S.C. §1536)
              consultation programs. The species involved vary by geography and listing status —
              confirm current species and their range maps using the USFWS IPaC tool at the time
              of project. Do not assume a clean IPaC result without running the tool on your
              specific project footprint; listed species and their designated critical habitat
              change as USFWS completes listing reviews.
            </li>
            <li>
              <strong>Historic properties density.</strong> The eastern US carries denser
              pre-Columbian and colonial-era archaeological and architectural resources than
              most of the West. In Georgia, the Carolinas, Virginia, and Tennessee, aerial
              routes passing through older towns frequently touch the edge of a recorded
              historic district or an APE (Area of Potential Effect) where a Section 106
              (36 CFR Part 800) records search flags potential resources.
            </li>
          </ul>

          <p className="text-slate-300/90 mt-3">
            <strong>The practical implication:</strong> In the eastern US, engineers who
            treat CE as the default outcome — and only prepare the extraordinary-circumstances
            checklist as a formality — regularly get caught requiring an EA when the
            schedule assumed a CE. The correct field posture: assume at project kickoff that
            at least one extraordinary circumstance will fire, and begin the IPaC query, NWI
            map review, and county historic-property records check on Day 1 of route survey
            (covered in T04). Treat CE as the optimistic outcome you are trying to confirm,
            not the starting assumption. If the checklist comes back clean, you finish faster.
            If it fires, you started your agency coordination 60–90 days earlier.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Multi-Circumstance Agency Sequencing — When Multiple Extraordinary Circumstances Co-Occur</h3>
        <p>
          A single route may trigger multiple extraordinary circumstances at the same time — for example, a corridor with both a listed T&E species habitat AND a historic property within the Area of Potential Effect (APE) AND wetlands that require USACE Section 404 permits. When this happens, the project requires coordination across three separate federal agencies, each with its own timeline and legal authority.
        </p>
        <p className="mt-2">
          <strong>The federal agency call-order when multiple circumstances exist:</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            <strong>USFWS (U.S. Fish and Wildlife Service) — Endangered Species Act Section 7 consultation.</strong> If any T&E species or critical habitat is in the project footprint, the lead federal agency (RUS or NTIA) must initiate formal or informal Section 7 consultation with USFWS. USFWS has 30 days (informal) to 90 days (formal) to respond. Biological Opinion or concurrence required. This can trigger mitigation measures (timing restrictions for nesting season, habitat restoration, etc.). Typical timeline: 2–4 months for informal, 6–12 months for formal.
          </li>
          <li>
            <strong>SHPO (State Historic Preservation Office) — NHPA Section 106 consultation.</strong> If any historic properties (archaeological sites, listed buildings, historic districts) are in the APE, a separate Section 106 consultation with SHPO (state-specific) must conclude. SHPO has 30 days to comment; if concerns exist, Memoranda of Agreement (MOA) or phased mitigation negotiations can extend this to 6–12 months. Section 106 concludes AFTER USFWS consultation results are known so mitigation strategies are coordinated.
          </li>
          <li>
            <strong>USACE (U.S. Army Corps of Engineers) — CWA Section 404 / Nationwide Permit (NWP) coverage.</strong> If wetlands or floodplains are crossed, the project requires either (a) a Nationwide Permit (NWP) authorization from USACE (10–20 business days if the project qualifies), or (b) an Individual Permit (IP) application to USACE (6–12 months if the project doesn't fit a standard NWP). The key distinction: if the wetland impact is minimal (≤0.1 acres) and confined to existing utility corridor, a NWP may cover it. If impacts are larger or the project is not in an existing corridor, a full IP application is required. USACE coordination often occurs in parallel with USFWS and SHPO (all three may be reviewing the same Environmental Assessment) but the Section 404 permit is the binding approval mechanism for water crossings.
          </li>
        </ol>
        <p className="mt-3">
          <strong>Practical timeline when all three agencies are involved:</strong> Figure 4–6 months minimum (best case: informal USFWS, quick SHPO clearance, NWP coverage). If formal USFWS Section 7 or individual USACE permit is required, budget 9–18 months. The lead federal agency (RUS or NTIA) is responsible for coordinating across all three, but the project cannot proceed until ALL consultations conclude and environmental clearance (CE, FONSI, or ROD) is issued.
        </p>

        <h3 className="mt-5 font-semibold">What does "within or adjacent to existing ROW" actually mean?</h3>
        <p>
          CE C-8 covers construction "within or adjacent to existing ROW." In practice,
          this phrase is doing a lot of work. "Within" is clear: the pole line is in the
          highway ROW, the bore is in the road corridor. "Adjacent to" is where projects
          sometimes push the boundary.
        </p>
        <p className="mt-2">
          The standard interpretation: "adjacent to" means immediately alongside the ROW edge,
          within a distance that doesn't involve ground disturbance beyond what a utility crew
          would encounter placing a routine pole in the shoulder. If your route deviates 50 feet
          into a field to avoid a utility conflict, that deviation may no longer qualify as
          "adjacent to" existing ROW — it could be new ground disturbance requiring higher
          NEPA analysis.
        </p>

        <h3 className="mt-5 font-semibold">Multi-Agency Sequencing — When You Need Multiple Permits in Sequence</h3>
        <p>
          Even a single fiber route often requires approvals from more than one authority. A route
          that crosses a navigable stream needs a USACE permit. If it runs across state forest land,
          the state forestry agency must approve. If it follows a county road, the county road manager
          must grant the encroachment. And if it approaches a Native American reservation boundary or
          tribal lands, a Section 106 (NHPA) consultation may trigger.
        </p>
        <p className="mt-2">
          The key principle: <strong>some permits GATE others</strong> — meaning you cannot formally
          apply for one until another is in hand. Getting the sequence wrong wastes months. Here is
          the typical federal-to-local order:
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Tier</th>
                <th className="px-3 py-2 text-left">Authority</th>
                <th className="px-3 py-2 text-left">Typical Gating Rule</th>
                <th className="px-3 py-2 text-left">Timeline</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">1 (Federal)</td>
                <td className="px-3 py-2"><strong>USACE</strong> (U.S. Army Corps of Engineers) for water crossings</td>
                <td className="px-3 py-2">Required FIRST if your route crosses streams, wetlands, or floodplains. NWP or Individual Permit is the gating approval for any downstream state/local permits.</td>
                <td className="px-3 py-2">10–20 biz days (NWP); 6–12 mo (IP)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">2 (Federal)</td>
                <td className="px-3 py-2"><strong>USFWS</strong> (U.S. Fish &amp; Wildlife Service) for ESA §7 consultation</td>
                <td className="px-3 py-2">Must conclude BEFORE NEPA can be cleared if T&amp;E species habitat is in the project footprint. Informal or formal Section 7 concurrence is a prerequisite to the lead federal agency (RUS/NTIA) issuing environmental clearance (CE or FONSI).</td>
                <td className="px-3 py-2">30–90 days (informal); 6–12 mo (formal)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">3 (State)</td>
                <td className="px-3 py-2"><strong>State DOT or State Highway Authority</strong> (if route follows state highway)</td>
                <td className="px-3 py-2">Requires encroachment permit for any work in the state highway right-of-way. Many states require the USACE water-crossing permit to be in hand BEFORE the state DOT will issue encroachment approval (encroachment permit gating rule). If USACE has already cleared, state permit is faster.</td>
                <td className="px-3 py-2">4–12 weeks</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">4 (Local)</td>
                <td className="px-3 py-2"><strong>County or Municipal Public Works / Road Manager</strong> (if route uses county/local roads)</td>
                <td className="px-3 py-2">County road permit often gates on state DOT approval. Municipalities may also require a local encroachment permit or right-of-way-use agreement in addition to state approval.</td>
                <td className="px-3 py-2">2–8 weeks</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">5 (Special)</td>
                <td className="px-3 py-2"><strong>Tribal Government</strong> (if project is on or near Indian lands) or <strong>SHPO</strong> (State Historic Preservation Office) for NHPA §106 consultation</td>
                <td className="px-3 py-2">Section 106 (NHPA) consultation for historic properties in the project Area of Potential Effect (APE). Tribal consultation (if applicable) often runs in parallel with SHPO. Both must conclude BEFORE the lead federal agency (RUS/NTIA) can issue environmental clearance. Some BEAD programs add a government-to-government consultation step if the project is on or near tribal lands.</td>
                <td className="px-3 py-2">4–12 weeks (SHPO); 6–12 mo (formal MOA negotiations)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="mt-4 font-semibold text-sm">Why sequencing matters: a concrete example</h4>
        <div className="mt-3 p-3 border border-cyan-400/30 bg-cyan-400/5 rounded-lg text-sm">
          <p className="text-slate-300/90 mb-2">
            <strong>Scenario:</strong> Your 10-mile BEAD fiber route crosses 3 water bodies (so USACE involvement),
            runs 6 miles on a state highway, and 2 miles on county roads. It also has documented Northern
            Long-Eared Bat habitat (so USFWS Section 7 consultation).
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Wrong order:</strong> You apply to state DOT for the encroachment permit first (hoping
            to move fast), then approach USACE. State DOT says "we'll issue your permit once you provide
            proof of water-crossing clearance from USACE." You're back to USACE. You also skipped the
            USFWS consultation. Timeline result: State DOT won't commit until USACE finishes (10–20 biz days
            best case); USFWS takes another 30–90 days minimum once triggered. Total: 4–5 months, and you've
            had permits sitting in agency in-boxes waiting.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Right order:</strong> Month 1: Initiate USFWS Section 7 consultation (informal pathway
            preferred if impact is minimal) AND submit USACE NWP application for water crossings in parallel.
            USACE issues NWP in 10–20 days. Attach NWP to your state DOT encroachment application (Month 2).
            State DOT, seeing USACE clearance in hand, issues encroachment permit within 4–6 weeks. County
            road permit follows (Month 3). USFWS informal concurrence arrives by Month 2–3. Lead federal
            agency (RUS/NTIA) bundles all three into the CE or FONSI. Total: 2–3 months, permits flow smoothly,
            and you hit the construction schedule.
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-300/70">
          <strong>Field best practice:</strong> Before you even finish route design (end of T04), contact
          each regulatory authority (USACE, state DOT, county) to understand their specific encroachment
          process and gating rules. Regulatory timelines vary by region and project specifics. Early
          coordination prevents the "we needed that permit first" delays that blow project schedules.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (7 CFR Part 1b [eff. April 3, 2026; formerly 7 CFR 1970.54] / NTIA CE procedures):</strong> CE C-8 is automatic
            for utility construction in existing ROW provided no extraordinary circumstances
            apply. The CE checklist is the mechanism; check the boxes, document the result,
            submit to the lead federal agency.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Many BEAD subgrantees skip the extraordinary-circumstances
            checklist on the assumption that CE is automatic for fiber. The most common miss:
            failing to run the IPaC tool for bat species before assuming no T&E concerns. A
            single listed bat species in the route corridor (particularly Northern Long-Eared
            Bat or Tricolored Bat — both under active listing review) can trigger an informal
            Section 7 consultation with USFWS that adds 2–4 months to the schedule. CE is
            the starting point, not the destination — the extraordinary-circumstances check
            is mandatory work, not optional box-checking.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The cost of getting this wrong:</strong> If a BEAD-funded project is
            discovered post-construction to have bypassed a required extraordinary-circumstances
            check, the federal agency (NTIA or RUS) can require retroactive NEPA compliance —
            which may include mitigation measures, grant holds, or in the worst case, grant
            clawback.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        {/* ── MULTI-CIRCUMSTANCE AGENCY SEQUENCING WORKED EXAMPLES ─────── */}
        <h3 className="mt-4 font-semibold">Multi-Circumstance Agency Sequencing — Worked Scenarios</h3>
        <p>
          In Plain English: real OSP projects rarely hit just one agency. A single route can
          simultaneously require a state DOT encroachment permit, a pole-attachment (joint-use)
          agreement with a utility owner, a USACE Section 404 wetland authorization, a railroad
          crossing agreement, NHPA Section 106 tribal and SHPO consultation, and municipal ROW
          permits — all before the first shovel hits the ground. The sequencing of these approvals
          is not arbitrary. Some permits legally gate others. Some agencies won't even open your
          application until you show proof that another approval is in hand. Getting the order
          wrong means permits sit in in-boxes waiting, and your construction schedule bleeds months.
        </p>
        <p className="mt-2">
          The three scenarios below walk through representative real-world call-orders. Each names
          the specific statutes and regulations involved, identifies which approvals gate which, and
          shows the schedule impact of getting the order right versus wrong.
        </p>

        {/* ── SCENARIO A ──────────────────────────────────────────────── */}
        <div className="mt-5 p-4 border border-white/15 rounded-xl bg-white/[0.02]">
          <h4 className="font-semibold text-cyan-300 mb-3">
            Scenario A — Aerial Build: State DOT ROW + Joint-Use Pole Owner + Tribal Land
          </h4>
          <p className="text-sm text-slate-300/90 mb-3">
            <strong>Project description:</strong> 7-mile aerial fiber route. 5 miles follow a
            state highway ROW, 1.5 miles attach to poles owned by an investor-owned electric utility
            (IOU), and 0.5 miles cross or run adjacent to tribal trust land owned by a federally
            recognized tribe. Federal nexus: BEAD funding (NTIA/state broadband office as lead federal
            agency). No T&E species in IPaC results. No wetlands.
          </p>

          <p className="text-sm font-semibold text-slate-200 mb-1">Agencies involved and their authority:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90 mb-3">
            <li>
              <strong>State DOT</strong> — encroachment permit for the 5 miles in state highway ROW.
              Authority: state highway code (varies by state; consult state DOT utility accommodation
              policy). The state DOT does not control federal NEPA, but many states require NEPA
              clearance to be in process before they will schedule a field review for the encroachment permit.
            </li>
            <li>
              <strong>Investor-owned electric utility (pole owner)</strong> — joint-use agreement and
              make-ready authorization for the 1.5-mile pole-attachment segment. Authority: 47 USC §224
              (Pole Attachment Act; applies to cable operators and telecom providers attaching to utility
              poles) and state PUC utility accommodation tariffs. IMPORTANT: joint-use approval is
              independent of all NEPA approvals — the pole owner's process is entirely separate from
              federal environmental review. Joint-use processing does NOT wait for NEPA to clear; you
              can (and should) submit the joint-use application simultaneously with NEPA.
            </li>
            <li>
              <strong>Tribal Historic Preservation Officer (THPO)</strong> — NHPA Section 106
              (54 USC §306108) consultation for the segment on or adjacent to tribal trust land.
              Authority: National Historic Preservation Act §106 (54 USC §306108); 36 CFR Part 800
              (implementing regulations). Where a tribe has its own THPO (replacing SHPO for tribal lands),
              consultation is directly with the THPO. Where the tribe does not have its own THPO, the
              SHPO handles the consultation but the tribe must still be invited as a consulting party
              (36 CFR §800.2(c)(2)). Section 106 also triggers government-to-government consultation
              with the tribal government itself — a legally distinct obligation from the THPO technical
              review (Executive Order 13175; 36 CFR §800.2(c)(2)(ii)).
            </li>
          </ul>

          <p className="text-sm font-semibold text-slate-200 mb-1">What blocks what:</p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs border border-white/10 rounded-lg">
              <thead className="bg-white/5 text-slate-200">
                <tr>
                  <th className="px-2 py-2 text-left">Approval needed</th>
                  <th className="px-2 py-2 text-left">Gated by</th>
                  <th className="px-2 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="text-slate-300/90">
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2">NEPA clearance (CE or FONSI)</td>
                  <td className="px-2 py-2">Section 106 (THPO/SHPO) must conclude first</td>
                  <td className="px-2 py-2">Lead federal agency (NTIA/state) cannot issue CE until §106 closes; 54 USC §306108 requires §106 consultation prior to approving the undertaking</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2">State DOT encroachment permit</td>
                  <td className="px-2 py-2">NEPA clearance in process (or in hand)</td>
                  <td className="px-2 py-2">Most state DOTs require proof that the federal environmental review has been initiated before scheduling field review; some require NEPA to be cleared before final permit issuance</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2">Joint-use / pole attachment agreement</td>
                  <td className="px-2 py-2">INDEPENDENT — not gated by NEPA or state DOT</td>
                  <td className="px-2 py-2">Process runs on its own track; utility's make-ready survey, attachment application, and agreement execution do not depend on government permits. Start this on Day 1. It is often the longest track (3–6 months for complex make-ready) and is the most commonly delayed start.</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2">Construction authorization</td>
                  <td className="px-2 py-2">All four: NEPA clearance + state DOT encroachment permit + joint-use agreement + THPO/tribal consultation concluded</td>
                  <td className="px-2 py-2">The last approval in hand unlocks construction. Often the joint-use agreement is the slowest track and is the actual construction gating item.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm font-semibold text-slate-200 mb-1">Correct call-order and schedule:</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-300/90">
            <li>
              <strong>Day 1 — Initiate simultaneously:</strong> (a) Submit joint-use application to the
              IOU (utility company) with make-ready survey request; (b) Submit Notice of Applicability
              to THPO/SHPO for Section 106 under 36 CFR Part 800; (c) Initiate government-to-government
              tribal consultation letter (Executive Order 13175); (d) Submit state DOT encroachment
              permit pre-application or inquiry so the DOT is aware and can schedule field review.
            </li>
            <li>
              <strong>Weeks 2–6:</strong> THPO reviews the 0.5-mile tribal land segment (APE).
              If no historic properties are present: THPO issues a "No Historic Properties Affected"
              finding — Section 106 concludes. State DOT uses this period for internal review.
              Utility begins make-ready survey.
            </li>
            <li>
              <strong>Weeks 4–8:</strong> NEPA CE issued by lead federal agency once Section 106 concludes
              (assuming no extraordinary circumstances found). State DOT encroachment permit issued within
              30–60 days of NEPA clearance (or concurrent with NEPA if the DOT process allows).
            </li>
            <li>
              <strong>Months 3–6:</strong> Joint-use agreement executed after make-ready estimate accepted
              and make-ready work completed by the utility. This is usually the critical-path item — not
              NEPA, not the state DOT.
            </li>
            <li>
              <strong>Construction authorized</strong> when joint-use agreement is fully executed and all
              government permits are in hand.
            </li>
          </ol>

          <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-xs">
            <p className="font-semibold text-amber-300 mb-1">Book vs. Field — joint-use as the hidden critical path</p>
            <p className="text-slate-300/90">
              <strong>Book (47 USC §224):</strong> The Pole Attachment Act requires utilities to provide
              non-discriminatory access to their poles for cable operators and telecom providers at regulated
              rates. Utilities have a defined timeframe to respond to attachment applications.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>Field:</strong> In practice, utilities are under no obligation to rush. Make-ready
              surveys can take 30–90 days; make-ready construction by the utility's own crews can take
              another 60–120 days before you are allowed to attach. BEAD subgrantees who start joint-use
              applications AFTER their NEPA and state DOT permits are in hand have already burned 3–5 months
              of avoidable delay. Start joint-use Day 1 — every month of parallel processing is a month
              saved at the back end.
            </p>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Citations: 47 USC §224 (Pole Attachment Act); 54 USC §306108 (NHPA §106);
            36 CFR Part 800 (§106 implementing regs); Executive Order 13175 (tribal consultation);
            36 CFR §800.2(c)(2) (tribal consulting party requirements).
          </p>
        </div>

        {/* ── SCENARIO B ──────────────────────────────────────────────── */}
        <div className="mt-5 p-4 border border-white/15 rounded-xl bg-white/[0.02]">
          <h4 className="font-semibold text-cyan-300 mb-3">
            Scenario B — Underground Bore: USACE Wetland + Railroad Crossing + Municipal ROW
          </h4>
          <p className="text-sm text-slate-300/90 mb-3">
            <strong>Project description:</strong> 4-mile underground directional bore route in a
            semi-urban area. The route (a) passes through 0.08 acres of jurisdictional wetland (confirmed
            by NWI map + field delineation), (b) crosses a Class I railroad at-grade via horizontal
            directional drill (HDD) under the tracks, and (c) runs for 2 miles in a city street ROW under
            a municipal encroachment permit. Federal nexus: RUS loan (RUS as lead federal agency).
          </p>

          <p className="text-sm font-semibold text-slate-200 mb-1">Agencies and their authority:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90 mb-3">
            <li>
              <strong>USACE</strong> — CWA Section 404 permit (33 USC §1344) for the 0.08-acre wetland impact.
              At 0.08 acres, the project MAY qualify for Nationwide Permit (NWP) 12 — "Utility Line
              Activities" — which covers utility-line construction in waters of the U.S. provided total
              impacts are at or below NWP 12's threshold (verify current NWP 12 thresholds in the most
              recent USACE NWP reissuance — 2021 reissuance was current as of 2026; confirm with your
              USACE district office at time of project). If NWP 12 applies, USACE issues a Pre-Construction
              Notification (PCN) response within 45 days (33 CFR §330.6). If impacts exceed NWP thresholds
              or the USACE district adds conditions, an Individual Permit (IP) is required (6–12 months).
            </li>
            <li>
              <strong>Railroad (Class I carrier)</strong> — Railroad crossing agreement for the HDD under
              the tracks. Authority: the railroad company's standard crossing-agreement process (no single
              federal statute governs private railroad crossing agreements — the authority derives from
              property rights). The Federal Railroad Administration (FRA) may require a crossing permit
              or license depending on the railroad's status; 49 CFR Part 213 governs track safety but
              does not directly issue crossing agreements. The railroad may require a flagging service
              (railroad employee safety oversight during bore operations) at the applicant's cost, which
              adds $500–$2,000/day in field costs. Some Class I railroads require 90–180 days to process
              a crossing agreement application; they are not bound by a statutory review timeline.
            </li>
            <li>
              <strong>Municipality (Public Works or Engineering Department)</strong> — ROW encroachment
              permit for the 2-mile city street segment. Authority: local municipal code. Most municipalities
              require the USACE permit to be in hand before they will finalize the encroachment permit for
              any segment with a Section 404 wetland connection (the municipal permit depends on knowing that
              the federal water-body crossing is authorized).
            </li>
          </ul>

          <p className="text-sm font-semibold text-slate-200 mb-1">The NEPA → USACE NWP gating sequence:</p>
          <p className="text-sm text-slate-300/90 mb-2">
            Under RUS NEPA procedures (7 CFR Part 1b, eff. April 3, 2026), the lead federal agency (RUS)
            coordinates the NEPA review. The USACE Section 404 wetland permit is required before construction
            in any jurisdictional water of the U.S. — but the NEPA categorical exclusion (CE C-8 for this
            underground bore in existing ROW) can be evaluated in parallel with the USACE NWP application,
            not sequentially. The CE can be issued while the NWP PCN is in process, but <strong>construction
            cannot begin on the wetland segment until BOTH the CE AND the NWP authorization are in hand</strong>.
            The USACE Section 404 permit is NOT a prerequisite for the CE — they are parallel tracks with
            different issuing authorities.
          </p>

          <p className="text-sm font-semibold text-slate-200 mb-1">Correct call-order and schedule:</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-300/90">
            <li>
              <strong>Day 1:</strong> Submit USACE NWP 12 Pre-Construction Notification (PCN) for the
              0.08-acre wetland impact. Also initiate the RUS NEPA CE C-8 checklist with the extraordinary-
              circumstances documentation (the wetland presence is the extraordinary circumstance; NWP PCN
              submission demonstrates you are addressing it). Also submit railroad crossing application to
              the Class I carrier.
            </li>
            <li>
              <strong>Days 10–45:</strong> USACE reviews NWP 12 PCN. If the district issues no additional
              conditions and the project qualifies, USACE issues NWP 12 authorization. Attach NWP
              authorization to the municipal ROW encroachment permit application — municipal Engineering
              Department now knows the Section 404 issue is resolved and will process the encroachment permit.
            </li>
            <li>
              <strong>Days 14–30 (concurrent with USACE):</strong> RUS issues CE C-8 once extraordinary-
              circumstance analysis confirms NWP coverage of the wetland. CE clearance and NWP can land
              within days of each other.
            </li>
            <li>
              <strong>Weeks 4–8:</strong> Municipal encroachment permit issued once USACE NWP is in hand.
            </li>
            <li>
              <strong>Months 3–6:</strong> Railroad crossing agreement issued by the railroad company after
              their internal engineering review. THIS is typically the critical-path item — railroads are
              slow, not bound by statutory timelines, and may require multiple rounds of plan revisions.
              Start the railroad application on Day 1. Budget 90–180 days minimum.
            </li>
            <li>
              <strong>Construction authorized</strong> when USACE NWP + CE + municipal encroachment permit
              + railroad crossing agreement are all in hand.
            </li>
          </ol>

          <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-xs">
            <p className="font-semibold text-amber-300 mb-1">Book vs. Field — railroad crossings are the wildcard</p>
            <p className="text-slate-300/90">
              <strong>Book:</strong> Horizontal Directional Drilling (HDD) under railroad tracks is a
              well-established method for utility crossings. AREMA (American Railway Engineering and
              Maintenance-of-Way Association) Manual Chapter 1 (Roadway and Ballast) and Chapter 2
              (Tunnels) describe clearance requirements for bored crossings. The bore depth must provide
              adequate clearance below the bottom of ties (typically 5 ft minimum, but verify with the
              specific railroad's engineering standards).
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>Field:</strong> Each Class I railroad (BNSF, UP, CSX, Norfolk Southern, CN/IC, CPKC)
              has its own Fiber Optic Liaison or Engineering Services department that handles crossing
              applications. They are not AREMA references — they are individual corporate entities with
              individual review processes, fees, and timelines. CSX crossing agreements can take 6 months;
              BNSF has a formal "Fiber Optic Application" process with a designated fee schedule. Missing the
              railroad application by even 30 days while you finish other permits can push your entire
              project 90 days right. Start the railroad crossing application the same day you mobilize on
              any other permit.
            </p>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Citations: 33 USC §1344 (CWA §404); 33 CFR Part 330 (USACE NWP program);
            NWP 12 "Utility Line Activities" — verify current thresholds against most recent
            USACE NWP reissuance at time of project; 7 CFR Part 1b (eff. April 3, 2026;
            replaced 7 CFR Part 1970); AREMA Manual Ch. 1 (Roadway and Ballast).
          </p>
        </div>

        {/* ── SCENARIO C ──────────────────────────────────────────────── */}
        <div className="mt-5 p-4 border border-white/15 rounded-xl bg-white/[0.02]">
          <h4 className="font-semibold text-cyan-300 mb-3">
            Scenario C — Mixed Aerial/Underground Urban: Utility Coordination and Re-Route Decisions
          </h4>
          <p className="text-sm text-slate-300/90 mb-3">
            <strong>Project description:</strong> 6-mile mixed urban route. Planned as aerial
            for 4 miles (attaching to existing utility poles in a congested urban street corridor)
            and underground HDD for 2 miles where the aerial corridor is not available. The project
            has BEAD funding (federal nexus). During the make-ready survey, the IOU pole owner
            reports that 1.8 miles of poles require major make-ready work (rearrangement or
            replacement) that the IOU is unwilling to perform within the project schedule — they
            will not grant attachment authorization for those poles. A re-route decision is required.
          </p>

          <p className="text-sm font-semibold text-slate-200 mb-1">The re-route decision tree and its permit implications:</p>
          <p className="text-sm text-slate-300/90 mb-2">
            When a pole owner denies or delays aerial attachment, you have three options:
          </p>
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs border border-white/10 rounded-lg">
              <thead className="bg-white/5 text-slate-200">
                <tr>
                  <th className="px-2 py-2 text-left">Re-route option</th>
                  <th className="px-2 py-2 text-left">New permits triggered</th>
                  <th className="px-2 py-2 text-left">NEPA impact</th>
                  <th className="px-2 py-2 text-left">Schedule impact</th>
                </tr>
              </thead>
              <tbody className="text-slate-300/90">
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2"><strong>A. Convert to underground HDD</strong> on the denied segment (stay in the same street corridor, go underground instead)</td>
                  <td className="px-2 py-2">New HDD encroachment permit from municipality or state DOT (if state highway). May trigger USACE Section 404 if segment crosses any jurisdictional waters not previously in scope.</td>
                  <td className="px-2 py-2">If still within existing street ROW: CE C-8 still applies (same corridor, different construction method). Extraordinary-circumstances checklist re-run for the underground footprint (utility crossings, groundwater, contaminated soils). No NEPA restart if CE still fits.</td>
                  <td className="px-2 py-2">+60–90 days for underground encroachment permit; potentially +45 days if new USACE NWP PCN required. Fastest option if NEPA fits.</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2"><strong>B. Alternate aerial route</strong> on different streets or utility corridors with cooperative pole owners</td>
                  <td className="px-2 py-2">New joint-use application(s) to different pole owner(s). New state DOT or municipal encroachment permit for the alternate street corridor. Possible new NHPA §106 APE if the alternate route moves into a different historic district or near tribal lands.</td>
                  <td className="px-2 py-2">Alternate route = new project footprint. CE C-8 checklist re-run on the new footprint — extraordinary-circumstances check must cover the NEW APE, NEW T&E habitat, NEW wetland footprint. If the alternate route enters new environmental resources, NEPA analysis must expand. This can restart the §106 and USFWS consultations for the new footprint segments.</td>
                  <td className="px-2 py-2">+90–180 days or more if NEPA and §106 must be re-scoped. Most disruptive option if the alternate route is substantially different.</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="px-2 py-2"><strong>C. Dispute the pole owner's make-ready cost or denial via FCC §224 process</strong></td>
                  <td className="px-2 py-2">FCC complaint under 47 USC §224 if the pole owner's rates or attachment terms are unreasonable. State PUC complaint if a state PUC has pole-attachment jurisdiction (varies: some states pre-empted by FCC jurisdiction, others maintain state jurisdiction).</td>
                  <td className="px-2 py-2">NEPA review is independent of the §224 dispute — environmental permits do not wait for the FCC complaint to resolve. However, construction cannot begin until both the §224 dispute resolves AND environmental/ROW permits are in hand.</td>
                  <td className="px-2 py-2">FCC complaint resolution: 6–18 months. Use this only when the denied attachment is essential to the route and no practical alternate exists. Typically combined with Option A or B as the fallback construction path.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm font-semibold text-slate-200 mb-1">Sequencing discipline when re-routes occur mid-permitting:</p>
          <p className="text-sm text-slate-300/90">
            Mid-project re-routes are the most disruptive sequencing event because they can
            invalidate permits already in hand. The rule: <strong>before submitting any permit
            application, confirm that the route is stable and all segments have a viable
            right-of-entry path</strong>. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90 mt-2">
            <li>
              <strong>Joint-use make-ready survey BEFORE final route lock.</strong> The make-ready
              survey is the earliest signal of whether an aerial attachment path is viable. Initiate
              the make-ready survey before you begin detailed permitting — if the pole owner signals
              major problems at survey, you can re-route BEFORE the NEPA and state DOT applications
              are in flight. Changing the NEPA footprint mid-process can require restarting the §106
              and T&E consultations.
            </li>
            <li>
              <strong>Underground option assessment in parallel.</strong> For any urban mixed route,
              assess the underground HDD option simultaneously with the aerial option. Having a
              pre-scoped underground alternative means that if aerial is denied, you can execute the
              alternative without losing permit time.
            </li>
            <li>
              <strong>NEPA footprint definition must be conservative (buffer the APE).</strong> Define
              the Area of Potential Effect (APE) for §106 and the extraordinary-circumstances boundary
              for the CE to include likely re-route corridors, not just the current centerline. A slightly
              larger initial APE avoids restarting the §106 consultation if the route shifts by 200 feet
              within the same general corridor.
            </li>
            <li>
              <strong>Underground in existing ROW doesn't automatically re-trigger NEPA.</strong> If you
              convert an aerial segment to underground HDD within the same street corridor already covered
              by your CE C-8 documentation, the CE generally still applies — you haven't expanded the
              environmental footprint, you've changed the construction method within the same corridor.
              Document the method change in an addendum to the CE checklist and confirm with the lead
              federal agency that no extraordinary circumstances were introduced by the underground work
              (contaminated soils, groundwater impacts, utility crossings).
            </li>
          </ul>

          <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-xs">
            <p className="font-semibold text-amber-300 mb-1">Book vs. Field — the APE buffer strategy</p>
            <p className="text-slate-300/90">
              <strong>Book (36 CFR §800.16(d)):</strong> The Area of Potential Effect (APE) for
              NHPA §106 is defined as the geographic area within which an undertaking may directly
              or indirectly cause alterations in the character or use of historic properties. The APE
              is defined by the lead federal agency, not the applicant.
            </p>
            <p className="text-slate-300/90 mt-1">
              <strong>Field:</strong> Engineers routinely define the APE as a tight buffer around the
              planned centerline (e.g., 50-foot corridor each side). If the route shifts 75 feet due to
              a make-ready denial, the new footprint is outside the original APE — the §106 consultation
              must be re-scoped or restarted. Experienced OSP engineers buffer the APE to 150–200 feet
              each side of the centerline in urban or historic areas, accepting a slightly longer initial
              §106 review in exchange for insurance against route changes. This is not required by
              36 CFR Part 800, but it is established field practice for routes with complex ownership
              or make-ready uncertainty.
            </p>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Citations: 47 USC §224 (Pole Attachment Act); 36 CFR §800.16(d) (APE definition);
            54 USC §306108 (NHPA §106); 7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR Part 1970);
            33 USC §1344 (CWA §404 for underground segments with wetland crossings).
          </p>
        </div>

        {/* ── END WORKED SCENARIOS ──────────────────────────────────────── */}

        <h3 className="mt-5 font-semibold">EA vs. EIS — where the line falls</h3>
        <p>
          When a CE cannot be used (extraordinary circumstances exist), the lead federal
          agency has to decide: is an EA sufficient, or does the project require a full EIS?
          The legal standard is whether the project "may significantly affect the quality of
          the human environment" (42 USC §4332(C)).
        </p>
        <p className="mt-2">
          "Significantly" has been defined in CEQ regulations (historically at 40 CFR §1508.27,
          which was removed effective January 8, 2026) along two dimensions that remain the
          substantive standard even as the regulatory text changed:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Context</strong> — the setting matters. An aerial bore in a local
            highway corridor has different significance than the same bore running through
            a designated Wilderness Area.
          </li>
          <li>
            <strong>Intensity</strong> — the degree of impact matters. Ten CEQ factors
            (including T&E species, controversial impacts, uncertainty, precedent-setting,
            and cumulative effects) are weighed to assess intensity.
          </li>
        </ul>
        <p className="mt-2">
          For standard fiber routes, the EA typically concludes in a FONSI because the
          impacts are localized, reversible, and mitigable. An EIS is the rare outcome
          for large-scale disturbance (new ROW clearing through forested habitat, major
          river crossings) or highly controversial projects where no FONSI can withstand
          public scrutiny.
        </p>

        <h3 className="mt-5 font-semibold">RUS vs. NTIA NEPA procedures — related but not identical</h3>
        <p>
          USDA/RUS and NTIA both have CE procedures for utility communications construction
          in existing ROW, but they use different CE frameworks and implementing procedures:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>
            <strong>RUS:</strong> 7 CFR Part 1b (effective April 3, 2026; replaced 7 CFR Part
            1970, 2016 rule). RUS uses its own CE designation (CE C-8 is RUS nomenclature).
            CE checklist and extraordinary-circumstances review are agency-internal processes
            coordinated with the RUS Area Director.
          </li>
          <li>
            <strong>NTIA/BEAD:</strong> NTIA's 2024 CE rulemaking adopted Commerce
            Department-level CEs — it explicitly did NOT adopt CE C-8, noting that CE C-8
            actions are covered by existing Department-wide CEs. NTIA/state broadband office
            NEPA processes vary by state BEAD plan. Verify the state's specific NEPA process
            with the NTIA-approved state broadband office before starting.
          </li>
        </ul>

        <div className="mt-4 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-2">FCC CE for Aerial Fiber — 47 CFR §1.1306</p>
          <p className="text-slate-300/90">
            NEPA applies to fiber projects with a federal nexus from BEAD or RUS funding. But
            what about fiber projects with a federal nexus from an FCC license or authorization?
            The FCC has its own NEPA implementing rules (47 CFR Part 1, Subpart I). Under
            47 CFR §1.1306, the installation of aerial wire or cable over existing aerial
            corridors of prior or permitted use is <strong>directly</strong> categorically
            excluded from NEPA environmental processing — the regulation states explicitly
            that such installations do not require an Environmental Assessment. This is a direct
            CE, not an extension from the antenna provision. For OSP projects that require FCC
            authorization (licensed spectrum, microwave backhaul, or facilities subject to
            FCC environmental review), 47 CFR §1.1306 is the applicable CE — not CE C-8.
            Confirm with the applicable FCC authorization bureau when a federal nexus flows
            from an FCC action rather than a USDA or NTIA funding source.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Source: 47 CFR §1.1306 (FCC environmental NEPA CE); verify current applicability
            at ecfr.gov and with the relevant FCC bureau at time of project.
          </p>
        </div>

        <p className="mt-2 text-sm text-slate-300/70">
          Source: 7 CFR Part 1b (effective April 3, 2026; FR 2026-06537) [verify current
          section numbers against ecfr.gov at time of project]. NTIA BEAD procedures [confirm
          with state's BEAD volume 2 environmental compliance documents at time of project].
        </p>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="NEPA CE Screening: Does Your Route Qualify?"
        description="You're permitting a BEAD-funded aerial fiber route. Walk through the CE C-8 screening to find out if you stay in the fast lane."
        scenarioId="T09-L02-nepa-screening"
        initialNodeId="start"
        nodes={[
          {
            id: 'start',
            text: 'Your BEAD-funded aerial fiber route runs 8 miles along a state highway ROW. Most of the route is in the shoulder; the DOT encroachment permit is in process. Step 1 of CE C-8 screening: Is the project within or adjacent to existing ROW?',
            choices: [
              { label: 'Yes — the entire route is in the existing highway ROW', nextId: 'roe-yes' },
              { label: 'Mostly yes, but 0.3 miles deviates 60 ft into a field to avoid a utility conflict', nextId: 'roe-partial' },
            ],
          },
          {
            id: 'roe-yes',
            text: 'Good — CE C-8 type fits. Now run the extraordinary-circumstances check. Your route crosses a segment where the state wildlife agency has mapped documented Northern Long-Eared Bat (NLEB) habitat. The NLEB was reclassified from Threatened to Endangered in February 2023. Does this trigger an extraordinary circumstance?',
            choices: [
              { label: 'No — bat habitat is common in rural areas; CE still applies', nextId: 'bat-wrong' },
              { label: 'Yes — T&E species habitat is an extraordinary circumstance; CE is suspended pending ESA check', nextId: 'bat-right' },
            ],
          },
          {
            id: 'roe-partial',
            text: 'The 0.3-mile field deviation is a problem. That segment may no longer qualify as "within or adjacent to existing ROW." Depending on interpretation and ground conditions, it may require an elevated NEPA analysis for that segment — typically an EA. Your options: (1) redesign to stay in ROW (may not be feasible), or (2) document why the deviation is still "adjacent" (tight argument) or prepare a limited EA for that segment only. Result: schedule impact of 3–6 months for the EA segment.',
            isTerminal: true,
            outcome: 'RESULT: CE applies to the in-ROW segments; EA required for the 0.3-mile field deviation. Schedule risk: +3–6 months on that segment. Lesson: route design choices made in T04 (Route Survey) directly affect NEPA outcomes. Staying in existing ROW is not just a cost choice — it\'s an environmental strategy.',
          },
          {
            id: 'bat-wrong',
            text: 'Incorrect. Under 40 CFR §1508.4 and the agency CE procedures, a known T&E species (or its mapped habitat) in the project footprint is an extraordinary circumstance that prevents CE from applying without further analysis. The NLEB\'s 2023 Endangered reclassification makes this even clearer — the species now gets full Section 7 consultation. You must run the IPaC DKey tool and initiate ESA Section 7 consultation with USFWS before the CE can be cleared. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'roe-yes' }],
          },
          {
            id: 'bat-right',
            text: 'Correct. NLEB Endangered status means your route in mapped habitat triggers an extraordinary circumstance. You cannot use CE C-8 without completing ESA Section 7 consultation. You run the IPaC DKey tool. The tool returns: "No tree-clearing proposed in this project footprint." You verify: your aerial route uses existing poles; no new pole placements require tree clearing. Does this resolve the extraordinary circumstance?',
            choices: [
              { label: 'Yes — no tree clearing means no NLEB impact; CE is clear', nextId: 'bat-clear' },
              { label: 'No — I still need to call USFWS regardless', nextId: 'bat-call' },
            ],
          },
          {
            id: 'bat-call',
            text: 'This is the cautious field approach and generally the right call. Even without tree clearing, informal consultation with the USFWS field office is recommended to document the "no effect" determination. The USFWS may issue a concurrence letter (informal §7) that satisfies the extraordinary-circumstances check without formal consultation. Timeline: 30–60 days for informal concurrence. This gives you a defensible CE record. Result: CE clears with documented informal §7 concurrence.',
            isTerminal: true,
            outcome: 'COMPLETED: CE C-8 applies with documented informal ESA §7 concurrence. No tree clearing = no primary NLEB impact pathway. Informal USFWS concurrence documents the finding. Lesson: extraordinary circumstances don\'t always kill the CE — they require documented analysis and, in many cases, agency coordination to confirm the impact pathway doesn\'t exist.',
          },
          {
            id: 'bat-clear',
            text: 'This approach is legally defensible IF the project truly has no impact pathway for NLEB (no tree clearing, no ground disturbance in hibernacula areas, no disruption of foraging corridors). However, relying solely on "no tree clearing" without any USFWS coordination is risky — the extraordinary circumstance requires documented resolution, not just internal analysis. In practice, an informal check with the USFWS field office (30–60 days) provides a defensible record. Proceeding without any USFWS contact is a compliance gap that a federal audit would flag.',
            isTerminal: true,
            outcome: 'RESULT: Technically possible to proceed with CE if the no-impact rationale is documented thoroughly. Field best practice: still contact USFWS informally for a concurrence letter. The extra 30–60 days is insurance against a retroactive compliance question. Lesson: "we have a good argument" is not the same as "we have a defensible record." Document the extraordinary-circumstances analysis even when the answer is no impact.',
          },
        ]}
      />

      {/* ── MULTI-TRIGGER BRANCHING SCENARIO ────────────────────────────── */}
      <BranchingScenario
        title="Multi-Trigger Agency Call Order"
        description="When multiple extraordinary circumstances occur together, federal agency call order determines your timeline. Walk through a three-agency scenario."
        scenarioId="T09-L02-multi-agency"
        initialNodeId="start-multi"
        nodes={[
          {
            id: 'start-multi',
            text: 'Your site survey for a 12-mile BEAD aerial fiber route identifies THREE extraordinary circumstances: (1) Northern Long-Eared Bat (T&E species) documented in the corridor, (2) a historic railroad grade with cultural significance in the APE (Area of Potential Effect), and (3) a 0.4-mile perennial stream crossing. Which federal agency consultation MUST complete first to unblock construction?',
            choices: [
              { label: 'USFWS Section 7 (T&E species) is highest stakes — start USFWS first', nextId: 'usfws-first-wrong' },
              { label: 'SHPO Section 106 (historic properties) has the longest fixed procedural clock — start SHPO first', nextId: 'shpo-first-correct' },
              { label: 'USACE Section 404 (wetlands permit) is the legal gate for water work — start USACE first', nextId: 'usace-first-wrong' },
            ],
          },
          {
            id: 'usfws-first-wrong',
            text: 'USFWS Section 7 is required and important, but it does NOT have the longest procedural timeline. Section 7 informal consultation takes 30–90 days. However, NHPA Section 106 (historic properties) has a fixed 30-day SHPO review window, and if SHPO objects, MOA negotiations can extend the clock by 6–12 months. Section 106 is the critical path. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'start-multi' }],
          },
          {
            id: 'usace-first-wrong',
            text: 'USACE Section 404 (wetlands) and NWP/Individual Permit is required, and it IS a gate for water-crossing work. However, the Section 404 timeline (10–20 business days for NWP, 6–12 months for Individual Permit) is faster than NHPA Section 106. When you have multiple agency requirements, the slowest-clock item drives the critical path. That\'s Section 106 (NHPA). Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'start-multi' }],
          },
          {
            id: 'shpo-first-correct',
            text: 'Correct. NHPA Section 106 consultation with the State Historic Preservation Office (SHPO) has a 30-day statutory review window from when the SHPO receives the Notice of Applicability (NOA). If SHPO has no objections, that\'s 30 days. If SHPO objects, Memoranda of Agreement (MOA) negotiations begin, and those can take 3–12 months depending on mitigation complexity. Section 106 becomes the critical-path item that determines when the lead federal agency (RUS or NTIA) can issue environmental clearance. The USFWS Section 7 consultation and USACE Section 404 permit can run in parallel with Section 106, but they all must complete before the CE/FONSI is issued. Your response?',
            choices: [
              { label: 'Initiate all three (SHPO §106 + USFWS §7 + USACE §404) on Day 1, run in parallel, track Section 106 as the critical-path gating item', nextId: 'multi-parallel-correct' },
              { label: 'Wait for USACE Section 404 to clear first, then approach SHPO, then USFWS', nextId: 'multi-sequential-wrong' },
            ],
          },
          {
            id: 'multi-parallel-correct',
            text: 'Correct. All three consultations START simultaneously (Day 1). You send the NOA to SHPO, submit the NWP pre-application to USACE, and submit the IPaC results + ESA consultation package to USFWS. Each agency reviews on their own timeline. USFWS likely finishes first (30–90 days). USACE NWP follows (10–20 biz days if no complications, or 6–12 months for Individual Permit). SHPO review is 30 days to initial response, but potential MOA negotiations extend the clock to 3–12 months. By running all three in parallel, you compress the overall timeline to the longest single track (Section 106) rather than stacking them sequentially (which would add 9–18+ months of delays). Typical timeline when all run in parallel: 4–6 months best case (no MOA); 9–18 months worst case (full MOA negotiation on historic mitigation). Result: FONSI/CE cleared when all three close.',
            isTerminal: true,
            outcome: 'COMPLETED: All three agency consultations run in parallel from Day 1. SHPO Section 106 is the critical-path gating item (longest clock). USFWS §7 and USACE §404 must also conclude before environmental clearance, but can proceed in parallel. Timeline: 4–6 months best case; up to 18 months if MOA negotiations are complex. Lesson: when multiple extraordinary circumstances exist, identify the agency with the longest procedural clock, make that the scheduling anchor, and launch all other consultations simultaneously to compress the overall timeline.',
          },
          {
            id: 'multi-sequential-wrong',
            text: 'Sequential approval (USACE → SHPO → USFWS) stacks the timelines and burns 9–18 months of delay. USACE Section 404 clears in 10–20 days (best case) to 6–12 months (worst case). Then you approach SHPO — another 30 days to 6–12 months (if MOA). Then USFWS — another 30–90 days. Total: you\'ve added 6–18 months of sequential waiting. The correct approach is to launch all three simultaneously and let them proceed in parallel. That way, the overall timeline is driven by the slowest single track (SHPO), not the sum of all tracks.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'shpo-first-correct' }],
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T09"
        assessmentId="T09-L02"
        title="T09.L02 Check — NEPA: CE, EA, and EIS"
        fallback={
      <Quiz
        title="T09.L02 Check — NEPA: CE, EA, and EIS"
        mode="multiple-choice"
        questions={[
          {
            id: 'T09-L02-Q1',
            type: 'mc',
            prompt:
              'What is the correct order of NEPA review tiers from least to most intensive?',
            choices: [
              'EIS → EA → CE (most to least)',
              'CE → EA → EIS (least to most)',
              'EA → CE → EIS',
              'FONSI → EA → CE',
            ],
            answerIndex: 1,
            explanation:
              'The three NEPA tiers from least to most intensive are: (1) Categorical Exclusion (CE) — no EA/EIS required, pre-determined non-significant; (2) Environmental Assessment (EA) — mid-level analysis leading to FONSI or requirement for EIS; (3) Environmental Impact Statement (EIS) — full-scale analysis for actions that may significantly affect the environment. FONSI is an outcome of a successful EA, not a separate tier.',
            citation: '42 USC §4332 (NEPA statutory tiers). [Note: CEQ implementing regulations at 40 CFR Parts 1500–1508 removed eff. January 8, 2026 — NEPA tiers now implemented through agency-specific procedures.]',
          },
          {
            id: 'T09-L02-Q2',
            type: 'mc',
            prompt:
              'A BEAD-funded aerial fiber route qualifies for CE C-8 based on its project type (utility construction in existing ROW). The route corridor includes documented habitat for the Northern Long-Eared Bat, an Endangered species. What must happen before the CE can be used?',
            choices: [
              'Nothing — CE C-8 is automatic for utility construction in existing ROW regardless of species presence',
              'The extraordinary circumstance must be resolved — typically by running the IPaC tool and either confirming no impact pathway or completing informal ESA Section 7 consultation',
              'The project must prepare a full Environmental Impact Statement (EIS)',
              'The CE cannot be used at all; an EA is mandatory whenever T&E species are present',
            ],
            answerIndex: 1,
            explanation:
              'T&E species or critical habitat in the project footprint is an extraordinary circumstance that prevents CE from applying without further analysis. However, an extraordinary circumstance does not automatically require an EA or EIS — it requires documented resolution of the circumstance. If analysis shows no impact pathway (e.g., no tree clearing in bat habitat) and USFWS concurs, the CE can still be used with the documented concurrence. An EA is required only if the extraordinary circumstance cannot be resolved at the CE level.',
            citation: 'Extraordinary circumstances concept per CEQ/agency procedures (40 CFR §1508.4 removed eff. Jan. 8, 2026; concept survives in agency procedures); 7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR §1970.54); ESA §7 (16 USC §1536).',
          },
          {
            id: 'T09-L02-Q3',
            type: 'mc',
            prompt:
              'A BEAD fiber project completes an Environmental Assessment (EA). The lead federal agency concludes there is no significant environmental impact. What document does the agency issue to authorize the project to proceed?',
            choices: [
              'A Record of Decision (ROD)',
              'An Environmental Impact Statement (EIS)',
              'A Finding of No Significant Impact (FONSI)',
              'A CE C-8 Checklist',
            ],
            answerIndex: 2,
            explanation:
              'When an EA concludes that a project will not significantly affect the environment, the lead federal agency issues a Finding of No Significant Impact (FONSI). The FONSI is the authorization to proceed without an EIS. A Record of Decision (ROD) is issued at the conclusion of an EIS process, not an EA. A CE checklist is used when no EA is required at all.',
            citation: 'FONSI definition per CEQ/agency procedures (40 CFR §1508.1(l) removed eff. Jan. 8, 2026; 42 USC §4332(C) remains statutory anchor); 40 CFR Part 1501 procedures removed eff. Jan. 8, 2026 — see agency-specific NEPA procedures.',
          },
          {
            id: 'T09-L02-Q4',
            type: 'mc',
            prompt:
              'CE C-8 applies to which type of construction?',
            choices: [
              'Any construction project receiving federal funding',
              'Aerial or buried utility and communications construction within or adjacent to existing rights-of-way',
              'New road construction and utility relocation',
              'Only underground directional boring, not aerial pole attachment',
            ],
            answerIndex: 1,
            explanation:
              'CE C-8 specifically covers aerial or buried utility and communications construction within or adjacent to existing rights-of-way. It applies to both aerial (pole-mounted fiber) and buried (direct-buried or conduit) construction in existing utility corridors. It does NOT apply to any federally-funded project generally — the project type must match the CE\'s scope, and extraordinary circumstances must still be checked. [Confirm current CE C-8 language against NTIA and 7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR Part 1970) at time of project.]',
            citation: '7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR §1970.54); NTIA BEAD NEPA procedures.',
          },
          {
            id: 'T09-L02-Q5',
            type: 'mc',
            prompt:
              'A BEAD fiber project triggers THREE extraordinary circumstances simultaneously: historic properties in the APE (Section 106), threatened and endangered species habitat (Section 7), and wetlands (Section 404). Which agency consultation MUST complete first to unblock the project from proceeding?',
            choices: [
              'USFWS Section 7 (ESA) — T&E species are the highest biological priority',
              'USACE Section 404 (CWA) — water permits are the legal prerequisite for any water crossing',
              'SHPO Section 106 (NHPA) — historic property consultation has the longest fixed procedural clock',
              'All three must be completed simultaneously in any order',
            ],
            answerIndex: 2,
            explanation:
              'When multiple extraordinary circumstances trigger multiple agency consultations, the critical-path item is the one with the longest procedural timeline. NHPA Section 106 consultation with SHPO has a statutory 30-day review window (if no objections) but can extend 3–12 months or longer if Memoranda of Agreement (MOA) negotiations are required for historic mitigation. In contrast, USFWS Section 7 informal consultation is typically 30–90 days, and USACE Section 404 NWP authorization is 10–20 business days (or 6–12 months for Individual Permit if NWP doesn\'t apply). All three must conclude before environmental clearance, but they should START simultaneously to compress the overall timeline to the longest single track. The orchestration: Day 1, issue NOA to SHPO, submit IPaC/ESA package to USFWS, submit NWP application to USACE. They proceed in parallel. Section 106 becomes the schedule anchor because its clock can stretch longest.',
            citation: 'NHPA §106 procedure per 54 USC §306108; ESA §7 consultation per 16 USC §1536; CWA §404 permitting per 33 USC §1344; 7 CFR Part 1b (eff. April 3, 2026; replaced 7 CFR Part 1970).',
          },
        ]}
      />
        }
      />

    </LessonLayout>
  );
}
