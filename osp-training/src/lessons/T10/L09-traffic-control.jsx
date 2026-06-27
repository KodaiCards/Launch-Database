// T10.L09 — Traffic Control in Construction Zones
// Working lesson: MUTCD Part 6, TCP components, flagger certification, lane closure layout
// Source: FHWA MUTCD Part 6 + ATSSA + state DOT TCP requirements

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';

export const meta = {
  id: 'T10.L09',
  course_id: 'T10',
  title: 'Traffic Control in Construction Zones',
  order: 9,
  lesson_type: 'working',
  prerequisites: ['T10.L01', 'T09.L06', 'T18.L06'],
  learning_objectives: [
    'Explain the MUTCD Part 6 framework for temporary traffic control',
    'Identify the four components of a work-zone layout: advance warning area, transition taper, activity area, termination taper',
    'State flagger certification requirements and the typical training programs (ATSSA or state equivalent)',
    'Distinguish a standard MUTCD diagram from a site-specific TCP and explain why state DOTs require the latter for lane closures on primary roads',
    'Describe what happens when a contractor mobilizes with only a MUTCD diagram and no PE-stamped TCP for a state highway work zone',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'TCP',
    'flagger station',
    'lane closure',
    'MUTCD Part 6',
    'channelization device',
    'advance warning area',
    'transition taper',
  ],
  key_terms: [
    {
      term: 'TCP',
      definition:
        'Traffic Control Plan — a site-specific document specifying the work-zone signage, channelization device placement, flagger station locations, and advance warning distances for a construction project. Required by most state DOTs for any lane closure on a primary or secondary road. Distinct from MUTCD example diagrams — a TCP is tailored to the specific job site, route geometry, and permit conditions.',
    },
    {
      term: 'flagger station',
      definition:
        'The designated location where a certified flagging crew member controls traffic through a one-lane work zone. The flagger directs traffic alternately from each direction using a STOP/SLOW paddle (or flag in emergency-only situations). Position and spacing from the activity area are defined in the TCP per MUTCD Part 6 minimums.',
    },
    {
      term: 'lane closure',
      definition:
        'The partial or full blocking of a roadway lane to create a protected work zone. Requires a TCP, channelization devices (cones, drums, or barriers), flagger stations (or traffic signals for longer closures), and advance warning signs. In most state ROW, requires a permit and a PE-stamped TCP for primary roads.',
    },
    {
      term: 'MUTCD Part 6',
      definition:
        'The Federal Highway Administration\'s Manual on Uniform Traffic Control Devices, Part 6 — Temporary Traffic Control. Defines device types, sign spacing, flagger procedures (§6E), and typical application diagrams (§6H). Sets minimum national standards for work-zone traffic control. State DOTs may adopt MUTCD standards or apply more stringent state-specific requirements.',
    },
    {
      term: 'channelization device',
      definition:
        'Physical devices that guide traffic through or around a work zone. Common types: traffic cones (temporary, lightweight), drums (higher visibility, more stable than cones), and concrete barrier (Jersey barrier — provides crash protection for long-duration or high-speed closures). Selection based on speed, duration, and traffic volume per MUTCD Part 6.',
    },
    {
      term: 'advance warning area',
      definition:
        'The zone of work-zone signage positioned upstream of the transition taper to give drivers time to perceive and react to the upcoming work zone. Sign spacing is speed-dependent: 85 mph road requires signs farther apart than 35 mph road. MUTCD Table 6C-4 provides advance warning distances by posted speed.',
    },
    {
      term: 'transition taper',
      definition:
        'The section of channelization devices (cones or drums) that guides traffic from the normal lane into the open lane. MUTCD 2009 Table 6C-3 defines two taper formulas by type and speed. MERGE TAPER (lane closure — traffic must move over entirely): L = WS feet when S > 45 mph; L = WS/60 feet when S ≤ 45 mph. SHIFT TAPER (parallel offset — traffic stays moving in the same lane): L = WS/60 feet for all speeds. W = lane width in feet, S = posted or 85th-percentile speed in mph, L = taper length in feet. Example: lane closure on 55-mph road, 12-ft lane — merge formula L = 12 × 55 = 660 ft. The merge taper formula applies to any lane closure. Always use the larger of the formula result and the MUTCD Table 6C-5 minimum for that speed.',
    },
  ],
  vocabulary_assumed: [
    { term: 'MUTCD', source_lesson_id: 'T18.L06' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L06' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'Call-811', source_lesson_id: 'T10.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

export default function T10L09_TrafficControl() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          The moment your crew's equipment or materials extend into a public roadway, you have
          a legal obligation to protect both your workers and the public from traffic. That
          means signs, cones, and flaggers — set up in the right order, in the right positions,
          with certified personnel managing the flow.
        </p>
        <p className="mt-2">
          The federal standard for how to do this is MUTCD Part 6. But here's what trips up
          a lot of contractors: MUTCD provides example diagrams (called "typical application
          diagrams") to show what a work zone should look like in generic situations. Those
          diagrams are starting points, not ready-to-use plans. State DOTs require a
          site-specific Traffic Control Plan — often stamped by a licensed PE or traffic
          engineer — for any lane closure on a primary or secondary road. Show up with a
          photocopied MUTCD diagram and no stamped TCP, and the DOT inspector will shut you
          down before the first cone goes out.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L09"
            cards={[
              {
                id: 'T10-L09-fc-tcp',
                front: 'What is a Traffic Control Plan (TCP) and how does it differ from a MUTCD diagram?',
                back: 'A TCP is a site-specific document specifying work-zone signage, channelization, flagger positions, and advance warning for a specific job site. A MUTCD diagram is a generic example. Most state DOTs require a PE-stamped TCP for lane closures on primary roads — not just a MUTCD diagram.',
              },
              {
                id: 'T10-L09-fc-mutcd-part6',
                front: 'What does MUTCD Part 6 govern?',
                back: 'Temporary Traffic Control — the FHWA standard that defines work-zone device types, sign spacing, flagger procedures (§6E), and typical application diagrams (§6H). Sets minimum national standards; state DOTs may require additional measures.',
              },
              {
                id: 'T10-L09-fc-advance-warning',
                front: 'What is the advance warning area in a work zone?',
                back: 'The zone of signage positioned upstream of the transition taper to give drivers time to react. Sign spacing is speed-dependent per MUTCD Table 6C-4. Higher-speed roads require signs placed farther back.',
              },
              {
                id: 'T10-L09-fc-transition-taper',
                front: 'What is the transition taper in a work zone — and what are the two MUTCD taper length formulas?',
                back: 'Channelization devices guiding traffic into the open lane. MUTCD 2009 Table 6C-3 has two formulas: (1) MERGE TAPER (lane closure): L = WS when S > 45 mph; L = WS/60 when S ≤ 45 mph. (2) SHIFT TAPER (parallel offset): L = WS/60 at all speeds. W = lane width (ft), S = speed (mph). Lane closure at 55 mph, 12-ft lane: L = 12 × 55 = 660 ft. Always use the larger of the formula result and the MUTCD Table 6C-5 minimum.',
              },
              {
                id: 'T10-L09-fc-flagger',
                front: 'What certification do flaggers need and what common training programs provide it?',
                back: 'Flaggers must be trained and certified, typically through ATSSA (American Traffic Safety Services Association) or state-approved equivalents. Many states have specific certification requirements. Certification ensures the flagger understands STOP/SLOW paddle use, positioning, communication protocols, and emergency procedures.',
              },
              {
                id: 'T10-L09-fc-flagger-station',
                front: 'What is a flagger station in a work zone?',
                back: 'The designated location where a certified flagging crew member controls traffic through a one-lane work zone. The flagger uses a STOP/SLOW paddle to direct traffic alternately from each direction. Position and spacing from the activity area are defined in the TCP per MUTCD Part 6 minimums.',
              },
              {
                id: 'T10-L09-fc-lane-closure',
                front: 'What is required to establish a lane closure on a primary state road?',
                back: 'Partial or full blocking of a roadway lane to create a protected work zone. Requires a Traffic Control Plan (TCP), channelization devices (cones, drums, or barriers), flagger stations or traffic signals, and advance warning signs. On most state primary roads, also requires a permit and a PE-stamped TCP.',
              },
              {
                id: 'T10-L09-fc-channelization-device',
                front: 'What are the three common channelization device types and when is each used?',
                back: 'Traffic cones — temporary, lightweight, short-duration closures. Drums — higher visibility and more stable than cones, used for higher-speed or longer-duration work. Concrete barrier (Jersey barrier) — provides crash protection for long-duration or high-speed closures. Selection is based on speed, duration, and traffic volume per MUTCD Part 6.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Four Work-Zone Components</h2>

        <h3 className="mt-4 font-semibold">Every work zone has four sequential zones</h3>
        <p>
          Whether you're blocking a lane on a state highway or a county road, the layout
          is always the same four-zone sequence (traveling in the direction of traffic):
        </p>
        <ol className="list-decimal list-inside mt-2 space-y-2 text-slate-300">
          <li>
            <strong>Advance warning area</strong> — signs posted upstream telling drivers what's coming.
            Distance from the first sign to the start of the taper depends on posted speed
            (MUTCD Table 6C-4: at 45 mph, the first "Road Work Ahead" sign goes 500 ft upstream).
          </li>
          <li>
            <strong>Transition taper</strong> — cones or drums guiding traffic out of the closed lane.
            Merge taper length (lane closure): L = WS ft when S &gt; 45 mph; L = WS/60 ft when S ≤ 45 mph.
            Shift taper (parallel offset only): L = WS/60 ft at all speeds (per MUTCD 2009 Table 6C-3).
          </li>
          <li>
            <strong>Activity area</strong> — the actual work zone where your crew operates.
            Includes a buffer space (empty area between the taper end and the work) and the
            work space itself. Buffer protects workers if an errant vehicle overruns the taper.
          </li>
          <li>
            <strong>Termination taper</strong> — cones guiding traffic back into the original lane after the work area. Shorter than the transition taper — typically 100 ft.
          </li>
        </ol>

        {/* AnnotatedDiagram — work-zone layout */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Work-Zone Layout — One-Lane Two-Way Operation</h3>
            </div>

        <h3 className="mt-6 font-semibold">The TCP requirement — why MUTCD diagrams aren't enough</h3>
        <p>
          MUTCD §6G.02 states that work-zone traffic control should be based on an engineering
          study of the specific situation. For most state highway work, DOT encroachment permit
          conditions require that a registered traffic engineer (PE) prepare and stamp a TCP
          that shows:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li>Exact sign placement with dimensions from a fixed reference point</li>
          <li>Device type and spacing for the specific road geometry (curves, intersections, grade)</li>
          <li>Flagger station positions with sight-line verification</li>
          <li>Communications plan between flaggers</li>
          <li>Accommodation of pedestrians, cyclists, and ADA requirements</li>
          <li>Emergency access provisions</li>
        </ul>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Field reality:</strong> A contractor on a Georgia state highway job shows up with a
          MUTCD Diagram 6H-3 (single-lane two-way operation) and no PE-stamped TCP. The GDOT inspector
          arrives, asks for the TCP, sees only the photocopy, and issues a stop-work order. The crew
          demobilizes. The TCP is prepared, submitted, reviewed, and approved — 5–10 business days.
          The road closure scheduled for Tuesday becomes a road closure three weeks later. The lesson:
          get the PE-stamped TCP in hand BEFORE mobilization day, not the morning of.
        </p>

        <h3 className="mt-6 font-semibold">Flagger certification</h3>
        <p>
          Flaggers must be trained. Most states require formal certification through ATSSA
          (American Traffic Safety Services Association) or a state-approved equivalent.
          The training covers: STOP/SLOW paddle use (flags only in emergency situations —
          never routine), positioning to maximize sight distance, radio communication with
          the remote flagger, emergency protocols (what to do if a vehicle overruns the work zone).
        </p>
        <p className="mt-2">
          Minimum requirement: every flagger on site must have their wallet-sized certification
          card on their person during work hours. Inspectors check. Non-certified flaggers in
          a work zone = stop-work.
        </p>

        {/* Decision scenario */}
        <div className="mt-8">
          <BranchingScenario
            scenarioId="T10-L09-scenario-1"
            title="Work-Zone Decision: Monday Morning"
            description="It's 6 a.m. Monday. Your crew is at the staging area for conduit installation on a 55-mph state highway. You have a MUTCD Diagram 6H-3 in hand. The encroachment permit says: 'Lane closure requires a site-specific TCP prepared and sealed by a registered PE.' Your supervisor says setup starts in 30 minutes."
            startNodeId="start"
            nodes={{
              start: {
                id: 'start',
                prompt: 'You review the permit condition. The MUTCD diagram in your hand is generic — it shows the right layout type but it is NOT a PE-stamped site-specific TCP. What do you do?',
                choices: [
                  { label: 'Set up the lane closure using the MUTCD diagram', consequence: 'The diagram is generic. The permit requires a site-specific PE-stamped TCP.', nextId: 'bad-setup', isOptimal: false },
                  { label: 'Stop setup and call your project manager', consequence: 'Good — you identified the problem before committing cones to the road. The PM needs to know before the crew mobilizes.', nextId: 'call-pm', isOptimal: true },
                  { label: 'Set up and hope the inspector doesn\'t show', consequence: 'DOT inspectors are on a schedule. If they arrive, work stops and you may lose your permit.', nextId: 'bad-setup', isOptimal: false },
                ],
              },
              'bad-setup': {
                id: 'bad-setup',
                prompt: 'You start setting cones. Forty minutes in, a GDOT inspector arrives and asks for your TCP. You show the MUTCD diagram.',
                choices: [
                  { label: 'Explain that a MUTCD diagram is the federal standard', consequence: 'The inspector knows the permit condition. The federal standard is the FLOOR; the permit imposed a higher site-specific requirement.', nextId: 'stop-work', isOptimal: false },
                  { label: 'Offer to get the PE-stamped TCP submitted today', consequence: 'The inspector issues a stop-work order. You can\'t promise a TCP in hours — typical review is 5–10 business days.', nextId: 'stop-work', isOptimal: false },
                ],
              },
              'stop-work': {
                id: 'stop-work',
                prompt: 'The inspector issues a stop-work order. Your crew demobilizes. The TCP submittal, review, and approval will take 2–3 weeks.',
                isEnd: true,
                endMessage: 'A work stoppage that could have been avoided. The TCP lead time (site visit → preparation → PE seal → DOT review → approval) is 2–3 weeks. It must be in hand BEFORE mobilization day, not the morning of.',
              },
              'call-pm': {
                id: 'call-pm',
                prompt: 'The PM confirms: no PE-stamped TCP has been submitted yet. The crew cannot begin the lane closure today. What is the right next step?',
                choices: [
                  { label: 'Work in the shoulder only (no lane intrusion) while the TCP is pending', consequence: 'Shoulder-only work that doesn\'t intrude into the travel lane may be permitted under a different condition — check the permit language. This may be acceptable if the permit allows it.', nextId: 'shoulder-work', isOptimal: true },
                  { label: 'Submit the TCP today and begin the lane closure as soon as it\'s sent', consequence: 'Submission without approval is not authorization. DOT review takes 5–10 business days. You cannot begin before approval.', nextId: 'stop-work', isOptimal: false },
                ],
              },
              'shoulder-work': {
                id: 'shoulder-work',
                prompt: 'The permit allows shoulder work without a lane closure permit. The crew works in the shoulder while the PE-stamped TCP is prepared and submitted. Three weeks later, the TCP is approved.',
                isEnd: true,
                endMessage: 'Optimal outcome: no stop-work, no permit violation, and the lane closure proceeds properly three weeks later. The lesson: TCP lead time is 2–3 weeks minimum. Build it into the construction schedule at bid time, not the morning of mobilization.',
              },
            }}
          />
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L09-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'You need to close one lane of a 45-mph state highway to install conduit. Your encroachment permit requires a "site-specific TCP prepared and sealed by a Professional Engineer." You have the MUTCD Diagram 6H-3 from the handbook. Can you begin work?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Yes — MUTCD diagrams are federal standards and satisfy any state DOT requirement' },
                  { id: 'b', text: 'No — a MUTCD diagram is a generic example. The permit requires a site-specific PE-stamped TCP. You cannot legally begin lane closure without it.' },
                  { id: 'c', text: 'Yes, if the DOT inspector isn\'t present at setup' },
                  { id: 'd', text: 'Yes, if the MUTCD diagram is from the current edition' },
                ],
                correctId: 'b',
                explanation:
                  'The permit condition is unambiguous: "site-specific TCP prepared and sealed by a PE." A generic MUTCD diagram doesn\'t satisfy this. The site-specific TCP must show exact sign placement, device spacing, flagger positions, and sight-line verification for YOUR job site. Beginning work without it violates the permit and exposes the contractor to stop-work, permit revocation, and liability for any incident in the work zone.',
              },
              {
                id: 'q2',
                text: 'You need to close one lane on a 55-mph state highway (12-ft lane width). Per MUTCD 2009 Table 6C-3, what is the minimum merge taper length for this lane closure?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '11 feet (L = WS/60 = 12×55/60)' },
                  { id: 'b', text: '110 feet (shift taper table minimum)' },
                  { id: 'c', text: '660 feet (L = WS = 12×55, merge taper at S > 45 mph)' },
                  { id: 'd', text: '55 feet' },
                ],
                correctId: 'c',
                explanation:
                  'At 55 mph, this is a MERGE TAPER (lane closure — traffic must move entirely out of the closed lane). MUTCD 2009 Table 6C-3 specifies two different formulas: (1) MERGE taper when S > 45 mph: L = WS = 12 × 55 = 660 ft. (2) SHIFT taper (parallel offset): L = WS/60 at all speeds. A lane closure is a merge maneuver, not a shift. Using the shift formula (WS/60 = 11 ft) on a 55-mph lane closure is a dangerous error — an 11-ft taper at highway speed gives drivers almost no time to react and merge safely. The correct minimum is 660 ft from the formula; always also check MUTCD Table 6C-5 minimums for the speed and apply whichever is greater.',
              },
              {
                id: 'q3',
                text: 'A flagger is working a one-lane two-way operation on a county road. The certified flagger calls in sick and the crew supervisor assigns an uncertified laborer to flag in their place. Which of the following is correct?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Acceptable if the supervisor verbally coaches the laborer on STOP/SLOW paddle use' },
                  { id: 'b', text: 'Acceptable only for low-speed roads under 35 mph' },
                  { id: 'c', text: 'Not acceptable — all flaggers on site must hold valid certification; uncertified flaggers = stop-work' },
                  { id: 'd', text: 'Acceptable if work is completed within 2 hours' },
                ],
                correctId: 'c',
                explanation: 'MUTCD Part 6E and most state DOT requirements mandate that flaggers must be trained and certified. Inspectors verify certification cards on person. An uncertified flagger in a work zone is a permit violation and safety hazard. The correct action when the certified flagger calls in sick is to stop lane-closure operations until a certified replacement arrives, or to work without a lane closure if the scope permits it.',
              },
              {
                id: 'q4',
                text: 'What does the buffer space inside the activity area protect against?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: 'Workers and their equipment in case an errant vehicle overruns the transition taper' },
                  { id: 'b', text: 'The transition taper cones from being blown over by truck downdraft' },
                  { id: 'c', text: 'Sight-line obstruction between flaggers at each end of the closure' },
                  { id: 'd', text: 'Drainage and stormwater running through the work zone' },
                ],
                correctId: 'a',
                explanation: 'The buffer space is an intentionally empty gap between the end of the transition taper and the start of the actual work area. It exists to give a vehicle that overruns the taper distance to decelerate and stop before reaching workers. It is not a place to store equipment or materials — those go in the work space beyond the buffer. Buffer length is speed-dependent and specified in the TCP.',
              },
              {
                id: 'q5',
                type: 'fill-in-blank',
                text: 'On a 35-mph road with 11-ft lane width, which MUTCD 2009 Table 6C-3 merge taper formula applies — L = WS or L = WS/60?',
                answer: 'WS/60',
                explanation: 'The merge taper has two formulas: L = WS when S > 45 mph (high-speed), and L = WS/60 when S ≤ 45 mph (low-speed). At 35 mph, S ≤ 45, so L = WS/60 = (11 × 35) / 60 ≈ 6.4 ft — but always compare to the MUTCD Table 6C-5 minimum for 35 mph and use the larger value. The shift taper (parallel offset, not lane closure) uses WS/60 at all speeds.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>TCP Preparation and Worker Safety in Traffic</h2>

        <h3 className="mt-4 font-semibold">TCP preparation timeline — plan in advance</h3>
        <p>
          A PE-stamped TCP for a state highway lane closure typically requires:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300 text-sm">
          <li>Traffic engineer site visit or high-resolution aerial/Google Street View review: 1–2 days</li>
          <li>TCP preparation with CAD drawings, device schedules, and narrative: 2–3 days</li>
          <li>PE review and seal: 1 day</li>
          <li>DOT submittal and review: 5–10 business days for standard review</li>
        </ul>
        <p className="mt-2">
          Total lead time: 2–3 weeks from mobilization decision to approval. On a fast-moving
          OSP construction spread where route work is scheduled monthly, the TCP for a
          state highway segment must be submitted 3 weeks before the scheduled lane-closure day.
          TCP preparation cost is typically $500–$2,000 per lane-closure location — a line
          item in the bid estimate, not a surprise.
        </p>

        <h3 className="mt-4 font-semibold">Worker safety in traffic: the real threat</h3>
        <p>
          Work-zone fatalities are disproportionately roadway workers, not motorists.
          The primary hazard: vehicles that overrun the taper and enter the work space.
          The buffer zone between the taper end and the work crew exists entirely to provide
          reaction distance if this happens.
        </p>
        <p className="mt-2">
          Field discipline in traffic work zones: never stand in the transition taper or
          between the taper and the work space. If you need to access equipment, walk within
          the activity area only. Keep your back to traffic for the minimum necessary time.
          High-visibility vest (ANSI Class 2 minimum; Class 3 on high-speed roads) is
          mandatory at all times. See T18 for the full worker safety framework.
        </p>
      </section>


      <section className="mt-8 p-5 border-l-4 border-blue-500 bg-slate-800/40 rounded">
        <h3 className="text-blue-300 text-lg font-semibold mb-3">Tying It Together</h3>
        <p className="text-slate-200 mb-3">
          Traffic control is the intersection of regulatory compliance, safety culture, and construction
          logistics — every other T10 lesson happens inside the zone you establish here. The encroachment
          permit from T09.L06 specifies whether the work requires a PE-stamped TCP or whether a standard
          MUTCD diagram is acceptable; the cost of mobilizing with the wrong document is a work stoppage
          while the crew waits for the permit to be revised. The work-zone safety orientation from T18.L06
          (struck-by hazards, PPE requirements for flaggers, high-visibility vest standards under ANSI/ISEA 107)
          applies to every person in the lane-closure zone — flaggers are among the highest-fatality
          occupations in highway construction precisely because a TCP that looks correct on paper but
          places the flagger in a poor sight-line position still creates lethal exposure. Mastery of
          MUTCD Part 6 minimums also unlocks confidence in the daily-reporting lesson in T10.L10:
          the DFR must document the TCP in use each day, and the inspector in T10.L11 has authority
          to shut down a lane closure whose TCP does not match field conditions.
        </p>
      </section>
    </LessonLayout>
  );
}
