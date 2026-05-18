import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T21.L02',
  course_id: 'T21',
  title: 'Domain Review: Fiber Fundamentals + Cable Types',
  order: 2,
  lesson_type: 'cert-prep',
  prerequisites: ['T21.L01', 'T01.L01', 'T01.L02', 'T02.L01', 'T02.L08'],
  learning_objectives: [
    'Review light propagation, refractive index, and numerical aperture (NA)',
    'Distinguish single-mode and multimode fiber by core diameter, attenuation, and dispersion',
    'Understand fiber color coding, cable jacket types, and OSP cable choices',
    'Apply fiber selection criteria to typical OSP scenarios',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'Mode stripper (mode conditioning for multimode launch)',
    'Spectral window (1310 vs 1490 vs 1550 nm applications)',
  ],
  vocabulary_assumed: [
    { term: 'fiber optic', source_lesson_id: 'T02.L01' },
    { term: 'single-mode fiber', source_lesson_id: 'T02.L08' },
    { term: 'multimode fiber', source_lesson_id: 'T02.L08' },
    { term: 'attenuation', source_lesson_id: 'T02.L01' },
    { term: 'dispersion', source_lesson_id: 'T02.L01' },
    { term: 'numerical aperture', source_lesson_id: 'T02.L02' },
  ],
};

export const key_terms = meta.vocabulary_introduced;

