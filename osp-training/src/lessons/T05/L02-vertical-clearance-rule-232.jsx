// Net-new (migrated from Module02 §2.2, expanded) — T05.L02 Vertical Clearance — Rule 232
// Working lesson: NESC clearance categories, worked clearance-check, field margin practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L02',
  course_id: 'T05',
  title: 'Vertical Clearance — Rule 232',
  order: 2,
  lesson_type: 'standard',
  prerequisites: ['T05.L01'],
  learning_objectives: [
    'State the approximate NESC Rule 232 minimum clearances for roads, pedestrian areas, and railroads',
    'Explain what "lowest point under loading conditions" means and why it matters',
    'Calculate midspan cable height given attachment height, span, cable weight, and tension',
    'Apply the 1–2 ft design margin practice to a real clearance check',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'Rule 232',
    'Table 232-1',
    'traffic lane clearance',
    'pedestrian clearance',
    'sag formula',
    'design clearance margin',
    'Grade B crossing',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'Rule 232', source_lesson_id: 'T05.L01' },
    { term: 'AHJ', source_lesson_id: 'T05.L01' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'sag', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'Rule 232',
      definition:
        'The NESC rule that sets the minimum vertical clearance communication cables must maintain above ground, roads, railroads, and water. Clearance is always measured at the lowest point of the cable under the design loading conditions — meaning at maximum sag.',
    },
    {
      term: 'Table 232-1',
      definition:
        'The lookup table inside NESC Rule 232 that lists the specific minimum clearance distances for each crossing type (road with traffic, pedestrian-only area, railroad, navigable water, and others). Values are paywalled in the NESC C2-2023 document; secondary sources confirm approximately 15.5 ft for traffic lanes and 9.5 ft for pedestrian-only areas.',
    },
    {
      term: 'traffic lane clearance',
      definition:
        'The minimum vertical clearance above a roadway used by motor vehicles. Per public secondary sources summarizing NESC Table 232-1, communication cables over traffic lanes require approximately 15.5 ft of clearance at the lowest point of the cable under design loading conditions. Confirm exact value from NESC C2-2023 Table 232-1 for your design.',
    },
    {
      term: 'pedestrian clearance',
      definition:
        'The minimum vertical clearance above areas accessible only to pedestrians (no vehicle access). Per public secondary sources summarizing NESC Table 232-1, communication cables over pedestrian-only areas require approximately 9.5 ft. Confirm from NESC C2-2023 Table 232-1.',
    },
    {
      term: 'sag formula',
      definition:
        'The parabolic approximation used to calculate how much a cable drops below its attachment points at the midspan low point: s = wL² / (8H), where s = sag in feet, w = cable weight per foot (lb/ft), L = span length in feet, H = horizontal tension in pounds. Accurate to within 1% when sag is less than 10% of span length.',
    },
    {
      term: 'design clearance margin',
      definition:
        'The additional height above the NESC minimum clearance that a designer builds into the attachment height to account for measurement error, sag variation, thermal expansion, and future cable additions. Standard field practice is 1–2 ft of margin above the NESC minimum. Some pole owners require more.',
    },
    {
      term: 'Grade B crossing',
      definition:
        'A crossing classified under NESC Rule 261 as requiring the highest structural safety factors. Grade B is mandatory for crossings over railroads, limited-access highways, and navigable waterways. Grade B crossings require higher load and strength factors than standard Grade C construction.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L02_VerticalClearanceRule232() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Imagine you hang a clothesline between two poles. The rope sags in the middle —
          it's always lower at the midpoint than at the attachment points. A communication
          cable on a pole line works the same way. The lowest point of that cable is not
          at the pole, it's at the center of the span.
        </p>
        <p className="mt-2">
          <strong>Rule 232</strong> is the NESC rule that says: no matter how much that
          cable sags, its lowest point must still be high enough that it clears whatever
          is underneath it — roads, sidewalks, rail lines, waterways. If your design
          lets the cable hang too low, it's a safety hazard and a code violation.
        </p>
        <p className="mt-2">
          This lesson teaches you to calculate where the cable's low point actually is,
          compare it to the required clearance, and decide whether your design passes.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym / Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC Rule 232</td>
              <td className="px-3 py-2">The clearance rule — minimum height above ground, roads, rail, water</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Table 232-1</td>
              <td className="px-3 py-2">The table inside Rule 232 with specific clearance distances</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">s</td>
              <td className="px-3 py-2">Sag — the vertical drop from attachment height to the low point of the cable at midspan (in feet)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">w</td>
              <td className="px-3 py-2">Cable weight per unit length (lb/ft) — how heavy the cable + strand is per linear foot</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">L</td>
              <td className="px-3 py-2">Span length (ft) — pole-to-pole distance, measured horizontally</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">H</td>
              <td className="px-3 py-2">Horizontal tension (lb) — the constant horizontal pull on the cable at stringing tension</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Required clearances at a glance</h3>
        <p className="mt-2">
          The NESC sets different clearance minimums depending on what's below the cable.
          The following values come from multiple public secondary sources that summarize
          NESC C2-2023 Table 232-1 (confirm from the paid standard for any actual design):
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">What's below the cable</th>
              <th className="px-3 py-2 text-left">Approx. min. clearance</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Roadway with motor-vehicle traffic</td>
              <td className="px-3 py-2 font-semibold">≈ 15.5 ft</td>
              <td className="px-3 py-2">Measured at lowest point under max loading</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Pedestrian-only area (no vehicles)</td>
              <td className="px-3 py-2 font-semibold">≈ 9.5 ft</td>
              <td className="px-3 py-2">Sidewalks with vehicle barriers, trails</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Railroad tracks (active rail)</td>
              <td className="px-3 py-2 font-semibold">Grade B required</td>
              <td className="px-3 py-2">Higher clearance + Grade B construction</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Navigable waterway</td>
              <td className="px-3 py-2 font-semibold">Grade B required</td>
              <td className="px-3 py-2">USACE permit also required for nav. water</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 p-3 border border-blue-400/20 bg-blue-400/5 rounded text-sm text-slate-300/80">
          <strong className="text-blue-300">Source note:</strong> Clearance values above are verified from
          the Hi-Line Application Guide for NESC 2023 (gdsassociates.com, public PDF) and the ikeGPS
          NESC Rule 232 knowledge-base article. Both converge on ≈ 15.5 ft for traffic lanes and ≈ 9.5 ft
          for pedestrian-only areas. Confirm from NESC C2-2023 Table 232-1 for your design.
        </div>

        <div className="mt-4 p-4 border border-red-400/30 bg-red-400/5 rounded-lg text-sm">
          <p className="font-semibold text-red-300 mb-1">Book vs. Field — FHWA 14 ft vs. NESC 15.5 ft: A Critical Distinction</p>
          <p className="text-slate-300/90">
            <strong>The confusion:</strong> When you pull a DOT or county road-crossing permit, the permit
            review often references FHWA (Federal Highway Administration) clearance standards — and the
            FHWA standard truck clearance for overhead signs, bridges, and structures is typically
            <strong> 14 ft</strong>. A designer who sees "14 ft FHWA standard" on a permit review letter
            might think the cable only needs 14 ft of clearance above the road.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Book (NESC):</strong> NESC Rule 232 governs the clearance for communication cable
            attachments — and the NESC minimum is <strong>approximately 15.5 ft</strong> over motor-vehicle
            roadways. NESC is the controlling standard for the cable, not the DOT permit.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> DOT permit reviewers check whether your structure meets
            the highway clearance envelope (14 ft for vehicles). That is a different and separate
            question from whether the cable meets NESC Rule 232 (15.5 ft for comm cables). Getting
            DOT permit approval does NOT mean your design is NESC-compliant. You need 15.5 ft from
            NESC, not 14 ft from the DOT permit.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> A cable hung at 14.5 ft clears the FHWA truck envelope and gets
            the DOT permit — but it violates NESC Rule 232. The ILA with the pole owner will require
            NESC compliance, and an independent inspector can cite you even after the DOT permit was
            issued. The cable is too low. Add 1.5 ft + your design margin (1–2 ft) above 14 ft and
            you're in the right neighborhood for NESC.
          </p>
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — The 1–2 ft design margin</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> NESC Rule 232 sets the legal minimum clearance. If your cable
            measures 15.5 ft at the road surface at maximum sag, you're code-compliant.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Designing to the exact NESC minimum is how you end up with a
            clearance violation two years later when the cable creeps a few inches and the DOT does
            a clearance check. The standard industry practice is to add 1–2 ft of margin above the
            NESC minimum when selecting attachment height. Many pole owners require 2 ft minimum
            margin as a condition of their attachment agreement.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of ignoring the margin:</strong> A clearance violation at a road crossing
            means an emergency re-sag of the entire span — your crew, a traffic control setup,
            a bucket truck, and an inspector, all on short notice. The margin is cheap insurance.
          </p>
        </div>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L02"
          cards={[
            { id: 'T05-L02-fc-rule232', front: 'What does NESC Rule 232 govern, and where is clearance measured?', back: 'Rule 232 sets the minimum vertical clearance cables must maintain above ground, roads, railroads, and water. Clearance is always measured at the lowest point of the cable — which is at midspan under maximum loading conditions (maximum sag).' },
            { id: 'T05-L02-fc-sag-formula', front: 'Write the parabolic sag formula and define each variable.', back: 's = wL² / (8H). s = sag in feet. w = cable weight per foot (lb/ft). L = span length in feet. H = horizontal tension in pounds. Valid within 1% when sag is less than 10% of span length.' },
            { id: 'T05-L02-fc-traffic-clearance', front: 'What is the approximate minimum clearance for a communication cable over a traffic lane?', back: 'Approximately 15.5 ft, per public secondary sources summarizing NESC C2-2023 Table 232-1. Always confirm from the current NESC edition and the pole owner\'s attachment standards for your actual design.' },
            { id: 'T05-L02-fc-margin', front: 'What is the design clearance margin practice and why does it exist?', back: 'Adding 1–2 ft above the NESC minimum when setting attachment height. It accounts for sag variation, thermal expansion, creep, measurement error, and future cable additions. Designing to the bare minimum leaves no tolerance for field variation.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Calculating Whether Your Cable Clears the Road</h2>

        <h3 className="mt-4 font-semibold">The sag formula — step by step</h3>
        <p>
          The sag formula is the parabolic approximation for how much a cable drops below
          its attachment points at midspan. This formula works within 1% of the exact
          catenary calculation when the sag is less than 10% of the span length —
          which covers essentially all normal OSP spans.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200 my-3">
          s = wL² / (8H)
        </div>

        <p>Variables defined:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li><strong>s</strong> = sag (ft) — the vertical drop from the attachment height to the cable's lowest point at midspan</li>
          <li><strong>w</strong> = cable weight per unit length (lb/ft) — includes strand weight + cable weight. Your cable specification sheet gives this value. Typical lashed 12-fiber + strand: 0.14–0.16 lb/ft.</li>
          <li><strong>L</strong> = span length (ft) — horizontal distance from pole to pole. Measured on the map or GPS, not along the cable.</li>
          <li><strong>H</strong> = horizontal tension (lb) — the stringing tension. Set by the design engineer based on the sag chart for the strand type and loading district.</li>
        </ul>

        <p className="mt-3">
          Once you have the sag, the midspan height is simply:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          midspan height = attachment height − sag
        </div>
        <p>
          And the clearance check is:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm my-3">
          margin = midspan height − required clearance
        </div>
        <p className="text-sm text-slate-300/80">
          If margin is positive, you pass. If margin is negative, the cable hangs below
          the required clearance — the design fails and you need to either raise the
          attachment height, increase the tension, or shorten the span.
        </p>

        <h3 className="mt-5 font-semibold">Worked example — residential street crossing, Macon GA (Light district)</h3>
        <p>
          Let's do a complete clearance check for a typical aerial lashed plant scenario.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-3">Scenario</p>
          <ul className="text-sm space-y-1 text-slate-300">
            <li>Location: Macon, GA (NESC Light loading district)</li>
            <li>Cable: 12-fiber OSP cable lashed to 6M strand. Total weight w = 0.145 lb/ft.</li>
            <li>Span: L = 150 ft (pole-to-pole horizontal distance)</li>
            <li>Stringing tension: H = 600 lb</li>
            <li>Attachment height: 22 ft above road surface</li>
            <li>Crossing: residential street with two-way motor-vehicle traffic</li>
            <li>Required clearance: ≈ 15.5 ft (NESC Rule 232, Table 232-1 per secondary sources)</li>
          </ul>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 1: Calculate no-wind sag</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>s = wL² / (8H)</p>
            <p>s = (0.145 × 150²) / (8 × 600)</p>
            <p>s = (0.145 × 22,500) / 4,800</p>
            <p>s = 3,262.5 / 4,800</p>
            <p>s = <strong>0.680 ft</strong> (about 8.2 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: 0.680 ft is about 8 inches. For a 150-ft span with this light
            cable, 8 inches of sag sounds right — a taut clothesline between two houses
            would sag at least that much.
          </p>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 2: Calculate midspan height (no wind)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>midspan height = attachment height − sag</p>
            <p>midspan height = 22.0 − 0.680</p>
            <p>midspan height = <strong>21.32 ft</strong></p>
          </div>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 3: Check clearance margin (no wind)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>margin = midspan height − required clearance</p>
            <p>margin = 21.32 − 15.5</p>
            <p>margin = <strong>+5.82 ft</strong> ✓ PASS</p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: 5.82 ft of margin above the requirement. That's very comfortable
            — the cable would have to sag nearly 6 more feet before reaching a violation.
            This attachment height is more than adequate for this span.
          </p>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 4: Re-check under wind load (Light district, 9 psf)</p>
          <p className="text-sm text-slate-300 mb-2">
            Wind pushes the cable sideways AND increases the effective weight pulling it
            downward. The combined load method:
          </p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>Strand projected area = 0.5 in OD = 0.5/12 = 0.042 ft²/ft</p>
            <p>w_wind = wind pressure × projected area</p>
            <p>w_wind = 9 psf × 0.042 ft²/ft = 0.375 lb/ft</p>
            <p></p>
            <p>w_combined = √(w² + w_wind²)</p>
            <p>w_combined = √(0.145² + 0.375²)</p>
            <p>w_combined = √(0.0210 + 0.1406)</p>
            <p>w_combined = √0.1616 = <strong>0.402 lb/ft</strong></p>
            <p></p>
            <p>s_wind = (0.402 × 22,500) / 4,800 = 9,045 / 4,800 = <strong>1.885 ft</strong></p>
            <p>midspan height (wind) = 22.0 − 1.885 = <strong>20.12 ft</strong></p>
            <p>margin (wind) = 20.12 − 15.5 = <strong>+4.62 ft</strong> ✓ PASS</p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: Under a 9-psf windstorm (approximately 60 mph) the cable sags
            from 8 inches to nearly 23 inches — nearly three times as much. Yet the cable
            still clears the road by more than 4 feet. This is a well-designed span at a
            comfortable attachment height.
          </p>
        </div>

        {/* WorkedExample interactive widget */}
        <WorkedExample
          title="Clearance Check Calculator"
          description="Enter your span parameters to calculate sag and check clearance against the NESC Rule 232 minimum."
          variables={[
            { id: 'w', label: 'Cable weight w (lb/ft)', defaultValue: 0.145, min: 0.05, max: 1.0, step: 0.005 },
            { id: 'L', label: 'Span length L (ft)', defaultValue: 150, min: 50, max: 400, step: 5 },
            { id: 'H', label: 'Horizontal tension H (lb)', defaultValue: 600, min: 100, max: 3000, step: 50 },
            { id: 'attach', label: 'Attachment height (ft)', defaultValue: 22, min: 15, max: 50, step: 0.5 },
            { id: 'reqd', label: 'Required clearance (ft)', defaultValue: 15.5, min: 9.5, max: 25, step: 0.5 },
          ]}
          formula="s = wL² / (8H)"
          steps={[
            { label: 'Sag (ft)', expression: '(w * L * L) / (8 * H)', varIds: ['w', 'L', 'H'] },
            { label: 'Midspan height (ft)', expression: 'attach - ((w * L * L) / (8 * H))', varIds: ['attach', 'w', 'L', 'H'] },
            { label: 'Clearance margin (ft)', expression: '(attach - ((w * L * L) / (8 * H))) - reqd', varIds: ['attach', 'w', 'L', 'H', 'reqd'] },
          ]}
          sanityCheck="If the clearance margin is positive, the design passes. Negative margin = clearance violation. Field practice: aim for at least 2 ft of positive margin."
        />

        {/* SliderExploration: vary span, watch sag grow nonlinearly */}
        <SliderExploration
          title="How Sag Grows with Span Length"
          description="Move the span slider and watch how sag changes. Notice that sag grows with the SQUARE of span — doubling the span quadruples the sag."
          variables={[
            { id: 'L_span', label: 'Span length (ft)', min: 50, max: 300, step: 5, defaultValue: 150 },
          ]}
          derivedValues={[
            {
              id: 'sag_val',
              label: 'Sag at w=0.145, H=600 (ft)',
              expression: '(0.145 * L_span * L_span) / (8 * 600)',
              varIds: ['L_span'],
            },
            {
              id: 'midspan_val',
              label: 'Midspan height at 22 ft attachment (ft)',
              expression: '22 - (0.145 * L_span * L_span) / (8 * 600)',
              varIds: ['L_span'],
            },
          ]}
          insight="At 150 ft, sag is about 0.68 ft. At 300 ft (doubled span), sag is about 2.72 ft — four times as much, not twice. This L² relationship is why long spans need higher attachment heights or higher tension."
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Grade B Crossings and Special Clearances</h2>

        <h3 className="mt-4 font-semibold">When Grade B construction is required</h3>
        <p>
          Most residential and rural pole lines are Grade C construction — the standard
          safety factor level. But certain crossings require <strong>Grade B</strong>
          construction, which uses higher load and strength factors (covered in detail in
          T05.L04).
        </p>
        <p className="mt-2">
          Grade B is required by NESC Rule 261 at:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>Active railroad crossings</strong> — any span that crosses over active rail tracks</li>
          <li><strong>Limited-access highways</strong> — interstates and other limited-access roads where stopping to address a downed line is not possible</li>
          <li><strong>Navigable waterways</strong> — rivers and channels where boat traffic could contact a low cable</li>
        </ul>
        <p className="mt-2">
          For Grade B crossings, in addition to the higher structural factors, the clearance
          requirements are also higher. If your corridor contains a railroad crossing, begin
          the permit process early — rail permits can take six months to a year to obtain,
          and the railroad's engineering department will require detailed span calculations.
        </p>

        <h3 className="mt-5 font-semibold">Clearance measured at maximum sag, not initial sag</h3>
        <p>
          A critical detail: clearance is checked under the <em>design loading condition</em>,
          which is the condition that produces the maximum sag — not the sag immediately
          after stringing.
        </p>
        <p className="mt-2">
          For most OSP spans in the NESC Light district (no ice), maximum sag typically
          occurs at the highest summer temperature (thermal expansion stretches the strand
          and increases sag). In Heavy and Medium districts, maximum sag may occur under
          the combined ice + wind condition.
        </p>
        <p className="mt-2">
          Your sag-tension chart for the chosen strand type will give you the design sag
          at the controlling condition. Always verify clearance against the maximum sag
          in the sag-tension table, not the initial stringing sag.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L02 Check — Vertical Clearance — Rule 232"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L02-Q1',
            type: 'mc',
            prompt:
              'Per public secondary sources summarizing NESC Rule 232 Table 232-1, what is the approximate minimum clearance for a communication cable over a motor-vehicle road?',
            choices: [
              '9.5 ft',
              '12.0 ft',
              '15.5 ft',
              '18.0 ft',
            ],
            answerIndex: 2,
            explanation:
              'Approximately 15.5 ft for communication cables over traffic lanes, per the Hi-Line Application Guide and ikeGPS NESC Rule 232 articles (both summarizing NESC C2-2023 Table 232-1). Confirm from the paid NESC standard for your design.',
            citation: 'Hi-Line Application Guide for NESC 2023; ikeGPS NESC Rule 232 knowledge-base article.',
          },
          {
            id: 'T05-L02-Q2',
            type: 'mc',
            prompt:
              'A span has w = 0.200 lb/ft, L = 120 ft, H = 700 lb. Calculate the sag.',
            choices: [
              '0.514 ft (about 6.2 inches)',
              '0.750 ft (about 9 inches)',
              '1.029 ft (about 12.3 inches)',
              '0.257 ft (about 3.1 inches)',
            ],
            answerIndex: 0,
            explanation:
              's = wL² / (8H) = (0.200 × 120²) / (8 × 700) = (0.200 × 14,400) / 5,600 = 2,880 / 5,600 = 0.514 ft. That\'s about 6.2 inches of sag at midspan for this span and tension.',
          },
          {
            id: 'T05-L02-Q3',
            type: 'mc',
            prompt:
              'Where exactly is clearance measured for a NESC Rule 232 check?',
            choices: [
              'At the pole, where the cable attaches to the crossarm',
              'At the midspan point — the lowest point of the cable under design loading',
              'At 10 ft from each pole on both sides of the span',
              'At the average height of the cable over the entire span length',
            ],
            answerIndex: 1,
            explanation:
              'Clearance is always measured at the lowest point of the cable, which is at or near midspan under design loading conditions (maximum sag). The cable is highest at the attachment points and lowest in the middle.',
          },
          {
            id: 'T05-L02-Q4',
            type: 'mc',
            prompt:
              'Which crossing type requires Grade B construction under NESC Rule 261?',
            choices: [
              'Residential side street with a speed limit under 25 mph',
              'Gravel private driveway on a farm',
              'Limited-access interstate highway',
              'Paved county road in a rural area',
            ],
            answerIndex: 2,
            explanation:
              'Grade B construction is required for limited-access highways (interstates), active railroad crossings, and navigable waterways. Residential streets and county roads are Grade C. The higher Grade B safety factors reflect the higher consequence of a line failure at these locations.',
            citation: 'NESC Rule 261 (per ikeGPS NESC Grades of Construction article + Federated Rural NESC 2017 chart).',
          },
          {
            id: 'T05-L02-Q5',
            type: 'fill-in-blank',
            prompt:
              'A cable sags ____ more when the span is doubled (all else equal), because sag is proportional to ____.',
            answer: '4x more / L-squared',
            answerDisplay: '4 times more / L² (span length squared)',
            explanation:
              'The sag formula s = wL²/(8H) shows that sag grows with L². Double the span from 150 ft to 300 ft, and the sag increases by a factor of (300/150)² = 4. This quadratic relationship is the main reason longer spans require either higher attachment heights or higher stringing tensions.',
          },
        ]}
      />

    </LessonLayout>
  );
}
