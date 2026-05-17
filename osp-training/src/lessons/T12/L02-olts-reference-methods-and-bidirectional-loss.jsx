// T12.L02 — OLTS: Reference Methods and Bidirectional Loss
// Working lesson: one/two/three-cord reference methods, directional variation, bi-di OLTS average
// Pre-test reference cord verification (R-2 N-2 addition)
// Source: M08 §8.1 (migrated + expanded) | TIA-526-7A | NECA/FOA 301-2016

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L02',
  course_id: 'T12',
  title: 'OLTS — Reference Methods and Bidirectional Loss',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T12.L01', 'T11.L12'],
  learning_objectives: [
    'Describe the one-cord, two-cord, and three-cord reference methods and explain why they produce different OLTS readings on the same physical link',
    'Apply the correct pre-test reference cord verification procedure (CIC sequence + reference cord loss check ≤0.10 dB)',
    'Calculate bidirectional OLTS average given A→B and B→A readings with full arithmetic shown',
    'Explain what directional variation is and why bidirectional averaging eliminates it',
    'State the RUS contract maximum insertion loss and TIA-568 channel model structure for OSP acceptance',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'one-cord reference method',
    'two-cord reference method',
    'three-cord reference method',
    'directional variation',
    'bidirectional average (OLTS)',
  ],
  key_terms: [
    {
      term: 'one-cord reference method',
      definition:
        'OLTS reference method where a single launch cord connects the light source to the link under test. The reference (zero) is set with the single cord in place — so the link measurement includes every connector and splice beyond the launch cord, but NOT the launch cord itself. Preferred by FOA for premises links where the patch panel connection is included in the link loss. Lowest ambiguity about what is included. Per TIA-526-7A §5.',
    },
    {
      term: 'two-cord reference method',
      definition:
        'OLTS reference method that includes one launch cord and one receive cord. The reference includes one connector pair — so the measured link loss excludes that connector pair. Most common for OSP carrier and ILM acceptance testing where the near-end connector is owned by the carrier equipment, not the cable plant. Per TIA-526-7A §6.',
    },
    {
      term: 'three-cord reference method',
      definition:
        'OLTS reference method using a launch cord, an interconnect cord, and a receive cord mated together during reference. This sets the reference to include two connector pairs, so the measured link EXCLUDES those two connectors. Used when testing fiber without end connectors (direct splice-to-splice). Per TIA-526-7A §7.',
    },
    {
      term: 'directional variation',
      definition:
        'The difference in OLTS insertion loss when measuring the same link in opposite directions (A→B vs. B→A). Caused by connector polish orientation asymmetry (APC connectors are especially direction-sensitive), source beam profile differences, or slight splice MFD mismatch. Can be 0.1–0.3 dB on a link with several connectors. The bidirectional average eliminates this systematic asymmetry.',
    },
    {
      term: 'bidirectional average (OLTS)',
      definition:
        'The arithmetic mean of A→B and B→A OLTS insertion loss measurements. Formula: True IL = (IL_A→B + IL_B→A) / 2. Used whenever directional variation is present. Required when the RUS contract specifies bidirectional testing per RUS 1753F-401. This is the fairest representation of the link\'s true loss independent of measurement direction.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OLTS', source_lesson_id: 'T12.L01' },
    { term: 'insertion loss (IL)', source_lesson_id: 'T11.L12' },
    { term: 'attenuation dB/km', source_lesson_id: 'T02.L02' },
    { term: 'dual-wavelength acceptance testing', source_lesson_id: 'T12.L01' },
    { term: 'IEC 61300-3-35 inspection protocol', source_lesson_id: 'T11.L12' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L02_OLTSReferenceMethods() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before you can measure how much light the cable under test is losing, you need to
          tell the OLTS "this much power is my starting point." That setup is called the
          reference method — and the method you pick determines exactly which connectors get
          included in the measurement. Pick the wrong method, switch methods mid-project, and
          your readings from Monday and Tuesday can't be compared to each other even if the
          cable didn't change.
        </p>
        <p className="mt-2">
          There's also a sneaky effect called directional variation — the same link can read
          differently depending on which direction you push the light. The fix is simple:
          measure both directions and average. That gives you the true loss, regardless of
          which way the electrons flow through the optical fiber.
        </p>

        <h3 className="mt-5 font-semibold">Key Terms</h3>
        <Flashcard
          deckId="T12-L02"
          cards={[
            {
              id: 'T12-L02-fc-onecord',
              front: 'What is the one-cord reference method and what does it include?',
              back: 'One launch cord only. Reference is set with the launch cord in place. Measured link loss includes every connector and splice on the cable under test, but NOT the launch cord itself. Preferred for premises links. Per TIA-526-7A §5.',
            },
            {
              id: 'T12-L02-fc-twocord',
              front: 'What is the two-cord reference method?',
              back: 'Launch cord + receive cord. Reference includes one connector pair. Measured link EXCLUDES that connector pair. Most common for OSP carrier acceptance. Per TIA-526-7A §6.',
            },
            {
              id: 'T12-L02-fc-directional',
              front: 'What is directional variation in OLTS testing?',
              back: 'The difference in measured insertion loss between A→B and B→A directions on the same link. Caused by connector polish orientation asymmetry, source beam asymmetry, or splice MFD mismatch. Eliminated by bidirectional averaging.',
            },
            {
              id: 'T12-L02-fc-bidirection',
              front: 'What is the bidirectional OLTS average formula?',
              back: 'True IL = (IL_A→B + IL_B→A) / 2. Example: A→B = 3.42 dB, B→A = 3.68 dB → True IL = (3.42 + 3.68) / 2 = 3.55 dB. The average removes directional asymmetry from the measurement.',
            },
            {
              id: 'T12-L02-fc-refcord',
              front: 'Why must you verify your reference cord before every OLTS test session?',
              back: 'A dirty or scratched reference cord degrades EVERY measurement made that day — all readings will be erroneously high. Pre-test: clean (CIC sequence), inspect (≥Grade B), then mate two reference cords and measure — should read ≤0.10 dB. If it reads more, clean again or replace. This is the most common cause of mysteriously high insertion loss on new builds.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-10">
        <h2>Pre-Test: Reference Cord Verification</h2>
        <p>
          Before the first fiber of the day, verify your reference cord. A contaminated
          reference cord adds loss to every measurement — and because the reference is zeroed
          with the cord in place, the contamination gets subtracted, making every link reading
          appear falsely high. Field crews that skip this step routinely chase "failures" that
          are actually just dirty reference cords.
        </p>

        <div className="mt-4 bg-slate-800/50 rounded-xl border border-white/10 p-4">
          <h4 className="font-semibold text-amber-400 mb-3">Pre-test Reference Cord Procedure (per NECA/FOA 301-2016 §5)</h4>
          <ol className="list-decimal ml-5 space-y-2 text-sm text-slate-300/90">
            <li><strong>Clean</strong> — wipe the launch cord and receive cord connectors with an IPA dry cassette wipe (CIC step 1)</li>
            <li><strong>Inspect</strong> — view under 200× video probe; confirm ≥ Grade B per IEC 61300-3-35 (CIC step 2)</li>
            <li><strong>Mate and measure</strong> — connect launch and receive cords directly together (no cable under test); the OLTS should read ≤ 0.10 dB insertion loss between the two reference cords</li>
            <li>If the mated reference reads <strong>&gt; 0.10 dB</strong>, clean again or replace the cord before proceeding. Do NOT zero this value out — fix the source of the loss.</li>
            <li>After verification passes, zero the OLTS per the selected reference method (one-cord, two-cord, or three-cord) and begin testing.</li>
          </ol>
        </div>

        <h2 className="mt-8">The Three Reference Methods</h2>
        <p className="mt-2">
          TIA-526-7A defines three ways to establish the OLTS reference (zero point). Each
          includes a different set of connectors in the reference, which changes which
          connectors get counted in the link loss measurement.
        </p>

        <AnnotatedDiagram
          title="Three OLTS Reference Methods — What Each Includes"
          description="Conceptual diagram showing which connector pairs are included (IN MEASUREMENT) vs. excluded (IN REFERENCE) for each method"
          src=""
          alt="Three OLTS reference method wiring diagrams showing one-cord, two-cord, and three-cord configurations"
          annotations={[
            { x: 20, y: 30, label: 'One-cord: Launch cord only in reference. ALL cable-under-test connectors are measured.' },
            { x: 50, y: 55, label: 'Two-cord: Launch + receive in reference. One connector pair excluded from measurement.' },
            { x: 80, y: 75, label: 'Three-cord: Launch + interconnect + receive. Two connector pairs excluded.' },
          ]}
        />

        <div className="mt-4 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Method</th>
                <th className="px-3 py-2 text-left">Reference includes</th>
                <th className="px-3 py-2 text-left">Measurement includes</th>
                <th className="px-3 py-2 text-left">Typical application</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">One-cord</td>
                <td className="px-3 py-2">Launch cord only</td>
                <td className="px-3 py-2">All cable-plant connectors + splices</td>
                <td className="px-3 py-2">Premises links where patch panel connections are part of the plant</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Two-cord</td>
                <td className="px-3 py-2">Launch + receive</td>
                <td className="px-3 py-2">All plant connectors except near-end mating pair</td>
                <td className="px-3 py-2">OSP carrier acceptance; ILM testing; most common OSP method</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-semibold">Three-cord</td>
                <td className="px-3 py-2">Launch + interconnect + receive</td>
                <td className="px-3 py-2">Only fiber attenuation + splices; both end connectors excluded</td>
                <td className="px-3 py-2">Testing fiber-only loss when connectors belong to customer equipment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-300 text-sm font-semibold">Critical: Lock in your reference method at the start of a project and do not change it.</p>
          <p className="text-sm text-slate-300/90 mt-1">
            Different methods produce different dB readings on the identical link — the difference
            is NOT the cable changing, it is which connectors are included. Switching methods
            mid-project invalidates all previous readings as a comparison baseline.
          </p>
        </div>

        <h2 className="mt-8">Bidirectional OLTS Average — The Calculation</h2>
        <p className="mt-2">
          Measure the link in both directions. Directional variation of 0.1–0.3 dB is normal on
          links with several connectors. The bidirectional average gives the true loss:
        </p>

        <WorkedExample
          title="Bidirectional OLTS Average"
          formula="True IL = (IL_{A→B} + IL_{B→A}) / 2"
          variables={[
            { name: 'IL_A→B', value: '3.42 dB', description: 'Insertion loss measured with light traveling from end A to end B' },
            { name: 'IL_B→A', value: '3.68 dB', description: 'Insertion loss measured with light traveling from end B to end A' },
          ]}
          steps={[
            'Sum the two readings: 3.42 dB + 3.68 dB = 7.10 dB',
            'Divide by 2: 7.10 dB / 2 = 3.55 dB',
            'Bidirectional average = 3.55 dB',
          ]}
          result="3.55 dB"
          sanityCheck="3.55 dB represents about 44% of the light being lost — approximately 0.56 mW remaining for every 1.00 mW launched. For a typical 2 km OSP feeder with 4 connectors and 2 splices, this is plausible. Values above 4–5 dB would suggest a dirty connector or problem splice."
        />
      </section>

      {/* ── ADVANCED ──────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-10">
        <h2>Acceptance Thresholds — What Passes</h2>
        <p className="mt-2">
          Two threshold frameworks apply on most OSP projects:
        </p>
        <ul className="list-disc ml-6 mt-3 text-sm text-slate-300/90 space-y-2">
          <li>
            <strong>TIA-568.3-D channel model</strong> [paywalled — confirm edition]: defines
            maximum channel insertion loss based on link length, connector count, and wavelength.
            Connector pair maximum: 0.75 dB general / 0.3 dB reference-grade. Splice maximum:
            0.3 dB. Cited via NECA/FOA 301-2016 §4 (public secondary).
          </li>
          <li>
            <strong>RUS 1753F-401 §5</strong>: fiber cable plant must show overall insertion
            loss within the design value, and all splices must measure ≤ 0.30 dB (bidirectional
            average) per OTDR. OLTS dual-wavelength required. See T12.L13 for the full acceptance
            threshold framework.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Book vs. field: reference method consistency</h3>
        <div className="rounded-xl border border-white/10 overflow-hidden mt-3">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Book (correct)</th>
                <th className="px-3 py-2 text-left">Field shortcut</th>
                <th className="px-3 py-2 text-left">Consequence</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Reference method locked at project start, documented in report</td>
                <td className="px-3 py-2">Tech switches from one-cord to two-cord halfway through because the far end can't reach with one cord</td>
                <td className="px-3 py-2">Half the readings include the near-end connector loss, half don't. Comparisons meaningless.</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Reference cord verified ≤0.10 dB before first measurement each day</td>
                <td className="px-3 py-2">Same reference cord used all week without cleaning</td>
                <td className="px-3 py-2">Progressive contamination inflates every reading; crew spends hours hunting "bad splices" that don't exist</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── QUIZ ──────────────────────────────────────────────────────────── */}
      <section data-tier="quiz" className="mt-10">
        <Quiz
          lessonId="T12.L02"
          questions={[
            {
              id: 'T12-L02-Q1',
              type: 'mc',
              question:
                'An OSP acceptance spec requires measurement of fiber-only loss (all splices included, both end-connectors excluded because they belong to carrier equipment). Which TIA-526-7A reference method applies?',
              choices: [
                'One-cord reference method',
                'Two-cord reference method',
                'Three-cord reference method',
                'Either one-cord or two-cord, depending on fiber length',
              ],
              correct: 2,
              explanation:
                'Three-cord reference method: launch cord + interconnect cord + receive cord are all mated during reference setup. This sets the zero to include two connector pairs, so the link measurement EXCLUDES both end connectors and captures only the fiber attenuation and splice losses. Per TIA-526-7A §7.',
            },
            {
              id: 'T12-L02-Q2',
              type: 'mc',
              question:
                'Before testing, a technician mates the launch and receive reference cords directly and reads 0.15 dB on the OLTS. The correct next step is:',
              choices: [
                'Zero out the 0.15 dB as the reference baseline and proceed with testing',
                'Clean the reference cord connectors again (or replace the cord) until the mated reading is ≤ 0.10 dB, then proceed',
                'Add 0.15 dB to the acceptance threshold to compensate for the reference cord loss',
                '0.15 dB is well within spec — proceed with testing immediately',
              ],
              correct: 1,
              explanation:
                '0.15 dB between reference cords indicates contamination. NECA/FOA 301-2016 §5 specifies reference cord verification should show ≤ 0.10 dB. Zeroing it out carries the contamination into every subsequent measurement. Clean or replace, then re-verify.',
            },
            {
              id: 'T12-L02-Q3',
              type: 'mc',
              question:
                'A technician measures a 4-mile singlemode feeder. A→B reads 4.82 dB; B→A reads 5.14 dB. What is the bidirectional average and what is the cause of the difference?',
              choices: [
                'Average = 4.98 dB; difference caused by Rayleigh backscatter building up over long spans',
                'Average = 4.98 dB; difference caused by directional variation (connector polish orientation or MFD mismatch asymmetry)',
                'Average = 9.96 dB; the readings must be summed, not averaged',
                'Average = 4.82 dB; B→A is discarded because A→B is the reference direction',
              ],
              correct: 1,
              explanation:
                'True IL = (4.82 + 5.14) / 2 = 9.96 / 2 = 4.98 dB. The 0.32 dB directional variation is caused by connector polish orientation asymmetry or MFD mismatch at splices — normal on a 4-mile span with several connectors. Bidirectional averaging eliminates this artifact.',
            },
          ]}
        />
      </section>

    </LessonLayout>
  );
}
