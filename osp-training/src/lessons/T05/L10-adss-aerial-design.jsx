// Net-new — T05.L10 ADSS Aerial Design
// Working lesson: ADSS design principles, EDS, aeolian vibration, span ratings, sag with ADSS

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import SliderExploration from '../../components/primitives/SliderExploration.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L10',
  course_id: 'T05',
  title: 'ADSS Aerial Design',
  order: 10,
  lesson_type: 'working',
  prerequisites: ['T05.L07', 'T05.L06', 'T03.L09'],
  learning_objectives: [
    'Explain what makes ADSS different from lashed plant and when to choose it',
    'Define EDS as a percentage of RTS and explain why it protects fiber from strain',
    'Apply the sag formula to an ADSS span and evaluate the clearance margin',
    'Identify the conditions that cause aeolian vibration and how hardware selection addresses it',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'aeolian vibration',
    'self-damping',
    'span rating',
    'deadend clamp',
    'suspension clamp',
  ],
  vocabulary_assumed: [
    { term: 'ADSS', source_lesson_id: 'T03.L04' },
    { term: 'EDS (Everyday Stress)', source_lesson_id: 'T03.L04' },
    { term: 'RTS (Rated Tensile Strength)', source_lesson_id: 'T03.L04' },
    { term: 'sag (s)', source_lesson_id: 'T05.L07' },
    { term: 'horizontal tension (H)', source_lesson_id: 'T05.L07' },
    { term: 'parabolic approximation', source_lesson_id: 'T05.L07' },
    { term: 'loading district', source_lesson_id: 'T05.L06' },
    { term: 'ice load formula', source_lesson_id: 'T05.L06' },
    { term: 'Light loading district', source_lesson_id: 'T05.L06' },
    { term: 'Rule 232', source_lesson_id: 'T05.L02' },
    { term: 'joint use', source_lesson_id: 'T05.L08' },
    { term: 'messenger', source_lesson_id: 'T03.L04' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'aeolian vibration',
      definition:
        'A resonant, high-frequency oscillation of an aerial cable caused by steady, low-speed wind (typically 3–15 mph) flowing across the cable and creating alternating vortices on the downwind side. Named after Aeolus, the Greek god of wind. The cable vibrates vertically at a frequency determined by wind speed and cable diameter. Without damping, aeolian vibration causes fatigue failure at the attachment clamps — the highest-stress points — within months to years.',
    },
    {
      term: 'self-damping',
      definition:
        'The ability of an ADSS cable to dissipate vibrational energy internally, reducing the amplitude of aeolian vibration without external dampers. ADSS cables have higher self-damping than steel strand because the dielectric core materials absorb more energy per cycle. Manufacturer datasheets publish self-damping capacity as part of the span rating calculation. Cables with higher self-damping can be strung at longer spans or higher EDS before vibration dampers become necessary.',
    },
    {
      term: 'span rating',
      definition:
        'The maximum span length (in meters or feet) at which an ADSS cable can be safely installed at its EDS, in a specified loading district, without exceeding the aeolian vibration tolerance of the attachment hardware and without causing fiber strain under design loads. Span ratings are published in the cable manufacturer\'s datasheet and vary by cable design, diameter, and hardware type.',
    },
    {
      term: 'deadend clamp',
      definition:
        'An ADSS attachment hardware assembly used at the end of a section or at a terminal pole, where the full cable tension must be transferred to the structure. The deadend clamp grips the cable over a specific length to distribute the load without damaging the fiber or strength members. ADSS deadend clamps are cable-specific — the wrong clamp for the cable design can slip or cause localized stress that damages fiber.',
    },
    {
      term: 'suspension clamp',
      definition:
        'An ADSS attachment hardware assembly used at intermediate (non-terminal) poles, where the cable passes through the clamp rather than terminating. Suspension clamps support the cable weight at intermediate points and must allow the cable to move slightly with thermal and load changes. Like deadend clamps, they are cable-specific. Suspension clamps are the most common failure point for aeolian vibration damage because they are the highest-stress location along the span.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L10_ADSSAerialDesign() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Most of the aerial fiber you see in residential neighborhoods is
          <strong> lashed plant</strong> — a fiber cable zip-tied to a steel messenger
          strand that carries the structural load. The messenger is the muscle; the
          fiber is just along for the ride. To put lashed plant on a pole, you need
          the messenger attached, which means a full joint-use pole attachment agreement
          and a steel strand connected to ground at regular intervals.
        </p>
        <p className="mt-2">
          Some locations don't work well with lashed plant. The biggest case: near
          high-voltage power lines. A grounded steel messenger near a 115-kV
          transmission line can pick up dangerous induced voltages. That's where
          <strong> ADSS — All Dielectric Self-Supporting</strong> cable comes in.
          ADSS has no metal in it at all. The fiber core is protected by strength
          members made of aramid yarns or fiberglass rods, not steel. The cable
          hangs from the poles like a wire, but there's nothing to ground and nothing
          that can conduct electricity. On transmission lines and power corridors,
          ADSS is the standard choice.
        </p>
        <p className="mt-2">
          The tradeoff is that ADSS design has its own set of engineering requirements.
          You can't string ADSS cable the way you string a lashed plant — you have to
          respect a very specific tension range called EDS, use cable-specific
          attachment hardware, and account for a type of wind-induced vibration
          that can destroy the hardware within months if you ignore it.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full form</th>
              <th className="px-3 py-2 text-left">One-line meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">ADSS</td>
              <td className="px-3 py-2">All Dielectric Self-Supporting</td>
              <td className="px-3 py-2">Fiber cable with no metal; hangs on its own without a separate messenger strand</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">EDS</td>
              <td className="px-3 py-2">Everyday Stress</td>
              <td className="px-3 py-2">The normal long-term stringing tension; set as a % of RTS; fiber has no strain below EDS</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-semibold">RTS</td>
              <td className="px-3 py-2">Rated Tensile Strength</td>
              <td className="px-3 py-2">The maximum published tensile load the cable can sustain without permanent damage</td>
            </tr>
          </tbody>
        </table>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        {/* ADSS is vocabulary_assumed (introduced at T03.L04) — no ADSS card here.
            Cards render only for vocabulary_introduced in this lesson. */}
        <Flashcard
          deckId="T05-L10"
          cards={[
            {
              id: 'T05-L10-fc-aeolian',
              front: 'What is aeolian vibration and where does it cause damage?',
              back: 'Aeolian vibration is a resonant high-frequency oscillation caused by steady low-speed wind (3–15 mph) creating alternating vortices on the downwind side of the cable. The vibration\'s highest stress concentrations occur at the attachment hardware — deadend and suspension clamps — because the cable is gripped there and can\'t flex. Without self-damping or added vibration dampers, fatigue failure at clamp locations can occur within months to years.',
            },
            {
              id: 'T05-L10-fc-self-damping',
              front: 'What is self-damping in an ADSS cable and why does it matter?',
              back: 'Self-damping is the ability of an ADSS cable to dissipate vibrational energy internally, reducing the amplitude of aeolian vibration without external dampers. ADSS cables have higher self-damping than steel strand because the dielectric core materials absorb more energy per cycle. Cables with higher self-damping can be strung at longer spans or higher EDS before vibration dampers become necessary.',
            },
            {
              id: 'T05-L10-fc-span-rating',
              front: 'What is a span rating and who publishes it?',
              back: 'A span rating is the maximum safe span length for an ADSS cable at a given EDS, in a specified loading district, without violating aeolian vibration limits or fiber strain limits under design loads. Span ratings are published by the cable manufacturer in the cable\'s datasheet. The design engineer must verify the planned span length is within the manufacturer\'s published span rating for the installation conditions.',
            },
            {
              id: 'T05-L10-fc-deadend-clamp',
              front: 'What is a deadend clamp and why must it be cable-specific?',
              back: 'A deadend clamp is an ADSS attachment hardware assembly used at terminal poles, where the full cable tension must be transferred to the structure. It grips the cable over a specific length to distribute the load without damaging the fiber or strength members. Deadend clamps are cable-specific because the grip length, geometry, and clamping force are engineered for the exact cable design — the wrong clamp can slip or cause localized stress that damages fiber.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>ADSS Sag Design — Step by Step</h2>
        <p>
          ADSS sag uses the same formula as lashed plant: <strong>s = wL² / (8H)</strong>.
          The difference is that:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
          <li><strong>H</strong> must equal EDS — not an arbitrary design tension. EDS is published by the manufacturer as a percentage of RTS.</li>
          <li><strong>w</strong> is the ADSS cable's self-weight from the datasheet (no strand to add).</li>
          <li>The clearance check uses the loaded sag (Light district: 9 psf wind, no ice).</li>
          <li>The margin should be at least 1–2 ft above the NESC Rule 232 minimum — per field practice, tight margins get worse with temperature and age.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Full worked example — 96-fiber ADSS in Light district (Macon, GA)</h3>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-3">Given (from cable datasheet)</p>
          <ul className="text-sm space-y-1 text-slate-300 mb-4">
            <li>Cable: 96-fiber ADSS, OD = 0.82 inch, self-weight w = 0.260 lb/ft</li>
            <li>RTS = 2,800 lb (from datasheet)</li>
            <li>EDS = 20% of RTS = 0.20 × 2,800 = <strong>560 lb</strong> → this is H</li>
            <li>Span L = 200 ft (from field survey)</li>
            <li>Attachment height = 22 ft above road surface</li>
            <li>Required clearance (NESC Rule 232, road): ≈ 15.5 ft</li>
            <li>Loading district: Light (9 psf wind, no ice — Macon, GA)</li>
          </ul>

          <p className="font-semibold text-slate-200 mb-2">Step 1: Confirm EDS as H</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>EDS = 20% of RTS</p>
            <p>EDS = 0.20 × 2,800 lb = <strong>560 lb</strong></p>
            <p>H = 560 lb (this is the tension you input to the sag formula)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: 560 lb / 2,800 lb = 20%. This is within the typical EDS range
            of 16–25% of RTS. If the manufacturer publishes a different EDS range for
            this cable, use their value — the datasheet governs.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 2: No-wind sag at EDS</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>s = wL² / (8H)</p>
            <p>s = (0.260 × 200²) / (8 × 560)</p>
            <p>s = (0.260 × 40,000) / 4,480</p>
            <p>s = 10,400 / 4,480</p>
            <p>s = <strong>2.321 ft</strong> (27.9 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: 2.32 ft of sag on a 200-ft span with a 0.260 lb/ft cable at 560 lb tension.
            Sag-to-span ratio = 2.32/200 = 1.16% — well below 10%, parabola is valid.
            For comparison, the lashed-plant example in L07 had 0.68 ft of sag on a 150-ft span
            at 600 lb. This ADSS cable sags more because the span is longer and the cable
            is heavier than the lashed plant cable.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 3: Wind-loaded sag (Light district, 9 psf)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1 mb-3">
            <p>Cable OD = 0.82 inch</p>
            <p>Projected area = 0.82 / 12 = 0.0683 ft²/ft</p>
            <p>w_wind = 9 psf × 0.0683 ft²/ft = <strong>0.615 lb/ft</strong></p>
            <p></p>
            <p>Combined load (vector sum):</p>
            <p>w_combined = √(w² + w_wind²)</p>
            <p>w_combined = √(0.260² + 0.615²)</p>
            <p>w_combined = √(0.0676 + 0.3782)</p>
            <p>w_combined = √0.4458 = <strong>0.668 lb/ft</strong></p>
            <p></p>
            <p>Wind-loaded sag:</p>
            <p>s_wind = (0.668 × 40,000) / 4,480</p>
            <p>s_wind = 26,720 / 4,480 = <strong>5.964 ft</strong> (71.6 inches)</p>
          </div>
          <p className="text-sm text-slate-300/80 mb-4">
            Sanity check: Wind-loaded combined weight (0.668 lb/ft) is 2.57× the bare weight
            (0.260 lb/ft), so sag grows by the same factor: 5.96 / 2.32 ≈ 2.57. This ADSS
            cable's larger diameter (0.82 in vs 0.50 in for strand) catches more wind, which
            amplifies the loaded sag more than a thinner cable would.
          </p>

          <p className="font-semibold text-slate-200 mb-2">Step 4: Clearance check — critical</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-yellow-200 space-y-1 mb-3">
            <p>Midspan height (no wind) = 22.0 − 2.321 = <strong>19.68 ft</strong></p>
            <p>Midspan height (wind-loaded) = 22.0 − 5.964 = <strong>16.04 ft</strong></p>
            <p></p>
            <p>NESC Rule 232 road clearance ≈ 15.5 ft</p>
            <p>Wind-loaded margin = 16.04 − 15.5 = <strong>+0.54 ft (6.5 inches)</strong></p>
            <p>Field-practice target margin = 1–2 ft</p>
            <p>Result: <strong>BORDERLINE DESIGN — margin is too tight for comfortable construction</strong></p>
          </div>
          <p className="text-sm text-slate-300/80">
            Sanity check: 6.5 inches of margin over a public road in a windstorm —
            that's within measurement error of the final sag (which is higher than EDS sag
            after thermal cycling and creep). In practice, this design either needs the span
            shortened to 180 ft or the attachment height raised to 23 ft to achieve a
            comfortable 1+ ft margin. This is exactly the kind of calculation that tells you
            whether your design will pass or fail before any steel goes up.
          </p>
        </div>

        {/* WorkedExample widget */}
        <WorkedExample
          title="ADSS Sag and Clearance Check"
          description="Calculate sag for an ADSS cable using EDS as the stringing tension. Compare no-wind and wind-loaded conditions against the clearance requirement."
          variables={[
            { id: 'w_adss', label: 'ADSS cable weight w (lb/ft)', defaultValue: 0.260, min: 0.10, max: 1.0, step: 0.005 },
            { id: 'rts', label: 'RTS (Rated Tensile Strength, lb)', defaultValue: 2800, min: 500, max: 8000, step: 100 },
            { id: 'eds_pct', label: 'EDS as % of RTS (decimal, e.g. 0.20 for 20%)', defaultValue: 0.20, min: 0.16, max: 0.25, step: 0.01 },
            { id: 'L_span', label: 'Span length L (ft)', defaultValue: 200, min: 50, max: 500, step: 5 },
            { id: 'cable_od', label: 'Cable OD (inches)', defaultValue: 0.82, min: 0.50, max: 2.0, step: 0.01 },
            { id: 'h_attach', label: 'Attachment height (ft)', defaultValue: 22, min: 15, max: 50, step: 0.5 },
            { id: 'wind_psf', label: 'Wind pressure (psf) — Light=9, Medium=4, Heavy=4', defaultValue: 9, min: 4, max: 9, step: 1 },
            { id: 'clearance_req', label: 'Required clearance (ft)', defaultValue: 15.5, min: 9.5, max: 25, step: 0.5 },
          ]}
          formula="H = RTS × EDS%; s = wL²/(8H) for no-wind; s_wind = w_combined × L²/(8H) for wind-loaded"
          steps={[
            { label: 'EDS tension H (lb)', expression: 'rts * eds_pct', varIds: ['rts', 'eds_pct'] },
            { label: 'No-wind sag s (ft)', expression: '(w_adss * L_span * L_span) / (8 * rts * eds_pct)', varIds: ['w_adss', 'L_span', 'rts', 'eds_pct'] },
            { label: 'Wind load w_wind (lb/ft)', expression: 'wind_psf * (cable_od / 12)', varIds: ['wind_psf', 'cable_od'] },
            { label: 'Combined w_combined (lb/ft)', expression: 'Math.sqrt(w_adss * w_adss + (wind_psf * cable_od / 12) * (wind_psf * cable_od / 12))', varIds: ['w_adss', 'wind_psf', 'cable_od'] },
            { label: 'Wind-loaded sag s_wind (ft)', expression: '(Math.sqrt(w_adss * w_adss + (wind_psf * cable_od / 12) * (wind_psf * cable_od / 12)) * L_span * L_span) / (8 * rts * eds_pct)', varIds: ['w_adss', 'wind_psf', 'cable_od', 'L_span', 'rts', 'eds_pct'] },
            { label: 'Clearance margin under wind load (ft)', expression: 'h_attach - (Math.sqrt(w_adss * w_adss + (wind_psf * cable_od / 12) * (wind_psf * cable_od / 12)) * L_span * L_span) / (8 * rts * eds_pct) - clearance_req', varIds: ['h_attach', 'w_adss', 'wind_psf', 'cable_od', 'L_span', 'rts', 'eds_pct', 'clearance_req'] },
          ]}
          sanityCheck="Positive clearance margin = design passes clearance. Negative = violation. EDS range is 16–25% of RTS — design must keep H within that range. Wind-loaded sag grows significantly because ADSS cables have larger diameters than thin messenger strand."
        />

        {/* SliderExploration: span vs clearance margin */}
        <SliderExploration
          title="How Span Length Affects ADSS Clearance Margin"
          description="Adjust span length and watch how the wind-loaded clearance margin changes. Uses the 96-fiber ADSS example: w=0.260 lb/ft, RTS=2800 lb, EDS=20% (H=560 lb), OD=0.82 in, attach height=22 ft, 9 psf wind, clearance req=15.5 ft."
          variables={[
            { id: 'L_adss_slide', label: 'Span length L (ft)', min: 100, max: 300, step: 5, defaultValue: 200 },
          ]}
          derivedValues={[
            {
              id: 'sag_nowind_slide',
              label: 'No-wind sag (ft)',
              expression: '(0.260 * L_adss_slide * L_adss_slide) / (8 * 560)',
              varIds: ['L_adss_slide'],
            },
            {
              id: 'sag_wind_slide',
              label: 'Wind-loaded sag (ft)',
              expression: '(0.668 * L_adss_slide * L_adss_slide) / (8 * 560)',
              varIds: ['L_adss_slide'],
            },
            {
              id: 'margin_slide',
              label: 'Clearance margin under wind (ft)',
              expression: '22 - (0.668 * L_adss_slide * L_adss_slide) / (8 * 560) - 15.5',
              varIds: ['L_adss_slide'],
            },
          ]}
          insight="At 150 ft: sag_wind ≈ 3.35 ft, margin ≈ 3.15 ft (comfortable). At 200 ft: sag_wind ≈ 5.96 ft, margin ≈ 0.54 ft (tight). At 225 ft: margin goes negative — clearance violation. Sag grows with L² — a 50% increase in span (from 150 to 225 ft) more than quadruples the sag. For this ADSS cable at this attachment height, 180–190 ft is the practical design maximum for a 1 ft clearance margin."
        />

        <h3 className="mt-6 font-semibold">Aeolian vibration — why hardware choice matters</h3>
        <p className="mt-2">
          Even with perfect sag and clearance, an ADSS cable can fail at the hardware
          within a year if aeolian vibration is ignored. Here's how it works:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Wind speeds of 3–15 mph cause vortex shedding.</strong>
            As wind flows past the cable, it creates alternating vortices on the downwind side.
            Each vortex sheds in opposite directions (up/down), producing a force that makes
            the cable vibrate vertically at a specific frequency.
          </li>
          <li>
            <strong>The frequency depends on wind speed and cable diameter.</strong>
            Strouhal's rule: f = 0.185 × V / d, where V = wind speed (ft/s) and d = cable
            diameter (ft). At 8 mph wind and 0.82-inch (0.068 ft) ADSS cable:
            f = 0.185 × (8 × 5280/3600) / 0.068 = 0.185 × 11.73 / 0.068 ≈ 31.9 Hz.
            That's a resonant frequency that the cable vibrates at near-constantly in light winds.
          </li>
          <li>
            <strong>The stress concentrates at the clamp.</strong>
            The cable vibrates freely in the span, but the suspension or deadend clamp grips the
            cable and stops that motion at the clamp edge. The repeated bending stress at the
            grip point causes fatigue failure — cracks in the dielectric strength members or
            sheath damage — within months to years.
          </li>
          <li>
            <strong>Mitigation: self-damping and vibration dampers.</strong>
            ADSS cables have higher self-damping than steel strand because the dielectric core
            absorbs energy. The manufacturer's span rating accounts for this. For spans near
            or at the span rating limit, vibration dampers (Stockbridge dampers or helical
            dampers) are added at the clamp points. The manufacturer specifies the damper type
            and placement distance based on the cable's resonant frequency.
          </li>
        </ol>

        <div className="rounded-lg bg-amber-900/20 border border-amber-700/30 p-4 my-4">
          <p className="font-semibold text-amber-300 mb-1">Book vs. field practice — aeolian vibration</p>
          <p className="text-sm text-slate-300">
            <strong>By the book:</strong> Install vibration dampers per the manufacturer's
            specification when the span exceeds a threshold or when the site is known
            to have sustained wind exposure. Use cable-specific hardware (deadend and
            suspension clamps rated for the specific cable design).
          </p>
          <p className="text-sm text-slate-300 mt-2">
            <strong>In the field:</strong> Vibration dampers add cost and time. Some contractors
            skip them on spans that are technically within the span rating, arguing the
            self-damping is sufficient. This is a real maintenance risk — ADSS cables that
            fail at suspension clamps due to fatigue are expensive to repair because the
            whole span must be re-pulled. The manufacturer's span-rating guidance exists
            precisely to prevent this; experienced OSP engineers follow it.
          </p>
          <p className="text-sm text-slate-300 mt-2">
            <strong>Why this matters:</strong> When you specify ADSS in the design, include the
            hardware selection in the BOM. The field crew needs to know exactly which clamp
            and what damper (if any) goes on each pole — it can't be "generic."
          </p>
        </div>

        <h3 className="mt-5 font-semibold">When to choose ADSS vs. lashed plant</h3>
        <div className="rounded-lg bg-black/30 border border-white/10 overflow-hidden my-3">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Condition</th>
                <th className="px-3 py-2 text-left">Lashed plant</th>
                <th className="px-3 py-2 text-left">ADSS</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Near high-voltage lines (induced voltage risk)</td>
                <td className="px-3 py-2">Not recommended — steel messenger picks up induced voltage</td>
                <td className="px-3 py-2">Preferred — no metallic elements, no induced voltage hazard</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Long spans (200+ ft)</td>
                <td className="px-3 py-2">Needs heavier strand; joint-use poles may not accommodate</td>
                <td className="px-3 py-2">High-RTS ADSS with appropriate span rating works well</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Typical residential distribution corridor</td>
                <td className="px-3 py-2">Lower cost, simpler hardware, familiar to all contractors</td>
                <td className="px-3 py-2">More expensive, hardware is cable-specific</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Utility-owned poles with low attachment fees</td>
                <td className="px-3 py-2">ILA required for messenger attachment; annual fee per pole</td>
                <td className="px-3 py-2">May reduce attachment count if self-supporting design avoids messenger anchor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>ADSS Near High-Voltage Lines — The Tracking Problem</h2>
        <p>
          ADSS cables can fail near high-voltage lines even without any metallic conductor
          — through a different mechanism called <strong>tracking and arcing</strong>.
          This is an advanced topic, but OSP designers working near transmission corridors
          need to be aware of it:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>High-voltage electric fields induce surface leakage currents</strong>
            on the cable's outer sheath. On a contaminated or wet sheath, these currents
            cause localized heating and eventually surface arcing (tracking). The arc
            can burn through the sheath and damage the fiber core.
          </li>
          <li>
            <strong>The solution is the cable sheath material.</strong>
            ADSS cables designed for use in high-voltage environments use a specially
            formulated sheath compound (usually AT-grade or HV-grade polyethylene or
            polyurethane) with high resistance to surface leakage. Standard light-duty
            ADSS sheaths are NOT suitable for high-voltage corridors. Verify the cable
            specification matches the electric field exposure expected at the installation
            location.
          </li>
          <li>
            <strong>Check the manufacturer's "short-span" vs "long-span" rating.</strong>
            Short-span ADSS cables (up to ~100m) are typically lower-RTS with smaller OD.
            Long-span cables (200m+) have higher-RTS strength members and may have
            different sheath grades. The span rating table in the datasheet distinguishes
            these.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300/80">
          Sources for tracking/arcing mechanism: Corning Cable Systems ADSS Installation
          Guide (public, corning.com); Focabex ADSS installation guidelines; STL
          Technologies dry-core ADSS placement guide. Field selection of AT-grade sheath
          is a manufacturer recommendation; verify with the electrical utility's joint-use
          engineer for any installation within the electric field zone of a high-voltage
          transmission line.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L10 Check — ADSS Aerial Design"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L10-Q1',
            type: 'mc',
            prompt:
              'An ADSS cable has RTS = 3,500 lb and EDS = 18%. What is the correct stringing tension H to use in the sag formula?',
            choices: [
              '3,500 lb (the full RTS)',
              '630 lb (18% of 3,500)',
              '1,750 lb (50% of RTS)',
              '350 lb (10% of RTS)',
            ],
            answerIndex: 1,
            explanation:
              'H = EDS × RTS = 0.18 × 3,500 = 630 lb. EDS is expressed as a decimal fraction of RTS. You NEVER string at full RTS — that would strain the fiber. The EDS range (16–25% of RTS) is designed to keep the fiber well below its strain threshold under everyday conditions.',
          },
          {
            id: 'T05-L10-Q2',
            type: 'mc',
            prompt:
              'Why is a steel messenger strand NOT recommended for aerial fiber runs near 115-kV transmission lines?',
            choices: [
              'Steel strand weighs more, increasing sag in Heavy district',
              'Steel is metallic and can pick up dangerous induced voltages from the high-voltage line',
              'Steel strand attachment hardware is incompatible with NESC Rule 235 separation requirements',
              'Steel strand costs more than ADSS aramid strength members on long spans',
            ],
            answerIndex: 1,
            explanation:
              'Steel messenger strand is a conductor. Near high-voltage transmission lines, it can pick up significant induced voltages through electromagnetic induction — enough to be a shock hazard to workers and to cause grounding/bonding complications. ADSS cable eliminates this by using only dielectric (non-conductive) strength members.',
          },
          {
            id: 'T05-L10-Q3',
            type: 'mc',
            prompt:
              'An ADSS cable with w = 0.260 lb/ft is strung at EDS = 560 lb on a 200-ft span. Wind load w_wind = 0.615 lb/ft. The combined load w_combined = 0.668 lb/ft. What is the wind-loaded sag?',
            choices: [
              '2.32 ft (27.9 inches)',
              '5.96 ft (71.5 inches)',
              '3.35 ft (40.2 inches)',
              '8.93 ft (107.2 inches)',
            ],
            answerIndex: 1,
            explanation:
              's_wind = w_combined × L² / (8H) = (0.668 × 200²) / (8 × 560) = (0.668 × 40,000) / 4,480 = 26,720 / 4,480 = 5.964 ft ≈ 5.96 ft. The 2.32 ft answer is the no-wind sag (using w = 0.260 lb/ft). The 3.35 ft answer is what you\'d get for a 150-ft span (checking shorter span). The 8.93 ft answer would require a much heavier combined load.',
          },
          {
            id: 'T05-L10-Q4',
            type: 'mc',
            prompt:
              'Which of the following is a situation where aeolian vibration is most likely to cause ADSS cable failure?',
            choices: [
              'The cable is in a sheltered urban canyon with irregular wind gusts',
              'The cable crosses an open field exposed to steady 8 mph prevailing winds, and vibration dampers were not installed',
              'The span length is well below the manufacturer\'s rated span, with an attachment height of 30 ft',
              'The cable was installed in the Heavy loading district with 0.50-inch ice accumulation',
            ],
            answerIndex: 1,
            explanation:
              'Aeolian vibration is worst under steady, uniform low-speed winds (3–15 mph) over long, exposed spans — exactly what you find in an open field. Irregular gusts (urban environment) don\'t create the sustained resonance needed for fatigue damage. Ice loading is a static weight problem, not a vibration problem. The failure is most likely when: open exposure + steady wind + no dampers + span near the rating limit.',
          },
          {
            id: 'T05-L10-Q5',
            type: 'fill-in-blank',
            prompt:
              'ADSS EDS is typically ____ to ____% of RTS. Stringing below this range risks excessive sag; stringing above risks fiber ____.',
            answer: '16 to 25 / strain (or microbending)',
            answerDisplay: '16% to 25% of RTS; fiber strain (microbending)',
            explanation:
              'EDS of 16–25% of RTS is the field-validated range from ADSS manufacturer guidelines (Focabex, Corning). Below 16% RTS: sag becomes too large, clearance is compromised. Above 25% RTS: everyday tension begins to mechanically load the fiber, causing microbending and increased attenuation over time.',
          },
        ]}
      />

    </LessonLayout>
  );
}
