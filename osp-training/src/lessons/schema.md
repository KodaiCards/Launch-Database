# Lesson Schema — OSP Training Rewrite (OSP-RW.1B)

## Overview

Each lesson is a single JSX file under `osp-training/src/lessons/T<NN>/L<NN>.<short-slug>.jsx`.

File naming convention: `T<topic-id>/L<two-digit-order>.<kebab-slug>.jsx`

Examples:
- `T02/L01.fiber-vocabulary.jsx`
- `T05/L06.loading-districts.jsx`
- `T11/L04.fusion-splicing-step-by-step.jsx`
- `C01/L01.networking-blueprints-intro.jsx`

---

## Named Export: `meta`

Every lesson file must export a `meta` object as a named export. `LessonLayout` reads this at render time.

```jsx
export const meta = {
  // Lesson identifier — must match file path (e.g. "T02.L01")
  id: 'T02.L01',

  // Parent topic identifier from ARCH.md Section 2 (e.g. "T02", "C01")
  course_id: 'T02',

  // Human-readable lesson title (shown in header + nav)
  title: 'Why Light Travels in Glass',

  // 1-based position within the topic (drives "next lesson" navigation)
  order: 1,

  // Lesson type — controls badge color + quiz threshold logic
  // 'foundation'           : first-contact introductory content
  // 'working'              : applied/procedural content — the main body of lessons
  // 'advanced'             : deeper specialist content (optional for most learners)
  // 'capstone-quiz'        : end-of-topic assessment (no body content — pure Quiz)
  // 'mock-exam'            : timed certification practice exam
  // 'hands-on-walkthrough' : guided interactive walkthrough / field simulation
  lesson_type: 'foundation',

  // Array of lesson IDs that must be completed before this lesson unlocks.
  // Use the full dotted form: "T01.L01", "T01.L02".
  // Empty array = always unlocked (root lessons).
  // Source: ARCH.md Section 3 DAG adjacency list — resolve to lesson IDs
  // by taking the first lesson of each required topic (e.g., T01 prereq → "T01.L01").
  prerequisites: [],

  // Terms introduced IN this lesson (strings matching the ARCH.md vocab sets).
  // Used to build per-lesson flashcard decks and validate no forward-references.
  vocabulary_introduced: ['total internal reflection', 'core', 'cladding', 'NA'],

  // Terms this lesson ASSUMES the reader already knows (defined in a prior lesson).
  // Authoring agents: verify every assumed term has a source_lesson_id.
  // Red teams: flag any assumed term that lacks a source or references a later lesson.
  vocabulary_assumed: [
    { term: 'OSP', source_lesson_id: 'T01.L01' },
    { term: 'SMF', source_lesson_id: 'T01.L08' },
  ],

  // Estimated completion time in minutes (sum of reading + all interactive elements).
  // Source: ARCH.md Section 4 lesson table — use the listed value.
  estimated_minutes: 20,
};
```

---

## Default Export: React Component

Every lesson file must export a React component as the default export. The component receives no props — all content is self-contained. `LessonLayout` wraps the component automatically via `LessonRouter`.

