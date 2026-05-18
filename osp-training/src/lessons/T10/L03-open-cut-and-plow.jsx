// T10.L03 — Open-Cut Trench and Plow Execution
// Working lesson: open-cut vs. vibratory plow, OSHA shoring, bedding sand, warning tape
// Source: M09 §9.2 (decision matrix) + OSHA 1926 Subpart P + OCC 206-3/4 + RUS 1751F-635

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L03',
  course_id: 'T10',
  title: 'Open-Cut Trench and Plow Execution',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T10.L01', 'T06.L01', 'T18.L02'],
  learning_objectives: [
    'Compare open-cut trenching versus vibratory plowing and identify the soil conditions where each method is preferred',
    'Identify OSHA 29 CFR §1926 Subpart P shoring requirements for excavations deeper than five feet',
    'Describe the conduit bedding sand layer requirement and explain its purpose',
    'Explain how plowing fails in rock and what happens when a plow blade encounters a buried obstacle',
    'State the warning tape placement requirement for direct-buried telecom conduit and the risk of skipping it',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'shoring',
    'bedding sand',
    'warning tape',
    'vibratory plow',
    'compaction',
    'open-cut restoration',
  ],
  key_terms: [
    {
      term: 'shoring',
      definition:
        'Trench wall support installed to prevent collapse of excavation walls. Required by OSHA 29 CFR §1926 Subpart P for any excavation deeper than 5 feet in any soil type except solid rock. Forms include trench box (pre-fabricated steel box lowered into trench as crew works), hydraulic shoring (pneumatic or hydraulic aluminum panels), and sloping (cutting the trench walls at a safe angle — requires wide ROW).',
    },
    {
      term: 'bedding sand',
      definition:
        'Clean granular fill (typically screened sand or fine crushed stone, not clay or native soil) placed as a layer under and around the conduit in the trench bottom. Provides uniform support, prevents conduit from resting on sharp rocks or hard points, and prevents differential settlement that can crack or kink conduit. RUS 1751F-635 and OCC 206-3 specify bedding sand for buried conduit installations.',
    },
    {
      term: 'warning tape',
      definition:
        'A brightly colored (typically orange for communications) buried plastic tape placed above the conduit in the trench during backfill to warn future excavators that a utility is below. OCC 206-4 specifies placement 12 inches above the conduit. Many state DOT permits specify a different depth — confirm with the permit before backfilling.',
    },
    {
      term: 'vibratory plow',
      definition:
        'A construction machine that cuts a narrow slot in the ground using a vibrating blade, installs conduit or direct-buried cable into the slot as it moves, and closes the slot behind it. Does not remove soil — the soil is displaced laterally. Works well in soft-to-medium soil; fails in rock, tree-root zones, and dense clay.',
    },
    {
      term: 'compaction',
      definition:
        'The mechanical densification of backfill material using a plate compactor, roller, or tamper. Done in lifts (typically 6–8 inch layers) to achieve the required density (often 95% Proctor). Insufficient compaction causes trench settlement — the ground surface sinks months after construction, creating a visible "ghost trench" and generating warranty callbacks.',
    },
    {
      term: 'open-cut restoration',
      definition:
        'The process of returning a trench excavation to a condition equal to or better than pre-construction. Includes backfill compaction, sub-base reconstruction, surface course replacement (asphalt or concrete to match the adjacent surface), and sod/seed restoration for non-paved areas. Required by most AHJ encroachment permits.',
    },
  ],
  vocabulary_assumed: [
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'plowing', source_lesson_id: 'T06.L01' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'LOTO', source_lesson_id: 'T18.L02' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L01' },
    { term: 'Call-811', source_lesson_id: 'T10.L01' },
    { term: 'daylight', source_lesson_id: 'T10.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L03_OpenCutAndPlow() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When HDD isn't the right tool — short runs, straight routes, rural ROW, soft soil
          — your two main alternatives are open-cut trenching (dig a trench, lay the conduit,
          backfill it) and vibratory plowing (a blade pulls the conduit through the ground
          without removing any soil). Both methods work well in the right conditions. Both
          fail badly in the wrong ones.
        </p>
        <p className="mt-2">
          This lesson covers how to execute open-cut and plow correctly: shoring the trench
          walls so they don't collapse on your crew, laying bedding sand so the conduit doesn't
          rest on rocks, and placing warning tape so the crew who digs here in 30 years doesn't
          cut your fiber.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term / Standard</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">29 CFR §1926 Subpart P</td>
              <td className="px-3 py-2">OSHA excavation standard — shoring requirements for trenches over 5 ft deep</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">OCC 206-3</td>
              <td className="px-3 py-2">OFS (formerly OCC) conduit installation guidelines — bedding sand requirements</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">OCC 206-4</td>
              <td className="px-3 py-2">OFS direct-burial installation guidelines — warning tape placement</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">RUS 1751F-635</td>
              <td className="px-3 py-2">RUS buried plant placement standards — depth, bedding, restoration requirements for RUS-financed projects</td>
            </tr>
          </tbody>
        </table>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L03"
            cards={[
              {
                id: 'T10-L03-fc-shoring',
                front: 'What is trench shoring and when does OSHA require it?',
                back: 'Trench wall support to prevent collapse. Required by OSHA 29 CFR §1926 Subpart P for any excavation deeper than 5 feet in any soil except solid rock. Common forms: trench box, hydraulic shoring, or sloped walls.',
              },
              {
                id: 'T10-L03-fc-bedding-sand',
                front: 'What is bedding sand and why is it required under conduit?',
                back: 'Clean granular fill (screened sand or fine crushed stone) placed under and around conduit in the trench bottom. Provides uniform support, prevents conduit resting on sharp rocks or hard points, and prevents differential settlement that can crack or kink conduit. Required by RUS 1751F-635 and OCC 206-3.',
              },
              {
                id: 'T10-L03-fc-warning-tape',
                front: 'What is warning tape and where is it placed in a trench?',
                back: 'A brightly colored (orange for communications) buried plastic tape placed above conduit during backfill to warn future excavators. OCC 206-4 specifies 12 inches above the conduit. Many state DOT permits specify a different depth — confirm with the permit before backfilling.',
              },
              {
                id: 'T10-L03-fc-vibratory-plow',
                front: 'What is a vibratory plow and what are its limitations?',
                back: 'A machine that cuts a narrow slot using a vibrating blade, installs conduit or direct-buried cable as it moves, and closes the slot behind it without removing soil. Works well in soft-to-medium soil. Fails in rock, tree-root zones, and dense clay.',
              },
              {
                id: 'T10-L03-fc-compaction',
                front: 'What is trench backfill compaction and why must it be done in lifts?',
                back: 'Mechanical densification of backfill in layers (typically 6–8 inches) to achieve required density (often 95% Proctor). Lifts ensure the compactor reaches full density throughout the fill depth. Skipping lifts (filling and compacting once) leaves pockets of loose soil that settle later, creating a visible ghost trench.',
              },
              {
                id: 'T10-L03-fc-open-cut-restoration',
                front: 'What is open-cut restoration and what does it include?',
                back: 'The process of returning a trench excavation to a condition equal to or better than pre-construction. Includes backfill compaction, sub-base reconstruction, surface course replacement (asphalt or concrete to match the adjacent surface), and sod/seed restoration for non-paved areas. Required by most AHJ encroachment permits.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Method Selection: Open-Cut vs. Plow</h2>

        <h3 className="mt-4 font-semibold">When to choose open-cut trenching</h3>
        <p>
          Open-cut is the baseline method. You dig a trench (typically with a chain trencher or
          mini-excavator for smaller conduit, a full excavator for large-diameter or deep work),
          lay the conduit in the bottom on the bedding sand, place warning tape during backfill,
          and restore the surface. Open-cut works in almost any soil condition — hard clay, rocky
          ground, mixed soil. It's slower and more expensive than plowing, but it's reliable.
        </p>
        <p className="mt-2">
          FBA/Cartesian 2025 cost data: rural open-cut trenching averages approximately
          $19.00 per foot, compared to $11.88 per foot for vibratory plowing. That cost
          difference explains why contractors prefer plow when conditions allow it.
        </p>

        <h3 className="mt-4 font-semibold">When to choose vibratory plowing</h3>
        <p>
          Vibratory plowing wins on straight rural routes in soft-to-medium soil: sandy loam,
          silty clay, coastal plain soils, Gulf Coast alluvium. The plow machine is fast —
          a single pass installs conduit and closes the slot in one operation. No trench to
          fill, no shoring, no surface restoration beyond tamping the slot line.
        </p>
        <p className="mt-2">
          Plowing fails in: (a) rock or dense hardpan that the blade can't penetrate,
          (b) tree-root zones where roots wrap around the blade, (c) areas with underground
          obstructions that deflect the blade off course, and (d) wet or saturated conditions
          that don't allow the slot to close cleanly. When a plow blade hits a hard obstruction
          at speed, the conduit can be kinked, the blade assembly can snap, and the conduit
          can be dragged sideways by the obstruction. Always run a pre-plow soil probe on
          routes with unknown sub-surface conditions.
        </p>

        <h3 className="mt-4 font-semibold">OSHA shoring — the rule crews most often ignore</h3>
        <p>
          OSHA 29 CFR §1926 Subpart P requires protective systems (shoring, shielding, or
          sloping) for any excavation 5 feet or deeper in any soil type except solid rock.
          Below 5 feet, protective systems are mandatory. Below that threshold, a protective
          system is not required by Subpart P — but §1926.651 still requires a competent
          person to inspect the excavation daily, after rain or other hazard-increasing events,
          and to monitor and control water accumulation. "Under 5 feet" is not "anything goes"
          — the inspection and water-management duties apply at every depth.
        </p>
        <p className="mt-2">
          The soil classification system under Subpart P: Type A (hard, cohesive — e.g.,
          dry, dense clay) can slope at 3/4:1 (horizontal:vertical). Type C (granular, wet,
          or previously disturbed — e.g., loose sand, wet soil) must slope at 1.5:1 or use
          a trench box. Most rural telecom trench work is in Type B or C soil. At standard
          36-inch installation depth, you're under 5 feet in all but the deepest highway
          crossings — so shoring often isn't triggered. But at road crossings where the
          permit requires 4–5 feet of depth, or where trench walls in loose sandy soil become
          unstable above 3 feet, a trench box becomes mandatory.
        </p>
        <p className="mt-2 p-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-sm">
          <strong>Safety note:</strong> A cubic yard of soil weighs approximately 3,000 lbs (1.5 tons).
          A trench wall collapse buries a worker faster than anyone can respond. OSHA data
          shows trench collapses kill an average of 23 workers per year in the US. The shoring
          rule exists because the physics are unforgiving. This is a T18 safety-culture topic —
          see T18 for the broader worker safety framework.
        </p>

        <h3 className="mt-4 font-semibold">Bedding sand: the foundation the conduit rests on</h3>
        <p>
          After the trench is open and any existing utility crossings are identified and
          hand-exposed, the first layer to go in is bedding sand. Typically 3–4 inches of
          screened sand or pea gravel on the trench bottom. The conduit then rests on this
          uniform, yielding layer instead of on native soil with rocks, roots, and hard points.
        </p>
        <p className="mt-2">
          After the conduit is laid, sand is placed alongside the conduit up to 6 inches above
          the top — called the embedment zone. Above that, you can use native backfill in
          compacted lifts. The bedding/embedment zone prevents point loading on the conduit
          that can cause stress concentrations and long-term creep cracking.
        </p>

        <h3 className="mt-4 font-semibold">Warning tape: protecting future crews</h3>
        <p>
          During backfill, when the fill is approximately 12 inches above the top of the
          conduit (per OCC 206-4), a strip of buried warning tape is laid horizontally
          across the full trench width. The tape is orange (APWA communications color) and
          reads "CAUTION: BURIED FIBER OPTIC CABLE BELOW" or similar.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Book vs. field:</strong> OCC 206-4 says 12 inches above conduit. Many state
          DOT permits specify the tape at a fixed depth from the finished surface (e.g., 18 inches
          from grade). These two requirements produce different absolute depths depending on
          conduit burial depth. Confirm the permit-required depth before backfilling.
          Field shortcuts here create the future liability you're trying to prevent.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L03-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'Your route crosses 8 miles of rural Georgia red clay, then 2 miles of sandy loam. Your trench depth is 36 inches. Which installation method is preferred for each segment?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Red clay: vibratory plow; sandy loam: open-cut' },
                  { id: 'b', text: 'Red clay: open-cut or directional bore; sandy loam: vibratory plow' },
                  { id: 'c', text: 'Both segments: vibratory plow — it\'s always cheaper' },
                  { id: 'd', text: 'Both segments: open-cut — plow doesn\'t work on clay or sand' },
                ],
                correctId: 'b',
                explanation:
                  'Georgia red clay (dense, sticky clay) is difficult for vibratory plows — the clay wraps around the blade and the slot often doesn\'t close cleanly. Open-cut trenching or HDD is preferred. Sandy loam is ideal plow territory — soft, cooperative soil, fast installation, slot closes cleanly. The cost difference ($11.88 vs. $19.00/ft) makes plow the clear choice where soil conditions allow.',
              },
              {
                id: 'q2',
                text: 'OSHA 29 CFR §1926 Subpart P requires protective systems (shoring or sloping) for excavations over what depth?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '3 feet in all soil types' },
                  { id: 'b', text: '4 feet in Type C soil only' },
                  { id: 'c', text: '5 feet in any soil type except solid rock' },
                  { id: 'd', text: '6 feet — trenches under 6 feet are exempt' },
                ],
                correctId: 'c',
                explanation:
                  'OSHA 29 CFR §1926 Subpart P: 5 feet is the trigger in any soil type except solid rock. Below 5 feet, shoring (trench box or hydraulic shores) or sloping is required. Type A soil (dense, cohesive clay) can use a steeper slope than Type C (granular or wet) but still requires a protective system. At standard 36-inch telecom burial depth, shoring is not triggered — but at road crossings requiring 4–5 feet of depth, it can be.',
              },
              {
                id: 'q3',
                text: 'At what depth above the conduit does OCC 206-4 specify placing the buried warning tape?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '6 inches above the conduit' },
                  { id: 'b', text: '12 inches above the conduit' },
                  { id: 'c', text: '18 inches below the finished surface, regardless of conduit depth' },
                  { id: 'd', text: 'At mid-trench depth' },
                ],
                correctId: 'b',
                explanation:
                  'OCC 206-4 specifies warning tape placement at 12 inches above the top of the conduit. Note that some state DOT permits require the tape at a fixed depth from the finished surface — this can differ from 12 inches above conduit if the conduit burial depth varies. Always confirm with the permit before backfilling.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>OSHA Compliance in Practice and Method Trade-offs</h2>

        <h3 className="mt-4 font-semibold">The shoring gap in field practice</h3>
        <p>
          OSHA Subpart P's shoring requirement is widely known and widely ignored on
          short-duration shallow telecom trenches. The practical reality: most rural fiber
          trench work is 36–42 inches deep, well under the 5-foot trigger. On a 200-ft
          open-cut run in a rural easement, a crew is in and out in a few hours. The risk
          of collapse at 3 feet in cohesive clay is genuinely low.
        </p>
        <p className="mt-2">
          The danger is at transitions: where the route dips deeper for road crossings
          (typically 42–54 inches under pavement per permit), where the trench must be
          opened and left overnight for inspector access, or where wet spring conditions
          reduce the cohesion of soil that would otherwise stand unsupported. These are
          the conditions where the collapse happens — and the rule requires the protection
          before the work starts, not after the wall fails.
        </p>
        <p className="mt-2">
          Field discipline: any trench that approaches 5 feet in wet, granular, or
          previously disturbed soil gets a trench box. Pre-brief this with the crew before
          mobilization — it's faster to deploy the box during setup than to argue about it
          when you're already 4.5 feet down.
        </p>

        <h3 className="mt-4 font-semibold">Plow blade failures in rocky terrain</h3>
        <p>
          In mixed soil with gravel, cobbles, or shallow rock shelves — common in the
          Georgia Piedmont and Blue Ridge transitions — a vibratory plow blade can skip
          over the rock or deflect sideways. When the blade deflects, the conduit follows
          it. The result is a conduit route that bears no resemblance to the plan-and-profile,
          buried at irregular depths, potentially routed around the rock in ways that violate
          the permit's depth requirement. Detection requires a post-installation probe.
        </p>
        <p className="mt-2">
          Pre-job soil probing (manually pushing a 1/2-inch rod to the planned burial depth
          every 50–100 feet along the planned plow path) takes about 30 minutes per mile
          and costs almost nothing. It catches rock shelves, hardpan, and large cobbles
          before the plow rig mobilizes. On any route where the survey shows geological
          uncertainty, probe first — then decide whether to plow or open-cut.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T06.L01</strong> — Underground routing and conduit strategies.</li>
    <li><strong>T06.L01</strong> — Underground routing and conduit strategies.</li>
    <li><strong>T01.L02</strong> — The foundational pole anatomy and measurements.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
