// Net-new — T04.L05 Route Alternatives Analysis
// Working lesson: aerial vs underground tradeoff reasoning, field-level route scoring

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Sortable from '../../components/primitives/Sortable.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T04.L05',
  course_id: 'T04',
  title: 'Route Alternatives Analysis',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T01.L01', 'T04.L01', 'T04.L03'],
  vocabulary_introduced: [
    'cost-effectiveness',
    'constructability',
    'permitting risk',
    'route scoring',
    'route alternatives',
  ],
  key_terms: [
    {
      term: 'cost-effectiveness',
      definition:
        'A comparative assessment of total project cost relative to the value delivered, used when evaluating route alternatives. In OSP route selection, cost-effectiveness weighs construction cost (aerial vs. underground) against long-term maintenance burden, service reliability, and the expected service life of the build. A more expensive underground route may be more cost-effective over 30 years if it eliminates repeated aerial storm-damage repairs.',
    },
    {
      term: 'constructability',
      definition:
        'The degree to which a proposed route can be built with available equipment, within the physical constraints of the terrain and right-of-way, and within the project timeline. A route that requires specialty directional drilling equipment through basalt rock, a narrow road shoulder with no staging area, and a 90-day river-crossing permit window has low constructability, even if the engineering design is sound.',
    },
    {
      term: 'permitting risk',
      definition:
        'The probability and potential impact of delays, conditions, or denials from regulatory agencies (DOT, USACE, state environmental agencies, county road departments, railroad crossing authorities) during the permitting phase. A route that crosses a jurisdictional wetland, a navigable waterway, and a state highway has significantly higher permitting risk — and permitting timeline — than one that runs along a county road shoulder in public ROW.',
    },
    {
      term: 'route scoring',
      definition:
        'A structured comparison method that assigns weights and scores to each route alternative across multiple criteria — construction cost, permitting risk, constructability, environmental impact, maintenance burden, and community impact — to produce a defensible, documented recommendation. Route scoring is used in formal RUS submittals and project documentation; the scoring matrix provides the written justification for the route selected.',
    },
    {
      term: 'route alternatives',
      definition:
        'The set of distinct path options evaluated during pre-engineering for an OSP project — including different road alignments, aerial vs. underground plant approaches, and crossing methods for obstacles. Documenting route alternatives is required for RUS loan packages and is best practice for any project where the selected route may later be questioned by a client, regulator, or project auditor. Each alternative is evaluated on cost, constructability, permitting risk, and long-term maintenance before a recommended route is selected.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'ROW', source_lesson_id: 'T01.L01' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'joint-use', source_lesson_id: 'T01.L02' },
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'hazard identification', source_lesson_id: 'T04.L01' },
    { term: 'existing utility', source_lesson_id: 'T04.L01' },
    { term: 'landbase', source_lesson_id: 'T04.L03' },
    { term: 'coordinate system', source_lesson_id: 'T04.L03' },
  ],
  estimated_minutes: 25,
};