```jsx
import React from 'react';
import LessonLayout from '../../components/LessonLayout.jsx';
import Quiz from '../../components/primitives/Quiz.jsx';
// Import other primitives as needed (all are default exports):
// import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx';
// import WorkedExample from '../../components/primitives/WorkedExample.jsx';
// import BranchingScenario from '../../components/primitives/BranchingScenario.jsx';
// import HotSpot from '../../components/primitives/HotSpot.jsx';
// import Sortable from '../../components/primitives/Sortable.jsx';
// import SliderExploration from '../../components/primitives/SliderExploration.jsx';
// import SideBySide from '../../components/primitives/SideBySide.jsx';
// import TimelineSequence from '../../components/primitives/TimelineSequence.jsx';
// import { Flashcard } from '../../components/Flashcard.jsx';

export const meta = { /* ... as above ... */ };

export default function T02L01_WhyLightTravelsInGlass() {
  return (
    <LessonLayout meta={meta}>

      {/* ── FOUNDATIONS ──────────────────────────────────────────────
          Plain-English entry point. Every acronym defined on first use.
          Real-world analogy before the technical definition.
          No assumed background beyond T01 vocabulary.
      ────────────────────────────────────────────────────────────── */}
      <section data-tier="foundations">
        <h2>In Plain English</h2>
        <p>
          Think of a flashlight shining into a glass rod. If the angle is right,
          the light bounces back and forth inside the glass instead of leaking out
          — it's trapped. That trapping effect is called <strong>total internal
          reflection</strong>, and it's why fiber optic cable works at all.
        </p>
        {/* ... lesson body ... */}
      </section>

      {/* ── WORKING ──────────────────────────────────────────────────
          Applied / procedural content. Standards refs by number.
          Every formula unpacked step-by-step.
          Worked examples with substitutions shown.
      ────────────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>How It Works — The Physics</h2>
        {/* ... */}
      </section>

      {/* ── ADVANCED ─────────────────────────────────────────────────
          Optional specialist depth. Can be skipped by foundations-only readers.
          Marked with the 'advanced' tier badge in LessonLayout.
      ────────────────────────────────────────────────────────────── */}
      <section data-tier="advanced">
        <h2>Going Deeper</h2>
        {/* ... */}
      </section>

      {/* ── KEY TERMS ────────────────────────────────────────────────
          Flashcard deck for vocabulary_introduced terms.
          One <Flashcard> per term. Match vocabulary_introduced in meta.
      ────────────────────────────────────────────────────────────── */}
      {/* <Flashcard cards={[ ... ]} /> */}

      {/* ── PRACTICE SET ─────────────────────────────────────────────
          Quiz elements. One or more <Quiz> components.
          Every correct answer must be independently derivable.
          Distractors must be plausible misderivations.
          See src/components/primitives/__examples__/Quiz.example.jsx
          for full usage examples of all three modes.
      ────────────────────────────────────────────────────────────── */}
      <Quiz
        title="Fiber Physics Check"
        mode="multiple-choice"
        questions={[
          {
            id: 'T02-L01-Q1',
            type: 'mc',
            prompt: 'What phenomenon keeps light inside a fiber optic cable?',
            choices: [
              'Absorption by the cladding',
              'Total internal reflection',
              'Electromagnetic shielding',
              'Pressure from the jacket',
            ],
            answerIndex: 1,
            explanation:
              'Total internal reflection occurs when light hits the core-cladding boundary at an angle greater than the critical angle, causing it to reflect back into the core rather than escaping.',
          },
        ]}
        onComplete={result => { /* handle { score, total, answers } */ }}
      />

    </LessonLayout>
  );
}
```

---

## Content Tier Markers

Body content is divided into three tiers using `data-tier` on `<section>` elements:

| Attribute value | Purpose | Required? |
|---|---|---|
| `foundations` | Plain-English intro, analogies, definitions. All readers see this. | Yes |
| `working` | Applied content, formulas, procedures, standards refs. Main body. | Yes |
| `advanced` | Specialist depth. Optional for most learners. | No |

`LessonLayout` applies accordion/collapsible styling per tier. The `advanced` tier renders collapsed by default and can be expanded by the reader.

---

## Interactive Element Contracts

All 9 primitives are **default exports**. Use `import PrimitiveName from '...'` (not named import).

| Primitive | Import (default) | Required props |
|---|---|---|
| `<Quiz>` | `import Quiz from '../../components/primitives/Quiz.jsx'` | `title`, `mode` (`'multiple-choice'`/`'drag-match'`/`'fill-in-blank'`), `questions` array (see Quiz.example.jsx), `onComplete?` |
| `<AnnotatedDiagram>` | `import AnnotatedDiagram from '../../components/primitives/AnnotatedDiagram.jsx'` | `src`, `alt`, `hotPoints` array `[{x, y, label, explanation}]` |
| `<WorkedExample>` | `import WorkedExample from '../../components/primitives/WorkedExample.jsx'` | `title`, `formula`, `variables` array, `steps` fn, `sanityCheck` fn |
| `<BranchingScenario>` | `import BranchingScenario from '../../components/primitives/BranchingScenario.jsx'` | `scenarioId`, `title`, `startNodeId`, `nodes` FSM object |
| `<HotSpot>` | `import HotSpot from '../../components/primitives/HotSpot.jsx'` | `imageUrl`, `alt`, `regions` array, `mode` (`'challenge'`/`'explore'`) |
| `<Sortable>` | `import Sortable from '../../components/primitives/Sortable.jsx'` | `title`, `items` array `[{id, label}]`, `correctOrder` array of ids |
| `<SliderExploration>` | `import SliderExploration from '../../components/primitives/SliderExploration.jsx'` | `title`, `variables` array, `compute` fn |
| `<SideBySide>` | `import SideBySide from '../../components/primitives/SideBySide.jsx'` | `title`, `leftLabel`, `rightLabel`, `rows` array |
| `<TimelineSequence>` | `import TimelineSequence from '../../components/primitives/TimelineSequence.jsx'` | `title`, `events` array `[{id, label, detail}]` |
| `<Flashcard>` | `import { Flashcard } from '../../components/Flashcard.jsx'` | `cards` array `[{front, back}]` |

