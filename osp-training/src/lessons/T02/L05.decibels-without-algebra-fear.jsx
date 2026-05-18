// Migrated from M01 §1.5 (B-grade in source → full rewrite with step-by-step algebra + WorkedExample)
// T02.L05 — Decibels Without the Algebra Fear

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L05',
  course_id: 'T02',
  title: 'Decibels Without the Algebra Fear',
  order: 5,
  lesson_type: 'foundation',
  prerequisites: ['T02.L02'],
  vocabulary_introduced: ['dB', 'dBm', 'logarithm', 'loss budget', 'optical power'],
  key_terms: [
    { term: 'dB', definition: 'Decibel — the unit used to measure optical power loss in fiber optics. Losses add in dB instead of multiplying as fractions. Key facts: 3 dB = half the power, 10 dB = one-tenth the power, 20 dB = one-hundredth the power.' },
    { term: 'dBm', definition: 'Decibels referenced to 1 milliwatt — an absolute power level. 0 dBm = 1 mW exactly. Positive dBm = more than 1 mW (typical transmitter range). Negative dBm = less than 1 mW (typical receiver sensitivity: -20 to -35 dBm). Formula: dBm = 10 x log10(P_mW / 1 mW).' },
    { term: 'logarithm', definition: 'A mathematical function that converts multiplication into addition. The log base 10 of a number answers: "10 to what power equals this number?" In fiber optics, logarithms are the reason dB losses can simply be added together rather than multiplied as power fractions.' },
    { term: 'loss budget', definition: 'The total dB of loss a fiber link can absorb while still delivering enough signal to the receiver. Calculated as: Tx power (dBm) minus Rx sensitivity (dBm). The link passes if total losses (fiber + splices + connectors + margin) are less than the loss budget.' },
    { term: 'optical power', definition: 'The amount of light energy in a fiber optic signal, measured in milliwatts (mW) or decibels-milliwatt (dBm). Transmitters output power in the range of -5 to +10 dBm; receivers need a minimum power level (sensitivity) typically in the -20 to -35 dBm range to decode the signal.' },
  ],
  vocabulary_assumed: [
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 30,
  learning_objectives: [
    'Convert between absolute power (mW, µW) and relative power (dB, dBm) using the dB formula',
    'Interpret attenuation and gain specifications in decibels to predict signal levels in a link',
    'Apply dB math to a worked example: source power (dBm) minus attenuation (dB) minus margin (dB) equals received power (dBm)',
    'Use decibel understanding to explain why link-budget calculations prioritize dB values over mW values',
  ],
};

