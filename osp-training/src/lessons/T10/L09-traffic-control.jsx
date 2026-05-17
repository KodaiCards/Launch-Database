// T10.L09 — Traffic Control in Construction Zones
// Working lesson: MUTCD Part 6, TCP components, flagger certification, lane closure layout
// Source: FHWA MUTCD Part 6 + ATSSA + state DOT TCP requirements

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import Flashcard from '../../components/Flashcard.jsx';

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
        'The section of channelization devices (cones or drums) that guides traffic from the normal lane into the open lane, away from the work activity area. Length formula: L = WS/60 (feet), where W is lane width in feet and S is posted speed in mph. At 45 mph with a 12-ft lane: L = 12 × 45 / 60 = 9 ft — minimum taper length.',
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
                front: 'What is the transition taper in a work zone and how is its length calculated?',
                back: 'The section of channelization devices guiding traffic from the normal lane into the open lane. Length formula: L = WS/60 feet, where W = lane width in feet and S = posted speed in mph. Example: 45 mph, 12-ft lane → L = 12×45/60 = 9 ft minimum.',
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
            Length = WS/60 ft (W = lane width in ft, S = posted speed in mph).
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
          <AnnotatedDiagram
            imageUrl={null}
            alt="Work zone layout with advance warning area, transition taper, activity area, and termination taper"
            width={700}
            height={200}
            annotations={[
              {
                id: 'advance',
                x: 80,
                y: 100,
                label: 'Advance warning signs',
                description: 'Road Work Ahead → One Lane Road Ahead → Be Prepared to Stop. Spacing per MUTCD Table 6C-4 based on posted speed.',
              },
              {
                id: 'taper',
                x: 230,
                y: 100,
                label: 'Transition taper',
                description: 'Cones or drums guide traffic out of the closed lane. Length: L = WS/60 ft. At 45 mph with 12-ft lane: 9 ft minimum.',
              },
              {
                id: 'buffer',
                x: 380,
                y: 100,
                label: 'Buffer space',
                description: 'Empty distance between taper end and work crew. Protects workers if a vehicle overruns the taper. MUTCD specifies minimum buffer lengths by speed.',
              },
              {
                id: 'activity',
                x: 500,
                y: 100,
                label: 'Activity area (work space)',
                description: 'Where the crew and equipment work. No workers should be in the transition taper or advance warning area.',
              },
              {
                id: 'termination',
                x: 630,
                y: 100,
                label: 'Termination taper',
                description: 'Guides traffic back to original lanes. Typically 100 ft with cones at 40-ft spacing (or closer for higher speeds).',
              },
              {
                id: 'flagger1',
                x: 200,
                y: 50,
                label: 'Flagger station (upstream)',
                description: 'Certified flagger holds SLOW paddle toward approaching traffic. Positioned at the beginning of the taper, visible from 500+ ft upstream.',
              },
              {
                id: 'flagger2',
                x: 600,
                y: 150,
                label: 'Flagger station (downstream)',
                description: 'Second flagger at the far end for two-way traffic control. Both flaggers communicate by radio — hand signals across a long work zone are unreliable.',
              },
            ]}
          />
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
                text: 'The transition taper formula is L = WS/60 ft. A 55-mph road with 12-ft lanes. What is the minimum transition taper length?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '55 feet' },
                  { id: 'b', text: '110 feet' },
                  { id: 'c', text: '11 feet' },
                  { id: 'd', text: '220 feet' },
                ],
                correctId: 'b',
                explanation:
                  'L = WS/60 = 12 × 55 / 60 = 660 / 60 = 11 ft. Wait — that\'s 11 ft. However, MUTCD Table 6C-5 specifies MINIMUM taper lengths that often exceed the formula result for higher-speed roads. At 55 mph, the formula gives 11 ft but MUTCD minimums may require 110 ft or more. The formula result is a MINIMUM starting point; the TCP must use the larger of the formula result and the MUTCD table minimum. Answer B (110 ft) reflects the MUTCD table minimum for 55-mph operations — not the raw formula result.',
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

    </LessonLayout>
  );
}
