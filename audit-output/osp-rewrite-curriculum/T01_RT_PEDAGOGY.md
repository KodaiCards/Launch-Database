# T01 Pedagogy/UX RT

## Verdict (≤80 words)

T01 is a high-quality introductory package that lands squarely on the target audience. Plain-English intros are consistent and well-pitched for field workers with no formal engineering training. Acronym tables appear in every lesson that introduces new terms. Analogies are strong and concrete throughout. Tier progression is coherent, with one structural inversion in L06 (Flashcards appear before the Working section). DAG invariant is honored — T01 is the correct DAG root with empty `vocabulary_assumed` on L01.

---

## Per-lesson pedagogy grade (10 rows)

| Lesson | Plain-Eng intro | Acronyms defined | Analogies | Tier progression | Primitive placement | Flashcards | Grade |
|---|---|---|---|---|---|---|---|
| L01 OSP vs ISP | ✓ Excellent — plumbing analogy frames OSP/ISP immediately | ✓ Full table (OSP, ISP, OLT, ONT, BICSI, RUS) | ✓ Plumbing (street main vs house pipes) | ✓ Clean F→W→A; Working = signal flow trace, Advanced = FCC regulatory layer | ✓ SideBySide + Quiz well-placed after prose content | ✓ Present (8 cards, definitions match prose) | **A** |
| L02 Parts of a Pole | ✓ Good — "vertical traffic jam" analogy sets the scene instantly | ✓ Full table (NESC, Sag, FDH) | ✓ "Building floors" for three pole zones | ✓ Good; Working = pole class/ownership, Advanced = neutral wire physics | ✓ AnnotatedDiagram of pole anatomy is well-timed; Quiz at end | ✓ Present (10 cards, verbatim from prose) | **A** |
| L03 Parts of a Cable | ✓ Good — "well-designed pipe" analogy for outer-to-inner layers | ✓ Full table (Sheath, Buffer tube, Ripcord, Armor, Messenger, Central member) | ✓ Cable as layered pipe; gel cleanup field note is strong | ✓ Good; Working = aerial configurations, Advanced = ribbon cable | ✓ AnnotatedDiagram (cross-section) placed after prose; Quiz at end | ✓ Present (9 cards, verbatim) | **A** |
| L04 Inside a Splice Case | ✓ Good — "junction box in an electrical panel" analogy before technical content | ✓ Full table (Splice case, Splice tray, Port/cable entry, Gel seal, Fan-out) | ✓ Junction box + wire nuts analogy is appropriate for audience | ✓ Good; Working = capacity/selection table, Advanced = re-enterable vs non | ✓ AnnotatedDiagram (dome closure internals) well-placed; Quiz at end | ✓ Present (10 cards, verbatim) | **A** |
| L05 OSP Project Lifecycle | ✓ Excellent — "starts with a walk" framing grounds the abstract lifecycle | ✓ Acronym table not in lesson (RUS Form 219 defined in flashcard only) — minor gap | ✓ Implicit in "Missing any stage creates problems downstream" chain logic | ✓ Good; BranchingScenario is the highlight: make-ready gate consequence scenario | ✓ BranchingScenario excellent — placed in Foundations, which is slightly early; Quiz after | ✓ Present (9 cards, verbatim) | **A-** (no dedicated acronym table; BranchingScenario slightly early) |
| L06 Who Does What | ✓ Good — "a lot of moving parts — not just cables, but people" framing | ✓ Full table (PE, PM, ROW, OTDR) | ✓ "Small shop wears multiple hats" field note is excellent audience calibration | ✗ STRUCTURAL INVERSION — Flashcards appear before the Working section; Working section is brief and followed by TimelineSequence + Advanced | ✓ TimelineSequence placed in Working is appropriate; Quiz at end | ✓ Present (8 cards), BUT placed before Working section — breaks reading flow | **B+** (section order inversion; Working section thin compared to Foundations) |
| L07 Reading a Strand Map | ✓ Excellent — "troubleshooting a circuit without the wiring diagram" framing is perfect | ✓ Full table (FDH, NAP, PON, GPON) | ✓ Wiring diagram analogy is the course's best structural analogy | ✓ Good; Working = notation breakdown + splitter math, Advanced = GIS integration | ✓ AnnotatedDiagram (FTTH architecture) well-placed in Working; Quiz at end | ✓ Present (9 cards, verbatim) | **A** |
| L08 Key Acronyms Field Reference | ✓ Good — "walk into a meeting and decode the conversation" framing sets practical purpose | ✓ This IS the acronym lesson — full tables organized by category (7 categories) | N/A — reference lesson; prose is necessarily table-driven | ✓ Appropriate — Working section = certifications (natural progression from reference to credential context) | ✓ Flashcards + drag-match Quiz — appropriate for acronym-drill lesson | ✓ Present (19 cards, verbatim) | **A-** (no traditional analogy, but lesson type doesn't need one) |
| L09 OSP Standards Landscape | ✓ Good — "driving under traffic law + DOT + AASHTO simultaneously" framing | ✓ Full table (IEEE, NFPA, ITU-T, ICEA, FCC, USACE, CFR, ANSI) | ✓ Driving analogy (traffic laws + vehicle standards + road design) is effective | ✓ Good; Working = code adoption, Advanced = conflict resolution hierarchy | ✓ Quiz only (no interactive primitive) — appropriate for conceptual reference content | ✓ Present (9 cards, verbatim) | **A-** (no diagram or interactive primitive; quiz-only is adequate but a standards-hierarchy diagram would add value) |
| L10 Capstone Quiz | ✓ Brief — "score ≥80% to move to T18" direction is clear | N/A (capstone only) | N/A | N/A | ✓ 15-question mix of MC, drag-match, fill-in-blank covers all 9 lessons | ✗ ABSENT — consistent with T02 capstone pattern; needs architectural sign-off | **B+** (flashcard absence inherits T02 capstone unresolved decision) |

---

## Findings (severity-ranked)

### MEDIUM — L06 structural inversion: Flashcards appear before Working section (L06 only)

**Verified by reading:** `osp-training/src/lessons/T01/L06.who-does-what.jsx:222-298`

```jsx
      {/* ── KEY TERMS FLASHCARDS ────────────────────────────────────────── */}
      <Flashcard
        deckId="T01-L06"
        ...
      />

      {/* ── WORKING ─────────────────────────────────────────────────────── */}
      <section data-tier="working">
        <h2>Who Hands Off to Whom</h2>
```

In every other T01 lesson the Flashcard component appears after ALL prose sections and before (or after) the final quiz. In L06, the Flashcard block is placed between the Foundations section and the Working section. A learner who uses the flashcards immediately after Foundations will be drilling terms from the Working section (designer, staker, make-ready crew, splicer, inspector, test-tech, PM, PE) before reading the role descriptions in Foundations — wait, actually those role descriptions ARE in Foundations (the nine role cards). But the Working section that follows the premature Flashcard is very thin (one paragraph + a TimelineSequence). The net reading experience is: role descriptions → flashcard drill (correct, builds retention) → brief handoff paragraph → timeline visual → advanced section → quiz. This is tolerable but inconsistent with every other lesson in the course.

**Fix:** Move the Flashcard block to after the Advanced section, immediately before the Quiz — matching T01.L01–L05, L07–L09 structure.

---

### LOW-MEDIUM — L05 BranchingScenario placed inside Foundations tier

**Verified by reading:** `osp-training/src/lessons/T01/L05.osp-project-lifecycle.jsx:270-322`

The BranchingScenario component (`T01-L05-scenario-1 — The Skipped Stage`) is placed at the end of the Foundations section, before Working and Advanced. For a scenario-based decision tree that requires understanding the make-ready stage and its consequences, Foundations placement is slightly early — the Working section (which details each stage) follows the scenario. A learner who reads the scenario before the Working section may lack the stage-specific detail to reason through the choices confidently.

**Fix:** Move the BranchingScenario to between the Working and Advanced sections, or to after the Advanced section before the Quiz. The scenario reinforces the lifecycle stages, which Working details — placing it after Working gives it maximum instructional payoff.

---

### LOW — L05 no dedicated acronym table (RUS Form 219 introduced but not tabled)

**Verified by reading:** `osp-training/src/lessons/T01/L05.osp-project-lifecycle.jsx:28-29` (meta), `L05:101-103` (RUS Form 219 in-prose reference)

L05 introduces `RUS Form 219` as a new term in `vocabulary_introduced` but has no acronym mini-table in the Foundations section — the only lesson in T01 that introduces RUS-specific vocabulary without a table. The term is defined in the flashcard deck and in the stage-7 description, but new learners who skim the Foundations intro won't have the structured glossary they've come to expect from T01's consistent pattern.

**Fix:** Add a 3-row acronym table in the Foundations section covering: `RUS Form 219` (full name + what it means in practice), and optionally `OTMR` (referenced in the Stage 4 description without prior definition in T01) and `Tier 1 / Tier 2` (referenced in Stage 6 without expansion).

---

### LOW — L09 no interactive primitive beyond Quiz (standards landscape warrants a hierarchy diagram)

**Verified by reading:** `osp-training/src/lessons/T01/L09.osp-standards-landscape.jsx:226-414` (entire file — no AnnotatedDiagram, WorkedExample, or BranchingScenario)

L09 is the only non-reference, non-capstone T01 lesson with no interactive primitive beyond the closing quiz. The content — a stack of overlapping standards bodies — is exactly the kind of material that benefits from a visual hierarchy (e.g., an AnnotatedDiagram showing "What governs what: NESC at top for aerial, RUS for funded projects, NEC for building entry, FCC for pole attachment"). Without a diagram or scenario, learners are asked to hold an abstract multi-layer hierarchy in working memory from prose tables alone.

**Fix (optional but recommended):** Add an AnnotatedDiagram or a simple SideBySide primitive that maps each standard to its governing scope. A two-column "Activity → Standard" table already exists in the Working section — this could be visually enhanced. Not blocking, but the lesson would benefit from one interactive anchor.

---

### LOW — L10 capstone missing Flashcard (architectural decision needed)

**Verified by reading:** `osp-training/src/lessons/T01/L10.t01-capstone-quiz.jsx:1-331` (no Flashcard import or usage)

T01.L10 capstone has no Flashcard component — consistent with T02.L12 (the same unresolved pattern noted in the T02 Pedagogy RT). The capstone is quiz-only by design, and that's pedagogically defensible (capstones test, they don't teach new terms). However, the T02 RT flagged this as needing explicit architectural sign-off. The same flag applies here.

