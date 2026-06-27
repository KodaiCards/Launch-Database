# Training Design Spec — the visual / interactive / pedagogy vision (CEO-owned)

> **Why this exists:** the "make it visual, interactive, and better" goal is a high-judgment *design* call. It is **owned by the CEO (Opus, full context/budget)** — not invented by a worker instance. This spec is the concrete vision. Workers (C5) **execute verified content into these patterns; they do not design the patterns or invent components.** This is the pedagogy/UX analogue of the "concrete plans, not vague intent" rule.
>
> Pairs with: `osp-training/docs/field-vs-textbook-research.md` (voice/accuracy rulebook), `osp-training/src/lessons/schema.md` (lesson file format), `docs/training_launch_design.md` (program context). Last updated 2026-06-27.

## Ownership split (this is the fix for "I don't trust C5's vision")
- **CEO owns:** this spec, the **reusable interactive component library** (`osp-training/src/components/**`), the **visual/SVG conventions**, the **lesson template**, and the **assessment model**. The CEO builds the net-new components + a gold-standard exemplar lesson.
- **C5 owns:** **research → author → red-team of factual CONTENT only**, poured into these components/templates per this spec. C5 does **not** invent UX, design components, or make visual-design calls. If a concept needs an interaction this spec doesn't cover, C5 files a `BLOCKED — needs CEO` note; the CEO extends the spec/components.

## Lesson anatomy (every lesson follows this shape)
1. **Header** — title, topic·lesson id, type badge, est. minutes, prereq strip. (LessonLayout already renders this.)
2. **Tiered body** — `data-tier="foundations"` (always open) → `"working"` (open) → `"advanced"` (collapsible). Plain-language first; define every acronym on first use (rulebook).
3. **At least one authored visual** where the concept is spatial/structural (see Visual standards).
4. **Field vs Book callouts** where practice diverges from the standard (existing pattern).
5. **One competency interaction OR a graded quiz** — required (the completion gate needs it; see Assessment).
6. **Flashcards** for the lesson's `vocabulary_introduced` / `key_terms`.
7. Footer nav (Back / Next) — no manual "complete" button (gate-driven; already removed).

## Interactive component catalog (use these; don't reinvent)
Each entry: **purpose · when to use · competency credit**. "Competency credit" = what the component sends to the gate (`score≥70` or `competency:true`) on mastery.

**Existing — use widely:**
- **Quiz** (`primitives/Quiz.jsx`) — graded MC/fill/matching question bank. *Use:* the lesson's assessment. *Credit:* sends `score`; ≥70% completes the lesson. The floor is ≥4 questions, mixed types.
- **Flashcard** (`Flashcard.jsx`) — term ⇄ definition recall. *Use:* every lesson's vocabulary. *Credit:* none (study aid).
- **WorkedExample** (`primitives/WorkedExample.jsx`) — step-by-step solved calculation. *Use:* any numeric method (loss budget, sag, fill, depth). *Credit:* none (worked, not tested) — pair with a Quiz item that tests the same method.
- **BranchingScenario** (`primitives/BranchingScenario.jsx`) — decision tree / "what do you do next" field scenario. *Use:* judgment/procedure topics (inspection calls, outage response, permitting paths). *Credit:* `competency:true` when the correct terminal path is reached.
- **Sortable** (`primitives/Sortable.jsx`) — ordering/sequencing. *Use:* process order (splice steps, MOP, close-out sequence). *Credit:* `competency:true` on correct order.
- **SideBySide** (`primitives/SideBySide.jsx`) — A/B comparison. *Use:* aerial vs underground, fusion vs mechanical, OLTS vs OTDR. *Credit:* none (explanatory).
- **SliderExploration** (`primitives/SliderExploration.jsx`) — drag a parameter, watch an output change. *Use:* cause/effect relationships (pulse width ↔ dead zone, span ↔ sag). *Credit:* none (explanatory).
- **TimelineSequence** (`primitives/TimelineSequence.jsx`) — chronological steps. *Use:* project lifecycle, the 15-day make-ready clock. *Credit:* none.
- **LinkBudgetCalculator**, **OTDRTraceViewer**, **TopologyCanvas** — domain simulators (underused — lean on them). *Use:* T02/T12 (budget/trace), T16 (topology). *Credit:* `competency:true` when the learner hits a target/correct configuration.

