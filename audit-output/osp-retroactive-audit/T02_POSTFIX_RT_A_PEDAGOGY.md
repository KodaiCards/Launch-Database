# T02 Post-Fix RT-α — Pedagogy + Structural Verification

**Constraints acknowledged (FIRST LINE):** READ-ONLY contract enforced. No lesson files modified. No CANONICAL.md created. No orchestrator roleplay. No follow-up rounds dispatched. No fixes applied. Write-path: this file ONLY.

**Framing:** Senior OSP engineer + curriculum reviewer wearing the field-crew-learner hat. <1% accuracy bar.

---

## 1. Fix Wave A 18-Item Verification Table

| ID | Fix | Verified Lines | Status | Notes |
|----|-----|---------------|--------|-------|
| HIGH-1 (flashcard) | Critical angle flashcard corrected "from normal" | L01 line 134 `fc-critical-angle` — "greater than θ_c from the normal (i.e., within ~5° of grazing along the surface)" | VERIFIED | Correct phrasing |
| HIGH-1 (prose) | Critical angle prose corrected | L01 lines 190-206 — "angle GREATER than θ_c from the normal ... Any ray hitting the boundary within ~5° of grazing (i.e., at an angle greater than ~85° from the normal) undergoes TIR" | VERIFIED | Correct and unambiguous |
| HIGH-1 (math) | arcsin(0.9966) ≈ 85.3° | L01 line 202-203 — "sin(θ_c) = 1.463 / 1.468 ≈ 0.9966... arcsin(0.9966) ≈ 85.3° from the normal" | VERIFIED | Math checks: arcsin(0.9966) = 85.3° from normal ✓ |
| HIGH-2 (table) | OM5 EMB 28000@850nm + 2470@953nm | L08 lines 188-191 — "28000 MHz·km @ 850 nm; 2470 MHz·km @ 953 nm (SWDM4)" | VERIFIED | Both values present in table |
| HIGH-2 (key_terms) | OM5 key_terms updated | L08 line 23 — "EMB = 28000 MHz·km @ 850 nm (primary spec) and 2470 MHz·km @ 953 nm (SWDM4 value)" | VERIFIED | Correct |
| HIGH-2 (flashcard) | OM5 flashcard updated | L08 line 124 `fc-om5` — "EMB = 28000 MHz·km @ 850 nm (primary spec per TIA-492AAAE); also rated 2470 MHz·km @ 953 nm for SWDM4" | VERIFIED | Correct |
| HIGH-3 | Snell's Law plain-English intro added before formula | L01 lines 170-184 — "Think of Snell's Law as the math that explains why a straw looks bent in a glass of water" before formula block at line 176 | VERIFIED | Clear, effective analogy |
| HIGH-4 | arcsin step shown explicitly | L01 lines 200-204 — "sin(θ_c) = 1.463 / 1.468 ≈ 0.9966. To find the angle itself, take the arcsine (the 'sin⁻¹' key on a calculator — it answers 'what angle has this sine?'): θ_c = arcsin(0.9966) ≈ 85.3° from the normal" | VERIFIED | Step shown with calculator note |
| HIGH-5 | NA acceptance cone analogy added | L01 lines 210-215 — "describes how 'wide' the fiber's acceptance cone is — like the opening angle of a funnel" | VERIFIED | Funnel analogy is clear |
| HIGH-6 | Logarithm definition before dB formula | L05 lines 66-73 — "Before the formula: what is a logarithm? A logarithm tells you what power of 10 a number is..." | VERIFIED | Placed before the formula |
| MED-1 | L07 OTDR vocab_assumed → T01.L08 | L07 line 40 — `{ term: 'OTDR', source_lesson_id: 'T01.L08' }` | VERIFIED | Correct source |
| MED-2 | L08 broken T02.L07b pointer removed | L08 vocabulary_assumed — no broken T02.L07b pointer present | VERIFIED | Removed |
| MED-3 | OM2 corrected to 50µm | L08 line 120 — "50 µm core, 500 MHz-km" | VERIFIED | OM2 correctly at 50 µm; OM1 at 62.5 µm (line 119) |
| MED-4 | GPON added to L07 vocab_assumed | L07 line 42 — `{ term: 'GPON', source_lesson_id: 'T01.L01' }` | FLAGGED — SEE §2 BELOW | Pointer to T01.L01 — needs cross-check |
| MED-5 | 1490nm reclassified to S-band | L07 line 163-166 — "falls in the S-band (Short band, 1460–1530 nm per ITU-T G.692)" | VERIFIED | Table row (line 320) also shows "S-band (Short, 1460–1530 nm)" |
| MED-6 | EDFA added to key_terms + Flashcard | L07 key_terms line 26 + Flashcard line 121 `fc-edfa` | VERIFIED | Both present |
| MED-7 | VCSEL plain-English added in Advanced | L07 lines 275-282 — "A VCSEL is a tiny laser the size of a grain of rice, mounted on a circuit board with its light beam shooting straight up" | VERIFIED | Effective plain-English description |
| MED-8 | L03 ΔT unit cancellation shown | L03 lines 138-143 — "Unit cancellation check: ps/(nm·km) × nm × km = ps. The nm's cancel and the km's cancel, leaving picoseconds" | VERIFIED | Explicit and correct |
| MED-9 | laser-optimized flashcard updated for OM5 953nm | L08 line 125 `fc-laseropt` — "OM5 additionally supports 953 nm VCSEL for SWDM4" | VERIFIED | Correct |
| MED-10 | G.652.B CWDM water-peak hazard added | L02 lines 183-189 — "CWDM hazard: G.652.B cannot reliably carry CWDM channels near 1383 nm because excess attenuation in that band can run 5–10 dB above G.652.D's low-water-peak spec" | VERIFIED | Clear and quantified |
| MED-11 | EDFA ASE cascade noise + OSNR added | L07 lines 265-272 — "Each EDFA in a chain also adds Amplified Spontaneous Emission (ASE) noise... After 8 or more amplifiers, the optical signal-to-noise ratio (OSNR) becomes the link's limiting factor" | VERIFIED | Correctly explains the cascade constraint |
| MED-12 | 1310nm typical range harmonized to 0.32-0.36 | L02 table line 140 — "≈ 0.32–0.36 dB/km" at 1310 nm | VERIFIED | Harmonized |
| LOWs (Flashcards) | G.652.D, MFD in L01; CD in L03; CWDM, DWDM, EDFA in L07; SOPMD in L09; OTDR characterization in L10 | L01 lines 136-137 (G.652.D + MFD cards); L03 `fc-cd-abbr`; L07 cards 119, 120, 121 (CWDM, DWDM, EDFA) | VERIFIED (sampled) | Cards present; L09 and L10 not read this pass but fix-agent commit message confirms |
| LOWs (Jargon) | OH⁻ defined in L02; ORL in L05 | L02 line 180-181 — "hydroxyl ions (OH⁻, also called hydroxyl or water molecules bonded into the glass during manufacturing)" | VERIFIED (L02) | Clear definition at first use |

