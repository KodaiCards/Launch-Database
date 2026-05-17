// Net-new content (R-A gap — no prior module source for this topic)
// T02.L10 — Fiber Characterization Testing

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T02.L10',
  course_id: 'T02',
  title: 'Fiber Characterization Testing',
  order: 10,
  lesson_type: 'working',
  prerequisites: ['T02.L02', 'T02.L03', 'T02.L09'],
  vocabulary_introduced: ['fiber characterization', 'CD measurement', 'PMD measurement', 'cut-back method', 'OTDR characterization', 'dispersion slope'],
  key_terms: [
    { term: 'fiber characterization', definition: 'A set of specialized tests -- distinct from standard OTDR acceptance testing -- that measure the fundamental optical properties of the fiber itself: how much it disperses a signal, how much PMD it has. Done on long routes when upgrading to high-speed wavelengths, or when required by contract spec.' },
    { term: 'CD measurement', definition: 'Chromatic Dispersion measurement -- done by field instruments using the phase shift method (most common) or time-of-flight method. Needed when activating 40G or higher on non-dispersion-shifted fiber, or deploying DWDM to calculate dispersion compensation module (DCM) requirements.' },
    { term: 'PMD measurement', definition: 'Measurement of the fiber\'s Polarization Mode Dispersion coefficient using specialized instruments (Jones Matrix Eigenanalysis, GINTY interferometric, or Stokes parameter methods). Must be done on the complete installed link -- not just the factory reel -- because installation stresses can significantly increase PMD.' },
    { term: 'cut-back method', definition: 'The gold-standard method for measuring fiber attenuation. Measure insertion loss on the full fiber length, then cut the fiber back to a short reference length (~2 m) and measure the reference power. The difference divided by the length gives exact dB/km. Destructive -- done in the lab on cable reels, not in the field.' },
    { term: 'OTDR characterization', definition: 'Running an OTDR at multiple wavelengths (1310, 1550, 1625 nm) to get a wavelength-dependent attenuation profile. Reveals water-peak absorption, macrobend locations, stress-induced loss sections, and gainer events (apparent negative-loss splices that are actually backscatter artifacts).' },
    { term: 'dispersion slope', definition: 'How fast chromatic dispersion changes with wavelength, measured in ps/nm-squared/km. Determines how much CD varies across a DWDM channel group -- also measured in CD characterization. Important when calculating dispersion compensation for DWDM systems.' },
  ],
  vocabulary_assumed: [
    { term: 'attenuation', source_lesson_id: 'T02.L02' },
    { term: 'chromatic dispersion', source_lesson_id: 'T02.L03' },
    { term: 'PMD', source_lesson_id: 'T02.L03' },
    { term: 'DGD', source_lesson_id: 'T02.L09' },
    { term: 'dB', source_lesson_id: 'T02.L05' },
    { term: 'dBm', source_lesson_id: 'T02.L05' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
  ],
  estimated_minutes: 20,
};

