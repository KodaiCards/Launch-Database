# Runtime Error Audit — OSP Training Primitives
**Date:** 2026-05-20  
**Scope:** All 9 interactive primitives + ~254 lesson files  
**Method:** Static analysis — prop contract mapping + grep-based usage survey

---

## Section 1 — Primitive Contracts

| Primitive | Required props (crash if missing/wrong) | Defensive guards present | Guards MISSING |
|---|---|---|---|
| **Quiz** | `questions` array; MC needs `choices`/`options`; DragMatch needs `items`/`targets`/`correctMap`; FillInBlank needs `prompt` with `____` | `q.choices || q.options || []`; empty-array fallback with warning; `node.choices ?? []` | No guard on `questions` being undefined (line 43 crashes); `DragMatch` crashes on `q.items.filter` if `items` undefined (line 209); `FillInBlank` crashes on `q.prompt.split` if `prompt` undefined (line 335) |
| **WorkedExample** | `variables` array (required at mount), `formula`/`steps`/`sanityCheck` functions | `formula`/`steps`/`sanityCheck` each wrapped in try/catch | No guard on `variables` — line 48 `variables.map(...)` crashes immediately if undefined |
| **BranchingScenario** | `startNodeId`, `nodes` object | `node.choices ?? []`; missing-node renders error div | No guard on `nodes` — `nodes[currentNodeId]` crashes if `nodes` prop is absent |
| **Sortable** | `items` array, `correctOrder` array | None | No guard on `correctOrder` — line 34 `correctOrder.indexOf(a.id)` crashes if undefined |
| **TimelineSequence** | `events` array, `correctOrder` array | `order ?? []` for rendering | Same as Sortable — `correctOrder.indexOf` crashes if undefined |
| **Flashcard** | `cards` array, `deckId` string | None | No guard on `cards` — line 61 `cards.filter(...)` crashes if undefined |
| **SliderExploration** | `variables` array, `compute` function | `variables ?? []` during render; try/catch on `compute()` | Line 39 `variables.map(...)` crashes if `variables` is undefined |
| **AnnotatedDiagram** | None (stub, all optional) | `labels||points||hotPoints||items`; `Array.isArray` check | Fully defensive, no crashes possible |
| **HotSpot** | None (stub, all optional) | `regions||hotspots||items`; `Array.isArray` check | Fully defensive |
| **SideBySide** | `comparisonRows` or `rows` | `comparisonRows ?? rows ?? []`; cell value fallbacks | Gracefully renders empty table |

---

## Section 2 — Crash Inventory

### CRASH-class findings (render-blocking)

