// T10.L06 — Slack Loops — Why and Where
// Working lesson: slack storage, MSA, coil geometry, consequences of under-slack
// Source: M09 §9.6 + OFS IP-009 + OFS IP-079 + Cabling Install guidance

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L06',
  course_id: 'T10',
  title: 'Slack Loops — Why and Where',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T10.L01', 'T10.L03', 'T06.L05', 'T02.L04'],
  learning_objectives: [
    'Explain the three reasons slack loops are required: splice-trailer reach, future re-termination, and thermal expansion',
    'State common contract-band slack lengths for intermediate handholes, splice-point handholes, building entrances, and aerial-to-buried transitions',
    'Describe how to store a slack loop inside a handhole including coil direction and minimum coil diameter relative to cable bend radius',
    'Distinguish a slack loop from an expansion loop — different function, different size',
    'Explain the cost consequence of under-specified slack compared to the cost of the cable saved',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'slack loop',
    'storage coil',
    'MSA',
    'NIU slack',
    'expansion loop',
  ],
  key_terms: [
    {
      term: 'slack loop',
      definition:
        'Extra cable length coiled and stored at an underground structure (handhole, vault, or pedestal) to allow future splicing, re-termination, or repair without requiring excavation to expose and pull additional cable from the route. The slack loop is consumed when the splice trailer connects to the structure for mid-route splicing.',
    },
    {
      term: 'storage coil',
      definition:
        'The physical form of the slack loop inside the handhole — the cable is coiled in a circle and organized on cable hooks or brackets inside the structure. The coil diameter must be at or above the cable\'s minimum bend radius (typically 20× the cable outer diameter for installation; 10× for long-term storage).',
    },
    {
      term: 'MSA',
      definition:
        'Minimum Slack Allowance — the contract-specified minimum length of cable loop to be left at each structure type. Varies by contract and carrier specification. Common bands: 50 ft at intermediate handholes; 100 ft at splice-point handholes; 100–150 ft at building entrances; 25–50 ft at aerial-to-buried transitions. Always check the specific contract MSA schedule.',
    },
    {
      term: 'NIU slack',
      definition:
        'Slack stored at a Network Interface Unit — the small enclosure at a subscriber location where the fiber terminates before entering the building. Typically 10–25 ft of slack is stored at the NIU to allow for future re-splicing or connector replacement without excavating back to the nearest handhole.',
    },
    {
      term: 'expansion loop',
      definition:
        'A larger slack loop placed specifically at aerial-to-buried transitions to absorb the differential thermal expansion and contraction between aerial cable (which experiences significant temperature swing) and buried cable (which is at near-constant ground temperature). Different from a general slack loop — sized by the temperature range and cable material properties, not just by the MSA specification.',
    },
  ],
  vocabulary_assumed: [
    { term: 'handhole', source_lesson_id: 'T06.L05' },
    { term: 'vault', source_lesson_id: 'T06.L05' },
    { term: 'bend radius', source_lesson_id: 'T02.L04' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L06_SlackLoops() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A slack loop is extra cable deliberately left at every underground structure —
          handholes, vaults, pedestals, building entrances. The loop is coiled neatly and
          stored inside the structure. You're paying for cable you don't immediately need,
          specifically so that when you DO need it in the future, you already have it in place.
        </p>
        <p className="mt-2">
          The primary use: when a splice truck pulls up to a handhole to make a mid-route
          splice, the crew pulls the slack loop out, runs it to the splice trailer parked on
          the shoulder, splices the cable, and then lowers the splice case back into the
          structure. If there's no slack loop, the splice trailer can't reach the cable.
          That means a road closure for excavation — which can cost $3,000–$10,000 in
          traffic control for a single splice point.
        </p>
        <p className="mt-2">
          The math is simple: a 100-ft slack loop costs $15–$50 in cable at the time of
          installation. The future splice mobilization it prevents costs 100× that or more.
          Slack loops are cheap insurance.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L06"
            cards={[
              {
                id: 'T10-L06-fc-slack-loop',
                front: 'What is a slack loop and why is it required at underground structures?',
                back: 'Extra cable length coiled and stored at underground structures (handholes, vaults, pedestals) to allow future splicing, re-termination, or repair without requiring excavation to pull additional cable. The slack loop allows the splice trailer to reach the cable without a road closure.',
              },
              {
                id: 'T10-L06-fc-storage-coil',
                front: 'What is a storage coil and what diameter must it maintain?',
                back: 'The physical coiled form of the slack loop inside a handhole, organized on cable hooks or brackets. The coil diameter must be at or above the cable\'s minimum bend radius — typically 20× the cable outer diameter for installation; 10× for long-term storage.',
              },
              {
                id: 'T10-L06-fc-msa',
                front: 'What is MSA (Minimum Slack Allowance) and where does the number come from?',
                back: 'Contract-specified minimum cable length to leave at each structure type. Common bands: 50 ft at intermediate handholes; 100 ft at splice-point handholes; 100–150 ft at building entrances; 25–50 ft at aerial-to-buried transitions. Always check the specific contract MSA schedule — these numbers vary by carrier specification.',
              },
              {
                id: 'T10-L06-fc-expansion-loop',
                front: 'What is an expansion loop and how does it differ from a slack loop?',
                back: 'A larger loop placed at aerial-to-buried transitions specifically to absorb differential thermal expansion between aerial cable (large temperature swing) and buried cable (near-constant ground temperature). Different from a general slack loop — sized by temperature range and cable properties, not just by the MSA spec.',
              },
              {
                id: 'T10-L06-fc-niu-slack',
                front: 'What is NIU slack?',
                back: 'Slack stored at a Network Interface Unit (the small enclosure at a subscriber location where fiber terminates before entering the building). Typically 10–25 ft to allow future re-splicing or connector replacement without excavating back to the nearest handhole.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Slack Loop Specifications by Structure Type</h2>

        <h3 className="mt-4 font-semibold">Three reasons slack loops exist</h3>
        <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-300">
          <li>
            <strong>Splice trailer reach:</strong> A fusion splice truck parks on the road
            shoulder and runs a small-diameter temporary splice duct from the truck to the
            handhole. The slack loop is pulled out of the handhole and extended to the truck.
            50–100 ft of slack = the truck can park without blocking a lane. Zero slack =
            excavation and road closure required.
          </li>
          <li>
            <strong>Future re-termination:</strong> When a connector, splice case, or NIU
            needs to be replaced, the technician needs enough cable to cut back the damaged
            section and re-terminate. If the cable is cut to exact length at installation,
            there's nothing left to re-use. 25–50 ft of slack = two or three future
            re-terminations without pulling new cable.
          </li>
          <li>
            <strong>Thermal expansion:</strong> At aerial-to-buried transitions, the aerial
            cable section experiences temperature swings of 80–120°F seasonally. The expansion
            loop absorbs the length change so the cable isn't under tension in summer or under
            compression in winter. A 25-ft expansion loop handles the thermal movement of
            a typical aerial span.
          </li>
        </ol>

        <h3 className="mt-6 font-semibold">Common MSA schedule (industry bands — not a national standard)</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Structure type</th>
              <th className="px-3 py-2 text-left">Common MSA band</th>
              <th className="px-3 py-2 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Intermediate handhole (no splice)</td>
              <td className="px-3 py-2">50 ft</td>
              <td className="px-3 py-2">Splice-truck reach for future add-drop; future re-routing buffer</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Splice-point handhole or vault</td>
              <td className="px-3 py-2">100 ft per cable</td>
              <td className="px-3 py-2">Splice trailer reach + buffer for re-splicing after sheath damage</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Building entrance / NIU</td>
              <td className="px-3 py-2">100–150 ft</td>
              <td className="px-3 py-2">Allows connector re-termination, building entry reroute, or NIU relocation</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Aerial-to-buried transition</td>
              <td className="px-3 py-2">25–50 ft</td>
              <td className="px-3 py-2">Expansion loop for thermal movement; re-termination buffer at riser</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">NIU (subscriber drop)</td>
              <td className="px-3 py-2">10–25 ft</td>
              <td className="px-3 py-2">Connector replacement without excavation</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-sm text-slate-400">
          Source: OFS IP-009 (underground placing guidance); carrier MSA schedules. These are
          common industry bands — the specific contract MSA schedule governs on your job.
        </p>

        {/* AnnotatedDiagram — slack loop inside handhole */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Slack Loop Storage Inside a Handhole</h3>
            </div>

        <h3 className="mt-6 font-semibold">Expansion loop vs. slack loop — different purposes</h3>
        <p>
          A slack loop is a service reserve — it's there when you need to work on the cable.
          An expansion loop is a structural element — it's there to absorb thermal movement
          during every temperature cycle from now until the cable is replaced.
        </p>
        <p className="mt-2">
          At an aerial-to-buried transition, both exist: a coiled expansion loop at the base
          of the riser to absorb the thermal movement of the aerial span, and additional
          slack coiled in the structure below for future service work. Don't conflate them.
          The expansion loop is a fixed-size loop based on the expected temperature range and
          span length; it stays in place. The slack loop is what the splice truck uses.
        </p>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L06-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'A project PM tells you to skip the slack loops at intermediate handholes to save on cable cost. Each 50-ft loop is about $20 in cable. There are 40 intermediate handholes. What is the total cable cost saved, and what is the potential future cost of the first emergency splice that requires a road closure?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Save $800 in cable; future road closure for a single splice can cost $3,000–$10,000 in traffic control alone' },
                  { id: 'b', text: 'Save $800 in cable; future splice cost is minimal — it\'s just a standard maintenance ticket' },
                  { id: 'c', text: 'Save $4,000 in cable; the savings easily outweigh future splice mobilization cost' },
                  { id: 'd', text: 'Save $800 in cable; slack loops are optional if the splice case has built-in strain relief' },
                ],
                correctId: 'a',
                explanation:
                  'Saving 40 × $20 = $800 in cable at construction. Without slack loops, the first emergency splice requires the splice truck to park, find it can\'t reach the cable without excavation, and then mobilize a traffic control crew to close the lane for a dig. Traffic control for a lane closure on a rural primary road typically runs $3,000–$10,000 for a single event — and that\'s before the excavation and restoration cost. The $800 in savings is consumed by the first emergency within the first year of operation.',
              },
              {
                id: 'q2',
                text: 'What is the difference between a slack loop and an expansion loop at an aerial-to-buried transition?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'They are the same thing — both absorb thermal expansion and provide service reserve' },
                  { id: 'b', text: 'An expansion loop is sized for thermal movement and stays permanently in place; a slack loop is a service reserve for future splice-truck access' },
                  { id: 'c', text: 'Expansion loops are only used in cold climates; slack loops are used everywhere' },
                  { id: 'd', text: 'The expansion loop is part of the conduit; the slack loop is part of the cable' },
                ],
                correctId: 'b',
                explanation:
                  'An expansion loop is a structural element sized by the expected temperature range and aerial span length — it absorbs the cable length change during seasonal temperature cycles. It stays in place permanently. A slack loop is a service reserve — cable left coiled in the structure for future splice-truck reach and re-termination. Both are present at an aerial-to-buried transition but serve different functions.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Thermal Expansion Math and Carrier MSA Schedules</h2>

        <h3 className="mt-4 font-semibold">Sizing the expansion loop</h3>
        <p>
          The thermal expansion of a fiber cable over a temperature range ΔT is approximately:
        </p>
        <div className="my-3 p-3 bg-white/5 border border-white/10 rounded-lg font-mono text-center">
          <p>ΔL = α × L × ΔT</p>
          <p className="text-sm text-slate-400 mt-1">
            ΔL = length change (ft) | α = thermal expansion coefficient (~2×10⁻⁵/°F for HDPE jacket) |
            L = span length (ft) | ΔT = temperature range (°F)
          </p>
        </div>
        <p>
          Example: 500 ft aerial span, 120°F seasonal range (−20°F to +100°F in the
          Mid-Atlantic), HDPE cable jacket (α ≈ 0.00002/°F):
        </p>
        <p className="mt-1 font-mono text-sm p-2 bg-white/5 rounded">
          ΔL = 0.00002 × 500 × 120 = 1.2 ft of thermal movement
        </p>
        <p className="mt-2">
          A 25-ft expansion loop handles this 1.2 ft of movement with substantial margin.
          In practice, most carrier specifications use 25–50 ft at aerial-to-buried
          transitions regardless of exact span length — the cost of extra slack is negligible
          compared to the value of a properly functioning expansion loop.
        </p>

        <h3 className="mt-4 font-semibold">Contract MSA schedule enforcement</h3>
        <p>
          On RUS-financed projects, the inspector verifies slack loop length as part of
          the construction QA process — the same inspector who runs depth probes runs a tape
          on the slack coil at each structure. Under-length slack loops are a punch-list item:
          the contractor must install the correct length before payment. This can require
          excavating back along the route to free up cable from a tight conduit pull — far
          more expensive than leaving the correct slack at the time of installation.
        </p>
        <p className="mt-2">
          The field-engineering lesson: build the MSA schedule into your cable quantity
          take-off BEFORE bid. Add the total slack loop length (number of structures × MSA
          per structure) as a line item in the bill of materials. It's predictable, budgetable,
          and far cheaper to plan for than to retrofit.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T06.L05</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T06.L05</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T02.L04</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