export default function T02L05_DecibelsWithoutAlgebraFear() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Quick refresher:</strong> In <strong>T02.L02</strong>, you learned that attenuation is signal loss as light travels through fiber, measured in <strong>dB/km</strong>. This lesson explains what "dB" actually means — the unit itself, and how to use dB math to predict power levels in a link.
        </div>

        <p>
          You've heard the word "decibel" — probably in audio (speaker loudness) or cell signal
          bars. In fiber optics, decibels (dB) are how we measure optical power loss. And
          here's the good news: you don't need to understand logarithms from scratch to use
          dB on the job. You need to know three key facts and one formula. That's it.
        </p>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Quick refresher:</strong> In <strong>T02.L02</strong>, we introduced attenuation as signal loss measured in dB/km (decibels per kilometer). This lesson unpacks what a "decibel" actually is and how the dB unit makes loss calculations simple instead of complex.
        </div>

        <h3 className="mt-5 font-semibold">The three facts you must know cold</h3>
        <ol className="list-decimal pl-5 space-y-3 mt-2">
          <li>
            <strong>3 dB = half the power.</strong> If you lose 3 dB, you've lost half the
            light. If you have 3 dB of gain (like from an amplifier), you've doubled the light.
            This is a universal approximation that's exact to within 0.1%: 10 × log₁₀(0.5) = −3.01 dB.
          </li>
          <li>
            <strong>10 dB = one-tenth the power.</strong> Lose 10 dB and you're down to 1/10
            of what you started with. 20 dB = 1/100. 30 dB = 1/1000.
          </li>
          <li>
            <strong>dB losses add, not multiply.</strong> A 3 dB loss followed by another 3 dB
            loss = 6 dB total. You don't multiply (0.5 × 0.5 = 0.25 = 6 dB loss). You add.
            This is the whole reason dB exist — they turn multiplication into addition.
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">The decibel formula</h3>
        <p className="mt-2">
          Before the formula: what is a logarithm? A logarithm tells you what power of 10 a
          number is. For example: log₁₀(100) = 2, because 10² = 100. log₁₀(1000) = 3, because
          10³ = 1000. The "log" button on your calculator does this automatically — punch in any
          number and it tells you the exponent of 10 that gives you that number. In fiber optics,
          logarithms are the reason dB losses can simply be added together rather than multiplied
          as power fractions.
        </p>
        <p className="mt-2">
          Loss in dB = 10 × log₁₀ (P_out / P_in)
        </p>
        <p className="mt-2">
          Where:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li><strong>P_out</strong> = the power at the output (what comes out)</li>
          <li><strong>P_in</strong> = the power at the input (what went in)</li>
          <li><strong>log₁₀</strong> = logarithm base 10 (the "log" key on a calculator)</li>
        </ul>
        <p className="mt-2">
          When P_out is less than P_in (you lost power), the result is a negative number.
          In fiber work, we describe loss as a positive number: "3 dB of loss," not "−3 dB."
          That's a convention — just be aware of it.
        </p>

        <h3 className="mt-5 font-semibold">What is dBm?</h3>
        <p className="mt-2">
          <strong>dBm</strong> = decibels referenced to 1 milliwatt. It's an absolute power
          level, not a ratio. The formula: dBm = 10 × log₁₀(P_in_mW / 1 mW).
        </p>
        <p className="mt-2">
          Key dBm values to memorize:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>0 dBm = 1 mW (exactly, by definition)</li>
          <li>+3 dBm ≈ 2 mW (doubled)</li>
          <li>−3 dBm ≈ 0.5 mW (halved)</li>
          <li>−10 dBm = 0.1 mW = 100 µW</li>
          <li>−20 dBm = 0.01 mW = 10 µW</li>
          <li>−30 dBm = 1 µW</li>
        </ul>
        <p className="mt-2">
          In a link budget: the transmitter puts out a certain dBm level. The receiver needs a
          minimum dBm level to work (the "sensitivity"). The difference is the optical budget
          you have to "spend" on fiber, splice, and connector losses.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L05"
          cards={[
            { id: 'T02-L05-fc-db', front: 'What is a decibel (dB) in fiber optics?', back: 'The unit used to measure optical power loss. Key facts: 3 dB = half the power lost, 10 dB = one-tenth the power remains, 20 dB = one-hundredth remains. dB losses add together instead of multiplying fractions -- that\'s why they exist.' },
            { id: 'T02-L05-fc-dbm', front: 'What is dBm?', back: 'Decibels referenced to 1 milliwatt -- an absolute power level. 0 dBm = 1 mW exactly. Positive dBm = more than 1 mW (typical transmitter range). Negative dBm = less than 1 mW (typical receiver sensitivity: -20 to -35 dBm). Formula: dBm = 10 x log10(P_mW / 1 mW).' },
            { id: 'T02-L05-fc-log', front: 'Why are logarithms used in fiber optics?', back: 'Logarithms convert multiplication into addition. Without dB, you would have to multiply all the fractional power losses together (0.95 x 0.97 x 0.89 x ...). With dB, you just add the losses: 0.22 + 0.13 + 0.50 + ... That\'s why engineers created the dB scale for cascaded network analysis.' },
            { id: 'T02-L05-fc-lossbudget', front: 'What is a loss budget (optical budget)?', back: 'The total dB of loss a fiber link can absorb while still delivering enough signal to the receiver. Calculated as: Tx power (dBm) minus Rx sensitivity (dBm). The link passes if total losses are less than this budget.' },
            { id: 'T02-L05-fc-optpower', front: 'What is optical power in a fiber link?', back: 'The amount of light energy in a fiber optic signal, measured in milliwatts (mW) or dBm. Transmitters output power typically in the -5 to +10 dBm range; receivers need a minimum power level (sensitivity) typically in the -20 to -35 dBm range.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Converting Between mW and dBm — Step by Step</h2>
        <p>
          Here's the conversion worked from scratch, so you see every step. No skipping algebra.
        </p>

        <h3 className="mt-4 font-semibold">Example 1: Convert 2 mW to dBm</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-8 text-slate-200 my-3">
          {`Step 1: Start with the formula
          dBm = 10 × log₁₀(P / 1 mW)

Step 2: Substitute P = 2 mW
          dBm = 10 × log₁₀(2 / 1)
          dBm = 10 × log₁₀(2)

Step 3: log₁₀(2) = 0.30103  (calculator or table)
          dBm = 10 × 0.30103
          dBm = 3.0103

Result: 2 mW ≈ +3.0 dBm  ✓ (matches our "3 dB = double" rule)`}
        </div>

        <h3 className="mt-4 font-semibold">Example 2: Convert −28 dBm to µW (receiver sensitivity)</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-8 text-slate-200 my-3">
          {`Step 1: Rearrange dBm formula to solve for P
          P (mW) = 10^(dBm / 10)

Step 2: Substitute dBm = −28
          P = 10^(−28 / 10)
          P = 10^(−2.8)

Step 3: 10^(−2.8) = 10^(−3) × 10^(0.2)
          = 0.001 × 1.585
          = 0.001585 mW

Step 4: Convert to µW (1 mW = 1000 µW)
          P = 0.001585 mW × 1000 µW/mW
          P ≈ 1.58 µW

Result: −28 dBm ≈ 1.58 µW`}
        </div>
        <p className="text-sm text-slate-300/80">
          <strong>Sanity check:</strong> −28 dBm is 28 dB below 1 mW. Every 10 dB is a factor
          of 10. So 28 dB below 1 mW ≈ 10^(−2.8) mW ≈ 1.6 µW. That's less than two-millionths
          of a watt — a receiver that sensitive is a precision instrument.
        </p>

        <h3 className="mt-5 font-semibold">Why dB makes link budgets easy</h3>
        <p>
          A link has: 15 km of fiber, 4 fusion splices, 2 connectors, and a 3 dB safety margin.
          Using the planning values from T02.L02 (0.25 dB/km at 1550 nm):
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Fiber loss:      15 km × 0.25 dB/km = 3.75 dB
Splice loss:     4 × 0.15 dB       = 0.60 dB
Connector loss:  2 × 0.30 dB       = 0.60 dB
Safety margin:                       3.00 dB
──────────────────────────────────────────────
Total:                               7.95 dB`}
        </div>
        <p className="mt-2">
          Because everything is in dB, you just add. If your link budget (Tx power − Rx
          sensitivity) is, say, 24 dB, the link passes with 24 − 7.95 = 16.05 dB of headroom.
        </p>
        <p className="mt-2">
          Without dB, you'd have to multiply all the fractional losses together as ratios — that's
          exponentially harder to do in your head, and impossible without a calculator when you
          have 20+ components in a system.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Common dB Traps</h2>
        <ul className="list-disc pl-5 space-y-3 mt-2 text-sm">
          <li>
            <strong>dB is a ratio; dBm is absolute.</strong> You can subtract dBm values to get dB.
            You cannot add two dBm values — that's adding two absolute powers, which requires
            converting back to mW first.
          </li>
          <li>
            <strong>OTDR reports loss in dB, not dBm.</strong> An OTDR shows you the loss at each
            point on the fiber (in dB) relative to the launch. It's measuring loss ratios, not
            absolute power.
          </li>
          <li>
            <strong>Return loss (ORL) and insertion loss.</strong> Insertion loss is forward loss
            (how much signal you lose passing through a component). Return loss — also called ORL
            (Optical Return Loss) — is backward: how much of the signal gets reflected back toward
            the source. Both are in dB; higher return loss is better (less reflection, more light
            reaching the far end). A "high return loss" spec (e.g., 50 dB) means very little light
            bounced back. APC connectors (angled physical contact, green) typically achieve
            ≥ 60 dB ORL; UPC connectors (blue) typically achieve ≥ 50 dB ORL.
          </li>
          <li>
            <strong>dBd vs. dBi (antennas — just so you know).</strong> In wireless work, dBd is
            gain referenced to a dipole, dBi to an isotropic antenna. These are antenna terms —
            you won't see them in fiber work, but crews who've come from wireless backgrounds
            sometimes confuse them with fiber dB. Different context entirely.
          </li>
        </ul>
      </section>

      {/* ── WORKED EXAMPLE ──────────────────────────────────────────────── */}
      <WorkedExample
        title="dB ↔ mW Converter"
        description="Convert between optical power in milliwatts (mW) and decibels-milliwatt (dBm). Adjust the slider to see how dBm and mW relate across the typical OSP operating range."
        variables={[
          {
            key: 'dbm',
            label: 'Power level',
            units: 'dBm',
            default: -10,
            min: -40,
            max: 10,
            step: 0.5,
          },
        ]}
        formula={({ dbm }) => Math.pow(10, dbm / 10)}
        steps={({ dbm }, result) => [
          { expression: 'P (mW) = 10 ^ (dBm / 10)' },
          { expression: `P = 10 ^ (${dbm} / 10) = 10 ^ (${(dbm / 10).toFixed(2)})`, value: result, unit: 'mW' },
          { expression: `P = ${(result * 1000).toFixed(3)} µW`, },
        ]}
        sanityCheck={(result, { dbm }) => {
          const uW = result * 1000;
          if (dbm === 0) return `0 dBm is exactly 1 mW — the reference point that defines the dBm scale.`;
          if (dbm > 0) return `${dbm} dBm = ${result.toFixed(4)} mW (${uW.toFixed(2)} µW). Positive dBm means more than 1 mW — typical transmitter output range.`;
          return `${dbm} dBm = ${result.toFixed(4)} mW (${uW.toFixed(2)} µW). This is ${Math.round(1 / result)} times weaker than 1 mW. Typical fiber receiver sensitivities are in the −20 to −35 dBm range.`;
        }}
        resultLabel="Power"
        resultUnit="mW"
        resultDecimals={4}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L05 Check — Decibels"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L05-Q1',
            type: 'mc',
            prompt:
              'A fiber link has 6 dB of total loss. What fraction of the original optical power reaches the receiver?',
            choices: [
              'One-half (50%)',
              'One-quarter (25%)',
              'One-sixth (17%)',
              'One-tenth (10%)',
            ],
            answerIndex: 1,
            explanation:
              '6 dB = 3 dB + 3 dB. Each 3 dB halves the power. So 6 dB = ½ × ½ = ¼ of original power. Alternatively: 10^(−6/10) = 10^(−0.6) ≈ 0.25. The "3 dB = half" rule applied twice gives you the same answer.',
          },
          {
            id: 'T02-L05-Q2',
            type: 'fill-in-blank',
            prompt:
              'A transmitter outputs +3 dBm. The receiver sensitivity is −24 dBm. The available optical budget is ____ dB.',
            answer: '27',
            answerDisplay: '27 dB',
            explanation:
              'Budget = Tx power − Rx sensitivity = +3 dBm − (−24 dBm) = 3 + 24 = 27 dB. You subtract the (negative) receiver sensitivity, which means you add its absolute value. The 27 dB is the total loss the cable plant can accumulate while still delivering enough signal to the receiver.',
          },
          {
            id: 'T02-L05-Q3',
            type: 'mc',
            prompt:
              'Why do fiber link budgets use decibels instead of expressing loss as raw power ratios?',
            choices: [
              'Decibels are required by OSHA for all electrical safety calculations',
              'Because with dB, all the losses in a link add together — fiber + splices + connectors — instead of multiplying fractional ratios, making the math tractable by hand',
              'Because power meters only output results in dBm, and dB is the natural input format',
              'Because TIA standards prohibit the use of milliwatts in design documentation',
            ],
            answerIndex: 1,
            explanation:
              'Logarithms convert multiplication into addition. Instead of calculating (0.95) × (0.97) × (0.89) × ... for every component\'s fractional power through, you add their dB losses: 0.22 + 0.13 + 0.50 + ... That\'s why engineers created the dB scale for cascaded network analysis.',
          },
          {
            id: 'T02-L05-Q4',
            type: 'mc',
            prompt:
              'A power meter reads −17 dBm at a test point. Approximately how many microwatts (µW) is that?',
            choices: [
              '200 µW',
              '20 µW',
              '2 µW',
              '0.2 µW',
            ],
            answerIndex: 1,
            explanation:
              '−17 dBm: 10^(−17/10) = 10^(−1.7) = 10^(−2) × 10^(0.3) = 0.01 × 2 = 0.02 mW = 20 µW. Using the shortcut: −20 dBm = 10 µW, and −17 is 3 dB above −20, so approximately double: ≈ 20 µW.',
            fieldNote:
              'A fiber power meter that reads −17 dBm is within the normal range for a short SMF link or a patch cord connection test. Receivers typically need at least −25 to −30 dBm to operate reliably.',
          },
        ]}
      />

    </LessonLayout>
  );
}
