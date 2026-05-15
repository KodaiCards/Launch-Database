# OSP-RW.1 RT Verification (combined 1A primitives + 1B scaffold)

## Stack snapshot (≤80 words)

**YELLOW** — build passes clean, 9 primitives are spec-compliant and well-engineered, scaffold
integration is solid. Three issues require patches before OSP-RW.4 content authoring begins:
(1) HashRouter initial-visit 404 (HIGH — users hitting `/training/` directly see the 404 page),
(2) `@vite-ignore` dynamic-import strategy will break lesson loading at runtime (HIGH),
(3) `schema.md` documents wrong import style for all 4 core primitives (MEDIUM — authoring blocker).

---

## Axis 1: Build integrity

```
> osp-design-training@0.1.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 111 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:   0.32 kB
dist/assets/index-B7hhTwPV.css   29.24 kB │ gzip:   5.90 kB
dist/assets/index-DmDhqPcp.js   717.51 kB │ gzip: 227.36 kB

(!) Some chunks are larger than 500 kB (expected with 12 legacy modules in the bundle).
✓ built in 2.39s
```

**PASS — clean build, zero errors.** Both legacy useState sidebar and new React Router tree
compile into the single bundle. The 717 kB chunk size warning is expected (12 legacy module
JSX files are heavy); non-blocking at this stage.

---

## Axis 2: Primitives spec compliance (9 rows)

| Primitive | File | Spec compliance | Notes |
|---|---|---|---|
| Quiz | `primitives/Quiz.jsx:37-401` | ✓ COMPLIANT | MC (lines 155–188), drag-match (192–314), fill-in-blank (318–401) all implemented. `mode` prop + per-question `type` override. `onComplete` fires with `{score, total, answers}`. |
| AnnotatedDiagram | `primitives/AnnotatedDiagram.jsx:27-136` | ✓ COMPLIANT | `hotPoints[]` with `x/y %`, `click` and `hover` `type`, pin toggling, callout panel, legend strip (lines 73–133). Mobile tap handled via click events on touch. |
| WorkedExample | `primitives/WorkedExample.jsx:37-164` | ✓ COMPLIANT | `variables[]`, `formula()`, `steps()`, `sanityCheck()` props. Live recompute on input change (line 52–55). Step-by-step reveal toggle (lines 125–160). Sanity sentence (lines 119–123). |
| BranchingScenario | `primitives/BranchingScenario.jsx:33-217` | ✓ COMPLIANT | FSM `nodes` map. `localStorage` persistence keyed `osp-scenario-${scenarioId}` (line 40–61). History breadcrumb, restart, optimal-choice tracking. Decision path summary on completion. |
| HotSpot | `primitives/HotSpot.jsx:34-166` | ✓ COMPLIANT | `regions[]` with `x/y/w/h %`. `challenge` mode (finds correct regions) and `explore` mode (reveal all on click, lines 53–65). Per-region `isCorrect` feedback. Keyboard accessible (lines 117–118). |
| Sortable | `primitives/Sortable.jsx:20-183` | ✓ COMPLIANT | Drag-to-reorder with HTML5 DnD. `correctOrder` validation on submit (lines 44–45). Post-submit position hints. Deterministic scramble (even-indexed to first half, odd to second half — lines 30–37). |
| SliderExploration | `primitives/SliderExploration.jsx:30-152` | ✓ COMPLIANT | `variables[]` sliders + `compute()` function with live recompute (lines 40–43). `status` field colors (`ok`/`warn`/`error`). Reference `annotations[]`. Reset to defaults. |
| SideBySide | `primitives/SideBySide.jsx:28-107` | ✓ COMPLIANT | Two-column comparison table. `highlight` prop marks decisive row with ★ (lines 62–75). `note?` footnote per row. `leftColor`/`rightColor` props for column headers. |
| TimelineSequence | `primitives/TimelineSequence.jsx:26-249` | ✓ COMPLIANT | Horizontal timeline with drag-to-order. Same deterministic scramble as Sortable. Touch-friendly ←/→ arrow fallback (lines 80–93). Correct-position hints on submit. |

---

## Axis 3: Scaffold integration

**App.jsx — React Router wiring: PASS**
`App.jsx:133–151` registers all 6 routes inside `NewAppLayout`:
- `Splash` at `/training/` ✓
- `FieldTools` at `/training/tools` ✓
- `CertTrack` at `/training/cert/:certId` ✓
- `CourseView` at `/training/course/:courseId` ✓
- `LessonRouter` at `/training/course/:courseId/lesson/:lessonOrder` ✓
- `NotFound` at `*` ✓

