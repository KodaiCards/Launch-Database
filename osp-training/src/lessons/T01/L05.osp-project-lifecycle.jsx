// Net-new — T01 Fundamentals & Vocabulary, Lesson 5
// T01.L05 — The OSP Project Lifecycle
// Foundation lesson: from survey to as-built — the seven stages and how they connect

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';

export const meta = {
  id: 'T01.L05',
  course_id: 'T01',
  title: 'The OSP Project Lifecycle',
  order: 5,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T01.L02', 'T01.L03'],
  vocabulary_introduced: [
    'survey',
    'design',
    'permit',
    'make-ready',
    'OTMR',
    'construction',
    'testing',
    'as-built',
    'close-out',
    'RUS Form 219',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'OLT', source_lesson_id: 'T01.L01' },
    { term: 'ONT', source_lesson_id: 'T01.L01' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'splice case', source_lesson_id: 'T01.L04' },
  ],
  estimated_minutes: 25,
  learning_objectives: [
    'Name the seven stages of an OSP project in order and describe the primary output of each stage',
    'Explain why OTMR allows a fiber attacher to hire its own make-ready contractor and identify the 15-business-day completion deadline for simple make-ready under 47 CFR 1.1411(h)(2)(ii)',
    'Distinguish between an as-designed drawing and an as-built record and explain why both are required at project close-out',
    'Identify which project stage produces the permit package and which agency types must approve it before construction begins',
  ],
};

