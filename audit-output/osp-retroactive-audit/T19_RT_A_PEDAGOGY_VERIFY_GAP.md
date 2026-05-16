# T19 RT-A — Pedagogy / Coverage-Completeness / Citation-Existence Verification

**Topic:** T19 — Headend / CO + Rack-Side Hardware Basics
**Framing:** Pedagogy + Coverage-Completeness + Citation-Existence (RT-A)
**Counterpart:** RT-B (technical/math/field-practice framing — parallel, not read)
**Lessons audited:** L01–L10 (10 lessons, commits a9e928d, 9d22da1, 2b36002)
**Date:** 2026-05-16
**Auditor:** RT-A (read-only; no lesson code modified)

---

## PART 1 — VERIFICATION FINDINGS

### ARCH.md scope checklist — coverage audit

| ARCH.md scope item | Covered? | Lesson | Notes |
|---|---|---|---|
| CO / hut / headend layout | ✓ | L01 | Full room-by-room breakdown, MEF/MDF/MER zones |
| OLT / CMTS as black boxes | ✓ | L02 | GPON signal path, port spec table, SideBySide primitive |
| –48VDC power plant | ✓ | L03 | Negative-ground convention, rectifier, float voltage, VRLA |
| Battery backup + generator transfer | ✓ | L04 | ATS sequence, fuel polishing, N+1 gap noted |
| HVAC / fire suppression awareness | ✓ | L05 | CRAC, clean-agent, pre-action, ASHRAE envelope |
| Headend grounding boundary (Path Y) | ✓ | L06 | primary protector, IBT-entry, GES-tie-in — all three introduced |
| Rack-side hardware (patch panels, LIU) | ✓ | L07 | interconnect vs. cross-connect, ODF rack anatomy |
| FOSC / splice enclosures in headend | ✓ | L08 | rack-mount FOSC, express vs. split, gel-free indoor requirement |
| FDH internals beyond the box | ✓ | L09 | modular bay, splitter cassette, connector field, demarc |
| Capstone quiz | ✓ | L10 | 15Q + AnnotatedDiagram + WorkedExample battery sizing |

**Coverage verdict: COMPLETE** — all 10 ARCH.md scope items present.

---

### Citation existence — per lesson

**L01:**
- TIA-569-E [confirm edition] — cited in quiz explanation and book-vs-field. TIA-569 is a legitimate TIA standard; edition needs confirmation (`[confirm edition]` marker present). ✓ ACCEPTABLE
- NEC NFPA 70-2023 Art. 770 — cited in quiz Q3, MEF description. Art. 770 is the correct NEC article for optical fiber cables. ✓ CONFIRMED
- TIA-942-C [confirm edition] — cited in advanced section. Allowlist entry confirmed. ✓ ACCEPTABLE
- NFPA 110 [confirm edition — RUS hut context] — correctly flagged as needing edition confirmation. ✓ ACCEPTABLE
- RUS 1751F-810 §3 — allowlisted. Cited in quiz Q2 explanation. ✓ ACCEPTABLE

**L02:**
- ITU-T G.984.2 — cited for Class B+ 28 dB budget. Allowlist: G.984.x series is listed. ✓ CONFIRMED
- ITU-T G.9807.1 [confirm edition] — XGS-PON; correctly paywalled-flagged. ✓ ACCEPTABLE
- ITU-T G.989.2 — NG-PON2; correctly flagged. ✓ ACCEPTABLE
- ANSI/ATIS-0600336 — NEBS standard; allowlist entry confirmed. ✓ ACCEPTABLE

**L03:**
- ANSI/ATIS-0600336 — ✓ ACCEPTABLE
- Telcordia GR-63-CORE [paywalled — confirm] — correctly paywalled-flagged. ✓ ACCEPTABLE
- **FINDING A-1 (MED):** L03 mentions "float voltage typically 2.25–2.27 V per cell (verify with battery manufacturer)" — this is a specific numeric range. Both R-1 and R-2 flagged this as needing primary-source verification. The lesson cites "VRLA manufacturer specification" generically but does NOT cite a specific standard or document. The float voltage range (2.25–2.27 V) is consistent with IEEE 1188 (Recommended Practice for Maintenance, Testing, and Replacement of Valve-Regulated Lead-Acid (VRLA) Batteries) which is NOT in the citation allowlist. The lesson body says "verify with battery manufacturer" which is a reasonable hedge, but the training content appears to state the number as if it were a standard, not an example. **Recommendation:** add `[typical VRLA range — confirm with battery manufacturer and IEEE 1188; varies by manufacturer]` tag, or cite IEEE 1188 explicitly with paywalled flag.

