# T05 Final-Verify-2 RT-B — Technical + Math + Primary-Source Verification (CURRENT SESSION)
**Agent role:** Read-only technical/math/citation verifier — FINAL-VERIFY-2 pass  
**Framing:** Senior OSP engineer + NESC standards expert + structural physics  
**State verified:** HEAD `aa8b8a7` (polish-3 commit `5d9e1e9` included)  
**Date:** 2026-05-16  
**Constraints acknowledged:** STRICT READ-ONLY. No lesson files modified. Write-path = this file only.

---

## SUPERSESSION NOTE
This file now contains the FINAL-VERIFY-2 RT-B report (current session, post polish-3).
The prior content below the separator is from the FIRST FINAL-VERIFY RT-B pass and is retained for audit trail. The current session report is above.

---

# T05 Final-Verify-2 RT-B — Technical Pass (Current Session)

## 1. Numeric Re-Derivation Log

All computations independently derived. Results compared to lesson content.

| Claim | My Result | Lesson | Match |
|---|---|---|---|
| L07 Ex1: s = (0.145×150²)/(8×600) | **0.6797 ft** | 0.680 ft | ✓ |
| L07 Ex1: w_wind = 9×(0.5/12) | **0.375 lb/ft** | 0.375 lb/ft | ✓ |
| L07 Ex1: w_combined = √(0.145²+0.375²) | **0.4021 lb/ft** | 0.402 lb/ft | ✓ |
| L07 Ex1: s_wind, clearance margins | **1.885 ft / +5.82 / +4.62 ft** | 1.885 / 5.82 / 4.62 | ✓ |
| L07 Ex2 Heavy: w_ice=1.244×0.50×1.00 | **0.622 lb/ft** | 0.622 lb/ft | ✓ |
| L07 Ex2 Heavy: w_wind=4×(1.50/12) | **0.500 lb/ft** | 0.500 lb/ft | ✓ |
| L07 Ex2 Heavy: w_combined, sag, margin | **0.916 / 4.292 ft / +2.21 ft** | 0.916 / 4.294 / +2.21 | ✓ |
| L15 WorkedEx: H=3200×0.20 | **640 lb** | 640 lb | ✓ |
| L15 WorkedEx: s_nowind=(0.280×40000)/5120 | **2.19 ft** | ~2.19 ft | ✓ |
| L15 WorkedEx: w_wind=9×(0.68/12) | **0.510 lb/ft** | ~0.510 lb/ft | ✓ |
| L15 WorkedEx: w_comb=√(0.280²+0.510²) | **0.582 lb/ft** | ~0.582 lb/ft | ✓ |
| L15 WorkedEx: s_wind, margin | **4.55 ft / +3.95 ft** | ~4.55 / ~3.95 | ✓ |
| L15 Q12: s=(0.200×14400)/6400; margin | **0.450 ft / +5.05 ft** | 0.450 / +5.05 | ✓ |
| L15 Q13: 1.244×0.50×1.32 | **0.821 lb/ft** | 0.821 lb/ft | ✓ |
| L15 Q15: √(500²+500²) corner pole | **707.1 lb** | 707 lb | ✓ ← CRITICAL √2 VERIFIED |
| L15 Q18: √(0.966²+0.607²) | **1.141 lb/ft** | ~1.141 lb/ft | ✓ |
| L15 Q20: 57×π/144 | **1.2435** | 1.244 | ✓ |
| L07 Q1: (0.200×14400)/5600 | **0.514 ft** | 0.514 ft | ✓ |
| 1:32 PLC splitter: 10×log₁₀(32)+2–2.5 | **17.05–17.55 dB** | 17–17.5 dB | ✓ |
| 57 × π / 144 ice coefficient | **1.2435** | 1.244 | ✓ |

**All 20 numeric claims VERIFIED. Zero errors in math or physics.**

### Parabolic approximation precision note
Lesson states: accurate within 1% when s/L < 10%. Independent derivation:
- At s/L = 10%: actual error = **1.32%** (parabola SLIGHTLY overstates catenary)
- At s/L = 9%: error = 1.07%; at s/L = 8%: error = 0.85%
- True threshold for <1% error: s/L < ~8–9%, not 10%

**Assessment:** LOW precision note only. For OSP design spans (s/L typically 1–3%), error is <0.04% — engineering irrelevant. The 10% threshold is the standard industry rule-of-thumb (ASCE wire mechanics references). Not actionable for an OSP curriculum.

