# T21 FINAL-VERIFY RT-A (HAIKU)

Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T21_FINALVERIFY_RTA_HAIKU.md` written.

## Verdict

**RED** — T21 failed final-verify due to **CRITICAL math error in L02 Q2 that contradicts the prompt's own physics claim.**

## Per-Lesson Quiz Schema Verification

**Schema Compliance Check (validate-lesson-schema.js):**
- L01–L10: 10/10 PASS
- All quizzes use unified type: 'mc' + prompt + options array + answerIndex numeric
- No old `correct: 'c'` string patterns detected
- No free-text / open-ended items

## L02 Q2 Math Verification — CRITICAL FINDING

**Question prompt:** "At 1550 nm, single-mode fiber exhibits attenuation of ~0.18 dB/km. Over a 10 km span, approximately what percentage of power remains?"

**Options:**
- a) 64%
- b) 75%
- c) 84% ← Currently marked as correct
- d) 96%

**Independent derivation:**
- Attenuation = 0.18 dB/km × 10 km = 1.8 dB total loss
- Power transmitted = 10^(-loss_dB/10) = 10^(-1.8/10) = 10^(-0.18) = 0.6607 ≈ **66%**
- Correct answer should be **'a' 64%** (close approximation within 2%)

**Reverse-check on marked answer 'c' 84%:**
- If 84% remains: 10^(-loss/10) = 0.84 → loss = -10 × log₁₀(0.84) ≈ 0.75 dB total
- Required attenuation: 0.75 dB / 10 km = 0.075 dB/km
- This contradicts the prompt's claim of 0.18 dB/km by 2.4×

**Status:** The lesson's foundational prose at line 119 correctly teaches "Over 10 km, SMF retains ~84%"—but that statement refers to the **1 km case** (10^(-0.18) ≈ 0.96 = 96% at 1 km; 96%^10 ≈ 83.6% ≈ 84% after cascading). The Q2 quiz prompt explicitly states "Over a 10 km span" but the quiz answer key conflates the cumulative retention (84% over 10 km at different attenuation) with the direct calculation (66% at 0.18 dB/km × 10 km).

## Build + Schema Verification

**Vite build result:** ✓ Clean (13.15s, no errors)

**schema.json validation:** ✓ All 10 lessons pass schema strictness

**AI references:** ✓ Grep negative — no mentions of Claude, AI, LLM, language model, generated content

**Flashcard rendering:** ✓ L01–L08: each has ≥1 Flashcard component; L09 & L10 intentionally empty (vocabulary_introduced = [])

## Cascade Pattern Scan

Checked `audit-output/known-cascade-patterns.md` for T21-specific recurrence:
- **P-Math-Mismatch:** L02 Q2 identified above — first occurrence in T21
- **P-Citation-Pinning:** No IEC/IEEE/TIA hardcoded edition conflicts found
- **P-DAG-Pointers:** Spot-checked 5 vocabulary_assumed entries → all point to correct source_lesson_id

## Closeout

**git log -3 --oneline:**
```
33a06d4 C04 RT-A: Schema + Vite + question integrity verification (70 Q, not 100; Q13 math/Q69 physics errors flagged)
4e60120 C04 RT-B: Math + answer integrity verification (BICSI OSP Designer mock exam) — 2 HIGH findings flagged
849e6cc T22 FINAL-VERIFY RT-B: CFOT blueprint alignment + answer accuracy VERIFIED GREEN
```

**git diff --stat origin/main..HEAD:**
```
(no commits authored by this agent — read-only verification only)
```

**Summary:**
- Quiz schema unification: **PASS** (all lessons use numeric answerIndex)
- L02 Q2 math fix claimed in commit a3174ca: **FAIL** — answer key still contradicts the physics
- Build clean: **PASS**
- Free-text items: **PASS** (none found)
- Flashcards present where vocabulary_introduced is non-empty: **PASS**
- AI references: **PASS** (none found)

T21 must remain RED until the L02 Q2 answer is corrected to 'a' (64%). The cleanup commit a3174ca claimed to unify quiz schema but did NOT address this math bug; it survived all post-author RT verification + that cleanup pass.

=== T21 FINALVERIFY RT-A HAIKU END ===
