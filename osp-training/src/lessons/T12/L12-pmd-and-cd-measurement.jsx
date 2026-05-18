// T12.L12 — PMD and CD Measurement
// Advanced lesson: PMD measurement, CD measurement, budgets, FOTP, G.652.D limits
// R-2 correction X-3 applied: G.652.D PMD = 0.2 ps/√km (NOT 0.5 ps/√km which is G.652A/C)
// Source: ITU-T G.652.D | TIA-455-124A | TIA-455-168A | EXFO Chromatic Dispersion Guide

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L12',
  course_id: 'T12',
  title: 'PMD and CD Measurement',
  order: 12,
  lesson_type: 'advanced',
  prerequisites: ['T12.L01', 'T02.L08', 'T02.L07'],
  learning_objectives: [
    'Explain what Polarization Mode Dispersion (PMD) is and how it limits high-speed transmission',
    'State the ITU-T G.652.D PMD coefficient limit and distinguish it from the legacy G.652A/C limit',
    'Describe the PMD budget calculation for a multi-span link',
    'Explain what Chromatic Dispersion (CD) is and when CD measurement is required for OSP acceptance',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'PMD',
    'DGD',
    'CD',
    'PMD coefficient',
    'FOTP',
  ],
  vocabulary_assumed: [
    { term: 'G.652.D', source_lesson_id: 'T02.L01' },
    { term: 'wavelength window', source_lesson_id: 'T02.L07' },
    { term: 'OLTS', source_lesson_id: 'T01.L08' },
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
  ],
  key_terms: [
    {
      term: 'PMD',
      definition:
        'A fiber impairment caused by slight differences in the propagation speed of two orthogonal polarization components of the optical signal. In a perfectly circular, stress-free singlemode fiber, both polarization states travel at the same speed. In real fiber (slightly elliptical core, internal stress), one polarization travels faster than the other. The resulting time delay between the two components (DGD) causes pulse broadening and inter-symbol interference at high bit rates. PMD is measured in picoseconds (ps) or normalized as a PMD coefficient in ps/√km.',
    },
    {
      term: 'DGD',
      definition:
        'The instantaneous time difference between the fast and slow polarization modes at a given wavelength. DGD varies randomly with wavelength and time (environmental stress, temperature). OTDR-measured PMD represents the mean DGD over a statistical distribution. System designers use PMD = coefficient × √(span length) to calculate the maximum expected DGD for budget compliance.',
    },
    {
      term: 'CD',
      definition:
        'The broadening of optical pulses caused by different wavelengths (colors) of light traveling at different speeds in the fiber. Consists of two components: material dispersion (a property of the silica glass) and waveguide dispersion (a property of the fiber\'s index profile). CD is expressed in ps/(nm·km) — how many picoseconds of pulse broadening per nanometer of source linewidth per kilometer of fiber. G.652.D at 1550 nm: CD ≈ 17 ps/(nm·km). Zero-dispersion wavelength (ZDW) for G.652.D: typically 1302–1322 nm.',
    },
    {
      term: 'PMD coefficient',
      definition:
        'The normalized PMD of a fiber expressed in ps/√km. Used to calculate the total PMD for any span length: PMD_total = PMD_coefficient × √(length_km). G.652.D maximum PMD coefficient = 0.2 ps/√km (ITU-T G.652 subpart D). Legacy G.652A and G.652C fibers have a maximum PMD coefficient of 0.5 ps/√km — these older fiber types cannot support 40 Gbps or higher without dispersion compensation. Modern OSP builds should use G.652.D.',
    },
    {
      term: 'FOTP',
      definition:
        'A TIA standard measurement procedure for a specific fiber optic parameter. FOTPs are numbered sequentially (e.g., TIA-455-61 = FOTP-61, the OTDR measurement procedure). Relevant FOTPs for PMD and CD: TIA-455-124 (PMD measurement) and TIA-455-168 (CD measurement). When a contract specifies "per FOTP-124," it means the PMD measurement must follow the TIA-455-124 procedure.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L12_PMDandCD() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Two Types of Dispersion That Limit High-Speed Fiber Links</h2>

        <p>
          Dispersion is any effect that causes an optical pulse to broaden in time as it travels
          through fiber. If pulses spread out too much, they overlap, and the receiver can no
          longer distinguish a "1" from a "0." Longer spans and higher bit rates are both more
          susceptible to dispersion.
        </p>
        <p>
          There are two distinct types of dispersion that OSP engineers need to understand for
          high-speed (10 Gbps and above) links:
        </p>

        <h3>Chromatic Dispersion (CD)</h3>
        <p>
          Different wavelengths of light travel at slightly different speeds through silica fiber.
          A laser source isn't perfectly monochromatic — it emits a narrow range of wavelengths
          (called the "spectral width" or "linewidth"). The faster and slower wavelengths within
          that range arrive at the far end at slightly different times, causing the pulse to
          spread out.
        </p>
        <p>
          Analogy: imagine sending a group of runners who all run at slightly different speeds.
          They start together, but after a few miles, the faster runners are ahead and the slower
          ones behind. The group has "spread out." CD does the same thing to wavelengths within
          a pulse.
        </p>
        <p>
          G.652.D fiber at 1550 nm has approximately 17 ps/(nm·km) of CD. For a 1 nm linewidth
          source over 100 km: 17 × 1 × 100 = 1,700 ps = 1.7 ns of pulse broadening.
          At 10 Gbps, one bit period is 100 ps — so 1,700 ps of broadening would completely
          destroy the signal without CD compensation.
        </p>

        <h3>Polarization Mode Dispersion (PMD)</h3>
        <p>
          Light in a singlemode fiber travels in one spatial mode, but that mode has two
          polarization states (think: horizontally-polarized light and vertically-polarized light
          sharing the same fiber core). In a perfect circular fiber, both polarizations travel
          at exactly the same speed. In real fiber — which is never perfectly circular — one
          polarization travels slightly faster than the other.
        </p>
        <p>
          The time delay between the two polarization states is the <strong>Differential Group
          Delay (DGD)</strong>. It causes pulse broadening because part of each pulse arrives
          early (fast polarization) and part arrives late (slow polarization). The DGD varies
          randomly with wavelength and environmental conditions (temperature, vibration, stress).
        </p>
        <p>
          Unlike CD, PMD cannot be compensated with a passive dispersion compensation module (DCM).
          It requires either PMD compensation equipment (expensive, used in long-haul systems) or
          fiber with very low PMD.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>PMD Budget Calculation</h2>

        <p>
          The PMD specification for a fiber span uses the PMD coefficient (ps/√km):
        </p>
        <blockquote>
          <strong>PMD_total = PMD_coefficient × √(span_length_km)</strong>
        </blockquote>
        <p>
          The √ relationship reflects the statistical (random) nature of PMD — it accumulates
          less quickly than attenuation (which is linear). This is why long spans don't have
          catastrophically higher PMD than short spans.
        </p>

        <WorkedExample
          title="PMD budget check: 10 Gbps NRZ system on G.652.D fiber, 80 km span"
          formula="PMD_total = PMD_coefficient × √(L)"
          variables={[
            { symbol: 'PMD_coefficient', label: 'G.652.D maximum PMD coefficient', value: 0.2, unit: 'ps/√km' },
            { symbol: 'L', label: 'Span length', value: 80, unit: 'km' },
            { symbol: 'PMD_limit_10G', label: 'System PMD limit for 10 Gbps NRZ (rule of thumb: 1/10 bit period)', value: 10, unit: 'ps' },
          ]}
          steps={[
            'PMD_total = 0.2 ps/√km × √(80 km)',
            'PMD_total = 0.2 × 8.944 = 1.79 ps',
            'System PMD limit for 10 Gbps NRZ = 1/10 × bit_period = 1/10 × 100 ps = 10 ps',
            'PMD_total (1.79 ps) << System limit (10 ps) → PASS with large margin',
          ]}
          answer="1.79 ps total PMD on an 80 km G.652.D span — passes the 10 Gbps PMD budget with significant margin."
          sanityCheck="G.652.D with PMD ≤ 0.2 ps/√km supports 10 Gbps NRZ up to approximately 2,500 km before PMD becomes the limiting factor (10 ps limit ÷ 0.2 ps/√km)² = 2,500 km). PMD is generally not the limiting impairment for OSP metro builds on modern G.652.D fiber. Compare this to older G.652A fiber (PMD ≤ 0.5 ps/√km): on the same 80 km span, PMD = 0.5 × 8.944 = 4.47 ps — still passes at 10 Gbps, but fails at 40 Gbps (PMD limit ≈ 2.5 ps for 40 Gbps)."
        />

        <h3>G.652.D vs. G.652A/C — the PMD generation gap</h3>
        <table>
          <thead>
            <tr><th>Fiber type</th><th>Max PMD coefficient</th><th>10 Gbps status</th><th>40 Gbps status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>G.652.D (modern)</td>
              <td>≤ 0.2 ps/√km</td>
              <td>Supports with large margin</td>
              <td>Supports on typical metro spans</td>
            </tr>
            <tr>
              <td>G.652A/B (legacy)</td>
              <td>≤ 0.5 ps/√km</td>
              <td>Supports (marginal on very long spans)</td>
              <td>May fail — requires per-span PMD measurement</td>
            </tr>
            <tr>
              <td>G.652C (low-water-peak)</td>
              <td>≤ 0.5 ps/√km</td>
              <td>Supports (same as G.652A)</td>
              <td>Same risk as G.652A</td>
            </tr>
          </tbody>
        </table>
        <p>
          <strong>Field note:</strong> Most fiber installed in the last 15–20 years is G.652.D.
          Legacy plant from the 1990s and early 2000s may be G.652A or G.652B. When upgrading
          existing OSP routes from 10 Gbps to 40 Gbps or 100 Gbps, always verify the fiber
          generation via as-built records or direct PMD measurement before committing to the upgrade.
        </p>

        <h3>When is PMD/CD measurement required on OSP acceptance tests?</h3>
        <table>
          <thead>
            <tr><th>Test type</th><th>Required for?</th><th>Standard</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>OLTS + OTDR (Tier 1 + 2)</td>
              <td>All OSP acceptance tests</td>
              <td>TIA-526-7 / RUS 1753F-401</td>
            </tr>
            <tr>
              <td>PMD measurement (FOTP-124)</td>
              <td>Required for 40 Gbps+ systems; for 10 Gbps on legacy fiber; contractually specified</td>
              <td>TIA-455-124A [confirm edition]</td>
            </tr>
            <tr>
              <td>CD measurement (FOTP-168)</td>
              <td>Long-haul DWDM systems; coherent optics; systems without DCM budget margin</td>
              <td>TIA-455-168A [confirm edition]</td>
            </tr>
          </tbody>
        </table>
        <p>
          For most standard RUS rural broadband builds (Tier 1 + Tier 2 only, 10 Gbps transport
          on G.652.D fiber), PMD and CD measurement is not contractually required and is not
          typically performed. It becomes relevant on backbone trunk builds where the planned
          upgrade path includes 40+ Gbps or where the carrier's system engineering team has
          specified PMD acceptance thresholds.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: CD Compensation and the Zero-Dispersion Wavelength</h2>
        <p>
          G.652.D fiber has a <em>zero-dispersion wavelength (ZDW)</em> in the 1300 nm window
          (typically 1302–1322 nm), where CD ≈ 0. At 1550 nm, CD is +17 ps/(nm·km). At 1310 nm,
          CD is close to zero but slightly positive or negative depending on the exact fiber.
        </p>
        <p>
          For DWDM systems operating in the C-band (1530–1565 nm), the 17 ps/(nm·km) CD of
          G.652.D is significant. Long-haul DWDM systems use Dispersion Compensating Fiber (DCF)
          modules or tunable dispersion compensators (TDCs) to counteract the accumulated CD.
          Coherent optical modulation formats (DP-QPSK, DP-16QAM used in 100G and 400G CFP2-DCO
          coherent transceivers) can electronically compensate for CD in the DSP, eliminating
          the need for external DCMs.
        </p>
        <p>
          OSP engineers designing access/metro networks where coherent optics may eventually be
          deployed should document the CD coefficient of each span in the as-built record,
          so the carrier's system engineering team can plan CD compensation budgets correctly.
          Even though CD measurement isn't part of the standard Tier-1/Tier-2 acceptance test,
          recording the fiber's ITU-T type (G.652.D) and the batch datasheet CD coefficient
          satisfies most carrier requirements.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L12-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'What is the maximum PMD coefficient for ITU-T G.652.D fiber (modern standard OSP singlemode)?',
              options: [
                { id: 'a', text: '0.5 ps/√km' },
                { id: 'b', text: '1.0 ps/√km' },
                { id: 'c', text: '0.2 ps/√km' },
                { id: 'd', text: '0.1 ps/√km' },
              ],
              correct: 'c',
              explanation: 'ITU-T G.652.D specifies a maximum PMD coefficient of 0.2 ps/√km. This is the modern standard for singlemode fiber and supports 40 Gbps applications on typical metro span lengths. The 0.5 ps/√km value applies to G.652A and G.652C (legacy fiber types) — these older fibers cannot reliably support 40 Gbps without per-span PMD verification.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'A 120 km singlemode span uses G.652.D fiber with a PMD coefficient of 0.18 ps/√km. What is the total PMD?',
              options: [
                { id: 'a', text: '21.6 ps' },
                { id: 'b', text: '1.97 ps' },
                { id: 'c', text: '0.72 ps' },
                { id: 'd', text: '3.60 ps' },
              ],
              correct: 'b',
              explanation: 'PMD_total = PMD_coefficient × √(L) = 0.18 ps/√km × √(120 km) = 0.18 × 10.95 = 1.97 ps. Note: √(120) ≈ 10.95. The total PMD of 1.97 ps is well within the 10 Gbps NRZ budget of 10 ps and within the 40 Gbps budget of approximately 2.5 ps.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'On a standard RUS rural broadband OSP build using G.652.D fiber at 10 Gbps, is PMD measurement required as part of the standard acceptance test?',
              options: [
                { id: 'a', text: 'Yes — PMD testing is mandatory for all singlemode acceptance tests per TIA-526-7' },
                { id: 'b', text: 'Yes — RUS 1753F-401 requires FOTP-124 PMD measurement alongside OTDR' },
                { id: 'c', text: 'No — standard OSP acceptance testing (Tier 1 OLTS + Tier 2 OTDR) does not typically include PMD measurement; it is required when contractually specified or for 40 Gbps+ upgrades' },
                { id: 'd', text: 'No — PMD measurement is never required for singlemode fiber since G.652.D automatically passes all PMD specs' },
              ],
              correct: 'c',
              explanation: 'Standard OSP acceptance testing (Tier 1 OLTS + Tier 2 OTDR bidirectional) does not include PMD measurement. PMD testing is required when: (a) the contract explicitly specifies it (some carrier procurements do), (b) the planned transport layer includes 40 Gbps or 100 Gbps, or (c) existing legacy (pre-G.652.D) fiber is being upgraded. For typical 10 Gbps rural broadband builds on new G.652.D fiber, the PMD budget is comfortably met and measurement is not required.',
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
