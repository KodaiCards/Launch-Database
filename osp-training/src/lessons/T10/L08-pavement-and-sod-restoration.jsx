// T10.L08 — Pavement and Sod Restoration
// Working lesson: backfill sequence, compaction lifts, pavement match, sod survivability
// Source: FDOT 18202 + VDOT IIM-LD-230 + RUS 1751F-635 + general contractor practice

import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
import Flashcard from '../../components/Flashcard.jsx';

export const meta = {
  id: 'T10.L08',
  course_id: 'T10',
  title: 'Pavement and Sod Restoration',
  order: 8,
  lesson_type: 'working',
  prerequisites: ['T10.L03', 'T10.L04', 'T09.L06'],
  learning_objectives: [
    'Describe the trench backfill sequence from bedding sand through surface course',
    'Explain why compaction must be done in lifts rather than a single deep fill',
    'State common AHJ requirements for pavement match including surface type and minimum patch width',
    'Describe the sod restoration process and the 30-day survivability inspection requirement',
    'Explain how inadequate compaction leads to trench settlement and contractor liability',
  ],
  estimated_minutes: 20,
  vocabulary_introduced: [
    'trench backfill',
    'pavement match',
    'sod restoration',
    'proctor density',
    'ghost trench',
  ],
  key_terms: [
    {
      term: 'trench backfill',
      definition:
        'The material placed in a trench after conduit installation, in a defined sequence: bedding sand (directly under and around the conduit) → embedment zone (sand from conduit top to 6 inches above) → primary backfill (native soil in compacted lifts) → sub-base (crushed stone or gravel) → base course → surface course. Each layer serves a specific structural role.',
    },
    {
      term: 'pavement match',
      definition:
        'The requirement that trench restoration material and finish match the adjacent undisturbed pavement in type (asphalt-to-asphalt, concrete-to-concrete), texture, and minimum patch width. Most state DOT permits specify minimum patch dimensions and require the contractor to feather or saw-cut the pavement edges for a clean joint.',
    },
    {
      term: 'sod restoration',
      definition:
        'Replacement of grass cover and topsoil in non-paved disturbed areas. Requires removing and stockpiling topsoil during excavation, returning topsoil as the top backfill layer, installing sod or seed and mulch, and maintaining irrigation until the vegetation establishes. Most permits require a 30-day survivability inspection by the AHJ.',
    },
    {
      term: 'proctor density',
      definition:
        'A measure of soil compaction expressed as a percentage of the maximum dry density determined by the Proctor laboratory test. Most AHJ permits require 95% Proctor density in the backfill zone — meaning the compacted backfill must reach 95% of the density achievable under controlled laboratory conditions. Measured with a nuclear density gauge or sand cone test by a geotechnical inspector.',
    },
    {
      term: 'ghost trench',
      definition:
        'The visible road-surface depression that appears 3–12 months after construction when trench backfill settles unevenly. Caused by insufficient compaction — either not compacting in lifts, not achieving the required density per lift, or using expansive native clay that swells and shrinks with moisture. A ghost trench is a QA failure and typically a warranty callback for the contractor.',
    },
  ],
  vocabulary_assumed: [
    { term: 'open-cut trench', source_lesson_id: 'T06.L01' },
    { term: 'AHJ', source_lesson_id: 'T09.L01' },
    { term: 'ROW', source_lesson_id: 'T01.L08' },
    { term: 'encroachment permit', source_lesson_id: 'T09.L06' },
    { term: 'bedding sand', source_lesson_id: 'T10.L03' },
    { term: 'compaction', source_lesson_id: 'T10.L03' },
    { term: 'warning tape', source_lesson_id: 'T10.L03' },
  ],
};

export const vocabulary_introduced = meta.vocabulary_introduced;

export const key_terms = meta.key_terms;