| # | File:line | Primitive | Expected | Actual | Predicted error |
|---|---|---|---|---|---|
| C1 | `T13/L08-joint-use-and-clearance-compliance.jsx:194` | WorkedExample | flat named props | `example={clearanceWorked}` — all named props undefined | `TypeError: Cannot read properties of undefined (reading 'map')` at line 48 |
| C2 | `T13/L04-underground-construction-inspection.jsx:285` | WorkedExample | flat named props | `example={groundResistanceWorked}` | Same as C1 |
| C3 | `T15/L02-fault-locate-with-otdr.jsx:280` | WorkedExample | flat named props | `example={faultDistanceWorked}` | Same as C1 |
| C4 | `T13/L01-inspector-role-and-qa-qc-framework.jsx:419` | BranchingScenario | `startNodeId`, `nodes` | `scenario={obj}` — `nodes` prop undefined | `TypeError: Cannot read properties of undefined` on `nodes[currentNodeId]` |
| C5 | `T13/L03-aerial-construction-inspection.jsx:306,348` | BranchingScenario | same | `scenario=` (2 instances) | Same as C4 |
| C6 | `T13/L04-underground-construction-inspection.jsx:279` | BranchingScenario | same | `scenario=` | Same as C4 |
| C7 | `T13/L06-material-and-hardware-acceptance.jsx:220` | BranchingScenario | same | `scenario=` | Same as C4 |
| C8 | `T13/L09-contractor-relations-and-dispute-resolution.jsx:250,286` | BranchingScenario | same | `scenario=` (2 instances) | Same as C4 |
| C9 | `T13/L11-daily-inspection-records-rus-form-565.jsx:377` | BranchingScenario | same | `scenario=` | Same as C4 |
| C10 | `T13/L12-federal-compliance-monitoring-davis-bacon.jsx:409` | BranchingScenario | same | `scenario=` | Same as C4 |
| C11 | `T13/L13-inspection-day-field-decision-workflow.jsx:315,336,348,369` | BranchingScenario | same | `scenario=` (4 instances) | Same as C4 |
| C12 | `T15/L01-outage-response-first-30-minutes.jsx:347` | BranchingScenario | same | `scenario=` | Same as C4 |
| C13 | `T15/L03-physical-route-walk.jsx:281` | BranchingScenario | same | `scenario=` | Same as C4 |
| C14 | `T16/L07-form-219-documentation-package.jsx:380` | BranchingScenario | same | `scenario=` | Same as C4 |
| C15 | `T13/L02-pre-construction-acceptance-baseline.jsx:206` | Sortable | `correctOrder` array | prop absent | `TypeError: Cannot read properties of undefined (reading 'indexOf')` at line 34 |
| C16 | `T08/L03-simple-vs-complex-attachment.jsx:316` | Sortable | `correctOrder` array | prop absent | Same as C15 |
| C17 | `T19/L11.osp-to-isp-handoff-walkthrough.jsx:282` Q5 | Quiz/DragMatch | `items`, `targets`, `correctMap` | `type:'drag-and-match'` + `pairs:[{left,right}]` — `q.items` undefined | `TypeError: Cannot read properties of undefined (reading 'filter')` at DragMatch line 209 |
| C18 | `T21/L03.installation-techniques-aerial-underground.jsx:265` | Flashcard | `cards` array | `term={t} definition={d}` — `cards` undefined | `TypeError: Cannot read properties of undefined (reading 'filter')` at line 61 |
| C19 | `T21/L04.cable-prep-termination.jsx:268` | Flashcard | same | same wrong pattern | Same as C18 |
| C20 | `T21/L05.fusion-splicing-deep-dive.jsx:267` | Flashcard | same | same | Same as C18 |
| C21 | `T21/L06.otdr-testing-acceptance.jsx:261` | Flashcard | same | same | Same as C18 |
| C22 | `T21/L07.safety-workmanship-standards.jsx:238` | Flashcard | same | same | Same as C18 |
| C23 | `T21/L08.make-ready-design-review-checklist.jsx:251` | Flashcard | same | same | Same as C18 |
| C24 | `T13/L08-joint-use-and-clearance-compliance.jsx:177` | Flashcard | `cards` array | `term={kt.term} definition={kt.definition}` — `cards` undefined | Same as C18 |

**Total confirmed crash sites: 24 crash instances across 22 lesson files**

### BEHAVIORAL bugs (no crash, silent wrong behavior)

| # | Scope | Primitive | Issue | Severity |
|---|---|---|---|---|
| B1 | T11(all 15), T12(all 15), T13(all 13), T14(all 12), T15(all 10), T16(all 10), T17(all 10) — ~85 lessons | Quiz | `question:` field not rendered (component uses `q.prompt`); `correct:` integer not used for scoring (component uses `q.answerIndex`). Result: quiz renders blank question text AND every answer marked wrong. | HIGH |
| B2 | `T19/L11`:Q1–Q3 | Quiz/MultipleChoice | `options:[{letter,text}]` — renders correctly via `c.text` fallback, but `correct:'A'` string not matched against `answerIndex`. Scoring broken. | MED |
| B3 | `T19/L11`:Q4 | Quiz/FillInBlank | `type:'fill-in-the-blank'` unrecognized (expects `'fill-in-blank'`); falls back to multiple-choice with no choices; renders "(no options provided)" warning. | MED |
| B4 | All T13 BranchingScenario objects (scenario objects themselves, not the prop passing) | BranchingScenario | Even if crashes are fixed via shim, scenario objects use `startNode` (not `startNodeId`), `node.text` (not `node.prompt`), `choices[].nextNode` (not `choices[].nextId`). Scenario bodies would render blank; navigation would not advance. | HIGH |
| B5 | T03/L02, T03/L03, T03/L06, T03/L08, T03/L12 (5 files) | BranchingScenario | Correct `scenarioId`/`startNodeId`/`nodes` props, but `node.text` instead of `node.prompt` — node body renders blank silently. `choices[].nextId` is correct so navigation works. | MED |

---

## Section 3 — Pattern Summary