**LessonLayout — header/tier/footer: PASS**
`LessonLayout.jsx:191–277` renders: header (title, lesson type badge, estimated_minutes, prereq strip),
`TieredBody` with foundations/working/advanced accordion (all three open by default except advanced
which renders collapsed — `defaultOpen={false}` at line 174), footer nav with "Back to course" +
"Mark complete" + "Next lesson →". `useProgress` hook stub wires progress tracking correctly.

**course-catalog.js — ARCH.md alignment: PASS (21/22 topics)**
Spot-checked T01, T05, T09, T14, T17, C01:
- T01: 10 lessons, prereqs=[] ✓
- T05: 15 lessons, prereqs=[T01,T02,T03,T04] ✓
- T09: 12 lessons, prereqs=[T01,T04] ✓
- T14: 12 lessons, prereqs=[T01,T02,T05,T06,T18] ✓
- T17: 10 lessons, prereqs=[T01,T05,T06,T08,T10,T16] ✓
- C01: 8 lessons, prereqs=[T01,T02] ✓

**GAP: C04 absent from `courses[]`.** ARCH.md Section 2 defines C04 as a content course with 12 lessons.
`certTracks[]` only contains exam surfaces (C04-OSP/RCDD/CFOT/CFOS with `lesson_count: 0`).
There is no `courses[]` entry for C04. `CourseView` would return "not found" for `/training/course/C04`.
`src/lessons/C04/` is in `schema.md`'s file naming examples but has no catalog backing.
Impact: the 12 C04 lessons (exam strategy, domain reviews, practice rounds) cannot be navigated to.

**FieldTools — tools rendered: PASS**
`FieldTools.jsx:77–125` imports and renders `LinkBudgetCalculator`, `TopologyCanvas`, `OTDRTraceViewer` in
collapsible `ToolSection` wrappers. Jump nav present. Build passes, imports resolve.

**Feature flag: PASS**
`App.jsx:60–68` reads `VITE_USE_NEW_ROUTER=true` env var OR `localStorage.getItem('ospUseNewRouter') === 'true'`.
Default returns `LegacyApp` (existing sidebar). New router only activates on explicit opt-in. Production cut
at OSP-RW.7 removes the check entirely.

---

## Axis 4: Backwards-compat

**InteractiveQuiz import paths: PASS**
Five legacy modules import `from '../components/InteractiveQuiz.jsx'`:
`Module01_FiberPhysics.jsx`, `Module02_OSPDesign.jsx`, `Module06_RCDDCore.jsx`,
`Module08_TestingOTDR.jsx`, `Module10_DataCenter.jsx`. The file exists at
`src/components/InteractiveQuiz.jsx`. Build passes with all imports resolved. ✓

**Legacy modules render under useState sidebar: PASS**
`LegacyApp` in `App.jsx:202–276` renders the 12 MODULES array via `useState`-controlled
`activeId`. All 12 module imports compile (build passed). `status: 'ready'` on all 12 = no "soon" badge shown.

**New Quiz doesn't shadow InteractiveQuiz: PASS**
`Quiz.jsx` lives at `primitives/Quiz.jsx`. `InteractiveQuiz.jsx` lives at `components/InteractiveQuiz.jsx`.
No name collision. Legacy modules import `InteractiveQuiz`, new lessons import `Quiz` — independent paths.

---

## Axis 5: Training voice + open Qs answered

**AI-reference search results:**
Zero hits in: `primitives/`, `pages/`, `App.jsx`, `hooks/`, `components/LessonLayout.jsx`.
One match in `data/module10-flashcards.js` — content references "TIA-942-C AI Addendum" as a real
standard's name and "DCE 9000 and the TIA-942-C AI Addendum" as standards topics. These are legitimate
standards/industry references (not internal AI authoring disclosures). **Compliant.** ✓

**Open Q answers — 1A (primitives):**

1. **BranchingScenario localStorage key collision risk:** The key format is `osp-scenario-${scenarioId}`.
   Recommended convention: `<topicId>-<lessonId>-<seq>`, e.g. `T05-L06-makeready-scenario`.
   Authors must NOT use generic names like "scenario-1" — these will collide across lessons if two lessons
   have a scenario with the same scenarioId. Add to authoring rules in schema.md.

2. **HotSpot: challenge vs explore for safety-violation content:** Use **`challenge` mode** (default).
   Safety-violation content has a correct answer (the hazard is in a specific region). `challenge` mode
   requires the learner to find the right region, reinforcing active identification of the hazard.
   `explore` mode is appropriate for "learn the parts of this diagram" content where all regions are
   informationally equivalent and there is no single "correct" click.