**Net-new — CEO will build (do NOT have C5 build these):**
- **MatchPairs** — drag-to-match two columns (term↔definition, code↔meaning, color↔position). *Use:* TIA-598 color code, RUS unit codes, FCC Part 32 accounts. *Credit:* `competency:true` on all-correct.
- **LabelDiagram (hotspot)** — click/drag labels onto an SVG (parts of a pole, splice case, FDH, OTDR trace features). *Use:* anatomy/identification lessons. *Credit:* `competency:true` on all-correct.
- **FillBlank** — type/select the missing value in a sentence or spec. *Use:* quick recall checks. *Credit:* folds into Quiz scoring.
- **Calculators (extend the pattern):** PoleLoadingCalculator, ConduitFillCalculator, SagTensionCalculator, SpliceLossBudget. *Use:* the matching numeric topics. *Credit:* `competency:true` on a correct worked target.

## Concept → interaction mapping (pick the right tool)
- Vocabulary/identification → **Flashcard** + **LabelDiagram** + **MatchPairs**.
- A numeric method → **WorkedExample** (show) + **Calculator** (do) + **Quiz** item (test).
- A process/sequence → **Sortable** / **TimelineSequence**.
- A judgment/field decision → **BranchingScenario**.
- A comparison → **SideBySide**.
- A cause/effect relationship → **SliderExploration** or the relevant simulator.
- Always: a **Quiz** (≥4, mixed) as the graded assessment.

## Assessment model (concrete)
- **Floor: ≥4 questions per lesson**, mixed types (MC, fill, matching, scenario).
- **Cumulative within a subject:** each lesson's quiz includes ≥1 item drawn from earlier lessons in the same topic.
- **Interleave prior subjects:** where a lesson genuinely depends on an earlier topic (per the prereq DAG), include ≥1 item from it (spaced retrieval).
- **Per-subject capstone** quiz (exists for many) — strengthen, don't remove.
- **Completion gate:** a lesson completes when its **Quiz ≥70%** OR a designated **competency interaction** is mastered (sends `competency:true`). Every lesson must have one of these.

## Visual / SVG standards
- **Authored SVG/diagram components only for technical visuals** — red-team-verifiable. **No AI-generated raster images for anything factual** (hallucination risk). Tasteful non-factual illustration is fine.
- Use **design tokens / CSS vars** (the SPA's theme) so diagrams work in light + dark. No hard-coded hex that breaks dark mode.
- Every diagram: a title, labeled parts, and a one-line caption. Labels must match the lesson's vocabulary exactly.
- Diagrams are **content** → they go through research + red-team like any claim (a wrong fiber count in a diagram is a wrong fact).

## Voice / verbiage
Per `field-vs-textbook-research.md`: plain language, smart-friend tone, define jargon on first use, short sentences, scannable (headers/bullets/callouts). Accuracy always wins over polish.

## Per-lesson Definition of Done (the bar C5 executes to)
A lesson is "done" only when: tiered body in plain language ✓ · ≥1 authored visual where spatial ✓ · vocabulary flashcards ✓ · ≥1 competency interaction or graded quiz wired to the gate ✓ · quiz ≥4 mixed + cumulative + interleaved ✓ · **research-log citation for every non-obvious claim** ✓ · **independent red-team report, no open flags** ✓ · valid prereq/DAG pointers ✓ · `npm run build:osp` clean ✓.

## CEO next actions (so the vision is real, not described)
1. Build the net-new components (MatchPairs, LabelDiagram, FillBlank, the calculators) to a consistent API + gate wiring.
2. Build **one gold-standard exemplar lesson** end-to-end as the template C5 copies.
3. Then C5 replicates the pattern with verified content, per topic, through the gate.