---

## How `meta` + Body Interact with `LessonLayout`

1. `LessonRouter` resolves the lesson file path from `lessonFileIndex` in `course-catalog.js`,
   then calls the matching loader from `import.meta.glob('../lessons/**/*.jsx')`.
2. The loader returns the module. `LessonRouter` reads `mod.default` (the lesson component)
   and renders it directly — it does **not** extract or pass `meta` itself.
3. The lesson's default-export component renders `<LessonLayout meta={meta}>` internally,
   using its own named `meta` export. All wiring of `meta` to `LessonLayout` happens inside
   the lesson file, not in `LessonRouter`.
4. `LessonLayout` uses `meta` to render: header (title, type badge, est. time), prereq links,
   tier accordion wrappers, and footer nav (next/back).
5. The `useProgress(meta.id)` hook in `LessonLayout` stubs progress persistence — wired to
   the real API in OSP-RW.2.

---

## File Naming Examples (all 22 topics)

```
src/lessons/
  T01/  L01.osp-vs-isp.jsx ... L10.t01-capstone-quiz.jsx
  T02/  L01.why-light-travels-in-glass.jsx ... L12.t02-capstone-quiz.jsx
  T03/  L01.loose-tube-vs-ribbon.jsx ... L12.t03-capstone-quiz.jsx
  T04/  L01.site-walk.jsx ... L10.t04-capstone-quiz.jsx
  T05/  L01.what-nesc-is.jsx ... L15.t05-capstone-quiz.jsx
  T06/  L01.hdd-vs-open-cut.jsx ... L12.t06-capstone-quiz.jsx
  T07/  L01.what-a-staker-does.jsx ... L10.t07-capstone-quiz.jsx
  T08/  L01.otmr-vs-multi-party.jsx ... L12.t08-capstone-quiz.jsx
  T09/  L01.permitting-layer-cake.jsx ... L12.t09-capstone-quiz.jsx
  T10/  L01.call-811.jsx ... L12.t10-capstone-quiz.jsx
  T11/  L01.why-we-color-code-fibers.jsx ... L15.t11-capstone-quiz.jsx
  T12/  L01.tier-1-vs-tier-2.jsx ... L15.t12-capstone-quiz.jsx
  T13/  L01.inspector-role.jsx ... L10.t13-capstone-quiz.jsx
  T14/  L01.why-we-ground.jsx ... L12.t14-capstone-quiz.jsx
  T15/  L01.outage-response.jsx ... L10.t15-capstone-quiz.jsx
  T16/  L01.as-built-vs-as-designed.jsx ... L10.t16-capstone-quiz.jsx
  T17/  L01.cost-data-problem.jsx ... L10.t17-capstone-quiz.jsx
  T18/  L01.osha-1910-268-overview.jsx ... L10.t18-capstone-quiz.jsx
  C01/  L01.networking-blueprints-intro.jsx ... L08.c01-capstone-quiz.jsx
  C02/  L01.rcdd-core-intro.jsx ... L08.c02-capstone-quiz.jsx
  C03/  L01.data-center-standards-intro.jsx ... L08.c03-capstone-quiz.jsx
  C04/  L01.cert-exam-strategy.jsx ... L12.c04-capstone-quiz.jsx
```

---

## Authoring Rules (inherited from agent-protocol.md)

- No AI references anywhere in lesson content.
- Every correct answer independently derivable.
- Every assumed term has a `source_lesson_id` in `vocabulary_assumed`.
- Book vs. field practice distinction maintained throughout.
- All math steps shown — no skipped intermediates.
- All acronyms defined on first use within each lesson.
- Citations: use `[confirm edition]` for standards where edition is in flux.
- `BranchingScenario` `scenarioId` must be unique per lesson instance.
  Convention: `${topicId}-L${lessonOrder}-scenario-${ordinal}` (e.g. `T05-L06-scenario-1`).
  Do NOT use generic names like `"scenario-1"` — localStorage key is
  `osp-scenario-${scenarioId}` and will bleed state across lessons if reused.
