// T14.L11 — NESC §9 Grounds-Per-Mile Requirement
// Advanced lesson: grounds-per-mile rule, route grounding plan for aerial segment

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L11',
  course_id: 'T14',
  title: 'NESC §9 Grounds-Per-Mile Requirement',
  order: 11,
  lesson_type: 'advanced',
  prerequisites: ['T14.L03', 'T14.L10'],
  vocabulary_introduced: [
    'grounding interval',
  ],
  key_terms: [
    {
      term: 'grounding interval',
      definition:
        'The maximum spacing (in feet or miles) between successive ground electrodes on an aerial communications route. NESC Section 09 sets the maximum interval; RUS 1751F-630 §7 may specify a stricter (shorter) interval for RUS-funded aerial plant. Whichever interval is shorter (more frequent) is the controlling requirement.',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'MGN', source_lesson_id: 'T01.L08' },
    { term: 'grounds per mile', source_lesson_id: 'T14.L02' },
    { term: 'neutral-to-ground bond', source_lesson_id: 'T14.L02' },
    { term: 'messenger bond', source_lesson_id: 'T14.L03' },
    { term: 'ground rod', source_lesson_id: 'T14.L04' },
    { term: 'NESC', source_lesson_id: 'T01.L02' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'aerial plant bonding schedule', source_lesson_id: 'T14.L10' },
    { term: 'ground test log', source_lesson_id: 'T14.L10' },
  ],
  learning_objectives: [
    'State the NESC Section 09 minimum grounding interval for aerial communications plant',
    'Calculate the number of required ground electrodes for a given aerial route length',
    'Apply the RUS bulletin grounding interval when it is stricter than NESC, explaining why the stricter requirement controls',
    'Design a basic route grounding plan for a multi-mile aerial segment',
  ],
  estimated_minutes: 20,
};

