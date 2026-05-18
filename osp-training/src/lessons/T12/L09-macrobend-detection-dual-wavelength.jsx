// T12.L09 — Macrobend Detection: Dual-Wavelength Method
// Working lesson: macrobend signature, dual-wavelength differential, 1625 nm in-service, G.657
// Source: Corning WP1281 | IEC 60793-2-50 | TIA-455-62 | EXFO AN-032

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T12.L09',
  course_id: 'T12',
  title: 'Macrobend Detection — Dual-Wavelength Method',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T12.L08', 'T02.L02', 'T02.L08'],
  learning_objectives: [
    'Describe the optical signature of a macrobend on an OTDR trace',
    'Explain why macrobends affect longer wavelengths more severely than shorter wavelengths',
    'Apply the dual-wavelength comparison method to isolate macrobend locations',
    'State the recommended minimum bend radius for G.652.D and G.657.A2 fiber',
  ],
  estimated_minutes: 28,
  vocabulary_introduced: [
    'macrobend signature',
    'dual-wavelength differential',
    '1625 nm in-service window',
    'G.657 macrobend-insensitive fiber',
  ],
  vocabulary_assumed: [
    { term: 'macrobend', source_lesson_id: 'T02.L04' },
    { term: 'MFD', source_lesson_id: 'T02.L01' },
    { term: 'G.652.D', source_lesson_id: 'T02.L01' },
    { term: 'G.657', source_lesson_id: 'T02.L04' },
    { term: 'OTDR', source_lesson_id: 'T01.L08' },
    { term: 'loss event', source_lesson_id: 'T12.L08' },
  ],
  key_terms: [
    {
      term: 'macrobend signature',
      definition:
        'The characteristic OTDR trace shape at a macrobend: a distributed, gradual increase in loss (increased slope) over the bend region, rather than the sudden step-down of a splice. In severe cases, the increased attenuation appears as a localized region where the trace slopes more steeply. Unlike a splice, the elevated loss continues over the length of the bend, then returns to normal slope after the bend ends. Macrobend signatures are more prominent at longer wavelengths (1550 nm and 1625 nm) than at shorter wavelengths (1310 nm).',
    },
    {
      term: 'dual-wavelength differential',
      definition:
        'The difference in attenuation or event loss between two OTDR measurements at different wavelengths (typically 1310 nm and 1550 nm, or 1310 nm and 1625 nm). A macrobend produces a much larger loss at longer wavelengths because longer-wavelength light has a larger effective beam diameter and is more easily coupled out of the fiber by mechanical stress. A difference in loss between wavelengths at the same location is the primary indicator of a macrobend (vs. a splice, which produces similar loss at both wavelengths).',
    },
    {
      term: '1625 nm in-service window',
      definition:
        'The wavelength range around 1625 nm used for OTDR measurement of live fiber carrying traffic at 1310 nm and 1550 nm. Since 1625 nm is outside the primary DWDM C-band and L-band traffic windows, an OTDR can inject 1625 nm test pulses into a live fiber without disrupting traffic. Particularly useful for macrobend detection because macrobend loss is most severe at longer wavelengths, making bends highly visible at 1625 nm even when barely visible at 1310 nm.',
    },
    {
      term: 'G.657 macrobend-insensitive fiber',
      definition:
        'A family of ITU-T standard singlemode fiber types with an enhanced macrobend tolerance compared to G.652.D. G.657.A1 minimum bend radius: 10 mm (1 cm). G.657.A2: 7.5 mm. G.657.B2: 7.5 mm. G.657.B3: 5 mm. Used in FTTx drop cables, MDU risers, and any installation where tight bends are unavoidable. Still subject to excessive loss at very small bend radii — "bend-insensitive" does not mean "bend-proof."',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T12L09_MacrobendDetection() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ── */}
      <section data-tier="foundations">
        <h2>Why Bends Cause Loss — and Why Longer Wavelengths Are More Sensitive</h2>

        <p>
          In Lesson T02.L02 you learned that macrobends — bends with radii too small for the fiber
          type — cause light to leak out of the fiber. The light mode that propagates through a
          singlemode fiber has an evanescent field that extends slightly beyond the core/cladding
          boundary. When the fiber curves, the outside of the curve moves faster than the inside,
          effectively forcing the outer portion of the evanescent field to travel faster than the
          speed of light in that material — which physics won't permit. The only resolution is for
          that energy to escape the guided mode, radiating outward and causing loss.
        </p>
        <p>
          <strong>Why longer wavelengths are more affected:</strong> Longer-wavelength light has a
          larger effective Mode Field Diameter (MFD) — the light beam is slightly bigger. A larger
          beam is more easily disturbed by the same bend radius. Standard G.652.D fiber has an MFD
          of about 9.2 µm at 1310 nm and 10.5 µm at 1550 nm. The 1550 nm mode is ~14% larger,
          making it noticeably more sensitive to macrobends. At 1625 nm the MFD is even larger.
        </p>
        <p>
          <strong>Practical consequence:</strong> a bend that appears invisible at 1310 nm might
          show 0.3 dB of loss at 1550 nm and 1.5 dB at 1625 nm. If you test a span only at
          1310 nm, you can miss bends that will cause significant attenuation at the 1550 nm
          wavelength that most DWDM traffic uses.
        </p>
      </section>

      {/* ── WORKING ── */}
      <section data-tier="working">
        <h2>Identifying Macrobends with the Dual-Wavelength Method</h2>

        <p>
          The standard field procedure for macrobend detection uses two OTDR measurements at
          different wavelengths — typically 1310 nm and 1550 nm, or 1310 nm and 1625 nm. By
          comparing the two traces:
        </p>
        <ul>
          <li>
            <strong>Splices and connectors:</strong> Similar loss at both wavelengths. A 0.10 dB
            splice at 1310 nm reads approximately 0.10 dB at 1550 nm (within measurement error).
          </li>
          <li>
            <strong>Macrobends:</strong> Loss at the longer wavelength is noticeably higher than at
            the shorter wavelength. A bend that reads 0.05 dB at 1310 nm may read 0.50 dB at
            1550 nm. The wavelength-differential is the signature.
          </li>
          <li>
            <strong>Fiber damage or breaks:</strong> High loss at both wavelengths, approximately
            equal across wavelengths.
          </li>
        </ul>

        <WorkedExample
          title="Identifying a macrobend from dual-wavelength OTDR data"
          formula="Dual-wavelength differential = Loss at 1550 nm − Loss at 1310 nm"
          variables={[
            { symbol: 'L_1310_splice1', label: 'Splice 1 loss @ 1310 nm', value: 0.08, unit: 'dB' },
            { symbol: 'L_1550_splice1', label: 'Splice 1 loss @ 1550 nm', value: 0.09, unit: 'dB' },
            { symbol: 'L_1310_event2', label: 'Event 2 loss @ 1310 nm', value: 0.06, unit: 'dB' },
            { symbol: 'L_1550_event2', label: 'Event 2 loss @ 1550 nm', value: 0.48, unit: 'dB' },
          ]}
          steps={[
            'Splice 1 differential = 0.09 − 0.08 = 0.01 dB → within measurement noise → SPLICE (normal)',
            'Event 2 differential = 0.48 − 0.06 = 0.42 dB → large wavelength differential → MACROBEND',
            'Event 2 shows 8× more loss at 1550 nm vs 1310 nm — this is a macrobend, not a splice.',
            'Action: locate the fiber at that position and inspect for tight bends, over-strapping, or cable damage.',
          ]}
          answer="Event 2 is a macrobend. The 0.42 dB wavelength-differential isolates it from Splice 1 (normal splice, 0.01 dB differential)."
          sanityCheck="A splice or connector has the same fundamental loss mechanism regardless of wavelength — so you'd expect similar readings at 1310 and 1550 nm. A macrobend is wavelength-selective: it strips longer wavelengths preferentially. Any event where the 1550 nm reading is more than ~0.05 dB higher than the 1310 nm reading deserves investigation as a potential macrobend."
        />

        <h3>Minimum bend radius rules</h3>
        <p>
          Standard minimum bend radii to prevent macrobend loss during installation and long-term:
        </p>
        <table>
          <thead>
            <tr><th>Fiber type</th><th>Min. bend radius (short-term, installation)</th><th>Min. bend radius (long-term, installed)</th></tr>
          </thead>
          <tbody>
            <tr><td>G.652.D (standard singlemode)</td><td>30 mm (3 cm) — 20× cable diameter rule for 1.6 mm fiber</td><td>40 mm long-term; 30 mm OK for fixed routes</td></tr>
            <tr><td>G.657.A1 (enhanced bend-insensitive)</td><td>15 mm</td><td>10 mm long-term</td></tr>
            <tr><td>G.657.A2 (higher bend-insensitive)</td><td>10 mm</td><td>7.5 mm long-term</td></tr>
            <tr><td>G.657.B3 (extreme bend-insensitive)</td><td>7.5 mm</td><td>5 mm long-term</td></tr>
          </tbody>
        </table>
        <p>
          <strong>Field note:</strong> The cable OD matters, not just the fiber type. A G.652.D
          fiber inside a 2.0 mm drop cable has a different effective minimum bend radius than in
          a 0.9 mm tight-buffer. Most spec sheets give minimum bend radius for the cable assembly,
          not just the bare fiber. Always reference the cable spec sheet, not just the fiber spec.
        </p>

        <h3>Using 1625 nm for in-service macrobend investigation</h3>
        <p>
          When a span is carrying live 1310/1550 nm traffic, you can use a 1625 nm OTDR to test
          for macrobends without interrupting service. The 1625 nm wavelength sits outside the
          C-band (1530–1565 nm) and L-band (1565–1625 nm) DWDM windows, so test pulses don't
          interfere with traffic. The OTDR injects 1625 nm pulses; a wavelength-selective coupler
          (WDM coupler) at each end separates test wavelengths from traffic.
        </p>
        <p>
          Because 1625 nm is even more sensitive to macrobends than 1550 nm, a macrobend that
          was marginal at 1550 nm will be clearly visible at 1625 nm. This makes 1625 nm the
          preferred wavelength for in-service macrobend investigation on DWDM trunks.
        </p>
      </section>

      {/* ── ADVANCED ── */}
      <section data-tier="advanced">
        <h2>Advanced: Macrobend Loss Formula and Bending Coefficient</h2>
        <p>
          Macrobend loss can be modeled approximately as an exponential function of bend radius:
        </p>
        <blockquote>
          <strong>α_bend ≈ A × exp(−C × R)</strong>
        </blockquote>
        <p>
          Where R = bend radius, A = a pre-exponential amplitude factor, and C = the bending
          coefficient. Both A and C depend on the fiber's V-number (a dimensionless measure of
          light-guiding capacity related to core radius, wavelength, and NA) and the wavelength.
          Longer wavelengths have a smaller V-number (less tightly guided), which reduces both A
          and C in a way that makes the bend loss increase faster as radius decreases.
        </p>
        <p>
          G.657 fiber achieves its enhanced bend tolerance by optimizing the refractive-index
          profile to increase the bending coefficient C — making the loss drop off faster as
          radius increases, so that even at tight radii the loss remains acceptable. This is
          achieved by the trench-assisted or depressed-cladding index profile that raises the
          effective barrier against mode leakage.
        </p>
        <p>
          For field engineers: you don't need to calculate bending coefficients. The OTDR
          dual-wavelength test is the practical detector. The formula provides context for why
          G.657 fiber works and why "bend-insensitive" fiber is not immunity to all bend radii.
        </p>
      </section>

      {/* ── QUIZ ── */}
      <section data-tier="quiz">
        <Quiz
          id="T12L09-quiz"
          questions={[
            {
              id: 'q1',
              type: 'multiple-choice',
              text: 'On a dual-wavelength OTDR trace, an event at 8.3 km shows 0.07 dB loss at 1310 nm and 0.62 dB loss at 1550 nm. What is the most likely cause?',
              options: [
                { id: 'a', text: 'A high-loss fusion splice — normal splice loss is wavelength-independent' },
                { id: 'b', text: 'A macrobend — the large differential between 1310 nm and 1550 nm readings is the macrobend signature' },
                { id: 'c', text: 'A ghost reflection — it appears in one wavelength trace but not the other' },
                { id: 'd', text: 'A fiber break — breaks show equal loss at all wavelengths' },
              ],
              correct: 'b',
              explanation: 'A 0.55 dB difference between 1310 nm and 1550 nm at the same location is the classic macrobend signature. Splices and connectors produce similar loss at both wavelengths (within ~0.01–0.03 dB measurement noise). Macrobends strip the longer-wavelength mode preferentially, causing the 1550 nm reading to be far higher than 1310 nm.',
            },
            {
              id: 'q2',
              type: 'multiple-choice',
              text: 'A G.652.D cable installation in a manhole shows a tight bend around a corner. The minimum allowable long-term bend radius for G.652.D fiber is:',
              options: [
                { id: 'a', text: '5 mm — this is the minimum for any singlemode fiber type' },
                { id: 'b', text: '15 mm — minimum for G.657.A1' },
                { id: 'c', text: '30–40 mm — approximately 20× the cable outer diameter for standard G.652.D' },
                { id: 'd', text: '7.5 mm — standard G.652.D shares the G.657.A2 minimum' },
              ],
              correct: 'c',
              explanation: 'G.652.D has a minimum long-term bend radius of approximately 30–40 mm (typically expressed as 20× the cable outer diameter for a standard 1.6 mm drop cable = 32 mm). G.657 variants (A1, A2, B3) have tighter allowable radii because their fiber design enhances bend tolerance. Standard G.652.D is NOT bend-insensitive — 5 mm or 7.5 mm bends will cause significant loss.',
            },
            {
              id: 'q3',
              type: 'multiple-choice',
              text: 'Why is 1625 nm preferred for testing macrobends on a live DWDM system?',
              options: [
                { id: 'a', text: 'It has the shortest wavelength of any OTDR test source, giving the best resolution' },
                { id: 'b', text: 'It sits outside the C-band and L-band DWDM traffic windows, so test pulses do not interfere with live traffic, and its longer wavelength makes macrobends highly visible' },
                { id: 'c', text: 'It is blocked by WDM couplers, preventing test signals from reaching the far end' },
                { id: 'd', text: 'It has the same sensitivity as 1550 nm but can be used in both singlemode and multimode fiber' },
              ],
              correct: 'b',
              explanation: '1625 nm is outside the C-band (1530–1565 nm) and L-band (1565–1625 nm) windows where DWDM traffic runs, so OTDR test pulses do not interfere with live channels. Additionally, 1625 nm light has a larger effective MFD than 1550 nm, making it the most sensitive wavelength for macrobend detection — bends that are barely visible at 1550 nm show clearly at 1625 nm.',
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
