// T22 CFOT Lesson 4 — Testing & OTDR
// Field technician focus: OTDR operation, dead zone, acceptance criteria

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L04',
  course_id: 'T22',
  title: 'Testing & OTDR Acceptance',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T22.L02', 'T12.L01', 'T12.L05', 'T12.L06'],
  vocabulary_introduced: [
    'OTDR (Optical Time-Domain Reflectometer)',
    'dead zone',
    'backscatter coefficient',
    'acceptance test',
    'singlemode window (1310/1550 nm)',
    'insertion loss',
    'reflectance',
    'event',
    'passive test',
  ],
  vocabulary_assumed: [
    { term: 'attenuation', source_lesson_id: 'T02.L06' },
    { term: 'loss', source_lesson_id: 'T11.L02' },
    { term: 'OLTS', source_lesson_id: 'T12.L04' },
    { term: 'splice', source_lesson_id: 'T11.L02' },
    { term: 'connector', source_lesson_id: 'T02.L04' },
  ],
  estimated_minutes: 25,
  learning_objectives: [
    'Operate an OTDR to measure cable loss, identify splices, and detect faults',
    'Understand OTDR limitations (dead zone, backscatter, launch cable effects)',
    'Apply acceptance criteria for singlemode fiber links (typical: 0.2–0.3 dB/km + splice loss)',
    'Recognize common OTDR artifacts and distinguish real events from noise',
    'Document test results per contract specifications',
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L04_TestingOTDR() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          An OTDR is a specialized tool that tells you what's inside a fiber cable without
          cutting it open. You connect the OTDR to one end of the cable, press start, and the
          device sends a laser pulse down the fiber. The pulse bounces off splices, connectors,
          and the far end, coming back as echoes. The OTDR measures the time delay and strength
          of each echo to map out loss, distances, and faults.
        </p>

        <h3 className="mt-4 font-semibold">The OTDR Workflow</h3>
        <ol className="space-y-2 mt-2 text-sm text-slate-300/90 list-decimal pl-5">
          <li>
            <strong>Attach a launch cable.</strong> Connect a short (0.5–1 km) "sacrificial" fiber
            to the OTDR output. This launch cable protects the OTDR and extends the measurement dead zone
            away from any splices you care about. Always use a launch cable — never connect the OTDR
            directly to the customer's network.
          </li>
          <li>
            <strong>Select wavelength and pulse width.</strong> CFOT uses singlemode windows
            (1310 nm or 1550 nm). Longer pulse width = longer range but worse resolution.
            Shorter pulse = better resolution but shorter range. Start with 1550 nm for distance measurement.
          </li>
          <li>
            <strong>Press start and wait.</strong> The OTDR fires pulses and collects echoes
            for 5–30 seconds depending on distance and settings. A horizontal line appears on
            the screen showing the cable's loss profile.
          </li>
          <li>
            <strong>Read the trace.</strong> The OTDR display shows loss (vertical axis) vs. distance
            (horizontal axis). Drops in the line = losses (splices, connectors). The far-end reflection
            = the end of the cable or a break.
          </li>
        </ol>

        <h3 className="mt-4 font-semibold">OTDR Dead Zone and Launch Cable</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          The OTDR has a <strong>dead zone</strong> — a distance near the OTDR where reflections
          (from the first connector, first splice) are so strong they blind the receiver temporarily.
          Typical dead zone is 2–5 meters. This is why you use a <strong>launch cable</strong>:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-300/90">
          <li>Protects the OTDR from the first connector's reflection</li>
          <li>Extends the measurement dead zone away from the cable-under-test</li>
          <li>Allows you to see the first splice/event in the customer's cable clearly</li>
        </ul>

        <div className="mt-3 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg">
          <p className="font-semibold text-amber-300 text-sm">Pro tip</p>
          <p className="text-slate-300/90 text-sm">
            Always measure from BOTH ends. Dead zone effects are different at each end due to
            reflection strength differences. Measuring both directions catches faults that one
            direction might hide.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Reading an OTDR Trace</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          A typical OTDR display shows a mostly horizontal line (the cable) with downward steps
          (splices/connectors) and a final reflection (far end). Here's what to look for:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Feature</th>
              <th className="px-3 py-2 text-left">What it means</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Smooth downward slope</td>
              <td className="px-3 py-2">Fiber attenuation loss over distance (typical: 0.2–0.3 dB/km at 1550 nm)</td>
              <td className="px-3 py-2">Normal — compare to link budget</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Downward step (0.1–0.3 dB)</td>
              <td className="px-3 py-2">Fusion splice at this distance</td>
              <td className="px-3 py-2">Good — verify distance label matches splice location; if step &gt; 0.2 dB, investigate</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Downward step (0.3–1.0 dB)</td>
              <td className="px-3 py-2">Connector or bad splice</td>
              <td className="px-3 py-2">Check — is this intentional (termination)? If in the middle, it's a problem splice</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Upward spike (reflectance)</td>
              <td className="px-3 py-2">Connector with Fresnel reflection (unspliced end or mechanical splice)</td>
              <td className="px-3 py-2">Expected at far end; unexpected in the middle = find the reflector</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Jagged noise in the middle</td>
              <td className="px-3 py-2">Measurement noise from short pulse width or high loss section</td>
              <td className="px-3 py-2">Try a longer pulse width for cleaner trace; if noise persists, cable may be degraded</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">No far-end reflection (flat line)</td>
              <td className="px-3 py-2">Open circuit (broken cable)</td>
              <td className="px-3 py-2">STOP — locate the break</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>OTDR Acceptance Criteria</h2>
        <p>
          CFOT exam typically references acceptance criteria from TIA-526 (OTDR measurement standard)
          and contract specifications. For singlemode fiber:
        </p>

        <table className="w-full text-sm border border-white/10 rounded-lg mt-3">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Criterion</th>
              <th className="px-3 py-2 text-left">Typical spec</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Fiber attenuation (1550 nm)</td>
              <td className="px-3 py-2">&lt; 0.25 dB/km (G.652 spec)</td>
              <td className="px-3 py-2">Actual fiber type may vary; check contract</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Splice loss</td>
              <td className="px-3 py-2">&lt; 0.1–0.2 dB per splice (depends on contract)</td>
              <td className="px-3 py-2">Fusion splices should be &lt; 0.1 dB; higher losses rejected</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Total link loss</td>
              <td className="px-3 py-2">Calculated from link budget</td>
              <td className="px-3 py-2">Length × attenuation + splice losses + margin ≤ available power</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">No reflective events (ideal)</td>
              <td className="px-3 py-2">Fusion splices only (no reflectors at 1550 nm)</td>
              <td className="px-3 py-2">Unexpected connector reflections = problem</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Two-Direction Testing</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Always measure from both ends. The two OTDR traces may show different results because:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Dead zone effects are different (varies with connector quality)</li>
          <li>Splices may show different loss from different directions</li>
          <li>Localized fiber damage (micro-cracks) may reflect more strongly one direction than the other</li>
        </ul>
        <p className="text-sm text-slate-300/90 mt-2">
          If one direction shows high loss at a location and the other doesn't, it's likely a bent or kinked
          section that's directionally sensitive. Straighten the cable and re-measure.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced OTDR Artifacts and Troubleshooting</h2>

        <h3 className="font-semibold">Backscatter and Coherent Detection</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          OTDR works by measuring <strong>backscatter</strong> — light scattered backward by the fiber
          itself and reflections from splices. The OTDR's display is built on a characteristic backscatter
          coefficient per fiber type (single-mode G.652, G.655, etc.). If you measure a different fiber
          type than expected, the backscatter profile changes and the loss readings may appear high even
          if the fiber is good.
        </p>
        <p className="text-sm text-slate-300/90 mt-2">
          <strong>Coherent detection</strong> OTDRs use phase-sensitive measurements to extract more
          information and reduce noise — these are better for long-distance rural links but overkill for
          typical CFOT field use. Standard <strong>direct-detection</strong> OTDRs are the field standard.
        </p>

        <h3 className="mt-4 font-semibold">When OTDR Lies: Launch Condition Effects</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          The first 500 meters of an OTDR trace can be misleading if the launch cable connector or the
          cable-under-test connector is dirty or misaligned. A bad connection causes a "launch condition
          error" — the OTDR appears to show high loss at the start. Fix: clean both connectors with
          isopropyl alcohol and a lens wipe, reinsert, and re-measure.
        </p>

        <h3 className="mt-4 font-semibold">Fusion Splice Anomalies</h3>
        <p className="text-sm text-slate-300/90 mt-2">
          Some fusion splices show a <strong>dip</strong> in the OTDR trace (temporary low loss, then
          back to normal). This is the <strong>ghosts</strong> effect — reflections from the two fiber
          ends inside the fusion zone creating constructive/destructive interference. It's an artifact,
          not a real loss. To confirm: measure from the other direction or use a different wavelength
          (1310 nm vs. 1550 nm). Real splices will show consistent loss from both directions.
        </p>
      </section>

      {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T22-L04"
        cards={[
          { id: 'T22-L04-FC-1', front: 'OTDR', back: 'Optical Time-Domain Reflectometer. A tool that measures fiber loss, splice locations, and faults by sending laser pulses down the cable and measuring the echoes that bounce back.' },
          { id: 'T22-L04-FC-2', front: 'Launch cable', back: 'A short (0.5–1 km) sacrificial fiber connected to the OTDR input to protect the OTDR and extend the dead zone away from the cable-under-test.' },
          { id: 'T22-L04-FC-3', front: 'Dead zone', back: 'A distance near the OTDR (typically 2–5 meters) where reflections are so strong they blind the receiver. The dead zone prevents accurate measurement of the first splice or event.' },
          { id: 'T22-L04-FC-4', front: 'Backscatter', back: 'Light scattered backward by fiber and reflections from splices. OTDR measures backscatter to build a loss profile. Different fiber types have different backscatter coefficients.' },
          { id: 'T22-L04-FC-5', front: 'Acceptance test', back: 'Measurement performed after cable installation to verify the link meets contract specifications (loss, distance, no faults).' },
          { id: 'T22-L04-FC-6', front: 'Singlemode window (1310/1550 nm)', back: 'The two transmission windows used in singlemode fiber networks. 1310 nm has lower loss; 1550 nm has higher power available. OTDR measurements use one or both.' },
          { id: 'T22-L04-FC-7', front: 'Insertion loss', back: 'The total loss of a splice or connector measured by OTDR (typically 0.1–0.3 dB for a fusion splice).' },
          { id: 'T22-L04-FC-8', front: 'Reflectance', back: 'The amount of light reflected backward from a connector or mechanical splice (measured in dB). Unmatched connectors reflect strongly; fusion splices do not.' },
          { id: 'T22-L04-FC-9', front: 'Event', back: 'Any location on the OTDR trace that shows loss or reflection — typically a splice, connector, or fault.' },
          { id: 'T22-L04-FC-10', front: 'Passive test', back: 'A test that measures a cable without introducing signal into the network (OTDR is passive). Contrast with active testing (putting live traffic through the link).' },
        ]}
      />

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <Quiz
        title="T22.L04 Check — Testing & OTDR"
        mode="multiple-choice"
        questions={[
          {
            id: 'T22-L04-Q1',
            type: 'mc',
            prompt:
              'You connect an OTDR directly to a customer\'s fiber network (no launch cable). The OTDR display shows a jagged trace for the first 500 meters. What is the most likely explanation?',
            choices: [
              'The fiber is damaged and must be replaced',
              'The OTDR is broken and needs recalibration',
              'The dead zone from the OTDR output connector is blinding the receiver at the start, making the first 500 meters of trace unreliable',
              'The customer\'s network is carrying live traffic and interfering with the OTDR',
            ],
            answerIndex: 2,
            explanation:
              'This is why launch cables are mandatory. Without a launch cable, the OTDR\'s dead zone (2–5 m) extends into the customer\'s cable, corrupting the first part of the trace. A launch cable pushes the dead zone past the first splice or event.',
          },
          {
            id: 'T22-L04-Q2',
            type: 'mc',
            prompt:
              'An OTDR measurement at 1550 nm shows a fusion splice with 0.08 dB insertion loss. Is this acceptable?',
            choices: [
              'No — loss should be under 0.05 dB for singlemode',
              'Yes — 0.08 dB is well within the 0.1–0.2 dB acceptance range',
              'No — 0.08 dB indicates a bad splice that needs re-doing',
              'Yes — but only if measured from both directions',
            ],
            answerIndex: 1,
            explanation:
              '0.08 dB is an excellent fusion splice. Typical specs allow 0.1–0.2 dB per splice. Anything under 0.1 dB is premium work.',
          },
          {
            id: 'T22-L04-Q3',
            type: 'fill-in-blank',
            prompt:
              'The OTDR dead zone is typically ____ meters and requires a(n) ____ cable to extend it away from the customer\'s cable.',
            answer: '2-5 launch',
            answerDisplay: '2–5 meters and launch cable',
            explanation:
              'Dead zone distance varies by OTDR model (typically 2–5 m). A launch cable (0.5–1 km) extends the dead zone safely past the first events in the customer network.',
          },
          {
            id: 'T22-L04-Q4',
            type: 'mc',
            prompt:
              'You measure a cable with OTDR from direction A and see a 0.3 dB event at 5 km. You measure from direction B and see no loss at that location. What is the most likely explanation?',
            choices: [
              'The cable is broken between the two measurement directions',
              'The event is directionally sensitive — possibly a tight bend or micro-crack that reflects more strongly one direction',
              'The OTDR at direction B is broken',
              'The cable is coiled and the 5 km location is physically different from each end',
            ],
            answerIndex: 1,
            explanation:
              'Directional sensitivity in loss indicates a localized physical issue (bend, crack, contamination) that scatters light more strongly in one direction. The next step: find the tight bend and straighten it, then re-measure.',
          },
          {
            id: 'T22-L04-Q5',
            type: 'mc',
            prompt:
              'You measure the first 500 meters of the OTDR trace and see multiple small downward steps. These are consistent with what phenomenon?',
            choices: [
              'Fiber attenuation loss over distance',
              'Multiple fusion splices in the first 500 meters',
              'The OTDR dead zone causing measurement artifacts',
              'Loose connectors that are intermittently breaking the link',
            ],
            answerIndex: 1,
            explanation:
              'Each downward step is an event (splice, connector, or fault). Multiple steps in 500 m means multiple splices in that section, each with its own insertion loss.',
          },
        ]}
      />

    </LessonLayout>
  );
}
