// T09.L05 — USACE Wetlands Permits — NWP 57 and the Section 404 Framework
// Working lesson: CWA §404, RHA §10, NWP 57 for telecom, PCN triggers, individual permit threshold
// Source: net-new (NWP 57 detail per ARCH.md)
// Authority: 33 USC §1344 (CWA §404); 33 CFR Part 320-332 (USACE NW framework);
//            USACE NWP 57 (2021 reissuance — verify current reissuance at publication time)
// NOTE: NWP 57 covers telecom/electric utility line activities post-2021 reissuance.
//       Prior materials may reference NWP 12 for telecom — NWP 12 now covers oil/gas pipelines only.
//       See Section 9 of T09_BRIEF.md for the history.

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L05',
  course_id: 'T09',
  title: 'USACE Wetlands Permits — NWP 57 and the Section 404 Framework',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T09.L01', 'T09.L02'],
  learning_objectives: [
    'Identify when a fiber bore or trench crossing triggers NWP 57 versus an individual permit',
    'Explain when a pre-construction notification (PCN) is required under NWP 57',
    'Apply the jurisdictional determination process when WOTUS status is uncertain post-Sackett',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'Section 404 (CWA)',
    'Section 10 (RHA)',
    'waters of the US (WOTUS)',
    'NWP 57',
    'PCN (pre-construction notification)',
    'individual permit',
    '33 CFR Part 330',
    'jurisdictional determination',
  ],
  key_terms: [
    {
      term: 'Section 404 (CWA)',
      definition:
        'Section 404 of the Clean Water Act (33 USC §1344) — grants the U.S. Army Corps of Engineers (USACE) authority to regulate the discharge of dredged or fill material into waters of the United States (WOTUS), including wetlands. For fiber projects, any bore, trench, or conduit installation that discharges fill material into a jurisdictional wetland or navigable waterway triggers Section 404.',
    },
    {
      term: 'Section 10 (RHA)',
      definition:
        'Section 10 of the Rivers and Harbors Act of 1899 (33 USC §403) — requires USACE authorization for any obstruction or alteration of a navigable waterway. For fiber crossings of navigable rivers (not just wetlands), Section 10 applies in addition to (or instead of) Section 404. Many USACE permits, including NWP 57, cover both Section 404 and Section 10 activities in a single authorization.',
    },
    {
      term: 'waters of the US (WOTUS)',
      definition:
        'Waters of the United States — the jurisdictional scope of USACE Section 404 authority. Historically included navigable waterways, their tributaries, wetlands adjacent to those waters, and certain isolated waters with a "significant nexus" to navigable waters. The 2023 Supreme Court decision in Sackett v. EPA narrowed the WOTUS definition, particularly for wetlands not continuously connected to navigable waters. WOTUS scope is actively litigated and subject to regulatory change — verify current scope with the relevant USACE district before assuming jurisdiction or non-jurisdiction.',
    },
    {
      term: 'NWP 57',
      definition:
        'Nationwide Permit 57 — the USACE permit authorizing utility line activities for electric utility lines, telecommunications lines, and other utility lines, issued as part of the 2021 nationwide permit reissuance. NWP 57 replaced NWP 12 coverage for telecom activities (NWP 12 post-2021 covers oil/gas pipelines only). NWP 57 is a general permit — it pre-authorizes qualifying activities without requiring individual-permit review, subject to conditions including PCN requirements for larger impacts. [Verify current NWP number, conditions, and PCN thresholds against the USACE reissuance current at time of project — NWPs are reissued on 5-year cycles.]',
    },
    {
      term: 'PCN (pre-construction notification)',
      definition:
        'Pre-construction notification — a notification submitted to the USACE district office before beginning work authorized under a nationwide permit (including NWP 57) when specific conditions trigger the PCN requirement. PCN is required when a project exceeds certain acreage or linear-foot thresholds, affects wetlands above a set area, or when listed conditions (species habitat, cultural resources, proximity to special aquatic sites) are present. USACE has 45 days to respond to a PCN; the applicant may proceed after 45 days if no USACE objection is received. [Confirm current PCN thresholds against the active USACE NWP reissuance.]',
    },
    {
      term: 'individual permit',
      definition:
        'A project-specific USACE permit issued after a full public interest review when a nationwide permit (NWP) is not available or when a project\'s impacts exceed NWP thresholds. Individual permits require a full permit application, public notice, comment period, and USACE environmental review. Processing time for individual permits is typically 6–12 months, compared to 45 days for a PCN under an NWP. Individual permits are required when a project will impact more than the NWP threshold acreage of wetlands or when the USACE district determines the nationwide permit is not appropriate for the project.',
    },
    {
      term: '33 CFR Part 330',
      definition:
        'Title 33 of the Code of Federal Regulations, Part 330 — the regulatory framework governing USACE nationwide permits, including general conditions, PCN requirements, and the 5-year reissuance cycle. 33 CFR §330.5 lists the general nationwide permit conditions that apply to all NWPs including NWP 57.',
    },
    {
      term: 'jurisdictional determination',
      definition:
        'A USACE determination of whether a specific area (wetland, waterbody, tributary) constitutes WOTUS and is therefore subject to USACE Section 404 authority. A preliminary jurisdictional determination (PJD) is a non-binding estimate; an approved jurisdictional determination (AJD) is a binding determination that can be appealed. After the 2023 Sackett v. EPA decision, JD requests have become more common as applicants and USACE districts work through the narrowed WOTUS definition in specific cases.',
    },
  ],
  vocabulary_assumed: [
    { term: 'federal nexus', source_lesson_id: 'T09.L01' },
    { term: 'jurisdictional trigger', source_lesson_id: 'T09.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'route survey wetland flags', source_lesson_id: 'T04.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L05_USACEWetlandsNWP57() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When a fiber route crosses a wetland, a stream, a seasonal drainage ditch, or any
          other water body, it may need a federal permit from the U.S. Army Corps of Engineers
          (USACE). This isn't about the fiber itself — it's about the{' '}
          <strong>fill material</strong> that goes into the ground during construction.
          When your bore crew pushes a conduit under a creek, some disturbed material ends
          up in the water. That's a discharge of fill — and that's what triggers federal
          jurisdiction under the <strong>Clean Water Act Section 404 (CWA §404)</strong>.
        </p>
        <p className="mt-2">
          The most important permit to know for fiber and telecom projects is{' '}
          <strong>NWP 57</strong> — a "nationwide permit" that pre-authorizes standard utility
          line activities in wetlands and waterways. Think of NWP 57 as the government's
          pre-printed stamp of approval for routine crossings, as long as you stay within
          defined limits. Go over those limits, and you need a full individual permit review
          — which takes 6–12 months instead of 45 days.
        </p>
        <p className="mt-2">
          <strong>Important history note:</strong> If you read older fiber permitting
          materials, you'll see references to "NWP 12" for telecom crossings. As of 2021,
          that changed: NWP 12 now covers oil and gas pipelines only. Telecom and electric
          utility lines moved to NWP 57 in the 2021 nationwide permit reissuance. Any team
          citing "NWP 12 for fiber" is working from outdated guidance.
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
              <td className="px-3 py-2 font-mono">USACE</td>
              <td className="px-3 py-2">U.S. Army Corps of Engineers</td>
              <td className="px-3 py-2">The federal agency that issues wetland crossing permits</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CWA</td>
              <td className="px-3 py-2">Clean Water Act</td>
              <td className="px-3 py-2">The federal law giving USACE authority to regulate discharges into WOTUS</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">WOTUS</td>
              <td className="px-3 py-2">Waters of the United States</td>
              <td className="px-3 py-2">The jurisdictional scope — what USACE can regulate (definition narrowed by Sackett v. EPA, 2023)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NWP</td>
              <td className="px-3 py-2">Nationwide Permit</td>
              <td className="px-3 py-2">USACE general permits that pre-authorize standard activities; reissued every 5 years</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NWP 57</td>
              <td className="px-3 py-2">Nationwide Permit 57</td>
              <td className="px-3 py-2">The specific NWP covering telecom and electric utility line activities (since 2021)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PCN</td>
              <td className="px-3 py-2">Pre-construction notification</td>
              <td className="px-3 py-2">Notice to USACE before construction when crossing impacts exceed basic NWP thresholds</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">JD</td>
              <td className="px-3 py-2">Jurisdictional determination</td>
              <td className="px-3 py-2">USACE ruling on whether a specific water/wetland is subject to their authority</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T09-L05"
          cards={[
            {
              id: 'T09-L05-fc-sec404',
              front: 'What does CWA Section 404 regulate and who administers it?',
              back: 'Section 404 of the Clean Water Act (33 USC §1344) — grants the U.S. Army Corps of Engineers (USACE) authority to regulate the discharge of dredged or fill material into waters of the United States (WOTUS), including wetlands. For fiber projects, any bore, trench, or conduit installation that discharges fill material into a jurisdictional wetland or navigable waterway triggers Section 404.',
            },
            {
              id: 'T09-L05-fc-wotus',
              front: 'What does WOTUS mean and why is it important to verify post-2023?',
              back: 'Waters of the United States — the jurisdictional scope of USACE Section 404 authority. The 2023 Supreme Court decision in Sackett v. EPA narrowed the WOTUS definition, particularly for wetlands not continuously connected to navigable waters. WOTUS scope is actively litigated and subject to regulatory change — verify current scope with the relevant USACE district before assuming jurisdiction or non-jurisdiction.',
            },
            {
              id: 'T09-L05-fc-nwp57',
              front: 'What is NWP 57 and what replaced NWP 12 for telecom?',
              back: 'Nationwide Permit 57 — the USACE permit authorizing utility line activities for telecom lines (and other utility lines), issued in the 2021 nationwide permit reissuance. NWP 57 replaced NWP 12 coverage for telecom activities (NWP 12 post-2021 covers oil/gas pipelines only). [Verify current NWP number and conditions against the USACE reissuance current at time of project — NWPs are reissued on 5-year cycles.]',
            },
            {
              id: 'T09-L05-fc-pcn',
              front: 'What is a PCN and when is it required under NWP 57?',
              back: 'Pre-construction notification — a notification submitted to the USACE district office before beginning work authorized under NWP 57 when specific conditions trigger the PCN requirement. PCN is required when a project exceeds certain acreage or linear-foot thresholds, affects wetlands above a set area, or when listed conditions are present. USACE has 45 days to respond to a PCN. [Confirm current PCN thresholds against the active USACE NWP reissuance.]',
            },
            {
              id: 'T09-L05-fc-individual-permit',
              front: 'What is an individual permit and when is it required instead of NWP 57?',
              back: 'A project-specific USACE permit issued after a full public interest review when a nationwide permit (NWP) is not available or when a project\'s impacts exceed NWP thresholds. Individual permits typically take 6–12 months to process, compared to 45 days for a PCN under an NWP. Required when a project will impact more than the NWP threshold acreage of wetlands or when the USACE district determines NWP 57 is not appropriate.',
            },
            {
              id: 'T09-L05-fc-jd',
              front: 'What is a jurisdictional determination (JD)?',
              back: 'A USACE determination of whether a specific area (wetland, waterbody, tributary) constitutes WOTUS and is therefore subject to USACE Section 404 authority. A preliminary JD (PJD) is non-binding; an approved JD (AJD) is binding and can be appealed. JD requests have become more common since the 2023 Sackett v. EPA decision narrowed WOTUS.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>NWP 57 in Practice — When to File a PCN and When to Call USACE First</h2>

        <h3 className="mt-4 font-semibold">How NWP 57 works</h3>
        <p>
          Nationwide permits are a USACE efficiency mechanism: instead of requiring a full
          individual permit for every routine utility crossing, the USACE pre-authorizes
          standard activities through general permits that cover classes of work.
          NWP 57 authorizes telecom utility line activities in WOTUS, subject to conditions.
        </p>
        <p className="mt-2">
          The basic structure: if your crossing fits within NWP 57's limits and none of
          the PCN triggers fire, you're authorized to proceed. If PCN triggers fire, you
          file the PCN, wait up to 45 days, and then proceed (unless USACE objects). If the
          project exceeds NWP 57 thresholds (or USACE determines it's inappropriate), you
          need an individual permit.
        </p>

        <h3 className="mt-5 font-semibold">PCN triggers — when you must notify USACE first</h3>
        <p>
          Under NWP 57 (2021 reissuance), a PCN is required in several situations.
          The most common triggers for fiber crossings:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">PCN trigger</th>
                <th className="px-3 py-2 text-left">Typical threshold (2021 reissuance)</th>
                <th className="px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Loss of more than 1/10 acre of WOTUS</td>
                <td className="px-3 py-2">0.1 acre of wetland or waterway impact</td>
                <td className="px-3 py-2">Includes all WOTUS impacts across the project (not just per crossing)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Crossing a Section 10 navigable waterway</td>
                <td className="px-3 py-2">Any crossing of a navigable river or harbor</td>
                <td className="px-3 py-2">Section 10 (RHA) triggers PCN regardless of wetland acreage</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">T&E species / critical habitat present</td>
                <td className="px-3 py-2">Any project footprint with listed species</td>
                <td className="px-3 py-2">USACE must consult with USFWS before authorizing — PCN required</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Historic properties / Section 106 issue</td>
                <td className="px-3 py-2">Any project triggering §106 review</td>
                <td className="px-3 py-2">USACE must complete §106 before NWP authorization — PCN required</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Tribal lands</td>
                <td className="px-3 py-2">Any work on tribal trust lands</td>
                <td className="px-3 py-2">PCN required; USACE coordinates with tribal authority</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: USACE NWP 57 (2021 reissuance); 33 CFR Part 330.
          [Verify NWP number and PCN thresholds against current USACE reissuance at
          lesson-publication time — NWPs are reissued on 5-year cycles and conditions
          can change. See https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/Nationwide-Permits/]
        </p>

        <h3 className="mt-5 font-semibold">WOTUS after Sackett v. EPA (2023) — why you can't assume non-jurisdiction</h3>
        <p>
          In 2023, the U.S. Supreme Court issued its decision in{' '}
          <em>Sackett v. EPA</em>, which narrowed the definition of Waters of the US
          (WOTUS). Before Sackett, USACE jurisdiction often extended to wetlands with
          a "significant nexus" to navigable waters — which could include isolated
          wetlands some distance from a stream. After Sackett, the WOTUS definition was
          narrowed: wetlands must have a continuous surface-water connection to a
          traditionally navigable waterway to be jurisdictional.
        </p>
        <p className="mt-2">
          What this means for fiber routing: some features that USACE considered
          jurisdictional in 2020 (isolated prairie potholes, seasonally flooded farm
          ditches) may no longer qualify. That sounds like good news — but the problem is
          that districts are still working through the new standards, and what one district
          accepts as non-jurisdictional, another may still require a JD to confirm.
        </p>
        <p className="mt-2">
          <strong>The safe standard:</strong> If there is any uncertainty about whether a
          feature in your route is WOTUS, call the relevant USACE district regulatory office
          before assuming non-jurisdiction. A verbal pre-application inquiry (phone call
          with the project described) is free and takes a day or two. An approved
          jurisdictional determination (AJD) can take weeks but provides a defensible
          record. Proceeding without any USACE contact on a questionable feature is a
          compliance gap.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (33 CFR Part 330 + NWP 57 conditions):</strong> NWP 57 authorizes
            telecom utility line activities in WOTUS with no PCN required for crossings below
            the threshold acreage, provided the general conditions are met. Below threshold,
            NWP 57 is self-executing — proceed without USACE notification.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field (post-Sackett):</strong> USACE districts vary significantly in how
            they interpret what's jurisdictional after Sackett v. EPA. What a district
            accepted as non-jurisdictional in 2020 may now require a formal JD to confirm.
            Always call the district regulatory office before assuming NWP coverage with no
            PCN — a 30-minute phone call can save you from a stop-work order. Seasonal
            drainage ditches and isolated wetlands are the highest-risk features where
            WOTUS status is genuinely unclear post-Sackett.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The NWP 12 history trap:</strong> Teams with experience pre-2021 may
            still say "NWP 12 covers fiber crossings." That was correct before the 2021
            reissuance. Post-2021, NWP 12 covers oil and gas pipeline activities. Citing
            NWP 12 for a telecom crossing on a post-2021 project may void the permit
            authorization — the applicable permit is NWP 57. This is exactly the kind of
            outdated knowledge that creates compliance gaps years after a standard changes.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Individual permit timeline — when you need to budget 6–12 months</h3>
        <p>
          When NWP 57 doesn't apply — either because impacts exceed thresholds or because
          the USACE district declines to authorize the project under the NWP — the project
          must obtain an individual permit. Individual permit processing under Section 404
          involves:
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm">
          <li>Full permit application (including alternatives analysis, compensatory mitigation plan)</li>
          <li>Public notice period (typically 30 days; public can comment)</li>
          <li>USACE public interest review (cumulative impacts, environmental consequences)</li>
          <li>USFWS and EPA consultation (if T&E species or water quality concerns)</li>
          <li>USACE permit decision</li>
        </ol>
        <p className="mt-2">
          Total timeline: typically 6–12 months from application to decision, and potentially
          longer for contested projects. For a BEAD project with a funding deadline, an
          individual permit scenario requires early identification and early application
          — ideally as soon as the route is selected, not when construction is supposed to start.
        </p>

        <h3 className="mt-5 font-semibold">Compensatory mitigation — paying for wetland impacts</h3>
        <p>
          Under Section 404, any unavoidable impact to WOTUS must be compensated through
          mitigation — replacing the ecological function of the impacted area. The standard
          mitigation sequence is: (1) avoid, (2) minimize, (3) compensate. For fiber projects,
          the first two steps are usually achieved by HDD (horizontal directional drilling)
          boring under wetlands rather than open-cut trenching through them.
        </p>
        <p className="mt-2">
          When some impact is unavoidable, compensatory mitigation options include:
          wetland mitigation banking (purchasing credits from a USACE-approved mitigation
          bank), in-lieu fee programs, or permittee-responsible mitigation (the applicant
          creates or restores wetlands nearby). Mitigation banking is typically the fastest
          option for small impacts — banks already have approved sites and can sell credits
          quickly once a permit is issued.
        </p>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: 33 CFR Parts 320–332; 40 CFR Part 230 (Section 404(b)(1) guidelines);
          USACE/EPA 2008 Mitigation Rule (33 CFR Part 332; 40 CFR Part 230, Subpart J).
          [Confirm current mitigation banking framework with USACE district at time of project.]
        </p>
      </section>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="NWP 57 PCN Decision: Which Path Do You Take?"
        description="You're permitting a BEAD fiber route with three water crossings. Determine the correct permit path for each."
        scenarioId="T09-L05-nwp57-pcn"
        initialNodeId="start"
        nodes={[
          {
            id: 'start',
            text: 'Your fiber route has three water features. Crossing A: A mapped wetland — 80-foot HDD bore under it. Total wetland impact: 0.05 acres. No T&E species in footprint per IPaC. No §106 issue. Is a PCN required for Crossing A?',
            choices: [
              { label: 'No PCN required — impact is below 0.1 acre threshold and no other triggers present', nextId: 'a-correct' },
              { label: 'PCN required — any wetland crossing requires PCN under NWP 57', nextId: 'a-wrong' },
            ],
          },
          {
            id: 'a-wrong',
            text: 'Incorrect. NWP 57 (2021 reissuance) authorizes crossings below the threshold acreage (0.1 acre) with no PCN required, provided the general NWP conditions are met and no other PCN triggers (T&E species, §106 issues, navigable waterway) apply. An 0.05-acre impact with no other triggers is below the PCN threshold. Proceed under NWP 57 without PCN. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'start' }],
          },
          {
            id: 'a-correct',
            text: 'Correct. Crossing A: proceed under NWP 57 without PCN. Document the authorization in your project permit file. Now Crossing B: a seasonal drainage ditch. The NWI (National Wetlands Inventory) map does not show it as a wetland. Your route survey flagged it as a potential water feature, but it only flows 4 months per year after heavy rain. Post-Sackett, WOTUS status is uncertain. Impact would be minor (0.01 acres). What do you do?',
            choices: [
              { label: 'Assume non-jurisdiction — Sackett narrowed WOTUS; seasonal ditches are likely not WOTUS anymore', nextId: 'b-risky' },
              { label: 'Call the USACE district regulatory office to confirm WOTUS status before assuming NWP or non-jurisdiction', nextId: 'b-correct' },
            ],
          },
          {
            id: 'b-risky',
            text: 'This is the high-risk approach. While Sackett v. EPA (2023) did narrow WOTUS, USACE districts vary significantly in how they apply the new standard to seasonal features. A seasonal ditch that feeds into a tributary of a navigable waterway might still be jurisdictional in some districts\' interpretation. If you proceed assuming non-jurisdiction and USACE later determines the ditch was WOTUS, you\'ve constructed without the required authorization — an unpermitted discharge. The fine exposure and remediation cost far exceeds the cost of a phone call. Calling the district first is the safe standard.',
            isTerminal: false,
            choices: [{ label: 'Go back and take the safer path', nextId: 'a-correct' }],
          },
          {
            id: 'b-correct',
            text: 'Smart call. You phone the USACE district regulatory office. After reviewing the project description and NWI maps, the district officer tells you: that particular ditch flows to a mapped stream tributary and the district considers it WOTUS under the current post-Sackett interpretation. Impact is 0.01 acres — below PCN threshold, no other triggers. Result: proceed under NWP 57 without PCN. Document the call (date, officer name, district, verbal confirmation). Now Crossing C: a navigable river — you\'re boring 300 feet under it. Is a PCN required?',
            choices: [
              { label: 'No PCN — bore is under the river, not in it', nextId: 'c-wrong' },
              { label: 'Yes PCN — crossing a Section 10 navigable waterway triggers PCN regardless of impact acreage', nextId: 'c-correct' },
            ],
          },
          {
            id: 'c-wrong',
            text: 'Incorrect. Under NWP 57, crossing a Section 10 navigable waterway triggers a PCN requirement regardless of the acreage impact. Even a directional bore that stays entirely below the riverbed is crossing a navigable waterway, which triggers Section 10 (RHA) authority in addition to Section 404. The PCN is required; USACE has 45 days to respond. Try again.',
            isTerminal: false,
            choices: [{ label: 'Go back', nextId: 'b-correct' }],
          },
          {
            id: 'c-correct',
            text: 'Correct. You file a PCN for Crossing C (the navigable river HDD). You include: project description, bore plan, crossing depth, utility line specifications, and measures to prevent inadvertent returns (drilling fluid spills). USACE has 45 days to respond. If no objection: you proceed under NWP 57 with the PCN documented. If USACE objects or requires additional conditions: negotiate mitigation measures or determine if the project must go to individual permit.',
            isTerminal: true,
            outcome: 'COMPLETED: Three crossings, three different outcomes. Crossing A: NWP 57 no PCN (below threshold, no triggers). Crossing B: NWP 57 no PCN (USACE verbal confirmation of jurisdiction + below threshold). Crossing C: NWP 57 with PCN (Section 10 navigable waterway trigger). Total permit timeline: ~45 days for PCN on Crossing C. Lessons: (1) Call the district for uncertain WOTUS features. (2) Know your PCN triggers — navigable waterways always require PCN. (3) Document everything: verbal calls, NWP authorizations, permit numbers.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T09.L05 Check — USACE Wetlands Permits: NWP 57"
        mode="multiple-choice"
        questions={[
          {
            id: 'T09-L05-Q1',
            type: 'mc',
            prompt:
              'As of 2021, which Nationwide Permit covers telecom fiber crossings of wetlands and waterways?',
            choices: [
              'NWP 12 — utility line activities (same permit that has always covered fiber)',
              'NWP 57 — utility line activities for telecom, electric, and other utility lines (post-2021 reissuance)',
              'NWP 14 — linear transportation projects',
              'NWP 3 — maintenance of existing structures',
            ],
            answerIndex: 1,
            explanation:
              'In the 2021 USACE nationwide permit reissuance, telecom and electric utility line activities were moved from NWP 12 to NWP 57. NWP 12 (post-2021) covers oil and gas pipeline activities. Any team citing "NWP 12 for fiber" on a post-2021 project is using outdated guidance. [Verify current NWP number and conditions against the active USACE NWP reissuance at publication time.]',
            citation: 'USACE NWP 57 (2021 reissuance); 87 FR 57298 (2022).',
          },
          {
            id: 'T09-L05-Q2',
            type: 'mc',
            prompt:
              'A fiber bore crosses a 0.08-acre mapped wetland. No T&E species are present per IPaC. No Section 106 issues. No navigable waterway. What is the correct permit action under NWP 57?',
            choices: [
              'File a PCN — any wetland impact requires PCN under NWP 57',
              'Proceed under NWP 57 without PCN — 0.08-acre impact is below the 0.1-acre PCN threshold and no other triggers apply',
              'Apply for an individual Section 404 permit — bores cannot use NWP 57',
              'No permit required — the bore is underground and does not discharge fill material',
            ],
            answerIndex: 1,
            explanation:
              'Under NWP 57 (2021 reissuance), a PCN is required when impacts exceed 0.1 acres of WOTUS, or when other triggers (T&E species, §106, navigable waterway) apply. An 0.08-acre impact with no other triggers is below the PCN threshold — NWP 57 authorizes the crossing without a PCN, provided all NWP general conditions are met. [Confirm current PCN thresholds against the active USACE NWP reissuance at publication time.]',
            citation: 'USACE NWP 57 (2021 reissuance); 33 CFR Part 330.',
          },
          {
            id: 'T09-L05-Q3',
            type: 'mc',
            prompt:
              'After the 2023 Sackett v. EPA Supreme Court decision, what is the recommended approach when a project route crosses a seasonal drainage ditch with uncertain WOTUS status?',
            choices: [
              'Assume non-jurisdiction — Sackett eliminated USACE authority over seasonal features',
              'Call the relevant USACE district regulatory office before assuming non-jurisdiction or NWP coverage',
              'Proceed under the individual permit process — all crossings require individual permits post-Sackett',
              'File a PCN regardless of impact acreage — Sackett triggered new mandatory PCN requirements',
            ],
            answerIndex: 1,
            explanation:
              'Sackett v. EPA (2023) narrowed the WOTUS definition, but USACE districts vary in how they apply the new standard to specific features. A seasonal ditch connected to a tributary may still be jurisdictional in some districts\' interpretation. The safe standard is to contact the USACE district regulatory office before assuming non-jurisdiction — a pre-application inquiry is free and provides a defensible record. Assuming non-jurisdiction without USACE contact is a compliance gap.',
            citation: 'Sackett v. EPA, 598 U.S. ___ (2023); 33 USC §1344; T09 Brief §5 (book-vs-field, WOTUS post-Sackett).',
          },
          {
            id: 'T09-L05-Q4',
            type: 'mc',
            prompt:
              'A fiber bore crossing a navigable river (Section 10 waterway) will have a total wetland impact of only 0.02 acres. Is a PCN required?',
            choices: [
              'No — impact is well below the 0.1-acre threshold; PCN not required',
              'Yes — crossing a Section 10 navigable waterway triggers a PCN requirement under NWP 57 regardless of acreage impact',
              'No — bores under rivers are exempt from Section 10 authority because they don\'t obstruct navigation',
              'Only if the river is listed as an "impaired water" under the Clean Water Act',
            ],
            answerIndex: 1,
            explanation:
              'Under NWP 57 general conditions, crossing a Section 10 navigable waterway triggers a PCN requirement regardless of the wetland acreage impact. Even though 0.02 acres is well below the 0.1-acre acreage trigger, the Section 10 navigable-waterway trigger applies independently. The applicant must file a PCN; USACE has 45 days to respond before construction can begin.',
            citation: 'USACE NWP 57 (2021 reissuance); 33 CFR §330.5 (general conditions); 33 USC §403 (Rivers and Harbors Act §10).',
          },
        ]}
      />

    </LessonLayout>
  );
}
