import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T22.L02',
  course_id: 'T22',
  title: 'Fiber Fundamentals for Field Technicians',
  order: 2,
  lesson_type: 'cert-prep',
  prerequisites: ['T01.L01', 'T01.L02', 'T02.L01'],
  learning_objectives: [
    'Identify single-mode vs. multimode fiber by core size, loss, and distance',
    'Understand modal dispersion and why it limits multimode distance',
    'Know the ITU-T designations (G.652, G.657.A1) and their field use',
    'Calculate basic fiber loss and understand attenuation per kilometer',
  ],
  estimated_minutes: 22,
  vocabulary_introduced: [
    'Single-mode fiber (SMF)',
    'Multimode fiber (MMF)',
    'Core diameter',
    'Cladding',
    'Modal dispersion',
    'Attenuation (dB/km)',
    'G.652.D (standard single-mode)',
    'OM3, OM4, OM5 (multimode grades)',
    'Cutoff wavelength (λc)',
  ],
  vocabulary_assumed: [
    { term: 'fiber optic', source_lesson_id: 'T01.L01' },
    { term: 'wavelength', source_lesson_id: 'T01.L02' },
    { term: 'dB (decibel)', source_lesson_id: 'T01.L03' },
    { term: 'refraction', source_lesson_id: 'T01.L02' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T22L02_FiberFundamentals() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Fiber comes in two main flavors: single-mode (thin, long-distance) and multimode
          (thicker, shorter-distance). Understanding which fiber you're working with, how far it
          can reach without too much signal loss, and how to measure that loss is core technician
          knowledge. This lesson reviews fiber types, why they behave differently, and how to
          predict loss in the field.
        </p>

        <h3 className="mt-4 font-semibold">Single-mode vs. multimode: the quick comparison</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Property</th>
              <th className="px-3 py-2 text-left">Single-Mode (SMF)</th>
              <th className="px-3 py-2 text-left">Multimode (MMF)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Core diameter</td>
              <td className="px-3 py-2">~8–9 µm (tiny)</td>
              <td className="px-3 py-2">~50 or 62.5 µm (larger)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Light paths</td>
              <td className="px-3 py-2">One mode only</td>
              <td className="px-3 py-2">Many modes (bouncing angles)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Typical distance</td>
              <td className="px-3 py-2">10+ km</td>
              <td className="px-3 py-2">300–2000 m (depends on grade)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Attenuation @ 1550nm</td>
              <td className="px-3 py-2">~0.2 dB/km</td>
              <td className="px-3 py-2">~0.4–3 dB/km (OM1 worst, OM5 best)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Cost</td>
              <td className="px-3 py-2">More expensive</td>
              <td className="px-3 py-2">Less expensive (OSP less common)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Why core size matters</h3>
        <p className="mt-2">
          Single-mode fiber has an 8–9 µm core (smaller than a human hair). Only light traveling
          straight down the fiber's axis can propagate efficiently. All other angles are blocked.
          This strict path reduces modal dispersion (different modes arriving at different times),
          which lets SMF carry signals farther without distortion.
        </p>
        <p className="mt-2">
          Multimode fiber has a 50 or 62.5 µm core (6–8 times larger). Light can bounce at many
          different angles through the core—each angle is a different "mode." The problem: modes at
          sharp angles travel longer paths and arrive later, spreading out the signal pulse. This
          limits distance.
        </p>

        <h3 className="mt-5 font-semibold">Fiber grades you'll see in the field</h3>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>G.652.D (standard single-mode):</strong> Outside plant workhorse. ~0.2 dB/km @ 1550nm.</li>
          <li><strong>G.655 (Non-Zero Dispersion Shifted):</strong> Specialty; used in some long-haul systems.</li>
          <li><strong>G.657.A1 (bend-insensitive single-mode):</strong> Allows tighter bends; OSP in congested areas.</li>
          <li><strong>OM1 (62.5 µm multimode):</strong> Legacy; ~3 dB/km @ 1550nm. Limit ~300 m @ 1550nm.</li>
          <li><strong>OM2, OM3, OM4, OM5 (50 µm multimode):</strong> Increasingly better: OM2 ~0.8 dB/km, OM5 ~0.4 dB/km.</li>
        </ul>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Attenuation & Loss Budgeting</h2>
        <p>
          Signal loss (attenuation) occurs because light gets absorbed and scattered as it travels
          through fiber. The loss is measured in decibels (dB) and increases linearly with distance
          and wavelength.
        </p>

        <h3 className="mt-4 font-semibold">Attenuation formula (typical OSP)</h3>
        <p className="mt-2">
          <strong>Total loss (dB) = fiber loss + splice loss + connector loss</strong>
        </p>
        <p className="mt-2">
          <em>Fiber loss</em> is the main component:
        </p>
        <p className="mt-2 p-3 bg-white/5 border-l-2 border-blue-400 rounded text-slate-200 font-mono">
          Fiber loss (dB) = attenuation (dB/km) × distance (km)
        </p>
        <p className="mt-2">
          <strong>Example:</strong> G.652.D fiber @ 1550 nm, 20 km span.
          <br />
          Fiber loss = 0.2 dB/km × 20 km = <strong>4 dB</strong>
        </p>
        <p className="mt-2">
          Add splices (0.1–0.2 dB each) and connectors (0.5 dB typical), and your 20 km link might
          total 5.5–6 dB loss. If your receiver needs a minimum 5 dB margin, you're cutting it close.
        </p>

        <h3 className="mt-5 font-semibold">Field measurement: OLTS and power meters</h3>
        <p className="mt-2">
          <strong>OLTS (Optical Loss Test Set):</strong> Two units—a light source at one end and a
          power meter at the other. You measure actual signal loss over the link you just installed.
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>Reference measurement:</strong> Connect source directly to meter with a short patch cord.
            This is your 0 dB baseline.</li>
          <li><strong>Link measurement:</strong> Connect source → your installed cable → meter. The difference
            (source power − meter power) is link loss.</li>
          <li><strong>Acceptance:</strong> Field splices typically ≤0.2 dB each; total link loss should match
            budget calculations within ±0.5 dB.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Wavelengths & loss bands</h3>
        <p className="mt-2">
          Attenuation changes by wavelength. In single-mode:
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li><strong>1310 nm (O-band):</strong> ~0.35 dB/km (G.652.D)</li>
          <li><strong>1550 nm (C-band):</strong> ~0.20 dB/km (G.652.D). Lower loss = preferred for long distance.</li>
          <li><strong>1625 nm (L-band):</strong> ~0.22 dB/km. Used in some systems but less common.</li>
        </ul>
        <p className="mt-2">
          <strong>Field note:</strong> When you test a link, always use the same wavelength the system
          will operate on. A 1310 nm test on a 1550 nm system gives different loss numbers.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Modal Dispersion & Bandwidth-Distance Product</h2>
        <p>
          The reason multimode fiber has distance limits is modal dispersion: light rays bouncing
          at different angles take different path lengths and arrive at different times, spreading
          out (dispersing) the signal pulse.
        </p>

        <h3 className="mt-4 font-semibold">Bandwidth-distance product</h3>
        <p className="mt-2">
          The ITU-T specs for multimode fiber (OM1–OM5) list a "modal bandwidth" in MHz·km, which
          sets a maximum reach for each data rate:
        </p>
        <p className="mt-2 p-3 bg-white/5 border-l-2 border-blue-400 rounded text-slate-200 font-mono">
          Maximum distance (m) = (Bandwidth-distance product (MHz·km) × 1000) / (Data rate (MHz))
        </p>
        <p className="mt-2">
          <strong>Example (OM3 @ 1550 nm):</strong>
          <br />
          OM3 modal bandwidth = 500 MHz·km @ 1550 nm
          <br />
          For 100 Mbps (need ~125 MHz channel bandwidth):
          <br />
          Max distance = (500 MHz·km × 1000) / 125 MHz = <strong>4000 m = 4 km</strong>
        </p>
        <p className="mt-2">
          In practice, you also account for attenuation loss (cable loss + splices). The
          <em>combinedeffect</em> of both dispersion and loss determines final usable distance.
        </p>

        <h3 className="mt-5 font-semibold">Cutoff wavelength (λc) for single-mode</h3>
        <p className="mt-2">
          G.652.D has a cutoff wavelength around 1270 nm. This means:
        </p>
        <ul className="mt-3 space-y-2 text-slate-300/90">
          <li>Below 1270 nm (e.g., 1310 nm): The fiber is single-mode (only fundamental mode propagates).</li>
          <li>Above 1270 nm (e.g., 1550 nm): Still single-mode (higher-order modes are cut off at 1270, so they don't propagate at 1550).</li>
        </ul>
        <p className="mt-2">
          <strong>Field implication:</strong> If you accidentally try to use a multimode patch cord
          (wider core) to a G.652.D single-mode connector, you'll have coupling loss and mode
          conversion. Always match fiber types and connector polish grades.
        </p>
      </section>

      {/* ── QUIZ ────────────────────────────────────────────────────────── */}
      <h2 className="mt-8">Lesson Quiz</h2>
      <Quiz
        questions={[
          {
            id: 'Q1',
            stem: 'What is the typical core diameter of single-mode fiber?',
            options: [
              { text: '50 µm', correct: false },
              { text: '62.5 µm', correct: false },
              { text: '8–9 µm', correct: true },
              { text: '125 µm', correct: false },
            ],
            rationale: 'SMF has a core of ~8–9 µm, much smaller than MMF. The 125 µm is the cladding diameter (outer protective layer on all fiber).'
          },
          {
            id: 'Q2',
            stem: 'At 1550 nm, G.652.D fiber has an attenuation of approximately…?',
            options: [
              { text: '0.05 dB/km', correct: false },
              { text: '0.2 dB/km', correct: true },
              { text: '1.0 dB/km', correct: false },
              { text: '2.0 dB/km', correct: false },
            ],
            rationale: 'G.652.D @ 1550 nm is ~0.2 dB/km. This is the lowest-loss wavelength band for standard single-mode fiber in telecom systems.'
          },
          {
            id: 'Q3',
            stem: 'You measure a 10 km G.652.D link with an OLTS @ 1550 nm. Expected fiber loss is?',
            options: [
              { text: '2 dB', correct: true },
              { text: '0.2 dB', correct: false },
              { text: '4 dB', correct: false },
              { text: '20 dB', correct: false },
            ],
            rationale: 'Loss = attenuation × distance = 0.2 dB/km × 10 km = 2 dB. (Splices and connectors would add to this total.)'
          },
          {
            id: 'Q4',
            stem: 'Why does multimode fiber have a shorter usable distance than single-mode?',
            options: [
              { text: 'Multimode has higher attenuation per km.', correct: false },
              { text: 'Modal dispersion spreads the signal pulse over time, limiting bandwidth-distance product.', correct: true },
              { text: 'Multimode fiber is more fragile and breaks easier.', correct: false },
              { text: 'Multimode requires special test equipment that limits reach.', correct: false },
            ],
            rationale: 'Light bounces at different angles through MMF, arriving at different times and spreading the pulse. This modal dispersion limits distance for a given data rate.'
          },
        ]}
      />

      {/* ── FLASHCARDS ───────────────────────────────────────────────── */}
      <h2 className="mt-8">Key Terms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {key_terms.map((term, idx) => (
          <Flashcard key={idx} question={term} answer={
            term === 'Single-mode fiber (SMF)' ? 'Fiber with core ~8–9 µm; only one light path (mode) propagates. Long-distance workhorse for OSP; attenuation ~0.2 dB/km @ 1550nm.' :
            term === 'Multimode fiber (MMF)' ? 'Fiber with core 50 or 62.5 µm; many light paths propagate simultaneously. Shorter distance (typically <2 km); higher loss than SMF.' :
            term === 'Core diameter' ? 'The inner region of optical fiber where light travels. SMF core is 8–9 µm; MMF core is 50 or 62.5 µm.' :
            term === 'Cladding' ? 'Protective glass layer surrounding the core, typically 125 µm diameter. Cladding prevents light from escaping the core.' :
            term === 'Modal dispersion' ? 'In multimode fiber, different light rays (modes) bounce at different angles and arrive at different times, spreading (dispersing) the signal pulse and limiting distance.' :
            term === 'Attenuation (dB/km)' ? 'Signal loss per unit distance due to absorption and scattering. G.652.D loses ~0.2 dB per km @ 1550 nm; OM1 multimode loses ~3 dB/km @ 1550 nm.' :
            term === 'G.652.D (standard single-mode)' ? 'ITU-T standard for outside-plant single-mode fiber; 8–9 µm core; ~0.35 dB/km @ 1310 nm, ~0.2 dB/km @ 1550 nm.' :
            term === 'OM3, OM4, OM5 (multimode grades)' ? 'Multimode fiber grades with increasing modal bandwidth. OM5 is newest (~4700 MHz·km @ 1550 nm); OM1 is legacy (~200 MHz·km).' :
            'Wavelength at which higher-order modes stop propagating in single-mode fiber. For G.652.D, λc ≈ 1270 nm; both 1310 nm and 1550 nm are well below cutoff (truly single-mode).'
          } />
        ))}
      </div>

    </LessonLayout>
  );
}