---

## 2. Primary-Source NESC Citation Verification

| Citation | Claim | Independent Check | Result |
|---|---|---|---|
| Rule 232 ≈15.5 ft | Hi-Line App Guide + ikeGPS cited | Consistent with multiple NESC application guides and utility attachment standards | ✓ VERIFIED |
| Rule 235 ≈40 in at-pole / ≈30 in midspan | ikeGPS + We-Energies cited | 40 in = confirmed; 30/40 = 75% confirmed | ✓ VERIFIED |
| Rule 250 Light: 0 ice, 9 psf, +30°F | Secondary NESC summaries | Consistent across 4+ independent sources | ✓ VERIFIED |
| Rule 250 Heavy: 0.50 in, 4 psf, 0°F | Secondary NESC summaries | Consistent | ✓ VERIFIED |
| Rule 250C 60-ft threshold | Multiple secondary sources | Confirmed in Hi-Line, utility guides, PUC rules | ✓ VERIFIED |
| Macon, GA = Light district | NESC Fig 250-1 (secondary) | Macon = Bibb County, inland ~200 mi from coast, no 250C overlay | ✓ VERIFIED |
| 1.244 = 57×π/144 | Independently derived | 57 lb/ft³ NESC glazed ice, annular ring geometry, 144 in²/ft² | ✓ VERIFIED |
| Grade B triggers: railroad, navwater, limited-access hwy | Rule 261 secondary sources | Consistent | ✓ VERIFIED |
| GPON 1:32 = 17–17.5 dB | ITU-T G.671 + datasheets | Theoretical 15.05 + 2–2.5 excess = 17.05–17.55; 17–17.5 is accepted shorthand | ✓ VERIFIED |
| OTMR 47 CFR 1.1411, FCC 18-111 | FCC OTMR Order | Simple vs complex distinction confirmed | ✓ VERIFIED |

---

## 3. Polish-3 + Polish-1/2 Verification

### Polish-3 fix: T07/L02 `existing utilities` pointer T04.L02 → T04.L01
- Commit `5d9e1e9` verified via git: 1 file changed, 1 insertion/1 deletion
- T07/L02 line 36: `{ term: 'existing utilities', source_lesson_id: 'T04.L01' }` ✓
- T04.L01 `vocabulary_introduced` contains `'existing utility'` (singular) ✓
- **Fix VERIFIED CORRECT.** Singular vs plural is the same concept — acceptable DAG pointer.

### Polish-2 items
- **P2 (GPON 17–17.5 dB):** L12 prose contains "approximately 17–17.5 dB." Independently computed as 17.05–17.55 dB. Lesson is within 0.05 dB of true upper bound. VERIFIED acceptable.
- **P4 (ADSS Flashcard removed):** ADSS is vocabulary_assumed from T03.L04 in L10 — correctly NOT in Flashcard deck. VERIFIED.
- **P8 (23 CFR 625.2 / AASHTO 14 ft vs 16 ft):** L02 correctly distinguishes FHWA maintained minimum (14 ft), AASHTO new-construction (16 ft), and NESC Rule 232 (~15.5 ft) as three independent standards. VERIFIED technically precise.
- **NB-2 (w_combined conservative label):** L07 and L15 both label using w_combined in the sag formula as a conservative approximation because the cable tilts leeward and the true vertical sag component is governed by gravity weight alone. Physics confirmed correct — conservative direction verified. VERIFIED.

---

## 4. RT-A 3-Finding Reconciliation (Post-Independent Pass)

### GAP-NEW-A (MED): T05.L03 supply space / communication space / climbing space in BOTH vocabulary_introduced AND vocabulary_assumed
**CONCUR.** Directly confirmed:
- T05.L03 `vocabulary_introduced` (lines 26–36): includes `'supply space'`, `'communication space'`, `'climbing space'`
- T05.L03 `vocabulary_assumed` (lines 41–43): includes all three pointing to `T01.L02`
- T01.L02 `vocabulary_introduced` (lines 18–32): **CONFIRMED** — all three terms ARE listed there

DAG violation is real: a lesson cannot both introduce a term (claiming first-introduction in vocabulary_introduced) AND assume it (acknowledging prior introduction in vocabulary_assumed). T01.L02 is the correct and actual first introduction. T05.L03 should remove `supply space`, `communication space`, and `climbing space` from its `vocabulary_introduced`. **CONCUR MED.**

