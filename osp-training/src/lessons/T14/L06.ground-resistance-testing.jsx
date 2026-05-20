// T14.L06 — Ground Resistance Testing — IEEE 81
// Working lesson: fall-of-potential method, 62% rule, clamp-on method, acceptance thresholds

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T14.L06',
  course_id: 'T14',
  title: 'Ground Resistance Testing — IEEE 81',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T14.L05'],
  vocabulary_introduced: [
    'fall-of-potential',
    'current probe',
    'potential probe',
    '62% rule',
    'clamp-on method',
    'soil resistivity',
  ],
  key_terms: [
    {
      term: 'fall-of-potential',
      definition:
        'The standard three-terminal method for measuring ground resistance per IEEE 81-2012 §9.3. A test current is injected from the electrode under test to a remote current probe. A separate potential probe is placed between them to measure the voltage drop. Resistance = voltage measured / current injected. The "fall of potential" name describes how the voltage drops as you move the potential probe away from the electrode (from high near the rod, falling to near-zero at true remote earth).',
    },
    {
      term: 'current probe',
      definition:
        'The outer probe in a three-terminal fall-of-potential test. It is driven into the soil far from the electrode under test (at least 5 times the rod length) to establish a "remote earth" reference that is outside the resistance zone of the electrode. Test current flows between the electrode and the current probe.',
    },
    {
      term: 'potential probe',
      definition:
        'The middle probe in a three-terminal fall-of-potential test. It measures the voltage drop between the electrode and the current probe. Placed at the 62% distance between the electrode and the current probe for a valid reading. The potential probe does not carry significant current.',
    },
    {
      term: '62% rule',
      definition:
        'The potential-probe placement rule from IEEE 81-2012 §9.3: the potential probe must be placed at 62% of the distance between the electrode under test and the current probe. At this position, the probe falls within the "flat" zone of the resistance curve — the region of true remote earth where the reading is stable. A ±10% probe-movement validation confirms the probe is in the correct zone.',
    },
    {
      term: 'clamp-on method',
      definition:
        'A ground resistance measurement technique that uses a clamp-on impedance meter clamped around the ground conductor without disconnecting anything. Valid only within a multi-electrode GES where multiple parallel paths exist. Per IEEE 81-2012 §9.4, the clamp-on method is NOT valid for the primary acceptance test on a new single-rod installation. It is a maintenance/trending tool, not an acceptance tool.',
    },
    {
      term: 'soil resistivity',
      definition:
        'The resistance of the soil itself, measured in ohm-meters (Ω·m). Sandy, rocky, or frozen soil has high resistivity (makes it harder to achieve low ground resistance). Clay or loam soil has lower resistivity. Soil resistivity directly affects how low a resistance you can achieve with a given electrode design. High-resistivity soil may require longer rods, multiple rods in parallel, or bentonite backfill.',
    },
  ],
  vocabulary_assumed: [
    { term: 'grounding', source_lesson_id: 'T14.L01' },
    { term: 'ground rod', source_lesson_id: 'T14.L04' },
    { term: 'supplemental electrode', source_lesson_id: 'T14.L04' },
    { term: 'GES', source_lesson_id: 'T01.L08' },
    { term: 'IBT', source_lesson_id: 'T01.L08' },
    { term: 'NEC', source_lesson_id: 'T01.L08' },
  ],
  learning_objectives: [
    'Set up and execute the three-terminal fall-of-potential test per IEEE 81-2012 §9.3',
    'Apply the 62% rule correctly to position the potential probe',
    'Validate the test using the ±10% probe-movement check',
    'Interpret results against NEC §250.56 (25 Ω) and GR-1275 (5 Ω) acceptance thresholds',
    'Explain why the clamp-on method cannot substitute for fall-of-potential on a new single-rod installation',
  ],
  estimated_minutes: 30,
};