export default function T14L11_NESCGroundsPerMile() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          An aerial fiber route that runs for miles without a ground rod is like a string of
          lights with no circuit — except the "circuit" here is the fault-current discharge path
          to earth. The farther apart your ground electrodes are, the longer any fault-induced
          voltage can travel on the messenger before finding a path to ground. And a floating
          section of messenger (temporarily without a nearby ground path due to distance) can
          accumulate dangerous induced voltage, as covered in L08.
        </p>
        <p className="mt-2">
          NESC Section 09 puts a number to this: there is a maximum spacing between ground
          electrodes on the communications side of an aerial route. Beyond that maximum, you
          must add another rod. On RUS jobs, the RUS bulletin may require an even tighter
          interval. The stricter requirement always controls.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L02 MGN</strong> — the distribution neutral is grounded at frequent intervals. <strong>T14.L03 Messenger Bonding Rules</strong> — your messenger bonds at every splice closure. This lesson sets the complementary requirement on the communications side: NESC Section 09 minimum grounds-per-mile interval for the communications messenger independent of splice locations.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Relevance here</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code (IEEE C2)</td>
              <td className="px-3 py-2">Section 09 sets the minimum grounds-per-mile for communications plant; paywalled standard</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RUS</td>
              <td className="px-3 py-2">Rural Utilities Service (USDA)</td>
              <td className="px-3 py-2">1751F-630 §7 may specify a stricter grounding interval for RUS-funded aerial plant</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h3 className="mt-6 font-semibold">NESC Section 09 grounding interval</h3>
        <p className="mt-2">
          NESC C2-2023 Section 09 establishes the grounding requirements for communication
          systems. The specific interval for the number of grounds per mile is defined in this
          section. <strong>Note:</strong> NESC C2 is a paywalled standard. The specific numerical
          interval value in Section 09 should be verified from NESC C2-2023 or from RUS 1751F-630 §7,
          which summarizes the NESC grounding requirements for RUS aerial plant in plain language
          as a public document. Mark as{' '}
          <em>[confirm NESC C2-2023 Section 09 interval — paywalled; verify via RUS 1751F-630 §7]</em>.
          (Sources: NESC C2-2023 Section 09 [confirm edition]; RUS 1751F-630 §7.)
        </p>
        <p className="mt-2">
          The general principle: the maximum spacing between successive ground electrodes on the
          communications side is defined by the NESC. Shorter spacings (more electrodes per mile)
          are always acceptable. On an MGN system where the distribution side already provides
          frequent neutral-to-ground bonds, the communication-side grounding supplements —
          not replaces — the distribution's grounding network.
        </p>

        <h3 className="mt-5 font-semibold">RUS interval vs. NESC interval — which controls</h3>
        <p className="mt-2">
          RUS 1751F-630 §7 specifies the grounding requirements for RUS-funded aerial plant.
          In some cases, the RUS interval is more frequent (stricter) than the NESC minimum.
          When the two differ:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300/90">
          <li>
            <strong>If RUS is stricter (shorter interval) than NESC:</strong> use the RUS
            interval. RUS funding conditions and the engineer's certification on Form 219
            require compliance with the applicable RUS bulletin. The RUS interval is the
            controlling requirement.
          </li>
          <li>
            <strong>If NESC is stricter:</strong> use the NESC interval. The code is the floor
            below which no project may go.
          </li>
        </ul>
        <p className="mt-2">
          On a practical RUS job: look up both — the NESC minimum from Section 09 (or from
          RUS 1751F-630 §7's summary), and the RUS bulletin's interval. Use whichever is more
          frequent (smaller number of feet between rods).
        </p>
      </section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-6">
        <WorkedExample
          title="Minimum Electrode Count for a 5-Mile Aerial Route"
          description="Calculate the minimum number of ground electrodes for a 5-mile RUS aerial route using both the NESC minimum interval and a RUS-specified interval, then determine which controls."
          variables={[
            { key: 'route_miles', label: 'Aerial route length', units: 'miles', default: 5, min: 0.5, max: 50, step: 0.5 },
            { key: 'nesc_interval_ft', label: 'NESC interval (confirm from NESC §9 / RUS 1751F-630 §7)', units: 'ft', default: 1320, min: 500, max: 5280, step: 100, note: '1320 ft is an example value — verify the applicable interval from NESC §9 and your project\'s RUS bulletin before design.' },
            { key: 'rus_interval_ft', label: 'RUS bulletin interval (from 1751F-630 §7)', units: 'ft', default: 1000, min: 500, max: 5280, step: 100 },
          ]}
          formula={(v) => {
            const routeFt = v.route_miles * 5280;
            const controllingInterval = Math.min(v.nesc_interval_ft, v.rus_interval_ft);
            return Math.ceil(routeFt / controllingInterval);
          }}
          steps={(v, result) => {
            const routeFt = v.route_miles * 5280;
            const controllingInterval = Math.min(v.nesc_interval_ft, v.rus_interval_ft);
            const controllingLabel = v.rus_interval_ft <= v.nesc_interval_ft ? 'RUS (stricter)' : 'NESC (stricter)';
            const nescCount = Math.ceil(routeFt / v.nesc_interval_ft);
            const rusCount = Math.ceil(routeFt / v.rus_interval_ft);
            return [
              { expression: `Step 1: Convert route to feet: ${v.route_miles} miles × 5,280 ft/mile`, value: routeFt, unit: 'ft' },
              { expression: `Step 2: NESC minimum: ${routeFt} ft ÷ ${v.nesc_interval_ft} ft interval = minimum electrodes (rounded up)`, value: nescCount, unit: 'electrodes (NESC)' },
              { expression: `Step 3: RUS interval: ${routeFt} ft ÷ ${v.rus_interval_ft} ft interval = minimum electrodes (rounded up)`, value: rusCount, unit: 'electrodes (RUS)' },
              { expression: `Step 4: Controlling interval = ${controllingInterval} ft (${controllingLabel})`, value: null },
              { expression: `Step 5: Required minimum electrodes = ${routeFt} ft ÷ ${controllingInterval} ft = (rounded up)`, value: result, unit: 'electrodes minimum' },
            ];
          }}
          sanityCheck={(result, v) => {
            const routeFt = v.route_miles * 5280;
            const controllingInterval = Math.min(v.nesc_interval_ft, v.rus_interval_ft);
            return `${result} electrodes minimum for ${v.route_miles} miles using the ${controllingInterval}-ft controlling interval. Each electrode also gets a bond clamp + #6 AWG downlead. Add electrodes at every splice closure and dead end regardless of spacing — the interval sets the maximum between required-by-interval rods, but closures and dead-ends always require a bond.`;
          }}
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h3 className="mt-6 font-semibold">Route grounding plan — combining interval, closure, and dead-end rules</h3>
        <p className="mt-2">
          A complete route grounding plan places electrodes at:
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-1 text-slate-300/90">
          <li><strong>Every dead-end pole</strong> where the messenger terminates.</li>
          <li><strong>Every splice closure location</strong> (per NESC Rule 96F — covered in L03).</li>
          <li>
            <strong>Every additional pole</strong> needed to satisfy the NESC/RUS maximum
            interval — even if no splice closure is present at that pole.
          </li>
        </ol>
        <p className="mt-2">
          In practice on a well-designed route, the splice closures are placed at intervals
          that already meet or exceed the NESC/RUS grounding interval. In those cases, the
          splice-closure rule and the interval rule produce the same result — every splice
          closure gets a bond, and that's enough. But on long span runs with infrequent closures,
          you may need to add intermediate grounding poles (poles with a downlead and rod but
          no splice closure).
        </p>
        <p className="mt-2">
          <em>
            Book vs. field note: Some engineers only bond at splice closures, trusting that
            closure spacing meets the NESC interval. That works when the closure design is
            already at or below the interval. But when closures are spaced at 3,000 ft on
            a 1,320-ft-interval route, you need intermediate bonds. The design drawings must
            show both closure locations AND any intermediate bonding poles for the close-out
            inspection to pass.
          </em>
        </p>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <section data-tier="foundations" className="mt-8">
        <h3 className="font-semibold mb-3">Key Terms — Flashcards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <Quiz
          questions={[
            {
              id: 'T14L11Q1',
              text: 'NESC Section 09 sets a maximum grounding interval of X feet for aerial communications plant, and RUS 1751F-630 §7 sets a shorter (stricter) interval of Y feet on a RUS-funded project. Which interval controls?',
              options: [
                'The NESC interval — it is a mandatory code, while RUS is just a funding condition',
                'The RUS interval — it is stricter, and the RUS funding conditions require compliance with applicable RUS bulletins',
                'Whichever was established first historically',
                'The designer may choose either interval depending on project conditions',
              ],
              correct: 1,
              explanation:
                'Both are requirements — NESC is a safety code, RUS is a funding condition with its own engineering standards. When the RUS interval is stricter (shorter spacing = more electrodes per mile), the RUS interval controls for RUS-funded projects because compliance with the RUS bulletin is a condition of funding AND the engineer certifies compliance with the applicable bulletin on Form 219. The NESC is the absolute minimum floor; the RUS may require more. (Sources: NESC C2-2023 Section 09 [confirm]; RUS 1751F-630 §7.)',
            },
            {
              id: 'T14L11Q2',
              text: 'On a 3-mile aerial route with a maximum grounding interval of 1,320 ft, where are ground electrodes required?',
              options: [
                'Only at the start and end of the route',
                'At every splice closure, every dead-end pole, and at any additional intermediate poles needed to comply with the 1,320-ft maximum spacing',
                'Only at every third pole regardless of splice closure locations',
                'At splice closures only — intermediate poles don\'t require bonds',
              ],
              correct: 1,
              explanation:
                'Electrodes are required at: (1) every dead-end pole where the messenger terminates; (2) every splice closure per NESC Rule 96F; and (3) any intermediate poles needed so no gap exceeds 1,320 ft between electrodes. If splice closures are spaced at 800 ft, the closure spacing already satisfies the 1,320-ft interval. If closures are at 1,600 ft intervals, additional intermediate bonding poles are needed.',
            },
            {
              id: 'T14L11Q3',
              text: 'A 5-mile aerial route uses a controlling grounding interval of 1,320 ft. How many minimum ground electrodes are required (rounded up to the nearest whole number)?',
              options: [
                '10',
                '15',
                '20',
                '25',
              ],
              correct: 2,
              explanation:
                '5 miles × 5,280 ft/mile = 26,400 ft. 26,400 ft ÷ 1,320 ft interval = exactly 20. This is the minimum interval-driven count; actual electrode count will be higher due to splice closure and dead-end requirements at locations that may not fall at exactly 1,320-ft spacing.',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