export default function T04L05_RouteAlternativesComparison() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you're planning an OSP route, you almost never have just one option.
          You might be able to run the cable on existing utility poles (aerial plant),
          or bury it in a conduit (underground plant), or follow one road alignment
          instead of another. Each option has a different cost, a different construction
          challenge, and a different pile of permits to get through. Choosing the wrong one
          adds months to the schedule or blows the budget.
        </p>
        <p className="mt-2">
          The <strong>route alternatives analysis</strong> is how you compare those options
          side by side — in the field, during the survey, before anyone draws a design.
          At the T04 level, this is a field-level evaluation: you're walking the routes,
          reading the terrain, and asking practical questions like "Can a boring machine
          get in there?" and "How many agencies are going to want a piece of this permit?"
        </p>
        <p className="mt-2">
          Think of it like choosing a road trip route. Option A is shorter but goes through
          a mountain pass that's often closed in winter. Option B is longer but follows the
          interstate and is reliable year-round. Neither is automatically the right answer —
          it depends on when you're going and what the constraints are.
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
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">Legal corridor where work is permitted; aerial plant usually in utility ROW, buried plant may need additional easements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DOT</td>
              <td className="px-3 py-2">Department of Transportation</td>
              <td className="px-3 py-2">State or county agency that controls road-crossing and road-shoulder permits; a major permitting player for both aerial and underground routes along roads</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">USACE</td>
              <td className="px-3 py-2">U.S. Army Corps of Engineers</td>
              <td className="px-3 py-2">Federal agency that regulates construction in or near navigable waterways and jurisdictional wetlands; a Section 404 permit from USACE can add 3–18 months to a schedule</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDD</td>
              <td className="px-3 py-2">Horizontal Directional Drilling</td>
              <td className="px-3 py-2">A trenchless underground method that drills a curved bore path beneath a road, creek, or obstacle; avoids open-cut excavation but requires specialized equipment and entry/exit pits</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service</td>
              <td className="px-3 py-2">USDA funding agency for rural telecom; route-alternative documentation is often required in the RUS loan application package</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T04-L05"
          cards={[
            {
              id: 'T04-L05-fc-cost-effectiveness',
              front: 'What does cost-effectiveness mean in OSP route comparison?',
              back: 'A comparative assessment of total project cost relative to value delivered. Weighs construction cost against long-term maintenance burden, service reliability, and expected service life. A more expensive underground route may be more cost-effective over 30 years if it eliminates repeated aerial storm-damage repairs.',
            },
            {
              id: 'T04-L05-fc-constructability',
              front: 'What is constructability in OSP route analysis?',
              back: 'The degree to which a proposed route can be built with available equipment, within physical constraints of terrain and ROW, and within the project timeline. A route requiring specialty equipment, no staging area, and a 90-day permit window has low constructability even if the engineering design is sound.',
            },
            {
              id: 'T04-L05-fc-permitting-risk',
              front: 'What is permitting risk in route selection?',
              back: 'The probability and potential impact of delays, conditions, or denials from regulatory agencies during the permitting phase. A route crossing a jurisdictional wetland, a navigable waterway, and a state highway has significantly higher permitting risk and timeline than one along a county road shoulder in public ROW.',
            },
            {
              id: 'T04-L05-fc-route-scoring',
              front: 'What is route scoring?',
              back: 'A structured comparison that assigns weights and scores to each route alternative across multiple criteria — construction cost, permitting risk, constructability, environmental impact, maintenance burden, community impact — to produce a defensible, documented recommendation for RUS submittals and project documentation.',
            },
            {
              id: 'T04-L05-fc-route-alternatives',
              front: 'What are route alternatives in OSP pre-engineering?',
              back: 'The distinct path options evaluated during pre-engineering — different road alignments, aerial vs. underground plant, crossing methods for obstacles. Documenting route alternatives is required for RUS loan packages. Each alternative is evaluated on cost, constructability, permitting risk, and long-term maintenance before a recommended route is selected.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Aerial vs. Underground — Reading the Route</h2>

        <h3 className="mt-4 font-semibold">The four field-comparison criteria</h3>
        <p>
          At the T04 field-survey level, you can assess four key criteria for each route
          alternative without needing design engineering calculations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold text-slate-200 mb-2">1. Construction Cost (rough tier)</h4>
            <p className="text-sm text-slate-300/90">
              <strong>Aerial:</strong> Lower upfront cost when existing poles are available for
              attachment. Cost drivers: number of poles needing make-ready, span lengths,
              guy anchor requirements. Roughly: aerial with no make-ready ≈ $2,000–$6,000/mile
              in easy terrain; make-ready-heavy aerial can approach underground cost.
            </p>
            <p className="text-sm text-slate-300/90 mt-2">
              <strong>Underground:</strong> Higher upfront cost. Cost drivers: soil conditions
              (soft vs. rock), trench depth and width, pavement cutting and restoration,
              HDD crossing requirements. Roughly: direct-bury rural ≈ $6,000–$18,000/mile;
              urban conduit systems can exceed $50,000/mile.
            </p>
            <p className="text-xs text-slate-300/50 mt-1">
              Note: cost ranges are highly variable by region, material prices, and local labor,
              and shift with material-cost inflation over time. These are order-of-magnitude
              field-triage estimates only — verify current construction cost benchmarks against
              recent RUS Form 395 bid data or regional cost studies before using in a project
              estimate. Actual project costs come from the engineer's quantity take-off.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold text-slate-200 mb-2">2. Constructability Field Indicators</h4>
            <p className="text-sm text-slate-300/90">
              <strong>Aerial:</strong>
            </p>
            <ul className="list-disc pl-4 text-sm text-slate-300/90 mt-1 space-y-1">
              <li>Bucket truck or digger truck access along the shoulder?</li>
              <li>Span lengths manageable (&lt;300 ft without intermediate supports)?</li>
              <li>Existing poles in serviceable condition?</li>
              <li>No excessive crossing of private land (easement complications)?</li>
            </ul>
            <p className="text-sm text-slate-300/90 mt-2">
              <strong>Underground:</strong>
            </p>
            <ul className="list-disc pl-4 text-sm text-slate-300/90 mt-1 space-y-1">
              <li>Rock outcroppings visible? (Rock = expensive bore or blasting)</li>
              <li>High water table or seasonal flooding? (Wet trenches = delays)</li>
              <li>Staging area for boring machine entry/exit pits?</li>
              <li>Pavement type on road crossings? (Asphalt vs. concrete — concrete cutting costs more)</li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold text-slate-200 mb-2">3. Permitting Risk Indicators</h4>
            <p className="text-sm text-slate-300/90">
              <strong>Low-risk indicators:</strong> Route stays in county road ROW, no waterway
              crossings, no wetland markers, no historic property within 300 ft, county DOT is
              cooperative in this jurisdiction.
            </p>
            <p className="text-sm text-slate-300/90 mt-2">
              <strong>High-risk indicators (flag in survey):</strong>
            </p>
            <ul className="list-disc pl-4 text-sm text-slate-300/90 mt-1 space-y-1">
              <li>State highway crossing → state DOT permit (3–6 months typical)</li>
              <li>Railroad crossing → railroad company permit and possible third-party crossing contractor</li>
              <li>Navigable waterway crossing → USACE NWP 57 or individual permit (90 days to 18 months)</li>
              <li>Wetland delineation markers → Section 404 USACE review</li>
              <li>Historic district signage or recorded historic property in corridor → Section 106 NHPA review (coordinated with State Historic Preservation Office / SHPO). Note: SHPO concurrence does NOT substitute for tribal consultation — if the project has a federal nexus, Executive Order 13175 and 36 CFR Part 800 require separate nation-to-nation tribal consultation with any federally recognized tribe with interest in the project area. Flag both triggers when you observe the indicator; they are handled through separate processes.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="font-semibold text-slate-200 mb-2">4. Long-Term Maintenance</h4>
            <p className="text-sm text-slate-300/90">
              <strong>Aerial:</strong> Higher storm-damage exposure (ice loading, wind, falling
              trees). Easier to access for splicing and repair. Vegetation management (tree
              trimming) is a recurring cost. Storm outages drive insurance claims and service
              SLA penalties. In high-wind / ice-loading regions (Georgia can see ice storms),
              the outage cost may justify the higher upfront underground spend.
            </p>
            <p className="text-sm text-slate-300/90 mt-2">
              <strong>Underground:</strong> Lower storm exposure once buried. Dig-ins from
              other contractors are the primary failure mode (always mitigated by 811 locate).
              Accessing a buried cable for repair requires excavation — slower and more
              disruptive than aerial access. Over 30 years, underground typically has fewer
              outages but each is longer and more expensive to repair.
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field — Weighted Scoring Matrix vs. PM Intuition</p>
          <p className="text-slate-300/90">
            <strong>Book (BICSI OSPDR route planning guidance; RUS planning documentation):</strong>
            Formal route-selection methodologies recommend a weighted scoring matrix. You assign
            weights to criteria (e.g., cost 30%, constructability 25%, permitting 25%,
            maintenance 20%). Each route option is scored 1–10 on each criterion. Multiply
            score by weight for each criterion, sum the products, and the highest-scoring route
            wins. The matrix is documented, auditable, and defensible in a RUS loan application
            or when a client questions why Route B was selected over Route A.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> An experienced project manager often makes the
            aerial-vs-underground call in a 30-second walkthrough. The mental model: "Who owns
            the ROW? Does the road authority play nice in this county? How many encroachments are
            in this segment? Do we have the boring rig available?" A seasoned PM's rapid
            assessment almost always lands in the same place the matrix lands — just faster and
            without a spreadsheet.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Teaching both:</strong> The matrix is valuable for RUS submittals and for
            justifying costs to a client in writing. The PM's intuition is valuable for rapid
            field triage when you're walking a route and need to flag high-cost segments before
            you return to the office. A skilled surveyor can do the quick-triage version in the
            field — "aerial is the obvious choice here, underground is the obvious choice there,
            this 400 ft segment through the wetland needs a formal permit/cost analysis" —
            and attach a formalized scoring sheet to the handoff package afterward.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk of relying on intuition alone:</strong> A PM's mental model
            works until it encounters an unfamiliar terrain type, a jurisdictional quirk they
            haven't seen, or a political dynamic with a new road authority. The matrix documents
            the reasoning, so if the PM's call turns out to be wrong, the project team can
            trace back what was weighted incorrectly and improve the model. Pure intuition
            produces no audit trail.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Documenting route alternatives in the field</h3>
        <p>
          During the site walk, document each identified route alternative with:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li><strong>Route ID and start/end GPS coordinates</strong> — "Route A: County Road 14, STA 0+00 at lat/lon to STA 12+800 at lat/lon."</li>
          <li><strong>Length</strong> — measured or estimated from GIS map (aerial imagery + scale bar).</li>
          <li><strong>Proposed plant type</strong> — aerial, underground direct-bury, underground conduit, HDD crossing, or mixed.</li>
          <li><strong>Field-observed cost drivers</strong> — "2 rock outcroppings visible near STA 4+200 and STA 7+800; 1 state highway crossing at STA 6+100; existing poles available for 70% of route."</li>
          <li><strong>Permitting triggers flagged</strong> — wetland markers, highway crossings, historic area signage.</li>
          <li><strong>Preliminary field recommendation</strong> — aerial (low make-ready), aerial (significant make-ready), underground (easy terrain), underground (complex terrain), or "requires formal tradeoff analysis."</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          This documentation becomes part of the handoff package (T04.L08). The design engineer
          uses it as the starting point for the formal route alternatives analysis and weighted
          scoring matrix.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Mixed-plant routes — when neither pure aerial nor underground wins</h3>
        <p>
          Many OSP routes aren't a clean aerial-or-underground decision for the full length.
          A typical rural project might run aerial for 8 miles along county road poles, convert
          to underground for a 1-mile segment through a town center where aerial plant isn't
          permitted by the local ordinance, and use HDD for three road and creek crossings.
          The route documentation needs to capture these transitions clearly:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>Station where plant type changes (aerial-to-UG transition point)</li>
          <li>Reason for the transition (ordinance, terrain, permitting constraint)</li>
          <li>Whether existing conduit is in place at the underground segments (a pre-existing duct bank dramatically reduces UG cost)</li>
          <li>Special crossing method (HDD, jacking and boring, open-cut pavement)</li>
        </ul>
        <p className="mt-2">
          Each transition point is a GIS point in the landbase layer, with an attribute noting
          the plant type change. The design engineer uses these points to scope the make-ready,
          the UG conduit installation, and the crossing permits as separate work items with
          separate cost line items.
        </p>

        <h3 className="mt-5 font-semibold">RUS route-alternatives requirement for loan packages</h3>
        <p>
          RUS-funded projects typically require the borrower to document that alternative routes
          were considered and that the selected route is the most cost-effective option for the
          service area. The documentation format varies by RUS district and loan officer, but
          generally includes:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>A map showing the selected route and each alternative considered</li>
          <li>A brief narrative for each alternative explaining why it was ruled out (higher cost, constructability problem, permitting obstacle, or community objection)</li>
          <li>The cost comparison (even rough order-of-magnitude costs suffice at the application stage)</li>
          <li>The selected route with the rationale for selection</li>
        </ol>
        <p className="mt-2">
          The field-survey documentation from this lesson is the raw input for that requirement.
          A well-documented survey makes the RUS loan package much easier to assemble —
          a poorly documented survey means the engineering firm has to make a second field visit
          to capture information that should have been documented the first time.
        </p>
      </section>

      {/* ── SORTABLE ─────────────────────────────────────────────────────── */}
      <Sortable
        title="Rank These Field Observations by Permitting Risk"
        description="Drag these field observations into order from LOWEST permitting risk (top) to HIGHEST permitting risk (bottom). Assume all routes are in a typical southern U.S. rural county."
        items={[
          { id: 'county-road', label: 'Route follows county road shoulder in public ROW for entire length — no water crossings, no state highway' },
          { id: 'state-highway', label: 'Route crosses a state highway at one point — requires state DOT encroachment permit' },
          { id: 'railroad', label: 'Route crosses an active Class I railroad — requires railroad company crossing permit and likely a third-party flagging contractor' },
          { id: 'wetland', label: 'Route passes through a delineated jurisdictional wetland for 800 ft — triggers USACE Section 404 review' },
          { id: 'navigable-waterway', label: 'Route must cross a navigable river — requires USACE NWP 57 review and potentially an individual Section 10/404 permit' },
        ]}
        correctOrder={['county-road', 'state-highway', 'railroad', 'wetland', 'navigable-waterway']}
        feedbackCorrect="Correct. County road shoulder in public ROW has the lowest permitting complexity. State DOT encroachment permits are routine but add 3–6 months. Railroad crossings add coordination with a private company and safety flagging requirements. Wetland crossings trigger USACE Section 404 review and may require mitigation. Navigable waterway crossings carry the highest permitting risk: USACE Nationwide Permit 57 (NWP 57) bundles both Section 10 RHA and Section 404 authorization for qualifying telecom crossings in a single permit — but if the project doesn't qualify for NWP 57, individual permits under Section 404 and potentially a separate Section 10 RHA permit may be required, adding 90 days to 18 months to the schedule."
        feedbackIncorrect="Not quite. Consider who needs to approve each situation: county road = county (relatively fast); state highway = state DOT (slower); railroad = private company + safety requirements; wetland = USACE Section 404 (federal review); navigable waterway = USACE NWP 57 covers both Section 10 RHA and Section 404 for qualifying crossings — if NWP 57 doesn't apply, individual permits add 90 days to 18 months (most complex). The more regulatory steps involved, the higher the permitting risk."
      />

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T04-L05-scenario-1"
        title="Route Selection Decision — Aerial or Underground?"
        description="You're conducting a route survey for a 2-mile OSP build. You've identified two route options. Review the field observations for each and choose the recommended approach."
        startNodeId="present-options"
        nodes={{
          'present-options': {
            id: 'present-options',
            prompt: `Route A — Aerial along existing county road (2.1 miles):
• Existing utility poles along 100% of route, all owned by the local electric cooperative
• Field observation: 12 poles have space in the communications zone; 3 poles appear over-attached (make-ready likely needed)
• No water crossings; stays in county ROW throughout
• Road shoulder: 8 ft paved, adequate for bucket truck access
• Terrain: flat, easy access, no staging concerns
• Estimated make-ready cost (rough): $3,000–$6,000

Route B — Underground along same road, east side (2.0 miles):
• No existing conduit; would require new trench installation
• Field observation: rock outcroppings visible at STA 0+400 and STA 1+200
• Crosses a delineated wetland for 400 ft near STA 0+800 (wetland markers observed)
• Road surface: asphalt — cutting and patching required for any trench in the road shoulder

Which route do you recommend documenting as the preferred option in the handoff package?`,
            choices: [
              { label: 'Route A (Aerial) — lower construction cost, no permitting complications, existing poles usable', nextId: 'route-a-correct' },
              { label: 'Route B (Underground) — underground is more reliable long-term even with the added cost', nextId: 'route-b-consider' },
              { label: 'Flag both as equivalent and let the design engineer decide without a field recommendation', nextId: 'no-recommendation' },
            ],
          },
          'route-a-correct': {
            id: 'route-a-correct',
            prompt: 'Good call. Route A has significantly lower permitting risk (no USACE wetland review), lower construction cost (existing poles, minor make-ready), and no rock-excavation risk. The 3 make-ready poles add cost but are manageable and will be confirmed in the formal make-ready analysis. Your handoff package documents Route A as preferred with Route B noted as the evaluated alternative and eliminated due to wetland permitting complexity and rock-excavation uncertainty. The design engineer receives a clear field-grounded recommendation.',
            isEnd: true,
            outcome: 'success',
            outcomeLabel: 'Preferred route identified and documented',
            explanation: 'Route A is clearly preferable at the field-survey level: lower permitting risk, lower construction cost, and higher constructability. The wetland crossing on Route B is a significant permitting and environmental risk — USACE Section 404 review adds 3–18 months to the timeline and may impose mitigation conditions. Three make-ready poles on Route A are manageable compared to 400 ft of wetland crossing on Route B.',
          },
          'route-b-consider': {
            id: 'route-b-consider',
            prompt: 'Underground plant does have better long-term storm resilience. But consider the specific constraints on Route B: 400 ft of wetland crossing triggers USACE Section 404 review (potentially 3–18 months of permitting delay), rock outcroppings at two points add excavation cost and schedule risk, and asphalt cutting adds to the cost. On a RUS-funded project, the additional permitting timeline could jeopardize construction-season windows. What specific factor on Route B justifies accepting these risks over Route A?',
            choices: [
              { label: 'Reconsidering — Route A is actually the better-documented choice given the wetland and rock factors on Route B', nextId: 'route-a-correct' },
              { label: 'The long-term storm reliability of underground plant justifies the permitting delay and higher construction cost', nextId: 'route-b-noted' },
            ],
          },
          'route-b-noted': {
            id: 'route-b-noted',
            prompt: 'Long-term storm resilience is a legitimate engineering consideration — and if the project area has a history of severe ice storms or frequent aerial outages, that factor may legitimately outweigh the permitting delay. But at the field-survey level, you\'re flagging the tradeoffs — not deciding for the client. The correct action is to document BOTH routes with their respective field observations and flag "Route B requires USACE wetland review — suggest owner engage environmental consultant before selecting this route." The client and design engineer make the final call with that information in hand.',
            isEnd: true,
            outcome: 'partial',
            outcomeLabel: 'Valid consideration — but the field worker flags, not decides',
            explanation: 'Long-term reliability is a valid route-selection factor. But the field walker\'s job is to document field-observed tradeoffs accurately, not to override engineering considerations. Flagging "Route B: wetland crossing requires USACE Section 404 review" and "Route B: rock outcroppings at STA 0+400 and STA 1+200" provides the design engineer and owner with the information they need to make the final route decision with eyes open.',
          },
          'no-recommendation': {
            id: 'no-recommendation',
            prompt: 'Flagging both as equivalent without a field recommendation leaves the design engineer without the field context they need. The engineer wasn\'t on-site — they rely on your observations to understand the constructability and permitting landscape. "Both options are equivalent" is almost never true when you have a 400 ft wetland crossing and rock outcroppings on one route and none on the other. A field-grounded recommendation backed by your documented observations is more valuable than a neutral hand-off.',
            isEnd: true,
            outcome: 'failure',
            outcomeLabel: 'Field recommendation missing — add value with your observations',
            explanation: 'Field surveyors are uniquely positioned to assess constructability and permitting triggers because they\'ve physically walked both routes. Document what you observed (wetland markers, rock, access), provide a field-grounded recommendation, and note what the design engineer should formally evaluate. That combination — observed facts + field recommendation + noted uncertainties — is the highest-value handoff.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T04.L05 Check — Route Alternatives Analysis"
        mode="multiple-choice"
        questions={[
          {
            id: 'T04-L05-Q1',
            type: 'mc',
            prompt:
              'During a route walk, you observe wetland-delineation flagging along 300 ft of Route B. What is the correct field-survey action?',
            choices: [
              'Avoid Route B entirely and recommend Route A without documenting the wetland observation',
              'Note the wetland markers in the survey documentation, flag "possible jurisdictional wetland — USACE Section 404 review may be required," and include the GPS coordinates of the flagged area in the handoff package',
              'Remove the wetland flagging stakes so the designer doesn\'t see them and complicate the design',
              'Mark Route B as "not constructable" and eliminate it from consideration without further documentation',
            ],
            answerIndex: 1,
            explanation:
              'Wetland delineation markers indicate a potentially jurisdictional wetland. The field surveyor\'s job is to document and flag — not to make the jurisdictional determination. The correct action is to record the location, note the observation in the survey document, and flag it as requiring a regulatory review. The project team then decides whether to pursue a USACE permit for Route B or select Route A. Eliminating a route in the field without documentation is not appropriate — the client needs documented options and their constraints.',
            citation: '33 CFR Part 320-332 — USACE Section 404 wetland permit framework; NEPA implementing regs at 40 CFR Part 1500-1508.',
          },
          {
            id: 'T04-L05-Q2',
            type: 'mc',
            prompt:
              'An experienced project manager walks a route and makes a fast aerial-vs-underground call based on field observation without completing a formal weighted scoring matrix. What is true about this approach?',
            choices: [
              'It is always wrong and should be replaced with a formal matrix for every decision',
              'It is a valid field-triage technique that can accelerate early survey decisions, but the scoring matrix should be completed afterward for RUS documentation and project defensibility',
              'It is only acceptable if the PM has more than 20 years of experience',
              'The matrix and the PM\'s intuition will always produce the same answer, so either is acceptable without the other',
            ],
            answerIndex: 1,
            explanation:
              'Experienced PM field triage is a real and effective technique — it often produces the correct answer faster than a formal matrix. But the matrix serves a documentation purpose that field intuition cannot replace: RUS loan packages require documented route alternatives with written justification; clients may dispute a route selection without a paper trail; post-construction audits reference the design-phase documentation. The right approach: triage in the field, formalize the scoring on paper.',
          },
          {
            id: 'T04-L05-Q3',
            type: 'fill-in-blank',
            prompt:
              'The degree to which a proposed route can be built with available equipment, within physical terrain constraints, and within the project timeline is called ____.',
            answer: 'constructability',
            answerDisplay: 'constructability',
            explanation:
              'Constructability is one of the four primary field-level criteria for comparing route alternatives. Low constructability (rock excavation required, no staging area, narrow access road, specialized equipment needed) adds cost and schedule risk even when the engineering design is sound. Field surveyors assess constructability by observing access, terrain, and available staging areas during the site walk.',
          },
          {
            id: 'T04-L05-Q4',
            type: 'mc',
            prompt:
              'Which of the following field observations indicates the HIGHEST permitting risk for a proposed underground route segment?',
            choices: [
              'The route follows a county road shoulder for 4 miles with no crossings',
              'The route crosses a state highway once, requiring a state DOT encroachment permit',
              'The route crosses an active navigable river — the county records show it\'s a federally designated waterway',
              'The route passes through private agricultural land with a known easement already recorded',
            ],
            answerIndex: 2,
            explanation:
              'Crossing a federally designated navigable waterway is the highest-permitting-risk scenario listed. USACE Nationwide Permit 57 (Electric Utility Line and Telecommunications Activities, post-2021 reissuance) authorizes BOTH Section 10 of the Rivers and Harbors Act AND Section 404 of the Clean Water Act for qualifying telecom crossings in a single permit — the two authorities are bundled together under NWP 57, not separate hurdles. If the crossing does not qualify for NWP 57 (too large, listed species, or other thresholds), then an individual permit under Section 404 and potentially a separate Section 10 RHA individual permit may be required, which can take 90 days to 18 months. State DOT crossings are routine (typically 3–6 months). County road shoulder work in public ROW is the lowest-risk scenario. A recorded private easement means ROW access is already resolved.',
            citation: 'USACE NWP 57 — Electric Utility Line and Telecommunications Activities (post-2021 reissuance); 33 CFR Part 330.1(b) (NWP covers Section 10 and 404 jointly); 33 CFR Part 320-332.',
          },
        ]}
      />

    </LessonLayout>
  );
}
