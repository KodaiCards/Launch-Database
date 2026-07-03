// T03.L09 — ADSS Span/Wind/Ice Loading
// Advanced working lesson: NESC loading districts, ice/wind load formulas, sag calc

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T03.L09',
  course_id: 'T03',
  title: 'ADSS Span, Wind, and Ice Loading',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T03.L04'],
  learning_objectives: [
    'Identify the NESC loading district (Heavy / Medium / Light) applicable to a given project location',
    'Calculate wind load per unit length and ice weight per unit length for a cable in a given district',
    'Apply the parabolic sag formula to find sag for a given span, unit weight, and tension',
    'Use a manufacturer ADSS span table to select a cable meeting EDS and MAT requirements',
    'Explain when Extreme Wind loading (NESC Rule 250C) applies and why it supplements the standard three-district table',
  ],
  vocabulary_introduced: [
    'NESC loading district',
    'Extreme Wind loading',
    'radial ice thickness',
    'wind pressure',
    'MAT (Maximum Allowable Tension)',
  ],
  vocabulary_assumed: [
    { term: 'span',       source_lesson_id: 'T01.L02' },
    { term: 'sag',        source_lesson_id: 'T01.L02' },
    { term: 'ADSS',       source_lesson_id: 'T01.L08' },
    { term: 'EDS',        source_lesson_id: 'T03.L04' },
    { term: 'RTS',        source_lesson_id: 'T03.L04' },
    { term: 'NESC',       source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'NESC loading district',
      definition:
        'A geographic classification in NESC C2 Section 25 (Rule 250B Table 250-1) defining the simultaneous ice, wind, and temperature design loading a pole line must withstand. Three districts: Heavy (0.50 in. radial ice + 4 lb/ft² wind + 0°F), Medium (0.25 in. radial ice + 4 lb/ft² wind + 15°F), Light (0 in. ice + 9 lb/ft² wind + 30°F). [Confirm against NESC C2-2023 Table 250-1 — values confirmed via RUS 1724E-150 + IAEI Magazine]',
    },
    {
      term: 'Extreme Wind loading',
      definition:
        'An additional NESC C2 loading case (Rule 250C) applied when structures or conductors exceed 60 ft above ground. Uses regional wind speed maps rather than the three-district table. If any part of a pole or attached conductor is 60 ft or more above ground, Extreme Wind loading must be considered. (Source: IAEI 2007 NESC article; RUS 1724E-150)',
    },
    {
      term: 'radial ice thickness',
      definition:
        'The radial buildup of ice on cables and conductors, measured in inches of ice added uniformly around the cable circumference. Heavy district: 0.50 in. radial. Medium district: 0.25 in. radial. Adds both weight and projected area (increasing wind load on the iced cable).',
    },
    {
      term: 'wind pressure',
      definition:
        'Horizontal pressure on the cable\'s projected area from wind, in lb/ft². Used with cable projected diameter to calculate horizontal load per unit length. Light district: 9 lb/ft². Heavy and Medium districts: 4 lb/ft².',
    },
    {
      term: 'MAT (Maximum Allowable Tension)',
      definition:
        'The manufacturer-rated maximum tension the ADSS cable may experience under any design loading combination. Must not be exceeded at the highest-load case (ice + wind + temperature). Checked against EDS target to ensure the everyday tension is within the 16–25% RTS range.',
    },
  ],
  estimated_minutes: 32,
};

