// Migrated from M01 §1.1 (wavelength intro rewritten; TIR and core/cladding content is net-new)
// T02.L01 — Why Light Travels in Glass
// Foundation lesson: total internal reflection, core, cladding, NA

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';

export const meta = {
  id: 'T02.L01',
  course_id: 'T02',
  title: 'Why Light Travels in Glass',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01'],
  vocabulary_introduced: ['total internal reflection', 'core', 'cladding', 'NA', 'critical angle', 'index of refraction', 'G.652.D', 'MFD'],
  key_terms: [
    { term: 'total internal reflection', definition: 'The mirror effect that keeps light inside the fiber. When a light ray hits the core-cladding boundary at an angle shallower than the critical angle, 100% of the light reflects back into the core — nothing escapes.' },
    { term: 'core', definition: 'The inner glass cylinder where light signals actually travel. In single-mode fiber (SMF), the core is about 9 µm in diameter — thinner than a human hair. Light stays in the core via total internal reflection.' },
    { term: 'cladding', definition: 'The outer glass layer surrounding the core. Its index of refraction is slightly lower than the core, which creates the total internal reflection effect at the core-cladding boundary. The cladding is 125 µm in diameter for all standard fibers.' },
    { term: 'NA', definition: 'Numerical Aperture — the half-angle of the cone of light that the fiber will accept and propagate via total internal reflection, measured from outside the fiber at the launch end. NA = √(n₁² − n₂²). For standard G.652 SMF: NA ≈ 0.12–0.14.' },
    { term: 'critical angle', definition: 'The specific angle at which a light ray hitting the core-cladding boundary runs exactly along the boundary — measured from the normal (perpendicular) to the boundary surface. Any ray that hits the boundary at an angle GREATER than θ_c from the normal (i.e., within ~5° of grazing along the surface) undergoes total internal reflection. For G.652.D fiber: sin(θ_c) = n₂ / n₁ ≈ 0.9966, so θ_c = arcsin(0.9966) ≈ 85.3° from the normal.' },
    { term: 'index of refraction', definition: 'A number that tells you how much a transparent material bends light. Vacuum = 1.000. Air ≈ 1.000. Glass ≈ 1.46–1.50. In a fiber, the core glass has a slightly higher index than the cladding, which is what causes total internal reflection at the boundary.' },
    { term: 'G.652.D', definition: 'The ITU-T standard designation for the most common single-mode optical fiber used in OSP networks worldwide. Full name: "Characteristics of a single-mode optical fibre and cable." The ".D" suffix is the current sub-category specifying tight tolerances on chromatic dispersion, low water-peak attenuation (low-water-peak fiber), and MFD. When someone says "standard SMF," they almost always mean G.652.D. (Source: ITU-T G.652.D)' },
    { term: 'MFD', definition: 'Mode Field Diameter — the effective diameter of the light beam traveling through a single-mode fiber, measured at the 1/e² intensity point. MFD is slightly larger than the physical core diameter because the evanescent field extends a short distance into the cladding. G.652.D specifies MFD at 1310 nm as 8.8–9.6 µm (9.2 ± 0.4 µm nominal). MFD mismatch between two fibers being spliced causes additional splice loss even when both are G.652.D — manufacturing tolerance matters. (Source: ITU-T G.652.D; 7 CFR 1755.902)' },
  ],
  learning_objectives: [
    'Explain total internal reflection (TIR) and recognize it as the mechanism that confines light inside fiber',
    'Differentiate core, cladding, and their index-of-refraction relationship',
    'Calculate or predict critical angle and numerical aperture (NA) for a given fiber type',
    'Identify G.652.D as the standard single-mode fiber and recognize the consequence of MFD mismatch',
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
    { term: 'MMF', source_lesson_id: 'T01.L08' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
    { term: 'sheath', source_lesson_id: 'T01.L03' },
    { term: 'buffer tube', source_lesson_id: 'T01.L03' },
  ],
  estimated_minutes: 20,
};

export default function T02L01_WhyLightTravelsInGlass() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>

        <div className="mb-4 p-3 bg-amber-900/20 border-l-4 border-amber-500 rounded text-amber-100 text-sm">
          <strong>Building on what you already know:</strong> In <em>What is OSP vs. ISP?</em>, you were introduced to the OSP network — OLTs, ONTs, and the fiber plant that connects them. In <em>Parts of a Cable</em>, you learned that a fiber cable's inner glass strand (the <em>fiber</em>) is what carries the optical signal. In <em>Key Acronyms Field Reference</em>, you saw the distinction between single-mode fiber (<strong>SMF</strong>) and multimode fiber (<strong>MMF</strong>). This lesson explains the physics behind how light actually stays inside that glass strand — the mechanism that makes the whole system work.
        </div>

        <p>
          Fiber optic cable sends data as pulses of light. But why doesn't the light just
          leak out the side of a thin glass strand? The answer is a trick of physics
          called <strong>total internal reflection (TIR)</strong>. Once you understand TIR,
          the whole idea of "light in a cable" clicks into place — and you'll know why bending
          a fiber too sharply breaks the signal.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TIR</td>
              <td className="px-3 py-2">Total Internal Reflection</td>
              <td className="px-3 py-2">Light bouncing back inside the fiber instead of escaping</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NA</td>
              <td className="px-3 py-2">Numerical Aperture</td>
              <td className="px-3 py-2">How wide an angle of light the fiber can accept and still carry</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">SMF</td>
              <td className="px-3 py-2">Single-Mode Fiber</td>
              <td className="px-3 py-2">Narrow core; carries one light path; used in OSP long-distance runs</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MMF</td>
              <td className="px-3 py-2">Multi-Mode Fiber</td>
              <td className="px-3 py-2">Wider core; carries many light paths; used in data-center short runs</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The flashlight-in-a-glass-rod analogy</h3>
        <p className="mt-2">
          Imagine pushing a flashlight beam into one end of a thick glass rod. If you aim
          straight in, the light travels down the rod and comes out the far end. If you angle
          the flashlight so the beam hits the side of the rod at a steep angle, the light
          escapes through the side. But if you angle it so the beam barely grazes the inside
          wall — past a certain threshold angle — something different happens: the beam bounces
          back <em>into</em> the glass, like a mirror, and keeps bouncing all the way to the
          far end.
        </p>
        <p className="mt-2">
          That mirror effect is total internal reflection. Fiber optic cable is engineered
          to keep every light ray bouncing at that optimal angle for miles, so almost none of
          the signal leaks out along the way.
        </p>

        <h3 className="mt-5 font-semibold">Core and cladding — two layers of glass</h3>
        <p className="mt-2">
          A fiber strand isn't just one type of glass. It has two concentric layers:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Core</strong> — the inner glass cylinder where light actually travels.
            In single-mode fiber (SMF), the core is tiny: about 9 micrometers (µm) in diameter —
            thinner than a human hair. In multi-mode fiber (MMF), it's 50 or 62.5 µm.
          </li>
          <li>
            <strong>Cladding</strong> — the outer glass layer wrapped around the core.
            It's made of slightly different glass with a <em>lower</em> index of refraction
            than the core. That difference is what causes total internal reflection at the
            core-cladding boundary.
          </li>
        </ul>
        <p className="mt-2">
          Outside the cladding is a plastic coating (the primary buffer), then more buffer
          tubes and the outer sheath. Those are mechanical protection — the signal lives in
          the core.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L01"
          cards={[
            { id: 'T02-L01-fc-tir', front: 'What is total internal reflection (TIR)?', back: 'The mirror effect that keeps light inside the fiber. When a light ray hits the core-cladding boundary at an angle shallower than the critical angle, 100% of the light reflects back into the core — nothing escapes.' },
            { id: 'T02-L01-fc-core', front: 'What is the core of a fiber optic strand?', back: 'The inner glass cylinder where light signals actually travel. In single-mode fiber (SMF), the core is about 9 µm in diameter — thinner than a human hair. Light stays in the core via total internal reflection.' },
            { id: 'T02-L01-fc-cladding', front: 'What is the cladding of a fiber optic strand?', back: 'The outer glass layer surrounding the core. Its index of refraction is slightly lower than the core, which creates the total internal reflection effect at the core-cladding boundary. The cladding is 125 µm in diameter for all standard fibers.' },
            { id: 'T02-L01-fc-na', front: 'What does Numerical Aperture (NA) describe in a fiber?', back: 'The half-angle of the cone of light that the fiber will accept and propagate via total internal reflection, measured from outside the fiber at the launch end. NA = √(n₁² − n₂²). For standard G.652 SMF: NA ≈ 0.12–0.14.' },
            { id: 'T02-L01-fc-critical-angle', front: 'What is the critical angle in fiber optics?', back: 'The angle measured from the normal (perpendicular to the boundary) at which TIR kicks in. Any ray hitting the boundary at an angle GREATER than θ_c from the normal (i.e., within ~5° of grazing along the surface) undergoes total internal reflection. For G.652.D: sin(θ_c) = n₂/n₁ ≈ 0.9966, so θ_c = arcsin(0.9966) ≈ 85.3° from the normal.' },
            { id: 'T02-L01-fc-index', front: 'What is the index of refraction?', back: 'A number that tells you how much a transparent material bends light. Vacuum = 1.000. Air ≈ 1.000. Glass ≈ 1.46–1.50. In a fiber, the core glass has a slightly higher index than the cladding, which is what causes total internal reflection at the boundary.' },
            { id: 'T02-L01-fc-g652d', front: 'What is ITU-T G.652.D fiber?', back: 'The ITU-T standard designation for the most common single-mode optical fiber used in OSP networks worldwide. The ".D" suffix specifies tight tolerances on chromatic dispersion, low water-peak attenuation, and MFD. When someone says "standard SMF" in an OSP context, they almost always mean G.652.D. (Source: ITU-T G.652.D)' },
            { id: 'T02-L01-fc-mfd', front: 'What is Mode Field Diameter (MFD)?', back: 'The effective diameter of the light beam traveling through a single-mode fiber, measured at the 1/e² intensity point. MFD is slightly larger than the physical core diameter because the evanescent field extends a short distance into the cladding. G.652.D specifies MFD at 1310 nm as 8.8–9.6 µm. MFD mismatch between spliced fibers causes additional splice loss even when both are G.652.D. (Source: ITU-T G.652.D)' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How It Works — The Physics</h2>

        <h3 className="mt-4 font-semibold">Index of refraction</h3>
        <p>
          Every transparent material bends (refracts) light. The <strong>index of
          refraction</strong> (symbol: <em>n</em>) is a number that tells you how much.
          A higher index means the material bends light more. Vacuum = 1.000 exactly.
          Air ≈ 1.000 (close enough). Glass ≈ 1.46–1.50 depending on the glass formula.
        </p>
        <p className="mt-2">
          In a fiber, the core glass is formulated to have a slightly <em>higher</em> index
          than the cladding glass. For standard single-mode fiber (ITU-T G.652.D), typical
          values are:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Core index (n₁): approximately 1.468</li>
          <li>Cladding index (n₂): approximately 1.463</li>
          <li>Difference (Δn): roughly 0.003–0.005</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: ITU-T G.652 (2024 edition — verify exact values against current standard
          if using for design). The exact indices vary by manufacturer and fiber grade.
        </p>

        <h3 className="mt-5 font-semibold">Critical angle — where TIR kicks in</h3>
        <p>
          When a light ray travels from the core (higher index) toward the cladding (lower
          index), <strong>Snell's Law</strong> describes what happens at the boundary. Think
          of Snell's Law as the math that explains why a straw looks bent in a glass of water —
          whenever light crosses from one material into another, it bends. The rule:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          n₁ × sin(θ₁) = n₂ × sin(θ₂)
        </div>
        <p>
          Where n₁ and n₂ are the refractive indices of the two materials, and θ₁ and θ₂
          are the angles the ray makes with the <em>normal</em> (a line perpendicular to the
          surface). The formula says: when light crosses a boundary, the sines of the angles
          on both sides scale inversely with the indices. Since n₁ (core) &gt; n₂ (cladding),
          the refracted ray on the cladding side bends away from the normal.
        </p>
        <p className="mt-2">
          <strong>Plain English:</strong> As the ray's angle to the surface gets shallower
          (meaning the angle measured from the normal gets larger, toward 90°), the refracted
          ray in the cladding bends even more — until at a specific angle, the refracted ray
          would run exactly along the boundary. That angle is the <strong>critical angle</strong>
          (θ_c). For any ray hitting the boundary at an angle GREATER than θ_c from the normal,
          there is no refracted ray at all: 100% of the light reflects back into the core.
          That's TIR.
        </p>
        <p className="mt-2">
          The formula for the critical angle:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          sin(θ_c) = n₂ / n₁
        </div>
        <p className="text-sm text-slate-300/80">
          For the G.652 values above: sin(θ_c) = 1.463 / 1.468 ≈ 0.9966. To find the
          angle itself, take the arcsine (the "sin⁻¹" key on a calculator — it answers
          "what angle has this sine?"): θ_c = arcsin(0.9966) ≈ 85.3° from the normal.
          That's only about 4.7° away from grazing the surface. Any light ray hitting the
          boundary within ~5° of grazing (i.e., at an angle greater than ~85° from the normal)
          undergoes TIR and stays in the core.
        </p>

        <h3 className="mt-5 font-semibold">Numerical Aperture (NA)</h3>
        <p>
          <strong>Numerical Aperture (NA)</strong> describes how "wide" the fiber's acceptance
          cone is — like the opening angle of a funnel. Light rays coming in within this cone
          get trapped inside the core via TIR; rays at steeper angles (outside the cone) leak
          out into the cladding and are lost. NA is measured from outside the fiber, at the
          launch end. The formula:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          NA = √(n₁² − n₂²)
        </div>
        <p>
          For standard G.652 SMF: NA ≈ 0.12–0.14. For 50-µm multimode (OM3/OM4/OM5):
          NA ≈ 0.20. For 62.5-µm multimode (OM1): NA ≈ 0.275.
        </p>
        <p className="mt-2">
          <strong>What NA means in the field:</strong> A higher NA means the fiber accepts
          a wider cone of light. Multimode fibers have higher NA than single-mode. Single-mode's
          narrow NA (and tiny core) means it only carries one light path (the fundamental mode),
          which is why it can send signals much farther without signal blurring.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> NA is a precise optical specification. Datasheets list it
            to three decimal places. Fiber optics textbooks use it to derive bend-loss formulas
            and launch conditions.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Crews almost never calculate NA on the job. The practical
            effect of NA is that it determines minimum bend radius (lower NA = smaller margin
            for bends) and affects how a fusion splicer aligns fibers. A splicer that lists
            "SMF mode-field alignment" is compensating for the fact that SMF's tiny core
            (and low NA) is unforgiving of misalignment.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Mode field diameter (MFD) vs. core diameter</h3>
        <p>
          For single-mode fiber, the light doesn't travel strictly inside the geometric core.
          The light energy distribution (the "mode field") actually extends slightly into the
          cladding. The <strong>mode field diameter (MFD)</strong> describes where 1/e² of the
          power is contained — it's always larger than the physical core diameter.
        </p>
        <p className="mt-2">
          G.652.D specifies MFD @ 1310 nm as 8.8–9.6 µm (9.2 ± 0.4 µm per ITU-T G.652.D; compared to the 9-µm nominal core).
          MFD matters for splicing: two fibers with different MFDs will produce splice loss even
          if the cores are perfectly aligned, because the mode fields don't overlap completely.
          This is why mixing fiber brands or grades in the same link requires care — even if
          both are "G.652.D," MFD variation within the spec tolerance contributes measurable
          loss.
        </p>

        <h3 className="mt-5 font-semibold">Why multimode has a bandwidth rating but single-mode doesn't</h3>
        <p>
          In multimode fiber, different light rays travel at different angles (modes). Higher-angle
          rays bounce more and travel a longer path than lower-angle rays. They all arrive at
          slightly different times — this is <strong>modal dispersion</strong>. It blurs the
          pulse, limiting how fast data can be sent over a given length. Multimode fiber specs
          list an <em>overfilled launch bandwidth</em> (MHz·km) because the bandwidth depends
          on both the fiber design and the launch conditions.
        </p>
        <p className="mt-2">
          Single-mode fiber carries only one mode (the fundamental mode). Modal dispersion is
          zero by definition. Single-mode fiber doesn't need a bandwidth rating because
          bandwidth is limited by chromatic dispersion (a different mechanism, covered in
          the Dispersion lesson coming up next), not by modal path differences.
        </p>
      </section>

      {/* ── FIBER STRAND ANATOMY ────────────────────────────────────────── */}
      <div className="lesson-callout">
        <h4>Inside a Fiber Strand — Layer Definitions</h4>
        <p>A single fiber strand has four distinct parts from center out. The glass is the optical path; the plastic coating is purely mechanical protection.</p>
        <ol>
          <li>
            <strong>Core</strong> — The inner glass cylinder where light signals travel. In single-mode fiber (SMF), the core is about 9 µm in diameter — thinner than a human hair. Light stays in the core via total internal reflection at the core-cladding boundary.
          </li>
          <li>
            <strong>Cladding</strong> — The outer glass layer surrounding the core. Its index of refraction is slightly lower than the core's, which creates the total internal reflection effect. The cladding is 125 µm in diameter for all standard fibers (SMF and MMF alike).
          </li>
          <li>
            <strong>Buffer coating</strong> — A plastic coating applied immediately outside the cladding. It protects the glass from moisture and mechanical stress. The primary buffer is typically 250 µm in diameter. It is NOT part of the optical path — purely mechanical protection.
          </li>
          <li>
            <strong>Light ray path</strong> — A light ray traveling through the core bounces off the core-cladding boundary via total internal reflection. As long as the bounce angle is shallower than the critical angle, 100% of the light reflects back — no energy escapes to the cladding. This is what keeps the signal in the fiber.
          </li>
        </ol>
      </div>

      <ReferencesBlock
        items={[
          { citation: 'ITU-T G.652.D', note: 'Standard defining single-mode fiber — core/cladding index targets, NA range, and mode field diameter (MFD).' },
          { citation: '7 CFR 1755.902', note: 'RUS minimum performance spec — sets the MFD manufacturing tolerance referenced for splice-loss discussion.' },
          { citation: 'FOA Reference Guide — Fiber Optic Technology', note: 'General industry reference for TIR, NA, and fiber construction basics.' },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T02"
        assessmentId="T02-L01"
        title="Check — Why Light Travels in Glass"
        fallback={
        <Quiz
          title="Check — Why Light Travels in Glass"
          mode="multiple-choice"
          questions={[
            {
              id: 'T02-L01-Q1',
              type: 'mc',
              prompt:
                'What phenomenon prevents light from leaking out the side of a fiber optic strand?',
              choices: [
                'Electromagnetic shielding from the outer jacket',
                'Total internal reflection at the core-cladding boundary',
                'Absorption of stray light by the buffer coating',
                'Magnetic alignment of photons along the fiber axis',
              ],
              answerIndex: 1,
              explanation:
                'Total internal reflection (TIR) occurs when light hits the core-cladding boundary at an angle shallower than the critical angle. Because the core has a higher index of refraction than the cladding, 100% of the light bounces back into the core — nothing escapes.',
              citation:
                'ITU-T G.652 (2024); FOA Reference Guide — Fiber Optic Technology.',
              fieldNote:
                'When a fiber is bent too sharply, some rays hit the boundary at angles steeper than the critical angle and escape. That\'s macrobend loss — the reason bend radius rules matter in the field.',
            },
            {
              id: 'T02-L01-Q2',
              type: 'mc',
              prompt:
                'A single-mode fiber has a core diameter of approximately 9 µm. A 50/125 multimode fiber has a core diameter of 50 µm. What is the primary optical consequence of the SMF\'s smaller core?',
              choices: [
                'SMF cannot carry 1550 nm wavelengths',
                'SMF carries only one propagation mode, eliminating modal dispersion and allowing longer transmission distances',
                'SMF requires a higher launch power to overcome the smaller cross-section',
                'SMF has higher attenuation than multimode at all wavelengths',
              ],
              answerIndex: 1,
              explanation:
                'The tiny SMF core allows only the fundamental mode to propagate. With no higher-order modes, there is no modal dispersion. This is why SMF can carry signals for tens of kilometers where MMF tops out at hundreds of meters to a few kilometers.',
              citation:
                'ITU-T G.652.D — Characteristics of a single-mode optical fiber and cable.',
            },
            {
              id: 'T02-L01-Q3',
              type: 'fill-in-blank',
              prompt:
                'The outer glass layer surrounding the core of a fiber is called the ____.',
              answer: 'cladding',
              answerDisplay: 'cladding',
              explanation:
                'The cladding surrounds the core and has a lower index of refraction. That difference is what creates total internal reflection at the boundary, trapping light inside the core.',
            },
            {
              id: 'T02-L01-Q4',
              type: 'mc',
              prompt:
                'Numerical Aperture (NA) describes which property of a fiber?',
              choices: [
                'The maximum operating temperature of the outer sheath',
                'The half-angle of the cone of light the fiber will accept and propagate via TIR',
                'The total length of fiber on a standard shipping reel',
                'The ratio of core diameter to cladding diameter',
              ],
              answerIndex: 1,
              explanation:
                'NA = √(n₁² − n₂²), where n₁ is the core index and n₂ is the cladding index. It describes the acceptance cone at the launch end. Higher NA = accepts a wider cone = more light coupled in. SMF has low NA (~0.12–0.14); multimode has higher NA (0.20–0.275).',
              citation: 'FOA Reference Guide; ITU-T G.652.D.',
              fieldNote:
                'In practice, NA matters when you\'re troubleshooting splice loss between fiber types. Mismatched NA between two spliced fibers causes inherent loss even with perfect core alignment.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
