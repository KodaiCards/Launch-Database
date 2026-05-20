// T11.L13 — Splicer Maintenance Schedule
// Working lesson: electrode life counter (RANGE 1,500–3,000 arcs — check your manual),
// daily arc calibration, cleaver blade interval, splicer storage
// Source: net-new (R-A gap per ARCH.md); secondary: Fujikura/Sumitomo operator manuals

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T11.L13',
  course_id: 'T11',
  title: 'Splicer Maintenance Schedule',
  order: 13,
  lesson_type: 'working',
  prerequisites: ['T11.L12'],
  learning_objectives: [
    'Build a splicer maintenance checklist covering before-each-day, per-spool, weekly, and storage intervals',
    'Identify the three triggers that require arc calibration before the next splice',
    'State the electrode replacement counter range (varies by model, 1,500–3,000 arcs — check your manual) and describe the visual signs of oxidized electrodes',
    'Calculate electrode replacement interval in working days given arc cycles per day and a model-specific counter spec',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'electrode life counter',
    'daily arc calibration',
    'cleaning arc',
    'electrode oxidation',
    'splicer storage (silica gel)',
  ],
  vocabulary_assumed: [
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'arc calibration', source_lesson_id: 'T11.L06' },
    { term: 'cleave angle', source_lesson_id: 'T11.L06' },
    { term: 'arc power', source_lesson_id: 'T11.L06' },
    { term: 'cleaver blade replacement interval', source_lesson_id: 'T11.L06' },
  ],
};

export const key_terms = [
  {
    term: 'Electrode life counter',
    definition:
      'An internal counter in the fusion splicer that tracks how many arc cycles the electrodes have fired. When it reaches the model-specific threshold (typically 1,500–3,000 arcs — confirm your splicer manual), the machine prompts you to replace the electrodes. Ignoring the prompt risks inconsistent fusion quality.',
  },
  {
    term: 'Daily arc calibration',
    definition:
      'A test-fire sequence (usually 3–10 cleaning arcs followed by a test splice) that the splicer uses to measure actual discharge intensity and auto-adjust its parameters to compensate for electrode wear, humidity, altitude, and temperature. Takes 2–3 minutes and must be performed at the start of every work day, after any fiber-type change, and after electrode replacement.',
  },
  {
    term: 'Cleaver blade replacement interval',
    definition:
      'The number of cleaves a precision cleaver blade can make before its edge degrades and begins producing marginal or reject angles. Typical range: 1,000–3,000 cleaves depending on model and fiber type — check your cleaver manual. Many cleavers have a multi-position blade that can be rotated to expose a fresh edge section before full blade replacement.',
  },
  {
    term: 'Cleaning arc',
    definition:
      'A short, low-power arc fired before the main splice arc. Its purpose is to burn off any residual contamination, moisture, or buffer gel from the fiber ends immediately before fusion. A cleaning arc is NOT a substitute for proper mechanical cleaning — it supplements it.',
  },
  {
    term: 'Electrode oxidation',
    definition:
      'The buildup of oxide deposits on the electrode tips caused by repeated high-temperature arcing in the presence of oxygen. Visible signs: irregular arc shape on the splicer monitor, asymmetric loss estimations, and pitting or dark discoloration at the electrode tips visible under magnification. The solution is electrode replacement — not recalibration alone.',
  },
  {
    term: 'Splicer storage (silica gel)',
    definition:
      'When a fusion splicer is stored for extended periods (days to weeks), a sealed transport case with fresh silica gel desiccant packets absorbs ambient moisture that would otherwise corrode electrodes and contaminate V-grooves. Replace silica gel when color-indicator changes from blue to pink (most common indicator type).',
  },
];

