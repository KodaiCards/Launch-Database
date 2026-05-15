// Migrated from M01 §1.3 (dispersion content preserved; drag-match quiz and analogies are net-new)
// T02.L03 — Dispersion: Why Fast Signals Blur

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L03',
  course_id: 'T02',
  title: 'Dispersion — Why Fast Signals Blur',
  order: 3,
  lesson_type: 'working',
  prerequisites: ['T02.L02'],
  vocabulary_introduced: ['dispersion', 'chromatic dispersion', 'CD', 'zero-dispersion wavelength', 'ps/(nm·km)', 'modal dispersion', 'PMD'],
  key_terms: [
    { term: 'dispersion', definition: 'A pulse of light arriving smeared out in time at the far end of a fiber. Even if enough light arrives, it may arrive blurred — what was a crisp "1" looks like a fuzzy blob that bleeds into the neighboring "0." Above a certain bit rate or distance, the receiver can\'t tell them apart.' },
    { term: 'chromatic dispersion', definition: 'The dominant dispersion mechanism in single-mode fiber (SMF). Every real light source emits a range of wavelengths; different wavelengths travel at different speeds in glass. The result: a sharp input pulse arrives at the receiver stretched in time.' },
    { term: 'CD', definition: 'Abbreviation for Chromatic Dispersion — the wavelength-dependent speed difference in single-mode fiber that causes pulses to spread over distance.' },
    { term: 'zero-dispersion wavelength', definition: 'The wavelength where chromatic dispersion passes through zero in G.652 SMF. G.652 specifies this between 1300 nm and 1324 nm. At 1310 nm (close to this point), dispersion is very low — that\'s why short 1310 nm links are so forgiving.' },
    { term: 'ps/(nm·km)', definition: 'Picoseconds per nanometer per kilometer — the unit of the chromatic dispersion coefficient D. It tells you how many picoseconds of pulse spreading you get per nanometer of laser spectral width per kilometer of fiber.' },
    { term: 'modal dispersion', definition: 'The dispersion mechanism in multimode fiber (MMF). Different light paths (modes) travel different distances inside the fiber. The fundamental mode (straight through) arrives first; higher-order modes (bouncing at wider angles) arrive later, blurring the pulse. This is why MMF has a bandwidth rating (MHz·km).' },
    { term: 'PMD', definition: 'Polarization Mode Dispersion — a third dispersion mechanism where the two polarization orientations of the same light wave travel at slightly different speeds through the fiber. Only significant at 10 Gb/s and above on older or imperfect fiber.' },
  ],
  vocabulary_assumed: [
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'dB/km', source_lesson_id: 'T02.L02' },
    { term: 'total internal reflection', source_lesson_id: 'T02.L01' },
    { term: 'core', source_lesson_id: 'T02.L01' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
    { term: 'MMF', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 25,
};

export default function T02L03_DispersionWhySignalsBlur() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Attenuation (from T02.L02) tells you how much signal power you lose over distance.
          But there's a second problem: even if enough light arrives at the far end, it might
          arrive <em>smeared out in time</em>. That smearing is called <strong>dispersion</strong>.
        </p>
        <p className="mt-2">
          Here's an everyday analogy: imagine a 100-yard dash where all the runners start at
          the same instant, but some are faster than others. At the finish line, they don't all
          cross at the same time — the field is spread out. A fiber optic signal is like those
          runners. A pulse of light contains multiple wavelengths (colors), and each color travels
          at a slightly different speed through the glass. By the time they reach the far end,
          the pulse is smeared — what was a crisp "1" looks like a fuzzy blob that bleeds into
          the neighboring "0." Above a certain bit rate or distance, the receiver can't tell
          them apart anymore. That's when dispersion becomes a link-limiting problem.
        </p>
        <p className="mt-2">
          The key field takeaway: <strong>attenuation limits distance by how much power you
          lose; dispersion limits distance by how much the signal gets blurred.</strong> You
          can fight attenuation with amplifiers. Dispersion requires compensation at the system
          level.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">Practical meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CD</td>
              <td className="px-3 py-2">Chromatic Dispersion</td>
              <td className="px-3 py-2">Different wavelengths of light travel at different speeds in glass</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PMD</td>
              <td className="px-3 py-2">Polarization Mode Dispersion</td>
              <td className="px-3 py-2">Different polarization orientations of the same light arriving at slightly different times — matters at 10+ Gb/s on older or imperfect fiber</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ps/(nm·km)</td>
              <td className="px-3 py-2">Picoseconds per nanometer per kilometer</td>
              <td className="px-3 py-2">The unit of chromatic dispersion coefficient</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L03"
          cards={[
            { id: 'T02-L03-fc-dispersion', front: 'What is dispersion in fiber optics?', back: 'A pulse of light arriving smeared out in time at the far end of a fiber. Even if enough light arrives, it may be blurred — what was a crisp "1" looks like a fuzzy blob that bleeds into the neighboring "0." Above a certain bit rate or distance, the receiver can\'t tell them apart.' },
            { id: 'T02-L03-fc-cd', front: 'What is chromatic dispersion (CD)?', back: 'The dominant dispersion mechanism in single-mode fiber (SMF). Every real light source emits a range of wavelengths; different wavelengths travel at different speeds in glass. The result: a sharp input pulse arrives at the receiver stretched in time. Measured in ps/(nm·km).' },
            { id: 'T02-L03-fc-zdw', front: 'What is the zero-dispersion wavelength in G.652 fiber?', back: 'The wavelength where chromatic dispersion passes through zero in G.652 SMF — specified between 1300 nm and 1324 nm. At 1310 nm (close to this point), dispersion is very low, which is why short 1310 nm links are so forgiving.' },
            { id: 'T02-L03-fc-psnmkm', front: 'What does ps/(nm·km) measure?', back: 'Picoseconds per nanometer per kilometer — the unit of the chromatic dispersion coefficient D. It tells you how many picoseconds of pulse spreading you get per nanometer of laser spectral width per kilometer of fiber. G.652 at 1550 nm: ~17 ps/(nm·km).' },
            { id: 'T02-L03-fc-modal', front: 'What is modal dispersion?', back: 'The dispersion mechanism in multimode fiber (MMF). Different light paths (modes) travel different distances inside the fiber — the fundamental mode arrives first, higher-order modes arrive later. This blurs the pulse and is why MMF has a bandwidth rating (MHz·km) while SMF does not.' },
            { id: 'T02-L03-fc-pmd', front: 'What is Polarization Mode Dispersion (PMD)?', back: 'A third dispersion mechanism where the two polarization orientations of the same light wave travel at slightly different speeds through the fiber due to geometric imperfections and stress. Only significant at 10 Gb/s and above, especially on older fiber. Measured in ps/√km.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Chromatic Dispersion (CD) — the Main Mechanism in SMF</h2>
        <p>
          In single-mode fiber (SMF), the dominant dispersion mechanism is <strong>chromatic
          dispersion (CD)</strong>. Every real light source emits a range of wavelengths —
          a laser has a spectral width (a band, not a single perfect frequency). Different
          wavelengths in that band travel at different speeds in glass. The result: a sharp
          input pulse arrives at the receiver stretched in time.
        </p>

        <h3 className="mt-5 font-semibold">The dispersion coefficient</h3>
        <p>
          CD is measured in <strong>ps/(nm·km)</strong> — picoseconds of pulse spreading
          per nanometer of source spectral width per kilometer of fiber. The formula for
          total chromatic dispersion on a link:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          ΔT = D × Δλ × L
        </div>
        <p>
          Where:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li><strong>ΔT</strong> = pulse spreading in picoseconds (ps)</li>
          <li><strong>D</strong> = dispersion coefficient in ps/(nm·km)</li>
          <li><strong>Δλ</strong> = source spectral width in nanometers (nm)</li>
          <li><strong>L</strong> = fiber length in kilometers (km)</li>
        </ul>

        <h3 className="mt-5 font-semibold">Worked example</h3>
        <p>
          A 100 km G.652.D fiber run at 1550 nm using a laser with 0.1 nm spectral width.
          D at 1550 nm is approximately 17 ps/(nm·km) for standard G.652 fiber.
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          {`Step 1: D = 17 ps/(nm·km)
Step 2: Δλ = 0.1 nm
Step 3: L = 100 km
Step 4: ΔT = 17 × 0.1 × 100
Step 5: ΔT = 170 ps`}
        </div>
        <p>
          <strong>Sanity check:</strong> 170 picoseconds of pulse spreading. For a 10 Gb/s
          data stream, each bit occupies 100 ps (1/10 × 10⁹ s = 100 ps). At 170 ps spreading,
          the pulse has spread wider than one bit period — without dispersion compensation, this
          link would fail at 10 Gb/s over 100 km. This is exactly why 10G and 100G long-haul
          systems use dispersion-compensating fiber or coherent optics with electronic dispersion
          compensation.
        </p>

        <h3 className="mt-5 font-semibold">The zero-dispersion wavelength</h3>
        <p>
          For standard G.652 SMF, there is a wavelength where chromatic dispersion passes through
          zero — called the <strong>zero-dispersion wavelength (λ₀)</strong>. G.652 specifies
          λ₀ between 1300 nm and 1324 nm. At 1310 nm (close to λ₀), dispersion is very low —
          that's why short 1310 nm links are so forgiving. At 1550 nm, CD is approximately
          17 ps/(nm·km) in the other direction (positive dispersion). The 1550 nm window has
          the lowest attenuation but highest dispersion in G.652 fiber.
        </p>

        <SliderExploration
          title="Chromatic Dispersion — Interactive Explorer"
          description="Drag the sliders to see how fiber length, dispersion coefficient, and laser spectral width combine to determine total pulse spreading (ΔT = D × Δλ × L). The status indicator tells you whether this link can run at 10 Gb/s without dispersion compensation."
          variables={[
            {
              key: 'length_km',
              label: 'Fiber length',
              units: 'km',
              min: 1,
              max: 200,
              step: 1,
              default: 100,
            },
            {
              key: 'D',
              label: 'Dispersion coefficient (D)',
              units: 'ps/(nm·km)',
              min: 0,
              max: 20,
              step: 0.5,
              default: 17,
              format: (v) => v.toFixed(1),
            },
            {
              key: 'delta_lambda',
              label: 'Laser spectral width (Δλ)',
              units: 'nm',
              min: 0.01,
              max: 2.0,
              step: 0.01,
              default: 0.1,
              format: (v) => v.toFixed(2),
            },
          ]}
          compute={({ length_km, D, delta_lambda }) => {
            const delta_t_ps = D * delta_lambda * length_km;
            // 10 Gb/s bit period = 100 ps; conventional 10G dispersion budget ≈ 100 ps total
            // (ITU-T G.952/G.652 engineering practice: ΔT must stay below ~1 bit period for direct detection)
            const limit_10g = 100;  // ps — ~1 bit period at 10 Gb/s; matches worked-example conclusion above
            const limit_40g = 17.5; // ps — 40 Gb/s (bit period 25 ps, 70% ≈ 17.5)
            let status = 'ok';
            let statusMessage = `ΔT = ${delta_t_ps.toFixed(1)} ps — well within 10 Gb/s tolerance (< ${limit_10g} ps). No dispersion compensation needed.`;
            if (delta_t_ps >= limit_10g && delta_t_ps < limit_10g * 4) {
              status = 'warn';
              statusMessage = `ΔT = ${delta_t_ps.toFixed(1)} ps — exceeds 10 Gb/s limit (${limit_10g} ps). Dispersion compensation or coherent optics required at 10G. 40G would have failed at ${limit_40g} ps.`;
            } else if (delta_t_ps >= limit_10g * 4) {
              status = 'error';
              statusMessage = `ΔT = ${delta_t_ps.toFixed(1)} ps — far exceeds 10 Gb/s limit. This run requires coherent optics with electronic dispersion compensation (EDC) regardless of bit rate.`;
            }
            return {
              result: delta_t_ps,
              label: 'Total pulse spreading (ΔT)',
              unit: 'ps',
              status,
              statusMessage,
              decimals: 1,
            };
          }}
          annotations={[
            { value: 100,  label: '10G limit', color: '#fbbf24' },
            { value: 17.5, label: '40G limit', color: '#f87171' },
          ]}
        />

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> "1310 nm = low dispersion, higher attenuation. 1550 nm =
            lowest attenuation, highest dispersion in G.652." This is the standard exam framing.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> The field rule-of-thumb is "1310 for short, 1550 for long,
            1625 to hunt the kink." On actual jobs, the wavelength choice is dictated by:
            (a) the optics already in the customer's equipment, and (b) what OTDR laser modules
            are on the truck. Crews don't calculate dispersion — that's a system engineer's job.
            But crews absolutely do see the consequences when the wrong patch cord optics are
            swapped in on a high-speed link.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Modal dispersion — the multimode version</h3>
        <p>
          In multimode fiber (MMF), there's a completely different dispersion mechanism:
          <strong> modal dispersion</strong>. Different modes (light paths at different angles)
          travel different path lengths. The fundamental mode (straight through) arrives first;
          higher-order modes (bouncing at wider angles) arrive later. The result is the same
          pulse-smearing effect, but the mechanism is path-length difference, not speed
          difference between wavelengths.
        </p>
        <p className="mt-2">
          This is why MMF has a bandwidth rating (MHz·km) while SMF doesn't. Single-mode fiber
          carries only one mode — modal dispersion is zero by definition. MMF bandwidth is
          limited by modal dispersion, and that's why data centers top out at 400m or so with
          OM4 multimode before needing SMF for longer runs.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — PMD and When It Matters</h2>
        <p>
          <strong>Polarization Mode Dispersion (PMD)</strong> is a third dispersion mechanism
          that only becomes significant at 10 Gb/s and above, especially on older or poorly
          installed fiber. Light in a fiber can be thought of as having two polarization
          orientations. In a perfect circular fiber, they travel at identical speeds. In
          real fiber with tiny geometric imperfections, external stress, or connectors that
          induce birefringence, the two orientations travel at slightly different speeds.
        </p>
        <p className="mt-2">
          PMD is measured in ps/√km (the square-root scaling reflects its random, statistical
          nature — PMD accumulates randomly rather than linearly). ITU-T G.652.D caps PMD
          at 0.2 ps/√km on new cable. For 100 km of G.652.D fiber, worst-case PMD contribution
          would be 0.2 × √100 = 2 ps — typically negligible at 10 Gb/s but significant at
          100 Gb/s without coherent compensation.
        </p>
        <p className="mt-2">
          <strong>Practical note for OSP crews:</strong> PMD is rarely an installation concern
          on new G.652.D cable. It becomes a problem when upgrading existing (pre-G.652.D)
          fiber to higher bit rates, or when there are unusual installation stresses (extreme
          bends, kinks, or sections where the fiber has been under mechanical stress for years).
          The OTDR can't directly measure PMD — it requires a dedicated PMD test instrument.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L03 Check — Dispersion"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L03-Q1',
            type: 'mc',
            prompt:
              'A junior designer asks why 1550 nm has the lowest fiber attenuation but is not always the best choice for a short 5 km link. The most accurate answer is:',
            choices: [
              '1550 nm transceivers are banned for runs under 10 km by TIA standards',
              'At 1550 nm, chromatic dispersion in G.652 is approximately 17 ps/(nm·km) — on short links the attenuation savings is minimal but the dispersion is higher, and 1310 nm transceiver costs are often lower',
              '1550 nm cannot be used over single-mode fiber under 10 km due to power constraints',
              '1310 nm has lower attenuation than 1550 nm on short links',
            ],
            answerIndex: 1,
            explanation:
              'On a 5 km SMF link, the difference in attenuation between 1310 and 1550 nm is small in absolute dB terms. The 1310 nm window sits near the G.652 zero-dispersion wavelength, making it more forgiving for lower-cost transceivers. 1550 nm pays its way only when the lower attenuation matters (long haul) or when DWDM/WDM multiplexing is required.',
            citation:
              'G.652 zero-dispersion wavelength: 1300–1324 nm. CD at 1550 nm: ~17 ps/(nm·km). ITU-T G.652.D (2024).',
            fieldNote:
              'On short campus or loop runs, designers default to 1310 nm BiDi or LR optics — cheaper, plentiful, no dispersion compensation needed. 1550 nm enters when DWDM, long-haul, or amplification is in the picture.',
          },
          {
            id: 'T02-L03-Q2',
            type: 'dragdrop',
            prompt:
              'Match each dispersion type to its primary cause.',
            items: [
              { id: 'cd', label: 'Chromatic Dispersion (CD)' },
              { id: 'modal', label: 'Modal Dispersion' },
              { id: 'pmd', label: 'Polarization Mode Dispersion (PMD)' },
            ],
            targets: [
              { id: 'speed', label: 'Different wavelengths travel at different speeds in glass (SMF)' },
              { id: 'path', label: 'Different light paths (modes) travel different distances (MMF)' },
              { id: 'polar', label: 'Different polarization orientations arrive at slightly different times (SMF at high bit rates)' },
            ],
            correctMap: {
              speed: 'cd',
              path: 'modal',
              polar: 'pmd',
            },
            explanation:
              'Chromatic dispersion (CD): wavelength-dependent speed difference in SMF. Modal dispersion: path-length difference between modes in MMF. PMD: polarization-dependent speed difference in SMF at high bit rates.',
            citation:
              'ITU-T G.652.D; FOA Reference Guide — Fiber Optic Fundamentals.',
          },
          {
            id: 'T02-L03-Q3',
            type: 'mc',
            prompt:
              'You are working a 100 km SMF link at 1550 nm. Chromatic dispersion D = 17 ps/(nm·km), and the laser spectral width Δλ = 0.1 nm. What is the total chromatic dispersion (ΔT)?',
            choices: [
              '17 ps',
              '1.7 ps',
              '170 ps',
              '1700 ps',
            ],
            answerIndex: 2,
            explanation:
              'ΔT = D × Δλ × L = 17 ps/(nm·km) × 0.1 nm × 100 km = 170 ps. This is wider than one bit period at 10 Gb/s (100 ps/bit), which is why dispersion compensation is needed on 10G long-haul SMF links at 1550 nm.',
            citation: 'ITU-T G.652 dispersion coefficient; link budget calculation methodology.',
          },
          {
            id: 'T02-L03-Q4',
            type: 'mc',
            prompt:
              'Why does multimode fiber have a bandwidth rating (MHz·km) while single-mode fiber does not need one?',
            choices: [
              'Single-mode fiber is too expensive to test for bandwidth',
              'Multimode fiber bandwidth is limited by modal dispersion — different modes travel different path lengths and arrive at different times. Single-mode carries only one mode, so modal dispersion is zero.',
              'Single-mode fiber has infinite bandwidth at all distances',
              'The MHz·km rating applies to the outer jacket, not the fiber itself',
            ],
            answerIndex: 1,
            explanation:
              'Single-mode fiber\'s tiny core allows only the fundamental (lowest-order) mode to propagate — there are no higher-order modes to arrive late. Modal dispersion is zero. SMF bandwidth is limited by chromatic dispersion and PMD instead, but those don\'t produce a simple MHz·km figure — they are compensated at the system level.',
          },
        ]}
      />

    </LessonLayout>
  );
}
