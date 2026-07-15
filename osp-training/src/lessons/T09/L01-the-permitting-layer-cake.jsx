// T09.L01 — The Permitting Layer Cake
// Foundation lesson: federal/state/county/private permit hierarchy, AHJ, federal nexus
// Source: M03 §3.1 (layer cake framing) + net-new elaboration

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T09.L01',
  course_id: 'T09',
  title: 'The Permitting Layer Cake',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T04.L01'],
  learning_objectives: [
    'Map each permit type to its triggering authority and jurisdictional level',
    'Explain how federal funding creates the federal nexus that activates NEPA and Section 106',
    'Identify the four layers of the permitting stack and the consequences of skipping any layer',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'federal nexus',
    'AHJ',
    'jurisdictional trigger',
    'encroachment permit',
    'BEAD',
  ],
  key_terms: [
    {
      term: 'federal nexus',
      definition:
        'The legal connection that brings federal environmental review requirements into a project. Any project receiving federal funding (BEAD grants, RUS loans) or requiring a federal permit (USACE wetlands crossing) has a federal nexus — which means NEPA, Section 106, ESA, and other federal review obligations automatically apply.',
    },
    {
      term: 'AHJ',
      definition:
        'Authority Having Jurisdiction — the organization, office, or individual responsible for enforcing the requirements of a code or standard, or for approving equipment, installations, or a procedure. In permitting, the AHJ is whoever issues the permit: a state DOT for an encroachment permit, a municipality for a ROW permit, a county for a zoning approval. Multiple AHJs can exist on the same project simultaneously.',
    },
    {
      term: 'jurisdictional trigger',
      definition:
        'The specific project characteristic that activates a given permit requirement. Common triggers: federal funding activates NEPA; crossing a navigable waterway activates USACE Section 404; disturbing ground in a historic district activates Section 106 NHPA review; placing conduit in a state highway ROW activates a DOT encroachment permit.',
    },
    {
      term: 'encroachment permit',
      definition:
        'A permit issued by a road-owning authority (state DOT, county, municipality) that grants permission to install infrastructure within the right-of-way of a public road. For OSP fiber, this covers boring under roads, placing conduit in ditches alongside roads, and installing aerial attachments on poles within the ROW.',
    },
    {
      term: 'BEAD',
      definition:
        'Broadband Equity, Access, and Deployment — the $42.45 billion federal broadband grant program administered by NTIA under the Infrastructure Investment and Jobs Act (2021). BEAD funding creates a federal nexus, meaning BEAD-funded projects are subject to NEPA environmental review, Section 106 historic preservation review, and ESA endangered-species consultation requirements.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'route alternatives', source_lesson_id: 'T04.L05' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'GIS', source_lesson_id: 'T01.L08' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export default function T09L01_ThePermittingLayerCake() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before a single shovel of dirt is turned or a single bolt is tightened on a new
          fiber route, permits have to be in hand. Not one permit — usually several, from
          several different agencies, each with its own timeline and its own requirements.
          Get them out of order, miss one, or skip the process, and you could face a stop-work
          order on the day your crew shows up. On a government-funded project, you could
          lose your funding entirely.
        </p>
        <p className="mt-2">
          The easiest way to understand the permitting world is to think of it as a{' '}
          <strong>layer cake</strong> — four layers stacked on top of each other. The federal
          layer is at the top (and the hardest to move). The private-property layer is at the
          bottom (often the most negotiable). Every fiber route passes through some or all
          of these layers, and each layer has its own set of rules, its own agency, and its
          own timeline.
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
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The agency or office that issues the permit and can stop your work</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">BEAD</td>
              <td className="px-3 py-2">Broadband Equity, Access, and Deployment</td>
              <td className="px-3 py-2">Major federal broadband grant program; triggers federal environmental review</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The strip of land beside a road that the government controls for public use; where most overhead and buried telecom goes</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NEPA</td>
              <td className="px-3 py-2">National Environmental Policy Act</td>
              <td className="px-3 py-2">Federal law requiring environmental review for federal actions — covered in depth in T09.L02</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">USACE</td>
              <td className="px-3 py-2">U.S. Army Corps of Engineers</td>
              <td className="px-3 py-2">Federal agency that issues wetland crossing permits; covered in T09.L05</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DOT</td>
              <td className="px-3 py-2">Department of Transportation</td>
              <td className="px-3 py-2">State or federal agency managing road rights-of-way; issues encroachment permits</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The four layers — from top to bottom</h3>
        <div className="space-y-3 mt-3">
          <div className="p-4 border border-red-400/30 bg-red-400/5 rounded-lg">
            <p className="font-semibold text-red-300 text-sm uppercase tracking-wide mb-1">Layer 1 — Federal</p>
            <p className="text-sm text-slate-300/90">
              Applies when the project has a <strong>federal nexus</strong> — meaning federal
              money (BEAD grants, RUS loans) or federal permits (USACE wetlands crossing).
              Key requirements: NEPA environmental review, Section 106 historic preservation
              review, ESA endangered species consultation. These are NOT optional if the nexus
              exists. Timeline: 30 days to 18+ months depending on the review type.
            </p>
          </div>
          <div className="p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg">
            <p className="font-semibold text-amber-300 text-sm uppercase tracking-wide mb-1">Layer 2 — State</p>
            <p className="text-sm text-slate-300/90">
              State DOT encroachment permits for work in state highway ROW. State environmental
              permits if the project crosses state-regulated wetlands or waterways. State utility
              commission approvals where required. Timeline: 60–180 days for a DOT encroachment
              permit; varies by state.
            </p>
          </div>
          <div className="p-4 border border-sky-400/30 bg-sky-400/5 rounded-lg">
            <p className="font-semibold text-sky-300 text-sm uppercase tracking-wide mb-1">Layer 3 — County / Municipal</p>
            <p className="text-sm text-slate-300/90">
              ROW permits from cities or counties for work in local road ROW. Franchise
              agreements for carriers placing infrastructure in municipal right-of-way.
              Noise ordinance compliance for nighttime boring. Pavement cut moratoriums
              (can't cut a recently paved road for 3–5 years). Timeline: 30 days to 12+ months
              depending on the municipality.
            </p>
          </div>
          <div className="p-4 border border-green-400/30 bg-green-400/5 rounded-lg">
            <p className="font-semibold text-green-300 text-sm uppercase tracking-wide mb-1">Layer 4 — Private Property</p>
            <p className="text-sm text-slate-300/90">
              Easements, licenses, or fee-simple acquisitions for routes crossing private land.
              Landowner consent for access during construction. This layer is typically the
              most negotiable — but also the most relationship-dependent. A single holdout
              landowner can force a route deviation that blows the entire project budget.
            </p>
          </div>
        </div>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T09-L01"
          cards={[
            {
              id: 'T09-L01-fc-federal-nexus',
              front: 'What is a federal nexus and why does it matter for permitting?',
              back: 'The legal connection that brings federal environmental review requirements into a project. Any project receiving federal funding (BEAD grants, RUS loans) or requiring a federal permit (USACE wetlands crossing) has a federal nexus — which means NEPA, Section 106, ESA, and other federal review obligations automatically apply.',
            },
            {
              id: 'T09-L01-fc-ahj',
              front: 'What does AHJ stand for and what does it mean on a project?',
              back: 'Authority Having Jurisdiction — the organization, office, or individual responsible for enforcing the requirements of a code or standard, or for approving equipment, installations, or a procedure. In permitting, the AHJ is whoever issues the permit: a state DOT for an encroachment permit, a municipality for a ROW permit, a county for a zoning approval. Multiple AHJs can exist on the same project simultaneously.',
            },
            {
              id: 'T09-L01-fc-jurisdictional-trigger',
              front: 'What is a jurisdictional trigger in permitting?',
              back: 'The specific project characteristic that activates a given permit requirement. Common triggers: federal funding activates NEPA; crossing a navigable waterway activates USACE Section 404; disturbing ground in a historic district activates Section 106 NHPA review; placing conduit in a state highway ROW activates a DOT encroachment permit.',
            },
            {
              id: 'T09-L01-fc-encroachment-permit',
              front: 'What is an encroachment permit?',
              back: 'A permit issued by a road-owning authority (state DOT, county, municipality) that grants permission to install infrastructure within the right-of-way of a public road. For OSP fiber, this covers boring under roads, placing conduit in ditches alongside roads, and installing aerial attachments on poles within the ROW.',
            },
            {
              id: 'T09-L01-fc-bead',
              front: 'What is BEAD and why does it trigger federal permitting requirements?',
              back: 'Broadband Equity, Access, and Deployment — the $42.45 billion federal broadband grant program administered by NTIA under the Infrastructure Investment and Jobs Act (2021). BEAD funding creates a federal nexus, meaning BEAD-funded projects are subject to NEPA environmental review, Section 106 historic preservation review, and ESA endangered-species consultation requirements.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How the Layers Interact</h2>

        <h3 className="mt-4 font-semibold">The federal nexus — why federal money changes everything</h3>
        <p>
          The most important concept in this lesson is the <strong>federal nexus</strong>.
          If you're building a fiber route with nothing but private money and never touching
          a federal permit, you might skip the federal layer entirely. But the moment federal
          money enters the picture — a BEAD grant, a RUS loan, an NTIA subsidy — the federal
          government becomes a partner in your project, and with that partnership comes
          mandatory environmental review.
        </p>
        <p className="mt-2">
          Think of it this way: the federal government is lending you money or giving you a
          grant with conditions attached. One of those conditions is that you don't use their
          money to damage the environment, harm historic properties, or destroy habitat for
          endangered species. The federal nexus is what activates the review process that
          enforces those conditions.
        </p>

        <h3 className="mt-5 font-semibold">Jurisdictional triggers — what activates each layer</h3>
        <p>
          Not every project hits every layer. The <strong>jurisdictional trigger</strong>{' '}
          is the specific project characteristic that forces you into a particular permit track.
          Here's how to read a project and identify which triggers fire:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Project characteristic</th>
                <th className="px-3 py-2 text-left">Jurisdictional trigger</th>
                <th className="px-3 py-2 text-left">Permit required</th>
                <th className="px-3 py-2 text-left">AHJ</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">BEAD or RUS funding</td>
                <td className="px-3 py-2">Federal nexus (funding)</td>
                <td className="px-3 py-2">NEPA review; §106 review; ESA consultation</td>
                <td className="px-3 py-2">Lead federal agency (NTIA/RUS)</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Crossing a wetland or navigable water</td>
                <td className="px-3 py-2">Federal nexus (USACE permit)</td>
                <td className="px-3 py-2">CWA §404 / RHA §10 (NWP 57 or individual permit)</td>
                <td className="px-3 py-2">USACE district office</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Work in state highway ROW</td>
                <td className="px-3 py-2">State road authority</td>
                <td className="px-3 py-2">Encroachment permit</td>
                <td className="px-3 py-2">State DOT district office</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Work in city or county road ROW</td>
                <td className="px-3 py-2">Local road authority</td>
                <td className="px-3 py-2">Municipal ROW permit or franchise agreement</td>
                <td className="px-3 py-2">City public works or county engineer</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Route across private farmland</td>
                <td className="px-3 py-2">Private property ownership</td>
                <td className="px-3 py-2">Easement or license agreement</td>
                <td className="px-3 py-2">Landowner</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-5 font-semibold">What happens if you skip a layer?</h3>
        <p className="mt-2">
          Each skipped layer has a different failure mode:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Skip federal:</strong> After construction, the federal agency discovers the
            NEPA or §106 review was never completed. Best case: retroactive review with
            mitigation. Worst case: mandatory removal of installed infrastructure and grant
            clawback.
          </li>
          <li>
            <strong>Skip state DOT encroachment:</strong> State inspector sees your bore in
            the highway ROW without a permit. Stop-work order, potential removal of installed
            conduit, fines. DOT has the authority to require you to dig everything back out
            at your expense.
          </li>
          <li>
            <strong>Skip municipal ROW:</strong> City public works finds your crew in the
            right-of-way. Stop-work, potential court injunction, fines per day. In franchise
            territories, the city may demand access to your conduit as a condition of
            retroactive authorization.
          </li>
          <li>
            <strong>Skip private easement:</strong> Landowner can go to court for trespass,
            injunction, or damages. The fiber you already buried may need to come out. This is
            also a title-insurance issue: a lender won't finance infrastructure on land where
            access rights aren't documented.
          </li>
        </ul>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Permits must be in hand before construction begins. Period.
            The sequence is: complete NEPA/§106/ESA → get federal permit (if applicable) →
            get state DOT permit → get municipal ROW permit → finalize easements → mobilize.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> In practice, most of these permits run in parallel — you
            submit to the state DOT the same week you initiate the NEPA review, and you send
            easement offer letters to landowners while the federal review is in process.
            The key is that you don't START construction on any segment until that segment's
            permits are in hand. Parallelizing submission ≠ skipping steps. The sequence of
            approvals still matters; only submissions can overlap.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> Projects that treat permit submissions as sequential
            (finish NEPA, THEN submit DOT, THEN send easement letters) will consistently miss
            their construction windows. The DOT permit alone can take 90 days. If you wait
            until NEPA clears to start that clock, you've added 3 months to your schedule for
            no reason.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">The lead federal agency — who runs NEPA?</h3>
        <p>
          When multiple federal agencies are involved in a single project (e.g., NTIA
          funding + USACE wetlands permit + USFWS species consultation), the agencies
          designate a <em>lead federal agency</em> (LFA) responsible for coordinating and
          completing the NEPA review. For BEAD projects, NTIA typically serves as the LFA.
          For RUS projects, USDA Rural Development is the LFA. Other agencies participate
          as "cooperating agencies" and their reviews feed into the LFA's single NEPA document
          rather than running as separate processes.
        </p>
        <p className="mt-2">
          One practical note about the federal rulebook itself. For decades, the government-wide
          procedures for <em>how</em> to run a NEPA review lived in one shared set of Council on
          Environmental Quality (CEQ) regulations that every agency followed. Those government-wide
          procedures were rescinded in 2025–2026, and each federal agency now runs NEPA under its
          own agency-specific procedures instead. What did <strong>not</strong> change is the law
          underneath: NEPA itself is still fully in force, and the lead-agency structure above still
          governs how a multi-agency project is coordinated. The takeaway for a permitting team is
          simple — confirm the <em>current</em> procedures of your lead agency (NTIA for BEAD, USDA
          Rural Development for RUS) rather than assuming a single uniform federal rulebook still applies.
        </p>

        <h3 className="mt-5 font-semibold">Programmatic vs. project-level review</h3>
        <p>
          For large broadband programs covering many routes in a state (like a statewide
          BEAD deployment), states often seek a <em>programmatic</em> NEPA review that
          covers the whole program rather than each route individually. A successful
          programmatic CE (or Programmatic EA) can dramatically reduce per-project permitting
          burden — future individual routes get a tiered review that references and builds
          on the programmatic document.
        </p>
        <p className="mt-2">
          The tradeoff: the programmatic document takes longer to prepare upfront (often
          12–18 months for a full state program), but once approved, individual project
          reviews can be completed in weeks rather than months. For large subgrantees building
          multi-hundred-mile networks, the programmatic approach is usually worth the upfront
          investment.
        </p>
      </section>

      {/* ── TABLE — four permitting layers ───────────────────────────────── */}
      <table className="lesson-table">
        <caption>The Permitting Layer Cake — Trigger, Requirements, Timeline, and Consequences</caption>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Triggered By</th>
            <th>Key Requirements</th>
            <th>Typical Timeline</th>
            <th>Consequence of Skipping</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Federal</strong></td>
            <td>Federal funding (BEAD, RUS) or a federal permit (USACE wetlands)</td>
            <td>NEPA review; Section 106 historic preservation; ESA species consultation</td>
            <td>30 days (CE) to 18+ months (full EIS)</td>
            <td>Grant clawback, mandatory infrastructure removal, regulatory enforcement</td>
          </tr>
          <tr>
            <td><strong>State</strong></td>
            <td>Work in state highway ROW; crossing state-regulated waterways; utility commission approvals</td>
            <td>DOT encroachment permit (PE-stamped plans, traffic control plan, surety bond); state environmental permits</td>
            <td>60–180 days for DOT encroachment</td>
            <td>Stop-work order, forced removal, fines</td>
          </tr>
          <tr>
            <td><strong>County / Municipal</strong></td>
            <td>Work in city or county road ROW; nighttime construction; pavement cuts</td>
            <td>ROW permit or franchise agreement; traffic control plan; restoration bond</td>
            <td>30 days to 12+ months</td>
            <td>Stop-work order, daily fines, court injunction, franchise-access demands</td>
          </tr>
          <tr>
            <td><strong>Private Property</strong></td>
            <td>Route crossing private land (farmland, residential lots, commercial parcels)</td>
            <td>Recorded easement, license, or fee-simple acquisition</td>
            <td>Weeks to years (one holdout landowner can force a route change)</td>
            <td>Trespass lawsuit, court-ordered removal, title insurance issues</td>
          </tr>
        </tbody>
      </table>

      <ReferencesBlock
        items={[
          { citation: '42 USC §4321 et seq.', note: 'National Environmental Policy Act — the federal law that requires environmental review whenever a project has a federal nexus (federal funding, permit, or approval).' },
          { citation: '42 USC §4332', note: 'The action-forcing section of NEPA — agencies must complete environmental review before making irreversible commitments of resources.' },
          { citation: '54 USC §306108', note: 'Section 106 of the National Historic Preservation Act — federal agencies must consider a project’s effect on historic properties (covered in the Section 106 lesson).' },
          { citation: '16 USC §1536', note: 'Section 7 of the Endangered Species Act — federal agencies must consult on effects to listed species (covered in the ESA lesson).' },
          { citation: '33 USC §1344', note: 'Section 404 of the Clean Water Act — the USACE permit authority triggered by discharging fill into Waters of the U.S. (wetland/waterway crossings; covered in the USACE Wetlands lesson).' },
          { citation: '33 USC §403', note: 'Section 10 of the Rivers and Harbors Act — USACE authority over work in navigable waters, often paired with a Section 404 permit.' },
          { citation: '33 CFR Parts 320–332', note: 'The USACE regulatory framework for individual and nationwide permits, including Nationwide Permit 57 for telecommunications line crossings.' },
          { citation: 'Nationwide Permit 57', note: 'USACE “Electric Utility Line and Telecommunications Activities” nationwide permit — the streamlined authorization most fiber wetland/waterway crossings use.' },
          { citation: 'Infrastructure Investment and Jobs Act (2021) — BEAD Program', note: 'Creates the $42.45 billion NTIA broadband grant program; BEAD funding is a federal nexus that activates NEPA, Section 106, and ESA review.' },
          { citation: 'CEQ NEPA regulations (former 40 CFR Parts 1500–1508)', note: 'The government-wide NEPA procedures rescinded in 2025–2026 (interim rule effective April 11, 2025; final rule effective January 8, 2026, following E.O. 14154). Agencies now run NEPA under their own agency-specific procedures; the NEPA statute itself remains in force.' },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T09"
        assessmentId="T09-L01"
        title="Check — The Permitting Layer Cake"
        fallback={
        <Quiz
          title="Check — The Permitting Layer Cake"
          mode="multiple-choice"
          questions={[
            {
              id: 'T09-L01-Q1',
              type: 'mc',
              prompt:
                'A fiber route will receive a BEAD grant from NTIA. Which of the following federal review requirements is automatically triggered by the BEAD funding?',
              choices: [
                'USACE Section 404 wetlands review only',
                'NEPA environmental review, Section 106 historic preservation review, and ESA consultation',
                'State DOT encroachment permit',
                'Private landowner easement recording',
              ],
              answerIndex: 1,
              explanation:
                'BEAD funding creates a federal nexus, which activates all federal environmental review requirements: NEPA (42 USC §4321 et seq.), Section 106 of the NHPA (54 USC §306108), and ESA Section 7 consultation (16 USC §1536). The DOT encroachment permit is a state-layer requirement; private easements are a private-property layer requirement — neither is triggered by the presence of federal funding.',
              citation: '42 USC §4321 et seq. (NEPA); 54 USC §306108 (NHPA §106); 16 USC §1536 (ESA §7).',
            },
            {
              id: 'T09-L01-Q2',
              type: 'mc',
              prompt:
                'A project engineer submits the state DOT encroachment permit application before the NEPA review is complete. Is this allowed?',
              choices: [
                'No — NEPA must be fully approved before any state permit applications can be submitted',
                'Yes — permit submissions can run in parallel; the constraint is that construction cannot begin until all required permits are in hand',
                'Yes — state permits are completely independent of federal review and can be issued without NEPA',
                'No — the DOT will reject the application without a NEPA clearance letter attached',
              ],
              answerIndex: 1,
              explanation:
                'The book rule is sequential in approval, not in submission. Experienced permitting teams submit to all agencies simultaneously to compress the schedule. The DOT may issue the encroachment permit before NEPA concludes — but construction on that DOT-permitted segment cannot begin until the NEPA review also clears (because the federal nexus from BEAD funding applies to the entire project). Parallelizing submissions while enforcing the approval sequence is standard practice.',
              citation: '42 USC §4332 (NEPA — no irreversible commitments before the review concludes).',
            },
            {
              id: 'T09-L01-Q3',
              type: 'mc',
              prompt:
                'The Authority Having Jurisdiction (AHJ) for an encroachment permit on a state highway is:',
              choices: [
                'The federal EPA',
                'The county engineer',
                'The state DOT district office',
                'The landowner adjacent to the highway',
              ],
              answerIndex: 2,
              explanation:
                'The AHJ for state highway ROW is the state DOT — specifically the district office responsible for the road segment in question. The federal EPA has no role in DOT encroachment permits. The county engineer handles county roads, not state highways. Landowners adjacent to the highway own the land up to the ROW boundary but have no authority over the ROW itself.',
            },
            {
              id: 'T09-L01-Q4',
              type: 'mc',
              prompt:
                'Which jurisdictional trigger activates the requirement for a USACE Section 404 permit?',
              choices: [
                'Any project receiving federal funding',
                'Any project crossing a wetland or navigable waterway (Waters of the US)',
                'Any project placing conduit in a state highway ROW',
                'Any project on private farmland',
              ],
              answerIndex: 1,
              explanation:
                'USACE Section 404 authority (under the Clean Water Act) is triggered by the physical act of discharging dredged or fill material into Waters of the United States — which includes wetlands and navigable waterways. Federal funding alone does not trigger §404; it is the crossing of jurisdictional waters that does. State DOT work triggers state encroachment permits; private farmland triggers easement requirements.',
              citation: '33 USC §1344 (CWA §404); 33 CFR Parts 320–332 (USACE nationwide permit framework).',
            },
            {
              id: 'T09-L01-Q5',
              type: 'fill-in-blank',
              prompt:
                'The legal connection that brings federal environmental review requirements into a project — typically created by federal funding or a federal permit — is called the federal ____.',
              answer: 'nexus',
              answerDisplay: 'nexus',
              explanation:
                'The federal nexus is the link that connects a project to federal environmental law. Without a nexus, NEPA, Section 106, and ESA Section 7 do not apply. With a nexus — whether from BEAD funding, RUS loans, or a USACE wetlands permit — all applicable federal environmental reviews become mandatory.',
              citation: '42 USC §4321 et seq. (NEPA statutory authority).',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