export default function T01L05_OspProjectLifecycle() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          No OSP fiber project builds itself. From the first day a design engineer walks the route to the moment a splicer closes the last splice case, there are seven distinct stages. Each stage has different people doing different work, different deliverables, and different risks. Understanding the sequence — and what happens if one stage fails — is what separates a field crew that knows their job from one that just shows up.
        </p>

        <h3 className="font-semibold">Building on T01.L01–L04</h3>
        <p className="text-sm text-slate-300/90">
          You've learned what <strong>OSP</strong> means, how poles are structured, what cables are made of, and how fibers are spliced in <strong>splice cases</strong>. You know about <strong>attachments</strong> on poles and the signal path from <strong>OLT</strong> at the headend to <strong>ONT</strong> at the customer. Now you'll see how all those pieces fit together in a real project timeline.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2 mb-4">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS Form 219</td>
              <td className="px-3 py-2">Rural Utilities Service Form 219</td>
              <td className="px-3 py-2">The USDA RUS project completion certification form required at close-out for RUS-funded OSP telecom projects. Governed by 7 CFR Part 1753 (RUS Telecommunications Program) [confirm specific section]. Must be PE-signed. Accompanies as-built drawings, splice records, and OTDR test records. Note: 7 CFR Part 1726 governs the Electric Borrowers program — a separate RUS program; do not cite 1726 for telecom close-out.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTMR</td>
              <td className="px-3 py-2">One-Touch Make-Ready</td>
              <td className="px-3 py-2">FCC-mandated process (47 CFR 1.1411) that allows a qualified contractor hired by the new attacher to perform make-ready work in a single visit rather than waiting for each existing attachment owner to schedule separate work. Reduces make-ready timelines significantly.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Tier 1 / Tier 2</td>
              <td className="px-3 py-2">Testing tiers (TIA-568)</td>
              <td className="px-3 py-2">Tier 1 = OLTS (Optical Loss Test Set) — end-to-end insertion loss measurement. Tier 2 = OTDR — full trace that locates and characterizes every event in the link. Both tiers are typically required for OSP acceptance testing.</td>
            </tr>
          </tbody>
        </table>

        <h2>In Plain English</h2>
        <p>
          An OSP fiber project doesn't start with a shovel or a cable reel. It starts with a
          walk — literally a site survey where someone walks the proposed route and records
          what's there. From that first site walk to the final paperwork package handed over
          to the client, there are seven distinct stages every project moves through. Understanding
          this lifecycle tells you where you fit in and what comes before and after your part.
        </p>
        <p className="mt-2">
          Missing or short-cutting any stage creates problems downstream. A poor survey creates
          a bad design. A bad design creates permitting delays. Missing permits stop construction.
          Poor construction fails testing. Failed testing means rework. No as-built documentation
          means no one can find or fix a fault five years later. The stages exist because they work.
        </p>

        <h3 className="mt-5 font-semibold">The seven stages — overview</h3>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-slate-300/90">
          <li>
            <strong>Route Survey</strong> — Field walk of the proposed route. Records existing
            poles, attachments, underground utilities, obstructions, crossings, and measurements.
            Captures the data that makes design possible.
          </li>
          <li>
            <strong>Design</strong> — Engineers or designers use survey data to produce the
            construction drawings: cable routes, pole attachment heights, conduit layouts,
            splice locations, fiber counts, equipment locations. The design package is what
            contractors actually build from.
          </li>
          <li>
            <strong>Permitting</strong> — Obtaining approval from every authority that has
            jurisdiction over the route: pole attachment agreements from the pole owner,
            right-of-way (ROW) permits from state DOTs or counties, environmental clearances,
            municipal encroachment permits. Permitting can take weeks to months and runs
            in parallel with make-ready.
          </li>
          <li>
            <strong>Make-Ready</strong> — Before new fiber can attach to shared poles, existing
            attachments often need to be moved, raised, or modified to make room and meet NESC
            clearances. The pole owner manages make-ready; the fiber company pays for it. This
            is often the longest and most expensive pre-construction stage.
          </li>
          <li>
            <strong>Construction</strong> — Cables are installed, splice cases are placed,
            conduit is buried, handholes are set. The physical build. This is what most people
            picture when they think of "fiber installation."
          </li>
          <li>
            <strong>Testing</strong> — Every fiber in the cable plant is tested. Tier 1: loss
            (with a light source and power meter). Tier 2: OTDR trace. Results are compared
            to the design's loss budget and acceptance criteria. Failed fibers are repaired
            before acceptance.
          </li>
          <li>
            <strong>As-Built Documentation and Close-Out</strong> — After testing passes, the
            "as-built" package is created: updated drawings showing what was actually built
            (vs. what was designed), splice records, test records, permit copies. For
            RUS-program projects, this includes RUS Form 219 and related documentation.
            The as-built package is handed over to the client and becomes the permanent
            record of the network.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Project management textbooks present these stages as clean,
            sequential phases with defined handoffs. Stage 3 (permitting) starts after Stage 2
            (design) is complete. Stage 5 (construction) starts after Stage 4 (make-ready) is
            complete.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Real projects run stages in parallel to save time. Permitting
            often starts from a 90%-complete design rather than waiting for 100%. Make-ready
            can begin on the first segments while design is still completing the rest of the
            route. Construction starts on permitted, make-ready-complete segments while other
            segments are still in make-ready. Managing this parallel-track overlap is the job
            of the project manager — and why understanding all seven stages matters even if
            you personally only work on one or two.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Stage Details — What Each Produces</h2>

        <h3 className="mt-2 font-semibold">Stage 1: Route Survey</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> Survey technicians (stakers) or engineers walking the
          field. Often assisted by drone/LiDAR capture for rural routes.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>What it produces:</strong> A field data package: pole measurements (height,
          class, existing attachments and heights), underground utility locations, crossing
          measurements, handhole/manhole locations, GPS waypoints, and photographs. This
          feeds directly into the design.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Survey report + field notes + GIS data file.
        </p>

        <h3 className="mt-4 font-semibold">Stage 2: Design</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> OSP designers or engineers using GIS software
          (AutoCAD, MicroStation, Katapult, Esri ArcGIS) and load calculation tools.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>What it produces:</strong> Construction drawings (plan and profile or plan
          view), cable schedule (fiber counts per segment), splice matrix, make-ready analysis,
          equipment lists, and load calculations for pole attachments.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Design package (drawings + specs + calculations).
          This package is the basis for the make-ready application and the permitting applications.
        </p>

        <h3 className="mt-4 font-semibold">Stage 3: Permitting</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> Permitting specialists. Involves multiple agencies
          simultaneously: pole owner (attachment agreement), state DOT (ROW encroachment),
          county or city (municipal permits), and federal agencies where required (Corps of
          Engineers for waterway crossings, FCC if certain federal lands are crossed).
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Executed permit documents. Construction cannot begin
          on any segment until permits for that segment are in hand.
        </p>

        <h3 className="mt-4 font-semibold">Stage 4: Make-Ready</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> Make-ready crews employed by the pole owner or their
          authorized contractors. The fiber company funds it but doesn't control the timeline
          (within FCC-regulated limits: under OTMR, simple make-ready must be completed
          within 15 business days of approval — the 15 days is the completion deadline,
          not a start window; complex attachments follow a multi-party timeline). (Detail in T08.)
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Completed make-ready (each pole brought into compliance
          to accommodate the new fiber attachment). Make-ready completion notice triggers the
          fiber company's right to attach.
        </p>

        <h3 className="mt-4 font-semibold">Stage 5: Construction</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> OSP construction crews. Aerial: strand truck, lashing
          machine, climbing crew for attachments and splice cases. Underground: directional
          bore crew, trenching crew, restoration crew.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Installed cable plant (aerial + underground), splice
          cases placed and sealed (fibers not yet spliced), conduit runs complete, handholes
          and manholes set. <em>Note: cables are typically installed first, splicing happens
          second in a separate pass.</em>
        </p>

        <h3 className="mt-4 font-semibold">Stage 6: Testing</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> Test technicians (often splicers who tested after each
          splice, plus a dedicated final acceptance test team). Client's engineer may witness
          the final acceptance test.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output:</strong> Test records for every fiber: bidirectional OTDR traces
          (Tier 2) and end-to-end insertion loss (Tier 1). Pass/fail against the design
          acceptance criteria.
        </p>

        <h3 className="mt-4 font-semibold">Stage 7: As-Built and Close-Out</h3>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Who does it:</strong> Designers update drawings to reflect field-as-built
          conditions. Field crew provides redlines (handmarked changes on paper or digital
          drawings) from the construction. Documentation team compiles the package.
        </p>
        <p className="text-sm text-slate-300/90 mt-1">
          <strong>Key output for RUS-program projects:</strong> RUS Form 219 (project completion
          report), certified as-built drawings, splice records, OTDR test records, permit
          copies. This package is required before RUS will advance funds on the project and
          before the network is accepted by the client.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — The As-Designed vs. As-Built Gap</h2>
        <p>
          No construction project is built exactly as designed. Poles move. Conduit routes
          shift to avoid an unexpected obstacle. A splice case gets repositioned. The "as-built"
          package documents these deviations — it's what was actually built, not what was
          originally planned.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          For a fiber network, the as-built has a second life: it becomes the operations and
          maintenance (O&amp;M) database. When a fault occurs on fiber 47 of a 144-fiber cable
          in 2031, the technician needs the splice records from 2024 to know: "Fiber 47 in
          this cable corresponds to buffer tube 4, fiber 11 — and that tube connects to the
          FDH at Oak Street." Without the as-built, troubleshooting is guesswork.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          The quality of the as-built is a direct function of field documentation discipline
          during construction and splicing. Splicers who photograph every splice case before
          closing it and fill in splice records accurately are building a future-proof network.
          Splicers who skip documentation are creating a time bomb.
        </p>
        <p className="mt-2 text-sm text-slate-300/90">
          Source: RUS Bulletin 1751F-630 §14 (close-out documentation requirements);
          TIA-606-D (administration standard for fiber infrastructure documentation).
        </p>
      </section>

      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L05"
        cards={[
          { id: 'T01-L05-FC-survey', front: 'Survey (Route Survey)', back: 'Stage 1 of an OSP project: field walk of the proposed route to record existing poles, attachments, underground utilities, span lengths, crossing measurements, and GPS waypoints. Feeds the design package.' },
          { id: 'T01-L05-FC-design', front: 'Design', back: 'Stage 2: engineers or designers use survey data to produce construction drawings — cable routes, splice locations, fiber counts, load calculations, make-ready analysis. The design package is what contractors build from.' },
          { id: 'T01-L05-FC-permit', front: 'Permit', back: 'Stage 3: approvals from every authority with jurisdiction over the route — pole attachment agreement, state DOT ROW permit, environmental clearances, municipal encroachment permits. Construction cannot begin until permits for that segment are in hand.' },
          { id: 'T01-L05-FC-make-ready', front: 'Make-ready', back: 'Stage 4: moving or modifying existing pole attachments to make room for the new fiber attachment and restore NESC clearances. Done by the pole owner\'s crew. Fiber company funds it but doesn\'t control the timeline. Often the longest pre-construction stage.' },
          { id: 'T01-L05-FC-construction', front: 'Construction', back: 'Stage 5: installing the physical cable plant — aerial cable on poles, conduit underground, splice cases, handholes. Cables are typically installed first; splicing happens in a separate pass.' },
          { id: 'T01-L05-FC-testing', front: 'Testing', back: 'Stage 6: every fiber in the cable plant is tested. Tier 1 (OLTS — end-to-end loss) and Tier 2 (OTDR — event location and trace). Results compared to the design loss budget. Failed fibers are repaired before acceptance.' },
          { id: 'T01-L05-FC-as-built', front: 'As-built', back: 'Updated drawings that show what was actually built vs. what was designed. Part of the close-out package. Becomes the permanent O&M record — a technician in 2045 needs the as-built to trace a fault back to a specific splice case and fiber.' },
          { id: 'T01-L05-FC-close-out', front: 'Close-out', back: 'Stage 7: the final documentation package handed to the client — as-built drawings, splice records, test records, permit copies. For RUS-program projects includes RUS Form 219. Required before RUS advances funds and before client acceptance.' },
          { id: 'T01-L05-FC-rus-form-219', front: 'RUS Form 219', back: 'The USDA Rural Utilities Service project completion certification form. Required for RUS-funded OSP projects at close-out. Must be signed by the PE responsible for the project. Accompanies the as-built drawings, splice records, and OTDR test records.' },
          { id: 'T01-L05-FC-otmr', front: 'OTMR (One-Touch Make-Ready)', back: 'FCC-mandated process (47 CFR 1.1411) that allows a qualified contractor hired by the new attacher to perform make-ready work in a single visit rather than waiting for each existing attachment owner to schedule separate work. Reduces make-ready timelines significantly.' },
        ]}
      />

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T01-L05-scenario-1"
        title="The Skipped Stage"
        description="A project manager wants to save time by starting construction before make-ready is complete. Walk through the consequences."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            text: 'The project is behind schedule. The PM says: "Three of the five segments have completed make-ready. Can we start construction on all five segments now and deal with the other two segments\' make-ready later?"',
            choices: [
              { label: 'Yes — start construction on all five segments now', nextId: 'bad-choice' },
              { label: 'No — only begin construction on the three permitted and make-ready-complete segments', nextId: 'good-choice' },
            ],
          },
          'bad-choice': {
            id: 'bad-choice',
            text: 'Construction begins on all five segments. Three weeks later, the two remaining make-ready segments are approved — but the make-ready crews find that the new fiber attachment conflicts with an electric utility cable that needs to be moved to make room. Who pays for the re-work on the already-installed fiber?',
            choices: [
              { label: 'The fiber company pays — it installed before make-ready was approved', nextId: 'bad-outcome' },
              { label: 'The electric utility pays — it\'s their pole', nextId: 'bad-outcome-2' },
            ],
          },
          'bad-outcome': {
            id: 'bad-outcome',
            text: 'Correct. The fiber company is responsible because they installed without proper make-ready completion. The already-installed cable on those two segments must be moved or re-lashed at their expense. The "time saved" by starting early cost more in rework than was gained. Lesson: make-ready approval is a hard gate for construction, not a suggestion.',
            isEnd: true,
          },
          'bad-outcome-2': {
            id: 'bad-outcome-2',
            text: 'No — the electric utility\'s existing equipment was there first. The fiber company installed without make-ready approval, which means the fiber company bears the cost of any conflict resolution. The electric utility\'s equipment has priority. Lesson: permits and make-ready approval protect you from exactly this outcome.',
            isEnd: true,
          },
          'good-choice': {
            id: 'good-choice',
            text: 'Construction begins on the three completed segments. Two weeks later, the remaining two segments complete make-ready. Construction continues in order. The project runs slightly behind the aggressive original schedule, but all five segments are built correctly without conflict or rework.',
            choices: [
              { label: 'Accept the slight delay — this is the right call', nextId: 'good-outcome' },
              { label: 'The PM should have taken the risk and started on all five', nextId: 'good-outcome-2' },
            ],
          },
          'good-outcome': {
            id: 'good-outcome',
            text: 'Correct. Respecting the make-ready gate protects the project from costly rework and legal disputes with the pole owner. A two-week delay in construction is far cheaper than re-lashing installed cable, resolving conflict claims, or facing stop-work orders. Good project management means sequencing correctly, not cutting corners.',
            isEnd: true,
          },
          'good-outcome-2': {
            id: 'good-outcome-2',
            text: 'The risk is real and the downside is large. Pole attachment agreements typically require make-ready completion before new attachment. Violating this creates breach-of-contract exposure, potential removal orders from the pole owner, and conflict with NESC clearance requirements. The "risk" is not a business risk — it\'s a contractual and safety compliance failure.',
            isEnd: true,
          },
        }}
      />

      {/* ── PRACTICE QUIZ ───────────────────────────────────────────────── */}
      <Quiz
        title="T01.L05 Check — OSP Project Lifecycle"
        mode="multiple-choice"
        questions={[
          {
            id: 'T01-L05-Q1',
            type: 'mc',
            prompt:
              'What is the primary purpose of the as-built documentation package delivered at close-out?',
            choices: [
              'To satisfy the project manager that the construction crew followed the design exactly',
              'To serve as the permanent record of what was actually built — used for O&M, fault troubleshooting, and future network expansion for the life of the infrastructure',
              'To justify the project cost to the funding agency',
              'To document the test results that prove the fiber meets manufacturer specifications',
            ],
            answerIndex: 1,
            explanation:
              'The as-built is a 25+ year document. It\'s used by O&M technicians to locate faults, by expansion designers to understand the existing plant, and by regulators to verify compliance. While it may also satisfy the client and funding agency, its primary value is as the permanent operational record. Test records are part of the as-built package but are not the package\'s primary purpose.',
            citation: 'RUS Bulletin 1751F-630 §14; TIA-606-D.',
          },
          {
            id: 'T01-L05-Q2',
            type: 'mc',
            prompt:
              'A construction crew begins installing aerial cable on a pole route while make-ready is still pending approval on two segments. Which risk does this create?',
            choices: [
              'No risk — construction and make-ready can proceed in parallel on the same segment',
              'The crew may install cable that later conflicts with make-ready requirements, forcing rework at the fiber company\'s expense',
              'Testing cannot occur until all permits are finalized',
              'The OTDR calibration will be inaccurate if the cable is tested before make-ready is complete',
            ],
            answerIndex: 1,
            explanation:
              'Make-ready clears the pole so the new attachment fits within NESC clearances and doesn\'t conflict with existing attachments. Installing before make-ready is approved risks installing at the wrong height, creating clearance violations, or needing to move the newly installed cable when the make-ready work moves an existing attachment. This is a rework cost borne by the fiber company under most pole attachment agreements.',
            citation: '47 CFR 1.1411 (OTMR pole attachment rules); NESC C2-2023 §§23.',
          },
          {
            id: 'T01-L05-Q3',
            type: 'fill-in-blank',
            prompt:
              'The phase of an OSP project where existing attachments on shared poles are moved or modified to make room for the new fiber attachment is called ____.',
            answer: 'make-ready',
            answerDisplay: 'make-ready',
            explanation:
              'Make-ready work prepares a pole to accept the new attachment within NESC clearances. It may involve raising existing cables, relocating hardware, or replacing the pole if it cannot accommodate the load. The pole owner\'s crew (or their authorized contractor) performs make-ready, but the fiber company bears the cost under standard pole attachment agreements.',
            citation: '47 CFR 1.1411; FCC 18-111 (OTMR rules).',
          },
          {
            id: 'T01-L05-Q4',
            type: 'mc',
            prompt:
              'In a large OSP project, which two stages most commonly run in parallel (overlapping in time) to shorten the overall project schedule?',
            choices: [
              'Survey and design — they cannot start at the same time',
              'Testing and close-out — close-out forms are prepared while final testing is in progress',
              'Permitting and make-ready — permitting applications and make-ready requests can be submitted simultaneously after design is substantially complete',
              'Construction and testing — OTDR testing is performed while cable is still being installed',
            ],
            answerIndex: 2,
            explanation:
              'Permitting and make-ready are both applications that go to external parties (regulators and the pole owner, respectively) after design is substantially complete. Both have external review/approval timelines outside the project\'s control. Running them in parallel — submitting both as soon as the design supports them — is standard practice to reduce the overall project schedule. Note: actual construction on any segment must still wait until both that segment\'s permits AND make-ready are complete.',
          },
        ]}
      />

      {/* ── TYING IT TOGETHER ─────────────────────────────────────────── */}
      <div className="lesson-callout mt-8 bg-blue-400/5 border border-blue-400/30">
        <h4>Tying It Together: The Seven Stages Frame Every OSP Job</h4>
        <p className="text-sm text-slate-300/90">
          You now know the seven stages: survey → design → permit → make-ready → construction → testing → as-built/close-out. Every person in the OSP field — designer, staker, splicer, inspector — works within this framework. A project manager oversees the timeline and risk; a designer makes choices about pole attachment and cable routing; a make-ready crew clears the pole per the design spec; a splicer executes the design. When something goes wrong (a permit denial, a NESC clearance violation, a cable break in testing), the whole sequence can slip. Understanding why each stage exists and what comes before and after it is what separates guesswork from professional execution.
        </p>
      </div>

    </LessonLayout>
  );
}