### GAP-NEW-B (LOW): T05.L01 has 10 vocabulary_introduced terms but only 6 Flashcards
**CONCUR.** vocabulary_introduced (lines 23–34): NESC, IEEE C2, Rule, Section, Part, AHJ, Rule 232, Rule 235, Rule 250, Rule 261 = 10 terms. Flashcard deck (lines 324–333): NESC, AHJ, Rule 232, Rule 235, Rule 250, Rule 261 = 6 cards. Missing: IEEE C2, Rule, Section, Part — all of which have full key_terms definitions (lines 51–95). **CONCUR LOW.**

### GAP-NEW-C (LOW): T07.L02 `route survey → T04.L01` — term not in T04.L01's vocabulary_introduced
**CONCUR.** T07.L02 line 34: `{ term: 'route survey', source_lesson_id: 'T04.L01' }`. T04.L01 `vocabulary_introduced`: `['site walk', 'existing utility', 'hazard identification', 'photo log']`. `route survey` is ABSENT from T04.L01's formal vocabulary_introduced array. The body prose uses "route survey" as a synonym for "site walk" but never adds it to the array. RT-A's option (a) — add `'route survey'` to T04.L01's vocabulary_introduced — is the cleanest fix. **CONCUR LOW.**

---

## 5. Independent Gap Research (Technical Lens)

### GAP-TECH-1 (LOW): "slightly larger" word choice on w_combined conservatism is imprecise
**Location:** L07 sanityCheck note, L15 sanityCheck line.
**Finding:** The lesson labels using w_combined in the vertical sag formula as producing sag that is "slightly larger" than true vertical sag. In Light district (no ice, wind-dominant): combined sag = 1.885 ft vs bare-weight vertical sag = 0.680 ft — a 177% overstatement. "Slightly" is quantitatively wrong for this case. In Heavy district (ice-dominant): w_combined/w_vert ≈ 0.916/0.767 = 1.19 — there "slightly" would be appropriate.
**Physics direction:** CORRECT (conservative, safe).
**Fix:** Replace "slightly larger" with "conservatively larger" — preserves the meaning without false precision.
**Severity:** LOW — does not affect any safety guidance or design decision.

### GAP-TECH-2 (NONE — verified clean): Cross-standard conflicts
NESC Rule 232 vs DOT, NESC Rule 235 vs TIA-758, NESC Rule 250 vs ASCE 7, GPON vs EPON — no contradictions. All correctly scoped in lessons. VERIFIED CLEAN.

### GAP-TECH-3 (NONE — verified clean): Ice density 57 lb/ft³
ASCE 7-22 uses 56.2 lb/ft³. NESC specifies 57 lb/ft³ for its district loading tables. Lesson correctly uses 57 lb/ft³ for NESC district calculations — 1.4% more conservative than ASCE 7. CORRECT.

### GAP-TECH-4 (LOW — observation only): GPON 1:32 splitter upper bound 17.5 dB
True upper bound with 2.5 dB excess loss ≈ 17.55 dB. Lesson caps at 17.5 dB. Difference = 0.05 dB. In practice, Viavi/OFS PLC splitter datasheets spec max insertion loss at 17.4–17.5 dB (within measurement uncertainty of 17.55). Not actionable.

---

## 6. Final Verdict

**Verdict: YELLOW**

**T05 ready to close: NO — one MEDIUM blocking finding confirmed by both RT-A and RT-B.**

| Finding | Severity | Agreement | Action Required |
|---|---|---|---|
| GAP-NEW-A: T05.L03 three zone terms in both vocab_introduced AND vocab_assumed | MED | RT-A + RT-B CONCUR | Fix-agent required — remove 3 terms from vocab_introduced |
| GAP-NEW-B: T05.L01 missing 4 Flashcard cards | LOW | RT-A + RT-B CONCUR | Fix-agent (same pass) |
| GAP-NEW-C: T07.L02 `route survey → T04.L01` not in vocab_introduced | LOW | RT-A + RT-B CONCUR | Fix-agent: add 'route survey' to T04.L01 vocab_introduced |
| GAP-TECH-1: "slightly larger" → should be "conservatively larger" | LOW | New — RT-B only | Fix-agent (same pass) |
| GAP-TECH-4: GPON upper bound 17.55 vs 17.5 dB | LOW | New — RT-B only | Not actionable |
| Parabolic 1.32% vs <1% at 10% threshold | LOW | New — tech note | Not actionable (curriculum-appropriate) |

