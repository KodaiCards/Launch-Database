// T11.L09 — Splice Case Types
// Working lesson: dome, inline/butt-splice, wall-mount, rack-mount; BranchingScenario for selection
// Source: M04 §4.6 migrated + AnnotatedDiagram + BranchingScenario

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L09',
  course_id: 'T11',
  title: 'Splice Case Types',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T11.L08'],
  learning_objectives: [
    'Match each splice case type to its correct application environment',
    'Explain why dome closures are preferred for buried applications',
    'Apply a case selection decision tree given environment, fiber count, and re-entry requirements',
    'Describe what failure mode results from using an aerial butt-splice case in a buried application',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'splice case types',
    'butt-splice (inline/horizontal) closure',
    'wall-mount/pedestal closure',
    'heat-shrink vs. cold-seal entry port',
    'case re-entry',
    'splice case mounting',
    'case capacity (tray count)',
  ],
  key_terms: [
    {
      term: 'splice case types',
      definition:
        'The main categories of splice protective enclosures: dome/ovoid closure (direct-buried, soil-pressure self-sealing), butt-splice/inline closure (aerial lashing), wall-mount/pedestal closure (building entry or vault-mounted), and rack-mount closure (inside data center or equipment room). Selection is driven by environment (aerial vs. buried vs. indoor), re-entry requirements, fiber count, and cable entry configuration.',
    },
    {
      term: 'dome closure',
      definition:
        'A round or ovoid splice case where the top half (dome) lifts off the base and all cable entries are at the base. The dome design self-seals under ground pressure — the weight of soil presses the dome onto the gel-sealed base, increasing the seal quality over time. The preferred case for direct-buried applications and vault/handhole environments. Available in sizes ranging from 12F (2-tray) to 1,728F+ (large multi-tray). Per Telcordia GR-763-CORE [confirm edition], dome closures meet direct-buried environmental performance requirements.',
    },
    {
      term: 'butt-splice (inline/horizontal) closure',
      definition:
        'A cylindrical splice case where cables enter from each end and the case is opened by separating the two halves longitudinally. Designed for aerial lashing (cable ties hold it to the messenger strand) or vault slack storage. NOT intended for direct burial — the O-ring seals at the cable entry ports rely on radial compression, which soil pressure and ground movement can defeat over time. Common aerial case in OSP work.',
    },
    {
      term: 'wall-mount/pedestal closure',
      definition:
        'A splice case designed to mount on a flat surface (building wall, pedestal interior, pole strand). Usually a box-shaped enclosure with a hinged or removable cover and standard cable entry grommets on the bottom or sides. Common at building entries and aboveground pedestal installations. Not rated for direct burial.',
    },
    {
      term: 'heat-shrink vs. cold-seal entry port',
      definition:
        'Two methods of sealing cable entry ports on a splice case. Heat-shrink: a tubular heat-shrink sleeve is applied over the cable entry and shrunk to the cable jacket with a heat gun. Permanent (cutting back required for re-entry). Cold-seal: a rubber grommet or gel-seal that clamps around the cable jacket — re-enterable by releasing the compression fitting. Cold-seal is preferred for cases that will be opened for adds/moves/changes.',
    },
    {
      term: 'case re-entry',
      definition:
        'Opening a splice case after installation to access the splice trays for repair, fiber adds, or inspection. Cases are classified as re-enterable (can be opened without cutting the cable entry seal) or permanent (opening requires cutting the heat-shrink oversheath and re-sealing with a new sleeve). Design the installation for re-entry expectations: high-reentry frequency = re-enterable case; no-reentry permanent = heat-shrink sealed dome.',
    },
    {
      term: 'splice case mounting',
      description: 'not used in vocabulary_introduced',
      definition:
        'How the splice case is physically secured in the field: aerial lashing (butt-splice case mounted to messenger strand using UV-resistant lashing wire), vault cable hook (case hung on a steel hook inside a handhole or vault), pedestal bracket (case bolted inside a pedestal enclosure), or direct-buried (dome case placed in a handhole bed of sand with a warning tape above).',
    },
    {
      term: 'case capacity (tray count)',
      definition:
        'The number of splice trays the case can accommodate. Each standard tray holds 12 splice protectors (12 spliced fibers). A 4-tray case holds 48 fibers. Case capacity must be matched to the fiber count of the cables being spliced, plus any planned future adds (expansion capacity).',
    },
  ],
  vocabulary_assumed: [
    { term: 'splice case', source_lesson_id: 'T01.L04' },
    { term: 'dome closure', source_lesson_id: 'T01.L04' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
    { term: 'conduit', source_lesson_id: 'T10.L01' },
    { term: 'manhole', source_lesson_id: 'T10.L01' },
    { term: 'pedestal', source_lesson_id: 'T10.L01' },
    { term: 'aerial lashing', source_lesson_id: 'T10.L04' },
    { term: 'mechanical splice', source_lesson_id: 'T11.L08' },
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T11L09_SpliceCaseTypes() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Remember from <strong>T01.L04, splice cases and closures</strong> — we introduced the concept. This lesson goes deep into four case types and how to pick the right one for each environment.
        </p>
        <p>
          Once you've made the splices, those delicate glass joints need to be protected —
          from moisture, from physical damage, from soil pressure, and from whatever
          environment they'll live in for 30+ years. The splice case is that protection.
          Pick the wrong case for the environment and you're guaranteeing a trouble call in
          18–36 months.
        </p>
        <p className="mt-2">
          This lesson covers the four main splice case types, which environment each belongs
          in, and the selection logic for the most common field scenarios.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T11-L09"
            cards={[
              {
                id: 'T11-L09-fc-dome',
                front: 'What is a dome closure and where is it used?',
                back: 'A round splice case where the dome lifts off the base; all cable entries are at the base. The dome self-seals under ground pressure. Preferred for direct-buried and vault/handhole applications. Per Telcordia GR-763-CORE [confirm edition], dome closures meet direct-buried environmental performance requirements.',
              },
              {
                id: 'T11-L09-fc-butt',
                front: 'What is a butt-splice (inline) closure and where is it used?',
                back: 'A cylindrical case where cables enter from each end; opened by separating two halves longitudinally. Designed for aerial lashing or vault slack storage. NOT for direct burial — O-ring seals at cable entry ports can be defeated by soil pressure and ground movement over time.',
              },
              {
                id: 'T11-L09-fc-reentry',
                front: 'What is the difference between a re-enterable and a permanent splice case?',
                back: 'Re-enterable: can be opened without cutting the cable entry seal (rubber grommet or cold-seal closure). Used where future adds/repairs are expected. Permanent: sealed with heat-shrink oversheath — re-entry requires cutting the sleeve and installing a new one. Used for long-term no-touch installations.',
              },
              {
                id: 'T11-L09-fc-capacity',
                front: 'How is splice case capacity measured and how do you size a case?',
                back: 'By tray count: each standard tray holds 12 splice protectors (12 spliced fibers). Size the case for the current fiber count PLUS future add capacity. A 48F cable needs at minimum a 4-tray case (48 splices), but a 6-tray case gives room for two future 24F adds.',
              },
              {
                id: 'T11-L09-fc-wallmount',
                front: 'What is a wall-mount/pedestal closure and where is it used?',
                back: 'A box-shaped enclosure with mounting flanges and a hinged or latch cover. Cable entries at bottom or sides via compression grommet fittings. Applications: building entry, inside pedestals on mounting shelf, equipment shelter walls, CO/headend rack-adjacent locations. NOT for direct burial.',
              },
              {
                id: 'T11-L09-fc-entry-port',
                front: 'What is the difference between heat-shrink and cold-seal entry ports?',
                back: 'Heat-shrink port seal: a heat-applied shrink tube that bonds to the cable jacket — permanent, watertight, requires cutting for re-entry. Cold-seal port: a compression grommet or gel-filled fitting that can be opened and re-sealed without heat tools — re-enterable. Cold-seal is required where adds/moves/changes are expected (CO, pedestal). Heat-shrink is preferred for permanent aerial and buried applications.',
              },
              {
                id: 'T11-L09-fc-mounting',
                front: 'What is splice case mounting and how does it differ by case type?',
                back: 'The hardware and method used to secure the splice case in its operating environment. Dome closures: rest on a sand bed in a handhole or vault — no mounting hardware needed for burial. Inline closures: lash clamps along the aerial messenger strand or hang from support rings in a vault. Wall-mount cases: bolt to a wall, pole, or pedestal shelf via mounting flanges. Rack-mount cases: slide into 19-inch or 23-inch equipment rack rails.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Four Case Types — Side by Side</h2>

        <AnnotatedDiagram
          imageUrl={null}
          alt="Four splice case types side by side comparison"
          width={720}
          height={280}
          annotations={[
            { id: 'dome', x: 90, y: 110, label: 'Dome closure', description: 'Round dome shape. All cable entries at the base. Opens by lifting the dome off the base. Self-sealing under ground pressure. Application: direct buried, vault floor, handhole. Mount: directly on sand bed in handhole, no hardware required for burial.' },
            { id: 'inline', x: 270, y: 110, label: 'Inline / butt-splice', description: 'Cylindrical body with cable entries from each end. Opens along the longitudinal axis. Application: aerial (lashed to messenger strand), vault hanging, pedestal (inside on shelf). NOT for direct burial — O-ring seals at each end fail under lateral soil pressure.' },
            { id: 'wallmount', x: 450, y: 110, label: 'Wall-mount / pedestal', description: 'Box-shaped enclosure with mounting flanges and a hinged or latch cover. Cable entries at bottom or sides via compression grommet fittings. Application: building entry, inside pedestal, equipment shelter wall, CO/headend rack-adjacent. NOT for direct burial.' },
            { id: 'rackmount', x: 630, y: 110, label: 'Rack-mount (LIU/patch panel)', description: 'Rack-unit form factor (1U–4U) designed to mount in a 19-inch or 23-inch equipment rack in a CO or headend. Holds splice trays or pigtails, with front-panel access to connectors. Application: CO incoming cable termination, headend fiber management. Not an outdoor case — indoor use only.' },
            { id: 'seal-dome', x: 90, y: 230, label: 'Gel-seal base (dome)', description: 'The dome base has a gel-filled groove that the cables seat into when the dome is pressed down. The gel conforms to the cable jacket shape and seals against moisture. Ground pressure increases the seal quality over time.' },
            { id: 'seal-inline', x: 270, y: 230, label: 'O-ring port seal (inline)', description: 'Compression O-ring at each cable entry port. Relies on radial clamping force of the port fitting against the cable jacket. Vulnerable to soil pressure in buried applications — soil shifts laterally and can open the O-ring interface.' },
          ]}
        />
        <p className="text-sm text-slate-400 mt-2">
          Four splice case types and their differentiating features. Source: Telcordia GR-763-CORE [confirm edition] for environmental performance classifications; FOA OSP Design Reference for field application guidance.
        </p>

        {/* Case selection BranchingScenario */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Case Selection Decision Tree</h3>
          <BranchingScenario
            id="T11-L09-branch-case-selection"
            title="Splice Case Selection"
            description="You have just completed 96 splices on a 96F feeder cable. Now you need to pick the right splice case to house these splices. Work through the decision tree."
            initialState="env_question"
            states={{
              env_question: {
                prompt: 'What is the installation environment for this splice point?',
                choices: [
                  { label: 'Direct buried (handhole, buried joint)', next: 'buried_answer' },
                  { label: 'Aerial (lashed to messenger strand)', next: 'aerial_answer' },
                  { label: 'Inside pedestal or equipment shelter', next: 'pedestal_answer' },
                  { label: 'CO rack or equipment room', next: 'rack_answer' },
                ],
              },
              buried_answer: {
                prompt: 'Buried environment selected. Will this case ever need to be re-entered (fiber adds, future repairs)?',
                choices: [
                  { label: 'No — permanent, no planned re-entry', next: 'buried_permanent' },
                  { label: 'Yes — future adds planned within 5 years', next: 'buried_reentry' },
                ],
              },
              buried_permanent: {
                prompt: '✅ CORRECT CHOICE: Dome closure with heat-shrink oversheath port seals.\n\nWhy: The dome geometry self-seals under ground pressure. Heat-shrink port seals provide permanent waterproof cable entry. Per Telcordia GR-763-CORE [confirm edition], dome closures meet direct-buried environmental requirements. Size: choose a case with at least 8 trays for 96F (96 splices ÷ 12 per tray = 8 trays).',
                choices: [{ label: 'Start over', next: 'env_question' }],
              },
              buried_reentry: {
                prompt: '✅ CORRECT CHOICE: Dome closure with cold-seal (re-enterable) port fittings.\n\nWhy: The dome is still required for buried environment (ground pressure sealing). Use cold-seal compression port fittings instead of heat-shrink so the case can be re-entered without cutting the cable entry seals. Document the re-entry procedure in the splice record so the next crew knows how to open it without damaging the port seals.',
                choices: [{ label: 'Start over', next: 'env_question' }],
              },
              aerial_answer: {
                prompt: '✅ CORRECT CHOICE: Inline (butt-splice) closure lashed to messenger strand.\n\nWhy: The cylindrical inline case is designed for aerial mounting with integrated lashing loops or bracket points. Cables enter from each end, keeping the case streamlined for aerial placement. The longitudinal-split opening allows access while the case is suspended. NOT a dome — domes are bottom-heavy and awkward to mount aerially, and their ground-pressure seal geometry is irrelevant aerially.',
                choices: [{ label: 'Start over', next: 'env_question' }],
              },
              pedestal_answer: {
                prompt: '✅ CORRECT CHOICE: Wall-mount or pedestal closure mounted inside the enclosure.\n\nWhy: The pedestal provides environmental protection; the splice case inside does not need to meet buried or aerial environmental ratings. A wall-mount case with compression grommet entries fits neatly inside most pedestal enclosures. Ensure the case is rated for the temperature range of the pedestal environment (−40°C to +60°C for most OSP pedestals).',
                choices: [{ label: 'Start over', next: 'env_question' }],
              },
              rack_answer: {
                prompt: '✅ CORRECT CHOICE: Rack-mount LIU (Light Interface Unit) or fiber distribution shelf.\n\nWhy: The CO rack environment requires 19-inch rack compatibility, front-panel connector access, and indoor environmental ratings. An outdoor dome or inline case has no place in an equipment rack. Use a rack-mount LIU that accommodates the splice trays and presents the connectors on the front panel for patch access. Size: 96F requires approximately 4–8 rack units depending on tray density.',
                choices: [{ label: 'Start over', next: 'env_question' }],
              },
            }}
          />
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T11-L09-quiz-1"
            questions={[
              {
                id: 'q1',
                type: 'multiple-choice',
                text: 'A crew has an inline (butt-splice) aerial case on the truck and needs to make a buried joint in a handhole. The crew lead suggests: "It\'s buried in a handhole, not directly in the soil — the inline case will be fine." Is this correct?',
                options: [
                  { id: 'a', text: 'Yes — a handhole is not the same as direct burial, so the inline case is acceptable in a handhole' },
                  { id: 'b', text: 'No — handholes are wet, muddy environments with potential water submersion. The O-ring seals on an inline case are not rated for submersion or for the thermal cycling in a soil-adjacent environment. A dome closure is required.' },
                  { id: 'c', text: 'Yes — as long as the inline case is elevated above the handhole floor on a cable hook, it will not be submerged' },
                  { id: 'd', text: 'Acceptable — the handhole cover prevents water entry, protecting the inline case' },
                ],
                correctId: 'b',
                explanation: 'Handholes and manholes routinely accumulate water — from precipitation infiltration, groundwater seepage, and condensation. They are also subject to significant temperature swings (from summer surface temperatures to near-freezing groundwater in winter). Telcordia GR-763-CORE specifies submersion testing and temperature cycling for splice closures in buried/vault environments. Inline (butt-splice) cases with O-ring port seals are NOT rated for these conditions. Using one in a handhole is the failure mode documented in Section 5 of this brief: water infiltration at the O-ring interface, splice tray corrosion, and progressive fiber loss within 18–36 months.',
              },
              {
                id: 'q2',
                type: 'multiple-choice',
                text: 'You are sizing a splice case for a 288F trunk splice. Current fiber count being spliced: 288 fibers. No future adds planned. Which tray count is the minimum acceptable?',
                options: [
                  { id: 'a', text: '12 trays (12 × 12 = 144 — half the fiber count)' },
                  { id: 'b', text: '24 trays (24 × 12 = 288 — matches the fiber count exactly)' },
                  { id: 'c', text: '12 trays — some fibers can share trays to save space' },
                  { id: 'd', text: '16 trays — leave 20% expansion room by default' },
                ],
                correctId: 'b',
                explanation: '288 fibers ÷ 12 fibers/tray = 24 trays minimum. Each tray holds exactly 12 splice protectors (12 spliced fibers). You need exactly 24 trays to house all 288 splices. If any future adds are anticipated, size up (28 or 32 trays). Overfilling a tray (more than 12 splices per tray) violates the tray geometry and causes the splice protectors to overlap, creating bend stress on the fibers and potential macrobend loss.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Book vs. Field: Wrong Case in the Wrong Environment</h2>

        <h3 className="mt-4 font-semibold">The book standard</h3>
        <p>
          Telcordia GR-763-CORE [confirm edition] defines environmental performance categories
          for splice closures: aerial, buried, and CO environments have distinct temperature
          cycling, water immersion, crush resistance, and seal integrity requirements. A splice
          case used outside its rated environment will not meet the standard and will fail
          before its expected service life.
        </p>

        <h3 className="mt-4 font-semibold">Field reality: "we had an inline case on the truck"</h3>
        <p>
          The most common case selection error: an aerial inline case used in a buried or
          vault application because the crew had inline cases on the truck and no dome cases.
          The initial installation looks fine. The OTDR passes on day one. The failure begins
          at the O-ring seals.
        </p>
        <p className="mt-2">
          O-ring seals in inline cases are designed for radial compression — the fitting
          clamps the cable jacket against the O-ring under a controlled torque. In a vault
          environment, lateral soil pressure and ground movement gradually work against the
          port fitting, opening a microscopic gap. Seasonal temperature cycling pumps water
          vapor through the gap via capillary action. Moisture enters the case and condenses
          on the splice trays, slowly corroding the metal tray components and the splice
          protectors. Insertion loss increases on affected fibers over 18–36 months.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>The fix costs 5×–10× more than the dome case would have:</strong> opening
          a buried joint, removing a failed inline case, splicing out the affected fibers,
          re-splicing, installing the correct dome closure, and re-burying. Carry the right
          cases for the job.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T01.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T01.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T01.L03</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
