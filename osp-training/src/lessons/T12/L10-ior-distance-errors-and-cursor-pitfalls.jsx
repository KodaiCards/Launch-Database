// T12.L10 — IOR, Distance Errors, and Cursor Pitfalls
// Advanced working lesson: bulk IOR vs EIOR, distance error formula, multi-reel IOR, cursor pitfalls
// Source: EXFO AN296 | Corning TechInfo CD-100 | TIA-455-61 | R-2 correction N-3

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L10',
  course_id: 'T12',
  title: 'IOR, Distance Errors, and Cursor Pitfalls',
  order: 10,
  lesson_type: 'advanced',
  prerequisites: ['T12.L03', 'T12.L08'],
  learning_objectives: [
    'Explain the difference between bulk IOR (from ITU-T specs) and EIOR (from the fiber datasheet)',
    'Calculate the distance error from an incorrect IOR entry',
    'Describe how multi-reel IOR variation affects distance accuracy on long spans',
    'List the four most common cursor placement pitfalls and their effects on loss readings',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'bulk IOR',
    'EIOR',
    'distance error',
    'multi-reel IOR variation',
  ],
  vocabulary_assumed: [
    { term: 'EIOR', source_lesson_id: 'T12.L03' },
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
    { term: 'manual cursor placement', source_lesson_id: 'T12.L08' },
    { term: 'ADZ', source_lesson_id: 'T12.L04' },
  ],
  key_terms: [
    {
      term: 'bulk IOR',
      definition:
        'The refractive index of the core glass material at a specific wavelength, calculated from first-principles material composition (e.g., silica + GeO₂). Bulk IOR for standard G.652.D fiber at 1310 nm is typically quoted as 1.4677. This is NOT the same as the EIOR — the bulk IOR ignores waveguide effects and the group velocity modification caused by the fiber\'s index profile. Using bulk IOR in an OTDR produces systematic distance errors.',
    },
    {
      term: 'EIOR',
      definition:
        'The refractive index value that correctly converts OTDR round-trip time to physical fiber length, accounting for both material dispersion AND waveguide dispersion effects in the fiber\'s index profile. Always specified on the fiber manufacturer\'s datasheet per ITU-T G.650.1. Typical G.652.D EIOR: 1.4675–1.4685 at 1310 nm, 1.4676–1.4689 at 1550 nm. Must be set accurately in the OTDR before measurement to ensure correct event distances.',
    },
    {
      term: 'distance error',
      definition:
        'The positional error in an OTDR event distance caused by incorrect EIOR entry. Formula: ΔD = (ΔN / N_true) × D_actual, where ΔN = IOR error (difference between entered and true value), N_true = true EIOR, and D_actual = actual fiber distance to the event. A 0.0005 IOR error on a 40 km span produces approximately 13.6 m of positional error. Distance errors accumulate with distance — a small IOR mistake creates a large absolute error on long spans.',
    },
    {
      term: 'multi-reel IOR variation',
      definition:
        'The variation in EIOR between individual cable reels on a long OSP span, caused by manufacturing tolerances (typically ±0.0002 to ±0.0005 per reel). A 40 km span built from multiple reels may have slightly different EIOR values in different sections. Entering a single EIOR value for the whole span introduces a weighted average error that accumulates toward the far end. For highest accuracy on long spans, the EIOR should be verified from the as-built reel data and a weighted average used if significant variation exists.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L10_IORDistanceErrors() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>What the OTDR Uses to Convert Time to Distance</h2>

        <p>
          In Lesson L03, you learned the basic OTDR distance formula:
        </p>
        <blockquote>
          <strong>d = (c × t) / (2 × n)</strong>
        </blockquote>
        <p>
          Where c = speed of light in vacuum (3 × 10⁸ m/s), t = round-trip travel time of the
          pulse, and n = refractive index of the fiber. The OTDR needs an accurate value for n to
          convert the measured time delay into a correct distance. This n is the
          <strong> EIOR (Effective Index of Refraction)</strong>.
        </p>
        <p>
          The word "effective" matters. There are two different refractive index numbers for any
          given fiber:
        </p>
        <ul>
          <li>
            <strong>Bulk IOR:</strong> the glass material's refractive index (accounts for material
            dispersion only). Not the right value to use in your OTDR.
          </li>
          <li>
            <strong>EIOR:</strong> the value that accounts for BOTH the glass material AND the
            waveguide effect (how the fiber's index profile modifies how fast the light actually
            propagates). This is what goes into the OTDR. Always get it from the fiber datasheet.
          </li>
        </ul>
        <p>
          The difference between bulk IOR and EIOR sounds small — often the 4th or 5th decimal
          place. But on a 40 km span, even a tiny IOR error can produce 10+ meters of position
          error. That matters when you're trying to locate a fault and you're digging.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>The Distance Error Formula</h2>

        <p>
          The formula for positional error from an incorrect EIOR entry:
        </p>
        <blockquote>
          <strong>ΔD = (ΔN / N_true) × D_actual</strong>
        </blockquote>
        <p>Where:</p>
        <ul>
          <li><strong>ΔD</strong> = distance error (meters)</li>
          <li><strong>ΔN</strong> = IOR error = |entered IOR − true EIOR|</li>
          <li><strong>N_true</strong> = correct EIOR from the datasheet</li>
          <li><strong>D_actual</strong> = actual fiber distance to the event (meters)</li>
        </ul>
        <p>
          Because the error scales linearly with distance, small IOR mistakes at the OTDR port
          become large positional errors at the far end of a long span.
        </p>

        <WorkedExample
          title="Distance error from a 0.0005 IOR entry mistake on a 40 km span"
          formula="ΔD = (ΔN / N_true) × D_actual"
          variables={[
            { symbol: 'N_entered', label: 'IOR entered in OTDR', value: 1.4682, unit: '(dimensionless)' },
            { symbol: 'N_true', label: 'True EIOR from datasheet', value: 1.4677, unit: '(dimensionless)' },
            { symbol: 'ΔN', label: 'IOR error = |1.4682 − 1.4677|', value: 0.0005, unit: '(dimensionless)' },
            { symbol: 'D_actual', label: 'Actual fiber length', value: 40000, unit: 'm (40 km)' },
          ]}
          steps={[
            'ΔN = 1.4682 − 1.4677 = 0.0005',
            'ΔD = (0.0005 / 1.4677) × 40,000 m',
            'ΔD = 0.0003406 × 40,000 m',
            'ΔD = 13.6 m',
          ]}
          answer="13.6 m positional error at the far end"
          sanityCheck="13.6 m sounds small on a 40 km span, but when you're locating a fault in a buried conduit, a 14 m error means you dig in the wrong spot. On a 100 km span, the same 0.0005 IOR error produces a 34 m positional error. Always use the manufacturer's datasheet EIOR — not a generic G.652 value."
        />

        <h3>Multi-reel IOR variation on long OSP spans</h3>
        <p>
          A 40 km OSP backbone span typically consists of multiple cable reels spliced together
          (each reel is typically 2–6 km). Each reel may have a slightly different EIOR within
          the G.652.D manufacturing tolerance band (typically ±0.0002 to ±0.0005 unit variation
          between reels from the same factory lot).
        </p>
        <p>
          If you enter a single EIOR value for the whole span, you're implicitly assuming all
          reels have identical IOR. For fault location on a long span, this introduces a cumulative
          distance error. The practical approach:
        </p>
        <ol>
          <li>
            Collect the datasheet EIOR for each reel from the as-built construction records
            (the contractor should have recorded reel serial numbers and lengths).
          </li>
          <li>
            Calculate a distance-weighted average: EIOR_avg = (Σ EIOR_i × Length_i) / Total_length.
          </li>
          <li>
            Enter EIOR_avg into the OTDR for distance measurements. The weighted average minimizes
            the maximum cumulative error vs. using any single reel's value.
          </li>
        </ol>
        <p>
          <strong>Field reality:</strong> on most routine splice acceptance tests, multi-reel IOR
          variation is within measurement noise and can be ignored. It becomes important only when
          doing precise fault localization on long (>20 km) spans where the fiber record is
          incomplete or the contractor didn't document individual reel IORs.
        </p>

        <h3>The four most common cursor placement pitfalls</h3>
        <table>
          <thead>
            <tr><th>Pitfall</th><th>What happens</th><th>Fix</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Cursor inside ADZ of a prior reflection</td>
              <td>Loss reading is inaccurate — trace still settling from ring-down</td>
              <td>Move cursor beyond ADZ of the reflective event</td>
            </tr>
            <tr>
              <td>Cursor on the slope of a launch ramp</td>
              <td>Inflated or incorrect loss at first event; backscatter is distorted near the port</td>
              <td>Start first cursor past the end of the launch cable (flat backscatter region)</td>
            </tr>
            <tr>
              <td>Cursor on rising or falling edge of the trace near a ghost</td>
              <td>Ghost's ring-down inflates the LSA slope, giving incorrect loss for nearby events</td>
              <td>Verify no ghost artifacts in the cursor window; extend cursor window past the ghost</td>
            </tr>
            <tr>
              <td>Cursors spanning two different fiber types or IOR sections</td>
              <td>LSA fit tries to fit a straight line across two different slopes → incorrect loss</td>
              <td>Place cursors within a single homogeneous fiber section; avoid spanning splice points</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: Group Index vs. Phase Index, and Why the OTDR Uses Group Index</h2>
        <p>
          There are two ways to express the refractive index of a fiber: the <em>phase index</em>
          (n_p) describes how fast the phase front of the wave propagates; the <em>group index</em>
          (n_g) describes how fast the energy envelope (the pulse) propagates. For OTDR timing
          measurements, you care about when the pulse arrives back — which is a pulse velocity
          (energy envelope) measurement — so the OTDR uses the group index.
        </p>
        <p>
          The EIOR on the fiber datasheet is the group index. It is typically given per ITU-T G.650.1
          measurement protocol. For standard G.652.D at 1310 nm, n_g ≈ 1.4674–1.4678; at 1550 nm,
          n_g ≈ 1.4676–1.4689. The phase index at 1310 nm is slightly different (~1.4660). Using
          phase index instead of group index would introduce a systematic distance error on the
          order of 0.1–0.2% — significant for long-span fault localization.
        </p>
        <p>
          Most OTDR manufacturers configure their instruments to accept the group index (EIOR) as
          the "IOR" input parameter. As long as you enter the datasheet group index, the OTDR
          will produce correct distance readings.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L10-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'You enter an EIOR of 1.4680 into the OTDR. The fiber datasheet specifies EIOR = 1.4675 at 1310 nm. The span is 25 km. What is the approximate distance error at the far end?',
              options: [
                { id: 'a', text: '0.34 m — negligible for practical fault location' },
                { id: 'b', text: '3.4 m' },
                { id: 'c', text: '8.5 m' },
                { id: 'd', text: '34 m' },
              ],
              correct: 'c',
              explanation: 'ΔN = |1.4680 − 1.4675| = 0.0005. ΔD = (0.0005 / 1.4675) × 25,000 m = 0.0003407 × 25,000 = 8.5 m. A 0.0005 IOR error on a 25 km span produces roughly 8.5 m of positional error at the far end — enough to dig in the wrong spot for a buried fault.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'Which IOR value should be entered into the OTDR for most accurate distance measurements on a G.652.D singlemode span?',
              options: [
                { id: 'a', text: 'The bulk silica IOR for that wavelength (e.g., 1.4470)' },
                { id: 'b', text: 'The fiber manufacturer\'s EIOR (group index) from the cable datasheet for the test wavelength' },
                { id: 'c', text: 'The ITU-T G.652.D standard nominal value of 1.4677 for all tests' },
                { id: 'd', text: 'The phase index from the datahsheet, as this is what the OTDR clock measures' },
              ],
              correct: 'b',
              explanation: 'The EIOR (group index) from the specific fiber manufacturer\'s datasheet at the test wavelength is the correct value. Bulk silica IOR (option A) ignores waveguide effects and will be wrong. The G.652.D nominal 1.4677 (option C) is a typical value but not exact for every manufacturer\'s product. The phase index (option D) is the wrong parameter — OTDRs measure pulse travel time which requires the group index.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'On a 50 km span built from 10 different cable reels, each with a slightly different EIOR (all within G.652.D tolerance), the most accurate approach for fault localization is:',
              options: [
                { id: 'a', text: 'Always use 1.4677 — it is the standard G.652.D value and applies to all reels' },
                { id: 'b', text: 'Use the EIOR of the reel at the OTDR launch end only' },
                { id: 'c', text: 'Calculate a distance-weighted average EIOR from the as-built reel data and enter that value' },
                { id: 'd', text: 'Run the OTDR at both 1310 nm and 1550 nm and average the two distance readings' },
              ],
              correct: 'c',
              explanation: 'A distance-weighted average EIOR minimizes the cumulative positional error across the entire span when individual reels have slightly different IOR values. Using only the launch-end reel (option B) introduces increasing error toward the far end. Running at two wavelengths (option D) would give different results since EIOR varies with wavelength — this doesn\'t help resolve the IOR uncertainty.',
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

    </LessonLayout>
  );
}