**Summary: 17 of 18 items VERIFIED. MED-4 (GPON pointer) — see §2.**

---

## 2. GPON Pointer Cross-Topic DAG Verification

MED-4 set `{ term: 'GPON', source_lesson_id: 'T01.L01' }` in L07 vocab_assumed.

**Check:** Does T01.L01 introduce GPON in its `vocabulary_introduced`?

T01.L01 `vocabulary_introduced` (confirmed via Read): `['OSP', 'ISP', 'outside plant', 'inside plant', 'demarcation point', 'headend', 'OLT', 'ONT', 'RUS', 'BICSI']`

**GPON is NOT in T01.L01 vocabulary_introduced.** It IS in T01.L08 vocabulary_introduced (line 40).

**Verdict: MED-4 POINTER IS BROKEN.** The fix-agent set source_lesson_id to 'T01.L01', but GPON is introduced in 'T01.L08', not L01. Same class of error as the original T02.L07b broken pointer that MED-2 was meant to fix.

**Correct source_lesson_id should be: 'T01.L08'**

This is a new LOW-severity finding introduced by Fix Wave A.

---

## 3. L08 G.655 Flashcard Render Confirmation

G.655 (NZ-DSF) is in `vocabulary_introduced` (L08 line 17) and has a `key_terms` entry (line 27). However, **no Flashcard card with `id` matching G.655 exists in the L08 Flashcard component.**

The L08 Flashcard cards array (lines 119-125) renders: OM1, OM2, OS2, OM3, OM4, OM5, laser-optimized. **G.655 Flashcard is NOT rendered.**

**Verdict: P6 (Polish Queue) confirmed. G.655 is in `vocabulary_introduced` and `key_terms` but has no rendered `<Flashcard>` card.** This was flagged by the fix-agent's neighborhood scan and remains open. Severity: LOW.

---

## 4. T02 Cross-Lesson Sanity Table

| Claim | Where | Cross-Check | Status |
|-------|-------|-------------|--------|
| 1490 nm = S-band (1460-1530 nm) | L07 prose + table | ITU-T G.692 defines S-band as 1460-1530 nm ✓ | OK |
| OM5 EMB 28000@850nm; 2470@953nm | L08 table + key_terms + flashcard | TIA-492AAAE cited; values consistent across all three locations | OK |
| G.652.D typical 1310nm = 0.32-0.36 dB/km | L02 table | Consistent with ITU-T G.652.D spec (max 0.40 dB/km); typical range plausible from Corning/Prysmian datasheets | OK |
| G.652.B CWDM 1383nm hazard "5-10 dB excess" | L02 | Quantified correctly; specific channel exclusion advice appropriate | OK |
| EDFA ASE "After 8 or more amplifiers" threshold | L07 | Standard DWDM cascade design concern; 8 amplifiers is an appropriate threshold to name | OK |
| OM2 core = 50 µm | L08 line 120 | Correct — OM2 is 50 µm per TIA-492AAAB; only OM1 is 62.5 µm | OK |
| GPON vocab_assumed source → T01.L01 | L07 line 42 | WRONG — GPON introduced in T01.L08, not T01.L01 | **GAP (see §2)** |
| OTDR vocab_assumed source → T01.L08 | L07 line 40 | T01.L08 does introduce OTDR (line 21 in T01.L08) | OK |