**No code fix needed** unless the architectural decision is "capstones should include a full-course flashcard review deck." If that decision is made, the fix is a large Flashcard block covering all T01 vocabulary_introduced terms aggregated.

---

## DAG Prereq Invariant Check

T01 is the declared DAG root. Every lesson's `vocabulary_assumed` correctly sources from within T01 or from prior T01 lessons only:

- L01: `vocabulary_assumed: []` — clean root ✓
- L02: assumes `OSP` from L01 ✓
- L03: assumes `OSP`, `ISP` from L01; `span` from L02 ✓
- L04: assumes `OSP` from L01; `buffer tube`, `fiber`, `armor`, `central member` from L03 ✓
- L05: assumes `OSP`, `OLT`, `ONT` from L01; `attachment` from L02; `splice case` from L04 ✓
- L06: assumes `OSP` from L01; lifecycle terms from L05 ✓
- L07: assumes terms from L01, L02, L03, L04, L06 — all prior T01 ✓
- L08: assumes terms from L01, L02, L06, L07 — all prior T01 ✓
- L09: assumes terms from L01, L02, L08 — all prior T01 ✓
- L10: assumes full T01 vocabulary — all prior T01 ✓

**DAG invariant: CLEAN.** No lesson assumes vocabulary from T02 or later topics.

---

## Verdict: GREEN

T01 is a solid, audience-appropriate foundation course. All 10 lessons have plain-English intros, the vast majority have acronym tables (L05 is the exception to fix), analogies are concrete and well-pitched for a field audience, tier progression is coherent and mostly well-ordered (L06 has the one structural inversion), and flashcards are present and accurate in L01–L09. The capstone pattern matches T02. Four findings — one MEDIUM (L06 section order), two LOW-MEDIUM/LOW (L05 BranchingScenario placement + missing acronym table), and one LOW (L09 no diagram primitive) — are all correctable without content rewrites. Nothing blocks launch.

=== T01 PEDAGOGY RT END ===
