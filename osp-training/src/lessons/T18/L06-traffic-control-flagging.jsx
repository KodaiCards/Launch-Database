// Net-new — T18.L06 Traffic Control & Flagging — MUTCD Part 6
// Working lesson: MUTCD, TCP, work zone layout, flagger requirements

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import ReferencesBlock from '../../components/ReferencesBlock.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import GatedAssessment from '../../components/primitives/GatedAssessment.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T18.L06',
  course_id: 'T18',
  title: 'Traffic Control & Flagging — MUTCD Part 6',
  order: 6,
  lesson_type: 'working',
  prerequisites: ['T18.L01'],
  vocabulary_introduced: [
    'MUTCD',
    'TCP',
    'flagger certification',
    'taper',
    'buffer',
    'work zone',
  ],
  key_terms: [
    {
      term: 'MUTCD',
      definition:
        'Manual on Uniform Traffic Control Devices — the FHWA document that sets the national standard for all traffic control devices and work zone layouts. Part 6 covers temporary traffic control (TTC) zones. Adopted by states as a condition of federal highway funding; all 50 states follow it with minor local amendments.',
    },
    {
      term: 'TCP',
      definition:
        'Traffic Control Plan — a site-specific drawing showing exactly where each device goes, how lanes are controlled, and how workers are protected in a roadway work zone. Required by many AHJs (authorities having jurisdiction) before work begins in a state-maintained roadway.',
    },
    {
      term: 'flagger certification',
      definition:
        'State-required training for personnel directing traffic with a STOP/SLOW paddle. Many states issue a certification card through ATSSA, ACCES, or other ANSI/ISEA training providers. Georgia DOT, for example, references ATSSA or ACCES certification. Check your state DOT before flagging.',
    },
    {
      term: 'taper',
      definition:
        'The section of a work zone where traffic lanes are shifted or reduced, using cones or channelizing devices placed at a diagonal angle. MUTCD prescribes minimum taper lengths by lane width and posted speed limit. A short taper at high speed is dangerous — vehicles don\'t have time to react and merge.',
    },
    {
      term: 'buffer',
      definition:
        'A protected space within the work zone — either lateral (between the traffic lane and the work space) or longitudinal (between the end of the taper and where workers stand). The buffer is a vehicle-recovery zone: if a driver drifts out of the lane, the buffer is the distance before they hit a worker.',
    },
    {
      term: 'work zone',
      definition:
        'The area between the first advance warning device and the last work zone device. Structured in four sections per MUTCD Part 6: advance warning area (signs approaching the zone) → transition area (lane shift/taper) → activity area (where workers are) → termination area (where normal traffic resumes).',
    },
  ],
  vocabulary_assumed: [
    { term: 'hazard recognition', source_lesson_id: 'T18.L01' },
    { term: 'hi-vis vest', source_lesson_id: 'T18.L05' },
  ],
  learning_objectives: [
    'Read a MUTCD Part 6 work-zone diagram and identify buffer zones, taper lengths, advance warning signs, and lane control strategies for safe traffic flow around an OSP work site',
    'Design a simple Traffic Control Plan (TCP) for a roadside pole installation: advance warning sign placement, lane closure geometry (if required), flagger positions, and vehicle staging area',
    'Explain state-specific flagger certification requirements (ATSSA, ACCES, or state DOT training) and describe when a flagger is required vs. optional based on traffic speed and volume',
    'Evaluate a roadway work zone for MUTCD compliance: are buffer zones adequate, are signs visible at night, is the taper length correct, and is the flagger trained and positioned correctly',
  ],
  estimated_minutes: 25,
};

