// Migrated from M01 §1.2 (attenuation table + book/field callouts preserved; expanded with WorkedExample)
// T02.L02 — Attenuation: Three Numbers Framework

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';

export const meta = {
  id: 'T02.L02',
  course_id: 'T02',
  title: 'Attenuation — Three Numbers Framework',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T02.L01'],
  vocabulary_introduced: ['attenuation', 'dB/km', 'spec maximum', 'typical datasheet value', 'designer planning value'],
  key_terms: [
    { term: 'attenuation', definition: 'Signal loss as light travels through fiber — absorbed or scattered by the glass molecules. It\'s the "loss rate" of the fiber. The higher the number, the more signal you lose per kilometer of cable.' },
    { term: 'dB/km', definition: 'Decibels per kilometer — the unit of fiber attenuation, measuring how much signal is lost per kilometer of cable. Think of it as a "loss rate": a higher number means more signal lost per km.' },
    { term: 'spec maximum', definition: 'The highest allowed loss for a fiber to qualify as meeting a standard (e.g., ITU-T G.652.D). No manufacturer ships fiber this bad intentionally — it\'s the rejection threshold, not a typical value.' },
    { term: 'typical datasheet value', definition: 'What a specific manufacturer\'s fiber actually measures in a production run. Significantly better than the spec maximum — this is what you get when you pull a reel out of the box.' },
    { term: 'designer planning value', definition: 'A round number, slightly above the typical datasheet value, that OSP designers use as their working assumption. It leaves a small margin for aging, temperature variation, and procurement uncertainty.' },
  ],
  learning_objectives: [
    'Identify the three attenuation sources in fiber (absorption, scattering, macrobend/microbend)',
    'Quantify attenuation in dB per kilometer for different wavelengths and fiber types',
    'Apply RUS 7 CFR 1755.902 attenuation limits to verify cable suitability for a planned link distance',
    'Predict system link margin by subtracting total attenuation from source-receiver optical power specifications',
  ],
  vocabulary_assumed: [
    { term: 'total internal reflection', source_lesson_id: 'T02.L01' },
    { term: 'core', source_lesson_id: 'T02.L01' },
    { term: 'cladding', source_lesson_id: 'T02.L01' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
    { term: 'fiber', source_lesson_id: 'T01.L03' },
  ],
  estimated_minutes: 30,
};

export default function T02L02_AttenuationThreeNumbers() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Recall from the Parts of a Cable lesson that <strong>fiber</strong> is the optical glass strand at the center of a cable, where light actually travels. Every time light travels through fiber, some of it is lost — absorbed or scattered
          by the glass molecules. This loss is called <strong>attenuation</strong>. It's measured
          in <strong>dB/km</strong> (decibels per kilometer — a unit we'll fully unpack in the
          Decibels lesson coming up later in this topic). For now, think of dB/km as a "loss rate": the higher the number, the more
          signal you lose per kilometer of cable.
        </p>
        <p className="mt-2">
          The tricky part is that attenuation has <em>three different numbers</em> depending on
          who's quoting it — the standards body, the vendor, or the OSP designer. Mixing these
          up is one of the most common mistakes on link budget calculations. This lesson gives
          you the framework to keep them straight.
        </p>

        <h3 className="mt-5 font-semibold">Building on Why Light Travels in Glass and Fundamentals &amp; Vocabulary</h3>
        <p className="text-sm text-slate-300/90">
          In Why Light Travels in Glass, you learned how light travels through a fiber <strong>core</strong> via <strong>total internal reflection</strong>, and how the <strong>cladding</strong> around it confines the light. This lesson explains what happens when some of that light is <em>not</em> confined — it gets absorbed or scattered, causing <strong>attenuation</strong>. The <strong>fiber</strong> types (like <strong>SMF</strong>, introduced in Key Acronyms Field Reference) have different attenuation rates. Attenuation is the foundation of the link-budget calculations you'll use in the Link Budget lesson later in this topic.
        </p>

        <div className="mt-4 p-4 border border-blue-400/30 bg-blue-400/5 rounded-lg text-sm">
          <p className="font-semibold text-blue-300 mb-2">Refresher: Key prerequisites</p>
          <ul className="text-slate-300/90 space-y-1 list-disc pl-5">
            <li><strong>Total internal reflection:</strong> The mirror-like effect that confines light inside the fiber core (from Why Light Travels in Glass)</li>
            <li><strong>Single-Mode Fiber (SMF):</strong> A 9 µm core fiber used for long-distance OSP (from Key Acronyms Field Reference)</li>
            <li><strong>Core and cladding:</strong> The two glass layers that create the TIR effect (from Why Light Travels in Glass)</li>
          </ul>
        </div>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term / Acronym</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">dB/km</td>
              <td className="px-3 py-2">Decibels per kilometer — the unit of fiber attenuation (loss per unit length)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ITU-T G.652.D</td>
              <td className="px-3 py-2">International Telecommunication Union standard for standard single-mode fiber</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TIA-568</td>
              <td className="px-3 py-2">Telecommunications Industry Association cabling standard — specifies connector and cable performance for structured cabling</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The three numbers — and why they differ</h3>
        <p className="mt-2">
          Think of it like a speed limit sign (standards max), actual car speed (typical datasheet),
          and how fast a cautious driver plans (designer planning value):
        </p>
        <ul className="list-disc pl-5 space-y-3 mt-2">
          <li>
            <strong>Spec maximum (ITU-T G.652.D worst case)</strong> — The highest allowed loss
            for fiber to qualify as G.652.D standard. No manufacturer ships fiber this bad, but
            it's the boundary. If you use this for budgeting, you're planning for the absolute
            worst fiber that's still in-spec.
          </li>
          <li>
            <strong>Typical datasheet value</strong> — What a specific manufacturer's fiber actually
            measures in a production run. This is what you get when you pull a reel out of the box.
            It's significantly better than the spec maximum.
          </li>
          <li>
            <strong>Designer planning value</strong> — A round number, slightly above the typical
            datasheet, that OSP designers use as their working assumption. It leaves a small margin
            for aging, temperature variation, and the uncertainty of not knowing the exact reel
            you'll get on a job.
          </li>
        </ul>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L02"
          cards={[
            { id: 'T02-L02-fc-attenuation', front: 'What is attenuation in fiber optics?', back: 'Signal loss as light travels through fiber — absorbed or scattered by the glass molecules. It\'s the "loss rate" of the fiber. The higher the number, the more signal you lose per kilometer of cable.' },
            { id: 'T02-L02-fc-dbkm', front: 'What does dB/km measure?', back: 'Decibels per kilometer — the unit of fiber attenuation, measuring how much signal is lost per kilometer of cable. Think of it as a "loss rate": a higher number means more signal lost per km.' },
            { id: 'T02-L02-fc-specmax', front: 'What is the "spec maximum" for fiber attenuation?', back: 'The highest allowed loss for a fiber to qualify as meeting a standard (e.g., ITU-T G.652.D ≤ 0.30 dB/km @ 1550 nm). It\'s the rejection threshold, not a typical value — no manufacturer ships fiber this bad on purpose.' },
            { id: 'T02-L02-fc-datasheet', front: 'What is the "typical datasheet value" for fiber attenuation?', back: 'What a specific manufacturer\'s fiber actually measures in a production run. Significantly better than the spec maximum — this is what you get when you pull a reel out of the box (e.g., 0.18–0.22 dB/km @ 1550 nm for G.652.D).' },
            { id: 'T02-L02-fc-planvalue', front: 'What is a "designer planning value" for fiber attenuation?', back: 'A round number, slightly above the typical datasheet value, that OSP designers use as their working assumption (e.g., 0.22–0.25 dB/km @ 1550 nm). It leaves a small margin for aging, temperature variation, and procurement uncertainty.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Numbers by Wavelength</h2>
        <p>
          Attenuation varies by wavelength — different colors of light have different loss rates
          in the same fiber. Here are the three-number framework values for standard G.652.D SMF:
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Wavelength</th>
                <th className="px-3 py-2 text-left">ITU-T G.652.D max</th>
                <th className="px-3 py-2 text-left">Typical datasheet</th>
                <th className="px-3 py-2 text-left">Designer planning value</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1310 nm</td>
                <td className="px-3 py-2">≤ 0.40 dB/km</td>
                <td className="px-3 py-2">≈ 0.32–0.36 dB/km</td>
                <td className="px-3 py-2">0.35–0.36 dB/km</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1550 nm</td>
                <td className="px-3 py-2">≤ 0.30 dB/km</td>
                <td className="px-3 py-2">≈ 0.18–0.22 dB/km</td>
                <td className="px-3 py-2">0.22–0.25 dB/km</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">1625 nm</td>
                <td className="px-3 py-2">≤ 0.40 dB/km</td>
                <td className="px-3 py-2">≈ 0.20–0.23 dB/km</td>
                <td className="px-3 py-2">0.25 dB/km</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Sources: ITU-T G.652 (2024 edition) for
          spec-max column. Typical-datasheet column based on published vendor datasheets (Corning
          SMF-28, Prysmian, OFS). Designer planning values are standard OSP practice; always
          confirm with the project's actual fiber datasheet.
        </p>

        <h3 className="mt-5 font-semibold">Why 1550 nm has lower attenuation than 1310 nm</h3>
        <p>
          The main loss mechanisms in glass are:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Rayleigh scattering</strong> — light scattering from microscopic density
            variations in the glass. This is proportional to 1/λ⁴, so it drops steeply as
            wavelength increases. At 1550 nm, Rayleigh scattering is much less than at 1310 nm.
          </li>
          <li>
            <strong>Infrared absorption</strong> — the glass itself absorbs at very long wavelengths
            (beyond 1700 nm). This loss rises steeply past 1600 nm.
          </li>
          <li>
            <strong>OH⁻ water peak</strong> — a sharp loss spike around 1383 nm caused by
            hydroxyl ions (OH⁻, also called hydroxyl or water molecules bonded into the glass
            during manufacturing) in the glass. These tiny chemical residues vibrate at a
            frequency that absorbs 1383 nm light strongly. G.652.D fibers are "water-peak
            reduced" — the manufacturing process keeps OH⁻ low enough that the peak is
            suppressed to usable levels. Older G.652.B fibers have a much larger water peak.
            <strong> CWDM hazard:</strong> G.652.B cannot reliably carry CWDM channels near
            1383 nm because excess attenuation in that band can run 5–10 dB above G.652.D's
            low-water-peak spec. If installing CWDM on legacy G.652.B plant, exclude the
            1383 nm channel from the CWDM plan.
          </li>
        </ul>
        <p className="mt-2">
          At 1550 nm, Rayleigh scattering is low and infrared absorption hasn't climbed yet —
          so 1550 nm sits in the sweet spot of minimum loss. That's why long-haul systems use it.
        </p>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (BICSI OSPDRM / FOA):</strong> Textbooks plug in ITU-T G.652.D maximum
            values (0.40/0.30 dB/km) as the planning numbers. This is conservative — it guarantees
            the budget works even with the worst qualifying fiber.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field practice:</strong> Experienced OSP designers use 0.35 dB/km at 1310 nm
            and 0.22–0.25 dB/km at 1550 nm. Using the G.652.D maximum "≤ 0.30 dB/km" at 1550 nm
            wastes budget headroom — actual installed fiber is typically 0.18–0.22 dB/km.
            The right number is: whatever the actual project datasheet says, rounded up by 0.02–0.05
            for a planning margin.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk of mixing them up:</strong> If you use the G.652.D spec max for
            connector loss (too conservative) and the vendor typical for fiber loss (too optimistic),
            your budget isn't internally consistent. Pick one tier and stick with it through the
            entire calculation.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Connector and Splice Loss Numbers</h2>
        <p>
          Fiber loss in a link isn't just the cable. Every connector and splice adds loss.
          The three-number framework applies here too:
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Loss source</th>
                <th className="px-3 py-2 text-left">Standards max</th>
                <th className="px-3 py-2 text-left">Typical field</th>
                <th className="px-3 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Connector (mated pair)</td>
                <td className="px-3 py-2">0.75 dB (TIA-568 legacy max)</td>
                <td className="px-3 py-2">0.30–0.50 dB</td>
                <td className="px-3 py-2">TIA-568.3-D introduced reference-grade class with tighter max</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Fusion splice</td>
                <td className="px-3 py-2">0.15 dB (FOA planning value)</td>
                <td className="px-3 py-2">≤ 0.05 dB (field target)</td>
                <td className="px-3 py-2">Acceptance criteria is often ≤ 0.10 dB bidirectional average</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Mechanical splice</td>
                <td className="px-3 py-2">0.30–0.50 dB typical</td>
                <td className="px-3 py-2">Higher than fusion; avoid in OSP if possible</td>
                <td className="px-3 py-2">Used for temporary/emergency repairs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-slate-300/80">
          The TIA-568 connector max has changed across revisions (legacy 0.75 dB → current standard
          and reference-grade categories with tighter values). If a spec sheet just says
          "TIA-568 compliant" without a revision letter and connector grade, push back — you can't
          determine the planning value without knowing which version and class applies.
        </p>
      </section>

      {/* ── WORKED EXAMPLE ──────────────────────────────────────────────── */}
      <WorkedExample
        title="Fiber Loss Budget — The Three Numbers in Action"
        description="Calculate total fiber attenuation for a span using all three attenuation values. See how much difference it makes which number you choose."
        variables={[
          { key: 'length_km', label: 'Fiber span length', units: 'km', default: 18, min: 0.5, max: 100, step: 0.5 },
          { key: 'atten_dBkm', label: 'Attenuation rate (your choice)', units: 'dB/km', default: 0.25, min: 0.18, max: 0.40, step: 0.01 },
        ]}
        formula={({ length_km, atten_dBkm }) => length_km * atten_dBkm}
        steps={({ length_km, atten_dBkm }, result) => [
          { expression: 'Fiber loss = length × attenuation rate', },
          { expression: `Fiber loss = ${length_km} km × ${atten_dBkm} dB/km`, value: result, unit: 'dB' },
        ]}
        sanityCheck={(result, { length_km, atten_dBkm }) =>
          `Over ${length_km} km at ${atten_dBkm} dB/km, the fiber alone loses ${result.toFixed(2)} dB. ` +
          (atten_dBkm <= 0.22
            ? 'This is using a realistic datasheet-typical value — your actual reel should perform close to this.'
            : atten_dBkm <= 0.30
            ? 'This is a good planning value with a reasonable margin above typical datasheet performance.'
            : 'This is near the G.652.D spec maximum — the most conservative possible planning assumption.')
        }
        resultLabel="Fiber attenuation"
        resultUnit="dB"
        resultDecimals={2}
      />

      <ReferencesBlock
        items={[
          { citation: 'ITU-T G.652.D', note: 'Standard single-mode fiber — the attenuation spec-maximum column in the three-numbers table.' },
          { citation: 'TIA-568.3-D', note: 'Cabling standard covering connector loss categories (standard vs. reference-grade).' },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T02"
        assessmentId="T02-L02"
        title="Check — Attenuation Three Numbers"
        fallback={
        <Quiz
          title="Check — Attenuation Three Numbers"
          mode="multiple-choice"
          questions={[
            {
              id: 'T02-L02-Q1',
              type: 'mc',
              prompt:
                'A G.652.D fiber link is being budgeted at 1550 nm. Which attenuation value is most defensible to use when the actual cable datasheet is not yet available?',
              choices: [
                '0.18 dB/km — the best vendor "typical" figure seen in recent datasheets',
                '0.22–0.25 dB/km — slightly above typical datasheet, leaving margin for aging and uncertainty',
                '0.30 dB/km — the ITU-T G.652.D specification maximum',
                '0.50 dB/km — a safe round conservative figure for any SMF',
              ],
              answerIndex: 1,
              explanation:
                '0.22–0.25 dB/km is the standard OSP designer planning value at 1550 nm. Using the 0.18 dB/km typical leaves no margin; using 0.30 dB/km (spec max) wastes headroom. Always confirm with the actual project datasheet once the fiber is specified.',
              citation:
                'ITU-T G.652.D (2024) — attenuation coefficient ≤ 0.30 dB/km @ 1550 nm max. Vendor datasheets (Corning SMF-28 Ultra, etc.) typically show 0.18–0.22 dB/km.',
              fieldNote:
                'On RUS-program jobs, you often don\'t know the exact fiber reel until materials are procured. The 0.22–0.25 dB/km planning value is the standard "design-before-procurement" assumption across most OSP firms.',
            },
            {
              id: 'T02-L02-Q2',
              type: 'mc',
              prompt:
                'The G.652.D spec maximum at 1550 nm is ≤ 0.30 dB/km, but typical production fiber measures 0.18–0.22 dB/km. Why is the spec maximum so much higher than what you actually get?',
              choices: [
                'Standards bodies deliberately inflate numbers to be bribed by fiber manufacturers',
                'The spec maximum is the worst-case boundary for qualifying fiber — any fiber performing worse than this fails G.652.D. It\'s not a typical value; it\'s a rejection threshold.',
                'The 0.30 dB/km figure applies only to 1310 nm, not 1550 nm',
                'Fiber attenuation increases over time, so the spec allows headroom for aging to 0.30 dB/km',
              ],
              answerIndex: 1,
              explanation:
                'Spec maximums are quality thresholds, not typical performance targets. A fiber measuring 0.30 dB/km barely passes G.652.D. Production fiber is designed well inside the spec to ensure reliable yield. The gap between spec-max and typical is a quality margin, not an error.',
              citation: 'ITU-T G.652.D (2024 edition).',
            },
            {
              id: 'T02-L02-Q3',
              type: 'fill-in-blank',
              prompt:
                'A spec sheet says "TIA-568 compliant" for connectors but doesn\'t specify a revision or connector grade. The loss value you can plan around is ____.',
              answer: /ambiguous|unknown|unclear|cannot be determined|not determinable/i,
              answerDisplay: 'ambiguous / cannot be determined without knowing the revision and connector grade',
              explanation:
                'TIA-568 connector loss values have changed across revisions and now distinguish between standard and reference-grade connector categories. "TIA-568 compliant" without a revision letter is too vague for planning — the difference between connector grades can be a factor of two or more in loss budget terms.',
              citation: 'TIA-568.3-D — reference-grade connector loss categories.',
              fieldNote:
                'The practical workaround: ask for a tested loss certificate per connector/cord from the vendor. That sidesteps the revision ambiguity entirely.',
            },
            {
              id: 'T02-L02-Q4',
              type: 'dragdrop',
              prompt:
                'Match each attenuation value to the correct category for G.652.D SMF at 1550 nm.',
              items: [
                { id: 'v030', label: '≤ 0.30 dB/km' },
                { id: 'v022', label: '0.22–0.25 dB/km' },
                { id: 'v018', label: '≈ 0.18–0.22 dB/km' },
              ],
              targets: [
                { id: 'spec', label: 'ITU-T G.652.D specification maximum' },
                { id: 'plan', label: 'Designer planning value' },
                { id: 'typical', label: 'Typical vendor datasheet value' },
              ],
              correctMap: {
                spec: 'v030',
                plan: 'v022',
                typical: 'v018',
              },
              explanation:
                'The spec maximum (≤ 0.30 dB/km) is the worst-case standard threshold. Typical datasheets show 0.18–0.22 dB/km. Designers plan around 0.22–0.25 dB/km — above typical to leave margin, well below spec-max to avoid over-conservatism.',
              citation: 'ITU-T G.652.D (2024); vendor datasheets; OSP design practice.',
            },
          ]}
        />
        }
      />

      {/* ── TYING IT TOGETHER ─────────────────────────────────────────── */}
      <div className="lesson-callout mt-8 bg-blue-400/5 border border-blue-400/30">
        <h4>Tying It Together: Three Numbers, One Fiber</h4>
        <p className="text-sm text-slate-300/90">
          Attenuation is the signal loss rate built into the fiber material itself. A standards body publishes a spec maximum (the worst fiber allowed to pass). A vendor publishes a typical value (what they actually ship). A designer chooses a planning value (a margin above typical, below spec-max) to use in link-budget calculations. Mixing these three up is one of the fastest ways to fail a link-budget: using spec-max in the math makes the budget look ten times worse than reality. The next lesson, on dispersion, adds a second piece to this picture, and later lessons on decibels and link budgets will show you how to combine attenuation and dispersion into a full link budget.
        </p>
      </div>

    </LessonLayout>
  );
}