3. **Sortable scramble — deterministic vs random:** **Keep deterministic** (current behavior).
   Rationale: on retry, the same initial scramble makes it easier for learners to practice the
   same puzzle, and consistent behavior is easier to test. Authors should ensure the scramble
   produces a meaningfully different order from correct for their specific item set (the current
   even/odd interleave works for ≥4 items; flag if an item set has ≤3 items where scramble degrades).

4. **SliderExploration `decimals` JSDoc clarity:** **Insufficient for authoring agents.**
   The `compute` return-shape in the JSDoc (`{ result, label, unit, status?, statusMessage? }`) omits
   `decimals?: number`. But `SliderExploration.jsx:122–123` reads `computed.decimals ?? 2`.
   Authoring agents cannot discover this without reading source code. Add `decimals?: number` to the
   JSDoc return-shape description. **Patch needed.**

**Open Q answers — 1B (scaffold):**

1. **lessonFileIndex relative-path correctness:** The format comment shows `'../lessons/T02/L01...'`
   relative to `src/data/course-catalog.js`. However, the dynamic `import()` call is in
   `src/pages/LessonRouter.jsx` which uses `@vite-ignore`. In a bundled build, browser-runtime
   dynamic imports resolve relative to the **script bundle URL** (`/training/assets/index-HASH.js`),
   not to the source file's directory. `'../lessons/T02/...'` would resolve to `/training/lessons/T02/...`
   at runtime — a path that doesn't exist in the built output. **This will 404 at runtime for every lesson.**
   Fix: replace `@vite-ignore` + string-path approach with `import.meta.glob('../lessons/**/*.jsx')` in
   LessonRouter, which Vite processes at build time and creates proper code-split chunks.

2. **`useParams()` courseId propagation to LessonLayout:** LessonRouter renders `<LessonComponent />`
   (the dynamically imported lesson file). Each lesson file renders `<LessonLayout meta={meta}>` directly.
   `LessonLayout` calls `useParams()` on line 192 and gets `{ courseId, lessonOrder }` from the route
   `/training/course/:courseId/lesson/:lessonOrder`. This **works correctly** — `LessonLayout` is always
   rendered within the React Router context and `useParams()` reads from the nearest active route match.

3. **`vocabulary_assumed.source_lesson_id` format vs ARCH.md DAG IDs:**
   Schema uses dotted format `"T01.L01"`. ARCH.md Section 3 DAG uses plain topic IDs `"T01"`.
   The `vocabulary_assumed` format is a lesson-level reference (topic + lesson number), not a topic-level
   reference, so the dotted format is correct and appropriate. Spot-check confirms:
   - `"T01.L01"` → Topic T01 Lesson 1 = first lesson of Fundamentals & Vocabulary ✓
   - `"T01.L08"` → Topic T01 Lesson 8 = within the 10-lesson T01 course ✓
   - `"T05.L06"` → Topic T05 Lesson 6 = within the 15-lesson T05 Aerial Design course ✓
   Format is consistent and unambiguous. **No issue.**

---

## Findings (severity-ranked)

