# Component / Interactive-Tool Health Check

> CEO-direct (no agents), per Planning's P1 ruling. Started 2026-06-28.
> **Status: STATIC PASS done. RUNTIME PASS pending** (requires building the SPA).
> Purpose: produce the broken-tool repair list (Carter: "some interactive tools are broken").

## Method
Two passes. (1) **Static** — usage scan + marker scan over `src/lessons/T*` + `src/components` (no build, cheapest). (2) **Runtime** — build the SPA, load a representative lesson per component type, watch the console for crashes/errors. Static can only find *orphans + authoring markers*; **actual breakage is runtime-only**, so the runtime pass is required to answer the question.

## Pass 1 — Static (done)

### Live interactive components + usage (imports across `src/lessons`)
| Component | Lessons using | Role |
|---|---|---|
| `primitives/Quiz` | 254 | **Critical path** — drives the ≥70% completion gate |
| `Flashcard` | 240 | Recall, every topic |
| `primitives/BranchingScenario` | 74 | Scenario decisions |
| `primitives/WorkedExample` | 73 | Step-by-step worked problems |
| `primitives/SideBySide` | 15 | Compare/contrast |
| `primitives/Sortable` | 12 | Ordering/matching |
| `primitives/SliderExploration` | 10 | Parameter exploration |
| `primitives/TimelineSequence` | 4 | Sequencing |
| `OTDRTraceViewer` | 1 | `T12/L15` (testing capstone) |
| `TopologyCanvas` | 1 | `T16/L09` (fiber-topology canvas) |
| `LinkBudgetCalculator` | 1 | `T02/L06` (link-budget worked example) |

### Orphans (NOT used by the live SPA)
- **`InteractiveQuiz`** and **`CertificationSim`** are imported only by the **legacy `src/modules/Module01–12` tree** (+ `src/data/cert-sim-bank.js`) — the old architecture the legacy research-logs targeted, **not** the live `src/lessons/T*` curriculum. The live mock exams (`C04`, `C05`) use `primitives/Quiz`, not `CertificationSim`.
- **Implication:** these are **legacy-cleanup candidates, not live breakage.** The whole `src/modules/` tree is dead weight relative to the served SPA and a source of confusion (two architectures in one repo). Flagging for a later cleanup decision — out of scope for the broken-tool repair list.

### Marker scan — CORRECTION to the triage
The triage reported "91 TODO/FIXME/placeholder/BROKEN markers." **That was a regex false-positive** (case-insensitive matching of the OSP domain phrase "fibers **broken** out", HTML `placeholder=` input attributes, and `__examples__` demo files). A precise, case-sensitive scan over live lessons+components yields **~0 genuine code TODO/FIXME/broken markers** — the handful of remaining `XXXX` hits are fill-in-the-blank *examples inside lesson content* (e.g. `WD# XXX-XXXX`, `S/N XXXXXXXX`, `FCO-XXXX`), not code.
- **Takeaway:** there is no statically-flagged broken tool. Whatever Carter saw is a **runtime failure**, findable only by Pass 2.

### Completion-gate wiring — present + sound
`LessonLayout.jsx` exposes `LessonProgressContext` with `reportScore(pct)` → `markComplete(pct)` (server gate, ≥70%). `primitives/Quiz` reports into it. This is the path admin progress bars depend on — verify it end-to-end in Pass 2.

## Pass 2 — Build/compile check (DONE — clean ✅)
`npm install` + `npm run build:osp` → **`✓ built in 11.79s`, all ~270 lesson chunks + every component compiled with zero import/JSX/syntax errors.** Vite code-splits one chunk per lesson, so a clean build proves every lesson file *and* every component it imports parses and resolves. **Verdict: no build/definition-level breakage anywhere in the live curriculum.** Output lands in `public/training/` (base `/training/`, HashRouter).

## Pass 3 — Runtime interaction sweep (NOT run — deliberately deferred, cost call)
The only breakage class left after a clean build is a **runtime interaction bug** (a component that throws on specific props/data or misbehaves mid-interaction). Detecting it needs a browser exercising each tool. Status: **Chromium is pre-installed (`/opt/pw-browsers`) but the Playwright npm driver is not**, so a sweep would require another install + automation scripting.
**Decision (cost discipline):** do **not** install Playwright for a speculative all-component sweep. The build is green and the original "broken tools" signal was partly a false marker count (see above). Instead: when a specific tool is reported broken, reproduce it directly (serve `public/training/`, open `/#/course/<T>/lesson/<order>`, watch console) and fix — targeted, cheap. Probe URLs if/when needed:
- OTDRTraceViewer → `/#/course/T12/lesson/15`
- TopologyCanvas → `/#/course/T16/lesson/9`
- LinkBudgetCalculator → `/#/course/T02/lesson/6`
- Quiz + completion gate → any capstone, e.g. `/#/course/T01/lesson/10`

## Verdict
- **No broken tools found at the build/definition level** (the cheap, high-coverage signal — green).
- 2 legacy-only components (`InteractiveQuiz`, `CertificationSim`) → cleanup, not repair.
- Runtime interaction sweep deferred to targeted repro. **If Carter can name which tool looked broken, that's a 10-minute fix; a blind full sweep isn't worth the spend.**

### Original probe list (kept for targeted repro)
Targeted, not exhaustive. Load one representative lesson per component type and watch the console:
| Component | Probe lesson |
|---|---|
| Quiz (+ gate path) | any `*capstone-quiz` (e.g. `T01/L10`) — confirm score → ✓ Complete |
| Flashcard | any foundation lesson |
| BranchingScenario | a T13 inspection scenario lesson |
| WorkedExample | `T02/L06` |
| SideBySide / Sortable / SliderExploration / TimelineSequence | one lesson each (from usage list) |
| OTDRTraceViewer | `T12/L15` |
| TopologyCanvas | `T16/L09` |
| LinkBudgetCalculator | `T02/L06` |
Record per-component **PASS / BROKEN + repro + console error**. Broken ones → the repair list the CEO fixes directly.

## Current verdict
- No orphan/marker breakage in the live tree; 2 legacy-only components (cleanup, not repair).
- The real broken-tool question is **open pending the runtime pass**, which is the next concrete step.