export default function T21L02_FiberFundamentalsReview() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          CFOS-O exam Domain 1 tests your understanding of fiber physics at the specialist level.
          You already know the basics from T01–T02. This lesson condenses the exam-critical points
          and shows you how they apply to real OSP decisions: selecting fiber types, predicting link
          budgets, and troubleshooting field problems.
        </p>

        <h3 className="mt-4 font-semibold">Core concept: Why fiber type matters in OSP</h3>
        <p className="mt-2">
          In outside plant, you choose fiber based on distance, budget, speed, and cost. Single-mode
          fiber (SMF) goes long distances and supports 10 Gbps+. Multimode fiber (MMF) is cheaper
          for shorter runs. In rural OSP, you typically see SMF for long feeder routes, MMF in
          drop sections. The exam expects you to choose correctly for a given scenario.
        </p>

        <h3 className="mt-5 font-semibold">Light propagation: the basic physics</h3>
        <div className="mt-3 space-y-2 text-slate-300/90">
          <p>
            Light travels as an electromagnetic wave. When light hits a fiber's endface, it either
            enters the core (if the angle is shallow enough) or bounces away (too steep). The <strong>numerical aperture (NA)</strong> describes
            which angles will propagate.
          </p>
          <p>
            <strong>Simple formula:</strong> NA = √(n_core² – n_clad²), where n is refractive index.
            <br />Example: SMF has NA ≈ 0.13. MMF (OM1) has NA ≈ 0.20. Bigger NA = wider acceptance cone = easier to launch light but more modes = more dispersion.
          </p>
          <p>
            <strong>In the field:</strong> A light source (LED or laser) launches light at a certain NA.
            If the source NA is higher than the fiber NA, some light bounces out the endface (wasted energy).
            If source NA is lower, you waste only a little light. Matching NA reduces launch losses.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Single-mode vs. Multimode in 60 seconds</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3 bg-white/5">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Characteristic</th>
              <th className="px-3 py-2 text-left">Single-Mode (SMF)</th>
              <th className="px-3 py-2 text-left">Multimode (MMF)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-xs">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Core diameter</td>
              <td className="px-3 py-2">~8–10 µm</td>
              <td className="px-3 py-2">~50–62 µm</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Attenuation @ 1550 nm</td>
              <td className="px-3 py-2">~0.18 dB/km</td>
              <td className="px-3 py-2">~0.35–0.40 dB/km</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Max distance (10 Gbps)</td>
              <td className="px-3 py-2">~10+ km</td>
              <td className="px-3 py-2">~300 m typical</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Cost per kilometer</td>
              <td className="px-3 py-2">Lower (feeder route length)</td>
              <td className="px-3 py-2">Lower per meter (short drop)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">Common grades</td>
              <td className="px-3 py-2">OS2</td>
              <td className="px-3 py-2">OM1, OM2, OM3, OM4, OM5</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Attenuation: The signal fade problem</h3>
        <p className="mt-2">
          As light travels through fiber, the signal gets weaker (attenuation). The rate depends on
          wavelength and fiber type. At 1550 nm (the common long-distance wavelength), SMF loses ~0.18 dB per km.
          Multimode loses ~0.35–0.40 dB/km. Over 1 km, SMF retains ~96% of power; MMF retains ~92%.
          Over 10 km, SMF retains ~84%; MMF would retain ~72%.
        </p>
        <p className="mt-2">
          <strong>CFOS-O exam focus:</strong> Given a span distance and source power, can you estimate
          if the receiver will hear the signal? This is the link-budget calculation (covered in detail in T02).
        </p>

        <h3 className="mt-5 font-semibold">Spectral windows: 1310, 1490, 1550 nm</h3>
        <div className="mt-3 space-y-2 text-slate-300/90">
          <p>
            Fiber losses vary by wavelength. There are three "windows" (low-loss bands):
            <br /><strong>1310 nm (C-band):</strong> Zero-dispersion point for standard SMF. Historically used for long-haul. Lower attenuation than 1550 but higher than 1490.
            <br /><strong>1490 nm:</strong> Intermediate. Lower attenuation than 1310, used in some newer systems.
            <br /><strong>1550 nm (L-band):</strong> Lowest attenuation (~0.18 dB/km SMF). Most common for modern feeder routes. Requires dispersion compensation for very long spans.
          </p>
          <p>
            <strong>In OSP:</strong> You'll see 1310 in older networks, 1550 in newer builds (especially GPON/XG-PON). The exam expects you to know why 1550 is preferred for distance and which effects (dispersion, attenuation, chromatic dispersion) become relevant at each wavelength.
          </p>
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Cable Types and Color Coding in OSP</h2>

        <h3 className="mt-4 font-semibold">Fiber color coding (TIA-598)</h3>
        <p className="mt-2">
          Individual fibers in a cable are color-coded per TIA-598. When you open a cable and see
          multiple colored strands, you're looking at this standard.
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-3 bg-white/5">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Fiber position</th>
              <th className="px-3 py-2 text-left">Color (1st–12 fibers)</th>
              <th className="px-3 py-2 text-left">Example (19th fiber)</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90 text-sm">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">1–12</td>
              <td className="px-3 py-2">Blue, Orange, Green, Brown, Slate, White, Red, Black, Yellow, Violet, Rose, Aqua</td>
              <td className="px-3 py-2">Red (19 = 12 + 7, so 7th color = Red)</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-slate-300/90">
          The color repeats every 12 fibers with a striping pattern (white stripe on the second 12, two stripes on the third, etc.).
          In the field, this matters when you're splicing a specific pair of fibers between two cables — the color
          tells you which fiber is which.
        </p>

        <h3 className="mt-5 font-semibold">Cable jacket types in OSP</h3>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-blue-300">Aerial self-supporting (ASS) cable</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              Has an integral messenger wire (steel strand) for strength. No separate support cable needed.
              Lighter than ADSS. Typical tensile strength: 3,000–6,000 lbs. Used on short to moderate spans (~150 m typical max).
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-green-300">ADSS (All-Dielectric Self-Supporting) cable</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              No metal in the cable (dielectric strength for high-voltage pole crossings). Heavier than ASS.
              Tensile strength: 6,000–15,000 lbs typical. Used where isolation from power lines is critical.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-purple-300">Underground / Direct-Burial (DB) cable</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              Armored jacket with steel/aluminum braid for rodent and impact protection. Installed in conduit
              or direct-buried in the ground. Heavier and stiffer than aerial.
            </p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="font-semibold text-yellow-300">Conduit-rated (inside conduit) cable</p>
            <p className="text-slate-300/90 mt-1 text-sm">
              Lighter outer jacket for pulling through conduit without drag. No armor. Used with rigid or flexible conduit.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Mode strippers and launch conditioning</h3>
        <p className="mt-2">
          When you splice a multimode feeder to a single-mode drop, or when a multimode light source launches
          into multimode fiber, you may need a <strong>mode stripper</strong> — a short section of fiber or device
          that removes high-order modes (light rays bouncing at steep angles). Why? High-order modes contribute
          to dispersion and aren't useful in short spans. Removing them reduces noise and improves reception.
        </p>
        <p className="mt-2">
          <strong>In the field:</strong> If your OTDR trace of a multimode span shows oddly high noise or
          unexpected reflections, mode stripping may help. The exam may ask whether you'd use one in a given scenario.
        </p>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Advanced Fiber Physics for Design Trade-offs</h2>

        <h3 className="mt-4 font-semibold">Chromatic dispersion in long-distance designs</h3>
        <p className="mt-2">
          At 1550 nm, SMF standard has positive chromatic dispersion (~16 ps/nm/km). Over very long distances (20+ km),
          the dispersion starts to matter: different wavelengths arrive at slightly different times, broadening the pulse.
          For 10 Gbps signals, you can go ~80 km before dispersion limiting. For 40 Gbps, ~20 km.
        </p>
        <p className="mt-2">
          <strong>CFOS-O level:</strong> You should know that SMF is chosen for long distance partly because
          dispersion-compensation (using dispersion-compensating fiber or optical equalizers) can recover
          the signal. Multimode doesn't benefit as much because modal dispersion dominates.
        </p>

        <h3 className="mt-5 font-semibold">Fiber grade selection for OSP design</h3>
        <p className="mt-2">
          Given a design brief (e.g., "Deploy fiber to 200 subscriber drops averaging 2 km from the hub, with 10 Gbps service requirement"),
          you must choose fiber type. The CFOS-O exam expects you to:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300/90">
          <li>Estimate link budget (power budget at the receiver end)</li>
          <li>Check if SMF is necessary (generally yes if feeder is >1 km or service speed >1 Gbps)</li>
          <li>Select cable type (ASS for short spans, ADSS for high-voltage areas, DB for underground)</li>
          <li>Specify fiber grade (OS2 for SMF, OM4 or OM5 if any multimode needed)</li>
          <li>Identify potential dispersion limitations and design accordingly</li>
        </ul>

        <h3 className="mt-5 font-semibold">Why this matters in the field</h3>
        <p className="mt-2">
          You're on-site. The designer specified "OS2 multimode in ASS cable" for a 3 km feeder. You look
          at the cable on the truck and see something labeled "OM2" (multimode). You measure the distance.
          It's 3 km. You check the service spec: 10 Gbps. You realize the design is WRONG — multimode at 10 Gbps
          over 3 km will fail the link budget. You stop, contact the designer, get it corrected. The CFOS-O exam
          rewards this kind of critical thinking.
        </p>
      </section>

      {/* ── FLASHCARDS ───────────────────────────────────────────────────── */}
      <Flashcard
        deckId="T21-L02"
        cards={[
          {
            id: 'T21-L02-fc-smf',
            front: 'What is the typical core diameter of single-mode fiber?',
            back: '~8–10 µm (micrometers). The small core allows only the lowest-order mode to propagate, which reduces dispersion and extends distance capability.',
          },
          {
            id: 'T21-L02-fc-mmf',
            front: 'Which OSP scenario favors multimode fiber over single-mode?',
            back: 'Short drop distances (<1 km) where cost matters more than distance. Multimode is cheaper per meter but loses power faster with distance.',
          },
          {
            id: 'T21-L02-fc-att1550',
            front: 'What is the approximate attenuation of single-mode fiber at 1550 nm?',
            back: '~0.18 dB/km. This is the lowest-loss window and is the standard choice for modern OSP feeder routes.',
          },
          {
            id: 'T21-L02-fc-na',
            front: 'What is numerical aperture (NA) and why does it matter for fiber launch?',
            back: 'NA describes which light angles will propagate in a fiber. If the light source NA is higher than the fiber NA, some light is wasted. Matching NA reduces launch losses.',
          },
          {
            id: 'T21-L02-fc-adss',
            front: 'When would you choose ADSS (All-Dielectric) cable over ASS cable?',
            back: 'ADSS is used where isolation from power lines is critical, especially on poles with high-voltage lines. It provides electrical isolation and is stronger.',
          },
        ]}
      />

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <h3 className="mt-6 font-semibold">Lesson Quiz</h3>
      <Quiz
        questions={[
          {
            id: 'T21-L02-Q1',
            type: 'mc',
            prompt: 'For a 3 km OSP feeder route with 10 Gbps service requirement, which fiber type is most appropriate?',
            options: [
              { key: 'a', text: 'OM1 multimode (cost-optimized)' },
              { key: 'b', text: 'OS2 single-mode (distance and speed capable)' },
              { key: 'c', text: 'OM5 multimode (budget allows)' },
              { key: 'd', text: 'Any multimode fiber (all equivalent at this distance)' },
            ],
            correct: 'b',
          },
          {
            id: 'T21-L02-Q2',
            type: 'mc',
            prompt: 'At 1550 nm, single-mode fiber exhibits attenuation of ~0.18 dB/km. Over a 10 km span, approximately what percentage of power remains?',
            options: [
              { key: 'a', text: '64%' },
              { key: 'b', text: '75%' },
              { key: 'c', text: '84%' },
              { key: 'd', text: '96%' },
            ],
            correct: 'c',
          },
          {
            id: 'T21-L02-Q3',
            type: 'mc',
            prompt: 'Why is 1550 nm preferred over 1310 nm for modern OSP feeder routes?',
            options: [
              { key: 'a', text: '1550 nm has lower attenuation (~0.18 vs ~0.28 dB/km)' },
              { key: 'b', text: '1550 nm equipment is cheaper' },
              { key: 'c', text: '1550 nm is immune to dispersion' },
              { key: 'd', text: '1310 nm is obsolete and no longer supported' },
            ],
            correct: 'a',
          },
          {
            id: 'T21-L02-Q4',
            type: 'mc',
            prompt: 'What is the purpose of a mode stripper in multimode fiber spans?',
            options: [
              { key: 'a', text: 'To remove high-order modes that contribute to dispersion and noise' },
              { key: 'b', text: 'To boost signal strength at the receiver' },
              { key: 'c', text: 'To convert multimode to single-mode automatically' },
              { key: 'd', text: 'To prevent cross-talk between adjacent fibers' },
            ],
            correct: 'a',
          },
        ]}
      />
    </LessonLayout>
  );
}