| # | Severity | Description | File:line | Remediation |
|---|---|---|---|---|
| F1 | HIGH | HashRouter + `/training/` route prefix: direct visit to `/training/` has empty hash → React Router sees path `/` → no route matches → NotFound shown. Users hitting the entry URL see a 404 page. | `App.jsx:135` | Change `path="/training/"` to `path="/"` for Splash (and update all other route paths consistently to drop the `/training/` prefix, since HashRouter already isolates routing to the hash fragment). OR add `<Route path="/" element={<Navigate to="/training/" replace />} />`. |
| F2 | HIGH | Dynamic import via `@vite-ignore` string path will 404 at runtime. `lessonFileIndex` paths like `'../lessons/T02/L01.fiber-vocabulary.jsx'` are relative to source layout, not the bundled script URL. Browser will try `/training/lessons/...` which doesn't exist. | `LessonRouter.jsx:105` | Replace with `import.meta.glob('../lessons/**/*.jsx')` in `LessonRouter`. Returns a map of path → loader function. `lessonFileIndex` values become glob-compatible paths (e.g. `'../lessons/T02/L01.fiber-vocabulary.jsx'`). At authoring time, update `lessonFileIndex` values to match the glob key format. |
| F3 | MEDIUM | `schema.md` documents all 4 core primitives (Quiz, AnnotatedDiagram, WorkedExample, BranchingScenario) as named imports (`import { Quiz } from '...'`), but all are default exports. Authoring agents following the schema will write broken imports. Also: the `<Quiz>` usage example in schema.md uses the old `InteractiveQuiz` prop shape (`id`, `type`, `question`, `choices[].id`) not the new `Quiz` prop shape (`title`, `mode`, `questions[{id, prompt, choices, answerIndex}]`). | `src/lessons/schema.md` (Interactive Element Contracts table + code example) | Correct import style to `import Quiz from '...'` for all 4 primitives. Rewrite the `<Quiz>` usage example to match actual `Quiz.jsx` API. |
| F4 | MEDIUM | C04 (Practice Exam Bank, 12 lessons per ARCH.md Section 2) has no entry in `courses[]`. `certTracks` entries have `lesson_count: 0`. Navigating to `/training/course/C04` returns "not found". The 12 C04 lesson files planned in `schema.md` (`src/lessons/C04/`) have no route. | `course-catalog.js:261–313` | Add a `courses[]` entry for C04 with `id: 'C04'`, `section: 'cert'`, `lesson_count: 12`, `prerequisites: ['C01','C02','C03']`. Update `certTracks` entries to reference this course for lesson navigation, or keep them as exam-only surfaces and add a link to the C04 course from each `CertTrack` page. |
| F5 | LOW | `SliderExploration` `compute` return-shape JSDoc omits `decimals?: number` field, which is read at line 122–123. Authoring agents cannot discover precision control without reading source. | `SliderExploration.jsx:23` | Add `decimals?: number` to the JSDoc `compute` return-shape description. One-line fix. |
| F6 | LOW | `schema.md` describes LessonRouter as "reads the file's named `meta` export and passes it as a prop to `<LessonLayout meta={meta}>`" — but actual `LessonRouter.jsx:123` just renders `<LessonComponent />`. The lesson file renders `<LessonLayout meta={meta}>` itself. Schema.md is inaccurate (though the end-result is identical). | `src/lessons/schema.md` (How meta + Body Interact section) | Correct the mechanism description: "The lesson's default-export component renders `<LessonLayout meta={meta}>` directly using its own `meta` named export. LessonRouter does not extract or pass `meta`." |
| F7 | LOW | `BranchingScenario` `scenarioId` collision risk not documented. No authoring convention specified. Authors could accidentally pick identical IDs across lessons, causing localStorage bleed-through of progress. | `BranchingScenario.jsx:40` + `schema.md` | Add scenarioId naming convention to schema.md: `"<topicId>-<lessonOrder>-<short-slug>"`, e.g. `"T05-L06-makeready-scenario"`. |

---

## Verdict

**YELLOW — ≤5 specific patches, then proceed to OSP-RW.2.**

F1 and F2 are HIGH and must be patched before the new router is testable end-to-end. They are both
small surgical fixes (route path correction + swap `@vite-ignore` for `import.meta.glob`).
F3 and F4 are MEDIUM authoring-blockers — fixing schema.md and adding C04 to the catalog prevents
authoring agents from producing broken lesson files in OSP-RW.4/5.
F5–F7 are LOW / documentation polish — worth fixing in the same patch commit.

No architectural redos are needed. The primitive implementations are solid. The scaffold structure
is correct. The backwards-compat story is clean.

Recommended patch commit scope (single fix-agent, pre-OSP-RW.2):
- `App.jsx`: fix Splash route path (F1)
- `LessonRouter.jsx`: replace `@vite-ignore` + string path with `import.meta.glob` (F2)
- `src/lessons/schema.md`: correct import styles + Quiz API example + LessonRouter mechanism (F3, F6)
- `course-catalog.js`: add C04 course entry (F4)
- `SliderExploration.jsx` JSDoc: add `decimals?` to compute return shape (F5)
- `BranchingScenario.jsx` JSDoc or `schema.md`: add scenarioId convention (F7)

---

## Coverage gaps (≤120 words)

Not verified: CertTrack page exam unlock flow at runtime (mock exam button remains disabled
when `lesson_count: 0` — correct for now, but depends on F4 being patched for C04).
Not verified: `useProgress` integration with lesson completion flow (OSP-RW.2 will replace the stub).
Not verified: mobile/touch drag behavior across Sortable, TimelineSequence, DragMatch — these use
HTML5 DnD which requires pointer events; touch-fallback via arrow buttons exists in TimelineSequence
but not Sortable. Not verified: example files in `__examples__/` directory (not in build scope).
Not verified: ARCH.md Section 4 lesson timing estimates vs catalog `estimated_minutes` values
(would require reading all 22 rows against ARCH.md Section 4 which exceeds this report's scope).

=== RW1 RT REPORT END ===
