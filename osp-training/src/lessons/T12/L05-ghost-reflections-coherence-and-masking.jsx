// T12.L05 — Ghost Reflections, Coherence, and Source Masking
// Working lesson: coherence length, multiple-reflection ghosts, source masking, identification
// Source: EXFO AN194 | VIAVI OTDR Reference Guide | Fluke Networks Application Notes

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L05',
  course_id: 'T12',
  title: 'Ghost Reflections — Coherence, Masking, and Source Interference',
  order: 5,
  lesson_type: 'working',
  prerequisites: ['T12.L04'],
  learning_objectives: [
    'Explain what coherence length means and how it causes source-coherence interference peaks',
    'Distinguish multiple-reflection ghosts from coherence-artifact peaks',
    'Describe how a strong reflection can mask events behind it (source masking)',
    'Apply the three-test ghost identification checklist to a trace anomaly',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'coherence length',
    'source-coherence peak',
    'source masking',
    'reflection masking',
  ],
  vocabulary_assumed: [
    { term: 'ghost reflection', source_lesson_id: 'T12.L04' },
    { term: 'EDZ', source_lesson_id: 'T12.L04' },
    { term: 'ADZ', source_lesson_id: 'T12.L04' },
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
    { term: 'Rayleigh backscatter', source_lesson_id: 'T12.L03' },
  ],
  key_terms: [
    {
      term: 'coherence length',
      definition:
        'The maximum path-length difference over which a laser source can produce coherent interference. For a typical OTDR laser source (narrow linewidth), coherence length can be hundreds of meters to several kilometers. When two reflected signals travel paths that differ by exactly a whole multiple of the coherence length, they add constructively, creating a false peak on the trace.',
    },
    {
      term: 'source-coherence peak',
      definition:
        'A false peak on the OTDR trace caused by constructive interference between two reflected signals whose path-length difference is a multiple of the laser coherence length. Unlike a multiple-reflection ghost (which obeys the 2× distance rule), a coherence peak may appear at irregular spacing and typically disappears when the OTDR laser wavelength is shifted by even a small amount (e.g., by slightly warming or cooling the source).',
    },
    {
      term: 'source masking',
      definition:
        'A condition where a strong reflection saturates the OTDR receiver so completely that all events within the dead zone behind it are invisible — even events that would normally be detectable. Also called "reflection masking" or "event masking." The primary defense is a lower-reflectance launch connector (APC, −60 dB) to reduce the initial blast, or a shorter pulse width to reduce dead zone extent.',
    },
    {
      term: 'reflection masking',
      definition:
        'Synonym for source masking. A strong, highly reflective event prevents accurate characterization of subsequent events within its dead zone. Can cause entire connectors or splices to disappear from the trace if they fall inside the masked region.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L05_GhostReflections() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Two Types of False Peaks: Multiple-Reflection Ghosts vs. Coherence Artifacts</h2>

        <p>
          In Lesson L04 you learned about multiple-reflection ghosts — spurious peaks at exact
          multiples of a real reflector's distance, caused by light bouncing back and forth between
          two highly-reflective surfaces. Those ghosts follow a predictable distance rule (2×, 3×, etc.)
          and show no loss step.
        </p>
        <p>
          There's a second, less common type of false peak: the <strong>source-coherence peak</strong>.
          It's created by a completely different mechanism — laser interference rather than multiple
          bounces. To understand it, you need to know what <em>coherence length</em> means.
        </p>

        <h3>Coherence length in plain language</h3>
        <p>
          Every laser produces light that oscillates at a very precise frequency — far more precise than
          an LED or white light source. But "very precise" doesn't mean perfect. The laser's wavelength
          wanders slightly over time. The <strong>coherence length</strong> is the maximum
          path-length difference between two copies of the same laser pulse over which they can still
          interfere with each other constructively or destructively.
        </p>
        <p>
          Think of two tuning forks vibrating at almost identical frequencies. If you strike them at
          the same time, they beat in and out of phase — sometimes reinforcing each other (louder),
          sometimes canceling (quieter). The coherence length is essentially how far apart the forks can
          be before they lose sync entirely and no longer reinforce.
        </p>
        <p>
          For OTDR laser sources, coherence lengths typically range from a few hundred meters to several
          kilometers. When a reflected signal arrives back at the receiver at a delay that corresponds to
          a path difference equal to the coherence length, it can interfere constructively with the
          backscatter signal the OTDR is measuring — creating a false bump in the trace.
        </p>

        <h3>How to tell a coherence peak from a multiple-reflection ghost</h3>
        <p>
          Both appear as unexpected peaks. Three distinguishing tests:
        </p>
        <ol>
          <li>
            <strong>Distance rule:</strong> A multiple-reflection ghost is always at a whole multiple
            (2×, 3×...) of a known reflective event. A coherence peak has no such predictable spacing.
          </li>
          <li>
            <strong>Temperature/wavelength sensitivity:</strong> A coherence peak will shift or disappear
            when the OTDR laser warms up or cools down (wavelength shifts slightly). A multiple-reflection
            ghost stays put.
          </li>
          <li>
            <strong>Loss step:</strong> Neither type has a true loss step. Both show the trace continuing
            at the same level after the peak. This distinguishes both from real events.
          </li>
        </ol>

        <p className="text-slate-400 text-sm mb-3 mt-6 p-3 border-l-4 border-slate-500">
          <strong>Callback:</strong> Recall from <strong>T12.L04 Dead Zones</strong> — high reflectance is what creates dead zones in the first place. Ghost reflections and coherence peaks are phenomena that occur in high-reflectance environments. Understanding dead zones teaches you why these artifacts appear.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>Source Masking — When a Strong Reflection Hides Everything Behind It</h2>

        <p>
          A standard multiple-reflection ghost is a nuisance — a false peak that needs to be
          explained away. But <strong>source masking</strong> (also called reflection masking) is
          more dangerous: it doesn't add something fake, it hides something real.
        </p>
        <p>
          Here's what happens. When the OTDR fires a pulse and a very high-reflectance event
          (an air-gap connector, a broken end-face, or a polished PC connector with heavy contamination)
          reflects a massive burst of light back, the OTDR receiver is completely saturated. Not just
          inside the dead zone — beyond the dead zone too, the recovery can be so slow that events
          several meters behind the masking reflector become invisible or appear with wildly incorrect
          loss values.
        </p>
        <p>
          The practical risk: a strong UPC connector at the head of a span might mask the first
          fusion splice 15 m away. You'd see only the connector's reflection and then a clean-looking
          backscatter slope — and you'd never know the splice had a problem. On a RUS acceptance test,
          this would result in a false pass.
        </p>

        <h3>How to deal with source masking</h3>
        <ol>
          <li>
            <strong>Use APC connectors where possible.</strong> APC connectors (8° angled end-face)
            reflect only −60 to −65 dB, compared to −45 to −55 dB for a clean UPC. The lower
            the reflectance, the smaller the dead zone and the less likely masking occurs.
          </li>
          <li>
            <strong>Clean the offending connector.</strong> A contaminated UPC connector can degrade
            from its clean −45 to −55 dB spec down to −14 to −30 dB reflectance. Clean it and the
            masking shrinks dramatically.
          </li>
          <li>
            <strong>Use a shorter pulse width.</strong> Shorter pulse → shorter dead zone → less
            masked region. Trade-off: less range. For a short-span acceptance test where masking
            is the concern, a 5–10 ns pulse is appropriate.
          </li>
          <li>
            <strong>Test from the other direction.</strong> A bidirectional OTDR measurement often
            reveals the masked event from the far-end direction, where the masking reflector is now
            further away from the OTDR port.
          </li>
        </ol>

        <h3>Ghost identification — the 3-test checklist</h3>
        <p>
          Combining the L04 and L05 analysis, the complete field checklist for any suspicious
          reflection peak:
        </p>
        <table>
          <thead>
            <tr><th>Test</th><th>Ghost (multiple-reflection)</th><th>Coherence peak</th><th>Real event</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Distance = 2× (or N×) a real reflector?</td>
              <td>✓ Yes</td>
              <td>Typically no</td>
              <td>No predictable multiple</td>
            </tr>
            <tr>
              <td>Loss step at the peak?</td>
              <td>✗ None</td>
              <td>✗ None</td>
              <td>✓ Yes (step-down)</td>
            </tr>
            <tr>
              <td>Disappears when OTDR warms up?</td>
              <td>No — stays fixed</td>
              <td>May shift or disappear</td>
              <td>Stays fixed (stable)</td>
            </tr>
            <tr>
              <td>Amplitude lower than the presumed source event?</td>
              <td>Usually yes</td>
              <td>Usually yes</td>
              <td>Independent — could be higher or lower</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: Masking in Multi-Fiber Systems and OTDRs with Laser Diode Temperature Control</h2>
        <p>
          High-performance OTDRs use a thermoelectric cooler (TEC) to hold the laser diode at a
          constant temperature, minimizing coherence-length drift. This makes coherence artifacts
          more predictable (they appear at a fixed location on the trace) but also harder to dismiss
          using the "warm-up shift" test. For these instruments, the 2× distance test and the
          loss-step check become the primary diagnostic tools.
        </p>
        <p>
          In CWDM/DWDM systems where multiple wavelengths share the fiber, an OTDR at one wavelength
          can create reflection artifacts at other wavelengths due to Raman and Rayleigh cross-talk
          at high pulse powers. This is rare in passive OSP measurement but can appear in combined
          active/passive measurement setups (e.g., measuring a CWDM overlay on a live fiber without
          proper wavelength blocking filters). Always confirm the OTDR wavelength filter is set
          correctly before interpreting traces on a live wavelength-multiplexed span.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L05-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'A suspicious peak appears at 840 m on an OTDR trace. The trace shows no loss step at the peak. The first highly reflective connector is at 420 m. What is the most likely explanation?',
              options: [
                { id: 'a', text: 'An unmeasured mechanical splice at 840 m' },
                { id: 'b', text: 'A multiple-reflection ghost — 840 m = 2 × 420 m, no loss step confirms this' },
                { id: 'c', text: 'A coherence-length interference peak — appears at irregular spacing' },
                { id: 'd', text: 'Source masking — the 420 m connector is hiding an event at 840 m' },
              ],
              correct: 'b',
              explanation: '840 m = 2 × 420 m (the known reflector), and there is no loss step. Both conditions match a multiple-reflection ghost exactly. Source masking hides events rather than creating phantom peaks. A coherence peak would not follow the 2× distance rule.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'You test a span and the OTDR shows a large reflection peak at 50 m. The splice record shows a fusion splice at 65 m, but no event appears on the trace at 65 m. What is the most likely cause?',
              options: [
                { id: 'a', text: 'The splice was recorded in error — there is no splice at 65 m' },
                { id: 'b', text: 'The splice has zero loss, making it invisible on the trace' },
                { id: 'c', text: 'Source masking — the high-reflectance event at 50 m is hiding the splice at 65 m in its dead zone' },
                { id: 'd', text: 'The OTDR IOR is set wrong, shifting the splice position off the trace' },
              ],
              correct: 'c',
              explanation: 'The splice at 65 m is only 15 m behind the strong reflector at 50 m. For many pulse widths, the ADZ from a high-reflectance connector extends 15 m or more. Source masking is hiding the splice. The solution is to test from the other direction, use a shorter pulse, or use an APC connector at 50 m to reduce the masking.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'Which type of connector produces the lowest reflectance and is therefore the best choice for minimizing source masking at an OTDR launch connection?',
              options: [
                { id: 'a', text: 'UPC (Ultra Physical Contact) — flat polish, −45 to −55 dB reflectance (clean)' },
                { id: 'b', text: 'PC (Physical Contact) — standard flat polish, −25 to −40 dB reflectance' },
                { id: 'c', text: 'APC (Angled Physical Contact) — 8° angled polish, −60 to −65 dB reflectance' },
                { id: 'd', text: 'Air gap (bare fiber adapter) — minimal Fresnel reflection' },
              ],
              correct: 'c',
              explanation: 'APC connectors have an 8° angled end-face that deflects the reflected beam away from the fiber core at an angle, dramatically reducing back-reflection to −60 to −65 dB. A clean UPC connector typically reflects −45 to −55 dB; contamination can degrade that to −14 to −30 dB. APC is the standard choice for OTDR launch cables on singlemode measurement because even a clean UPC reflects ~10–15 dB more than APC.',
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
          This lesson builds on:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
    <li><strong>T12.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T12.L04</strong> — Part of the broader OSP workflow.</li>
    <li><strong>T12.L04</strong> — Part of the broader OSP workflow.</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          Each step in the OSP process feeds into the next — understanding these connections strengthens your grasp of the whole system.
        </p>
      </section>
    </LessonLayout>
  );
}
