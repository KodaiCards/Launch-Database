// T07.L02 — Reading Plans in the Field
// Working lesson: interpreting design plans on the ground
// Sources: RUS Bulletin 1751F-630 §7, industry staking practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T07.L02',
  course_id: 'T07',
  title: 'Reading Plans in the Field',
  order: 2,
  lesson_type: 'working',
  prerequisites: ['T07.L01', 'T04.L02', 'T05.L01'],
  learning_objectives: [
    'Interpret the key elements of a plan-and-profile drawing in the field: stationing, offset, PI, cross-section',
    'Translate a 2D design plan to a 3D field location using stationing and offset measurements',
    'Identify when field terrain differs significantly from the design profile and issue a proper call-out',
  ],
  estimated_minutes: 25,
  vocabulary_introduced: [
    'plan-and-profile',
    'stationing',
    'offset',
    'PI',
    'cross-section',
    'design intent mark',
    'contour',
  ],
  vocabulary_assumed: [
    { term: 'site walk', source_lesson_id: 'T04.L01' },
    { term: 'existing utility', source_lesson_id: 'T04.L01' },
    { term: 'call-out', source_lesson_id: 'T07.L01' },
    { term: 'stake', source_lesson_id: 'T07.L01' },
    { term: 'measurement tolerance', source_lesson_id: 'T07.L01' },
  ],
  key_terms: [
    {
      term: 'plan-and-profile',
      definition:
        'A two-part engineering drawing showing the route from above (the plan, or "top view") and from the side (the profile, or "side elevation"). The plan shows the horizontal layout — where the route goes. The profile shows the vertical layout — how the ground rises and falls. Together they let a staker understand both the ground path and the terrain the route crosses.',
    },
    {
      term: 'stationing',
      definition:
        'A distance measurement along the design route centerline, expressed in feet from a reference point (station 0+00). The format reads as "hundreds of feet + remainder." Station 3+75 means 375 feet from the start. Station 12+00 means 1,200 feet. Stationing lets every point on the route have an unambiguous address.',
    },
    {
      term: 'offset',
      definition:
        'The perpendicular distance from the design route centerline to a specific feature (pole, stake, structure). An offset of "5 feet north" means the feature is 5 feet north of the centerline, not on it. Offsets are used when poles must be placed away from the road centerline for ROW, terrain, or safety reasons.',
    },
    {
      term: 'PI',
      definition:
        'Point of Intersection — the point where two straight route segments (tangents) would meet if extended. At a PI, the route changes direction. On the plan view, a PI looks like a bend or corner in the route line. The staker must locate the PI in the field, often by measuring from a known reference point, and may need to drive a stake at or near it.',
    },
    {
      term: 'cross-section',
      definition:
        'A drawing showing the route as if you sliced through it perpendicular to the direction of travel — like cutting through a loaf of bread and looking at the cut face. Cross-sections show the ROW width, existing utilities, proposed conduit or pole placement, and any grade changes at that specific station. They are used to verify pole placement relative to the roadway edge and other utilities.',
    },
    {
      term: 'design intent mark',
      definition:
        'A notation on a staking plan indicating the designer\'s intent at a specific location — typically expressed as stationing + offset + proposed attachment height. The staker\'s job is to find this point on the ground, verify conditions match the intent, and flag any mismatch via a call-out.',
    },
    {
      term: 'contour',
      definition:
        'A line on a topographic map or profile drawing that connects all points at the same elevation above sea level. Contour lines that are close together indicate steep terrain (elevation changes rapidly over short distance). Contour lines that are spread far apart indicate gentle slopes or flat terrain. On a staking plan profile view, closely-spaced contour values in the ground line signal a hill or ridge that the cable sag must clear. Understanding contours helps the staker anticipate terrain before arriving at each station.',
    },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;
export const key_terms = meta.key_terms;

export default function T07L02_ReadingPlansInTheField() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          A staking plan is a map — but maps are flat, and the real world is anything but.
          Your job is to translate that flat drawing into a location you can stand on,
          measure at, and drive a stake into. That means reading two specific drawing types:
          the <strong>plan view</strong> (bird's eye, looking down) and the{' '}
          <strong>profile view</strong> (side view, showing how the ground rises and falls).
          Together, they're called a <strong>plan-and-profile</strong>.
        </p>
        <p className="mt-2">
          Think of the plan view like Google Maps satellite view — it shows the route going
          through neighborhoods, fields, and roads. The profile view is what you'd see if
          you drove a car along that route and recorded the elevation — hills, valleys,
          flat stretches.
        </p>
        <p className="mt-2">
          You need both. The plan tells you WHERE the route goes. The profile tells you
          WHAT THE GROUND DOES along the way. Together they tell you where each pole goes
          and how high it needs to be.
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
              <td className="px-3 py-2 font-mono">PI</td>
              <td className="px-3 py-2">Point of Intersection</td>
              <td className="px-3 py-2">Where two straight route segments meet; the route bends here</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">ROW</td>
              <td className="px-3 py-2">Right-of-Way</td>
              <td className="px-3 py-2">The legal corridor where utilities are allowed; cross-sections show ROW boundaries</td>
            </tr>
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-mono">STA</td>
              <td className="px-3 py-2">Station (or Stationing)</td>
              <td className="px-3 py-2">Distance address along the route; STA 5+25 = 525 feet from start</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 font-semibold">Stationing — the route's address system</h3>
        <p className="mt-2">
          Every point on a design route has an address called a <strong>station</strong>.
          Stations are measured in feet from a starting reference point (station 0+00).
        </p>
        <p className="mt-2">
          The format is: <strong>[hundreds of feet] + [remaining feet]</strong>. So:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Station <strong>0+00</strong> = the starting point (0 feet)</li>
          <li>Station <strong>1+50</strong> = 150 feet from start</li>
          <li>Station <strong>4+75</strong> = 475 feet from start</li>
          <li>Station <strong>12+00</strong> = 1,200 feet from start (i.e., 1.2× 100 = 1,200)</li>
        </ul>
        <p className="mt-2">
          Staking plans list each proposed pole by station. When you're in the field,
          you measure from a known point (an existing stake, a property corner, a road
          intersection) and count feet along the route until you reach the station. That's
          where the pole goes.
        </p>

        <h3 className="mt-5 font-semibold">Offset — when the pole isn't on the centerline</h3>
        <p className="mt-2">
          Sometimes a pole can't go exactly on the route centerline — maybe the road
          shoulder is too narrow, or there's a ditch in the way. The design specifies an
          <strong> offset</strong>: a perpendicular distance from the centerline.
        </p>
        <p className="mt-2">
          "Offset 5 ft north" means: stand on the centerline at the design station, then
          walk 5 feet perpendicular to the route in the north direction. That's where the
          stake goes.
        </p>

        {/* ── FLASHCARDS ──────────────────────────────────────────────────── */}
        <Flashcard
          deckId="T07-L02"
          cards={[
            {
              id: 'T07-L02-fc-pnp',
              front: 'What is a plan-and-profile drawing?',
              back: 'A two-part engineering drawing showing the route from above (the plan, or "top view") and from the side (the profile, or "side elevation"). The plan shows the horizontal layout. The profile shows the vertical layout — how the ground rises and falls.',
            },
            {
              id: 'T07-L02-fc-stationing',
              front: 'What is stationing on a design plan?',
              back: 'A distance measurement along the design route centerline, expressed in feet from a reference point (station 0+00). Format: hundreds of feet + remainder. Station 3+75 means 375 feet from the start. Station 12+00 means 1,200 feet.',
            },
            {
              id: 'T07-L02-fc-offset',
              front: 'What is an offset in staking?',
              back: 'The perpendicular distance from the design route centerline to a specific feature (pole, stake, structure). An offset of "5 feet north" means the feature is 5 feet north of the centerline, not on it.',
            },
            {
              id: 'T07-L02-fc-pi',
              front: 'What is a PI (Point of Intersection) on a staking plan?',
              back: 'Point of Intersection — the point where two straight route segments (tangents) would meet if extended. At a PI, the route changes direction. On the plan view, a PI looks like a bend or corner in the route line.',
            },
            {
              id: 'T07-L02-fc-xsection',
              front: 'What is a cross-section drawing?',
              back: 'A drawing showing the route as if you sliced through it perpendicular to the direction of travel. Cross-sections show the ROW width, existing utilities, proposed conduit or pole placement, and any grade changes at that specific station.',
            },
            {
              id: 'T07-L02-fc-dim',
              front: 'What is a design intent mark?',
              back: 'A notation on a staking plan indicating the designer\'s intent at a specific location — expressed as stationing + offset + proposed attachment height. The staker finds this point on the ground, verifies conditions match the intent, and flags any mismatch via a call-out.',
            },
            {
              id: 'T07-L02-fc-contour',
              front: 'What is a contour line on a staking plan or topographic map?',
              back: 'A line connecting all points at the same elevation above sea level. Closely-spaced contour lines = steep terrain (elevation changes quickly). Widely-spaced contour lines = gentle slopes or flat terrain. On a profile view, contour spacing in the ground line tells the staker how steep the terrain is between poles — steep terrain can threaten cable clearances at midspan low points.',
            },
          ]}
        />
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Using Plans on the Ground</h2>

        <h3 className="mt-4 font-semibold">Step-by-step: locating a stake from a staking plan</h3>
        <p>
          Here's how you go from a design plan to a physical stake in the ground. Suppose
          your staking plan shows: <em>Pole 14 at STA 7+25, offset 3 ft south.</em>
        </p>
        <ol className="list-decimal pl-5 space-y-3 mt-2 text-sm">
          <li>
            <strong>Find your last known point.</strong> You staked Pole 13 at STA 6+00. That
            stake is still visible in the ground. Good starting point.
          </li>
          <li>
            <strong>Measure along the centerline.</strong> From Pole 13 at 6+00, you need
            to walk 7+25 − 6+00 = 125 feet further along the route centerline. Use a tape
            measure or a measuring wheel along the route direction.
          </li>
          <li>
            <strong>Apply the offset.</strong> At 125 feet from Pole 13, you're now at STA 7+25
            on the centerline. Walk 3 feet south (perpendicular to the route direction). That's
            your stake location.
          </li>
          <li>
            <strong>Verify the location.</strong> Check for any existing pole, obstacle, or
            terrain issue at this exact spot. Does anything prevent a pole from going here? If
            yes: call-out. If no: drive the stake.
          </li>
          <li>
            <strong>Record in staking notes.</strong> "Pole 14, STA 7+25, 3 ft south. Stake
            placed. Ground soft/clear. No obstacles."
          </li>
        </ol>

        <h3 className="mt-5 font-semibold">Reading the profile — terrain vs. design</h3>
        <p>
          The profile view shows how the design route crosses terrain. If the design shows a
          relatively flat profile and you arrive at the site to find a steep ravine, that's a
          significant mismatch between design and field. The profile also shows how the cable
          sag will clear the ground at each low point between poles.
        </p>
        <p className="mt-2">
          Key things to check on the profile:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-1 text-sm">
          <li>
            <strong>Ground elevation at each pole location.</strong> If the ground is significantly
            higher or lower than the profile shows, the pole height (and thus the sag) may be wrong.
          </li>
          <li>
            <strong>Low points between poles.</strong> NESC Rule 232 requires minimum clearance
            above roadways, waterways, and other surfaces at the cable's lowest point (maximum sag).
            If the terrain drops more than the profile shows, the clearance may be violated.
          </li>
          <li>
            <strong>PI locations on the ground.</strong> A PI shown on the plan must be located
            in the field. If the terrain at the PI doesn't allow the route to bend as designed
            (steep slope, property conflict), the designer needs to know.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Cross-sections — verifying pole placement at the roadway</h3>
        <p>
          Cross-sections are drawn at critical stations — typically anywhere the route crosses
          a road, parallels a ditch, or sits in a shared ROW. They show the staker:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-1 text-sm">
          <li>Where the pole is supposed to sit relative to the road edge and the ROW boundary</li>
          <li>What existing utilities are present at that station (gas, power, water — shown as labeled symbols)</li>
          <li>The horizontal and vertical clearances between the proposed pole/cable and everything else</li>
        </ul>
        <p className="mt-2">
          When you're at a cross-section station in the field, check whether the actual road
          edge and ROW boundary match what the drawing shows. If they don't — if the road
          was widened, if the ditch is deeper than shown — issue a call-out.
        </p>

        <div className="mt-4 p-4 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <p className="font-semibold text-amber-300 mb-1">Book vs. Field</p>
          <p className="text-slate-300/90">
            <strong>Book:</strong> Design plans are drawn from survey data collected at specific
            points along the route. The profile shows interpolated elevation between survey shots.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Field:</strong> Survey shots are typically taken every 100 to 200 feet on
            a standard route, and may be sparser in "easy" terrain. Anything that happens between
            shots isn't shown on the profile. A 15-foot ravine that falls exactly between two
            survey shots might not appear on the drawing at all. Stakers must visually walk the
            full span between poles, not just check the two endpoint stations — the terrain between
            is where surprises hide.
          </p>
          <p className="text-slate-300/90 mt-2">
            <strong>Risk:</strong> Assuming the profile is complete leads to missing mid-span
            terrain conflicts that only show up when the cable is strung and sag is measured.
            At that point, a clearance correction means re-stringing — expensive.
          </p>
        </div>
      </section>

      {/* ── ADVANCED ────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>When Field Conditions Diverge from Design</h2>

        <h3 className="mt-4 font-semibold">How significant does a mismatch need to be to require a call-out?</h3>
        <p>
          Not every terrain difference needs a call-out. Use engineering judgment calibrated
          to the downstream consequence:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2 text-sm">
          <li>
            <strong>Small elevation difference (≤2 ft):</strong> Typically within normal span
            and sag tolerance. Record it, no call-out unless it affects a minimum-clearance
            station.
          </li>
          <li>
            <strong>Moderate elevation difference (2–5 ft) at a clearance-critical station:</strong>
            Verify using the sag table in the design. If the sag at maximum load still clears
            by 2+ feet, no call-out required. If clearance margin is under 2 feet, call-out.
          </li>
          <li>
            <strong>Large elevation difference (&gt;5 ft) at any station:</strong> Always
            call-out. The designer needs to recalculate pole heights or add poles.
          </li>
          <li>
            <strong>PI location mismatch (&gt;10 ft from design):</strong> Always call-out.
            Route bends affect span lengths, loading, and permit alignment.
          </li>
        </ul>

        <h3 className="mt-5 font-semibold">Documenting the mismatch for the engineer</h3>
        <p>
          When you issue a call-out for a terrain mismatch, the engineer needs specific data
          to make a correction decision. Don't just write "terrain different." Write:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Station where the mismatch occurs</li>
          <li>Profile says: [elevation / grade] at that station</li>
          <li>Field shows: [measured elevation / grade] at that station</li>
          <li>Likely impact: ["clearance may be reduced at low-point," "span angle changes at PI," etc.]</li>
          <li>Photo attached: yes/no</li>
          <li>Staker recommendation (optional but valued): ["suggest adding intermediate pole at 7+50," "suggest lowering sag class"]</li>
        </ul>
        <p className="mt-2 text-sm text-slate-300/70">
          A staker who writes specific, data-rich call-outs saves the engineer an extra site
          visit and becomes the person engineers trust — which is how stakers move up.
        </p>
      </section>

      {/* ── LABELED LIST — plan-and-profile drawing elements ─────────────── */}
      <div className="lesson-callout">
        <h4>Reading a Staking Plan — Key Elements to Find in the Field</h4>
        <ol>
          <li>
            <strong>Stationing ruler</strong> — The horizontal scale at the top of the plan view.
            Stations are marked every 100 feet. Find your current station on this ruler, then look
            down to the plan view to see what the route is doing at that point. Match to your field
            measurement from the last known stake.
          </li>
          <li>
            <strong>Pole symbol</strong> — A small circle or "X" on the plan view marking a
            proposed pole location. Each symbol has a label: pole number, station, and offset (if
            any). Find it on the ground by measuring the station from a reference point and
            applying the offset.
          </li>
          <li>
            <strong>PI (Point of Intersection)</strong> — Where two route tangents meet; the plan
            shows a "kink" in the route line here. In the field, find the PI by measuring from
            both tangent directions. A stake or reference mark here helps the construction crew
            follow the route change.
          </li>
          <li>
            <strong>Ground line (profile view)</strong> — The solid irregular line on the profile
            view — this is the terrain as surveyed. Compare it to the ground you're actually
            standing on. If the terrain you see is significantly higher or lower than this line,
            issue a call-out.
          </li>
          <li>
            <strong>Cable line (profile view)</strong> — The straight or slightly curved line
            above the ground line — this is the cable's planned path. The vertical gap between the
            cable line and the ground line is the clearance. If terrain is higher than shown,
            clearance shrinks. Clearance below NESC Rule 232 minimums is a serious call-out.
          </li>
          <li>
            <strong>Cross-section station</strong> — A tick mark on the plan indicating where a
            cross-section drawing was taken. At this station in the field, the cross-section shows
            you the exact ROW width, road edge, pole placement, and existing utility separations.
            Check whether field conditions match.
          </li>
        </ol>
      </div>

      {/* ── BRANCHING SCENARIO ──────────────────────────────────────────── */}
      <BranchingScenario
        title="Field Scenario: Terrain Diverges from Profile"
        description="You're staking a 5-mile aerial route. The design profile shows relatively flat terrain with one creek crossing. You reach station 2+00 and find the ground drops sharply — a 20-foot ravine where the profile shows only a 5-foot grade change. What do you do?"
        initialNode="start"
        nodes={{
          start: {
            text: 'Station 2+00 on the design profile shows a gentle 5-foot grade change at a creek. In the field you find a 20-foot ravine — the creek has cut much deeper than the survey captured. The design assumes one span over the creek. What\'s your next move?',
            choices: [
              { label: 'Stake the pole locations as designed and let construction figure it out.', next: 'stake-as-designed' },
              { label: 'Move the entry and exit poles down-slope 50 feet each to keep them on terrain.', next: 'move-poles' },
              { label: 'Photograph the ravine, measure the actual elevation drop, and issue a call-out with specific data for the engineer.', next: 'callout' },
            ],
          },
          'stake-as-designed': {
            text: 'You stake as designed. The construction crew shows up, sets the poles, and strings the cable. But the ravine drops 20 feet below the profile assumption. At maximum sag (temperature 120°F, heavy load), the cable hangs 18 feet above the creek floor — but NESC Rule 232 requires 17.5 feet above waterways for communication cables. Barely OK? Maybe. But the permit required 20 feet per the local county\'s road-over-water clearance overlay. The permit is violated. Now the engineer is on-site fixing a problem the staker could have caught for $0.',
            choices: [
              { label: 'Start over — go back and see what the right call-out looked like.', next: 'callout' },
            ],
          },
          'move-poles': {
            text: 'You move the poles 50 feet each. The new span lengths don\'t match the design — sag tables were calculated for the original span. The attachment heights may also be wrong for the new terrain. Worse, the new pole locations may cross a property line the design carefully avoided. You\'ve essentially redesigned the route in the field without engineering authority. The engineer is frustrated; the design must be revised and re-permitted. Time and cost increase.',
            choices: [
              { label: 'Understood — see the right approach.', next: 'callout' },
            ],
          },
          callout: {
            text: 'You photograph the ravine from both sides and from below (showing the full depth). You measure the actual elevation drop with your laser measurer: 19.5 feet from design grade to ravine floor. Your staking note reads: "STA 2+00, creek crossing. Profile shows 5-ft grade change; field measures 19.5-ft drop to creek floor. Span clearance at maximum sag may be insufficient — requires engineer review before staking. Photos attached. Recommend site visit or as-built survey." You flag the station and continue staking the rest of the route. The engineer reviews, adds an intermediate pole mid-ravine, and re-calculates sag. The solution costs one extra pole. Total field correction cost: ~$1,500. Compare to discovering this during construction or after string: $15,000+.',
            choices: [],
            isEnd: true,
            feedback: 'Correct approach. Stakers identify field-design mismatches early and document them with specific data. The staker\'s job is not to solve the engineering problem — it\'s to give the engineer the information to solve it efficiently. A good call-out with photos, measurements, and a station reference is worth its weight in construction budget.',
          },
        }}
      />

      {/* ── PER-LESSON QUIZ ─────────────────────────────────────────────── */}
      <Quiz
        title="T07.L02 Check — Reading Plans in the Field"
        mode="multiple-choice"
        questions={[
          {
            id: 'T07-L02-Q1',
            type: 'mc',
            prompt: 'A design plan shows Pole 8 at station 5+50 with a 4-foot south offset. Standing at the last known reference stake at station 4+00, how far do you walk along the route centerline to reach Pole 8\'s station?',
            choices: [
              '50 feet',
              '100 feet',
              '150 feet',
              '550 feet',
            ],
            answerIndex: 2,
            explanation:
              'Station 5+50 = 550 feet from start. Station 4+00 = 400 feet from start. 550 − 400 = 150 feet. After walking 150 feet along the centerline, you\'re at STA 5+50. Then walk 4 feet perpendicular to the route in the south direction to reach the actual stake location.',
          },
          {
            id: 'T07-L02-Q2',
            type: 'mc',
            prompt: 'What does the profile view of a plan-and-profile drawing show?',
            choices: [
              'The bird\'s-eye (top-down) view of the route and pole locations',
              'The side-view elevation of the terrain and cable path, showing how the ground rises and falls along the route',
              'The cross-section of the ROW at each critical station',
              'The GPS coordinates of each pole location',
            ],
            answerIndex: 1,
            explanation:
              'The profile view is the side-view (elevation) of the route. It shows terrain rises and falls, the cable\'s planned path above the ground, and clearance at each span. The plan view (top-down) is the other half of the plan-and-profile drawing.',
          },
          {
            id: 'T07-L02-Q3',
            type: 'mc',
            prompt:
              'You arrive at a PI location and find the terrain at that point slopes 18% instead of the 5% slope shown on the profile. What is your correct action?',
            choices: [
              'Ignore it — small terrain differences are always acceptable',
              'Redesign the route angle in the field to match the actual terrain',
              'Issue a call-out with the actual slope measurement, your station reference, and a photo',
              'Move the PI to a flat area without informing the engineer',
            ],
            answerIndex: 2,
            explanation:
              'A PI slope mismatch of this magnitude affects span geometry, loading calculations, and potentially permit compliance. The staker\'s job is to document the mismatch with specific data (actual slope, station, photos) and let the engineer decide on the correction. Redesigning or moving the PI without authority creates liability.',
          },
          {
            id: 'T07-L02-Q4',
            type: 'fill-in-blank',
            prompt:
              'A design plan shows a point where two straight route segments would meet if extended — the route changes direction here. This point is called a ____.',
            answer: 'PI',
            answerDisplay: 'PI (Point of Intersection)',
            explanation:
              'PI stands for Point of Intersection. On the plan view, it appears as a bend or "kink" in the route line. The staker must locate the PI in the field and may stake it as a reference for construction crew navigation.',
          },
        ]}
      />

    </LessonLayout>
  );
}