**Saturation:** RT-A (pedagogy framing) and RT-B (technical framing) independently found the same MEDIUM (GAP-NEW-A) — convergence confirms the finding. Both RT-A and RT-B agree 3 of the LOWs should be fixed. No NEW MEDs or HIGHs from the technical lens — the content is technically sound. After a surgical fix of the 1 MED + 3 LOWs, a lightweight spot-check is sufficient; full RT pair not required unless fix-agent touches additional files.

=== T05 FINAL-VERIFY-2 RT B TECHNICAL END ===

---

# PRIOR PASS CONTENT (Final-Verify-1 RT-B) — Retained for Audit Trail

**Framing:** Senior OSP engineer / NESC SME / structural physics skeptic
**Scope:** T05 L01–L15 (full); cross-touched T07 (L02, L04) and T08 per RT-A referrals
**Independent pass completed BEFORE reading RT-A report; RT-A read for reconciliation only**
**Date:** 2026-05-16

---

## 1. Math Re-Derivation Log

All numeric claims independently re-derived from first principles.

| # | Lesson | Claim | My Derivation | Verdict |
|---|--------|-------|---------------|---------|
| M01 | L02 Ex1 no-wind sag | s = (0.145×150²)/(8×600) = 0.680 ft | (0.145×22,500)/4,800 = 3,262.5/4,800 = **0.6797 ft** | VERIFIED |
| M02 | L02 margin no-wind | 22.0 − 0.680 − 15.5 = +5.82 ft | 22.0 − 0.6797 − 15.5 = **+5.820 ft** | VERIFIED |
| M03 | L02 wind load | w_wind = 9×(0.5/12) = 0.375 lb/ft | 9×0.04167 = **0.375 lb/ft** | VERIFIED |
| M04 | L02 w_combined | √(0.145²+0.375²) = 0.402 | √(0.02102+0.14062) = **0.4021** | VERIFIED |
| M05 | L02 wind sag + margin | s=1.885 ft, margin=+4.62 ft | s=9,046.3/4,800=**1.8846 ft**, margin=**+4.615 ft** | VERIFIED |
| M06 | L06 ice coeff | 57×π/144 = 1.244 | 57×3.14159/144 = 179.07/144 = **1.2435** | VERIFIED |
| M07 | L06 Heavy ADSS ice | w_ice=1.244×0.50×1.32=0.821 | 1.244×0.50×1.32 = **0.8211 lb/ft** | VERIFIED |
| M08 | L06 Heavy iced wind | w_wind=4×(1.82/12)=0.606 | 4×0.15167 = **0.6067 lb/ft** | VERIFIED |
| M09 | L06 Heavy w_combined | √(1.081²+0.606²)=1.240 | √(1.1686+0.3680)=√1.5367=**1.2396** | VERIFIED |
| M10 | L07 Heavy ice (6M strand) | w_ice=1.244×0.50×1.00=0.622 | **0.622 lb/ft** | VERIFIED |
| M11 | L07 Heavy wind on iced | w_wind=4×(1.50/12)=0.500 | **0.5000 lb/ft** | VERIFIED |
| M12 | L07 Heavy w_combined | √(0.767²+0.500²)=0.916 | √(0.5883+0.2500)=**0.9156** | VERIFIED |
| M13 | L07 Heavy sag + margin | s=4.294 ft, margin=+2.21 ft | s=20,601/4,800=**4.2918 ft**, margin=**+2.208 ft** | VERIFIED |
| M14 | L07 thermal elongation | ΔL=6.5×10⁻⁶×500×100=0.325 ft | **0.325 ft** | VERIFIED |
| M15 | L12 feeder fiber loss | 1.5 mi → 2.415 km → 0.966 dB | 1.5×1.61=2.415km, ×0.40=**0.966 dB** | VERIFIED |
| M16 | L12 drop fiber loss | 0.3 mi → 0.483 km → 0.193 dB | 0.3×1.61=0.483km, ×0.40=**0.1932 dB** | VERIFIED |
| M17 | L12 total loss + margin | 20.41 dB, margin 7.59 dB | 0.966+1.50+17.0+0.193+0.75=**20.409 dB**, margin=**7.591 dB** | VERIFIED |
| M18 | L12 1:32 splitter theory | 10×log₁₀(32) = 15.05 dB | **15.051 dB** | VERIFIED |
| M19 | L12 1:64 vs 1:32 delta | ~3 dB extra | log₁₀(64)−log₁₀(32) = 1.8062−1.5051 = **0.3010 → ×10 = 3.01 dB** | VERIFIED |
| M20 | L15 Q12 (post-fix) | s=(0.200×120²)/(8×800)=0.450 ft, margin=+5.05 ft | s=2,880/6,400=**0.450 ft**, margin=21−0.45−15.5=**+5.050 ft** | VERIFIED |
| M21 | L06 Light ADSS w_combined | w_wind=9×(0.82/12)=0.615, w_comb=0.668 | w_wind=**0.615**, w_comb=**0.6677** | VERIFIED |
| M22 | L12 Q3 connector variance | 3 pairs vs prose 2 FDH + 1 ONT | 3×0.75=2.25 dB; total=0.966+0.193+2.25+17.0=**20.409 dB** → CONSISTENT with prose (2 FDH + 1 ONT = 3 pairs total) | VERIFIED |

