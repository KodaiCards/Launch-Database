// Net-new — T04.L01 The Site Walk — What You're Looking For
// Foundation lesson: field walk procedures, hazard spotting, photo logging, route documentation

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import HotSpot from '../../components/primitives/HotSpot.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T04.L01',
  course_id: 'T04',
  title: 'The Site Walk — What You\'re Looking For',
  order: 1,
  lesson_type: 'foundation',
  prerequisites: ['T01.L01', 'T18.L01'],
  vocabulary_introduced: [
    'site walk',
    'existing utility',
    'hazard identification',
    'photo log',
  ],
  key_terms: [
    {
      term: 'site walk',
      definition:
        'A structured field inspection of a proposed route in which the surveyor walks (or drives) the corridor, documents existing conditions — poles, utilities, terrain, hazards, and access constraints — and records findings in a standardized format that feeds the design engineer\'s work.',
    },
    {
      term: 'existing utility',
      definition:
        'Any buried, aerial, or surface-mounted service already present in the route corridor: power lines, telephone cables, gas mains, water mains, sewer lines, and fiber or coaxial cables belonging to other carriers. Identifying existing utilities before design prevents conflicts, damage, and 811 violations during construction.',
    },
    {
      term: 'hazard identification',
      definition:
        'The trained skill of spotting physical, electrical, chemical, and environmental dangers along a proposed route before work begins — including overhead energized lines, confined-space indicators near manholes and handholes, unstable ground, traffic exposure, and proximity to energized equipment. Hazard identification during the site walk protects both the survey crew and the future construction crew.',
    },
    {
      term: 'photo log',
      definition:
        'A systematic, GPS-stamped photographic record taken at defined intervals or at every condition of note along the route. Each photo is tagged with a station number, direction of view, and brief caption. The photo log becomes part of the handoff package and lets the design engineer "walk" the route without leaving the office.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'conduit', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'make-ready', source_lesson_id: 'T01.L05' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'joint-use', source_lesson_id: 'T01.L02' },
    { term: 'clearance', source_lesson_id: 'T01.L02' },
    { term: 'RUS', source_lesson_id: 'T01.L01' },
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: 'confined space', source_lesson_id: 'T18.L03' },
    { term: 'PPE', source_lesson_id: 'T18.L05' },
    { term: 'lockout-tagout', source_lesson_id: 'T18.L02' },
    { term: 'LOTO', source_lesson_id: 'T18.L02' },
    { term: 'fall protection', source_lesson_id: 'T18.L04' },
    { term: '1910.268', source_lesson_id: 'T18.L01' },
  ],
  estimated_minutes: 25,
};

