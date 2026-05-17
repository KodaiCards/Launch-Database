# T14 Final-Verify-2 RT-ζ — Technical / Numeric / Cascade-Defense Framing
**HEAD at start of run:** `2a6259e`  
**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/T14_FINALVERIFY_2_RT_Z_TECHNICAL.md` written.  
**Role:** READ-ONLY final-verify. No lesson file edits.  
**Framing:** Technical accuracy / numeric re-derivation / cascade-defense  
**Wave:** post-Polish-D, pair-mate to RT-ε `2a6259e` (pedagogy, GREEN)  
**Registry-first:** §8 duplicate-verification skip applied — RT-ε already verified IEEE 81-2012 §9.3/§9.4 distinction in this wave. I trust RT-ε for those items and cover NEW surfaces.

---

## 1. Polish-D Fix Technical Verification

### Fix 1 — L08 floating messenger self-referential vocabulary_assumed removed

**Verified by reading:** `osp-training/src/lessons/T14/L08.stray-voltage-detection.jsx:49-60`

`vocabulary_assumed` does NOT contain `{ term: 'floating messenger', source_lesson_id: 'T14.L08' }`. Term `floating messenger` appears only in `vocabulary_introduced` (line 19). Fix is technically correct — a term cannot be both introduced and assumed in the same lesson. **VERIFIED. ✓**

### Fix 2 — L12 Q17 source tag §9.4 → §9.3

**Verified by reading:** `osp-training/src/lessons/T14/L12.capstone-quiz.jsx:310`

Explanation now reads: `(Source: IEEE 81-2012 §9.3. T14.L06.)` — consistent with Q17 body (clamp-on invalid for single-rod acceptance, fall-of-potential per §9.3 required). Per RT-ε duplicate-verification skip, I trust RT-ε's §9.3 = fall-of-potential / §9.4 = clamp-on confirmation from L06 cross-check. **VERIFIED. ✓**

---

## 2. Technical Under-Audited Surface Sweep

Rotated to **L12 Q10** (variation arithmetic), **L06 quiz math**, **L09 chemistry**, and **L05 schema** — none touched in the last 3 polish stages.

### FINDING T14-ζ-1 (MED) — L12 Q10 arithmetic error in explanation

**Verified by reading:** `osp-training/src/lessons/T14/L12.capstone-quiz.jsx:208-219`

```js
text: 'You take a fall-of-potential reading and move the potential probe ±4 ft
       (±10% of probe spacing). Readings are 18.1 Ω, 18.0 Ω, 18.2 Ω. What does this mean?',
...
explanation: 'Variation of ±0.1 Ω on an 18 Ω reading = ±0.6% — well within the ±2%
              IEEE 81 validation criterion...'