**Math re-derivation summary: 22 of 22 VERIFIED. Zero discrepancies.**

All prior RT-B (post-patch) discrepancy — Q12 label "+4.57 ft" — now shows **+5.05 ft** in the fixed file (RT-A confirms answerIndex 0 = "+5.05 ft" at line 299–306). RESOLVED.

---

## 2. Polish-Stage Verification (Technical Lens)

| Item | Technical Claim | Verification | Result |
|------|----------------|--------------|--------|
| L02 FHWA 14/16 ft distinction | 14 ft = maintained minimum (23 CFR 625.2); 16 ft = AASHTO new-construction; NESC ≈15.5 ft = separate governing standard for OSP cable | 23 CFR 625.2 governs existing overhead clearance minimums; AASHTO Green Book specifies 16 ft for new NHS construction — both technically correct in stated context | **VERIFIED — technically precise** |
| L02 + L15 conservative-approximation label | "using w_combined as a vertical load is a conservative approximation" | Confirmed: L02 lines 364–373 explicitly labels this. Math check: vertical-only sag = 0.680 ft; combined-load sag = 1.885 ft. The approximation is conservative (safe). Note below on "slightly." | **VERIFIED — label is correct** |
| L12 GPON 17–17.5 dB splitter | 1:32 PLC ≈ 17–17.5 dB per ITU-T G.671 | Theoretical: 10×log₁₀(32) = 15.05 dB ideal; PLC excess loss ≈ 2–2.5 dB above theoretical; confirmed by multiple PLC vendor datasheets and FOA reference guide | **VERIFIED — technically sound** |
| L15 Q12 = +5.05 ft | s=0.450 ft, margin=21−0.45−15.5=+5.05 ft | M20 derivation confirms exactly +5.050 ft. RT-A confirms answerIndex 0 matches. | **VERIFIED** |

**Technical note on "slightly larger" label:** The label in L02/L15 says "the computed sag is slightly larger than the true vertical sag component." In Light district (no ice, wind-dominant): combined-load sag = 1.885 ft vs bare-weight vertical sag = 0.680 ft — a 2.77× difference, not "slight." In Heavy district (ice-dominant): combined = 0.916 vs vertical component 0.767 — ~19% difference, where "slightly" is more accurate. The word "slightly" is imprecise for the wind-dominant (no-ice) case. However, the lesson correctly labels it "conservative approximation" which is the load-bearing term; "slightly" is a qualifier that weakens accuracy but doesn't affect safety guidance. **Severity: LOW** — the conservative direction is correct; "slightly" is misleading only in the Light district wind scenario.

---

## 3. Independent Gap Research (Senior Engineer Skepticism Framing)

**Angle:** What would a skeptical structural engineer with field + NESC + PON experience flag that other framings (pedagogy, primary-source-first, corroboration-adversarial) would not?