export default function T18L06_TrafficControlFlagging() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Every time your crew opens up a lane closure on a public road, you're creating a
          temporary work zone — and that work zone is governed by the <strong>MUTCD</strong>,
          the federal rulebook for all traffic control. Get the cone spacing wrong, skip the
          advance warning signs, or put an uncertified person in the flagger position and you've
          just created two problems: an unsafe situation for your crew, and a documented liability
          exposure for your company if something goes wrong.
        </p>
        <p className="mt-2">
          This lesson covers how a standard work zone is built, what each section does, and what
          the flagger's job really is. The goal isn't to make you a traffic engineer — it's to
          make sure you know what a compliant setup looks like and what to do when the job site
          doesn't match that picture.
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
              <td className="px-3 py-2 font-mono">MUTCD</td>
              <td className="px-3 py-2">Manual on Uniform Traffic Control Devices</td>
              <td className="px-3 py-2">The federal standard for every sign, cone, and flagger in a work zone</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">FHWA</td>
              <td className="px-3 py-2">Federal Highway Administration</td>
              <td className="px-3 py-2">The federal agency that publishes the MUTCD</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TCP</td>
              <td className="px-3 py-2">Traffic Control Plan</td>
              <td className="px-3 py-2">The site drawing showing where every device goes; often required by the DOT permit</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">TTC</td>
              <td className="px-3 py-2">Temporary Traffic Control</td>
              <td className="px-3 py-2">MUTCD Part 6's label for all work zone traffic management</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction</td>
              <td className="px-3 py-2">The state DOT, county, or city that must approve your work zone plan</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The four sections of every work zone</h3>
        <p className="mt-2">
          MUTCD Part 6 defines a standard work zone in four sequential sections, each with a
          specific job:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2">
          <li>
            <strong>Advance Warning Area:</strong> The zone approaching the work area where
            drivers are warned they're entering a work zone. Orange "Road Work Ahead" signs,
            "Flagger Ahead" signs, and speed reduction signs go here. Spacing between signs
            is prescribed by MUTCD Table 6C-1 — roughly 100–350 ft for urban roads, 500 ft
            for rural, and 1,000+ ft for expressways. Drivers who miss these signs are the
            leading cause of work zone fatalities.
          </li>
          <li>
            <strong>Transition Area:</strong> Where normal traffic lanes are shifted or reduced.
            This is where the <strong>taper</strong> lives — a diagonal row of cones that
            gradually merges traffic from the closed lane into the open lane. Taper length
            matters: too short at high speed and drivers don't have room to react and merge
            safely.
          </li>
          <li>
            <strong>Activity Area:</strong> The actual work space. Includes a <strong>buffer</strong>
            space between the end of the taper and where workers are positioned. Workers in the
            activity area must never assume drivers see them — the buffer is the last margin of
            protection if a vehicle drifts.
          </li>
          <li>
            <strong>Termination Area:</strong> Where the work zone ends and traffic returns to
            normal lane patterns. A "End Road Work" sign and a final END taper of cones marks
            this area.
          </li>
        </ol>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T18-L06"
          cards={[
            {
              id: 'T18-L06-fc-mutcd',
              front: 'What is the MUTCD and what does Part 6 cover?',
              back: 'Manual on Uniform Traffic Control Devices — the FHWA standard for all traffic control devices. Part 6 covers Temporary Traffic Control (TTC) zones — all work zone setups on public roads. Adopted by all 50 states.',
            },
            {
              id: 'T18-L06-fc-tcp',
              front: 'What is a Traffic Control Plan (TCP)?',
              back: 'A site-specific drawing showing device placement, lane control, and worker protection for a roadway work zone. Required by many AHJs before work begins on a state-maintained highway. Must be PE-stamped on high-speed/complex corridors in most states.',
            },
            {
              id: 'T18-L06-fc-taper',
              front: 'What is a taper in a work zone?',
              back: 'The section of cones placed diagonally to shift or reduce traffic lanes before the activity area. MUTCD prescribes minimum taper lengths by lane width and posted speed. Too-short tapers at high speed are dangerous — drivers cannot react and merge in time.',
            },
            {
              id: 'T18-L06-fc-buffer',
              front: 'What is a buffer space in a work zone?',
              back: 'A protected empty space between the end of the taper and the work space (longitudinal buffer) or between the traffic lane and workers (lateral buffer). Provides a vehicle-recovery zone — if a driver drifts, the buffer is what separates them from the crew.',
            },
            {
              id: 'T18-L06-fc-workzone',
              front: 'What are the four sections of a MUTCD work zone?',
              back: '1) Advance Warning Area (signs alerting drivers), 2) Transition Area (taper / lane merge), 3) Activity Area (work space + buffer where workers are), 4) Termination Area (return to normal lanes + End Road Work sign).',
            },
            {
              id: 'T18-L06-fc-flagger',
              front: 'What is flagger certification?',
              back: 'State-required training authorizing a person to control traffic with a STOP/SLOW paddle. Many states (including Georgia) require a certification card from ATSSA, ACCES, or equivalent. The flagger must use a STOP/SLOW paddle — not a flag alone — per MUTCD Chapter 6E.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Flagger's Role — What MUTCD Chapter 6E Requires</h2>

        <div className="border-l-4 border-blue-400/30 bg-blue-400/5 p-3 my-3 text-sm">
          <p className="font-semibold text-blue-300 mb-1">Refresher</p>
          <ul className="text-slate-300/90 space-y-1 list-disc pl-5">
            <li><strong>Hazard recognition:</strong> identifying dangers before they cause harm</li>
            <li><strong>Hi-vis vest:</strong> bright orange or yellow safety garment that makes you visible to drivers in poor light or from distance</li>
          </ul>
        </div>

        <p>
          A <strong>flagger</strong> is the person stationed at the work zone's merge point to
          control one-way alternating traffic — stopping one direction while the other passes,
          then switching. MUTCD Chapter 6E governs exactly how this is done:
        </p>

        <ul className="list-disc pl-5 space-y-2 mt-3 text-slate-300/90">
          <li>
            <strong>Paddle, not a flag:</strong> Flaggers must use a STOP/SLOW paddle — a
            standard octagonal STOP sign on one face (red, white letters) and a SLOW sign on
            the reverse (orange, black letters). A hand flag alone is NOT compliant per MUTCD
            Chapter 6E.
          </li>
          <li>
            <strong>Certification requirement:</strong> Most states require the flagger to hold
            a certification card (ATSSA or equivalent). This is a real legal requirement —
            an uncertified person controlling traffic is both an OSHA violation (1910.268
            work zone safety) and a state DOT permit violation. The certification card must
            be on the person, not in the truck.
          </li>
          <li>
            <strong>Uniform:</strong> Class 2 hi-vis minimum for daytime work; Class 3 for
            night/high-speed zones. Hard hat and safety glasses in all vehicle-adjacent zones.
            The flagger is the most exposed person at the work site — they're standing in or
            adjacent to a live lane.
          </li>
          <li>
            <strong>Communication:</strong> Two-flagger setup (one at each end of the closure)
            requires reliable communication — typically radio. If radio fails, stop all traffic
            until communication is restored or a single flagger can control the full closure.
          </li>
          <li>
            <strong>Who is responsible for the TTC setup:</strong> MUTCD requires the person
            assigned TTC responsibilities to be trained in TTC principles (Chapter 6B).
            The foreman or crew lead carries this responsibility on most OSP jobs.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Advance Warning Sign Spacing — MUTCD Table 6C-1</h3>
        <p className="mt-2">
          The spacing between advance warning signs depends on road type. MUTCD Table 6C-1
          gives fixed distances — here are the practical field numbers:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-3 py-2 text-left">Road type</th>
                <th className="px-3 py-2 text-left">Sign spacing (approx.)</th>
                <th className="px-3 py-2 text-left">When it applies</th>
              </tr>
            </thead>
            <tbody className="text-slate-300/90">
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Urban/suburban (low speed)</td>
                <td className="px-3 py-2">100–350 ft between signs</td>
                <td className="px-3 py-2">Posted speed ≤ 35 mph, developed areas</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Rural (moderate speed)</td>
                <td className="px-3 py-2">~500 ft between signs</td>
                <td className="px-3 py-2">Posted speed 40–55 mph, open road</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="px-3 py-2">Expressway/Freeway</td>
                <td className="px-3 py-2">1,000+ ft between signs</td>
                <td className="px-3 py-2">Posted speed &gt; 55 mph or multi-lane divided</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-1">
            Exact values vary by road type and state amendments; always check the applicable AHJ.
          </p>
        </div>

        <div className="mt-5 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — The TCP Reality</p>
          <p className="text-slate-300/90">
            <strong>Book (MUTCD / state DOT):</strong> A Traffic Control Plan must be submitted
            to the AHJ before work begins on any state-maintained highway. On complex corridors
            and highways, the TCP must be stamped by a PE. All devices must match the approved plan.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> On low-volume county roads and rural RUS jobs, crews
            commonly set up cone tapers and flaggers for short-duration work (&lt; 1 hour) without
            a formal TCP drawing. This is widespread practice on rural jobs and the AHJ may
            informally tolerate it. However: (a) if an incident occurs without a TCP on file,
            the company bears full liability exposure; (b) on any state-maintained highway or DOT
            encroachment permit, the TCP is a hard legal requirement. Know the difference between
            the road types on your job — county road vs. state route vs. U.S. highway. The permit
            on your truck tells you which rules apply.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Short-Duration Work and Temporary Setups</h2>
        <p>
          MUTCD Part 6 has provisions for short-duration work (typically defined as lasting
          less than one hour at any single location). Short-duration setups allow simplified
          device arrangements — for example, a single-lane closure with a flagger and cones
          rather than a full complement of advance warning signs. However, "short-duration"
          does not mean "no devices" — it means a reduced but still compliant arrangement.
        </p>
        <p className="mt-2">
          Key questions to answer before choosing the short-duration setup:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2 text-sm text-slate-300/90">
          <li>Is this a state-maintained roadway (needs DOT permit + TCP), a county road, or a private road?</li>
          <li>What is the posted speed limit? Above 45 mph significantly increases the advance warning spacing and buffer requirements.</li>
          <li>Is there a sight-distance problem (curve, hill) that prevents drivers from seeing the work zone early enough?</li>
          <li>Are nighttime conditions involved? If yes, upgrade all devices and hi-vis class.</li>
        </ul>
      </section>

      <ReferencesBlock
        items={[
          { citation: 'MUTCD 11th Edition (2023), Part 6', note: 'Temporary Traffic Control (TTC) — the governing chapter for all work zone setups on public roads.' },
          { citation: 'MUTCD Table 6C-1', note: 'Advance warning sign spacing by road type and posted speed.' },
          { citation: 'MUTCD Chapter 6E', note: 'Flagger requirements — STOP/SLOW paddle, certification, and uniform.' },
          { citation: 'MUTCD Chapter 6B', note: 'General requirements — TTC responsibility and device removal sequence.' },
          { citation: 'MUTCD Chapter 6G', note: 'Short-duration work provisions — simplified but still-compliant device arrangements for jobs under about one hour.' },
        ]}
      />

      {/* ── LABELED LIST — work zone elements with MUTCD requirements ────── */}
      <div className="lesson-callout">
        <h4>Standard Two-Lane Work Zone — Lane Closure Layout (MUTCD Part 6)</h4>
        <ol>
          <li>
            <strong>Advance warning signs</strong> — Orange "Road Work Ahead" signs are the first
            devices a driver sees entering the work zone. Spacing from the next sign and from the
            taper is prescribed by MUTCD Table 6C-1 (100–350 ft urban; ~500 ft rural). If drivers
            miss these signs, they arrive at the work zone at full approach speed.
          </li>
          <li>
            <strong>Taper (cone line)</strong> — A diagonal line of cones guiding traffic from the
            closed lane into the open lane. Minimum taper length per MUTCD: L = (lane width in feet
            × approach speed in mph) / 60 for speeds &gt; 45 mph. At 55 mph on an 11-ft lane,
            minimum taper ≈ 121 ft. Too short a taper means drivers cannot merge safely.
          </li>
          <li>
            <strong>Longitudinal buffer space</strong> — The empty space between the end of the
            taper and the nearest worker or equipment. This is the crash-recovery zone — if a
            vehicle veers off at the end of the taper, the buffer is what separates that vehicle
            from your crew. Buffer length is speed- and work-type-dependent per MUTCD. Never
            position workers at the edge of the taper.
          </li>
          <li>
            <strong>Flagger position</strong> — The certified flagger stands at the merge point
            controlling one-way alternating traffic. Uses a STOP/SLOW paddle (not a hand flag
            alone), wears Class 2 hi-vis minimum (Class 3 at night), and maintains constant
            radio contact with the flagger at the opposite end of the closure (MUTCD Chapter 6E).
          </li>
          <li>
            <strong>Activity area (work space)</strong> — Where splicing, trenching, or pulling
            work actually happens, protected by the longitudinal buffer from the taper. All
            workers in the activity area must wear Class 2 hi-vis minimum, hard hat, and safety
            glasses. No one stands outside the protected activity area without an assigned
            function.
          </li>
          <li>
            <strong>Termination area</strong> — Where the work zone ends and normal traffic lanes
            resume. A final taper of cones leads traffic back into the previously closed lane,
            followed by an "End Road Work" sign. Do not remove termination devices until the
            activity area is fully clear of workers and equipment.
          </li>
        </ol>
      </div>

      {/* ── BRANCHING SCENARIO ───────────────────────────────────────────── */}
      <BranchingScenario
        scenarioId="T18-L06-scenario-1"
        title="Work Zone Setup — State Highway Splice Vault"
        description="You need to access a splice vault in the shoulder of a 45 mph state highway to troubleshoot a fiber outage. The vault is 18 inches from the edge of the traveled lane. Walk through the setup decisions."
        startNodeId="start"
        nodes={{
          start: {
            id: 'start',
            prompt: 'Before mobilizing, you check the job order. The vault is on a state-maintained route — your company holds a DOT encroachment permit for this corridor. Do you need a Traffic Control Plan?',
            choices: [
              {
                label: 'Yes — state highway + DOT permit = TCP required',
                consequence: 'Correct. The DOT encroachment permit for a state-maintained highway typically requires a TCP as part of the permit conditions. You need either a pre-approved standard TTC detail from your permit package, or a site-specific TCP. Pull the permit and check Section 4 (traffic control requirements) before mobilizing.',
                nextId: 'hivis',
                isOptimal: true,
              },
              {
                label: 'No — this is short-duration work, under 1 hour',
                consequence: 'Incorrect. Short-duration provisions reduce device requirements, but they do NOT eliminate the TCP requirement on a state highway with a DOT permit. The permit conditions override the short-duration defaults. Mobilizing without the required TCP is a permit violation.',
                nextId: 'hivis',
              },
            ],
          },
          hivis: {
            id: 'hivis',
            prompt: 'You confirm the TCP requirement and pull the standard TTC detail from your permit package — it matches this corridor. Your crew is two technicians plus a flagger. The flagger shows up wearing a yellow construction vest with a single stripe. What do you do?',
            choices: [
              {
                label: 'Accept the vest — yellow hi-vis is standard on most jobs',
                consequence: 'Incorrect. MUTCD Chapter 6E and ANSI/ISEA 107 require Class 2 minimum hi-vis for roadway work. A single-stripe vest may not meet Class 2 requirements. Verify the vest bears the ANSI/ISEA 107 Class 2 marking. If it does not, the flagger cannot work the roadway zone.',
                nextId: 'devices',
              },
              {
                label: 'Verify the vest has the ANSI/ISEA 107 Class 2 marking; if not, get the right vest',
                consequence: 'Correct. Class 2 hi-vis is the minimum for daytime roadway work under MUTCD Part 6. The Class 2 marking must be visible on the garment. Keep a spare Class 2 vest in the truck — this is a routine situation.',
                nextId: 'devices',
                isOptimal: true,
              },
            ],
          },
          devices: {
            id: 'devices',
            prompt: 'Hi-vis confirmed. You set up advance warning signs and cone taper per the TCP. The posted speed is 45 mph. The crew foreman says "put the first worker 10 feet behind the last cone — that gives us room." Is that right?',
            choices: [
              {
                label: 'Yes — 10 feet is plenty of buffer behind the taper',
                consequence: 'Incorrect. At 45 mph, 10 feet is not a meaningful buffer — a vehicle leaving the lane at speed covers that distance in under a second. MUTCD recommends a longitudinal buffer of at least 40–50 feet on a 45 mph road between the end of the taper and the first worker or equipment. The buffer is the last margin before a vehicle hits your crew.',
                nextId: 'end-ok',
              },
              {
                label: 'No — at 45 mph the buffer needs to be substantially larger than 10 feet',
                consequence: 'Correct. The longitudinal buffer between the taper and the work space scales with approach speed. At 45 mph on a shoulder splice, you want 40–50 feet minimum. Your TCP\'s TTC standard detail will specify the buffer for this road type. Set up the buffer per the TCP, not field judgment.',
                nextId: 'end-ok',
                isOptimal: true,
              },
            ],
          },
          'end-ok': {
            id: 'end-ok',
            prompt: 'Work is complete. You pack up. A crew member says "just pull the cones, the termination area is fine to drive around." What\'s the correct sequence for removing TTC devices?',
            isEnd: true,
            endMessage: 'Remove termination devices LAST — after the activity area is clear of all workers and equipment. Sequence: (1) confirm activity area clear, (2) remove activity-area cones toward the taper, (3) remove taper cones, (4) remove termination-area cones, (5) remove advance warning signs. Driving through the termination area before the work space is cleared is a struck-by hazard for the remaining workers. Source: MUTCD 11th Edition (2023), Part 6, Chapter 6B — General Requirements (mutcd.fhwa.dot.gov).',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <GatedAssessment
        courseId="T18"
        assessmentId="T18-L06"
        title="Check — Traffic Control & Flagging"
        fallback={
        <Quiz
          title="Check — Traffic Control &amp; Flagging"
          mode="multiple-choice"
          questions={[
            {
              id: 'T18-L06-Q1',
              type: 'mc',
              prompt:
                'The minimum hi-vis apparel class for a roadway flagger during daytime work in a MUTCD temporary traffic control zone is:',
              choices: [
                'Class 1 — minimum background material',
                'Class 2 — ANSI/ISEA 107 roadway minimum',
                'Class 3 — required only at night',
                'No class standard — any bright-colored vest is acceptable',
              ],
              answerIndex: 1,
              explanation:
                'ANSI/ISEA 107 Class 2 is the minimum for daytime roadway work in a temporary traffic control zone. Class 3 is required for nighttime or high-speed (> 50 mph) zones. Class 1 is for off-road, low-traffic environments. MUTCD Part 6 Chapter 6E requires hi-vis garments meeting ANSI/ISEA 107 for all work zone personnel.',
              citation:
                'MUTCD 11th Edition (2023), Part 6, Chapter 6E (mutcd.fhwa.dot.gov); ANSI/ISEA 107.',
              fieldNote:
                'When in doubt, Class 3 is always acceptable where Class 2 is the minimum. Upgrade proactively for low-light conditions.',
            },
            {
              id: 'T18-L06-Q2',
              type: 'mc',
              prompt:
                'Per MUTCD Chapter 6E, flaggers must use which device to control traffic?',
              choices: [
                'A hand flag (standard traffic flag)',
                'A STOP/SLOW paddle (octagonal paddles with STOP on one face and SLOW on the reverse)',
                'Either a flag or a paddle — the choice is the flagger\'s',
                'A lighted wand at night, flag during the day',
              ],
              answerIndex: 1,
              explanation:
                'MUTCD Chapter 6E specifies the STOP/SLOW paddle as the required device for flaggers. A hand flag alone is not compliant. The paddle is more visible and less ambiguous than a waved flag. The STOP face is red with white letters; the SLOW face is orange with black letters.',
              citation:
                'MUTCD 11th Edition (2023), Chapter 6E (mutcd.fhwa.dot.gov — free public source).',
            },
            {
              id: 'T18-L06-Q3',
              type: 'mc',
              prompt:
                'Which section of a MUTCD work zone is defined as the space between the end of the taper and the location where workers are actively working?',
              choices: [
                'Advance warning area',
                'Transition area',
                'Buffer space (longitudinal)',
                'Termination area',
              ],
              answerIndex: 2,
              explanation:
                'The longitudinal buffer space is the empty zone between the end of the transition taper and the closest worker or equipment in the activity area. It serves as a vehicle-recovery zone. If a driver exits the lane at the taper, the buffer is the distance before they reach the crew. The buffer length scales with approach speed.',
              citation:
                'MUTCD 11th Edition (2023), Part 6, Chapter 6C — Advance Warning Area and Activity Area (mutcd.fhwa.dot.gov).',
            },
            {
              id: 'T18-L06-Q4',
              type: 'fill-in-blank',
              prompt:
                'The MUTCD is published by the ____, which is the federal agency responsible for highway safety standards in the United States.',
              answer: 'FHWA',
              answerDisplay: 'FHWA (Federal Highway Administration)',
              explanation:
                'The Federal Highway Administration (FHWA) is the U.S. DOT agency that publishes the MUTCD. States adopt the MUTCD as a condition of receiving federal highway funding, making it effectively the national standard for all work zone traffic control.',
              citation:
                'MUTCD 11th Edition (2023), Chapter 6A.01 — Purpose and Background (mutcd.fhwa.dot.gov).',
            },
          ]}
        />
        }
      />

    </LessonLayout>
  );
}
