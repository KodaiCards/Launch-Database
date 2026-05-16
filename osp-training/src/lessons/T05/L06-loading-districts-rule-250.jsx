// Net-new (migrated from Module02 §2.5, expanded) — T05.L06 Loading Districts — Rule 250
// Working lesson: Light/Medium/Heavy/Extreme Wind districts, ice load formula, Macon GA examples

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L06',
  course_id: 'T05',
  title: 'Loading Districts — Rule 250',
  order: 6,
  lesson_type: 'standard',
  prerequisites: ['T05.L04', 'T05.L05'],
  learning_objectives: [
    'Name the four NESC loading districts and state the design ice thickness, wind pressure, and temperature for each',
    'Calculate the ice load per foot of cable using the standard formula w_ice = 1.244 × t × (D + t)',
    'Determine the correct loading district for a given location using the NESC district map',
    'Combine ice and wind loads using the vector-sum method to find the combined design load per foot',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'loading district',
    'Light loading district',
    'Medium loading district',
    'Heavy loading district',
    'Extreme Wind loading district',
    'Rule 250',
    'radial ice thickness',
    'ice load formula',
    'combined load',
    'Extreme Wind overlay (Rule 250C)',
    'Extreme Ice with Concurrent Wind (Rule 250D)',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'Rule 261', source_lesson_id: 'T05.L04' },
    { term: 'Section 26', source_lesson_id: 'T05.L04' },
    { term: 'pole loading', source_lesson_id: 'T05.L05' },
    { term: 'wind span', source_lesson_id: 'T05.L05' },
    { term: 'w_wind', source_lesson_id: 'T05.L05' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'messenger', source_lesson_id: 'T03.L04' },
    { term: 'EDS', source_lesson_id: 'T03.L09' },
  ],
  key_terms: [
    {
      term: 'loading district',
      definition:
        'A geographic zone in the NESC Rule 250 map that specifies the design ice thickness, wind pressure, and temperature combination that aerial structures in that zone must be designed to withstand. There are four main districts: Light, Medium, Heavy, and Extreme Wind (Rule 250C). The district determines what weather loads go into every structural calculation for your design.',
    },
    {
      term: 'Light loading district',
      definition:
        'NESC loading district with 0 inches of radial ice, 9 psf wind pressure (approximately 60 mph wind speed), and +30°F design temperature. Applies to most of the southeastern US, including Macon, GA. No ice component in sag-tension and pole-loading calculations.',
    },
    {
      term: 'Medium loading district',
      definition:
        'NESC loading district with 0.25 inches of radial ice, 4 psf wind pressure (approximately 40 mph), and +15°F design temperature. Applies to an intermediate band across the mid-Atlantic and central US. Ice and wind combine in calculations.',
    },
    {
      term: 'Heavy loading district',
      definition:
        'NESC loading district with 0.50 inches of radial ice, 4 psf wind pressure (approximately 40 mph), and 0°F design temperature. Applies to the northern and northeastern US. Ice load can triple the effective cable weight per foot.',
    },
    {
      term: 'Extreme Wind loading district',
      definition:
        'NESC Rule 250C overlay applied to structures 60 feet or more above ground in mapped high-wind coastal zones (Atlantic coast, Gulf of Mexico coast, and Pacific coast). No ice component, but wind pressure is determined from a site-specific map (ranging from roughly 90 to 150 mph depending on location). Rule 250C can apply in addition to the base district.',
    },
    {
      term: 'Rule 250',
      definition:
        'The NESC rule that defines the loading districts (250B for Heavy/Medium/Light, 250C for Extreme Wind, 250D for Extreme Ice with Concurrent Wind) and specifies the design ice, wind, and temperature values for each. Rule 250 is where you look up what loads to put into your structural calculations.',
    },
    {
      term: 'radial ice thickness',
      definition:
        'The thickness of ice that builds up uniformly around a cable during an ice storm, expressed in inches. Radial means equal in all directions — an ice sleeve forming a ring around the cable. Heavy district = 0.50 in radial. Medium = 0.25 in radial. Light = 0 in (no ice). The iced cable OD = original OD + (2 × radial ice thickness).',
    },
    {
      term: 'ice load formula',
      definition:
        'The formula for calculating the weight of ice per foot of cable: w_ice = 1.244 × t × (D + t), where t = radial ice thickness in inches, D = cable outer diameter in inches, and w_ice = ice weight in lb/ft. The coefficient 1.244 comes from the ice density (57 lb/ft³) times π/144. This formula is valid for any cylindrical cable.',
    },
    {
      term: 'combined load',
      definition:
        'The combined vertical (gravity + ice) and horizontal (wind) load per foot of cable, calculated using the Pythagorean theorem: w_combined = √((w + w_ice)² + w_wind²), where w is the cable self-weight, w_ice is the ice load, and w_wind is the lateral wind load. Combined load is what goes into the sag formula under design loading conditions.',
    },
    {
      term: 'Extreme Wind overlay (Rule 250C)',
      definition:
        'The NESC Rule 250C requirement that applies to structures 60 feet or more above ground in coastal wind zones. The wind pressure is map-defined (higher than the standard district values) and no concurrent ice is assumed. The overlay ADDS requirements on top of the base loading district, it doesn\'t replace them.',
    },
    {
      term: 'Extreme Ice with Concurrent Wind (Rule 250D)',
      definition:
        'NESC Rule 250D requirement that applies to localized areas with historically severe ice storms (mostly central and eastern US). Uses a 50-year return-period ice map combined with a concurrent reduced wind load. Rule 250D areas are identified on the NESC C2-2023 map.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L06_LoadingDistrictsRule250() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Aerial cables in Minnesota deal with ice storms. Aerial cables in South Florida
          deal with 150-mph hurricanes. Aerial cables in western North Carolina face
          heavy ice on mountain ridges. A one-size-fits-all structural standard for all
          three would either be catastrophically under-designed in some places or
          ludicrously over-designed in others.
        </p>
        <p className="mt-2">
          The NESC solves this by dividing the United States into <strong>loading
          districts</strong> — geographic zones where the design ice thickness and wind
          pressure are calibrated to the realistic worst-case weather that zone
          historically experiences. Build to your district's standard, and your aerial
          plant should survive the worst weather that zone is statistically likely to see.
        </p>
        <p className="mt-2">
          In Macon, GA — the <strong>Light loading district</strong> — there is no ice
          design load. Wind (9 psf, about 60 mph) governs. This lesson teaches you how
          to find your district, calculate its ice and wind loads, and combine them for
          use in sag-tension and pole-loading calculations.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">psf</td>
              <td className="px-3 py-2">Pounds per square foot — the unit for NESC wind pressure values</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">t</td>
              <td className="px-3 py-2">Radial ice thickness in inches — the ring of ice around the cable</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">D</td>
              <td className="px-3 py-2">Cable outer diameter in inches — the bare cable before ice</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">w_ice</td>
              <td className="px-3 py-2">Ice weight per foot of cable (lb/ft) — from the formula w_ice = 1.244 × t × (D + t)</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">w_combined</td>
              <td className="px-3 py-2">Combined load per foot (lb/ft) — vector sum of vertical (gravity + ice) and horizontal (wind) loads</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The four loading districts — quick reference</h3>
        <p className="mt-2">
          Values verified from three independent secondary sources: IAEI Magazine NESC 2002
          article, ikeGPS NESC Weather Loadings knowledge-base article, and RUS 1724E-150
          design guidance. Confirm from NESC C2-2023 Rule 250 Table 250-1 for your design.
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">District</th>
              <th className="px-3 py-2 text-left">Radial ice (in)</th>
              <th className="px-3 py-2 text-left">Wind pressure</th>
              <th className="px-3 py-2 text-left">Temperature</th>
              <th className="px-3 py-2 text-left">US geographic area</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10 bg-green-400/5">
              <td className="px-3 py-2 font-semibold text-green-300">Light</td>
              <td className="px-3 py-2">0 in (no ice)</td>
              <td className="px-3 py-2 font-semibold">9 psf (~60 mph)</td>
              <td className="px-3 py-2">+30°F</td>
              <td className="px-3 py-2">Southeast US (GA, FL, TX, AL, etc.)</td>
            </tr>
            <tr className="border-t border-white/10 bg-yellow-400/5">
              <td className="px-3 py-2 font-semibold text-yellow-300">Medium</td>
              <td className="px-3 py-2">0.25 in</td>
              <td className="px-3 py-2 font-semibold">4 psf (~40 mph)</td>
              <td className="px-3 py-2">+15°F</td>
              <td className="px-3 py-2">Mid-Atlantic, central US</td>
            </tr>
            <tr className="border-t border-white/10 bg-blue-400/5">
              <td className="px-3 py-2 font-semibold text-blue-300">Heavy</td>
              <td className="px-3 py-2">0.50 in</td>
              <td className="px-3 py-2 font-semibold">4 psf (~40 mph)</td>
              <td className="px-3 py-2">0°F</td>
              <td className="px-3 py-2">Northern US (MN, WI, ME, NY, etc.)</td>
            </tr>
            <tr className="border-t border-white/10 bg-red-400/5">
              <td className="px-3 py-2 font-semibold text-red-300">Extreme Wind (Rule 250C)</td>
              <td className="px-3 py-2">0 in (no ice)</td>
              <td className="px-3 py-2 font-semibold">Map-defined (90–150 mph)</td>
              <td className="px-3 py-2">Per map</td>
              <td className="px-3 py-2">Coastal areas; structures ≥ 60 ft above ground</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 p-3 border border-green-400/20 bg-green-400/5 rounded text-sm text-slate-300/80">
          <strong className="text-green-300">Macon, GA = Light loading district.</strong> No ice component. 9 psf wind at +30°F governs.
          The worked examples in this lesson use Light district conditions. If you design for
          projects outside the southeastern US, verify the district from the NESC C2-2023 loading
          district map for the project location.
        </div>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Extreme Wind and the 60-ft threshold</p>
          <p className="text-slate-300/90">
            <strong>Book (NESC Rule 250C):</strong> Extreme Wind requirements apply to structures
            60 feet or more above ground in mapped coastal wind zones. A 40-ft pole on a coastal
            project does NOT trigger Rule 250C. A 60-ft or taller structure at the same location DOES.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Coastal projects often have a mix of standard
            distribution poles (40 ft, no Rule 250C) and taller structures at major crossings
            or hubs (60+ ft, Rule 250C applies). It's easy to miss the 250C overlay on the
            taller structures if you're doing a blanket Light-district calculation for the whole
            project. Always check pole heights on coastal projects and flag the tall ones for
            250C review.
          </p>
        </div>

        <div className="mt-4 p-4 border border-orange-400/30 bg-orange-400/5 rounded-lg text-sm">
          <p className="font-semibold text-orange-300 mb-1">Georgia-Specific: Coastal Counties Are in the NESC 250C Mapped Zone</p>
          <p className="text-slate-300/90">
            Macon, GA is inland and is clearly in the NESC <strong>Light loading district</strong> —
            no ice, 9 psf wind, no Rule 250C concern on standard distribution poles. However,
            if you or PSC ever have a project near the Georgia coast, the picture changes.
          </p>
          <p className="text-slate-300/90 mt-2">
            The following Georgia counties fall within the NESC C2-2023 Rule 250C extreme wind
            map boundary: <strong>Glynn County (Brunswick/Jekyll Island area), Camden County
            (Kingsland area), Brantley County, Charlton County, and the broader Georgia Coastal
            Management zone.</strong> These are still in the NESC <em>Light</em> base district
            (no ice loads), but for any structure 60 feet or more above ground in those counties,
            <strong> Rule 250C Extreme Wind applies in addition to the base Light district loads.</strong>
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>What this means in practice:</strong> A 65-ft monopole for a microwave relay
            site near Brunswick must be designed for both the Light base loads AND the Rule 250C
            extreme wind pressure (which will be significantly higher than 9 psf for that coastal
            location). A standard 40-ft distribution pole in the same county does NOT trigger 250C.
            The 60-ft threshold is the key: check every tall structure individually when working
            in coastal GA counties.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Verify the map boundary:</strong> Use NESC C2-2023 Figure 250-2 (the Extreme
            Wind map) to confirm whether a specific project location is in the mapped zone. The
            county line is not the boundary — the NESC map contours are. A rural site 10 miles
            inland from the Glynn County coast may or may not be in the mapped zone depending on
            the exact contour. When in doubt, pull the map.
          </p>
        </div>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L06"
          cards={[
            { id: 'T05-L06-fc-light', front: 'State the design loads for the NESC Light loading district.', back: '0 inches of radial ice, 9 psf wind pressure (~60 mph), +30°F design temperature. Applies to the southeastern US including Macon, GA. No ice component in calculations.' },
            { id: 'T05-L06-fc-heavy', front: 'State the design loads for the NESC Heavy loading district.', back: '0.50 inches of radial ice, 4 psf wind pressure (~40 mph), 0°F design temperature. Applies to the northern US. Ice load can triple the effective cable weight per foot.' },
            { id: 'T05-L06-fc-ice-formula', front: 'Write the ice load formula and define each variable.', back: 'w_ice = 1.244 × t × (D + t). t = radial ice thickness (inches). D = cable outer diameter (inches). w_ice = ice weight per foot of cable (lb/ft). The coefficient 1.244 = 57π/144 (ice density × π / unit-conversion).' },
            { id: 'T05-L06-fc-combined', front: 'How do you calculate the combined design load per foot of cable (w_combined)?', back: 'Vector sum of vertical and horizontal loads: w_combined = √((w + w_ice)² + w_wind²). w = cable self-weight (lb/ft). w_ice = ice load (lb/ft). w_wind = lateral wind load per foot (lb/ft). This combined load goes into the sag formula for the design loading condition.' },
            { id: 'T05-L06-fc-250c', front: 'When does the Extreme Wind overlay (NESC Rule 250C) apply?', back: 'Rule 250C applies to structures 60 feet or more above ground in mapped high-wind coastal zones (Atlantic coast, Gulf of Mexico, Pacific coast). The 60-ft threshold is exactly 60 ft — a structure that is 60 ft or more above ground is in scope. No concurrent ice; wind pressure is map-defined.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Deriving the Ice Load Formula</h2>

        <h3 className="mt-4 font-semibold">Where does 1.244 come from?</h3>
        <p>
          The ice load formula <code className="bg-black/30 px-1 rounded text-sm">w_ice = 1.244 × t × (D + t)</code> isn't
          arbitrary — it comes from the geometry of ice around a cylinder and the density
          of ice. Here's the derivation:
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-3">Geometric derivation of the ice load coefficient</p>

          <p className="font-semibold text-slate-200 mb-2">Step 1: Cross-sectional area of the ice ring</p>
          <p className="text-sm text-slate-300 mb-2">
            Imagine a circle of ice surrounding the cable. The outer radius of the iced cable
            is (D/2 + t) where D is the cable OD and t is the radial ice thickness. The inner
            radius is just D/2 (the cable itself). The cross-sectional area of the ice ring is:
          </p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>A_ice = π × (outer radius)² − π × (inner radius)²</p>
            <p>A_ice = π × (D/2 + t)² − π × (D/2)²</p>
            <p>A_ice = π × [(D/2 + t)² − (D/2)²]</p>
            <p>     ↳ difference of squares: a² − b² = (a+b)(a−b)</p>
            <p>A_ice = π × [(D/2 + t + D/2) × (D/2 + t − D/2)]</p>
            <p>A_ice = π × [(D + t) × t]</p>
            <p>A_ice = π × t × (D + t) in²  (with D and t in inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-3">
            To convert to ft²/ft (volume per unit length): divide by 144 (12² = 144 in²/ft²)
            since D and t are in inches:
          </p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>A_ice (ft²/ft) = π × t × (D + t) / 144</p>
          </div>

          <p className="font-semibold text-slate-200 mb-2">Step 2: Ice weight from density</p>
          <p className="text-sm text-slate-300 mb-2">
            The NESC uses an ice density of 57 lb/ft³ (per NESC/ASCE 7 standard — this is
            the design value for glazed ice; actual glaze ice in storms is close to this value).
          </p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>w_ice = density × A_ice</p>
            <p>w_ice = 57 lb/ft³ × [π × t × (D + t) / 144] ft²/ft</p>
            <p>w_ice = (57 × π / 144) × t × (D + t)</p>
            <p>w_ice = (179.07 / 144) × t × (D + t)</p>
            <p>w_ice = 1.2435 × t × (D + t)</p>
            <p>w_ice ≈ <strong>1.244 × t × (D + t)</strong> lb/ft  ✓</p>
          </div>
          <p className="text-sm text-slate-300/80">
            Sanity check: the coefficient 1.244 = 57π/144. Verify: 57 × 3.14159 / 144 =
            179.07 / 144 = 1.2435 ≈ 1.244. The formula is exact to three decimal places.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">Worked example — Light vs. Heavy district, same cable</h3>
        <p>
          Let's calculate the combined design load for a 0.82-inch OD ADSS cable (weight:
          0.260 lb/ft) in both the Light district (Macon, GA) and the Heavy district
          (illustrative) to see how dramatically district affects the numbers.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-3">Cable data</p>
          <ul className="text-sm space-y-1 text-slate-300 mb-4">
            <li>Cable: 96-fiber ADSS. OD D = 0.82 in. Self-weight w = 0.260 lb/ft.</li>
          </ul>

          <p className="font-semibold text-green-300 mb-2">Case 1: Light district (Macon, GA) — no ice, 9 psf wind</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>w_ice = 0 lb/ft  (no ice in Light district)</p>
            <p>w_wind = 9 × (0.82 / 12) = 9 × 0.0683 = <strong>0.615 lb/ft</strong></p>
            <p>w_combined = √((0.260 + 0)² + 0.615²)</p>
            <p>           = √(0.0676 + 0.3782)</p>
            <p>           = √0.4458 = <strong>0.668 lb/ft</strong></p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: The combined load (0.668 lb/ft) is about 2.6× the bare cable weight
            (0.260 lb/ft). Wind roughly doubled the effective load. This is why you always design
            for the loaded condition, not just the cable weight.
          </p>

          <p className="font-semibold text-blue-300 mb-2">Case 2: Heavy district — 0.50 in ice, 4 psf wind</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-blue-200 space-y-1 mb-3">
            <p>w_ice = 1.244 × 0.50 × (0.82 + 0.50)</p>
            <p>      = 1.244 × 0.50 × 1.32</p>
            <p>      = 1.244 × 0.660 = <strong>0.821 lb/ft</strong></p>
            <p></p>
            <p>Iced cable OD = D + 2t = 0.82 + 2(0.50) = 1.82 in</p>
            <p>w_wind (on iced cable) = 4 × (1.82 / 12) = 4 × 0.152 = <strong>0.606 lb/ft</strong></p>
            <p></p>
            <p>w_combined = √((0.260 + 0.821)² + 0.606²)</p>
            <p>           = √((1.081)² + (0.606)²)</p>
            <p>           = √(1.169 + 0.367)</p>
            <p>           = √1.536 = <strong>1.240 lb/ft</strong></p>
          </div>
          <p className="text-sm text-slate-300/80">
            Sanity check: Combined load in the Heavy district (1.240 lb/ft) is nearly <strong>5×
            the bare cable weight</strong> (0.260 lb/ft) and almost double the Light district
            combined load (0.668 lb/ft). That translates directly to nearly double the sag for
            the same span and tension — and much higher pole loads. This is why engineers in
            northern states use shorter spans and larger pole classes than in the southeast.
          </p>
        </div>

        {/* AnnotatedDiagram — NESC district map */}
        <AnnotatedDiagram
          title="NESC Loading District Map — United States"
          description="Click a region to see which loading district applies and what ice and wind loads it requires. Macon, GA is in the Light district."
          src="/training/diagrams/nesc-loading-districts-map.svg"
          alt="Map of the continental United States showing NESC loading district boundaries: Light district in the south and southeast, Medium in the mid-belt, Heavy in the northern states, and Extreme Wind coastal overlay"
          aspectRatio={1.6}
          hotPoints={[
            {
              id: 'light-district',
              x: 62,
              y: 75,
              label: 'Light district (SE US)',
              type: 'click',
              explanation:
                'Light district: Georgia, Florida, Alabama, Mississippi, Louisiana, Texas (most), South Carolina, southern Virginia. 0 in ice, 9 psf wind, +30°F. Macon, GA is here.',
            },
            {
              id: 'medium-district',
              x: 55,
              y: 52,
              label: 'Medium district (mid-belt)',
              type: 'click',
              explanation:
                'Medium district: Virginia, Maryland, Delaware, most of the Mid-Atlantic and Ohio Valley states, Kansas, Oklahoma. 0.25 in ice, 4 psf wind, +15°F.',
            },
            {
              id: 'heavy-district',
              x: 45,
              y: 25,
              label: 'Heavy district (north)',
              type: 'click',
              explanation:
                'Heavy district: Minnesota, Wisconsin, Michigan, New York, northern New England, and most of the northern tier. 0.50 in ice, 4 psf wind, 0°F. Ice can triple effective cable weight.',
            },
            {
              id: 'extreme-wind',
              x: 85,
              y: 85,
              label: 'Extreme Wind overlay (coastal)',
              type: 'click',
              explanation:
                'Rule 250C Extreme Wind overlay: applies to structures 60 ft or more above ground on the Atlantic coast, Gulf coast, and Pacific coast. Wind pressure is map-defined, ranging from roughly 90–150 mph depending on the specific location.',
            },
          ]}
        />

        {/* WorkedExample — ice load calculator */}
        <WorkedExample
          title="Ice Load Calculator"
          description="Calculate the ice load per foot of cable for any loading district and cable size."
          variables={[
            { id: 't_ice', label: 'Radial ice thickness t (in) — Light: 0, Medium: 0.25, Heavy: 0.50', defaultValue: 0, min: 0, max: 0.75, step: 0.05 },
            { id: 'D_cable', label: 'Cable outer diameter D (in)', defaultValue: 0.82, min: 0.3, max: 2.5, step: 0.05 },
          ]}
          formula="w_ice = 1.244 × t × (D + t)"
          steps={[
            { label: 'Ice load w_ice (lb/ft)', expression: '1.244 * t_ice * (D_cable + t_ice)', varIds: ['t_ice', 'D_cable'] },
          ]}
          sanityCheck="At 0 ice (Light district), w_ice = 0. At Heavy district (0.50 in) with a 0.82-in cable, w_ice ≈ 0.821 lb/ft — more than 3× the cable's typical self-weight."
        />

        {/* SliderExploration — vary ice thickness, watch load grow */}
        <SliderExploration
          title="How Ice Thickness Changes Cable Weight"
          description="Move the radial ice thickness slider from 0 (Light district) to 0.50 inches (Heavy district) and watch how dramatically the effective cable load grows."
          variables={[
            { id: 'ice_t', label: 'Radial ice thickness (inches)', min: 0, max: 0.5, step: 0.01, defaultValue: 0 },
          ]}
          derivedValues={[
            {
              id: 'ice_load',
              label: 'Ice load (lb/ft) for 0.82-in cable',
              expression: '1.244 * ice_t * (0.82 + ice_t)',
              varIds: ['ice_t'],
            },
            {
              id: 'total_vertical',
              label: 'Total vertical load (lb/ft) — cable (0.260) + ice',
              expression: '0.260 + 1.244 * ice_t * (0.82 + ice_t)',
              varIds: ['ice_t'],
            },
          ]}
          insight="At 0 ice (Light district): total vertical load = 0.260 lb/ft. At 0.50-in ice (Heavy district): total vertical load = 1.081 lb/ft — more than 4× higher. This is why OSP designs in northern states need much shorter spans or much higher stringing tensions."
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Extreme Conditions — Rule 250C and 250D</h2>

        <h3 className="mt-4 font-semibold">Rule 250C — Extreme Wind</h3>
        <p>
          Rule 250C is a superimposed requirement in addition to the base loading district.
          It applies to structures 60 feet or more above ground in the Extreme Wind map zones.
          The wind pressure for Rule 250C is determined from a map — coastal areas near the
          Atlantic and Gulf of Mexico can see map-defined pressures corresponding to sustained
          winds of 90–150 mph depending on the location.
        </p>
        <p className="mt-2">
          Note: the 60-ft threshold is "60 feet or more above ground" — a structure that
          is exactly 60 ft tall triggers Rule 250C in an Extreme Wind zone. This is a
          common point of confusion. Some engineers interpret "taller than 60 ft" as meaning
          a structure over 60 ft triggers it, but the NESC 2023 language is ≥ 60 ft.
          Verify with the current standard.
        </p>

        <h3 className="mt-5 font-semibold">Rule 250D — Extreme Ice with Concurrent Wind</h3>
        <p>
          Rule 250D applies to localized areas that historically experience extreme ice
          storms. Unlike Rule 250B (which uses fixed district values), Rule 250D uses
          site-specific 50-year return-period ice thickness maps with a concurrent
          (simultaneously applied) reduced wind load. Rule 250D can impose heavier ice
          requirements than Heavy district in affected areas.
        </p>
        <p className="mt-2">
          Rule 250D areas are identified on the NESC C2-2023 loading maps and are most
          common in parts of Tennessee, Virginia, West Virginia, Oklahoma, and other
          areas with documented extreme ice storm history.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L06 Check — Loading Districts — Rule 250"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L06-Q1',
            type: 'mc',
            prompt: 'What are the design loads for the NESC Heavy loading district?',
            choices: [
              '0 in ice, 9 psf wind, +30°F',
              '0.25 in ice, 4 psf wind, +15°F',
              '0.50 in ice, 4 psf wind, 0°F',
              '0.75 in ice, 9 psf wind, −20°F',
            ],
            answerIndex: 2,
            explanation:
              'Heavy district: 0.50 in radial ice, 4 psf wind pressure (~40 mph), 0°F design temperature. Source: IAEI Magazine 2002 NESC article + ikeGPS NESC Weather Loadings — three independent secondary sources confirm. Light district is 0 in ice / 9 psf / +30°F.',
            citation: 'NESC Rule 250 Table 250-1 per IAEI Magazine, ikeGPS, and RUS 1724E-150 secondary sources.',
          },
          {
            id: 'T05-L06-Q2',
            type: 'mc',
            prompt:
              'A 0.5-inch OD cable messenger is in the Heavy district (0.50 in radial ice). Calculate the ice load per foot using w_ice = 1.244 × t × (D + t).',
            choices: [
              '0.311 lb/ft',
              '0.622 lb/ft',
              '0.827 lb/ft',
              '1.244 lb/ft',
            ],
            answerIndex: 1,
            explanation:
              'w_ice = 1.244 × 0.50 × (0.50 + 0.50) = 1.244 × 0.50 × 1.00 = 0.622 lb/ft. The cable weight per foot for a typical 6M strand is about 0.088 lb/ft — this ice load is 7× heavier than the bare strand.',
          },
          {
            id: 'T05-L06-Q3',
            type: 'mc',
            prompt: 'Macon, GA is in which NESC loading district?',
            choices: [
              'Medium',
              'Heavy',
              'Extreme Wind (Rule 250C)',
              'Light',
            ],
            answerIndex: 3,
            explanation:
              'Macon, GA is in the NESC Light loading district — 0 in ice, 9 psf wind, +30°F. The southeastern US (Georgia, Florida, Alabama, Mississippi, Louisiana, most of Texas) is Light district. Source: NESC loading district map; confirmed in RUS 1724E-150 and Module02 §2.5.',
          },
          {
            id: 'T05-L06-Q4',
            type: 'mc',
            prompt:
              'The NESC Extreme Wind overlay (Rule 250C) applies to structures in mapped coastal wind zones that are:',
            choices: [
              'More than 40 ft tall',
              '60 feet or more above ground',
              'Within 10 miles of the coastline regardless of height',
              'Any pole in a state that borders the Atlantic or Gulf of Mexico',
            ],
            answerIndex: 1,
            explanation:
              'Rule 250C applies to structures 60 feet or more above ground in the Extreme Wind map zones. Height is the trigger, not distance from the coast or state location. A 40-ft pole in a coastal hurricane zone does NOT trigger Rule 250C. A 60-ft structure at the same location DOES.',
            citation: 'NESC C2-2023 Rule 250C per ikeGPS NESC loading article + IAEI 2007 NESC article.',
          },
          {
            id: 'T05-L06-Q5',
            type: 'fill-in-blank',
            prompt:
              'In the ice load formula w_ice = 1.244 × t × (D + t), the coefficient 1.244 comes from: ice density (57 lb/ft³) × ____ / 144.',
            answer: 'π (pi)',
            answerDisplay: 'π (pi) — because 57 × π / 144 = 1.2435 ≈ 1.244',
            explanation:
              'The coefficient derives from the annular ice cross-section area formula (π × t × (D + t)) multiplied by the unit conversion (÷144 to convert in² to ft²), then multiplied by ice density (57 lb/ft³). 57 × π / 144 = 1.2435, rounded to 1.244 for field use.',
          },
        ]}
      />

    </LessonLayout>
  );
}