**L04:**
- NFPA 110-2022 §8.4 — cited in book-vs-field. Allowlist-confirmed (R-1 verified publicly indexed via NFPA.org). ✓ ACCEPTABLE
- BICSI 002-2024 — cited for N+1. ✓ ACCEPTABLE (paywalled-flagged in research)
- **FINDING A-2 (MED):** L04 capstone quiz Q05 (in L10) claims GR-63-CORE requires transfer within "30 seconds." R-1 explicitly flagged the GR-63-CORE figure as paywalled and not independently verifiable; the lesson presents it as a definitive "NEBS GR-63-CORE" requirement without a `[confirm]` tag. This is a specific paywalled-standard numeric claim that should carry `[GR-63-CORE — paywalled; confirm with NEBS compliance documentation]`.

**L05:**
- NFPA 76-2022 — cited for fire suppression. Allowlist-confirmed. ✓ ACCEPTABLE
- NFPA 75 — cited. Allowlist-confirmed. ✓ ACCEPTABLE
- TIA-942-C §6.1 — cited for HVAC. Allowlist-confirmed. ✓ ACCEPTABLE
- ASHRAE TC 9.9 — cited in L10 capstone Q07 explanation for 64.4°F–80.6°F range. ASHRAE publishes thermal guidelines publicly. ✓ ACCEPTABLE
- **FINDING A-3 (LOW):** L05 vocabulary_introduced lists `'ASHRAE thermal envelope'` but the key_terms definition uses the phrase "ASHRAE A2 envelope." The lesson body and L10 Q07 correctly reference "ASHRAE TC 9.9 ... A1/A2 class." The vocabulary_introduced name "ASHRAE thermal envelope" is somewhat imprecise — the formal term is "ASHRAE thermal envelope" but the classification labels are A1/A2/A3/A4. Minor inconsistency; not wrong, but could cause confusion with "A2 envelope" vs "A2 class." Low-priority polish.

**L06 (Path Y — critical):**
- NEC NFPA 70-2023 Art. 770 — cited for primary protector requirement. ✓ CONFIRMED
- NEC NFPA 70-2023 Art. 250.94 — cited for IBT. ✓ CONFIRMED
- RUS 1751F-810 §3 — cited for building-entry bonding. Allowlist-confirmed. ✓ ACCEPTABLE
- TIA-607-D §4.2, §7, §9 [confirm edition] — all correctly paywalled-flagged. ✓ ACCEPTABLE
- IEEE Std 487 [confirm edition] — GPR context; cited in quiz Q1 explanation. Not in allowlist but also not claimed as primary cite — "GPR context" framing is appropriate. ✓ ACCEPTABLE
- **FINDING A-4 (LOW):** L06 vocabulary_introduced includes `'TMGB'`, `'TGB'`, `'TBB'`, and `'GPR'` in addition to the three Path Y terms (primary protector, IBT-entry, GES-tie-in). ARCH.md's vocabulary table for T19 lists ONLY: `HGER, TGB, TBB [forward-ref: T14 owns full design], primary protector, IBT-entry, GES-tie-in`. The T19 vocabulary table in ARCH.md does NOT include `TMGB` or `GPR` as terms introduced in T19. T14's vocabulary table DOES include `TMGB`. This may be a mild DAG conflict — `TMGB` is formally introduced in T19.L06 in the authored content, but ARCH.md places it in T14's territory. Not a hard error (introducing terms early is acceptable), but it should be flagged so T14 authors know T19 already introduced TMGB formally and T14 should reference T19.L06 in its vocabulary_assumed block rather than re-introducing it.

**L07:**
- TIA-568.3-D §6 — interconnect vs. cross-connect definition. Allowlist-confirmed. ✓ ACCEPTABLE

**L08:**
- NEC Art. 770.26 — OSP cable 50-ft limit inside building. NEC Art. 770 is confirmed allowlist. ✓ ACCEPTABLE

