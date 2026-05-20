// Net-new — T06.L07 Directional Boring — Pilot and Ream
// Working lesson: HDD pilot bore, reaming passes, slurry management (bentonite),
// bore-pit ground heave, swabbing, exit pit setup.
// Sources: M09 §9.2 backbone + net-new HDD detail; RUS 1751F-635

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L07',
  course_id: 'T06',
  title: 'Directional Boring — Pilot and Ream',
  order: 7,
  lesson_type: 'working',
  prerequisites: ['T06.L01', 'T06.L02', 'T06.L03', 'T06.L04', 'T06.L05', 'T06.L06'],
  learning_objectives: [
    'Explain the three-phase HDD cycle: pilot bore, reaming, product pipe/conduit pull-back',
    'Describe bentonite slurry management and why it is the key to minimizing ground heave',
    'Identify failure modes during directional boring and understand the cost/schedule consequences of each',
    'Set up an entry pit and exit pit correctly to support a bore shot',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'pilot bore',
    'reaming passes',
    'bentonite slurry',
    'bore-pit ground heave',
    'swabbing',
    'exit pit setup',
  ],
  key_terms: [
    {
      term: 'pilot bore',
      definition: 'The first phase of HDD (horizontal directional drilling): a small-diameter drill bit steered underground along a predetermined path from the entry pit to the exit pit. The pilot bore cuts a narrow hole — typically 4–6 inches in diameter — that establishes the bore path. Everything else follows this path.',
    },
    {
      term: 'reaming passes',
      definition: 'Successive enlarging passes made after the pilot bore, using a cone-shaped reamer pulled back toward the drill rig. Each pass increases the borehole diameter. For a 4-inch conduit install, a typical sequence is: 6-inch ream → 8-inch ream → 12-inch backream. Multiple passes are required to avoid over-stressing the formation and prevent slurry blow-out.',
    },
    {
      term: 'bentonite slurry',
      definition: 'A mixture of bentonite clay and water pumped continuously through the drill stem during boring. It serves three functions: (1) carries drill cuttings back out of the bore path to the entry pit, (2) stabilizes the borehole walls to prevent collapse, and (3) lubricates the bore path to reduce pull tension during conduit installation. Slurry that returns to the surface must be managed as waste — it cannot be left in ditches or waterways.',
    },
    {
      term: 'bore-pit ground heave',
      definition: 'Upward displacement of the ground surface directly above the bore path, caused by excessive slurry pressure fracturing the formation and forcing slurry into the soil voids. Visible heave looks like the ground bubbling or cracking; subsurface heave can go undetected until it lifts a road or damages adjacent utilities. Preventing heave requires correct slurry pump pressure limits, proper pilot bore diameter, and adequate soil cover above the bore path.',
    },
    {
      term: 'swabbing',
      definition: 'A pull-back pass made before conduit installation using a mandrel or pipe with a foam swab attached. Swabbing cleans slurry debris and loose cuttings from the borehole, verifying that the bore path is open and free of obstructions before the conduit is committed to the hole. A failed swab pull stops the project before you have stuck conduit.',
    },
    {
      term: 'exit pit setup',
      definition: 'Preparation of the far-end excavation where the pilot bore will exit the ground. Correct setup includes: stable pit walls (shoring if needed), a clean surface for the drill bit to emerge, a receiving area for returning slurry, a route for conduit from the spool to the bore entry, and safety clearance around the bit exit point. A poorly set-up exit pit is a safety hazard — the bit exits with high rotational force.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const vocabulary_assumed = [
  { term: 'HDD', source_lesson_id: 'T06.L01' },
  { term: 'conduit', source_lesson_id: 'T01.L02' },
  { term: 'HDPE', source_lesson_id: 'T01.L08' },
  { term: 'pull tension', source_lesson_id: 'T06.L04' },
  { term: 'ROW', source_lesson_id: 'T06.L01' },
  { term: 'bore-pit depth', source_lesson_id: 'T06.L02' },
];

export const key_terms = meta.key_terms;

export default function T06L07_DirectionalBoringPilotAndReam() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you need to run fiber conduit under a road, river, or driveway without
          tearing up the surface, you use horizontal directional drilling —
          HDD (horizontal directional drilling). Think of it like steering a long, flexible
          drill bit underground from one side of the obstacle to the other, the way a needle
          passes under a seam without coming through the top layer of fabric.
        </p>
        <p className="mt-2">
          The process happens in three stages: first you bore a small pilot hole from entry
          to exit, then you ream that hole bigger, then you pull the conduit back through.
          The whole time, a clay-and-water mixture called bentonite slurry fills the hole to
          keep it from collapsing and carry the rock and soil cuttings back out.
        </p>
        <p className="mt-2">
          Most field problems with HDD come from slurry mismanagement — either too much
          pressure (ground heaves or cracks) or too little (borehole collapses, conduit gets
          stuck). This lesson walks you through what each phase looks like and how to recognize
          when something is going wrong.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means on the job</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDD</td>
              <td className="px-3 py-2">Horizontal Directional Drilling</td>
              <td className="px-3 py-2">Trenchless underground boring along a steerable curved path</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDPE</td>
              <td className="px-3 py-2">High-Density Polyethylene</td>
              <td className="px-3 py-2">Plastic conduit used for HDD installs; flexible enough to follow the bore path</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right of Way</td>
              <td className="px-3 py-2">The legal corridor where you're allowed to install infrastructure</td>
            </tr>
          </tbody>
        </table>

        {/* Key Terms Flashcards */}
        <Flashcard
          deckId="T06-L07"
          cards={key_terms.map((kt, idx) => ({
            id: `T06-L07-fc-${idx}`,
            front: `What is ${kt.term}?`,
            back: kt.definition,
          }))}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The HDD Sequence — Phase by Phase</h2>

        <h3 className="mt-4 font-semibold">Phase 1: Entry pit and drill setup</h3>
        <p>
          Before drilling starts, the crew excavates an <strong>entry pit</strong> at the
          starting side of the bore. For a standard fiber conduit installation, the entry pit
          is typically 4–6 feet deep and large enough to allow the drill rig to establish its
          entry angle — usually 8–15° from horizontal for most soil conditions. A shallower
          angle reduces risk of heave; a steeper angle is needed to achieve the required burial
          depth quickly under a narrow ROW.
        </p>
        <p className="mt-2">
          The entry pit also acts as a slurry return basin. As drilling progresses, slurry
          carrying cuttings will flow back up the annular space (the gap between the drill
          stem and the borehole wall) and collect in the pit. The crew must pump this slurry
          to a holding tank or vac truck — it cannot be discharged into drainage ditches or
          waterways. Bentonite itself is a naturally occurring, non-hazardous inorganic clay
          mineral and is not classified as a hazardous waste under RCRA. However, bentonite
          slurry discharge into waters of the United States is regulated under CWA Section 404
          (dredge-and-fill activities) and NPDES discharge permits. Surface discharges to
          waterways, roadside drainage, or wetlands require permit compliance or are prohibited.
          (Source: CGA Best Practices v20.0, Damage Prevention chapter; RUS 1751F-635 §6;
          40 CFR Part 232 [CWA §404 definition of discharge of dredged or fill material].)
        </p>

        <h3 className="mt-5 font-semibold">Phase 2: Pilot bore — establishing the path</h3>
        <p>
          The pilot bore uses a small-diameter (typically 4–6 inch) steerable drill head
          guided by a walkover locating system or wireline guidance. The drill operator follows
          a pre-planned bore profile — a plot of depth vs. horizontal distance that keeps the
          bore path:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-300/90">
          <li>Below the required cover depth (see T06.L02 burial depth rules)</li>
          <li>Below the deepest foreign utility in the crossing zone</li>
          <li>Within the bend-radius capability of the conduit being installed</li>
          <li>Above rock or unstable soil layers that the rig cannot penetrate safely</li>
        </ul>
        <p className="mt-2">
          The pilot bore is the most critical phase — if the path is wrong, every subsequent
          step follows the wrong path. Good operators verify depth and position at regular
          intervals using a tracking locator walking on the surface above the bore.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> RUS 1751F-635 §6 specifies minimum cover depths for buried
            conduit — 24 inches minimum in non-traffic residential areas, 36 inches under
            roads and traffic-bearing surfaces. (NEC §830.47(A) specifies 18 inches as a
            separate floor for network-powered broadband cable specifically — not for general
            fiber conduit, and lower than the RUS standard which governs on RUS-funded projects.)
            The pilot bore profile must honor the applicable RUS depths at every point.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Experienced bore crews run pilot bores 6–12 inches deeper
            than the specified minimum as a standard operating practice. The reason: soil can
            shift during reaming, and a slightly deeper bore path provides a safety margin
            so the final conduit stays at or below the specified cover even if the bore
            wanders slightly upward. "A little deep is safe; a little shallow is a problem
            at the next road inspection."
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Phase 3: Reaming passes — opening the bore path</h3>
        <p>
          After the pilot bore exits at the far end, the drill crew attaches a reamer to
          the drill string at the exit end. The rig then pulls the reamer back toward
          the entry end, cutting a wider path. For a 4-inch HDPE conduit install, the
          bore path needs to be enlarged to at least 1.5× the conduit OD — so a 4-inch
          (outer diameter 4.5 inch) conduit needs at minimum a 6.75-inch borehole, and
          most crews go to 8–10 inches to allow adequate slurry circulation.
        </p>
        <p className="mt-2">
          In hard soil or rock, multiple successive reaming passes are required:
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-2 text-slate-300/90">
          <li>6-inch ream (first pass — opens pilot bore moderately)</li>
          <li>8-inch ream (second pass — needed in rock or hard clay)</li>
          <li>12-inch ream (final pass — allows adequate slurry flow around the conduit)</li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/70">
          Rule of thumb: each reaming pass should not exceed 2–3× the previous diameter
          to avoid over-stressing the formation and causing slurry fracture (heave).
          (Source: CGA Best Practices v20.0; industry field practice.)
        </p>

        <h3 className="mt-5 font-semibold">Slurry management — the make-or-break variable</h3>
        <p>
          Bentonite slurry pressure inside the borehole must stay within a range: high enough
          to carry cuttings out and support the borehole wall, but low enough to avoid
          fracturing the formation. The two failure modes are:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Too much pressure → ground heave.</strong> The slurry fractures into
            the soil voids and pushes upward. Result: the ground surface cracks or rises.
            Under a road, this can damage pavement and trigger an emergency excavation.
            Under a river, it contaminates the water (called a "frac-out" — a reportable
            environmental event under most state DOT permits).
          </li>
          <li>
            <strong>Too little pressure → borehole collapse.</strong> The walls cave in,
            pack the borehole with cuttings, and the conduit gets stuck during pull-back
            or the reamer becomes immovable. Recovery means re-boring alongside the failed
            bore — expensive and time-consuming.
          </li>
        </ul>
        <p className="mt-2">
          Slurry consistency matters too. Bentonite mixed too thin (too much water) doesn't
          carry cuttings efficiently and allows fines to settle in the bore path. Bentonite
          mixed too thick increases pump pressure and risk of heave. Experienced bore operators
          test slurry viscosity with a <em>Marsh funnel</em> — a standardized cone that measures
          how fast the slurry flows. For typical fiber bore conditions, a Marsh funnel viscosity
          of 36–48 seconds per quart is standard. (Source: field practice per CGA Best Practices v20.0.)
        </p>

        <h3 className="mt-5 font-semibold">Phase 4: Swabbing — verify before committing conduit</h3>
        <p>
          Before the actual conduit is pulled back through the bore, a crew performs a
          swabbing pass. A foam-tipped mandrel or cleaning swab is pulled back through the
          bore path to verify:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>The bore path is clear and unobstructed (no cuttings settled in the hole)</li>
          <li>The pull tension on the swab is within the expected range for the bore diameter and length</li>
          <li>No evidence of partial collapse (a swab that stops or requires excessive force is a warning sign)</li>
        </ul>
        <p className="mt-2">
          A swabbing pass is inexpensive insurance. Skipping it and pulling conduit directly
          into a debris-filled bore path risks stuck conduit — a situation that can require
          abandoning the bore and re-drilling.
        </p>

        <h3 className="mt-5 font-semibold">Phase 5: Conduit pull-back</h3>
        <p>
          The conduit (HDPE for most fiber installations) is staged on a spool at the
          exit end of the bore. A pulling head or swivel connects the leading end of the
          conduit to the drill string. The rig pulls the conduit from exit to entry while
          pumping slurry continuously to lubricate the pull.
        </p>
        <p className="mt-2">
          Pull tension is monitored continuously and compared to the conduit manufacturer's
          maximum allowable pulling tension. Exceeding the limit will deform or crack the
          conduit wall, which may not be visible externally but will fail during mandrel
          testing later. (See T06.L04 for the pull-tension formula.)
        </p>
        <p className="mt-2">
          After pull-back, the bore crew verifies the conduit did not kink at the entry or
          exit points, seals the conduit ends, and documents the as-built bore depth and
          horizontal offset from the design profile.
        </p>

        <h3 className="mt-5 font-semibold">Exit pit setup — safety requirements</h3>
        <p>
          The exit pit is where the pilot bit will surface. Before drilling starts, the
          exit pit crew must:
        </p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Confirm locate marks show no utilities in the exit pit zone</li>
          <li>Excavate to a depth that intercepts the bore path cleanly (avoid having the bit travel through unsupported soil right at surface)</li>
          <li>Shore the pit walls if depth exceeds 5 feet per OSHA 29 CFR 1926.652 (soil-specific)</li>
          <li>Clear a safety zone — the rotating bit exits with high torque and force. No personnel stand in front of the projected bit exit point</li>
          <li>Position a slurry capture setup — the bit brings slurry with it; it needs somewhere to go</li>
        </ol>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced: When the Bore Goes Wrong</h2>

        <h3 className="mt-4 font-semibold">Stuck bore: causes and recovery options</h3>
        <p>
          A stuck bore — where the drill stem cannot advance or rotate — is the most common
          HDD emergency. Causes include: hitting unexpected rock, losing slurry circulation
          (cuttings pack the bore), bore path walking into a utility, or crossing an
          underground void. Recovery options, in order of cost:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Increase slurry pump pressure and back-rotate.</strong> Sometimes cuttings
            pack around the bit and a fresh slurry flush with back-rotation will clear the jam.
            Low cost, try first.
          </li>
          <li>
            <strong>Reverse the bore and re-drill with a corrected path.</strong> Abandon the
            failed path, retract the drill string, and re-plot around the obstacle. Adds
            half to a full day on a small bore.
          </li>
          <li>
            <strong>Open-cut bypass.</strong> If the stuck point is in rock or next to a utility
            that cannot be avoided, the least-risk option is to hand-excavate or saw-cut the
            surface above the stuck point, remove the obstruction or the conduit, and continue
            from that point. Most expensive; last resort.
          </li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: CGA Best Practices v20.0 (damage-prevention chapter, HDD operations); industry
          field practice.
        </p>

        <h3 className="mt-5 font-semibold">Frac-out: environmental consequences</h3>
        <p>
          A frac-out occurs when slurry pressure fractures through the formation and slurry
          reaches the surface — including into waterways, roadside drainage, or a property
          owner's yard. Bentonite is non-hazardous clay, but a frac-out under or near a
          waterway is a reportable environmental event in most states. For telecom fiber HDD
          crossings of navigable waters, wetlands, and waterways, the applicable USACE permit
          is typically NWP 57 (Electric Line and Telecommunications Activities). Note: NWP 12
          — the former Utility Line Activities permit — was split in 2021 (86 FR 2744); telecom
          HDD crossings that previously used NWP 12 now use NWP 57. A frac-out during an NWP 57
          permitted crossing must be reported to the USACE district immediately. Response:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li>Stop drilling immediately</li>
          <li>Contain surface slurry with berms or absorbent material</li>
          <li>Notify the permit authority (USACE, state DOT, or AHJ per the permit conditions)</li>
          <li>Document with photographs and time-stamped notes</li>
          <li>Adjust slurry mix and pump pressure before resuming</li>
        </ul>
      </section>

      {/* ── BRANCHING SCENARIO ────────────────────────────────────────────── */}
      <BranchingScenario
        id="T06-L07-BS1"
        title="HDD Emergency: Bore Stuck at 400 Feet"
        description="You're managing a 600-foot directional bore under a two-lane county road in central Georgia. Your bore crew calls: the pilot bore is stuck at 400 feet — the drill can't advance and can't rotate. Bentonite pressure is reading high. The surface above the stuck point is the road shoulder. What do you do?"
        nodes={[
          {
            id: 'start',
            type: 'decision',
            text: "The bore is stuck at 400 ft. Slurry pressure is at the upper limit. Your next move:",
            choices: [
              { label: 'Flush with higher-pressure slurry and back-rotate', nextId: 'flush' },
              { label: 'Reverse the bore and re-drill an offset path', nextId: 'reverse' },
              { label: 'Immediately open-cut the road shoulder to expose the stuck bit', nextId: 'opencut' },
            ],
          },
          {
            id: 'flush',
            type: 'decision',
            text: "You back-rotate and increase slurry pump pressure. The bit frees after 20 minutes — cuttings had packed around it. But now you see slurry seeping through a crack in the road shoulder pavement 50 feet behind the bit position. What next?",
            choices: [
              { label: 'Keep drilling — the slurry crack is minor', nextId: 'flush-drill' },
              { label: 'Stop drilling, reduce pump pressure, document the frac-out, notify the permit authority', nextId: 'flush-stop' },
            ],
          },
          {
            id: 'flush-drill',
            type: 'outcome',
            text: "Wrong call. Continuing to drill with active slurry at the surface is a permit violation under most state DOT encroachment permits and USACE NWP 57 conditions (for telecom crossings of waters/wetlands). The crack can widen into a sinkhole. You've now got a reportable environmental event AND a road damage claim. Stop, document, notify.",
            variant: 'bad',
          },
          {
            id: 'flush-stop',
            type: 'outcome',
            text: "Correct. You stop immediately, place containment berms, photograph the frac-out, and call the state DOT permit office. After reducing slurry viscosity and pump pressure and allowing the bore path to stabilize (2 hours), you resume and complete the pilot bore without further incident. The documentation protects you from a permit-violation fine.",
            variant: 'good',
          },
          {
            id: 'reverse',
            type: 'decision',
            text: "You retract the drill string. The bore is abandoned at 400 ft. You re-plot the bore path 3 feet offset from the stuck path to avoid whatever caused the jam. This adds about 6 hours to the job. Before you re-drill, you should:",
            choices: [
              { label: 'Immediately re-drill on the new offset path', nextId: 'reverse-nodrill' },
              { label: 'Re-verify utility locates on the new path before drilling', nextId: 'reverse-locate' },
            ],
          },
          {
            id: 'reverse-nodrill',
            type: 'outcome',
            text: "Risky. The 3-foot offset might place you closer to a utility that wasn't in the original bore corridor. The bore stalled for a reason — possibly near a utility or unexpected obstruction. Always re-verify locates before committing to an offset bore path.",
            variant: 'bad',
          },
          {
            id: 'reverse-locate',
            type: 'outcome',
            text: "Correct. Re-verifying locates on the offset path confirms there are no utilities in the new corridor. You re-drill and the pilot bore completes successfully. The extra locate check cost 30 minutes but prevented a potential utility strike.",
            variant: 'good',
          },
          {
            id: 'opencut',
            type: 'outcome',
            text: "Skipping the two cheaper options and going straight to open-cut is expensive and unnecessary at this stage. Open-cutting a county road shoulder requires a new permit, traffic control, and road restoration — a day-long process. Try flush-and-back-rotate and path reversal first before committing to open-cut.",
            variant: 'bad',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T06.L07 Check — Directional Boring"
        mode="multiple-choice"
        questions={[
          {
            id: 'T06-L07-Q1',
            type: 'mc',
            prompt: 'What is the purpose of the pilot bore in HDD?',
            choices: [
              'To install the final conduit in one pass without reaming',
              'To establish the bore path along the design profile before enlarging for conduit',
              'To remove existing utilities from the bore corridor',
              'To test soil strength before selecting conduit material',
            ],
            answerIndex: 1,
            explanation: 'The pilot bore cuts a small-diameter path (typically 4–6 inches) from entry to exit, establishing the bore path geometry. All subsequent reaming passes and the final conduit pull-back follow this exact path. Getting the pilot bore path right is the most critical step in HDD. (Source: RUS 1751F-635; CGA Best Practices v20.0.)',
          },
          {
            id: 'T06-L07-Q2',
            type: 'mc',
            prompt: 'Bentonite slurry performs which THREE functions during HDD?',
            choices: [
              'Carries cuttings out, stabilizes borehole walls, lubricates conduit pull-back',
              'Neutralizes underground gases, seals conduit joints, marks the bore path',
              'Increases pull tension, prevents UV exposure, kills invasive roots',
              'Replaces conduit backfill, bonds conduit to soil, identifies utility crossings',
            ],
            answerIndex: 0,
            explanation: 'Bentonite slurry has exactly three jobs: (1) carry drill cuttings back out of the bore path to the entry pit, (2) stabilize the borehole walls to prevent collapse, and (3) lubricate the bore path to reduce pull tension during conduit installation. Slurry that returns to the surface must be managed as waste. (Source: CGA Best Practices v20.0.)',
          },
          {
            id: 'T06-L07-Q3',
            type: 'mc',
            prompt: 'Ground heave during HDD boring is caused by:',
            choices: [
              'Insufficient slurry pressure allowing borehole collapse',
              'Excessive slurry pressure fracturing the formation and forcing slurry into soil voids',
              'Conduit material that is too rigid for the bore radius',
              'Bore path too shallow for the conduit OD',
            ],
            answerIndex: 1,
            explanation: 'Ground heave is the result of too much slurry pressure fracturing the formation and pushing slurry upward through soil voids to the surface. The opposite failure mode (insufficient pressure) causes borehole collapse. Preventing heave requires staying within the formation\'s fracture gradient — a bore-specific pressure limit. (Source: CGA Best Practices v20.0.)',
          },
          {
            id: 'T06-L07-Q4',
            type: 'mc',
            prompt: 'What is the purpose of a swabbing pass before conduit pull-back?',
            choices: [
              'To enlarge the bore path to final diameter',
              'To verify the bore path is open and free of obstructions before committing the conduit',
              'To pump bentonite slurry into the borehole for the first time',
              'To locate utility crossings in the bore corridor',
            ],
            answerIndex: 1,
            explanation: 'Swabbing verifies the bore path is clear before you commit the conduit to the hole. A foam-tipped mandrel is pulled through the bore; if it passes cleanly with normal tension, the bore is ready. If the swab gets stuck or requires excessive force, there\'s a problem in the bore path that must be resolved before conduit installation. (Source: CGA Best Practices v20.0; field practice.)',
          },
          {
            id: 'T06-L07-Q5',
            type: 'fill-in-blank',
            prompt: 'When slurry breaks through to the surface during boring under a waterway, this is called a ____.',
            answer: 'frac-out',
            answerDisplay: 'frac-out',
            explanation: 'A frac-out (short for fracture-out or frack-out) occurs when slurry pressure exceeds the formation\'s fracture gradient and slurry reaches the surface. Under or near waterways, this is a reportable environmental event under USACE NWP conditions and most state DOT encroachment permits. Response: stop drilling immediately, contain surface slurry, document, and notify the permit authority.',
          },
        ]}
      />

    </LessonLayout>
  );
}
