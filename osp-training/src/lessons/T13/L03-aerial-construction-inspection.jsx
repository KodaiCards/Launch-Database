// T13.L03 — Aerial Construction Inspection
// NESC C2-2023 Rule 230/232/235; 29 CFR 1910.268(b)(20); T18.L04 fallprot
// H-07: visual sag procedure; H-12: pre-climb go/no-go; M-06: drip loop; M-17: non-conductive tools

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';

export const meta = {
  id: 'T13.L03',
  course_id: 'T13',
  title: 'Aerial Construction Inspection',
  order: 5,
  lesson_type: 'technical',
  prerequisites: ['T13.L02', 'T18.L04'],
  learning_objectives: [
    'Execute the step-by-step visual sag check procedure including escalation path when outside tolerance',
    'Apply the pre-climb structural go/no-go decision tree to a described pole condition',
    'State the three aerial deficiency types inspected under NESC Rule 232 and 235: sag, drip loop, and lashing pitch',
    'Identify when non-conductive measuring tools are required near energized supply conductors (29 CFR 1910.268)',
    'Apply inspector roadside PPE and position requirements for aerial inspection visits near traffic',
  ],
  estimated_minutes: 35,
  vocabulary_introduced: [
    'pre-climb structural assessment',
    'go/no-go decision (pole condition)',
  ],
  key_terms: [
    {
      term: 'pre-climb structural assessment',
      definition:
        'A systematic inspection of a utility pole\'s structural condition performed by or witnessed by the inspector BEFORE any worker or inspector ascends the pole. Evaluates: pole species and treatment type (signs of failure), external wood condition (woodpecker damage, shell rot, checking), soil condition at the base (leaning, heaving, erosion), existing climbing aids (steps, attachments in poor condition), and mechanical damage (vehicle strikes). A failed pre-climb assessment triggers a NESC Rule 261 condemnation process — the pole is condemned and cannot be climbed until structural reinforcement is made.',
    },
    {
      term: 'go/no-go decision (pole condition)',
      definition:
        'The binary pass/fail verdict of the pre-climb structural assessment. GO: pole passes all structural criteria and climbing may proceed with normal fall-protection protocol (T18.L04). NO-GO: one or more structural criteria are failed; the pole is immediately tagged out of service for climbing, the contractor is notified, and the engineer of record is contacted for structural evaluation and remediation guidance per NESC Rule 261. The inspector documents the no-go criteria on Form 565.',
    },
  ],
  vocabulary_assumed: [
    { term: 'inspector (OSP)', source_lesson_id: 'T01.L06' },
    { term: 'inspection segment', source_lesson_id: 'T13.L01' },
    { term: 'acceptance criteria document', source_lesson_id: 'T13.L02' },
    { term: 'inspection cadence', source_lesson_id: 'T13.L02' },
    { term: 'RUS Form 565 (Inspector\'s Daily Report)', source_lesson_id: 'T13.L11' },
    { term: 'fall protection, aerial lift', source_lesson_id: 'T18.L04' },
    { term: 'MAD, MAB', source_lesson_id: 'T18.L07' },
    { term: 'PPE (general)', source_lesson_id: 'T18.L01' },
    { term: 'MUTCD traffic control', source_lesson_id: 'T10.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T13L03AerialInspection() {
  const preclimbScenario = {
    id: 'preclimb-decision',
    title: 'Pre-Climb Go/No-Go Assessment',
    description:
      'A lineman is about to climb a 45-foot Class 3 Southern Yellow Pine pole to lash aerial fiber. You are the inspector. Conduct the pre-climb structural assessment.',
    startNode: 'start',
    nodes: {
      start: {
        text: 'You walk to the base of the pole. You observe: the pole has a 6-inch × 4-inch woodpecker cavity on the north face at about 6 feet above grade. The pole leans approximately 5 degrees away from the road (toward the easement). The ground is firm. What is your assessment?',
        choices: [
          { label: 'GO — lean is minor and cavity is relatively low', nextNode: 'assess_lean' },
          { label: 'NO-GO — document both concerns and call engineer before climbing', nextNode: 'correct_nogo' },
          { label: 'Let the lineman climb — they are experienced and can assess from the top', nextNode: 'wrong_lineman' },
        ],
      },
      assess_lean: {
        text: '⚠️ A 5-degree lean away from the road sounds minor, but the direction matters. "Away from the road" means toward the easement — if the pole fails during climbing, it falls into the field or property, which may be safer. However, the 6" × 4" cavity at 6 feet requires a closer look. A cavity of this size near the groundline affects the pole\'s structural capacity. NESC Rule 261 condemnation criteria typically reference loss of section at ground line.',
        choices: [
          { label: 'Proceed to closer inspection of the cavity', nextNode: 'cavity_check' },
        ],
      },
      cavity_check: {
        text: 'You probe the cavity with a screwdriver. The wood is hollow for approximately 8 inches into the pole. The cavity is at 6 feet above grade — above the critical groundline zone but within the lower third of the pole. Given the hollow cavity plus the lean, what is your decision?',
        choices: [
          { label: 'GO — cavity is above groundline zone, lean is minor', nextNode: 'wrong_go' },
          { label: 'NO-GO — combined concerns warrant structural engineer review before climbing', nextNode: 'correct_nogo' },
        ],
      },
      wrong_go: {
        text: '⚠️ While a single minor issue might be acceptable, the combination of a 8-inch hollow cavity in the lower third of the pole AND a pre-existing lean creates a compound structural concern. Industry practice (per ANSI O5.1 pole specifications and pole inspection programs) is that two concurrent structural concerns = engineer review. A cavity above the groundline + lean = borderline case that the inspector should not resolve alone.',
        choices: [{ label: 'Revise decision', nextNode: 'correct_nogo' }],
      },
      wrong_lineman: {
        text: '❌ The pre-climb structural assessment is performed from the ground BEFORE climbing. Sending the lineman up to assess from the top defeats the purpose — if the pole fails structurally during the climb, the climber is at risk. Ground-level assessment must be completed and a GO decision made before the first step is set.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      correct_nogo: {
        text: '✅ NO-GO. Document on Form 565: cavity dimensions, location (6 ft AGL, north face), probe depth (8 inches hollow), lean direction and estimated angle, and decision: "Pole assessment: NO-GO per pre-climb structural criteria. Climbed refused. Engineer of record notified at [time]. NESC Rule 261 condemnation process initiated." Tag the pole. Notify the contractor. No climbing until the engineer has evaluated the pole and issued written clearance.',
        choices: [],
      },
    },
  };

  const aerialDeficiencyScenario = {
    id: 'aerial-deficiency',
    title: 'Aerial Inspection: Three Deficiency Types',
    description:
      'You are walking span 14 on an aerial fiber build. The acceptance criteria specify: maximum sag per the engineered sag schedule, maximum lashing pitch 48 inches, drip loop required at every attachment with minimum 6-inch arc.',
    startNode: 'start',
    nodes: {
      start: {
        text: 'You string-line the span from structure to structure. Your string-line midpoint is 8 inches BELOW the cable midspan. The engineered sag schedule allows 14 inches at this span length and temperature. What do you do?',
        choices: [
          { label: 'Issue a punch-list entry — cable is under-sagged (too tight)', nextNode: 'correct_sag' },
          { label: 'Issue a punch-list entry — cable is over-sagged (too loose)', nextNode: 'wrong_oversag' },
          { label: 'Accept — 8 inches is less than the 14-inch maximum', nextNode: 'wrong_accept' },
        ],
      },
      correct_sag: {
        text: '✅ Correct. The engineered sag schedule allows 14 inches of sag (cable hangs below the attachment points). You measured 8 inches using the string-line method. Cable that is UNDER the allowed sag amount is TOO TIGHT — under-sagging creates excessive tension, which can damage the cable under ice/wind loading. Under-sag is a deficiency just as much as over-sag. Issue punch-list entry: "Span 14, midspan sag measured 8 inches (string-line method). Sag schedule calls for 14±2 inches at 75°F. Cable is under-sagged — excessive tension. Rework required."',
        choices: [{ label: 'Continue', nextNode: 'drip_check' }],
      },
      wrong_oversag: {
        text: '❌ You measured 8 inches of sag on a 14-inch allowed schedule. 8 inches is LESS than 14 inches — the cable has LESS sag than allowed, meaning it is tighter than specified. That is under-sagging, not over-sagging. Review: the sag schedule specifies how much the cable SHOULD hang below the attachment points. Less measured sag = tighter cable = under-sag.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      wrong_accept: {
        text: '⚠️ "Less than the maximum" logic doesn\'t apply to sag — the schedule specifies a TARGET with a tolerance, not just a maximum. 14 inches is the designed sag, not a maximum. Under-sagging (too tight) is a deficiency. Most sag schedules have a ±2-inch tolerance — 8 inches is 6 inches outside tolerance.',
        choices: [{ label: 'Try again', nextNode: 'start' }],
      },
      drip_check: {
        text: 'Moving to the drop attachment at structure 14. You observe the fiber drop has a loop near the attachment point, but the lowest point of the loop appears to be even with the attachment hardware — there is no downward arc below the weather head. What do you do?',
        choices: [
          { label: 'Accept — a loop is present, which is all that is required', nextNode: 'wrong_loop' },
          { label: 'Issue punch-list — drip loop must have ≥6-inch arc BELOW the weather head to drain water away', nextNode: 'correct_drip' },
        ],
      },
      wrong_loop: {
        text: '⚠️ A loop at the attachment point that doesn\'t arc downward is not a drip loop — it is a coil that could collect water and route it TOWARD the building entry. The function of a drip loop is to create a low point BELOW the weather head so water runs off the cable rather than following the cable into the building. Minimum 6-inch arc below the weather head is the measurable criterion.',
        choices: [{ label: 'Try again', nextNode: 'drip_check' }],
      },
      correct_drip: {
        text: '✅ Issue punch-list entry: "Structure 14 fiber drop — drip loop present but arc is level with attachment point, no downward arc. Per acceptance criteria: minimum 6-inch arc below weather head required. Rework: re-form drip loop with minimum 6-inch downward arc before entry seal."',
        choices: [],
      },
    },
  };

  const quizQuestions = [
    {
      id: 'q1',
      question: 'The string-line visual sag check method works by:',
      type: 'multiple-choice',
      options: [
        'Measuring cable tension with a tensiometer at the attachment point',
        'Stringing a reference line between the two attachment points and measuring the vertical distance between the reference line and the cable midspan',
        'Using a clinometer to measure the angle of the cable from horizontal',
        'Counting the number of visible cable sag dips over a known span length',
      ],
      correct: 1,
      explanation:
        'String-line method: run a reference string (or use a sighting level) between the two attachment points at the same height as the attachments. The cable hangs below this reference line. Measure the vertical distance from the string-line to the cable at midspan — this is the measured sag. Compare to the engineered sag schedule for the span length at the observed temperature.',
    },
    {
      id: 'q2',
      question: 'NESC Rule 261 condemnation of a pole is triggered when:',
      type: 'multiple-choice',
      options: [
        'The pole is more than 10 years old',
        'The pre-climb structural assessment identifies structural failure criteria that prohibit safe climbing',
        'The pole has any woodpecker damage regardless of size',
        'The pole is leaning more than 2 degrees',
      ],
      correct: 1,
      explanation:
        'NESC Rule 261 condemnation is triggered when the pre-climb structural assessment finds structural failure criteria — typically: hollow cavity at or near groundline, significant loss of section, mechanical damage to the pole at or below the groundline zone. Lean alone is not always a condemnation trigger — lean direction and ground condition matter. The inspector\'s role: if the pre-climb assessment identifies any criteria that might trigger condemnation, the verdict is NO-GO and the engineer reviews. Age alone is not a condemnation criterion.',
    },
    {
      id: 'q3',
      question: 'Near energized joint-use supply conductors, clearance measurements must be taken with:',
      type: 'multiple-choice',
      options: [
        'A metal tape measure for accuracy',
        'A fiberglass or wood rod, or a laser distance meter — non-conductive measuring tools only',
        'No measurement is required — visual estimation is sufficient near energized conductors',
        'A grounded metal probe with insulated handles',
      ],
      correct: 1,
      explanation:
        'Per 29 CFR 1910.268(b)(20), metal tools are prohibited within the minimum approach distance (MAD) of energized supply conductors. Metal tape measures conduct electricity — if they contact or come within arcing distance of energized conductors, they create an electrocution hazard. Use fiberglass rods, wood rods, or non-contact laser distance meters for clearance measurements near supply conductors. This was covered in T18.L07 (MAD/MAB).',
    },
    {
      id: 'q4',
      question: 'An inspector observing aerial construction near a roadway must:',
      type: 'multiple-choice',
      options: [
        'Stand on the shoulder of the road to observe the work clearly',
        'Wear HVLV (high-visibility) vest and position themselves outside the active traffic control zone whenever possible, per 23 CFR 634.2 and MUTCD Part 6H',
        'Remain in their vehicle to avoid being a roadway hazard',
        'No special requirements apply to inspectors — only construction workers need PPE near roads',
      ],
      correct: 1,
      explanation:
        'The inspector is a roadside worker when observing work near traffic. Per 23 CFR 634.2 and MUTCD Part 6H (H-27), all roadside workers must wear ANSI/ISEA 107 Class 2 or 3 HVLV vest. The inspector should position themselves in the protected work zone, not in the traffic lane or unprotected shoulder. "Inspector" is not an exemption from roadside worker PPE requirements.',
    },
    {
      id: 'q5',
      question: 'When observing a lineman climbing, the inspector should position themselves:',
      type: 'multiple-choice',
      options: [
        'Directly below the climber to observe pole-top work',
        'Outside the drop zone — never directly below a climber',
        'On the opposite side of the pole from the climber',
        'At least 100 feet away from the base of the pole',
      ],
      correct: 1,
      explanation:
        'The drop zone is the area directly below a climber where tools, hardware, or the climber themselves could fall. The inspector must NEVER position themselves in the drop zone. Stand outside the drop zone where you can observe the work without being in the fall path. This is basic aerial-work field-safety awareness.',
    },
  ];

  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Aerial inspection is the most visible part of an OSP inspector's job — walking line
          routes, looking up at cable and hardware, measuring whether the fiber hangs at the
          right height and the right tension. But before you can look up, you have to look at
          what you're standing next to: the pole. A structurally compromised pole is a
          life-safety hazard, and the inspector is the last line of defense before a lineman
          climbs it.
        </p>
        <p>
          This lesson covers three things: how to evaluate whether a pole is safe to climb
          (pre-climb go/no-go), how to check the three main aerial deficiency types (sag,
          drip loop, lashing pitch), and how to do those checks safely when there are energized
          joint-use conductors nearby.
        </p>
      </section>

      {/* ── Flashcards ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>Key Terms</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {meta.key_terms.map((kt) => (
            <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />
          ))}
        </div>
      </section>

      {/* ── WORKING ────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Pre-Climb Structural Assessment — Go/No-Go</h2>
        <p>
          Before any worker climbs a pole, the inspector (or the inspector's designated pole
          inspection-trained representative) must conduct a pre-climb structural assessment.
          This is NOT the lineman's self-assessment — the inspector is an independent second
          evaluation. The checklist:
        </p>
        <ol>
          <li>
            <strong>Species and treatment:</strong> Identify the pole species (Southern Yellow
            Pine, Douglas Fir, Western Red Cedar — each has different decay patterns). Confirm
            treatment marks (CCA, pentachlorophenol, etc.) are legible.
          </li>
          <li>
            <strong>External wood condition:</strong> Probe the base at ground line with a
            screwdriver or pick. Shell rot (hollow interior, sound exterior shell) is the most
            dangerous failure mode — the shell looks sound but the interior is gone. Any probe
            depth exceeding 1.5 inches at groundline = structural concern.
          </li>
          <li>
            <strong>Woodpecker damage:</strong> Note location, dimensions, and probe depth.
            Damage at or below the 6-foot mark is more serious than damage at height.
          </li>
          <li>
            <strong>Lean and base condition:</strong> Stand back 50 feet and sight down the line.
            Lean away from the vertical plus heaving or eroded soil at the base = structural concern.
          </li>
          <li>
            <strong>Mechanical damage:</strong> Vehicle strikes, unauthorized cut-outs, previous
            repair hardware that has corroded or pulled through.
          </li>
          <li>
            <strong>Existing climbing aids:</strong> Existing steps, hooks, and attachments must
            not create additional hazards.
          </li>
        </ol>
        <p>
          <strong>If any criterion is failed:</strong> NO-GO. Tag the pole. Document on Form 565.
          Contact the engineer of record. The engineer evaluates per NESC Rule 261 condemnation
          criteria and determines whether the pole needs guying, plating, full replacement, or
          if climbing is safe with specific precautions.
        </p>

        <BranchingScenario scenario={preclimbScenario} />

        <h3>Visual Sag Check — Step-by-Step Procedure</h3>
        <p>
          The engineered sag schedule for a project specifies how much the cable should hang
          below the attachment points, as a function of span length and temperature. The
          visual sag check verifies the installed cable matches the schedule.
        </p>
        <p>
          <strong>Step 1 — Identify midspan location:</strong> Find the midpoint between
          the two attachment structures. For simple spans this is easy; for unequal spans,
          midpoint is at half the horizontal distance between poles.
        </p>
        <p>
          <strong>Step 2 — Set up the string-line:</strong> Hold a measuring string taut
          between the two attachment points at exactly the same height as each attachment
          (or use a sighting level). The string represents the horizontal reference.
        </p>
        <p>
          <strong>Step 3 — Measure the sag:</strong> At midspan, measure the vertical
          distance from the string-line down to the cable. This is the measured sag.
        </p>
        <p>
          <strong>Step 4 — Compare to schedule:</strong> Read the engineered sag schedule for
          this span length at the observed ambient temperature. The measured sag should be
          within the specified tolerance (typically ±2 inches of the scheduled value).
        </p>
        <p>
          <strong>Step 5 — Escalation:</strong> If sag is outside tolerance:
        </p>
        <ul>
          <li>Under-sag (cable too tight) → excessive tension, can damage cable at ice/wind loading → issue punch-list, require re-sag.</li>
          <li>Over-sag (cable too loose) → NESC Rule 232 clearance may be violated at minimum temperature → issue punch-list, require re-sag AND verify clearances are still met.</li>
          <li>More than 6 inches outside tolerance → stop stringing work on this route until the cause is identified.</li>
        </ul>
      </section>

      {/* ── Aerial Deficiency Scenario ────────────────────────────────── */}
      <section data-tier="working">
        <h2>Scenario: Three Aerial Deficiency Types</h2>
        <BranchingScenario scenario={aerialDeficiencyScenario} />
      </section>

      {/* ── ADVANCED ───────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Non-Conductive Tools Near Joint-Use Supply Conductors</h2>
        <p>
          On joint-use poles, energized supply conductors (power company lines) are present
          above the communication zone. Measuring clearances — the vertical distance between
          your new fiber and the power company's conductors — requires physical measurement.
          But metal measuring tapes conduct electricity.
        </p>
        <p>
          <strong>29 CFR 1910.268(b)(20):</strong> Employees working on communication facilities
          in proximity to supply circuits shall use non-conductive tools and equipment whenever
          within or near the minimum approach distance. Metal tape measures, metal rods, and
          metal rulers are prohibited within the MAD (T18.L07) of energized supply conductors.
        </p>
        <p>
          <strong>Compliant measurement tools:</strong>
        </p>
        <ul>
          <li>Fiberglass measuring rod (available in 6-foot sections)</li>
          <li>Wooden measuring stick</li>
          <li>Non-contact laser distance meter (point from outside the MAD zone to the conductor)</li>
          <li>Optical angle measurement with trigonometric calculation from a safe distance</li>
        </ul>
        <p>
          <strong>Book vs. Field Practice:</strong> In the field, linemen sometimes use metal
          tape outside the MAD zone with a colleague spotting. This is technically compliant
          only if the metal portion never enters the MAD. In practice, with gusty wind and
          cables at head height, it is safer to use a fiberglass rod or laser device for any
          clearance measurement within 10 feet of energized supply conductors. The inspector
          should enforce non-conductive tool use and document it on Form 565.
        </p>
      </section>

      {/* ── QUIZ ───────────────────────────────────────────────────────── */}
      <section data-tier="assessment">
        <h2>Lesson Quiz</h2>
        <Quiz questions={quizQuestions} />
      </section>

    </LessonLayout>
  );
}