export default function T04L01_SiteWalkHazardRecon() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Before anyone draws a line on a map, someone has to walk the ground.
          The <strong>site walk</strong> — sometimes called a route walk or field reconnaissance —
          is the first time human eyes see the actual terrain a cable will cross. Every pothole,
          every low-hanging power wire, every rusted pole, every unmarked manhole shows up during
          the walk. Miss it here, and the design engineer draws a route that can't be built,
          or a crew runs into a hazard on day one of construction.
        </p>
        <p className="mt-2">
          Think of the site walk like a scouting trip before a camping hike. You're not camping yet —
          you're checking whether the trail is passable, where the river crossings are, and whether
          anything looks dangerous before you send the whole crew out with 50 lbs of gear.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
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
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The legal corridor where the cable will run — road shoulder, utility easement, or private land with a recorded easement</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OSHA</td>
              <td className="px-3 py-2">Occupational Safety and Health Administration</td>
              <td className="px-3 py-2">Federal agency that sets the safety rules for field work; 29 CFR 1910.268 is the telecom-specific standard</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">PPE</td>
              <td className="px-3 py-2">Personal Protective Equipment</td>
              <td className="px-3 py-2">Safety gear worn by the worker — hard hat, safety glasses, hi-vis vest, gloves, steel-toed boots</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">LOTO</td>
              <td className="px-3 py-2">Lockout/Tagout</td>
              <td className="px-3 py-2">The energy isolation procedure required before any work near energized equipment; introduced in T18.L02</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">GIS</td>
              <td className="px-3 py-2">Geographic Information System</td>
              <td className="px-3 py-2">Software that maps layers of spatial data — poles, cables, roads, property lines — onto a common basemap</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">What you're actually looking for</h3>
        <p className="mt-2">
          A good site walk collects six categories of information:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-3">
          <li>
            <strong>Existing utilities</strong> — power lines, telephone cables, gas mains,
            water lines, sewer, and any other carrier's fiber or coax already in the corridor.
            These tell you what the new cable has to coexist with and may create make-ready
            requirements before your cable can go up.
          </li>
          <li>
            <strong>Hazards</strong> — anything that could hurt a survey crew now or a
            construction crew later: energized conductors with low clearance, unstable
            road shoulders, manhole covers in active traffic lanes, steep slopes, water crossings,
            and confined-space entry points.
          </li>
          <li>
            <strong>Physical access and terrain</strong> — Can a bucket truck get there?
            Is there a bridge weight limit? Is the shoulder wide enough to stage equipment?
            Does the land owner have a locked gate? Field answers inform route feasibility.
          </li>
          <li>
            <strong>Pole conditions</strong> — Does the pole look structurally sound?
            Are there signs of woodpecker damage, rot at the base, or existing over-attachment?
            Any pole that looks questionable gets flagged for formal audit in L04.
          </li>
          <li>
            <strong>ROW status</strong> — Is the proposed route in public ROW (road shoulder,
            utility easement) or private land? Who owns the land? Are there fences, crops,
            buildings, or water features that affect permitting? Note parcel boundaries
            where they cross the route.
          </li>
          <li>
            <strong>Photo evidence</strong> — Everything above gets photographed: a photo log
            that a design engineer or permitter can review months later without going back to
            the field.
          </li>
        </ol>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T04-L01"
          cards={[
            {
              id: 'T04-L01-fc-site-walk',
              front: 'What is a site walk?',
              back: 'A structured field inspection of a proposed route in which the surveyor walks (or drives) the corridor, documents existing conditions — poles, utilities, terrain, hazards, and access constraints — and records findings in a standardized format that feeds the design engineer\'s work.',
            },
            {
              id: 'T04-L01-fc-existing-utility',
              front: 'What is an existing utility in OSP survey context?',
              back: 'Any buried, aerial, or surface-mounted service already present in the route corridor: power lines, telephone cables, gas mains, water mains, sewer lines, and fiber or coaxial cables belonging to other carriers. Identifying existing utilities before design prevents conflicts, damage, and 811 violations during construction.',
            },
            {
              id: 'T04-L01-fc-hazard-identification',
              front: 'What is hazard identification during a site walk?',
              back: 'The trained skill of spotting physical, electrical, chemical, and environmental dangers along a proposed route before work begins — including overhead energized lines, confined-space indicators near manholes and handholes, unstable ground, traffic exposure, and proximity to energized equipment.',
            },
            {
              id: 'T04-L01-fc-photo-log',
              front: 'What is a photo log?',
              back: 'A systematic, GPS-stamped photographic record taken at defined intervals or at every condition of note along the route. Each photo is tagged with a station number, direction of view, and brief caption. The photo log becomes part of the handoff package and lets the design engineer "walk" the route without leaving the office.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Running the Site Walk — Step by Step</h2>

        <h3 className="mt-4 font-semibold">Before you leave the truck</h3>
        <p>
          A site walk is only as good as your prep. Before you step out:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>Pull the project's preliminary route map (even a rough sketch helps).</li>
          <li>Check county GIS or One-Call records for known buried utilities in the corridor.</li>
          <li>Know the T18 safety rules: fall protection at any pole over 4 ft, confined-space
            indicators at manholes, LOTO requirements before any contact with energized equipment.
            You covered these in T18 — carry that knowledge into every field visit.</li>
          <li>Put on your PPE: hard hat (Class E for joint-use aerial corridors), safety glasses,
            ANSI Class 2 hi-vis vest minimum (Class 3 near high-speed traffic per MUTCD Part 6),
            steel-toed boots.</li>
          <li>Have your field notebook, camera or phone with GPS-geotagging enabled, and a measuring
            tape or rangefinder.</li>
        </ul>

        <h3 className="mt-5 font-semibold">Safety integration — T18 in practice</h3>
        <p>
          Reviewing T18 topics before every site walk is mandatory, not a suggestion.
          Three situations require immediate action rather than documentation-only:
        </p>

        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mt-3 space-y-3 text-sm">
          <div>
            <p className="font-semibold text-red-300">Overhead energized conductors at low clearance</p>
            <p className="text-slate-300/90 mt-1">
              If a power line sags to a height that looks unsafe for a crew or a boom truck,
              flag it and note the GPS location. Do NOT approach with a measuring pole or any
              conductive object. The design engineer will coordinate with the power company for
              clearance verification. Reference: 29 CFR 1910.268(b) and T18.L07 (energized
              conductor proximity).
            </p>
          </div>
          <div>
            <p className="font-semibold text-red-300">Confined-space indicators at manholes or handholes</p>
            <p className="text-slate-300/90 mt-1">
              If a manhole or handhole is on your route and needs to be opened for inspection,
              this triggers permit-required confined-space entry rules (29 CFR 1910.146 — covered
              in T18.L03). Survey teams should only open accessible handholes for visual inspection
              from above. Full entry into a manhole requires a confined-space permit, atmospheric
              testing, and a trained attendant. If you need interior dimensions, mark it as
              "requires confined-space entry team" in your notes rather than improvising.
            </p>
          </div>
          <div>
            <p className="font-semibold text-red-300">Unstable ground or active traffic hazard</p>
            <p className="text-slate-300/90 mt-1">
              A shoulder that's soft, a road cut that's actively eroding, or a bridge walkway
              with missing guardrails requires you to photograph from a safe distance and note
              the hazard type and approximate GPS location. Construction crews get the warning
              before they schedule that segment.
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-semibold">Documenting what you find</h3>
        <p>
          Walk the route in station order (if staking hasn't happened yet, you create a
          rough stationing by GPS coordinate or landmark). At each pole or condition of note:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Record the station or GPS coordinate.</strong> Your GIS software
            will use this to tie the observation to the map.
          </li>
          <li>
            <strong>Note the pole number</strong> (utility company label on the butt or in
            their system) if accessible, or assign a field-temporary number if it's a
            new pole location.
          </li>
          <li>
            <strong>Describe existing attachments</strong> from top to bottom: power phase
            wires, neutral, streetlight, telephone, cable TV, any existing fiber. Count
            the number of each carrier's cables.
          </li>
          <li>
            <strong>Note visible hazards</strong> — damaged insulator, severely leaning pole,
            overloaded crossarm, low-clearance jumper, splice case in deteriorated condition.
          </li>
          <li>
            <strong>Photograph</strong>: one shot looking up the pole from the base (shows
            attachment order), one shot of the full span to the next pole, one shot of any
            hazard condition with a scale reference (measuring tape, person standing for scale).
          </li>
          <li>
            <strong>Flag make-ready candidates.</strong> If a pole is obviously over-attached
            or has no room for a new attachment at the required height, write "make-ready
            review needed" in your notes. The design engineer's formal make-ready analysis
            comes later — you're flagging, not deciding.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-2">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book (RUS 1751F-630 § 7 and standard survey practice):</strong> A formal
            route survey follows a systematic station-by-station procedure, records every
            utility in the corridor, flags every clearance concern, and produces a documented
            deliverable package before design begins. The walk is thorough and standardized.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Under schedule pressure, experienced crews sometimes
            skip the formal station log and rely on photos and memory to reconstruct the route.
            This works fine until the design engineer asks "What was at pole 14 near the creek
            crossing?" and the field notes are a collection of 400 undated iPhone photos.
            The cost of going back to re-walk one segment often exceeds the time saved by
            skipping the structured log the first time. The structured approach pays for itself
            when things get complicated.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> A design that's built on incomplete site-walk data will
            have surprises — make-ready costs not in the estimate, buried utilities that conflict
            with the proposed duct route, access issues that blow the construction schedule.
            Each surprise is a cost overrun that traces back to the quality of the field walk.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">The photo log — format and discipline</h3>
        <p>
          A <strong>photo log</strong> is not just "take a lot of pictures." It's a structured
          record where each image is indexed to a location and can be retrieved months later
          during permitting or construction. Standard format:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Geotagging on.</strong> Every modern phone and field camera can embed GPS
            coordinates in the image metadata (EXIF data). Turn it on before you start.
          </li>
          <li>
            <strong>Station-prefix naming.</strong> Name images with a station prefix:
            <span className="font-mono ml-1 text-slate-300">STA-0045-looking-north.jpg</span>,
            <span className="font-mono ml-1 text-slate-300">STA-0045-pole-top.jpg</span>,
            <span className="font-mono ml-1 text-slate-300">STA-0047-hazard-low-guy.jpg</span>.
            Descriptive names let someone else read the log without a legend.
          </li>
          <li>
            <strong>Orientation shots.</strong> Every five to ten poles, take a wider
            "orientation" shot that includes a landmark — road intersection, address sign,
            mile marker — so the sequence can be anchored to the map.
          </li>
          <li>
            <strong>Caption the hazards.</strong> Anything flagged as a hazard gets a typed
            caption in the field log (not just a photo): location, type of hazard, any
            immediate action taken.
          </li>
        </ul>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>

        <h3 className="mt-4 font-semibold">When a visual site walk isn't enough</h3>
        <p>
          For routes through forested corridors, river crossings, or areas with heavy tree
          canopy, the on-foot site walk often can't see the ground conditions clearly enough
          to locate buried utilities or identify erosion-prone terrain. That's where drone
          LiDAR (covered in L02) fills the gap — it can "see through" moderate canopy to
          the ground surface and detect buried infrastructure markers.
        </p>
        <p className="mt-2">
          For projects with active permitting requirements (NEPA review, Section 106 historic
          preservation, Section 404 wetland permits), the site walk also triggers the
          environmental screening checklist: Is the route within 300 ft of a historic property?
          Does it cross a jurisdictional wetland? Are there endangered species habitat
          markers? These conditions get documented during the walk and passed to the
          permitting team. The Environmental Permitting topic goes deeper on this — here the
          takeaway is: photograph any wetland markers, historical markers, or sensitive-area
          signage you encounter.
        </p>

        <h3 className="mt-5 font-semibold">Coordinating with other utilities before the walk</h3>
        <p>
          In most states, the site walk itself doesn't trigger a locate (811) requirement —
          locates are required before excavation, not before a visual inspection. However,
          if the site walk involves any subsurface probing (e.g., using a push rod to check
          conduit depth), a ground-penetrating radar scan, or any test hole digging, then
          811 locate rules apply. (The OSP Construction topic covers Call 811 in detail.)
        </p>
        <p className="mt-2">
          It's good practice to pull the utility atlas or county GIS records before the walk
          anyway — showing up with a printed corridor map that already marks the known buried
          utilities helps the field crew know where to look and what to confirm.
        </p>
      </section>

      {/* ── HOTSPOT ─────────────────────────────────────────────────────── */}
      <HotSpot
        imageUrl="/training/diagrams/t04-route-walk-scene.svg"
        alt="Aerial-style illustration of a route-walk scene showing a utility pole corridor with various hazards including a low-hanging power line, an unmarked manhole cover in the roadway, a leaning pole, and unstable shoulder erosion"
        mode="challenge"
        title="Spot the Hazards — Route Walk Scene"
        instructions="This illustration shows a typical OSP route corridor. Click every hazard you can identify. You need to find at least 3 of 4 to pass."
        regions={[
          {
            id: 'low-clearance-wire',
            x: 22,
            y: 35,
            width: 15,
            height: 8,
            label: 'Low-clearance power conductor',
            explanation:
              'A power conductor sagging close to the road surface or below the minimum required clearance. This is a strike hazard for any vehicle taller than a standard passenger car and a lethal hazard for boom trucks. Flag the GPS location; do not approach with any conductive object. The power company must verify and remediate clearance before construction.',
            isHazard: true,
          },
          {
            id: 'manhole-traffic',
            x: 48,
            y: 65,
            width: 10,
            height: 10,
            label: 'Unmarked manhole cover in traffic lane',
            explanation:
              'A manhole cover inside an active traffic lane — no traffic control cones or markings visible. Opening this for inspection without proper temporary traffic control (TTC) violates MUTCD Part 6 and exposes the crew to traffic hazard. If the manhole must be inspected, schedule a flagging team and TTC setup before opening. Also: any open manhole inspection may require confined-space entry procedures per 29 CFR 1910.146.',
            isHazard: true,
          },
          {
            id: 'leaning-pole',
            x: 68,
            y: 28,
            width: 10,
            height: 25,
            label: 'Severely leaning pole',
            explanation:
              'A pole leaning noticeably out of plumb — possibly due to rot at the base, vehicle strike, or soil erosion. A compromised pole cannot safely carry additional attachment load. Flag it for formal structural evaluation before any make-ready or fiber attachment. Do not climb or work near the pole until it is evaluated by the pole owner.',
            isHazard: true,
          },
          {
            id: 'eroding-shoulder',
            x: 82,
            y: 72,
            width: 14,
            height: 10,
            label: 'Eroding roadway shoulder',
            explanation:
              'A road shoulder showing active erosion — deep ruts, exposed gravel base, or undercut pavement edge. A crew trenching or directional drilling this segment could encounter unexpected subsurface voids or unstable ground. Photograph from a safe distance and flag the segment for a geotechnical note in the handoff package.',
            isHazard: true,
          },
        ]}
      />

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T04-L01-scenario-1"
        title="Route Walk Decision Point"
        description="You're conducting a site walk for a 3-mile aerial route through a mixed residential/rural corridor. At the midpoint, you encounter the situation described below. What do you do?"
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            prompt:
              'You reach pole 14, which is in an active traffic lane shoulder. The pole has a low-hanging jumper wire with unclear ownership — it could be the power company\'s secondary or a telephone drop. It appears to sag close to the road surface. You need to note the pole\'s existing attachments for the design engineer. What do you do first?',
            choices: [
              { label: 'Take photos from a safe distance and flag the GPS coordinate; note "low-clearance jumper — verify with utility company before design"', nextId: 'safe-photo' },
              { label: 'Use your measuring tape to get the approximate clearance height so the engineer has a number', nextId: 'measure-unsafe' },
              { label: 'Skip the pole — it looks too complicated and you\'ll come back later', nextId: 'skip-pole' },
            ],
          },
          'safe-photo': {
            id: 'safe-photo',
            prompt:
              'Good call. You photograph the pole and jumper from the road shoulder at a safe distance, note the GPS coordinate, and write "low-clearance jumper — ownership unclear, sag estimate visual only, recommend utility company field verify before design." You continue to the next pole. Later, the engineer thanks you: the power company confirmed the jumper was theirs and agreed to raise it before make-ready. No delay, no incident.',
            isEnd: true,
            outcome: 'success',
            outcomeLabel: 'Correct approach',
            explanation:
              'Photographing from a safe distance and flagging for design-engineer follow-up is the right call. You provided useful documentation without putting yourself or the data at risk. The engineer can coordinate with the utility company using your GPS coordinate and photos. OSHA 29 CFR 1910.268(b) and T18.L07 both prohibit approaching energized conductors without proper clearance and authorization.',
          },
          'measure-unsafe': {
            id: 'measure-unsafe',
            prompt:
              'You pull out your metal measuring tape and approach the jumper. As you extend the tape upward — stop. A metal tape near an energized conductor is a conductive path between your hand and the line. This is an approach-distance violation that could be fatal. The engineer doesn\'t need a number badly enough to justify this risk.',
            isEnd: true,
            outcome: 'failure',
            outcomeLabel: 'Unsafe approach — stop and reconsider',
            explanation:
              'A metal measuring tape is a conductor. Extending it toward an energized wire — even one that appears de-energized — is a potentially lethal approach. OSHA 29 CFR 1910.268(b) prohibits work within minimum approach distance of energized conductors without specialized PPE and utility coordination. The correct action is to photograph and flag, never to contact or approach with a conductive instrument.',
          },
          'skip-pole': {
            id: 'skip-pole',
            prompt:
              'You skip the pole and plan to come back. Two weeks later, during design, the engineer asks about pole 14 at station 1+480. Your notes have nothing. The designer can\'t determine make-ready requirements, so they assume no clearance issue. During construction, the make-ready crew finds the jumper too low for the new fiber and has to stop while the power company is called. Two-day construction delay and emergency cost overrun — both traceable to the missing field documentation.',
            isEnd: true,
            outcome: 'failure',
            outcomeLabel: 'Documentation gap creates construction delay',
            explanation:
              'Skipping a condition of note during the site walk always costs more later. The design engineer can\'t account for what isn\'t documented. Even if you can\'t safely measure the jumper, you can photograph it, note the GPS coordinate, and flag it as "requires utility field verify." That\'s enough for the designer to proceed safely. The missed note becomes a construction delay and cost overrun.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T04.L01 Check — The Site Walk"
        mode="multiple-choice"
        questions={[
          {
            id: 'T04-L01-Q1',
            type: 'mc',
            prompt:
              'During a site walk, you spot a manhole cover in an active traffic lane that needs to be opened for a visual inspection. What is the correct procedure?',
            choices: [
              'Open it quickly between traffic gaps and take a photo; replace the cover before traffic returns',
              'Schedule a flagging team and proper temporary traffic control (TTC) before opening; check if a confined-space entry permit is required',
              'Mark it on the map and tell the construction crew to deal with it',
              'Pry it open with your survey stake to see if there\'s existing conduit — it only takes a minute',
            ],
            answerIndex: 1,
            explanation:
              'Opening a manhole in an active traffic lane without TTC violates MUTCD Part 6. Additionally, any confined-space entry (even a visual inspection from above) may require atmospheric testing under 29 CFR 1910.146 if the space has potential for hazardous atmosphere. The correct approach is to set up proper TTC first, then assess confined-space requirements before opening.',
            citation: '29 CFR 1910.146(b); MUTCD 11th Edition (2023) Part 6.',
          },
          {
            id: 'T04-L01-Q2',
            type: 'mc',
            prompt:
              'What is the primary purpose of a photo log during a site walk?',
            choices: [
              'To generate social media content for the project team',
              'To create a GPS-stamped, systematically organized photographic record that lets the design engineer review field conditions without returning to the site',
              'To document worker safety compliance for OSHA audits',
              'To satisfy the camera-equipment line item in the project budget',
            ],
            answerIndex: 1,
            explanation:
              'The photo log is a field-to-office communication tool. The design engineer uses it to understand existing conditions — pole arrangement, terrain, hazards, utilities — without making a separate field trip. GPS tagging anchors each photo to a map coordinate. Systematic naming (station prefix + description) allows retrieval months later during permitting or construction.',
          },
          {
            id: 'T04-L01-Q3',
            type: 'fill-in-blank',
            prompt:
              'The skill of spotting physical, electrical, chemical, and environmental dangers along a proposed route before work begins is called ____.',
            answer: 'hazard identification',
            answerDisplay: 'hazard identification',
            explanation:
              'Hazard identification during the site walk protects both the survey crew and future construction crews. Hazards documented in the field notes inform the design engineer, the construction foreman, and the safety pre-job briefing for the crew that eventually builds the route.',
          },
          {
            id: 'T04-L01-Q4',
            type: 'mc',
            prompt:
              'You see a pole leaning noticeably off-plumb during your site walk. What is the correct site-walk action?',
            choices: [
              'Climb the pole to assess the top attachment condition',
              'Flag it in your notes as "leaning — structural evaluation needed before make-ready or climbing" and photograph it; do not climb or work near it',
              'Push on the pole base to estimate how loose it is, then photograph it',
              'Note it as a low priority and continue without documentation since you\'re not doing make-ready today',
            ],
            answerIndex: 1,
            explanation:
              'A visibly leaning pole may be compromised at the base (rot, vehicle strike, soil erosion). Climbing or working near a structurally suspect pole without a formal evaluation is a fall hazard. The site-walk action is to document and flag — the pole owner\'s structural evaluation happens before any make-ready or climbing work is scheduled.',
            citation: '29 CFR 1910.268(g)(1) — fall protection at poles; RUS Bulletin 1751F-630 § 7.',
          },
        ]}
      />

    </LessonLayout>
  );
}
