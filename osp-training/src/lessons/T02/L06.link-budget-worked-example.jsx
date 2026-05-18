// Migrated from M01 §1.6 + §1.7 (worked budget + LinkBudgetCalculator — preserved verbatim, expanded with step explainers)
// T02.L06 — Link Budget: Worked Example

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import LinkBudgetCalculator from '../../components/LinkBudgetCalculator.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L06',
  course_id: 'T02',
  title: 'Link Budget — Worked Example',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T02.L05'],
  vocabulary_introduced: ['link budget', 'Tx power', 'Rx sensitivity', 'optical headroom', 'safety margin'],
  key_terms: [
    { term: 'link budget', definition: 'The central calculation that answers: "Will this fiber connection actually work?" It\'s a simple accounting exercise: how much optical power do I have to spend (budget = Tx - Rx), and how much does the path cost (fiber + connectors + splices + margin).' },
    { term: 'Tx power', definition: 'Transmitter output power -- how much light the laser or LED puts into the fiber, measured in dBm. Typical OSP transmitters: -5 to +5 dBm.' },
    { term: 'Rx sensitivity', definition: 'Receiver minimum detectable power -- the dimmest signal the receiver can still decode reliably, measured in dBm (a negative number). Typical receiver sensitivity: -20 to -35 dBm. The link must deliver at least this much power after all losses.' },
    { term: 'optical headroom', definition: 'Budget minus total loss -- how much margin you have left over after accounting for all losses and the safety margin. Positive headroom = link passes. Negative headroom = link fails and needs redesign. Above 6-8 dB is considered comfortable.' },
    { term: 'safety margin', definition: 'A flat reserve (typically 3 dB) in a link budget that is never allocated to components. It covers fiber aging, splice case thermal cycling, connector wear over time, and future re-splices. Never skip this -- it\'s why links still work 20+ years later.' },
  ],
  vocabulary_assumed: [
    { term: 'dB', source_lesson_id: 'T02.L05' },
    { term: 'dBm', source_lesson_id: 'T02.L05' },
    { term: 'loss budget', source_lesson_id: 'T02.L05' },
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 35,
  learning_objectives: [
    'Build a complete link budget for a 40-mile span: OLT output → SMF attenuation → splice/connector losses → FDH equipment → ONT input',
    'Verify margin (signal at receiver minus minimum required) is positive and exceeds 6 dB safety threshold',
    'Adjust design variables (fiber type, wavelength, span distance) to recover margin when a baseline budget fails',
    'Present the link-budget calculation to a designer using standard dB notation for sign-off',
  ],
};