export default function L13SplicerMaintenanceSchedule() {
  const quizQuestions = [
    {
      id: 'q1',
      question:
        'A crew arrives at a new splice site at 7 AM. They ran arc calibration yesterday afternoon at the same altitude and temperature. Must they run calibration again before the first splice?',
      type: 'multiple-choice',
      options: [
        'No — yesterday\'s calibration is valid until the electrode counter triggers',
        'Yes — arc calibration must be performed at the start of every work day regardless of prior results',
        'Only if the ambient temperature changed by more than 10°F overnight',
        'Only if they are switching from G.652.D to G.657 fiber',
      ],
      correct: 1,
      explanation:
        'Arc calibration is a START-OF-DAY requirement — not a temperature-change trigger or electrode-counter trigger. Humidity, temperature, and electrode wear change overnight. A new day = new calibration. The electrode counter triggers electrode REPLACEMENT, not calibration frequency.',
    },
    {
      id: 'q2',
      question:
        'The splicer\'s electrode life counter reads 2,450 arcs. The operator\'s manual specifies replacement at 2,500 arcs. The crew is mid-job with 30 more splices to make. What is the correct action?',
      type: 'multiple-choice',
      options: [
        'Complete the 30 splices — 50 arcs of overrun is negligible',
        'Replace electrodes now, then run arc calibration before the next splice',
        'Replace electrodes at end of day to minimize disruption',
        'Disable the counter warning and continue — the threshold is conservative',
      ],
      correct: 1,
      explanation:
        'The counter is a leading indicator — the electrodes are already near end-of-life. Running 30 more arcs on worn electrodes risks poor fusion quality that is difficult to detect with estimated-loss readings. Replace now, calibrate, and continue. Disabling the warning is never acceptable on RUS or commercial contract work.',
    },
    {
      id: 'q3',
      question:
        'A technician notices the splicer produces asymmetric loss estimates (e.g., left-fiber estimate 0.06 dB but right-fiber estimate 0.21 dB repeatedly). Arc calibration was run this morning. The most likely cause is:',
      type: 'multiple-choice',
      options: [
        'MFD mismatch between the two fiber types',
        'Electrode oxidation causing uneven discharge across the gap',
        'Incorrect V-groove setting for the fiber diameter',
        'Wind interference with the arc discharge',
      ],
      correct: 1,
      explanation:
        'Asymmetric loss estimates after a fresh calibration are a classic electrode oxidation signature. Oxidized tips discharge unevenly — one side of the arc is hotter than the other. MFD mismatch produces consistent systematic offset (always the same direction), not random asymmetry. V-groove settings affect fiber positioning, not arc symmetry.',
    },
    {
      id: 'q4',
      question:
        'A crew is storing a fusion splicer in a van for two weeks between jobs. The silica gel indicator in the case is pink. What should they do?',
      type: 'multiple-choice',
      options: [
        'Replace or regenerate the silica gel before sealing the case for storage',
        'Leave it — pink indicator means the gel is still active',
        'Add a plastic bag of rice as an alternative desiccant',
        'Run arc calibration after storage to compensate for any moisture exposure',
      ],
      correct: 0,
      explanation:
        'Pink indicator means the silica gel is saturated with moisture and is no longer absorbing. In this state it provides zero protection — it may even release moisture back into the case as temperatures fluctuate. Replace or oven-regenerate the gel before long-term storage. Arc calibration compensates for environmental variables on a given day but does not fix corrosion damage from moisture exposure during storage.',
    },
  ];

  const electrodeLifeSteps = [
    {
      label: 'Given information',
      expression: 'Electrode counter threshold: 2,500 arcs (from this model\'s manual)\nCrew production rate: 150 arcs per day on a large splicing job\nQuestion: How many working days until electrode replacement is due?',
      result: 'Set up: days = threshold ÷ arcs_per_day',
    },
    {
      label: 'Step 1 — Divide',
      expression: 'days = 2,500 ÷ 150',
      result: '= 16.67 working days',
    },
    {
      label: 'Step 2 — Round down (safety)',
      expression: 'Round 16.67 → 16 working days',
      result: 'Electrodes should be replaced on or before the end of day 16',
    },
    {
      label: 'Step 3 — Plan ahead',
      expression: 'Flag replacement at day 14 (two days before limit)',
      result: 'Allows ordering time + ensures replacement happens mid-job without rush',
    },
    {
      label: 'Sanity check',
      expression: '150 arcs/day × 16 days = 2,400 arcs → safely under 2,500 limit',
      result: 'Correct. At day 16 end you\'ve fired ~2,400 arcs — still within spec.',
    },
  ];

  return (
    <LessonLayout meta={meta}>
      {/* ── FOUNDATIONS TIER ─────────────────────────────── */}
      <section data-tier="foundations" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">In Plain English</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          A fusion splicer is a precision optical instrument. The arc electrodes that fire thousands of
          degrees of plasma to melt glass together do NOT last forever — they wear out, oxidize, and produce
          inconsistent results if you ignore the maintenance schedule. The good news: splicer maintenance is
          simple, fast (2–3 minutes for daily calibration), and the machine itself tells you when to act.
          Your job is to listen to it.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Think of it like an oil change on a vehicle — you don't wait for the engine to knock before you
          change the oil. You follow the mileage interval. For a splicer, the "mileage" is arc count, not
          distance. And the "oil change" is arc calibration every morning plus electrode replacement when
          the counter hits the threshold in your manual.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T11.L06 Cleave Angle and Arc Quality</strong> — arc calibration is one of the three critical preventive measures. This lesson gives you the schedule and the discipline to keep that tool in specification throughout every working day.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Key Terms — Flashcards</h3>
          <Flashcard
            deckId="T11-L13"
            cards={[
              {
                id: 'T11-L13-fc-electrode-life',
                front: 'What is the electrode life counter and what does it track?',
                back: 'An internal counter in the fusion splicer that tracks how many arc cycles the electrodes have fired. When it reaches the model-specific threshold (typically 1,500–3,000 arcs — confirm your splicer manual), the machine prompts you to replace the electrodes. Ignoring the prompt risks inconsistent fusion quality.',
              },
              {
                id: 'T11-L13-fc-daily-cal',
                front: 'What is daily arc calibration and when must it be performed?',
                back: 'A test-fire sequence (usually 3–10 cleaning arcs followed by a test splice) that the splicer uses to measure actual discharge intensity and auto-adjust its parameters to compensate for electrode wear, humidity, altitude, and temperature. Takes 2–3 minutes. Must be performed at the start of every work day, after any fiber-type change, and after electrode replacement.',
              },
              {
                id: 'T11-L13-fc-blade-interval',
                front: 'What is the cleaver blade replacement interval?',
                back: 'The number of cleaves a precision cleaver blade can make before its edge degrades and begins producing marginal or reject angles. Typical range: 1,000–3,000 cleaves depending on model and fiber type — check your cleaver manual. Many cleavers have a multi-position blade that can be rotated to expose a fresh edge section before full blade replacement.',
              },
              {
                id: 'T11-L13-fc-cleaning-arc',
                front: 'What is a cleaning arc and what is it NOT a substitute for?',
                back: 'A short, low-power arc fired before the main splice arc to burn off residual contamination, moisture, or buffer gel from the fiber ends immediately before fusion. A cleaning arc is NOT a substitute for proper mechanical cleaning — it supplements it.',
              },
              {
                id: 'T11-L13-fc-electrode-oxidation',
                front: 'What is electrode oxidation and how do you recognize it?',
                back: 'The buildup of oxide deposits on electrode tips caused by repeated high-temperature arcing in the presence of oxygen. Visible signs: irregular arc shape on the splicer monitor, asymmetric loss estimations, and pitting or dark discoloration at the electrode tips visible under magnification. The solution is electrode replacement — not recalibration alone.',
              },
              {
                id: 'T11-L13-fc-silica-gel',
                front: 'What does silica gel do in splicer storage and when should it be replaced?',
                back: 'When a fusion splicer is stored for extended periods (days to weeks), a sealed transport case with fresh silica gel desiccant packets absorbs ambient moisture that would otherwise corrode electrodes and contaminate V-grooves. Replace silica gel when color-indicator changes from blue to pink (most common indicator type).',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING TIER ─────────────────────────────────── */}
      <section data-tier="working" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">The Maintenance Schedule</h2>

        <div className="p-4 mb-6 rounded-lg border border-blue-400/30 bg-blue-400/5">
          <h3 className="font-semibold text-blue-300 mb-2">Quick Refresher — Key Terms</h3>
          <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1">
            <li><strong>Fusion splice:</strong> The joint you're making — maintenance of the splicer directly affects splice quality.</li>
            <li><strong>Arc calibration & arc power:</strong> The splicer's core tuning mechanism — done daily before splicing starts.</li>
            <li><strong>Cleave angle & cleaver blade:</strong> A worn blade produces bad cleaves — blade rotation interval is critical for consistent angle.</li>
          </ul>
        </div>

        {/* Master Checklist */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Five-Interval Maintenance Checklist</h3>
          <p className="text-gray-600 mb-4">
            Different items require attention on different intervals. Use this checklist as a template —
            adapt the arc and cleave counts to the specific thresholds in your equipment manuals.
          </p>

          <div className="space-y-4">
            {/* Interval 1 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-bold text-green-800 mb-2">1 — Before Each Work Day (Every Day On-Site)</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Open case, inspect splicer and cleaver for physical damage from transport</li>
                <li>Check V-grooves for debris — blow out with canned air or soft brush</li>
                <li>Check wind-cover mirror for smudges — clean with IPA and lint-free swab if needed</li>
                <li>Run <strong>arc calibration sequence</strong> (3–10 cleaning arcs + test splice per machine prompt)</li>
                <li>Check and record electrode life counter reading — compare to manual threshold</li>
                <li>Check cleaver blade counter — rotate blade if manufacturer recommends and you are near the edge limit</li>
                <li>Verify battery charge ≥ 50% or confirm AC power available on site</li>
              </ul>
            </div>

            {/* Interval 2 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-800 mb-2">2 — When Fiber Type Changes (Mid-Job Trigger)</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Select the correct fiber profile in the splicer menu (G.652.D, G.657.A1, G.657.A2, etc.)</li>
                <li>Run <strong>arc calibration</strong> again — different fiber geometry requires different arc parameters</li>
                <li>Make one test splice; verify estimated loss matches expected for the fiber pair</li>
              </ul>
            </div>

            {/* Interval 3 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-bold text-orange-800 mb-2">3 — Per Spool or Major Environmental Change</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>If altitude changes significantly (e.g., moving from a valley to a mountaintop mid-job), re-run calibration — arc discharge is affected by air pressure</li>
                <li>If rain or high humidity condition starts, re-check V-grooves and wipe down before the next fiber</li>
              </ul>
            </div>

            {/* Interval 4 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-red-800 mb-2">4 — Electrode and Blade Replacement (Counter-Triggered)</h4>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Electrode replacement threshold:</strong> Varies by model — typically 1,500–3,000 arc cycles.
                Check your specific splicer manual. Common examples: Fujikura FSM-62S ≈ 3,000 arcs;
                Sumitomo T-400S ≈ 2,000 arcs. Do not assume one model's threshold applies to another.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>When electrode counter reaches or exceeds the threshold: replace electrodes immediately</li>
                <li>Run full arc calibration after replacement</li>
                <li>Make 2–3 test splices and confirm estimated loss is back to normal range</li>
                <li>Log replacement: date, arc count at replacement, new electrode part number</li>
                <li><strong>Cleaver blade:</strong> Rotate to fresh edge section or replace blade when counter (model-specific, typically 1,000–3,000 cleaves) triggers — check your cleaver manual</li>
              </ul>
            </div>

            {/* Interval 5 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-purple-800 mb-2">5 — Extended Storage (Days to Weeks Inactive)</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Check silica gel indicator in transport case — replace or oven-regenerate if pink/saturated</li>
                <li>Close wind cover; install any dust caps on V-groove area if provided</li>
                <li>Store in padded transport case — protect V-grooves and wind-cover mirror from shock</li>
                <li>Run arc calibration before the FIRST splice of a new job after extended storage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Three Calibration Triggers */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">The Three Arc Calibration Triggers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-blue-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">☀️</div>
              <h4 className="font-bold text-blue-700 mb-1">Start of Every Work Day</h4>
              <p className="text-sm text-gray-600">Overnight temperature and humidity changes shift arc intensity. Always calibrate first.</p>
            </div>
            <div className="bg-white border-2 border-orange-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h4 className="font-bold text-orange-700 mb-1">Fiber Type Change</h4>
              <p className="text-sm text-gray-600">G.652.D and G.657 profiles need different arc parameters. Profile change = calibrate.</p>
            </div>
            <div className="bg-white border-2 border-red-300 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-bold text-red-700 mb-1">Electrode Replacement</h4>
              <p className="text-sm text-gray-600">New electrodes have different geometry than worn ones. Calibrate immediately after swap.</p>
            </div>
          </div>
        </div>

        {/* Electrode Oxidation Signs */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Recognizing Electrode Oxidation</h3>
          <p className="text-gray-600 mb-3">
            The electrode counter is a leading indicator — oxidation signs can appear before the counter threshold
            if the crew is working in high-humidity or high-altitude conditions. Learn to recognize the warning signs:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Symptom</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">What It Means</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Asymmetric loss estimates (left ≠ right)</td>
                  <td className="border border-gray-300 px-3 py-2">Uneven discharge — one electrode tip more oxidized than the other</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-red-700">Replace electrodes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">Loss estimates consistently higher than normal despite good cleaves</td>
                  <td className="border border-gray-300 px-3 py-2">Overall arc intensity reduced — electrodes losing discharge efficiency</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-red-700">Replace electrodes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-3 py-2">Arc shape visible on monitor looks irregular or jagged</td>
                  <td className="border border-gray-300 px-3 py-2">Pitting on electrode tip causing uneven plasma column</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-red-700">Replace electrodes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">Machine shows "electrode error" or "arc unstable" after calibration</td>
                  <td className="border border-gray-300 px-3 py-2">Machine's internal diagnostic detects abnormal discharge pattern</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-red-700">Replace electrodes immediately</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WorkedExample: electrode life calculation */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Worked Example — Electrode Life Planning</h3>
          <WorkedExample
            title="How many working days until electrode replacement?"
            description="A crew is mobilizing for a large 288F aerial splice job. Their splicer manual specifies electrode replacement at 2,500 arc cycles. On this size job, the crew expects to make about 150 arc cycles per day (some days a bit more, some less). When should they plan to replace electrodes?"
            steps={electrodeLifeSteps}
            variables={[
              { symbol: 'threshold', description: 'Electrode replacement counter limit', value: '2,500 arc cycles (from this model\'s manual)', units: 'arcs' },
              { symbol: 'rate', description: 'Arc cycles per day', value: '150', units: 'arcs/day' },
              { symbol: 'days', description: 'Working days until replacement', value: 'threshold ÷ rate', units: 'days' },
            ]}
          />
        </div>

        {/* Quiz */}
        <Quiz
          questions={quizQuestions}
          title="Check Your Understanding — Splicer Maintenance"
        />
      </section>

      {/* ── ADVANCED TIER ────────────────────────────────── */}
      <section data-tier="advanced" className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Book vs. Field Practice</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-blue-800 mb-3">The Book (Equipment Manual)</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>Replace electrodes at the counter threshold specified in the manual</li>
              <li>Run arc calibration at start of each job day</li>
              <li>Replace cleaver blade at the counter threshold</li>
              <li>Store in transport case with silica gel</li>
              <li>Counter threshold range: 1,500–3,000 arcs depending on model — always check YOUR manual</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-amber-800 mb-3">Common Field Practice</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
              <li>Many crews push past the counter by 200–500 arcs on short jobs ("we're almost done")</li>
              <li>Skip calibration on day 2 because "it was calibrated yesterday and nothing changed"</li>
              <li>Use the same cleaver blade for a full field season without checking the counter</li>
              <li>Store the splicer in the vehicle cab without a sealed case — not recommended but common</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-6">
          <h3 className="text-lg font-bold text-red-800 mb-2">Why the Field Shortcuts Matter</h3>
          <p className="text-gray-700 text-sm mb-2">
            Skipping calibration on day 2 of a job is a low-risk shortcut IF temperature, humidity, and altitude
            are identical to day 1. In practice, night cooling + morning humidity shifts ARE temperature changes
            — and on RUS contract work where every splice must meet ≤0.30 dB, a bad calibration can cost a
            re-splice of an entire case.
          </p>
          <p className="text-gray-700 text-sm">
            The 200-arc overrun seems harmless until you pull that case off a tower for OTDR testing a week later
            and find three splices reading 0.40–0.55 dB — all made in the last hour before the crew packed up.
            Those were the arcs fired on worn electrodes after the counter triggered. The fix cost more than
            fresh electrodes would have.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Counter Thresholds: Why There Is No Single Number</h3>
          <p className="text-gray-700 text-sm mb-2">
            Splicer manuals from different manufacturers specify different thresholds because electrode alloy
            composition, tip geometry, and arc chamber design differ. A threshold appropriate for one model
            may leave another model's electrodes 30% overdue — or replace a third model's electrodes 800 arcs
            early. The ONLY reliable threshold is the one in your specific splicer's operator manual.
          </p>
          <p className="text-gray-700 text-sm">
            On multi-splicer jobs (common on large projects), each machine needs its OWN counter log. A crew
            that runs two different splicer models and applies the same threshold to both will eventually get
            this wrong. Keep separate maintenance logs per machine.
          </p>
        </div>
      </section>

      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Splicer maintenance is the operational discipline that determines whether the physics principles established in T02, the workflow discipline of L04, and the arc quality standards of L06 actually translate to consistent low-loss splices in the field. L04's 8-step workflow assumes the splicer is producing a consistent arc at the calibrated power and duration — but that assumption is only valid when the electrodes are within their service life and the arc calibration has been performed at the start of the current work session. L06 taught that arc calibration should fire at start-of-day, on fiber type change, and after electrode replacement; this lesson provides the quantitative maintenance framework that determines when those electrode replacements occur: at the arc counter threshold (1,500–3,000 arcs, model-specific per manufacturer documentation) rather than at failure, because a degraded electrode produces subtle arc instability that increases average splice loss by 0.05–0.10 dB per splice without triggering a hard fault. The worked example here — 2,500 arc threshold ÷ 150 arcs per day = 16 working days — is the kind of pre-project calculation that belongs in T04 (site survey planning): a crew deploying to splice a 576-fiber cable (576 individual fiber splices) on a machine with 400 arcs remaining on the counter should bring spare electrodes or expect a mid-job interruption. In T12 (testing), when the OTDR reveals a systematic pattern of elevated splice loss across an entire run — not random outliers, but consistently 0.08–0.12 dB rather than the expected 0.02–0.04 dB — the most common root cause is a degraded electrode that was not replaced at its counter limit; correlating the OTDR data to the splicer maintenance log is the diagnostic path that confirms or rules out equipment condition as the cause.
        </p>
      </section>
    </LessonLayout>
  );
}