### GAP-A (LOW): "Slightly" qualifier on combined-load conservatism is magnitude-inaccurate
**Location:** L02 lines 364–373, L15 sanityCheck line 111.
**Finding:** In Light district (pure wind, no ice): using w_combined in the sag formula overstates vertical clearance sag by 177% (2.77× the true vertical component). The label correctly calls it "conservative approximation" — the physics direction is right. But the word "slightly" is quantitatively misleading for the wind-dominant case. In Heavy district where ice dominates, the overstatement is ~19% — where "slightly" would be appropriate.
**Practical impact:** A student who reads "slightly" may be confused when they compare the computed wind-loaded sag (1.885 ft) to the bare-weight sag (0.680 ft) and see a 177% difference. Could erode trust in the method.
**Fix:** Replace "slightly larger" with "conservatively larger" — one word, removes the false precision without changing the technical message.
**Severity:** LOW — conservative direction correct; word choice imprecise.

### GAP-B (INFORMATIONAL): L12 GPON 10 km differential — deferred status is appropriate
**Location:** L12 GPON key_term definition: "20 km logical (10 km physical differential)."
**Independent research:** ITU-T G.984.1 §8.2 specifies maximum differential fiber distance = 20 km (matching maximum logical reach). The 10 km differential is a vendor/operator deployment heuristic, not a G.984 specification. The deferred status from prior RT-B is confirmed appropriate.
**Severity:** INFORMATIONAL only — no action needed.

### GAP-C (VERIFIED CLEAN): Cross-standard hot-conflict sweep
Checked: NESC Rule 232 vs FCC OTMR (47 CFR 1.1411), NESC Rule 235 vs TIA-758, NESC Rule 250 vs ASCE 7-22 wind maps, ITU-T G.984 vs IEEE 802.3ah. **No conflicts.** NESC governs OSP structural requirements; FCC/TIA/RUS all defer to or are complementary with NESC. ASCE 7 site-specific maps are not used for NESC district calculations — NESC district loading values apply directly. GPON and EPON are alternative standards, not conflicting.

### GAP-D (VERIFIED CLEAN): Ice density 57 lb/ft³
**Finding:** ASCE 7-22 uses 56.2 lb/ft³ for design ice. NESC uses 57 lb/ft³ (NESC-specific value for Table 250 district loads). The lesson correctly uses 57 lb/ft³ — NESC-appropriate, 1.4% more conservative than ASCE 7. No issue.

### GAP-E (VERIFIED CLEAN): Thermal elongation coefficient 6.5×10⁻⁶ /°F
**Finding:** Standard value for high-strength steel strand per Alcoa SAG10, Southwire Engineering, and AEC references. Verified CORRECT. The lesson correctly notes aluminum creeps more than steel — also verified (aluminum α ≈ 12.8×10⁻⁶ /°F, ADSS aramid ≈ 2–3×10⁻⁶ /°F).

### GAP-F (VERIFIED CLEAN): Ruling span formula
**Finding:** Lesson L07 formula RS = √(ΣL³/ΣL) matches the Alcoa/Southwire standard ruling span formula. Verified with example spans [150, 175, 130, 160 ft] → RS = 156.3 ft (consistent with standard software outputs for that span range). CORRECT.

---

## 4. RT-A Four-LOW Reconciliation

*(RT-A report read after independent audit — §1-3 above are fully independent.)*

| RT-A Finding | Severity | My Assessment | Verdict |
|-------------|----------|---------------|---------|
| **NEW-A:** T05.L10 missing suspension clamp Flashcard card | LOW | Confirmed: L10 vocabulary_introduced (line 30) lists `suspension clamp`; key_terms (lines 70–73) has full definition; Flashcard block (lines 144–168) renders only 4 cards — aeolian, self-damping, span-rating, deadend-clamp. Suspension clamp card absent. Directive 18z violation. | **CONCUR** |
| **NEW-B-1:** T07.L04 `clearance → T05.L02` should be `T01.L02` | LOW | Confirmed: T07.L04 vocabulary_assumed line 33 shows `clearance → T05.L02`. T05.L02 introduces "traffic lane clearance" and "pedestrian clearance" (the NESC-specific forms). General concept "clearance" is T01.L02. Consistent with PW2-C pattern that fixed T07.L01. Arguable in either direction but T01.L02 is the first introduction. | **CONCUR (borderline)** |
| **NEW-B-2:** T07.L04 `attachment point → T05.L02` wrong | LOW | Confirmed: T07.L04 line 36 shows `attachment point → T05.L02`. T05.L02 vocab_assumed shows `attachment → T01.L02` — T05.L02 does NOT introduce "attachment point." Pointer is wrong. | **CONCUR** |
| **NEW-B-3:** T07.L02 `pole locations from design → T05.L02` wrong | LOW | Confirmed: T07.L02 vocabulary_assumed line 37 shows `pole locations from design → T05.L02`. T05.L02 introduces Rule 232, traffic lane clearance, pedestrian clearance, sag formula, design clearance margin, Grade B crossing — NOT "pole locations from design." The pointer appears incorrectly assigned. | **CONCUR** |

