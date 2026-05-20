// T12.L04 — Dead Zones: EDZ and ADZ
// Working lesson: event dead zone, attenuation dead zone, launch cable sizing, ghost reflections
// Source: EXFO AN296 | EXFO AN298 | Fluke Networks KB | Corning WP1281

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L04',
  course_id: 'T12',
  title: 'Dead Zones — EDZ and ADZ',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T12.L01', 'T12.L03'],
  learning_objectives: [
    'Define EDZ and ADZ and explain the physical mechanism that creates each',
    'Calculate minimum launch cable length for a given pulse width',
    'Explain why the first connector on a link is measured with a launch cable, not directly',
    'Describe what a ghost reflection is and how to identify one',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'EDZ',
    'ADZ',
    'launch cable',
    'receive cable',
    'ghost reflection',
  ],
  vocabulary_assumed: [
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
    { term: 'pulse width', source_lesson_id: 'T12.L03' },
    { term: 'Rayleigh backscatter', source_lesson_id: 'T12.L03' },
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
  ],
  key_terms: [
    {
      term: 'EDZ',
      definition:
        'The minimum distance after a reflective event (connector or mechanical splice) within which the OTDR cannot detect a second distinct event. Defined as the distance from the start of a reflection peak to the point where the trace recovers to within 0.5 dB of the backscatter baseline. Typically 1–5 m for singlemode with narrow pulses.',
    },
    {
      term: 'ADZ',
      definition:
        'The minimum distance after a reflective event within which the OTDR cannot accurately measure loss — because the trace has not settled flat enough to run a valid backscatter fit. Larger than the EDZ. Defined as the distance from the start of a reflection peak to where the trace returns to within 0.5 dB of undisturbed backscatter. Typically 3–10 m for singlemode at narrow pulse widths; scales roughly linearly with pulse width.',
    },
    {
      term: 'launch cable',
      definition:
        'A known-good fiber jumper (or reel) connected between the OTDR port and the fiber under test. Its purpose is to push the first connector of the link under test beyond the OTDR\'s dead zone so that loss and reflectance at that connector can be measured. Minimum length depends on pulse width and required dead-zone clearance.',
    },
    {
      term: 'receive cable',
      definition:
        'A known-good fiber jumper connected to the far end of the span, allowing the OTDR to measure the far-end connector loss and verify the final splice or termination. Also called a "tail cable." Without a receive cable, the far-end connector reflection buries the final few meters of usable trace.',
    },
    {
      term: 'ghost reflection',
      definition:
        'A spurious peak on the OTDR trace that appears at a distance equal to a multiple of the round-trip distance to a real, high-reflectance event. Caused by light bouncing back and forth between two highly reflective points (air-gap connectors, broken end-faces). Identified because a ghost shows NO loss step (the trace baseline continues unchanged) and its distance is always a whole multiple of the primary reflector distance.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L04_DeadZones() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Why the OTDR Goes Blind Right After a Reflection</h2>

        <p>
          When light hits a connector end-face or any air gap, a burst of energy reflects straight back
          into the OTDR. That burst is far stronger than the quiet Rayleigh backscatter the OTDR is
          trying to measure. Think of it like a camera flash going off in a dark room — for a fraction
          of a second after the flash, your eyes can't see the dim objects that were perfectly visible
          before. The OTDR's receiver is the same: the burst of reflected light saturates (overwhelms)
          the detector, and the receiver needs some time to recover.
        </p>

        <p>
          During that recovery period, the OTDR is blind. Whatever is within that blind distance —
          another connector, a splice, a bend — the OTDR either can't see it at all, or can't measure
          it accurately. This blind region has two distinct flavors: the <strong>Event Dead Zone
          (EDZ)</strong> and the <strong>Attenuation Dead Zone (ADZ)</strong>.
        </p>

        <div className="mt-4 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-2">Refresher: Prerequisites for this lesson</p>
          <ul className="text-slate-300/90 space-y-1 list-disc pl-5">
            <li><strong>OTDR:</strong> The instrument that sends a pulse and measures distance-to-events (from T12.L01)</li>
            <li><strong>Pulse width:</strong> Controls the tradeoff between range and event resolution (from T12.L03)</li>
            <li><strong>Rayleigh backscatter:</strong> The continuous scattering that creates the normal OTDR trace slope (from T12.L03)</li>
            <li><strong>Reflection vs. loss event:</strong> Connectors cause reflections; splices cause loss steps (from T12.L02)</li>
          </ul>
        </div>

          <h3>EDZ vs. ADZ — the key difference</h3>
        <p>
          The <strong>EDZ</strong> is the shorter one. Within the EDZ, the OTDR cannot even
          <em> detect</em> a second event — if there's a splice 2 m after a connector, the OTDR won't
          show it at all. The Telcordia definition: the EDZ ends where the trace returns to within
          0.5 dB of the undisturbed backscatter slope going into the event.
        </p>
        <p>
          The <strong>ADZ</strong> is longer. Within the ADZ, the OTDR can see that something
          happened, but it can't accurately <em>measure</em> the loss because the trace hasn't settled
          flat enough for a reliable backscatter slope fit. The ADZ uses the same ±0.5 dB criterion,
          but the trace takes longer to settle because of the exponential ring-down of the reflection.
          The ADZ is the more practical limit — it defines where you can start trusting loss measurements
          again.
        </p>

        <p>
          <strong>Rule of thumb for singlemode at narrow pulses (5–30 ns):</strong>
        </p>
        <ul>
          <li>EDZ: ≈ 0.5–2 m (narrow-pulse sub-range; full EDZ range across all pulse widths: 1–5 m)</li>
          <li>ADZ: ≈ 3–8 m (narrow-pulse sub-range; full ADZ range across all pulse widths: 3–10 m)</li>
        </ul>
        <p>
          Both scale roughly linearly with pulse width. A 1 µs pulse may produce an ADZ of 50–100 m.
          A 10 µs pulse needed for long-haul can produce an ADZ of 500 m or more.
        </p>

        <p className="text-slate-400 text-sm mb-3 mt-6 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T12.L03 OTDR Fundamentals</strong> — pulse width is the lever that controls dead zone size. Longer pulses create bigger dead zones. Understanding EDZ and ADZ explains why pulse width selection is one of the most critical OTDR setup decisions.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>Launch Cables — Pushing the First Connector Beyond the Dead Zone</h2>

        <p>
          Every OTDR port has its own connector — typically a ceramic ferrule mated to the fiber
          under test. That very first mated connection creates a reflection that kicks off dead zones
          right at distance zero. Without a launch cable, the first 3–100 m of the span (depending on
          pulse width) is blind. You can't measure the loss or reflectance of the first connector on
          the link.
        </p>
        <p>
          The fix is a <strong>launch cable</strong> (also called a launch reel or launch fiber):
          a known-good fiber jumper inserted between the OTDR port and the fiber under test. The launch
          cable pushes the first connector of the link beyond the ADZ of the OTDR's own port connector.
          Now the OTDR can measure that first in-line connector accurately.
        </p>

        <h3>Minimum launch cable length by pulse width</h3>
        <p>
          The ADZ grows with pulse width. Practical minimum launch cable lengths per application class
          (per EXFO AN298 and field practice):
        </p>
        <table>
          <thead>
            <tr><th>Pulse width</th><th>Typical application</th><th>Min. launch cable</th></tr>
          </thead>
          <tbody>
            <tr><td>5–30 ns</td><td>Short premises links ≤500 m</td><td>≥ 150 m</td></tr>
            <tr><td>100–500 ns</td><td>Campus / access ≤10 km</td><td>≥ 500 m</td></tr>
            <tr><td>1–3 µs</td><td>Metro OSP 10–40 km</td><td>≥ 1,000 m (1 km)</td></tr>
            <tr><td>10–20 µs</td><td>Long-haul DWDM &gt; 40 km</td><td>≥ 2,500 m (2.5 km)</td></tr>
          </tbody>
        </table>
        <p>
          <strong>Field note:</strong> Many techs carry a 300 m reel ("launch reel") and call it a day
          for metro work. That's marginal at 1 µs — you want 1 km or better for any span over
          10 km. Undersized launch cable means the first connector loss is under-read or invisible.
          On a RUS build where the contractor splice-tested at fiber acceptance, your first splice
          might actually be a connector — and it must appear clearly on the trace.
        </p>

        <WorkedExample
          title="Minimum launch cable length for a 500 ns pulse"
          formula="ADZ ≈ pulse_width_ns × 0.10 m/ns (conservative upper bound for singlemode)"
          variables={[
            { symbol: 'pulse_width_ns', label: 'Pulse width', value: 500, unit: 'ns' },
            { symbol: 'factor', label: 'ADZ factor (conservative)', value: 0.10, unit: 'm/ns' },
          ]}
          steps={[
            'ADZ ≈ 500 ns × 0.10 m/ns = 50 m  (theoretical minimum — just clears the ADZ)',
            'Practical minimum with 10× safety margin: 50 m × 10 = 500 m',
            'Use a 500 m launch reel for this pulse width class.',
          ]}
          answer="≥ 500 m launch cable"
          sanityCheck="The formula gives the theoretical ADZ minimum — 50 m is just enough fiber to move the first connector past the dead zone under ideal conditions. The recommended launch cable in the table (≥ 500 m) is 10× that value, which is the real-world standard. The extra length provides margin for connector reflectance variation, ensures multiple averaging passes have clean dynamic range over the event, and accounts for the fact that a dirty or slightly misaligned launch connector can push the ADZ further than the theoretical value. The formula tells you the floor; the table tells you what to carry in the truck."
        />

        <h3>Receive cable — measuring the far-end connector</h3>
        <p>
          The far-end connector of the span also produces a large reflection that buries the last few
          meters of trace. A <strong>receive cable</strong> on the far end lets the OTDR see the final
          connector cleanly — the link's last connector appears as an event on the receive cable portion
          of the trace, not at the very edge of the OTDR's range.
        </p>
        <p>
          Minimum receive cable = same as launch cable for the pulse width being used. For most OSP
          measurements, 150–300 m is adequate. If you're documenting the far-end connection loss for
          an acceptance test (required on RUS builds), a receive cable is not optional.
        </p>

        <h3 className="mt-5 font-semibold">OTDR Dead-Zone Calculator</h3>
        <p className="text-sm mt-2">
          Use this calculator to determine the minimum launch cable length for your pulse width,
          and verify that your cable reel clears the Attenuation Dead Zone:
        </p>

        <WorkedExample
          title="Estimate ADZ and minimum launch cable length"
          formula="ADZ ≈ pulse_width_ns × 0.10 m/ns; min_launch_cable ≈ ADZ × 10 (real-world safety margin)"
          variables={[
            {
              symbol: 'pulse_width_ns',
              label: 'Pulse width (enter your OTDR setting)',
              value: 100,
              unit: 'ns',
              help: 'Typical values: 5–30 ns (short), 100–500 ns (campus), 1000–3000 ns (metro), 10000–20000 ns (long-haul)'
            },
          ]}
          steps={[
            'Step 1: Estimate the Attenuation Dead Zone (conservative, single-wavelength singlemode): ADZ ≈ pulse_width_ns × 0.10 m/ns',
            'Step 2: Multiply ADZ by 10× for real-world safety margin (accounts for connector reflectance variation, trace settling, alignment tolerance)',
            'Step 3: Round UP to the nearest standard reel size you carry (100 m, 150 m, 300 m, 500 m, 1000 m, 2500 m)',
          ]}
          answer="Minimum launch cable (with safety margin)"
          sanityCheck="The 0.10 m/ns factor is a conservative upper bound for singlemode based on empirical IEC 61746 data. Narrower pulses (5–30 ns) produce ADZ ≈ 0.5–2 m; wider pulses (1–10 µs) produce ADZ ≈ 50–100 m. The 10× multiplier ensures that: (a) connector reflectance jitter doesn't push you back into the ADZ if the OTDR's receiver is slightly more sluggish than specified, (b) you have enough dynamic range for multiple averaging passes on the first connector event, and (c) you can consistently measure the first connector loss to ±0.3 dB, which is the OSP acceptance spec. Using a smaller launch cable means guessing whether the first connector loss is real or buried in the dead zone — unacceptable for RUS or TIA acceptance testing."
        />

        <div className="mt-4 p-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Field Checklist</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300/90">
            <li><strong>Short premises runs (&lt;500 m, 5–30 ns pulse):</strong> Minimum 150 m launch cable</li>
            <li><strong>Campus / access (≤10 km, 100–500 ns pulse):</strong> Minimum 500 m launch cable</li>
            <li><strong>Metro OSP (10–40 km, 1–3 µs pulse):</strong> Minimum 1 km (1,000 m) launch cable</li>
            <li><strong>Long-haul (&gt;40 km, 10–20 µs pulse):</strong> Minimum 2.5 km launch cable</li>
          </ul>
        </div>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Ghost Reflections — How to Identify the Imposters</h2>

        <p>
          Occasionally an OTDR trace shows a sharp reflection peak that doesn't correspond to any
          physical connector or splice. These are <strong>ghost reflections</strong> (also called
          phantom events). They're caused by multiple reflections bouncing between two
          high-reflectance surfaces — typically two air-gap connectors or a broken end-face.
        </p>
        <p>
          Here's the mechanism: light from the OTDR reflects off Connector A back toward the OTDR.
          Some of that reflected light hits the OTDR port connector (Connector B, another high-reflectance
          surface), bounces forward again, reflects off Connector A a second time, and finally returns
          to the OTDR. The OTDR interprets this as if there were a third event at double the distance
          of Connector A.
        </p>

        <h3>Ghost identification rules</h3>
        <ol>
          <li>
            <strong>Distance = whole multiple of the real reflector.</strong> If Connector A is at
            100 m, the ghost appears at 200 m. A second ghost may appear at 300 m. If the suspicious
            peak isn't at a clean multiple of a prior event, it might be a real event.
          </li>
          <li>
            <strong>No loss step at the ghost.</strong> A real splice or connector causes the
            backscatter level after the event to drop (step-down). A ghost has zero loss — the
            backscatter trace continues at exactly the same level on both sides of the ghost peak.
            Check the trace just before and just after the peak: identical slope, identical level =
            ghost.
          </li>
          <li>
            <strong>Amplitude may be lower than the real event.</strong> Each round-trip through the
            fiber loses energy. Ghosts are usually weaker than the primary reflector. If a peak is
            stronger than the event it supposedly echoes, it's not a ghost — it's a real event with
            a real reflector.
          </li>
          <li>
            <strong>Only at high-reflectance events.</strong> Ghosts are generated by air-gap connectors
            (reflectance −14 to −35 dB). Low-reflectance connectors (APC, −60 to −65 dB) virtually
            never generate visible ghosts. If you're seeing ghosts, clean or replace the offending
            connector.
          </li>
        </ol>

        <h3>Ghost distance formula</h3>
        <p>
          Ghost distance = (n + 1) × D, where D = distance from OTDR port to the primary reflector,
          and n = 1, 2, 3... (the ghost number).
        </p>
        <ul>
          <li>1st ghost (n = 1): (1 + 1) × D = <strong>2 × D</strong></li>
          <li>2nd ghost (n = 2): (2 + 1) × D = <strong>3 × D</strong></li>
          <li>3rd ghost (n = 3): (3 + 1) × D = <strong>4 × D</strong></li>
        </ul>
        <p>
          Example: OTDR port connector at 0 m, Connector A at 120 m.
          Ghost 1 = 2 × 120 m = <strong>240 m</strong>. Ghost 2 = 3 × 120 m = <strong>360 m</strong>.
          Ghost 3 = 4 × 120 m = 480 m (if reflectance is high enough).
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L04-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'Which dead zone is larger — EDZ or ADZ?',
              options: [
                { id: 'a', text: 'EDZ — it includes the full reflection ring-down period' },
                { id: 'b', text: 'ADZ — the trace must settle flat before loss can be measured accurately' },
                { id: 'c', text: 'They are always equal in length' },
                { id: 'd', text: 'It depends on whether the event is a connector or a splice' },
              ],
              correct: 'b',
              explanation: 'The ADZ is always larger than the EDZ. The EDZ ends when the OTDR can detect a second event (trace within 0.5 dB of baseline). The ADZ ends when loss measurements become reliable — requiring a flatter trace, which takes longer after a large reflection.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'You are testing a 30 km metro OSP span using a 2 µs pulse width. What is the minimum recommended launch cable length?',
              options: [
                { id: 'a', text: '150 m — standard reel used for all pulse widths' },
                { id: 'b', text: '300 m — adequate for metro work' },
                { id: 'c', text: '500 m — minimum for 100–500 ns pulses, also covers 1–3 µs' },
                { id: 'd', text: '1,000 m — minimum for 1–3 µs pulses used on 10–40 km spans' },
              ],
              correct: 'd',
              explanation: 'A 2 µs pulse (in the 1–3 µs class) requires a launch cable of at least 1 km. The ADZ at 2 µs is roughly 200 m, and the practical minimum includes a safety margin well beyond the raw ADZ calculation. A 150 m or 300 m reel would leave the first connector buried in the dead zone.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'An OTDR trace shows a sharp reflection peak at 500 m. You verify there is no connector or splice at 500 m. The trace level before and after the peak is identical — no step-down. The actual first connector is at 250 m. What is most likely happening?',
              options: [
                { id: 'a', text: 'There is a real reflective event at 500 m that was missed during installation' },
                { id: 'b', text: 'The OTDR IOR is set incorrectly, placing the connector in the wrong position' },
                { id: 'c', text: 'This is a ghost reflection — the 250 m connector is generating a phantom at 2 × 250 m = 500 m' },
                { id: 'd', text: 'The receive cable end-face is reflecting back and appearing at 500 m' },
              ],
              correct: 'c',
              explanation: 'No loss step (trace level unchanged) + distance equals 2× a real reflector distance = classic ghost reflection signature. The high-reflectance connector at 250 m is bouncing energy between itself and the OTDR port, creating a phantom peak at 2 × 250 m = 500 m. No physical event exists there.',
            },
            {
              id: 'q4',
              type: 'drag-match',
              text: 'Match each dead zone type to its correct definition.',
              pairs: [
                { left: 'EDZ', right: 'Distance after a reflector within which the OTDR cannot detect a second distinct event' },
                { left: 'ADZ', right: 'Distance after a reflector within which the OTDR cannot accurately measure loss' },
                { left: 'Launch cable', right: 'Known-good fiber used to push the first link connector beyond the OTDR\'s dead zone' },
                { left: 'Ghost reflection', right: 'Spurious peak at a whole-multiple of a real reflector\'s distance, with no loss step' },
              ],
            },
          ]}
        />
      </section>

      {/* ── FLASHCARDS ── */}
      <section data-tier="flashcards">
        <h2>Key Terms</h2>
        {meta.key_terms.map((kt) => (
          <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
        ))}
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Dead zones exist precisely because of the pulse-propagation physics explained in <strong>T12.L03 OTDR Fundamentals</strong> — the OTDR cannot measure what happens at distances shorter than its pulse width allows. This lesson explains what you CANNOT see with the OTDR and why. Your launch cable choice (from <strong>T01.L08 Launch and Receive Cable Selection</strong>) directly affects the EDZ length because the OTDR's dead zone starts where the light source's reflective signature ends. Understanding both the instrument limitations (this lesson) and the upstream physical constraints (T12.L03 + T01.L08) prevents you from making OTDR conclusions that ignore hidden defects in the EDZ — the unseen zone where splices and macrobends can hide.
        </p>
      </section>
    </LessonLayout>
  );
}