const restorationScenarioSteps = [
  {
    id: 'start',
    prompt:
      'You\'re the foreman backfilling a 400-ft trench through a rural county road. The foreman of a second crew is behind schedule. He tells you: "Just fill it in one shot and compact the whole thing once at the top. The inspector won\'t know the difference and it\'ll be dry by morning."',
    question: 'Do you fill in one shot?',
    choices: [
      {
        id: 'no',
        text: 'No — fill in 6-8 inch lifts with compaction between each lift, as required',
        nextId: 'lift-correct',
      },
      {
        id: 'yes',
        text: 'Yes — time is short, the road will look fine tomorrow morning',
        nextId: 'lift-wrong',
      },
    ],
  },
  {
    id: 'lift-correct',
    prompt:
      'Correct. You backfill in 6-8 inch compacted lifts per the permit specification. The job takes 3 additional hours. The road surface looks good at final inspection.',
    question: 'Six months later, the county road engineer calls. There is a 2-inch depression running 60 ft along your trench line. Who is liable?',
    choices: [
      {
        id: 'not-liable',
        text: 'You may still be liable — the settlement suggests a compaction deficiency despite your lift method',
        nextId: 'settlement-cause',
      },
      {
        id: 'not-your-problem',
        text: 'The county\'s road maintenance crew — you followed the spec, so it\'s their problem',
        nextId: 'end',
      },
    ],
  },
  {
    id: 'lift-wrong',
    prompt:
      'STOP. Compacting in one lift at a 36-inch trench depth doesn\'t work. The compactor can only consolidate the top 6-8 inches of material. Everything below remains loose. Within 6 months, traffic loads will push the loose fill down, creating a ghost trench.',
    question: 'The ghost trench appears 8 months later. The county sends you a warranty repair notice. What\'s your exposure?',
    choices: [
      {
        id: 'full-liability',
        text: 'Full liability — the contractor is responsible for the settlement because proper compaction was not performed',
        nextId: 'end',
      },
      {
        id: 'no-liability',
        text: 'No liability — settlement after 90 days is natural and outside contractor warranty',
        nextId: 'end',
      },
    ],
  },
  {
    id: 'settlement-cause',
    prompt:
      'Even with correct lift methodology, settlement can occur if: (a) native clay backfill was used instead of select granular material, (b) compaction testing was not performed at each lift, (c) the material was placed at the wrong moisture content. Your documentation (compaction test results per lift) determines your liability exposure.',
    question: 'Review complete.',
    choices: [],
  },
  {
    id: 'end',
    prompt:
      'Key takeaways: Compaction in lifts is the only way to achieve required density throughout the fill depth. Ghost trench = warranty callback + potential liability. Compaction test documentation is your defense. Select granular backfill outperforms native clay in preventing settlement.',
    question: 'Review complete.',
    choices: [],
  },
];