---

## 5. All-Prior-Fix Verification Table

| Wave | ID | Status | Technical Lens Verification |
|------|----|--------|-----------------------------|
| Initial canonical | F1 (L15 capstone) | ✓ | 25-question capstone confirmed; Q12 fix verified at M20 |
| Initial canonical | F2 (ANSI O5.1) | ✓ | `[confirm edition]` marker in L05 key_term — appropriate given edition uncertainty |
| Initial canonical | F3 (FHWA 14ft) | ✓ | Both 14 ft (maintained) and 16 ft (new construction) now present with citations — technically correct |
| Initial canonical | F5 (T01.L02 span/attachment) | ✓ | Verified via vocabulary_assumed in L07, L10 |
| Post-fix RT | F-RT-2 (L15 sanityCheck math) | ✓ | Post-patch RT-B M15 derivation: H=640, s_nowind=2.188 ft, w_wind=0.510, w_comb=0.5818, s_wind=4.545, margin=+3.955 — VERIFIED |
| Post-fix RT | F-RT-3 (L15 Q18 answer) | ✓ | Post-patch RT-B M20: w_comb=√(0.966²+0.607²)=1.1409 — matches choice C |
| Patch Wave 2 | PW2-D (L07 10 Flashcard cards) | ✓ | RT-A confirmed 10 cards via grep — VERIFIED |
| Patch Wave 2 | PW2-Q12 (choice A = +5.05 ft) | ✓ | M20: exact = +5.050 ft; RT-A confirms answerIndex 0 at lines 299–306 |
| Polish | NB-2 conservative-approximation label | ✓ | L02 lines 364–373 and L15 line 111 — labels present and technically correct |

---

## 6. Final Verdict: YELLOW

**Math accuracy: CLEAN.** 22 of 22 numeric claims independently re-derived and verified. Zero discrepancies. The prior dominant technical issue (Q12 label "+4.57 ft") is CONFIRMED FIXED: choice A now reads "+5.05 ft" and matches the exact derivation.

**Cross-standard consistency: CLEAN.** No conflicts between NESC, TIA-758, RUS 1751F-630, ITU-T G.984, FCC OTMR, or ASCE 7.

**Polish-stage fixes: ALL VERIFIED.** FHWA 14/16 ft distinction technically correct. Conservative-approximation label technically correct (with LOW qualifier below). GPON 17–17.5 dB technically sound.

**Remaining issues preventing GREEN:**

1. **NEW-A (LOW — CONCUR):** T05.L10 missing `suspension clamp` Flashcard card. Directive 18z violation. Single-card fix.
2. **NEW-B-1 (LOW — CONCUR):** T07.L04 `clearance → T05.L02` should be `T01.L02` (consistent with established PW2-C pattern).
3. **NEW-B-2 (LOW — CONCUR):** T07.L04 `attachment point → T05.L02` — T05.L02 doesn't introduce this term; should be T01.L02.
4. **NEW-B-3 (LOW — CONCUR):** T07.L02 `pole locations from design → T05.L02` — incorrectly assigned pointer.
5. **GAP-A (LOW — NEW from RT-B):** "slightly larger" qualifier on combined-load conservatism label is imprecise for Light district wind-dominant case. Recommend changing "slightly larger" to "conservatively larger." Does not affect safety guidance.

**All 5 issues are LOW. No MED or HIGH. Content is technically sound, math is accurate, no cross-standard conflicts. T05 content quality is high — only metadata precision and one word-choice issue remain.**

**Saturation recommendation:** The 5 remaining LOWs are all fix-class with no content rewrite needed (4 metadata pointer corrections + 1 two-word change). If these are fixed in a single patch commit and verified by one lightweight read-only check, T05 can achieve GREEN. No further full RT wave needed — a single targeted spot-check of the 5 fix locations is sufficient.

=== T05 FINAL-VERIFY RT B TECHNICAL END ===
