// Net-new — T05.L07 Sag-Tension — How Cable Hangs
// Working lesson: catenary, parabolic approximation, sag formula, initial/final sag, full worked examples

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L07',
  course_id: 'T05',
  title: 'Sag-Tension — How Cable Hangs',
  order: 7,
  lesson_type: 'standard',
  prerequisites: ['T05.L05', 'T05.L06'],
  learning_objectives: [
    'Explain the difference between a catenary and a parabolic approximation and when the parabola is accurate',
    'Apply the sag formula s = wL² / (8H) step by step, showing all intermediate calculations',
    'Distinguish between initial sag and final sag and explain why clearance checks use final sag',
    'Calculate combined-load sag using the vector-sum combined weight under wind-plus-ice conditions',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'catenary',
    'parabolic approximation',
    'sag (s)',
    'horizontal tension (H)',
    'initial sag',
    'final sag',
    'thermal elongation',
    'creep',
    'sag-to-span ratio',
    'ruling span',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'loading district', source_lesson_id: 'T05.L06' },
    { term: 'Light loading district', source_lesson_id: 'T05.L06' },
    { term: 'ice load formula', source_lesson_id: 'T05.L06' },
    { term: 'combined load', source_lesson_id: 'T05.L06' },
    { term: 'pole loading', source_lesson_id: 'T05.L05' },
    { term: 'wind span', source_lesson_id: 'T05.L05' },
    { term: 'Rule 232', source_lesson_id: 'T05.L02' },
    { term: 'design clearance margin', source_lesson_id: 'T05.L02' },
    { term: 'messenger', source_lesson_id: 'T01.L03' },
    { term: 'EDS', source_lesson_id: 'T03.L04' },
    { term: 'RTS', source_lesson_id: 'T03.L04' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'catenary',
      definition:
        'The exact mathematical curve that a perfectly flexible cable under uniform self-weight forms when suspended between two equal-height attachment points. The catenary equation is y = a × cosh(x/a), where a = H/w (horizontal tension divided by cable weight per foot) and cosh is the hyperbolic cosine function. For most OSP spans, the catenary and the parabola differ by less than 1%.',
    },
    {
      term: 'parabolic approximation',
      definition:
        'A simplified version of the catenary equation that treats the cable sag shape as a parabola instead of a true catenary. Valid when sag is less than 10% of span length (which includes almost all normal OSP spans). The parabolic approximation leads directly to the sag formula: s = wL² / (8H).',
    },
    {
      term: 'sag (s)',
      definition:
        'The vertical distance from the chord line (straight line connecting the two attachment points) to the lowest point of the cable at midspan. Measured in feet. Sag is always positive — the cable always hangs below the chord line. The clearance check compares (attachment height − sag) to the required NESC clearance.',
    },
    {
      term: 'horizontal tension (H)',
      definition:
        'The constant horizontal component of the tension force at any point along the cable. In a perfectly flexible cable, the total tension varies along the cable (it\'s highest at the attachment points), but the horizontal component remains constant. H is the tension that goes into the sag formula. H is what you control when you tighten or loosen a strand — it directly determines the sag.',
    },
    {
      term: 'initial sag',
      definition:
        'The sag of the cable immediately after it is strung and the come-alongs are released. The strand has not yet been loaded by temperature extremes or long-term creep. Initial sag is what the sag board reads in the field on the day of installation.',
    },
    {
      term: 'final sag',
      definition:
        'The sag of the cable after it has experienced thermal cycling, load cycling, and long-term creep. Final sag is always greater than or equal to initial sag because the strand stretches slightly over time and at high temperatures. NESC clearance checks use final sag — the design must clear the road even at maximum sag after the cable has settled.',
    },
    {
      term: 'thermal elongation',
      definition:
        'The increase in strand length that occurs as temperature rises. Longer strand at the same attachment-point distance means the strand must sag more to accommodate the extra length. For steel strand, the coefficient of thermal expansion is approximately 6.5 × 10⁻⁶ per °F. A temperature increase of 100°F stretches a 500-ft steel strand by about 0.33 ft, increasing sag.',
    },
    {
      term: 'creep',
      definition:
        'The slow, permanent elongation of a strand under sustained tension load over months and years. Creep is different from elastic stretch — it doesn\'t recover when the load is removed. Aluminum wire creeps more than steel. Creep adds to final sag and must be accounted for in the design to ensure the clearance requirements are still met years after installation.',
    },
    {
      term: 'sag-to-span ratio',
      definition:
        'The ratio of sag to span length (s/L), expressed as a percentage. When this ratio is below 10% (s < L/10), the parabolic approximation is accurate within 1% of the catenary. Most OSP spans have sag-to-span ratios below 5%, making the parabolic approximation highly accurate.',
    },
    {
      term: 'ruling span',
      definition:
        'A calculated equivalent span used to determine the stringing tension for a multi-span section. In a section with spans of different lengths, the ruling span is the span length at which a cable strung to a given tension will have the same behavior as if all spans were equal to the ruling span. Ruling span = √(sum of L³ / sum of L), where L is each individual span length.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L07_SagTensionHowCableHangs() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Hang a garden hose between two fence posts and let it go. It droops in the middle
          — not in a straight line, but in a gentle curve. A fiber cable strung on poles
          does the same thing, just over a longer span with carefully controlled tension.
          The shape it makes, and exactly how low it droops at the center, determines
          whether the cable legally clears the road underneath it.
        </p>
        <p className="mt-2">
          That low point is called the <strong>sag</strong>. Calculating it isn't
          complicated — there's one formula that covers almost every situation an OSP
          designer will encounter. But you have to use it correctly, and you have to use
          the right weight input (bare cable, or cable plus ice and wind load), and you
          have to use the <em>final</em> sag (after the cable has settled and stretched),
          not the installation-day sag.
        </p>
        <p className="mt-2">
          This lesson teaches you the sag formula, where it comes from, when it's valid,
          and how to apply it to the scenarios you'll actually face in the field.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms and notation in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Symbol</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">Units</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">s</td>
              <td className="px-3 py-2">Sag — vertical drop from chord line to midspan low point</td>
              <td className="px-3 py-2">feet (ft)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">w</td>
              <td className="px-3 py-2">Cable weight per unit length (self-weight only for no-wind, combined load for wind+ice)</td>
              <td className="px-3 py-2">lb/ft</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">L</td>
              <td className="px-3 py-2">Span length — horizontal pole-to-pole distance</td>
              <td className="px-3 py-2">feet (ft)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">H</td>
              <td className="px-3 py-2">Horizontal tension — the constant horizontal component of cable tension</td>
              <td className="px-3 py-2">pounds (lb)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono font-semibold">s/L</td>
              <td className="px-3 py-2">Sag-to-span ratio — if below 10%, parabolic formula is accurate within 1%</td>
              <td className="px-3 py-2">dimensionless (or %)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The sag formula</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-lg leading-8 text-slate-200 my-3 text-center">
          s = wL² / (8H)
        </div>
        <p>
          This is the parabolic approximation for cable sag. Every variable is something
          you either measure in the field or specify in the design:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>w</strong> (lb/ft) — from the cable data sheet. For bare cable: look up the manufacturer's unit weight. For loaded condition: use w_combined from the previous lesson.</li>
          <li><strong>L</strong> (ft) — from the field survey or the design map. Horizontal distance, not along the cable.</li>
          <li><strong>H</strong> (lb) — from the sag-tension chart for the chosen strand type. Set by the design engineer.</li>
          <li><strong>s</strong> (ft) — what the formula gives you. The vertical drop at midspan.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Where does this formula come from?</h3>
        <p>
          The exact shape of a hanging cable is a <strong>catenary</strong> — a specific
          mathematical curve. But for cables where the sag is small compared to the span
          length, the catenary is nearly identical to a <strong>parabola</strong>. A parabola
          is much easier to work with mathematically, and it gives the simple, exact formula
          above.
        </p>
        <p className="mt-2">
          The approximation is valid when the sag-to-span ratio (s/L) is below 10%.
          Let's check if our typical scenarios meet this:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>150-ft span, 0.68 ft sag: s/L = 0.68/150 = 0.45% — well within the 10% threshold</li>
          <li>300-ft span, 2.72 ft sag: s/L = 2.72/300 = 0.91% — still well within threshold</li>
          <li>500-ft span, 10 ft sag: s/L = 10/500 = 2% — parabola still accurate</li>
        </ul>
        <p className="mt-2">
          For the parabola to fail (error &gt; 1%), you'd need a sag-to-span ratio of
          over 10% — which would mean a 150-ft span with 15+ ft of sag. That's not a real
          design; the cable would be nearly touching the ground. The parabola works for
          everything an OSP designer will encounter.
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L07"
          cards={[
            { id: 'T05-L07-fc-catenary', front: 'What is a catenary?', back: 'The exact mathematical curve formed by a perfectly flexible cable under uniform self-weight. Described by y = a × cosh(x/a). For OSP spans where sag is less than 10% of span length, a parabola approximates the catenary within 1%.' },
            { id: 'T05-L07-fc-sag', front: 'Define sag (s) and write the formula.', back: 'Sag is the vertical distance from the chord line (straight line connecting the two attachment points) to the cable\'s lowest point at midspan. s = wL² / (8H). Variables: w = cable weight per foot (lb/ft), L = span length (ft), H = horizontal tension (lb).' },
            { id: 'T05-L07-fc-H', front: 'What is horizontal tension (H) in the sag formula?', back: 'The constant horizontal component of cable tension at any point along the cable. H is what you control when you adjust strand tension — higher H = less sag. The sag formula shows s ∝ 1/H: double the tension, halve the sag.' },
            { id: 'T05-L07-fc-final-sag', front: 'Why do clearance checks use final sag rather than initial sag?', back: 'Final sag accounts for thermal elongation (the strand stretches at high temperatures) and creep (slow permanent elongation under sustained tension). Final sag is always ≥ initial sag. Designing to initial sag only means the cable may violate clearance after a few years of service.' },
            { id: 'T05-L07-fc-thermal', front: 'What is thermal elongation and why does it matter for sag?', back: 'Thermal elongation is the increase in strand length as temperature rises — steel expands about 6.5 × 10⁻⁶ per °F. More length at fixed attachment points = more sag. Maximum sag in the Light district often occurs at peak summer temperature, not during a windstorm.' },
            { id: 'T05-L07-fc-parabolic', front: 'What is the parabolic approximation and when is it valid?', back: 'A simplified version of the catenary equation that treats the cable sag shape as a parabola instead of a true catenary. Valid when sag is less than 10% of span length (s/L < 10%), which includes almost all normal OSP spans. Leads directly to the sag formula: s = wL² / (8H).' },
            { id: 'T05-L07-fc-initial-sag', front: 'What is initial sag?', back: 'The sag of the cable immediately after it is strung and the come-alongs are released. The strand has not yet been loaded by temperature extremes or long-term creep. Initial sag is what the sag board reads in the field on the day of installation.' },
            { id: 'T05-L07-fc-creep', front: 'What is creep in a strand and how does it affect sag?', back: 'The slow, permanent elongation of a strand under sustained tension load over months and years. Creep does not recover when the load is removed. It adds to final sag and must be accounted for in design to ensure clearance requirements are still met years after installation. Aluminum wire creeps more than steel.' },
            { id: 'T05-L07-fc-sag-span-ratio', front: 'What is sag-to-span ratio and why does it matter?', back: 'The ratio of sag to span length (s/L), expressed as a percentage. When s/L is below 10%, the parabolic approximation is accurate within 1% of the catenary. Most OSP spans have sag-to-span ratios below 5%, making the parabolic formula highly accurate.' },
            { id: 'T05-L07-fc-ruling-span', front: 'What is ruling span and how is it calculated?', back: 'A calculated equivalent span used to determine the stringing tension for a multi-span section. For sections with spans of different lengths, ruling span = √(ΣL³ / ΣL), where L is each individual span length. The field crew receives a sag chart based on the ruling span and verifies one representative span in the field.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Full Step-by-Step Examples</h2>

        <h3 className="mt-4 font-semibold">Example 1 — Residential aerial, Light district (Macon, GA)</h3>
        <p>
          The canonical OSP scenario: a 12-fiber OSP cable lashed to 6M strand, on a
          150-ft span over a residential street. We'll calculate sag under three conditions:
          no wind, 9-psf wind (Light district), and check the clearance.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-3">Given</p>
          <ul className="text-sm space-y-1 text-slate-300 mb-4">
            <li>Cable: 12-fiber OSP lashed to 6M strand. Total weight w = 0.145 lb/ft. Strand OD = 0.5 in.</li>
            <li>Span: L = 150 ft</li>
            <li>Stringing tension: H = 600 lb</li>
            <li>Attachment height: 22 ft above road surface</li>
            <li>Required clearance (NESC Rule 232, road): ≈ 15.5 ft</li>
            <li>Loading district: Light (9 psf wind, no ice)</li>
          </ul>

          <p className="font-semibold text-slate-200 mb-2">Step 1: Verify the parabolic approximation is valid</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>Estimate sag: s ≈ wL² / (8H) ≈ (0.145 × 150²) / (8 × 600) ≈ 0.68 ft</p>
            <p>Sag-to-span ratio: 0.68 / 150 = 0.45%</p>
            <p>0.45% &lt; 10% threshold → parabolic formula is valid ✓</p>
          </div>

          <p className="font-semibold text-slate-200 mb-2">Step 2: Calculate no-wind sag</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>s = wL² / (8H)</p>
            <p>s = (0.145 × 150²) / (8 × 600)</p>
            <p>s = (0.145 × 22,500) / 4,800</p>
            <p>s = 3,262.5 / 4,800</p>
            <p>s = <strong>0.680 ft</strong>  (8.2 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: 0.680 ft ≈ 8 inches. For a 150-ft span with a light cable at
            600 lb tension, 8 inches of sag is reasonable — imagine a taut rope between
            two fence posts about 50 yards apart drooping only 8 inches.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 3: Midspan height and clearance check (no wind)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>Midspan height = attachment height − sag</p>
            <p>Midspan height = 22.0 − 0.680 = <strong>21.32 ft</strong></p>
            <p></p>
            <p>Clearance margin = midspan height − required clearance</p>
            <p>Clearance margin = 21.32 − 15.5 = <strong>+5.82 ft</strong>  ✓ PASS</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: 5.82 ft of margin. This cable would have to sag nearly 6 more feet
            before violating the clearance. This attachment height is very comfortable for
            this span and cable.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 4: Wind-loaded sag (Light district, 9 psf)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>Wind load per foot:</p>
            <p>  Projected area = strand OD / 12 = 0.5 / 12 = 0.042 ft²/ft</p>
            <p>  w_wind = 9 psf × 0.042 ft²/ft = 0.375 lb/ft</p>
            <p></p>
            <p>Combined load (vector sum):</p>
            <p>  w_combined = √(w² + w_wind²)</p>
            <p>  w_combined = √(0.145² + 0.375²)</p>
            <p>  w_combined = √(0.02103 + 0.14063)</p>
            <p>  w_combined = √0.16166 = <strong>0.402 lb/ft</strong></p>
            <p></p>
            <p>Wind-loaded sag:</p>
            <p>  s_wind = (0.402 × 22,500) / 4,800</p>
            <p>  s_wind = 9,045 / 4,800 = <strong>1.885 ft</strong>  (22.6 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: Under a 9-psf windstorm, sag grows from 8 inches to 23 inches —
            almost 3× more. The combined load (0.402 lb/ft) is 2.8× the bare cable weight
            (0.145 lb/ft), so the sag grows by the same factor.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 5: Wind-loaded clearance check</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>Midspan height (wind) = 22.0 − 1.885 = <strong>20.12 ft</strong></p>
            <p>Clearance margin (wind) = 20.12 − 15.5 = <strong>+4.62 ft</strong>  ✓ PASS</p>
          </div>
          <p className="text-sm text-slate-300/80">
            Sanity check: Even in a 9-psf (≈ 60 mph) wind, the cable clears the road by
            more than 4 feet. This is a well-designed span at a comfortable attachment
            height with a solid 1–2 ft margin well above the code minimum.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Example 2 — What if it were Heavy district?</h3>
        <p>
          Using the same span, cable, and attachment height, let's see what happens in
          the Heavy district (0.50 in ice, 4 psf wind, 0°F).
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-2">Step 1: Ice load (Heavy district, 0.50 in radial)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-blue-200 space-y-1 mb-3">
            <p>w_ice = 1.244 × t × (D + t)</p>
            <p>w_ice = 1.244 × 0.50 × (0.50 + 0.50)</p>
            <p>w_ice = 1.244 × 0.50 × 1.00 = <strong>0.622 lb/ft</strong></p>
            <p></p>
            <p>Total vertical load = w + w_ice = 0.145 + 0.622 = <strong>0.767 lb/ft</strong></p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: The ice alone weighs 0.622 lb/ft — 4.3× the bare cable weight.
            The iced cable is 5.3× heavier per foot than the bare cable. This is why
            Heavy-district designs look so different from Light-district designs.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 2: Wind on iced cable (iced OD = 0.50 + 2×0.50 = 1.50 in)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-blue-200 space-y-1 mb-3">
            <p>Iced cable OD = D + 2t = 0.50 + 2(0.50) = 1.50 in</p>
            <p>Projected area = 1.50 / 12 = 0.125 ft²/ft</p>
            <p>w_wind = 4 psf × 0.125 ft²/ft = <strong>0.500 lb/ft</strong></p>
          </div>
          <p className="text-sm text-slate-300/80 mb-3">
            Note: Heavy district wind pressure is only 4 psf (not 9 psf like Light
            district), but the iced cable has a much larger projected area because
            the ice triples the effective diameter.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 3: Combined load and sag</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-blue-200 space-y-1 mb-3">
            <p>w_combined = √((w + w_ice)² + w_wind²)</p>
            <p>           = √(0.767² + 0.500²)</p>
            <p>           = √(0.5883 + 0.2500)</p>
            <p>           = √0.8383 = <strong>0.916 lb/ft</strong></p>
            <p></p>
            <p>s_heavy = (0.916 × 22,500) / 4,800</p>
            <p>s_heavy = 20,610 / 4,800 = <strong>4.294 ft</strong>  (51.5 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-3">
            Sanity check: 4.29 ft of sag — over 6× more than the Light district no-wind sag
            of 0.68 ft, from the same span and tension. The ice and wind together pushed
            the combined load from 0.145 to 0.916 lb/ft — a 6.3× increase.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 4: Clearance check (Heavy district)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-blue-200 space-y-1 mb-3">
            <p>Midspan height (heavy) = 22.0 − 4.294 = <strong>17.71 ft</strong></p>
            <p>Clearance margin (heavy) = 17.71 − 15.5 = <strong>+2.21 ft</strong>  ✓ PASS</p>
          </div>
          <p className="text-sm text-slate-300/80">
            Sanity check: The cable still passes — 2.21 ft margin — but it's much tighter
            than the 5.82 ft margin in Light district. In practice, a Heavy-district designer
            would want that extra foot of margin: raise the attachment to 23 ft or shorten
            the span to 130 ft. The math shows exactly why Heavy-district aerial design is
            more conservative than Light-district design.
          </p>
        </div>

        {/* WorkedExample widget */}
        <WorkedExample
          title="Sag and Clearance Calculator"
          description="Calculate sag under two conditions (no wind and wind-loaded) and check clearance for any span."
          variables={[
            { id: 'w_bare', label: 'Cable bare weight w (lb/ft)', defaultValue: 0.145, min: 0.05, max: 1.5, step: 0.005 },
            { id: 'L_span', label: 'Span length L (ft)', defaultValue: 150, min: 50, max: 400, step: 5 },
            { id: 'H_tension', label: 'Horizontal tension H (lb)', defaultValue: 600, min: 100, max: 3000, step: 50 },
            { id: 'h_attach', label: 'Attachment height (ft)', defaultValue: 22, min: 15, max: 50, step: 0.5 },
            { id: 'w_comb', label: 'Combined load w_combined (lb/ft) — use w_bare for no-wind', defaultValue: 0.402, min: 0.05, max: 2.0, step: 0.005 },
            { id: 'clearance_req', label: 'Required clearance (ft)', defaultValue: 15.5, min: 9.5, max: 25, step: 0.5 },
          ]}
          formula="s = wL² / (8H) — use w_bare for no-wind; use w_combined for loaded"
          steps={[
            { label: 'No-wind sag (ft)', expression: '(w_bare * L_span * L_span) / (8 * H_tension)', varIds: ['w_bare', 'L_span', 'H_tension'] },
            { label: 'Loaded sag (ft)', expression: '(w_comb * L_span * L_span) / (8 * H_tension)', varIds: ['w_comb', 'L_span', 'H_tension'] },
            { label: 'Clearance margin under load (ft)', expression: 'h_attach - (w_comb * L_span * L_span) / (8 * H_tension) - clearance_req', varIds: ['h_attach', 'w_comb', 'L_span', 'H_tension', 'clearance_req'] },
          ]}
          sanityCheck="Positive clearance margin = design passes. Negative = violation. Sag grows with the square of L — doubling the span quadruples the sag. Sag is inversely proportional to H — doubling H halves the sag."
        />

        {/* SliderExploration: sag vs. tension */}
        <SliderExploration
          title="How Tension Controls Sag"
          description="Adjust the horizontal tension H and watch how sag and clearance change. Because s = wL²/(8H), sag is inversely proportional to tension — double H, halve the sag."
          variables={[
            { id: 'H_slide', label: 'Horizontal tension H (lb)', min: 200, max: 1200, step: 25, defaultValue: 600 },
          ]}
          derivedValues={[
            {
              id: 'sag_slide',
              label: 'No-wind sag (ft) — w=0.145, L=150',
              expression: '(0.145 * 150 * 150) / (8 * H_slide)',
              varIds: ['H_slide'],
            },
            {
              id: 'margin_slide',
              label: 'Clearance margin at 22 ft attach (ft)',
              expression: '22 - (0.145 * 150 * 150) / (8 * H_slide) - 15.5',
              varIds: ['H_slide'],
            },
          ]}
          insight="At H=200 lb: sag = 2.04 ft, margin = 4.46 ft. At H=1200 lb: sag = 0.34 ft, margin = 6.16 ft. Doubling tension from 600 to 1200 lb halves the sag — consistent with s ∝ 1/H. But higher tension also increases the structural load on the pole and strand — there's a design trade-off between sag reduction and hardware strength requirements."
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Initial vs. Final Sag — and the Ruling Span</h2>

        <h3 className="mt-4 font-semibold">Why clearance must be checked at final sag</h3>
        <p>
          After installation, a strand slowly settles into its final state through two
          mechanisms:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            <strong>Thermal elongation:</strong> On a hot summer day, the steel strand
            expands. Steel's coefficient of thermal expansion is approximately
            6.5 × 10⁻⁶ per °F. For a 500-ft span at +100°F above the installation
            temperature: ΔL = 6.5 × 10⁻⁶ × 500 × 100 = 0.325 ft of extra strand length.
            That extra length has to go somewhere — it goes into sag.
          </li>
          <li>
            <strong>Creep:</strong> Under sustained tension, steel slowly and permanently
            stretches. High-strength steel strand creeps less than aluminum, but it still
            creeps. Over 10 years, sag may increase an additional 3–8% beyond the initial
            stringing sag.
          </li>
        </ol>
        <p className="mt-2">
          Sag-tension design programs compute both initial and final sag for the governing
          condition. The clearance check uses the <em>final</em> sag — because a cable that
          barely clears on installation day may violate clearance three summers later.
        </p>

        <h3 className="mt-5 font-semibold">The ruling span concept</h3>
        <p>
          In a section of poles with unequal spans, stringing the cable at a single tension
          means each span has a different sag. The <strong>ruling span</strong> is the
          equivalent uniform span length that captures the behavior of the whole section
          for tension calculation purposes.
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          Ruling span = √(ΣL³ / ΣL)
        </div>
        <p className="text-sm text-slate-300/80">
          Where ΣL³ = sum of each span cubed, and ΣL = sum of all span lengths.
        </p>
        <p className="mt-2">
          In practice, the ruling span is calculated by the pole-loading software or the
          design engineer before issuing the sag chart. The field crew receives a sag chart
          showing the stringing sag at the ruling span — and they verify one representative
          span in the field with a sag board. The software's ruling span output is the
          authoritative value; hand-calculating the ruling span is useful for understanding
          the concept but not typically done by the OSP designer manually.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L07 Check — Sag-Tension — How Cable Hangs"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L07-Q1',
            type: 'mc',
            prompt:
              'A cable has w = 0.200 lb/ft, L = 120 ft, H = 700 lb. Calculate sag using s = wL² / (8H).',
            choices: [
              '0.257 ft (about 3.1 inches)',
              '0.514 ft (about 6.2 inches)',
              '1.029 ft (about 12.3 inches)',
              '0.429 ft (about 5.1 inches)',
            ],
            answerIndex: 1,
            explanation:
              's = (0.200 × 120²) / (8 × 700) = (0.200 × 14,400) / 5,600 = 2,880 / 5,600 = 0.514 ft. That\'s about 6.2 inches. Verify: sag-to-span ratio = 0.514/120 = 0.43% — well below 10%, so the parabolic formula is valid.',
          },
          {
            id: 'T05-L07-Q2',
            type: 'mc',
            prompt:
              'The sag formula shows sag is proportional to L². If you increase the span from 150 ft to 300 ft (keeping w and H the same), the sag will:',
            choices: [
              'Double — span doubled, so sag doubles',
              'Quadruple — because sag ∝ L² and (300/150)² = 4',
              'Increase by 50% — proportional to the span increase',
              'Stay the same — tension balances the span increase',
            ],
            answerIndex: 1,
            explanation:
              'Sag = wL²/(8H), so sag ∝ L². When L doubles from 150 to 300: (300/150)² = 2² = 4. Sag quadruples. At L=150: s ≈ 0.68 ft. At L=300: s ≈ 0.68 × 4 = 2.72 ft. This quadratic relationship is the main reason long spans need either higher attachment heights or higher tensions.',
          },
          {
            id: 'T05-L07-Q3',
            type: 'mc',
            prompt:
              'Why must NESC clearance checks use final sag rather than initial sag?',
            choices: [
              'Initial sag is always larger than final sag, so using initial sag is more conservative',
              'Final sag includes the effects of thermal elongation and creep, which increase sag over time — a cable that barely clears on installation day may violate clearance years later',
              'NESC Rule 232 specifically defines "initial sag" as the design standard',
              'Initial sag and final sag are identical for steel strand — the distinction only matters for aluminum',
            ],
            answerIndex: 1,
            explanation:
              'Final sag is always ≥ initial sag. Steel strand stretches at high temperatures (thermal elongation) and creeps slowly under sustained tension. A clearance design based only on initial sag may violate code within a few years. Sag-tension programs compute final sag at the governing temperature; that\'s the value used for clearance checks.',
          },
          {
            id: 'T05-L07-Q4',
            type: 'mc',
            prompt:
              'A cable is in the Heavy district (0.50 in ice, 4 psf wind). Cable bare weight = 0.145 lb/ft. Cable OD = 0.50 in. Which step of the clearance check MUST be done before applying the sag formula?',
            choices: [
              'Calculate the ruling span for the entire section',
              'Calculate w_ice and w_wind, then combine them with the bare weight to find w_combined',
              'Verify that the pole class has adequate fiber strength for Grade C loads',
              'Confirm the attachment height matches the as-built drawing',
            ],
            answerIndex: 1,
            explanation:
              'For a loaded clearance check, you must calculate the combined design load: w_ice = 1.244 × 0.50 × (0.50 + 0.50) = 0.622 lb/ft; iced OD = 1.50 in; w_wind = 4 × (1.50/12) = 0.500 lb/ft; w_combined = √((0.145 + 0.622)² + 0.500²) = √(0.588 + 0.250) = √0.838 = 0.916 lb/ft. THEN apply s = (0.916 × L²) / (8H).',
          },
          {
            id: 'T05-L07-Q5',
            type: 'fill-in-blank',
            prompt:
              'The parabolic sag formula is accurate within 1% of the catenary when the sag-to-span ratio is below ____%.',
            answer: '10',
            answerDisplay: '10% (s/L < 0.10)',
            explanation:
              'When sag is less than 10% of span length (s < L/10), the parabola and catenary differ by less than 1%. Almost all OSP spans have sag-to-span ratios below 5%, making the parabolic formula highly accurate for practical design use.',
          },
        ]}
      />

    </LessonLayout>
  );
}
