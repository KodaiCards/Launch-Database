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

## Pass 2 — Runtime (PENDING — node_modules missing; needs `npm install` + build)
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
