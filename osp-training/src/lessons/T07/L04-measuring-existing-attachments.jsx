// T07.L04 — Measuring Existing Attachments
// Working lesson: laser vs. tape technique, NESC Rule 232 field check, make-ready flag
// Sources: NESC C2-2023 Rule 232 [confirm edition], OSHA 1910.268(g)(1), RUS Bulletin 1751F-630 §7

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L04',
  course_id: 'T07',
  title: 'Measuring Existing Attachments',
  order: 4,
  lesson_type: 'working',
  prerequisites: ['T07.L01', 'T07.L02', 'T07.L03'],
  learning_objectives: [
    'Measure attachment height accurately using a laser distance measurer (±0.1 ft) or tape (±0.5 ft)',
    'Compare measured attachment height against the design assumption and calculate the height delta',
    'Determine whether the delta requires a make-ready flag using NESC Rule 232 clearance logic',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'attachment height measurement',
    'laser measurer',
    'Rule 232 clearance field check',
    'photo measurement log',
    'height delta',
  ],
  vocabulary_assumed: [
    { term: 'clearance', source_lesson_id: 'T01.L02' },
    { term: 'NESC Rule 232', source_lesson_id: 'T05.L01' },
    { term: 'make-ready', source_lesson_id: 'T05.L08' },
    { term: 'attachment point', source_lesson_id: 'T01.L02' },
    { term: 'measurement tolerance', source_lesson_id: 'T07.L01' },
    { term: 'call-out', source_lesson_id: 'T07.L01' },
    { term: 'field verification', source_lesson_id: 'T07.L01' },
  ],
  key_terms: [
    {
      term: 'attachment height measurement',
      definition:
        'The recorded vertical distance from the ground to a specific wire or equipment attachment on an existing utility pole. Measured by laser (±0.1 ft accuracy) or by tape extended from the ground (±0.5 ft accuracy). The measurement is compared to the design\'s assumption for that attachment to determine whether make-ready work is required.',
    },
    {
      term: 'laser measurer',
      definition:
        'A handheld device that fires a laser pulse at a target and calculates the distance from the reflected return time. When aimed at the lowest point of a wire attachment on a pole, it measures the height from the ground to the attachment without climbing. Standard models accurate to ±0.1 feet at distances up to 100 feet; use the "height mode" (trigonometric measurement) on models with that feature for best accuracy.',
    },
    {
      term: 'Rule 232 clearance field check',
      definition:
        'The process of comparing a measured attachment height against the NESC Rule 232 minimum clearance tables to determine whether the existing attachment height satisfies the code requirement. NESC Rule 232 specifies minimum vertical clearances above roadways, sidewalks, driveways, waterways, and other surfaces. A field check is performed for each existing wire when staking to verify that the new attachment can go above or below without creating a violation.',
    },
    {
      term: 'photo measurement log',
      definition:
        'A written or digital record that pairs each attachment photo with the measured heights of all wires visible in that photo. The log format: pole ID / SCID / station / date / measurement method / each wire\'s measured height from ground / delta vs. design assumption / make-ready flag (yes/no). The photo measurement log is the primary deliverable from attachment measurement during staking.',
    },
    {
      term: 'height delta',
      definition:
        'The numeric difference between the design\'s assumed attachment height and the staker\'s measured attachment height. A positive delta means the wire is higher than assumed (more clearance than expected — usually fine). A negative delta means the wire is lower than assumed (less clearance than expected — may trigger a make-ready flag). Formula: height delta = measured height − assumed height.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T07L04_MeasuringExistingAttachments() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Imagine you're buying a used car. Before you put money down, you check what's
          actually under the hood — not just what the seller says is there. Measuring
          existing pole attachments is the same idea. The design says "the existing wire
          is at 28 feet." Your job is to hold up a laser and find out if that's actually
          true.
        </p>
        <p className="mt-2">
          Why does it matter? Because the entire design was built on that assumption. If
          the wire is really at 25 feet instead of 28 feet, your new fiber might not clear
          it by the required amount. The make-ready crew needs to go move that wire up
          before the fiber crew arrives. If staking misses it, the fiber crew shows up to
          a clearance violation and work stops.
        </p>
        <p className="mt-2">
          The tool that makes this fast and accurate is a{' '}
          <strong>laser distance measurer</strong> — a handheld device that fires a laser
          at the wire, measures the reflected beam's travel time, and calculates the
          distance from you to the wire. From there it's simple geometry to get the height
          from the ground.
        </p>

        <h3 className="mt-5 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym/Term</th>
              <th className="px-3 py-2 text-left">Full name</th>
              <th className="px-3 py-2 text-left">What it means in practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC</td>
              <td className="px-3 py-2">National Electrical Safety Code</td>
              <td className="px-3 py-2">Rule 232 sets the minimum height wires must be above the ground at various surface types</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">MR</td>
              <td className="px-3 py-2">Make-Ready</td>
              <td className="px-3 py-2">Work done on existing poles to create space and clearance for new attachments before the fiber crew arrives</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Laser vs. tape — choosing your measurement tool</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Method</th>
              <th className="px-3 py-2 text-left">Accuracy</th>
              <th className="px-3 py-2 text-left">When to use</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Laser measurer (distance mode)</td>
              <td className="px-3 py-2">±0.1 feet</td>
              <td className="px-3 py-2">Clear line of sight to wire; most situations; no climbing required</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Laser measurer (height/trig mode)</td>
              <td className="px-3 py-2">±0.2 feet</td>
              <td className="px-3 py-2">Wire directly above or at an angle; uses angle + distance to calculate height</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Fiberglass tape measure, extended</td>
              <td className="px-3 py-2">±0.5 feet</td>
              <td className="px-3 py-2">Dense foliage blocking laser; very low attachment (&lt;10 ft) where tape is easier</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2">Visual estimate only</td>
              <td className="px-3 py-2">±2–5 feet</td>
              <td className="px-3 py-2">Never acceptable for staking records — estimate only if tool fails AND marked as estimate</td>
            </tr>
          </tbody>
        </table>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T07-L04"
          cards={[
            {
              id: 'T07-L04-fc-ahm',
              front: 'What is an attachment height measurement?',
              back: 'The recorded vertical distance from the ground to a specific wire or equipment attachment on an existing utility pole. Measured by laser (±0.1 ft) or tape (±0.5 ft). Compared to the design\'s assumption to determine whether make-ready work is required.',
            },
            {
              id: 'T07-L04-fc-laser',
              front: 'What is a laser measurer and why do stakers prefer it?',
              back: 'A handheld device that fires a laser pulse at a target and calculates the distance from the reflected return time. When aimed at a wire attachment, it measures height from the ground without climbing. Standard models accurate to ±0.1 feet at distances up to 100 feet.',
            },
            {
              id: 'T07-L04-fc-r232',
              front: 'What is a Rule 232 clearance field check?',
              back: 'The process of comparing a measured attachment height against NESC Rule 232 minimum clearance tables to verify the existing attachment height satisfies code. Performed during staking to identify wires that are too low and will require make-ready work before new fiber can attach.',
            },
            {
              id: 'T07-L04-fc-pml',
              front: 'What is a photo measurement log?',
              back: 'A written or digital record pairing each attachment photo with measured heights of all wires visible in that photo. Format: pole ID / SCID / station / date / measurement method / each wire\'s measured height / delta vs. design assumption / make-ready flag (yes/no).',
            },
            {
              id: 'T07-L04-fc-delta',
              front: 'What is a height delta in staking?',
              back: 'The numeric difference between the design\'s assumed attachment height and the staker\'s measured attachment height. Formula: height delta = measured height − assumed height. A negative delta means the wire is lower than assumed — may trigger a make-ready flag.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Measurement Process — Step by Step</h2>

        <h3 className="mt-4 font-semibold">Before you measure: understand what you're looking for</h3>
        <p>
          On an existing joint-use pole, there may be 4–8 different wires and attachments.
          You need to measure and record:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>The top-most power wire</strong> (typically the highest attachment on the pole).
            This tells you the top of the "used zone."
          </li>
          <li>
            <strong>Every communication wire you can identify</strong> — phone, cable TV,
            existing fiber. These are typically in the lower half of the pole. Your new fiber
            will go among these.
          </li>
          <li>
            <strong>The communication space floor</strong> — the lowest communication wire.
            Your new fiber can't go below this without special coordination.
          </li>
        </ol>
        <p className="mt-2 text-sm">
          On a typical 40-foot distribution pole: power occupies the top 8–12 feet of
          working height; a required clearance zone separates power from communications;
          communications occupy the zone below that clearance. The exact clearances are
          set by NESC Rule 235 (between circuits) and Rule 232 (above ground).
        </p>

        <h3 className="mt-5 font-semibold">Using the laser measurer from the ground</h3>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>Stand 15–20 feet from the pole to get a clear angle to the wire attachment point.</li>
          <li>Set the laser to "distance mode" or "height mode" depending on your device.</li>
          <li>
            <strong>Distance mode:</strong> aim directly at the lowest point of the wire at
            its attachment to the pole (where the wire connects to the hardware). Record that
            distance. Since you're measuring at an angle, the actual height = distance × sin(angle).
            Most laser measurers with height mode do this calculation for you automatically.
          </li>
          <li>
            <strong>Height mode (trigonometric):</strong> aim at the ground at the base of
            the pole (reference point), then tilt up to the wire attachment. The device
            calculates the height using the angle between those two measurements.
          </li>
          <li>Record the result immediately in your staking notes or digital tool. Don't trust memory — write it while you're still at the pole.</li>
          <li>Take your photo right after the measurement so the photo and measurement are paired in time.</li>
        </ol>

        <h3 className="mt-5 font-semibold">The Rule 232 clearance field check</h3>
        <p>
          NESC Rule 232 sets the minimum height above ground for communication cables
          [NESC C2-2023 Rule 232 — confirm edition]. The key thresholds for communications
          wires in rural OSP work:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li><strong>Above roads (traffic lanes):</strong> 18 feet minimum</li>
          <li><strong>Above driveways, parking areas:</strong> 18 feet minimum</li>
          <li><strong>Above pedestrian areas, sidewalks:</strong> 15.5 feet minimum</li>
          <li><strong>Above agricultural land (crop-farming accessible):</strong> 18 feet minimum</li>
          <li><strong>Above other land (no equipment access):</strong> 15.5 feet minimum</li>
          <li><strong>Above water:</strong> 17.5 feet minimum for navigable waterways (verify with jurisdiction)</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          Source: NESC C2-2023 Rule 232 — clearance tables [confirm current edition against project
          jurisdiction requirements; some state utility commissions adopt modified clearance tables].
        </p>
        <p className="mt-2">
          When you measure an existing wire, compare it against the applicable Rule 232
          threshold for the surface below the span. If the existing wire is BELOW the
          Rule 232 minimum, it was already in violation — that's a call-out on its own
          (not caused by you; document it as a pre-existing condition). If the existing
          wire is ABOVE the minimum but your design would push a new wire below the minimum,
          that's a make-ready flag.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — OSHA 1910.268 and Climbing Safety</p>
          <p className="text-slate-300/90">
            <strong>Book (OSHA 1910.268(g)(1)):</strong> OSHA's telecommunications standard requires
            100% fall protection for workers climbing utility poles. Any work above 4 feet off the
            ground — including attachment height measurement by climbing — triggers the fall
            protection requirement. Workers must use a fall-protection system (body harness + lanyard,
            or climbing belt properly positioned) before ascending.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Experienced RUS stakers default to ground-level laser measurement
            for all routine attachment height measurements, eliminating the climb entirely. When
            ground-level line-of-sight is available and ±0.1–0.5 ft accuracy is sufficient (as it
            is for make-ready scoping and design comparison checks), the laser is both faster and
            safer than climbing. Many field crews go days without climbing a single pole during a
            staking run.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>When each applies:</strong> Climb (with full fall protection) when you need
            ±0.1 ft accuracy for legal NESC compliance documentation or when you must physically
            inspect attachment hardware condition up close. Use ground-level laser when ±0.5 ft
            accuracy is sufficient — which covers the majority of make-ready scoping and
            field-vs-design comparison work.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of confusing them:</strong> Treating ground-level laser as "optional"
            and climbing briefly without tie-off is the most common staking safety violation.
            "Just a quick check" without a harness is still a fall from height and still an
            OSHA citation — and a fall from a 30-foot pole is fatal. The laser exists precisely
            to eliminate that risk.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Multi-Wire Poles and Crowded Attachment Scenarios</h2>

        <h3 className="mt-4 font-semibold">When the pole is already full</h3>
        <p>
          Some poles in dense or established routes are "full" — every available attachment
          position is occupied, and the vertical clearances between wires are at the minimum
          allowed. Adding a new fiber requires one of three solutions:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Transfer:</strong> Move an existing wire up or down to create room for
            the new fiber. Requires make-ready work on the existing wire.
          </li>
          <li>
            <strong>Replacement:</strong> The pole is too short or structurally limited for
            any rearrangement — replace with a taller pole and reset all attachments.
          </li>
          <li>
            <strong>Force pole:</strong> The pole owner refuses to allow attachment, or the
            structural load is at capacity — a new pole is added next to the existing one.
          </li>
        </ol>
        <p className="mt-2">
          Stakers don't decide which solution to use — that's the make-ready engineer's call.
          The staker's job is to document the current state so completely that the make-ready
          engineer can make that decision from the desk without a site visit.
        </p>

        <h3 className="mt-5 font-semibold">Documentation that prevents disputes</h3>
        <p>
          After make-ready work, the pole configuration changes. If your staking record doesn't
          capture the before-state precisely, there's no reference if a dispute arises ("did
          the make-ready crew damage this equipment, or was it already damaged?"). Your
          measurement log and photos are the before-state documentation.
        </p>
        <p className="mt-2">
          This is why the photo measurement log format matters: every wire's height recorded,
          every piece of equipment noted, every condition flagged — with the photo timestamp
          and GPS coordinate as the location anchor. That log is the legal baseline for
          anything that changes after you walked that pole.
        </p>
      </section>

      {/* ── ANNOTATED DIAGRAM ───────────────────────────────────────────── */}
      <AnnotatedDiagram
        title="Laser vs. Tape — Measurement Techniques at a Pole"
        description="Click any labeled point to understand the measurement method shown and when to use it. The diagram shows a staker measuring attachment heights on an existing joint-use pole."
        src="/training/diagrams/t07-laser-vs-tape-technique.svg"
        alt="Diagram showing a utility pole with a staker at ground level using a laser measurer aimed at a wire attachment, with tape measure reference shown alongside"
        aspectRatio={1.5}
        hotPoints={[
          {
            id: 'laser-aim',
            x: 30,
            y: 55,
            label: 'Laser aim point',
            type: 'click',
            explanation:
              'The laser is aimed at the lowest point of the wire attachment hardware on the pole — the bolt or clamp where the wire connects. This is the critical measurement point. Aim at the conductor itself if the hardware is obscured by leaves or equipment. Record to ±0.1 feet.',
          },
          {
            id: 'laser-device',
            x: 20,
            y: 75,
            label: 'Laser measurer position',
            type: 'click',
            explanation:
              'Stand 15–20 feet from the pole, at a clear angle to the target wire. In "height mode," the device measures the angle and distance simultaneously to compute vertical height. In "distance mode," record the slant distance and angle, then calculate: height = distance × sin(angle). Most modern measurers (Leica Disto, Bosch GLM series) do the trigonometry automatically.',
          },
          {
            id: 'tape-reference',
            x: 65,
            y: 70,
            label: 'Tape measure use case',
            type: 'click',
            explanation:
              'A tape measure extended vertically from the ground can reach low attachments (under 15 feet) more quickly than a laser in some conditions — especially if the laser line-of-sight is blocked by dense foliage. A fiberglass (non-conductive) tape is required near energized equipment. Tape accuracy is ±0.5 feet when pulled taut; less accurate if the tape bends.',
          },
          {
            id: 'wire-label',
            x: 60,
            y: 35,
            label: 'Wire identification',
            type: 'click',
            explanation:
              'Identify each wire type before measuring. Power wires are typically at the top of the pole, thicker, and may have insulators. Communication wires are below the separation zone — typically thinner, in a bundle or on a strand. Each wire gets its own measurement and entry in the photo measurement log.',
          },
          {
            id: 'ground-reference',
            x: 50,
            y: 92,
            label: 'Ground reference point',
            type: 'click',
            explanation:
              'The measurement reference is the ground directly at the base of the pole — not sloped terrain 10 feet away. If the ground slopes significantly, record the height from the lowest point of the ground in the span (usually the midpoint between poles for a wire crossing), since NESC clearance is measured at the lowest sag point, not at the pole.',
          },
        ]}
      />

      {/* ── WORKED EXAMPLE ──────────────────────────────────────────────── */}
      <WorkedExample
        title="Attachment Height Check — Does This Need Make-Ready?"
        description="Walk through a complete field measurement scenario: measuring an existing wire, comparing to the design assumption, and deciding whether a make-ready flag is needed."
        variables={[
          { symbol: 'H_meas', label: 'Measured attachment height', value: 27.0, unit: 'ft', description: 'Laser measurement of the existing communication wire at the attachment clamp on the pole' },
          { symbol: 'H_design', label: 'Design assumed attachment height', value: 30.0, unit: 'ft', description: 'The design assumed the existing communication wire was at 30 feet before staking began' },
          { symbol: 'H_new', label: 'Proposed new fiber attachment height', value: 25.5, unit: 'ft', description: 'The design places your new fiber 4.5 feet below the existing communication wire' },
          { symbol: 'Sep_min', label: 'Minimum separation (NESC Rule 235, comm-to-comm)', value: 1.0, unit: 'ft', description: 'NESC Rule 235 requires at least 12 inches (1.0 ft) between communication wires on the same pole [confirm current NESC C2 edition Rule 235]' },
          { symbol: 'Clr_min', label: 'Minimum clearance above road (NESC Rule 232)', value: 18.0, unit: 'ft', description: 'This span crosses a public road — minimum height is 18 feet [NESC C2-2023 Rule 232, confirm edition]' },
        ]}
        steps={[
          {
            label: 'Step 1 — Calculate the height delta',
            formula: 'height delta = H_meas − H_design',
            substitution: 'height delta = 27.0 − 30.0',
            result: 'height delta = −3.0 ft',
            explanation: 'The existing wire is 3 feet LOWER than the design assumed. Negative delta = wire is lower than expected. This is the key finding.',
          },
          {
            label: 'Step 2 — Recalculate where the new fiber would actually go',
            formula: 'H_new_actual = H_meas − 4.5 (design offset below existing)',
            substitution: 'H_new_actual = 27.0 − 4.5',
            result: 'H_new_actual = 22.5 ft',
            explanation: 'The design places new fiber 4.5 feet below the existing wire. But the existing wire is at 27 ft, not 30 ft. So new fiber would be at 22.5 ft, not 25.5 ft as designed.',
          },
          {
            label: 'Step 3 — Check separation from existing wire',
            formula: 'actual separation = H_meas − H_new_actual',
            substitution: 'actual separation = 27.0 − 22.5',
            result: 'actual separation = 4.5 ft',
            explanation: '4.5 ft separation between the existing wire and the new fiber. Minimum required is 1.0 ft (12 inches) per NESC Rule 235 [confirm current edition]. 4.5 ft >> 1.0 ft. Separation is NOT a problem.',
          },
          {
            label: 'Step 4 — Check clearance above road',
            formula: 'road clearance = H_new_actual (assuming new fiber is the lowest wire)',
            substitution: 'road clearance = 22.5 ft',
            result: 'road clearance = 22.5 ft',
            explanation: '22.5 ft above the road. Minimum required by NESC Rule 232 is 18.0 ft. 22.5 ft >> 18.0 ft. Road clearance is fine.',
          },
          {
            label: 'Step 5 — Issue the staking note',
            formula: 'make-ready flag needed? YES if delta causes clearance or separation violation',
            substitution: 'Separation check: OK. Road clearance check: OK. But design must be updated.',
            result: 'No make-ready flag — but call-out required',
            explanation: 'The new fiber clears all requirements even with the wire 3 feet lower than assumed. No make-ready work is needed. BUT the design must be updated to show the existing wire at 27 ft (not 30 ft) and the new fiber at 22.5 ft (not 25.5 ft). Issue a call-out: "Existing comm wire at 27.0 ft, design assumed 30.0 ft, delta −3.0 ft. New fiber height recalculated to 22.5 ft. All clearances pass at revised heights. Design update required."',
          },
        ]}
        sanityCheck="22.5 feet of new fiber height is over 4 feet above the 18-foot road clearance minimum — well within code. The 3-foot measurement discrepancy is significant but doesn't create a violation. Still needs a design update so construction crews work from the correct heights."
      />

      {/* ── PER-LESSON QUIZ ─────────────────────────────────────────────── */}
      <Quiz
        title="T07.L04 Check — Measuring Existing Attachments"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L04-Q1',
            type: 'mc',
            prompt:
              'A staker measures an existing communication wire at 24.5 feet. The design assumed it was at 27.0 feet. What is the height delta?',
            choices: [
              '+2.5 feet (wire is higher than assumed)',
              '−2.5 feet (wire is lower than assumed)',
              '+24.5 feet',
              '−27.0 feet',
            ],
            answerIndex: 1,
            explanation:
              'Height delta = measured height − assumed height = 24.5 − 27.0 = −2.5 feet. The negative sign means the wire is 2.5 feet LOWER than the design assumed. This may trigger a make-ready flag depending on whether it creates a clearance or separation violation.',
          },
          {
            id: 'T07-L04-Q2',
            type: 'mc',
            prompt:
              'Why do most experienced stakers prefer laser measurers over tape measures for attachment height measurements?',
            choices: [
              'Laser measurers are required by OSHA 1910.268 for all measurements above 10 feet',
              'Laser measurers provide ±0.1 ft accuracy without climbing, vs. ±0.5 ft for tape and requiring no climbing',
              'Tape measures cannot measure above 15 feet',
              'Laser measurers automatically upload data to RUS Form 740',
            ],
            answerIndex: 1,
            explanation:
              'Laser measurers provide ±0.1 ft accuracy from the ground — better than tape (±0.5 ft) — and eliminate the need to climb for measurements. Climbing introduces fall risk (OSHA 1910.268(g)(1) requires fall protection above 10 feet) and takes significantly more time. The laser is both more accurate and safer for most measurements.',
          },
          {
            id: 'T07-L04-Q3',
            type: 'mc',
            prompt:
              'NESC Rule 232 requires a minimum height of 18 feet above a public road for communication cables. A staker measures the existing cable at 16.8 feet above a county road. What should the staker do?',
            choices: [
              'Nothing — staking only records what\'s there, not whether it\'s in violation',
              'Issue a call-out documenting the pre-existing violation and note it as a clearance hazard — do not flag as a new make-ready item unless the new fiber would also be at that height',
              'Immediately contact the pole owner to demand the wire be raised before staking continues',
              'Proceed and plan to raise the wire as part of the new fiber\'s make-ready process',
            ],
            answerIndex: 1,
            explanation:
              'A pre-existing clearance violation (wire below NESC Rule 232 minimum) should be documented as a call-out with the specific height and the applicable standard. It\'s NOT the staker\'s project that created the violation — but it IS the staker\'s job to document it. The call-out flags it for the engineer and client to determine responsibility and remediation.',
            citation: 'NESC C2-2023 Rule 232 [confirm current edition].',
          },
          {
            id: 'T07-L04-Q4',
            type: 'fill-in-blank',
            prompt:
              'The written or digital record that pairs each attachment photo with the measured heights of all wires visible in that photo is called the photo ____ log.',
            answer: 'measurement',
            answerDisplay: 'measurement',
            explanation:
              'The photo measurement log documents: pole ID, SCID, station, date, measurement method, each wire\'s measured height from ground, delta vs. design assumption, and make-ready flag (yes/no). This log is the primary deliverable from the attachment measurement phase of staking.',
          },
          {
            id: 'T07-L04-Q5',
            type: 'mc',
            prompt:
              'An existing communication wire is measured at 19.0 feet above a public road. The design plans to attach new fiber at 16.0 feet (3 feet below the existing comm wire). NESC Rule 232 requires 18 feet minimum above the road. Does this require a make-ready flag?',
            choices: [
              'No — the existing wire is above 18 feet, so no violation exists',
              'Yes — the proposed new fiber at 16.0 feet would be below the 18-foot Rule 232 minimum',
              'No — the 3-foot separation between the existing wire and the new fiber satisfies NESC Rule 235',
              'Only if the pole owner agrees that make-ready is required',
            ],
            answerIndex: 1,
            explanation:
              'The proposed new fiber would be at 16.0 feet above the road — 2 feet below the NESC Rule 232 minimum of 18 feet. This is a clearance violation. A make-ready flag is required. The make-ready crew needs to raise the existing communication wire (and possibly others) to create room for the new fiber to attach above 18 feet.',
            citation: 'NESC C2-2023 Rule 232 — minimum clearances above roads [confirm current edition].',
          },
        ]}
      />

    </LessonLayout>
  );
}