export default function T03L09_ADSSSpanWindIceLoading() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          An aerial cable hanging between two poles isn't just fighting gravity — it's
          fighting winter ice that coats it, wind that pushes sideways on it, and
          temperature changes that cause it to sag more in summer and tighten in winter.
        </p>
        <p className="mt-2">
          The NESC (National Electrical Safety Code) divides the country into three
          <strong> loading districts</strong> — Heavy, Medium, and Light — based on the
          worst-case ice and wind conditions a structure in that region must be designed
          to survive. If you're in Macon, GA, you're in the Light district. If you're
          near Boston, you're in the Heavy district. The design loads are completely
          different, and so are the cable tension limits and sag calculations.
        </p>
        <p className="mt-2">
          This lesson teaches you how to calculate the actual load on an ADSS cable
          under design conditions — and whether your sag will meet NESC clearance
          requirements.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Stands for</th>
              <th className="px-3 py-2 text-left">Practical meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">The standard governing aerial utility line design in the U.S. (ANSI C2)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">EDS</td>
              <td className="px-3 py-2">Everyday Stress</td>
              <td className="px-3 py-2">Cable tension at normal conditions; expressed as % of RTS (16–25% target)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">RTS</td>
              <td className="px-3 py-2">Rated Tensile Strength</td>
              <td className="px-3 py-2">Cable's rated breaking force in lbf or N</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MAT</td>
              <td className="px-3 py-2">Maximum Allowable Tension</td>
              <td className="px-3 py-2">Manufacturer's maximum rated tension — must not be exceeded at any load case</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── NESC LOADING DISTRICTS TABLE ─────────────────────────────────── */}
      <table className="lesson-table">
        <caption>NESC Loading Districts — Design Load Values and Regions (NESC C2-2023 Table 250-1 / Rule 250B)</caption>
        <thead>
          <tr>
            <th>District</th>
            <th>Radial Ice (in.)</th>
            <th>Wind Pressure (lb/ft²)</th>
            <th>Temperature (°F)</th>
            <th>Typical Geography</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Heavy</td>
            <td>0.50 in.</td>
            <td>4 lb/ft²</td>
            <td>0°F</td>
            <td>Northeast states, Great Lakes region, mountainous areas. All three loads act simultaneously — design for the combined effect.</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>0.25 in.</td>
            <td>4 lb/ft²</td>
            <td>15°F</td>
            <td>Mid-Atlantic, Midwest transition zones. Intermediate ice loading — cables still require ice-load analysis.</td>
          </tr>
          <tr>
            <td>Light</td>
            <td>0 in.</td>
            <td>9 lb/ft²</td>
            <td>30°F</td>
            <td>Southeastern U.S. (including Macon, GA — central Georgia), Pacific coast, southwest. No ice load, but higher wind pressure than Heavy/Medium (9 vs. 4 lb/ft²). [Confirm via NESC C2-2023 loading district map or local AHJ]</td>
          </tr>
          <tr>
            <td>Extreme Wind overlay (Rule 250C)</td>
            <td>0 in.</td>
            <td>Regional wind speed map (varies)</td>
            <td>60°F</td>
            <td>Applies to any structure where any part of the pole or attached conductors is 60 ft or more above ground — anywhere in the country. Uses wind pressure calculated from regional wind speed maps per NESC Rule 250C. Checked in addition to the base district values.</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3 mt-2">
        Values confirmed via RUS Bulletin 1724E-150 (which reproduces NESC Table 250-1 data) and IAEI 2002/2007 NESC articles. Confirm against NESC C2-2023 Table 250-1 before use in formal engineering deliverables.
      </p>

      {/* ── WORKING ──────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Loading District Values and Load Calculation</h2>

        <h3 className="mt-4 font-semibold">The three NESC loading district values</h3>
        <p>
          NESC C2-2023 Table 250-1 (Rule 250B) defines three simultaneous design loads:
          radial ice, horizontal wind pressure, and temperature. All three act at the
          same time for the design load case.
        </p>
        <p className="mt-2 text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3">
          Values below confirmed via RUS Bulletin 1724E-150 (which reproduces the NESC
          Table 250-1 data) and IAEI Magazine 2002 NESC article. Exact NESC C2-2023
          table text is paywalled. [Confirm against NESC C2-2023 Table 250-1 when
          designing for formal engineering deliverables.]
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">District</th>
                <th className="px-3 py-2 text-left">Radial ice (in.)</th>
                <th className="px-3 py-2 text-left">Wind pressure (lb/ft²)</th>
                <th className="px-3 py-2 text-left">Temperature (°F)</th>
                <th className="px-3 py-2 text-left">Geography (typical)</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10 bg-red-900/10">
                <td className="px-3 py-2 font-semibold text-red-300">Heavy</td>
                <td className="px-3 py-2">0.50 in.</td>
                <td className="px-3 py-2">4 lb/ft²</td>
                <td className="px-3 py-2">0°F</td>
                <td className="px-3 py-2">Northeast, Great Lakes, mountains</td>
              </tr>
              <tr className="border-t border-white/10 bg-yellow-900/10">
                <td className="px-3 py-2 font-semibold text-yellow-300">Medium</td>
                <td className="px-3 py-2">0.25 in.</td>
                <td className="px-3 py-2">4 lb/ft²</td>
                <td className="px-3 py-2">15°F</td>
                <td className="px-3 py-2">Mid-Atlantic, Midwest transition</td>
              </tr>
              <tr className="border-t border-white/10 bg-green-900/10">
                <td className="px-3 py-2 font-semibold text-green-300">Light</td>
                <td className="px-3 py-2">0 in.</td>
                <td className="px-3 py-2">9 lb/ft²</td>
                <td className="px-3 py-2">30°F</td>
                <td className="px-3 py-2">Southeast, Pacific coast, southwest</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: NESC C2-2023 Table 250-1 via RUS Bulletin 1724E-150 (public) +
          IAEI Magazine 2002 NESC article (verified via ≥2 independent public sources).
        </p>

        <h3 className="mt-5 font-semibold">Ice load formula — what that ice weighs</h3>
        <p>
          When ice forms on a cable, it creates an ice shell that adds both weight (downward)
          and projected area (horizontal wind load on the iced cable). The standard ice load
          formula from NESC engineering practice:
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 my-3 text-slate-200">
          w_ice = 1.244 × t × (D + t)
        </div>

        <p>
          Where:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>t</strong> = radial ice thickness in inches (Heavy = 0.50 in.; Medium = 0.25 in.)</li>
          <li><strong>D</strong> = cable outer diameter in inches</li>
          <li><strong>Result (w_ice)</strong> = ice weight in lb/ft</li>
        </ul>

        <div className="mt-3 border border-blue-400/20 rounded-lg p-4 bg-blue-400/5 text-sm">
          <p className="font-semibold text-blue-300 mb-1">Where does 1.244 come from?</p>
          <p className="text-slate-300/90">
            The ice shell is a thin annular ring around the cable. Its cross-sectional area
            = π × t × (D + t) [in², using thin-shell approximation]. Ice density ≈ 57 lb/ft³.
            Converting in² to ft² requires dividing by 144 (= 12²). So the constant is:
          </p>
          <div className="font-mono mt-2 text-slate-200">
            π × 57 / 144 ≈ 1.244
          </div>
          <p className="text-slate-300/90 mt-1">
            This is the NESC-standard shorthand formula for ice load on cables. (Derivation
            confirmed independently — consistent with published NESC engineering practice.)
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Wind load formula</h3>
        <p>
          Horizontal wind load on the cable:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 my-3 text-slate-200">
          w_wind = wind_pressure × (D + 2t) / 12
        </div>
        <p className="text-sm">
          Where:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>wind_pressure</strong> = NESC wind pressure in lb/ft² (Light: 9; Heavy/Medium: 4)</li>
          <li><strong>D + 2t</strong> = iced cable outer diameter in inches (bare cable if no ice)</li>
          <li><strong>Divide by 12</strong> converts inches to feet for the per-foot result</li>
          <li><strong>Result</strong> = horizontal wind load in lb/ft</li>
        </ul>

        <h3 className="mt-5 font-semibold">Total transverse load — combining ice and wind</h3>
        <p>
          Ice load acts downward (adds to cable weight). Wind load acts horizontally.
          The combined (resultant) load per unit length is the vector sum:
        </p>
        <div className="rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 my-3 text-slate-200">
          w_total = √( (w_cable + w_ice)² + w_wind² )
        </div>
        <p className="text-sm text-slate-300/80">
          The total transverse load (w_total) is used in the sag formula instead of just
          cable weight alone. This tells you the sag under the worst design loading case,
          which is what you check against NESC clearance requirements.
        </p>
      </section>

      {/* ── WORKED EXAMPLE: ADSS loading calculator ──────────────────────── */}
      <WorkedExample
        title="ADSS Loading and Sag Calculator — NESC Design Check"
        description="Calculate ice load, wind load, total transverse load, and midspan sag for an ADSS cable under NESC design conditions. Select your loading district and enter cable parameters. All values are illustrative — verify against your specific cable datasheet and NESC C2-2023 for formal engineering deliverables. [Confirm NESC loading district values against NESC C2-2023 Table 250-1]"
        variables={[
          {
            key: 'district',
            label: 'Loading district',
            units: '',
            default: 0,
            min: 0,
            max: 2,
            step: 1,
            displayValues: ['Light (0 in. ice, 9 lb/ft² wind, 30°F)', 'Medium (0.25 in. ice, 4 lb/ft² wind, 15°F)', 'Heavy (0.50 in. ice, 4 lb/ft² wind, 0°F)'],
          },
          { key: 'span',    label: 'Span length',       units: 'ft',   default: 200,  min: 50,   max: 1000, step: 10 },
          { key: 'D_in',    label: 'Cable OD',           units: 'in',   default: 0.71, min: 0.30, max: 1.50, step: 0.01 },
          { key: 'w_cable', label: 'Cable weight',       units: 'lb/ft', default: 0.068, min: 0.02, max: 0.30, step: 0.001 },
          { key: 'rts',     label: 'RTS',                units: 'lbf',  default: 2000, min: 500,  max: 10000, step: 100 },
          { key: 'eds_pct', label: 'EDS as % of RTS',   units: '%',    default: 20,   min: 10,   max: 30,   step: 1 },
        ]}
        formula={({ district, span, D_in, w_cable, rts, eds_pct }) => {
          const iceThick = [0, 0.25, 0.50][Math.round(district)];
          const windPressure = district === 0 ? 9 : 4;
          const w_ice = iceThick > 0 ? 1.244 * iceThick * (D_in + iceThick) : 0;
          const D_iced = D_in + 2 * iceThick;
          const w_wind = windPressure * (D_iced / 12);
          const w_total = Math.sqrt(Math.pow(w_cable + w_ice, 2) + Math.pow(w_wind, 2));
          const T = (eds_pct / 100) * rts;
          const sag = (w_total * span * span) / (8 * T);
          return sag;
        }}
        steps={({ district, span, D_in, w_cable, rts, eds_pct }, sag) => {
          const d = Math.round(district);
          const iceThick = [0, 0.25, 0.50][d];
          const windPressure = d === 0 ? 9 : 4;
          const w_ice = iceThick > 0 ? 1.244 * iceThick * (D_in + iceThick) : 0;
          const D_iced = D_in + 2 * iceThick;
          const w_wind = windPressure * (D_iced / 12);
          const w_vert = w_cable + w_ice;
          const w_total = Math.sqrt(w_vert * w_vert + w_wind * w_wind);
          const T = (eds_pct / 100) * rts;
          const sagPct = (sag / span) * 100;
          const distLabel = ['Light', 'Medium', 'Heavy'][d];
          return [
            { expression: `Loading district: ${distLabel} — ice t = ${iceThick} in., wind = ${windPressure} lb/ft²` },
            { expression: `Step 1 — Ice load: w_ice = 1.244 × ${iceThick} × (${D_in} + ${iceThick}) = ${w_ice.toFixed(4)} lb/ft` },
            { expression: `Step 2 — Iced diameter: D_iced = ${D_in} + 2 × ${iceThick} = ${D_iced.toFixed(2)} in.` },
            { expression: `Step 3 — Wind load: w_wind = ${windPressure} × (${D_iced.toFixed(2)} / 12) = ${w_wind.toFixed(4)} lb/ft` },
            { expression: `Step 4 — Vertical load: w_vert = ${w_cable} + ${w_ice.toFixed(4)} = ${w_vert.toFixed(4)} lb/ft` },
            { expression: `Step 5 — Total transverse: w_total = √(${w_vert.toFixed(4)}² + ${w_wind.toFixed(4)}²) = ${w_total.toFixed(4)} lb/ft` },
            { expression: `Step 6 — EDS tension: T = ${eds_pct}% × ${rts} = ${T.toFixed(0)} lbf` },
            { expression: `Step 7 — Parabolic sag: Sag = (${w_total.toFixed(4)} × ${span}²) / (8 × ${T.toFixed(0)})`, value: sag, unit: 'ft' },
            { expression: `Sag as % of span = ${sag.toFixed(2)} / ${span} × 100 = ${sagPct.toFixed(1)}%` },
          ];
        }}
        sanityCheck={(sag) => {
          if (!isFinite(sag) || sag <= 0) return 'Check inputs — sag cannot be computed with these values.';
          const note = `${sag.toFixed(2)} ft midspan sag under design loading. `;
          if (sag > 15) return `${note}⚠ Large sag — verify NESC clearance per Rule 232 for the applicable crossing type and loading district. May require shorter span or higher EDS tension.`;
          return `${note}Check against NESC Rule 232 minimum clearance requirements for your crossing type (road, railway, navigable water). This is the design-case sag; everyday sag (no wind, no ice) will be less.`;
        }}
        resultLabel="Design-case midspan sag"
        resultUnit="ft"
        resultDecimals={2}
      />

      {/* ── SLIDER: span vs sag ───────────────────────────────────────────── */}
      <SliderExploration
        title="Span Length vs. Midspan Sag — Light District"
        description="Watch how sag grows as span increases (quadratic relationship). Fixed: Light district (no ice, 9 lb/ft² wind), 0.68 lb/ft cable, 0.71 in. OD, EDS = 20% of 2,000 lbf RTS = 400 lbf."
        variables={[
          { key: 'span', label: 'Span length', units: 'ft', min: 50, max: 600, step: 10, default: 200 },
        ]}
        compute={({ span }) => {
          // Light district: no ice, 9 lb/ft² wind, D = 0.71 in, w_cable = 0.068 lb/ft
          const w_cable = 0.068;
          const windPressure = 9;
          const D_in = 0.71;
          const w_wind = windPressure * (D_in / 12);
          const w_total = Math.sqrt(w_cable * w_cable + w_wind * w_wind);
          const T = 400; // 20% × 2000 lbf
          const sag = (w_total * span * span) / (8 * T);
          const sagPct = (sag / span) * 100;
          return {
            'Design-case sag (ft)': parseFloat(sag.toFixed(2)),
            'Sag as % of span': parseFloat(sagPct.toFixed(1)),
            'Total transverse load (lb/ft)': parseFloat(w_total.toFixed(3)),
          };
        }}
        guidance="Notice that sag grows with the SQUARE of span length: doubling the span quadruples the sag. This is why long spans require either much higher cable tension or much heavier messenger/strength members — clearance requirements don't scale with span the same way sag does."
      />

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">Extreme Wind loading — the 60-ft rule</h3>
        <p>
          In addition to the three district-based load cases, NESC Rule 250C requires
          an Extreme Wind load check for any structure or conductor that reaches 60 ft or
          more above ground. The Extreme Wind case uses regional wind speed maps (ASCE 7
          wind speed contour maps) to determine site-specific design wind pressure — not
          the flat 4 or 9 lb/ft² from the district table.
        </p>
        <p className="mt-2">
          "If any part of a pole or the conductors attached to it is 60 feet or more above
          the ground, then extreme wind loading has to be considered." (Source: IAEI 2007
          NESC article — verified)
        </p>
        <p className="mt-2">
          For standard FTTH distribution poles (35–55 ft total height), Extreme Wind
          typically doesn't govern. For telecom-electric joint-use poles at 60–80 ft
          total height, or for transmission-line crossings, Extreme Wind becomes the
          controlling load case.
        </p>

        <h3 className="mt-5 font-semibold">Temperature effects on sag — the cable creep problem</h3>
        <p>
          Aerial cables experience two types of long-term sag increase beyond what the
          initial sag formula predicts:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Thermal elongation:</strong> The aramid yarn or fiberglass strength
            members in ADSS cable expand with temperature (less than steel messenger, but
            not zero). At +50°F above the stringing temperature, sag will increase
            measurably. ADSS sag-tension charts account for thermal elongation explicitly.
          </li>
          <li>
            <strong>Aramid creep:</strong> Aramid yarn strength members exhibit long-term
            creep — a slow permanent elongation under sustained tension over years. ADSS
            manufacturers account for creep in their design tables; the design must include
            a creep allowance or the cable will sag progressively below clearance over
            the plant's 30-year life.
          </li>
        </ul>
        <p className="mt-2">
          Both effects mean the initial stringing sag should have margin above the NESC
          clearance minimum — not be right at the clearance boundary. Standard practice:
          target a design sag that leaves at least 1 ft of clearance margin above the
          NESC minimum after accounting for thermal + creep sag increase.
        </p>

        <h3 className="mt-5 font-semibold">From math to catalog — reading a manufacturer span table</h3>
        <p>
          The load calculations above tell you the forces on the cable. The manufacturer's
          span table tells you whether a specific cable product survives those forces at
          your span length. Here's how to use one:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Identify your loading district</strong> — Heavy, Medium, or Light.
            Confirm with your NESC loading district map (NESC C2-2023 Figure 250-2) or
            check your state's standard for local overlay maps.
          </li>
          <li>
            <strong>Find the span column</strong> for your design span length (e.g., 300 ft).
            Look up the corresponding row for the NESC loading district.
          </li>
          <li>
            <strong>Read EDS%</strong> — the table will show EDS as a percent of RTS at
            the design span under the stated loading conditions. Confirm it falls in the
            16–25% RTS range for vibration-managed design (or &lt;16% if no dampers).
          </li>
          <li>
            <strong>Verify MAT is not exceeded</strong> — the table shows maximum tension
            at the worst-case load case (usually the ice + wind + temperature loading).
            Confirm this does not exceed the cable's MAT.
          </li>
          <li>
            <strong>Check sag at the design temperature</strong> — the table typically
            shows sag at the NESC design temperature (+ initial, + final after creep).
            Confirm sag stays within your clearance budget.
          </li>
        </ol>
        <p className="mt-2 text-sm text-amber-300/90 border-l-4 border-amber-400/30 pl-3">
          <strong>Field tip:</strong> Real ADSS datasheets from CommScope, OCC, Corning,
          and similar manufacturers have span tables broken out by NESC loading district.
          Always use the district-specific table for your project geography, not the
          generic "maximum span" headline number on the product page.
        </p>
        <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
          <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
          <p className="text-slate-200 mb-3">
            Wind and ice loading analysis is the foundation for safe pole design:
          </p>
          <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
            <li><strong>T05.L02 NESC Loading District Selection</strong> — Light / Medium / Heavy districts define design wind speed (88 / 100 / 120 mph) and ice load (0.5 / 1.0 / 2.0 in). Your ADSS cable choice must match the district. Heavy-district ADSS requires heavier strength members or shorter spans than Light-district ADSS.</li>
            <li><strong>T05.L03 Pole Strength Calculation</strong> — ADSS span tensioning (determined by wind/ice loads) feeds into pole selection. The pole must support the cable tension PLUS all the guys and other cables. Wrong load assumption = under-specified pole = failure risk.</li>
            <li><strong>T07.L01 Staking &amp; Guy Specification</strong> — High-EDS ADSS in windy/icy regions requires multiple guys on certain poles. Load analysis determines how many guys and at what angles. Under-guying = cable sag increase + potential splice-closure movement.</li>
          </ul>
          <p className="text-slate-200 mt-3 text-sm italic">
            Weather loading is not a theory exercise — it's the physical basis for whether your plant survives the next ice storm or high-wind event.
          </p>
        </section>
      </section>

      {/* ── KEY TERMS FLASHCARDS ──────────────────────────────────────────── */}
      <Flashcard
        deckId="T03-L09"
        cards={[
          {
            id: 'T03-L09-fc-districts',
            front: 'What are the three NESC loading districts and their ice/wind values?',
            back: 'Heavy: 0.50 in. radial ice + 4 lb/ft² wind + 0°F. Medium: 0.25 in. radial ice + 4 lb/ft² wind + 15°F. Light: 0 in. ice + 9 lb/ft² wind + 30°F. [Confirm against NESC C2-2023 Table 250-1 — values confirmed via RUS 1724E-150 + IAEI Magazine via ≥2 public sources]',
          },
          {
            id: 'T03-L09-fc-iceformula',
            front: 'What is the NESC ice load formula for a cable?',
            back: 'w_ice = 1.244 × t × (D + t) lb/ft, where t = radial ice thickness in inches and D = cable OD in inches. The constant 1.244 = π × ice_density(57 lb/ft³) / 144 (in²-to-ft² conversion). For Light district (no ice): w_ice = 0.',
          },
          {
            id: 'T03-L09-fc-extreme',
            front: 'When does Extreme Wind loading apply under NESC?',
            back: 'NESC Rule 250C: Extreme Wind loading must be considered when any part of a pole or its conductors is 60 ft or more above ground. Uses regional ASCE 7 wind speed maps for site-specific design pressure rather than the flat district table values. (IAEI 2007 NESC article; RUS 1724E-150 — verified)',
          },
          {
            id: 'T03-L09-fc-mat',
            front: 'What is MAT (Maximum Allowable Tension) for an ADSS cable?',
            back: 'The manufacturer-rated maximum tension the ADSS cable may experience under any design loading combination (ice + wind + temperature). Must never be exceeded at the worst-case NESC load case. The design checks both MAT (never exceeded) and EDS (16–25% of RTS at everyday conditions).',
          },
          {
            id: 'T03-L09-fc-windpressure',
            front: 'What are the NESC wind pressure values for each loading district?',
            back: 'Light district: 9 lb/ft² wind pressure (no ice). Medium district: 4 lb/ft² wind pressure + 0.25 in. radial ice. Heavy district: 4 lb/ft² wind pressure + 0.50 in. radial ice. Wind load per unit length = (wind pressure) × (cable projected diameter including ice) ÷ 12. [Confirm against NESC C2-2023 Table 250-1]',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ───────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T03"
        assessmentId="T03-L09"
        title="Check — ADSS Span, Wind, and Ice Loading"
        fallback={
        <Quiz
          title="Check — ADSS Span, Wind, and Ice Loading"
          mode="multiple-choice"
          questions={[
            {
              id: 'T03-L09-Q1',
              type: 'mc',
              prompt:
                'A project site in central Georgia (Light loading district) has an ADSS cable with OD = 0.71 in. What is the ice load (w_ice) per foot for this cable under NESC design conditions?',
              choices: [
                '0 lb/ft — Light district has no ice loading',
                '0.044 lb/ft — calculated using w_ice = 1.244 × 0.25 × (0.71 + 0.25)',
                '0.135 lb/ft — calculated using w_ice = 1.244 × 0.50 × (0.71 + 0.50)',
                '0.068 lb/ft — equal to the cable weight per foot',
              ],
              answerIndex: 0,
              explanation:
                'Light loading district has zero radial ice: t = 0 in. Therefore w_ice = 1.244 × 0 × (D + 0) = 0 lb/ft. No ice load applies. Only wind load (9 lb/ft²) and cable self-weight need to be combined for the total transverse load. [Confirm: Macon, GA is in the Light district — consistent with central Georgia geography; verify via NESC C2-2023 loading district map or RUS engineering support]',
            },
            {
              id: 'T03-L09-Q2',
              type: 'mc',
              prompt:
                'An ADSS cable in the Heavy loading district has an OD = 0.71 in. (D = 0.71 in.) and t = 0.50 in. of radial ice. What is w_ice using the NESC formula?',
              choices: [
                '0.750 lb/ft',
                '0.377 lb/ft',
                '1.244 × 0.50 × 1.21 ≈ 0.752 lb/ft',
                '0.068 lb/ft',
              ],
              answerIndex: 2,
              explanation:
                'w_ice = 1.244 × t × (D + t) = 1.244 × 0.50 × (0.71 + 0.50) = 1.244 × 0.50 × 1.21 ≈ 0.752 lb/ft. Step-by-step: D + t = 0.71 + 0.50 = 1.21 in.; 1.244 × 0.50 = 0.622; 0.622 × 1.21 = 0.75262 → rounds to ≈ 0.752 lb/ft using the exact constant π×57/144 = 1.2435. This adds substantially to the vertical load in the Heavy district.',
            },
            {
              id: 'T03-L09-Q3',
              type: 'fill-in-blank',
              prompt:
                'NESC Extreme Wind loading must be considered whenever any part of a pole or its conductors is ________ feet or more above the ground.',
              answer: '60',
              answerDisplay: '60 feet',
              explanation:
                'NESC Rule 250C: "If any part of a pole or the conductors attached to it is 60 feet or more above the ground, then extreme wind loading has to be considered." (Source: IAEI 2007 NESC article — verified) This uses regional wind speed maps (ASCE 7) rather than the flat district table values.',
            },
            {
              id: 'T03-L09-Q4',
              type: 'mc',
              prompt:
                'In the parabolic sag formula Sag = (w × L²) / (8 × T), what happens to sag if the span L is doubled while all other values stay the same?',
              choices: [
                'Sag doubles',
                'Sag increases by 50%',
                'Sag quadruples (increases by 4×)',
                'Sag is unchanged — sag is independent of span',
              ],
              answerIndex: 2,
              explanation:
                'Sag is proportional to L² (span squared). If L doubles, L² increases by 4×, so sag quadruples. This quadratic relationship is why long spans are challenging: doubling span length from 150 ft to 300 ft quadruples the sag under the same loading and tension. This is why long-span designs require either much higher cable tension or NESC clearance is exceeded.',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