export default function T10L08_PavementSodRestoration() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ─────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          When you dig a trench through someone's road or yard, you have an obligation to
          put it back in the same condition it was before — or better. That means more than
          just filling the hole. It means filling it in layers, compacting each layer properly,
          and finishing with the right surface material.
        </p>
        <p className="mt-2">
          When crews skip the compaction process — filling the trench in one shot and packing
          it once at the top — the road or ground settles months later. The trench line becomes
          visible as a depression. That depression is called a ghost trench, and it's a direct
          indictment of how you backfilled. The county road engineer will call you, and the
          repair is on your warranty.
        </p>

        {/* Flashcards */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Key Terms</h3>
          <Flashcard
            deckId="T10-L08"
            cards={[
              {
                id: 'T10-L08-fc-backfill',
                front: 'What is the correct trench backfill sequence from bottom to top?',
                back: 'Bedding sand (under and around conduit) → embedment zone (sand to 6 in above conduit) → warning tape (12 in above conduit) → primary backfill (native or select fill in compacted lifts) → sub-base (crushed stone) → base course → surface course (pavement or sod to match adjacent).',
              },
              {
                id: 'T10-L08-fc-pavement-match',
                front: 'What is pavement match and why does the surface type matter?',
                back: 'The requirement to restore the trench surface to match adjacent undisturbed pavement type (asphalt-to-asphalt, concrete-to-concrete), texture, and minimum patch width. Mismatched surface types fail at the joint due to different thermal expansion and load response characteristics.',
              },
              {
                id: 'T10-L08-fc-proctor',
                front: 'What is Proctor density and what percentage is typically required for trench backfill?',
                back: 'A measure of soil compaction as a percentage of the maximum dry density from a laboratory Proctor test. Most AHJ permits require 95% Proctor density — the compacted backfill must reach 95% of the maximum achievable laboratory density. Measured with a nuclear density gauge or sand cone test.',
              },
              {
                id: 'T10-L08-fc-ghost-trench',
                front: 'What is a ghost trench and what causes it?',
                back: 'A visible road-surface depression appearing 3–12 months after construction when backfill settles. Caused by insufficient compaction — not filling in lifts, not achieving required density per lift, or using expansive native clay. A warranty callback for the contractor.',
              },
              {
                id: 'T10-L08-fc-sod-restoration',
                front: 'What does sod restoration require and what is the survivability inspection?',
                back: 'Replacement of grass cover and topsoil in non-paved disturbed areas. Process: remove and stockpile topsoil during excavation, return topsoil as the top backfill layer, install sod or seed and mulch, maintain irrigation until vegetation establishes. Most permits require a 30-day survivability inspection by the AHJ — the vegetation must still be alive and healthy at 30 days.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>The Backfill Sequence Step by Step</h2>

        <h3 className="mt-4 font-semibold">Layer 1 — Bedding sand (under and around conduit)</h3>
        <p>
          3–4 inches of screened sand or pea gravel under the conduit and alongside it
          (the "haunch"). Provides uniform support and cushions the conduit from point loading
          on rocks or native soil irregularities.
        </p>

        <h3 className="mt-4 font-semibold">Layer 2 — Embedment zone (above conduit to 6 inches over)</h3>
        <p>
          Continue the clean sand or granular fill from conduit top to 6 inches above the
          conduit crown. This embedment zone protects the conduit from the first compaction
          lift directly above.
        </p>

        <h3 className="mt-4 font-semibold">Warning tape</h3>
        <p>
          Installed at 12 inches above conduit during backfill (OCC 206-4) or at the
          permit-specified depth from finished grade. See T10.L03.
        </p>

        <h3 className="mt-4 font-semibold">Layer 3 — Primary backfill (compacted lifts)</h3>
        <p>
          From the top of the embedment zone to sub-base level, fill with native backfill
          (or select granular material per the permit) in <strong>6–8 inch lifts</strong>.
          After each lift is placed, compact it with a plate compactor or jumping jack until
          it reaches the required density (typically 95% Proctor). Then place the next lift.
        </p>
        <p className="mt-2 p-3 bg-amber-900/30 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
          <strong>Why lifts?</strong> A plate compactor can only consolidate the top 6–8 inches
          of loose fill effectively. Below that, the vibration doesn't transmit enough energy
          to compact. If you dump 36 inches of fill and compact once at the top, the bottom
          24–30 inches remains loose. Traffic loads then consolidate it slowly over months,
          creating the ghost trench.
        </p>

        <h3 className="mt-4 font-semibold">Layer 4 — Sub-base (crushed aggregate)</h3>
        <p>
          6–12 inches of crushed stone or dense-graded aggregate above the primary backfill.
          Provides a stable, drainage layer under the base course. Depth and material spec
          per the permit or road standard.
        </p>

        <h3 className="mt-4 font-semibold">Layer 5 — Surface course (pavement match or sod)</h3>
        <p>
          For paved surfaces: asphalt or concrete to match the adjacent undisturbed surface.
          Most DOT permits require a minimum patch width (often 2 ft wider than the trench
          on each side), saw-cut edges for a clean joint, tack coat for asphalt adhesion,
          and a specific asphalt mix type. Concrete trench patches in concrete pavements
          require control joints.
        </p>
        <p className="mt-2">
          For unpaved areas: return the topsoil layer (stockpiled during excavation) as the
          final 4–6 inches, then install sod or seed and mulch per the permit's revegetation
          requirements. Most permits include a 30-day survivability inspection — the AHJ
          inspector returns 30 days later to verify the vegetation has established. If it
          hasn't, the contractor is required to re-sod at their own expense.
        </p>

        {/* Branching Scenario */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Field Scenario: Backfill Decision</h3>
          <BranchingScenario
            id="T10-L08-scenario-backfill"
            title="To Lift or Not to Lift"
            steps={restorationScenarioSteps}
            startId="start"
          />
        </div>

        {/* Quiz */}
        <div className="mt-6">
          <Quiz
            id="T10-L08-quiz-1"
            questions={[
              {
                id: 'q1',
                text: 'Your permit requires pavement restoration to "match existing surface type and minimum 24-inch patch width on each side of the trench." The existing road is concrete with a 2-inch asphalt overlay. The trench is 10 inches wide. What is the minimum finished patch width and what surface type must be used?',
                type: 'multiple-choice',
                options: [
                  { id: 'a', text: '10-inch width (trench width only); any surface type that matches the color' },
                  { id: 'b', text: '58 inches total (10 + 24 each side); original concrete surface type (the permit says "match existing")' },
                  { id: 'c', text: '58 inches total; asphalt overlay matches the top surface — that\'s the visible surface type' },
                  { id: 'd', text: '48 inches total (12 + 12 + 24 trench); either concrete or asphalt is acceptable' },
                ],
                correctId: 'b',
                explanation:
                  'Minimum patch width = trench (10 in) + 24 in each side = 58 inches total. "Match existing surface type" means concrete — the visible asphalt overlay is a wearing course, but the structural pavement type is concrete. A concrete patch matched to the existing structural section provides the same long-term performance. An asphalt patch over an asphalt overlay on a concrete base would have different thermal response and load distribution than the adjacent pavement — it will fail at the joint sooner.',
              },
            ]}
          />
        </div>
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Compaction Testing and Settlement Liability</h2>

        <h3 className="mt-4 font-semibold">Compaction testing: the documentation that protects you</h3>
        <p>
          On DOT-permitted and RUS-financed projects, geotechnical compaction testing
          (nuclear density gauge or sand cone) is typically required at specified intervals
          (e.g., every 250 ft per lift in the primary backfill zone). The test results are
          recorded on compaction reports and become part of the project closeout package.
        </p>
        <p className="mt-2">
          A complete set of compaction reports showing passing densities at every test point
          is the contractor's primary defense when a ghost trench claim is filed. If you
          can show compaction test results for every 250-ft station at every lift — and the
          tests passed — you've established that the compaction was performed to specification.
          A settlement claim that arises after that is either a materials defect (wrong
          backfill material) or a sub-base failure outside the trench zone.
        </p>

        <h3 className="mt-4 font-semibold">Native clay vs. select granular backfill</h3>
        <p>
          Many AHJ permits allow native backfill (soil excavated from the trench) to be used
          as primary backfill above the embedment zone, as long as it's compacted to 95%
          Proctor. In theory, this works. In practice, native clay (common in the Southeast)
          shrinks in dry weather and swells in wet weather — creating a seasonal ghost trench
          that opens in summer and closes in winter.
        </p>
        <p className="mt-2">
          Select granular backfill (clean gravel or crushed stone) doesn't exhibit the
          swell/shrink cycle. On jobs where the permit allows either option, select granular
          material is the better long-term choice even though it costs more. On DOT permits
          where select granular is mandatory in the roadway zone, this isn't optional —
          it's a specification requirement.
        </p>
      </section>

    </LessonLayout>
  );
}