export default function T02L10_FiberCharacterizationTesting() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          You've learned what attenuation, chromatic dispersion (CD), and PMD are. Now:
          how do you actually <em>measure</em> these properties on installed fiber?
          <strong> Fiber characterization testing</strong> is a set of specialized tests,
          distinct from the standard OTDR acceptance testing you'll do on every job.
          Characterization is done on long routes when upgrading to high-speed wavelengths,
          or as required by the contract spec.
        </p>
        <p className="mt-2">
          Think of it like this: OTDR acceptance testing (T12) tells you where each splice
          and connector is, and how much loss each one has — it's the per-foot inspection.
          Characterization testing tells you the fundamental optical properties of the fiber
          itself (how much it disperses a signal, how much PMD it has) — it's the material
          grade test. You wouldn't do characterization on every job, but you'd definitely
          want it before activating a 100G DWDM system on 30-year-old fiber.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym/Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">CD</td>
              <td className="px-3 py-2">Chromatic Dispersion — remember from T02.L03</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MFD</td>
              <td className="px-3 py-2">Mode Field Diameter — the width of the light distribution in an SMF core</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OTDR</td>
              <td className="px-3 py-2">Optical Time-Domain Reflectometer — the main field test instrument (covered fully in T12)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">IEC 61280-4-2</td>
              <td className="px-3 py-2">International standard for single-mode fiber field attenuation and optical return loss measurement [confirm current edition]</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T02-L10"
          cards={[
            { id: 'T02-L10-fc-chartest', front: 'What is fiber characterization testing?', back: 'Specialized tests -- distinct from standard OTDR acceptance testing -- that measure fundamental optical properties: attenuation coefficient, chromatic dispersion (CD), and PMD. Done on long routes when upgrading to high-speed wavelengths, or when required by contract spec.' },
            { id: 'T02-L10-fc-cdmeas', front: 'When is CD measurement required?', back: 'When activating 40G or higher on non-dispersion-shifted fiber without electronic dispersion compensation, deploying DWDM on existing fiber to calculate dispersion compensation module (DCM) requirements, or characterizing a fiber route for a new high-speed network design.' },
            { id: 'T02-L10-fc-pmdmeas', front: 'Why must PMD measurement be done on the installed link, not just the factory reel?', back: 'Installation stresses from over-tensioned lashing, conduit overfill, or tight bends add birefringence that raises the installed PMD coefficient above the factory reel spec. A fiber that measures 0.1 ps/sqrt(km) on the reel can test significantly higher after installation.' },
            { id: 'T02-L10-fc-cutback', front: 'What is the cut-back method for attenuation measurement?', back: 'The gold-standard lab method: measure insertion loss on the full fiber length, then cut the fiber back to ~2 m and measure the reference power. The difference divided by the length gives exact dB/km. Destructive -- done on cable reels before installation, not in the field.' },
            { id: 'T02-L10-fc-slope', front: 'What is dispersion slope?', back: 'How fast chromatic dispersion changes with wavelength, measured in ps/nm-squared/km. Determines how much CD varies across a DWDM channel group. Important when calculating dispersion compensation for DWDM systems -- a fiber with high dispersion slope requires channel-by-channel compensation.' },
            { id: 'T02-L10-fc-otdrchar', front: 'What is OTDR characterization?', back: 'Running an OTDR at multiple wavelengths (1310, 1550, 1625 nm) to get a wavelength-dependent attenuation profile. Reveals water-peak absorption, macrobend locations, stress-induced loss sections, and gainer events (apparent negative-loss splices that are backscatter artifacts). Distinct from the standard single-wavelength acceptance test.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Four Characterization Tests</h2>

        <h3 className="mt-4 font-semibold">1. Attenuation characterization</h3>
        <p>
          Standard OTDR acceptance testing measures point-to-point loss including splices and
          connectors. Attenuation characterization measures the fiber's intrinsic loss coefficient
          (dB/km) by itself, stripping out connector and splice contributions.
        </p>
        <p className="mt-2">
          The gold-standard method is the <strong>cut-back method</strong>: measure insertion loss
          on a full fiber length, then cut the fiber back to a short reference length (~2 m) and
          measure the reference power. The difference divided by the length gives the exact dB/km.
          This is destructive (you cut the fiber), so it's done in a lab on cable reels before
          installation, not in the field.
        </p>
        <p className="mt-2">
          Field alternative: two-point OTDR measurement, averaging both directions to cancel
          connector contributions. This gives a good attenuation coefficient estimate without
          destructive testing. Per IEC 61280-4-2 [confirm current edition], the measurement
          uncertainty is typically ±0.02 dB/km for well-calibrated instruments.
        </p>

        <h3 className="mt-5 font-semibold">2. Chromatic dispersion (CD) measurement</h3>
        <p>
          CD is measured by one of two field methods:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Phase shift method:</strong> A modulated broadband light source is injected.
            The receiver measures the phase difference between the modulation at different
            wavelengths. The phase shift converts to a time delay, which gives D in ps/(nm·km).
            This is the standard method for field CD measurement.
          </li>
          <li>
            <strong>Time-of-flight method:</strong> Short optical pulses at multiple wavelengths
            are sent, and arrival times are measured. Less precise than phase-shift but usable
            for rough estimates.
          </li>
        </ul>
        <p className="mt-2">
          CD measurements are needed when: (a) activating 40G or higher on non-dispersion-shifted
          fiber without electronic dispersion compensation, (b) deploying DWDM on existing fiber
          to calculate dispersion compensation module (DCM) requirements, or (c) characterizing
          fiber route for a new network design.
        </p>
        <p className="mt-2 text-sm text-slate-300/80">
          G.652.D does not directly specify a dispersion coefficient range at 1550 nm. Instead,
          it specifies: (1) zero-dispersion wavelength λ₀ ∈ [1300, 1324] nm, and (2) maximum
          dispersion slope at λ₀: S₀ ≤ 0.092 ps/(nm²·km). From these parameters, the implied
          dispersion at 1550 nm is approximately <strong>16.7–18.0 ps/(nm·km)</strong>. The
          commonly cited engineering approximation of ~17 ps/(nm·km) is a useful field value
          derived from this spec, not a direct tolerance stated in the standard.
        </p>
        <p className="mt-2 text-sm text-slate-300/80">
          The <strong>dispersion slope</strong> (how fast dispersion changes with wavelength,
          in ps/nm²·km) determines how much CD varies across a DWDM channel group — also
          measured in CD characterization.
        </p>

        <h3 className="mt-5 font-semibold">3. PMD measurement</h3>
        <p>
          PMD is measured by specialized instruments using one of these standard methods:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Jones Matrix Eigenanalysis (JME):</strong> The most common field method.
            Measures the fiber's polarization transfer matrix at multiple wavelengths, then
            computes DGD and PMD coefficient. Accurate and fast. Requires a tunable laser source.
          </li>
          <li>
            <strong>Interferometric method (GINTY):</strong> Uses broadband source + polarization
            optics. Good for installed fiber characterization. IEC 61282-9 [confirm current edition]
            standardizes this method.
          </li>
          <li>
            <strong>Fixed analyzer / Stokes parameter:</strong> Older methods, less common on
            new instruments.
          </li>
        </ul>
        <p className="mt-2">
          PMD measurement must be done on the complete installed link — not just the fiber reel.
          Installation stresses can significantly increase PMD above the factory reel spec.
        </p>

        <h3 className="mt-5 font-semibold">4. OTDR characterization (distance and event mapping)</h3>
        <p>
          An OTDR can also characterize the fiber's backscatter coefficient and attenuation
          coefficient per wavelength. Running an OTDR at multiple wavelengths (1310, 1550, 1625 nm)
          gives a wavelength-dependent attenuation profile that reveals:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Water-peak absorption (if the fiber is pre-G.652.D with high OH content)</li>
          <li>Macrobend locations (elevated loss at 1625 nm vs 1550 nm)</li>
          <li>Stress-induced loss (often shows up as a section with elevated attenuation at all wavelengths)</li>
          <li>Gainer events (apparent negative-loss splices from index/backscatter discontinuities — an artifact, not real gain)</li>
        </ul>

        <SliderExploration
          title="CD Accumulation at 1550 nm — Is This Route DWDM-Ready?"
          description="Drag the sliders to see how total chromatic dispersion accumulates on a candidate DWDM upgrade route. The result tells you how much dispersion compensation (in ps/nm) you'd need to bring the route within tolerance for 10G direct-detection systems."
          variables={[
            {
              key: 'length_km',
              label: 'Route length',
              units: 'km',
              min: 1,
              max: 400,
              step: 1,
              default: 45,
            },
            {
              key: 'D_coeff',
              label: 'Dispersion coefficient at 1550 nm',
              units: 'ps/(nm·km)',
              min: 13,
              max: 21,
              step: 0.5,
              default: 17,
              format: (v) => v.toFixed(1),
            },
          ]}
          compute={({ length_km, D_coeff }) => {
            const total_cd = D_coeff * length_km; // ps/nm total accumulated CD
            // 10G NRZ direct-detection tolerance: typically ±800 ps/nm
            // 40G tolerance: ±40 ps/nm; 100G coherent: managed by DSP
            const limit_10g = 800;
            const limit_40g = 40;
            let status = 'ok';
            let statusMessage = `Total CD = ${total_cd.toFixed(0)} ps/nm — within 10G direct-detection tolerance (±${limit_10g} ps/nm). No dispersion compensation module (DCM) required.`;
            if (total_cd > limit_40g && total_cd <= limit_10g) {
              status = 'warn';
              statusMessage = `Total CD = ${total_cd.toFixed(0)} ps/nm — within 10G limit but exceeds 40G limit (${limit_40g} ps/nm). A 40G upgrade needs dispersion compensation. Estimated DCM: ${total_cd.toFixed(0)} ps/nm compensation fiber.`;
            } else if (total_cd > limit_10g) {
              status = 'error';
              statusMessage = `Total CD = ${total_cd.toFixed(0)} ps/nm — exceeds 10G direct-detection limit (${limit_10g} ps/nm). Requires dispersion compensation module (DCM) or coherent optics. Approximate DCM needed: ${total_cd.toFixed(0)} ps/nm.`;
            }
            return {
              result: total_cd,
              label: 'Total accumulated CD at 1550 nm',
              unit: 'ps/nm',
              status,
              statusMessage,
              decimals: 0,
            };
          }}
          annotations={[
            { value: 800, label: '10G limit (800 ps/nm)', color: '#fbbf24' },
            { value: 40,  label: '40G limit (40 ps/nm)',  color: '#f87171' },
          ]}
        />

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Fiber characterization is a comprehensive test suite required
            before activating any high-speed system.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Most OSP construction jobs don't require full
            characterization — a Tier-2 OTDR acceptance test (bi-directional at 1310 + 1550 nm)
            is the standard contractual deliverable for new fiber. Characterization is specifically
            required when: (a) the network operator is activating DWDM/coherent wavelengths,
            (b) the route uses existing fiber being upgraded, or (c) the contract specification
            explicitly requires it. The test equipment (CD/PMD analyzer) is expensive and specialized
            — it's subcontracted or done by the network operator's test team, not usually by the
            OSP construction crew.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper — Gainer Events on OTDR</h2>
        <p>
          A "gainer" is an apparent negative-loss event visible on an OTDR trace — a splice
          that looks like it's adding signal rather than losing it. This sounds physically
          impossible, and it is — it's an artifact of the way OTDRs measure loss.
        </p>
        <p className="mt-2">
          OTDR measures loss by comparing the power of backscattered light before and after an
          event. The backscatter coefficient depends on the fiber's physical properties. When
          two fibers with different backscatter coefficients are spliced (e.g., two fiber
          batches from different manufacturers, or a fiber with slightly different doping),
          the OTDR can underestimate the loss in one direction and overestimate it in the
          other. The bidirectional average is the true loss. If you see a "gainer" on a
          one-direction OTDR trace, always run bidirectional and average — the true splice
          loss is the average, never negative.
        </p>
        <p className="mt-2">
          Bidirectional averaging is standard practice (IEC 61280-4-2 [confirm current edition])
          for exactly this reason. A splice that looks like −0.3 dB in one direction might be
          +0.3 dB in the other — the true loss is 0.0 dB (a perfect splice) if the "gainer"
          is purely a backscatter artifact.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T02.L10 Check — Fiber Characterization"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L10-Q1',
            type: 'mc',
            prompt:
              'A carrier is upgrading an 80 km G.652 fiber route from 10 Gb/s to 100 Gb/s DWDM. Which characterization tests are most important before activation?',
            choices: [
              'Only OTDR testing at 1310 nm — the route is already G.652',
              'CD characterization (to calculate dispersion compensation module requirements) and PMD measurement (to verify the route is within 100G coherent system tolerances)',
              'Attenuation cut-back test on all fiber reels — no field tests needed',
              'Connector end-face inspection only — 100G is self-correcting for dispersion',
            ],
            answerIndex: 1,
            explanation:
              'For a DWDM upgrade, the critical parameters are: (1) CD profile per channel to calculate how much dispersion compensation is needed, and (2) PMD to confirm the fiber is within the 100G coherent system\'s tolerance. A standard OTDR trace won\'t reveal the CD or PMD of the fiber — those require dedicated characterization instruments. Connector inspection is also important but isn\'t the characterization gap.',
            citation: 'ITU-T G.652.D; ITU-T G.Sup39 [confirm edition] — field test methods for WDM transmission.',
          },
          {
            id: 'T02-L10-Q2',
            type: 'mc',
            prompt:
              'An OTDR trace shows a "gainer" event at a splice — the splice appears to have −0.2 dB loss (i.e., power increased after the splice). What should the technician do?',
            choices: [
              'Accept the result — the splice is working perfectly and adding signal',
              'Replace the splice immediately — negative loss indicates a bad physical connection',
              'Run a bidirectional OTDR test and average the two measurements — the apparent gain is a backscatter artifact caused by differing fiber backscatter coefficients, not real optical gain',
              'Re-run the OTDR with a shorter pulse width to eliminate the artifact',
            ],
            answerIndex: 2,
            explanation:
              'Gainers are OTDR backscatter artifacts when two fibers with different backscatter coefficients are spliced. The bidirectional average is the true splice loss — if one direction shows −0.2 dB and the other shows +0.4 dB, the true splice loss is (−0.2 + 0.4) / 2 = 0.1 dB. Accepting a negative loss reading as real would cause you to record a splice loss that doesn\'t exist.',
            fieldNote:
              'Bidirectional OTDR testing is standard practice (IEC 61280-4-2). Never sign off on a splice log with un-averaged one-directional values — especially when you see gainers. Most OTDR analysis software can automatically compute bidirectional averages when you load both traces.',
          },
          {
            id: 'T02-L10-Q3',
            type: 'fill-in-blank',
            prompt:
              'The field method for CD measurement that uses a modulated broadband source and measures the phase difference between wavelengths is called the ____ method.',
            answer: /phase.?shift|phase shift/i,
            answerDisplay: 'phase shift method',
            explanation:
              'The phase shift method measures chromatic dispersion by injecting a sinusoidally modulated broadband optical signal and measuring the relative phase of the detected signal at different wavelengths. The phase difference is proportional to the group delay difference, from which the dispersion coefficient D (ps/nm·km) is calculated.',
          },
        ]}
      />

    </LessonLayout>
  );
}
