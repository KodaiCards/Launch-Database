// Net-new (migrated from Module02 §2.4, expanded) — T05.L05 Pole Loading — Forces on a Pole
// Working lesson: horizontal/vertical force components, wind span, weight span, resultant, design tools

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
import WorkedExample from '../../components/primitives/WorkedExample.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T05.L05',
  course_id: 'T05',
  title: 'Pole Loading — Forces on a Pole',
  order: 5,
  lesson_type: 'standard',
  prerequisites: ['T05.L01', 'T05.L02', 'T05.L04', 'T01.L02', 'T03.L04'],
  learning_objectives: [
    'Identify the horizontal and vertical force components acting on a distribution pole',
    'Define wind span and weight span and explain how they differ',
    'Calculate the wind-induced horizontal force on a pole from one aerial cable',
    'Explain why pole-loading software is used for real designs rather than hand calculations',
  ],
  estimated_minutes: 30,
  vocabulary_introduced: [
    'pole loading',
    'horizontal force component',
    'vertical force component',
    'wind span',
    'weight span',
    'resultant force',
    'pole tip load',
    'dead-end pole',
    'running pole',
    'guying',
  ],
  vocabulary_assumed: [
    { term: 'NESC', source_lesson_id: 'T05.L01' },
    { term: 'Rule 250', source_lesson_id: 'T05.L01' },
    { term: 'loading district', source_lesson_id: 'T05.L01' },
    { term: 'grade of construction', source_lesson_id: 'T05.L04' },
    { term: 'Section 26', source_lesson_id: 'T05.L04' },
    { term: 'pole', source_lesson_id: 'T01.L02' },
    { term: 'attachment', source_lesson_id: 'T01.L02' },
    { term: 'span', source_lesson_id: 'T01.L01' },
    { term: 'sag', source_lesson_id: 'T05.L02' },
    { term: 'messenger', source_lesson_id: 'T03.L04' },
    { term: 'tension', source_lesson_id: 'T03.L04' },
  ],
  key_terms: [
    {
      term: 'pole loading',
      definition:
        'The sum of all forces — horizontal and vertical — acting on a utility pole from its attached cables, hardware, wind acting on the pole itself, and wire tensions. Pole loading analysis determines whether the selected pole class has enough strength to support the design without failing under the design loading conditions.',
    },
    {
      term: 'horizontal force component',
      definition:
        'The portion of pole loading that acts laterally (sideways) on the pole. Primary sources: (1) wind pressure on the cables and the pole itself, and (2) unbalanced wire tension at dead-end poles and corners. Horizontal forces cause the pole to lean and are the primary determinant of required pole class strength.',
    },
    {
      term: 'vertical force component',
      definition:
        'The portion of pole loading that acts downward along the pole axis. Sources: cable self-weight, hardware weight, ice load. Vertical forces add compression along the pole but are rarely the governing design factor for communication cables (which are light compared to supply conductors).',
    },
    {
      term: 'wind span',
      definition:
        'The horizontal distance used to calculate how much wind-induced force acts on the cables attached to a given pole. For a pole in the middle of a run, wind span = (half of the span on the left) + (half of the span on the right) = average of the two adjacent spans. Each cable\'s wind load is: wind pressure × cable OD (ft) × wind span.',
    },
    {
      term: 'weight span',
      definition:
        'The horizontal distance used to calculate how much cable self-weight (gravity load) acts on a pole. Weight span is measured from the low point of the cable sag on each side of the pole, not the physical mid-point. On equal flat spans, weight span equals wind span. On unequal or hillside spans, they can differ significantly.',
    },
    {
      term: 'resultant force',
      definition:
        'The combined total force on the pole from all horizontal and vertical components acting simultaneously. For a running pole with wind load and cable weight, the resultant is the vector sum — pointing in the direction the pole would lean if it weren\'t restrained. Pole design software computes the resultant and checks it against the pole\'s rated tip load.',
    },
    {
      term: 'pole tip load',
      definition:
        'The calculated horizontal force applied at the tip of the pole (the top attachment point) that represents the equivalent total lateral force on the pole. Pole class selection is based on whether the pole\'s rated tip load (fiber strength) exceeds the calculated tip load under design conditions.',
    },
    {
      term: 'dead-end pole',
      definition:
        'A pole where the cable terminates or where the tension in the wire on one side is significantly different from the other side. Dead-end poles carry large unbalanced wire tension loads — the horizontal pull of the cable on one side is not canceled by an equal pull on the other. Dead-ends are the heaviest-loaded poles in a run and typically require the largest class.',
    },
    {
      term: 'running pole',
      definition:
        'A straight-line pole in the middle of a run, where equal cable tensions pull from both sides. The horizontal tension forces from the left and right spans cancel each other (they point in opposite directions). The primary remaining horizontal load is from wind. Running poles are typically the lightest-loaded poles and can use a smaller class than dead-ends.',
    },
    {
      term: 'guying',
      definition:
        'A method of providing additional lateral support to a pole using a steel guy wire and anchor. A guy wire runs from the pole at an angle down to an anchor in the ground, counteracting the horizontal pull of the cable tension (at a dead-end or corner). Guying allows a lighter pole class to be used where the unbalanced load would otherwise require a much larger pole.',
    },
  ],
};

