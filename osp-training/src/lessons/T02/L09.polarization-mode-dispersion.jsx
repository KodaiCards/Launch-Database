// Net-new content (identified as gap by R-A) — no prior module source
// T02.L09 — Polarization Mode Dispersion (Advanced)

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L09',
  course_id: 'T02',
  title: 'Polarization Mode Dispersion (PMD) — Advanced',
  order: 9,
  lesson_type: 'advanced',
  prerequisites: ['T02.L03'],
  vocabulary_introduced: ['DGD', 'SOPMD', 'PMD-limited span', 'ps/√km', 'birefringence', 'polarization'],
  key_terms: [
    { term: 'DGD', definition: 'Differential Group Delay -- the time delay between the two polarization components of light when they arrive at the receiver, caused by PMD. Measured in picoseconds (ps). If DGD is a significant fraction of the bit period, the signal becomes undecodable. Formula: DGD_rms = PMD_coefficient x sqrt(L).' },
    { term: 'SOPMD', definition: 'Second-Order PMD -- describes the wavelength dependence of the PMD vector, meaning how fast PMD changes across the signal spectrum. For wideband coherent signals or DWDM channels, SOPMD can cause differential signal distortion even when first-order DGD is within tolerance. Measured in ps-squared/km.' },
    { term: 'PMD-limited span', definition: 'A fiber link where Polarization Mode Dispersion (PMD) is the limiting factor for the maximum usable bit rate or distance -- not attenuation or chromatic dispersion. Occurs primarily on older (pre-G.652.D) fiber at 40 Gb/s and above, or on any fiber under chronic mechanical stress.' },
    { term: 'ps/sqrt(km)', definition: 'Picoseconds per square-root-kilometer -- the unit of the PMD coefficient. PMD accumulates with the square root of length (not linearly) because it is a random-walk process. G.652.D specification maximum: 0.2 ps/sqrt(km).' },
    { term: 'birefringence', definition: 'A property of a medium (like real fiber) where it has different refractive indices for different polarization orientations due to geometric imperfections or stress. Birefringence causes the two polarization axes of light to travel at different speeds, which is the root cause of PMD.' },
    { term: 'polarization', definition: 'The orientation of the oscillation of a light wave perpendicular to its direction of travel. In single-mode fiber, you can think of the light as having two orthogonal polarization states (X and Y). In a perfect fiber, they travel at the same speed. In real fiber, they do not -- causing PMD.' },
  ],
  vocabulary_assumed: [
    { term: 'dispersion', source_lesson_id: 'T02.L03' },
    { term: 'chromatic dispersion', source_lesson_id: 'T02.L03' },
    { term: 'PMD', source_lesson_id: 'T02.L03' },
    { term: 'ps/(nm·km)', source_lesson_id: 'T02.L03' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
    { term: 'dB', source_lesson_id: 'T02.L05' },
  ],
  learning_objectives: [
    'Explain the physical mechanism of Polarization Mode Dispersion (PMD) and how birefringence in real fiber causes two orthogonal polarization modes to travel at different speeds',
    'Calculate Differential Group Delay (DGD) using the PMD coefficient and link length, and interpret DGD values in context of bit period and signal degradation',
    'Distinguish between chromatic dispersion (wavelength-dependent) and PMD (polarization-dependent) impairments and explain why both limit long-distance transmission at high bit rates',
    'Apply PMD specifications (G.652.D max 0.2 ps/√km) to evaluate whether a pre-engineered link meets requirements for 40G/100G transmission without PMD-limiting margin loss',
  ],
  estimated_minutes: 20,
};

