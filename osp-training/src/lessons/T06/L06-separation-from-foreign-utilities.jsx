// T06.L06 — Separation from Foreign Utilities
// Working lesson: APWA color codes, parallel separation, crossing separation, locate-before-dig
// Source: Module09_OSPConstruction.jsx §9.1 + RUS 1751F-635 §6 + CGA Best Practices v20.0

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T06.L06',
  course_id: 'T06',
  title: 'Separation from Foreign Utilities',
  order: 6,
  lesson_type: 'standard',
  prerequisites: ['T06.L01', 'T06.L02', 'T06.L05'],
  learning_objectives: [
    'Identify the eight APWA utility color codes and state what each color marks',
    'Apply minimum separation distances for parallel and crossing installations relative to foreign utilities',
    'Explain when pothole exposure is required before mechanized excavation',
    'Describe the 811 system scope and its limits (private laterals not included)',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'foreign utility',
    'APWA Uniform Color Code',
    'parallel separation',
    'crossing separation',
    'pothole exposure',
    'CGA Best Practices',
    'tolerance zone',
  ],
  vocabulary_assumed: [
    { term: 'HDD', source_lesson_id: 'T06.L01' },
    { term: 'open-cut trench', source_lesson_id: 'T06.L01' },
    { term: 'plowing', source_lesson_id: 'T06.L01' },
    { term: 'bore pit', source_lesson_id: 'T06.L01' },
    { term: 'ROW', source_lesson_id: 'T06.L01' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
  ],
  key_terms: [
    {
      term: 'foreign utility',
      definition:
        'Any underground facility owned by a party other than the fiber installer — electric power lines, gas mains, water mains, sewer lines, existing telecommunications conduit, or private laterals. Foreign utilities must be located, marked, and given minimum clearance before and during underground construction.',
    },
    {
      term: 'APWA Uniform Color Code',
      definition:
        'The American Public Works Association color coding system for marking underground utilities during 811 locate operations. Red = electric; yellow = gas/oil/steam; orange = telecommunications and CATV; blue = potable water; purple = reclaimed water/irrigation; green = sewer/drain; white = proposed excavation; pink = survey marks. These are the colors of the locate paint, flags, and stakes left by the utility owner\'s locate technician.',
    },
    {
      term: 'parallel separation',
      definition:
        'The minimum horizontal distance maintained between a new conduit being installed and an existing foreign utility running in the same corridor. Unlike crossing separation (which applies at a single point), parallel separation must be maintained over the entire length of the parallel run. RUS 1751F-635 §6 specifies separation distances; many state DOTs and local AHJs require additional clearance.',
    },
    {
      term: 'crossing separation',
      definition:
        'The minimum vertical distance maintained when a new conduit crosses over or under an existing foreign utility. NESC §34 (Cable in Underground Structures) and NESC §35 Rule 354 (Direct-Buried Cable and Cable in Duct) specify crossing clearances between communications and supply facilities. Typical minimum: 6 inches vertical separation at the crossing point for communications crossing communications; greater clearance required for communications crossing electric supply conduit.',
    },
    {
      term: 'pothole exposure',
      definition:
        'Manually exposing a buried utility at a specific point by hand-digging or vacuum excavation before mechanized excavation (boring, plowing, trenching) begins in that area. Pothole exposure confirms the actual depth and horizontal position of the utility, correcting any inaccuracy in the locate marks. Standard practice at every utility crossing before mechanical excavation.',
    },
    {
      term: 'CGA Best Practices',
      definition:
        'The Common Ground Alliance (CGA) Best Practices Guide — currently version 20.0 (2024) — which defines the complete underground damage-prevention workflow from 811 ticket placement through excavation completion. The 2024 DIRT (Damage Information Reporting Tool) Report, maintained by CGA, recorded 196,977 unique utility damages nationwide in 2024; 24.5% were caused by failure to notify 811.',
    },
    {
      term: 'tolerance zone',
      definition:
        'The minimum distance around a marked utility line within which mechanized excavation is prohibited. Work within the tolerance zone must be done by hand tools or vacuum excavation only. Tolerance zone width varies by state law — commonly 18–24 inches on each side of the marked centerline. The tolerance zone exists because locate marks are approximate — the actual utility may be 12–18 inches from the mark.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const vocabulary_assumed = meta.vocabulary_assumed;
export const key_terms = meta.key_terms;

// ---------------------------------------------------------------------------
// Annotated Diagram — utility bore-pit cross-section
// ---------------------------------------------------------------------------
const utilityBoreDiagram = {
  title: 'Bore-Pit Cross-Section — Utility Crossing with Separation Distances',
  description:
    'A bore-pit view at a utility crossing. The HDD bore exits the ground to cross under existing foreign utilities. Click each label to see the separation rule and field practice.',
  regions: [
    {
      id: 'electric-conduit',
      label: 'Electric supply conduit (red flag)',
      x: '15%', y: '22%', width: '70%', height: '8%',
      description:
        'Electric supply conduit — marked with RED flags by the 811 locate technician. Running at approximately 18–24 inches depth. The new fiber conduit bore must pass below this at sufficient clearance. NESC §35 Rule 354 [confirm current edition] and APWA guidelines require at least 6 inches of vertical separation at the crossing point for communications-in-conduit crossing supply-in-conduit. Many state DOTs require 12 inches or more. Field practice: most crews target 12 inches minimum even when 6 is the code floor.',
    },
    {
      id: 'gas-main',
      label: 'Gas main (yellow flag)',
      x: '15%', y: '38%', width: '70%', height: '8%',
      description:
        'Gas main — marked with YELLOW flags. Running at approximately 30 inches depth in this example. The fiber conduit bore must pass below (deeper than) the gas main with adequate vertical separation. Standard practice: pothole-expose the gas main before boring to confirm depth and position. Gas companies often require notification of nearby HDD operations — confirm with the locate ticket and gas company representative.',
    },
    {
      id: 'fiber-conduit',
      label: 'New fiber conduit (HDD bore path)',
      x: '15%', y: '58%', width: '70%', height: '8%',
      description:
        'New fiber conduit being installed at 42 inches depth. This puts the new conduit 18 inches below the electric (at 24 in) and 12 inches below the gas main (at 30 in) at the crossing point. Both clearances exceed the minimum 6-inch rule and meet the field-practice 12-inch target.',
    },
    {
      id: 'separation-electric',
      label: 'Vertical separation — fiber to electric',
      x: '5%', y: '30%', width: '10%', height: '28%',
      description:
        'Vertical separation at crossing = 42 in (fiber depth) − 24 in (electric depth) = 18 inches. This exceeds the NESC §35 Rule 354 6-inch minimum [confirm current edition] and the typical DOT 12-inch requirement. A safety margin of 12–18 inches is the field-practice target.',
    },
    {
      id: 'separation-gas',
      label: 'Vertical separation — fiber to gas',
      x: '85%', y: '38%', width: '10%', height: '20%',
      description:
        'Vertical separation at crossing = 42 in (fiber depth) − 30 in (gas depth) = 12 inches. This meets the field-practice 12-inch target and exceeds the APWA minimum. Confirm with the gas company\'s encroachment requirements — some gas companies require 18-inch separation for HDD bores near their mains due to risk of slurry infiltration.',
    },
    {
      id: 'bore-pit-entry',
      label: 'HDD bore pit (entry)',
      x: '0%', y: '55%', width: '12%', height: '20%',
      description:
        'Entry bore pit, excavated to allow the drill head entry angle. Shored if adjacent to roadway. Dimensions: typically 4–8 ft wide × 10–20 ft long × target-depth + 2 ft. All foreign utilities in the bore pit area were pothole-exposed before excavation to confirm their actual positions.',
    },
  ],
  textFallback: `
    [DIAGRAM: Cross-sectional view of a bore pit with three underground utilities shown in horizontal bands at different depths.
    TOP BAND (22% depth): Electric supply conduit — marked RED, at 18–24 inches depth.
    MIDDLE BAND (38% depth): Gas main — marked YELLOW, at 30 inches depth.
    BOTTOM BAND (58% depth): New fiber conduit (HDD bore path) — at 42 inches depth.
    LEFT SIDE: Vertical separation arrows labeled 18 inches (fiber to electric) and 12 inches (fiber to gas).
    LEFT EDGE: Bore pit entry excavation.
    Note: All utilities are DEEPER than the surface grade shown at the top of the diagram.]
  `,
};

// ---------------------------------------------------------------------------
// Quiz data
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    prompt:
      'A 811 locate ticket is returned with yellow flags marking a gas line along your proposed bore path. The flags show the gas line running parallel to your fiber route, approximately 3 feet to the south. Your bore path passes within 18 inches of the gas main at its closest point. What is the correct next step before boring begins?',
    choices: [
      'Begin boring — 18 inches of separation exceeds the 6-inch NESC minimum, so the bore is code-compliant',
      'Pothole-expose the gas main at the point of closest approach to confirm actual depth and lateral position before boring',
      'Move the bore path to increase separation to at least 36 inches without exposing the utility',
      'Call the gas company and ask them to move the gas main before you proceed',
    ],
    answerIndex: 1,
    rationale:
      '18 inches is a code-compliant clearance from the locate mark — but locate marks are approximate. The actual gas main may be 12–18 inches from the flag, which could put the actual separation well below the 6-inch NESC minimum once boring is underway. Standard practice (and CGA Best Practices v20.0 requirement) is to pothole-expose the utility at the point of closest approach to confirm actual position before mechanized excavation. You build your bore path from the confirmed position, not from the approximate locate mark.',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    prompt:
      'Orange flags are placed along the edge of a property during a residential 811 locate. What utility do the orange flags mark?',
    choices: [
      'Electric power lines',
      'Gas or oil lines',
      'Telecommunications or CATV',
      'Potable water',
    ],
    answerIndex: 2,
    rationale:
      'Per the APWA Uniform Color Code: Orange = telecommunications and CATV. Red = electric power. Yellow = gas, oil, steam, petroleum. Blue = potable water. The orange flags mark existing telecommunications infrastructure — likely a copper or fiber run belonging to the incumbent telephone company, a cable TV provider, or a competitive fiber carrier.',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    prompt:
      'A crew plowing a residential route notices orange paint markings in the yard that don\'t appear on the 811 locate sheet. What should they do?',
    choices: [
      'Continue plowing — if it was important, it would be on the locate sheet',
      'Move the plow path 2 feet away from the orange marking and continue',
      'Stop work and manually investigate the marking before resuming mechanized excavation',
      'Report the discrepancy to the 811 center and continue while waiting for a response',
    ],
    answerIndex: 2,
    rationale:
      'Unidentified marks are a red flag. Orange paint may indicate: (1) an old locate from a prior 811 ticket now expired; (2) a private lateral not in the 811 system; (3) a contractor\'s own survey mark using the wrong color. Any mechanized excavation near unidentified marks risks a utility strike. Stop work, manually expose the area at the mark (pothole), and confirm what\'s there before the plow resumes. Moving the path by 2 feet does not address the unknown — the utility may extend laterally beyond the mark.',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    prompt:
      'Your fiber conduit runs parallel to an electric supply conduit for 600 feet in a utility corridor. The 811 locate shows the electric at 24-inch depth along the entire corridor. You plan to install the fiber at 36-inch depth, 18 inches to the south. Is there a problem?',
    choices: [
      'No — vertical separation (12 inches) and horizontal separation (18 inches) both exceed typical minimums',
      'Yes — fiber must always be installed north of electric supply to comply with NESC §35 Rule 354',
      'Yes — 18-inch horizontal separation violates the RUS 1751F-635 §6 parallel separation requirement',
      'No problem in terms of depth, but a permit from the electric utility is still required for parallel runs in shared corridors',
    ],
    answerIndex: 3,
    rationale:
      'The separation distances are likely acceptable (12 inches vertical, 18 inches horizontal exceeds typical NESC §35 Rule 354 and APWA minimums [confirm current NESC edition]). However, parallel runs in a shared utility corridor typically require coordination with the existing utility owner. For a 600-foot parallel run adjacent to an electric supply line, the electric utility may require an encroachment permit, notification, or inspection even if the separation distances are met. "Code-compliant" and "no coordination required" are not the same thing in shared corridors.',
  },
  {
    id: 'q5',
    type: 'drag-match',
    prompt: 'Match each APWA flag color to the utility it marks.',
    pairs: [
      { left: 'Red flags', right: 'Electric power lines and conduit' },
      { left: 'Yellow flags', right: 'Gas, oil, steam, petroleum mains' },
      { left: 'Orange flags', right: 'Telecommunications and CATV' },
      { left: 'Blue flags', right: 'Potable water mains' },
    ],
    rationale:
      'APWA Uniform Color Code (per CGA Marking Standards Manual and APWA reference): Red = electric, Yellow = gas/oil/petroleum, Orange = telecom/CATV, Blue = potable water. Green = sewer/drain; Purple = reclaimed water; White = proposed excavation area; Pink = survey marks.',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function T06L06_SeparationFromForeignUtilities() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every underground fiber route runs near other utilities — electric, gas, water,
          sewer, and existing telecom. Hitting one of them is the most expensive and
          dangerous mistake on a fiber build: gas line strikes can be fatal; electric
          strikes can be fatal; water-main strikes flood the bore pit and delay the job
          by days; telecom strikes take down a competitor's customers (and possibly yours).
          The rules for staying clear of foreign utilities are specific, and the system for
          finding out where they are — calling 811 — has limits you need to know cold.
        </p>
        <p className="mt-3">
          The one-sentence rule:{' '}
          <strong>
            Call 811 before any ground disturbance, expose every utility crossing before
            mechanical excavation, and maintain minimum separation distances in both the
            parallel and crossing directions.
          </strong>
        </p>

        <h3 className="mt-4 font-semibold">The APWA color codes — memorize these</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Color</th>
                <th className="px-3 py-2 text-left">Utility type</th>
                <th className="px-3 py-2 text-left">Action when found in your bore path</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-red-400">RED</td>
                <td className="px-3 py-2">Electric power lines, cables, conduit</td>
                <td className="px-3 py-2">Pothole-expose to confirm depth; verify ≥12 in vertical separation (field target); check with utility for encroachment requirements</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-yellow-400">YELLOW</td>
                <td className="px-3 py-2">Gas, oil, steam, petroleum</td>
                <td className="px-3 py-2">Pothole-expose at crossing; notify gas company (some require notification within X feet of their main); verify separation; no slurry frac-out risk near gas</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-orange-400">ORANGE</td>
                <td className="px-3 py-2">Telecommunications and CATV</td>
                <td className="px-3 py-2">Coordinate with the carrier; 6-inch crossing separation minimum; parallel spacing per RUS 1751F-635 §6</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-blue-400">BLUE</td>
                <td className="px-3 py-2">Potable water</td>
                <td className="px-3 py-2">Crossing OK with separation; parallel runs require water utility notification in most jurisdictions</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-purple-400">PURPLE</td>
                <td className="px-3 py-2">Reclaimed water / irrigation</td>
                <td className="px-3 py-2">Similar to blue water — confirm pressure rating; reclaimed water may be in PVC that doesn't register on metal detectors</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-green-400">GREEN</td>
                <td className="px-3 py-2">Sewers and drain lines</td>
                <td className="px-3 py-2">Confirm gravity flow direction; crossing OK with separation; avoid parallel runs close to sewer that may require future excavation for repairs</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium">WHITE</td>
                <td className="px-3 py-2">Proposed excavation area (your marks)</td>
                <td className="px-3 py-2">Your own proposed dig area, marked before calling 811 to show the locate technician where to look</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2 font-medium text-pink-400">PINK</td>
                <td className="px-3 py-2">Survey marks</td>
                <td className="px-3 py-2">Survey reference, not a utility — these are boundary or control points</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Source: APWA Uniform Color Code, per CGA Marking Standards Manual v10 and APWA reference [VERIFIED-public-source]
        </p>

        <Flashcard
          deckId="T06-L06"
          cards={key_terms.map((kt, idx) => ({
            id: `T06-L06-fc-${idx}`,
            front: `What is ${kt.term}?`,
            back: kt.definition,
          }))}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working" className="mt-8">
        <h2>Separation Requirements — Parallel and Crossing</h2>

        <h3 className="mt-4 font-semibold">The 811 system and its limits</h3>
        <p className="mt-2">
          Calling 811 — the national one-call number — notifies registered utility owners
          who then dispatch locate technicians to mark their facilities within the applicable
          state notice window (commonly two to three business days). This is the legally
          required first step before any ground disturbance.
        </p>

        <div className="mt-3 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold text-slate-200">811 ticket lifecycle — know these before you dig:</p>
          <ol className="mt-2 list-decimal pl-5 space-y-1 text-slate-300/90">
            <li><strong>Notice window:</strong> After calling 811, excavation cannot begin until the state-required notice period passes — commonly 2 to 3 business days (varies by state; verify at call8-1-1.com for your jurisdiction).</li>
            <li><strong>Ticket validity:</strong> A locate ticket is valid for a state-specific period — typically 10 to 15 working days from the date marks are placed. After the validity window, the marks are considered stale and the ticket must be renewed before excavation continues. Do not assume marks placed 3 weeks ago are still valid.</li>
            <li><strong>Pre-mark your work area:</strong> White paint, flags, or stakes mark your proposed excavation area BEFORE calling 811 — this tells the locate technician exactly where to look. Failure to pre-mark results in missed or inaccurate locate marks.</li>
            <li><strong>Hand-dig tolerance zone:</strong> Once marks are placed, mechanical excavation is prohibited within the tolerance zone (state-specific; commonly 18–24 inches on each side of the marked centerline) until the utility is hand-exposed and confirmed.</li>
            <li><strong>Ticket renewal:</strong> If work extends beyond the ticket validity period, call 811 to renew the ticket and have utilities re-marked before excavation resumes. Re-marking is especially important if the ground has been disturbed since the original marks were placed, as marks may have been covered or shifted.</li>
          </ol>
          <p className="mt-2 text-slate-400 text-xs">State notice periods and ticket validity windows are defined by state law and vary by jurisdiction. Confirm requirements for your state at the 811 system or your state one-call center. [Per CGA Best Practices v20.0; state one-call center requirements]</p>
        </div>

        <p className="mt-3">
          <strong>What 811 does NOT cover:</strong>
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li><strong>Private laterals</strong> — irrigation lines, propane service lines, electric drops from a meter to a detached garage, fire suppression feeds — are NOT in the 811 system and will not be marked</li>
          <li><strong>Agricultural tile drains</strong> — perforated clay or plastic drain tiles buried 2–4 feet deep across farmland are NOT registered with 811 and are rarely mapped. These are extremely common on rural routes and are a frequent strike hazard for plowing and open-cut in agricultural areas. Identify their presence by consulting landowners and local drainage district records before mechanized excavation in farmland.</li>
          <li><strong>Abandoned utilities</strong> — old copper, abandoned gas mains, and decommissioned water services may not be registered</li>
          <li><strong>Accuracy</strong> — 811 locate marks are approximate (±18–24 inches); the actual utility may be 12–18 inches from the flag</li>
          <li><strong>Depth</strong> — 811 marks show horizontal position only; depth must be confirmed by pothole exposure at crossings</li>
        </ul>
        <div className="mt-3 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-300">CGA DIRT Report data (most recent available):</p>
          <p className="mt-1 text-slate-300/90">
            The 2024 DIRT Report recorded 196,977 unique utility damages nationwide.
            <br />• 24.5% caused by failure to notify 811 (largest single root cause)
            <br />• 49% of damaged utilities were telecom facilities
            <br />• "Insufficient locate practices" was a contributing factor in thousands of incidents where 811 was called but pothole exposure was skipped
            [VERIFIED-public-source — CGA, dirt.commongroundalliance.com — verify at publication for most recent report year]
          </p>
        </div>

        <h3 className="mt-6 font-semibold">Separation distances</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Crossing type</th>
                <th className="px-3 py-2 text-left">Minimum separation</th>
                <th className="px-3 py-2 text-left">Field practice</th>
                <th className="px-3 py-2 text-left">Source</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90 text-xs">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Comms conduit crossing comms conduit</td>
                <td className="px-3 py-2">6 inches vertical</td>
                <td className="px-3 py-2">12 inches (standard field target)</td>
                <td className="px-3 py-2">NESC §35 Rule 354 [confirm current edition — paywalled]; APWA guidelines</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Comms conduit crossing electric supply conduit</td>
                <td className="px-3 py-2">6 inches vertical</td>
                <td className="px-3 py-2">12–18 inches (field target; some electric utilities require more)</td>
                <td className="px-3 py-2">NESC §35 Rule 354 [confirm current edition]; electric utility encroachment permit</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Comms conduit crossing gas main</td>
                <td className="px-3 py-2">AHJ-specific; commonly 6–12 inches</td>
                <td className="px-3 py-2">12–18 inches; notify gas company; slurry containment for HDD</td>
                <td className="px-3 py-2">Gas company encroachment policy [confirm per jurisdiction]</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Parallel comms to comms (same corridor)</td>
                <td className="px-3 py-2">Per RUS 1751F-635 §6 and AHJ</td>
                <td className="px-3 py-2">18–24 inches horizontal typical; varies by corridor crowding</td>
                <td className="px-3 py-2">RUS 1751F-635 §6 [confirm section applicability per job type]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-blue-300">Book practice (NESC Rule 354 crossing clearance):</p>
          <p className="mt-1 text-slate-300/90">
            NESC §35 Rule 354 governs supply-to-communication separation for direct-buried cable
            and cable in duct that is not part of a conduit system. For communications in duct
            crossing supply in conduit, the 6-inch minimum vertical separation applies at the
            crossing point [confirm current NESC C2 edition — paywalled]. The 6-inch floor is the
            code minimum; field practice targets 12 inches to account for bore-path and locate-mark
            uncertainty.
          </p>
        </div>
        <div className="mt-3 bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
          <p className="font-semibold text-green-300">Field practice (why crews default to 12 inches):</p>
          <p className="mt-1 text-slate-300/90">
            The 6-inch code minimum assumes perfectly confirmed utility depth and perfectly executed
            bore path. In reality, bore steering in variable soil introduces depth uncertainty of
            ±3–6 inches, and locate marks carry ±12–18 inches of horizontal uncertainty. A bore
            targeted at 6-inch clearance may end up at 2 inches or less after steering corrections.
            Experienced crews target 12 inches minimum — which with ±6 inches of bore variance
            still leaves a real-world floor of 6 inches at worst. The extra 6 inches of bore depth
            costs nothing and may prevent a strike.
            [Per field practice — Module09 notes, CGA Best Practices v20.0]
          </p>
        </div>

        {/* Worked Separation Example */}
        <h3 className="mt-6 font-semibold">Worked Example: Separation at a Multi-Utility Bore Crossing</h3>
        <p className="mt-2">
          Your fiber conduit HDD bore is planned at 42-inch depth. The 811 locate returns:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>Red flag (electric) at approximately 24-inch depth</li>
          <li>Yellow flag (gas) at approximately 30-inch depth</li>
        </ul>
        <p className="mt-3 text-sm">
          <strong>Vertical separation at crossing:</strong>
        </p>
        <div className="mt-2 font-mono text-sm bg-white/5 rounded p-3 space-y-1">
          <p>Fiber to electric: 42 in − 24 in = 18 inches vertical separation</p>
          <p>Compare to NESC §35 Rule 354 minimum (6 in): 18 &gt; 6 ✓</p>
          <p>Compare to field-practice target (12 in): 18 &gt; 12 ✓</p>
          <p></p>
          <p>Fiber to gas: 42 in − 30 in = 12 inches vertical separation</p>
          <p>Compare to field-practice minimum (12 in): 12 ≥ 12 ✓ (at target — no margin)</p>
          <p>Action: pothole-expose gas main to confirm actual depth before boring.</p>
          <p>If actual gas depth is 28 in: 42 − 28 = 14 in separation ✓ (acceptable)</p>
          <p>If actual gas depth is 36 in: 42 − 36 = 6 in separation — below field target → deepen bore to 48 in.</p>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Sanity check: 42-inch bore depth puts the fiber conduit at knee height below the electric and just above waist depth below the gas main. At 12 inches of gas clearance, the bore is within one shovel-blade width. That's why you pothole-expose before boring — to confirm this number is real, not approximate.
        </p>

        {/* Annotated Diagram */}
        <h3 className="mt-6 font-semibold">Bore-Pit Cross-Section — Utility Separation Diagram</h3>
        </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced" className="mt-8">
        <h2>Advanced: Slurry Frac-Out and Encroachment Permits</h2>

        <h3 className="font-semibold">HDD slurry frac-out near gas mains</h3>
        <p className="mt-2">
          HDD slurry (bentonite fluid) travels under pressure through the bore path. If the
          bore passes close to a gas main joint, valve, or corroded fitting, slurry can intrude
          into the gas main. The same pressure that helps stabilize the bore can force bentonite
          mud into a gas-main annular space, potentially entering a service lateral or valve seat.
          This is why some gas companies require:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>18-inch minimum clearance (not the NESC 6-inch floor) for HDD near their mains</li>
          <li>Notification to their operating center before HDD begins within their exclusion zone</li>
          <li>A gas company representative on-site during bore operations within 25 feet of their main</li>
          <li>Use of reduced-pressure slurry mix when boring within 10 feet of a gas main</li>
        </ul>
        <p className="mt-2 text-sm text-slate-400">
          [Confirm specific requirements with the gas company operating the main; requirements vary by company policy and pipe age — cast-iron mains have more intrusion risk than modern HDPE gas pipe]
        </p>

        <h3 className="mt-5 font-semibold">Encroachment permits for parallel runs in shared corridors</h3>
        <p className="mt-2">
          When a new fiber conduit runs parallel to an electric supply line, gas main, or
          existing telecom for a significant distance in a shared corridor (railroad ROW, highway
          ROW, utility easement), the existing utility owner may require:
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-slate-300/90">
          <li>A formal encroachment permit (separate from the ROW permit) issued by the utility</li>
          <li>Payment of a crossing or occupation fee</li>
          <li>Agreement to indemnify the utility for any damages caused by your installation</li>
          <li>As-built submission of your conduit location relative to their facility</li>
        </ul>
        <p className="mt-2 text-sm">
          RUS 1751F-635 §6 addresses coordination with other utilities on RUS projects. The specific
          requirements depend on the utility's tariff, state utility commission rules, and the
          applicable joint-use agreement. Always identify foreign utility owners at the route-design
          stage and initiate encroachment coordination early — approval delays are a common project
          schedule risk that can't be managed at the last minute.
        </p>

        <div className="mt-4 bg-white/5 rounded-lg p-4 text-sm">
          <p className="font-semibold">Parallel separation — design rule</p>
          <p className="mt-2 text-slate-300/90">
            For a fiber conduit running parallel to a utility line in a shared corridor, standard design
            practice (per RUS 1751F-635 §6 and BICSI OSPDR) requires maintaining consistent horizontal
            separation over the entire parallel run length. If the separation at any point closes to less
            than the minimum, the fiber route must jog away or increase depth to maintain clearance.
            Inconsistent separation creates a "pinch point" that is both a code violation and a future
            third-party strike risk when the other utility owner does maintenance work in the corridor.
          </p>
        </div>
      </section>

      {/* ── QUIZ ─────────────────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2>Check Your Understanding</h2>
        <Quiz questions={quizQuestions} lessonId={meta.id} />
      </section>

    </LessonLayout>
  );
}