export const key_terms = meta.key_terms;

export default function T05L05_PoleLoadingForcesOnAPole() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A utility pole is like a flagpole that has to resist wind — except instead of
          just a flag, it's holding up a dozen cables pulling from different directions
          and carrying ice load in winter. Every force acting on the pole — the wind
          pushing against the cables, the gravity pulling the cables down, the tension
          pulling the cables toward the next pole — eventually transfers into the pole as
          stress at the groundline.
        </p>
        <p className="mt-2">
          <strong>Pole loading analysis</strong> is the process of accounting for all
          those forces and confirming that the selected pole class won't snap under the
          worst design conditions. The NESC's Section 26 load and strength factors (from
          the previous lesson) are what make the analysis conservative enough to trust.
        </p>
        <p className="mt-2">
          In this lesson we'll build an intuitive picture of what forces act where. The
          actual calculations for a real pole with 10 cables on it are done by software —
          but if you don't understand the concepts, you can't check whether the software
          output makes sense.
        </p>

        <h3 className="mt-4 font-semibold">Acronyms and notation in this lesson</h3>
        <table className="w-full text-sm border border-white/10 rounded-lg mt-2">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-3 py-2 text-left">Term / Symbol</th>
              <th className="px-3 py-2 text-left">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-300/90">
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">psf</td>
              <td className="px-3 py-2">Pounds per square foot — the unit for wind pressure loads in NESC design</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">OD</td>
              <td className="px-3 py-2">Outer diameter of the cable — the exposed face that catches wind</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">w_wind</td>
              <td className="px-3 py-2">Wind load on the cable per foot of length (lb/ft) = wind pressure × cable OD in feet</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">F_wind</td>
              <td className="px-3 py-2">Total wind force on the cable applied to the pole (lb) = w_wind × wind span</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">F_grav</td>
              <td className="px-3 py-2">Total gravity force (cable weight + ice) on the pole (lb) = cable weight per foot × weight span</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Two types of force: horizontal and vertical</h3>
        <p className="mt-2">
          Think of a running pole — a straight pole in the middle of a long line with
          equal cable pulls on both sides:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <strong>Horizontal forces (sideways)</strong> — Wind pushes the cables sideways.
            Even though the cable is going left-to-right, wind blows from the side, perpendicular
            to the cable. That lateral push transfers to the pole. Wind is the dominant
            horizontal force on a running pole.
          </li>
          <li>
            <strong>Vertical forces (downward)</strong> — Gravity pulls the cables down.
            Each cable has a weight per foot. The pole must support the cable weight from
            both adjacent spans (the weight that "hangs" from the pole). Ice adds to
            this vertical load in Medium and Heavy loading districts.
          </li>
        </ul>
        <p className="mt-2">
          At a <strong>dead-end pole</strong> (line terminates, tension is unbalanced),
          there's also a large horizontal tension force from the cable pulling toward the run.
          That force has no equal pull from the opposite side, so it all goes into the pole.
          Dead-ends are the most heavily loaded poles in the system.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field — Running poles vs. dead-ends</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> All poles in a design must pass the pole-loading analysis
            with the Section 26 safety factors applied. The analysis treats each pole type
            (running, angle, dead-end) differently.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field reality:</strong> Experienced design crews know by sight which
            poles will need guys. Any pole at the end of a long run, at a corner, or at a
            road crossing terminus is a dead-end candidate. When you see a new pole order
            that doesn't include guy anchor locations for terminal poles, that's a red flag
            that the loading analysis may have been skipped or done incorrectly.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>The risk:</strong> An under-designed dead-end pole that fails during a
            storm can cascade — as it falls, it pulls the next pole down, which pulls the
            next, causing a line collapse that can take out hundreds of meters of plant.
            The guy anchor is cheap insurance.
          </p>
        </div>

        {/* ── KEY TERMS FLASHCARDS ─────────────────────────────────────── */}
        <Flashcard
          deckId="T05-L05"
          cards={[
            { id: 'T05-L05-fc-poleloading', front: 'What is pole loading?', back: 'The sum of all horizontal and vertical forces acting on a pole from its attached cables, hardware, wind pressure, and ice. Pole loading analysis determines whether the selected pole class can carry all these forces without failing under the design loading conditions.' },
            { id: 'T05-L05-fc-windspan', front: 'What is wind span and how is it calculated for a running pole?', back: 'Wind span is the horizontal distance used to calculate wind-induced force on the cables at a given pole. For a running pole: wind span = (half the left-side span) + (half the right-side span) = average of the two adjacent spans.' },
            { id: 'T05-L05-fc-deadend', front: 'Why do dead-end poles carry much more horizontal load than running poles?', back: 'At a dead-end pole, cable tension only pulls from one direction — there\'s no equal pull from the opposite side to cancel it. The full unbalanced cable tension becomes a horizontal load on the pole. Running poles have equal tension from both sides, so the tensions cancel and wind becomes the dominant horizontal force.' },
            { id: 'T05-L05-fc-guying', front: 'What is guying and why is it used?', back: 'Guying is a steel wire (and anchor) used to counteract the horizontal pull at a dead-end or corner pole. The guy wire runs from the pole to a buried anchor, providing lateral support so a lighter pole class can be used than would be required without guying.' },
            { id: 'T05-L05-fc-tipload', front: 'What is pole tip load and how is it used in design?', back: 'Pole tip load is the calculated equivalent lateral force at the pole tip representing the total horizontal loading. It\'s compared to the pole\'s rated fiber strength (from ANSI O5.1-2022) to confirm the pole class is adequate. Pole class selection is basically: calculated tip load < rated fiber strength × strength factor.' },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Calculating Wind and Gravity Forces — A Simplified Example</h2>

        {/* AnnotatedDiagram of pole force vectors */}
        <AnnotatedDiagram
          title="Forces Acting on a Running Pole"
          description="Click each labeled arrow to understand what force it represents and where it comes from. This is a simplified diagram showing a pole with two cables on two equal spans."
          src="/training/diagrams/pole-force-diagram.svg"
          alt="Diagram of a running pole with force vector arrows: wind force pointing horizontally from the side (w_wind × wind span), gravity force pointing downward (cable weight × weight span), and the resultant lean direction"
          aspectRatio={0.75}
          hotPoints={[
            {
              id: 'wind-force',
              x: 85,
              y: 35,
              label: 'Wind force (horizontal)',
              type: 'click',
              explanation:
                'Wind pushes perpendicular to the cable. The force = wind pressure (psf) × cable OD (ft) × wind span (ft). For a Light district (9 psf), a 0.5-inch strand on a 150-ft wind span: F_wind = 9 × (0.5/12) × 150 = 56 lb just from one cable. A pole with 10 cables has 10 of these contributions.',
            },
            {
              id: 'gravity-force',
              x: 50,
              y: 85,
              label: 'Gravity force (vertical)',
              type: 'click',
              explanation:
                'Cable weight pulls straight down. The force = cable weight per foot (lb/ft) × weight span (ft). For a 0.145-lb/ft cable on a 150-ft weight span: F_grav = 0.145 × 150 = 21.75 lb. Light compared to wind load for communication cables.',
            },
            {
              id: 'resultant',
              x: 70,
              y: 55,
              label: 'Resultant (combined lean direction)',
              type: 'click',
              explanation:
                'The resultant is the vector sum of all horizontal and vertical forces. It points in the direction the pole would lean if it weren\'t in the ground. For a running pole in a strong wind, the resultant tilts mostly horizontal (wind direction). For a dead-end pole, the resultant points toward the cable run.',
            },
            {
              id: 'groundline',
              x: 50,
              y: 97,
              label: 'Groundline bending stress',
              type: 'click',
              explanation:
                'The critical failure point for a pole is at the groundline — where the pole enters the soil. The horizontal forces at the top of the pole create a bending moment at the groundline equal to the horizontal force × the effective moment arm (roughly the above-ground height). Pole class is selected so the groundline strength exceeds this moment.',
            },
          ]}
        />

        <h3 className="mt-5 font-semibold">Step-by-step force calculation for one cable</h3>
        <p>
          Here's a simplified worked example showing how to calculate the wind and gravity
          force contribution from a single cable to one running pole. A real design has
          5–15 cables and uses software (PLS-POLE, O-Calc Pro, Spidacalc) — but the
          concept is the same for each cable.
        </p>

        <div className="rounded-lg bg-black/30 border border-white/10 p-5 my-4">
          <p className="font-semibold text-slate-200 mb-2">Scenario</p>
          <ul className="text-sm space-y-1 text-slate-300">
            <li>Location: Macon, GA (NESC Light loading district: 9 psf wind, no ice)</li>
            <li>Cable: 12-fiber lashed to 6M strand. Cable weight w = 0.145 lb/ft. Strand OD = 0.5 in.</li>
            <li>Left span: 150 ft. Right span: 150 ft (equal, symmetrical running pole)</li>
            <li>Wind span: (150/2) + (150/2) = <strong>150 ft</strong></li>
            <li>Weight span: 150 ft (equal flat spans)</li>
          </ul>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 1: Wind load per foot of cable (w_wind)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>w_wind = wind pressure × projected area</p>
            <p>Projected area per foot = strand OD / 12 = 0.5 / 12 = 0.042 ft²/ft</p>
            <p>w_wind = 9 psf × 0.042 ft²/ft = <strong>0.375 lb/ft</strong></p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: 0.375 lb per foot of cable length due to wind. Less than half a pound per foot —
            sounds reasonable for a 60-mph wind (9 psf) on a half-inch strand.
          </p>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 2: Total wind force on pole from this cable (F_wind)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>F_wind = w_wind × wind span</p>
            <p>F_wind = 0.375 lb/ft × 150 ft</p>
            <p>F_wind = <strong>56.25 lb</strong> (horizontal, perpendicular to the cable run)</p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: 56 lb of horizontal push from wind on one cable attachment at this pole.
            That's about like hanging a 56-lb weight horizontally at the cable attachment height.
            For 10 cables on the same pole: roughly 560 lb of wind force — which is why pole
            loading software matters.
          </p>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 3: Vertical cable weight force (F_grav)</p>
          <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-200 space-y-1">
            <p>F_grav = cable weight per foot × weight span</p>
            <p>F_grav = 0.145 lb/ft × 150 ft</p>
            <p>F_grav = <strong>21.75 lb</strong> (downward)</p>
          </div>
          <p className="text-sm text-slate-300/80 mt-2">
            Sanity check: 21.75 lb of downward cable weight at this pole. Much smaller than the
            wind force (56 lb). For communication cables in the Light district, wind usually
            governs over cable weight for horizontal pole strength. In the Heavy district,
            ice dramatically increases F_grav.
          </p>

          <p className="font-semibold text-slate-200 mt-5 mb-2">Step 4: Why this matters for pole class</p>
          <p className="text-sm text-slate-300">
            The pole must resist the resultant of all cable wind forces × their heights above
            ground (the bending moment at the groundline). For a pole with 10 cables at
            varying heights, you sum each cable's contribution. The total bending moment is
            compared to the pole's rated fiber strength at the groundline (from ANSI O5.1-2022,
            approximately 4,500 lb for a Class 1 southern yellow pine pole at 2 ft from top;
            approximately 3,000 lb for Class 3 — confirm from ANSI O5.1-2022 for your design).
            Pole-loading software does this calculation automatically — but you need to know
            which loading district you're in and which grade applies before you enter the inputs.
          </p>
        </div>

        {/* WorkedExample interactive */}
        <WorkedExample
          title="Wind Force on One Cable"
          description="Calculate the wind-induced force one cable contributes to a running pole. This is one of many cables — a real pole has 5–15."
          variables={[
            { id: 'wp', label: 'Wind pressure (psf) — Light: 9, Medium: 4, Heavy: 4', defaultValue: 9, min: 4, max: 15, step: 1 },
            { id: 'od_in', label: 'Cable OD (inches)', defaultValue: 0.5, min: 0.25, max: 2.0, step: 0.05 },
            { id: 'ws', label: 'Wind span (ft)', defaultValue: 150, min: 50, max: 400, step: 5 },
          ]}
          formula="F_wind = wind_pressure × (cable_OD/12) × wind_span"
          steps={[
            { label: 'w_wind (lb/ft)', expression: 'wp * (od_in / 12)', varIds: ['wp', 'od_in'] },
            { label: 'F_wind (lb) — horizontal force on pole from this cable', expression: 'wp * (od_in / 12) * ws', varIds: ['wp', 'od_in', 'ws'] },
          ]}
          sanityCheck="For 10 identical cables, multiply this result by 10 to get a rough order-of-magnitude for total wind load. A real corridor has cables at different heights and widths — use pole-loading software for actual designs."
        />
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Poles at Corners and Dead-Ends</h2>

        <h3 className="mt-4 font-semibold">Angle poles — horizontal tension from direction change</h3>
        <p>
          When a pole line turns a corner, the cable tension in each direction is no longer
          directly opposite. The forces on both sides don't cancel — they add as a
          resultant vector pointing toward the outside of the turn. The larger the turning
          angle, the larger the horizontal force.
        </p>
        <p className="mt-2">
          At a 90-degree corner with equal tension on both sides, the resultant force
          is √2 × T (where T is the cable tension). For a cable at 600 lb tension:
          resultant = 0.707 × 600 = 424 lb from just the tension change — plus wind load
          on top of that. Angle poles routinely require guys or a significantly larger
          pole class than the running poles on either side.
        </p>

        <h3 className="mt-5 font-semibold">Pole-loading software — PLS-POLE, O-Calc Pro, Spidacalc</h3>
        <p>
          In commercial design, pole-loading analysis is done with licensed software tools
          that model the full three-dimensional force system on every pole. These programs
          read in the cable roster (all cables, their weights, ODs, tensions, and attachment
          heights), the span lengths on each side, the loading district, the grade of
          construction, and the NESC edition. The program applies the Section 26 factors and
          outputs whether each pole class passes or fails.
        </p>
        <p className="mt-2">
          As an OSP designer, your job is to feed the software correct inputs — correct
          cable data, correct spans from the field survey, correct grade classification,
          correct loading district. The software can't check whether your inputs are right.
          A loading analysis run with Grade C inputs for a railroad crossing is a Grade C
          analysis — it will pass easily but is wrong. The inputs are the design.
        </p>
      </section>

      {/* ── PER-LESSON QUIZ ──────────────────────────────────────────────── */}
      <Quiz
        title="T05.L05 Check — Pole Loading — Forces on a Pole"
        mode="multiple-choice"
        questions={[
          {
            id: 'T05-L05-Q1',
            type: 'mc',
            prompt:
              'A running pole has a cable with w = 0.145 lb/ft and strand OD = 0.5 in, on two equal 150-ft spans. The loading district is Light (9 psf wind). What is the wind force (F_wind) contributed by this cable to the pole?',
            choices: [
              '21.75 lb',
              '56.25 lb',
              '112.5 lb',
              '3.375 lb',
            ],
            answerIndex: 1,
            explanation:
              'Wind span = (150/2) + (150/2) = 150 ft. w_wind = 9 × (0.5/12) = 9 × 0.042 = 0.375 lb/ft. F_wind = 0.375 × 150 = 56.25 lb. The 21.75 lb answer is the gravity force (0.145 × 150), not the wind force.',
          },
          {
            id: 'T05-L05-Q2',
            type: 'mc',
            prompt:
              'Why does a dead-end pole typically require a larger pole class than a running pole with the same cables and span lengths?',
            choices: [
              'Dead-end poles are always placed at higher elevations, increasing the wind load',
              'The cable tension on one side is unbalanced — it pulls in one direction with no equal tension on the opposite side, creating a large horizontal force',
              'Dead-end poles must carry twice the cable weight of running poles',
              'NESC requires Grade B construction at all dead-end poles',
            ],
            answerIndex: 1,
            explanation:
              'At a running pole, cable tension pulls equally from both directions and cancels out. At a dead-end, the full cable tension from one run is unbalanced — it all pulls in one direction as a horizontal force on the pole. This unbalanced tension force is often 10× larger than the wind force on a running pole, requiring a significantly larger pole class or a guy anchor.',
          },
          {
            id: 'T05-L05-Q3',
            type: 'drag-match',
            prompt: 'Match each force type to its primary source.',
            pairs: [
              { item: 'Horizontal wind force', match: 'Wind pressure × cable OD × wind span' },
              { item: 'Vertical gravity force', match: 'Cable weight per foot × weight span' },
              { item: 'Horizontal tension force (dead-end only)', match: 'Unbalanced cable tension with no equal pull from opposite side' },
            ],
            explanation:
              'Horizontal wind force = wind pressure × projected area × span length. Vertical gravity = cable weight × weight span. Horizontal tension (dead-ends and corners) = unbalanced cable tension not cancelled by an equal and opposite pull.',
          },
          {
            id: 'T05-L05-Q4',
            type: 'fill-in-blank',
            prompt:
              'For a running pole with a 200-ft span on the left and a 100-ft span on the right, the wind span is ____.',
            answer: '150 ft',
            answerDisplay: '150 ft — (200/2) + (100/2) = 100 + 50 = 150 ft',
            explanation:
              'Wind span = (half of left span) + (half of right span) = (200/2) + (100/2) = 100 + 50 = 150 ft. Wind span is the average of the two adjacent spans, representing how much cable area "feeds" wind load into this pole from each direction.',
          },
        ]}
      />

    </LessonLayout>
  );
}