export default function T02L06_LinkBudgetWorkedExample() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Quick refresher:</strong> In <strong>T02.L02</strong>, you learned that attenuation is signal loss (measured in dB/km). In <strong>T02.L05</strong>, you learned how decibels (dB) work — so you can add losses together instead of multiplying fractions. This lesson brings those concepts together in a single calculation that tells you if a link actually works.
        </div>

        <p>
          A <strong>link budget</strong> is the central calculation that answers the question:
          "Will this fiber connection actually work?" It's a simple accounting exercise:
          how much optical power do I have to spend, and how much does the path between
          transmitter and receiver cost?
        </p>
        <p className="mt-2">
          Think of it like a road trip budget. You have $200 (your available optical budget),
          and the trip costs gas (fiber attenuation) + tolls (connector loss) + food (splice
          loss) + an emergency fund (safety margin). If the total is under $200, you make it.
          If it's over, you don't — and you need to redesign the trip.
        </p>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Quick refresher:</strong> You learned the building blocks in <strong>T02.L02</strong> (attenuation — signal loss as light travels through fiber), <strong>T02.L05</strong> (decibels — the arithmetic that makes losses simple to add), and <strong>T02.L02</strong> (dB/km — how attenuation is specified). This lesson brings all three together into one calculation: the link budget.
        </div>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">What it means</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Tx power</td>
              <td className="px-3 py-2">Transmitter output power — how much light the laser or LED puts into the fiber (in dBm)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Rx sensitivity</td>
              <td className="px-3 py-2">Receiver minimum detectable power — the dimmest signal the receiver can still decode reliably (in dBm, a negative number)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Optical budget</td>
              <td className="px-3 py-2">Tx power minus Rx sensitivity — the total dB of loss the link can absorb and still work (in dB)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Headroom</td>
              <td className="px-3 py-2">Budget minus total loss — how much margin you have left over. Positive headroom = link passes. Negative = fail.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The four cost categories</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Fiber attenuation:</strong> length (km) × loss rate (dB/km). This grows
            with distance — the main distance limiter.
          </li>
          <li>
            <strong>Connector loss:</strong> number of mated connector pairs × loss per pair (dB).
            Every patch panel connection, every bulkhead — each one costs optical budget.
          </li>
          <li>
            <strong>Splice loss:</strong> number of fusion splices × loss per splice (dB).
            Well-made fusion splices are cheap (0.05–0.15 dB each); they add up over a long link.
          </li>
          <li>
            <strong>Safety/aging margin:</strong> a flat reserve (typically 3 dB) for fiber
            aging, splice case thermal cycling, connector wear, and any future re-splices.
            Never skip this — it's why links still work five years later.
          </li>
        </ul>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L06"
          cards={[
            { id: 'T02-L06-fc-linkbudget', front: 'What is a link budget?', back: 'The calculation that answers: "Will this fiber connection actually work?" Budget = Tx power - Rx sensitivity (in dB). The link passes if total losses (fiber + connectors + splices + safety margin) are less than the budget.' },
            { id: 'T02-L06-fc-txpower', front: 'What is Tx power?', back: 'Transmitter output power -- how much light the laser or LED puts into the fiber, measured in dBm. Typical OSP transmitters: -5 to +5 dBm. This is the "starting" power in a link budget calculation.' },
            { id: 'T02-L06-fc-rxsensitivity', front: 'What is Rx sensitivity?', back: 'Receiver minimum detectable power -- the dimmest signal the receiver can still decode reliably, measured in dBm (a negative number). Typical: -20 to -35 dBm. The link must deliver at least this much power after all cable plant losses.' },
            { id: 'T02-L06-fc-headroom', front: 'What is optical headroom?', back: 'Budget minus total loss -- how much margin remains after accounting for all fiber, connector, splice, and safety margin losses. Positive headroom = link passes. Negative = fails and needs redesign. Above 6-8 dB is considered comfortable; above 15 dB is typically over-designed.' },
            { id: 'T02-L06-fc-safetymargin', front: 'Why does a link budget include a safety margin?', back: 'A flat reserve (typically 3 dB) that is never allocated to components. It covers fiber aging, connector wear, splice case thermal cycling, and future re-splices over the link\'s 20-30 year design life. On RUS-financed projects, removing it to squeeze in more distance is a deferred failure.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>A Complete Worked Budget</h2>

        <p className="text-slate-400 text-sm mb-3 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T02.L02 Lesson (Attenuation)</strong> — signal loses power as it travels through fiber, and losses are measured in dB/km. Recall from <strong>T02.L05 (Decibels Without the Algebra Fear)</strong> — the dB unit lets us add losses instead of multiplying them. Now we'll use both concepts together in a single calculation.
        </p>

        <p>
          Let's walk through a full link budget for a real-world scenario:
          an 18 km single-mode OSP fiber run at 1550 nm, with 6 fusion splices,
          4 connector pairs, and standard planning values.
        </p>
        <p className="text-sm text-slate-400 italic">
          (This brings together attenuation from T02.L02, dB notation from T02.L05, and the wavelength choice from T02.L07.)
        </p>

        <h3 className="mt-5 font-semibold">Step 1: Identify the optical budget</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Tx power            = +3.0 dBm
Rx sensitivity      = −24.0 dBm
                      ──────────
Available budget    = +3.0 − (−24.0)
                    = 3.0 + 24.0
                    = 27.0 dB`}
        </div>
        <p className="text-sm text-slate-300/80">
          The transmitter puts out 3 dBm; the receiver needs at least −24 dBm to work. Subtract:
          27 dB is the total the cable plant can eat and still deliver a usable signal.
        </p>

        <h3 className="mt-5 font-semibold">Step 2: Sum all the losses</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Fiber:         18 km × 0.25 dB/km    =  4.50 dB
Splices:       6 × 0.15 dB            =  0.90 dB   ← FOA planning value
Connectors:    4 × 0.30 dB            =  1.20 dB   ← FOA field default
Safety margin:                            3.00 dB
               ───────────────────────────────────
Total loss:                               9.60 dB`}
        </div>

        <h3 className="mt-5 font-semibold">Step 3: Calculate headroom</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Headroom = Budget − Total loss
         = 27.0 dB − 9.60 dB
         = 17.4 dB  ✓  LINK PASSES`}
        </div>
        <p className="text-sm text-slate-300/80">
          17.4 dB of headroom is excellent. This link could handle significantly more distance,
          or much older/lossier components, and still work. In practice, headroom above 6–8 dB
          is considered comfortable; above 15 dB is over-designed (you could use a less powerful
          transmitter or cheaper receiver).
        </p>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Which Numbers to Use</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Textbooks use TIA-568 connector max (0.75 dB) and FOA splice
            planning value (0.15 dB). This results in conservative budgets — they'll pass, but
            with less headroom than actual field performance would show.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Experienced designers use 0.30 dB/connector (FOA field rule
            of thumb for adhesive-polish or fusion splice-on connectors), 0.15 dB/splice for
            budgeting, and 0.05 dB as the field quality target (acceptance criteria is often
            ≤ 0.10 dB bidirectional average). The safety margin covers the gap.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Key rule:</strong> Be internally consistent. Don't mix the TIA max for
            connectors with a "typical" number for fiber. Pick a tier (conservative/typical/
            planning) and stick with it across the whole budget. Then use the safety margin to
            absorb whatever you didn't account for.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">What happens when the budget fails</h3>
        <p>
          If total loss exceeds the available budget (headroom goes negative), the options are:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>Use higher-power transceivers (more Tx power or more sensitive Rx)</li>
          <li>Reduce fiber length (re-route or add an intermediate active node)</li>
          <li>Reduce the number of connectors (consolidate patch panels)</li>
          <li>Improve splice quality targets</li>
          <li>Use lower-loss fiber (not always an option once cable is specified)</li>
        </ol>
        <p className="mt-2 text-sm text-slate-300/80">
          Option 1 is often cheapest. Option 2 (routing change) is sometimes the only real
          fix on RUS-program jobs where the route is dictated by the funded area.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — ORL and Back-Reflection</h2>
        <p>
          A complete link budget for high-speed DWDM or coherent systems also includes
          <strong> Optical Return Loss (ORL)</strong> — the total reflected power traveling
          back toward the transmitter. Reflections from connectors and fiber end-faces
          can corrupt the transmitted signal (especially on coherent and directly-modulated
          DFB lasers).
        </p>
        <p className="mt-2">
          ORL is measured as a positive dB ratio (higher is better):
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          ORL (dB) = −10 × log₁₀ (P_reflected / P_input)
        </div>
        <p className="text-sm text-slate-300/80">
          TIA-568.3-D [confirm edition] specifies minimum ORL for connectors; typical UPC
          connectors achieve ≥ 50 dB ORL; APC connectors achieve ≥ 60 dB. APC (angled physical
          contact — the green connectors) are required in PON/FTTH applications and anywhere
          back-reflection sensitivity is critical. UPC (blue) is standard for most OSP
          interconnect work.
        </p>
        <p className="mt-2 text-sm text-slate-300/80">
          For a field crew: the practical implication is that APC and UPC connectors must NEVER
          be mated to each other. The angled face of an APC connector against the flat face of a
          UPC will cause extremely high back-reflection and may damage the transmitter. The color
          coding (green = APC, blue = UPC) exists for this reason.
        </p>
      </section>

      {/* ── LINK BUDGET CALCULATOR ──────────────────────────────────────── */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Interactive: Try Your Own Link Budget</h3>
        <p className="text-sm text-slate-300/80 mb-4">
          Adjust the inputs below to match your project's fiber length, component count, and
          transceiver specs. The calculator uses the same methodology as the worked example above.
          Change the fiber length or connector count and watch how headroom changes.
        </p>
        <div className="mb-4 p-4 border border-sky-400/30 bg-sky-400/5 rounded-lg text-sm">
          <p className="font-semibold text-sky-300 mb-1">Splice loss: worked example vs. calculator default</p>
          <p className="text-slate-300/90">
            The worked example above uses <strong>0.15 dB per splice</strong> — the FOA conservative
            planning value recommended for project budgeting and design submissions. The calculator
            below defaults to <strong>0.10 dB per splice</strong>, which represents a single
            high-quality fusion splice at installation. The difference adds up: on a link with 6 splices,
            the two values differ by 0.30 dB of headroom. Either is defensible — use 0.15 dB for
            engineering design margins and 0.10 dB when verifying measured field results.
          </p>
        </div>
        <LinkBudgetCalculator />
      </div>

      {/* ── WORKED EXAMPLE: Headroom Calculator ─────────────────────────── */}
      <WorkedExample
        title="Headroom Calculator — Is My Link Budget Adequate?"
        description="Enter your link budget (Tx − Rx) and total calculated loss. The result shows your headroom — positive means the link works, negative means you need to redesign."
        variables={[
          {
            key: 'budget',
            label: 'Available budget (Tx power − Rx sensitivity)',
            units: 'dB',
            default: 27,
            min: 5,
            max: 40,
            step: 0.5,
          },
          {
            key: 'fiber_loss',
            label: 'Fiber attenuation (length × dB/km)',
            units: 'dB',
            default: 4.5,
            min: 0,
            max: 30,
            step: 0.1,
          },
          {
            key: 'splice_loss',
            label: 'Total splice loss (splices × dB/splice)',
            units: 'dB',
            default: 0.9,
            min: 0,
            max: 10,
            step: 0.05,
          },
          {
            key: 'conn_loss',
            label: 'Total connector loss (pairs × dB/pair)',
            units: 'dB',
            default: 1.2,
            min: 0,
            max: 10,
            step: 0.1,
          },
          {
            key: 'margin',
            label: 'Safety/aging margin',
            units: 'dB',
            default: 3,
            min: 0,
            max: 6,
            step: 0.5,
          },
        ]}
        formula={({ budget, fiber_loss, splice_loss, conn_loss, margin }) =>
          budget - (fiber_loss + splice_loss + conn_loss + margin)
        }
        steps={({ budget, fiber_loss, splice_loss, conn_loss, margin }, result) => [
          { expression: `Total loss = fiber + splices + connectors + margin` },
          { expression: `Total loss = ${fiber_loss} + ${splice_loss} + ${conn_loss} + ${margin}`, value: fiber_loss + splice_loss + conn_loss + margin, unit: 'dB' },
          { expression: `Headroom = ${budget} dB budget − ${(fiber_loss + splice_loss + conn_loss + margin).toFixed(2)} dB loss`, value: result, unit: 'dB' },
        ]}
        sanityCheck={(result) =>
          result >= 6
            ? `${result.toFixed(1)} dB of headroom — solid. The link passes with comfortable margin for aging and future re-splices.`
            : result >= 0
            ? `${result.toFixed(1)} dB of headroom — marginal. The link should work but leaves little room for aging or component degradation. Consider whether the margin is sufficient for the expected link lifetime.`
            : `${result.toFixed(1)} dB — budget FAILS. Total loss exceeds available budget. You need higher Tx power, more sensitive Rx, shorter fiber, fewer components, or a redesigned route.`
        }
        resultLabel="Headroom"
        resultUnit="dB"
        resultDecimals={2}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L06 Check — Link Budget"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L06-Q1',
            type: 'mc',
            prompt:
              'A fiber link has: Tx = +5 dBm, Rx sensitivity = −22 dBm, fiber = 25 km × 0.25 dB/km, 8 splices × 0.15 dB, 6 connectors × 0.30 dB, 3 dB safety margin. Does this link pass?',
            choices: [
              'Yes — headroom is positive',
              'No — headroom is negative',
              'Yes, but just barely — headroom is 0 dB',
              'Cannot be determined without knowing the fiber type',
            ],
            answerIndex: 0,
            explanation:
              'Budget = 5 − (−22) = 27 dB. Losses: fiber = 25 × 0.25 = 6.25 dB, splices = 8 × 0.15 = 1.20 dB, connectors = 6 × 0.30 = 1.80 dB, margin = 3.00 dB. Total = 12.25 dB. Headroom = 27.0 − 12.25 = 14.75 dB. Link passes with 14.75 dB headroom.',
            citation: 'Link budget calculation methodology; FOA planning values.',
          },
          {
            id: 'T02-L06-Q2',
            type: 'mc',
            prompt:
              'Why does a link budget always include a "safety margin" (typically 3 dB) that is reserved and never allocated to components?',
            choices: [
              'To account for the loss introduced by the OTDR measurement cable',
              'To reserve optical power for fiber aging, thermal effects, connector wear over time, and future re-splices',
              'Because TIA-568 requires a 3 dB mandatory reserve on all SMF links',
              'To account for the difference between 1310 nm and 1550 nm planning values',
            ],
            answerIndex: 1,
            explanation:
              'Optical fiber plant degrades over time: fiber attenuation increases slightly with age and temperature cycling; connectors accumulate contamination and wear; splice cases experience freeze-thaw stress. A 3 dB margin ensures the link still works after 20+ years of service, re-splices, and component replacements.',
            fieldNote:
              'On RUS-financed projects, the design life expectation is 30+ years. A 3 dB safety margin is standard practice. Some customers require 4–5 dB. Removing it to squeeze in more distance is a deferred failure.',
          },
          {
            id: 'T02-L06-Q3',
            type: 'fill-in-blank',
            prompt:
              'If Tx power = +3 dBm and Rx sensitivity = −25 dBm, the available optical budget is ____ dB.',
            answer: '28',
            answerDisplay: '28 dB',
            explanation:
              'Budget = Tx − Rx = +3 − (−25) = 3 + 25 = 28 dB. Subtracting a negative sensitivity flips to addition of the absolute value.',
          },
        ]}
      />

    </LessonLayout>
  );
}