```

**Independent re-derivation:**
- Three readings stated: 18.1, 18.0, 18.2 Ω
- Maximum deviation from base (18.0): |18.2 − 18.0| = **0.2 Ω** (not 0.1 Ω)
- Correct percentage: 0.2 / 18.0 × 100 = **1.11%**
- Explanation claims: "±0.1 Ω = ±0.6%" — wrong on both the absolute deviation and the percentage

**Comparison with L06 Q3** (same scenario structure):  
`osp-training/src/lessons/T14/L06.ground-resistance-testing.jsx:336-346`  
L06 Q3 uses readings 18.2 and 17.8, correctly states "variation of about ±1.1%." L12 Q10 uses 18.1/18.0/18.2 but states ±0.6% — arithmetic is inconsistent with L06's correct treatment of the same setup.

**Verdict:** MED — stated arithmetic (±0.1 Ω, ±0.6%) does not match the question's own data (max deviation = 0.2 Ω = 1.11%). The conclusion (within 2% threshold, test valid) is correct, but the supporting arithmetic is wrong. A learner checking the numbers will get the wrong answer for ±deviation.

**Fix shape:** L12 Q10 explanation should read: "Variation of ±0.2 Ω on an 18 Ω reading = ±1.1% — well within the ±2% IEEE 81 validation criterion..."

---

## 3. L06 Math Verification (remaining quiz questions)

**Verified by reading:** `T14/L06.ground-resistance-testing.jsx:310-361`

- **Q1:** Current probe = 5 × 8 ft = 40 ft. **Re-derived: 5 × 8 = 40. ✓**
- **Q2:** Potential probe = 62% × 40 ft = 24.8 ft. **Re-derived: 0.62 × 40 = 24.8. ✓**
- **Q3:** Readings 18.2, 17.8 from base 18.0 → max deviation = 0.2/18.0 × 100 = ±1.1%. Explanation correctly states "about ±1.1%." **✓**
- **Q4:** Clamp-on on new single rod per §9.4 = invalid. FDH site: 12 Ω > GR-1275 5 Ω = FAIL. Both claims correct. **✓**

---

## 4. L09 Chemistry Verification

**Verified by reading:** `T14/L09.cathodic-protection-basics.jsx:28-60, 177-196`

- **Anode definition:** "undergoes oxidation — loses electrons and dissolves (corrodes)" — **correct electrochemistry.** ✓
- **Cathode definition:** "undergoes reduction — gains electrons and is protected from corrosion" — **correct.** ✓
- **Sacrificial anode materials:** zinc, magnesium, or aluminum — all are more reactive (anodic) than steel in the galvanic series. **Correct.** ✓
- **Cathodic protection direction:** electrons flow from sacrificial anode to protected structure (cathode). "Anode's natural reactivity drives the electrochemical process." **Correct.** ✓
- **Galvanic cell description (lines 143-153):** communications galvanized steel conduit becomes the anode when it contacts gas utility's cathodically-protected system — "your conduit corrodes to protect their main." **Correct field application.** ✓

No chemistry errors found in L09.

---

## 5. L11 NESC Arithmetic Verification (under-audited surface)

**Verified by reading:** `T14/L11.nesc-grounds-per-mile.jsx:155-179, 258-268`

**WorkedExample formula logic:**
```js
const routeFt = v.route_miles * 5280;
const controllingInterval = Math.min(v.nesc_interval_ft, v.rus_interval_ft);
return Math.ceil(routeFt / controllingInterval);
```

Independent re-derivation:
- Default inputs: 5 miles, NESC 1320 ft, RUS 1000 ft → controlling = 1000 ft
- 5 × 5280 = 26,400 ft; 26,400 / 1000 = 26.4 → ceil = **27** electrodes
- Formula is correct: `Math.ceil(routeFt / controllingInterval)` ✓

**L11 Q3 (quiz with 5-mile, 1320-ft scenario):**
- 5 × 5280 = 26,400 ft; 26,400 / 1320 = **exactly 20.0** → `Math.ceil(20.0) = 20` ✓
- Stated answer 20 is correct ✓

**L12 Q16 (quiz: 3-mile, 1320-ft):**
- 3 × 5280 = 15,840 ft; 15,840 / 1320 = **exactly 12.0** → correct: 12
- Explanation states "exactly 12 electrodes minimum" ✓

All NESC arithmetic verified correct.

---

## 6. L05 Schema Integrity (under-audited)

**Verified by reading:** `T14/L05.ibt-and-ges.jsx:17-62`

**Finding T14-ζ-2 (LOW):** `vocabulary_introduced` lists: `['PBB', 'SBB', 'bonding conductor']`. `key_terms` contains 5 entries: IBT, GES, PBB, SBB, bonding conductor. **IBT and GES appear in `key_terms` (with full flashcard definitions) but are in `vocabulary_assumed` (pointing to `T01.L08`), NOT in `vocabulary_introduced`.**

Per lesson schema spec (CLAUDE.md): "key_terms named export AND render `<Flashcard>` for every term in `vocabulary_introduced`. Definition pulled verbatim from the lesson's prose." The reverse condition — terms in key_terms but NOT in vocabulary_introduced — is inconsistent with the spec. The assumed pointers (`IBT → T01.L08`, `GES → T01.L08`) are correct; IBT and GES are genuinely introduced in T01, not T14. The extra flashcard definitions are supplementary review, not harmful to learners, but they imply L05 is re-introducing terms it says are already assumed.

**Severity: LOW** — No wrong information; definitions are accurate and the correct assumed-pointers are maintained. The inconsistency is schema/DAG integrity, not content accuracy. Learner impact: minimal (extra flashcards = more review).

---

## 7. Negative Findings (confirmed clean under technical framing)

- **L06 probe-spacing math:** Q1/Q2/Q3 all independently verified correct ✓
- **L11 WorkedExample formula:** `Math.ceil(routeFt / controllingInterval)` is correct rounding ✓
- **L11 Q3 math:** 26,400 / 1320 = 20.0 ✓
- **L12 Q16 math:** 15,840 / 1320 = 12.0 ✓
- **L09 anode/cathode polarity:** correct for galvanic series + sacrificial anode operation ✓
- **L12 Q17 body (technical):** "clamp-on measures series impedance of measurement circuit" — technically accurate description of loop impedance measurement on single rod with no parallel paths ✓
- **Polish-D Fix 1 + Fix 2:** both verified correct ✓
- **Vite build:** clean (`✓ built in 6.38s`) ✓
- **Schema validator:** 12/12 PASS ✓

---

## 8. New Findings Table

| # | Severity | File | Lines | Issue | Fix shape |
|---|---|---|---|---|---|
| T14-ζ-1 | MED | L12.capstone-quiz.jsx | 219 | Q10 explanation states "±0.1 Ω = ±0.6%" but readings are 18.1/18.0/18.2 → max deviation = 0.2 Ω = 1.11% | Change "±0.1 Ω" → "±0.2 Ω" and "±0.6%" → "±1.1%" |
| T14-ζ-2 | LOW | L05.ibt-and-ges.jsx | 24-32 | IBT + GES in key_terms but not in vocabulary_introduced (they are in vocabulary_assumed → T01.L08) — schema inconsistency | Either add IBT + GES to vocabulary_introduced (and remove from vocabulary_assumed), OR remove IBT/GES from key_terms and keep in vocabulary_assumed only. Recommended: remove from key_terms since T01.L08 is the authoritative first-intro. |

---

## 9. Saturation Assessment

RT-ε (pedagogy) returned GREEN with zero new findings under pedagogy framing. RT-ζ (technical) found 1 MED arithmetic error (L12 Q10 ±0.1 vs ±0.2 Ω) and 1 LOW schema inconsistency (L05 IBT/GES in key_terms vs vocabulary_assumed). The MED is real, independently re-derived, and warrants a targeted polish. LOW is schema-integrity only — content is accurate.

**Verdict: YELLOW** — 1 MED arithmetic error in L12 Q10 explanation requires a surgical fix before saturation is achievable. 1 LOW schema inconsistency.

**Saturation hint to next round:** After MED fix, final-verify should confirm: (a) L12 Q10 explanation arithmetic matches question's stated readings (18.1/18.0/18.2 → max 0.2 Ω → 1.11%); (b) consistency with L06 Q3's "±1.1%" for similar scenario; (c) L05 schema consistency decision implemented.

=== T14 FINAL-VERIFY-2 RT-ζ TECHNICAL REPORT END ===