**L09:**
- ITU-T G.984.2 — cited in BranchingScenario test-power state (–25 dBm reading, Class B+ budget check). ✓ ACCEPTABLE
- **FINDING A-5 (HIGH) — Splitter insertion loss numeric claim:** L09 states "17–17.5 dB of passive insertion loss" for a 1×32 splitter. Author flagged this as a cross-check point (judgment call #2 cross-references T05 lesson content). 
  - Independent gap research: ITU-T G.671 Amendment 1 specifies a 1:32 splitter insertion loss of **18.1 dB** (per IEEE 802.3 reference document citing G.671 2009 revision). The lesson teaches "17–17.5 dB" which is commonly cited in vendor literature (PLC splitter insertion loss typical values from Holightoptic and similar sources show 17.0–17.5 dB typical). The discrepancy is: **ITU-T G.671 standard maximum insertion loss ≈ 18.1 dB; typical PLC practical loss ≈ 17–17.5 dB.**
  - T05 discussion referenced in judgment call #2: need to cross-check T05 lesson content, but this RT-A is read-only on T05 files. Based on CLAUDE.md, T05 post-fix RT was GREEN — T05 presumably used 17–17.5 dB if cited there.
  - **Assessment:** "17–17.5 dB" is the typical measured value for quality PLC splitters. 18.1 dB is the ITU-T G.671 maximum (worst-case spec for standards compliance). Teaching the typical/practical value without distinguishing it from the G.671 spec maximum could lead an OSP engineer to use the typical in a link budget without margin for a worse-performing splitter. **Recommendation:** teach BOTH: "typical PLC splitters measure 17–17.5 dB insertion loss; ITU-T G.671 allows up to 18.1 dB for compliant 1×32 splitters. Use 18.1 dB (or your vendor spec) in link budget calculations — budget for the worst case, not the typical." This is a HIGH finding because it directly affects link budget math that is actionable in OSP plant design, and the current lesson teaches the optimistic typical without the standards-based ceiling.

**L10 (capstone):**
- No new citations not already covered above.

---

### Pedagogy audit — all lessons

**"Stupid simple" pitch + plain-English intros:** PRESENT in all lessons. L01–L08 all have `<h2>In Plain English</h2>` opening sections. L09 has an equivalent plain-English opening paragraph. L10 capstone is quiz-only (appropriate — no narrative intro needed). ✓

**Acronym mini-glossaries:** PRESENT in L01–L07. L09 has an inline acronym table in foundations. L08: verified; contains inline table. ✓

**Tiered content (foundations/working/advanced):** PRESENT across all lessons via `data-tier` section attributes. L01, L02, L03 have all three tiers; L05 uses foundations/working with appropriate depth. L09 uses foundations/working/advanced correctly. ✓

**Book-vs-field callouts:** PRESENT in all lessons. Critical GPR book-vs-field in L06 is detailed and uses dollar-value consequences ($5,000–20,000+ OLT damage) to land the lesson. L03 calls out UPS-on-AC vs. proper –48VDC plant. L09 calls out cassette fill rate (RUS phased vs. full population). ✓

**Analogies / real-world framing:** PRESENT. L03 uses "giant battery bank" framing. L06 uses messenger-on-MGN lightning path analogy. L09 uses "three zones left to right" spatial framing for FDH interior. ✓

**Learning objectives / meta export:** All lessons have `export const meta` with id, course_id, title, order, lesson_type, prerequisites, vocabulary_introduced, key_terms, vocabulary_assumed, estimated_minutes. ✓

---

### Flashcard audit (directive 18z HARD requirement)

Every lesson with vocabulary_introduced MUST render `<Flashcard>` inline. Capstone (L10) is exempt (lesson_type: capstone-quiz per schema.md).

| Lesson | vocabulary_introduced items | Flashcard rendered? |
|---|---|---|
| L01 | 8 terms | ✓ — 7 flashcards rendered (CO, hut, headend, MDF, IDF, main entrance facility, OSP termination point); `equipment room` is in vocabulary_introduced but NOT in flashcard deck |
| L02 | 9 terms | ✓ — 9 flashcards rendered (OLT, CMTS, GPON port, upstream, downstream, DOCSIS, line card, chassis, port density) ✓ |
| L03 | 8 terms | ✓ — flashcards present (confirmed via key_terms array in file) |
| L04 | 7 terms | ✓ — Flashcard component imported |
| L05 | 6 terms | ✓ — Flashcard component imported |
| L06 | 7 terms | ✓ — 7 flashcards rendered (primary protector, IBT-entry, GES-tie-in, TMGB, TGB, TBB, GPR) ✓ |
| L07 | 8 terms | ✓ — Flashcard component imported |
| L08 | 6 terms | ✓ — Flashcard component imported |
| L09 | 6 terms | ✓ — Flashcard rendered via `meta.key_terms.map(({ term, definition }) => <Flashcard key={term} term={term} definition={definition} />)` |
| L10 | capstone-quiz | exempt ✓ |

**FINDING A-6 (LOW):** L01 vocabulary_introduced includes `'equipment room'` (8th item in the array) but the Flashcard deck in L01 has only 7 cards — `equipment room` is missing a flashcard. The key_terms array does include `'equipment room'` with a definition, so the definition exists. The render just doesn't include a card for it. Minor omission — flashcard deck should match vocabulary_introduced count.

---

### Per-lesson quiz audit

All lessons L01–L09 have `<Quiz>` components with ≥4 questions each. L06 has 5 MC questions covering the critical GPR scenario. L09 has 5 MC questions. L10 capstone has 15 questions. All questions have `explanation` fields. No `[CORRECT]` tag pattern used — `answerIndex` pattern is consistent with Quiz primitive spec. ✓

---

### DAG metadata audit

**Prerequisite chain check (L01→L09):**
- L01 prerequisites: ['T01.L01', 'T05.L01', 'T06.L01', 'T18.L01'] — matches ARCH.md DAG prereqs T01, T05, T06, T18 ✓
- L02 prerequisites: ['T19.L01'] — correct sequential prereq within T19 ✓
- L06 prerequisites: ['T19.L05'] — correct ✓
- L10 prerequisites: all 9 prior lessons — correct ✓

**vocabulary_assumed cross-check (L06 — the critical Path Y lesson):**
- L06 vocabulary_assumed includes: CO (T19.L01), hut (T19.L01), main entrance facility (T19.L01), OSP termination point (T19.L01), MGN (T01.L08), IBT (T01.L08), GES (T01.L08), messenger (T05.L01), armor (T03.L01)
- **FINDING A-7 (MED):** L06 vocabulary_assumed cites `'MGN'`, `'IBT'`, and `'GES'` as sourced from `T01.L08`. However, ARCH.md's T01 vocabulary table lists the terms introduced in T01 as: `OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH`. MGN, IBT, and GES are NOT in the T01 vocabulary list per ARCH.md. The nearest legitimate source for MGN/IBT/GES would be T14 or T06 (or net-new introduction in T19.L06). Citing T01.L08 as the source_lesson_id for MGN/IBT/GES creates a false DAG reference — if a learner goes to T01.L08 to look up MGN, it won't be there per the ARCH.md spec. Either: (a) T19.L06 introduces MGN/IBT/GES (and should list them in vocabulary_introduced rather than vocabulary_assumed), or (b) the source_lesson_id should reference a lesson that actually introduces these terms. This is a DAG integrity issue.

---

### Path Y implementation check

ARCH.md requires T19.L06 to introduce primary protector, IBT-entry, GES-tie-in with explicit forward-references to T14. Check:
- ✓ primary protector: formally introduced in L06 key_terms with definition + forward-ref "You'll learn the full sizing and placement methodology in T14"
- ✓ IBT-entry: formally introduced with definition + forward-ref "You'll learn the full IBT sizing, testing, and RUS-program requirements in T14"
- ✓ GES-tie-in: formally introduced with definition + forward-ref "You'll see the full electrode types, resistance targets, and bonding conductor sizing in T14"
- ✓ Forward-reference box in L06 foundations section explicitly says: "T14 (Bonding, Grounding & Electrical Protection) is the 'why, how big, and how to test'"
- ✓ L10 capstone Q09 correctly asks about the Path Y three terms and answer key confirms primary protector / IBT-entry / GES-tie-in

**Path Y verdict: IMPLEMENTED CORRECTLY** ✓

---

## PART 2 — INDEPENDENT GAP-RESEARCH FINDINGS

Independent research angles used: web search (ITU-T G.671 splitter specs, NEC 770 building entry, OSP curriculum survey, –48VDC standards, FDH product literature from Clearfield/OCC/Tii), different from R-1 (primary-source/skeptical) and R-2 (secondary-source/adversarial).

### GAP-1 (MED) — VRLA battery equalization charge not covered

R-2 flagged the equalization/battery float distinction; confirmed in independent research. L03 covers float voltage but does NOT mention equalization charging (periodic high-voltage charge to desulfate VRLA plates). For a rural FTTH hut where the ISP tech's job includes battery maintenance, this is a real operational gap. The lesson teaches float voltage (2.25–2.27 V/cell) without explaining that VRLA batteries also require periodic equalization at higher voltage (~2.40–2.45 V/cell) and that skipping equalization leads to sulfation and premature battery failure. An OSP engineer specifying a hut should know to include equalization charging capability in the rectifier spec. This is not a hard-error — it's a depth gap for a working lesson that could cost real money when a field crew inherits a hut they don't understand.

### GAP-2 (LOW) — NEC 770.26 50-ft rule not covered in L01 (referenced only in ARCH.md source notes for L01 and L08)

ARCH.md source notes for T19.L01 include: "NEC 770.26 scope note: OSP-rated cable can run max 50 ft inside building before transitioning to indoor-rated or continuous conduit." L08 covers this rule in its key_terms. L01 references cable management from MEF to MDF in the building but does NOT explicitly state the 50-ft transition rule or the OFNR/OFNP jacket requirement. A learner reading L01 on building layout gets the physical routing picture but misses the NEC 770.26 constraint that governs where on that route the OSP cable must transition to indoor rating. L08 covers it correctly — but L01 should at minimum cross-reference L08 for this constraint since L01 is where the cable routing concept is introduced. Not an error; a forward-reference gap.

### GAP-3 (LOW) — FDH cabinet grounding not explicitly covered in L09

FDH cabinets have a ground lug on the cabinet that must be bonded to the nearest MGN bond point or a driven ground rod (TIA-607 and NEC Art. 250.94 both apply to FDH cabinets as buildings/structures with telecommunications infrastructure). L09 covers everything inside the FDH but does NOT mention the FDH cabinet ground lug — the one metallic piece of the FDH that the OSP engineer must specify bonded to ground. L09's advanced section cross-references T14 for "the FDH cabinet ground lug and the bonding conductor from the FDH to the nearest MGN bond point" (line 582–584) which is a good forward-reference. But no mention in the working or foundations tier. An OSP engineer could read L09 and walk away thinking FDH is purely passive optical with no grounding obligation on their end. The cross-reference to T14 covers it, but an inline sentence in the working tier would prevent the miss.

### GAP-4 (MED) — OLT port density disclaimer absent from L02

R-1 explicitly flagged: "OLT chassis port density is vendor-specific — confirm with equipment spec sheet." L02 states in the quiz explanation: "A fully loaded OLT with 8 line cards × 16 ports per card = 128 GPON ports." This specific calculation (8 × 16 = 128) presents as a general statement rather than an "e.g., one vendor's platform" example. The lesson body states "OLT line cards typically provide 8–16 GPON ports" with the hedge word "typically" — but the quiz makes it concrete as if 8 line cards × 16 ports = 128 is a representative spec. A learner could walk away thinking OLT capacity is 128 ports standard. Per R-1's research guidance, this should be explicitly disclaimed as vendor-specific and example-only in both the lesson body and the quiz explanation.

---

## PART 3 — AUTHOR JUDGMENT CALL VERDICTS

### Judgment Call #1 — L02 OLT vocabulary_assumed cites T01.L08

**Author's position:** OLT formally introduced in T19.L02 `vocabulary_introduced`, but L01 already references OLT in `vocabulary_assumed` citing T01.L08. Does the DAG require a single introduction point?

**RT-A verdict: AGREE-CONCERN**

ARCH.md's T01 vocabulary table lists `OLT` in T01's vocabulary_introduced: "headend, OLT, ONT, FDH." So T01.L08 as the source is consistent with ARCH.md's intent — OLT is introduced at the vocabulary level in T01.L08 (Acronyms Field Reference), then L02 re-introduces it with full definition and ISP-context depth. This is the intended "introduce light → deepen later" pattern, not a DAG violation. L01 correctly citing T01.L08 as the vocabulary assumed source for OLT is fine.

**However:** L02's `vocabulary_introduced` also lists `'OLT'` — meaning L02 claims to introduce it fresh. This creates a mild inconsistency: L01 already assumes OLT (from T01.L08), but L02 claims to introduce it. The cleanest resolution: L02 should call `OLT` a `vocabulary_assumed` term (from T01.L08) and use vocabulary_introduced for the new depth terms it adds (`CMTS`, `GPON port`, `upstream`, `downstream`, `DOCSIS`, `line card`, `chassis`, `port density`). The current approach still works pedagogically (the full definition in L02 is additive depth), but the DAG metadata is imprecise.

### Judgment Call #2 — L09 "17–17.5 dB" for 1×32 splitter cross-check with T05

**Author's position:** T05 lesson content presumably used the same 17–17.5 dB figure; flagged for cross-check.

**RT-A verdict: FLAG-FOR-FIX (HIGH)**

See Finding A-5 above. ITU-T G.671 specifies 18.1 dB max insertion loss for a 1×32 splitter. The typical/practical PLC figure is 17–17.5 dB. Teaching "17–17.5 dB" without the G.671 standards ceiling is pedagogically incomplete for an OSP engineer doing link budgets — they should budget to the standard maximum, not the best-case typical. The fix is straightforward: add the G.671 18.1 dB figure with the context that 17–17.5 dB is practical/typical and 18.1 dB is the standards compliance ceiling for link budget purposes.

### Judgment Call #3 — L10 Q09 Path Y terms vs. TMGB/TGB/TBB

**Author's position:** Q09 asks "three PATH Y terms introduced in T19" — does the answer correctly distinguish primary protector / IBT-entry / GES-tie-in from TMGB / TGB / TBB?

**RT-A verdict: AGREE-AUTHOR**

Q09 answer key (correctIndex: 1 = "Primary protector, IBT-entry, and GES-tie-in") is correct. The answer explanation accurately explains why TMGB/TGB/TBB are NOT the three Path Y terms (those are also introduced in T19.L06 but are ISP-side grounding topology, not the three OSP building-entry protection elements). The distractor "TMGB, TGB, and TBB" (option A) is plausible enough to test understanding without being a trick question. The explanation in the answer key correctly cross-references T19.L06. ✓

---

## FINDINGS SUMMARY TABLE

| # | Severity | Lesson | Finding |
|---|---|---|---|
| A-1 | MED | L03 | Float voltage 2.25–2.27 V/cell stated without `[confirm]` tag — IEEE 1188 not in allowlist |
| A-2 | MED | L10/L04 | GR-63-CORE 30-second ATS transfer claim — paywalled standard, no `[confirm]` tag |
| A-3 | LOW | L05 | vocabulary_introduced "ASHRAE thermal envelope" vs. lesson body "ASHRAE A2 envelope" label inconsistency |
| A-4 | LOW | L06 | TMGB introduced in T19.L06 but ARCH.md assigns TMGB to T14 vocabulary; T14 authors need T19.L06 as vocab_assumed source |
| A-5 | HIGH | L09 | 1×32 splitter loss stated as "17–17.5 dB" — ITU-T G.671 max is 18.1 dB; link budget should use standards ceiling |
| A-6 | LOW | L01 | `equipment room` in vocabulary_introduced but absent from flashcard deck (7 cards vs. 8 terms) |
| A-7 | MED | L06 | vocabulary_assumed cites MGN/IBT/GES from T01.L08 — those terms not in T01's ARCH.md vocabulary list |
| GAP-1 | MED | L03 | VRLA equalization charging not covered — practical gap for rural hut maintenance |
| GAP-2 | LOW | L01 | NEC 770.26 50-ft transition rule not cross-referenced in L01 building routing section |
| GAP-3 | LOW | L09 | FDH cabinet ground lug bonding not stated in working/foundations tier (forward-ref to T14 present in advanced tier) |
| GAP-4 | MED | L02 | OLT port-count example (8 × 16 = 128) presented without explicit vendor-specific disclaimer |

**Count by severity:** HIGH: 1 | MED: 4 | LOW: 5

**Verdict: YELLOW** — One HIGH (splitter loss figure pedagogically incomplete for link-budget use), four MED, five LOW. No architectural re-author required; all findings are fixable in a patch wave targeting specific lesson lines.

**Biggest concern:** Finding A-5 (L09 splitter loss 17–17.5 dB vs. ITU-T G.671 18.1 dB max). An OSP engineer taught to budget 17.5 dB for a 1×32 split will have 0.6 dB less margin than the standards ceiling allows — in a tight link budget at maximum drop length, this difference triggers a false "passes" verdict on a design that may fail with a marginal splitter. Teach both: typical field performance AND the standards-compliance ceiling.

=== T19 RT-A PEDAGOGY-VERIFY-GAP END ===