export default function T14L06_GroundResistanceTesting() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You just drove a ground rod at a splice closure. How do you know if it's actually
          low enough resistance to be safe? You can't tell by looking at it. Soil resistivity
          varies enormously — the same 8-ft rod in wet clay might read 8 Ω while that same rod
          in dry sand reads 80 Ω. You have to measure it.
        </p>
        <p className="mt-2">
          The test that answers this question is the fall-of-potential method, described in
          IEEE 81-2012 §9.3. You drive two small auxiliary probes into the soil near the rod,
          inject a test current, and measure the voltage that develops. Divide voltage by current,
          and you have the ground resistance. Compare to the 25 Ω NEC threshold (or 5 Ω at FDH
          sites) and you know whether the electrode passes or whether you need to add another rod.
        </p>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500 mt-4">
          <strong>Callback:</strong> Recall from <strong>T14.L05 IBT and GES</strong> — a GES must meet NEC §250.56 (25Ω) or RUS GR-1275 (5Ω) threshold. <strong>T14.L04 NEC §250 Electrodes</strong> — you select and install electrodes. This lesson teaches you the IEEE 81 test method to verify your installed electrode actually achieves the required resistance before you sign off.
        </p>
        <p className="mt-2">
          This lesson walks through the test step by step with numbers so you know exactly
          what you're doing when you set up the equipment in the field.
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
              <td className="px-3 py-2 font-mono">NEC</td>
              <td className="px-3 py-2">National Electrical Code</td>
              <td className="px-3 py-2">§250.56 sets the 25 Ω single-rod acceptance threshold</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GR-1275</td>
              <td className="px-3 py-2">Telcordia GR-1275</td>
              <td className="px-3 py-2">Industry guideline for CO/FDH ground resistance; sets ≤5 Ω threshold for equipment rooms [confirm edition]</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEEE 81</td>
              <td className="px-3 py-2">IEEE Guide for Measuring Earth Resistivity, Ground Impedance, and Earth Surface Potentials</td>
              <td className="px-3 py-2">The standard that defines the fall-of-potential procedure, probe placement, and validation methods</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h3 className="mt-6 font-semibold">The fall-of-potential setup — step by step</h3>
        <p className="mt-2">
          You need three things: the electrode under test (your ground rod), a current probe,
          and a potential probe. Spacing them correctly is what makes the test valid.
        </p>
        <ol className="list-decimal ml-6 mt-2 space-y-2 text-slate-300/90">
          <li>
            <strong>Current probe (C2):</strong> Drive it into the soil at least 5 times the
            rod length away from the electrode. For a standard 8-ft rod, that's at least 40 ft
            from the rod. The current probe must be far enough that its own resistance zone
            doesn't overlap with the electrode's resistance zone. (Source: IEEE 81-2012 §9.3.)
          </li>
          <li>
            <strong>Potential probe (P2):</strong> Drive it at 62% of the distance between the
            electrode and the current probe. If the current probe is 40 ft away, the potential
            probe goes at 62% × 40 ft = 24.8 ft from the electrode.
          </li>
          <li>
            <strong>Connect the meter:</strong> Terminal C1 (or E) = electrode under test.
            Terminal P1 = potential probe. Terminal C2 = current probe. The meter injects AC
            test current between C1 and C2, measures the voltage at P1, and displays the result
            in ohms.
          </li>
          <li>
            <strong>Record the reading.</strong>
          </li>
          <li>
            <strong>Validate with the ±10% test:</strong> Move the potential probe 10% of the
            C1-to-C2 distance in both directions (±4 ft for 40-ft total spacing). Read the
            meter again at each position. If the three readings agree within ±2%, you are in
            the "flat zone" — the test is valid. If they vary more than 2%, the current probe
            is too close — move it farther out and repeat. (Source: IEEE 81-2012 §9.3.)
          </li>
        </ol>

        <AnnotatedDiagram
          title="Fall-of-Potential Test Setup"
          description="Probe placement for a standard 8-ft ground rod using the IEEE 81 three-terminal method. Click each probe position to see the placement rule."
          src="/training/assets/diagrams/t14-fall-of-potential.svg"
          alt="Diagram showing ground rod under test, potential probe at 62% position, and current probe at 5x rod-length, with resistance curve illustration"
          aspectRatio={16 / 7}
          hotPoints={[
            {
              id: 'rod',
              x: 10,
              y: 50,
              label: 'Ground Rod (C1/E)',
              explanation:
                'The electrode under test. For an 8-ft rod: minimum current probe spacing = 5 × 8 ft = 40 ft. This is terminal C1 (or E) on the ground resistance meter.',
              type: 'click',
            },
            {
              id: 'potential_probe',
              x: 38,
              y: 50,
              label: 'Potential Probe P2 (62% = 24.8 ft)',
              explanation:
                '62% of 40 ft = 24.8 ft from the electrode. This is the 62% rule position. At this distance, the probe is in the "flat zone" of the resistance curve — far enough from the electrode\'s resistance zone that the reading is stable. (Source: IEEE 81-2012 §9.3.)',
              type: 'click',
            },
            {
              id: 'current_probe',
              x: 90,
              y: 50,
              label: 'Current Probe C2 (≥40 ft)',
              explanation:
                'Minimum 5 × rod length = 40 ft from the electrode for an 8-ft rod. Must be far enough that its resistance zone does not overlap the electrode\'s zone. If the ±10% validation test fails, move this probe farther out. (Source: IEEE 81-2012 §9.3.)',
              type: 'click',
            },
          ]}
        />
      </section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-6">
        <WorkedExample
          title="Fall-of-Potential Probe Placement and Interpretation"
          description="Calculate correct probe positions for a standard 8-ft rod, then interpret the reading against the NEC and GR-1275 thresholds."
          variables={[
            { key: 'rod_length_ft', label: 'Ground rod length', units: 'ft', default: 8, min: 8, max: 20, step: 2 },
            { key: 'measured_resistance', label: 'Measured resistance', units: 'Ω', default: 18, min: 1, max: 200, step: 1 },
          ]}
          formula={(v) => v.rod_length_ft * 5}
          steps={(v, result) => {
            const c2Distance = result;
            const p2Distance = (c2Distance * 0.62).toFixed(1);
            const validationMove = (c2Distance * 0.10).toFixed(1);
            return [
              {
                expression: `Step 1: Current probe minimum distance = 5 × rod length`,
                value: c2Distance,
                unit: 'ft from electrode',
              },
              {
                expression: `Step 2: Potential probe position = 62% × ${c2Distance} ft`,
                value: parseFloat(p2Distance),
                unit: 'ft from electrode (62% rule)',
              },
              {
                expression: `Step 3: ±10% validation movement = ±10% × ${c2Distance} ft`,
                value: parseFloat(validationMove),
                unit: 'ft each direction',
              },
              {
                expression: `Step 4: Measured resistance = ${v.measured_resistance} Ω`,
                value: v.measured_resistance,
                unit: 'Ω',
              },
              {
                expression: `Compare to NEC §250.56 threshold: 25 Ω → ${v.measured_resistance <= 25 ? 'PASS (aerial pole)' : 'FAIL — supplemental rod required'}`,
                value: null,
              },
              {
                expression: `Compare to GR-1275 threshold: 5 Ω → ${v.measured_resistance <= 5 ? 'PASS (FDH/CO)' : 'FAIL — additional electrode or bentonite required for FDH/CO site'}`,
                value: null,
              },
            ];
          }}
          sanityCheck={(result, v) =>
            `Current probe at ${result} ft, potential probe at ${(result * 0.62).toFixed(1)} ft. Measured ${v.measured_resistance} Ω — ` +
            (v.measured_resistance <= 5
              ? 'passes both NEC and GR-1275 thresholds. This rod is good for aerial poles AND equipment rooms.'
              : v.measured_resistance <= 25
              ? 'passes the NEC 25 Ω aerial-pole threshold but fails the GR-1275 5 Ω FDH/CO threshold. For an aerial pole, no action needed. For a field FDH cabinet, a supplemental rod (or ring electrode) is required.'
              : 'fails the NEC 25 Ω threshold — supplemental rod required. Typical sandy or gravelly soil reads 50–200 Ω before remediation.')
          }
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h3 className="mt-6 font-semibold">The clamp-on method — when it works and when it doesn't</h3>
        <p className="mt-2">
          Clamp-on ground resistance meters are convenient — you clamp around the ground
          conductor without disconnecting anything. But they only work correctly within a
          multi-electrode GES where the clamp measures the parallel resistance of the clamped
          electrode's path through the GES, not the electrode alone.
        </p>
        <p className="mt-2">
          Per IEEE 81-2012 §9.4: the clamp-on method is NOT valid for the primary acceptance test
          on a new single-rod installation. Why? On a single rod with no parallel paths, the
          clamp measures the series impedance of the whole test circuit — which includes the
          meter's own internal resistance path, not just the electrode. The reading is not a
          true ground resistance measurement. (Source: IEEE 81-2012 §9.4.)
        </p>
        <p className="mt-2">
          Use the clamp-on method for: periodic maintenance checks on an existing GES with
          multiple electrodes, trending over time to detect degradation, or verifying that a
          known-good GES hasn't changed significantly. Use the fall-of-potential method for:
          primary acceptance testing of any new single-rod electrode.
        </p>
        <p className="mt-2">
          <em>
            Book vs. field note: Many crews use the clamp-on meter exclusively because it's
            faster. That works fine for maintenance checks on an established GES. But for
            RUS close-out documentation requiring a verified ground resistance test on each
            new electrode, you need the fall-of-potential result. The inspector will ask
            "what method?" and "clamp-on on a new single rod" is the wrong answer per
            IEEE 81-2012. Use the three-terminal test for acceptance.
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
              id: 'T14L06Q1',
              text: 'Using a 5/8-in. × 8-ft ground rod, where should the current probe be placed for a valid fall-of-potential test?',
              options: [
                '8 feet from the electrode (1× rod length)',
                '24 feet from the electrode (3× rod length)',
                '40 feet from the electrode (5× rod length)',
                '80 feet from the electrode (10× rod length)',
              ],
              correct: 2,
              explanation:
                'IEEE 81-2012 §9.3 requires the current probe to be at a minimum of 5 times the rod length from the electrode. For an 8-ft rod: 5 × 8 = 40 ft. The 5× rule ensures the current probe is outside the resistance zone of the electrode under test, establishing a true remote-earth reference. (Source: IEEE 81-2012 §9.3.)',
            },
            {
              id: 'T14L06Q2',
              text: 'With the current probe at 40 ft, where should the potential probe be placed per the 62% rule?',
              options: [
                '8 ft from the electrode (20%)',
                '24.8 ft from the electrode (62%)',
                '30 ft from the electrode (75%)',
                '20 ft from the electrode (50%)',
              ],
              correct: 1,
              explanation:
                '62% × 40 ft = 24.8 ft from the electrode. At this position, the potential probe is in the "flat zone" of the resistance curve — the region where the voltage reading is stable and representative of true remote earth. (Source: IEEE 81-2012 §9.3.)',
            },
            {
              id: 'T14L06Q3',
              text: 'After taking a fall-of-potential reading of 18 Ω at an aerial pole, you move the potential probe ±4 ft and get readings of 18.2 Ω and 17.8 Ω. What does this mean?',
              options: [
                'The test is invalid — move the current probe closer to improve consistency',
                'The ±10% validation passed (all three readings within 2% of each other); the test is valid',
                'You must average the three readings to get the reported value',
                'The test is invalid because the variation exceeds 0.5%',
              ],
              correct: 1,
              explanation:
                '18.2 Ω and 17.8 Ω vs. 18 Ω represent a variation of about ±1.1% — well within the ±2% threshold for the ±10% probe-movement validation. This confirms the potential probe was in the flat zone of the resistance curve, making the 18 Ω reading valid. Compare 18 Ω to NEC 25 Ω threshold: passes for aerial pole. (Source: IEEE 81-2012 §9.3.)',
            },
            {
              id: 'T14L06Q4',
              text: 'A new single ground rod was just installed at an FDH site. The crew uses a clamp-on meter and gets 12 Ω. Is this a valid acceptance test per IEEE 81-2012?',
              options: [
                'Yes — 12 Ω is below 25 Ω, so it passes the NEC threshold',
                'No — the clamp-on method is not valid for primary acceptance testing on a new single-rod installation',
                'Yes — the clamp-on method is always equivalent to the fall-of-potential method',
                'It depends on the soil type — valid in clay but not in sandy soils',
              ],
              correct: 1,
              explanation:
                'IEEE 81-2012 §9.4 explicitly states that the clamp-on method is not valid for primary acceptance testing on a new single-rod installation. The clamp-on reading without parallel GES paths does not accurately represent the electrode\'s true ground resistance. A three-terminal fall-of-potential test is required for RUS close-out acceptance. Additionally, 12 Ω fails the GR-1275 5 Ω threshold for FDH sites, so the site would need additional electrodes regardless. (Source: IEEE 81-2012 §9.4.)',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
