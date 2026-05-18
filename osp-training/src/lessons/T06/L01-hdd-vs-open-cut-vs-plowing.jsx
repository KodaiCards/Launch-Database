// T06.L01 — HDD vs. Open-Cut vs. Plowing
// Foundation lesson: choosing the right underground construction method
// Source: Module09_OSPConstruction.jsx §9.2 + RUS 1751F-635 + CGA Best Practices v19

import React, { useState } from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L01',
  course_id: 'T06',
  title: 'HDD vs. Open-Cut vs. Plowing',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T03.L01', 'T04.L01'],
  learning_objectives: [
    'Name the three primary underground construction methods and state when each is the best choice',
    'Apply the method-selection decision matrix to a given route profile (soil type, depth, ROW constraints)',
    'Explain why no single method dominates and why site investigation is required before bidding',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'HDD',
    'open-cut trench',
    'plowing',
    'bore',
    'pavement restoration',
    'decision matrix',
    'ROW',
    'bore pit',
    'slurry',
    'soil type',
    'route alignment',
  ],
  vocabulary_assumed: [
    { term: 'conduit', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'HDD',
      definition:
        'Horizontal directional drilling — a trenchless underground construction method that steers a drill head along a planned path under an obstacle (road, river, railroad) and pulls conduit back through the drilled hole without surface excavation. Requires a bore pit at entry and exit; uses drilling fluid (slurry) to cool the bit and flush cuttings out of the hole.',
    },
    {
      term: 'open-cut trench',
      definition:
        'An underground installation method that cuts a trench from the surface, lays conduit in the trench, then backfills and restores the surface. Maximum flexibility for conduit count and inspection, but also maximum surface disruption and restoration cost.',
    },
    {
      term: 'plowing',
      definition:
        'A trenchless underground installation method that pulls a blade through the soil at the target depth, simultaneously laying conduit or direct-buried cable into the slot the blade creates. The soil closes behind the blade — no open trench. Best in soft, cooperative soil (clay, sandy loam, black dirt); fails in rock or near existing utilities.',
    },
    {
      term: 'bore',
      definition:
        'The drilled hole created during horizontal directional drilling (HDD). The bore is created in two main phases: (1) a pilot bore — a small-diameter steering hole (typically 4–6 inches) that runs the full distance from entry pit to exit pit, and (2) reaming passes that progressively enlarge the bore to the final diameter required for conduit or cable pull-back. The bore itself is a hole filled with drilling fluid; the conduit or cable is installed in a second operation after reaming is complete.',
    },
    {
      term: 'pavement restoration',
      definition:
        'The repair and resurfacing of roads, sidewalks, or other paved surfaces after underground construction work that has required surface excavation. Pavement restoration includes removing and disposing of the broken asphalt or concrete, re-compacting the subgrade, and installing new asphalt or concrete to match the adjacent surface. This is a line-item cost on open-cut and plowing projects, often running $20–80 per linear foot for asphalt on urban streets and more for concrete. Trenchless methods (HDD, plowing) minimize restoration because they avoid excavating beneath the pavement surface.',
    },
    {
      term: 'decision matrix',
      definition:
        'A structured comparison tool that scores construction method options against site factors (soil type, depth, ROW width, surface type, cost, schedule) to identify the best-fit method for a specific route segment.',
    },
    {
      term: 'ROW',
      definition:
        'Right-of-Way — the legal corridor in which a utility is permitted to place infrastructure. ROW constraints (width, surface type, access restrictions) directly affect which construction method is permissible on a given segment.',
    },
    {
      term: 'bore pit',
      definition:
        'A small excavation at the entry or exit point of an HDD bore, sized to accommodate the drill head entry angle and the conduit/cable being pulled back. Entry pit is typically 4–8 feet wide × 10–20 feet long; exit pit is smaller. Both require traffic control and shoring if adjacent to roadway.',
    },
    {
      term: 'slurry',
      definition:
        'Drilling fluid — typically a bentonite (natural clay mineral) and water mixture — used in HDD to cool the drill bit, lubricate the bore path, and flush rock and soil cuttings back to the surface through the annular space around the drill rod. Slurry management (containment, disposal) is a significant operational and regulatory concern on HDD jobs.',
    },
    {
      term: 'soil type',
      definition:
        'The classification of soil based on its particle size, cohesion, and drainage properties — typically clay, silt, sand, loam, or rock. Soil type is the single most important factor in underground construction method selection: cooperative soils (clay, sandy loam, black dirt) allow plowing; sandy or saturated soils require open-cut; rock of any depth requires open-cut with a rock saw or HDD with a specialty rig.',
    },
    {
      term: 'route alignment',
      definition:
        'The planned horizontal path of an underground cable or conduit route as shown on engineering drawings. The route alignment determines which obstacles (roads, rivers, railroads, structures) must be crossed and which construction method is required at each crossing point. A poor alignment choice can convert a plow-able rural route into a series of expensive HDD bores.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// Branching scenario data
// ---------------------------------------------------------------------------
const scenarioNodes = {
  start: {
    id: 'start',
    text: `You're designing a 2-mile underground fiber route in central Georgia (Light loading district, clay soil). The route crosses a 4-lane highway at mile 0.8 and runs through residential yards for the remaining distance. Budget is tight. Pick your construction strategy.`,
    choices: [
      { label: 'Use HDD for the full 2 miles', next: 'hdd_full' },
      { label: 'Use open-cut trench for the full 2 miles', next: 'opencut_full' },
      { label: 'Plow the residential section; HDD the highway crossing', next: 'combo' },
    ],
  },
  hdd_full: {
    id: 'hdd_full',
    text: `Full HDD for 2 miles: mobilization cost is high (~$20–40/ft equivalent depending on contractor), bore deviation is a risk in 2 miles of clay. The highway crossing is solved, but you're paying HDD rates for residential yards where plowing would work fine. Result: over budget by 40%, schedule extended. The PM asks why you didn't use plow in the residential section.`,
    choices: [
      { label: 'Rethink the approach', next: 'start' },
      { label: 'Accept the result and move on', next: 'hdd_full_end' },
    ],
  },
  hdd_full_end: {
    id: 'hdd_full_end',
    text: `The project ships but the cost overrun reduces margin to near zero. The client notes the method selection in the post-construction review. Next bid: pick the right tool for each segment.`,
    choices: [],
  },
  opencut_full: {
    id: 'opencut_full',
    text: `Open-cut trench for 2 miles including the highway crossing: the state DOT requires a bore under the 4-lane highway — open-cut crossing of a primary highway is almost never permitted because it requires full lane closures. The permit is denied for the highway segment. Back to the drawing board.`,
    choices: [
      { label: 'Rethink the approach', next: 'start' },
    ],
  },
  combo: {
    id: 'combo',
    text: `Smart call. Plow the 1.2-mile residential section in clay soil (smooth, fast, low restoration cost). HDD the 4-lane highway crossing (300–400 ft bore, required by DOT permit). You need bore pits at each side of the highway. Clay is cooperative for plowing — blade tracks straight and closes cleanly.`,
    choices: [
      { label: 'During the plow, the blade hits an unmarked gas line at 18 inches', next: 'combo_gas_hit' },
      { label: 'The plow run goes clean — no strikes', next: 'combo_success' },
    ],
  },
  combo_gas_hit: {
    id: 'combo_gas_hit',
    text: `Strike on an unmarked private gas lateral (not in the 811 system). Work stops. Gas company emergency response required. Root cause: the crew relied solely on the 811 ticket and didn't pothole-expose utilities before plowing. Lesson: 811 locates registered utilities only. Private laterals are not in the system.`,
    choices: [
      { label: 'See the successful outcome', next: 'combo_success' },
    ],
  },
  combo_success: {
    id: 'combo_success',
    text: `Route complete. HDD bore under the highway: 380-foot pilot, 2 reaming passes, conduit pulled. Plow run through residential: 1.2 miles in 2 days with a 3-man crew and a vibratory plow. Surface closes behind the blade — minimal restoration. Cost came in 35% under the full-HDD alternative. Method selection wins.`,
    choices: [],
  },
};

// ---------------------------------------------------------------------------
// Quiz data
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt:
      'A fiber route must cross a Class I railroad (active, freight traffic). The railroad requires no surface disturbance to the trackbed. Which construction method is required?',
    choices: [
      'Open-cut trench — it gives the most control over conduit placement depth',
      'HDD — it crosses under the trackbed without surface disruption',
      'Plowing — it is the fastest method and causes the least delay to train traffic',
      'Either open-cut or plowing — both are permitted under railroad ROW by default',
    ],
    answerIndex: 1,
    explanation:
      'Railroads almost universally require HDD (or casing bore) for utility crossings because open-cut and plowing both require trackbed excavation, which disrupts rail operations and creates ballast-settlement risk. HDD crosses under the trackbed at depth without surface contact.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'A 6-mile rural route runs through Iowa black-dirt farmland with no major crossings. Soil is deep clay/loam, water table is 8 feet down. Which construction method typically wins on cost in this scenario?',
    choices: [
      'HDD — most accurate depth control',
      'Open-cut trench — most flexible for conduit count',
      'Plowing — fast, low restoration cost in cooperative soil',
      'All three methods cost the same per foot in flat farmland',
    ],
    answerIndex: 2,
    explanation:
      'Deep clay/loam farmland with a low water table is exactly the condition where vibratory plowing excels. The blade tracks straight in cooperative soil, the furrow closes behind the blade (minimal restoration), and production rates in open farmland can exceed 1 mile per day. Open-cut and HDD both carry higher per-foot costs in this scenario.',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'During a soil investigation before bidding, the drill log shows bedrock at 3 feet below grade along 40% of the proposed plow route. What is the most likely consequence for the plow option?',
    choices: [
      'The plow proceeds normally — vibratory plows are designed for rock',
      'The plow blade deflects sharply in rock — the method fails for those segments and an alternative is required',
      'Bedrock at 3 feet is fine as long as conduit burial depth is only 24 inches',
      'The plow can be replaced with a trencher blade at no additional mobilization cost',
    ],
    answerIndex: 1,
    explanation:
      'Vibratory plows are designed for soil, not rock. When the blade encounters bedrock or heavy ledge, it deflects — the conduit ends up at an unpredictable depth or the plow stalls entirely. Segments with bedrock shallower than target burial depth require open-cut trenching with a rock-saw attachment or HDD, both of which are higher cost.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    prompt:
      'The 811 utility locate ticket is cleared and the crew is ready to plow. A crew member notices orange utility flags in the residential yard that do not match any marked-up utility on the locate sheet. What is the correct next step?',
    choices: [
      'Proceed — the 811 ticket was cleared and those flags may be old',
      'Stop and pothole-expose the flagged location before proceeding',
      'Move the plow blade 12 inches to the side of the flags and continue',
      'Call 811 again and wait for a new ticket before proceeding',
    ],
    answerIndex: 1,
    explanation:
      'Unidentified utility flags are a red flag (literally). Private laterals — irrigation systems, propane services, electric drops to outbuildings — are not in the 811 system and will not appear on the locate ticket. The correct response is to stop and manually expose (pothole) the utility at the flagged location to identify it before mechanical excavation resumes. Moving the plow blade 12 inches sideways does not protect against a strike on an unidentified utility.',
  },
  {
    id: 'q5',
    type: 'drag-match',
    prompt: 'Match each construction method to its primary best-fit condition.',
    items: [
      { id: 'hdd', label: 'HDD (horizontal directional drilling)' },
      { id: 'opencut', label: 'Open-cut trench' },
      { id: 'plow', label: 'Vibratory plowing' },
    ],
    targets: [
      { id: 'target-obstacle', label: 'Road, river, or railroad crossing where surface disturbance is prohibited' },
      { id: 'target-urban', label: 'Short urban run with multiple conduits and complex crossing geometry' },
      { id: 'target-rural', label: 'Long rural run in cooperative clay/loam soil with no major crossings' },
    ],
    correctMap: {
      'target-obstacle': 'hdd',
      'target-urban': 'opencut',
      'target-rural': 'plow',
    },
    explanation:
      'Each method has a primary fit: HDD for obstacle crossings with no surface disturbance; open-cut for complex urban routes where conduit count or crossing geometry prevents plowing; vibratory plowing for long cooperative-soil rural runs where speed and minimal restoration are the priority.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L01_HDDvsOpenCutvsPlowing() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you design an underground fiber route, the first engineering question isn't
          "how deep?" or "what conduit?" — it's "how do we get in the ground?" There are
          three ways: drill under obstacles without digging a trench (HDD), cut a trench
          from the surface and bury conduit in it (open-cut), or drag a blade through the
          soil and let the ground close behind it (plowing). Every route uses at least one
          of these; many routes use a combination. Choosing wrong costs the project tens of
          thousands of dollars and months of schedule — or gets a permit denied entirely.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">HDD</td>
              <td className="px-3 py-2">Horizontal Directional Drilling</td>
              <td className="px-3 py-2">Steering a drill head underground, then pulling conduit back — no surface trench</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The legal corridor in which a utility can install infrastructure</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">DOT</td>
              <td className="px-3 py-2">Department of Transportation</td>
              <td className="px-3 py-2">State agency that controls highway ROW; issues the permit for road crossings</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The local agency whose permit requirements govern the job (DOT, county, city, railroad)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The "right tool for the right soil" analogy</h3>
        <p className="mt-2">
          Think of underground construction like digging in your backyard after a rain.
          Sandy wet soil: your hand pushes right through, and the hole stays open. Hard
          clay: you need a shovel, and it takes effort. Rock ledge just below the surface:
          the shovel bounces off. Now imagine doing that at a mile scale, under a highway,
          with a $2M machine. The soil and obstacle type determine which tool even works —
          let alone which tool is cost-effective.
        </p>

        <Flashcard
          deckId="T06-L01"
          cards={[
            { id: 'T06-L01-fc-hdd', front: 'What is HDD?', back: key_terms[0].definition },
            { id: 'T06-L01-fc-opencut', front: 'What is open-cut trench?', back: key_terms[1].definition },
            { id: 'T06-L01-fc-plow', front: 'What is vibratory plowing?', back: key_terms[2].definition },
            { id: 'T06-L01-fc-bore', front: 'What is a bore?', back: key_terms[3].definition },
            { id: 'T06-L01-fc-pavement', front: 'What is pavement restoration?', back: key_terms[4].definition },
            { id: 'T06-L01-fc-matrix', front: 'What is a decision matrix?', back: key_terms[5].definition },
            { id: 'T06-L01-fc-row', front: 'What is ROW?', back: key_terms[6].definition },
            { id: 'T06-L01-fc-borepit', front: 'What is a bore pit?', back: key_terms[7].definition },
            { id: 'T06-L01-fc-slurry', front: 'What is slurry?', back: key_terms[8].definition },
            { id: 'T06-L01-fc-soil', front: 'What is soil type?', back: key_terms[9].definition },
            { id: 'T06-L01-fc-alignment', front: 'What is route alignment?', back: key_terms[10].definition },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>The Three Methods — How Each Works and When to Use It</h2>

        {/* HDD */}
        <h3 className="mt-4 font-semibold text-lg">Method 1: HDD (Horizontal Directional Drilling)</h3>
        <p className="mt-2">
          The HDD drill rig sits in a <strong>bore pit</strong> on one side of the obstacle.
          A steerable drill head — about the size of a football — is pushed into the ground
          at a shallow angle (typically 8–18° entry angle). The operator steers the bit
          using a sonde (a transmitter behind the drill head) tracked by a locator on the
          surface. Once the pilot bore exits at the target location (the exit pit on the
          other side), a reamer is attached and pulled back through the bore in stages,
          enlarging the hole to the diameter needed for the conduit bundle. Finally, the
          conduit is pulled back through the reamed bore using a swivel connection. The
          bore is filled with <strong>slurry</strong> — bentonite drilling fluid — throughout
          the process to stabilize the bore walls and carry cuttings to the surface.
        </p>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold text-slate-200">When HDD is the right call:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li>Crossing under a road, highway, river, railroad, or any obstacle where surface disruption is prohibited or cost-prohibitive to restore</li>
            <li>AHJ (DOT, railroad authority, waterway permit) requires a trenchless crossing</li>
            <li>Multiple conduits under a single crossing (can pull a bundle in one pass)</li>
            <li>The target soil is clay, loam, or soft rock — HDD gets difficult in hard bedrock</li>
          </ul>
        </div>

        <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-300">HDD limitations to know:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li><strong>Higher mobilization cost</strong> — a drill rig, mud system, and locator crew costs more per foot than a plow on open farmland</li>
            <li><strong>Bore path deviation</strong> — steering in variable or hard soils introduces depth uncertainty; the as-built bore profile frequently differs from the design profile</li>
            <li><strong>Slurry management</strong> — bentonite mud must be contained and disposed of per local environmental requirements; surface returns ("frac-outs") are a common permit violation</li>
            <li><strong>Rock limitation</strong> — hard bedrock formations can stall a standard HDD rig or require a specialty rock-capable drill at significantly higher cost</li>
          </ul>
        </div>

        {/* Open-cut */}
        <h3 className="mt-6 font-semibold text-lg">Method 2: Open-Cut Trench</h3>
        <p className="mt-2">
          Open-cut is the simplest concept: excavate a trench to the target depth, lay conduit
          in the trench, backfill, compact, and restore the surface. A trencher (chain saw
          in the earth) or excavator creates the trench. Multiple conduits can be placed side
          by side. The trench can be inspected visually at every point. Crossing existing
          utilities is straightforward — you see them. Depth adjustments are real-time.
        </p>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold text-slate-200">When open-cut is the right call:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li>High conduit count (≥3–4 conduits) where a plow bundle is too wide and HDD bore diameter would be excessive</li>
            <li>Urban or suburban areas with dense existing utilities that require visual inspection during crossing</li>
            <li>Bedrock or cobble soils where neither a plow nor a standard drill rig works without specialty equipment</li>
            <li>Short runs where the fixed mobilization cost of HDD or a plow rig is not justified</li>
          </ul>
        </div>

        <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-300">Open-cut limitations to know:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li><strong>Maximum surface disruption</strong> — pavement removal, saw-cutting, traffic control, trench shoring in unstable soils, and surface restoration all add cost</li>
            <li><strong>Highest restoration cost per foot in paved ROW</strong> — asphalt patch quality is often a permit condition; poor restoration leads to bond claims</li>
            <li><strong>Cannot cross a primary highway in-ROW without DOT open-cut permit</strong> — most state DOTs prohibit or severely restrict open-cut on high-volume highways; HDD is required</li>
          </ul>
        </div>

        {/* Plowing */}
        <h3 className="mt-6 font-semibold text-lg">Method 3: Vibratory Plowing</h3>
        <p className="mt-2">
          A vibratory plow is a machine that pulls a blade through the soil while simultaneously
          feeding conduit or cable into the slot the blade creates. The blade vibrates rapidly
          (hence "vibratory") to reduce soil friction. The soil closes behind the blade — there
          is no open trench, no backfill, and minimal surface disruption. In good conditions
          (cooperative soil, no rock, no dense utilities), a 3-man plow crew can install more
          than a mile of conduit per day. That production rate is why plowing often wins on
          long rural routes.
        </p>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold text-slate-200">When plowing is the right call:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li>Long rural runs (miles) in clay, sandy loam, or black-dirt farmland</li>
            <li>Single or dual conduit — the blade and plow chute limit bundle width</li>
            <li>No rock, no ledge, no high water table — soil must be cooperative</li>
            <li>ROW is clear of dense utility crossings (811 locate clears the corridor)</li>
          </ul>
        </div>

        <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-300">Plowing limitations to know:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300/90">
            <li><strong>Fails in rock or ledge</strong> — the blade deflects sharply; conduit ends up at unknown depth or the plow stalls</li>
            <li><strong>Near-existing-utility risk</strong> — the blade can strike a utility if depth or lateral clearance is insufficient; no visual confirmation during installation</li>
            <li><strong>Water table</strong> — in saturated soil, the plow slot can fill with water and the soil won't close cleanly, leaving a void around the conduit</li>
            <li><strong>Cannot replace an HDD crossing</strong> — plowing across an active road, river, or railroad is not permitted</li>
          </ul>
        </div>

        {/* Soil Type and Route Alignment */}
        <h3 className="mt-6 font-semibold text-lg">Two Concepts That Drive Every Method Decision</h3>
        <p className="mt-2">
          Before you can score any route segment, you need two site facts in hand:
        </p>
        <p className="mt-3">
          <strong>Soil type</strong> is the classification of the material you will be boring or
          trenching through — clay, silt, sand, loam, or rock. Clay and sandy loam are{' '}
          <em>cooperative soils</em>: the plow blade tracks straight, the bore stays on path,
          and the trench walls are stable. Sandy or saturated soils are harder to plow (the
          furrow does not close) and harder to bore (bore walls collapse). Rock — even at
          24 inches depth — stops a vibratory plow entirely and adds $20–50+/ft to any open-cut
          (rock-saw attachment required). Soil type is the single most important factor in
          construction method selection. A 10-mile route through Iowa black dirt plows in 3 days;
          the same route through central Pennsylvania shale can take 3 weeks with a rock saw.
        </p>
        <p className="mt-3">
          <strong>Route alignment</strong> is the planned horizontal path shown on the engineering
          drawings — where the route goes. Alignment drives method selection because it determines
          which obstacles must be crossed: a route through open farmland might plow 100%; the same
          route shifted two blocks to follow a state highway requires HDD at every road crossing
          and may require open-cut through the utility-dense core. A well-chosen alignment can
          eliminate HDD bores worth tens of thousands of dollars. Designers optimize alignment to
          minimize obstacle crossings before finalizing method selection.
        </p>

        {/* Decision Matrix */}
        <h3 className="mt-6 font-semibold text-lg">The Decision Matrix: Scoring Your Route</h3>
        <p className="mt-2">
          No single route is one method. A 10-mile route might plow 8 miles, HDD 4 road
          crossings, and open-cut a 300-foot section through a dense utility corridor at a
          downtown intersection. The decision matrix scores each segment against the five
          key factors:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Factor</th>
                <th className="px-3 py-2 text-left">HDD</th>
                <th className="px-3 py-2 text-left">Open-Cut</th>
                <th className="px-3 py-2 text-left">Plowing</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Soil (clay/loam)</td>
                <td className="px-3 py-2 text-green-400">✓ Works well</td>
                <td className="px-3 py-2 text-green-400">✓ Works well</td>
                <td className="px-3 py-2 text-green-400">✓ Best fit</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Bedrock / rock</td>
                <td className="px-3 py-2 text-amber-400">⚠ Specialty rig needed</td>
                <td className="px-3 py-2 text-amber-400">⚠ Rock saw needed</td>
                <td className="px-3 py-2 text-red-400">✗ Fails</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Road / river crossing</td>
                <td className="px-3 py-2 text-green-400">✓ Standard use case</td>
                <td className="px-3 py-2 text-red-400">✗ Usually not permitted</td>
                <td className="px-3 py-2 text-red-400">✗ Not permitted</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Dense existing utilities</td>
                <td className="px-3 py-2 text-green-400">✓ Goes under them</td>
                <td className="px-3 py-2 text-green-400">✓ Visual inspection during dig</td>
                <td className="px-3 py-2 text-red-400">✗ Strike risk — no visual</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Long rural run (miles)</td>
                <td className="px-3 py-2 text-amber-400">⚠ High cost / mile</td>
                <td className="px-3 py-2 text-amber-400">⚠ High restoration cost</td>
                <td className="px-3 py-2 text-green-400">✓ Fastest / lowest cost</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">Multiple conduits in bundle</td>
                <td className="px-3 py-2 text-green-400">✓ Pull bundle in one bore</td>
                <td className="px-3 py-2 text-green-400">✓ Unlimited</td>
                <td className="px-3 py-2 text-amber-400">⚠ Limited by blade/chute width</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (the textbook method matrix):</p>
          <p className="mt-1 text-slate-300/90">
            Textbooks present the method decision matrix as an engineering calculation: score
            each factor, pick the winner. RUS 1751F-635 §5 describes method selection criteria
            including soil type, depth, access, and economic comparison. The matrix above
            reflects those criteria.
          </p>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (what actually determines the choice):</p>
          <p className="mt-1 text-slate-300/90">
            In the field, method selection is often made before the full engineering analysis
            because: (1) the crew has one rig on the truck, (2) the contractor bid it one way
            and isn't budgeted for a switch, or (3) the PM wants the fastest method regardless
            of soil. The designer's job is to specify the correct method in the drawings and
            contract documents so the contractor doesn't make the wrong call. If the bid was
            wrong, the change order is the consequence.
          </p>
        </div>

        {/* Scenario */}
        <h3 className="mt-6 font-semibold text-lg">Decision Scenario: Choose Your Method</h3>
        <p className="mt-1 text-sm text-slate-400">
          Work through this branching scenario to see how method selection plays out in a real
          Georgia route. Your choices have real cost and schedule consequences.
        </p>
        <BranchingScenario nodes={scenarioNodes} startNodeId="start" />
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: Cost Arithmetic and Method Switching</h2>
        <p>
          The 2025 FBA/Cartesian Fiber Deployment Cost Annual Report cites rural plowing
          at approximately $11.88/ft median and rural open-cut at approximately $19.00/ft
          median. (Note: these figures change year to year as the input dataset changes —
          cite the inputs, not a fixed number, when writing a bid narrative.)
          [VERIFIED-public-source — FBA/Cartesian reports; confirmed in Module09 source notes]
        </p>
        <p className="mt-3">
          At those figures, a 5-mile rural route (26,400 ft) in cooperative soil:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Plowing: 26,400 ft × $11.88 = <strong>~$313,600</strong></li>
          <li>Open-cut: 26,400 ft × $19.00 = <strong>~$501,600</strong></li>
          <li>Difference: <strong>~$188,000</strong> — nearly enough to fund a separate short spur build</li>
        </ul>
        <p className="mt-3">
          HDD mobilization adds a fixed cost that makes it uneconomical for general routing
          but economical for the crossings it enables. A typical HDD crossing under a 4-lane
          highway might run $15,000–$40,000 total for the bore (depending on bore length,
          soil, rig mobilization); that same crossing as an open-cut would be denied by the
          DOT permit, so the comparison isn't price — it's possible vs. not possible.
        </p>
        <p className="mt-3">
          <strong>Method switching mid-project</strong> is common and should be anticipated
          in the contract. Standard practice: write the contract with unit prices per method
          ($/ft HDD, $/ft plow, $/ft open-cut) so if the crew encounters unexpected rock and
          must switch from plow to open-cut, the change order is straightforward. Lump-sum
          contracts for underground work invite disputes when soil conditions differ from the
          bid assumptions.
        </p>

        <div className="mt-4 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">Soil investigation before bidding — not optional</p>
          <p className="mt-2 text-slate-300/90">
            Iowa black-dirt farmland: plowing typically wins by 30%+ on cost and schedule.
            Central Pennsylvania Appalachian shale: the plow fails on the first rod, the
            contractor switches to a rock-saw trencher or HDD, and the per-foot cost doubles.
            A geotechnical boring log (even one test hole per 1,000 feet on uncertain terrain)
            costs far less than a method change order. Design engineers who specify plow
            without a soil log are accepting that cost risk on behalf of the project.
            [Per Module09 field practice notes, Vermeer and Ditch Witch installation guidance]
          </p>
        </div>
      </section>

      {/* ── TYING IT TOGETHER ──────────────────────────────────────────────── */}
      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          The underground construction method you choose here doesn't stand alone — it interlocks with:
        </p>
        <ul className="space-y-2 text-slate-300 text-sm list-disc ml-5">
          <li><strong>T04.L02 Make-Ready Scope & Estimate</strong> — ROW assessment during site survey directly constrains which methods are permissible; sites with multiple crossings require HDD vs. open-cut trade-offs you quantify in the estimate</li>
          <li><strong>T03.L03 Cable Selection & Routing</strong> — the cable type (direct-buried vs. conduit-protected) influences which construction method you choose; conduit requires more space, favoring plowing in open areas but HDD for congested crossings</li>
          <li><strong>T05.L02 Burial Depth Rules</strong> — NESC §32 and RUS 1751F-635 define minimum cover depths that make certain methods impossible in shallow soil; your method decision is constrained by the depth rules governing that jurisdiction</li>
        </ul>
        <p className="text-slate-200 mt-3 text-sm italic">
          In the field, method selection is the single largest cost driver — a $188K difference between plowing and open-cut on a 5-mile rural route is real money that flows directly to the project's bottom line.
        </p>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2>Check Your Understanding</h2>
        <Quiz questions={quizQuestions} lessonId={meta.id} />
      </section>

    </LessonLayout>
  );
}