| Pattern | Root cause | Files | Crash or Behavioral |
|---|---|---|---|
| A: `BranchingScenario scenario={obj}` | Wrong top-level API | T13(8), T15(2), T16(1) = 11 files, 16 instances | CRASH |
| B: `WorkedExample example={obj}` | Wrong top-level API | T13(2), T15(1) = 3 files | CRASH |
| C: `Flashcard term= definition=` | Completely wrong prop API | T21(6), T13(1) = 7 files | CRASH |
| D: Sortable missing `correctOrder` | Required prop absent | T13/L02, T08/L03 = 2 files | CRASH |
| E: Quiz `correct:`/`question:`/`options:` | Old InteractiveQuiz schema used | T11/T12/T13/T14/T15/T16/T17 = ~85 lesson files | BEHAVIORAL (blank prompt + always-wrong) |
| F: Quiz type name mismatches + wrong shape | Unrecognized type strings + data model mismatch | T19/L11 = 1 file | CRASH (Q5) + BEHAVIORAL (Q3–Q4) |
| G: BranchingScenario `node.text` not `node.prompt` | Wrong field name inside node objects | T03(5 files) | BEHAVIORAL (blank body) |

---

## Section 4 — Fix Recommendations

**Primitive-side fixes (preferred — each fixes many lessons at once):**

1. **Quiz — Pattern E + F** (2 lines): In `MultipleChoice`, change `i === q.answerIndex` to `i === (q.answerIndex ?? q.correct)`. In Quiz main render, change `q.prompt` to `q.prompt ?? q.question`. In `resolveMode`, add `if (question.type === 'fill-in-the-blank') return 'fill-in-blank';` and `if (question.type === 'drag-and-match') return 'drag-match';`. Fixes ~85 lessons' behavioral bug + T19/L11 Q4.

2. **BranchingScenario — Pattern A + G** (shim + fallback): At mount, if `scenario` prop exists, destructure it as `{scenarioId, title, description, startNodeId: scenario.startNodeId ?? scenario.startNode, nodes: scenario.nodes}`. During node render, change `{node.prompt}` to `{node.prompt ?? node.text}`. In `advance()`, accept both `choice.nextId` and `choice.nextNode`. Fixes 16 crash instances + 5 silent-blank instances.

3. **Flashcard — Pattern C** (crash guard): Add `if (!cards || !cards.length) return null;` at top. Prevents crash; lesson-side rewrite still needed for actual content to render.

4. **Sortable/TimelineSequence — Pattern D** (crash guard): Add `if (!correctOrder) return <div className="panel">...</div>;` before the `initial` computation. Prevents crash; lesson-side `correctOrder` arrays needed for scoring.

**Lesson-side fixes (required for full correctness):**

5. **WorkedExample — Pattern B** (3 files): Change `<WorkedExample example={obj} />` to `<WorkedExample {...obj} />`. Also reshape each object: rename `variables[].symbol` → `key`, `variables[].name` → `label`, add `variables[].default` numeric; convert `steps` from array-of-objects to a function returning `[{expression, value, unit}]`; add `formula` function and `sanityCheck` function.

6. **T19/L11 Q5 — Pattern F** (1 question): Rewrite using `items:[{id,label}]`, `targets:[{id,label}]`, `correctMap:{targetId:itemId}`. The `pairs` shape is incompatible.

7. **Flashcard T21/T13 lesson-side** (7 files): Replace `<Flashcard term={t} definition={d} />` loops with `<Flashcard deckId="T21-Lxx" cards={[{id, front, back}, ...]} />`.

---

## Section 5 — Severity Ranking

| Rank | Pattern | Lessons broken | Priority |
|---|---|---|---|
| 1 | E: Quiz wrong schema (behavioral) | ~85 lessons — quizzes silently broken across T11–T17 | IMMEDIATE |
| 2 | A: BranchingScenario `scenario=` crash | 11 files — full lesson render fails | IMMEDIATE |
| 3 | C + B4: Flashcard crash + scenario body blank | 7 files crash; T13 scenarios blank after crash fixed | IMMEDIATE |
| 4 | G: BranchingScenario `node.text` | T03 5 files — silent blank scenario bodies | HIGH |
| 5 | B: WorkedExample `example=` crash | 3 files | HIGH |
| 6 | D: Sortable missing `correctOrder` | 2 files | HIGH |
| 7 | F: T19/L11 Q4+Q5 | 1 file | MED |

---

=== RUNTIME ERROR AUDIT END ===