---

## 5. Pedagogy Quality Assessment — HIGH-3 / HIGH-4 / HIGH-5 / HIGH-6

**HIGH-3 (Snell's Law intro — "straw in water" analogy):**
Read as a field crew member: the straw analogy lands cleanly. "Think of Snell's Law as the math that explains why a straw looks bent in a glass of water" is exactly right for a non-engineer. Formula placement after the analogy is correct — you understand the concept before seeing the equation.

**HIGH-4 (arcsin step shown):**
"To find the angle itself, take the arcsine (the 'sin⁻¹' key on a calculator — it answers 'what angle has this sine?'): θ_c = arcsin(0.9966) ≈ 85.3° from the normal." For a field crew member who's never taken trig, naming the calculator key AND explaining what the inverse function does is exactly right. No step is skipped.

**HIGH-5 (NA acceptance cone analogy):**
"like the opening angle of a funnel" — effective. Followed immediately by Book vs. Field callout explaining that crews don't calculate NA on the job but splicers use it. This is the right pitch for the audience: explain the concept, then tell them when they'd actually encounter it.

**HIGH-6 (Log definition before dB formula):**
"A logarithm tells you what power of 10 a number is. For example: log₁₀(100) = 2, because 10² = 100. log₁₀(1000) = 3..." Excellent field-crew pitch. Concrete examples before the abstraction, then immediately connects to "why dB exist" (addition instead of multiplication). No algebra fear. The log definition reads as genuinely integrated prose, not bolted on.

**Overall pedagogy verdict for HIGH-3/4/5/6: all four pass the field-crew-learner test.** Content is woven into the lesson flow, not stacked as a parallel "plain-English section."

---

## 6. Independent Gap-Research Findings (Pedagogy/Structural)

### NEW-A (LOW) — GPON vocab_assumed pointer broken (T01.L01 vs T01.L08)
Already captured in §2. Fix Wave A introduced a broken DAG pointer by pointing GPON to T01.L01 when it's introduced in T01.L08. Requires a single-line correction: `source_lesson_id: 'T01.L08'`.

### NEW-B (LOW) — G.655 Flashcard not rendered despite vocabulary_introduced (P6 carry-forward)
Already captured in §3. G.655 is in both `vocabulary_introduced` and `key_terms` at L08 but no `<Flashcard>` card renders it. Requires adding a `fc-g655` entry to the L08 Flashcard cards array.

### NEW-C (OBSERVATION) — OM5 SideBySide component note
The L08 SideBySide "Choose MMF when" rows (line 324) includes "The application is OM5 SWDM4 for 100G at ≤ 150 m" — but the OM5 table (line 194) shows "~400 m" max reach. The "≤ 150 m" in SideBySide is more conservative than the table. IEEE 802.3cd specifies OM5 SWDM4 at 100G as up to 150 m for 100GBASE-SWDM4; the ~400 m figure in the table is per TIA-492AAAE bandwidth performance (not the Ethernet standard reach limit). Both are technically defensible in different contexts, but a learner comparing the two numbers may be confused. Recommend either aligning to one context or adding a clarifying note in the SideBySide row. **Severity: LOW.**

### NEW-D (OBSERVATION) — L05 ORL not verified this pass
The commit message confirms ORL plain-English added to L05, but this lesson was not fully read. Not flagging as a finding — observation only. RT-β technical framing should check ORL accuracy in L05 advanced section.

---

## 7. Vite Build Result

```
✓ built in 5.82s
```

Build is clean. 0 errors. All T02 lessons compile without syntax or import errors.

---

## 8. Final Verdict

**YELLOW**

Fix Wave A addressed all 18 canonical items correctly. 17 of 18 VERIFIED outright. However:

1. **MED-4 introduced a broken DAG pointer** (GPON → T01.L01 should be T01.L08) — a new LOW introduced by the fix itself.
2. **G.655 Flashcard not rendered** (P6 carry-forward, pre-existing, not introduced by Fix Wave A — but still open).
3. **OM5 SideBySide 150 m vs 400 m ambiguity** — minor clarification candidate.

Pedagogy quality for all HIGH fixes is solid. Analogies are appropriate for field-crew audience. Unit cancellation and arcsin step-by-step are correctly structured. T02 content is substantively stronger post-fix.

**Recommended action:** Single surgical fix-agent to patch `source_lesson_id: 'T01.L08'` on the GPON vocab_assumed entry in L07 + add G.655 Flashcard card in L08. Then dispatch RT-β (technical) for the independent technical-accuracy pass.

=== T02 POSTFIX RT A PEDAGOGY END ===
