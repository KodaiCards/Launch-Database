// T15.L02 — Fault Locate with OTDR
// Standards: FOA Fiber Optic Reference Guide; IEC 61300-3-35; Bellcore SR-4731 (.sor format)
// Net-new lesson

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';

export const meta = {
  id: 'T15.L02',
  course_id: 'T15',
  title: 'Fault Locate with OTDR',
  order: 2,
  lesson_type: 'technical',
  prerequisites: ['T15.L01'],
  learning_objectives: [
    'Explain how the OTDR uses IOR and pulse travel time to calculate cable distance to a fault',
    'Identify four distinct break signatures on an OTDR trace and name the probable cause of each',
    'Distinguish event dead zone (EDZ) from attenuation dead zone (ADZ) and explain how each affects fault locate accuracy',
    'Describe the slack factor conversion from cable distance to route survey distance',
    'Identify the correct IOR setting procedure before a fault-locate trace',
    'Explain the significance of an ORL change event without loss',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'fault locate (cable-distance)',
    'event dead zone (EDZ)',
    'attenuation dead zone (ADZ)',
    'slack factor',
    'break signature',
    'ORL change (no-loss event)',
    'cable identification (multi-conduit)',
    '.sor file format',
  ],
  key_terms: [
    {
      term: 'fault locate (cable-distance)',
      definition:
        'The process of using an OTDR to determine the distance along the cable to the location of a fiber break, splice loss, or other event. The OTDR measures the round-trip travel time of a light pulse and uses the fiber\'s index of refraction to calculate distance. Important: cable distance is NOT the same as route survey distance — real cable has slack, sag, and bends that add 0.5–5% to the measured cable length.',
    },
    {
      term: 'event dead zone (EDZ)',
      definition:
        'The minimum distance between two separate events on an OTDR trace that allows the OTDR to distinguish them as separate events. If a connector and a fusion splice are separated by less than the EDZ, the OTDR may show them as a single event. EDZ depends on OTDR pulse width: at 2.5 ns pulse width, EDZ is typically 0.8–2 m; at longer pulse widths (for long-distance traces), EDZ grows to 5–15 m. Short-pulse mode has better event resolution but less range.',
    },
    {
      term: 'attenuation dead zone (ADZ)',
      definition:
        'The distance after a reflection event (connector, break) before the OTDR can make accurate loss measurements. During the ADZ, the detector is recovering from the large reflection and cannot accurately distinguish the backscatter level. ADZ is typically 5–25 m for a mid-range OTDR, depending on pulse width and reflection magnitude. A break immediately after a splice closure (within the ADZ of the closure) may have its loss misread.',
    },
    {
      term: 'slack factor',
      definition:
        'The ratio of actual cable length to route survey distance, expressed as a percentage. Underground direct-buried cable: 0.5–1.5% slack (small margin for burial curves). Aerial cable: 2–5% slack (sag, storage coils, loops at structures). Practical use: if the OTDR shows cable distance of 5,000 ft to the fault, and the route has an estimated 3% aerial slack factor, the physical location is approximately 5,000 × 0.97 = 4,850 ft of route survey distance from the launch point.',
    },
    {
      term: 'break signature',
      definition:
        'The characteristic shape of an OTDR trace event at the location of a fiber break. Different break types produce recognizable patterns: clean cut = sharp reflection peak then signal loss; crush damage = gradual loss over 0.5–5 m without a sharp peak; macro-bend = localized loss without reflection. Identifying the break signature helps determine the likely cause and guides the repair plan.',
    },
    {
      term: 'ORL change (no-loss event)',
      definition:
        'An OTDR event that shows a reflection (optical return loss change) without a corresponding drop in backscatter level (no insertion loss). Indicates a new reflective surface — may be a field-installed connector, a fresh fracture that is still mechanically continuous, or a latent failure in progress. No-loss reflection events should be investigated even if the fiber is still passing traffic — a fracture that reflects without attenuating today may fail completely under thermal cycling or mechanical stress.',
    },
    {
      term: 'cable identification (multi-conduit)',
      definition:
        'The process of identifying which specific cable is damaged when multiple cables share a conduit or duct bank. Methods: (1) Cross-reference OTDR traces from both ends against route as-built to confirm the damaged cable by distance cross-match; (2) inject a visual fault locator (VFL) flashlight into one cable end — the illuminated cable end identifies it at the far end; (3) cable label check — armored cables have manufacturer printing on the jacket.',
    },
    {
      term: '.sor file format',
      definition:
        'The standard binary OTDR data file format (Bellcore SR-4731 / FOTP-61). Virtually all major OTDR vendors (Exfo, JDSU/Viavi, OTDR IDEAL, Fluke) can read and write .sor files. This is the archival format for OTDR traces — not a screenshot or PDF. A .sor file can be re-analyzed by any compatible OTDR viewer, allowing future comparison to detect new events or loss growth over time. T15.L09 requires archiving .sor files, not screenshots, after restoration.',
    },
  ],
  vocabulary_assumed: [
    { term: 'OTDR trace (event table)', source_lesson_id: 'T12.L08' },
    { term: 'IOR (index of refraction)', source_lesson_id: 'T02.L01' },
    { term: 'return loss (RL)', source_lesson_id: 'T11.L12' },
    { term: 'insertion loss', source_lesson_id: 'T12.L06' },
    { term: 'fusion splice', source_lesson_id: 'T11.L04' },
    { term: 'outage bridge call', source_lesson_id: 'T15.L01' },
    { term: 'mobilization', source_lesson_id: 'T15.L01' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T15L02FaultLocateOTDR() {
  const faultDistanceWorked = {
    title: 'OTDR Fault Distance Calculation',
    description:
      'The OTDR calculates the distance to a fault using the speed of light and the fiber\'s index of refraction. Here\'s the math the OTDR performs internally — and why getting the IOR right matters.',
    formula: 'Distance = (c / IOR) × (t_return / 2)',
    variables: [
      {
        symbol: 'Distance',
        name: 'Distance to fault',
        unit: 'meters',
        description: 'The cable distance from the OTDR launch point to the event being measured.',
      },
      {
        symbol: 'c',
        name: 'Speed of light in vacuum',
        unit: '0.2998 meters per nanosecond (m/ns)',
        description: 'Constant: 2.998 × 10⁸ m/s = 0.2998 m/ns. Light in fiber travels slower than this by a factor of IOR.',
      },
      {
        symbol: 'IOR',
        name: 'Index of Refraction',
        unit: 'dimensionless (typically 1.4680–1.4700 for G.652.D)',
        description:
          'How much the fiber slows light down compared to a vacuum. G.652.D at 1550 nm: approximately 1.4682 (verify from your specific fiber manufacturer\'s specification sheet). Dividing c by IOR gives the actual propagation velocity in the fiber. An IOR error of 0.001 causes ~0.07% distance error — about 3.7 ft per mile.',
      },
      {
        symbol: 't_return',
        name: 'Round-trip travel time',
        unit: 'nanoseconds (ns)',
        description:
          'The time for the OTDR\'s light pulse to travel from the launch point to the event AND return. Dividing by 2 gives the one-way travel time. Read from the OTDR\'s event table.',
      },
    ],
    steps: [
      {
        step: 1,
        description: 'Confirm IOR setting on OTDR',
        math: 'IOR = 1.4682 (G.652.D, from manufacturer spec for this cable)',
        note: 'If IOR is wrong, ALL distances will be off by the same percentage. Always check IOR before a fault-locate trace.',
      },
      {
        step: 2,
        description: 'Read round-trip travel time from OTDR event table',
        math: 't_return = 115,605 ns (OTDR shows fault event at 115,605 ns round-trip)',
        note: 'The OTDR measures time internally and may already display the converted distance — this is the math it used.',
      },
      {
        step: 3,
        description: 'Calculate propagation velocity in fiber',
        math: 'v_fiber = c / IOR = 0.2998 m/ns ÷ 1.4682 = 0.2042 m/ns',
        note: 'Light travels at 0.2042 m/ns inside this fiber — about 68% of free-space speed.',
      },
      {
        step: 4,
        description: 'Calculate cable distance to fault',
        math: 'Distance = v_fiber × (t_return / 2) = 0.2042 m/ns × (115,605 ns / 2) = 0.2042 × 57,803 = 11,803 m',
        note: 'Equivalently: Distance = (c / IOR) × (t_return / 2) = (0.2998 / 1.4682) × 57,803 = 11,803 m.',
      },
      {
        step: 5,
        description: 'Apply the slack factor to estimate route survey distance',
        math: 'Route distance ≈ 11,803 m × (1 − 0.03) = 11,803 × 0.97 = 11,449 m ≈ 7.11 miles',
        note: 'This aerial route has estimated 3% slack factor. The physical break is approximately 7.11 miles of route survey distance from the OTDR launch point — NOT 7.33 miles. The difference (0.22 miles = ~1,164 ft) is the extra cable from sag, storage coils, and pole loops.',
      },
    ],
    sanityCheck:
      'The OTDR says the fault is at 11.8 km (7.33 miles) of cable. After applying 3% aerial slack factor, the physical location is approximately 7.1 miles of road distance from the launch point. If your route map shows a reported vehicle strike at mile marker 7.1, this confirms your locate. If the reported strike is at mile 9, you may have a second unreported event or a wrong slack-factor estimate.',
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'An OTDR trace shows a sharp reflection peak followed immediately by a complete loss of backscatter signal. This break signature indicates:',
      type: 'multiple-choice',
      options: [
        'Macro-bend: cable kinked against a structure',
        'Clean cut or mechanical damage with a flat fiber end-face exposed',
        'Crush damage from a heavy vehicle',
        'Water contamination in a splice closure',
      ],
      correct: 1,
      explanation:
        'A sharp reflection peak followed by signal loss (no more backscatter) = clean cut or mechanical shear that left a fresh, relatively flat fiber end face. The flat end face acts as a partial mirror, producing the reflection peak. After the cut, no fiber continues — so no more backscatter. Crush damage shows gradual loss over 0.5–5 m. Macro-bend shows loss without a reflection. Water contamination shows scatter without a distinct event.',
    },
    {
      id: 'q2',
      question: 'An OTDR is set to IOR = 1.4600 but the installed fiber\'s actual IOR is 1.4682. A fault located at 10,000 ft of cable distance per the OTDR display is actually:',
      type: 'multiple-choice',
      options: [
        'Exactly 10,000 ft — IOR only affects dispersion, not distance',
        'Slightly FARTHER than 10,000 ft because higher actual IOR means light travels slower',
        'Exactly the same — OTDR compensates for IOR automatically',
        'Slightly CLOSER than 10,000 ft because lower set IOR means the OTDR underestimates distance',
      ],
      correct: 3,
      explanation:
        'The OTDR converts round-trip travel time to distance using: d = (c / IOR) × (t_return / 2). The OTDR uses IOR = 1.4600 (set) to compute displayed distance. Actual distance uses IOR_actual = 1.4682. Ratio: d_actual / d_displayed = IOR_set / IOR_actual = 1.4600 / 1.4682 = 0.9944. So d_actual = 10,000 × 0.9944 = 9,944 ft. The fault is ~56 ft CLOSER than the OTDR shows. Why? Higher actual IOR means light actually travels SLOWER in the fiber than the OTDR assumed — so the same round-trip time represents a shorter physical distance. The OTDR overestimated how far the pulse traveled per unit time. Field implication: when the OTDR IOR is set too LOW (assumes faster propagation than reality), it will show the fault slightly farther away than it actually is — dig a little closer than the OTDR says.',
    },
    {
      id: 'q3',
      question: 'Two cables share a duct bank and both are physically intact except one. The damaged cable has no visible label. The fastest way to identify which cable is damaged is:',
      type: 'multiple-choice',
      options: [
        'Use a multimeter to measure conductor continuity — the damaged cable will show open circuit',
        'OTDR trace from both ends and cross-match the distance to confirm which cable shows the fault event',
        'Cut both cables and re-splice them — the broken one will be obvious',
        'The damaged cable is always the one on top in the duct bank',
      ],
      correct: 1,
      explanation:
        'OTDR from both ends cross-match: if Cable A shows a fault event at 3,200 ft from the east end and 7,800 ft from the west end (total = 11,000 ft route length ✓), that\'s the damaged cable. Cable B would show clean trace from both ends. Fiber optic cables have no "conductor continuity" to measure with a multimeter. Cutting both cables creates a second outage.',
    },
    {
      id: 'q4',
      question: 'An OTDR trace shows a reflection event at 4,200 ft with no measurable insertion loss. Traffic is still passing. The correct action is:',
      type: 'multiple-choice',
      options: [
        'Ignore it — no loss means no problem',
        'Log it as an ORL change event, note the date and location, and schedule an investigation to determine the cause (field connector, fracture, etc.)',
        'Immediately reroute all traffic because a no-loss reflection is always a precursor to complete failure',
        'Call the OTDR manufacturer — this is an instrument error',
      ],
      correct: 1,
      explanation:
        'A no-loss reflection event means a new reflective surface exists that wasn\'t there before. It could be a fresh field connector, or it could be a fiber fracture that\'s still mechanically continuous (latent failure). Latent fractures can fail completely under thermal cycling or mechanical stress. Log it, note the location, and plan an investigation. Immediate reroute is usually not warranted unless the customer SLA requires proactive action on any anomaly.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When fiber breaks, the OTDR is your first diagnostic tool. You connect it to one end
          of the cable, fire a light pulse, and it tells you: "there's an event at 7.3 miles."
          But there's a catch — the "7.3 miles" the OTDR reports is cable distance, not route
          distance. Real cable has sag, loops, and storage coils that make it longer than the
          straight-line distance on your map.
        </p>
        <p>
          This lesson teaches you how the OTDR calculates distance, how to interpret different
          break signatures, and how to convert from OTDR cable distance to physical field location.
        </p>

        <h3>How the OTDR Knows Where the Break Is</h3>
        <p>
          The OTDR fires a very short pulse of light into the fiber. That pulse travels down the
          cable at the speed of light — slowed down slightly by the glass (the IOR, or Index of
          Refraction). When the pulse hits a break, connector, or splice, some of the light
          bounces back toward the OTDR. The OTDR measures how long the round trip took and
          uses that time to calculate distance.
        </p>
        <p>
          Analogy: radar. A radar pulse travels at the speed of light to a target, bounces back,
          and the radar calculates "target is X miles away" from the round-trip time. OTDR is
          radar for fiber.
        </p>
        <p>
          <strong>The critical setting: IOR.</strong> If the OTDR's IOR setting doesn't match
          the actual IOR of the installed fiber, every distance reading is wrong by a percentage.
          On a 5-mile route, an IOR error of 0.008 causes approximately 230 ft of locate error —
          enough to dig up the wrong spot. Always verify the IOR setting against the cable
          manufacturer's specification before running a fault-locate trace.
        </p>
      </section>

      {/* ── WORKED EXAMPLE ─────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Fault Distance: The Math</h2>
        <WorkedExample example={faultDistanceWorked} />
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Break Signatures: What the Trace Tells You</h2>
        <p>
          Different types of damage produce recognizable OTDR trace shapes. Learning to read
          these shapes speeds up your field response — you know what you're going to find before
          you start digging.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Break Type</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>OTDR Trace Shape</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px' }}>Probable Cause</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Clean cut</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Sharp reflection peak → complete signal loss</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Mechanical shear (backhoe cut, vehicle strike), vandalism</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Crush damage</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Gradual loss over 0.5–5 m, no sharp reflection peak</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Rock puncture, heavy vehicle over shallow burial, conduit collapse</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Macro-bend</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Localized loss without reflection</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Cable kinked against vault edge, rebar, pole hardware</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>ORL change</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>New reflection without loss (backscatter level unchanged)</td>
              <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>Field-installed connector, latent fracture (still continuous)</td>
            </tr>
          </tbody>
        </table>

        <h3>Dead Zones: Why the OTDR Can't See Everything</h3>
        <p>
          The OTDR has two types of "dead zones" — distances near a reflection event where its
          accuracy is compromised:
        </p>
        <p>
          <strong>Event Dead Zone (EDZ):</strong> After a reflection event, the OTDR can't
          distinguish a second event until it's at least EDZ distance away. Short-pulse mode:
          EDZ ≈ 0.8–2 m. Long-pulse mode (for long routes): EDZ ≈ 5–15 m. Practical impact:
          if a break happens 1 m after a splice closure, the OTDR may show the break as part of
          the closure event rather than a separate event.
        </p>
        <p>
          <strong>Attenuation Dead Zone (ADZ):</strong> The OTDR's detector needs 5–25 m to
          recover from the large reflection before it can make accurate loss measurements. During
          the ADZ, loss readings are unreliable. Practical impact: a break at the connector at
          the far end of a splice closure may have its loss UNDER-read if it falls within the
          ADZ of the closure's connector reflection.
        </p>
        <p>
          <strong>Field practice:</strong> when a fault event is close to a splice closure,
          trace from both ends of the route. The end where the fault is FARTHER from the closure
          will give better accuracy because it's outside the dead zones.
        </p>
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Multi-Conduit Cable Identification</h2>
        <p>
          A common field delay: multiple cables share a conduit or duct bank, the OTDR confirms
          a fault at 4,200 ft, but you can't tell which cable is damaged because they look
          identical and labels have worn off.
        </p>
        <p>
          The systematic identification procedure:
        </p>
        <ol>
          <li>
            <strong>OTDR cross-match from both ends:</strong> Trace from the east end — fault at
            4,200 ft. Trace from the west end — fault at 6,800 ft. Route total = 11,000 ft ✓.
            Cable A shows this pattern. Cable B traces clean from both ends. Cable A is damaged.
          </li>
          <li>
            <strong>Visual fault locator (VFL) injection:</strong> Inject a 650 nm visible red
            light into one cable end. The intact cable will glow red at the far end (and at any
            macro-bend). The damaged cable will glow at the break location and have diminished
            output at the far end. Works for multi-mode fiber at short distances; less reliable
            for SM fiber over long distances.
          </li>
          <li>
            <strong>Cable label check:</strong> Look for manufacturer printing on the jacket at
            an accessible access point. If the conduit has a fiber schedule or as-built attached
            to the end, match position in conduit to the cable schedule.
          </li>
        </ol>
      </section>

      {/* ── FLASHCARDS ─────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Key Terms</h2>
        {meta.key_terms.map(({ term, definition }) => (
          <Flashcard key={term} term={term} definition={definition} />
        ))}
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
