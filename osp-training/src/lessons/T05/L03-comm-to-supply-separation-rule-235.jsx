// Net-new (migrated from Module02 §2.3, expanded) — T05.L03 Comm-to-Supply Separation — Rule 235
// Working lesson: joint-use pole zones, safety zone measurements, at-pole vs midspan separation

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L03',
  course_id: 'T05',
  title: 'Comm-to-Supply Separation — Rule 235',
  order: 3,
  lesson_type: 'standard',
  prerequisites: ['T05.L01', 'T05.L02', 'T01.L02'],
  learning_objectives: [
    'Identify the three major zones on a joint-use distribution pole and what belongs in each zone',
    'State the approximate NESC Rule 235 communication worker safety zone distances at the pole and at midspan',
    'Explain the difference between at-pole separation and midspan separation and why midspan can be less',
    'Recognize a joint-use pole configuration that violates Rule 235 separation requirements',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'Rule 235',
    'Table 235-5',
    'communication worker safety zone',
    'neutral conductor',
    'at-pole separation',
    'midspan separation',
    'bonded messenger',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'AHJ', source_lesson_id: 'T05.L01' },
    { term: 'Rule 232', source_lesson_id: 'T05.L01' },
    { term: 'supply space', source_lesson_id: 'T01.L02' },
    { term: 'communication space', source_lesson_id: 'T01.L02' },
    { term: 'climbing space', source_lesson_id: 'T01.L02' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'span', source_lesson_id: 'T01.L02' },
    { term: 'messenger', source_lesson_id: 'T01.L03' },
  ],
  key_terms: [
    {
      term: 'Rule 235',
      definition:
        'The NESC rule that governs the required separation and clearance between communication lines and supply (power) lines on the same pole. This is the safety-zone rule that protects communication workers from accidentally contacting energized power conductors while working in the communication space.',
    },
    {
      term: 'Table 235-5',
      definition:
        'The lookup table inside NESC Rule 235 that lists the required minimum clearance between supply conductors and communication lines for each voltage class. The most common case (voltages under 8.7 kV, which covers most distribution lines) requires approximately 40 inches at the pole and approximately 30 inches at midspan, per public secondary sources.',
    },
    {
      term: 'communication worker safety zone',
      definition:
        'The zone of clear space that must exist between the lowest supply conductor (or the neutral) and the top of the communication space on a joint-use pole. This zone is what a communication crew member can stand in while working at the pole without approaching energized supply conductors. Under 8.7 kV, this zone is approximately 40 inches at the pole.',
    },
    {
      term: 'neutral conductor',
      definition:
        'The grounded conductor on a power distribution system that runs below the phase (hot) conductors. The neutral is the reference point for the safety zone measurement — communication lines must maintain their separation from the neutral, not from the phase conductors above it.',
    },
    {
      term: 'at-pole separation',
      definition:
        'The measured vertical distance from the lowest supply conductor (or neutral, whichever is lower) to the top communication attachment, measured at the pole itself. Rule 235 requires this to be approximately 40 inches for voltages under 8.7 kV (per secondary sources summarizing Table 235-5).',
    },
    {
      term: 'midspan separation',
      definition:
        'The measured vertical distance between communication and supply conductors at the midspan point between poles. Due to different sag characteristics, supply and communication conductors may have different sag amounts, which changes the gap between them at midspan. NESC Rule 235 requires the midspan separation to be approximately 30 inches (75% of at-pole) for voltages under 8.7 kV.',
    },
    {
      term: 'bonded messenger',
      definition:
        'A communication cable messenger strand that is electrically bonded (grounded) to the supply neutral at the pole. Bonding the messenger to the neutral brings the messenger to the same electrical potential as the neutral conductor, which allows a reduced separation between the bonded messenger and the neutral under certain NESC provisions. The bonding requirement and reduced separation details are AHJ- and utility-specific.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L03_CommToSupplySeparationRule235() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A typical distribution pole in a neighborhood carries two different kinds of
          wires: the electric utility's power lines at the top, and the telephone/cable TV/
          fiber cables below. These are owned by completely different companies and
          maintained by completely different crews. The power lines at the top carry enough
          voltage to kill instantly.
        </p>
        <p className="mt-2">
          <strong>Rule 235</strong> is the NESC rule that says: the communication cables
          must be far enough below the power lines that a communication crew member can
          work on the comm cables without accidentally getting close to the power lines
          above them. The required gap is called the <strong>communication worker safety
          zone</strong>.
        </p>
        <p className="mt-2">
          Think of it like a hard hat zone at a construction site — there's a boundary
          above which you don't go without special qualifications and equipment. Rule 235
          defines where that boundary is on every joint-use pole.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Acronym / Term</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">NESC Rule 235</td>
              <td className="px-3 py-2">The comm-to-supply separation rule</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">Table 235-5</td>
              <td className="px-3 py-2">The table inside Rule 235 with required separation distances by voltage class</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">kV</td>
              <td className="px-3 py-2">Kilovolts — thousands of volts. Most residential distribution lines run at 7.2 kV (phase-to-ground) or 12.5 kV (phase-to-phase), which is under 8.7 kV phase-to-ground in both cases.</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">AHJ</td>
              <td className="px-3 py-2">Authority Having Jurisdiction — the pole owner or regulator whose specific requirements apply (from T05.L01)</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">The three zones on a joint-use distribution pole</h3>
        <p className="mt-2">
          From top to bottom on a typical distribution pole, there are three zones:
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2">
          <li>
            <strong>Supply space (top)</strong> — where the electric utility's high-voltage
            phase conductors run. The neutral conductor (the grounded wire below the
            phase wires) is the lower boundary of the supply space. This zone is off-limits
            to communication crews. Full stop.
          </li>
          <li>
            <strong>Climbing space (middle)</strong> — the open corridor between supply
            and communication equipment. This must remain unobstructed so that a crew
            member can climb past it without touching equipment. The communication worker
            safety zone sits inside the climbing space, just below the neutral. About 40
            inches of clear space is required here at voltages below 8.7 kV.
          </li>
          <li>
            <strong>Communication space (bottom)</strong> — where telephone, fiber, cable TV,
            and other comm cables attach. Communication companies work here. This is the
            lowest usable zone on the pole.
          </li>
        </ol>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — The safety zone and who it protects</p>
          <p className="text-slate-300/90">
            <strong>Book (NESC Rule 235):</strong> The safety zone is a minimum structural
            clearance requirement. If the physical separation between the neutral and the top
            comm attachment meets the Rule 235 requirement, the design is compliant.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> The safety zone is about crew safety, not just
            paperwork. Communication crews (fiber, cable TV, telephone) are not electrical
            workers. They are not qualified to work near energized conductors at NESC voltage
            classes. The 40-inch zone is the buffer that keeps the comms crew from having
            to think about the power lines above them while they work.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk of violating the zone:</strong> If make-ready work on a pole
            compresses the climbing space below the required 40 inches — for example by
            adding a crossarm or riser conduit that encroaches — the pole becomes a
            violation. A joint-use inspection can result in a "pole order" requiring the
            attacher to correct the violation within a tight deadline (sometimes 30 days)
            at their own expense.
          </p>
        </div>

        <h3 className="mt-5 font-semibold">The at-pole and midspan separation requirements</h3>
        <p className="mt-2">
          Rule 235 sets two separate clearance requirements:
        </p>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Required separation (under 8.7 kV)</th>
              <th className="px-3 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2"><strong>At the pole</strong></td>
              <td className="px-3 py-2 font-semibold">≈ 40 inches</td>
              <td className="px-3 py-2">The communication worker safety zone, from neutral down to top comm attachment</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2"><strong>At midspan</strong></td>
              <td className="px-3 py-2 font-semibold">≈ 30 inches</td>
              <td className="px-3 py-2">75% of the at-pole value; conductors with different sag may come closer together midspan</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-3 p-3 border border-blue-400/20 bg-blue-400/5 rounded text-sm text-slate-300/80">
          <strong className="text-blue-300">Source note:</strong> The 40-inch at-pole and 30-inch midspan values are verified from
          two independent secondary sources: the ikeGPS "What is the Communication Worker Safety Zone?" knowledge-base article and
          the We-Energies Joint-Use Attachment Standards reference (both publicly available). Both sources cite NESC C2 Rule 235
          Table 235-5. Confirm exact values from the paid NESC C2-2023 for your design.
        </div>

        <h3 className="mt-5 font-semibold">Why midspan can be less than at-pole</h3>
        <p className="mt-2">
          At the pole, the supply and communication wires are attached at fixed heights —
          the distance between them is exactly what was designed and measured. At midspan,
          both sets of wires sag. If the supply and communication conductors have different
          weights and tensions, they sag by different amounts, which changes the gap
          between them at midspan.
        </p>
        <p className="mt-2">
          In typical distribution configurations, the supply neutral (a heavy, multi-strand
          conductor) sags more than a lashed communication cable on a tight strand, which
          means the neutral comes closer to the comm cables at midspan than at the pole.
          The 30-inch midspan requirement accounts for this effect.
        </p>
        <p className="mt-2">
          If your design has unusually long spans or unusual sag relationships, a midspan
          clearance calculation may be required (the same method as the clearance check
          in T05.L02, but applied to the gap between the neutral and the comm cable rather
          than the gap between the comm cable and the ground).
        </p>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L03"
          cards={[
            { id: 'T05-L03-fc-rule235', front: 'What does NESC Rule 235 govern and who does it protect?', back: 'Rule 235 governs the required separation between communication lines and supply (power) lines on the same joint-use pole. It protects communication workers — who are not electrical workers — from accidentally getting close to energized power conductors while working in the communication space.' },
            { id: 'T05-L03-fc-safetyzone', front: 'What is the communication worker safety zone?', back: 'The required clear space between the lowest supply conductor (typically the neutral) and the top communication attachment, measured at the pole. For voltages under 8.7 kV, this is approximately 40 inches, per secondary sources summarizing NESC C2-2023 Table 235-5.' },
            { id: 'T05-L03-fc-atpole', front: 'What is the required at-pole separation under NESC Rule 235 for distribution voltages under 8.7 kV?', back: 'Approximately 40 inches, measured vertically from the bottom of the neutral (or lowest supply conductor) down to the top communication attachment at the pole. Source: ikeGPS and We-Energies standards, both citing NESC Table 235-5.' },
            { id: 'T05-L03-fc-midspan', front: 'What is the required midspan separation under NESC Rule 235 for voltages under 8.7 kV?', back: 'Approximately 30 inches — about 75% of the at-pole requirement. The gap can be smaller at midspan because communication cables typically sag less than the heavier neutral conductor, partially closing the gap between them.' },
            { id: 'T05-L03-fc-neutral', front: 'What is the neutral conductor and why is it the reference point for Rule 235?', back: 'The neutral is the grounded conductor on a distribution system, running below the phase (hot) wires. It\'s the lower boundary of the supply space. The Rule 235 safety zone is measured from the neutral down — not from the phase wires — because the neutral is the closest supply conductor to the communication space.' },
            { id: 'T05-L03-fc-table235-5', front: 'What is Table 235-5 and what does it specify?', back: 'The lookup table inside NESC Rule 235 that lists the required minimum clearance between supply conductors and communication lines for each voltage class. The most common case (voltages under 8.7 kV, which covers most distribution lines) requires approximately 40 inches at the pole and approximately 30 inches at midspan, per public secondary sources.' },
            { id: 'T05-L03-fc-bonded-messenger', front: 'What is a bonded messenger and why does it matter for Rule 235?', back: 'A communication cable messenger strand that is electrically bonded (grounded) to the supply neutral at the pole. Bonding the messenger to the neutral brings the messenger to the same electrical potential as the neutral conductor, which allows a reduced separation between the bonded messenger and the neutral under certain NESC provisions. The bonding requirement and reduced separation details are AHJ- and utility-specific.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Reading a Joint-Use Pole Diagram</h2>

        {/* POLE ZONE BREAKDOWN */}
        <div className="lesson-callout">
          <h4>Joint-Use Distribution Pole — Zone Breakdown (Top to Bottom)</h4>
          <ol>
            <li>
              <strong>Phase conductors (supply space)</strong> — The high-voltage phase conductors at the top of the pole. On a typical 12.5 kV three-phase distribution system, each carries 7.2 kV phase-to-ground. Supply space only — communication crews must not work near these without electrical worker qualification.
            </li>
            <li>
              <strong>Neutral conductor (lower supply space boundary)</strong> — The grounded neutral runs below the phase wires. It is the lower boundary of the supply space and the reference point for the Rule 235 safety zone measurement. Everything below the neutral must be at least ≈ 40 inches clear of any communication attachment at the pole.
            </li>
            <li>
              <strong>≈ 40-inch safety zone (climbing space)</strong> — The approximately 40-inch clear zone required between the neutral and the top communication attachment at the pole, per NESC Rule 235 Table 235-5 for voltages under 8.7 kV. This is the communication worker safety zone — a crew member can safely work below this zone without approaching energized conductors.
            </li>
            <li>
              <strong>Top comm attachment (cable TV / CATV strand)</strong> — The topmost communication attachment — often cable TV or telephone strand. This attachment determines the upper boundary of the communication space. It must be at least ≈ 40 inches below the neutral at the pole.
            </li>
            <li>
              <strong>Lower comm attachment (fiber / lashed plant)</strong> — Additional communication cables stack below the top comm attachment, limited by the minimum attachment height above grade (governed by NESC) and the ground clearance requirements from T05.L02.
            </li>
          </ol>
        </div>

        <h3 className="mt-5 font-semibold">At-pole vs. midspan — the measurement that sometimes trips designers</h3>
        <p>
          Here's the scenario that catches new designers: you measure 42 inches of safety
          zone at the pole (compliant with the ≈ 40-inch requirement). But the pole owner's
          inspector comes out with a tape measure and finds only 26 inches of clearance at
          midspan. That's a violation.
        </p>
        <p className="mt-2">
          How? The neutral sagged more than the comm cable between the poles. At the pole:
          42 inches of gap. At midspan: the neutral is 8 inches lower than at the pole,
          the comm cable is 1 inch lower than at the pole. Net gap reduction: 7 inches.
          42 − 7 = 35 inches — below the 30-inch midspan requirement. Violation.
        </p>
        <p className="mt-2">
          The fix is either to lower the top comm attachment by a few inches (increasing the
          at-pole gap so there's more buffer to absorb the midspan sag differential), or to
          require the electric utility to re-sag the neutral (which they're unlikely to do
          cheaply).
        </p>

        <h3 className="mt-5 font-semibold">The bonded-messenger reduced separation</h3>
        <p>
          Under certain NESC provisions, if the communication cable's messenger strand is
          electrically bonded (grounded) to the supply neutral at the pole, a reduced
          separation may be allowed. The logic: if the messenger is at the same electrical
          potential as the neutral, touching the messenger is no more dangerous than
          touching the neutral directly (which a qualified electrical worker can do under
          controlled conditions).
        </p>
        <p className="mt-2">
          In practice, whether this reduction is permissible depends on the specific NESC
          edition adopted by your state and the pole owner's joint-use agreement. Many
          utilities don't allow it and require the full 40-inch zone regardless of bonding.
          Always verify with the pole owner's engineering department.
        </p>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Make-Ready Conflicts with Rule 235</h2>

        <h3 className="mt-4 font-semibold">How make-ready work can create Rule 235 violations</h3>
        <p>
          Most Rule 235 violations aren't original design mistakes — they accumulate over
          time as the pole gets crowded. When a new attacher adds their cable, they need
          space in the communication zone. If the safety zone is already tight (42 inches
          of at-pole clearance instead of the 40-inch minimum), adding a new
          crossarm-mounted attachment or a service drop block that encroaches on the
          climbing space can push the effective safety zone below the minimum.
        </p>
        <p className="mt-2">
          This is why a pole survey (see T04) always documents the current safety-zone
          measurement. If the measured zone is tight, the pole order for the new attachment
          may require a "rearrange" — shifting existing comm equipment down or reorganizing
          the hardware — before the new cable can be attached.
        </p>

        <h3 className="mt-5 font-semibold">Voltages above 8.7 kV — the safety zone gets bigger</h3>
        <p>
          The 40-inch / 30-inch separation applies to supply conductors under 8.7 kV phase-
          to-ground, which covers standard residential and rural distribution. Transmission
          lines and higher-voltage sub-transmission lines require larger separations — and
          in many cases, communication attachments are prohibited entirely on high-voltage
          transmission structures.
        </p>
        <p className="mt-2">
          If you ever survey a route that runs along a transmission corridor (115 kV,
          230 kV), assume the existing poles are incompatible with communication attachments.
          The project will need a separate pole line, a buried route, or an ADSS attachment
          agreement with the transmission owner (who may not grant it).
        </p>
      </section>

      {/* ── RULE 235 VIOLATION QUIZ ──────────────────────────────────────── */}
      <Quiz
        title="Identify the Rule 235 Safety-Zone Violation"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L03-HS-Q1',
            type: 'mc',
            prompt:
              'A pole inspector measures the following heights on a joint-use distribution pole (12.5 kV, under 8.7 kV phase-to-ground):\n\n- Neutral: 28 ft\n- New comm attachment (just installed): 25 ft 2 in.\n- Existing comm cable: 21 ft\n\nWhich attachment is creating a Rule 235 violation and why?',
            choices: [
              'The existing comm cable at 21 ft — it is too close to the neutral.',
              'The new comm attachment at 25 ft 2 in. — it is only 22 inches below the neutral, violating the ≈ 40-inch safety zone requirement.',
              'The neutral at 28 ft — it should be higher on the pole to create adequate separation.',
              'No violation — the new attachment and existing cable are both below the neutral.',
            ],
            answerIndex: 1,
            explanation:
              'The safety zone is measured from the neutral DOWN to the top comm attachment. Neutral at 28 ft, new attachment at 25 ft 2 in. = 2 ft 10 in. = 34 inches of separation. The required safety zone is approximately 40 inches. 34 inches < 40 inches — the new attachment is in the climbing space. The fix: lower the new attachment at least 6 more inches below the neutral, or rearrange existing cables to create adequate vertical space.',
          },
          {
            id: 'T05-L03-HS-Q2',
            type: 'mc',
            prompt:
              'An inspection finds 42 inches of safety zone at the pole. At midspan, the neutral sags 8 inches more than the comm cable. What is the actual safety zone at midspan, and is it compliant?',
            choices: [
              '42 inches — midspan sag does not affect the safety zone measurement.',
              '34 inches — NESC requires a 30-inch midspan minimum, so this is compliant.',
              '50 inches — at midspan the cables are farther apart, so the safety zone increases.',
              '34 inches — NESC requires a 40-inch midspan minimum, so this is a violation.',
            ],
            answerIndex: 1,
            explanation:
              'Midspan gap = at-pole gap (42 in.) minus the differential sag (neutral sagged 8 in. more than comm cable = 8 in. of gap reduction). 42 − 8 = 34 inches at midspan. NESC requires approximately 30 inches at midspan (vs. ≈ 40 at the pole), so 34 inches is compliant — but only barely. This is why designers target more than the minimum at-pole to leave buffer for differential sag.',
          },
        ]}
      />

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L03 Check — Comm-to-Supply Separation — Rule 235"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L03-Q1',
            type: 'mc',
            prompt:
              'The communication worker safety zone at a joint-use distribution pole (under 8.7 kV) is approximately how many inches, measured at the pole?',
            choices: [
              '12 inches',
              '24 inches',
              '40 inches',
              '60 inches',
            ],
            answerIndex: 2,
            explanation:
              'Approximately 40 inches — the required separation between the neutral (lower supply conductor) and the top communication attachment at the pole, for voltages under 8.7 kV. Source: ikeGPS and We-Energies joint-use standards, both citing NESC C2 Rule 235 Table 235-5.',
            citation: 'NESC C2-2023 Rule 235 Table 235-5 (per ikeGPS and We-Energies secondary sources).',
          },
          {
            id: 'T05-L03-Q2',
            type: 'drag-match',
            prompt: 'Match each pole zone to its description.',
            pairs: [
              { item: 'Supply space', match: 'High-voltage phase conductors and neutral — off limits to communication crews' },
              { item: 'Climbing space', match: 'Clear vertical corridor between supply and comm zones; includes the 40-inch safety zone' },
              { item: 'Communication space', match: 'Where telephone, fiber, cable TV, and other comm cables attach' },
            ],
            explanation:
              'Supply space = power lines at the top. Climbing space = the buffer zone between them including the Rule 235 40-inch safety zone. Communication space = comm cables at the bottom of the pole.',
          },
          {
            id: 'T05-L03-Q3',
            type: 'mc',
            prompt:
              'The required midspan separation between a communication cable and the neutral for voltages under 8.7 kV is approximately:',
            choices: [
              '40 inches (same as at-pole)',
              '30 inches (75% of at-pole)',
              '20 inches (50% of at-pole)',
              '12 inches (the minimum physical clearance)',
            ],
            answerIndex: 1,
            explanation:
              'Approximately 30 inches at midspan — roughly 75% of the at-pole 40-inch requirement. The midspan gap is smaller because the heavier neutral conductor sags more than a taut communication strand, closing the gap slightly between the poles.',
            citation: 'ikeGPS NESC Rule 235 article; NESC C2-2023 Rule 235.',
          },
          {
            id: 'T05-L03-Q4',
            type: 'mc',
            prompt:
              'A communication worker is attaching a new splice case to the top comm position on a joint-use pole. After installation, the measured distance from the bottom of the neutral to the top of the new splice case hardware is 35 inches. Is this compliant with Rule 235?',
            choices: [
              'Yes — any clearance above 30 inches is acceptable',
              'No — 35 inches is below the approximately 40-inch at-pole safety zone requirement',
              'Yes — 35 inches is within acceptable tolerance of 40 inches',
              'It depends only on the midspan measurement, not the at-pole measurement',
            ],
            answerIndex: 1,
            explanation:
              '35 inches at the pole is below the required ≈ 40-inch communication worker safety zone. The pole is non-compliant. The 30-inch midspan minimum is a SEPARATE requirement from the 40-inch at-pole requirement — you must meet both.',
          },
          {
            id: 'T05-L03-Q5',
            type: 'fill-in-blank',
            prompt:
              'NESC Rule 235 sets the required ____ between communication cables and supply conductors on a joint-use pole. The lower boundary of the supply space is typically the ____ conductor.',
            answer: 'separation / neutral',
            answerDisplay: 'separation (or clearance) / neutral',
            explanation:
              'Rule 235 governs the separation between communication and supply lines on the same pole. The neutral is the lowermost supply conductor and is the reference point for measuring the required safety zone.',
          },
        ]}
      />

    </LessonLayout>
  );
}
