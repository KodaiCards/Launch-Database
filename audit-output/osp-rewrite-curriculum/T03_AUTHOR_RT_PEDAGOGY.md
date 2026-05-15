# T03 Author RT — Pedagogy/UX

## Verdict (≤80 words)

T03 is strong. Plain-English intros land well for field-experienced no-formal-training readers. Acronym tables are consistent. Book-vs-field blocks are present in every lesson. Flashcards are present L01–L11 (L12 correctly exempt as capstone). Tier progression is coherent. Primitives are well-placed, not sprinkled. Two YELLOW findings: L10/L11 use a non-standard `key_terms` export pattern (top-level named export vs. the schema's `meta.key_terms`) that breaks flashcard pulling. L12 `BranchingScenario` uses a non-standard `states` prop instead of `nodes`.

## Per-lesson grade (12 rows)

| Lesson | Plain-Eng intro | Acronyms | Analogies | Tier progression | Primitives | Flashcards | Book-vs-field | Grade |
|---|---|---|---|---|---|---|---|---|
| L01 Loose-Tube/Tight-Buffer/Ribbon | ✓ Garden-hose analogy strong | ✓ OSP/ISP/SMF table | ✓ Garden hose | ✓ Foundation→Working→Advanced | ✓ AnnotatedDiagram + SideBySide woven in | ✓ 4 cards, verbatim definitions | ✓ Tight-buffer-in-OSP scenario | GREEN |
| L02 OSP/Riser/Indoor-Outdoor | ✓ "Two independent requirements" framing clear | ✓ OFNG/OFNR/OFNP/NEC/HDPE table | ✓ Building inspection framing | ✓ Foundations covers basics, Working adds fire-rating depth | ✓ BranchingScenario + Sortable well-placed | ✓ 4 cards | ✓ Rural FTTH vs. commercial riser scenario | GREEN |
| L03 Armor & Jacket Selection | ✓ "Armor takes the abuse so glass doesn't" | ✓ CST/HDPE/ICEA/NEC table | ✓ Pencil lead / window blinds analogy carried forward | ✓ Foundations intro → Working matrix table | ✓ AnnotatedDiagram + BranchingScenario | ✓ 4 cards incl. ripcord | ✓ "Leftover aerial cable in DB" scenario | GREEN |
| L04 Messenger vs. ADSS | ✓ Clothesline analogy opens lesson | ✓ ADSS/EDS/RTS/NESC table | ✓ Clothesline, guitar string for aeolian | ✓ Foundation → Working → Advanced well-graded | ✓ WorkedExample ADSS sag calc + SideBySide | ✓ 4 cards | ✓ Joint-use bonding cost scenario | GREEN |
| L05 G.652 vs. G.657 | ✓ Cross-ref to T02.L04 well-placed | ✓ G.652.D/G.657.A1/A2/B3/MFD table | ✓ Highway tire vs. off-road tire | ✓ Foundations covers G.652.D limits; Working adds decision tree; Advanced is physics | ✓ SideBySide comparison | ✓ 4 cards | ✓ Drop-vs-feeder substitution risk | GREEN |
| L06 Sheath & Jacket Material | ✓ Clothing analogy (outdoor jacket vs. fire coverall) | ✓ HDPE/LSZH/SAP/IPA table | ✓ Clothing weather analogy effective | ✓ Foundations → Working → Advanced (MDPE/non-petroleum gel) | ✓ BranchingScenario covers 3 environments | ✓ 4 cards | ✓ Splicer gel-cleanup mistake scenario | GREEN |
| L07 Armor Deep-Dive | ✓ "T03.L03 introduced; this goes deeper" framing correct | ✓ None needed — no new acronyms beyond T03.L03 | ✓ Chain mail analogy for interlocked | ✓ Quick-recap of L03 precedes new content; Advanced has galvanic corrosion | ✓ HotSpot installation-error exercise strong UX | ✓ 3 cards (fewer terms = correct) | ✓ Over-spec armor on aerial sag-load scenario | GREEN |
| L08 Drop Cable Selection | ✓ Three-tier hierarchy intro is clear | ✓ FDH/NAP/ONT/GPON table | ✓ Cost framing ("insurance policy" for dark fiber) | ✓ Feeder → distribution → drop tier walk natural | ✓ BranchingScenario MDU + TimelineSequence | ✓ 4 cards | ✓ Wrong-cable-on-truck scenario | GREEN |
| L09 ADSS Span/Wind/Ice | ✓ "Fighting gravity + ice + wind" framing lands well | ✓ NESC/EDS/RTS/MAT table | ✓ Sag-as-clothesline link back to T01 | ✓ Foundation → Working (formulas) → Advanced (Extreme Wind, creep) | ✓ WorkedExample NESC calculator + SliderExploration + AnnotatedDiagram | ✓ 4 cards | ⚠ Book-vs-field block absent — L09 has no amber "Book vs. Field" block. All other lessons L01–L08 have one. | YELLOW |
| L10 ICEA/CFR Standards | ✓ "Contract: cable meets spec or doesn't go in ground" | ✓ Terms explained inline | ✓ "Type approval" analogy for qualification testing | ✓ Foundations → Working → Advanced (reading full qual report) | ✓ WorkedExample datasheet compliance checker | ⚠ Flashcard pattern non-standard — uses top-level `export const key_terms` array with `{front: kt.term, back: kt.definition}` instead of `meta.key_terms` with `{term, definition}` and separate Flashcard cards. Cards render only the term as front, not a question. Schema contract requires `vocabulary_introduced` in `meta` as strings; L10 uses objects `{term: '...'}` instead. | ✓ Book-vs-field inline ("skipped under schedule pressure") | YELLOW |
| L11 Cable Datasheet Reading | ✓ "Six sections" structure immediately orients reader | ✓ No new acronyms needed; lesson teaches how to read a datasheet | ✓ "Tolerance band" sanity-check paragraph good | ✓ Foundations → Working → Advanced (RUS submittal package) | ✓ WorkedExample + HotSpot datasheet regions | ⚠ Same non-standard `key_terms` export pattern as L10. `vocabulary_introduced` uses object form `{term: '...'}` instead of string array. | ✓ Pigtail splice-tray scenario | YELLOW |
| L12 Capstone | ✓ Clear scope statement ("20 questions, 5 domains") | N/A (capstone) | N/A | N/A — capstone is integrative | ⚠ `BranchingScenario` uses `states` prop (array of objects with `id/prompt/choices/next` shape) instead of the `nodes` prop (object keyed by id). All other lessons use `nodes`. This will likely fail to render or show empty scenario. | ✓ Correctly exempt per schema | N/A | YELLOW |

## Findings (severity-ranked)

### FINDING 1 — HIGH
**L12 BranchingScenario uses `states` array prop instead of `nodes` object prop**

L12.jsx line 106 passes `states={[...]}` to `<BranchingScenario>`. Every other lesson (L02, L03, L06, L08, L09 capstone scenario) uses `nodes={{ start: {...}, 'short-run': {...}, ... }}` as a keyed object. The `BranchingScenario` component (per OSP-RW.1) accepts `nodes` not `states`. If the component does not handle the `states` prop, the L12 scenario silently renders nothing — the capstone's main route-specification exercise becomes a blank block. Learner arrives at the quiz without the scenario context the quiz references ("The quiz includes questions that reference the scenario").

**Fix:** Convert `states={[...]}` to `nodes={{ [state.id]: state, ... }}` where each object also has its `choices` elements use `next` → `nextId` to match the node shape used by L02–L09.

### FINDING 2 — MEDIUM
**L10 and L11 use non-standard `vocabulary_introduced` object form**

L10 line 39: `vocabulary_introduced: [ { term: 'qualification testing' }, ...]`
L11 line 36: `vocabulary_introduced: [ { term: 'tolerance band' }, ...]`

The lesson schema (lesson-schema.md from OSP-RW.1) requires `vocabulary_introduced` to be a **string array**: `vocabulary_introduced: ['qualification testing', 'acceptance testing', 'MFD tolerance (RUS)']`. Object form may cause the DAG prerequisite validator and any component that checks vocab to fail silently when this lesson is referenced as a prerequisite source in downstream lessons.

**Fix:** Change to string array form in both lessons. No content change needed, just data-shape fix.

### FINDING 3 — MEDIUM
**L10 and L11 use a top-level `export const key_terms` pattern for flashcard definitions instead of `meta.key_terms`**

L10 (lines 10–26) and L11 (lines 10–22) export a `key_terms` named export at the module level with `{term, definition}` shape. They then pass `cards={key_terms.map((kt) => ({ front: kt.term, back: kt.definition }))}` to `<Flashcard>`. This produces flashcards where the **front is just the bare term** (e.g., "Qualification Testing") rather than a question (e.g., "What is qualification testing?"). This is weaker pedagogically — it doesn't prompt active recall as effectively.

Compare L01–L09 where each card has `front: 'What is a loose-tube cable construction?'` (a question) and `back: 'A cable construction where...'`. L10/L11 cards are term → definition, not question → answer. The schema's `key_terms` named export in `meta` is also the right location for the Flashcard source (consistent with T02 template).

**Fix:** Move definitions into `meta.key_terms` array (as in L01) with question-form fronts in the `Flashcard` cards array. Alternatively, convert the `key_terms.map` cards to question-form fronts as a minimum fix.

### FINDING 4 — LOW
**L09 is the only lesson L01–L11 without a Book-vs-Field block**

All 8 lessons L01–L08 have an amber `Book vs. Field` block. L09 covers the NESC loading formulas, which is exactly the kind of material where the book-vs-field gap matters: the standard table values, what a formal engineering deliverable requires, vs. what a field engineer actually checks when stringing ADSS on a 35-pole Light-district run. L09 has detailed formula sections but no explicit book/field contrast block.

**Fix:** Add a Book vs. Field block to L09's working section noting: NESC Table 250-1 values are paywalled and the formal design deliverable requires confirming against the current edition, vs. the field practice of using the RUS 1724E-150 published table values that reproduce NESC for rural project work. The lesson already has the confirm-brackets in the text; a dedicated block would bring parity with L01–L08 and reinforce the lesson's practical value.

### FINDING 5 — LOW
**DAG cross-check: L04 lists `ADSS` in `vocabulary_assumed` as from `T01.L01` but T01.L01 intro material is upstream — verify source lesson**

L04 line 31: `{ term: 'ADSS', source_lesson_id: 'T01.L01' }`. The T03 research brief confirms ADSS is in the T01 vocabulary boundary (listed in "From T01" section). No violation, but the specific source lesson should be confirmed since ADSS might first appear in T01.L09 (NESC/aerial) rather than T01.L01, which typically covers foundational terminology. This is a low-confidence flag — verify in T01.

**No fix required unless T01 verification confirms the wrong source lesson.**

## Clean items confirmed

- Analogies present and effective in every lesson (garden hose, clothesline, off-road tire, chain mail, clothing, guitar string, insurance policy)
- Acronym tables present in L01–L09; L10/L11 explain inline (appropriate since those lessons ARE about reading spec documents)
- Foundations/Working/Advanced markers present in L01–L09 (L10/L11 use `data-tier` on `<section>` correctly)
- All interactive primitives woven into lesson flow, not dumped at the end
- Prerequisite DAG links in `meta.prerequisites` cross-check as consistent through L09 (L10/L11 link back to L01–L09 correctly)
- Book-vs-field blocks present in L01–L08, L10 (inline), L11 (inline) — L09 gap noted above
- Flashcard question-form fronts in L01–L09 are all questions, not bare terms
- L12 capstone correctly has no flashcards (schema-correct exemption)
- `estimated_minutes` is present in all 12 lessons
- No AI meta-references found in any lesson content

## Verdict: YELLOW

Three schema/component-prop issues (L12 BranchingScenario `states` vs. `nodes` breaks the capstone scenario; L10/L11 non-standard `vocabulary_introduced` and `key_terms` patterns) plus one missing book-vs-field block in L09. Content quality and pedagogical structure are otherwise solid — this is a patch wave, not a rewrite.

=== T03 AUTHOR RT-PEDAGOGY END ===