export default function T02L09_PolarizationModeDispersion() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Quick refresher:</strong> In <strong>T02.L03</strong>, you learned chromatic dispersion — the blurring that happens when different wavelengths travel at different speeds. This lesson covers a sibling problem: when the same wavelength's two polarization modes travel at different speeds (PMD). Both mechanisms blur signals; both limit link distance at high bit rates.
        </div>

        <p>
          This is an advanced lesson. If you're working on standard OSP splicing, testing, or
          construction, you can skip this lesson for now — PMD rarely affects day-to-day field
          work on G.652.D fiber. But if you work on fiber upgrades, high-speed carrier networks,
          or troubleshoot mysterious high-bit-rate link failures, this lesson will help.
        </p>
        <p className="mt-2">
          You learned in T02.L03 that chromatic dispersion blurs signals because different
          wavelengths travel at different speeds. <strong>Polarization Mode Dispersion (PMD)</strong>
          is a third dispersion mechanism where the two "polarization orientations" of the same
          light wave travel at slightly different speeds through the fiber.
        </p>
        <p className="mt-2">
          Think of it like a bicycle wheel: if the wheel is a perfect circle, it rolls smoothly.
          If it's slightly oval (elliptical), the ride is bumpy — the wheel bounces at a higher
          and lower speed alternately. PMD happens when the fiber's core is slightly non-circular,
          or when stress bends the fiber differently in different directions. These imperfections
          make the two polarization "axes" of the light travel at different speeds, smearing the
          signal over time.
        </p>
        <p className="mt-2">
          Here's how the bicycle wheel maps to the fiber: the wheel's oval shape is the fiber's
          slightly non-circular core — stress from bending, over-tensioned lashing, or imperfect
          manufacturing during drawing makes the core oval instead of round. The two "paths" in
          PMD are the two polarization axes — light's electric field can vibrate side-to-side
          (X-polarization) OR up-and-down (Y-polarization) inside the fiber. In a perfectly
          round core, both axes travel at exactly the same speed. In an oval core, one axis
          is traveling through a slightly different amount of glass than the other, so it arrives
          a little later. That arrival-time difference is the DGD — Differential Group Delay —
          and when it's large enough, the receiver can't cleanly separate the signal.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L09"
          cards={[
            { id: 'T02-L09-fc-dgd', front: 'What is Differential Group Delay (DGD)?', back: 'The time delay between the two polarization components of light arriving at the receiver, caused by PMD. Measured in picoseconds (ps). Formula: DGD_rms = PMD_coefficient x sqrt(L). If DGD exceeds ~10% of the bit period, the link may fail.' },
            { id: 'T02-L09-fc-psskm', front: 'What does ps/sqrt(km) measure?', back: 'The unit of the PMD coefficient -- picoseconds per square-root-kilometer. PMD accumulates with the square root of length (not linearly) because it is a random-walk process. G.652.D specification maximum: 0.2 ps/sqrt(km). Older fiber can be 0.5-2.0 ps/sqrt(km).' },
            { id: 'T02-L09-fc-biref', front: 'What is birefringence in fiber?', back: 'A property of real fiber where it has different refractive indices for different polarization orientations due to geometric imperfections (non-circular core) or stress. Birefringence causes the two polarization axes of light to travel at different speeds -- the root cause of PMD.' },
            { id: 'T02-L09-fc-polar', front: 'What is polarization in the context of fiber PMD?', back: 'The orientation of the oscillation of a light wave. In single-mode fiber, light has two orthogonal polarization states (X and Y). In a perfect fiber, both travel at the same speed. In real fiber with imperfections or stress, they travel at slightly different speeds, causing PMD.' },
            { id: 'T02-L09-fc-pmdspan', front: 'When is a fiber link "PMD-limited"?', back: 'When PMD is the factor limiting the maximum usable bit rate or distance -- not attenuation or chromatic dispersion. Occurs primarily on older (pre-G.652.D) fiber at 40 Gb/s and above, or on fiber under chronic mechanical stress from over-tensioned lashing, conduit overfill, or tight bends.' },
            { id: 'T02-L09-fc-sopmd', front: 'What is Second-Order PMD (SOPMD)?', back: 'Describes the wavelength dependence of the PMD vector -- how fast PMD changes across the signal spectrum. For wideband coherent signals or DWDM channels, SOPMD can cause differential signal distortion even when first-order DGD is within tolerance. Measured in ps²/(km). A system-engineering concern, not a field construction concern.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>PMD — The Details</h2>

        <h3 className="mt-4 font-semibold">Polarization of light — very briefly</h3>
        <p>
          Light is a transverse electromagnetic wave — it oscillates perpendicular to its
          direction of travel. In a single-mode fiber, you can think of the light as having
          two orthogonal "polarization states" — call them the X-polarization and Y-polarization.
          In a perfect, stress-free, circular fiber, X and Y travel at exactly the same speed
          (they're degenerate modes). In real fiber, they don't — because the core is never
          a perfect circle, and external stresses (bends, tension, temperature gradients)
          further break the symmetry.
        </p>

        <h3 className="mt-5 font-semibold">DGD — Differential Group Delay</h3>
        <p>
          The result of the X/Y speed difference is a <strong>Differential Group Delay (DGD)</strong>
          — a time delay between the two polarization components when they arrive at the receiver.
          DGD is measured in picoseconds (ps). If the DGD is a significant fraction of the bit
          period, the signal becomes undecodable.
        </p>
        <p className="mt-2">
          PMD is measured in <strong>ps/√km</strong>. Unlike chromatic dispersion (which
          accumulates linearly: D × L), PMD accumulates with the square root of length because
          it's a random-walk process — the polarization coupling is random along the fiber,
          and random-walk accumulation scales as √L.
        </p>

        <h3 className="mt-5 font-semibold">The PMD formula</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`DGD_rms = PMD_coefficient × √L

Where:
  DGD_rms   = rms (statistical) differential group delay (ps)
  PMD_coefficient = fiber's PMD parameter (ps/√km)
  L         = fiber length (km)
  √L        = square root of length`}
        </div>

        <h3 className="mt-5 font-semibold">Worked example</h3>
        <p>
          A 200 km G.652.D fiber route has PMD coefficient = 0.1 ps/√km (well below the
          G.652.D max of 0.2 ps/√km). What is the rms DGD?
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Step 1: DGD_rms = PMD_coeff × √L
Step 2:          = 0.1 ps/√km × √200 km
Step 3:          = 0.1 × 14.14
Step 4:          = 1.41 ps`}
        </div>
        <p className="text-sm text-slate-300/80">
          <strong>Sanity check:</strong> At 10 Gb/s, one bit period = 100 ps. A 1.41 ps DGD
          is ~1.4% of the bit period — typically acceptable (most 10G systems tolerate up to
          ~10 ps of DGD without problems). At 100 Gb/s, one bit period = 10 ps, so 1.41 ps
          is 14% of a bit — coherent digital signal processing (DSP) handles this in modern
          100G transceivers, but it's at the edge of what older direct-detection 100G systems
          could tolerate. This is why upgrading old fiber to 100G without checking PMD
          can cause unexpected link failures.
        </p>

        <SliderExploration
          title="PMD — Interactive DGD Calculator"
          description="Drag the sliders to explore how PMD coefficient and fiber length combine to produce rms Differential Group Delay (DGD). The status compares against the 10% bit-period rule for common bit rates."
          variables={[
            {
              key: 'pmd_coeff',
              label: 'PMD coefficient',
              units: 'ps/√km',
              min: 0.01,
              max: 2.0,
              step: 0.01,
              default: 0.1,
              format: (v) => v.toFixed(2),
            },
            {
              key: 'length_km',
              label: 'Fiber length',
              units: 'km',
              min: 1,
              max: 500,
              step: 1,
              default: 200,
            },
          ]}
          compute={({ pmd_coeff, length_km }) => {
            const dgd = pmd_coeff * Math.sqrt(length_km);
            // 10% of bit period rules: 10G=10ps, 40G=2.5ps, 100G DSP=1ps
            let status = 'ok';
            let statusMessage = `DGD = ${dgd.toFixed(2)} ps — within 10G limit (< 10 ps). New G.652.D cable. No PMD concern at 10G or 100G coherent.`;
            if (dgd >= 1 && dgd < 2.5) {
              status = 'ok';
              statusMessage = `DGD = ${dgd.toFixed(2)} ps — within 10G limit but approaching 40G limit (2.5 ps). Flag for review if upgrading to 40G.`;
            } else if (dgd >= 2.5 && dgd < 10) {
              status = 'warn';
              statusMessage = `DGD = ${dgd.toFixed(2)} ps — exceeds 40G tolerance (2.5 ps). 40G upgrade not viable without PMD compensation. 10G is still OK (limit: 10 ps).`;
            } else if (dgd >= 10) {
              status = 'error';
              statusMessage = `DGD = ${dgd.toFixed(2)} ps — exceeds 10G limit (10 ps). High-PMD fiber — request PMD measurement before any upgrade above 2.5G. Likely pre-G.652 legacy cable.`;
            }
            return {
              result: dgd,
              label: 'rms Differential Group Delay (DGD)',
              unit: 'ps',
              status,
              statusMessage,
              decimals: 2,
            };
          }}
          annotations={[
            { value: 10,  label: '10G limit (10 ps)', color: '#fbbf24' },
            { value: 2.5, label: '40G limit (2.5 ps)', color: '#f87171' },
          ]}
        />

        <h3 className="mt-5 font-semibold">When does PMD become a problem?</h3>
        <p>
          Rule of thumb: PMD-limited links occur when DGD_rms exceeds ~10% of the bit period.
          At what fiber length this happens depends on the PMD coefficient:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Bit rate</th>
                <th className="px-3 py-2 text-left">Bit period</th>
                <th className="px-3 py-2 text-left">10% DGD limit</th>
                <th className="px-3 py-2 text-left">PMD-limited distance (0.2 ps/√km)</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">2.5 Gb/s</td>
                <td className="px-3 py-2">400 ps</td>
                <td className="px-3 py-2">40 ps max DGD</td>
                <td className="px-3 py-2">&gt; 40,000 km — not limiting</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">10 Gb/s</td>
                <td className="px-3 py-2">100 ps</td>
                <td className="px-3 py-2">10 ps max DGD</td>
                <td className="px-3 py-2">~2,500 km — rarely limiting on G.652.D</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">40 Gb/s</td>
                <td className="px-3 py-2">25 ps</td>
                <td className="px-3 py-2">2.5 ps max DGD</td>
                <td className="px-3 py-2">~156 km — limiting on older high-PMD fiber</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">100 Gb/s (coherent)</td>
                <td className="px-3 py-2">10 ps</td>
                <td className="px-3 py-2">1 ps</td>
                <td className="px-3 py-2">Managed by DSP — but pre-G.652.D fiber can still fail</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          100G coherent systems handle PMD with digital signal processing (DSP) in the
          transponder. For these systems, the PMD limit is orders of magnitude higher than
          direct-detection systems. PMD is rarely limiting on new G.652.D fiber at 100G
          coherent. It IS a problem on pre-2002 fiber (often PMD ≥ 0.5–2 ps/√km) being
          upgraded from 2.5G to 100G.
        </p>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> PMD is a fundamental fiber parameter — always test it on
            any long SMF route before activating high-speed wavelengths.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> On new G.652.D installations, PMD is rarely the
            failure mode. The spec limit (0.2 ps/√km) keeps DGD well inside limits even for
            10G over 2,000+ km. PMD becomes a field issue primarily when: (1) upgrading existing
            pre-G.652.D fiber to 40G or higher, or (2) a route uses older fiber plant of
            unknown PMD specification. If you're doing a 100G upgrade on fiber installed before
            2000, always request a PMD test before quoting the upgrade.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — SOPMD and Statistical PMD</h2>
        <p>
          PMD is fundamentally statistical. The <strong>DGD</strong> (differential group delay)
          is not a fixed value — it fluctuates with temperature, vibration, and stress changes
          along the fiber. What's measured and specified is the rms (root-mean-square) average
          DGD, called the PMD coefficient in ps/√km.
        </p>
        <p className="mt-2">
          <strong>Second-Order PMD (SOPMD)</strong> describes the wavelength dependence of the
          PMD vector — how fast the PMD changes across the signal spectrum. For wideband
          coherent signals or DWDM channels, SOPMD can cause differential signal distortion
          even when the first-order DGD is within tolerance. SOPMD is measured in
          ps²/(km) or ps/nm per unit length and is specified in some high-end fiber
          datasheets.
        </p>
        <p className="mt-2">
          For OSP field crews: SOPMD is a system-engineering concern, not a construction
          concern. The crew's job is to avoid installation practices that increase fiber stress
          (over-tensioned lashing, tight bend radii, conduit overfill) — these increase the
          base PMD of the installed cable beyond its fiber-only spec. A cable that measures
          0.1 ps/√km on the reel can test significantly higher after installation if it's under
          chronic mechanical stress.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L09 Check — PMD"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L09-Q1',
            type: 'mc',
            prompt:
              'Why does PMD accumulate with the square root of fiber length (√L) rather than linearly (like chromatic dispersion)?',
            choices: [
              'Because PMD only occurs at splice points, which occur at regular intervals',
              'Because PMD is a random-walk process — polarization coupling along the fiber varies randomly, and random-walk processes scale as √L rather than linearly',
              'Because PMD is inversely proportional to fiber length — it decreases as the link gets longer',
              'Because PMD units are ps/√km and this is just a unit convention with no physical meaning',
            ],
            answerIndex: 1,
            explanation:
              'Chromatic dispersion is deterministic and accumulates linearly: ΔT = D × Δλ × L. PMD is statistical — the polarization coupling along real fiber is random (due to random imperfections and random external stresses). Random-walk accumulation is the root-mean-square sum of random independent contributions, which scales as √N (number of steps) or equivalently √L.',
            citation: 'ITU-T G.652.D PMD specification; FOA Reference Guide — PMD section.',
          },
          {
            id: 'T02-L09-Q2',
            type: 'mc',
            prompt:
              'A 150 km link on pre-G.652.D fiber has a measured PMD coefficient of 0.8 ps/√km. The system is being upgraded to 40 Gb/s. What is the rms DGD, and is this upgrade likely to succeed?',
            choices: [
              'DGD = 9.8 ps. 40G needs DGD < 2.5 ps — this upgrade will very likely fail without PMD compensation',
              'DGD = 9.8 ps. 40G needs DGD < 25 ps — this upgrade will work fine',
              'DGD = 120 ps. The upgrade will fail at any bit rate above 2.5G',
              'DGD = 0.8 ps — the PMD coefficient is already the DGD for any length',
            ],
            answerIndex: 0,
            explanation:
              'DGD_rms = 0.8 ps/√km × √150 km = 0.8 × 12.25 = 9.8 ps. At 40 Gb/s, the bit period is 25 ps; 10% tolerance = 2.5 ps max DGD. 9.8 ps >> 2.5 ps — this link will likely fail or require PMD compensation hardware (PMD compensators are expensive and complex). The upgrade should be evaluated carefully before commitment.',
            citation: 'ITU-T G.652.D; 40G PMD budget analysis; ITU-T G.Sup39 [confirm edition].',
          },
          {
            id: 'T02-L09-Q3',
            type: 'mc',
            prompt:
              'What field installation practice most directly increases the PMD of installed cable above its factory specification?',
            choices: [
              'Leaving coiled slack at each splice case',
              'Over-tensioned lashing wire, conduit overfill, or tight bend radii — chronic mechanical stress on the fiber increases birefringence and raises PMD above the factory value',
              'Using fusion splices instead of mechanical splices',
              'Installing in cold weather (below 0°C)',
            ],
            answerIndex: 1,
            explanation:
              'PMD is caused by geometric imperfections and stress-induced birefringence. Factory PMD specs reflect fiber under no external stress. Chronic stress from over-tensioned lashing, conduit overfill, or tight bends adds birefringence that raises the installed PMD coefficient above the fiber\'s datasheet value. Good installation practice protects both attenuation and PMD performance.',
          },
        ]}
      />

    </LessonLayout>
  );
}
